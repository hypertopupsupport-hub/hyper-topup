/*! HYPER TOPUP — Store Status Guard
 *  ضع السطر التالي قبل </body> في صفحات الدفع فقط:
 *  <script src="store-status.js"></script>
 *  وتحكّم من ملف store-status.json (انظر الشرح داخله).
 */
(function () {
  'use strict';
  if (window.__hsLoaded) return;
  window.__hsLoaded = true;

  var C = Object.assign({
    statusUrl: 'store-status.json',
    pollMs: 45000,
    aiUrl: 'https://go.crisp.chat/chat/embed/?website_id=0316b84d-cdc3-41b7-b06d-1b7a44f2b524',
    homeUrl: 'index.html',
    tz: 'Africa/Cairo'
  }, window.HS_CONFIG || {});

  var TEXT = {
    update: { title: 'المتجر في تحديث الآن', msg: 'نعمل على تحسين تجربة الشحن لك. سنعود خلال وقت قصير، ويُفتح الدفع هنا تلقائياً.' },
    rest: { title: 'المتجر في وقت الراحة 🌙', msg: 'نستقبل الطلبات يومياً من 9:30 صباحاً حتى 1 بعد منتصف الليل، ويُفتح الدفع هنا تلقائياً.' }
  };
  var ICONS = {
    update: '<circle cx="12" cy="12" r="3.2"/><circle cx="12" cy="12" r="7.5"/><path d="M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3M4.8 4.8l2.1 2.1M17.1 17.1l2.1 2.1M4.8 19.2l2.1-2.1M17.1 6.9l2.1-2.1"/>',
    rest: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>'
  };

  /* ---------- الوقت بتوقيت القاهرة ---------- */
  function parts(ts) {
    var f = new Intl.DateTimeFormat('en-US', { timeZone: C.tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    var p = {};
    f.formatToParts(new Date(ts)).forEach(function (x) { p[x.type] = x.value; });
    return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour % 24, mi: +p.minute, s: +p.second };
  }
  function tzOffset(ts) {
    var p = parts(ts), sec = Math.floor(ts / 1000) * 1000;
    return Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) - sec;
  }
  function localToDate(y, m, d, h, mi) {
    try {
      var g = Date.UTC(y, m - 1, d, h, mi), t = g - tzOffset(g);
      t = g - tzOffset(t);
      return new Date(t);
    } catch (e) { return new Date(y, m - 1, d, h, mi); }
  }
  function nowParts() {
    try { return parts(Date.now()); }
    catch (e) { var n = new Date(); return { y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate(), h: n.getHours(), mi: n.getMinutes(), s: n.getSeconds() }; }
  }
  function parseUntil(v) {
    if (!v) return null;
    v = String(v).trim();
    if (/(Z|[+-]\d\d:?\d\d)$/i.test(v)) { var d = new Date(v); return isNaN(d) ? null : d; }
    var m = v.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
    return m ? localToDate(+m[1], +m[2], +m[3], +m[4], +m[5]) : null;
  }
  function hm(s) { var m = String(s || '').match(/^(\d{1,2}):(\d{2})$/); return m ? (+m[1]) * 60 + (+m[2]) : null; }
  function scheduled(sc) {
    if (!sc || !sc.enabled) return null;
    var a = hm(sc.from), b = hm(sc.to);
    if (a == null || b == null || a === b) return null;
    var p = nowParts(), n = p.h * 60 + p.mi, inside, shift = 0;
    if (a < b) inside = n >= a && n < b;
    else { inside = n >= a || n < b; if (n >= a) shift = 1; }
    if (!inside) return null;
    var t = new Date(Date.UTC(p.y, p.m - 1, p.d + shift));
    return localToDate(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), Math.floor(b / 60), b % 60);
  }

  /* ---------- تفسير حالة المتجر ---------- */
  function normalize(j) {
    j = j || {};
    var on = j.maintenance === true || String(j.maintenance).toLowerCase() === 'true';
    var until = parseUntil(j.until);
    if (on && until && until.getTime() <= Date.now()) on = false;   // انتهى الموعد = يفتح تلقائياً
    if (!on) { var s = scheduled(j.schedule || { enabled: true, from: '01:00', to: '09:30' }); if (s) { on = true; until = s; } }
    return { on: on, until: until, type: j.type === 'rest' ? 'rest' : 'update', title: j.title || '', message: j.message || '' };
  }
  if (/[?&]maint=1(&|$)/.test(location.search)) window.__hsForce = true;   // معاينة للمالك فقط

  /* ---------- واجهة ---------- */
  var CSS = '' +
    '@property --hsa{syntax:"<angle>";initial-value:0deg;inherits:false}' +
    '#hs-ov{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:18px;overflow:auto;direction:rtl;font-family:Cairo,system-ui,sans-serif;color:#fff8e6;background:radial-gradient(60% 45% at 50% 0%,rgba(245,200,91,.2),transparent),radial-gradient(50% 40% at 100% 100%,rgba(37,99,235,.2),transparent),rgba(5,8,18,.95);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);opacity:0;transition:opacity .35s}' +
    '#hs-ov[hidden]{display:none}#hs-ov.hs-on{opacity:1}' +
    '#hs-ov *{box-sizing:border-box}' +
    '.hs-card{position:relative;width:min(100%,430px);margin:auto;padding:28px 22px 20px;text-align:center;border-radius:30px;background:linear-gradient(160deg,rgba(255,255,255,.09),rgba(255,255,255,.025));box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 60px rgba(245,200,91,.12);outline:0;animation:hsUp .7s cubic-bezier(.22,1,.36,1)}' +
    '@keyframes hsUp{from{opacity:0;transform:translateY(22px) scale(.97)}}' +
    '.hs-card::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:1.5px;background:conic-gradient(from var(--hsa),rgba(245,200,91,.14) 0 55%,#f5c85b 80%,#fff6d8 85%,rgba(245,200,91,.14));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);animation:hsSpin 7s linear infinite;pointer-events:none}' +
    '@keyframes hsSpin{to{--hsa:360deg}}' +
    '.hs-ico{position:relative;width:84px;height:84px;margin:8px auto 28px;display:grid;place-items:center;border-radius:50%;color:#ffe49a;background:rgba(245,200,91,.1);border:1px solid rgba(245,200,91,.45)}' +
    '.hs-ico svg{width:40px;height:40px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;animation:hsRot 14s linear infinite}' +
    '.hs-ico.rest svg{animation:hsBob 3.4s ease-in-out infinite}' +
    '@keyframes hsRot{to{transform:rotate(360deg)}}@keyframes hsBob{50%{transform:translateY(-4px) rotate(-6deg)}}' +
    '.hs-ico::before,.hs-ico::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid #f5c85b;opacity:0;animation:hsRing 2.8s infinite}' +
    '.hs-ico::after{animation-delay:1.4s}@keyframes hsRing{0%{transform:scale(1);opacity:.65}100%{transform:scale(1.7);opacity:0}}' +
    '.hs-live{display:inline-flex;align-items:center;gap:8px;margin-bottom:12px;padding:5px 14px;border-radius:999px;border:1px solid rgba(52,211,153,.4);background:rgba(52,211,153,.09);color:#a7f3d0;font-size:.74rem;font-weight:800}' +
    '.hs-live i{width:8px;height:8px;border-radius:50%;background:#34d399;box-shadow:0 0 0 0 rgba(52,211,153,.7);animation:hsPulse 2s infinite}' +
    '@keyframes hsPulse{70%{box-shadow:0 0 0 9px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}' +
    '#hs-t{margin:0 0 8px;font-size:1.45rem;font-weight:900;line-height:1.35;background:linear-gradient(180deg,#fff6d8,#f5c85b 60%,#c9922c);-webkit-background-clip:text;background-clip:text;color:transparent}' +
    '.hs-m{margin:0 auto 16px;max-width:34ch;color:#b4bdd0;font-size:.9rem;line-height:1.8}' +
    '.hs-cd{display:flex;justify-content:center;gap:8px;margin:0 0 6px;direction:ltr}' +
    '.hs-cd div{min-width:62px;padding:10px 6px 8px;border-radius:16px;background:rgba(7,11,23,.72);border:1px solid rgba(245,200,91,.28)}' +
    '.hs-cd b{display:block;font:900 1.5rem/1.2 Orbitron,system-ui,sans-serif;color:#ffe49a}' +
    '.hs-cd span{font-size:.66rem;color:#8f9bb2;font-weight:700}' +
    '.hs-at{margin:0 0 14px;color:#8f9bb2;font-size:.78rem;font-weight:700}' +
    '.hs-warn{margin:0 0 16px;padding:11px 14px;border-radius:14px;background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.4);color:#fde68a;font-size:.82rem;font-weight:800;line-height:1.7}' +
    '.hs-act{display:grid;gap:9px}' +
    '.hs-b{display:flex;align-items:center;justify-content:center;gap:8px;min-height:50px;padding:0 18px;border:0;border-radius:15px;font:800 .92rem Cairo,system-ui,sans-serif;text-decoration:none;cursor:pointer;transition:transform .2s}' +
    '.hs-b:active{transform:scale(.97)}' +
    '.hs-g{color:#1a1204;background:linear-gradient(135deg,#c9922c,#ffe49a 50%,#c9922c);box-shadow:0 10px 26px rgba(245,200,91,.3),inset 0 1px 0 rgba(255,255,255,.5)}' +
    '.hs-o{color:#ffe49a;background:rgba(245,200,91,.08);border:1px solid rgba(245,200,91,.3)}' +
    '#hs-ov [hidden]{display:none!important}' +
    '.hs-l{display:inline-block;margin-top:12px;color:#8f9bb2;font-size:.8rem;font-weight:700;text-decoration:underline}' +
    '.hs-ft{margin:10px 0 0;color:#6f7a8f;font-size:.72rem}' +
    '#hs-open{position:fixed;top:calc(14px + env(safe-area-inset-top));left:50%;z-index:2147483001;max-width:calc(100% - 28px);padding:13px 22px;border-radius:16px;text-align:center;font:800 .9rem Cairo,system-ui,sans-serif;direction:rtl;color:#fff;background:rgba(15,23,42,.96);border:1px solid rgba(52,211,153,.6);box-shadow:0 14px 34px rgba(0,0,0,.6),0 0 26px rgba(52,211,153,.25);transform:translate(-50%,-160%);transition:transform .5s cubic-bezier(.34,1.4,.64,1)}' +
    '#hs-open.hs-on{transform:translate(-50%,0)}' +
    '@media (prefers-reduced-motion:reduce){#hs-ov *,#hs-ov *::before,#hs-ov *::after{animation:none!important}}';

  var HTML = '' +
    '<div class="hs-card" tabindex="-1">' +
    '<div class="hs-ico" id="hs-ico"><svg viewBox="0 0 24 24" id="hs-svg"></svg></div>' +
    '<span class="hs-live"><i></i> نتحقق تلقائياً من عودة المتجر</span>' +
    '<h2 id="hs-t"></h2>' +
    '<p class="hs-m" id="hs-m"></p>' +
    '<div class="hs-cd" id="hs-cd" hidden>' +
    '<div id="hs-dd" hidden><b id="hs-d">00</b><span>يوم</span></div>' +
    '<div><b id="hs-h">00</b><span>ساعة</span></div>' +
    '<div><b id="hs-i">00</b><span>دقيقة</span></div>' +
    '<div><b id="hs-s">00</b><span>ثانية</span></div>' +
    '</div>' +
    '<p class="hs-at" id="hs-at" hidden></p>' +
    '<p class="hs-warn">⚠️ من فضلك لا تقم بتحويل أي مبلغ الآن. سنُعلمك فور عودة المتجر لتُكمل طلبك بأمان.</p>' +
    '<div class="hs-act">' +
    '<a class="hs-b hs-g" id="hs-ai" target="_blank" rel="noopener">💬 التحدث مع الذكاء الاصطناعي</a>' +
    '<button class="hs-b hs-o" id="hs-cal" type="button" hidden>📅 أضف تذكيراً بموعد العودة</button>' +
    '<button class="hs-b hs-o" id="hs-nt" type="button" hidden>🔔 نبّهني عند العودة</button>' +
    '</div>' +
    '<a class="hs-l" id="hs-home">تصفّح المتجر</a>' +
    '<p class="hs-ft">سيُفتح الدفع هنا تلقائياً بمجرد عودتنا، دون الحاجة لإعادة تحميل الصفحة.</p>' +
    '</div>';

  var ov, locked = false, lastJson, curState = null, tickT = null, mo = null, origTitle = '', inerted = [], prevOverflow = '', titleT = null;
  function $(id) { return document.getElementById(id); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function build() {
    if (ov) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    ov = document.createElement('div'); ov.id = 'hs-ov'; ov.hidden = true;
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'hs-t');
    ov.innerHTML = HTML;
    document.body.appendChild(ov);
    $('hs-ai').href = C.aiUrl;
    $('hs-home').href = C.homeUrl;
    $('hs-cal').addEventListener('click', function () { if (curState && curState.until) saveIcs(curState.until); });
    var nt = $('hs-nt');
    if ('Notification' in window && Notification.permission === 'default') nt.hidden = false;
    nt.addEventListener('click', function () {
      try {
        Notification.requestPermission().then(function (p) {
          if (p === 'granted') { nt.textContent = '✅ سننبّهك عند العودة'; nt.disabled = true; } else nt.hidden = true;
        });
      } catch (e) { nt.hidden = true; }
    });
  }

  function fill(s) {
    var d = TEXT[s.type];
    $('hs-t').textContent = s.title || d.title;
    $('hs-m').textContent = s.message || d.msg;
    $('hs-ico').className = 'hs-ico ' + s.type;
    $('hs-svg').innerHTML = ICONS[s.type];
    var has = !!s.until;
    $('hs-cd').hidden = !has;
    $('hs-cal').hidden = !has;
    var at = $('hs-at');
    if (has) {
      var txt = '';
      try { txt = s.until.toLocaleString('ar-EG', { weekday: 'long', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: C.tz }); } catch (e) {}
      at.textContent = txt ? 'موعد العودة المتوقع: ' + txt + ' (بتوقيت القاهرة)' : '';
      at.hidden = !txt;
    } else at.hidden = true;
    tick();
  }

  function tick() {
    if (!curState || !curState.until) return;
    var ms = curState.until.getTime() - Date.now();
    if (ms <= 0) { evaluate(lastJson); return; }
    var t = Math.floor(ms / 1000), d = Math.floor(t / 86400), h = Math.floor(t % 86400 / 3600), i = Math.floor(t % 3600 / 60), s = t % 60;
    $('hs-dd').hidden = d < 1;
    $('hs-d').textContent = pad(d); $('hs-h').textContent = pad(h); $('hs-i').textContent = pad(i); $('hs-s').textContent = pad(s);
  }

  /* ---------- قفل/فتح الصفحة ---------- */
  function lockPage() {
    prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    inerted = [];
    [].slice.call(document.body.children).forEach(function (el) {
      var tag = el.tagName;
      if (el === ov || tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK') return;
      if ((el.className && String(el.className).indexOf('crisp') > -1) || (el.id && el.id.indexOf('crisp') === 0)) return;
      if (!el.hasAttribute('inert')) { el.setAttribute('inert', ''); inerted.push(el); }
    });
    if (!mo && window.MutationObserver) {
      mo = new MutationObserver(function () { if (locked && ov && !document.body.contains(ov)) document.body.appendChild(ov); });
      mo.observe(document.body, { childList: true });
    }
  }
  function unlockPage() {
    document.documentElement.style.overflow = prevOverflow;
    inerted.forEach(function (el) { el.removeAttribute('inert'); });
    inerted = [];
  }

  function lock(s) {
    build();
    curState = s;
    fill(s);
    if (locked) return;
    locked = true;
    origTitle = origTitle || document.title;
    clearTimeout(titleT);
    document.title = 'الخدمة متوقفة مؤقتاً | HYPER TOPUP';
    ov.hidden = false;
    lockPage();
    requestAnimationFrame(function () { ov.classList.add('hs-on'); });
    setTimeout(function () { var c = ov.querySelector('.hs-card'); if (c) c.focus(); }, 80);
    clearInterval(tickT); tickT = setInterval(tick, 1000);
  }

  function unlock() {
    if (!locked) return;
    locked = false; curState = null;
    clearInterval(tickT);
    ov.classList.remove('hs-on');
    setTimeout(function () { ov.hidden = true; }, 380);
    unlockPage();
    announce();
  }

  function announce() {
    var b = $('hs-open');
    if (!b) { b = document.createElement('div'); b.id = 'hs-open'; b.setAttribute('role', 'status'); document.body.appendChild(b); }
    b.textContent = '✅ عاد المتجر — يمكنك إتمام طلبك الآن';
    requestAnimationFrame(function () { b.classList.add('hs-on'); });
    setTimeout(function () { b.classList.remove('hs-on'); }, 6500);
    try { if (navigator.vibrate) navigator.vibrate([180, 90, 180]); } catch (e) {}
    document.title = '✅ عاد المتجر | HYPER TOPUP';
    titleT = setTimeout(function () { document.title = origTitle; origTitle = ''; }, 6500);
    try {
      if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
        var o = { body: 'يمكنك الآن إتمام طلبك.', icon: 'icon-512.png', tag: 'hs-open' };
        if (navigator.serviceWorker && navigator.serviceWorker.getRegistration) {
          navigator.serviceWorker.getRegistration().then(function (r) {
            if (r && r.showNotification) r.showNotification('✅ عاد متجر HYPER TOPUP', o); else new Notification('✅ عاد متجر HYPER TOPUP', o);
          }).catch(function () { try { new Notification('✅ عاد متجر HYPER TOPUP', o); } catch (e) {} });
        } else new Notification('✅ عاد متجر HYPER TOPUP', o);
      }
    } catch (e) {}
  }

  /* ---------- تذكير التقويم (.ics) ---------- */
  function saveIcs(date) {
    function f(d) { return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z'; }
    var txt = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//HYPER TOPUP//AR', 'BEGIN:VEVENT',
      'UID:' + Date.now() + '@hypertopup.online', 'DTSTAMP:' + f(new Date()), 'DTSTART:' + f(date),
      'DTEND:' + f(new Date(date.getTime() + 30 * 60000)),
      'SUMMARY:عاد متجر HYPER TOPUP - اشحن الآن', 'DESCRIPTION:المتجر يستقبل الطلبات الآن: https://hypertopup.online/',
      'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:HYPER TOPUP', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([txt], { type: 'text/calendar;charset=utf-8' }));
    a.download = 'hypertopup-reminder.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  }

  /* ---------- الفحص الدوري ---------- */
  function evaluate(j) {
    var s = window.__hsForce ? { on: true, until: null, type: 'update', title: '', message: '' } : normalize(j);
    if (window.__hsForce && j && j.until) s.until = parseUntil(j.until);
    if (s.on) lock(s); else unlock();
  }
  function check() {
    var url = C.statusUrl + (C.statusUrl.indexOf('?') > -1 ? '&' : '?') + 't=' + Date.now();
    return fetch(url, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; })
      .then(function (j) {
        if (j) lastJson = j;
        if (j || lastJson) evaluate(j || lastJson);
        else if (window.__hsForce) evaluate(null);
      });
  }

  function start() {
    check();
    setInterval(check, C.pollMs);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
    window.addEventListener('pageshow', function (e) { if (e.persisted) check(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  window.HyperStore = { check: check, isLocked: function () { return locked; } };
})();
