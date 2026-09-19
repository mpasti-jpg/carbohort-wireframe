/* ===== CE-66 · Tablica warunków (rejestr: ce-rejestr.js) ===================
   Rebuilt on 19.09 to Mateusz's frame (Figma „Frame 218”, spec §14.5). The
   eight conditions are a vertical tab set: a list of rows (tablist with
   automatic activation and a roving tabindex), Up/Down/Home/End with wrap, and
   a swipe across the strip on a phone. The odometer, the prev/next buttons,
   the pause button and the auto-advance clock of iteration 9 are gone – the
   frame has none of them, so neither has this module.

   Two things are worth knowing:

   1. Below 900 px the list is a scrolled row of chips. The active chip is
      brought into view with `scrollLeft` on the list itself, never with
      `scrollIntoView`, which would also scroll the PAGE to the block.

   2. A swipe that ends on a product box must not open its pop-up, so the
      pointer handler raises a flag and a capture-phase click listener on the
      strip eats exactly one click.

   Layout and the leaving/entering transitions live in the CSS; this module
   only sets state classes and attributes. No [data-cb] -> no-op.
   ========================================================================= */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$;
  var root = $("[data-cb]");
  if (!root) return;
  var tabs = $$("[data-cb-tab]", root);
  var panels = $$("[data-cb-panel]", root);
  if (tabs.length < 2 || tabs.length !== panels.length) return;

  var list = $("[data-cb-list]", root);
  var det = $("[data-cb-det]", root);
  if (!det) return;

  var n = tabs.length;
  var at = -1;        /* active condition, 0-based */
  var outTimer = null;

  /* one source of truth for the fade-out length: the CSS custom property */
  function ms(name, fallback) {
    var v = window.getComputedStyle(root).getPropertyValue(name).trim();
    var f = parseFloat(v);
    if (!f) return fallback;
    return /ms\s*$/.test(v) ? f : f * 1000;
  }
  var OUT = ms("--c5-cb-out", 120);

  /* --- lista na telefonie: aktywny kafel dosuwany przez scrollLeft --------- */
  function reveal(tab) {
    if (!list) return;
    var max = list.scrollWidth - list.clientWidth;
    if (max <= 1) return;                       /* desktop column: nothing to scroll */
    var lr = list.getBoundingClientRect(), tr = tab.getBoundingClientRect();
    var left = CX5.clamp(Math.round(list.scrollLeft + (tr.left - lr.left) - (lr.width - tr.width) / 2), 0, max);
    if (Math.abs(left - list.scrollLeft) < 1) return;
    if (CX5.reducedMQ.matches || !list.scrollTo) list.scrollLeft = left;
    else list.scrollTo({ left: left, behavior: "smooth" });
  }

  /* --- przełączanie ------------------------------------------------------- */
  function show(i, moveFocus) {
    if (i === at) return;
    var gone = at > -1 ? panels[at] : null;
    at = i;

    tabs.forEach(function (t, j) {
      var on = j === i;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (p, j) {
      var on = j === i;
      p.classList.toggle("is-on", on);
      if (on) { p.removeAttribute("aria-hidden"); p.tabIndex = 0; p.inert = false; }
      else { p.setAttribute("aria-hidden", "true"); p.removeAttribute("tabindex"); p.inert = true; }
    });

    /* the leaving panel keeps its box (visibility, not display) for one short
       fade, so the shared tracks never change and nothing jumps */
    if (outTimer) { window.clearTimeout(outTimer); outTimer = null; }
    panels.forEach(function (p) { p.classList.remove("is-out"); });
    if (gone && !CX5.reducedMQ.matches) {
      gone.classList.add("is-out");
      outTimer = window.setTimeout(function () { gone.classList.remove("is-out"); outTimer = null; }, OUT);
    }

    root.setAttribute("data-cb-at", i + 1);
    reveal(tabs[i]);
    if (moveFocus) tabs[i].focus();
  }
  function step(dir, moveFocus) { show((at + dir + n) % n, moveFocus); }

  /* --- zdarzenia ---------------------------------------------------------- */
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { show(i, false); });
    tab.addEventListener("keydown", function (e) {
      var to = null;
      /* the list is vertical from 900 px and horizontal below it, so both axes
         move through the conditions; Home/End jump to the ends */
      if (e.key === "ArrowDown" || e.key === "ArrowRight") to = (i + 1) % n;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") to = (i - 1 + n) % n;
      else if (e.key === "Home") to = 0;
      else if (e.key === "End") to = n - 1;
      if (to === null) return;
      e.preventDefault();
      show(to, true);
    });
  });

  /* --- przesunięcie palcem po pasie pól (próg 40 px) ----------------------- */
  var downX = 0, downY = 0, tracking = false, swiped = false;
  det.addEventListener("pointerdown", function (e) {
    if (e.button !== 0) return;
    tracking = true; swiped = false; downX = e.clientX; downY = e.clientY;
  });
  window.addEventListener("pointermove", function (e) {
    if (!tracking) return;
    var dx = e.clientX - downX, dy = e.clientY - downY;
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
    tracking = false; swiped = true;
    step(dx < 0 ? 1 : -1, false);
  });
  window.addEventListener("pointerup", function () { tracking = false; });
  /* a swipe that ends on a product box must not open its pop-up */
  det.addEventListener("click", function (e) {
    if (!swiped) return;
    swiped = false;
    e.preventDefault();
    e.stopPropagation();
  }, true);

  show(0, false);
})();
