/* ===== CE-16 · Pas PRO (rejestr: ce-rejestr.js) =============================
   The fluid.glass „showroom” scene (stage E, 18.10.2026; research u5 §3): the
   band is 200svh tall and its layers are pinned for 100svh (CSS). This loop
   writes one linear progress value per band, `--pro-p` 0 -> 1, from the top of
   the band at the top of the window to its bottom at the bottom of the window;
   CE-16-pas-pro.css derives the frame scale, the scrim, the slide of the two
   text columns and the growth of the rule from it. One getBoundingClientRect
   per band per frame; the value is written only when it changes. Without
   CX5.motionOn() the property is removed and the band stands static (CSS).
   One script for every variant (it replaced CE-16-pas-pro-pozny-wzrost.js).
   No [data-pro] -> no-op. ===================================================== */
(function () {
  "use strict";
  if (!window.CX5) return;
  var bands = CX5.$$("[data-pro]");
  if (!bands.length) return;
  var vh = window.innerHeight;
  var last = bands.map(function () { return -1; });

  function update() {
    var on = CX5.motionOn();
    for (var i = 0; i < bands.length; i++) {
      var el = bands[i];
      if (!on) {
        if (last[i] !== -1) { el.style.removeProperty("--pro-p"); last[i] = -1; }
        continue;
      }
      var r = el.getBoundingClientRect();
      var run = r.height - vh;
      var p = run > 0 ? CX5.clamp(-r.top / run, 0, 1) : (r.top <= 0 ? 1 : 0);
      p = Math.round(p * 1000) / 1000;
      if (p !== last[i]) { el.style.setProperty("--pro-p", p); last[i] = p; }
    }
  }

  CX5.register({
    scroll: update,
    resize: function () { vh = window.innerHeight; update(); }
  });
})();
