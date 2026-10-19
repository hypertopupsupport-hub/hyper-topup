/*! HYPER TOPUP — سجل طلبات مخصص لكل حساب
 *  - كل حساب (بالبريد) له سجل طلبات مستقل على هذا الجهاز.
 *  - العدّاد يبدأ لحظة تسجيل الخروج (أو التحويل لحساب آخر): لو مرّ 28 يوماً ولم يُسجَّل الدخول
 *    بنفس الحساب يُحذف سجله تلقائياً. تسجيل الدخول بنفس الحساب قبل المدة يوقف العدّاد ويرجّع سجله.
 *  ضع السطر التالي في <head> قبل أي سكربت آخر، في الصفحات: orders / account / settings / index
 *  وفي صفحات إنشاء الطلب (PUBG, mirage, ...):
 *  <script src="orders-store.js"></script>
 */
(function () {
  'use strict';
  if (window.HyperOrders) return;

  var DAYS = 28, MS = DAYS * 24 * 3600 * 1000;
  var PREFIX = 'hyper_orders:';       // hyper_orders:<email>
  var META = 'hyper_orders_meta';     // { email: وقت تسجيل الخروج }
  var LAST = 'hyper_orders_last';     // آخر حساب كان مسجّلاً دخول (لاكتشاف الخروج)
  var LEGACY = 'hyper_user_orders';   // المفتاح القديم المشترك
  var GUEST = '_guest';

  var ls = null, S = window.Storage && Storage.prototype;
  try { ls = window.localStorage; ls.getItem('__t'); } catch (e) { ls = null; }
  var rawGet = S && S.getItem, rawSet = S && S.setItem, rawRem = S && S.removeItem;

  function g(k) { try { return ls ? rawGet.call(ls, k) : null; } catch (e) { return null; } }
  function s(k, v) { try { if (ls) rawSet.call(ls, k, v); } catch (e) {} }
  function r(k) { try { if (ls) rawRem.call(ls, k); } catch (e) {} }
  function json(k, d) { try { var v = JSON.parse(g(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }

  function user() {
    var u = json('hyper_user', null);
    return u && u.email ? { email: String(u.email).toLowerCase().trim(), name: u.name || '' } : null;
  }
  function list(email) { var a = json(PREFIX + email, []); return Array.isArray(a) ? a : []; }
  function save(email, arr) { s(PREFIX + email, JSON.stringify(Array.isArray(arr) ? arr : [])); }
  function idOf(o) { return String(o && o.orderID != null ? o.orderID : '').replace('#', '').trim(); }
  function merge(a, b) {
    var pos = {}, out = [];
    a.concat(b).forEach(function (o) {
      var id = idOf(o);
      if (!id) { out.push(o); return; }
      if (pos[id] === undefined) { pos[id] = out.length; out.push(o); }
      else out[pos[id]] = Object.assign({}, out[pos[id]], o);
    });
    return out;
  }
  function meta() { var m = json(META, {}); return m && typeof m === 'object' && !Array.isArray(m) ? m : {}; }
  function saveMeta(m) { s(META, JSON.stringify(m)); }

  /* ---------- الاحتفاظ 28 يوماً من لحظة الخروج ---------- */
  function purge(current) {
    if (!ls) return;
    var m = meta(), now = Date.now(), changed = false, keys = [];
    try { for (var i = 0; i < ls.length; i++) { var k = ls.key(i); if (k && k.indexOf(PREFIX) === 0) keys.push(k); } } catch (e) {}
    keys.forEach(function (k) {
      var email = k.slice(PREFIX.length);
      if (email === current) return;
      if (!m[email]) { m[email] = now; changed = true; return; }          // لا يوجد وقت خروج مسجّل: ابدأ العدّ الآن
      if (now - m[email] > MS) { r(k); delete m[email]; changed = true; }  // انتهت المدة
    });
    Object.keys(m).forEach(function (e) {
      if (e !== current && g(PREFIX + e) === null) { delete m[e]; changed = true; }
    });
    if (changed) saveMeta(m);
  }

  /* ---------- الواجهة ---------- */
  var API = {
    days: DAYS,
    user: user,
    read: function () { var u = user(); return list(u ? u.email : GUEST); },
    write: function (arr) { var u = user(); save(u ? u.email : GUEST, arr); },
    add: function (order) { API.write(merge(API.read(), [order])); },
    touch: function () {},   // للتوافق فقط، لم يعد مطلوباً
    purge: function () { var u = user(); purge(u ? u.email : null); }
  };
  window.HyperOrders = API;

  /* ---------- تهيئة: اكتشاف الخروج + العدّاد + ضم القديم + الحذف التلقائي ---------- */
  (function init() {
    var u = user(), m = meta(), now = Date.now(), prev = g(LAST);

    // 1) لو كان فيه حساب مسجّل قبل كده وهو دلوقتي مش الحساب الحالي => خرج: ابدأ عدّاد الـ28 يوم له
    if (prev && (!u || u.email !== prev)) { m[prev] = now; saveMeta(m); }
    if (!u) { if (prev) r(LAST); }

    if (u) {
      // 2) رجع لحسابه: لو العدّاد عدّى 28 يوم يبدأ من الصفر، وإلا يوقف العدّاد ويرجع سجله
      if (m[u.email]) {
        if (now - m[u.email] > MS) r(PREFIX + u.email);
        delete m[u.email]; saveMeta(m);
      }
      // 3) ضم المفتاح القديم وسجل الضيف
      var legacy = json(LEGACY, null);
      if (g(LEGACY) !== null) {
        if (Array.isArray(legacy) && legacy.length) save(u.email, merge(list(u.email), legacy));
        r(LEGACY);
      }
      var guest = list(GUEST);
      if (guest.length) { save(u.email, merge(list(u.email), guest)); r(PREFIX + GUEST); }
      s(LAST, u.email);
    }
    purge(u ? u.email : null);
  })();

  /* ---------- توافق مع الصفحات القديمة التي تكتب hyper_user_orders ---------- */
  if (ls && S && rawGet && rawSet && rawRem) {
    S.getItem = function (k) {
      if (this === ls && k === LEGACY) return JSON.stringify(API.read());
      return rawGet.apply(this, arguments);
    };
    S.setItem = function (k, v) {
      if (this === ls && k === LEGACY) { try { API.write(JSON.parse(v)); } catch (e) {} return; }
      return rawSet.apply(this, arguments);
    };
    S.removeItem = function (k) {
      if (this === ls && k === LEGACY) { API.write([]); return; }
      return rawRem.apply(this, arguments);
    };
  }
})();
