/* ===== CE-10 · Parametry na wideo (rejestr: ce-rejestr.js) ==================
   Two jobs: keep the background loop from running with reduced motion, and –
   where the page has them – switch the parameter sets on tabs. Merged from
   carbomat-mata.js 30, which already carried both (the copies in carbomat.js,
   carbohumic.js and carbomat-humic.js are the video half of it, byte for byte).
   The section frame, the pinned media layer and the crop are pure CSS.
   No [data-params] -> no-op; no tabs -> only the video half runs. ======== */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$;
  var sec = $("[data-params]");
  if (!sec) return;

  /* --- wideo tła ---------------------------------------------------------- */
  var video = $("video.c5-params__media", sec);
  if (video) {
    /* Reduced motion: the loop must not run – drop autoplay, stop on frame 0 so
       the poster stays. Re-checked when the preference changes mid-session. */
    var syncVideo = function () {
      if (CX5.reducedMQ.matches) {
        video.removeAttribute("autoplay");
        video.pause();
        try { video.currentTime = 0; } catch (e) { /* metadata not ready yet */ }
      } else if (video.paused) {
        var played = video.play();
        if (played && played.catch) played.catch(function () { /* autoplay blocked – poster stays */ });
      }
    };
    syncVideo();
    if (CX5.reducedMQ.addEventListener) CX5.reducedMQ.addEventListener("change", syncVideo);
    video.addEventListener("loadedmetadata", syncVideo);
  }

  /* --- taby zestawów parametrów ------------------------------------------- */
  var tabs = $$("[data-ptab]", sec);
  var panels = $$("[data-ptab-panel]", sec);
  if (!tabs.length || !panels.length) return;

  function select(key, focus) {
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-ptab") === key;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.setAttribute("tabindex", on ? "0" : "-1");
      t.classList.toggle("is-on", on);
      if (on && focus) t.focus();
    });
    panels.forEach(function (p) {
      p.classList.toggle("is-on", p.getAttribute("data-ptab-panel") === key);
    });
  }

  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(t.getAttribute("data-ptab"), false); });
    t.addEventListener("keydown", function (e) {
      var step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1
               : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
      var next = e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : null;
      if (!step && next === null) return;
      e.preventDefault();
      if (next === null) next = (i + step + tabs.length) % tabs.length;
      select(tabs[next].getAttribute("data-ptab"), true);
    });
  });

  /* start state comes from the markup (first tab is aria-selected) */
  var start = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
  select(start.getAttribute("data-ptab"), false);
})();

