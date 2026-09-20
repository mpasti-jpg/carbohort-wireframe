/* ===== CE-11 · Warianty na tabach – próba „karty w taby" =====================
   LINKED BY carbomat.html ONLY. The base module ce/CE-11-warianty-taby.js also
   runs on carbohumic.html, so the new state machine lives here and the base
   file stays untouched (spec §17.5).

   One box, two states, driven by scrolling only (Figma 310:461 -> 310:418):

     p = 0      the bar rests with its bottom edge 20 px above the window
                bottom; every box is 0 px tall – nothing to see yet
     p -> .22   the grey outline draws itself from the middle of the BOTTOM
                edge, two ends at once, around the (still short) box
     p -> .45   the box grows upwards to the full card height, its bottom edge
                staying glued to the window bottom
     p .40-.55  the mode label, the packshot and the product name fade in –
                „jak odpowiednio są duże i jest już miejsce" (the annotation, verbatim)
     p .62-.78  the packshot and the name go away again
     p .62-1    the box shrinks 426 -> 70 px while the sticky offset runs from
                „window bottom" to 0, so the bar lands on the top edge
     p = 1      the bar is an ordinary sticky top:0 tab bar; from here the green
                outline of the ACTIVE tab shows how far the reader has scrolled
                through the matching variant block

   p comes from the runway ([data-ways-rail]) that sits in front of the bar:
   p = (stickTop - railBottom) / stickTop, so p = 0 exactly when the bar reaches
   its bottom-aligned resting offset and p = 1 exactly when its flow position
   reaches the top of the window. Because the sticky offset is interpolated with
   the same p, the element is pinned through the whole timeline and the handover
   to the plain sticky state has no jump in it.

   Nothing here is hard-wired to two tabs: every loop runs over whatever
   [data-tab] buttons the page carries, so CARBOHUMIC can link the same module
   with three.

   The tabs only NAVIGATE – the variant blocks lie one under another and all of
   them stay readable. Keyboard: ArrowLeft/ArrowRight come from the kit (cw.js),
   this module adds ArrowUp/ArrowDown/Home/End and keeps the roving tabindex in
   sync with the scrollspy.

   Without JS, with prefers-reduced-motion and below 900 px the module writes no
   variables at all and clears the ones it wrote, so CSS falls back to the plain
   static layout. No [data-tabs] -> no-op. ================================== */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;

  var bar = $("[data-tabs]");
  if (!bar) return;
  var wrap = bar.closest("[data-variants]") || bar.parentNode;
  var rail = $("[data-ways-rail]", wrap);
  var tabBtns = $$("[data-tab]", bar);
  var blocks = $$("[data-variant-block]", wrap);
  if (!tabBtns.length) return;

  /* thresholds of the timeline – the one place the choreography numbers live */
  var P = { EDGE: 0.22, GROW: 0.45, IN0: 0.40, IN1: 0.55,
            OUT0: 0.62, OUT1: 0.78, MORPH0: 0.62, MORPH1: 1,
            PANEL0: 0.58, PANEL1: 0.80 };
  var PAD = 6;            /* padding-block of the bar (CSS) */
  var RADIUS = 10;
  var bottomGap = 20;     /* --c5-bottom-gap: how far the cards stay above the window edge */
  /* „how far the reader has scrolled through this section": measured on the
     block of the active variant by default, [data-progress="sekcja"] switches
     it to the whole container */
  var perSection = wrap.getAttribute("data-progress") === "sekcja";

  var motion = false, tabH = 70, barBoxH = 82, cardH = 426, stickTop = 1;
  var VARS = ["--c5-box-h", "--c5-m", "--c5-ways-top", "--c5-head-in",
              "--c5-card-in", "--c5-panel-in", "--c5-card-h"];

  function remap(v, a, b) { return clamp((v - a) / (b - a), 0, 1); }

  /* --- The outline as two halves of a path ----------------------------------
     Both halves start at the same point and run the opposite way, which is what
     makes an outline „growing with two ends at once". pathLength="1" sits in the
     markup, so stroke-dasharray works on a share and not on pixels. The 0.5 px
     inset puts the 1 px stroke exactly on the edge of the box – the way the
     image 52 export has it. */
  function halves(w, h, fromLeftEdge) {
    var x0 = 0.5, y0 = 0.5, x1 = w - 0.5, y1 = h - 0.5;
    var r = Math.max(0, Math.min(RADIUS, (x1 - x0) / 2, (y1 - y0) / 2));
    var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    var a = "A" + r + " " + r + " 0 0 ";
    if (fromLeftEdge) {
      /* green progress: from the middle of the left edge to the middle of the right, over the top and along the bottom */
      return [
        "M" + x0 + " " + cy + "L" + x0 + " " + (y0 + r) + a + "1 " + (x0 + r) + " " + y0 +
          "L" + (x1 - r) + " " + y0 + a + "1 " + x1 + " " + (y0 + r) + "L" + x1 + " " + cy,
        "M" + x0 + " " + cy + "L" + x0 + " " + (y1 - r) + a + "0 " + (x0 + r) + " " + y1 +
          "L" + (x1 - r) + " " + y1 + a + "0 " + x1 + " " + (y1 - r) + "L" + x1 + " " + cy
      ];
    }
    /* grey outline: from the middle of the bottom edge to the middle of the top, up the left side and up the right */
    return [
      "M" + cx + " " + y1 + "L" + (x0 + r) + " " + y1 + a + "0 " + x0 + " " + (y1 - r) +
        "L" + x0 + " " + (y0 + r) + a + "0 " + (x0 + r) + " " + y0 + "L" + cx + " " + y0,
      "M" + cx + " " + y1 + "L" + (x1 - r) + " " + y1 + a + "1 " + x1 + " " + (y1 - r) +
        "L" + x1 + " " + (y0 + r) + a + "1 " + (x1 - r) + " " + y0 + "L" + cx + " " + y0
    ];
  }

  /* one drawing per tab; rewritten only when the box has changed size */
  var rings = tabBtns.map(function (btn) {
    return { svg: $(".c5-way__svg", btn), edge: $$("[data-edge]", btn),
             prog: $$("[data-prog]", btn), w: 0, h: 0 };
  });

  function paint(h) {
    rings.forEach(function (ring, i) {
      if (!ring.svg) return;
      var w = tabBtns[i].getBoundingClientRect().width;
      if (Math.abs(w - ring.w) < 0.5 && Math.abs(h - ring.h) < 0.5) return;
      ring.w = w; ring.h = h;
      ring.svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      var e = halves(w, h, false), g = halves(w, h, true);
      ring.edge.forEach(function (p, k) { p.setAttribute("d", e[k]); });
      ring.prog.forEach(function (p, k) { p.setAttribute("d", g[k]); });
    });
  }

  function clearVars() {
    VARS.forEach(function (n) { wrap.style.removeProperty(n); });
    tabBtns.forEach(function (b) {
      b.style.removeProperty("--c5-edge-p");
      b.style.removeProperty("--c5-prog-p");
    });
    bar.classList.remove("is-out");
    rings.forEach(function (r) { r.w = 0; r.h = 0; });
  }

  function measure() {
    var on = CX5.motionOn();
    if (on !== motion) {
      motion = on;
      wrap.setAttribute("data-ce11", on ? "ruch" : "stop");
      if (!on) clearVars();
    }
    if (!motion) return;
    var cs = getComputedStyle(wrap);
    tabH = parseFloat(cs.getPropertyValue("--c5-tab-h")) || 70;
    bottomGap = parseFloat(cs.getPropertyValue("--c5-bottom-gap"));
    if (isNaN(bottomGap)) bottomGap = 20;
    barBoxH = tabH + 2 * PAD;
    /* a card never covers the section heading: on a low window it shrinks */
    cardH = Math.max(220, Math.min(426, window.innerHeight - 240));
    /* resting offset: the bottom edge of the boxes --c5-bottom-gap above the window edge */
    stickTop = Math.max(1, window.innerHeight - (tabH + PAD) - bottomGap);
    wrap.style.setProperty("--c5-card-h", cardH + "px");
  }

  /* --- The bar hides as soon as the next section shows up from below -------- */
  var ownSec = bar.closest("section");
  var nextSec = ownSec ? ownSec.nextElementSibling : null;
  while (nextSec && nextSec.tagName !== "SECTION") nextSec = nextSec.nextElementSibling;

  /* --- Scrollspy and the green progress outline ----------------------------- */
  function updateTabs(p, line) {
    if (!blocks.length) return;
    var current = blocks[0].getAttribute("data-variant-block"), progress = 0;
    var wrapRect = wrap.getBoundingClientRect();
    blocks.forEach(function (b) {
      var r = b.getBoundingClientRect();
      if (r.top <= line) {
        current = b.getAttribute("data-variant-block");
        progress = r.height ? clamp((line - r.top) / r.height, 0, 1) : 0;
      }
    });
    if (perSection) {
      progress = wrapRect.height ? clamp((line - wrapRect.top) / wrapRect.height, 0, 1) : 0;
    }
    /* the green outline belongs to the tab, not to the card – it lights up only
       once the box starts to shrink (frame A does not carry it) */
    if (motion && p < P.MORPH0) progress = 0;
    tabBtns.forEach(function (b) {
      var on = b.getAttribute("data-tab") === current;
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;               /* roving tabindex zgodny ze scrollspy */
      if (motion) b.style.setProperty("--c5-prog-p", on ? progress.toFixed(4) : "0");
    });
  }

  /* --- Klatka osi czasu ------------------------------------------------------ */
  function update() {
    if (!motion) { updateTabs(1, bar.getBoundingClientRect().bottom + 24); return; }
    if (nextSec) {
      bar.classList.toggle("is-out", nextSec.getBoundingClientRect().top < window.innerHeight);
    }
    var railBottom = rail ? rail.getBoundingClientRect().bottom : stickTop;
    var p = clamp((stickTop - railBottom) / stickTop, 0, 1);
    var m = remap(p, P.MORPH0, P.MORPH1);
    var grow = remap(p, 0, P.GROW);
    var boxH = p < P.MORPH0 ? cardH * grow : cardH + (tabH - cardH) * m;
    var headIn = remap(p, P.IN0, P.IN1);
    /* The scrollspy line is ALWAYS the final one, just under the pinned bar. Read
       off the current edge of the flying bar, the progress would first grow and
       then fall back – the bar travels upwards faster than the block scrolls
       under it. */
    updateTabs(p, barBoxH + 24);

    wrap.style.setProperty("--c5-m", m.toFixed(4));
    wrap.style.setProperty("--c5-box-h", boxH.toFixed(2) + "px");
    wrap.style.setProperty("--c5-ways-top", Math.round(stickTop * (1 - m)) + "px");
    wrap.style.setProperty("--c5-head-in", headIn.toFixed(3));
    wrap.style.setProperty("--c5-card-in",
      Math.min(headIn, 1 - remap(p, P.OUT0, P.OUT1)).toFixed(3));
    wrap.style.setProperty("--c5-panel-in", remap(p, P.PANEL0, P.PANEL1).toFixed(3));

    var edge = remap(p, 0, P.EDGE).toFixed(4);
    tabBtns.forEach(function (b) { b.style.setProperty("--c5-edge-p", edge); });
    paint(boxH);
  }

  /* --- Klik i klawiatura ----------------------------------------------------- */
  function goTo(btn) {
    var block = doc.getElementById(btn.getAttribute("aria-controls"));
    if (!block) return;
    var offset = barBoxH + 16;
    CX5.scrollTo(Math.round(block.getBoundingClientRect().top + window.scrollY - offset),
                 CX5.reducedMQ.matches ? "auto" : "smooth");
  }
  tabBtns.forEach(function (btn, i) {
    btn.addEventListener("click", function () { goTo(btn); });
    /* ArrowLeft/ArrowRight come from the kit (cw.js) – only the rest is here */
    btn.addEventListener("keydown", function (e) {
      var n = tabBtns.length, to = -1;
      if (e.key === "ArrowDown") to = (i + 1) % n;
      else if (e.key === "ArrowUp") to = (i - 1 + n) % n;
      else if (e.key === "Home") to = 0;
      else if (e.key === "End") to = n - 1;
      if (to < 0) return;
      e.preventDefault();
      tabBtns[to].focus();
      tabBtns[to].click();
    });
  });

  CX5.register({ resize: measure, scroll: update });
})();
