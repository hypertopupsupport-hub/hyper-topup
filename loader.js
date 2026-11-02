
/*!
 * HYPER TOPUP — PREMIUM TRANSPARENT LOADER
 * Version: 2.1.0
 * Premium Black & Gold Transparent Loading Screen
 */

(function () {
  'use strict';

  /* =========================================
     1. SETTINGS
  ========================================= */

  var S = document.currentScript;

  function getAttr(name, fallback) {
    return S && S.getAttribute('data-' + name) || fallback;
  }

  var CONFIG = {
    accent: getAttr('accent', '#D6AD55'),
    accentLight: getAttr('accent-light', '#FFE7A3'),
    bg: getAttr('bg', '#050505'),
    logo: getAttr('logo', '/icon-512.png'),
    brand: getAttr('brand', 'HYPER TOPUP'),
    text: getAttr('text', 'جاري تجهيز المتجر'),
    min: Math.max(0, Number(getAttr('min', 500)) || 0),
    max: Math.max(3000, Number(getAttr('max', 10000)) || 10000)
  };

  var root = document.documentElement;
  var startTime = Date.now();

  var finished = false;
  var scanned = false;
  var total = 0;
  var done = 0;
  var progress = 0;
  var target = 0;

  var loader;
  var style;
  var bar;
  var percentage;
  var statusText;
  var raf = 0;
  var minTimer;
  var failTimer;

  /* =========================================
     2. PREVENT DUPLICATE LOADER
  ========================================= */

  if (window.HyperLoader && window.HyperLoader.active) {
    return;
  }

  /* =========================================
     3. CSS
  ========================================= */

  root.classList.add('hx-loading');

  style = document.createElement('style');

  style.textContent = `
    html.hx-loading {
      overflow: hidden !important;
    }

    #hx-loader,
    #hx-loader * {
      box-sizing: border-box;
    }

    /* TRANSPARENT MAIN OVERLAY */

    #hx-loader {
      position: fixed;
      inset: 0;
      z-index: 2147483647;

      display: flex;
      align-items: center;
      justify-content: center;

      overflow: hidden;
      isolation: isolate;

      /* Main transparency */
      background: rgba(5, 5, 5, 0.28);

      /* Glass blur */
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);

      color: #fff;

      font-family:
        "Tajawal",
        "Cairo",
        "Almarai",
        Tahoma,
        Arial,
        sans-serif;

      direction: rtl;

      opacity: 1;
      visibility: visible;

      transition:
        opacity .65s cubic-bezier(.22,1,.36,1),
        visibility .65s ease;

      -webkit-font-smoothing: antialiased;
    }

    #hx-loader.hx-out {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    /* TRANSPARENT ATMOSPHERE */

    #hx-loader .hx-background {
      position: absolute;
      inset: 0;
      z-index: -3;

      /*
        Important:
        No solid black background here.
        The store behind the loader must remain visible.
      */

      background:
        radial-gradient(
          ellipse at 50% 42%,
          rgba(214,173,85,.10),
          transparent 42%
        ),
        radial-gradient(
          ellipse at 50% 100%,
          rgba(214,173,85,.035),
          transparent 60%
        );
    }

    #hx-loader .hx-grid {
      position: absolute;
      inset: 0;
      z-index: -2;

      opacity: .08;

      background-image:
        linear-gradient(
          rgba(214,173,85,.07) 1px,
          transparent 1px
        ),
        linear-gradient(
          90deg,
          rgba(214,173,85,.07) 1px,
          transparent 1px
        );

      background-size: 46px 46px;

      mask-image:
        radial-gradient(
          ellipse at center,
          black,
          transparent 78%
        );

      -webkit-mask-image:
        radial-gradient(
          ellipse at center,
          black,
          transparent 78%
        );
    }

    /* MAIN CONTENT */

    #hx-loader .hx-content {
      position: relative;

      display: flex;
      flex-direction: column;
      align-items: center;

      width: min(100%, 420px);

      padding: 28px 24px;

      text-align: center;

      animation: hx-appear .9s cubic-bezier(.22,1,.36,1) both;
    }

    /* LOGO */

    #hx-loader .hx-logo-wrap {
      position: relative;

      display: flex;
      align-items: center;
      justify-content: center;

      width: 112px;
      height: 112px;

      margin-bottom: 32px;
    }

    #hx-loader .hx-logo-glow {
      position: absolute;
      inset: 12px;

      border-radius: 30px;

      background: ${CONFIG.accent};

      filter: blur(35px);

      opacity: .17;
    }

    #hx-loader .hx-logo-ring {
      position: absolute;
      inset: 0;

      border-radius: 50%;

      border: 1px solid rgba(214,173,85,.14);

      border-top-color: ${CONFIG.accent};
      border-right-color: rgba(214,173,85,.55);

      animation: hx-rotate 3s linear infinite;
    }

    #hx-loader .hx-logo-ring::before {
      content: "";

      position: absolute;

      top: 8px;
      right: 8px;

      width: 6px;
      height: 6px;

      border-radius: 50%;

      background: ${CONFIG.accentLight};

      box-shadow:
        0 0 10px ${CONFIG.accent},
        0 0 20px ${CONFIG.accent};
    }

    #hx-loader .hx-logo-ring-inner {
      position: absolute;
      inset: 10px;

      border-radius: 50%;

      border: 1px solid rgba(255,255,255,.055);
    }

    #hx-loader .hx-logo {
      position: relative;

      width: 72px;
      height: 72px;

      display: block;

      object-fit: contain;

      border-radius: 20px;

      filter:
        drop-shadow(0 0 12px rgba(214,173,85,.14));
    }

    /* BRAND */

    #hx-loader .hx-brand {
      margin: 0;

      font-size: clamp(21px, 5vw, 27px);
      font-weight: 900;

      letter-spacing: 3px;

      line-height: 1.4;

      color: #fff;

      text-shadow:
        0 0 20px rgba(214,173,85,.12);
    }

    #hx-loader .hx-brand span {
      color: ${CONFIG.accent};

      text-shadow:
        0 0 16px rgba(214,173,85,.22);
    }

    #hx-loader .hx-subtitle {
      margin-top: 10px;

      font-size: 12px;
      font-weight: 400;

      letter-spacing: 1.3px;

      color: rgba(255,255,255,.72);
    }

    /* PROGRESS */

    #hx-loader .hx-progress-wrap {
      width: min(260px, 76vw);

      margin-top: 42px;
    }

    #hx-loader .hx-progress-info {
      display: flex;
      align-items: center;
      justify-content: space-between;

      margin-bottom: 12px;

      font-size: 11px;

      color: rgba(255,255,255,.75);
    }

    #hx-loader .hx-percent {
      direction: ltr;

      font-size: 12px;
      font-weight: 800;

      color: ${CONFIG.accentLight};

      font-variant-numeric: tabular-nums;
    }

    #hx-loader .hx-track {
      position: relative;

      width: 100%;
      height: 3px;

      overflow: hidden;

      border-radius: 20px;

      background: rgba(255,255,255,.16);
    }

    #hx-loader .hx-fill {
      position: relative;

      display: block;

      width: 0;
      height: 100%;

      border-radius: inherit;

      background: linear-gradient(
        90deg,
        ${CONFIG.accent},
        ${CONFIG.accentLight}
      );

      box-shadow:
        0 0 10px rgba(214,173,85,.35),
        0 0 24px rgba(214,173,85,.12);
    }

    #hx-loader .hx-fill::after {
      content: "";

      position: absolute;

      top: 0;
      right: 0;

      width: 36px;
      height: 100%;

      background: #fff;

      opacity: .6;

      filter: blur(5px);
    }

    /* FOOTER */

    #hx-loader .hx-footer {
      position: absolute;

      bottom: max(24px, env(safe-area-inset-bottom));

      left: 0;
      right: 0;

      display: flex;
      flex-direction: column;
      align-items: center;

      gap: 8px;

      font-size: 10px;

      color: rgba(255,255,255,.55);

      letter-spacing: .7px;
    }

    #hx-loader .hx-footer-line {
      width: 28px;
      height: 1px;

      background: ${CONFIG.accent};

      opacity: .55;
    }

    /* ANIMATIONS */

    @keyframes hx-rotate {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes hx-appear {
      from {
        opacity: 0;
        transform: translateY(14px) scale(.985);
      }

      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* ACCESSIBILITY */

    @media (prefers-reduced-motion: reduce) {
      #hx-loader *,
      #hx-loader {
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: .01ms !important;
      }
    }
  `;

  (document.head || root).appendChild(style);

  /* =========================================
     4. HTML
  ========================================= */

  loader = document.createElement('div');

  loader.id = 'hx-loader';

  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-live', 'polite');
  loader.setAttribute('aria-label', CONFIG.text);

  loader.innerHTML = `
    <div class="hx-background"></div>
    <div class="hx-grid"></div>

    <div class="hx-content">

      <div class="hx-logo-wrap">

        <div class="hx-logo-glow"></div>

        <div class="hx-logo-ring">
          <div class="hx-logo-ring-inner"></div>
        </div>

        <img
          class="hx-logo"
          src="${CONFIG.logo}"
          alt=""
          fetchpriority="high"
        >

      </div>

      <h1 class="hx-brand"></h1>

      <div class="hx-subtitle"></div>

      <div class="hx-progress-wrap">

        <div class="hx-progress-info">

          <span class="hx-status"></span>

          <span class="hx-percent">0%</span>

        </div>

        <div
          class="hx-track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="0"
        >

          <i class="hx-fill"></i>

        </div>

      </div>

    </div>

    <div class="hx-footer">

      <div class="hx-footer-line"></div>

      <span>PREMIUM DIGITAL EXPERIENCE</span>

    </div>
  `;

  var brandEl = loader.querySelector('.hx-brand');

  brandEl.textContent = CONFIG.brand;

  var logo = loader.querySelector('.hx-logo');

  logo.onerror = function () {
    this.style.display = 'none';
  };

  var subtitle = loader.querySelector('.hx-subtitle');

  subtitle.textContent = CONFIG.text;

  bar = loader.querySelector('.hx-fill');

  percentage = loader.querySelector('.hx-percent');

  statusText = loader.querySelector('.hx-status');

  statusText.textContent = CONFIG.text;

  root.appendChild(loader);

  /* =========================================
     5. TRACKING
  ========================================= */

  function completeOne() {
    done++;

    target = Math.min(
      90,
      Math.round((done / Math.max(total, 1)) * 90)
    );
  }

  function trackImage(img) {
    if (!img || !img.getAttribute('src')) return;

    if (img.complete) {
      completeOne();
      return;
    }

    img.addEventListener('load', completeOne, {
      once: true
    });

    img.addEventListener('error', completeOne, {
      once: true
    });
  }

  function scan() {
    if (scanned || finished) return;

    scanned = true;

    var images = Array.prototype.slice.call(
      document.images
    );

    images.forEach(function (img) {
      if (loader.contains(img)) return;

      var rect = img.getBoundingClientRect();

      if (
        rect.bottom < -200 ||
        rect.top > window.innerHeight + 200
      ) {
        return;
      }

      total++;

      trackImage(img);
    });

    if (total === 0) {
      target = 90;
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        target = Math.max(target, 90);
      });
    } else {
      target = Math.max(target, 90);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      scan,
      { once: true }
    );
  } else {
    scan();
  }

  /* =========================================
     6. ANIMATION
  ========================================= */

  function tick() {
    if (finished) return;

    var elapsed = Date.now() - startTime;

    if (!scanned) {
      target = Math.max(
        target,
        Math.min(25, elapsed / 50)
      );
    }

    if (scanned && target < 90) {
      target = Math.min(90, target + 0.025);
    }

    var diff = target - progress;

    if (diff > 0) {
      progress += Math.max(diff * 0.12, 0.08);
    }

    progress = Math.min(progress, 90);

    bar.style.width = progress + '%';

    percentage.textContent =
      Math.floor(progress) + '%';

    loader.querySelector('.hx-track')
      .setAttribute(
        'aria-valuenow',
        Math.floor(progress)
      );

    raf = requestAnimationFrame(tick);
  }

  raf = requestAnimationFrame(tick);

  /* =========================================
     7. FINISH
  ========================================= */

  function hide() {
    if (finished) return;

    finished = true;

    clearTimeout(minTimer);
    clearTimeout(failTimer);

    if (raf) {
      cancelAnimationFrame(raf);
    }

    progress = 100;

    bar.style.width = '100%';

    percentage.textContent = '100%';

    loader.querySelector('.hx-track')
      .setAttribute('aria-valuenow', '100');

    loader.classList.add('hx-out');

    root.classList.remove('hx-loading');

    window.dispatchEvent(
      new Event('hyperloader:done')
    );

    window.HyperLoader.active = false;

    setTimeout(function () {
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }

      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }, 750);
  }

  /* =========================================
     8. TIMEOUT / BACK-FORWARD CACHE
  ========================================= */

  minTimer = setTimeout(function () {
    if (!finished) {
      hide();
    }
  }, CONFIG.max);

  function tryFinish() {
    if (finished) return;

    var elapsed = Date.now() - startTime;

    if (elapsed < CONFIG.min) {
      setTimeout(
        tryFinish,
        CONFIG.min - elapsed
      );
      return;
    }

    if (document.readyState === 'complete') {
      hide();
    }
  }

  window.addEventListener(
    'load',
    tryFinish,
    { once: true }
  );

  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      hide();
    }
  });

  failTimer = setTimeout(function () {
    if (!finished) {
      hide();
    }
  }, CONFIG.max + 1000);

  /* =========================================
     9. PUBLIC API
  ========================================= */

  window.HyperLoader = {
    active: true,

    hide: hide,

    getProgress: function () {
      return Math.floor(progress);
    }
  };

})();
    
