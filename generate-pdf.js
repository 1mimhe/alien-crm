/**
 * Generates an executive Persian User Guide PDF for non-developer users
 * from README.md principles with publication-grade design.
 */

import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';

const htmlContent = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>راهنمای کاربردی سامانه مدیریت و اولویت‌بندی هوشمند تماس‌های فروش</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap');

    @page {
      size: A4;
      margin: 15mm 12mm 15mm 12mm;
      @bottom-center {
        content: counter(page);
        font-family: 'Vazirmatn', Tahoma, sans-serif;
        font-size: 8pt;
        color: #64748B;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Vazirmatn', 'Segoe UI', Tahoma, sans-serif;
      background-color: #FFFFFF;
      color: #1E293B;
      line-height: 1.65;
      font-size: 10pt;
      direction: rtl;
    }

    .page {
      padding: 10px 15px;
      page-break-after: always;
      position: relative;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    /* Header & Branding */
    .doc-header {
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 15px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand-title {
      font-size: 16pt;
      font-weight: 900;
      color: #1E1B4B;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-subtitle {
      font-size: 9.5pt;
      color: #6366F1;
      font-weight: 700;
      margin-top: 4px;
    }

    .meta-tag {
      background: #EEF2FF;
      color: #4F46E5;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 8pt;
      font-weight: 700;
      border: 1px solid #C7D2FE;
    }

    h1, h2, h3, h4 {
      color: #0F172A;
      font-weight: 800;
    }

    h2 {
      font-size: 12.5pt;
      border-right: 4px solid #4F46E5;
      padding-right: 8px;
      margin-top: 18px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    h3 {
      font-size: 10.5pt;
      margin-top: 14px;
      margin-bottom: 6px;
      color: #334155;
    }

    p {
      margin-bottom: 10px;
      text-align: justify;
      color: #334155;
    }

    /* Feature Grid & Cards */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 15px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
    }

    .card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 12px 14px;
      position: relative;
    }

    .card-title {
      font-size: 9.5pt;
      font-weight: 800;
      color: #1E293B;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .card-desc {
      font-size: 8.5pt;
      color: #475569;
      line-height: 1.5;
    }

    /* Highlight Banner */
    .banner {
      background: linear-gradient(135deg, #4F46E5 0%, #3730A3 100%);
      color: #FFFFFF;
      padding: 14px 18px;
      border-radius: 12px;
      margin-bottom: 18px;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
    }

    .banner h3 {
      color: #FFFFFF;
      font-size: 11.5pt;
      margin-bottom: 4px;
      margin-top: 0;
    }

    .banner p {
      color: #E0E7FF;
      margin-bottom: 0;
      font-size: 9pt;
      line-height: 1.55;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 16px 0;
      font-size: 8.5pt;
      background: #FFFFFF;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #E2E8F0;
    }

    th {
      background: #F1F5F9;
      color: #0F172A;
      font-weight: 800;
      padding: 8px 10px;
      text-align: right;
      border-bottom: 2px solid #CBD5E1;
      white-space: nowrap;
    }

    td {
      padding: 7px 10px;
      border-bottom: 1px solid #E2E8F0;
      vertical-align: middle;
      color: #334155;
    }

    tr:nth-child(even) td {
      background: #F8FAFC;
    }

    /* Priority Pills */
    .p-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 7.8pt;
      white-space: nowrap;
    }

    .p-pill.p1 { background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; }
    .p-pill.p2 { background: #FFEDD5; color: #EA580C; border: 1px solid #FDBA74; }
    .p-pill.p3 { background: #DBEAFE; color: #2563EB; border: 1px solid #93C5FD; }
    .p-pill.p4 { background: #DCFCE7; color: #16A34A; border: 1px solid #86EFAC; }
    .p-pill.p5 { background: #F1F5F9; color: #64748B; border: 1px solid #CBD5E1; }

    /* Status Pills */
    .status-capsule {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 9px;
      border-radius: 20px;
      font-size: 7.8pt;
      font-weight: 700;
      white-space: nowrap;
    }

    .status-timeset { background: #FEF3C7; color: #D97706; border: 1px solid #FCD34D; }
    .status-promise { background: #D1FAE5; color: #059669; border: 1px solid #6EE7B7; }
    .status-new     { background: #F3E8FF; color: #9333EA; border: 1px solid #D8B4FE; }
    .status-nego    { background: #E0F2FE; color: #0284C7; border: 1px solid #7DD3FC; }
    .status-paid    { background: #CFFAFE; color: #0891B2; border: 1px solid #67E8F9; }
    .status-follow  { background: #FFEDD5; color: #EA580C; border: 1px solid #FDBA74; }
    .status-free    { background: #ECFCCB; color: #65A30D; border: 1px solid #BEF264; }
    .status-noans   { background: #F1F5F9; color: #64748B; border: 1px solid #CBD5E1; }

    /* Steps List */
    .step-box {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 10px 14px;
      align-items: flex-start;
    }

    .step-number {
      background: #4F46E5;
      color: #FFFFFF;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 9pt;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .step-content {
      flex: 1;
    }

    .step-title {
      font-size: 9.5pt;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 2px;
    }

    .step-desc {
      font-size: 8.5pt;
      color: #475569;
      line-height: 1.5;
    }

    /* Checklist Box */
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      background: #F8FAFC;
      border-radius: 8px;
      margin-bottom: 6px;
      font-size: 8.5pt;
      border-right: 3px solid #10B981;
    }

    .badge-time {
      background: #4F46E5;
      color: #FFFFFF;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 7.5pt;
      font-weight: 800;
      margin-left: 4px;
    }

    /* Alert / Tip Box */
    .alert-box {
      border-right: 4px solid #10B981;
      background: #ECFDF5;
      padding: 10px 14px;
      border-radius: 0 10px 10px 0;
      margin: 12px 0;
      font-size: 8.5pt;
      color: #065F46;
      line-height: 1.55;
    }

    .alert-box.warning {
      border-right-color: #F59E0B;
      background: #FFFBEB;
      color: #92400E;
    }

    .footer-note {
      text-align: center;
      font-size: 7.8pt;
      color: #94A3B8;
      border-top: 1px solid #E2E8F0;
      padding-top: 8px;
      margin-top: 15px;
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1 ==================== -->
  <div class="page">
    <header class="doc-header">
      <div>
        <div class="brand-title">📞 سامانه هوشمند صف تماس و اولویت‌بندی فروش</div>
        <div class="brand-subtitle">راهنمای کاربردی و اجرایی برای مدیران، سرپرستان و کارشناسان فروش</div>
      </div>
      <div class="meta-tag">نگارش ۱.۰ | سازگار با موبایل و وب</div>
    </header>

    <div class="banner">
      <h3>🎯 هدف سامانه چیست و چرا ایجاد شده است؟</h3>
      <p>
        در فرآیند فروش تلفنی، بزرگترین سرمایه شما «زمان مکالمه کارشناس» است. تماس با شماره‌های تصادفی، عدم پیگیری به موقع تایم‌ست‌ها یا سوزاندن زمان روی مخاطبان بی‌انگیزه، فروش را کاهش می‌دهد. این سامانه با هوش تجاری، لیدهای کارتابل CRM را لحظه‌به‌لحظه اولویت‌بندی کرده و آماده‌ترین مخاطبان برای خرید را در صدر صف تماس قرار می‌دهد تا با کمترین انرژی بیشترین ثبت‌نام محقق شود.
      </p>
    </div>

    <h2>🏆 ستون فقرات اولویت‌بندی تماس‌ها (P1 تا P5)</h2>
    <p>
      هر مخاطب بر اساس میزان فوریت زمانی، احتمال قطعی خرید و ارزش ریالی، نمره‌ای بین <strong>۰ تا ۱۰۰</strong> دریافت می‌کند و در یکی از ۵ طبقه زیر قرار می‌گیرد:
    </p>

    <table>
      <thead>
        <tr>
          <th style="width: 85px;">سطح اولویت</th>
          <th style="width: 55px; text-align: center;">امتیاز</th>
          <th>مخاطب در چه وضعیتی است؟</th>
          <th>استراتژی و اقدام طلایی کارشناس فروش</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="p-pill p1">🔴 P1 - فوری</span></td>
          <td style="text-align: center; font-weight: 800; color: #DC2626;">۸۵ تا ۱۰۰</td>
          <td>
            • قرار هماهنگ‌شده (<span class="status-capsule status-timeset">⏰ زمان تعیین‌شده</span>)<br>
            • قول واریز (<span class="status-capsule status-promise">💰 قول پرداخت</span>)<br>
            • اقساط معوقه با مانده حساب
          </td>
          <td><strong>تماس بدون حتی یک دقیقه تاخیر در ساعت مقرر؛</strong> ارسال سریع شماره کارت یا درگاه پرداخت؛ پاسخ به آخرین سوالات و نهایی‌سازی ثبت‌نام.</td>
        </tr>
        <tr>
          <td><span class="p-pill p2">🔥 P2 - اولویت بالا</span></td>
          <td style="text-align: center; font-weight: 800; color: #EA580C;">۷۰ تا ۸۴</td>
          <td>
            • ثبت‌نام مجدد در دوره‌ها<br>
            • لید در حال مذاکره با تمایل خرید بالا<br>
            • پرونده‌های با ارزش مالی بالاتر از ۹ میلیون تومان
          </td>
          <td>یادآوری ابراز تمایل دوباره لید؛ رفع تردیدها؛ ارائه آفر محدود یا شرایط پرداخت اختصاصی جهت نهایی‌سازی.</td>
        </tr>
        <tr>
          <td><span class="p-pill p3">⚡️ P3 - تازه و نو</span></td>
          <td style="text-align: center; font-weight: 800; color: #2563EB;">۵۵ تا ۶۹</td>
          <td>
            • لیدهای کاملاً جدید بدون تماس (<span class="status-capsule status-new">⚡️ لید جدید</span>)<br>
            • متقاضیان دریافت مشاوره
          </td>
          <td><strong>تماس برق‌آسا در ۵ تا ۱۰ دقیقه اول ورود (Speed-to-Lead)؛</strong> تبریک عضویت، کشف دغدغه و معرفی متناسب دوره‌ها.</td>
        </tr>
        <tr>
          <td><span class="p-pill p4">🟢 P4 - پیگیری</span></td>
          <td style="text-align: center; font-weight: 800; color: #16A34A;">۳۸ تا ۵۴</td>
          <td>
            • دانشجویان دوره رایگان (<span class="status-capsule status-free">🎓 دوره رایگان</span>)<br>
            • مخاطبان با ۱ یا ۲ بار عدم پاسخ (<span class="status-capsule status-noans">📵 عدم پاسخ</span>)
          </td>
          <td>ارزیابی میزان رضایت از آموزش رایگان و پرزنت دوره جامع؛ تغییر ساعت تماس (مثلاً صبح به بعدازظهر) برای کسانی که پاسخ نداده‌اند.</td>
        </tr>
        <tr>
          <td><span class="p-pill p5">⚪️ P5 - پایین</span></td>
          <td style="text-align: center; font-weight: 800; color: #64748B;">کمتر از ۳۸</td>
          <td>
            • ۳ بار یا بیشتر عدم پاسخگویی<br>
            • مخاطبان انصرافی یا مسدود شده
          </td>
          <td><strong>عدم هدر دادن زمان تماس تلفنی کارشناس؛</strong> انتقال به چرخه‌های خودکار پیامکی یا ربات پیام‌رسان‌ها جهت بازگردانی لید.</td>
        </tr>
      </tbody>
    </table>

    <div class="alert-box">
      <strong>💡 نکته طلایی برای سرپرستان فروش:</strong>
      کارشناسان باید کار خود را همواره از بالاترین اولویت‌های بالای صفحه آغاز کنند. هر تماسی که با P1 گرفته می‌شود، شانس فروش آن حداقل ۵ برابر یک لید معمولی است!
    </div>

    <div class="footer-note">
      سامانه مدیریت صف تماس‌های فروش • صفحه ۱ از ۳
    </div>
  </div>

  <!-- ==================== PAGE 2 ==================== -->
  <div class="page">
    <header class="doc-header">
      <div class="brand-title">📅 قوانین زمان‌بندی طلایی و راهنمای داشبورد فروش</div>
      <div class="meta-tag">ساده و کامپکت | ویژه کارشناس</div>
    </header>

    <h2>⏰ قانون قرارهای تماس: «تایم‌ست امروز» و ترتیب «از قدیم به جدید»</h2>
    <p>
      بزرگترین نقطه ضعف سیستم‌های قدیمی CRM این بود که کارشناس نمی‌دانست کدام قرار را زودتر تماس بگیرد. سامانه حاضر با ۳ لایه هوشمند این مشکل را حل کرده است:
    </p>

    <div class="grid-3">
      <div class="card" style="border-right: 4px solid #F59E0B;">
        <div class="card-title">۱. تایم‌ست‌های امروز 📅</div>
        <div class="card-desc">
          تمام قرارهایی که برای «امروز» هماهنگ شده‌اند در بالاترین جایگاه ممکن قرار می‌گیرند. قرارهای صبح (مثلاً ۰۹:۳۰) جلوتر از قرارهای عصر (مثلاً ۱۶:۰۰) ظاهر می‌شوند تا هیچ تماسی جا نماند.
        </div>
      </div>
      <div class="card" style="border-right: 4px solid #EF4444;">
        <div class="card-title">۲. قرارهای معوقه گذشته 🚨</div>
        <div class="card-desc">
          اگر به هر دلیلی تماسی از روزهای قبل هماهنگ شده و جا مانده باشد، با نشان قرمز در رده دوم قرار می‌گیرد. ترتیب آن نیز از <strong>قدیمی به جدید</strong> است تا تعهد مشتری سریع‌تر جبران شود.
        </div>
      </div>
      <div class="card" style="border-right: 4px solid #10B981;">
        <div class="card-title">۳. ورودی‌های نو امروز ⚡️</div>
        <div class="card-desc">
          مخاطبان جدیدی که امروز ثبت‌نام کرده‌اند بلافاصله پس از تایم‌ست‌ها قرار می‌گیرند تا قانون تماس سریع زیر ۱۰ دقیقه به طور دقیق اجرا شود.
        </div>
      </div>
    </div>

    <h2>📱 امکانات داشبورد فروش (در کامپیوتر و گوشی موبایل)</h2>

    <div class="grid-2">
      <div class="step-box">
        <div class="step-number">📞</div>
        <div class="step-content">
          <div class="step-title">تماس تلفنی با ۱ کلیک (بدون شماره‌گیری دستی)</div>
          <div class="step-desc">
            هم در کامپیوتر و هم در موبایل، کافیست روی دکمه سبز رنگ تماس بزنید. تلفن همراه شما فوراً شماره را شماره‌گیری می‌کند و نیازی به خواندن و تایپ شماره نیست.
          </div>
        </div>
      </div>

      <div class="step-box">
        <div class="step-number">✅</div>
        <div class="step-content">
          <div class="step-title">ثبت تماس بررسی‌شده (Check-Call)</div>
          <div class="step-desc">
            به محض اتمام تماس، روی مربع کنار سطر در کامپیوتر یا دکمه «ثبت تماس» در موبایل بزنید. سطر سبز می‌شود و شمارنده بالای صفحه پیشرفت شما را نشان می‌دهد.
          </div>
        </div>
      </div>

      <div class="step-box">
        <div class="step-number">💡</div>
        <div class="step-content">
          <div class="step-title">استراتژی و توصیه اختصاصی مکالمه</div>
          <div class="step-desc">
            برای هر مشتری، سامانه یادداشت قبلی، شغل، مبلغ پیشنهادی و توصیه مناسب جهت صحبت (مانند ارسال لینک درگاه یا آفر ویژه) را پیش از تماس به شما یادآوری می‌کند.
          </div>
        </div>
      </div>

      <div class="step-box">
        <div class="step-number">🔍</div>
        <div class="step-content">
          <div class="step-title">جستجوی زنده و فیلترهای هوشمند</div>
          <div class="step-desc">
            با تایپ بخشی از نام، شماره یا یادداشت، سطرها در کسری از ثانیه فیلتر می‌شوند. همچنین می‌توانید دکمه‌های «تایم‌ست امروز» یا «فقط در انتظار تماس» را فعال کنید.
          </div>
        </div>
      </div>
    </div>

    <h2>✨ وضعیت‌های رنگی مشتری در سیستم چیست؟</h2>
    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
      <span class="status-capsule status-timeset">⏰ زمان تعیین‌شده</span>
      <span class="status-capsule status-promise">💰 قول پرداخت</span>
      <span class="status-capsule status-new">⚡️ لید جدید</span>
      <span class="status-capsule status-nego">💬 در حال مذاکره</span>
      <span class="status-capsule status-paid">✅ پرداخت‌شده</span>
      <span class="status-capsule status-follow">🔄 پیگیری مجدد</span>
      <span class="status-capsule status-free">🎓 دوره رایگان</span>
      <span class="status-capsule status-noans">📵 عدم پاسخ</span>
    </div>

    <div class="alert-box warning">
      <strong>⚠️ توجه مهم برای کار با گوشی موبایل:</strong>
      صفحه داشبورد به طور خودکار سایز صفحه گوشی شما را تشخیص می‌دهد. در موبایل، به جای جدول شلوغ، کارت‌های بزرگ و لمسی به همراه <strong>دکمه بزرگ سبز تماس</strong> نمایش داده می‌شود که کار در حین حرکت را فوق‌العاده لذت‌بخش می‌کند.
    </div>

    <div class="footer-note">
      سامانه مدیریت صف تماس‌های فروش • صفحه ۲ از ۳
    </div>
  </div>

  <!-- ==================== PAGE 3 ==================== -->
  <div class="page">
    <header class="doc-header">
      <div class="brand-title">📋 راهنمای گام‌به‌گام روزانه و اتصال به گوگل شیت</div>
      <div class="meta-tag">روتین کاری کارشناسان فروش</div>
    </header>

    <h2>🗓 روتین روزانه پیشنهادی برای یک روز کاری پرفروش</h2>
    <p>برای دستیابی به بالاترین درصد تبدیل تماس به فروش، پیشنهاد می‌شود کارشناسان فروش الگوی زمانی زیر را دنبال کنند:</p>

    <div class="checklist-item">
      <span class="badge-time">۰۹:۰۰ تا ۱۰:۰۰</span>
      <strong>رسیدگی به قرارهای امروز صبح و معوقه‌ها:</strong> فیلتر «📅 تایم‌ست امروز» و «🚨 معوقه‌ها» را انتخاب کرده و با مشتریانی که منتظر تماس هستند گفتگو کنید.
    </div>

    <div class="checklist-item">
      <span class="badge-time">۱۰:۰۰ تا ۱۲:۳۰</span>
      <strong>پیگیری قول واریزی‌ها و لیدهای جدید (P1 و P2):</strong> با خریدارانی که قول پرداخت داده‌اند تماس بگیرید و لینک درگاه را ارسال نمایید.
    </div>

    <div class="checklist-item">
      <span class="badge-time">۱۳:۳۰ تا ۱۵:۰۰</span>
      <strong>تماس‌های برق‌آسا با لیدهای ورودی نو (Speed-to-Lead):</strong> لیدهای جدید امروز را قبل از آنکه سرد شوند پرزنت و نیازسنجی کنید.
    </div>

    <div class="checklist-item">
      <span class="badge-time">۱۵:۰۰ تا ۱۷:۰۰</span>
      <strong>تایم‌ست‌های عصر و مذاکرات در حال انجام:</strong> قرارهای هماهنگ‌شده بعدازظهر را در ساعت مقرر تماس گرفته و نهایی کنید.
    </div>

    <div class="checklist-item">
      <span class="badge-time">۱۷:۰۰ تا ۱۸:۰۰</span>
      <strong>تماس مجدد با عدم‌پاسخ‌ها و بررسی وضعیت روز:</strong> تغییر ساعت تماس برای لیدهایی که صبح پاسخ نداده بودند و مشاهده آمار کل تماس‌های بررسی‌شده.
    </div>

    <h2>📊 به‌روزرسانی خودکار ۱۰ دقیقه‌ای و فایل گوگل شیت</h2>
    <div class="grid-2">
      <div class="card">
        <div class="card-title">🔄 آپدیت خودکار هر ۱۰ دقیقه</div>
        <div class="card-desc">
          نیازی به رفرش مداوم یا درخواست از تیم فنی نیست. سیستم هر ۱۰ دقیقه خودش به پنل CRM وصل شده، نوبت‌ها را تازه می‌کند و اگر در حال کار با داشبورد باشید، اطلاعات جدید را پیش روی شما قرار می‌دهد.
        </div>
      </div>
      <div class="card">
        <div class="card-title">📈 گوگل شیت و فایل اکسل</div>
        <div class="card-desc">
          تمامی این اطلاعات با همان رنگ‌بندی‌های اولویت و ستون‌های منظم در گوگل شیت و فایل اکسل نیز قابل دریافت و ذخیره‌سازی است تا مدیران فروش به راحتی گزارش‌گیری کنند.
        </div>
      </div>
    </div>

    <h2>❓ سوالات متداول کارشناسان (FAQ)</h2>
    <div style="font-size: 8.5pt; color: #334155; line-height: 1.6;">
      <p style="margin-bottom: 6px;">
        <strong>۱. اگر مشتری گفت «الان جلسه هستم، فردا ساعت ۱۱ تماس بگیرید» چه کار کنم؟</strong><br>
        در CRM وضعیت او را روی <strong>زمان تعیین‌شده (TIME_SET)</strong> با تاریخ و ساعت هماهنگ‌شده فردا ثبت کنید. سیستم به طور خودکار فردا رأس ساعت ۱۱ او را در صدر صف تماس قرار خواهد داد.
      </p>
      <p style="margin-bottom: 6px;">
        <strong>۲. تفاوت فیلتر «فقط در انتظار تماس» با «همه» چیست؟</strong><br>
        فیلتر پیش‌فرض روی <strong>«فقط در انتظار تماس»</strong> تنظیم شده است تا پس از زدن تیک بررسی هر تماس، آن سطر مخفی شود و صفحه شما خلوت بماند و فقط تماس‌های باقی‌مانده را ببینید.
      </p>
      <p style="margin-bottom: 6px;">
        <strong>۳. چگونه داشبورد را در مرورگر باز کنیم؟</strong><br>
        کافیست در نوار آدرس مرورگر وارد کنید: <code style="background: #F1F5F9; padding: 2px 6px; border-radius: 4px; color: #4F46E5; font-weight: 700;">http://localhost:3000</code>
      </p>
    </div>

    <div class="alert-box" style="margin-top: 15px;">
      <strong>🌟 نتیجه‌گیری و اثر در فروش:</strong>
      رعایت دقیق این اولویت‌ها و تماس به موقع با تایم‌ست‌های امروز، زمان تلف‌شده پرسنل را به صفر رسانده و بهره‌وری تیم فروش را تا ۳ برابر ارتقا می‌بخشد.
    </div>

    <div class="footer-note">
      سامانه مدیریت صف تماس‌های فروش • صفحه ۳ از ۳ • تهیه شده برای تیم فروش
    </div>
  </div>

</body>
</html>`;

const htmlFilePath = path.resolve('crm-sales-guide.html');
const pdfFilePathEn = path.resolve('crm-sales-guide.pdf');
const pdfFilePathFa = path.resolve('راهنمای_سامانه_مدیریت_تماس_فروش.pdf');

fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('✅ HTML generated:', htmlFilePath);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const args = [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${pdfFilePathEn}`,
  htmlFilePath
];

console.log('⏳ Exporting PDF using Microsoft Edge...');

execFile(edgePath, args, (err) => {
  if (err) {
    console.error('❌ PDF generation failed:', err);
    process.exit(1);
  }

  if (fs.existsSync(pdfFilePathEn)) {
    // Also copy to Persian named PDF file
    fs.copyFileSync(pdfFilePathEn, pdfFilePathFa);
    console.log('🎉 PDF exported successfully!');
    console.log('   📄 English Filename:', pdfFilePathEn);
    console.log('   📄 Persian Filename:', pdfFilePathFa);
    const stats = fs.statSync(pdfFilePathEn);
    console.log(`   📊 File Size: ${(stats.size / 1024).toFixed(1)} KB`);
  } else {
    console.error('❌ PDF file was not created.');
    process.exit(1);
  }
});
