/* ===== carbohumic.js – warstwa strony (V7) =================================
   Szyna CX5, warstwa wspólna i moduły klocków wzorca leżą w ce/*.js (ładowane
   wcześniej). Tutaj zostają wyłącznie moduły klocków unikalnych tej podstrony.
   Bez własnej definicji `window.CX5` i bez `CX5.start()` – szyna startuje sama
   na DOMContentLoaded. ==================================================== */
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
