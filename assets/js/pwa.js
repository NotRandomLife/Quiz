(function () {
  "use strict";
  const button = document.querySelector("[data-install-app]");
  let deferredPrompt = null;
  const installed = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const hideInstall = () => {
    if (button) button.hidden = true;
    deferredPrompt = null;
  };

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("/service-worker.js").catch(() => {}));
  }
  if (!button || installed()) {
    hideInstall();
    return;
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    button.hidden = false;
  });
  window.addEventListener("appinstalled", hideInstall);

  button.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    button.disabled = true;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    hideInstall();
  });
}());
