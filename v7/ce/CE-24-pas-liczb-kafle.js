/* ===== CE-24 · Pas liczb – wariant „kafle-2x2": digit reel =====================
   (rejestr: ce-rejestr.js). The markup carries a plain number in an element
   marked `data-c5-odo` („168”, „+33,3”, „−1119,4”); this script builds the reel
   only at the moment the number first shows on screen, so without JS, with
   reduced motion and below 900 px the final value simply stands there.

   Every DIGIT becomes a window with a strip of values: the target at the
   bottom, a full turn 0–9 above it. The strip starts pushed up by its whole
   length – a 0 stands in the window – and the animation brings it back to
   zero, which reads as digits rolling from top to bottom. Everything that is
   not a digit (sign, comma, space) becomes a still cell, so decimals and
   signed values keep their shape. The digits start 90 ms apart; one run takes
   1.1 s (curve in the CSS half).
   The value stays readable for screen readers (`wf-sr-only`), the strips are
   aria-hidden. A value without a single digit is left untouched.
   No [data-c5-odo] -> no-op. =================================================== */
(function () {
  "use strict";
  var doc = document;
  var els = CX5.$$("[data-c5-odo]");
  var IO = window.IntersectionObserver;
  if (!els.length || !IO) return;
  var armed = false;

  function build(el) {
    var value = (el.textContent || "").replace(/^\s+|\s+$/g, "");
    if (!/[0-9]/.test(value)) return null;
    var sr = doc.createElement("span");
    sr.className = "wf-sr-only";
    sr.textContent = value;
    var wrap = doc.createElement("span");
    wrap.className = "c5-nums__odo-wrap";
    wrap.setAttribute("aria-hidden", "true");
    var strips = [];
    for (var i = 0; i < value.length; i++) {
      var ch = value.charAt(i);
      if (ch < "0" || ch > "9") {
        var still = doc.createElement("span");
        still.className = "c5-nums__odo-s";
        still.textContent = ch;
        wrap.appendChild(still);
        continue;
      }
      var target = +ch;
      var cell = doc.createElement("span");
      cell.className = "c5-nums__odo-d";
      var strip = doc.createElement("span");
      strip.className = "c5-nums__odo-strip";
      var len = target + 11;                 /* the run up to the target plus one full turn */
      for (var k = 0; k < len; k++) {
        var unit = doc.createElement("span");
        unit.textContent = String((target - k + 100) % 10);
        strip.appendChild(unit);
      }
      strip.style.setProperty("--c5-nums-i", String(len - 1));   /* a 0 stands in the window */
      cell.appendChild(strip);
      wrap.appendChild(cell);
      strips.push(strip);
    }
    el.textContent = "";
    el.appendChild(sr);
    el.appendChild(wrap);
    return strips;
  }

  function roll(el) {
    var strips = build(el);
    if (!strips) return;
    /* forced reflow: without it the start position of the strips is never
       computed and the browser has nothing to animate from */
    void el.offsetHeight;
    el.classList.add("is-roll");
    strips.forEach(function (strip, i) {
      strip.style.setProperty("--c5-nums-delay", (i * 90) + "ms");
      strip.style.setProperty("--c5-nums-i", "0");
    });
  }

  function arm() {
    if (armed || !CX5.motionOn()) return;
    armed = true;
    var io = new IO(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        roll(e.target);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  CX5.register({ resize: arm });
})();
