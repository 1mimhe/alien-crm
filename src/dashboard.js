/**
 * Responsive Persian Web Dashboard for Call Planning
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
  <title>داشبورد هوشمند برنامه‌ریزی تماس‌های کارتابل | هوشا CRM</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0F172A;
      --card-bg: #1E293B;
      --card-border: #334155;
      --text: #F8FAFC;
      --text-muted: #94A3B8;
      --primary: #3B82F6;
      --primary-hover: #2563EB;
      --success: #10B981;
      --warning: #F59E0B;
      --danger: #EF4444;
      --p1-bg: rgba(239, 68, 68, 0.15);
      --p1-border: #EF4444;
      --p2-bg: rgba(249, 115, 22, 0.15);
      --p2-border: #F97316;
      --p3-bg: rgba(59, 130, 246, 0.15);
      --p3-border: #3B82F6;
      --p4-bg: rgba(16, 185, 129, 0.15);
      --p4-border: #10B981;
      --p5-bg: rgba(148, 163, 184, 0.15);
      --p5-border: #64748B;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Vazirmatn', system-ui, -apple-system, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 24px;
      min-height: 100vh;
    }

    .container {
      max-width: 1440px;
      margin: 0 auto;
    }

    /* Header */
    header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--card-border);
    }

    .title-group h1 {
      font-size: 1.6rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .title-group p {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }

    .btn-primary {
      background-color: #2563EB;
      color: #FFFFFF;
    }
    .btn-primary:hover {
      background-color: #1D4ED8;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
    }

    .btn-success {
      background-color: #059669;
      color: #FFFFFF;
    }
    .btn-success:hover {
      background-color: #047857;
      box-shadow: 0 4px 14px rgba(5, 150, 105, 0.4);
    }

    .btn-outline {
      background-color: var(--card-bg);
      color: var(--text);
      border-color: var(--card-border);
    }
    .btn-outline:hover {
      background-color: #334155;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }

    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 18px 20px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .stat-card::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 3px;
    }

    .stat-card.total::before { background: #94A3B8; }
    .stat-card.p1::before { background: var(--danger); }
    .stat-card.p2::before { background: var(--warning); }
    .stat-card.p3::before { background: var(--primary); }
    .stat-card.amount::before { background: var(--success); }

    .stat-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: 800;
      margin-top: 6px;
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .stat-desc {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-top: 4px;
    }

    /* Filter & Search Bar */
    .toolbar {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 16px 20px;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .search-box {
      flex: 1;
      min-width: 260px;
      max-width: 400px;
      position: relative;
    }

    .search-box input {
      width: 100%;
      background: #0F172A;
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 10px 14px 10px 40px;
      color: var(--text);
      font-family: inherit;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
    }

    .search-box input:focus {
      border-color: var(--primary);
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
    }

    .filter-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-btn {
      background: #0F172A;
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }

    .filter-btn.active, .filter-btn:hover {
      background: #334155;
      color: #FFFFFF;
      border-color: #64748B;
    }

    /* Calls Table */
    .table-wrapper {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      overflow-x: auto;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: right;
      font-size: 0.88rem;
    }

    th {
      background: #182234;
      color: var(--text-muted);
      font-weight: 600;
      padding: 14px 16px;
      white-space: nowrap;
      border-bottom: 1px solid var(--card-border);
    }

    td {
      padding: 14px 16px;
      border-bottom: 1px solid #243247;
      vertical-align: middle;
    }

    tr:hover td {
      background: #243248;
    }

    /* Badges */
    .priority-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.8rem;
    }

    .badge-p1 { background: var(--p1-bg); color: #F87171; border: 1px solid var(--p1-border); }
    .badge-p2 { background: var(--p2-bg); color: #FB923C; border: 1px solid var(--p2-border); }
    .badge-p3 { background: var(--p3-bg); color: #60A5FA; border: 1px solid var(--p3-border); }
    .badge-p4 { background: var(--p4-bg); color: #34D399; border: 1px solid var(--p4-border); }
    .badge-p5 { background: var(--p5-bg); color: #94A3B8; border: 1px solid var(--p5-border); }

    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 0.76rem;
      background: #334155;
      color: #E2E8F0;
    }

    .call-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #10B981;
      color: #FFFFFF;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.84rem;
      transition: background 0.2s;
    }

    .call-btn:hover {
      background: #059669;
    }

    .strategy-text {
      max-width: 320px;
      font-size: 0.82rem;
      line-height: 1.5;
      color: #CBD5E1;
    }

    .text-sm {
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    .toast {
      position: fixed;
      bottom: 24px;
      left: 24px;
      padding: 14px 20px;
      background: #1E293B;
      color: #FFFFFF;
      border: 1px solid var(--card-border);
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      display: none;
      z-index: 100;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      body { padding: 12px; }
      header { flex-direction: column; align-items: flex-start; }
      .action-buttons { width: 100%; }
      .btn { flex: 1; justify-content: center; }
      .toolbar { flex-direction: column; align-items: stretch; }
      .search-box { max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="title-group">
        <h1>🎯 برنامه‌ریزی هوشمند تماس‌های کارتابل</h1>
        <p>اولویت‌بندی لیدهای فروش، تماس‌های زمان‌دار و وصول مطالبات CRM هوشا</p>
      </div>
      <div class="action-buttons">
        <button id="syncBtn" class="btn btn-primary" onclick="syncWithGoogleSheet()">
          🔄 همگام‌سازی فوری با گوگل شیت
        </button>
        <a href="/export/csv" class="btn btn-outline">
          📥 دانلود فایل اکسل (CSV)
        </a>
        <a href="/api/calls" target="_blank" class="btn btn-outline">
          ⚡ خروجی JSON API
        </a>
      </div>
    </header>

    <!-- KPI Summary Cards -->
    <div class="stats-grid">
      <div class="stat-card total">
        <div class="stat-label">کل لیدهای در صف تماس</div>
        <div class="stat-value">${totalCount.toLocaleString("fa-IR")} <span class="stat-desc">مخاطب</span></div>
        <div class="stat-desc">پالایش و اولویت‌بندی شده</div>
      </div>
      <div class="stat-card p1">
        <div class="stat-label">اولویت ۱ (فوری و حیاتی)</div>
        <div class="stat-value" style="color: #F87171;">${p1Count.toLocaleString("fa-IR")} <span class="stat-desc">تماس</span></div>
        <div class="stat-desc">زمان تعیین‌شده یا قول واریز</div>
      </div>
      <div class="stat-card p2">
        <div class="stat-label">اولویت ۲ (فرصت‌های داغ)</div>
        <div class="stat-value" style="color: #FB923C;">${p2Count.toLocaleString("fa-IR")} <span class="stat-desc">تماس</span></div>
        <div class="stat-desc">ثبت‌نام مجدد و مذاکره بالا</div>
      </div>
      <div class="stat-card p3">
        <div class="stat-label">اولویت ۳ (لیدهای تازه)</div>
        <div class="stat-value" style="color: #60A5FA;">${p3Count.toLocaleString("fa-IR")} <span class="stat-desc">تماس</span></div>
        <div class="stat-desc">نیاز به تماس سریع اولیه</div>
      </div>
      <div class="stat-card amount">
        <div class="stat-label">ارزش مبالغ پیشنهادی / اقساط</div>
        <div class="stat-value" style="color: #34D399; font-size: 1.4rem;">${formattedTotalAmount}</div>
        <div class="stat-desc">پتانسیل فروش در صف تماس</div>
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="toolbar">
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="جستجو بر اساس نام، شماره یا یادداشت..." onkeyup="filterTable()">
        <span class="search-icon">🔍</span>
      </div>
      <div class="filter-tags">
        <button class="filter-btn active" onclick="setPriorityFilter('ALL')">همه (${totalCount})</button>
        <button class="filter-btn" onclick="setPriorityFilter('P1')">🚨 P1 فوری (${p1Count})</button>
        <button class="filter-btn" onclick="setPriorityFilter('P2')">🔥 P2 داغ (${p2Count})</button>
        <button class="filter-btn" onclick="setPriorityFilter('P3')">⚡ P3 تازه (${p3Count})</button>
        <button class="filter-btn" onclick="setPriorityFilter('P4')">🌱 P4 معمول (${p4Count})</button>
        <button class="filter-btn" onclick="setPriorityFilter('P5')">❄️ P5 پایین (${p5Count})</button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table id="callsTable">
        <thead>
          <tr>
            <th>ردیف</th>
            <th>اولویت</th>
            <th>امتیاز</th>
            <th>نام و مخاطب</th>
            <th>شماره تلفن / اقدام سریع</th>
            <th>وضعیت</th>
            <th>دسته‌بندی</th>
            <th>موعد تماس</th>
            <th>استراتژی و توصیه مکالمه</th>
            <th>مبلغ / اقساط</th>
            <th>منبع لید</th>
          </tr>
        </thead>
        <tbody>
          ${calls
            .map(
              (call, idx) => `
            <tr data-priority="${call.priorityCode}" data-search="${(call.fullName + " " + call.phone + " " + call.nextActionNote + " " + call.strategy).toLowerCase()}">
              <td style="text-align: center; color: var(--text-muted);">${(idx + 1).toLocaleString("fa-IR")}</td>
              <td>
                <span class="priority-badge badge-${call.priorityCode.toLowerCase()}">
                  ${call.priorityCode} - ${call.priorityName}
                </span>
              </td>
              <td style="text-align: center; font-weight: 700;">${call.score}</td>
              <td>
                <div style="font-weight: 700;">${call.fullName}</div>
                <div class="text-sm">${call.persona !== "-" ? call.persona : ""}</div>
              </td>
              <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <a href="${call.phoneDialUrl}" class="call-btn" title="شماره‌گیری فوری">
                    📞 ${call.phone}
                  </a>
                </div>
              </td>
              <td>
                <span class="status-badge">${call.status}</span>
              </td>
              <td class="text-sm">${call.categoryName}</td>
              <td>
                <div style="font-weight: 600; color: #E2E8F0;">${call.nextActionDueAtFormatted}</div>
                ${call.nextActionNote !== "-" ? `<div class="text-sm" style="color: #93C5FD;">📝 ${call.nextActionNote}</div>` : ""}
              </td>
              <td>
                <div class="strategy-text">${call.strategy}</div>
              </td>
              <td style="white-space: nowrap; font-weight: 600; color: #A7F3D0;">
                ${call.proposedAmountFormatted !== "-" ? call.proposedAmountFormatted : call.balanceFormatted}
              </td>
              <td class="text-sm" style="max-width: 140px;">
                ${call.source}
                <div style="color: #64748B;">${call.poolName}</div>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </div>

  <div id="toast" class="toast"></div>

  <script>
    let currentPriority = 'ALL';

    function setPriorityFilter(priority) {
      currentPriority = priority;
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      filterTable();
    }

    function filterTable() {
      const search = document.getElementById('searchInput').value.toLowerCase().trim();
      const rows = document.querySelectorAll('#callsTable tbody tr');

      rows.forEach(row => {
        const rowPriority = row.getAttribute('data-priority');
        const rowSearch = row.getAttribute('data-search');

        const matchesPriority = (currentPriority === 'ALL' || rowPriority === currentPriority);
        const matchesSearch = (!search || rowSearch.includes(search));

        if (matchesPriority && matchesSearch) {
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
          showToast('✅ اطلاعات با موفقیت در گوگل شیت به‌روزرسانی شد.');
        } else {
          showToast('❌ خطا در همگام‌سازی: ' + (result.error || 'بررسی لاگ ورکر'));
        }
      } catch (err) {
        showToast('❌ خطا در ارتباط با سرور: ' + err.message);
      } finally {
        btn.disabled = false;
        btn.innerHTML = '🔄 همگام‌سازی فوری با گوگل شیت';
      }
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.innerText = msg;
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 4000);
    }
  </script>
</body>
</html>`;
}
