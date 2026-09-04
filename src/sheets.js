/**
 * Google Sheets integration & CSV Export Formatter
 */

export const SHEET_HEADERS = [
  "ردیف",
  "سطح اولویت",
  "امتیاز",
  "نام و نام خانوادگی",
  "شماره تماس",
  "وضعیت فعلی",
  "دسته‌بندی کارتابل",
  "موعد تماس بعدی",
  "یادداشت و جزئیات",
  "مبلغ پیشنهادی",
  "مانده حساب",
  "پرسونا و تگ مخاطب",
  "منبع لید",
  "استخر",
  "تعداد عدم پاسخ",
  "استراتژی و توصیه تماس",
  "آخرین تماس",
  "کارشناس",
  "شناسه CRM",
];

/**
 * Format prioritized calls into 2D row array for Google Sheets
 */
export function formatForGoogleSheets(calls) {
  const rows = [SHEET_HEADERS];

  calls.forEach((call, index) => {
    rows.push([
      index + 1,
      `${call.priorityCode} (${call.priorityName})`,
      call.score,
      call.fullName,
      call.phone,
      call.status,
      call.categoryName,
      call.nextActionDueAtFormatted,
      call.nextActionNote,
      call.proposedAmountFormatted,
      call.balanceFormatted,
      call.persona,
      call.source,
      call.poolName,
      call.noAnswerCount,
      call.strategy,
      call.lastCallAtFormatted,
      call.ownerName,
      call.id,
    ]);
  });

  return rows;
}

/**
 * Send formatted call list to Google Apps Script Webhook
 */
export async function syncToGoogleSheetWebhook(webhookUrl, calls) {
  if (!webhookUrl) {
    throw new Error("GOOGLE_SHEET_WEBHOOK_URL is not configured.");
  }

  const tableData = formatForGoogleSheets(calls);

  const payload = {
    action: "UPDATE_CARTABLE",
    syncedAt: new Date().toISOString(),
    totalLeads: calls.length,
    p1Count: calls.filter((c) => c.priorityCode === "P1").length,
    p2Count: calls.filter((c) => c.priorityCode === "P2").length,
    p3Count: calls.filter((c) => c.priorityCode === "P3").length,
    data: tableData,
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Sheet Webhook failed (${response.status}): ${errorText}`);
  }

  return await response.json().catch(() => ({ status: "success" }));
}

/**
 * Generate CSV with UTF-8 BOM for Persian characters in Excel / Google Sheets
 */
export function generateCsv(calls) {
  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const table = formatForGoogleSheets(calls);
  const csvRows = table.map((row) => row.map(escapeCsv).join(","));

  // UTF-8 BOM prefix (\uFEFF) ensures Excel and Sheets properly recognize Persian text encoding
  return "\uFEFF" + csvRows.join("\r\n");
}
