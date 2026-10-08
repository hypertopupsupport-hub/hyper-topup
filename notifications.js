import {
  initializeApp,
  getApps,
  getApp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
  getMessaging,
  getToken,
  onMessage,
  isSupported
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js";


// =====================================================
// إعداد Firebase
// =====================================================

const firebaseConfig = {

  apiKey:
    "AIzaSyAQnlfsncuDN2iK3VV_rEQvg4GIisWr7oc",

  authDomain:
    "hyper-topup-59844.firebaseapp.com",

  projectId:
    "hyper-topup-59844",

  storageBucket:
    "hyper-topup-59844.firebasestorage.app",

  messagingSenderId:
    "683467344388",

  appId:
    "1:683467344388:web:5b32652c913051d4790351"

};


// =====================================================
// VAPID KEY
// =====================================================

// حط مفتاح VAPID بتاعك بين علامتي التنصيص
const VAPID_KEY =
  "BCvU-lK8_PEV0u77sBoRjO7WCU_2cgKjoTvcVhmgfQ3HoPQ-dHsBf8-BhCeFZv8uWprAMxhvKRx05TaTIO8Buvs";


// =====================================================
// Firebase App
// =====================================================

const app =
  getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);


const auth =
  getAuth(app);


const db =
  getFirestore(app);


let messaging = null;

let currentUserUid = null;

let unsubscribeNotifications = null;


// =====================================================
// تشغيل نظام الإشعارات
// =====================================================

async function startNotificationSystem(user) {

  if (!user) {
    return;
  }


  currentUserUid =
    user.uid;


  createNotificationUI();

  listenForNotifications(
    user.uid
  );


  try {

    const supported =
      await isSupported();


    if (!supported) {

      console.log(
        "هذا المتصفح لا يدعم Firebase Cloud Messaging."
      );

      return;

    }


    messaging =
      getMessaging(app);


    onMessage(
      messaging,
      function(payload) {

        console.log(
          "إشعار أثناء فتح الموقع:",
          payload
        );

        showInSiteToast(
          payload.notification?.title ||
          "HYPER TOPUP",

          payload.notification?.body ||
          "لديك تحديث جديد."
        );

      }
    );


  } catch (error) {

    console.error(
      "خطأ في تشغيل FCM:",
      error
    );

  }

}


// =====================================================
// جلب الإشعارات من Firestore
// =====================================================

function listenForNotifications(userUid) {

  const notificationsRef =
    collection(
      db,
      "users",
      userUid,
      "notifications"
    );


  const notificationsQuery =
    query(
      notificationsRef,
      orderBy(
        "createdAt",
        "desc"
      ),
      limit(30)
    );


  unsubscribeNotifications =
    onSnapshot(
      notificationsQuery,
      function(snapshot) {

        const list =
          document.getElementById(
            "notifications-list"
          );


        const badge =
          document.getElementById(
            "notification-badge"
          );


        if (!list || !badge) {
          return;
        }


        list.innerHTML = "";


        let unreadCount = 0;


        if (snapshot.empty) {

          list.innerHTML = `
            <div class="notifications-empty">
              <div class="notifications-empty-icon">🔔</div>
              <div>لا توجد إشعارات حالياً</div>
            </div>
          `;

          badge.style.display =
            "none";

          return;

        }


        snapshot.forEach(
          function(notificationDoc) {

            const data =
              notificationDoc.data();


            if (!data.read) {
              unreadCount++;
            }


            const item =
              createNotificationItem(
                notificationDoc.id,
                data
              );


            list.appendChild(item);

          }
        );


        if (unreadCount > 0) {

          badge.textContent =
            unreadCount > 99
              ? "99+"
              : unreadCount;


          badge.style.display =
            "flex";

        } else {

          badge.style.display =
            "none";

        }

      },

      function(error) {

        console.error(
          "خطأ في جلب الإشعارات:",
          error
        );

      }
    );

}


// =====================================================
// إنشاء إشعار داخل القائمة
// =====================================================

function createNotificationItem(
  notificationId,
  data
) {

  const item =
    document.createElement(
      "div"
    );


  item.className =
    "notification-item " +
    (
      data.read
        ? "notification-read"
        : "notification-unread"
    );


  const title =
    document.createElement(
      "div"
    );

  title.className =
    "notification-title";


  title.textContent =
    data.title ||
    "تحديث جديد";


  const body =
    document.createElement(
      "div"
    );

  body.className =
    "notification-body";


  body.textContent =
    data.body ||
    "";


  const time =
    document.createElement(
      "div"
    );

  time.className =
    "notification-time";


  if (
    data.createdAt &&
    typeof data.createdAt.toDate ===
      "function"
  ) {

    time.textContent =
      data.createdAt
        .toDate()
        .toLocaleString(
          "ar-EG",
          {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
          }
        );

  }


  item.appendChild(title);

  item.appendChild(body);

  item.appendChild(time);


  item.addEventListener(
    "click",
    async function() {

      if (!data.read) {

        try {

          await updateDoc(
            doc(
              db,
              "users",
              currentUserUid,
              "notifications",
              notificationId
            ),
            {
              read: true
            }
          );

        } catch (error) {

          console.error(
            "تعذر تحديد الإشعار كمقروء:",
            error
          );

        }

      }

    }
  );


  return item;

}


// =====================================================
// تفعيل Push Notifications
// =====================================================

async function enablePushNotifications() {

  if (!currentUserUid) {

    alert(
      "يجب تسجيل الدخول أولاً لتفعيل الإشعارات."
    );

    return;

  }


  try {

    const permission =
      await Notification.requestPermission();


    if (permission !== "granted") {

      alert(
        "لم يتم السماح بالإشعارات. يمكنك تفعيلها من إعدادات المتصفح."
      );

      return;

    }


    if (!messaging) {

      const supported =
        await isSupported();


      if (!supported) {

        alert(
          "متصفحك لا يدعم الإشعارات الفورية."
        );

        return;

      }


      messaging =
        getMessaging(app);

    }


    const registration =
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );


    const token =
      await getToken(
        messaging,
        {
          vapidKey:
            VAPID_KEY,

          serviceWorkerRegistration:
            registration
        }
      );


    if (!token) {

      alert(
        "لم نتمكن من الحصول على رمز الجهاز."
      );

      return;

    }


    const tokenRef =
      doc(
        db,
        "users",
        currentUserUid,
        "tokens",
        token
      );


    await setDoc(
      tokenRef,
      {
        deviceType:
          "web",

        updatedAt:
          serverTimestamp()
      },
      {
        merge: true
      }
    );


    const button =
      document.getElementById(
        "enable-push-button"
      );


    if (button) {

      button.textContent =
        "الإشعارات مفعّلة ✓";

      button.disabled =
        true;

    }


    alert(
      "تم تفعيل إشعارات HYPER TOPUP بنجاح 🔔"
    );


  } catch (error) {

    console.error(
      "خطأ في تفعيل الإشعارات:",
      error
    );


    alert(
      "حدث خطأ أثناء تفعيل الإشعارات. افتح وحدة التحكم لمعرفة التفاصيل."
    );

  }

}


// =====================================================
// إنشاء واجهة الجرس
// =====================================================

function createNotificationUI() {

  if (
    document.getElementById(
      "hyper-notification-container"
    )
  ) {

    return;

  }


  const container =
    document.createElement(
      "div"
    );


  container.id =
    "hyper-notification-container";


  container.innerHTML = `

    <button
      id="notification-bell"
      class="notification-bell"
      aria-label="الإشعارات"
      type="button"
    >

      🔔

      <span
        id="notification-badge"
        class="notification-badge"
        style="display:none"
      >
        0
      </span>

    </button>


    <div
      id="notification-panel"
      class="notification-panel"
      style="display:none"
    >

      <div class="notification-header">

        <strong>
          الإشعارات
        </strong>

        <button
          id="enable-push-button"
          type="button"
        >
          تفعيل الإشعارات
        </button>

      </div>


      <div
        id="notifications-list"
        class="notifications-list"
      >

        <div class="notifications-empty">
          🔔
        </div>

      </div>

    </div>

  `;


  document.body.appendChild(
    container
  );


  const bell =
    document.getElementById(
      "notification-bell"
    );


  const panel =
    document.getElementById(
      "notification-panel"
    );


  bell.addEventListener(
    "click",
    function(event) {

      event.stopPropagation();


      panel.style.display =
        panel.style.display === "none"
          ? "block"
          : "none";

    }
  );


  document
    .getElementById(
      "enable-push-button"
    )
    .addEventListener(
      "click",
      enablePushNotifications
    );


  panel.addEventListener(
    "click",
    function(event) {

      event.stopPropagation();

    }
  );


  document.addEventListener(
    "click",
    function() {

      panel.style.display =
        "none";

    }
  );

}


// =====================================================
// Toast للإشعارات أثناء فتح الموقع
// =====================================================

function showInSiteToast(
  title,
  body
) {

  let toast =
    document.getElementById(
      "hyper-notification-toast"
    );


  if (!toast) {

    toast =
      document.createElement(
        "div"
      );

    toast.id =
      "hyper-notification-toast";

    document.body.appendChild(
      toast
    );

  }


  toast.innerHTML = `
    <strong></strong>
    <span></span>
  `;


  toast.querySelector(
    "strong"
  ).textContent =
    title;


  toast.querySelector(
    "span"
  ).textContent =
    body;


  toast.classList.add(
    "show"
  );


  setTimeout(
    function() {

      toast.classList.remove(
        "show"
      );

    },
    5000
  );

}


// =====================================================
// بدء النظام عند تسجيل الدخول
// =====================================================

onAuthStateChanged(
  auth,
  function(user) {

    if (user) {

      startNotificationSystem(
        user
      );

    }

  }
);