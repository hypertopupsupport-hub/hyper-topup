importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAQnlfsncuDN2iK3VV_rEQvg4GIisWr7oc",
  authDomain: "hyper-topup-59844.firebaseapp.com",
  projectId: "hyper-topup-59844",
  storageBucket: "hyper-topup-59844.firebasestorage.app",
  messagingSenderId: "683467344388",
  appId: "1:683467344388:web:5b32652c913051d4790351"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {

  console.log(
    "[firebase-messaging-sw.js] Background message:",
    payload
  );

  const notificationTitle =
    payload.notification?.title ||
    "HYPER TOPUP";

  
const notificationOptions = {
  body: payload.notification?.body || "لديك تحديث جديد لطلبك.",
  icon: "/icon-512.png",
  badge: "/notification-badge.png",
  image: "/icon-512.png",
  data: payload.data || {},
  dir: "rtl",
  lang: "ar"
};


  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );

});


self.addEventListener(
  "notificationclick",
  function(event) {

    event.notification.close();

    const targetUrl =
      "https://hypertopup.online/account.html";


    event.waitUntil(

      clients.matchAll({
        type: "window",
        includeUncontrolled: true
      })

      .then(function(clientList) {

        for (
          const client of clientList
        ) {

          if (
            client.url.includes(
              "hypertopup.online"
            ) &&
            "focus" in client
          ) {

            return client.focus();

          }

        }


        if (
          clients.openWindow
        ) {

          return clients.openWindow(
            targetUrl
          );

        }

      })

    );

  }
);