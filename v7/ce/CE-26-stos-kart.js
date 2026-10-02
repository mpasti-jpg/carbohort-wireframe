/* ===== CE-26 · Stos kart (rejestr: ce-rejestr.js) ===========================
   The CSS half holds the layout; pinning itself is plain `position:sticky`.
   This script decides WHETHER the cards may be pinned and adds the finish:

     - it writes `--c5-stack-n` on the root and `--c5-stack-i` on every card, so
       the stops need no inline styles and no fixed number of cards;
     - on wide screens without reduced motion it switches the root to
       [data-c5-stack="on"], measures the tallest card and gives that height to
       all of them (`--c5-stack-eq`) – equal cards cover one another exactly;
     - if the tallest card does not fit between the lowest stop and the room
       kept for the advisor dock (`--c5-stack-dock`), the stack stays a plain
       list ([data-c5-stack="off"]): a card is never cut and never pinned with
       its end under the dock;
     - while the page scrolls it writes `--c5-stack-p` on every card (0 → 1: how
       far the next card covers it); CSS turns that into a slight step back.
       The value comes from the scroll position alone – no timed transitions;
     - focus that lands inside a covered card brings that card back on top.

   Geometry is read from the root's rectangle and from layout heights, never
   from the cards' own rectangles: the cards are scaled, so theirs would lie.
   Several stacks on one page work independently.
   Without JS, with prefers-reduced-motion and below 900 px nothing is pinned
   (the CSS half does not pin outside "on" either). No [data-c5-stack] -> no-op. */
(function () {
  "use strict";
  var $$ = CX5.$$, clamp = CX5.clamp;

  var stacks = $$("[data-c5-stack]").map(function (root) {
    var cards = $$(".c5-stack__card", root).filter(function (c) { return c.parentNode === root; });
    return { root: root, cards: cards, geo: null, p: [] };
  }).filter(function (s) { return s.cards.length > 0; });
  if (!stacks.length) return;

  stacks.forEach(function (s) {
    s.root.style.setProperty("--c5-stack-n", String(s.cards.length));
    s.cards.forEach(function (c, i) { c.style.setProperty("--c5-stack-i", String(i)); });
  });

  function release(s) {
    s.geo = null;
    s.root.setAttribute("data-c5-stack", "off");
    s.root.style.removeProperty("--c5-stack-eq");
    s.cards.forEach(function (c, i) { c.style.removeProperty("--c5-stack-p"); s.p[i] = -1; });
  }

  function measure(s) {
    if (!CX5.motionOn()) { release(s); return; }
    var root = s.root, cards = s.cards, n = cards.length;
    /* back to the heights the copy asks for, on the pinned layout */
    root.style.removeProperty("--c5-stack-eq");
    root.setAttribute("data-c5-stack", "on");
    var h = 0;
    cards.forEach(function (c) { h = Math.max(h, c.offsetHeight); });   /* layout height, transform-proof */
    var cs = window.getComputedStyle(root);
    var dock = parseFloat(cs.getPropertyValue("--c5-stack-dock")) || 0;
    var stops = cards.map(function (c) { return parseFloat(window.getComputedStyle(c).top) || 0; });
    /* the lowest card must end above the dock, or nothing is pinned at all
       (h = 0: the stack is not rendered, e.g. inside a closed container) */
    if (!h || stops[n - 1] + h > window.innerHeight - dock) { release(s); return; }
    root.style.setProperty("--c5-stack-eq", h + "px");
    s.geo = {
      h: h,
      pitch: h + (parseFloat(cs.rowGap) || 0),                          /* card to card in the flow */
      inset: root.clientTop + (parseFloat(cs.paddingTop) || 0),          /* root edge to the first card */
      stops: stops
    };
    for (var i = 0; i < n; i++) s.p[i] = -1;                             /* repaint with the new geometry */
  }

  function paint(s) {
    var g = s.geo;
    if (!g) return;
    var cards = s.cards, n = cards.length;
    var first = s.root.getBoundingClientRect().top + g.inset;            /* flow top of card 1 in the window */
    for (var i = 0; i < n; i++) {
      var p = 0;
      if (i < n - 1) {
        /* where both cards actually sit: the flow position until they stick */
        var mine = Math.max(first + i * g.pitch, g.stops[i]);
        var next = Math.max(first + (i + 1) * g.pitch, g.stops[i + 1]);
        /* full cover = the next card has reached its own stop, one step below ours */
        var span = g.stops[i] + g.h - g.stops[i + 1];
        if (span > 0) p = clamp((mine + g.h - next) / span, 0, 1);
      }
      p = Math.round(p * 1000) / 1000;
      if (p !== s.p[i]) { s.p[i] = p; cards[i].style.setProperty("--c5-stack-p", String(p)); }
    }
  }

  /* Keyboard: a link or a button inside a covered card must not take focus out
     of sight – scroll to the point where that card has just been pinned and
     the next one has not reached it yet. */
  stacks.forEach(function (s) {
    s.root.addEventListener("focusin", function (e) {
      var g = s.geo;
      if (!g || !e.target || !e.target.closest) return;
      var i = s.cards.indexOf(e.target.closest(".c5-stack__card"));
      if (i < 0 || !(s.p[i] > 0)) return;
      var first = s.root.getBoundingClientRect().top + window.scrollY + g.inset;
      CX5.scrollTo(first + i * g.pitch - g.stops[i], "auto");
    });
  });

  CX5.register({
    resize: function () { stacks.forEach(measure); },
    scroll: function () { stacks.forEach(paint); }
  });
})();
