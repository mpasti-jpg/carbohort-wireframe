/* ===== kukurydza.js – warstwa strony (V7) ==================================
   Szyna CX5, warstwa wspólna i moduły klocków wzorca leżą w ce/*.js (ładowane
   wcześniej). Tutaj zostają wyłącznie moduły klocków unikalnych tej podstrony.
   Bez własnej definicji `window.CX5` i bez `CX5.start()` – szyna startuje sama
   na DOMContentLoaded. ==================================================== */
/* ===== 10+ · Skoki w obrębie strony spoza nawigacji kropkowej ===============
   Przycisk w hero („Zobacz program krok po kroku", spec §9.3) skacze tą samą
   drogą co kropki – przez warstwę inercji, natywnie przy ograniczonym ruchu.
   Same kropki prowadzi ce/CE-07-nawigacja-kropkowa.js. =================== */
(function () {
  "use strict";
  var doc = document, $$ = CX5.$$, reducedMQ = CX5.reducedMQ;
  var links = $$("[data-cx-scroll]");
  if (!links.length) return;
  function jumpTo(a) {
    var target = doc.getElementById(a.getAttribute("href").slice(1));
    if (!target) return false;
    CX5.scrollTo(Math.round(target.getBoundingClientRect().top + window.scrollY), reducedMQ.matches ? "auto" : "smooth");
    return true;
  }
  links.forEach(function (a) {
    a.addEventListener("click", function (e) { if (jumpTo(a)) e.preventDefault(); });
  });
})();
/* ===== 55 · Krytyczne fakty – bez modułu ===================================
   The facts scene (CE-44 `tlo-foto`) left the page in iteration 17 (01.10.2026)
   and its module went with it. The base version of the block lives on
   lab/ce-44-napis-z-kaflami.html, the photo variant on Próchnica+. */

/* ===== 80 · Tank-mix table: clickable rows (spec §10.6) ====================
   The row is a shortcut, not a control: the accessible target stays the single
   link in the first cell, and a click anywhere else in the row just triggers
   it. Clicks that land on another link (the `*` footnote) are left alone, and
   so is a click that ends a text selection. Without JS the link still works.
   ========================================================================= */
(function () {
  "use strict";
  CX5.$$("[data-mt] tbody tr").forEach(function (row) {
    var link = CX5.$(".u-mt__prod", row);
    if (!link) return;
    row.addEventListener("click", function (e) {
      /* real controls (the link itself, the footnote link) handle their own click */
      if (e.target.closest && e.target.closest("a,button,input,select,textarea,label")) return;
      var sel = window.getSelection && window.getSelection();
      if (sel && !sel.isCollapsed && String(sel).length) return;   /* user was selecting text */
      link.click();
    });
  });
})();

/* ===== 90 · Pas zamykający – bez modułu strony ==============================
   Kadr skaluje bazowy klocek: `ce/CE-16-pas-pro.js` czyta `[data-pro]` i pisze
   `--pro-s` (spec §13.5). Tutaj nie ma już czego trzymać. */


