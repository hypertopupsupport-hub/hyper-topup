/*! HYPER TOPUP — Theme v3 (داكن / فاتح)
 *  ضع السطر التالي داخل <head> في الصفحة (قبل أي <style>):
 *  <script src="theme.js?v=3"></script>
 *
 *  - الوضع الداكن = تصميمك الأصلي بدون أي تغيير.
 *  - الوضع الفاتح مكتوب بالظبط على كلاسات index.html. الصفحات اللي لسه
 *    متجهزتش بتفضل داكنة (بدون زرار) عشان مفيش صفحة تبوظ.
 *  - لتفعيل صفحة جديدة بعد تجهيز ألوانها: أضف اسمها في SUPPORTED تحت.
 */
(function () {
  'use strict';
  if (window.__hyperTheme) return;
  window.__hyperTheme = true;

  /* الصفحات اللي ألوان الفاتح جاهزة لها */
  var SUPPORTED = ['index.html'];

  var KEY = 'hyper_theme';
  var META = { dark: '#080c18', light: '#fbf6ea' };
  var root = document.documentElement;
  var reduce = false;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  function read() {
    try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : null; }
    catch (e) { return null; }
  }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var supported = SUPPORTED.indexOf(page) !== -1;
  var pref = read() || (window.HS_THEME_DEFAULT === 'light' ? 'light' : 'dark');
  var theme = supported ? pref : 'dark';
  root.setAttribute('data-theme', theme);
  if (/^(settings|support|auth)(\.|$|-|_)/.test(page)) root.setAttribute('data-hs-nodock', '');

  /* ---------- ألوان الوضع الفاتح ---------- */
  function L(sel, decl) {
    return sel.split(',').map(function (s) { return 'html[data-theme="light"] ' + s.trim(); }).join(',') + '{' + decl + '}';
  }
  var GOLD_D = '#8a5a10', GOLD_M = '#b9801a', INK = '#1f1a10', SOFT = '#6f6a5c';

  var LIGHT = [
    'html[data-theme="light"]{color-scheme:light}',

    /* الخلفية */
    L('body', 'color:' + INK + ';background:' +
      'radial-gradient(ellipse 70% 30% at 50% 8%,rgba(244,201,93,.40),transparent 72%),' +
      'radial-gradient(ellipse 65% 35% at 88% 76%,rgba(217,164,50,.20),transparent 70%),' +
      'radial-gradient(ellipse 65% 32% at 8% 83%,rgba(130,160,215,.16),transparent 72%),' +
      'linear-gradient(150deg,#fffdf7,#fbf6ea 44%,#f6efdc 72%,#fffaf0)'),
    L('.gold-mesh', 'opacity:.45'),

    /* الهيدر */
    L('.logo-particles-layer', 'background:radial-gradient(circle,rgba(244,201,93,.38),transparent 62%)'),
    L('.logo-cyber-frame', 'filter:brightness(.55) saturate(1.5) drop-shadow(0 0 3px rgba(185,128,26,.25))'),
    L('.logo-ring', 'border-color:' + GOLD_M + ';box-shadow:0 0 10px rgba(185,128,26,.30),inset 0 0 8px rgba(185,128,26,.10)'),
    L('.logo-ring:before', 'border-color:rgba(185,128,26,.30)'),
    L('.logo-h', 'color:' + GOLD_D + ';text-shadow:none'),
    L('.brand', 'color:#7a4f0a;text-shadow:none'),
    L('.verified', 'color:#6b4a10'),
    L('.verified b', 'color:#5f8a10'),
    L('.welcome', 'color:#7a5a20'),
    L('.divider', 'box-shadow:0 0 6px rgba(185,128,26,.35)'),
    L('.auth-pill', 'background:rgba(255,252,245,.88);border-color:rgba(185,128,26,.55);box-shadow:0 4px 14px rgba(90,60,10,.14)'),
    L('.ap-main', 'color:#7a4f0a'),
    L('.ap-sub', 'color:' + SOFT),

    /* العرض والبحث */
    L('.promo', 'background:rgba(255,255,255,.78);border-color:rgba(185,128,26,.38);box-shadow:0 8px 22px rgba(90,60,10,.10),inset 0 1px rgba(255,255,255,.9)'),
    L('.promo:before', 'background:' + GOLD_M + ';box-shadow:0 0 8px rgba(185,128,26,.6)'),
    L('.promo strong', 'color:#7a4f0a'),
    L('.promo span', 'color:' + SOFT),
    L('.search', 'background:rgba(255,255,255,.88);border-color:rgba(185,128,26,.5);box-shadow:0 6px 18px rgba(90,60,10,.08)'),
    L('.search svg', 'stroke:' + GOLD_M),
    L('.search input', 'color:' + INK),
    L('.search input::placeholder', 'color:#8a8372'),

    /* العناوين */
    L('.section-title', 'color:#7a4f0a;text-shadow:none'),
    L('.section-title:after', 'background:' + GOLD_M + ';box-shadow:none'),

    /* كروت الأقسام: تفضل كحلي فخمة عشان اللوجوهات والنص يفضلوا زي ما هم */
    L('.category-card', 'background:linear-gradient(145deg,#1f2d52,#0d1730);box-shadow:0 12px 26px rgba(60,40,5,.25),inset 0 1px rgba(255,255,255,.08)'),

    /* التقييمات */
    L('.reviews-head', 'border-bottom-color:rgba(185,128,26,.28)'),
    L('.reviews h2', 'color:#5a3d0a;text-shadow:none'),
    L('.review-count', 'color:' + SOFT + ';border-color:rgba(0,0,0,.10)'),
    L('.review-box', 'background:rgba(255,255,255,.80);border-color:rgba(185,128,26,.28);box-shadow:0 8px 22px rgba(90,60,10,.10)'),
    L('.rating-number', 'color:#a8710f;text-shadow:none'),
    L('.stars', 'color:#e6a100'),
    L('.rating-caption', 'color:' + SOFT),
    L('.review-item', 'border-top-color:rgba(0,0,0,.08)'),
    L('.review-user', 'color:' + INK),
    L('.avatar', 'background:linear-gradient(145deg,#fff3cf,#f1dca0);border-color:rgba(185,128,26,.4);color:#7a4f0a'),
    L('.review-text', 'color:#4a463c'),
    L('.share-review-btn', 'color:#7a4f0a;background:rgba(185,128,26,.10);border-color:rgba(185,128,26,.55);box-shadow:none'),

    /* الدوك السفلي */
    L('nav.bottom-nav', 'background:rgba(255,252,245,.88)!important;border:1px solid rgba(185,128,26,.42)!important;box-shadow:0 12px 30px rgba(90,60,10,.22),0 0 20px rgba(244,201,93,.18),inset 0 1px 0 rgba(255,255,255,.8)!important'),
    L('.bottom-nav .nav-item', 'color:#7d7667'),
    L('.bottom-nav .nav-item.active', 'color:' + GOLD_D),
    L('.bottom-nav .nav-item.active .nav-icon-svg', 'filter:drop-shadow(0 0 4px rgba(185,128,26,.45))'),

    /* الفوتر */
    L('.site-footer', 'color:' + SOFT + ';border-top-color:rgba(185,128,26,.30)'),
    L('.sf-links a', 'color:#5a5547'),
    L('.sf-links a+a:before', 'background:rgba(0,0,0,.18)'),
    L('.sf-note', 'color:#8a8372')
  ].join('');

  /* ---------- الأنماط ---------- */
  var CSS = '' +
    'html{color-scheme:dark}' +
    (supported ? LIGHT : '') +
    '::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}' +
    '::view-transition-old(root){z-index:1}::view-transition-new(root){z-index:2147483000}' +

    /* الزر: دايرة صغيرة بتتحرك مع الصفحة (مش ثابتة فوق المحتوى) */
    '.hts{position:absolute;right:14px;top:calc(14px + env(safe-area-inset-top,0px));z-index:55;width:40px;height:40px;padding:0;border:0;border-radius:50%;cursor:pointer;display:grid;place-items:center;-webkit-tap-highlight-color:transparent;' +
    'background:linear-gradient(135deg,#10172a,#1c2c57);box-shadow:0 6px 16px rgba(0,0,0,.4),inset 0 0 0 1px rgba(244,201,93,.55);transition:background .4s,box-shadow .4s,transform .2s}' +
    '.hts.inline{position:relative;right:auto;top:auto;flex:none}' +
    '.hts:active{transform:scale(.9)}' +
    '.hts:focus-visible{outline:3px solid #f4c95d;outline-offset:3px}' +
    '.hts svg{position:absolute;width:20px;height:20px;fill:none;stroke:#f4c95d;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:opacity .3s,transform .5s cubic-bezier(.34,1.45,.64,1),stroke .3s}' +
    '.hts .sun{opacity:0;transform:rotate(-90deg) scale(.4)}.hts .moon{opacity:1}' +
    'html[data-theme="light"] .hts{background:linear-gradient(135deg,#fffdf7,#f3e6c2);box-shadow:0 6px 16px rgba(120,80,10,.22),inset 0 0 0 1px rgba(185,128,26,.7)}' +
    'html[data-theme="light"] .hts svg{stroke:#8a5a10}' +
    'html[data-theme="light"] .hts .sun{opacity:1;transform:none}' +
    'html[data-theme="light"] .hts .moon{opacity:0;transform:rotate(90deg) scale(.4)}';

  var st = document.createElement('style');
  st.id = 'hs-theme-css';
  st.textContent = CSS;
  (document.head || root).appendChild(st);

  /* ---------- لون شريط المتصفح ---------- */
  function setMeta(t) {
    var m = document.querySelector('meta[name="theme-color"]');
    if (!m) {
      m = document.createElement('meta');
      m.name = 'theme-color';
      (document.head || root).appendChild(m);
    }
    m.content = META[t];
  }
  setMeta(theme);

  /* ---------- الزر ---------- */
  var btn = null;
  function sync() {
    if (!btn) return;
    var light = theme === 'light';
    btn.setAttribute('aria-checked', light ? 'true' : 'false');
    btn.setAttribute('aria-label', light
      ? 'الوضع الفاتح مفعّل، اضغط للتحويل إلى الوضع الداكن'
      : 'الوضع الداكن مفعّل، اضغط للتحويل إلى الوضع الفاتح');
    btn.title = light ? 'التحويل إلى الوضع الداكن' : 'التحويل إلى الوضع الفاتح';
  }
  function build() {
    if (!supported || btn || !document.body) return;
    btn = document.createElement('button');
    btn.id = 'hts';
    btn.className = 'hts';
    btn.type = 'button';
    btn.setAttribute('role', 'switch');
    btn.innerHTML =
      '<svg class="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>' +
      '<svg class="moon" viewBox="0 0 24 24"><path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a6.7 6.7 0 0 0 9.7 9.7z"/></svg>';
    var slot = document.querySelector('[data-theme-slot]');
    if (slot) { btn.classList.add('inline'); slot.appendChild(btn); }
    else document.body.appendChild(btn);
    btn.addEventListener('click', function () {
      var r = btn.getBoundingClientRect();
      set(theme === 'light' ? 'dark' : 'light', r.left + r.width / 2, r.top + r.height / 2);
    });
    sync();
  }

  /* ---------- التبديل بحركة دائرية ---------- */
  function set(next, x, y) {
    if (!supported) return;
    if (next !== 'light' && next !== 'dark') return;
    if (next === theme) return;
    theme = next;
    save(next);
    function apply() {
      root.setAttribute('data-theme', next);
      setMeta(next);
      sync();
    }
    if (document.startViewTransition && !reduce && x != null) {
      var r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      var vt = document.startViewTransition(apply);
      vt.ready.then(function () {
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + r + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(function () {});
    } else {
      apply();
    }
  }

  window.addEventListener('storage', function (e) {
    if (supported && e.key === KEY && (e.newValue === 'light' || e.newValue === 'dark') && e.newValue !== theme) {
      theme = e.newValue;
      root.setAttribute('data-theme', theme);
      setMeta(theme);
      sync();
    }
  });
  window.addEventListener('pageshow', function (e) {
    if (supported && e.persisted) {
      var v = read();
      if (v && v !== theme) {
        theme = v;
        root.setAttribute('data-theme', v);
        setMeta(v);
        sync();
      }
    }
  });

  window.HyperTheme = {
    get: function () { return theme; },
    set: function (t) { set(t); },
    toggle: function () { set(theme === 'light' ? 'dark' : 'light'); }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();