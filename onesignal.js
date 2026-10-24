window.OneSignalDeferred = window.OneSignalDeferred || [];

(function () {
  const script = document.createElement("script");

  script.src =
    "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
  script.defer = true;

  script.onload = function () {
    window.OneSignalDeferred.push(async function (OneSignal) {
      await OneSignal.init({
        appId: "40310a7e-3310-4edb-add6-a493a2b696b1",

        serviceWorkerPath:
          "push/onesignal/OneSignalSDKWorker.js",

        serviceWorkerParam: {
          scope: "/push/onesignal/"
        },

        notifyButton: {
          enable: false
        }
      });
    });
  };

  document.head.appendChild(script);
})();
