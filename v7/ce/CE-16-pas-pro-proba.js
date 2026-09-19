/* ===== CE-16 · Pas PRO – trial build „pozny-wzrost" (spec §21.4, §21.8) =====
   Trial version of the CE-16 module, written on 18.09.2026 for produkty.html.
   Since 19.09.2026 FIVE pages link it – produkty, carbomat, carbomat-mata,
   carbohumic and carbomat-humic – while Mateusz decides whether it replaces the
   shared file. The shared ce/CE-16-pas-pro.js stays untouched and still serves the
   bands that do not take this pace: `zamykajacy` on kukurydza and `kontakt` on
   o-firmie. The `-proba` rename waits for the Próchnica+ session, together with
   the CE-12 one.

   What changes against the shared module: the frame no longer starts at a fixed
   .5 of its own and no longer moves from the first moment the band shows up. It
   HOLDS half the width of the band – half the screen, §21.8, round 2: measuring
   the start from the text container made the frame look like 30 % of a wide
   window – until the top edge of the band climbs above START of the window
   height, then grows to 1 and reaches the full width of the band when that edge
   is END from the top; ease-in-out cubic, so the frame leaves the hold gently
   and lands gently. The scrim rides the same progress: `--pro-o` goes 0 -> 1 and
   multiplies the constant .25 of the shared CSS, so the photo carries no
   darkening at all while it stands still. Layout without motion is unchanged.
   The loop reads only the band rectangle and writes two custom properties;
   without CX5.motionOn() both are removed and CSS takes over.
   No [data-pro] -> no-op. ================================================== */
(function () {
  "use strict";
  /* the three numbers of §21.4 / §21.8 – waiting for Mateusz to confirm them (§21.6.4) */
  var HOLD_W = 0.5;   /* held width of the frame = half the width of the band (= of the screen) */
  var START = 0.35;   /* growth starts when the top edge of the band passes 35 % of the window */
  var END = 0.02;     /* full width when that edge is 2 % from the top of the window */

  var pro = CX5.$("[data-pro]");
  if (!pro) return;

  function updatePro() {
    if (!CX5.motionOn()) {
      pro.style.removeProperty("--pro-s");
      pro.style.removeProperty("--pro-o");
      return;
    }
    var h = window.innerHeight;
    var top = pro.getBoundingClientRect().top;
    var p = CX5.clamp((START * h - top) / ((START - END) * h), 0, 1);
    var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    pro.style.setProperty("--pro-s", (HOLD_W + (1 - HOLD_W) * e).toFixed(4));
    pro.style.setProperty("--pro-o", e.toFixed(4));
  }

  CX5.register({ scroll: updatePro, resize: updatePro });
})();
