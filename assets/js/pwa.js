(function () {
  "use strict";
  const button = document.querySelector("[data-install-app]");
  const installStorageKey = "quizmania-pwa-installed";
  let deferredPrompt = null;
  const installed = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const installWasAccepted = () => {
    try {
      return window.localStorage.getItem(installStorageKey) === "true";
    } catch (_) {
      return false;
    }
  };
  const hideInstall = () => {
    if (button) button.hidden = true;
    deferredPrompt = null;
  };
  const rememberInstalled = () => {
    try {
      window.localStorage.setItem(installStorageKey, "true");
    } catch (_) {}
    hideInstall();
  };

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("/service-worker.js").catch(() => {}));
  }
  if (!button || installed() || installWasAccepted()) {
    hideInstall();
    return;
  }

  if ("getInstalledRelatedApps" in navigator) {
    navigator.getInstalledRelatedApps()
      .then((apps) => {
        if (apps.length) rememberInstalled();
      })
      .catch(() => {});
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    button.hidden = false;
  });
  window.addEventListener("appinstalled", rememberInstalled);

  button.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    button.disabled = true;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      rememberInstalled();
      return;
    }
    deferredPrompt = null;
    button.disabled = false;
  });
}());
