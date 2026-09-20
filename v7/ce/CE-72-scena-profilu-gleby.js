/* ===== CE-72 · Scena profilu gleby (rejestr: ce-rejestr.js) ==================================
   Prefix: c5-sp. Module of the shared layer.
   One IIFE, a no-op when its markup is absent.

   Scroll position picks the step (cumulative classes is-s1…is-s6 on the scene
     root, every repair stays on for the following steps); a click in the index
     scrolls to its step. Tab walks the index and the links and leads out of
     the scene. Below 900 px, at reduced motion and without JS there is no pin:
     the index becomes a wrapping tablist of chips and the SVG shows the state
     of the chosen step (its final state without JS).

   One class on the root says which of the three layouts is running, so the
   stylesheet never has to guess: is-scene, is-tabs, is-flat. A repair lands a
   little way INTO its step (threshold --sp-in with hysteresis), so the reader
   first sees the problem and then watches it being fixed.

   Helper: ?sp=1…6 opens the page on that step (screenshots, CE index).

   The bus CX5 (ce/00-base.js) starts itself: this file never calls CX5.start()
   and never defines CX5. Comments in English, never the em dash, and never the
   literal end-of-script tag. ============================================= */
(function () {
  "use strict";
  if (!window.CX5) return;
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var sections = $$("[data-sp]");
  if (!sections.length) return;

  /* how far into a step the repair lands, and where it is taken back */
  var T_IN = 0.28, T_OUT = 0.18;

  sections.forEach(function (sec) {
    var track = $("[data-sp-track]", sec);
    var stage = $(".c5-sp__stage", sec);
    var col = $(".c5-sp__col", sec);
    var detail = $(".c5-sp__detail", sec);
    var list = $("[data-sp-index]", sec);
    var steps = $$("[data-sp-step]", sec);
    var btns = $$("[data-sp-go]", sec);
    if (!track || !stage || !steps.length) return;

    var STEPS = steps.length;          /* five problems plus the closing step */
    var stageH = 0, idx = -1, applied = -1, mode = "";

    steps.forEach(function (a, n) { a.id = a.id || "c5-sp-panel-" + (n + 1); });

    function cssNum(name, dflt) {
      var v = parseFloat(window.getComputedStyle(sec).getPropertyValue(name));
      return isNaN(v) ? dflt : v;
    }

    /* ----- state of the drawing ------------------------------------- */
    function setState(n) {
      if (n === applied) return;
      applied = n;
      for (var i = 1; i <= 6; i++) sec.classList.toggle("is-s" + i, i <= n);
    }

    /* the annotation lane shows the label of the CURRENT step, and only once
       its repair is on screen */
    function setTag(cur) {
      if (cur && cur === applied && cur <= 5) sec.setAttribute("data-sp-on", cur);
      else sec.removeAttribute("data-sp-on");
    }

    /* ----- which step is being read --------------------------------- */
    function showStep(i) {
      if (i === idx) return;
      idx = i;
      steps.forEach(function (a, n) { a.classList.toggle("is-on", n === i); });
      btns.forEach(function (b, n) {
        b.classList.toggle("is-on", n === i);
        if (mode === "tabs") {
          b.setAttribute("aria-selected", n === i ? "true" : "false");
          b.tabIndex = n === i ? 0 : -1;
        } else if (n === i) b.setAttribute("aria-current", "true");
        else b.removeAttribute("aria-current");
      });
      if (mode === "tabs") {
        steps.forEach(function (a, n) {
          if (n < STEPS - 1) a.hidden = n !== i;
        });
      }
    }

    /* ----- layouts ---------------------------------------------------- */
    function want() {
      if (CX5.reducedMQ.matches) return "flat";
      return CX5.wideMQ.matches ? "scene" : "tabs";
    }

    function setRoles(on) {
      if (!list) return;
      if (on) {
        list.setAttribute("role", "tablist");
        list.setAttribute("aria-orientation", "horizontal");
        $$(".c5-sp__ix", sec).forEach(function (li) { li.setAttribute("role", "presentation"); });
        btns.forEach(function (b, n) {
          b.setAttribute("role", "tab");
          b.setAttribute("aria-controls", steps[n].id);
          b.removeAttribute("aria-current");
        });
        steps.forEach(function (a, n) {
          if (n < STEPS - 1) a.setAttribute("role", "tabpanel");
        });
      } else {
        list.removeAttribute("role");
        list.removeAttribute("aria-orientation");
        $$(".c5-sp__ix", sec).forEach(function (li) { li.removeAttribute("role"); });
        btns.forEach(function (b) {
          b.removeAttribute("role");
          b.removeAttribute("aria-selected");
          b.removeAttribute("aria-controls");
          b.tabIndex = 0;
        });
        steps.forEach(function (a) { a.removeAttribute("role"); a.hidden = false; });
      }
    }

    function apply(m) {
      if (m === mode) return;
      mode = m;
      sec.classList.toggle("is-scene", m === "scene");
      sec.classList.toggle("is-tabs", m === "tabs");
      sec.classList.toggle("is-flat", m === "flat");
      setRoles(m === "tabs");
      idx = -1;
    }

    function layout() {
      apply(want());
      if (mode === "scene") {
        stageH = stage.offsetHeight;
        var step = Math.max(cssNum("--sp-step-min", 420),
                            Math.round(window.innerHeight * cssNum("--sp-step-vh", 0.7)));
        track.style.height = (stageH + step * STEPS) + "px";
        /* A window too low for the copy to keep its clearance from the advisor
           dock gets no pin at all: the chips layout is complete at any size.
           The padding-bottom of the column IS that clearance, so the test is
           whether the tallest step still ends inside the content box. */
        if (col && detail
            && detail.getBoundingClientRect().bottom
               > col.getBoundingClientRect().bottom - cssNum("--c5h-dock", 96) + 2) {
          apply("tabs");
        }
      }
      var m = mode;
      if (m === "scene") {
        update();
      } else {
        stageH = 0;
        track.style.height = "";
        sec.style.setProperty("--sp-f", "1");
        if (m === "flat") {
          /* everything on screen, the drawing finished */
          applied = -1;
          setState(6);
          setTag(0);
          sec.style.setProperty("--sp-p", "1");
          steps.forEach(function (a) { a.classList.add("is-on"); });
        } else {
          showStep(idx < 0 ? 0 : idx);
          setState(idx + 1);
          setTag(idx + 1);
          sec.style.setProperty("--sp-p", ((idx + 1) / STEPS).toFixed(4));
        }
      }
      sec.classList.add("is-ready");
    }

    /* ----- the scroll pass -------------------------------------------- */
    function update() {
      if (!stageH) return;
      var r = track.getBoundingClientRect();
      var span = r.height - stageH;
      var p = span > 0 ? clamp(-r.top / span, 0, 1) : 0;
      var t = p * STEPS;
      var i = Math.min(STEPS - 1, Math.floor(t));
      var f = clamp(t - i, 0, 1);
      sec.style.setProperty("--sp-f", f.toFixed(4));
      sec.style.setProperty("--sp-p", p.toFixed(4));
      showStep(i);
      setState(i + (f >= (applied === i + 1 ? T_OUT : T_IN) ? 1 : 0));
      setTag(i + 1);
    }

    /* ----- moving to a step ------------------------------------------- */
    function pick(k) {
      showStep(clamp(k - 1, 0, STEPS - 1));
      setState(idx + 1);
      setTag(idx + 1);
      sec.style.setProperty("--sp-p", ((idx + 1) / STEPS).toFixed(4));
    }

    function goTo(k, instant) {
      if (mode !== "scene") { pick(k); return; }
      var r = track.getBoundingClientRect();
      var top = r.top + window.scrollY;
      var span = r.height - stageH;
      var p = (clamp(k, 1, STEPS) - 1 + 0.5) / STEPS;
      CX5.scrollTo(top + p * span, instant ? "auto" : "smooth");
    }

    btns.forEach(function (b, n) {
      b.addEventListener("click", function () { goTo(n + 1, false); });
      b.addEventListener("keydown", function (e) {
        if (mode !== "tabs") return;
        var to = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") to = (n + 1) % btns.length;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") to = (n - 1 + btns.length) % btns.length;
        else if (e.key === "Home") to = 0;
        else if (e.key === "End") to = btns.length - 1;
        if (to < 0) return;
        e.preventDefault();
        pick(to + 1);
        btns[to].focus();
      });
    });

    /* ----- loops stop when the scene is off screen --------------------- */
    if (window.IntersectionObserver) {
      new window.IntersectionObserver(function (entries) {
        entries.forEach(function (en) { sec.classList.toggle("is-off", !en.isIntersecting); });
      }, { rootMargin: "120px" }).observe(sec);
    }

    CX5.register({ scroll: update, resize: layout });
    layout();

    /* ----- ?sp=1…6 ----------------------------------------------------- */
    var askRe = /(?:^|[?&])sp=([1-6])/.exec(window.location.search);
    if (askRe) {
      var k = +askRe[1];
      var jump = function () { layout(); goTo(k, true); CX5.requestScroll(); };
      if (document.readyState === "complete") jump();
      else window.addEventListener("load", jump);
    }
  });
})();
