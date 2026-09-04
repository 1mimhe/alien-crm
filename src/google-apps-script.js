/**
 * ====================================================================
 * کد گوگل اپس اسکریپت (Google Apps Script) برای اتصال به کلودفلر ورکر
 * ====================================================================
 * نحوه استفاده:
 * ۱. یک گوگل شیت جدید در Google Drive باز کنید.
 * ۲. از منوی بالا روی Extensions (افزونه‌ها) > Apps Script کلیک کنید.
 * ۳. تمام کدهای پیش‌فرض را پاک کرده و این کد را جایگزین کنید.
 * ۴. روی دکمه Deploy (استقرار) > New deployment (استقرار جدید) کلیک کنید.
 * ۵. نوع استقرار را Web app انتخاب کنید:
 *    - Execute as: Me (حساب شما)
 *    - Who has access: Anyone (هر کسی)
 * ۶. لینک ایجاد شده (Web App URL) را کپی کنید و در متغیر GOOGLE_SHEET_WEBHOOK_URL کلودفلر قرار دهید.
 * ====================================================================
 */

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var payload = JSON.parse(rawData);

    if (!payload.data || !Array.isArray(payload.data)) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", message: "Invalid payload format" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = "برنامه‌ریزی تماس‌های کارتابل";
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    // Clear existing contents and formatting
    sheet.clear();
    sheet.setRightToLeft(true); // فارسی راست‌به‌چپ

    var rows = payload.data;
    var numRows = rows.length;
    var numCols = rows[0].length;

    // Insert all data
    var range = sheet.getRange(1, 1, numRows, numCols);
    range.setValues(rows);

    // Style Header (Row 1)
    var headerRange = sheet.getRange(1, 1, 1, numCols);
    headerRange.setBackground("#1E293B"); // Slate Dark
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 38);

    // Freeze Header Row
    sheet.setFrozenRows(1);

    // Style data rows
    if (numRows > 1) {
      var dataRange = sheet.getRange(2, 1, numRows - 1, numCols);
      dataRange.setFontFamily("Vazirmatn, Tahoma, Arial");
      dataRange.setFontSize(10);
      dataRange.setVerticalAlignment("middle");

      // Set Priority cell colors (Column 2 is Priority Level)
      for (var i = 2; i <= numRows; i++) {
        var priorityCell = sheet.getRange(i, 2);
        var priorityVal = priorityCell.getValue().toString();

        if (priorityVal.indexOf("P1") !== -1) {
          priorityCell.setBackground("#FEE2E2").setFontColor("#991B1B").setFontWeight("bold");
        } else if (priorityVal.indexOf("P2") !== -1) {
          priorityCell.setBackground("#FFEDD5").setFontColor("#9A3412").setFontWeight("bold");
        } else if (priorityVal.indexOf("P3") !== -1) {
          priorityCell.setBackground("#DBEAFE").setFontColor("#1E40AF");
        } else if (priorityVal.indexOf("P4") !== -1) {
          priorityCell.setBackground("#D1FAE5").setFontColor("#065F46");
        } else if (priorityVal.indexOf("P5") !== -1) {
          priorityCell.setBackground("#F3F4F6").setFontColor("#374151");
        }

        // Alignments
        sheet.getRange(i, 1).setHorizontalAlignment("center"); // ردیف
        sheet.getRange(i, 3).setHorizontalAlignment("center"); // امتیاز
        sheet.getRange(i, 5).setHorizontalAlignment("center"); // شماره
        sheet.getRange(i, 6).setHorizontalAlignment("center"); // وضعیت
      }
    }

    // Auto fit column widths
    for (var col = 1; col <= numCols; col++) {
      sheet.autoResizeColumn(col);
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Sheet updated successfully",
        totalRows: numRows,
        updatedAt: new Date().toISOString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "active",
      service: "CRM Call Planner Google Sheets Webhook Receiver",
      message: "Send a POST request to update the cartable call plan.",
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
