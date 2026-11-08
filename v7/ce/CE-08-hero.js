/* ===== CE-08 · Hero – the background loop (rejestr: ce-rejestr.js) ==========
   Variant `kadr-w-tle` may carry a looping film instead of the photo (test on
   v7/kukurydza.html since 08.11.2026): `video.c5-hero__bgimg.c5-hero__bgvid`
   with autoplay, muted, loop, playsinline and a poster (the first frame of the
   loop), inside `.c5-hero__bg[aria-hidden]`. The layout is pure CSS – the film
   takes the place of the photo through the same rules.
   This script only decides whether the film runs:
   - reduced motion: no loop – autoplay dropped, stopped on frame 0, so the
     poster stays; re-checked when the preference changes mid-session;
   - Save-Data: the film does not start (the poster stays);
   - off screen: paused, resumed when the hero comes back into view.
   No `.c5-hero__bgvid` -> no-op. ======================================== */
(function () {
  "use strict";
  var vids = Array.prototype.slice.call(document.querySelectorAll("video.c5-hero__bgvid"));
  if (!vids.length) return;
  var reduced = window.CX5 && CX5.reducedMQ ? CX5.reducedMQ
    : (window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false });
  var conn = navigator.connection || {};
  var saveData = !!conn.saveData;

  vids.forEach(function (v) {
    var inView = true;
    function still() {
      v.removeAttribute("autoplay");
      v.pause();
      try { v.currentTime = 0; } catch (e) { /* metadata not ready yet */ }
    }
    function sync() {
      if (reduced.matches || saveData) { still(); return; }
      if (!inView) { v.pause(); return; }
      if (v.paused) {
        var p = v.play();
        if (p && p.catch) p.catch(function () { /* autoplay blocked – the poster stays */ });
      }
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[entries.length - 1].isIntersecting;
        sync();
      }, { threshold: 0 }).observe(v.closest(".c5-hero__bg") || v);
    }
    if (reduced.addEventListener) reduced.addEventListener("change", sync);
    else if (reduced.addListener) reduced.addListener(sync);
    v.addEventListener("loadedmetadata", sync);
    sync();
  });
})();
