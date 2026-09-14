/* ===== CE-12 · Scena faktów (rejestr: ce-rejestr.js) ========================
   The track is tall (sticky stage + one step per fact), the stage inside it is
   sticky. Position on the axis = scroll position; the loop reads only the track
   rectangle and writes the result into one custom property, a class and the
   data-on attributes. Below 900 px, with reduced motion and without JS the
   section is static – everything visible (CSS).
   Merged from carbomat.js 50; carbohumic.js and carbomat-mata.js carried the
   same code, produkty.js the same with an English comment, and carbomat-humic
   .js added the two things generalised here:
     · a photo frame or an illustration box may cover a RANGE of steps
       (data-fact-bg="2-6"), and
     · the step length is read from CSS (--facts-step-min / --facts-step-vh),
       because a scene of eight steps needs a shorter step than one of five.
   No [data-facts] -> no-op. ============================================== */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var sec = $("[data-facts]");
  if (!sec) return;
  var track = $("[data-facts-track]", sec);
  var stage = $(".c5-facts-stage", sec);
  var facts = $$(".c5-fact", sec);
  var vizs = $$("[data-fact-viz]", sec);
  var bgs = $$("[data-fact-bg]", sec);
  var bar = $(".c5-facts-progress", sec);
  if (!track || !stage || !facts.length) return;
  var STEPS = facts.length;
  var stageH = 0, idx = -1;

  /* „4" is step 4, „2-6" is steps 2 to 6 – one photo behind five descriptions */
  function rangeFrom(spec) { var d = spec.indexOf("-"); return d < 0 ? +spec : +spec.slice(0, d); }
  function rangeTo(spec) { var d = spec.indexOf("-"); return d < 0 ? +spec : +spec.slice(d + 1); }
  function inRange(spec, n) { return n >= rangeFrom(spec) && n <= rangeTo(spec); }
  function cssNum(name, dflt) {
    var v = parseFloat(window.getComputedStyle(sec).getPropertyValue(name));
    return isNaN(v) ? dflt : v;
  }

  function show(i) {
    if (i === idx) return;
    idx = i;
    facts.forEach(function (f, n) { f.classList.toggle("is-on", n === i); });
    vizs.forEach(function (v) {
      v.setAttribute("data-on", inRange(v.getAttribute("data-fact-viz"), i + 1) ? "true" : "false");
    });
    /* warstwa tła panelu przełącza się razem z opisem */
    bgs.forEach(function (b) {
      b.setAttribute("data-on", inRange(b.getAttribute("data-fact-bg"), i + 1) ? "true" : "false");
    });
    if (bar) bar.setAttribute("aria-valuenow", String(i + 1));
  }
  function measure() {
    if (!CX5.motionOn()) {
      track.style.height = "";
      sec.style.removeProperty("--facts-p");
      stageH = 0;
      idx = -1;
      show(0);
      return;
    }
    /* the stage is the sticky 100svh box – the part of the track that stands
       still while the facts swap inside it */
    stageH = stage.offsetHeight;
    /* krok = 80 % wysokości okna, nie mniej niż 480 px (wartości z CSS) */
    var step = Math.max(cssNum("--facts-step-min", 480),
                        Math.round(window.innerHeight * cssNum("--facts-step-vh", 0.8)));
    track.style.height = (stageH + step * STEPS) + "px";
  }
  function update() {
    if (!stageH) return;
    var r = track.getBoundingClientRect();
    var span = r.height - stageH;
    var p = span > 0 ? clamp(-r.top / span, 0, 1) : 0;
    sec.style.setProperty("--facts-p", p.toFixed(4));
    show(Math.min(STEPS - 1, Math.floor(p * STEPS)));
  }
  CX5.register({ scroll: update, resize: measure });
})();
