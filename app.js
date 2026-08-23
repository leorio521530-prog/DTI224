// ---- Register the service worker (enables offline + installability) ----
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}

// ---- Install button (PWA "Add to Home Screen" / install prompt) ----
let deferredInstallPrompt = null;
const installBtn = document.getElementById("install-btn");

function isRunningStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true // iOS Safari
  );
}

// If it's already installed/running as an app, no need to show the button.
if (installBtn && isRunningStandalone()) {
  installBtn.hidden = true;
}

// Chrome/Edge/Android fire this event when the app is installable.
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (installBtn) installBtn.hidden = false;
});

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    console.log("Install prompt outcome:", outcome);
    deferredInstallPrompt = null;
    installBtn.hidden = true;
  });
}

// Once installed, hide the button (covers browsers that fire this event).
window.addEventListener("appinstalled", () => {
  if (installBtn) installBtn.hidden = true;
  deferredInstallPrompt = null;
});
