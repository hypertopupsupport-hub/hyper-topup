(function() {
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
    
    .htai-panel{
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100dvh !important;
      max-width: none !important;
      max-height: none !important;
      display: none;
      flex-direction: column;
      overflow: hidden;
      border-radius: 0 !important;
      background: linear-gradient(180deg,#0e1529,#080c18);
      border: none !important;
      z-index: 999999 !important;
      box-shadow: none !important;
    }
    .htai-panel.open{
      display: flex !important;
      animation: htin .25s cubic-bezier(.2,.8,.2,1);
    }
    @keyframes htin{
      from{ opacity: 0; transform: scale(.97); }
      to{ opacity: 1; transform: scale(1); }
    }
    .htai-head{
      padding-top: calc(env(safe-area-inset-top, 0px) + 16px) !important;
      display:flex;align-items:center;gap:11px;padding:14px 14px 13px;background:linear-gradient(135deg,rgba(244,201,93,.16),rgba(244,201,93,.02));border-bottom:1px solid rgba(244,201,93,.2)
    }
    .htai-av{width:42px;height:42px;flex:none;border-radius:50%;display:grid;place-items:center;background:#0a0f1f;box-shadow:0 0 0 1.5px var(--g),0 0 14px rgba(244,201,93,.35)}
    .htai-av svg{width:28px;height:28px}
    .htai-ttl{flex:1;min-width:0;line-height:1.3}
    .htai-ttl b{font-size:15px;font-weight:800;display:flex;align-items:center;gap:7px}
    .htai-ttl b i{font:700 9px Orbitron,sans-serif;font-style:normal;letter-spacing:.06em;color:#1a1204;background:linear-gradient(135deg,var(--g2),var(--g));padding:2px 6px;border-radius:6px}
    .htai-ttl small{font-size:12px;color:var(--mu);display:flex;align-items:center;gap:6px}
    .htai-ttl small:before{content:"";width:7px;height:7px;border-radius:50%;background:var(--ok);box-shadow:0 0 7px var(--ok)}
    .htai-ib{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;color:var(--mu)!important}
    .htai-ib:hover{background:rgba(255,255,255,.08);color:var(--tx)!important}
    .htai-ib svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    #htaiFull { display: none !important; }
    
    .htai-log{flex:1;overflow-y:auto;padding:16px 14px 8px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;overscroll-behavior:contain}
    .htai-log::-webkit-scrollbar{width:4px}.htai-log::-webkit-scrollbar-thumb{background:rgba(244,201,93,.3);border-radius:4px}
    .htm{max-width:86%;padding:10px 13px;border-radius:18px;font-size:14px;line-height:1.75;word-wrap:break-word;overflow-wrap:anywhere;white-space:pre-wrap}
    .htm.a{align-self:flex-start;background:#151d36;border:1px solid rgba(255,255,255,.07);border-bottom-right-radius:5px}
    .htm.u{align-self:flex-end;color:#1a1204;font-weight:600;background:linear-gradient(135deg,var(--g2),var(--g));border-bottom-left-radius:5px}
    .htm a{color:var(--g2);text-decoration:underline;text-underline-offset:3px}.htm.u a{color:#4a2f00}
    .htm time{display:block;margin-top:3px;font-size:10px;opacity:.55;white-space:normal}
    .htm img{max-width:100%;border-radius:12px;display:block}
    .htai-typing{align-self:flex-start;display:none;gap:5px;padding:13px 15px;background:#151d36;border-radius:18px;border-bottom-right-radius:5px}
    .htai-typing.show{display:flex}
    .htai-typing i{width:7px;height:7px;border-radius:50%;background:var(--g);animation:htdot 1.1s infinite}
    .htai-typing i:nth-child(2){animation-delay:.18s}.htai-typing i:nth-child(3){animation-delay:.36s}
    @keyframes htdot{0%,60%,100%{opacity:.3;transform:none}30%{opacity:1;transform:translateY(-4px)}}
    .htai-topics{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:2px 0 4px}
    .htai-topic{display:flex;align-items:center;gap:9px;text-align:start;padding:11px 10px;border-radius:14px;font-size:13px;font-weight:700;line-height:1.3;background:rgba(244,201,93,.06);border:1px solid rgba(244,201,93,.25)!important;transition:.18s}
    .htai-topic:hover{background:rgba(244,201,93,.14);transform:translateY(-1px)}
    .htai-topic svg{width:22px;height:22px;flex:none;fill:none;stroke:var(--g);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
    .htai-topic:last-child:nth-child(odd){grid-column:1/-1}
    .htai-card{align-self:stretch;padding:13px;border-radius:16px;background:#101830;border:1px solid rgba(244,201,93,.3);display:grid;gap:9px}
    .htai-card b{font-size:13px}
    .htai-card input{width:100%;padding:11px 12px;border-radius:11px;font:inherit;font-size:14px;color:var(--tx);background:#080c18;border:1px solid rgba(255,255,255,.14);direction:ltr;text-align:right}
    .htai-card input:focus{border-color:var(--g);outline:0}
    .htai-go{padding:11px;border-radius:12px;font-weight:800;font-size:14px;color:#1a1204!important;background:linear-gradient(135deg,var(--g2),var(--g))}
    .htai-note{align-self:center;font-size:12px;color:#ffd9a0;background:rgba(244,150,60,.1);border:1px solid rgba(244,150,60,.35);padding:7px 11px;border-radius:12px;text-align:center}
    
    .htai-bar{display:flex;align-items:flex-end;gap:8px;padding:10px 12px 6px;border-top:1px solid rgba(255,255,255,.07)}
    .htai-bar textarea{flex:1;resize:none;max-height:110px;min-height:44px;padding:11px 14px;border-radius:22px;font:inherit;font-size:14px;line-height:1.5;color:var(--tx);background:#0b1124;border:1px solid rgba(255,255,255,.12)}
    .htai-bar textarea:focus{border-color:var(--g);outline:0}
    .htai-send{width:44px;height:44px;flex:none;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,var(--g2),var(--g));box-shadow:0 4px 14px rgba(244,201,93,.3)}
    .htai-send svg{width:20px;height:20px;fill:#1a1204;transform:scaleX(-1)}
    .htai-send:disabled{opacity:.4;box-shadow:none}
    
    .htai-sec{
      padding: 10px 14px calc(14px + env(safe-area-inset-bottom, 0px));
      font-size: 12px;
      text-align: center;
      color: #aeb7c8;
      background: rgba(8, 12, 24, 0.6);
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }
    .htai-sec b {
      color: #ffe8a0;
      font-weight: 800;
      font-family: Orbitron, sans-serif;
      letter-spacing: 0.8px;
    }
    @media(max-width:430px){#htai{left:12px}}
  `;
  document.head.appendChild(style);

  // 2. حقن هيكل الويدجت (HTML) تلقائياً في الصفحة
  const container = document.createElement('div');
  container.innerHTML = `
    <div id="htai">
      <div class="htai-tip" id="htaiTip">اسأل المساعد الذكي 24/7</div>
      <section class="htai-panel" id="htaiPanel" role="dialog" aria-label="مساعد HYPER TOPUP الذكي">
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
        if(t[1]==="track") return trackCard();
        if(/: $/.test(t[1])){ clear(".htai-topics"); add("u",t[1].trim()); add("a","اكتب اسم اللعبة أو الخدمة والكمية، وهسجّل طلبك فوراً."); inp.focus(); return; }
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
})();