(function(){
var CSS=`
nav.bottom-nav{
position:fixed!important;z-index:50;
left:0!important;right:0!important;margin:0 auto!important;
width:calc(100% - 20px)!important;max-width:560px!important;
height:74px!important;
bottom:calc(20px + env(safe-area-inset-bottom))!important;
padding:8px 10px!important;border-radius:36px!important;
display:grid!important;grid-template-columns:repeat(3,1fr)!important;direction:rtl;
background:rgba(16,22,40,.42)!important;
-webkit-backdrop-filter:blur(26px) saturate(1.8)!important;
backdrop-filter:blur(26px) saturate(1.8)!important;
border:1px solid rgba(255,255,255,.16)!important;
box-shadow:0 12px 32px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.2),0 0 0 1px rgba(244,201,93,.1)!important;
transform:none!important;opacity:1!important;transition:none!important;
}
nav.bottom-nav .nav-item{
position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;
gap:4px;width:100%;height:100%;text-decoration:none;color:#8a93a6;
font:700 10px/1.2 Cairo,system-ui,sans-serif;-webkit-tap-highlight-color:transparent;
transition:color .35s;
}
nav.bottom-nav .nav-item span{font-size:10px;font-weight:700}
nav.bottom-nav .nav-icon-svg{
width:23px;height:23px;display:block;fill:none;stroke:currentColor;stroke-width:1.8;
stroke-linecap:round;stroke-linejoin:round;opacity:.8;
transition:transform .55s cubic-bezier(.34,1.56,.64,1),opacity .3s,filter .3s;
}
nav.bottom-nav .nav-item.active{color:#ffe08a}
nav.bottom-nav .nav-item.active .nav-icon-svg{
opacity:1;transform:scale(1.14);filter:drop-shadow(0 0 6px rgba(245,200,91,.75));
}
nav.bottom-nav .nav-item:active .nav-icon-svg{transform:scale(.88)}
.dock-glow{
position:absolute;z-index:1;top:0;left:0;width:50px;height:50px;border-radius:50%;
pointer-events:none;will-change:transform;
background:radial-gradient(circle,rgba(245,200,91,.55) 0%,rgba(245,200,91,.22) 55%,transparent 72%);
box-shadow:0 0 22px rgba(245,200,91,.45),0 0 52px rgba(245,200,91,.22);
transition:transform .65s cubic-bezier(.34,1.56,.64,1);
animation:orbBreathe 3s ease-in-out infinite;
}
@keyframes orbBreathe{50%{filter:brightness(1.35)}}
@media (prefers-reduced-motion:reduce){.dock-glow,nav.bottom-nav .nav-icon-svg{transition:none;animation:none}}
`;

var TABS=[
{href:'index.html',id:'nav-home',label:'الرئيسية',svg:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'},
{href:'all-products.html',id:'nav-products',label:'المنتجات',svg:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>'},
{href:'account.html',id:'nav-account',label:'الحساب',svg:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'}
];

function init(){
document.querySelectorAll('nav.bottom-nav,.bottom-nav,.nav-glow').forEach(function(n){n.remove();});

var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);

var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
var activeHref=page==='index.html'?'index.html':(page==='account.html'?'account.html':'all-products.html');

var nav=document.createElement('nav');nav.className='bottom-nav';
nav.innerHTML='<span class="dock-glow" aria-hidden="true"></span>'+TABS.map(function(t){
return '<a href="'+t.href+'" class="nav-item" id="'+t.id+'"><svg class="nav-icon-svg" viewBox="0 0 24 24">'+t.svg+'</svg><span>'+t.label+'</span></a>';
}).join('');
document.body.appendChild(nav);

if(page!=='index.html'){
var sp=document.createElement('div');sp.setAttribute('aria-hidden','true');
sp.style.height='110px';document.body.appendChild(sp);
}

var orb=nav.querySelector('.dock-glow');
var items=[].slice.call(nav.querySelectorAll('.nav-item'));
function byHref(h){return items.filter(function(a){return a.getAttribute('href')===h;})[0];}
var current=byHref(activeHref)||items[0];
var prev=null;
try{prev=byHref(sessionStorage.getItem('navPrev'));}catch(e){}

function place(el,animate){
var n=nav.getBoundingClientRect();
var i=el.querySelector('.nav-icon-svg').getBoundingClientRect();
var s=orb.offsetWidth;
var x=i.left-n.left-nav.clientLeft+i.width/2-s/2;
var y=i.top-n.top-nav.clientTop+i.height/2-s/2;
orb.style.transition=animate?'':'none';
orb.style.transform='translate('+x+'px,'+y+'px)';
}
function setActive(el){items.forEach(function(i){i.classList.toggle('active',i===el);});}

var start=(prev&&prev!==current)?prev:current;
setActive(start);place(start,false);void orb.offsetWidth;
requestAnimationFrame(function(){requestAnimationFrame(function(){
setActive(current);place(current,true);
});});

items.forEach(function(a){
a.addEventListener('click',function(e){
e.preventDefault();
var href=a.getAttribute('href');
if(page===href){window.scrollTo({top:0,behavior:'smooth'});return;}
try{sessionStorage.setItem('navPrev',current.getAttribute('href'));}catch(_){}
setActive(a);place(a,true);
setTimeout(function(){location.href=href;},280);
});
});
addEventListener('resize',function(){place(current,false);});
addEventListener('pageshow',function(ev){if(ev.persisted)place(current,false);});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();