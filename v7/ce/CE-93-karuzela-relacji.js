/* ===== CE-93 · Karuzela relacji filmowych (rejestr: ce-rejestr.js) ===========
   The row of cards scrolls natively (CSS: overflow + scroll snap); this script
   only drives the two arrows of the heading row.
     · The arrows are `hidden` in the markup and shown here, so without JS
       nothing dead stands on the page.
     · A click moves the row by one card – smoothly, at once with reduced
       motion. Clicks made while the row is still moving add up.
     · At either end of the row the matching arrow is `disabled`; when every
       card fits the view, both are. The state follows the scroll position and
       is recomputed on resize (CX5 bus).
     · If the arrow that holds the focus goes disabled, the focus moves to the
       other arrow, so a keyboard user is never left on a dead control.
   Nothing here listens to `wheel` and the carousel never moves by itself.
   No [data-relc] -> no-op. =================================================== */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var roots = $$("[data-relc]");
  if (!roots.length) return;

  roots.forEach(function (root) {
    var view = $("[data-relc-view]", root);
    var nav = $(".c5-relc__nav", root);
    var prev = $("[data-relc-prev]", root);
    var next = $("[data-relc-next]", root);
    if (!view || !nav || !prev || !next) return;
    var cards = $$(".c5-relc__card", view);
    /* `goal` = where the last click is taking the row; null when it rests */
    var goal = null, goalTimer = 0, ticking = false;

    function max() { return Math.max(0, view.scrollWidth - view.clientWidth); }
    /* distance from one card to the next = card width plus the gap */
    function step() {
      if (cards.length > 1) return cards[1].offsetLeft - cards[0].offsetLeft;
      return view.clientWidth;
    }

    function sync() {
      ticking = false;
      var m = max();
      var x = goal === null ? view.scrollLeft : goal;
      var atStart = x <= 1, atEnd = x >= m - 1;
      var active = document.activeElement;
      prev.disabled = atStart;
      next.disabled = atEnd;
      if (active === prev && atStart && !atEnd) next.focus();
      else if (active === next && atEnd && !atStart) prev.focus();
    }

    function go(dir) {
      var s = step();
      if (s <= 0) return;
      var from = goal === null ? view.scrollLeft : goal;
      var to = clamp((Math.round(from / s) + dir) * s, 0, max());
      goal = to;
      window.clearTimeout(goalTimer);
      goalTimer = window.setTimeout(function () { goal = null; sync(); }, 800);
      view.scrollTo({ left: to, behavior: CX5.reducedMQ.matches ? "auto" : "smooth" });
      sync();
    }

    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    view.addEventListener("scroll", function () {
      /* the row reached the place the click asked for: back to reading the real position */
      if (goal !== null && Math.abs(view.scrollLeft - goal) < 1) {
        goal = null;
        window.clearTimeout(goalTimer);
      }
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(sync);
    }, { passive: true });

    nav.hidden = false;
    CX5.register({ resize: function () { goal = null; sync(); } });
    sync();
  });
})();
