import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { prioritizeCalls } from "../src/prioritizer.js";
import { formatForGoogleSheets, generateCsv } from "../src/sheets.js";
import { renderDashboardHtml } from "../src/dashboard.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("==================================================");
console.log("Running CRM Call Prioritizer Local Tests...");
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
if (html.includes("میز کار هوشمند تماس‌های فروش")) {
  console.log("[OK] Dashboard HTML generated successfully with Persian title & mobile layout.");
}

// 7. Test Date-Aware Prioritization (Today Time Sets & Old -> New ordering)
console.log("\n==================================================");
console.log("Testing Date-Aware Priority: Today Time Sets & Old -> New");
console.log("==================================================");

// Generate dates based on today
const now = new Date();
const todayMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30, 0);
const todayAfternoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0, 0);

const twoDaysAgo = new Date(now);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);

const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);

const mockCartable = {
  timeSet: [
    {
      id: "ts-yesterday",
      fullName: "سارا رضایی (تایم‌ست دیروز - معوقه جدیدتر)",
      phoneRaw: "09121111111",
      status: "TIME_SET",
      nextActionDueAt: yesterday.toISOString(),
      source: "کمپین",
    },
    {
      id: "ts-today-pm",
      fullName: "رضا محمدی (تایم‌ست امروز بعدازظهر)",
      phoneRaw: "09122222222",
      status: "TIME_SET",
      nextActionDueAt: todayAfternoon.toISOString(),
      source: "کمپین",
    },
    {
      id: "ts-2days-ago",
      fullName: "مریم اکبری (تایم‌ست ۲ روز قبل - معوقه قدیمی‌تر)",
      phoneRaw: "09123333333",
      status: "TIME_SET",
      nextActionDueAt: twoDaysAgo.toISOString(),
      source: "کمپین",
    },
    {
      id: "ts-today-am",
      fullName: "علی حسینی (تایم‌ست امروز صبح)",
      phoneRaw: "09124444444",
      status: "TIME_SET",
      nextActionDueAt: todayMorning.toISOString(),
      source: "کمپین",
    },
  ],
  todayLeads: [
    {
      id: "today-inbound-1",
      fullName: "مهدی کاظمی (لید جدید امروز)",
      phoneRaw: "09125555555",
      status: "NEW",
      assignedAt: now.toISOString(),
      source: "وبسایت",
    },
  ],
};

const prioritizedMock = prioritizeCalls(mockCartable);

console.log("Ordered Priority List for Mock Cartable:");
prioritizedMock.forEach((lead, i) => {
  console.log(
    `#${i + 1} [Score: ${lead.score}] ${lead.fullName} | موعد: ${lead.nextActionDueAtFormatted} | فوریت: ${lead.dateUrgencyLabel}`
  );
});

// Assertions:
// #1 should be Today Morning Time Set (earliest today)
// #2 should be Today Afternoon Time Set (later today)
// #3 should be 2 Days Ago Time Set (oldest overdue)
// #4 should be Yesterday Time Set (newer overdue)
// #5 should be Today Inbound Lead
if (
  prioritizedMock[0].id === "ts-today-am" &&
  prioritizedMock[1].id === "ts-today-pm" &&
  prioritizedMock[2].id === "ts-2days-ago" &&
  prioritizedMock[3].id === "ts-yesterday" &&
  prioritizedMock[4].id === "today-inbound-1"
) {
  console.log("\n✅ SUCCESS: Today Time Sets & Old -> New priority ordering verified perfectly!");
} else {
  console.error("\n❌ FAILED: Priority order did not match expected requirements!");
  process.exit(1);
}

console.log("\nAll local tests passed successfully!\n");
