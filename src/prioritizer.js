/**
 * CRM Call Prioritization & Action Planning Engine
 */

// Category labels in Persian
export const CATEGORY_NAMES = {
  todayLeads: "لیدهای امروز",
  timeSet: "زمان تعیین‌شده (Time Set)",
  promiseToPay: "قول واریز (Promise to Pay)",
  balanceLeads: "وصول مطالبات و اقساط",
  reRegConflict: "ثبت‌نام مجدد (Re-Register)",
  followUp: "پیگیری و مذاکره (Follow Up)",
  notCalled: "لیدهای جدید بدون تماس",
  freeCourse: "دانشجویان دوره رایگان",
  noAnswer: "عدم پاسخ (No Answer)",
};

export const PRIORITY_TIERS = {
  P1: {
    code: "P1",
    name: "فوری و حیاتی",
    description: "تماس در زمان هماهنگ‌شده یا پیگیری پرداخت فوری",
    color: "#EF4444", // Red
    bgColor: "#FEE2E2",
  },
  P2: {
    code: "P2",
    name: "اولویت بالا",
    description: "ثبت‌نام مجدد یا مذاکره داغ با احتمال تبدیل بالا",
    color: "#F97316", // Orange
    bgColor: "#FFEDD5",
  },
  P3: {
    code: "P3",
    name: "اولویت متوسط",
    description: "لیدهای جدید یا متقاضیان نیازمند مشاوره",
    color: "#3B82F6", // Blue
    bgColor: "#DBEAFE",
  },
  P4: {
    code: "P4",
    name: "پیگیری معمول",
    description: "پیگیری دوره رایگان یا لیدهای ۱ یا ۲ بار عدم پاسخ",
    color: "#10B981", // Green
    bgColor: "#D1FAE5",
  },
  P5: {
    code: "P5",
    name: "اولویت پایین / اتوماسیون",
    description: "عدم پاسخ مکرر (+۳ بار)؛ پیشنهاد ارسال پیامک یا بله",
    color: "#6B7280", // Gray
    bgColor: "#F3F4F6",
  },
};

/**
 * Format ISO date string into readable Iranian Timezone (Asia/Tehran)
 */
export function formatIranDateTime(isoString) {
  if (!isoString) return "-";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("fa-IR", {
      timeZone: "Asia/Tehran",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch (e) {
    return isoString;
  }
}

/**
 * Clean and format numbers as Tomans
 */
export function formatAmount(amount) {
  if (!amount || isNaN(amount)) return "-";
  return Number(amount).toLocaleString("fa-IR") + " تومان";
}

/**
 * Generate smart sales strategy and talk track
 */
function generateSalesStrategy(lead, category) {
  const note = lead.nextActionNote || lead.conflictNote || "";
  const amount = lead.proposedAmount || lead.balance;
  const persona = lead.personaLabel || lead.persona || "";

  if (lead.status === "PROMISE_TO_PAY" || lead.nextActionType === "PAYMENT") {
    if (amount) {
      return `پیگیری پرداخت مبلغ ${formatAmount(amount)}؛ ارسال لینک مستقیم درگاه و ارائه پشتیبانی ثبت‌نام.`;
    }
    return "پیگیری پرداخت قول داده شده و ارسال فوری مشخصات واریز.";
  }

  if (lead.balance && lead.balance > 0) {
    return `پیگیری تسویه مانده حساب/قسط به مبلغ ${formatAmount(lead.balance)}.`;
  }

  if (lead.status === "TIME_SET") {
    const timeNote = note ? ` با توجه به یادداشت: «${note}»` : "";
    return `تماس دقیق در رأس زمان هماهنگ‌شده${timeNote}؛ ادامه مشاوره با تمرکز بر بستن ثبت‌نام.`;
  }

  if (category === "reRegConflict" || lead.isReRegistered) {
    const reRegSource = lead.lastReRegSourceName || lead.source || "کمپین جدید";
    return `لید دوباره درخواست داده (${reRegSource})! تمایل مجدد را یادآوری کرده و آفر ویژه به او پیشنهاد دهید.`;
  }

  if (lead.status === "NEW" || category === "notCalled") {
    return "لید داغ و جدید! تماس سریع (Speed to Lead) جهت تبریک عضویت، کشف دغدغه اصلی و ارائه مشاوره اختصاصی.";
  }

  if (lead.status === "NEGOTIATING" || lead.status === "NEEDS_CONSULT") {
    if (persona.includes("کسب‌وکار") || persona.includes("مدیران") || persona.includes("شرکت")) {
      return "مخاطب سازمانی/صاحب کسب‌وکار؛ تاکید بر بازگشت سرمایه (ROI)، افزایش راندمان با AI و نمونه‌های موفق.";
    }
    if (persona.includes("فریلنسر") || persona.includes("درآمد")) {
      return "مخاطب فریلنسری؛ پرزنت سرفصل‌های درآمدزایی سریع، همکاری در فروش (افیلیت) و تمرین‌های عملی.";
    }
    return note ? `پیگیری پیرامون یادداشت قبلی: «${note}» و رفع تردید نهایی.` : "مذاکره فعال؛ بررسی دغدغه کاربر در مورد هزینه یا زمان دوره و پیشنهاد پلن متناسب.";
  }

  if (lead.status === "FREE_COURSE" || category === "freeCourse") {
    return "بررسی پیشرفت در مینی‌دوره رایگان؛ ایجاد نیاز به یادگیری عمیق‌تر و ارتقا به پکیج‌های جامع و تخصصی.";
  }

  if (lead.status === "NO_ANSWER" || category === "noAnswer") {
    if (lead.noAnswerCount >= 3) {
      return "عدم پاسخ مکرر (۳+ بار)؛ به جای هدر دادن تایم تماس تلفنی، پیام صوتی/متنی در بله یا پیامک ارسال شود.";
    }
    return `عدم پاسخ نوبت ${lead.noAnswerCount || 1}؛ تماس مجدد در ساعات متفاوت (مثلاً عصر ۱۶ الی ۱۸).`;
  }

  return "بررسی نیازهای لید و هدایت به مناسب‌ترین محصول یا اشتراک.";
}

/**
 * Score lead from 0 to 100
 */
function calculateLeadScore(lead, category) {
  let score = 50;

  // 1. Status & Category Weight
  if (lead.status === "PROMISE_TO_PAY" || lead.nextActionType === "PAYMENT") {
    score = 95;
  } else if (lead.balance && lead.balance > 0) {
    score = 93;
  } else if (lead.status === "TIME_SET") {
    score = 90;
  } else if (category === "reRegConflict" || lead.isReRegistered) {
    score = 82;
  } else if (lead.status === "NEGOTIATING") {
    score = 78;
  } else if (lead.status === "NEEDS_CONSULT") {
    score = 72;
  } else if (lead.status === "NEW" || category === "notCalled") {
    score = 68;
  } else if (lead.status === "FREE_COURSE" || category === "freeCourse") {
    score = 55;
  } else if (lead.status === "NO_ANSWER" || category === "noAnswer") {
    score = 45;
  }

  // 2. Scheduled Due Date urgency
  if (lead.nextActionDueAt) {
    const dueDate = new Date(lead.nextActionDueAt).getTime();
    const now = Date.now();
    const diffHours = (dueDate - now) / (1000 * 60 * 60);

    if (diffHours < 0) {
      // Overdue! Needs urgent calling
      score += 8;
    } else if (diffHours <= 24) {
      // Due today
      score += 6;
    }
  }

  // 3. High intent & amount bonus
  if (lead.interestLevel === "HIGH") {
    score += 8;
  } else if (lead.interestLevel === "MEDIUM") {
    score += 3;
  }

  if (lead.proposedAmount && lead.proposedAmount >= 9000000) {
    score += 6;
  }

  if (lead.needsAttention) {
    score += 4;
  }

  // 4. Penalties
  if (lead.noAnswerCount >= 3) {
    score -= 25;
  } else if (lead.noAnswerCount === 2) {
    score -= 10;
  }

  if (lead.isBanned || lead.status === "REJECTED" || lead.status === "WRONG_OVERLAP") {
    score = 10;
  }

  // Clamp 0 - 100
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Determine Priority Tier
 */
function getPriorityTier(score, lead) {
  if (lead.isBanned || lead.status === "REJECTED" || lead.status === "WRONG_OVERLAP") {
    return PRIORITY_TIERS.P5;
  }
  if (score >= 85) return PRIORITY_TIERS.P1;
  if (score >= 70) return PRIORITY_TIERS.P2;
  if (score >= 55) return PRIORITY_TIERS.P3;
  if (score >= 38) return PRIORITY_TIERS.P4;
  return PRIORITY_TIERS.P5;
}

/**
 * Main function to prioritize and plan calls from CRM raw cartable JSON
 */
export function prioritizeCalls(rawCartable) {
  if (!rawCartable || typeof rawCartable !== "object") {
    return [];
  }

  const categoryKeys = [
    "timeSet",
    "followUp",
    "balanceLeads",
    "reRegConflict",
    "notCalled",
    "todayLeads",
    "freeCourse",
    "noAnswer",
  ];

  const leadMap = new Map();

  for (const cat of categoryKeys) {
    const list = Array.isArray(rawCartable[cat]) ? rawCartable[cat] : [];
    for (const item of list) {
      if (!item || !item.id) continue;

      // Filter out paid leads with 0 balance
      if (item.status === "PAID" && (!item.balance || item.balance <= 0)) {
        continue;
      }

      if (!leadMap.has(item.id)) {
        leadMap.set(item.id, { ...item, originalCategory: cat });
      } else {
        // Merge attributes if item already exists
        const existing = leadMap.get(item.id);
        leadMap.set(item.id, {
          ...item,
          ...existing,
          isReRegistered: existing.isReRegistered || item.isReRegistered,
          cartableReReg: existing.cartableReReg || item.cartableReReg,
          nextActionDueAt: existing.nextActionDueAt || item.nextActionDueAt,
          nextActionNote: existing.nextActionNote || item.nextActionNote,
          originalCategory: existing.originalCategory || cat,
        });
      }
    }
  }

  const prioritizedList = [];

  for (const lead of leadMap.values()) {
    const score = calculateLeadScore(lead, lead.originalCategory);
    const tier = getPriorityTier(score, lead);
    const strategy = generateSalesStrategy(lead, lead.originalCategory);
    const formattedPhone = lead.phoneNormalized || lead.phoneRaw || "-";

    prioritizedList.push({
      id: lead.id,
      fullName: lead.fullName || "بدون نام",
      phone: formattedPhone,
      phoneDialUrl: formattedPhone.startsWith("+") ? `tel:${formattedPhone}` : `tel:+98${formattedPhone.replace(/^0/, "")}`,
      status: lead.status || "NEW",
      categoryKey: lead.originalCategory,
      categoryName: CATEGORY_NAMES[lead.originalCategory] || lead.originalCategory,
      priorityCode: tier.code,
      priorityName: tier.name,
      priorityColor: tier.color,
      priorityBgColor: tier.bgColor,
      score,
      interestLevel: lead.interestLevel || "-",
      persona: lead.personaLabel || lead.persona || "-",
      source: lead.source || "-",
      poolName: lead.poolName || "-",
      ownerName: lead.ownerName || "-",
      proposedAmount: lead.proposedAmount || 0,
      balance: lead.balance || 0,
      proposedAmountFormatted: formatAmount(lead.proposedAmount),
      balanceFormatted: formatAmount(lead.balance),
      noAnswerCount: lead.noAnswerCount || 0,
      nextActionType: lead.nextActionType || "-",
      nextActionDueAt: lead.nextActionDueAt || null,
      nextActionDueAtFormatted: formatIranDateTime(lead.nextActionDueAt),
      nextActionNote: lead.nextActionNote || lead.conflictNote || "-",
      lastCallAt: lead.lastCallAt || null,
      lastCallAtFormatted: formatIranDateTime(lead.lastCallAt),
      assignedAt: lead.assignedAt || null,
      assignedAtFormatted: formatIranDateTime(lead.assignedAt),
      strategy,
    });
  }

  // Sort: High score first; for equal scores, earlier scheduled nextActionDueAt first
  prioritizedList.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (a.nextActionDueAt && b.nextActionDueAt) {
      return new Date(a.nextActionDueAt) - new Date(b.nextActionDueAt);
    }
    return (b.proposedAmount || 0) - (a.proposedAmount || 0);
  });

  return prioritizedList;
}
