/* ===== CE-12 · Scena faktów – TRIAL VERSION (Figma Frame 206, 18.09.2026) ====
   Trial rebuild of the CE-12 scene, linked ONLY by produkty.html and only until
   Mateusz accepts one of the two header variants (spec §21.3). The shared
   ce/CE-12-scena-faktow.js is left untouched, so every other page of the pattern
   keeps today's scene.

   The track is tall (sticky stage + one step per fact), the stage inside it is
   sticky and spans the whole window. Position on the axis = scroll position: the
   scroll pass reads ONLY the track rectangle and writes the result into two
   custom properties, one class and the data-on attributes.
     · --fx-f  = progress of the CURRENT slide (0 -> 1, back to 0 on every change)
                 and it drives the fill of the 1 px line of the fact on screen.
   Every fact carries its own line and counter (static text in the markup), so the
   block simply stands at the bottom of the column and nothing has to be measured.
   Below 900 px, with reduced motion and without JS the section is static –
   everything visible (CSS) – and the header block with the lead (variant B) is
   the one on screen.
   The review pill switches the two header variants, re-measures the track and
   keeps the reader in the same place of the scene.
   No [data-fx] -> no-op. ================================================== */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var scenes = $$("[data-fx]");
  if (!scenes.length) return;

  /* „4" is step 4, „2-4" is steps 2 to 4 – one photo behind three descriptions */
  function rangeFrom(spec) { var d = spec.indexOf("-"); return d < 0 ? +spec : +spec.slice(0, d); }
  function rangeTo(spec) { var d = spec.indexOf("-"); return d < 0 ? +spec : +spec.slice(d + 1); }
  function inRange(spec, n) { return n >= rangeFrom(spec) && n <= rangeTo(spec); }

  scenes.forEach(function (sec) {
    var track = $("[data-fx-track]", sec);
    var stage = $(".c5-fx__stage", sec);
    var facts = $$("[data-fx-fact]", sec);
    var vizs = $$("[data-fx-viz]", sec);
    var bgs = $$("[data-fx-bg]", sec);
    var heads = $$("[data-fx-head]", sec);
    var btns = $$("[data-review] [data-fx-var]", sec);
    if (!track || !stage || !facts.length) return;
    var STEPS = facts.length, stageH = 0, idx = -1;

    function cssNum(name, dflt) {
      var v = parseFloat(window.getComputedStyle(sec).getPropertyValue(name));
      return isNaN(v) ? dflt : v;
    }

    function show(i) {
      if (i === idx) return;
      idx = i;
      facts.forEach(function (f, n) { f.classList.toggle("is-on", n === i); });
      vizs.forEach(function (v) {
        v.setAttribute("data-on", inRange(v.getAttribute("data-fx-viz"), i + 1) ? "true" : "false");
      });
      /* the photo layer switches together with the description */
      bgs.forEach(function (b) {
        b.setAttribute("data-on", inRange(b.getAttribute("data-fx-bg"), i + 1) ? "true" : "false");
      });
    }

    /* Exactly one header block stands in the DOM at a time. In the scene it is the
       variant under review, everywhere else the one that carries the lead. */
    function applyHeads() {
      var want = CX5.motionOn() ? (sec.getAttribute("data-ce-wariant") || "z-naglowkiem") : "bez-naglowka";
      heads.forEach(function (h) { h.hidden = h.getAttribute("data-fx-head") !== want; });
      btns.forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-fx-var") === sec.getAttribute("data-ce-wariant") ? "true" : "false");
      });
    }

    function measure() {
      applyHeads();
      if (!CX5.motionOn()) {
        track.style.height = "";
        sec.style.removeProperty("--fx-f");
        stageH = 0;
        idx = -1;
        show(0);
        return;
      }
      /* the stage is the sticky 100svh box – the part of the track that stands
         still while the facts swap inside it */
      stageH = stage.offsetHeight;
      /* step = 80 % of the window height, never less than 480 px (values from CSS) */
      var step = Math.max(cssNum("--fx-step-min", 480),
                          Math.round(window.innerHeight * cssNum("--fx-step-vh", 0.8)));
      track.style.height = (stageH + step * STEPS) + "px";
    }

    function update() {
      if (!stageH) return;
      var r = track.getBoundingClientRect();
      var span = r.height - stageH;
      var p = span > 0 ? clamp(-r.top / span, 0, 1) : 0;
      var t = p * STEPS;
      var i = Math.min(STEPS - 1, Math.floor(t));
      sec.style.setProperty("--fx-f", clamp(t - i, 0, 1).toFixed(4));
      show(i);
    }

    /* an instant jump: through the inertia layer when it runs, else natively */
    function jumpTo(top) {
      top = Math.max(0, Math.round(top));
      if (CX5.lenis && CX5.lenis.scrollTo) { CX5.lenis.scrollTo(top, { immediate: true, force: true }); return; }
      window.scrollTo(0, top);
    }

    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var want = b.getAttribute("data-fx-var");
        if (!want || want === sec.getAttribute("data-ce-wariant")) return;
        /* the block above the track changes height, so hold the track where it is –
           otherwise the reader is thrown out of the scene */
        var before = track.getBoundingClientRect().top;
        sec.setAttribute("data-ce-wariant", want);
        measure();
        var after = track.getBoundingClientRect().top;
        if (Math.abs(after - before) > 0.5) jumpTo(window.scrollY + (after - before));
        update();
      });
    });

    CX5.register({ scroll: update, resize: measure });
  });
})();
