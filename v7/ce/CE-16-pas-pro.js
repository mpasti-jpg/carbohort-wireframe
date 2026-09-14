/* ===== CE-16 · Pas PRO (rejestr: ce-rejestr.js) =============================
   Delayed start (spec §14.6): the media holds .5 while the top edge of the band
   is above 75 % of the window height, then grows to 1 by the time that edge is
   10 % from the top – ease-out cubic (§13.8: start from half size). The loop
   reads only the band rectangle and writes one custom property; without
   CX5.motionOn() the property is removed and the frame stands still (CSS).
   Merged from carbohumic.js 80; carbomat.js and carbomat-humic.js carried the
   same `updatePro` inside a bigger module, carbomat-mata.js and produkty.js as
   a module of their own. No [data-pro] -> no-op. ========================= */
(function () {
  "use strict";
  var pro = CX5.$("[data-pro]");
  if (!pro) return;

  function updatePro() {
    if (!CX5.motionOn()) { pro.style.removeProperty("--pro-s"); return; }
    var h = window.innerHeight;
    var r = pro.getBoundingClientRect();
    var p = CX5.clamp((0.75 * h - r.top) / (0.65 * h), 0, 1);
    var e = 1 - Math.pow(1 - p, 3);
    pro.style.setProperty("--pro-s", (0.5 + 0.5 * e).toFixed(4));
  }

  CX5.register({ scroll: updatePro, resize: updatePro });
})();

