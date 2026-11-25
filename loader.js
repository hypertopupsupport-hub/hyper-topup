/*!
 * HYPER TOPUP — SKELETON SHIMMER LOADER
 * Version: 4.0.0
 * شاشة تحميل هياكل بتلمع، مظبوطة على صفحات المتجر الفعلية.
 *
 * الأشكال المتاحة (data-layout):
 *   home           الصفحة الرئيسية
 *   product        صفحة منتج فيها تابز (زي PUBG)
 *   product-simple صفحة منتج من غير تابز (زي TikTok)  ← الافتراضي
 *   games          صفحة "كل الألعاب"
 *   products       صفحة "جميع المنتجات والخدمات"
 *   account        صفحة "حسابي"
 *   auto           (الافتراضي) يختار حسب اسم الصفحة
 */

(function () {
  'use strict';

  if (window.HyperLoader && window.HyperLoader.active) return;

  /* =========================================
     1. الإعدادات
  ========================================= */

  var S = document.currentScript;

  function getAttr(name, fallback) {
    return (S && S.getAttribute('data-' + name)) || fallback;
  }

  /* اختيار الشكل تلقائياً من اسم الصفحة */
  function detect() {
    var p = location.pathname.replace(/\/+$/, '');
    try { p = decodeURIComponent(p); } catch (e) {}
    p = p.toLowerCase();

    if (p === '' || p === '/index.html' || p === '/index') return 'home';
    if (/account|profile|حساب/.test(p)) return 'account';
    if (/games|الالعاب|ألعاب/.test(p)) return 'games';
    if (/products|catalog|المنتجات/.test(p)) return 'products';
    return 'product-simple';
  }

  var layoutAttr = getAttr('layout', 'auto');
  var LAYOUT = layoutAttr === 'auto' ? detect() : layoutAttr;

  var CONFIG = {
    text: getAttr('text', 'جاري تجهيز المتجر'),
    min: Math.max(0, Number(getAttr('min', 500)) || 0),
    max: Math.max(3000, Number(getAttr('max', 10000)) || 10000)
  };

  /* صفحات المنتج خلفيتها أسود دافي، والباقي كحلي غامق */
  var isProductPage = LAYOUT === 'product' || LAYOUT === 'product-simple';

  var C = isProductPage
    ? { bg: '#09080A', block: '#17151B', box: 'rgba(255,255,255,.02)', line: 'rgba(214,173,85,.20)', shine: 'rgba(214,173,85,.13)', nav: '#0D0C10' }
    : { bg: '#060A16', block: '#121A2E', box: 'rgba(255,255,255,.02)', line: 'rgba(214,173,85,.18)', shine: 'rgba(214,173,85,.14)', nav: '#0D1426' };

  var root = document.documentElement;
  var startTime = Date.now();
  var finished = false;
  var loader, style, minTimer, failTimer;

  root.classList.add('hx-loading');

  /* =========================================
     2. التنسيق
  ========================================= */

  style = document.createElement('style');

  style.textContent = `
    html.hx-loading { overflow: hidden !important; }

    #hx-loader, #hx-loader * { box-sizing: border-box; }

    #hx-loader {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      background: ${C.bg};
      direction: rtl;
      overflow: hidden;
      opacity: 1;
      visibility: visible;
      transition: opacity .5s ease, visibility .5s ease;
    }

    #hx-loader.hx-out { opacity: 0; visibility: hidden; pointer-events: none; }

    #hx-loader .hx-page {
      width: min(100%, 640px);
      margin: 0 auto;
      padding: max(16px, env(safe-area-inset-top)) 18px 0;
    }

    /* القطعة الرمادية اللي بتلمع */
    #hx-loader .hx-b {
      position: relative;
      overflow: hidden;
      background: ${C.block};
      border-radius: 12px;
      flex: none;
    }

    #hx-loader .hx-b::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent 0%, ${C.shine} 50%, transparent 100%);
      transform: translateX(100%);
      animation: hx-shimmer 1.4s ease-in-out infinite;
    }

    @keyframes hx-shimmer { to { transform: translateX(-100%); } }

    /* صندوق بإطار خفيف */
    #hx-loader .hx-box {
      border: 1px solid ${C.line};
      background: ${C.box};
      border-radius: 26px;
      padding: 16px;
    }
    #hx-loader .hx-flat { padding: 0; overflow: hidden; }

    #hx-loader .hx-c { margin-left: auto; margin-right: auto; }
    #hx-loader .hx-row { display: flex; align-items: center; }
    #hx-loader .hx-col { display: flex; flex-direction: column; }
    #hx-loader .hx-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

    /* ---------- الأشرطة العلوية ---------- */
    #hx-loader .hx-phead { gap: 12px; margin-bottom: 16px; }
    #hx-loader .hx-ptxt { flex: 1; align-items: center; gap: 9px; }

    /* ---------- الشريط السفلي + زر المساعد ---------- */
    #hx-loader .hx-nav {
      position: absolute;
      left: 11px; right: 11px;
      bottom: max(20px, env(safe-area-inset-bottom));
      height: 80px;
      border-radius: 40px;
      border: 1px solid ${C.line};
      background: ${C.nav};
      display: flex;
      align-items: center;
      justify-content: space-around;
      z-index: 2;
    }
    #hx-loader .hx-nav-item { display: flex; flex-direction: column; align-items: center; gap: 7px; }

    #hx-loader .hx-bot {
      position: absolute;
      left: 12px;
      bottom: calc(max(20px, env(safe-area-inset-bottom)) + 100px);
      width: 68px; height: 68px;
      border-radius: 50%;
      z-index: 2;
    }

    @media (prefers-reduced-motion: reduce) {
      #hx-loader .hx-b::after { animation: none; opacity: 0; }
      #hx-loader { transition-duration: .01ms; }
    }
  `;

  (document.head || root).appendChild(style);

  /* =========================================
     3. أدوات صغيرة لبناء الهياكل
  ========================================= */

  /* B(عرض, ارتفاع, نصف القطر, ستايل إضافي) = قطعة بتلمع */
  function B(w, h, r, extra) {
    return '<div class="hx-b" style="width:' + w + ';height:' + h +
      (r !== undefined && r !== null ? ';border-radius:' + r + 'px' : '') +
      (extra ? ';' + extra : '') + '"></div>';
  }

  function repeat(n, fn) {
    var out = '';
    for (var i = 0; i < n; i++) out += fn(i);
    return out;
  }

  var NAV = `
    <div class="hx-b hx-bot"></div>
    <div class="hx-nav">
      ${repeat(3, function () {
        return '<div class="hx-nav-item">' + B('28px', '28px', 14) + B('46px', '8px', 6) + '</div>';
      })}
    </div>`;

  /* =========================================
     4. الأشكال
  ========================================= */

  /* ---- الرئيسية ---- */
  function home() {
    return `
    <div class="hx-page">
      ${B('150px', '54px', 14, 'margin-bottom:16px')}
      ${B('100%', 'auto', 28, 'aspect-ratio:16/9;margin-bottom:18px')}

      <div class="hx-box hx-row" style="gap:12px;margin-bottom:26px">
        ${B('12px', '12px', 6)}
        <div class="hx-col" style="flex:1;gap:10px">
          ${B('92%', '12px', 20)}${B('70%', '12px', 20)}${B('55%', '9px', 20)}
        </div>
      </div>

      ${B('190px', '26px', 14, 'margin:0 auto 10px')}
      ${B('70px', '3px', 4, 'margin:0 auto 22px')}

      <div class="hx-grid2" style="margin-bottom:18px">
        ${repeat(2, function () {
          return '<div class="hx-box hx-col" style="height:250px;align-items:center;gap:14px">' +
            B('70px', '26px', 20, 'align-self:flex-start') +
            B('110px', '110px', 55) +
            B('70%', '12px', 20) + '</div>';
        })}
      </div>

      ${B('210px', '54px', 30, 'margin-bottom:22px')}

      <div class="hx-row" style="justify-content:space-between;margin-bottom:14px">
        ${B('130px', '24px', 12)}${B('100px', '34px', 20)}
      </div>

      <div class="hx-box hx-col" style="height:260px;gap:14px">
        <div class="hx-row" style="gap:12px">${B('90px', '42px', 12)}${B('120px', '12px', 20)}</div>
        ${B('100%', '12px', 20)}${B('85%', '12px', 20)}
      </div>
    </div>`;
  }

  /* ---- صفحة منتج (PUBG / TikTok) ---- */
  function productCard() {
    return `
      <div class="hx-box hx-flat">
        ${B('100%', '105px', 0)}
        <div class="hx-col" style="align-items:center;gap:10px;padding:14px">
          ${B('70%', '16px', 20)}
          ${B('55%', '22px', 20)}
          ${B('40%', '12px', 20)}
          ${B('44px', '22px', 12)}
          ${B('100%', '40px', 14)}
        </div>
      </div>`;
  }

  function product(withTabs) {
    var tabs = withTabs ? `
      <div class="hx-box hx-row" style="height:60px;padding:8px 10px;gap:14px;margin-bottom:22px;border-radius:22px">
        ${B('58px', '44px', 16)}${B('70px', '14px', 10)}${B('60px', '14px', 10)}${B('80px', '14px', 10)}
      </div>` : '<div style="height:22px"></div>';

    return `
    <div class="hx-page">
      <div class="hx-row hx-phead">
        ${B('45px', '45px', 16)}
        ${B('44px', '44px', 14)}
        <div class="hx-col hx-ptxt">
          ${B('135px', '20px', 12)}${B('177px', '25px', 14)}
        </div>
      </div>

      ${B('100%', 'auto', 26, 'aspect-ratio:1.94/1')}
      ${tabs.replace('margin-bottom:22px', 'margin-top:20px;margin-bottom:22px')}

      <div class="hx-row" style="justify-content:space-between;margin-bottom:18px">
        ${B('120px', '24px', 12)}${B('55px', '16px', 10)}
      </div>

      <div class="hx-grid2">
        ${repeat(4, productCard)}
      </div>
    </div>`;
  }

  /* ---- كل الألعاب ---- */
  function games() {
    return `
    <div class="hx-page">
      <div class="hx-row" style="justify-content:space-between;margin:4px 0 20px">
        ${B('16px', '26px', 6)}
        ${B('115px', '24px', 12)}
        ${B('16px', '26px', 6, 'opacity:0')}
      </div>

      ${B('145px', '48px', 24, 'margin:0 auto 26px')}

      <div class="hx-grid2">
        ${repeat(8, function () {
          return '<div class="hx-box hx-flat" style="border-radius:22px">' +
            B('100%', '90px', 0) + B('100%', '25px', 0) +
            '<div style="padding:14px 0">' + B('65%', '14px', 10, 'margin:0 auto') + '</div></div>';
        })}
      </div>
    </div>`;
  }

  /* ---- جميع المنتجات والخدمات ---- */
  function products() {
    return `
    <div class="hx-page">
      <div class="hx-row" style="gap:12px;margin-bottom:16px">
        ${B('88px', '39px', 20)}
        ${B('170px', '26px', 13)}
      </div>
      ${B('100%', '1px', 1, 'margin-bottom:18px')}

      <div class="hx-box hx-row" style="height:47px;padding:0 18px;gap:12px;border-radius:24px;margin-bottom:18px">
        ${B('22px', '22px', 11)}${B('55%', '12px', 20)}
      </div>

      <div class="hx-row" style="gap:12px;margin-bottom:22px">
        ${B('68px', '42px', 21)}${B('82px', '42px', 21)}${B('150px', '42px', 21)}
      </div>

      <div class="hx-grid2">
        ${repeat(8, function () {
          return '<div class="hx-box hx-col" style="padding:12px;gap:10px;border-radius:24px">' +
            B('100%', '79px', 14) + B('100%', '25px', 10) +
            B('70%', '16px', 10, 'margin:2px auto 0') + B('45%', '11px', 10, 'margin:0 auto') + '</div>';
        })}
      </div>
    </div>
    ${NAV}`;
  }

  /* ---- حسابي ---- */
  function account() {
    return `
    <div class="hx-page">
      <div class="hx-row" style="justify-content:space-between;margin-bottom:18px">
        ${B('100px', '30px', 14)}${B('123px', '44px', 22)}
      </div>

      <div class="hx-box hx-col" style="height:270px;padding:20px;border-radius:30px;margin-bottom:16px">
        <div class="hx-row" style="justify-content:space-between;margin-bottom:22px">
          ${B('150px', '14px', 10)}${B('42px', '30px', 8)}
        </div>
        ${B('270px', '26px', 13, 'margin:0 auto 14px')}
        ${B('230px', '12px', 10, 'margin:0 auto 8px')}
        ${B('150px', '12px', 10, 'margin:0 auto 22px')}
        ${B('290px', '54px', 20, 'margin:0 auto')}
      </div>

      <div class="hx-row" style="gap:12px;margin-bottom:26px">
        ${repeat(3, function () {
          return '<div class="hx-box hx-col" style="flex:1;height:116px;align-items:center;justify-content:center;gap:12px;padding:10px;border-radius:24px">' +
            B('50px', '50px', 16) + B('58px', '14px', 10) + '</div>';
        })}
      </div>

      ${B('70px', '16px', 10, 'margin-bottom:14px')}

      <div class="hx-box hx-flat" style="border-radius:26px">
        ${repeat(3, function () {
          return '<div class="hx-row" style="gap:14px;padding:14px 16px">' +
            B('44px', '44px', 14) +
            '<div class="hx-col" style="gap:9px">' + B('130px', '16px', 10) + B('100px', '12px', 10) + '</div></div>';
        })}
      </div>
    </div>
    ${NAV}`;
  }

  /* الرئيسية فيها نفس الشريط السفلي */
  function homeFull() { return home() + NAV; }

  var BUILDERS = {
    'home': homeFull,
    'product': function () { return product(true); },
    'product-simple': function () { return product(false); },
    'games': games,
    'products': products,
    'account': account
  };

  loader = document.createElement('div');
  loader.id = 'hx-loader';
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-live', 'polite');
  loader.setAttribute('aria-label', CONFIG.text);
  loader.innerHTML = (BUILDERS[LAYOUT] || BUILDERS['product-simple'])();

  root.appendChild(loader);

  /* =========================================
     5. الإنهاء
  ========================================= */

  function hide() {
    if (finished) return;
    finished = true;

    clearTimeout(minTimer);
    clearTimeout(failTimer);

    loader.classList.add('hx-out');
    root.classList.remove('hx-loading');

    window.dispatchEvent(new Event('hyperloader:done'));
    window.HyperLoader.active = false;

    setTimeout(function () {
      if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
      if (style && style.parentNode) style.parentNode.removeChild(style);
    }, 700);
  }

  function tryFinish() {
    if (finished) return;

    var elapsed = Date.now() - startTime;

    if (elapsed < CONFIG.min) {
      setTimeout(tryFinish, CONFIG.min - elapsed);
      return;
    }

    if (document.readyState === 'complete') hide();
  }

  minTimer = setTimeout(hide, CONFIG.max);
  failTimer = setTimeout(hide, CONFIG.max + 1000);

  if (document.readyState === 'complete') {
    tryFinish();
  } else {
    window.addEventListener('load', tryFinish, { once: true });
  }

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) hide();
  });

  /* =========================================
     6. الواجهة العامة (زي القديم)
  ========================================= */

  window.HyperLoader = {
    active: true,
    hide: hide,
    layout: LAYOUT,
    getProgress: function () {
      return finished ? 100 : 0;
    }
  };

})();
