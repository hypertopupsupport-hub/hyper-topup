/* HYPER TOPUP — Central Coupon Configuration */

const GLOBAL_COUPONS = {
  // أكواد عامة — محفوظة كما هي
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

  // PUBG MOBILE
  'PUBG50': {
    type: 'percent', value: 20, minPrice: 50,
    game: 'PUBG MOBILE'
  },
  'PUBG-VIP': {
    type: 'fixed', value: 30, minPrice: 150,
    game: 'PUBG MOBILE'
  },

  // حملة ترويجية جديدة
  'HYPER5': {
    type: 'percent',
    value: 10,
    maxDiscount: 20,
    minPrice: 49,
    game: 'PUBG MOBILE'
  },

  // FREE FIRE
  'FREEFIRE20': {
    type: 'percent', value: 15, minPrice: 40,
    game: 'FREE FIRE'
  },
  'FF-SPECIAL': {
    type: 'fixed', value: 20, minPrice: 100,
    game: 'FREE FIRE'
  },

  // GANGSTAR MIRAGE CITY
  'MIRAGE10': {
    type: 'percent', value: 10, minPrice: 50,
    game: 'GANGSTAR MIRAGE CITY'
  },
  'GANGSTAR-VIP': {
    type: 'fixed', value: 25, minPrice: 120,
    game: 'GANGSTAR MIRAGE CITY'
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
    result.message = `⚠️ هذا الكود مخصص للعبة ${coupon.game}`;
    return result;
  }

  // التحقق من الحد الأدنى للسعر
  if (price < coupon.minPrice) {
    result.message =
      `⚠️ الكود يعمل على الباقات بسعر ${coupon.minPrice} جنيه فأكثر`;
    return result;
  }

  // فحص الاستخدام المحلي — ليس حماية من التحايل
  try {
    const usedCoupons = JSON.parse(
      localStorage.getItem('hyper_used_coupons') || '[]'
    );

    if (
      Array.isArray(usedCoupons) &&
      usedCoupons.includes(normalizedCode)
    ) {
      result.message = '⚠️ سبق استخدام هذا الكود على هذا المتصفح';
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

  // تطبيق الحد الأقصى إن كان محددًا
  if (Number.isFinite(coupon.maxDiscount)) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  // لا يمكن أن يتجاوز الخصم سعر المنتج
  discount = Math.min(discount, price);

  result.success = true;
  result.discountAmount = Math.round(discount * 100) / 100;
  result.message = '✅ تم التحقق من كود الخصم';

  return result;
}
