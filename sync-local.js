/**
 * ====================================================================
 * اسکریپت همگام‌ساز خودکار از داخل ایران (Local Iran Auto-Sync)
 * ====================================================================
 * این اسکریپت روی سیستم شما در داخل ایران اجرا می‌شود، اطلاعات کارتابل را
 * بدون مسدودی سرور خارجی از پنل دریافت کرده و برای رتبه‌بندی و ارسال به
 * گوگل شیت، به کلودفلر ورکر تحویل می‌دهد.
 *
 * نحوه اجرا:
 *   node sync-local.js
 * ====================================================================
 */

import fs from "fs";

// تنظیمات (می‌توانید توکن را اینجا قرار دهید یا از متغیر محیطی بخوانید)
const CRM_CARTABLE_URL = "https://panel.hooshacrm.ir/api/my/cartable";
const WORKER_SYNC_URL = "https://crm-call-prioritizer.mimhe1381.workers.dev/sync";

// توکن شما
const BEARER_TOKEN = process.env.CRM_BEARER_TOKEN || process.env.HOOSHA_BEARER_TOKEN || "";

// بازه تکرار (پیش‌فرض: هر ۱۰ دقیقه)
const INTERVAL_MINUTES = 10;

async function doSync() {
  const timeStr = new Date().toLocaleTimeString("fa-IR");
  console.log(`\n[${timeStr}] ⏳ در حال دریافت اطلاعات کارتابل از سرور...`);

  if (!BEARER_TOKEN) {
    console.error("❌ خطا: توکن Bearer مشخص نشده است. لطفاً متغیر BEARER_TOKEN را در فایل sync-local.js مقداردهی کنید.");
    return;
  }

  try {
    // ۱. دریافت داده‌ها از داخل ایران (بدون خطای ۵۲۲)
    const crmRes = await fetch(CRM_CARTABLE_URL, {
      method: "GET",
      headers: {
        Authorization: BEARER_TOKEN.startsWith("Bearer ") ? BEARER_TOKEN : `Bearer ${BEARER_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!crmRes.ok) {
      const errBody = await crmRes.text();
      throw new Error(`خطای سرور (${crmRes.status}): ${errBody}`);
    }

    const cartableData = await crmRes.json();
    console.log("✅ کارتابل با موفقیت دریافت شد. در حال ارسال به کلودفلر برای اولویت‌بندی و ثبت در گوگل شیت...");

    // ۲. ارسال مستقیم به کلودفلر ورکر
    const workerRes = await fetch(WORKER_SYNC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartableData),
    });

    const workerResult = await workerRes.json();

    if (workerResult.success) {
      console.log(`🎉 همگام‌سازی کامل شد!`);
      console.log(`   - مجموع لیدها: ${workerResult.stats?.total}`);
      console.log(`   - اولویت P1 (فوری): ${workerResult.stats?.p1}`);
      console.log(`   - اولویت P2 (داغ): ${workerResult.stats?.p2}`);
      console.log(`   - اولویت P3 (تازه): ${workerResult.stats?.p3}`);
      console.log(`   - گوگل شیت با موفقیت به‌روزرسانی شد.`);
    } else {
      console.error("❌ خطا در ورکر:", workerResult.error);
    }
  } catch (error) {
    console.error("❌ خطا در اجرای همگام‌سازی:", error.message);
  }
}

// اجرای اولیه
doSync();

// زمان‌بندی تکرار هر ۱۰ دقیقه
console.log(`⏰ زمان‌بندی خودکار فعال شد: هر ${INTERVAL_MINUTES} دقیقه یک‌بار اجرا می‌شود.`);
setInterval(doSync, INTERVAL_MINUTES * 60 * 1000);
