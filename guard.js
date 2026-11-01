/* ============================================================
   HYPER TOPUP — Auth Gate (guard.js)
   - لو العميل مسجّل دخول: الصفحة تفتح عادي.
   - لو مش مسجّل: تظهر نافذة فيها "تسجيل الدخول / إنشاء حساب"
     و "المتابعة كضيف" (الضيف مسموح له في صفحات الدفع فقط).
   ============================================================ */
(function () {
  'use strict';

  /* ---------- إعدادات (عدّل منها بسهولة) ---------- */
  var CONFIG = {
    userKey: 'hyper_user',          // مفتاح المستخدم المسجّل (زي ما كان)
    guestKey: 'hyper_guest',        // علامة الضيف (بتتخزن في sessionStorage)
    loginPage: 'account_1.html',
    homePage: 'index.html',
    // الصفحات اللي يقدر فيها الضيف يكمل بدون حساب
    guestPages: ['hyper-payment.html', 'instapay-payment.html']
  };

  /* ---------- أدوات مساعدة ---------- */
  function currentPage() {
    var p = (location.pathname.split('/').pop() || CONFIG.homePage).toLowerCase();
    return p || CONFIG.homePage;
  }

  function canGuestHere() {
    return CONFIG.guestPages.indexOf(currentPage()) !== -1;
  }

  function isLoggedIn() {
    try { return !!JSON.parse(localStorage.getItem(CONFIG.userKey) || 'null'); }
    catch (e) { return false; }
  }

  function isGuest() {
    try { return sessionStorage.getItem(CONFIG.guestKey) === '1'; }
    catch (e) { return false; }
  }

  function setGuest() {
    try { sessionStorage.setItem(CONFIG.guestKey, '1'); } catch (e) { /* التخزين غير متاح */ }
  }

  /* مسموح يدخل لو مسجّل، أو ضيف وفي صفحة بتسمح بالضيف */
  function allowed() {
    return isLoggedIn() || (isGuest() && canGuestHere());
  }

  /* ---------- التصميم ---------- */
  var CSS = [
    '#authGate{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;',
    'background:radial-gradient(circle at 50% 0%,rgba(244,201,93,.10),transparent 55%),rgba(3,6,14,.86);',
    '-webkit-backdrop-filter:blur(14px) saturate(120%);backdrop-filter:blur(14px) saturate(120%);',
    'direction:rtl;font-family:Almarai,Cairo,system-ui,sans-serif;overflow-y:auto}',

    '#authGate *{box-sizing:border-box}',

    '#authGate .ag-card{position:relative;width:min(100%,380px);padding:30px 22px 22px;text-align:center;border-radius:26px;',
    'background:linear-gradient(155deg,rgba(24,32,58,.97),rgba(7,11,24,.99));',
    'border:1px solid rgba(244,201,93,.30);color:#fff8e6;',
    'box-shadow:0 30px 70px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.03) inset,0 0 60px rgba(244,201,93,.10);',
    'animation:agIn .5s cubic-bezier(.2,.8,.2,1) both}',

    '#authGate .ag-card::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;',
    'background:linear-gradient(120deg,rgba(255,228,154,.16),transparent 35%,transparent 65%,rgba(255,228,154,.06));}',

    '#authGate .ag-badge{width:72px;height:72px;margin:-62px auto 14px;border-radius:50%;display:flex;align-items:center;justify-content:center;',
    'background:radial-gradient(circle at 30% 25%,#ffe9a8,#dcae42 55%,#a8761c);',
    'box-shadow:0 10px 30px rgba(220,174,66,.45),0 0 0 6px rgba(7,11,24,.95),0 0 0 7px rgba(244,201,93,.35)}',
    '#authGate .ag-badge svg{width:32px;height:32px;stroke:#1b1406;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',

    '#authGate .ag-brand{font-size:11px;font-weight:800;letter-spacing:2px;color:rgba(244,201,93,.75);margin-bottom:6px}',
    '#authGate h3{margin:0 0 8px;color:#ffe49a;font-size:20px;font-weight:800;line-height:1.4}',
    '#authGate .ag-sub{margin:0 auto 22px;max-width:290px;color:#b8c0ce;font-size:12.5px;line-height:1.9}',

    '#authGate .ag-btn,#authGate .ag-guest{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:50px;',
    'padding:13px 14px;border-radius:15px;font-family:inherit;font-weight:800;font-size:13.5px;text-decoration:none;cursor:pointer;',
    'transition:transform .15s ease,box-shadow .2s ease,background .2s ease,border-color .2s ease}',

    '#authGate .ag-btn{border:0;color:#17130a;background:linear-gradient(135deg,#dcae42,#ffe49a 50%,#d49a32);',
    'box-shadow:0 10px 26px rgba(220,174,66,.28)}',
    '#authGate .ag-btn:hover{box-shadow:0 14px 32px rgba(220,174,66,.4)}',

    '#authGate .ag-guest{margin-top:10px;color:#ffe49a;background:rgba(244,201,93,.06);border:1px solid rgba(244,201,93,.38)}',
    '#authGate .ag-guest:hover{background:rgba(244,201,93,.13);border-color:rgba(244,201,93,.65)}',

    '#authGate .ag-btn:active,#authGate .ag-guest:active{transform:scale(.97)}',

    '#authGate .ag-note{margin:12px 4px 0;padding:9px 11px;border-radius:11px;font-size:11px;line-height:1.8;color:#9aa6bb;',
    'background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)}',
    '#authGate .ag-note b{color:#d8dfec;font-weight:700}',

    '#authGate .ag-sep{display:flex;align-items:center;gap:10px;margin:14px 0 2px;color:#6f7a90;font-size:11px}',
    '#authGate .ag-sep::before,#authGate .ag-sep::after{content:"";flex:1;height:1px;background:rgba(255,255,255,.09)}',

    '#authGate .ag-back{display:inline-block;margin-top:16px;padding:6px 10px;color:#aeb7c8;font-size:11.5px;text-decoration:none;border-radius:8px}',
    '#authGate .ag-back:hover{color:#fff8e6}',

    '#authGate a:focus-visible,#authGate button:focus-visible{outline:2px solid #ffe49a;outline-offset:3px}',

    '@keyframes agIn{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}',
    '@keyframes agOut{to{opacity:0;transform:scale(1.02)}}',
    '#authGate.ag-leave{animation:agOut .28s ease forwards;pointer-events:none}',

    '@media (prefers-reduced-motion:reduce){#authGate .ag-card,#authGate.ag-leave{animation-duration:.001ms!important}}'
  ].join('');

  /* ---------- بناء النافذة ---------- */
  function buildMarkup(nextParam) {
    var lockIcon =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<rect x="5" y="11" width="14" height="9" rx="2.5"></rect>' +
      '<path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>';

    var guestPart = '';
    if (canGuestHere()) {
      guestPart =
        '<div class="ag-sep"><span>أو</span></div>' +
        '<button type="button" class="ag-guest" id="agGuestBtn">المتابعة كضيف</button>' +
        '<div class="ag-note">كضيف تقدر تكمل الدفع عادي، بس <b>مش هيتسجل لك سجل طلبات</b>. ' +
        'احتفظ <b>برقم الطلب</b> وابعته للدعم لو عايز تتابع طلبك.</div>';
    }

    return (
      '<div class="ag-card" role="dialog" aria-modal="true" aria-labelledby="agTitle" aria-describedby="agDesc">' +
        '<div class="ag-badge">' + lockIcon + '</div>' +
        '<div class="ag-brand">HYPER TOPUP</div>' +
        '<h3 id="agTitle">سجّل دخولك أو كمّل كضيف</h3>' +
        '<p class="ag-sub" id="agDesc">' +
          (canGuestHere()
            ? 'الحساب بيخليك تتابع كل طلباتك من أي جهاز. ولو مستعجل، تقدر تكمل الدفع كضيف.'
            : 'لإتمام أي طلب لازم يكون عندك حساب في HYPER TOPUP.') +
        '</p>' +
        '<a class="ag-btn" id="agLoginBtn" href="' + CONFIG.loginPage + '?auth=1&next=' + nextParam + '">تسجيل الدخول / إنشاء حساب</a>' +
        guestPart +
        '<a class="ag-back" href="' + CONFIG.homePage + '">الرجوع للرئيسية</a>' +
      '</div>'
    );
  }

  /* ---------- إزالة النافذة ---------- */
  function removeGate(animated) {
    var g = document.getElementById('authGate');
    if (!g) return;
    var done = function () {
      if (g.parentNode) g.parentNode.removeChild(g);
      document.documentElement.style.overflow = '';
    };
    if (animated) {
      g.classList.add('ag-leave');
      setTimeout(done, 300);
    } else {
      done();
    }
  }

  /* ---------- التشغيل ---------- */
  function run() {
    if (allowed()) return;
    if (document.getElementById('authGate')) return;

    var next = encodeURIComponent(currentPage() + location.search);

    var st = document.createElement('style');
    st.id = 'authGateStyle';
    st.textContent = CSS;
    document.head.appendChild(st);

    var o = document.createElement('div');
    o.id = 'authGate';
    o.innerHTML = buildMarkup(next);
    document.body.appendChild(o);
    document.documentElement.style.overflow = 'hidden';

    var guestBtn = document.getElementById('agGuestBtn');
    if (guestBtn) {
      guestBtn.addEventListener('click', function () {
        setGuest();
        removeGate(true);
        try { window.dispatchEvent(new CustomEvent('hyper:guest-continue')); } catch (e) { /* قديم */ }
      });
    }

    /* الفوكس على الزرار الأساسي عشان الكيبورد وقارئ الشاشة */
    var first = document.getElementById('agLoginBtn');
    if (first && first.focus) { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }

    /* منع التنقل بالـ Tab خارج النافذة */
    o.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = o.querySelectorAll('a[href],button');
      if (!items.length) return;
      var firstEl = items[0], lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();

  /* لو الصفحة رجعت من الكاش (زرار الرجوع) والعميل بقى مسموح له */
  addEventListener('pageshow', function (e) {
    if (e.persisted && allowed()) removeGate(false);
  });
})();
