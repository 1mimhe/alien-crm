/**
 * Cloudflare Worker: CRM Cartable Call Prioritizer & Google Sheets Sync
 */

import { prioritizeCalls } from "./prioritizer.js";
import { syncToGoogleSheetWebhook, generateCsv } from "./sheets.js";
import { renderDashboardHtml } from "./dashboard.js";
import { getValidBearerToken, invalidateToken } from "./auth.js";
import { defaultCartableData } from "./default-data.js";

const DEFAULT_CRM_URL = "https://panel.hooshacrm.ir/api/my/cartable";

// In-memory module cache for latest cartable data received from sync or direct fetch
let latestSyncedCartable = null;

/**
 * Fetch cartable leads from CRM API with auto-retry and auto-login on 401
 */
async function fetchCartableData(env, tokenOverride = null) {
  try {
    const apiUrl = env.CRM_RELAY_URL || env.CRM_API_URL || env.HOOSHA_API_URL || DEFAULT_CRM_URL;
    let token = null;

    try {
      token = tokenOverride || (await getValidBearerToken(env, false));
    } catch (authInitErr) {
      console.warn("Auth token acquisition note:", authInitErr.message);
      if (latestSyncedCartable) return latestSyncedCartable;
      return defaultCartableData;
    }

    const doRequest = async (activeToken) => {
      return await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: activeToken.startsWith("Bearer ") ? activeToken : `Bearer ${activeToken}`,
          Accept: "application/json",
          "User-Agent": "CrmCartablePrioritizer/1.0",
        },
      });
    };

    let response;
    try {
      response = await doRequest(token);
    } catch (netErr) {
      console.warn(`CRM direct connection error (${netErr.message}). Using latest cached cartable data.`);
      if (latestSyncedCartable) return latestSyncedCartable;
      return defaultCartableData;
    }

    // If token is expired or unauthorized (401 / 403), trigger auto-login and retry
    if ((response.status === 401 || response.status === 403) && !tokenOverride) {
      console.warn("⚠️ CRM token expired (401/403). Initiating automatic login to renew token...");
      invalidateToken();

      try {
        const freshToken = await getValidBearerToken(env, true);
        console.log("✅ Acquired new token. Retrying cartable request...");
        response = await doRequest(freshToken);
      } catch (authError) {
        console.warn(`Auto-login failed: ${authError.message}. Using cached cartable data.`);
        if (latestSyncedCartable) return latestSyncedCartable;
        return defaultCartableData;
      }
    }

    if (!response.ok) {
      console.warn(`CRM server responded with ${response.status}. Using cached cartable data.`);
      if (latestSyncedCartable) return latestSyncedCartable;
      return defaultCartableData;
    }

    const freshData = await response.json();
    if (freshData && (freshData.notCalled || freshData.todayLeads || freshData.followUp)) {
      latestSyncedCartable = freshData;
      return freshData;
    }
  } catch (unexpectedErr) {
    console.warn("Unexpected cartable error:", unexpectedErr.message);
  }

  if (latestSyncedCartable) return latestSyncedCartable;
  return defaultCartableData;
}

/**
 * Compute statistics summary
 */
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

export default {
  /**
   * HTTP Request Handler
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    try {
      // Optional bearer token from request header or query param (?token=...)
      const authHeader = request.headers.get("Authorization");
      const queryToken = url.searchParams.get("token");
      const clientToken = queryToken || (authHeader && authHeader.replace(/^Bearer\s+/i, ""));

      // 1. Root: Interactive Web Dashboard
      if (path === "/" || path === "/dashboard") {
        let calls = [];
        let errorMsg = null;

        try {
          const rawData = await fetchCartableData(env, clientToken);
          calls = prioritizeCalls(rawData);
        } catch (e) {
          errorMsg = e.message;
          if (latestSyncedCartable || defaultCartableData) {
            calls = prioritizeCalls(latestSyncedCartable || defaultCartableData);
          }
        }

        if (calls.length === 0 && (latestSyncedCartable || defaultCartableData)) {
          calls = prioritizeCalls(latestSyncedCartable || defaultCartableData);
        }

        const stats = computeStats(calls);
        const html = renderDashboardHtml(calls, stats, { error: errorMsg });

        return new Response(html, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store",
          },
        });
      }

      // 2. API Endpoint: Returns JSON of prioritized calls (Supports GET or POST with raw json)
      if (path === "/api/calls") {
        let rawData = null;

        if (request.method === "POST") {
          try {
            const body = await request.json();
            if (body && (body.notCalled || body.timeSet || body.followUp || body.todayLeads)) {
              rawData = body;
            } else if (body && body.data) {
              rawData = body.data;
            }
          } catch (e) {}
        }

        if (!rawData) {
          rawData = await fetchCartableData(env, clientToken);
        }

        const calls = prioritizeCalls(rawData || defaultCartableData);
        const stats = computeStats(calls);

        return new Response(
          JSON.stringify(
            {
              success: true,
              updatedAt: new Date().toISOString(),
              stats,
              calls,
            },
            null,
            2
          ),
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      // 3. Export CSV with UTF-8 BOM
      if (path === "/export/csv") {
        const rawData = await fetchCartableData(env, clientToken);
        const calls = prioritizeCalls(rawData || defaultCartableData);
        const csv = generateCsv(calls);

        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": 'attachment; filename="crm-cartable-calls.csv"',
            "Cache-Control": "no-store",
          },
        });
      }

      // 4. Sync to Google Sheets Webhook (Supports direct POST with JSON payload from client or auto-fetch)
      if (path === "/sync") {
        const webhookUrl = env.GOOGLE_SHEET_WEBHOOK_URL || url.searchParams.get("webhook");

        let rawData = null;

        // Check if client sent JSON payload directly in POST body
        if (request.method === "POST") {
          try {
            const body = await request.json();
            if (body && (body.notCalled || body.timeSet || body.followUp || body.todayLeads || body.noAnswer)) {
              rawData = body;
              latestSyncedCartable = rawData;
              console.log("Saved and using direct client-provided cartable JSON payload.");
            } else if (body && body.data && (body.data.notCalled || body.data.timeSet || body.data.followUp)) {
              rawData = body.data;
              latestSyncedCartable = rawData;
              console.log("Saved and using direct client-provided cartable data object.");
            }
          } catch (e) {
            // Not JSON or empty body, fallback to server fetch
          }
        }

        // If no client payload provided, fetch from server
        if (!rawData) {
          rawData = await fetchCartableData(env, clientToken);
        }

        const calls = prioritizeCalls(rawData || defaultCartableData);
        const stats = computeStats(calls);

        let sheetResult = null;
        let sheetMsg = "اطلاعات کارتابل در داشبورد ورکر به‌روزرسانی شد.";

        if (webhookUrl) {
          try {
            sheetResult = await syncToGoogleSheetWebhook(webhookUrl, calls);
            sheetMsg = "اطلاعات با موفقیت اولویت‌بندی و در گوگل شیت ثبت شد.";
          } catch (sheetErr) {
            sheetMsg = `کارتابل دریافت شد اما خطا در وب‌هوک گوگل شیت رخ داد: ${sheetErr.message}`;
          }
        } else {
          sheetMsg = "کارتابل در سیستم ثبت و اولویت‌بندی شد. (برای انتقال خودکار به گوگل شیت، وب‌هوک را تنظیم کنید)";
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: sheetMsg,
            stats,
            googleSheetSynced: Boolean(webhookUrl && sheetResult),
            googleSheetResponse: sheetResult,
            syncedAt: new Date().toISOString(),
          }),
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      return new Response("Not Found", { status: 404 });
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || String(error),
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },

  /**
   * Cron Trigger Handler (Automated Sync every 10 minutes)
   */
  async scheduled(event, env, ctx) {
    if (!env.GOOGLE_SHEET_WEBHOOK_URL) {
      console.warn("Cron skipped: GOOGLE_SHEET_WEBHOOK_URL is not set.");
      return;
    }

    try {
      console.log("⏰ Running 10-minute scheduled CRM cartable sync...");
      const rawData = await fetchCartableData(env);
      const calls = prioritizeCalls(rawData);
      await syncToGoogleSheetWebhook(env.GOOGLE_SHEET_WEBHOOK_URL, calls);
      console.log(`✅ Successfully synced ${calls.length} prioritized leads to Google Sheets.`);
    } catch (err) {
      console.error("❌ Scheduled sync error:", err.message);
    }
  },
};
