/* ===== CE-08 · Hero – the background film (rejestr: ce-rejestr.js) ===========
   Variant `kadr-w-tle` may carry a film instead of the photo (test on
   v7/kukurydza.html since 08.11.2026): `video.c5-hero__bgimg.c5-hero__bgvid`
   with autoplay, muted, playsinline and a poster (its first frame), inside
   `.c5-hero__bg[aria-hidden]`. The layout is pure CSS – the film takes the
   place of the photo through the same rules.
   Two kinds of film:
   - with `loop` – a background loop;
   - without `loop` (09.11.2026, Kukurydza) – played ONCE: it stops on its last
     frame, and a still of that frame (`img.c5-hero__bgend`, a sibling in the
     same `.c5-hero__bg`) fades in over it when the film ends – `is-ended` on
     `.c5-hero__bg`. Back in view, an ended film stays ended.
   This script only decides whether the film runs:
   - reduced motion: the film does not run – a film played once shows its last
     frame at once (`is-ended`), a loop stops on frame 0 (the poster stays);
     re-checked when the preference changes mid-session;
   - Save-Data: the film does not start (the same fallback);
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
    var bg = v.closest(".c5-hero__bg") || v.parentNode;
    var once = !v.loop;
    var endStill = once ? bg.querySelector(".c5-hero__bgend") : null;
    var inView = true, ended = false;
    function finish() {
      ended = true;
      bg.classList.add("is-ended");
    }
    function still() {
      /* Chrome may still start a pending autoplay after the attribute is gone, so the
         element is reloaded without it – and without loading the file (Save-Data) */
      if (v.hasAttribute("autoplay")) {
        v.removeAttribute("autoplay");
        v.preload = "none";
        try { v.load(); } catch (e) { /* nothing to reload */ }
      }
      v.pause();
      if (once && endStill) { finish(); return; }
      try { v.currentTime = 0; } catch (e) { /* metadata not ready yet */ }
    }
    function sync() {
      if (reduced.matches || saveData) { still(); return; }
      if (ended) return;
      if (!inView) { v.pause(); return; }
      if (v.paused && !v.ended) {
        var p = v.play();
        if (p && p.catch) p.catch(function () { /* autoplay blocked – the poster stays */ });
      }
    }
    if (once) v.addEventListener("ended", finish);
    v.addEventListener("play", function () { if (reduced.matches || saveData) v.pause(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[entries.length - 1].isIntersecting;
        sync();
      }, { threshold: 0 }).observe(bg);
    }
    if (reduced.addEventListener) reduced.addEventListener("change", sync);
    else if (reduced.addListener) reduced.addListener(sync);
    v.addEventListener("loadedmetadata", sync);
    sync();
  });
})();
