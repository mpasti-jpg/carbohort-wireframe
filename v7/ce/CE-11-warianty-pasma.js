/* ===== CE-11 · Warianty – pasma z przełącznikiem (wariant „pasma-z-przelacznikiem") =====
   A shared module since 02.10.2026 (see the CSS half for the layout and for
   what a page chooses). Any number of bands; the script itself did not change.

   What the script adds over the static layout:

     - on wide screens without reduced motion every product band is pinned for
       the height of the window and its card turns into a window: the content of
       the card travels 1 px per 1 px of page scroll until its end is reached,
       then the band lets go and the next product comes up;
     - the scroll budget of a band (--kdm-extra) is the overflow of its card
       plus a short hold, measured again on every resize and on load;
     - a control inside the card that receives focus while it is outside the
       window is scrolled into it (keyboard users never tab into the dark);
     - while the shop dialog (sklep-wspolne.js) is open, the inertia layer is
       paused, so the wheel does not move the page behind the dialog.

   The switch between the products needs no script: it is a row of in-page
   links and the hash bus of ce/00-base.js scrolls to the band.

   Without JS, with prefers-reduced-motion and below 900 px the module writes no
   variables at all and clears the ones it wrote. No [data-kdm] -> no-op. ===== */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;

  var root = $("[data-kdm]");
  if (!root) return;

  var HOLD = 0.18;      /* share of the window height the band stays after the card has ended */
  var FADE_PX = 140;    /* the bottom fade goes out over the last pixels of the travel */

  var tracks = $$("[data-kdm-track]", root).map(function (el) {
    return { el: el, card: $("[data-kdm-card]", el), scroll: $("[data-kdm-scroll]", el), over: 0, y: -1, fade: -1 };
  }).filter(function (t) { return t.card && t.scroll; });
  if (!tracks.length) return;

  var motion = false;

  function clear() {
    tracks.forEach(function (t) {
      t.el.style.removeProperty("--kdm-extra");
      t.el.style.removeProperty("--kdm-y");
      t.el.style.removeProperty("--kdm-fade");
      t.y = -1; t.fade = -1; t.over = 0;
    });
  }

  function measure() {
    var on = CX5.motionOn();
    if (on !== motion) {
      motion = on;
      root.setAttribute("data-kdm", on ? "ruch" : "stop");
      if (!on) clear();
    }
    if (!motion) return;
    var hold = Math.round(window.innerHeight * HOLD);
    tracks.forEach(function (t) {
      t.over = Math.max(0, Math.ceil(t.scroll.offsetHeight - t.card.clientHeight));
      t.el.style.setProperty("--kdm-extra", (t.over + hold) + "px");
      t.y = -1; t.fade = -1;      /* force a repaint with the new budget */
    });
  }

  function update() {
    if (!motion) return;
    tracks.forEach(function (t) {
      var y = Math.round(clamp(-t.el.getBoundingClientRect().top, 0, t.over));
      var fade = t.over > 0 ? clamp((t.over - y) / FADE_PX, 0, 1) : 0;
      if (y !== t.y) { t.y = y; t.el.style.setProperty("--kdm-y", String(y)); }
      if (fade !== t.fade) { t.fade = fade; t.el.style.setProperty("--kdm-fade", fade.toFixed(3)); }
    });
  }

  /* Focus inside the window: bring the control into view by scrolling the PAGE
     (the card itself never scrolls – it is clipped, not scrollable). */
  tracks.forEach(function (t) {
    t.card.addEventListener("focusin", function (e) {
      if (!motion || !t.over) return;
      var el = e.target;
      if (!el || el === t.card) return;
      var pos = el.getBoundingClientRect().top - t.scroll.getBoundingClientRect().top;   /* inside the content */
      var view = t.card.clientHeight;
      var from = t.y, to = t.y + view - el.offsetHeight - 24;
      if (pos >= from + 16 && pos <= to) return;                                       /* already visible */
      var wanted = clamp(Math.round(pos - view * 0.35), 0, t.over);
      var top = t.el.getBoundingClientRect().top + window.scrollY + wanted;
      CX5.scrollTo(top, "auto");
    });
  });

  /* Shop dialog open -> pause the inertia layer; its panel scrolls natively. */
  var html = document.documentElement, locked = false;
  if (window.MutationObserver) {
    new MutationObserver(function () {
      var now = html.classList.contains("cws-lock");
      if (now === locked) return;
      locked = now;
      var dlg = document.getElementById("szybki-podglad");
      if (dlg) dlg.setAttribute("data-lenis-prevent", "");
      if (CX5.lenis) { if (now) CX5.lenis.stop(); else CX5.lenis.start(); }
    }).observe(html, { attributes: true, attributeFilter: ["class"] });
  }

  CX5.register({ resize: measure, scroll: update });
})();
