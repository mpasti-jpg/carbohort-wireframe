/* ===== CE-11 · Warianty – pasma z przełącznikiem (wariant „pasma-z-przelacznikiem") =====
   A shared module since 02.10.2026 (see the CSS half for the layout and for
   what a page chooses). Any number of bands.

   What the script adds over the static layout (round of 18.10.2026, E08–E09):

     - on wide screens without reduced motion it switches the motion layer on
       ([data-kdm="ruch"]): one sticky left column for the whole CE, the cards
       of the products one under another on the right – only the right column
       scrolls;
     - the current product is a THRESHOLD, not a scrub: when the top of the
       next card passes the middle of the window, its track gets `is-on` (the
       ones above it `is-past`) and CSS plays the change – the packshot out,
       then the next one in, the tone of the CE, the outline of the sign, the
       tab of the switch. Scrolling back past the line plays it backwards;
     - the tone layers (.c5-kdm__bgs, one per product, coloured with the
       --c5-kdm-band of its track) are inserted once and shown only by CSS of
       the motion layer;
     - aria-current follows the current product in every switch; the visible
       switch is the one of the last product (its column paints on top);
     - in-page links to a band (the switch, links from other pages) land on the
       top of its card – a dissolved track has no box of its own;
     - while the shop dialog (sklep-wspolne.js) is open, the inertia layer is
       paused, so the wheel does not move the page behind the dialog.

   Without JS, with prefers-reduced-motion and below 900 px the module leaves
   the static layout alone and restores what it changed (aria-current of every
   switch on its own band). No [data-kdm] -> no-op. ===== */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$;

  var root = $("[data-kdm]");
  if (!root) return;

  var LINE = 0.5;       /* share of the window height a card top must pass to become current */

  var tracks = $$("[data-kdm-track]", root).map(function (el) {
    return { el: el, card: $("[data-kdm-card]", el), bg: null };
  }).filter(function (t) { return t.card; });
  if (!tracks.length) return;

  var motion = false, act = -1, bgs = null;

  /* one tone layer per product. 20.10.2026 (owner): a change of the product must
     NOT change the background of the CE, so every layer carries the tone of the
     FIRST product's band (the outline of the sign keeps the first tone too – see
     --c5-kdm-syg-fix in the CSS half). The layers stay one per product so the
     markup of the motion layer is unchanged. */
  function buildTones() {
    if (bgs) return;
    bgs = document.createElement("span");
    bgs.className = "c5-kdm__bgs";
    bgs.setAttribute("aria-hidden", "true");
    var first = window.getComputedStyle(tracks[0].el);
    root.style.setProperty("--c5-kdm-syg-fix", first.getPropertyValue("--c5-kdm-syg").trim());
    tracks.forEach(function (t) {
      var span = document.createElement("span");
      span.style.background = first.getPropertyValue("--c5-kdm-band").trim();
      bgs.appendChild(span);
      t.bg = span;
    });
    root.appendChild(bgs);              /* a <span>: the div:nth-of-type / :last-of-type rules of the tracks never count it */
  }

  /* aria-current: on the link to `id` in every switch of the CE */
  function markSwitches(scope, id) {
    $$(".c5-kdm__opt", scope).forEach(function (a) {
      if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  function current() {
    var line = window.innerHeight * LINE, i = 0;
    for (var k = 1; k < tracks.length; k++) {
      if (tracks[k].card.getBoundingClientRect().top < line) i = k;
    }
    return i;
  }

  function show(i, instant) {
    if (i === act) return;
    act = i;
    if (instant) root.classList.add("is-instant");
    tracks.forEach(function (t, k) {
      t.el.classList.toggle("is-on", k === i);
      t.el.classList.toggle("is-past", k < i);
      if (t.bg) t.bg.classList.toggle("is-on", k <= i);
    });
    markSwitches(root, tracks[i].el.id);
    if (instant) {
      void root.offsetWidth;
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () { root.classList.remove("is-instant"); });
      });
    }
  }

  /* back to the static layout: every band its own switch and nothing current */
  function restore() {
    act = -1;
    tracks.forEach(function (t) {
      t.el.classList.remove("is-on", "is-past");
      markSwitches(t.el, t.el.id);
    });
  }

  function measure() {
    var on = CX5.motionOn();
    if (on === motion) return;
    motion = on;
    if (on) {
      buildTones();
      root.style.setProperty("--kdm-n", String(tracks.length));
      root.setAttribute("data-kdm", "ruch");
      act = -1;
      show(current(), true);
    } else {
      root.setAttribute("data-kdm", "stop");
      root.style.removeProperty("--kdm-n");
      restore();
    }
  }

  function update() {
    if (motion) show(current(), false);
  }

  /* #wariant-… while the tracks are dissolved: land on the top of the card,
     level with the top of the sticky column */
  CX5.onHash(function (hash, instant) {
    if (!motion || !hash) return false;
    var id = decodeURIComponent(hash.slice(1)), t = null;
    for (var k = 0; k < tracks.length; k++) if (tracks[k].el.id === id) t = tracks[k];
    if (!t) return false;
    var pad = parseFloat(window.getComputedStyle(root).paddingTop) || 0;
    var top = t.card.getBoundingClientRect().top + window.scrollY - pad;
    CX5.scrollTo(top, instant || CX5.reducedMQ.matches ? "auto" : "smooth");
    return true;
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
