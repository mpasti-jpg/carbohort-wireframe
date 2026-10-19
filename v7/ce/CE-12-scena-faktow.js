/* ===== CE-12 · Scena faktów (Figma Frame 206, 18.09.2026) ====
   The CE-12 scene after Frame 206. 19.09.2026: this module drives the CE-12
   scene of six pages of the pattern (the header variants of produkty.html are
   still under review, spec §21.3).

   The track is tall (sticky stage + one step per fact), the stage inside it is
   sticky and spans the whole window. Position on the axis = scroll position: the
   scroll pass reads ONLY the track rectangle and writes the result into two
   custom properties, one class and the data-on attributes.
     · --fx-f  = progress of the CURRENT slide (0 -> 1, back to 0 on every change)
                 (no rule of the module draws it since 19.10.2026 – the line is
                 one light line with no fill – it stays for a page that wants it).
     · --fx-fact-h = height of the tallest fact (resize pass), so the title row
                 stands in one place on every step;
     · --fx-par (on the panel) = parallax offset of the photo layers.
   The number badge of the incoming fact rolls from the old number (rollCount).
   Every fact carries its own line and number badge (static text in the markup), so
   the block simply stands at the bottom of the column and nothing has to be
   measured. The line of the markup is empty apart from one fill; the first time the
   scene runs this module cuts it into one segment per fact – a <button> each. In
   the line of fact i the segments before i are full, segment i is the current one
   (it reads --fx-f) and the rest are empty, so the states are set once, at build
   time, and the scroll pass does not touch them. A segment takes the reader to the
   start of its fact – from the keyboard or a screen reader only: since 20.10.2026
   the segments ignore the mouse (pointer-events:none in the CSS).
   Below 900 px, with reduced motion and without JS the section is static –
   everything visible (CSS) – and the header block with the lead (variant B) is
   the one on screen.
   A section with TWO header blocks shows one of them: the state is the attribute
   data-fx-state on the root ("z-naglowkiem" when absent). A [data-fx-var] button
   inside the section switches it, re-measures the track and keeps the reader in
   the same place of the scene. data-ce-wariant is a static marker of the CE
   index – this module neither reads nor writes it.
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
    var btns = $$("[data-fx-var]", sec);
    if (!track || !stage || !facts.length) return;
    var panel = $(".c5-fx__panel", sec);
    var STEPS = facts.length, stageH = 0, idx = -1, parMax = 28;
    var segs = null;   /* segs[i][k] – segment k in the line of fact i */
    /* the number badge of every fact and its number as shipped in the markup */
    var counts = facts.map(function (f) { return $(".c5-fx__count", f); });
    var nums = counts.map(function (c) { return c ? c.textContent.trim() : ""; });

    /* 19.10.2026: the number rolls like a counter. The badge of the incoming fact
       gets the old and the new number; CSS moves them (up when going forward,
       down when going back). Every other badge goes back to its plain number. */
    function rollCount(i, from) {
      counts.forEach(function (c, n) {
        if (!c || n === i) return;
        if (c.hasAttribute("data-fx-dir")) { c.removeAttribute("data-fx-dir"); c.textContent = nums[n]; }
      });
      var c = counts[i];
      if (!c) return;
      if (from < 0 || from === i || !CX5.motionOn() || !counts[from]) {
        c.removeAttribute("data-fx-dir");
        c.textContent = nums[i];
        return;
      }
      c.textContent = "";
      var o = document.createElement("span"), w = document.createElement("span");
      o.className = "c5-fx__digit c5-fx__digit--old";
      o.textContent = nums[from];
      w.className = "c5-fx__digit c5-fx__digit--new";
      w.textContent = nums[i];
      c.appendChild(o);
      c.appendChild(w);
      c.setAttribute("data-fx-dir", i > from ? "up" : "down");
    }

    function cssNum(name, dflt) {
      var v = parseFloat(window.getComputedStyle(sec).getPropertyValue(name));
      return isNaN(v) ? dflt : v;
    }

    function show(i) {
      if (i === idx) return;
      var from = idx;
      idx = i;
      rollCount(i, from);
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
       one named by data-fx-state, everywhere else the one that carries the lead.
       A section that ships a SINGLE header block has no alternative to switch to, so
       that block is simply the header of the section and stays visible in every
       layout – whatever the variant and whatever motionOn() says. Without this guard
       a lone "z-naglowkiem" block lost its kicker and H2 below 900 px and with
       reduced motion, where `want` is always "bez-naglowka" (guard added 19.09.2026;
       the `hidden` is cleared, not only left alone, so the markup may carry it). */
    function applyHeads() {
      var want = CX5.motionOn() ? (sec.getAttribute("data-fx-state") || "z-naglowkiem") : "bez-naglowka";
      if (heads.length === 1) heads[0].hidden = false;
      else heads.forEach(function (h) { h.hidden = h.getAttribute("data-fx-head") !== want; });
      btns.forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-fx-var") === (sec.getAttribute("data-fx-state") || "z-naglowkiem") ? "true" : "false");
      });
    }

    function titleOf(f) {
      var t = $(".c5-fx__title", f);
      return t ? t.textContent.replace(/\s+/g, " ").trim() : "";
    }

    /* Built once, on the first pass with the scene on: below 900 px, with reduced
       motion and without JS the line is hidden and its markup stays as shipped.
       The accessible names are Polish, as the pages are. */
    function buildSegs() {
      if (segs) return;
      segs = facts.map(function (f, i) {
        var line = $(".c5-fx__line", f), row = [];
        if (!line) return row;
        line.textContent = "";
        /* the markup hides the decorative line; with buttons inside it must not */
        line.removeAttribute("aria-hidden");
        line.setAttribute("role", "group");
        line.setAttribute("aria-label", "Opisy w tej sekcji");
        facts.forEach(function (g, k) {
          var b = document.createElement("button"), fill = document.createElement("span");
          b.type = "button";
          b.className = "c5-fx__seg" + (k < i ? " is-done" : k === i ? " is-now" : "");
          var name = titleOf(g);
          b.setAttribute("aria-label", "Opis " + (k + 1) + " z " + STEPS + (name ? ": " + name : ""));
          if (k === i) b.setAttribute("aria-current", "step");
          fill.className = "c5-fx__fill";
          b.appendChild(fill);
          b.addEventListener("click", function () { goTo(k, b); });
          line.appendChild(b);
          row.push(b);
        });
        return row;
      });
    }

    function measure() {
      applyHeads();
      if (CX5.motionOn()) buildSegs();
      if (!CX5.motionOn()) {
        track.style.height = "";
        sec.style.removeProperty("--fx-f");
        sec.style.removeProperty("--fx-fact-h");
        sec.style.removeProperty("--fx-row1-h");
        if (panel) panel.style.removeProperty("--fx-par");
        stageH = 0;
        idx = -1;
        show(0);
        return;
      }
      /* 19.10.2026: every fact as tall as the tallest one, so the title row, its
         line and the badge stand in one place on every step (the facts stand on
         the bottom inset and their rows start at the top, see the CSS) */
      sec.style.removeProperty("--fx-fact-h");
      sec.style.removeProperty("--fx-row1-h");
      /* first the title row (the tallest title of the scene – the badge hangs in
         the row and does not count, see the CSS), then the whole fact with that
         row in place: that is the reserve. 20.10.2026: the row is set only for
         this measure and taken back right after, so on screen the line and the
         description follow the title of their own step, while the title stands
         where the reserve puts it on every step. */
      var rowH = 0, factH = 0;
      facts.forEach(function (f) {
        var t = $(".c5-fx__title", f);
        rowH = Math.max(rowH, t ? t.getBoundingClientRect().height : 0);
      });
      if (rowH) sec.style.setProperty("--fx-row1-h", Math.ceil(rowH) + "px");
      facts.forEach(function (f) { factH = Math.max(factH, Math.ceil(f.getBoundingClientRect().height)); });
      sec.style.removeProperty("--fx-row1-h");
      if (factH) sec.style.setProperty("--fx-fact-h", factH + "px");
      parMax = cssNum("--c5-fx-par-max", 28);
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
      /* 19.10.2026: parallax of the photo over the whole pass of the track through
         the window – +max when its top enters at the bottom, -max when its bottom
         leaves at the top; it follows the scroll position, so no easing here */
      if (panel) {
        var vh = window.innerHeight, pass = clamp((vh - r.top) / (vh + r.height), 0, 1);
        panel.style.setProperty("--fx-par", ((0.5 - pass) * 2 * parMax).toFixed(2) + "px");
      }
    }

    /* an instant jump: through the inertia layer when it runs, else natively */
    function jumpTo(top) {
      top = Math.max(0, Math.round(top));
      if (CX5.lenis && CX5.lenis.scrollTo) { CX5.lenis.scrollTo(top, { immediate: true, force: true }); return; }
      window.scrollTo(0, top);
    }

    /* Fact k from its start: the scene lands 2 px into the step, so rounding of
       the scroll position can never leave it on the step before, and the fill of
       the segment starts from (nearly) zero. The jump is instant – a glide across
       several steps would flash every fact on the way. The fact that held the
       pressed segment goes off screen with it, so the focus moves to the same
       segment in the line of the fact that came in. */
    function goTo(k, from) {
      if (!stageH) return;
      var r = track.getBoundingClientRect();
      var span = r.height - stageH;
      if (span <= 0) return;
      var hadFocus = document.activeElement === from;
      jumpTo(Math.ceil(window.scrollY + r.top + span * k / STEPS) + 2);
      update();
      if (hadFocus && segs && segs[k] && segs[k][k]) segs[k][k].focus({ preventScroll: true });
    }

    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var want = b.getAttribute("data-fx-var");
        if (!want || want === (sec.getAttribute("data-fx-state") || "z-naglowkiem")) return;
        /* the block above the track changes height, so hold the track where it is –
           otherwise the reader is thrown out of the scene */
        var before = track.getBoundingClientRect().top;
        sec.setAttribute("data-fx-state", want);
        measure();
        var after = track.getBoundingClientRect().top;
        if (Math.abs(after - before) > 0.5) jumpTo(window.scrollY + (after - before));
        update();
      });
    });

    CX5.register({ scroll: update, resize: measure });
  });
})();
