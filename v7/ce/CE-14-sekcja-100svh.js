/* ===== CE-14 · Sekcja 100svh z listą i zdjęciem (rejestr: ce-rejestr.js) ====
   Light parallax of the photo: the image is 14 % taller than the frame that
   crops it, so it can move without uncovering an edge. `--dose-par` runs from
   -6 to 0 (per cent of the image height) while the section crosses the screen –
   the image travels slower than the page. The loop reads only the frame
   rectangle and writes one custom property.
   Merged from carbomat.js 70; the CARBOHUMIC copy was the same code.
   No [data-dose-media] -> no-op. ========================================= */
(function () {
  "use strict";
  var wrap = CX5.$("[data-dose-media]");
  if (!wrap) return;

  function update() {
    if (!CX5.motionOn()) { wrap.style.removeProperty("--dose-par"); return; }
    var h = window.innerHeight;
    var r = wrap.getBoundingClientRect();
    var span = h + r.height;
    var p = span > 0 ? CX5.clamp((h - r.top) / span, 0, 1) : 0;
    wrap.style.setProperty("--dose-par", CX5.lerp(-6, 0, p).toFixed(3));
  }
  CX5.register({ scroll: update, resize: update });
})();

