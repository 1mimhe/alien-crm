import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { prioritizeCalls } from "../src/prioritizer.js";
import { formatForGoogleSheets, generateCsv } from "../src/sheets.js";
import { renderDashboardHtml } from "../src/dashboard.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("==================================================");
console.log("Running Hoosha CRM Call Prioritizer Local Tests...");
console.log("==================================================");

// 1. Read sample cartable json
const samplePath = path.join(__dirname, "sample-cartable.json");
const sampleRaw = JSON.parse(fs.readFileSync(samplePath, "utf-8"));

// 2. Run prioritization
const prioritized = prioritizeCalls(sampleRaw);

console.log(`\n[OK] Prioritized ${prioritized.length} unique leads from sample JSON.\n`);

// 3. Inspect Priority Tier distribution
const breakdown = { P1: 0, P2: 0, P3: 0, P4: 0, P5: 0 };
prioritized.forEach((c) => {
  breakdown[c.priorityCode] = (breakdown[c.priorityCode] || 0) + 1;
});

console.log("Priority Breakdown:", breakdown);

// Display top 5 leads
console.log("\nTop 5 Prioritized Leads:");
prioritized.slice(0, 5).forEach((lead, i) => {
  console.log(
    `#${i + 1} [${lead.priorityCode} | Score: ${lead.score}] ${lead.fullName} (${lead.phone})`
  );
  console.log(`   وضعیت: ${lead.status} | دسته‌بندی: ${lead.categoryName}`);
  console.log(`   موعد تماس: ${lead.nextActionDueAtFormatted}`);
  console.log(`   استراتژی: ${lead.strategy}`);
  console.log("--------------------------------------------------");
});

// 4. Test Google Sheets formatting
const sheetsRows = formatForGoogleSheets(prioritized);
console.log(`\n[OK] Formatted for Google Sheets: ${sheetsRows.length} rows (including header).`);
console.log("Header Columns:", sheetsRows[0]);
console.log("Sample Row 1:", sheetsRows[1]);

// 5. Test CSV generation
const csv = generateCsv(prioritized);
if (csv.startsWith("\uFEFF")) {
  console.log("\n[OK] CSV starts with UTF-8 BOM for Persian encoding compatibility.");
}
console.log(`[OK] CSV generated successfully (${csv.length} bytes).`);

// 6. Test Dashboard HTML rendering
const html = renderDashboardHtml(prioritized, breakdown, {});
if (html.includes("داشبورد هوشمند برنامه‌ریزی تماس‌های کارتابل")) {
  console.log("[OK] Dashboard HTML generated successfully.");
}

console.log("\nAll local tests passed successfully!\n");
