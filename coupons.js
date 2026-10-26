/* HYPER TOPUP — Central Coupon Configuration */

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
    minPrice: 49, game: 'all'
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
};


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
  const coupon = GLOBAL_COUPONS[normalizedCode];

  if (!coupon) {
    result.message = '❌ كود الخصم غير صحيح';
    return result;
  }

  // التحقق من اللعبة
  if (
    coupon.game !== 'all' &&
    coupon.game !== currentGameName
  ) {
    result.message =
      `⚠️ هذا الكود مخصص للعبة ${coupon.game}`;
    return result;
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
