/* ===== carbohumic.js – warstwa strony (V7) =================================
   Szyna CX5, warstwa wspólna i moduły klocków wzorca leżą w ce/*.js (ładowane
   wcześniej). Tutaj zostają wyłącznie moduły klocków unikalnych tej podstrony.
   Bez własnej definicji `window.CX5` i bez `CX5.start()` – szyna startuje sama
   na DOMContentLoaded. ==================================================== */
/* ===== 48 · Skala czasu: oś rysuje się przy przewijaniu =====================
   Wypełnienie linii jedzie od lewej do prawej razem z pozycją scrolla, a
   przystanek zapala się (`is-on`), gdy wypełnienie dojdzie do jego znacznika.
   Progi zapalenia to zmierzone pozycje znaczników na linii (środki kolumn,
   czyli około (i+.5)/N) – mierzymy je przy każdym resize, żeby odstęp siatki
   nie rozjeżdżał się z progiem. Poniżej 900 px, przy ograniczonym ruchu
   i bez JS linia jest pełna, a cała treść widoczna (CSS). ================= */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var axis = $("[data-time]");
  if (!axis) return;
  var track = $(".c5hu-time__track", axis);
  var stops = $$(".c5hu-time__stop", axis);
  if (!track || !stops.length) return;
  var N = stops.length;
  /* how far along the line every marker sits; the grid gap makes the column
     centres slightly tighter than (i+.5)/N, so measure instead of assuming */
  var at = stops.map(function (s, i) { return (i + 0.5) / N; });

  function light(p) {
    for (var i = 0; i < N; i++) stops[i].classList.toggle("is-on", p >= at[i]);
  }
  function update() {
    if (!CX5.motionOn()) return;
    var vh = window.innerHeight || 1;
    var top = axis.getBoundingClientRect().top;
    /* the axis draws itself over half a viewport, starting when it is 85 % down the window */
    var raw = clamp((0.85 * vh - top) / (0.5 * vh), 0, 1);
    var p = raw * raw * (3 - 2 * raw); /* smoothstep: soft start and finish */
    axis.style.setProperty("--time-p", p.toFixed(4));
    light(p);
  }
  function measure() {
    var i;
    if (!CX5.motionOn()) {
      /* static layout: hand the line back to the CSS default (full) */
      axis.style.removeProperty("--time-p");
      for (i = 0; i < N; i++) stops[i].classList.remove("is-on");
      return;
    }
    var line = track.getBoundingClientRect();
    if (line.width <= 0) return;
    for (i = 0; i < N; i++) {
      var dot = $(".c5hu-time__dot", stops[i]);
      if (!dot) continue;
      var r = dot.getBoundingClientRect();
      at[i] = CX5.clamp((r.left + r.width / 2 - line.left) / line.width, 0, 1);
    }
  }
  CX5.register({ scroll: update, resize: measure });
})();

/* ===== 72 · „Z czym łączyć" – lista z podglądem (spec §11.5) ================
   Five names on the left, one panel area on the right. Hovering, focusing or
   clicking a name shows its panel; the rest stay in the same grid cell with
   `visibility:hidden`, so the box keeps the height of the tallest panel and
   nothing jumps. Not scroll-driven, so it also runs with reduced motion.
   Below 900 px the layout is static (every name followed by its own example
   line and description), so the tab roles would lie – they are stripped there
   and restored when the window gets wide again. Without JS the page keeps the
   same static layout, which is why the CSS start state sits behind `.cx-js`.
   ======================================================================== */
(function () {
  "use strict";
  var host = CX5.$("[data-mixlist]");
  if (!host) return;
  var nav = CX5.$(".c5hu-mixlist__nav", host);
  var tabs = CX5.$$("[data-mix-tab]", host);
  var panels = CX5.$$("[data-mix-panel]", host);
  if (!nav || tabs.length < 2 || tabs.length !== panels.length) return;

  var active = -1;
  var live = null;   /* null = not decided yet, true = tabs, false = static list */

  function select(i) {
    if (i === active) return;
    active = i;
    tabs.forEach(function (t, n) {
      var on = n === i;
      t.classList.toggle("is-on", on);
      if (live) t.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach(function (p, n) { p.classList.toggle("is-on", n === i); });
  }

  /* Roles follow the layout: they describe a tab list only while one panel at
     a time is visible. */
  function setMode(on) {
    if (on === live) return;
    live = on;
    if (on) {
      nav.setAttribute("role", "tablist");
      tabs.forEach(function (t, n) {
        t.setAttribute("role", "tab");
        t.setAttribute("aria-selected", n === active ? "true" : "false");
      });
      panels.forEach(function (p) { p.setAttribute("role", "tabpanel"); });
    } else {
      nav.removeAttribute("role");
      tabs.forEach(function (t) { t.removeAttribute("role"); t.removeAttribute("aria-selected"); });
      panels.forEach(function (p) { p.removeAttribute("role"); });
    }
  }

  tabs.forEach(function (t, n) {
    t.addEventListener("mouseenter", function () { if (live) select(n); });
    t.addEventListener("focus", function () { if (live) select(n); });
    t.addEventListener("click", function () { select(n); });
  });

  select(0);
  CX5.register({ resize: function () { setMode(CX5.wideMQ.matches); } });
})();

/* ===== 72 · „Prosta zasada przygotowania mieszaniny" – stos kart (spec §11.6)
   Port of the protocol stack from carbomat-mata.js (module 60).
   The stack itself is plain CSS (`position:sticky`, every card stopping 16 px
   lower than the one before). This module only adds the finish: for each card
   it computes `--c5hu-stack-p` (0 -> 1: how far the next card already covers
   it) and writes it on the element – the rest happens in CSS (card `scale`,
   photo `brightness`). The value comes from the scroll position alone, with no
   timed transitions, so the picture stops when the wheel stops.
   Geometry is read from the flow (container rect + offsetHeight), not from the
   cards' own `getBoundingClientRect()`: the cards are scaled, so their rects
   lie – the container's does not.
   Below 900 px and with reduced motion this module does nothing (CSS does not
   pin the cards there either). ========================================== */
(function () {
  "use strict";
  var host = CX5.$("[data-stack]");
  if (!host) return;
  var cards = CX5.$$(".c5hu-stack__card", host);
  if (cards.length < 2) return;
  var geo = null;

  function measure() {
    if (!CX5.motionOn()) {
      geo = null;
      cards.forEach(function (c) { c.style.removeProperty("--c5hu-stack-p"); });
      return;
    }
    var gap = parseFloat(getComputedStyle(host).rowGap) || 0;
    var top = host.getBoundingClientRect().top + window.scrollY;   /* flow top of card 1 */
    var flow = [], hs = [], sticky = [], acc = 0;
    cards.forEach(function (c) {
      var h = c.offsetHeight;                                       /* layout height, transform-proof */
      flow.push(top + acc);
      hs.push(h);
      sticky.push(parseFloat(getComputedStyle(c).top) || 0);
      acc += h + gap;
    });
    geo = { flow: flow, h: hs, sticky: sticky };
  }

  function paint() {
    if (!geo) return;
    var y = window.scrollY;
    for (var i = 0; i < cards.length; i++) {
      var p = 0;
      if (i < cards.length - 1) {
        /* where both cards actually sit: flow position until they stick */
        var mine = Math.max(geo.flow[i] - y, geo.sticky[i]);
        var next = Math.max(geo.flow[i + 1] - y, geo.sticky[i + 1]);
        /* full cover = the next card reached its own stop, 16 px below ours */
        var span = geo.sticky[i] + geo.h[i] - geo.sticky[i + 1];
        if (span > 0) p = CX5.clamp((mine + geo.h[i] - next) / span, 0, 1);
      }
      cards[i].style.setProperty("--c5hu-stack-p", p.toFixed(3));
    }
  }

  CX5.register({ resize: measure, scroll: paint });
})();


