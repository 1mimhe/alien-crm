/**
 * ====================================================================
 * Local Iran CRM Cartable Auto-Sync & Prioritization Engine
 * ====================================================================
 * Connects directly to CRM API bypassing overseas VPN/TUN tunnels,
 * auto-refreshes auth tokens, prioritizes calls with date urgency,
 * hosts the local Persian sales dashboard and syncs with Google Sheets.
 * ====================================================================
 */

import https from "https";
import http from "http";
import os from "os";
import { prioritizeCalls } from "./src/prioritizer.js";
import { renderDashboardHtml } from "./src/dashboard.js";
import { defaultCartableData } from "./src/default-data.js";
import { syncToGoogleSheetWebhook } from "./src/sheets.js";

// ====================================================================
// ⚙️ Configuration & Environment Variables
// ====================================================================

// Google Sheet Webhook URL (from Extensions > Apps Script in Google Sheets) - Optional
const GOOGLE_SHEET_WEBHOOK_URL =
  process.env.GOOGLE_SHEET_WEBHOOK_URL || "";

// Local Web Dashboard Port
const LOCAL_DASHBOARD_PORT = process.env.PORT || 3000;

// CRM Credentials
const CRM_USERNAME = process.env.CRM_USERNAME || "09114495579";
const CRM_PASSWORD = process.env.CRM_PASSWORD || "a2260334911";

// Bearer Token (auto-refreshed upon expiration via credentials)
let BEARER_TOKEN =
  process.env.CRM_BEARER_TOKEN ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXM0ZXNzZXEwMXF4MTFneno3enZ6bGZ3IiwidXNlcm5hbWUiOiIwOTExNDQ5NTU3OSIsInJvbGUiOiJFWFBFUlQiLCJ0ZWFtSWQiOiJjbXMyMGF3NHMwbDJnamtzZXJqbGw3a2VlIiwicmFua0lkIjoiY21yM3pxcHpvMDAwMzEya2Vybzd1YjIzaiIsImlhdCI6MTc4ODUyNjg0NSwiZXhwIjoxNzg4NTcwMDQ1fQ.lXWDKF2rjCnEZOcoPJSH4LUqF4e--lwJb7FJ2c71vH4";

// System URLs
const CRM_CARTABLE_URL = "https://panel.hooshacrm.ir/api/my/cartable";
const CRM_LOGIN_URL = "https://panel.hooshacrm.ir/api/auth/login";

// Auto-Sync Interval (minutes) - Every 10 minutes
const INTERVAL_MINUTES = 10;

// In-memory call cache for the dashboard
let latestCalls = prioritizeCalls(defaultCartableData);
let latestStats = computeStats(latestCalls);

// Active SSE client connections for real-time live push to open browser tabs
const sseClients = new Set();

function broadcastUpdate() {
  const payload = `data: ${JSON.stringify({ type: "SYNC_COMPLETE", timestamp: Date.now(), total: latestStats.total })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (err) {
      sseClients.delete(client);
    }
  }
}

// ====================================================================
// 🌐 Network Auto-Detection: Bypass Singbox/VPN/TUN Tunnels
// ====================================================================

function getPhysicalLocalAddress() {
  if (process.env.LOCAL_IP) return process.env.LOCAL_IP;

  const interfaces = os.networkInterfaces();
  for (const [name, addrs] of Object.entries(interfaces)) {
    const lower = name.toLowerCase();
    if (
      lower.includes("singbox") ||
      lower.includes("tun") ||
      lower.includes("tap") ||
      lower.includes("vpn") ||
      lower.includes("vethernet") ||
      lower.includes("vmnet") ||
      lower.includes("wsl") ||
      lower.includes("loopback")
    ) {
      continue;
    }
    for (const addr of addrs) {
      if (
        addr.family === "IPv4" &&
        !addr.internal &&
        !addr.address.startsWith("169.254.") &&
        !addr.address.startsWith("127.")
      ) {
        return addr.address;
      }
    }
  }
  return undefined;
}

const directPhysicalIp = getPhysicalLocalAddress();
if (directPhysicalIp) {
  console.log(`[NETWORK] Direct local interface bound: ${directPhysicalIp} (Bypassing VPN/TUN)`);
}

/**
 * Direct HTTPS request bound to local physical network interface
 */
function crmRequest(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(urlStr);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || "GET",
      headers: options.headers || {},
      localAddress: directPhysicalIp,
      timeout: 15000,
    };

    const client = parsedUrl.protocol === "https:" ? https : http;
    const req = client.request(reqOptions, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          text: async () => body,
          json: async () => JSON.parse(body),
        });
      });
    });

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy(new Error("CRM request timed out after 15s."));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// ====================================================================
// 🔐 Auth Management & Auto-Login
// ====================================================================

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
    if (payload.exp) {
      return Date.now() >= (payload.exp - 120) * 1000;
    }
  } catch (e) {
    return false;
  }
  return false;
}

async function loginAndGetToken() {
  if (!CRM_PASSWORD) {
    throw new Error("CRM_PASSWORD is not set. Please provide password in sync-local.js.");
  }

  console.log(`[AUTH] Initiating automatic login for ${CRM_USERNAME}...`);

  const payloadStr = JSON.stringify({
    username: CRM_USERNAME,
    password: CRM_PASSWORD,
    phone: CRM_USERNAME,
  });

  const res = await crmRequest(CRM_LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payloadStr),
      Accept: "application/json",
      "User-Agent": "CrmCartablePrioritizer/1.0",
    },
    body: payloadStr,
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`CRM login failed (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const token =
    data.token ||
    data.accessToken ||
    data.access_token ||
    (data.data && (data.data.token || data.data.accessToken));

  if (!token) {
    throw new Error("Login succeeded but no access token was returned.");
  }

  console.log("[AUTH] Login successful! New access token acquired.");
  BEARER_TOKEN = token;
  return token;
}

async function ensureValidToken() {
  if (!BEARER_TOKEN || isTokenExpired(BEARER_TOKEN)) {
    if (CRM_PASSWORD) {
      console.log("[AUTH] Token expired or missing. Auto-renewing session...");
      return await loginAndGetToken();
    }
  }
  return BEARER_TOKEN;
}

// ====================================================================
// 🔄 Core Synchronization Task
// ====================================================================

async function doSync() {
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  console.log(`\n[SYNC] [${timestamp}] Fetching cartable leads from CRM server...`);

  try {
    let token = await ensureValidToken();

    // 1. Fetch live cartable from CRM
    let crmRes = await crmRequest(CRM_CARTABLE_URL, {
      method: "GET",
      headers: {
        Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        Accept: "application/json",
        "User-Agent": "CrmCartablePrioritizer/1.0",
      },
    });

    // If 401 Unauthorized, retry once with fresh login
    if ((crmRes.status === 401 || crmRes.status === 403) && CRM_PASSWORD) {
      console.warn("[WARN] 401 Unauthorized received. Re-authenticating...");
      token = await loginAndGetToken();
      crmRes = await crmRequest(CRM_CARTABLE_URL, {
        method: "GET",
        headers: {
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
          Accept: "application/json",
          "User-Agent": "CrmCartablePrioritizer/1.0",
        },
      });
    }

    if (!crmRes.ok) {
      const errBody = await crmRes.text();
      throw new Error(`CRM fetch failed with status ${crmRes.status}: ${errBody}`);
    }

    const cartableData = await crmRes.json();
    console.log("[SUCCESS] Cartable leads fetched successfully from CRM.");

    // 2. Update in-memory prioritized leads with date urgency
    latestCalls = prioritizeCalls(cartableData);
    latestStats = computeStats(latestCalls);

    // 3. Optional: Sync directly to Google Sheets if configured
    if (GOOGLE_SHEET_WEBHOOK_URL) {
      try {
        console.log("[SHEETS] Syncing leads directly to Google Sheets...");
        await syncToGoogleSheetWebhook(GOOGLE_SHEET_WEBHOOK_URL, latestCalls);
        console.log("[SHEETS] Data successfully synced and styled in Google Sheets.");
      } catch (sheetErr) {
        console.warn("[WARN] Google Sheets sync error:", sheetErr.message);
      }
    } else {
      // Clean note if no sheets webhook set
    }

    // 4. Broadcast live update to all open browser tabs
    broadcastUpdate();

    console.log(`[DONE] Local CRM synchronization completed successfully!`);
    console.log(`[METRICS] Total: ${latestStats.total} leads in priority queue:`);
    console.log(`   - 📅 Today Time Sets:     ${latestStats.todayTimeSet}`);
    console.log(`   - 🚨 Overdue Time Sets:   ${latestStats.overdueTimeSet}`);
    console.log(`   - ⏰ Total Time Sets:     ${latestStats.timeSet}`);
    console.log(`   - ⚡️ Today New Leads:     ${latestStats.todayLead}`);
    console.log(`   - 🔴 Critical P1 Total:   ${latestStats.p1}`);
    console.log(`   - 🟠 Hot Deals P2:        ${latestStats.p2}`);
    console.log(`   - 🔵 Fresh Inbounds P3:   ${latestStats.p3}`);
    console.log(`   - 🟢 Warm Follow-up P4:   ${latestStats.p4}`);
    console.log(`   - ⚪️ Cold Follow-up P5:   ${latestStats.p5}`);
    console.log(`[DASHBOARD] Local dashboard active at: http://localhost:${LOCAL_DASHBOARD_PORT}`);
    console.log(`[SCHEDULE] Next auto-sync in ${INTERVAL_MINUTES} minutes.`);
  } catch (error) {
    console.error("[ERROR] Synchronization failed:", error.message);
    if (error.cause) {
      console.error("[CAUSE]", error.cause);
    }
  }
}

function computeStats(calls) {
  return {
    total: calls.length,
    todayTimeSet: calls.filter((c) => c.isTodayTimeSet).length,
    overdueTimeSet: calls.filter((c) => c.isOverdueTimeSet).length,
    timeSet: calls.filter((c) => c.isTimeSet).length,
    todayLead: calls.filter((c) => c.isTodayLead).length,
    p1: calls.filter((c) => c.priorityCode === "P1").length,
    p2: calls.filter((c) => c.priorityCode === "P2").length,
    p3: calls.filter((c) => c.priorityCode === "P3").length,
    p4: calls.filter((c) => c.priorityCode === "P4").length,
    p5: calls.filter((c) => c.priorityCode === "P5").length,
  };
}

// ====================================================================
// 🌐 Built-in Local Sales Web Dashboard Server
// ====================================================================

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;

  if (pathname === "/" || pathname === "/dashboard") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderDashboardHtml(latestCalls, latestStats, {}));
  } else if (pathname === "/api/calls") {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(JSON.stringify({ success: true, stats: latestStats, calls: latestCalls }, null, 2));
  } else if (pathname === "/api/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    res.write("data: connected\n\n");
    sseClients.add(res);
    req.on("close", () => sseClients.delete(res));
  } else if (pathname === "/sync") {
    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        try {
          if (body && body.trim().startsWith("{")) {
            const customData = JSON.parse(body);
            latestCalls = prioritizeCalls(customData);
            latestStats = computeStats(latestCalls);
            console.log(`\n[PUSH] Direct JSON data pushed to dashboard! (${latestStats.total} leads prioritized)\n`);
            res.writeHead(200, {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            });
            return res.end(JSON.stringify({ success: true, message: "Data pushed successfully", stats: latestStats }));
          }
        } catch (parseErr) {
          console.error("[ERROR] Failed to parse custom JSON:", parseErr.message);
        }

        // Default to CRM sync if no custom JSON body
        try {
          await doSync();
          res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          });
          res.end(JSON.stringify({ success: true, stats: latestStats }));
        } catch (syncErr) {
          res.writeHead(500, {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          });
          res.end(JSON.stringify({ success: false, error: syncErr.message }));
        }
      });
    } else {
      doSync()
        .then(() => {
          res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          });
          res.end(JSON.stringify({ success: true, stats: latestStats }));
        })
        .catch((err) => {
          res.writeHead(500, {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          });
          res.end(JSON.stringify({ success: false, error: err.message }));
        });
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found (404)");
  }
});

server.listen(LOCAL_DASHBOARD_PORT, () => {
  console.log(`\n[DASHBOARD] Sales web dashboard running at:`);
  console.log(`   👉 http://localhost:${LOCAL_DASHBOARD_PORT}\n`);
});

// Initial execution
doSync();

// Periodic timer every 10 minutes
console.log(`[SCHEDULE] Auto-sync timer active: running every ${INTERVAL_MINUTES} minutes.`);
setInterval(doSync, INTERVAL_MINUTES * 60 * 1000);
