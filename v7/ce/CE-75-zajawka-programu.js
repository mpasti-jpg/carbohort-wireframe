/* ===== CE-75 · Zajawka programu z osią kamieni (rejestr: ce-rejestr.js) ==================================
   Prefix: c5-pg. Module of the shared layer.
   One IIFE, a no-op when its markup is absent.

   The only job here is the parallax of the frame: --c5-pg-par runs from -6 to
   0 (per cent of the photo layer height) while the frame travels through the
   window, and the property is removed when the bus reports no motion, so the
   crop stands still. Everything else the block does is CSS: the pulse of the
   „na żywo” marker and of the „jesteśmy tutaj” node, the drawing of the dark
   half of the axis on `is-in`, and the cascade of the nodes through the shared
   reveal – all of them stop at prefers-reduced-motion and none of them needs a
   script to look finished.

   The bus CX5 (ce/00-base.js) starts itself: this file never calls CX5.start()
   and never defines CX5. Comments in English, never the em dash, and never the
   literal end-of-script tag. ============================================= */
(function () {
  "use strict";
  var figs = CX5.$$("[data-pg-fig]");
  if (!figs.length) return;

  function parallax() {
    var on = CX5.motionOn(), h = window.innerHeight;
    figs.forEach(function (f) {
      if (!on) { f.style.removeProperty("--c5-pg-par"); return; }
      var r = f.getBoundingClientRect();
      var span = h + r.height;
      var p = span > 0 ? CX5.clamp((h - r.top) / span, 0, 1) : 0;
      f.style.setProperty("--c5-pg-par", CX5.lerp(-6, 0, p).toFixed(3));
    });
  }

  CX5.register({ scroll: parallax, resize: parallax });
})();
