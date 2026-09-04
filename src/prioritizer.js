/**
 * CRM Call Prioritization & Action Planning Engine
 * Date-Aware Scoring, Commercial Value Calculation & Persian Standardization
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

// Status labels in Persian
export const STATUS_NAMES_FA = {
  NEW: "لید جدید",
  TIME_SET: "زمان تعیین‌شده",
  PROMISE_TO_PAY: "قول پرداخت",
  NEGOTIATING: "در حال مذاکره",
  NEEDS_CONSULT: "نیازمند مشاوره",
  FREE_COURSE: "دوره رایگان",
  NO_ANSWER: "عدم پاسخ",
  PAID: "پرداخت‌شده",
  REJECTED: "رد شده",
  WRONG_OVERLAP: "تداخل اشتباه",
  FOLLOW_UP: "پیگیری",
  PAYMENT: "واریز و تسویه",
};

export const PRIORITY_TIERS = {
  P1: {
    code: "P1",
    name: "فوری و حیاتی",
    description: "تماس در زمان هماهنگ‌شده، موعد گذشته یا پیگیری پرداخت فوری",
    color: "#EF4444", // Red
    bgColor: "#FEE2E2",
  },
  P2: {
    code: "P2",
    name: "اولویت بالا",
    description: "ثبت‌نام مجدد یا مذاکره داغ با مبالغ بالا و تمایل خرید",
    color: "#F97316", // Orange
    bgColor: "#FFEDD5",
  },
  P3: {
    code: "P3",
    name: "اولویت متوسط",
    description: "لیدهای جدید ورودی یا متقاضیان نیازمند مشاوره تلفنی",
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
    description: "عدم پاسخ مکرر (+۳ بار)؛ پیشنهاد ارسال پیامک یا پیام‌رسان",
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
 * Get standard Iran calendar date string (YYYY-MM-DD) in Asia/Tehran timezone
 */
export function getIranDateString(dateInput) {
  if (!dateInput) return null;
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Check if a date falls on today's calendar day in Iran (Asia/Tehran)
 */
export function isTodayInIran(dateInput) {
  const target = getIranDateString(dateInput);
  if (!target) return false;
  return target === getIranDateString(new Date());
}

/**
 * Check if a date falls on a past calendar day before today in Iran (Asia/Tehran)
 */
export function isPastDayInIran(dateInput) {
  const target = getIranDateString(dateInput);
  if (!target) return false;
  return target < getIranDateString(new Date());
}

/**
 * Check if a date falls on tomorrow in Iran (Asia/Tehran)
 */
export function isTomorrowInIran(dateInput) {
  const target = getIranDateString(dateInput);
  if (!target) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return target === getIranDateString(tomorrow);
}

/**
 * Clean and format numbers as Tomans
 */
export function formatAmount(amount) {
  if (!amount || isNaN(amount)) return "-";
  return Number(amount).toLocaleString("fa-IR") + " تومان";
}

/**
 * Generate smart sales strategy and talk track in Persian
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
      return "عدم پاسخ مکرر (۳+ بار)؛ به جای هدر دادن تایم تماس تلفنی، پیام صوتی/متنی در پیام‌رسان یا پیامک ارسال شود.";
    }
    return `عدم پاسخ نوبت ${lead.noAnswerCount || 1}؛ تماس مجدد در ساعات متفاوت (مثلاً عصر ۱۶ الی ۱۸).`;
  }

  return "بررسی نیازهای لید و هدایت به مناسب‌ترین محصول یا اشتراک.";
}

/**
 * Score lead from 0 to 100 considering commercial value, status, and precise date urgency
 */
function calculateLeadScore(lead, category) {
  let score = 50;
  let dateUrgencyLabel = "";
  let dateUrgencyColor = "";
  let dueDiffHours = null;

  const isTimeSet = lead.status === "TIME_SET" || category === "timeSet";
  const isTodayDue = isTodayInIran(lead.nextActionDueAt);
  const isPastDue = isPastDayInIran(lead.nextActionDueAt);
  const isTomorrowDue = isTomorrowInIran(lead.nextActionDueAt);
  const isTodayLead = category === "todayLeads" || isTodayInIran(lead.assignedAt || lead.createdAt);

  if (lead.nextActionDueAt) {
    const dueDate = new Date(lead.nextActionDueAt).getTime();
    const now = Date.now();
    dueDiffHours = (dueDate - now) / (1000 * 60 * 60);
  }

  // 1. Time Set Scoring (Top Priority Category)
  if (isTimeSet) {
    if (isTodayDue) {
      // Scheduled for TODAY: Priority #1
      score = 100;
      if (dueDiffHours !== null && dueDiffHours < 0) {
        dateUrgencyLabel = "🚨 قرار امروز (ساعت گذشته)";
        dateUrgencyColor = "#EF4444";
      } else if (dueDiffHours !== null && dueDiffHours <= 3) {
        dateUrgencyLabel = "⏰ قرار امروز (تا ۳ ساعت دیگر)";
        dateUrgencyColor = "#F59E0B";
      } else {
        dateUrgencyLabel = "📅 قرار تماس امروز (Time Set)";
        dateUrgencyColor = "#3B82F6";
      }
    } else if (isPastDue) {
      // Overdue Time Set from past days: Priority #2
      score = 98;
      const overdueDays = dueDiffHours !== null ? Math.max(1, Math.round(Math.abs(dueDiffHours) / 24)) : 1;
      dateUrgencyLabel = overdueDays <= 1 ? "⚠️ قرار معوقه دیروز" : `🚨 قرار معوقه (${overdueDays} روز قبل)`;
      dateUrgencyColor = "#EF4444";
    } else if (isTomorrowDue) {
      // Due tomorrow
      score = 88;
      dateUrgencyLabel = "📆 قرار تماس فردا";
      dateUrgencyColor = "#10B981";
    } else {
      // Further future (> 48h)
      score = 75;
      dateUrgencyLabel = "🗓️ موعد روزهای بعد";
      dateUrgencyColor = "#6B7280";
    }
  } else if (lead.status === "PROMISE_TO_PAY" || lead.nextActionType === "PAYMENT") {
    score = isTodayDue ? 95 : (isPastDue ? 92 : 88);
    dateUrgencyLabel = isTodayDue ? "💰 قول پرداخت امروز" : (isPastDue ? "⚠️ قول پرداخت معوقه" : "💳 قول پرداخت");
    dateUrgencyColor = isTodayDue ? "#10B981" : "#F59E0B";
  } else if (isTodayLead) {
    // New inbounds arriving today: Speed to Lead
    score = 92;
    dateUrgencyLabel = "⚡️ لید جدید امروز";
    dateUrgencyColor = "#10B981";
  } else if (lead.balance && lead.balance > 0) {
    score = 86;
    if (isTodayDue) {
      dateUrgencyLabel = "📅 موعد تسویه امروز";
      dateUrgencyColor = "#3B82F6";
    } else if (isPastDue) {
      dateUrgencyLabel = "⚠️ تسویه معوقه";
      dateUrgencyColor = "#F97316";
    }
  } else if (category === "reRegConflict" || lead.isReRegistered) {
    score = 82;
    dateUrgencyLabel = "🔄 ثبت‌نام مجدد";
    dateUrgencyColor = "#8B5CF6";
  } else if (lead.status === "NEGOTIATING") {
    score = isTodayDue ? 85 : (isPastDue ? 80 : 75);
    if (isTodayDue) {
      dateUrgencyLabel = "📅 پیگیری مذاکره امروز";
      dateUrgencyColor = "#3B82F6";
    } else if (isPastDue) {
      dateUrgencyLabel = "⚠️ مذاکره معوقه";
      dateUrgencyColor = "#F97316";
    }
  } else if (lead.status === "NEEDS_CONSULT") {
    score = 70;
  } else if (lead.status === "NEW" || category === "notCalled") {
    score = 65;
  } else if (lead.status === "FREE_COURSE" || category === "freeCourse") {
    score = 52;
  } else if (lead.status === "NO_ANSWER" || category === "noAnswer") {
    score = 40;
  }

  // 2. Commercial Value & High Intent Bonus
  if (lead.interestLevel === "HIGH") {
    score += 5;
  } else if (lead.interestLevel === "MEDIUM") {
    score += 2;
  }

  if (lead.proposedAmount && lead.proposedAmount >= 9000000) {
    score += 4;
  }

  if (lead.needsAttention) {
    score += 3;
  }

  // 3. Penalties
  if (lead.noAnswerCount >= 3) {
    score -= 25;
  } else if (lead.noAnswerCount === 2) {
    score -= 10;
  }

  if (lead.isBanned || lead.status === "REJECTED" || lead.status === "WRONG_OVERLAP") {
    score = 10;
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score: finalScore,
    dateUrgencyLabel: dateUrgencyLabel || (lead.nextActionDueAt ? formatIranDateTime(lead.nextActionDueAt) : "-"),
    dateUrgencyColor: dateUrgencyColor || "#9CA3AF",
    dueDiffHours,
    isTimeSet,
    isTodayTimeSet: isTimeSet && isTodayDue,
    isOverdueTimeSet: isTimeSet && isPastDue,
    isTodayLead,
    isTodayDue,
    isPastDue,
  };
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
    "todayLeads",
    "followUp",
    "balanceLeads",
    "reRegConflict",
    "notCalled",
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
    const scoringResult = calculateLeadScore(lead, lead.originalCategory);
    const tier = getPriorityTier(scoringResult.score, lead);
    const strategy = generateSalesStrategy(lead, lead.originalCategory);
    const formattedPhone = lead.phoneNormalized || lead.phoneRaw || "-";

    const statusFa = STATUS_NAMES_FA[lead.status] || lead.status || "لید جدید";

    prioritizedList.push({
      id: lead.id,
      fullName: lead.fullName || "بدون نام",
      phone: formattedPhone,
      phoneDialUrl: formattedPhone.startsWith("+")
        ? `tel:${formattedPhone}`
        : `tel:+98${formattedPhone.replace(/^0/, "")}`,
      status: lead.status || "NEW",
      statusFa,
      categoryKey: lead.originalCategory,
      categoryName: CATEGORY_NAMES[lead.originalCategory] || lead.originalCategory,
      priorityCode: tier.code,
      priorityName: tier.name,
      priorityColor: tier.color,
      priorityBgColor: tier.bgColor,
      score: scoringResult.score,
      dateUrgencyLabel: scoringResult.dateUrgencyLabel,
      dateUrgencyColor: scoringResult.dateUrgencyColor,
      dueDiffHours: scoringResult.dueDiffHours,
      isTimeSet: scoringResult.isTimeSet,
      isTodayTimeSet: scoringResult.isTodayTimeSet,
      isOverdueTimeSet: scoringResult.isOverdueTimeSet,
      isTodayLead: scoringResult.isTodayLead,
      isTodayDue: scoringResult.isTodayDue,
      isPastDue: scoringResult.isPastDue,
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

  // ====================================================================
  // Smart Multi-Stage Sorting Engine:
  // 1. Today's Time Sets (old -> new: earlier appointment hour today first)
  // 2. Overdue Time Sets from past days (old -> new: oldest missed first)
  // 3. Today's New Inbounds (todayLeads: speed to lead, old -> new)
  // 4. Other Scheduled Calls due today (Promise to Pay / Follow-up today)
  // 5. Near Future Time Sets (Tomorrow / next 48h, old -> new)
  // 6. Commercial Score (P1 -> P2 -> P3...)
  // 7. Earliest Scheduled Due Date (old -> new)
  // ====================================================================
  prioritizedList.sort((a, b) => {
    // Stage 1: Today's Time Sets come FIRST, ordered old -> new (earlier time today first)
    if (a.isTodayTimeSet && !b.isTodayTimeSet) return -1;
    if (!a.isTodayTimeSet && b.isTodayTimeSet) return 1;
    if (a.isTodayTimeSet && b.isTodayTimeSet) {
      return new Date(a.nextActionDueAt).getTime() - new Date(b.nextActionDueAt).getTime();
    }

    // Stage 2: Overdue Time Sets from past days come NEXT, ordered old -> new (oldest missed appointment first)
    if (a.isOverdueTimeSet && !b.isOverdueTimeSet) return -1;
    if (!a.isOverdueTimeSet && b.isOverdueTimeSet) return 1;
    if (a.isOverdueTimeSet && b.isOverdueTimeSet) {
      return new Date(a.nextActionDueAt).getTime() - new Date(b.nextActionDueAt).getTime();
    }

    // Stage 3: Today's New Inbounds (todayLeads / arrived today), ordered old -> new
    if (a.isTodayLead && !b.isTodayLead) return -1;
    if (!a.isTodayLead && b.isTodayLead) return 1;
    if (a.isTodayLead && b.isTodayLead) {
      const aTime = new Date(a.assignedAt || a.createdAt || 0).getTime();
      const bTime = new Date(b.assignedAt || b.createdAt || 0).getTime();
      return aTime - bTime;
    }

    // Stage 4: Other calls due today (Promise to pay, Follow up due today) (old -> new)
    if (a.isTodayDue && !b.isTodayDue) return -1;
    if (!a.isTodayDue && b.isTodayDue) return 1;
    if (a.isTodayDue && b.isTodayDue && a.nextActionDueAt && b.nextActionDueAt) {
      return new Date(a.nextActionDueAt).getTime() - new Date(b.nextActionDueAt).getTime();
    }

    // Stage 5: Near Future Time Sets (Tomorrow / next 48h), ordered old -> new
    const aIsNearTimeSet = a.isTimeSet && a.dueDiffHours !== null && a.dueDiffHours > 0 && a.dueDiffHours <= 48;
    const bIsNearTimeSet = b.isTimeSet && b.dueDiffHours !== null && b.dueDiffHours > 0 && b.dueDiffHours <= 48;
    if (aIsNearTimeSet && !bIsNearTimeSet) return -1;
    if (!aIsNearTimeSet && bIsNearTimeSet) return 1;
    if (aIsNearTimeSet && bIsNearTimeSet) {
      return new Date(a.nextActionDueAt).getTime() - new Date(b.nextActionDueAt).getTime();
    }

    // Stage 6: Deprioritize far future appointments (> 48 hours)
    const aIsFar = a.dueDiffHours !== null && a.dueDiffHours > 48;
    const bIsFar = b.dueDiffHours !== null && b.dueDiffHours > 48;
    if (aIsFar && !bIsFar) return 1;
    if (!aIsFar && bIsFar) return -1;

    // Stage 7: Commercial Score descending (P1 -> P2 -> P3...)
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    // Stage 8: Earliest due date (old -> new)
    if (a.nextActionDueAt && b.nextActionDueAt) {
      return new Date(a.nextActionDueAt).getTime() - new Date(b.nextActionDueAt).getTime();
    }
    if (a.nextActionDueAt) return -1;
    if (b.nextActionDueAt) return 1;

    // Stage 9: Proposed amount or balance
    return (b.proposedAmount || b.balance || 0) - (a.proposedAmount || a.balance || 0);
  });

  return prioritizedList;
}
