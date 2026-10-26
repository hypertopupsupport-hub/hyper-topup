function hyperAiInit() {
  // 1. حقن التنسيقات (CSS) تلقائياً
  const style = document.createElement('style');
  style.innerHTML = `
    #htai{--g:#f4c95d;--g2:#ffe8a0;--g3:#9c691c;--bg:#080c18;--bg2:#10172a;--tx:#fff8e6;--mu:#aeb7c8;--ok:#10b981;
      position:fixed;z-index:9990;direction:rtl;font-family:Cairo,system-ui,sans-serif;color:var(--tx);
      left:max(14px,calc((100vw - 520px)/2 + 14px));bottom:calc(112px + env(safe-area-inset-bottom,0px))}
    #htai *{box-sizing:border-box}
    #htai button{font:inherit;color:inherit;cursor:pointer;border:0;background:none}
    #htai :focus-visible{outline:2px solid var(--g2);outline-offset:2px}
    .htai-fab{position:relative;width:62px;height:62px;border-radius:50%;display:grid;place-items:center;
      background:radial-gradient(circle at 30% 25%,#1b2542,#0a0f1f 70%);
      box-shadow:0 10px 28px rgba(0,0,0,.55),0 0 0 1px rgba(244,201,93,.55),inset 0 1px 0 rgba(255,255,255,.18)}
    .htai-fab svg{width:38px;height:38px}
    .htai-fab:after{content:"";position:absolute;inset:-1px;border-radius:50%;border:2px solid var(--g);opacity:0;pointer-events:none}
    .htai-fab.ping:after{animation:htping 2.2s ease-out 3}
    @keyframes htping{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.55);opacity:0}}
    .htai-on{position:absolute;top:3px;right:3px;width:12px;height:12px;border-radius:50%;background:var(--ok);border:2px solid var(--bg);box-shadow:0 0 8px var(--ok)}
    .htai-badge{position:absolute;top:-4px;left:-4px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:var(--g);color:#1a1204;font-size:12px;font-weight:800;display:none;place-items:center}
    .htai-badge.show{display:grid}
    .htai-tip{position:absolute;bottom:11px;left:72px;white-space:nowrap;background:rgba(16,23,42,.96);border:1px solid rgba(244,201,93,.4);border-radius:14px;padding:8px 14px;font-size:13px;font-weight:600;box-shadow:0 8px 22px rgba(0,0,0,.5);opacity:0;transform:translateX(-6px);pointer-events:none;transition:.35s}
    .htai-tip.show{opacity:1;transform:none}
    
    .htai-panel{position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;max-width:none!important;max-height:none!important;display:none;flex-direction:column;overflow:hidden;border-radius:0!important;border:none!important;box-shadow:none!important;z-index:999999!important;isolation:isolate;
      background:radial-gradient(120% 55% at 50% -8%,#15234a 0%,transparent 62%),linear-gradient(180deg,#0b1224,#060a15)}
    .htai-panel:before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;opacity:.55;background:repeating-linear-gradient(115deg,rgba(244,201,93,.035) 0 1px,transparent 1px 22px);-webkit-mask:linear-gradient(180deg,#000,transparent 70%);mask:linear-gradient(180deg,#000,transparent 70%)}
    .htai-panel>*{position:relative;z-index:1}
    .htai-panel>.htai-aura{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none}
    .htai-aura i{position:absolute;border-radius:50%;filter:blur(64px);background:#f4c95d;opacity:.26;animation:htdrift 16s ease-in-out infinite alternate}
    .htai-aura i:nth-child(1){width:260px;height:260px;top:-100px;right:-70px}
    .htai-aura i:nth-child(2){width:230px;height:230px;bottom:90px;left:-100px;background:#2b4b85;opacity:.4;animation-duration:22s}
    @keyframes htdrift{to{transform:translate(-34px,44px) scale(1.18)}}
    .htai-panel.open{display:flex!important;animation:htin .55s cubic-bezier(.16,1,.3,1)}
    @keyframes htin{from{opacity:0;transform:translateY(30px) scale(.94);filter:blur(10px)}to{opacity:1;transform:none;filter:none}}

    .htai-head{padding-top:calc(env(safe-area-inset-top,0px) + 14px)!important;display:flex;align-items:center;gap:13px;padding:14px 16px;background:linear-gradient(180deg,rgba(20,31,60,.8),rgba(10,16,32,.55));-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4)}
    .htai-head:after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:linear-gradient(90deg,transparent,rgba(244,201,93,.7),transparent)}
    .htai-av{position:relative;width:46px;height:46px;flex:none;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 30% 25%,#1d2a4d,#080c18);box-shadow:0 6px 18px rgba(0,0,0,.5)}
    .htai-av:before{content:"";position:absolute;inset:-3px;border-radius:50%;background:conic-gradient(from 0deg,#ffe8a0,rgba(244,201,93,0) 38%,#f4c95d 70%,rgba(244,201,93,0));animation:htspin 6s linear infinite;-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 2.5px),#000 calc(100% - 2px));mask:radial-gradient(farthest-side,transparent calc(100% - 2.5px),#000 calc(100% - 2px))}
    @keyframes htspin{to{transform:rotate(360deg)}}
    .htai-av svg{width:30px;height:30px;animation:htfloat 4s ease-in-out infinite}
    @keyframes htfloat{50%{transform:translateY(-2px)}}
    .htai-ttl{flex:1;min-width:0;line-height:1.35}
    .htai-ttl b{font-size:16.5px;font-weight:800;letter-spacing:.2px;display:flex;align-items:center;gap:8px}
    .htai-ttl b i{font:700 9px Orbitron,sans-serif;font-style:normal;letter-spacing:.08em;color:#1a1204;padding:3px 7px;border-radius:7px;background:linear-gradient(110deg,#ffe8a0 0 40%,#fff 50%,#f4c95d 60% 100%);background-size:250% 100%;animation:htsheen 3.8s ease-in-out infinite}
    @keyframes htsheen{0%{background-position:100% 0}60%,100%{background-position:-100% 0}}
    .htai-ttl small{font-size:12px;color:var(--mu);display:flex;align-items:center;gap:6px}
    .htai-ttl small:before{content:"";width:7px;height:7px;border-radius:50%;background:var(--ok);box-shadow:0 0 7px var(--ok);animation:htpulse 2.4s ease-in-out infinite}
    @keyframes htpulse{50%{opacity:.45;transform:scale(.8)}}
    .htai-ib{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;color:var(--mu)!important;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09)!important;transition:transform .35s cubic-bezier(.34,1.56,.64,1),background .25s,color .25s}
    .htai-ib:hover{background:rgba(244,201,93,.15);color:#ffe8a0!important;transform:rotate(90deg)}
    .htai-ib:active{transform:scale(.88)}
    .htai-ib svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    #htaiFull{display:none!important}

    .htai-log{flex:1;overflow-y:auto;padding:22px 16px 14px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth;overscroll-behavior:contain;-webkit-mask:linear-gradient(180deg,transparent 0,#000 16px,#000 calc(100% - 12px),transparent);mask:linear-gradient(180deg,transparent 0,#000 16px,#000 calc(100% - 12px),transparent)}
    .htai-log::-webkit-scrollbar{width:3px}.htai-log::-webkit-scrollbar-thumb{background:rgba(244,201,93,.3);border-radius:4px}
    .htm{max-width:84%;padding:12px 15px;border-radius:20px;font-size:14.5px;line-height:1.8;overflow-wrap:anywhere;white-space:pre-wrap;animation:htmsg .55s cubic-bezier(.16,1,.3,1) both}
    @keyframes htmsg{from{opacity:0;transform:translateY(14px) scale(.95)}to{opacity:1;transform:none}}
    .htm.a{align-self:flex-start;transform-origin:bottom right;background:linear-gradient(145deg,rgba(28,41,76,.88),rgba(16,24,46,.88));border:1px solid rgba(255,255,255,.08);border-bottom-right-radius:6px;box-shadow:0 8px 22px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.06)}
    .htm.u{align-self:flex-end;transform-origin:bottom left;color:#1a1204;font-weight:700;background:linear-gradient(135deg,#ffeaa8,#f4c95d 55%,#e2a93a);border-bottom-left-radius:6px;box-shadow:0 10px 24px rgba(244,201,93,.22),inset 0 1px 0 rgba(255,255,255,.55)}
    .htm a{color:var(--g2);text-decoration:underline;text-underline-offset:3px}.htm.u a{color:#4a2f00}
    .htm time{display:block;margin-top:4px;font-size:10px;opacity:.5;white-space:normal}
    .htm img{max-width:100%;border-radius:12px;display:block}
    .htai-typing{align-self:flex-start;display:none;gap:6px;padding:14px 17px;background:linear-gradient(145deg,rgba(28,41,76,.88),rgba(16,24,46,.88));border:1px solid rgba(255,255,255,.08);border-radius:20px;border-bottom-right-radius:6px}
    .htai-typing.show{display:flex;animation:htmsg .4s cubic-bezier(.16,1,.3,1) both}
    .htai-typing i{width:7px;height:7px;border-radius:50%;background:linear-gradient(135deg,#ffe8a0,#f4c95d);animation:htdot 1.2s infinite}
    .htai-typing i:nth-child(2){animation-delay:.18s}.htai-typing i:nth-child(3){animation-delay:.36s}
    @keyframes htdot{0%,60%,100%{opacity:.3;transform:none}30%{opacity:1;transform:translateY(-5px)}}

    .htai-topics{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:4px 0}
    .htai-topic{display:flex;flex-direction:column;align-items:flex-start;gap:12px;text-align:start;padding:14px 13px;border-radius:18px;font-size:13.5px;font-weight:700;line-height:1.4;background:linear-gradient(160deg,rgba(28,41,76,.82),rgba(12,19,38,.82));border:1px solid rgba(244,201,93,.22)!important;box-shadow:0 8px 20px rgba(0,0,0,.25);opacity:0;animation:htmsg .6s cubic-bezier(.16,1,.3,1) forwards;transition:transform .3s cubic-bezier(.16,1,.3,1),border-color .3s,box-shadow .3s}
    .htai-topic:nth-child(1){animation-delay:.15s}.htai-topic:nth-child(2){animation-delay:.22s}.htai-topic:nth-child(3){animation-delay:.29s}.htai-topic:nth-child(4){animation-delay:.36s}.htai-topic:nth-child(5){animation-delay:.43s}
    .htai-topic:hover{transform:translateY(-3px);border-color:rgba(244,201,93,.7)!important;box-shadow:0 14px 28px rgba(0,0,0,.35),0 0 0 1px rgba(244,201,93,.15)}
    .htai-topic:active{transform:scale(.97)}
    .htai-topic svg{width:38px;height:38px;padding:8px;border-radius:12px;flex:none;background:rgba(244,201,93,.1);fill:none;stroke:var(--g);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
    .htai-topic:last-child:nth-child(odd){grid-column:1/-1}
    .htai-card{align-self:stretch;padding:15px;border-radius:20px;background:linear-gradient(160deg,rgba(28,41,76,.85),rgba(12,19,38,.85));border:1px solid rgba(244,201,93,.3);display:grid;gap:10px;box-shadow:0 10px 26px rgba(0,0,0,.3);animation:htmsg .55s cubic-bezier(.16,1,.3,1) both}
    .htai-card b{font-size:13.5px}
    .htai-card input{width:100%;padding:12px 14px;border-radius:13px;font:inherit;font-size:16px;color:var(--tx);background:rgba(6,10,21,.7);border:1px solid rgba(255,255,255,.12);direction:ltr;text-align:right;transition:border-color .25s,box-shadow .25s}
    .htai-card input:focus{border-color:var(--g);outline:0;box-shadow:0 0 0 4px rgba(244,201,93,.12)}
    .htai-go{position:relative;overflow:hidden;padding:12px;border-radius:13px;font-weight:800;font-size:14px;color:#1a1204!important;background:linear-gradient(135deg,#ffeaa8,#f4c95d 60%,#e2a93a);transition:transform .2s}
    .htai-go:after{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);animation:htsweep 3.2s ease-in-out infinite}
    @keyframes htsweep{0%{left:-60%}55%,100%{left:130%}}
    .htai-go:active{transform:scale(.97)}
    .htai-note{align-self:center;font-size:12px;color:#ffd9a0;background:rgba(244,150,60,.1);border:1px solid rgba(244,150,60,.35);padding:8px 12px;border-radius:12px;text-align:center;animation:htmsg .4s both}

    .htai-bar{display:flex;align-items:flex-end;gap:8px;margin:6px 14px 4px;padding:6px;border-radius:28px;background:rgba(14,21,41,.85);border:1px solid rgba(255,255,255,.1);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 10px 30px rgba(0,0,0,.4);transition:border-color .3s,box-shadow .3s}
    .htai-bar:focus-within{border-color:rgba(244,201,93,.6);box-shadow:0 10px 30px rgba(0,0,0,.4),0 0 0 4px rgba(244,201,93,.1)}
    .htai-bar textarea{flex:1;resize:none;max-height:110px;min-height:44px;padding:11px 14px;border:0;background:transparent;font:inherit;font-size:16px;line-height:1.5;color:var(--tx)}
    .htai-bar textarea:focus{outline:0}.htai-bar textarea::placeholder{color:#7f8da6}
    .htai-send{width:46px;height:46px;flex:none;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#ffeaa8,#f4c95d 60%,#e2a93a);box-shadow:0 6px 18px rgba(244,201,93,.35);transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .25s,box-shadow .25s}
    .htai-send svg{width:20px;height:20px;fill:#1a1204;transform:scaleX(-1)}
    .htai-send:not(:disabled):hover{transform:scale(1.08) rotate(-8deg)}
    .htai-send:not(:disabled):active{transform:scale(.9)}
    .htai-send:disabled{opacity:.35;box-shadow:none;transform:scale(.92)}
    .htai-sec{padding:8px 14px calc(12px + env(safe-area-inset-bottom,0px));font-size:11.5px;text-align:center;color:#8896b0;display:flex;align-items:center;justify-content:center;gap:6px;font-weight:600;letter-spacing:.3px}
    .htai-sec b{font-weight:800;font-family:Orbitron,sans-serif;letter-spacing:.9px;background:linear-gradient(110deg,#c99a3a 0 35%,#fff0bd 50%,#c99a3a 65% 100%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:htsheen 5s ease-in-out infinite}
    @media(prefers-reduced-motion:reduce){.htai-panel,.htai-panel *{animation:none!important;transition:none!important}.htai-topic{opacity:1}}
    @media(max-width:430px){#htai{left:12px}}
  `;
  document.head.appendChild(style);

  // 2. حقن هيكل الويدجت (HTML) تلقائياً في الصفحة
  const container = document.createElement('div');
  container.innerHTML = `
    <div id="htai">
      <div class="htai-tip" id="htaiTip">اسأل المساعد الذكي 24/7</div>
      <section class="htai-panel" id="htaiPanel" role="dialog" aria-label="مساعد HYPER TOPUP الذكي">
        <div class="htai-aura" aria-hidden="true"><i></i><i></i></div>
        <header class="htai-head">
          <div class="htai-av"><svg viewBox="0 0 48 48"><use href="#htaiBot"/></svg></div>
          <div class="htai-ttl"><b>مساعد HYPER <i>AI</i></b><small>متصل الآن · يرد خلال ثوانٍ</small></div>
          <button class="htai-ib" id="htaiFull" aria-label="فتح المحادثة الكاملة" title="المحادثة الكاملة"><svg viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></button>
          <button class="htai-ib" id="htaiX" aria-label="إغلاق"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
        </header>
        <div class="htai-log" id="htaiLog" aria-live="polite"></div>
        <div class="htai-bar">
          <textarea id="htaiIn" rows="1" placeholder="اكتب سؤالك هنا..." aria-label="رسالتك"></textarea>
          <button class="htai-send" id="htaiSend" aria-label="إرسال" disabled><svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg></button>
        </div>
        <div class="htai-sec"><span>⚡</span> Powered by <b>HYPER TOPUP AI</b></div>
      </section>
      <button class="htai-fab ping" id="htaiFab" aria-label="افتح المساعد الذكي" aria-expanded="false">
        <svg viewBox="0 0 48 48"><use href="#htaiBot"/></svg><span class="htai-on"></span><span class="htai-badge" id="htaiBadge">0</span>
      </button>
    </div>
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <defs><linearGradient id="htg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe8a0"/><stop offset="1" stop-color="#f4c95d"/></linearGradient></defs>
      <symbol id="htaiBot" viewBox="0 0 48 48">
        <path d="M24 4v6" stroke="url(#htg)" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="4" r="2.4" fill="url(#htg)"/>
        <rect x="7" y="10" width="34" height="27" rx="11" fill="url(#htg)"/>
        <rect x="11.5" y="15" width="25" height="17" rx="8" fill="#080c18"/>
        <rect x="16" y="21" width="5" height="6" rx="2.5" fill="#f4c95d"/><rect x="27" y="21" width="5" height="6" rx="2.5" fill="#f4c95d"/>
        <rect x="2.5" y="19" width="4" height="10" rx="2" fill="url(#htg)"/><rect x="41.5" y="19" width="4" height="10" rx="2" fill="url(#htg)"/>
        <path d="M17 42h14" stroke="url(#htg)" stroke-width="2.5" stroke-linecap="round"/>
      </symbol>
    </svg>
  `;
  document.body.appendChild(container);

  // 3. تشغيل وظائف الشات والـ Crisp تلقائياً
  window.$crisp = window.$crisp || [];
  window.CRISP_WEBSITE_ID = "0316b84d-cdc3-41b7-b06d-1b7a44f2b524";
  window.CRISP_RUNTIME_CONFIG = { locale: "ar" };
  if(!document.getElementById('crisp-script')) {
    var s = document.createElement("script");
    s.id = 'crisp-script';
    s.src = "https://client.crisp.chat/l.js"; s.async = 1;
    document.head.appendChild(s);
  }
  var C = function(a){ window.$crisp.push(a); };
  C(["do","chat:hide"]);
  C(["set","session:data",[[["page",location.href]]]]);

  var $ = function(id){ return document.getElementById(id); };
  var fab=$("htaiFab"), panel=$("htaiPanel"), log=$("htaiLog"), inp=$("htaiIn"), send=$("htaiSend"),
      badge=$("htaiBadge"), tip=$("htaiTip");
  var KEY="ht_ai_chat_v1", hist=[], unread=0, typingT=null;
  var typing=document.createElement("div"); typing.className="htai-typing"; typing.innerHTML="<i></i><i></i><i></i>";

  var TOPICS=[
    ["متابعة أو تأخير طلب","track",'<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>'],
    ["طرق الدفع والتحويل","أريد معرفة طرق الدفع المتاحة وكيف أحوّل.",'<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/>'],
    ["الأسعار والعروض","ما هي الأسعار والعروض الحالية؟",'<path d="M20 12l-8 8-9-9V3h8z"/><circle cx="7.5" cy="7.5" r="1.2"/>'],
    ["طلب لعبة أو خدمة جديدة","أريد طلب لعبة أو خدمة غير موجودة في المتجر. الاسم والكمية: ",'<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10v5M4.5 12.5h5M16 11.5h.01M18.5 13.5h.01"/>'],
    ["كيف أشحن؟","اشرح لي خطوات الشحن وكيف أجد الـ Player ID.",'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>']
  ];

  function fmt(el,text){
    text.split(/(https?:\/\/[^\s<>"']+|\*\*[^*]+\*\*)/g).forEach(function(p){
      if(!p) return;
      if(/^https?:\/\//.test(p)){ var a=document.createElement("a"); a.href=p; a.target="_blank"; a.rel="noopener noreferrer"; a.textContent=p.length>46?p.slice(0,44)+"…":p; el.appendChild(a); }
      else if(/^\*\*.+\*\*$/.test(p)){ var b=document.createElement("b"); b.textContent=p.slice(2,-2); el.appendChild(b); }
      else el.appendChild(document.createTextNode(p));
    });
  }
  function clock(ts){ return new Date(ts).toLocaleTimeString("ar-EG",{hour:"2-digit",minute:"2-digit"}); }
  function add(role,text,ts,skipSave){
    ts=ts||Date.now();
    var m=document.createElement("div"); m.className="htm "+role;
    fmt(m,text);
    var t=document.createElement("time"); t.textContent=clock(ts); m.appendChild(t);
    log.insertBefore(m,typing.parentNode===log?typing:null); down();
    if(!skipSave){ hist.push({r:role,t:text,ts:ts}); try{localStorage.setItem(KEY,JSON.stringify(hist.slice(-40)));}catch(e){} }
  }
  function down(){ log.scrollTop=log.scrollHeight; }
  function showTyping(on){
    clearTimeout(typingT);
    if(on){ log.appendChild(typing); typing.classList.add("show"); down(); typingT=setTimeout(function(){showTyping(false);},30000); }
    else typing.classList.remove("show");
  }

  C(["on","message:received",function(m){
    showTyping(false);
    var c=m&&m.content, txt=null;
    if(m.type==="text") txt=String(c);
    else if(m.type==="file"&&c&&c.url) txt="📎 "+(c.name||"ملف")+": "+c.url;
    else if(m.type==="animation"&&c&&c.url) txt=c.url;
    if(txt!==null){ add("a",txt); if(!panel.classList.contains("open")){ unread++; badge.textContent=unread; badge.classList.add("show"); } }
  }]);
  C(["on","message:compose:received",function(e){ if(e&&e.type==="start") showTyping(true); else if(e&&e.type==="stop") showTyping(false); }]);

  var RISK=/(كلمة\s*(ال)?(سر|مرور)|باسورد|password|otp|كود\s*(ال)?تحقق)/i;
  function submit(text){
    text=(text||"").trim(); if(!text) return;
    clear(".htai-topics,.htai-card");
    add("u",text);
    if(RISK.test(text)){ var n=document.createElement("div"); n.className="htai-note"; n.textContent="تنبيه: لا ترسل كلمة سر أو كود تحقق، نحن لا نحتاجهما أبداً.";
      log.insertBefore(n,typing.parentNode===log?typing:null); }
    C(["do","message:send",["text",text]]);
    showTyping(true);
  }
  function clear(sel){ [].forEach.call(log.querySelectorAll(sel),function(n){n.remove();}); }
  function trackCard(){
    clear(".htai-topics");
    var d=document.createElement("div"); d.className="htai-card";
    d.innerHTML='<b>📦 متابعة الطلب</b><input id="htO" inputmode="numeric" placeholder="رقم الطلب" aria-label="رقم الطلب"><input id="htP" placeholder="Player ID" aria-label="Player ID"><button class="htai-go" type="button">تتبّع طلبي</button>';
    d.querySelector("button").onclick=function(){
      var o=$("htO").value.trim(), p=$("htP").value.trim();
      if(!o&&!p){ $("htO").focus(); return; }
      submit("أريد متابعة طلبي."+(o?" رقم الطلب: "+o+".":"")+(p?" الـ ID: "+p+".":""));
    };
    log.insertBefore(d,typing.parentNode===log?typing:null); down(); $("htO").focus();
  }
  function topics(){
    var g=document.createElement("div"); g.className="htai-topics";
    TOPICS.forEach(function(t){
      var b=document.createElement("button"); b.type="button"; b.className="htai-topic";
      b.innerHTML='<svg viewBox="0 0 24 24">'+t[2]+'</svg><span></span>'; b.lastChild.textContent=t[0];
      b.onclick=function(){
        if(t[1]==="track") return trackCard();if(/: $/.test(t[1])){ clear(".htai-topics"); add("u",t[1].trim()); add("a","اكتب اسم اللعبة أو الخدمة والكمية، وهسجّل طلبك فوراً."); inp.focus(); return; }
        submit(t[1]);
      };
      g.appendChild(b);
    });
    log.insertBefore(g,typing.parentNode===log?typing:null);
  }
  function boot(){
    try{ hist=JSON.parse(localStorage.getItem(KEY)||"[]"); }catch(e){ hist=[]; }
    if(hist.length){ hist.forEach(function(h){ add(h.r,h.t,h.ts,true); }); }
    else { add("a","أهلاً بيك في **HYPER TOPUP** 👋\nأنا مساعدك الذكي، متاح 24/7. أتابع طلبك، وأجاوبك على الدفع والأسعار، وأستقبل طلب أي لعبة جديدة.",Date.now(),true); topics(); }
  }
 
function openPanel(){
    panel.classList.add("open"); fab.setAttribute("aria-expanded","true"); fab.classList.remove("ping");
    unread=0; badge.classList.remove("show"); tip.classList.remove("show"); down(); setTimeout(function(){inp.focus();},120);
  }
  function closePanel(){ panel.classList.remove("open"); fab.setAttribute("aria-expanded","false"); fab.focus(); }
  
  fab.onclick=function(){ panel.classList.contains("open")?closePanel():openPanel(); };
  $("htaiX").onclick=closePanel;
  document.addEventListener("keydown",function(e){ if(e.key==="Escape"&&panel.classList.contains("open")) closePanel(); });
  inp.addEventListener("input",function(){ send.disabled=!inp.value.trim(); inp.style.height="auto"; inp.style.height=Math.min(inp.scrollHeight,110)+"px"; });
  inp.addEventListener("keydown",function(e){ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); go(); } });
  send.onclick=go;
  function go(){ var v=inp.value; inp.value=""; inp.style.height="auto"; send.disabled=true; submit(v); }
  window.openGabsterChat=openPanel;
 
  boot();
  try{ if(!sessionStorage.getItem("ht_tip")){ setTimeout(function(){ tip.classList.add("show"); setTimeout(function(){tip.classList.remove("show");},6500); sessionStorage.setItem("ht_tip","1"); },3500); } }catch(e){}
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", hyperAiInit);
else hyperAiInit();