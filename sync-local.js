/**
 * ====================================================================
 * اسکریپت همگام‌ساز خودکار از داخل ایران (Local Iran Auto-Sync)
 * ====================================================================
 * این اسکریپت روی سیستم شما در داخل ایران اجرا می‌شود، اطلاعات کارتابل را
 * بدون مسدودی سرور خارجی از پنل دریافت کرده و برای رتبه‌بندی و ارسال به
 * گوگل شیت، به کلودفلر ورکر تحویل می‌دهد.
 *
 * قابلیت‌ها:
 * ۱. لاگین خودکار با نام‌کاربری و رمز عبور (دریافت و تمدید خودکار توکن)
 * ۲. دریافت کارتابل بدون خطای ۵۲۲
 * ۳. ارسال مستقیم به کلودفلر ورکر و ثبت در گوگل شیت
 * ۴. تکرار خودکار هر ۱۰ دقیقه
 * ====================================================================
 */

import fs from "fs";
import path from "path";

// ====================================================================
// ⚙️ تنظیمات کاربری (این مقادیر را تکمیل کنید)
// ====================================================================

// آدرس وب‌هوک گوگل شیت (که از Apps Script در Google Sheet کپی کرده‌اید)
const GOOGLE_SHEET_WEBHOOK_URL =
  process.env.GOOGLE_SHEET_WEBHOOK_URL || "";

// نام کاربری (شماره موبایل) و رمز عبور پنل شما
const CRM_USERNAME = process.env.CRM_USERNAME || "09114495579";
const CRM_PASSWORD = process.env.CRM_PASSWORD || "";

// توکن مستقیم (در صورت خالی بودن، اسکریپت با یوزرنیم و پسورد لاگین می‌کند)
let BEARER_TOKEN =
  process.env.CRM_BEARER_TOKEN ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXM0ZXNzZXEwMXF4MTFneno3enZ6bGZ3IiwidXNlcm5hbWUiOiIwOTExNDQ5NTU3OSIsInJvbGUiOiJFWFBFUlQiLCJ0ZWFtSWQiOiJjbXMyMGF3NHMwbDJnamtzZXJqbGw3a2VlIiwicmFua0lkIjoiY21yM3pxcHpvMDAwMzEya2Vybzd1YjIzaiIsImlhdCI6MTc4ODUyNjg0NSwiZXhwIjoxNzg4NTcwMDQ1fQ.lXWDKF2rjCnEZOcoPJSH4LUqF4e--lwJb7FJ2c71vH4";

// آدرس‌های سیستم
const CRM_CARTABLE_URL = "https://panel.hooshacrm.ir/api/my/cartable";
const WORKER_SYNC_URL = "https://crm-call-prioritizer.mimhe1381.workers.dev/sync";
const LOGIN_ENDPOINTS = [
  "https://panel.hooshacrm.ir/api/auth/login",
  "https://panel.hooshacrm.ir/api/login",
  "https://panel.hooshacrm.ir/api/v1/auth/login",
];

// بازه تکرار خودکار (هر ۱۰ دقیقه)
const INTERVAL_MINUTES = 10;

// ====================================================================

/**
 * بررسی انقضای توکن JWT
 */
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
    if (payload.exp) {
      // اگر کمتر از ۲ دقیقه به انقضا مانده، منقضی در نظر بگیر
      return Date.now() >= (payload.exp - 120) * 1000;
    }
  } catch (e) {
    return false;
  }
  return false;
}

/**
 * لاگین خودکار به پنل و دریافت توکن جدید
 */
async function loginAndGetToken() {
  if (!CRM_PASSWORD) {
    throw new Error(
      "رمز عبور (CRM_PASSWORD) در فایل sync-local.js تنظیم نشده است. لطفاً رمز عبور پنل خود را وارد کنید."
    );
  }

  console.log(`🔑 در حال ورود خودکار با نام کاربری ${CRM_USERNAME}...`);

  const payload = {
    username: CRM_USERNAME,
    password: CRM_PASSWORD,
    phone: CRM_USERNAME,
    email: CRM_USERNAME,
  };

  let lastErr = null;

  for (const endpoint of LOGIN_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "CrmCartablePrioritizer/1.0",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        lastErr = new Error(`کد خطای لاگین: ${res.status}`);
        continue;
      }

      const data = await res.json();
      const token =
        data.token ||
        data.accessToken ||
        data.access_token ||
        data.jwt ||
        (data.data && (data.data.token || data.data.accessToken || data.data.access_token));

      if (token) {
        console.log("✅ ورود موفقیت‌آمیز بود! توکن تازه دریافت شد.");
        BEARER_TOKEN = token;
        return token;
      }
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error("امکان لاگین به پنل وجود ندارد. لطفاً نام‌کاربری و رمز عبور را بررسی کنید.");
}

/**
 * دریافت توکن معتبر (یا لاگین خودکار در صورت نیاز)
 */
async function ensureValidToken() {
  if (!BEARER_TOKEN || isTokenExpired(BEARER_TOKEN)) {
    if (CRM_PASSWORD) {
      console.log("⚠️ توکن موجود نیست یا منقضی شده است. لاگین خودکار انجام می‌شود...");
      return await loginAndGetToken();
    }
  }
  return BEARER_TOKEN;
}

/**
 * عملیات همگام‌سازی کارتابل
 */
async function doSync() {
  const timeStr = new Date().toLocaleTimeString("fa-IR");
  console.log(`\n[${timeStr}] ⏳ در حال دریافت اطلاعات کارتابل از سرور...`);

  try {
    let token = await ensureValidToken();

    // ۱. دریافت داده‌های کارتابل از سرور
    let crmRes = await fetch(CRM_CARTABLE_URL, {
      method: "GET",
      headers: {
        Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        Accept: "application/json",
        "User-Agent": "CrmCartablePrioritizer/1.0",
      },
    });

    // اگر توکن اکسپایر شده باشد (401)، لاگین مجدد و تلاش دوباره
    if ((crmRes.status === 401 || crmRes.status === 403) && CRM_PASSWORD) {
      console.warn("⚠️ خطای ۴۰۱ (انقضای توکن). در حال تمدید خودکار توکن...");
      token = await loginAndGetToken();
      crmRes = await fetch(CRM_CARTABLE_URL, {
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
      throw new Error(`خطای دریافت کارتابل (${crmRes.status}): ${errBody}`);
    }

    const cartableData = await crmRes.json();
    console.log("✅ اطلاعات کارتابل با موفقیت دریافت شد.");
    console.log("🚀 در حال ارسال به کلودفلر برای اولویت‌بندی تماس‌ها و درج در گوگل شیت...");

    // ۲. آماده‌سازی آدرس ورکر به همراه وب‌هوک گوگل شیت
    let targetWorkerUrl = WORKER_SYNC_URL;
    if (GOOGLE_SHEET_WEBHOOK_URL) {
      targetWorkerUrl += `?webhook=${encodeURIComponent(GOOGLE_SHEET_WEBHOOK_URL)}`;
    }

    // ۳. ارسال داده‌ها به کلودفلر ورکر
    const workerRes = await fetch(targetWorkerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartableData),
    });

    const workerResult = await workerRes.json();

    if (workerResult.success) {
      console.log(`🎉 همگام‌سازی با موفقیت کامل شد!`);
      console.log(`   - مجموع مخاطبین در صف: ${workerResult.stats?.total}`);
      console.log(`   - تماس‌های فوری P1: ${workerResult.stats?.p1}`);
      console.log(`   - فرصت‌های داغ P2: ${workerResult.stats?.p2}`);
      console.log(`   - لیدهای تازه P3: ${workerResult.stats?.p3}`);
      console.log(`   - پیام گوگل شیت: ${workerResult.message || "به‌روزرسانی شد"}`);
    } else {
      console.error("❌ خطا در ثبت گوگل شیت:", workerResult.error);
      if (workerResult.error && workerResult.error.includes("GOOGLE_SHEET_WEBHOOK_URL")) {
        console.log("\n💡 راهنمایی: لطفاً متغیر GOOGLE_SHEET_WEBHOOK_URL را در خط ۱۸ فایل sync-local.js وارد کنید:");
        console.log('   const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/.../exec";\n');
      }
    }
  } catch (error) {
    console.error("❌ خطا در فرآیند همگام‌سازی:", error.message);
  }
}

// اجرای اولیه
doSync();

// زمان‌بندی تکرار هر ۱۰ دقیقه
console.log(`⏰ زمان‌بندی خودکار فعال شد: هر ${INTERVAL_MINUTES} دقیقه یک‌بار اجرا می‌شود.`);
setInterval(doSync, INTERVAL_MINUTES * 60 * 1000);
