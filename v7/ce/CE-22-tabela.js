/* ===== CE-22 · Tabela – variant „z-packshotami": light parallax of the frame photos =====
   (19.10.2026, owner: photos in the background with a slight parallax, in the left and the
   right box alike.) The photo of every `.c5pr-cmp__frame` is enlarged by 10 % in the CSS
   (`.c5pr-cmp[data-par]`) and slides vertically against the scroll by at most 4 % of the
   frame height (inside the 5 % overscan, so no edge ever shows). The script only writes
   `--c5pr-par` (px) on frames that are on screen, once per animation frame; the loupe image
   inside the panel reads `--c5pr-par-in`, a faster run in the same direction (20.10.2026,
   owner: „efekt dwóch planów”).
   Reduced motion or no IntersectionObserver: `data-par` is never set, the photos stand still.
   ====================================================================================== */
(function () {
  "use strict";
  var roots = CX5.$$(".c5pr-cmp");
  if (!roots.length || !window.IntersectionObserver || CX5.reducedMQ.matches) return;
  var frames = [];
  var visible = new Set();
  var ticking = false;
  var MAX = 0.04;                                   /* share of the frame height */

  roots.forEach(function (r) {
    CX5.$$(".c5pr-cmp__frame", r).forEach(function (f) {
      if (f.querySelector(".c5pr-cmp__bg")) frames.push(f);
    });
    if (r.querySelector(".c5pr-cmp__bg")) r.setAttribute("data-par", "");
  });
  if (!frames.length) return;

  function update() {
    ticking = false;
    var vh = window.innerHeight || 1;
    visible.forEach(function (f) {
      var r = f.getBoundingClientRect();
      /* -1 when the frame centre is a half window + half frame below the window centre, +1 above */
      var p = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2);
      p = Math.max(-1, Math.min(1, p));
      f.style.setProperty("--c5pr-par", (-p * MAX * r.height).toFixed(1) + "px");
      /* the loupe image as the second plane: same direction, faster (see CE-22-tabela.css) */
      f.style.setProperty("--c5pr-par-in", (-p * MAX * (CX5.wideMQ.matches ? 2.5 : 1.5) * r.height).toFixed(1) + "px");
    });
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target);
    });
    request();
  }, { rootMargin: "20% 0px 20% 0px" });
  frames.forEach(function (f) { io.observe(f); });
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  CX5.reducedMQ.addEventListener && CX5.reducedMQ.addEventListener("change", function () {
    if (!CX5.reducedMQ.matches) return;
    roots.forEach(function (r) { r.removeAttribute("data-par"); });
    frames.forEach(function (f) { f.style.removeProperty("--c5pr-par"); f.style.removeProperty("--c5pr-par-in"); });
  });
})();
