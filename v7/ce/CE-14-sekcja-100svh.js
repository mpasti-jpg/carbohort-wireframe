/* ===== CE-14 · Sekcja 100svh z listą i zdjęciem (rejestr: ce-rejestr.js) ====
   Two jobs.

   1. Light parallax of the photo: the image is 14 % taller than the frame that
      crops it, so it can move without uncovering an edge. `--dose-par` runs from
      -6 to 0 (per cent of the image height) while the section crosses the
      screen – the image travels slower than the page. The loop reads only the
      frame rectangle and writes one custom property.
      Merged from carbomat.js 70; the CARBOHUMIC copy was the same code.

   2. E13 (18.10.2026): the steps of the list (.c5-dose__list > .c5-card, at
      least two) come in one by one while the list rises through the window.
      The count only grows: 1 when the bottom of the list (where the visible
      group stands) reaches the bottom edge of the window, then one more every
      4 % of the window height of scroll. A count that jumps by more than one
      (a long flick of the wheel) is played step by step, 160 ms apart, so the
      cards never arrive together. The script writes
      two lengths on the list – --dose-shift (how far the visible cards stand
      below their place, so the group sits at the bottom of the list) and
      --dose-next (the same for the card that comes next) – and the classes
      `is-in` (visible) and `is-on` (the newest, active one) on the cards. The
      motion itself is CSS (transform, opacity). The rozpiska variant has no
      step cards and is left alone.

   Without CX5.motionOn() both jobs step back: no parallax property, no class,
   no lengths – the list stands as drawn. No [data-dose-media] and no step
   list -> no-op. ========================================================== */
(function () {
  "use strict";
  var wrap = CX5.$("[data-dose-media]");
  var list = CX5.$(".c5-dose__list");
  var cards = list ? CX5.$$(":scope > .c5-card", list) : [];
  if (cards.length < 2) { list = null; cards = []; }
  if (!wrap && !list) return;

  /* --- 1. parallax ---------------------------------------------------------- */
  function parallax() {
    if (!wrap) return;
    if (!CX5.motionOn()) { wrap.style.removeProperty("--dose-par"); return; }
    var h = window.innerHeight;
    var r = wrap.getBoundingClientRect();
    var span = h + r.height;
    var p = span > 0 ? CX5.clamp((h - r.top) / span, 0, 1) : 0;
    wrap.style.setProperty("--dose-par", CX5.lerp(-6, 0, p).toFixed(3));
  }

  /* --- 2. steps --------------------------------------------------------------- */
  var P0 = 0, STEP = 0.04;       /* in units of the window height */
  var GAP_MS = 160;              /* between two steps of one jump */
  var shown = 0;                 /* how many steps are in – never goes down */
  var target = 0;                /* how many steps the scroll position asks for */
  var timer = 0;
  var tail = [];                 /* tail[k] = layout distance from the bottom of card k to the bottom of the list */

  function measure() {
    /* layout boxes: offsetTop/offsetHeight ignore the transforms of the cards */
    var bottom = list.offsetHeight;
    tail = cards.map(function (c) { return Math.max(0, bottom - (c.offsetTop + c.offsetHeight)); });
  }

  function paintSteps() {
    var n = shown;
    var shift = n > 0 ? tail[n - 1] : tail[0];
    var next = n < cards.length ? tail[n] : 0;
    list.style.setProperty("--dose-shift", shift + "px");
    list.style.setProperty("--dose-next", next + "px");
    cards.forEach(function (c, i) {
      c.classList.toggle("is-in", i < n);
      c.classList.toggle("is-on", i === n - 1);
    });
  }

  function steps() {
    if (!list) return;
    if (!CX5.motionOn()) {
      if (list.classList.contains("is-steps")) {
        list.classList.remove("is-steps");
        list.style.removeProperty("--dose-shift");
        list.style.removeProperty("--dose-next");
        cards.forEach(function (c) { c.classList.remove("is-in", "is-on"); });
      }
      if (timer) { clearTimeout(timer); timer = 0; }
      shown = 0;
      target = 0;
      return;
    }
    var first = !list.classList.contains("is-steps");
    if (first) { measure(); list.classList.add("is-steps"); }
    var h = window.innerHeight;
    var p = (h - list.getBoundingClientRect().bottom) / h;
    var n = p < P0 ? 0 : Math.min(cards.length, 1 + Math.floor((p - P0) / STEP));
    if (first) paintSteps();
    if (n > target) { target = n; advance(); }
  }

  function advance() {
    if (timer || shown >= target) return;
    shown += 1;
    paintSteps();
    if (shown < target) {
      timer = setTimeout(function () { timer = 0; advance(); }, GAP_MS);
    }
  }

  function update() { parallax(); steps(); }
  function resize() {
    if (list && list.classList.contains("is-steps")) { measure(); paintSteps(); }
    update();
  }

  update();
  CX5.register({ scroll: update, resize: resize });
  /* the text face may arrive after the first measure – the cards change height */
  if (list && document.fonts && document.fonts.ready) document.fonts.ready.then(resize);
})();
