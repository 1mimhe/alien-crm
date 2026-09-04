/**
 * Cloudflare Worker: Hoosha CRM Cartable Call Prioritizer & Google Sheets Sync
 */

import { prioritizeCalls } from "./prioritizer.js";
import { syncToGoogleSheetWebhook, generateCsv } from "./sheets.js";
import { renderDashboardHtml } from "./dashboard.js";

const DEFAULT_HOOSHA_URL = "https://panel.hooshacrm.ir/api/my/cartable";

/**
 * Fetch cartable leads from Hoosha CRM API with Bearer Token
 */
async function fetchCartableData(env, tokenOverride = null) {
  const token = tokenOverride || env.HOOSHA_BEARER_TOKEN;
  const apiUrl = env.HOOSHA_API_URL || DEFAULT_HOOSHA_URL;

  if (!token) {
    throw new Error(
      "توکن احراز هویت (HOOSHA_BEARER_TOKEN) در متغیرهای محیطی کلودفلر ورکر تنظیم نشده است."
    );
  }

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
      Accept: "application/json",
      "User-Agent": "HooshaCartablePrioritizer/1.0",
    },
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`درخواست به CRM هوشا با خطا مواجه شد (${response.status}): ${errText}`);
  }

  return await response.json();
}

/**
 * Compute statistics summary
 */
function computeStats(calls) {
  return {
    total: calls.length,
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

      // 2. API Endpoint: Returns JSON of prioritized calls
      if (path === "/api/calls") {
        const rawData = await fetchCartableData(env, clientToken);
        const calls = prioritizeCalls(rawData);
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
        const calls = prioritizeCalls(rawData);
        const csv = generateCsv(calls);

        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": 'attachment; filename="hoosha-cartable-calls.csv"',
            "Cache-Control": "no-store",
          },
        });
      }

      // 4. Sync to Google Sheets Webhook
      if (path === "/sync") {
        const webhookUrl = env.GOOGLE_SHEET_WEBHOOK_URL || url.searchParams.get("webhook");
        if (!webhookUrl) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "متغیر GOOGLE_SHEET_WEBHOOK_URL در کلودفلر یا در پارامتر درخواست مشخص نشده است.",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json; charset=utf-8" },
            }
          );
        }

        const rawData = await fetchCartableData(env, clientToken);
        const calls = prioritizeCalls(rawData);
        const stats = computeStats(calls);

        const sheetResult = await syncToGoogleSheetWebhook(webhookUrl, calls);

        return new Response(
          JSON.stringify({
            success: true,
            message: "اطلاعات با موفقیت در گوگل شیت درج و به‌روزرسانی شد.",
            stats,
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
   * Cron Trigger Handler (Automatic Daily Scheduled Sync)
   */
  async scheduled(event, env, ctx) {
    if (!env.GOOGLE_SHEET_WEBHOOK_URL) {
      console.warn("Cron skipped: GOOGLE_SHEET_WEBHOOK_URL is not set.");
      return;
    }

    try {
      console.log("Running scheduled CRM cartable sync...");
      const rawData = await fetchCartableData(env);
      const calls = prioritizeCalls(rawData);
      await syncToGoogleSheetWebhook(env.GOOGLE_SHEET_WEBHOOK_URL, calls);
      console.log(`Successfully synced ${calls.length} leads to Google Sheets.`);
    } catch (err) {
      console.error("Scheduled sync error:", err);
    }
  },
};
