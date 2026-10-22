/* HYPER TOPUP intro.js
   الاستخدام: ضع هذا السطر مباشرة بعد وسم <body> في index.html
   <script src="intro.js?v=1"></script>
   خيارات اختيارية:
   <script src="intro.js?v=1" data-logo="logo.png" data-duration="3600" data-once="true"></script>
*/
(function () {
  var me = document.currentScript;
  var cfg = {
    logo: (me && me.dataset.logo) || './hyper_topup_logo_transparent.png',
    duration: parseInt((me && me.dataset.duration) || '3600', 10),
    once: !(me && me.dataset.once === 'false'),
    // data-standalone="true" => تظهر فقط داخل التطبيق المثبّت (PWA) وليس في المتصفح
    standalone: !!(me && me.dataset.standalone === 'true')
  };

  if (cfg.standalone) {
    var isApp = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
    if (!isApp) return;
  }

  try { if (cfg.once && sessionStorage.getItem('ht_intro')) return; } catch (e) {}

  var CSS = `
#htIntro{--ink:#04060c;--navy:#0b1730;--gold:#f5c451;--htext:#f4f7fb;--hmuted:#9fb0c8;
  position:fixed;inset:0;z-index:99999;overflow:hidden;display:grid;place-items:center;direction:rtl;
  font-family:'Cairo',Tahoma,Arial,sans-serif;color:var(--htext);background:var(--ink);
  padding:env(safe-area-inset-top,0) 0 env(safe-area-inset-bottom,0)}
#htIntro,#htIntro *{box-sizing:border-box}
#htIntro .ht-door{position:absolute;top:0;bottom:0;width:50.2%;
  background:radial-gradient(ellipse 120% 70% at 50% 40%,#10234a 0%,var(--navy) 38%,var(--ink) 100%);
  transition:transform 1.15s cubic-bezier(.77,0,.18,1);will-change:transform}
#htIntro .ht-l{left:0}
#htIntro .ht-r{right:0}
#htIntro .ht-door::after{content:"";position:absolute;top:0;bottom:0;width:2px;
  background:linear-gradient(transparent,var(--gold) 30%,var(--gold) 70%,transparent);opacity:.9}
#htIntro .ht-l::after{right:0}
#htIntro .ht-r::after{left:0}
#htIntro .ht-door::before{content:"";position:absolute;inset:0;opacity:.5;
  background-image:linear-gradient(rgba(245,196,81,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(22,141,255,.06) 1px,transparent 1px);
  background-size:44px 44px;
  -webkit-mask-image:radial-gradient(circle at 50% 45%,#000,transparent 70%);
          mask-image:radial-gradient(circle at 50% 45%,#000,transparent 70%)}
#htIntro.ht-open .ht-l{transform:translateX(-101%)}
#htIntro.ht-open .ht-r{transform:translateX(101%)}
#htIntro .ht-center{position:relative;z-index:2;text-align:center;width:min(92vw,420px);
  transition:opacity .5s ease,transform .7s ease}
#htIntro.ht-open .ht-center{opacity:0;transform:scale(1.15)}
#htIntro .ht-orb{position:relative;width:min(62vw,250px);aspect-ratio:1;margin:0 auto 26px;
  animation:htRise 1s cubic-bezier(.2,.8,.2,1) both}
#htIntro .ht-orb::before{content:"";position:absolute;inset:-18%;border-radius:50%;
  background:radial-gradient(circle,rgba(22,141,255,.35),transparent 65%);
  animation:htPulse 2.4s ease-in-out infinite alternate}
#htIntro .ht-ring{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}
#htIntro .ht-ring circle{fill:none;stroke-linecap:round}
#htIntro .ht-track{stroke:rgba(255,255,255,.08);stroke-width:2}
#htIntro .ht-arc{stroke:url(#htG);stroke-width:4;stroke-dasharray:578;stroke-dashoffset:578;
  filter:drop-shadow(0 0 6px rgba(245,196,81,.7))}
#htIntro .ht-logo{position:absolute;inset:15%;width:70%;height:70%;object-fit:contain;
  filter:drop-shadow(0 0 22px rgba(22,141,255,.55))}
#htIntro .ht-mono{position:absolute;inset:15%;display:none;place-items:center;font-weight:900;
  font-size:clamp(54px,18vw,92px);color:var(--gold);text-shadow:0 0 28px rgba(22,141,255,.8)}
#htIntro .ht-brand{font-weight:900;font-size:clamp(26px,7vw,36px);letter-spacing:.22em;padding-inline-start:.22em;
  background:linear-gradient(180deg,#fff 20%,#9cc9ff);-webkit-background-clip:text;background-clip:text;color:transparent;
  animation:htRise 1s .35s cubic-bezier(.2,.8,.2,1) both}
#htIntro .ht-tag{margin-top:10px;font-size:clamp(16px,4.4vw,20px);font-weight:600;color:var(--gold);
  animation:htRise 1s .6s cubic-bezier(.2,.8,.2,1) both}
#htIntro .ht-sub{margin-top:6px;font-size:13px;color:var(--hmuted);animation:htRise 1s .8s both}
#htIntro .ht-meter{margin-top:30px;display:flex;align-items:center;justify-content:center;gap:12px;
  font-size:14px;color:var(--hmuted);animation:htRise 1s 1s both}
#htIntro .ht-meter b{color:var(--htext);font-weight:800;min-width:3.2ch;text-align:center}
#htIntro .ht-skip{position:absolute;z-index:3;inset-block-start:max(18px,env(safe-area-inset-top));inset-inline-start:18px;
  font:600 13px 'Cairo',Tahoma,Arial,sans-serif;color:var(--hmuted);background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:8px 18px;cursor:pointer;transition:color .2s,border-color .2s}
#htIntro .ht-skip:hover{color:var(--gold);border-color:var(--gold)}
#htIntro .ht-skip:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
#htIntro.ht-open .ht-skip{opacity:0;pointer-events:none}
@keyframes htRise{from{opacity:0;transform:translateY(18px) scale(.96)}to{opacity:1;transform:none}}
@keyframes htPulse{from{opacity:.55;transform:scale(.94)}to{opacity:1;transform:scale(1.05)}}
@media (prefers-reduced-motion:reduce){
  #htIntro *,#htIntro *::before{animation-duration:.01ms!important;animation-iteration-count:1!important}
  #htIntro .ht-door{transition-duration:.2s}
}`;

  var HTML = `
<div class="ht-door ht-l"></div>
<div class="ht-door ht-r"></div>
<button class="ht-skip" id="htSkip" type="button">تخطي</button>
<div class="ht-center">
  <div class="ht-orb">
    <svg class="ht-ring" viewBox="0 0 200 200" aria-hidden="true">
      <defs><linearGradient id="htG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f5c451"/><stop offset="1" stop-color="#168dff"/></linearGradient></defs>
      <circle class="ht-track" cx="100" cy="100" r="92"/>
      <circle class="ht-arc" id="htArc" cx="100" cy="100" r="92"/>
    </svg>
    <img class="ht-logo" id="htLogo" alt="HYPER TOPUP">
    <div class="ht-mono" id="htMono" aria-hidden="true">H</div>
  </div>
  <div class="ht-brand">HYPER TOPUP</div>
  <div class="ht-tag">عالمك الرقمي… شحنك في ثوانٍ</div>
  <div class="ht-sub">شحن ألعاب وخدمات رقمية بأمان وموثوقية</div>
  <div class="ht-meter"><span>جاري التجهيز</span><b id="htPct">٠٪</b></div>
</div>`;

  var root = document.documentElement;
  var prevOverflow = root.style.overflow;
  root.style.overflow = 'hidden'; // يمنع التمرير أثناء الافتتاحية

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@600;800;900&display=swap';
  document.head.appendChild(font);

  function start() {
    var el = document.createElement('div');
    el.id = 'htIntro';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'شاشة افتتاحية HYPER TOPUP');
    el.innerHTML = HTML;
    document.body.insertBefore(el, document.body.firstChild);

    var arc = el.querySelector('#htArc'), pct = el.querySelector('#htPct'),
        logo = el.querySelector('#htLogo'), mono = el.querySelector('#htMono'),
        C = 578, done = false, t0 = null;

    logo.addEventListener('error', function () { logo.style.display = 'none'; mono.style.display = 'grid'; });
    logo.src = cfg.logo;

    function finish() {
      if (done) return; done = true;
      try { sessionStorage.setItem('ht_intro', '1'); } catch (e) {}
      arc.style.strokeDashoffset = 0; pct.textContent = '١٠٠٪';
      el.classList.add('ht-open');
      setTimeout(function () { el.remove(); style.remove(); root.style.overflow = prevOverflow; }, 1250);
    }

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function ease(x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
    function tick(ts) {
      if (done) return;
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / (reduce ? 600 : cfg.duration), 1), e = ease(p);
      arc.style.strokeDashoffset = C * (1 - e);
      pct.textContent = Math.round(e * 100).toLocaleString('ar-EG') + '٪';
      if (p < 1) requestAnimationFrame(tick); else setTimeout(finish, 350);
    }
    requestAnimationFrame(tick);
    el.querySelector('#htSkip').addEventListener('click', finish);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') finish(); });
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();