const satellitesPreview = document.querySelector("[data-satellites-preview]");

if (satellitesPreview) {
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let isNearViewport = false;

  const updatePlayback = () => {
    if (motionPreference.matches || !isNearViewport) {
      satellitesPreview.pause();
      if (motionPreference.matches) {
        satellitesPreview.currentTime = 0;
        satellitesPreview.load();
      }
      return;
    }

    satellitesPreview.play().catch(() => {
      // The poster remains visible if the browser declines programmatic playback.
    });
  };

  const observer = new IntersectionObserver((entries) => {
    isNearViewport = entries.some((entry) => entry.isIntersecting);
    updatePlayback();
  }, { rootMargin: "160px 0px" });

  observer.observe(satellitesPreview);
  motionPreference.addEventListener("change", updatePlayback);
}
