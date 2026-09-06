(function () {
  "use strict";
  const button = document.querySelector("[data-install-app]");
  const hint = document.querySelector("[data-install-hint]");
  const installStorageKey = "quizmania-pwa-installed";
  const standaloneMedia = window.matchMedia("(display-mode: standalone)");
  const openedFromAppIcon = new URLSearchParams(window.location.search).get("source") === "pwa";
  let deferredPrompt = null;
  const installed = () => standaloneMedia.matches || window.navigator.standalone === true || openedFromAppIcon;
  const installWasAccepted = () => {
    try {
      return window.localStorage.getItem(installStorageKey) === "true";
    } catch (_) {
      return false;
    }
  };
  const hideInstall = () => {
    if (button) button.hidden = true;
    if (hint) hint.hidden = true;
    deferredPrompt = null;
  };
  const showInstallHelp = () => {
    if (!hint) return;
    const appleMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    hint.textContent = appleMobile
      ? "Per installare da Safari: tocca Condividi e scegli “Aggiungi a Home”."
      : "Il browser non ha aperto il prompt di installazione. Usa il menu del browser e scegli “Installa app”; se l’opzione non compare, apri QuizMania.it in Chrome, Edge o Safari.";
    hint.hidden = false;
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
  if (!button) return;
  if (installed()) {
    rememberInstalled();
    return;
  }
  if (installWasAccepted()) {
    hideInstall();
    return;
  }

  if (standaloneMedia.addEventListener) {
    standaloneMedia.addEventListener("change", (event) => {
      if (event.matches) rememberInstalled();
    });
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
    if (!deferredPrompt) {
      showInstallHelp();
      return;
    }
    button.disabled = true;
    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        rememberInstalled();
        return;
      }
      deferredPrompt = null;
      button.disabled = false;
      showInstallHelp();
    } catch (_) {
      deferredPrompt = null;
      button.disabled = false;
      showInstallHelp();
    }
  });
}());
