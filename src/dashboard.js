/**
 * CRM Call Planner - Ultra-Modern Persian RTL Dashboard
 * Designed for Desktop & Mobile Phone Excellence, Date-Aware Calling, Check-Call Tracking & 100% Pure Persian UI
 */

/**
 * Render gorgeous, modern status badges with distinctive colors, icons and no wrapping
 */
export function renderStatusBadge(status, statusFa) {
  const s = (status || "").toUpperCase();
  let icon = "📌";
  let color = "#E2E8F0";
  let bg = "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)";
  let border = "rgba(255, 255, 255, 0.2)";
  let glow = "rgba(255, 255, 255, 0.08)";
  let dotColor = "#94A3B8";

  if (s === "TIME_SET") {
    icon = "⏰";
    color = "#FDE68A";
    bg = "linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.12) 100%)";
    border = "rgba(245, 158, 11, 0.55)";
    glow = "rgba(245, 158, 11, 0.35)";
    dotColor = "#F59E0B";
  } else if (s === "PROMISE_TO_PAY") {
    icon = "💰";
    color = "#6EE7B7";
    bg = "linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(5, 150, 105, 0.12) 100%)";
    border = "rgba(16, 185, 129, 0.55)";
    glow = "rgba(16, 185, 129, 0.35)";
    dotColor = "#10B981";
  } else if (s === "PAYMENT" || s === "PAID") {
    icon = s === "PAID" ? "✅" : "💳";
    color = "#67E8F9";
    bg = "linear-gradient(135deg, rgba(6, 182, 212, 0.22) 0%, rgba(14, 165, 233, 0.12) 100%)";
    border = "rgba(6, 182, 212, 0.55)";
    glow = "rgba(6, 182, 212, 0.35)";
    dotColor = "#06B6D4";
  } else if (s === "NEW") {
    icon = "⚡️";
    color = "#E9D5FF";
    bg = "linear-gradient(135deg, rgba(168, 85, 247, 0.22) 0%, rgba(139, 92, 246, 0.12) 100%)";
    border = "rgba(168, 85, 247, 0.55)";
    glow = "rgba(168, 85, 247, 0.35)";
    dotColor = "#A855F7";
  } else if (s === "NEGOTIATING") {
    icon = "💬";
    color = "#93C5FD";
    bg = "linear-gradient(135deg, rgba(59, 130, 246, 0.22) 0%, rgba(37, 99, 235, 0.12) 100%)";
    border = "rgba(59, 130, 246, 0.55)";
    glow = "rgba(59, 130, 246, 0.35)";
    dotColor = "#3B82F6";
  } else if (s === "NEEDS_CONSULT") {
    icon = "🎧";
    color = "#C7D2FE";
    bg = "linear-gradient(135deg, rgba(99, 102, 241, 0.22) 0%, rgba(79, 70, 229, 0.12) 100%)";
    border = "rgba(99, 102, 241, 0.55)";
    glow = "rgba(99, 102, 241, 0.35)";
    dotColor = "#6366F1";
  } else if (s === "FOLLOW_UP") {
    icon = "🔄";
    color = "#FDBA74";
    bg = "linear-gradient(135deg, rgba(249, 115, 22, 0.22) 0%, rgba(234, 88, 12, 0.12) 100%)";
    border = "rgba(249, 115, 22, 0.55)";
    glow = "rgba(249, 115, 22, 0.35)";
    dotColor = "#F97316";
  } else if (s === "FREE_COURSE") {
    icon = "🎓";
    color = "#BEF264";
    bg = "linear-gradient(135deg, rgba(132, 204, 22, 0.22) 0%, rgba(101, 163, 13, 0.12) 100%)";
    border = "rgba(132, 204, 22, 0.55)";
    glow = "rgba(132, 204, 22, 0.35)";
    dotColor = "#84CC16";
  } else if (s === "NO_ANSWER") {
    icon = "📵";
    color = "#CBD5E1";
    bg = "rgba(100, 116, 139, 0.18)";
    border = "rgba(148, 163, 184, 0.35)";
    glow = "transparent";
    dotColor = "#94A3B8";
  } else if (s === "REJECTED") {
    icon = "❌";
    color = "#FCA5A5";
    bg = "linear-gradient(135deg, rgba(239, 68, 68, 0.22) 0%, rgba(220, 38, 38, 0.12) 100%)";
    border = "rgba(239, 68, 68, 0.55)";
    glow = "rgba(239, 68, 68, 0.35)";
    dotColor = "#EF4444";
  } else if (s === "WRONG_OVERLAP") {
    icon = "⚠️";
    color = "#FDA4AF";
    bg = "linear-gradient(135deg, rgba(244, 63, 94, 0.22) 0%, rgba(225, 29, 72, 0.12) 100%)";
    border = "rgba(244, 63, 94, 0.55)";
    glow = "rgba(244, 63, 94, 0.35)";
    dotColor = "#F43F5E";
  }

  const rawLabel = statusFa || status || "نامشخص";
  // Replace standard spaces with non-breaking spaces (\u00A0) to guarantee zero line breaks across words
  const nonBreakingLabel = rawLabel.replace(/\s+/g, '\u00A0');

  return `<span class="status-badge" style="background: ${bg}; border: 1px solid ${border}; color: ${color}; box-shadow: 0 2px 10px ${glow};">
    <span class="status-dot" style="background-color: ${dotColor}; box-shadow: 0 0 6px ${dotColor};"></span>
    <span class="status-icon">${icon}</span>
    <span class="status-text">${nonBreakingLabel}</span>
  </span>`;
}

export function renderDashboardHtml(calls, stats, config) {
  const p1Count = stats.p1 || 0;
  const p2Count = stats.p2 || 0;
  const p3Count = stats.p3 || 0;
  const p4Count = stats.p4 || 0;
  const p5Count = stats.p5 || 0;
  const totalCount = calls.length;

  // Calculate Time Set, Today & Overdue counts
  const timeSetCount = calls.filter((c) => c.isTimeSet || c.status === "TIME_SET" || c.categoryKey === "timeSet").length;
  const todayTimeSetCount = calls.filter((c) => c.isTodayTimeSet).length;
  const overdueTimeSetCount = calls.filter((c) => c.isOverdueTimeSet).length;
  const todayLeadCount = calls.filter((c) => c.isTodayLead).length;
  const todayCount = calls.filter((c) => c.isTodayDue || c.isTodayTimeSet || c.isTodayLead).length;

  const totalAmount = calls.reduce((acc, c) => acc + (c.proposedAmount || 0) + (c.balance || 0), 0);
  const formattedTotalAmount = totalAmount > 0 ? Number(totalAmount).toLocaleString("fa-IR") + " تومان" : "۰ تومان";

  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>میز کار هوشمند تماس‌های فروش | رتبه‌بندی و اولویت‌بندی تماس‌ها</title>
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
      --emerald: #10B981;
      --emerald-dark: #059669;
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
      padding: 20px;
      min-height: 100vh;
    }

    .container {
      max-width: 1440px;
      margin: 0 auto;
    }

    /* Executive Clutter-Free Navbar */
    .navbar {
      background: rgba(17, 24, 39, 0.75);
      backdrop-filter: blur(16px);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 14px 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      margin-bottom: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
      flex-shrink: 0;
    }

    .brand-text h1 {
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-text p {
      font-size: 0.78rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 1px;
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
    }

    .progress-pill {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34D399;
      border-radius: 10px;
      padding: 7px 12px;
      font-size: 0.8rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    .clock-badge {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 8px 14px;
      font-size: 0.88rem;
      color: #94A3B8;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    .btn-refresh {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 0.84rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text);
      transition: all 0.2s;
      white-space: nowrap;
    }

    .btn-refresh:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--border-hover);
      transform: translateY(-1px);
    }

    /* KPI Metrics Cards */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 14px;
      margin-bottom: 20px;
    }

    .metric-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px 18px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .metric-card:hover {
      transform: translateY(-2px);
      border-color: var(--border-hover);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
    }

    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--text-muted);
      font-size: 0.82rem;
      margin-bottom: 8px;
    }

    .metric-value {
      font-size: 1.65rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 4px;
    }

    .metric-sub {
      font-size: 0.74rem;
      color: var(--text-sub);
    }

    .metric-card.timeset { border-top: 3px solid #F59E0B; }
    .metric-card.today { border-top: 3px solid #3B82F6; }
    .metric-card.p1 { border-top: 3px solid #EF4444; }
    .metric-card.p2 { border-top: 3px solid #F97316; }
    .metric-card.amount { border-top: 3px solid #10B981; }

    .badge-today-timeset {
      background: rgba(245, 158, 11, 0.16);
      color: #FBBF24;
      border: 1px solid rgba(245, 158, 11, 0.45);
      font-size: 0.72rem;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      box-shadow: 0 0 10px rgba(245, 158, 11, 0.15);
    }

    .badge-overdue-timeset {
      background: rgba(239, 68, 68, 0.16);
      color: #F87171;
      border: 1px solid rgba(239, 68, 68, 0.45);
      font-size: 0.72rem;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      box-shadow: 0 0 10px rgba(239, 68, 68, 0.15);
    }

    .badge-today-lead {
      background: rgba(16, 185, 129, 0.16);
      color: #34D399;
      border: 1px solid rgba(16, 185, 129, 0.45);
      font-size: 0.72rem;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    /* Ultra-Modern Status Badge System (Pill Capsule, Glassmorphic Glow, Zero-Wrapping) */
    .status-badge {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 7px !important;
      font-size: 0.76rem !important;
      font-weight: 700 !important;
      padding: 5px 12px !important;
      border-radius: 9999px !important;
      white-space: nowrap !important;
      word-break: keep-all !important;
      line-height: 1.25 !important;
      letter-spacing: -0.2px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
      box-sizing: border-box;
      flex-shrink: 0 !important;
      vertical-align: middle;
      cursor: default;
    }
    .status-badge:hover {
      transform: translateY(-1px) scale(1.03);
      filter: brightness(1.15);
    }
    .status-badge .status-icon {
      font-size: 0.85rem;
      line-height: 1;
      display: inline-block;
      flex-shrink: 0;
    }
    .status-badge .status-text {
      white-space: nowrap !important;
      word-break: keep-all !important;
      display: inline-block;
    }
    .status-badge .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      display: inline-block;
      flex-shrink: 0;
      animation: pulseDot 2s infinite ease-in-out;
    }
    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.8); }
    }

    /* Status Column Constraints */
    .col-status {
      width: 155px !important;
      min-width: 155px !important;
      text-align: center !important;
      white-space: nowrap !important;
    }

    /* Control Bar & Search */
    .control-bar {
      background: rgba(17, 24, 39, 0.6);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 12px 16px;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .search-wrapper {
      position: relative;
      flex: 1;
      min-width: 260px;
    }

    .search-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 10px 42px 10px 14px;
      color: var(--text);
      font-family: inherit;
      font-size: 0.88rem;
      outline: none;
      transition: all 0.2s;
    }

    .search-input:focus {
      border-color: #6366F1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }

    .search-icon {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-sub);
      pointer-events: none;
    }

    .filter-pills {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 2px;
      -webkit-overflow-scrolling: touch;
    }

    .pill-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 8px 13px;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .pill-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text);
    }

    .pill-btn.active {
      background: #6366F1;
      color: #FFFFFF;
      border-color: #6366F1;
      box-shadow: 0 2px 10px rgba(99, 102, 241, 0.35);
    }

    .select-dropdown {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 9px 14px;
      border-radius: 10px;
      font-family: inherit;
      font-size: 0.82rem;
      outline: none;
      cursor: pointer;
    }

    /* Badges & Urgency Tags */
    .p-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.76rem;
      white-space: nowrap;
    }

    .p-badge.p1 { background: var(--p1-bg); color: #F87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .p-badge.p2 { background: var(--p2-bg); color: #FB923C; border: 1px solid rgba(249, 115, 22, 0.3); }
    .p-badge.p3 { background: var(--p3-bg); color: #60A5FA; border: 1px solid rgba(59, 130, 246, 0.3); }
    .p-badge.p4 { background: var(--p4-bg); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .p-badge.p5 { background: var(--p5-bg); color: #9CA3AF; border: 1px solid rgba(107, 114, 128, 0.3); }

    .date-urgency-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 700;
      margin-top: 3px;
      white-space: nowrap;
    }

    /* Check Call Status Styling */
    .check-call-label {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .chk-custom {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      color: transparent;
      transition: all 0.2s;
      user-select: none;
    }

    .call-chk:checked + .chk-custom {
      background: #10B981;
      border-color: #10B981;
      color: #FFFFFF;
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
    }

    .call-chk {
      display: none;
    }

    tr.is-called-done {
      background: rgba(16, 185, 129, 0.04) !important;
      opacity: 0.65;
    }

    tr.is-called-done .lead-name {
      text-decoration: line-through;
      color: #94A3B8;
    }

    .phone-lead-card.is-called-done {
      border: 1px solid #10B981 !important;
      background: rgba(16, 185, 129, 0.05) !important;
      opacity: 0.75;
    }

    .phone-lead-card.is-called-done .card-done-indicator {
      display: inline-flex !important;
    }

    /* Desktop Table View */
    .desktop-table-view {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .table-scroll {
      overflow-x: auto;
      max-height: 720px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: right;
      font-size: 0.84rem;
    }

    thead th {
      position: sticky;
      top: 0;
      background: #161F30;
      padding: 14px 16px;
      font-weight: 700;
      color: #94A3B8;
      border-bottom: 1px solid var(--border);
      white-space: nowrap;
      z-index: 10;
    }

    tbody td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: middle;
      transition: background 0.2s;
    }

    tbody tr:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    .lead-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .avatar-initial {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #A5B4FC;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.95rem;
      flex-shrink: 0;
    }

    .lead-name {
      font-weight: 700;
      color: #F8FAFC;
    }

    .lead-persona {
      font-size: 0.74rem;
      color: var(--text-sub);
    }

    .dial-group {
      display: flex;
      align-items: center;
      gap: 6px;
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

    .strategy-box {
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px 12px;
      max-width: 320px;
      font-size: 0.78rem;
      line-height: 1.5;
      color: #E2E8F0;
    }

    .amount-tag {
      font-weight: 700;
      color: #34D399;
      font-size: 0.86rem;
      white-space: nowrap;
    }

    /* Mobile Phone Cards Feed (Hidden on Desktop, Visible on Phone) */
    .mobile-cards-feed {
      display: none;
      flex-direction: column;
      gap: 14px;
    }

    .phone-lead-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      position: relative;
      transition: all 0.2s;
    }

    .phone-lead-card.p1 { border-right: 4px solid #EF4444; }
    .phone-lead-card.p2 { border-right: 4px solid #F97316; }
    .phone-lead-card.p3 { border-right: 4px solid #3B82F6; }
    .phone-lead-card.p4 { border-right: 4px solid #10B981; }
    .phone-lead-card.p5 { border-right: 4px solid #6B7280; }

    .card-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      gap: 8px;
    }

    .card-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .card-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 0.78rem;
    }

    .meta-item {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      padding: 6px 10px;
    }

    .meta-label {
      color: var(--text-sub);
      font-size: 0.7rem;
      margin-bottom: 2px;
    }

    .meta-val {
      font-weight: 600;
      color: #E2E8F0;
    }

    /* Big Touch-Friendly Mobile Call Button */
    .mobile-primary-call-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      color: #FFFFFF;
      font-weight: 800;
      font-size: 0.95rem;
      text-decoration: none;
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35);
      margin-top: 10px;
      transition: transform 0.15s, background 0.15s;
    }

    .mobile-primary-call-btn:active {
      transform: scale(0.98);
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
    }

    .mobile-secondary-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    .mobile-sec-btn {
      flex: 1;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--text-muted);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }

    .mobile-sec-btn:active {
      background: rgba(255, 255, 255, 0.1);
      color: #FFFFFF;
    }

    .mobile-check-btn {
      width: 100%;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 10px;
      border: 1px dashed rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.03);
      color: #94A3B8;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      margin-top: 8px;
      transition: all 0.2s;
    }

    .mobile-check-btn.checked {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid #10B981;
      color: #34D399;
    }

    /* Modal (Responsive Bottom-Sheet on Phone) */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
    }

    .modal-card {
      background: #151D2C;
      border: 1px solid var(--border);
      border-radius: 20px;
      max-width: 580px;
      width: 100%;
      padding: 24px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      position: relative;
      animation: modalPop 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      max-height: 90vh;
      overflow-y: auto;
    }

    @keyframes modalPop {
      0% { transform: scale(0.95); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    .modal-close {
      position: absolute;
      top: 16px;
      left: 16px;
      background: rgba(255, 255, 255, 0.06);
      border: none;
      color: var(--text-muted);
      width: 34px;
      height: 34px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-close:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #FFFFFF;
    }

    /* Notification Toast */
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 20px;
      background: #1F2937;
      color: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      display: none;
      z-index: 2000;
      font-size: 0.88rem;
      font-weight: 500;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }

    /* Phone Responsive Media Queries */
    @media (max-width: 768px) {
      body {
        padding: 10px;
      }
      .navbar {
        padding: 12px 14px;
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
      }
      .brand {
        justify-content: space-between;
      }
      .nav-actions {
        justify-content: space-between;
      }
      .clock-badge {
        flex: 1;
        justify-content: center;
      }
      .metrics-grid {
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      .metric-card {
        padding: 12px 14px;
      }
      .metric-value {
        font-size: 1.35rem;
      }
      .metric-card.amount {
        grid-column: span 2;
      }
      .control-bar {
        padding: 10px 12px;
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
      }
      .search-wrapper {
        min-width: 100%;
      }
      .desktop-table-view {
        display: none !important;
      }
      .mobile-cards-feed {
        display: flex !important;
      }
      .modal-card {
        border-radius: 20px 20px 0 0;
        max-height: 85vh;
        margin-top: auto;
        margin-bottom: 0;
      }
      .modal-overlay {
        padding: 0;
        align-items: flex-end;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Top Navigation (Clean, Executive, Clutter-Free) -->
    <header class="navbar">
      <div class="brand">
        <div class="brand-icon">📞</div>
        <div class="brand-text">
          <h1>میز کار هوشمند تماس‌های فروش</h1>
          <p>
            <span class="live-dot"></span>
            سامانه برنامه‌ریزی تماس‌ها و رتبه‌بندی لحظه‌ای
          </p>
        </div>
      </div>
      <div class="nav-actions">
        <div class="progress-pill">
          ✅ تماس‌های بررسی‌شده: <span id="checkedCount">۰</span> از ${totalCount.toLocaleString('fa-IR')}
        </div>
        <div class="clock-badge" id="liveClock">--:--:--</div>
        <button id="refreshBtn" class="btn-refresh" onclick="triggerRefresh()">
          🔄 به‌روزرسانی
        </button>
      </div>
    </header>

    <!-- KPI Metric Cards -->
    <section class="metrics-grid">
      <div class="metric-card timeset" onclick="setSpecialFilter('TODAY_TIMESET')" style="cursor: pointer;">
        <div class="metric-header">
          <span>تایم‌ست‌های امروز</span>
          <span class="metric-icon">📅</span>
        </div>
        <div class="metric-value" style="color: #F59E0B;">${todayTimeSetCount.toLocaleString("fa-IR")} <span class="metric-sub" style="font-size: 0.8rem;">قرار امروز</span></div>
        <div class="metric-sub">اولویت اول بر اساس ساعت هماهنگ‌شده</div>
      </div>

      <div class="metric-card p1" onclick="setSpecialFilter('OVERDUE_TIMESET')" style="cursor: pointer;">
        <div class="metric-header">
          <span>تایم‌ست‌های معوقه</span>
          <span class="metric-icon">🚨</span>
        </div>
        <div class="metric-value" style="color: #F87171;">${overdueTimeSetCount.toLocaleString("fa-IR")} <span class="metric-sub" style="font-size: 0.8rem;">تماس معوق</span></div>
        <div class="metric-sub">نوبت‌های گذشته از قدیم به جدید</div>
      </div>

      <div class="metric-card amount" onclick="setSpecialFilter('TODAY_LEAD')" style="cursor: pointer;">
        <div class="metric-header">
          <span>لیدهای جدید امروز</span>
          <span class="metric-icon">⚡️</span>
        </div>
        <div class="metric-value" style="color: #10B981;">${todayLeadCount.toLocaleString("fa-IR")} <span class="metric-sub" style="font-size: 0.8rem;">لید جدید</span></div>
        <div class="metric-sub">ورودی‌های تازه جهت تماس سریع</div>
      </div>

      <div class="metric-card today" onclick="setSpecialFilter('TIMESET')" style="cursor: pointer;">
        <div class="metric-header">
          <span>کل قرارها (Time Set)</span>
          <span class="metric-icon">⏰</span>
        </div>
        <div class="metric-value" style="color: #60A5FA;">${timeSetCount.toLocaleString("fa-IR")} <span class="metric-sub" style="font-size: 0.8rem;">قرار تماس</span></div>
        <div class="metric-sub">مجموع تمام تایم‌ست‌های کارتابل</div>
      </div>

      <div class="metric-card amount">
        <div class="metric-header">
          <span>ارزش ریالی در صف پیگیری</span>
          <span class="metric-icon">💎</span>
        </div>
        <div class="metric-value" style="color: #34D399; font-size: 1.35rem;">${formattedTotalAmount}</div>
        <div class="metric-sub">مجموع مبالغ پیشنهادی و اقساط</div>
      </div>
    </section>

    <!-- Search & Filters Toolbar -->
    <div class="control-bar">
      <div class="search-wrapper">
        <input type="text" id="searchInput" class="search-input" placeholder="جستجو در نام، شماره تماس، یادداشت، منبع یا توصیه..." oninput="applyFilters()">
        <span class="search-icon">🔍</span>
      </div>

      <!-- Call Check Filter -->
      <div>
        <select id="callCheckFilter" class="select-dropdown" onchange="applyFilters()" style="background: rgba(30, 41, 59, 0.9); border-color: #34D399; color: #34D399; font-weight: 700;">
          <option value="ALL">📋 همه تماس‌ها (بررسی‌شده و نشده)</option>
          <option value="UNCHECKED" selected>📞 فقط در انتظار تماس (انجام‌نشده)</option>
          <option value="CHECKED">✅ فقط تماس‌های بررسی‌شده (انجام‌شده)</option>
        </select>
      </div>

      <!-- Sorting Selector -->
      <div>
        <select id="sortSelect" class="select-dropdown" onchange="applySortAndFilters()" style="background: rgba(30, 41, 59, 0.9); border-color: #F59E0B; color: #F59E0B; font-weight: 700;">
          <option value="DEFAULT" selected>🎯 اولویت: تایم‌ست‌های امروز ➔ معوقه‌ها ➔ قدیم به جدید</option>
          <option value="OVERDUE_FIRST">⏳ اولویت: معوقه‌ها اول (قدیم به جدید) ➔ تایم‌ست امروز</option>
          <option value="SCORE_DESC">💎 بالاترین امتیاز تجاری (Score 100 ➔ 0)</option>
          <option value="NEWEST_LEAD">🕒 جدیدترین لیدهای ورودی</option>
        </select>
      </div>

      <!-- Priority & Special Pills -->
      <div class="filter-pills">
        <button class="pill-btn active" onclick="setPriorityFilter('ALL')">
          همه <span class="pill-count">(${totalCount.toLocaleString('fa-IR')})</span>
        </button>
        <button class="pill-btn" onclick="setSpecialFilter('TODAY_TIMESET')" style="border-color: rgba(245, 158, 11, 0.4); color: #F59E0B;">
          📅 تایم‌ست امروز <span class="pill-count">(${todayTimeSetCount.toLocaleString('fa-IR')})</span>
        </button>
        <button class="pill-btn" onclick="setSpecialFilter('OVERDUE_TIMESET')" style="border-color: rgba(239, 68, 68, 0.4); color: #F87171;">
          🚨 معوقه‌ها <span class="pill-count">(${overdueTimeSetCount.toLocaleString('fa-IR')})</span>
        </button>
        <button class="pill-btn" onclick="setSpecialFilter('TIMESET')">
          ⏰ کل Time Set <span class="pill-count">(${timeSetCount.toLocaleString('fa-IR')})</span>
        </button>
        <button class="pill-btn" onclick="setSpecialFilter('TODAY_LEAD')">
          ⚡️ لیدهای امروز <span class="pill-count">(${todayLeadCount.toLocaleString('fa-IR')})</span>
        </button>
        <button class="pill-btn" onclick="setPriorityFilter('P1')">
          🔴 فوری P1 <span class="pill-count">(${p1Count.toLocaleString('fa-IR')})</span>
        </button>
        <button class="pill-btn" onclick="setPriorityFilter('P2')">
          🔥 داغ P2 <span class="pill-count">(${p2Count.toLocaleString('fa-IR')})</span>
        </button>
        <button class="pill-btn" onclick="setPriorityFilter('P3')">
          ⚡ تازه P3 <span class="pill-count">(${p3Count.toLocaleString('fa-IR')})</span>
        </button>
      </div>

      <div>
        <select id="categorySelect" class="select-dropdown" onchange="applyFilters()">
          <option value="ALL">همه دسته‌بندی‌های کارتابل</option>
          <option value="timeSet">زمان تعیین‌شده (Time Set)</option>
          <option value="todayLeads">لیدهای امروز</option>
          <option value="followUp">پیگیری و مذاکره (Follow Up)</option>
          <option value="balanceLeads">وصول مطالبات و اقساط</option>
          <option value="reRegConflict">ثبت‌نام مجدد (Re-Register)</option>
          <option value="notCalled">لیدهای جدید بدون تماس</option>
          <option value="freeCourse">دانشجویان دوره رایگان</option>
          <option value="noAnswer">عدم پاسخ (No Answer)</option>
        </select>
      </div>
    </div>

    <!-- 1. Desktop Table View (Displays on Desktop / Tablet screens) -->
    <div class="desktop-table-view">
      <div class="table-scroll">
        <table id="callsTable">
          <thead>
            <tr>
              <th style="width: 45px; text-align: center;">ردیف</th>
              <th style="width: 50px; text-align: center;">بررسی تماس</th>
              <th style="min-width: 110px; white-space: nowrap;">سطح اولویت</th>
              <th style="min-width: 60px; text-align: center; white-space: nowrap;">امتیاز</th>
              <th style="min-width: 140px; white-space: nowrap;">نام و پرسونا</th>
              <th style="min-width: 140px; white-space: nowrap;">شماره تماس و اقدام</th>
              <th class="col-status" style="width: 155px; min-width: 155px; text-align: center; white-space: nowrap;">وضعیت</th>
              <th style="min-width: 150px; white-space: nowrap;">موعد تماس و فوریت</th>
              <th style="min-width: 220px;">توصیه و استراتژی مکالمه</th>
              <th style="min-width: 130px; white-space: nowrap;">مبلغ پیشنهادی / مانده</th>
              <th style="min-width: 120px; white-space: nowrap;">منبع جذب</th>
              <th style="width: 50px; text-align: center;">پرونده</th>
            </tr>
          </thead>
          <tbody>
            ${calls
              .map(
                (call, idx) => `
              <tr id="row-${call.id}" 
                data-id="${call.id}" 
                data-priority="${call.priorityCode}" 
                data-category="${call.categoryKey}" 
                data-timeset="${call.isTimeSet ? '1' : '0'}" 
                data-today-timeset="${call.isTodayTimeSet ? '1' : '0'}" 
                data-overdue-timeset="${call.isOverdueTimeSet ? '1' : '0'}" 
                data-today-lead="${call.isTodayLead ? '1' : '0'}" 
                data-today-due="${call.isTodayDue ? '1' : '0'}" 
                data-score="${call.score}" 
                data-due-time="${call.nextActionDueAt ? new Date(call.nextActionDueAt).getTime() : 0}" 
                data-assigned-time="${call.assignedAt || call.createdAt ? new Date(call.assignedAt || call.createdAt).getTime() : 0}" 
                data-search="${(call.fullName + ' ' + call.phone + ' ' + call.nextActionNote + ' ' + call.source + ' ' + call.strategy + ' ' + call.statusFa).toLowerCase()}">
                <td style="text-align: center; color: var(--text-sub); font-weight: 600;">${(idx + 1).toLocaleString('fa-IR')}</td>
                <td style="text-align: center;">
                  <label class="check-call-label" title="ثبت تماس برقرار شده">
                    <input type="checkbox" class="call-chk" id="chk-${call.id}" onchange="toggleCallChecked('${call.id}', this.checked)">
                    <span class="chk-custom">✓</span>
                  </label>
                </td>
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
                    <a href="${call.phoneDialUrl}" class="btn-call" title="برقراری تماس مستقیم">
                      📞 ${call.phone}
                    </a>
                    <button class="btn-copy" onclick="copyToClipboard('${call.phone}', this)" title="کپی شماره تماس">
                      📋
                    </button>
                  </div>
                </td>
                <td class="col-status" style="width: 155px; min-width: 155px; text-align: center; white-space: nowrap;">
                  ${renderStatusBadge(call.status, call.statusFa)}
                </td>
                <td>
                  <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">
                    ${call.isTodayTimeSet ? '<span class="badge-today-timeset">📅 قرار تماس امروز</span>' : ''}
                    ${call.isOverdueTimeSet ? '<span class="badge-overdue-timeset">🚨 قرار معوقه</span>' : ''}
                    ${call.isTodayLead && !call.isTodayTimeSet ? '<span class="badge-today-lead">⚡️ لید جدید امروز</span>' : ''}
                    ${call.dateUrgencyLabel ? `
                      <span class="date-urgency-badge" style="background: rgba(255,255,255,0.06); color: ${call.dateUrgencyColor || '#F59E0B'};">
                        ${call.dateUrgencyLabel}
                      </span>
                    ` : ''}
                    <div style="font-weight: 600; color: #E2E8F0; font-size: 0.8rem;">
                      ${call.nextActionDueAtFormatted !== '-' ? call.nextActionDueAtFormatted : (call.assignedAtFormatted !== '-' ? 'ثبت: ' + call.assignedAtFormatted : '-')}
                    </div>
                    ${call.nextActionNote !== '-' ? `<div style="font-size: 0.72rem; color: #93C5FD;">📝 ${call.nextActionNote}</div>` : ''}
                  </div>
                </td>
                <td>
                  <div class="strategy-box">
                    <span style="color: #FBBF24; margin-left: 4px;">💡</span>
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
                  <button class="btn-copy" onclick="showLeadDetails(${JSON.stringify(call).replace(/"/g, '&quot;')})" title="مشاهده مشخصات کامل پرونده">
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

    <!-- 2. Mobile Phone Cards Feed (Specially Designed for Phones & Mobile Screens) -->
    <div class="mobile-cards-feed" id="mobileCardsFeed">
      ${calls
        .map(
          (call, idx) => `
        <div class="phone-lead-card ${call.priorityCode.toLowerCase()}" 
          id="mcard-${call.id}" 
          data-id="${call.id}" 
          data-priority="${call.priorityCode}" 
          data-category="${call.categoryKey}" 
          data-timeset="${call.isTimeSet ? '1' : '0'}" 
          data-today-timeset="${call.isTodayTimeSet ? '1' : '0'}" 
          data-overdue-timeset="${call.isOverdueTimeSet ? '1' : '0'}" 
          data-today-lead="${call.isTodayLead ? '1' : '0'}" 
          data-today-due="${call.isTodayDue ? '1' : '0'}" 
          data-score="${call.score}" 
          data-due-time="${call.nextActionDueAt ? new Date(call.nextActionDueAt).getTime() : 0}" 
          data-assigned-time="${call.assignedAt || call.createdAt ? new Date(call.assignedAt || call.createdAt).getTime() : 0}" 
          data-search="${(call.fullName + ' ' + call.phone + ' ' + call.nextActionNote + ' ' + call.source + ' ' + call.strategy + ' ' + call.statusFa).toLowerCase()}">
          <div class="card-top-row">
            <span class="p-badge ${call.priorityCode.toLowerCase()}">
              ${call.priorityCode} • ${call.priorityName}
            </span>
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              <span class="card-done-indicator" style="display: none; background: #10B981; color: white; padding: 2px 6px; border-radius: 6px; font-size: 0.72rem; font-weight: 700;">✅ انجام شد</span>
              ${call.isTodayTimeSet ? '<span class="badge-today-timeset">📅 تایم‌ست امروز</span>' : ''}
              ${call.isOverdueTimeSet ? '<span class="badge-overdue-timeset">🚨 قرار معوقه</span>' : ''}
              ${call.isTodayLead && !call.isTodayTimeSet ? '<span class="badge-today-lead">⚡️ لید امروز</span>' : ''}
              ${call.dateUrgencyLabel ? `<span class="date-urgency-badge" style="background: rgba(255,255,255,0.06); color: ${call.dateUrgencyColor || '#F59E0B'};">${call.dateUrgencyLabel}</span>` : ''}
              <span style="font-weight: 800; font-size: 0.82rem; background: rgba(255,255,255,0.08); padding: 3px 8px; border-radius: 6px; color: #F8FAFC;">امتیاز ${call.score}</span>
            </div>
          </div>

          <div class="card-title-row">
            <div class="avatar-initial">${call.fullName ? call.fullName.charAt(0) : '؟'}</div>
            <div style="flex: 1;">
              <div class="lead-name" style="font-size: 1.05rem; font-weight: 800; color: #FFFFFF;">${call.fullName}</div>
              <div style="font-size: 0.76rem; color: var(--text-sub);">${call.persona !== '-' ? call.persona : call.categoryName}</div>
            </div>
            <div style="text-align: left; white-space: nowrap; flex-shrink: 0;">
              ${renderStatusBadge(call.status, call.statusFa)}
            </div>
          </div>

          <div class="card-meta-grid">
            <div class="meta-item">
              <div class="meta-label">موعد تماس:</div>
              <div class="meta-val">${call.nextActionDueAtFormatted}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">مبلغ / مانده حساب:</div>
              <div class="meta-val" style="color: #34D399;">${call.proposedAmountFormatted !== '-' ? call.proposedAmountFormatted : (call.balanceFormatted !== '-' ? call.balanceFormatted : 'نامشخص')}</div>
            </div>
            <div class="meta-item" style="grid-column: span 2;">
              <div class="meta-label">منبع و استخر لید:</div>
              <div class="meta-val">${call.source} (${call.poolName})</div>
            </div>
          </div>

          ${call.nextActionNote !== '-' ? `
            <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 8px 10px; font-size: 0.78rem; color: #93C5FD; margin-bottom: 10px;">
              📝 یادداشت قبلی: ${call.nextActionNote}
            </div>
          ` : ''}

          <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 10px; padding: 10px; font-size: 0.8rem; color: #E0E7FF; line-height: 1.5; margin-bottom: 10px;">
            <strong style="color: #A5B4FC;">💡 توصیه تماس:</strong> ${call.strategy}
          </div>

          <!-- Big Touch Call Button for Mobile -->
          <a href="${call.phoneDialUrl}" class="mobile-primary-call-btn">
            📞 برقراری تماس تلفنی با ${call.phone}
          </a>

          <!-- Check Call Button on Mobile Card -->
          <button class="mobile-check-btn" id="mchk-${call.id}" onclick="toggleMobileCheckCall('${call.id}')">
            <span class="chk-status-icon">⬜</span>
            <span class="chk-status-text">ثبت به عنوان تماس گرفته شده</span>
          </button>

          <div class="mobile-secondary-actions">
            <button class="mobile-sec-btn" onclick="copyToClipboard('${call.phone}', this)">
              📋 کپی شماره
            </button>
            <button class="mobile-sec-btn" onclick="showLeadDetails(${JSON.stringify(call).replace(/"/g, '&quot;')})">
              👁️ پرونده کامل
            </button>
          </div>
        </div>
      `
        )
        .join('')}
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
    let specialFilter = 'NONE'; // 'NONE' | 'TIMESET' | 'TODAY'
    const CHECKED_STORAGE_KEY = 'crm_checked_calls';

    // Retrieve checked calls from localStorage
    function getCheckedCalls() {
      try {
        const stored = localStorage.getItem(CHECKED_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }

    function saveCheckedCalls(arr) {
      try {
        localStorage.setItem(CHECKED_STORAGE_KEY, JSON.stringify(arr));
      } catch (e) {}
    }

    // Toggle Check Call from table checkbox
    function toggleCallChecked(id, isChecked) {
      let checkedList = getCheckedCalls();
      if (isChecked) {
        if (!checkedList.includes(id)) checkedList.push(id);
        showToast('✅ تماس ثبت و بررسی شد', 'success');
      } else {
        checkedList = checkedList.filter(item => item !== id);
        showToast('تماس به حالت در انتظار بازگشت', 'info');
      }
      saveCheckedCalls(checkedList);
      applyCheckedState();
      applyFilters();
    }

    // Toggle Check Call from mobile button
    function toggleMobileCheckCall(id) {
      let checkedList = getCheckedCalls();
      const isCurrentlyChecked = checkedList.includes(id);
      toggleCallChecked(id, !isCurrentlyChecked);
    }

    // Apply checked visual state to rows and cards
    function applyCheckedState() {
      const checkedList = getCheckedCalls();
      document.getElementById('checkedCount').innerText = checkedList.length.toLocaleString('fa-IR');

      // Update Desktop Table
      document.querySelectorAll('#callsTable tbody tr').forEach(row => {
        const id = row.getAttribute('data-id');
        const chkInput = document.getElementById('chk-' + id);
        if (checkedList.includes(id)) {
          row.classList.add('is-called-done');
          if (chkInput) chkInput.checked = true;
        } else {
          row.classList.remove('is-called-done');
          if (chkInput) chkInput.checked = false;
        }
      });

      // Update Mobile Cards
      document.querySelectorAll('#mobileCardsFeed .phone-lead-card').forEach(card => {
        const id = card.getAttribute('data-id');
        const mBtn = document.getElementById('mchk-' + id);
        if (checkedList.includes(id)) {
          card.classList.add('is-called-done');
          if (mBtn) {
            mBtn.classList.add('checked');
            mBtn.querySelector('.chk-status-icon').innerText = '✅';
            mBtn.querySelector('.chk-status-text').innerText = 'تماس برقرار شده (بررسی شد)';
          }
        } else {
          card.classList.remove('is-called-done');
          if (mBtn) {
            mBtn.classList.remove('checked');
            mBtn.querySelector('.chk-status-icon').innerText = '⬜';
            mBtn.querySelector('.chk-status-text').innerText = 'ثبت به عنوان تماس گرفته شده';
          }
        }
      });
    }

    // Live Tehran Clock
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
      specialFilter = 'NONE';
      document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
      const buttons = document.querySelectorAll('.pill-btn');
      for (const b of buttons) {
        if (b.innerText.includes(priority) || (priority === 'ALL' && b.innerText.includes('همه'))) {
          b.classList.add('active');
          break;
        }
      }
      applySortAndFilters();
    }

    function setSpecialFilter(filterType) {
      specialFilter = filterType;
      activePriority = 'ALL';
      document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
      const buttons = document.querySelectorAll('.pill-btn');
      for (const b of buttons) {
        if (
          (filterType === 'TODAY_TIMESET' && b.innerText.includes('تایم‌ست امروز')) ||
          (filterType === 'OVERDUE_TIMESET' && b.innerText.includes('معوقه‌ها')) ||
          (filterType === 'TIMESET' && b.innerText.includes('Time Set')) ||
          (filterType === 'TODAY_LEAD' && b.innerText.includes('لیدهای امروز'))
        ) {
          b.classList.add('active');
          break;
        }
      }
      applySortAndFilters();
    }

    function applySort() {
      const sortMode = document.getElementById('sortSelect') ? document.getElementById('sortSelect').value : 'DEFAULT';
      const tbody = document.querySelector('#callsTable tbody');
      const feed = document.getElementById('mobileCardsFeed');
      if (!tbody || !feed) return;

      const rows = Array.from(tbody.querySelectorAll('tr'));
      const cards = Array.from(feed.querySelectorAll('.phone-lead-card'));

      const compareFn = (elA, elB) => {
        const aIsTodayTS = elA.getAttribute('data-today-timeset') === '1';
        const bIsTodayTS = elB.getAttribute('data-today-timeset') === '1';
        const aIsOverdueTS = elA.getAttribute('data-overdue-timeset') === '1';
        const bIsOverdueTS = elB.getAttribute('data-overdue-timeset') === '1';
        const aDueTime = parseInt(elA.getAttribute('data-due-time') || '0', 10);
        const bDueTime = parseInt(elB.getAttribute('data-due-time') || '0', 10);
        const aScore = parseInt(elA.getAttribute('data-score') || '0', 10);
        const bScore = parseInt(elB.getAttribute('data-score') || '0', 10);

        if (sortMode === 'OVERDUE_FIRST') {
          // Overdue first (old -> new), then today's timesets (old -> new)
          if (aIsOverdueTS && !bIsOverdueTS) return -1;
          if (!aIsOverdueTS && bIsOverdueTS) return 1;
          if (aIsOverdueTS && bIsOverdueTS) return aDueTime - bDueTime;

          if (aIsTodayTS && !bIsTodayTS) return -1;
          if (!aIsTodayTS && bIsTodayTS) return 1;
          if (aIsTodayTS && bIsTodayTS) return aDueTime - bDueTime;

          return bScore - aScore;
        } else if (sortMode === 'SCORE_DESC') {
          return bScore - aScore;
        } else if (sortMode === 'NEWEST_LEAD') {
          const aAssign = parseInt(elA.getAttribute('data-assigned-time') || '0', 10);
          const bAssign = parseInt(elB.getAttribute('data-assigned-time') || '0', 10);
          return bAssign - aAssign;
        } else {
          // DEFAULT: Today's Time Sets first (old -> new), then Overdue (old -> new), then score
          if (aIsTodayTS && !bIsTodayTS) return -1;
          if (!aIsTodayTS && bIsTodayTS) return 1;
          if (aIsTodayTS && bIsTodayTS) return aDueTime - bDueTime;

          if (aIsOverdueTS && !bIsOverdueTS) return -1;
          if (!aIsOverdueTS && bIsOverdueTS) return 1;
          if (aIsOverdueTS && bIsOverdueTS) return aDueTime - bDueTime;

          return bScore - aScore;
        }
      };

      rows.sort(compareFn).forEach((r, idx) => {
        tbody.appendChild(r);
        const numCell = r.querySelector('td:first-child');
        if (numCell) numCell.innerText = (idx + 1).toLocaleString('fa-IR');
      });

      cards.sort(compareFn).forEach(c => feed.appendChild(c));
    }

    function applySortAndFilters() {
      applySort();
      applyFilters();
    }

    function applyFilters() {
      const search = document.getElementById('searchInput').value.toLowerCase().trim();
      const cat = document.getElementById('categorySelect').value;
      const checkFilter = document.getElementById('callCheckFilter').value;
      const checkedList = getCheckedCalls();

      // Filter Desktop Table Rows
      const rows = document.querySelectorAll('#callsTable tbody tr');
      rows.forEach(row => {
        const rowId = row.getAttribute('data-id');
        const rowPriority = row.getAttribute('data-priority');
        const rowCategory = row.getAttribute('data-category');
        const rowSearch = row.getAttribute('data-search');
        const rowIsTimeSet = row.getAttribute('data-timeset') === '1';
        const rowIsTodayTimeSet = row.getAttribute('data-today-timeset') === '1';
        const rowIsOverdueTimeSet = row.getAttribute('data-overdue-timeset') === '1';
        const rowIsTodayLead = row.getAttribute('data-today-lead') === '1';
        const isChecked = checkedList.includes(rowId);

        let matchesSpecial = true;
        if (specialFilter === 'TODAY_TIMESET') matchesSpecial = rowIsTodayTimeSet;
        if (specialFilter === 'OVERDUE_TIMESET') matchesSpecial = rowIsOverdueTimeSet;
        if (specialFilter === 'TIMESET') matchesSpecial = rowIsTimeSet;
        if (specialFilter === 'TODAY_LEAD') matchesSpecial = rowIsTodayLead;

        const matchesPriority = (activePriority === 'ALL' || rowPriority === activePriority);
        const matchesCategory = (cat === 'ALL' || rowCategory === cat);
        const matchesSearch = (!search || rowSearch.includes(search));

        let matchesCheckCall = true;
        if (checkFilter === 'UNCHECKED') matchesCheckCall = !isChecked;
        if (checkFilter === 'CHECKED') matchesCheckCall = isChecked;

        row.style.display = (matchesPriority && matchesSpecial && matchesCategory && matchesSearch && matchesCheckCall) ? '' : 'none';
      });

      // Filter Mobile Cards
      const cards = document.querySelectorAll('#mobileCardsFeed .phone-lead-card');
      cards.forEach(card => {
        const cardId = card.getAttribute('data-id');
        const cardPriority = card.getAttribute('data-priority');
        const cardCategory = card.getAttribute('data-category');
        const cardSearch = card.getAttribute('data-search');
        const cardIsTimeSet = card.getAttribute('data-timeset') === '1';
        const cardIsTodayTimeSet = card.getAttribute('data-today-timeset') === '1';
        const cardIsOverdueTimeSet = card.getAttribute('data-overdue-timeset') === '1';
        const cardIsTodayLead = card.getAttribute('data-today-lead') === '1';
        const isChecked = checkedList.includes(cardId);

        let matchesSpecial = true;
        if (specialFilter === 'TODAY_TIMESET') matchesSpecial = cardIsTodayTimeSet;
        if (specialFilter === 'OVERDUE_TIMESET') matchesSpecial = cardIsOverdueTimeSet;
        if (specialFilter === 'TIMESET') matchesSpecial = cardIsTimeSet;
        if (specialFilter === 'TODAY_LEAD') matchesSpecial = cardIsTodayLead;

        const matchesPriority = (activePriority === 'ALL' || cardPriority === activePriority);
        const matchesCategory = (cat === 'ALL' || cardCategory === cat);
        const matchesSearch = (!search || cardSearch.includes(search));

        let matchesCheckCall = true;
        if (checkFilter === 'UNCHECKED') matchesCheckCall = !isChecked;
        if (checkFilter === 'CHECKED') matchesCheckCall = isChecked;

        card.style.display = (matchesPriority && matchesSpecial && matchesCategory && matchesSearch && matchesCheckCall) ? 'block' : 'none';
      });
    }

    async function triggerRefresh() {
      const btn = document.getElementById('refreshBtn');
      if (btn) btn.innerText = '⏳ در حال دریافت...';
      showToast('⏳ در حال استعلام جدیدترین لیدها از سرور...', 'info');
      try {
        await fetch('/sync');
      } catch (e) {}
      location.reload();
    }

    // Real-time live push updates from local server
    if (typeof window !== 'undefined' && window.EventSource) {
      try {
        const evtSource = new EventSource('/api/events');
        evtSource.onmessage = function(e) {
          if (e.data && e.data.includes('SYNC_COMPLETE')) {
            showToast('⚡️ همگام‌سازی کارتابل انجام شد. بازخوانی اطلاعات جدید...', 'success');
            setTimeout(() => { location.reload(); }, 1200);
          }
        };
      } catch (err) {}
    }

    // Auto-refresh dashboard backup timer (every 10 minutes)
    setInterval(() => {
      triggerRefresh();
    }, 10 * 60 * 1000);

    function copyToClipboard(text, el) {
      navigator.clipboard.writeText(text).then(() => {
        const original = el.innerHTML;
        el.innerHTML = '✓';
        el.style.color = '#34D399';
        showToast('📋 شماره ' + text + ' در حافظه کپی شد.', 'info');
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
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 18px;">
          <div class="avatar-initial" style="width: 46px; height: 46px; font-size: 1.2rem;">\${lead.fullName ? lead.fullName.charAt(0) : '؟'}</div>
          <div>
            <h2 style="font-size: 1.2rem; font-weight: 800; color: #FFFFFF;">\${lead.fullName}</h2>
            <div style="font-size: 0.8rem; color: var(--text-muted);">\${lead.persona !== '-' ? lead.persona : 'بدون برچسب شغلی'}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; font-size: 0.84rem;">
          <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 10px;">
            <div style="color: var(--text-sub); font-size: 0.72rem;">شماره تماس مستقیم:</div>
            <div style="font-weight: 700; margin-top: 3px;"><a href="\${lead.phoneDialUrl}" style="color: #34D399; text-decoration: none;">📞 \${lead.phone}</a></div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 10px;">
            <div style="color: var(--text-sub); font-size: 0.72rem;">سطح اولویت تماس:</div>
            <div style="font-weight: 700; margin-top: 3px; color: \${lead.priorityColor};">\${lead.priorityCode} - \${lead.priorityName} (امتیاز: \${lead.score})</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 10px;">
            <div style="color: var(--text-sub); font-size: 0.72rem; margin-bottom: 4px;">وضعیت فعلی در سیستم:</div>
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              \${renderStatusBadge(lead.status, lead.statusFa)}
              <span style="font-size: 0.78rem; color: var(--text-sub);">(\${lead.categoryName})</span>
            </div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 10px;">
            <div style="color: var(--text-sub); font-size: 0.72rem;">مبلغ پیشنهادی / مانده حساب:</div>
            <div style="font-weight: 700; margin-top: 3px; color: #34D399;">\${lead.proposedAmountFormatted !== '-' ? lead.proposedAmountFormatted : lead.balanceFormatted}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 10px;">
            <div style="color: var(--text-sub); font-size: 0.72rem;">منبع و استخر واگذاری:</div>
            <div style="font-weight: 600; margin-top: 3px;">\${lead.source} (\${lead.poolName})</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 10px;">
            <div style="color: var(--text-sub); font-size: 0.72rem;">تعداد دفعات عدم پاسخ:</div>
            <div style="font-weight: 600; margin-top: 3px;">\${lead.noAnswerCount} مرتبه</div>
          </div>
        </div>

        <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: 12px; padding: 14px; margin-bottom: 16px;">
          <div style="font-weight: 700; color: #A5B4FC; font-size: 0.84rem; margin-bottom: 6px;">💡 استراتژی و توصیه مکالمه:</div>
          <div style="font-size: 0.82rem; line-height: 1.6; color: #E0E7FF;">\${lead.strategy}</div>
        </div>

        \${lead.nextActionNote !== '-' ? \`
          <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 12px; margin-bottom: 16px;">
            <div style="color: var(--text-sub); font-size: 0.72rem;">یادداشت ثبت‌شده قبلی:</div>
            <div style="font-size: 0.82rem; color: #93C5FD; margin-top: 3px;">📝 \${lead.nextActionNote}</div>
          </div>
        \` : ''}

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <a href="\${lead.phoneDialUrl}" class="btn-call" style="font-size: 0.92rem; padding: 12px 24px; width: 100%; justify-content: center;">
            📞 برقراری تماس تلفنی با \${lead.fullName}
          </a>
        </div>
      \`;

      modal.style.display = 'flex';
    }

    function closeModal(event) {
      document.getElementById('leadModal').style.display = 'none';
    }

    function showToast(msg, type = 'info') {
      const toast = document.getElementById('toast');
      const icon = document.getElementById('toastIcon');
      const text = document.getElementById('toastMsg');

      icon.innerText = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
      text.innerText = msg;

      toast.style.display = 'flex';
      setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }

    // Initialize check-calls on load
    applyCheckedState();
    applyFilters();
  </script>
</body>
</html>`;
}
