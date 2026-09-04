/**
 * CRM Call Planner - Ultra-Modern Persian RTL Dashboard
 * Built for sales excellence, speed-to-lead, and seamless calling workflows.
 */

export function renderDashboardHtml(calls, stats, config) {
  const p1Count = stats.p1 || 0;
  const p2Count = stats.p2 || 0;
  const p3Count = stats.p3 || 0;
  const p4Count = stats.p4 || 0;
  const p5Count = stats.p5 || 0;
  const totalCount = calls.length;

  const totalAmount = calls.reduce((acc, c) => acc + (c.proposedAmount || 0) + (c.balance || 0), 0);
  const formattedTotalAmount = totalAmount > 0 ? Number(totalAmount).toLocaleString("fa-IR") + " تومان" : "۰ تومان";

  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>میز کار هوشمند برنامه‌ریزی تماس‌های فروش | CRM Call Planner</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090D16;
      --card-bg: #111827;
      --card-elevated: #1F2937;
      --border: rgba(255, 255, 255, 0.08);
      --border-hover: rgba(255, 255, 255, 0.18);
      --text: #F9FAFB;
      --text-muted: #9CA3AF;
      --text-sub: #6B7280;
      
      --p1: #EF4444;
      --p1-bg: rgba(239, 68, 68, 0.12);
      --p1-glow: rgba(239, 68, 68, 0.35);

      --p2: #F97316;
      --p2-bg: rgba(249, 115, 22, 0.12);
      
      --p3: #3B82F6;
      --p3-bg: rgba(59, 130, 246, 0.12);
      
      --p4: #10B981;
      --p4-bg: rgba(16, 185, 129, 0.12);
      
      --p5: #6B7280;
      --p5-bg: rgba(107, 114, 128, 0.12);

      --accent: #6366F1;
      --accent-hover: #4F46E5;
      --emerald: #059669;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      font-family: 'Vazirmatn', system-ui, -apple-system, sans-serif;
      background-color: var(--bg);
      background-image: 
        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.08) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.05) 0px, transparent 50%);
      background-attachment: fixed;
      color: var(--text);
      line-height: 1.6;
      padding: 24px;
      min-height: 100vh;
    }

    .container {
      max-width: 1480px;
      margin: 0 auto;
    }

    /* Top Navbar */
    .navbar {
      background: rgba(17, 24, 39, 0.7);
      backdrop-filter: blur(16px);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 16px 24px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand-icon {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 4px 16px rgba(79, 70, 229, 0.35);
    }

    .brand-text h1 {
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-text p {
      font-size: 0.8rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 2px;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
      display: inline-block;
      box-shadow: 0 0 10px #10B981;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .clock-badge {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 8px 14px;
      font-size: 0.84rem;
      color: #94A3B8;
      font-family: monospace;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 12px;
      font-size: 0.88rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid transparent;
      user-select: none;
    }

    .btn-sync {
      background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
      color: #FFFFFF;
      box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
    }
    .btn-sync:hover {
      background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
    }

    .btn-ghost {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text);
      border: 1px solid var(--border);
    }
    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--border-hover);
      transform: translateY(-1px);
    }

    /* Error Alert */
    .alert-banner {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #FCA5A5;
      border-radius: 14px;
      padding: 14px 20px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 0.9rem;
      animation: fadeIn 0.3s ease;
    }

    /* KPI Metrics Cards */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .metric-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .metric-card:hover {
      transform: translateY(-3px);
      border-color: var(--border-hover);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
    }

    .metric-card::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 3px;
    }

    .metric-card.total::after { background: linear-gradient(90deg, #94A3B8, #64748B); }
    .metric-card.p1::after { background: linear-gradient(90deg, #EF4444, #DC2626); }
    .metric-card.p2::after { background: linear-gradient(90deg, #F97316, #EA580C); }
    .metric-card.p3::after { background: linear-gradient(90deg, #3B82F6, #2563EB); }
    .metric-card.amount::after { background: linear-gradient(90deg, #10B981, #059669); }

    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--text-muted);
      font-size: 0.82rem;
      font-weight: 500;
    }

    .metric-icon {
      font-size: 1.25rem;
    }

    .metric-value {
      font-size: 2rem;
      font-weight: 900;
      margin: 10px 0 4px;
      display: flex;
      align-items: baseline;
      gap: 6px;
      letter-spacing: -0.02em;
    }

    .metric-sub {
      font-size: 0.76rem;
      color: var(--text-sub);
    }

    /* Control Bar */
    .control-bar {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px 20px;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .search-wrapper {
      flex: 1;
      min-width: 280px;
      max-width: 440px;
      position: relative;
    }

    .search-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 11px 40px 11px 16px;
      color: var(--text);
      font-family: inherit;
      font-size: 0.88rem;
      outline: none;
      transition: all 0.2s;
    }

    .search-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
      background: #0F172A;
    }

    .search-icon {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
      font-size: 0.95rem;
    }

    .filter-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .pill-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 7px 14px;
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .pill-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #FFFFFF;
      border-color: var(--border-hover);
    }

    .pill-btn.active {
      background: var(--card-elevated);
      color: #FFFFFF;
      border-color: var(--accent);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .pill-count {
      background: rgba(255, 255, 255, 0.1);
      padding: 1px 6px;
      border-radius: 6px;
      font-size: 0.72rem;
    }

    .select-dropdown {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--text);
      padding: 8px 14px;
      font-family: inherit;
      font-size: 0.84rem;
      outline: none;
      cursor: pointer;
    }

    /* Leads Table */
    .table-container {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .table-scroll {
      overflow-x: auto;
      max-height: 72vh;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: right;
      font-size: 0.86rem;
    }

    thead th {
      background: #151D2C;
      color: var(--text-muted);
      font-weight: 600;
      font-size: 0.8rem;
      padding: 15px 16px;
      white-space: nowrap;
      position: sticky;
      top: 0;
      z-index: 10;
      border-bottom: 1px solid var(--border);
    }

    tbody tr {
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      transition: background 0.15s ease;
    }

    tbody tr:hover {
      background: rgba(255, 255, 255, 0.03);
    }

    tbody td {
      padding: 14px 16px;
      vertical-align: middle;
    }

    /* Lead Column */
    .lead-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar-initial {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #374151 0%, #1F2937 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.88rem;
      color: #E2E8F0;
      flex-shrink: 0;
    }

    .lead-name {
      font-weight: 700;
      color: var(--text);
      font-size: 0.92rem;
    }

    .lead-persona {
      font-size: 0.74rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    /* Priority Badges */
    .p-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.78rem;
      white-space: nowrap;
    }

    .p-badge.p1 { background: var(--p1-bg); color: #F87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .p-badge.p2 { background: var(--p2-bg); color: #FB923C; border: 1px solid rgba(249, 115, 22, 0.3); }
    .p-badge.p3 { background: var(--p3-bg); color: #60A5FA; border: 1px solid rgba(59, 130, 246, 0.3); }
    .p-badge.p4 { background: var(--p4-bg); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .p-badge.p5 { background: var(--p5-bg); color: #9CA3AF; border: 1px solid rgba(156, 163, 175, 0.3); }

    /* Phone & Call CTA */
    .dial-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-call {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      color: #FFFFFF;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.82rem;
      box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
      transition: all 0.2s;
      white-space: nowrap;
    }

    .btn-call:hover {
      background: linear-gradient(135deg, #34D399 0%, #10B981 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.45);
    }

    .btn-copy {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 7px 10px;
      border-radius: 8px;
      font-size: 0.78rem;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }

    .btn-copy:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #FFFFFF;
    }

    /* Strategy Card */
    .strategy-box {
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 8px 12px;
      max-width: 320px;
      font-size: 0.78rem;
      line-height: 1.5;
      color: #E2E8F0;
      position: relative;
    }

    .strategy-icon {
      color: #FBBF24;
      margin-left: 4px;
    }

    /* Amount Tag */
    .amount-tag {
      font-weight: 700;
      color: #34D399;
      font-size: 0.88rem;
      white-space: nowrap;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-card {
      background: #151D2C;
      border: 1px solid var(--border);
      border-radius: 20px;
      max-width: 580px;
      width: 100%;
      padding: 28px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      position: relative;
      animation: modalPop 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes modalPop {
      0% { transform: scale(0.95); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    .modal-close {
      position: absolute;
      top: 20px;
      left: 20px;
      background: rgba(255, 255, 255, 0.05);
      border: none;
      color: var(--text-muted);
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-close:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #FFFFFF;
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 28px;
      left: 28px;
      padding: 14px 22px;
      background: #1F2937;
      color: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 14px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      display: none;
      z-index: 2000;
      font-size: 0.9rem;
      font-weight: 500;
      align-items: center;
      gap: 10px;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      0% { transform: translateY(20px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }

    @media (max-width: 900px) {
      body { padding: 14px; }
      .navbar { padding: 16px; flex-direction: column; align-items: flex-start; }
      .nav-actions { width: 100%; justify-content: stretch; }
      .nav-actions .btn { flex: 1; justify-content: center; }
      .control-bar { flex-direction: column; align-items: stretch; }
      .search-wrapper { max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Top Navigation -->
    <header class="navbar">
      <div class="brand">
        <div class="brand-icon">📞</div>
        <div class="brand-text">
          <h1>میز کار هوشمند تماس‌های فروش</h1>
          <p>
            <span class="live-dot"></span>
            سامانه رتبه‌بندی اولویت‌ها و همگام‌سازی لحظه‌ای گوگل شیت
          </p>
        </div>
      </div>
      <div class="nav-actions">
        <div class="clock-badge" id="liveClock">--:--:--</div>
        <button id="syncBtn" class="btn btn-sync" onclick="syncWithGoogleSheet()">
          🔄 همگام‌سازی فوری با گوگل شیت
        </button>
        <a href="/export/csv" class="btn btn-ghost" title="دانلود فایل اکسل">
          📥 اکسل (CSV)
        </a>
        <a href="/api/calls" target="_blank" class="btn btn-ghost" title="خروجی JSON API">
          ⚡ API
        </a>
      </div>
    </header>

    <!-- Error Alert if any -->
    ${config && config.error ? `
      <div class="alert-banner">
        <span style="font-size: 1.4rem;">⚠️</span>
        <div>
          <strong>وضعیت اتصال به سامانه CRM:</strong> ${config.error}
          <div style="font-size: 0.78rem; color: #FCA5A5; margin-top: 3px;">
            سیستم به صورت خودکار هر ۱۰ دقیقه یک‌بار مجدداً اتصال را بررسی کرده و در صورت انقضای توکن، لاگین خودکار انجام می‌دهد.
          </div>
        </div>
      </div>
    ` : ""}

    <!-- KPI Metric Cards -->
    <section class="metrics-grid">
      <div class="metric-card total" onclick="setPriorityFilter('ALL')">
        <div class="metric-header">
          <span>کل صف تماس فعال</span>
          <span class="metric-icon">📋</span>
        </div>
        <div class="metric-value">${totalCount.toLocaleString("fa-IR")} <span class="metric-sub">مخاطب</span></div>
        <div class="metric-sub">تمام لیدهای تجمیع و پاکسازی شده</div>
      </div>

      <div class="metric-card p1" onclick="setPriorityFilter('P1')">
        <div class="metric-header">
          <span>P1 فوری و حیاتی</span>
          <span class="metric-icon">🚨</span>
        </div>
        <div class="metric-value" style="color: #F87171;">${p1Count.toLocaleString("fa-IR")} <span class="metric-sub">تماس</span></div>
        <div class="metric-sub">زمان تعیین‌شده یا قول واریز قطعی</div>
      </div>

      <div class="metric-card p2" onclick="setPriorityFilter('P2')">
        <div class="metric-header">
          <span>P2 فرصت‌های داغ</span>
          <span class="metric-icon">🔥</span>
        </div>
        <div class="metric-value" style="color: #FB923C;">${p2Count.toLocaleString("fa-IR")} <span class="metric-sub">تماس</span></div>
        <div class="metric-sub">ثبت‌نام مجدد یا مذاکره پیشرفته</div>
      </div>

      <div class="metric-card p3" onclick="setPriorityFilter('P3')">
        <div class="metric-header">
          <span>P3 لیدهای تازه</span>
          <span class="metric-icon">⚡</span>
        </div>
        <div class="metric-value" style="color: #60A5FA;">${p3Count.toLocaleString("fa-IR")} <span class="metric-sub">تماس</span></div>
        <div class="metric-sub">تماس سریع اولیه (Speed to Lead)</div>
      </div>

      <div class="metric-card amount">
        <div class="metric-header">
          <span>ارزش ریالی در انتظار پیگیری</span>
          <span class="metric-icon">💎</span>
        </div>
        <div class="metric-value" style="color: #34D399; font-size: 1.45rem;">${formattedTotalAmount}</div>
        <div class="metric-sub">پتانسیل مالی قابل وصول در صف تماس</div>
      </div>
    </section>

    <!-- Filter & Search Toolbar -->
    <div class="control-bar">
      <div class="search-wrapper">
        <input type="text" id="searchInput" class="search-input" placeholder="جستجوی هوشمند نام، شماره، یادداشت یا منبع..." oninput="applyFilters()">
        <span class="search-icon">🔍</span>
      </div>

      <div class="filter-pills">
        <button class="pill-btn active" onclick="setPriorityFilter('ALL')">
          همه <span class="pill-count">${totalCount}</span>
        </button>
        <button class="pill-btn" onclick="setPriorityFilter('P1')">
          🚨 P1 فوری <span class="pill-count">${p1Count}</span>
        </button>
        <button class="pill-btn" onclick="setPriorityFilter('P2')">
          🔥 P2 داغ <span class="pill-count">${p2Count}</span>
        </button>
        <button class="pill-btn" onclick="setPriorityFilter('P3')">
          ⚡ P3 تازه <span class="pill-count">${p3Count}</span>
        </button>
        <button class="pill-btn" onclick="setPriorityFilter('P4')">
          🌱 P4 معمول <span class="pill-count">${p4Count}</span>
        </button>
        <button class="pill-btn" onclick="setPriorityFilter('P5')">
          ❄️ P5 سرد <span class="pill-count">${p5Count}</span>
        </button>
      </div>

      <div>
        <select id="categorySelect" class="select-dropdown" onchange="applyFilters()">
          <option value="ALL">همه دسته‌بندی‌ها</option>
          <option value="timeSet">زمان تعیین‌شده</option>
          <option value="followUp">پیگیری و مذاکره</option>
          <option value="balanceLeads">وصول مطالبات / اقساط</option>
          <option value="reRegConflict">ثبت‌نام مجدد</option>
          <option value="notCalled">لید جدید بدون تماس</option>
          <option value="freeCourse">دوره رایگان</option>
          <option value="noAnswer">عدم پاسخ</option>
        </select>
      </div>
    </div>

    <!-- Table Container -->
    <div class="table-container">
      <div class="table-scroll">
        <table id="callsTable">
          <thead>
            <tr>
              <th style="width: 50px; text-align: center;">ردیف</th>
              <th>اولویت</th>
              <th style="text-align: center;">امتیاز</th>
              <th>نام و پرسونا</th>
              <th>شماره تماس و اقدام سریع</th>
              <th>وضعیت</th>
              <th>موعد تماس</th>
              <th>استراتژی و توصیه مکالمه</th>
              <th>ارزش پیشنهادی</th>
              <th>منبع لید</th>
              <th style="text-align: center;">جزئیات</th>
            </tr>
          </thead>
          <tbody>
            ${calls
              .map(
                (call, idx) => `
              <tr data-priority="${call.priorityCode}" data-category="${call.categoryKey}" data-search="${(call.fullName + ' ' + call.phone + ' ' + call.nextActionNote + ' ' + call.source + ' ' + call.strategy).toLowerCase()}">
                <td style="text-align: center; color: var(--text-sub); font-weight: 600;">${(idx + 1).toLocaleString('fa-IR')}</td>
                <td>
                  <span class="p-badge ${call.priorityCode.toLowerCase()}">
                    ${call.priorityCode} • ${call.priorityName}
                  </span>
                </td>
                <td style="text-align: center; font-weight: 800; color: #F1F5F9;">
                  ${call.score}
                </td>
                <td>
                  <div class="lead-info">
                    <div class="avatar-initial">${call.fullName ? call.fullName.charAt(0) : '؟'}</div>
                    <div>
                      <div class="lead-name">${call.fullName}</div>
                      <div class="lead-persona">${call.persona !== '-' ? call.persona : 'بدون برچسب شغلی'}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="dial-group">
                    <a href="${call.phoneDialUrl}" class="btn-call" title="تماس تلفنی مستقیم">
                      📞 ${call.phone}
                    </a>
                    <button class="btn-copy" onclick="copyToClipboard('${call.phone}', this)" title="کپی شماره">
                      📋
                    </button>
                  </div>
                </td>
                <td>
                  <span style="font-size: 0.78rem; background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 6px; color: #CBD5E1;">
                    ${call.status}
                  </span>
                </td>
                <td>
                  <div style="font-weight: 600; color: #E2E8F0; font-size: 0.82rem;">${call.nextActionDueAtFormatted}</div>
                  ${call.nextActionNote !== '-' ? `<div style="font-size: 0.74rem; color: #93C5FD; margin-top: 2px;">📝 ${call.nextActionNote}</div>` : ''}
                </td>
                <td>
                  <div class="strategy-box">
                    <span class="strategy-icon">💡</span>
                    ${call.strategy}
                  </div>
                </td>
                <td>
                  <div class="amount-tag">
                    ${call.proposedAmountFormatted !== '-' ? call.proposedAmountFormatted : call.balanceFormatted}
                  </div>
                </td>
                <td>
                  <div style="font-size: 0.8rem; color: #CBD5E1;">${call.source}</div>
                  <div style="font-size: 0.72rem; color: var(--text-sub);">${call.poolName}</div>
                </td>
                <td style="text-align: center;">
                  <button class="btn-copy" onclick="showLeadDetails(${JSON.stringify(call).replace(/"/g, '&quot;')})" title="مشاهده پرونده کامل">
                    👁️
                  </button>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Lead Detail Modal -->
  <div id="leadModal" class="modal-overlay" onclick="closeModal(event)">
    <div class="modal-card" onclick="event.stopPropagation()">
      <button class="modal-close" onclick="closeModal()">✕</button>
      <div id="modalContent"></div>
    </div>
  </div>

  <!-- Notification Toast -->
  <div id="toast" class="toast">
    <span id="toastIcon">✅</span>
    <span id="toastMsg">عملیات با موفقیت انجام شد</span>
  </div>

  <script>
    let activePriority = 'ALL';

    // Live Clock Update
    function updateClock() {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('fa-IR', {
        timeZone: 'Asia/Tehran',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);
      document.getElementById('liveClock').innerText = '🇮🇷 ' + timeStr;
    }
    setInterval(updateClock, 1000);
    updateClock();

    function setPriorityFilter(priority) {
      activePriority = priority;
      document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
      const buttons = document.querySelectorAll('.pill-btn');
      for (const b of buttons) {
        if (b.innerText.includes(priority) || (priority === 'ALL' && b.innerText.includes('همه'))) {
          b.classList.add('active');
          break;
        }
      }
      applyFilters();
    }

    function applyFilters() {
      const search = document.getElementById('searchInput').value.toLowerCase().trim();
      const cat = document.getElementById('categorySelect').value;
      const rows = document.querySelectorAll('#callsTable tbody tr');

      rows.forEach(row => {
        const rowPriority = row.getAttribute('data-priority');
        const rowCategory = row.getAttribute('data-category');
        const rowSearch = row.getAttribute('data-search');

        const matchesPriority = (activePriority === 'ALL' || rowPriority === activePriority);
        const matchesCategory = (cat === 'ALL' || rowCategory === cat);
        const matchesSearch = (!search || rowSearch.includes(search));

        if (matchesPriority && matchesCategory && matchesSearch) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }

    async function syncWithGoogleSheet() {
      const btn = document.getElementById('syncBtn');
      btn.disabled = true;
      btn.innerHTML = '⏳ در حال همگام‌سازی...';

      try {
        const res = await fetch('/sync', { method: 'POST' });
        const result = await res.json();

        if (result.success) {
          showToast('✅ اطلاعات با موفقیت در گوگل شیت درج و به‌روزرسانی شد.', 'success');
        } else {
          showToast('❌ خطا در همگام‌سازی: ' + (result.error || 'بررسی لاگ ورکر'), 'error');
        }
      } catch (err) {
        showToast('❌ خطا در ارتباط با سرور: ' + err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '🔄 همگام‌سازی فوری با گوگل شیت';
      }
    }

    function copyToClipboard(text, el) {
      navigator.clipboard.writeText(text).then(() => {
        const original = el.innerHTML;
        el.innerHTML = '✓';
        el.style.color = '#34D399';
        showToast('📋 شماره ' + text + ' کپی شد.', 'info');
        setTimeout(() => {
          el.innerHTML = original;
          el.style.color = '';
        }, 1800);
      });
    }

    function showLeadDetails(lead) {
      const modal = document.getElementById('leadModal');
      const content = document.getElementById('modalContent');

      content.innerHTML = \`
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
          <div class="avatar-initial" style="width: 48px; height: 48px; font-size: 1.2rem;">\${lead.fullName ? lead.fullName.charAt(0) : '؟'}</div>
          <div>
            <h2 style="font-size: 1.2rem; font-weight: 800;">\${lead.fullName}</h2>
            <div style="font-size: 0.8rem; color: var(--text-muted);">\${lead.persona}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; font-size: 0.85rem;">
          <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 10px;">
            <div style="color: var(--text-sub); font-size: 0.75rem;">شماره تماس:</div>
            <div style="font-weight: 700; margin-top: 3px;"><a href="\${lead.phoneDialUrl}" style="color: #34D399; text-decoration: none;">📞 \${lead.phone}</a></div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 10px;">
            <div style="color: var(--text-sub); font-size: 0.75rem;">سطح اولویت:</div>
            <div style="font-weight: 700; margin-top: 3px; color: \${lead.priorityColor};">\${lead.priorityCode} - \${lead.priorityName} (امتیاز: \${lead.score})</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 10px;">
            <div style="color: var(--text-sub); font-size: 0.75rem;">وضعیت فعلی:</div>
            <div style="font-weight: 700; margin-top: 3px;">\${lead.status} (\${lead.categoryName})</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 10px;">
            <div style="color: var(--text-sub); font-size: 0.75rem;">مبلغ پیشنهادی / باقیمانده:</div>
            <div style="font-weight: 700; margin-top: 3px; color: #34D399;">\${lead.proposedAmountFormatted !== '-' ? lead.proposedAmountFormatted : lead.balanceFormatted}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 10px;">
            <div style="color: var(--text-sub); font-size: 0.75rem;">منبع و استخر:</div>
            <div style="font-weight: 600; margin-top: 3px;">\${lead.source} (\${lead.poolName})</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 10px;">
            <div style="color: var(--text-sub); font-size: 0.75rem;">تعداد عدم پاسخ:</div>
            <div style="font-weight: 600; margin-top: 3px;">\${lead.noAnswerCount} بار</div>
          </div>
        </div>

        <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: 12px; padding: 14px; margin-bottom: 20px;">
          <div style="font-weight: 700; color: #A5B4FC; font-size: 0.84rem; margin-bottom: 6px;">💡 استراتژی و اسکریپت پیشنهادی تماس:</div>
          <div style="font-size: 0.82rem; line-height: 1.6; color: #E0E7FF;">\${lead.strategy}</div>
        </div>

        \${lead.nextActionNote !== '-' ? \`
          <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 12px; margin-bottom: 20px;">
            <div style="color: var(--text-sub); font-size: 0.75rem;">یادداشت قبلی:</div>
            <div style="font-size: 0.82rem; color: #93C5FD; margin-top: 4px;">📝 \${lead.nextActionNote}</div>
          </div>
        \` : ''}

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <a href="\${lead.phoneDialUrl}" class="btn btn-call" style="font-size: 0.9rem; padding: 10px 20px;">
            📞 برقراری تماس تلفنی
          </a>
        </div>
      \`;

      modal.style.display = 'flex';
    }

    function closeModal() {
      document.getElementById('leadModal').style.display = 'none';
    }

    function showToast(msg, type = 'info') {
      const toast = document.getElementById('toast');
      const icon = document.getElementById('toastIcon');
      const text = document.getElementById('toastMsg');

      icon.innerText = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
      text.innerText = msg;

      toast.style.display = 'flex';
      setTimeout(() => { toast.style.display = 'none'; }, 4000);
    }
  </script>
</body>
</html>`;
}
