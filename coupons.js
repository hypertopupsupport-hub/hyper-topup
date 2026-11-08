/* HYPER TOPUP — Central Coupon Configuration */

/*
  طريقة تحديد مدة للكود (اختياري، تقدر تستخدم أي واحد منهم أو الاتنين):

    startsAt : بداية صلاحية الكود
    expires  : نهاية صلاحية الكود

  صيغة التاريخ (بتوقيت القاهرة):
    'YYYY-MM-DD'        → التاريخ لوحده.
                          startsAt بتبدأ من 00:00 في اليوم ده.
                          expires بتنتهي 23:59:59 في اليوم ده.
    'YYYY-MM-DD HH:mm'  → تاريخ ووقت بالظبط (مثال: '2026-12-02 14:30').

  أمثلة:
    يوم واحد  (1 ديسمبر بس)   : startsAt: '2026-12-01', expires: '2026-12-01'
    يومين     (1 و2 ديسمبر)  : startsAt: '2026-12-01', expires: '2026-12-02'
    لحد وقت محدد               : expires: '2026-12-02 14:30'
    من غير مدة                 : متكتبش startsAt ولا expires (الكود شغال دايماً)
*/

const GLOBAL_COUPONS = {
  // =========================
  // الأكواد العامة الأصلية
  // =========================
  'WELCOME': {
    type: 'percent', value: 5, minPrice: 100, game: 'all'
  },
  'HYPER-9K2X-77': {
    type: 'percent', value: 10, minPrice: 100, game: 'all'
  },
  'VIP-8M3P-15': {
    type: 'fixed', value: 15, minPrice: 100, game: 'all'
  },
  'GAME-77KR-99': {
    type: 'percent', value: 15, minPrice: 100, game: 'all'
  },

  // =========================
  // PUBG MOBILE
  // =========================
  'PUBG50': {
    type: 'percent', value: 20, minPrice: 50,
    game: 'PUBG MOBILE'
  },
  'PUBG-VIP': {
    type: 'fixed', value: 30, minPrice: 150,
    game: 'PUBG MOBILE'
  },
  'HYPER5': {
    type: 'percent', value: 10, maxDiscount: 20,
    minPrice: 49, game: 'PUBG MOBILE'
  },

  // =========================
  // FREE FIRE
  // =========================
  'FREEFIRE20': {
    type: 'percent', value: 15, minPrice: 40,
    game: 'FREE FIRE'
  },
  'FF-SPECIAL': {
    type: 'fixed', value: 20, minPrice: 100,
    game: 'FREE FIRE'
  },

  // =========================
  // GANGSTAR MIRAGE CITY
  // =========================
  'MIRAGE10': {
    type: 'percent', value: 10, minPrice: 50,
    game: 'GANGSTAR MIRAGE CITY'
  },
  'GANGSTAR-VIP': {
    type: 'fixed', value: 25, minPrice: 120,
    game: 'GANGSTAR MIRAGE CITY'
  },

  // =========================
  // حملة قناة واتساب
  // =========================
  'WAHYPER10': {
    type: 'percent', value: 10, maxDiscount: 20,
    minPrice: 49, game: 'all',
    expires: '2026-11-11'   // صالح لحد آخر يوم 11/11/2026 (لحد 11:59:59 بالليل بتوقيت القاهرة)
  },

  // =========================
  // أكواد عامة للمستقبل
  // لا تعلن عنها قبل اختبارها
  // =========================
  'HYPERWELCOME': {
    type: 'percent', value: 5, maxDiscount: 10,
    minPrice: 50, game: 'all'
  },
  'HYPERFRIEND': {
    type: 'fixed', value: 10,
    minPrice: 75, game: 'all'
  },
  'HYPERWEEKEND': {
    type: 'percent', value: 8, maxDiscount: 15,
    minPrice: 75, game: 'all'
    // مثال: تفعّل الكود للويك إند بس ← startsAt: '2026-12-04', expires: '2026-12-05'
  },
  'HYPERRETURN': {
    type: 'percent', value: 7, maxDiscount: 15,
    minPrice: 75, game: 'all'
  },
  'HYPERLOYAL': {
    type: 'fixed', value: 15,
    minPrice: 150, game: 'all'
  },

  // =========================
  // أكواد PUBG MOBILE مستقبلية
  // =========================
  'PUBGSTART': {
    type: 'percent', value: 5, maxDiscount: 10,
    minPrice: 49, game: 'PUBG MOBILE'
  },
  'PUBGBOOST': {
    type: 'percent', value: 8, maxDiscount: 15,
    minPrice: 75, game: 'PUBG MOBILE'
  },

  // =========================
  // أكواد FREE FIRE مستقبلية
  // =========================
  'FFSTART': {
    type: 'percent', value: 5, maxDiscount: 10,
    minPrice: 40, game: 'FREE FIRE'
  },
  'FFBOOST': {
    type: 'percent', value: 8, maxDiscount: 15,
    minPrice: 75, game: 'FREE FIRE'
  },

  // =========================
  // أكواد GANGSTAR مستقبلية
  // =========================
  'MIRAGESTART': {
    type: 'percent', value: 5, maxDiscount: 10,
    minPrice: 50, game: 'GANGSTAR MIRAGE CITY'
  },
  'MIRAGEBOOST': {
    type: 'percent', value: 8, maxDiscount: 15,
    minPrice: 75, game: 'GANGSTAR MIRAGE CITY'
  }

  // ==========================================================
  // قوالب جاهزة لأكواد جديدة (متعطّلة: كلها معمولة تعليق //)
  // ----------------------------------------------------------
  // الخطوات: 1) امسح // من أول السطر  2) اكتب اسم الكود مكان
  //          NAME_HERE  3) عدّل القيم  4) متنساش الفاصلة (,) بعد
  //          القوس } لو هيجي بعده كود تاني.
  // - percent = نسبة %، fixed = مبلغ ثابت بالجنيه
  // - maxDiscount = أقصى خصم بالجنيه (اختياري، مع percent بس)
  // - minPrice = أقل سعر باقة يشتغل عليه الكود
  // - startsAt / expires = بداية ونهاية الصلاحية (اختياري، شيلهم لو مفيش مدة)
  // - اسم اللعبة لازم يفضل زي ما هو بالحروف الكبيرة بالظبط
  // ==========================================================

  // --- FREE FIRE ---
  // 'NAME_HERE': { type: 'percent', value: 10, maxDiscount: 20, minPrice: 50, game: 'FREE FIRE', startsAt: '2026-11-08', expires: '2026-11-11' },
  // 'NAME_HERE': { type: 'fixed',   value: 10,                  minPrice: 50, game: 'FREE FIRE', startsAt: '2026-11-08', expires: '2026-11-11' },
  // --- GANGSTAR MIRAGE CITY ---
  // 'NAME_HERE': { type: 'percent', value: 10, maxDiscount: 20, minPrice: 50, game: 'GANGSTAR MIRAGE CITY', startsAt: '2026-11-08', expires: '2026-11-11' },
  // 'NAME_HERE': { type: 'fixed',   value: 10,                  minPrice: 50, game: 'GANGSTAR MIRAGE CITY', startsAt: '2026-11-08', expires: '2026-11-11' },
  // --- FC MOBILE ---
  // 'NAME_HERE': { type: 'percent', value: 10, maxDiscount: 20, minPrice: 50, game: 'FC MOBILE', startsAt: '2026-11-08', expires: '2026-11-11' },
  // 'NAME_HERE': { type: 'fixed',   value: 10,                  minPrice: 50, game: 'FC MOBILE', startsAt: '2026-11-08', expires: '2026-11-11' },
  // --- DELTA FORCE ---
  // 'NAME_HERE': { type: 'percent', value: 10, maxDiscount: 20, minPrice: 50, game: 'DELTA FORCE', startsAt: '2026-11-08', expires: '2026-11-11' },
  // 'NAME_HERE': { type: 'fixed',   value: 10,                  minPrice: 50, game: 'DELTA FORCE', startsAt: '2026-11-08', expires: '2026-11-11' },
  // --- CALL OF DUTY MOBILE (CODM) ---
  // 'NAME_HERE': { type: 'percent', value: 10, maxDiscount: 20, minPrice: 50, game: 'CALL OF DUTY MOBILE', startsAt: '2026-11-08', expires: '2026-11-11' },
  // 'NAME_HERE': { type: 'fixed',   value: 10,                  minPrice: 50, game: 'CALL OF DUTY MOBILE', startsAt: '2026-11-08', expires: '2026-11-11' },
  // --- HONOR OF KINGS (HOK) ---
  // 'NAME_HERE': { type: 'percent', value: 10, maxDiscount: 20, minPrice: 50, game: 'HONOR OF KINGS', startsAt: '2026-11-08', expires: '2026-11-11' },
  // 'NAME_HERE': { type: 'fixed',   value: 10,                  minPrice: 50, game: 'HONOR OF KINGS', startsAt: '2026-11-08', expires: '2026-11-11' },
  // --- YALLA LUDO ---
  // 'NAME_HERE': { type: 'percent', value: 10, maxDiscount: 20, minPrice: 50, game: 'YALLA LUDO', startsAt: '2026-11-08', expires: '2026-11-11' },
  // 'NAME_HERE': { type: 'fixed',   value: 10,                  minPrice: 50, game: 'YALLA LUDO', startsAt: '2026-11-08', expires: '2026-11-11' },
  // --- PUBG MOBILE ---
  // 'NAME_HERE': { type: 'percent', value: 10, maxDiscount: 20, minPrice: 50, game: 'PUBG MOBILE', startsAt: '2026-11-08', expires: '2026-11-11' },
  // 'NAME_HERE': { type: 'fixed',   value: 10,                  minPrice: 50, game: 'PUBG MOBILE', startsAt: '2026-11-08', expires: '2026-11-11' },
  // --- كل الألعاب ---
  // 'NAME_HERE': { type: 'percent', value: 10, maxDiscount: 20, minPrice: 50, game: 'all', startsAt: '2026-11-08', expires: '2026-11-11' },
  // 'NAME_HERE': { type: 'fixed',   value: 10,                  minPrice: 50, game: 'all', startsAt: '2026-11-08', expires: '2026-11-11' },

};


/* ------------------------------------------------------------
   أدوات التاريخ (بتوقيت القاهرة، بدون الاعتماد على منطقة جهاز الزبون)
   ------------------------------------------------------------ */

// الوقت الحالي في القاهرة بصيغة 'YYYY-MM-DD HH:mm:ss' (تقدر تقارنه كنص)
function cairoNowStamp() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Cairo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(new Date());
  const p = {};
  parts.forEach(x => { p[x.type] = x.value; });
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`;
}

// تحويل قيمة startsAt / expires لنفس الصيغة. بترجع null لو الصيغة غلط
function normalizeStamp(value, endOfDay) {
  let s = String(value).trim().replace('T', ' ');
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    s += endOfDay ? ' 23:59:59' : ' 00:00:00';
  } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(s)) {
    s += ':00';
  }
  return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s) ? s : null;
}


function validateCouponCode(code, basePrice, currentGameName) {
  const result = {
    success: false,
    message: '',
    discountAmount: 0
  };

  if (
    typeof code !== 'string' ||
    !code.trim() ||
    !Number.isFinite(Number(basePrice)) ||
    Number(basePrice) <= 0
  ) {
    result.message = '⚠️ تحقق من كود الخصم وسعر الباقة';
    return result;
  }

  // تجاهل اختلاف الحروف والمسافات
  const normalizedCode = code.trim().toUpperCase();
  const price = Number(basePrice);
  const coupon = Object.prototype.hasOwnProperty.call(GLOBAL_COUPONS, normalizedCode)
    ? GLOBAL_COUPONS[normalizedCode]
    : null;

  if (!coupon) {
    result.message = '❌ كود الخصم غير صحيح';
    return result;
  }

  // التحقق من اللعبة
  const couponGame = coupon.game || 'all';
  if (couponGame !== 'all' && couponGame !== currentGameName) {
    result.message = `⚠️ هذا الكود مخصص للعبة ${couponGame}`;
    return result;
  }

  // التحقق من مدة الصلاحية (بتوقيت القاهرة)
  if (coupon.startsAt !== undefined || coupon.expires !== undefined) {
    const now = cairoNowStamp();

    if (coupon.startsAt !== undefined) {
      const start = normalizeStamp(coupon.startsAt, false);
      if (!start) {
        result.message = '⚠️ إعدادات تاريخ بداية الكود غير صحيحة';
        return result;
      }
      if (now < start) {
        result.message = '⏳ هذا الكود لم يبدأ بعد';
        return result;
      }
    }

    if (coupon.expires !== undefined) {
      const end = normalizeStamp(coupon.expires, true);
      if (!end) {
        result.message = '⚠️ إعدادات تاريخ انتهاء الكود غير صحيحة';
        return result;
      }
      if (now > end) {
        result.message = '⌛ انتهت صلاحية هذا الكود';
        return result;
      }
    }
  }

  // التحقق من الحد الأدنى للسعر
  if (price < coupon.minPrice) {
    result.message =
      `⚠️ الكود يعمل على الباقات بسعر ${coupon.minPrice} جنيه فأكثر`;
    return result;
  }

  // فحص محلي فقط؛ لا يمنع التحايل من متصفح آخر
  try {
    const usedCoupons = JSON.parse(
      localStorage.getItem('hyper_used_coupons') || '[]'
    );

    if (
      Array.isArray(usedCoupons) &&
      usedCoupons.includes(normalizedCode)
    ) {
      result.message =
        '⚠️ سبق استخدام هذا الكود على هذا المتصفح';
      return result;
    }
  } catch {
    result.message = '⚠️ تعذر التحقق من سجل الأكواد';
    return result;
  }

  // حساب الخصم
  let discount;

  if (coupon.type === 'percent') {
    discount = price * coupon.value / 100;
  } else if (coupon.type === 'fixed') {
    discount = coupon.value;
  } else {
    result.message = '⚠️ إعدادات كود الخصم غير صحيحة';
    return result;
  }

  // تطبيق الحد الأقصى للخصم
  if (Number.isFinite(coupon.maxDiscount)) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  // الخصم لا يتجاوز سعر الباقة
  discount = Math.min(discount, price);

  result.success = true;
  result.discountAmount =
    Math.round(discount * 100) / 100;
  result.message = '✅ تم التحقق من كود الخصم';

  return result;
}
