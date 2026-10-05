(function(){
var CSS=`
#authGate{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(3,6,14,.82);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);direction:rtl;font-family:Cairo,system-ui,sans-serif}
#authGate .ag-card{width:min(100%,360px);padding:26px 20px;text-align:center;border-radius:22px;background:linear-gradient(145deg,rgba(25,35,61,.96),rgba(7,12,25,.98));border:1px solid rgba(244,201,93,.35);box-shadow:0 20px 50px rgba(0,0,0,.6),0 0 30px rgba(244,201,93,.12);color:#fff8e6}
#authGate .ag-ic{font-size:34px}
#authGate h3{margin:8px 0 6px;color:#ffe49a;font-size:18px}
#authGate p{margin:0 0 18px;color:#b8c0ce;font-size:12px;line-height:1.8}
#authGate .ag-btn{display:block;padding:13px;border-radius:14px;font-weight:800;font-size:13px;text-decoration:none;color:#17130a;background:linear-gradient(135deg,#dcae42,#ffe49a,#d49a32)}
#authGate .ag-back{display:block;margin-top:12px;color:#aeb7c8;font-size:11px;text-decoration:none}
`;
function ok(){
try{return !!JSON.parse(localStorage.getItem('hyper_user')||'null');}catch(e){return false;}
}
function run(){
if(ok())return;
var next=encodeURIComponent((location.pathname.split('/').pop()||'index.html')+location.search);
var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
var o=document.createElement('div');o.id='authGate';
o.innerHTML='<div class="ag-card"><div class="ag-ic">🔒</div><h3>سجّل دخولك أولاً</h3><p>لإتمام أي طلب أو عملية دفع لازم يكون عندك حساب في HYPER TOPUP.</p><a class="ag-btn" href="account.html?auth=1&next='+next+'">تسجيل الدخول / إنشاء حساب</a><a class="ag-back" href="index.html">الرجوع للرئيسية</a></div>';
document.body.appendChild(o);
document.documentElement.style.overflow='hidden';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
addEventListener('pageshow',function(e){
if(e.persisted&&ok()){var g=document.getElementById('authGate');if(g){g.remove();document.documentElement.style.overflow='';}}
});
})();