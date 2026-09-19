/* ===== CE-68 · Akordeon faz z panelem (rejestr: ce-rejestr.js) ==============
   One phase open at a time, the first one on load. A click, Enter or Space on
   a row opens it; a click on the open row collapses it again (the frame shows
   a plain accordion, so unlike CE-65 nothing stays forced open). The arrows,
   Home and End only move the focus between rows – they never open a phase.
   When the collapsing phase sits ABOVE the one being opened, its row would
   jump over the top edge of the window, so the module pulls it back to one
   --c5-gutter from the top (instant with reduced motion).
   Where the row text, the panel and the photo stand is CSS business
   (CE-68-akordeon-faz.css); nothing here depends on the viewport, so the
   module registers neither scroll nor resize.
   No [data-fa] -> no-op. ================================================== */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, panelSet = CX5.panelSet;
  var root = $("[data-fa]");
  if (!root) return;
  var items = $$("[data-fa-item]", root);
  if (!items.length) return;

  var rows = [], panels = [];
  items.forEach(function (it) {
    rows.push($(".c5-fa__row", it));
    panels.push($(".c5-fa__panel", it));
  });
  if (rows.indexOf(null) > -1 || panels.indexOf(null) > -1) return;

  var at = -1;

  function gutter() {
    return parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue("--c5-gutter")) || 0;
  }

  function apply(i, instant) {
    at = i;
    rows.forEach(function (r, j) { r.setAttribute("aria-expanded", j === i ? "true" : "false"); });
    items.forEach(function (it, j) {
      if (j === i) it.setAttribute("data-open", "");
      else it.removeAttribute("data-open");
    });
    panels.forEach(function (p, j) { panelSet(p, j === i, instant); });
  }

  function toggle(i) {
    if (i === at) { apply(-1, false); return; }
    /* the panel above is still at its full height – measure before the toggle,
       then say where its row lands once that height is gone */
    var fix = null;
    if (at > -1 && at < i) {
      var above = panels[at].getBoundingClientRect().height;
      var top = rows[i].getBoundingClientRect().top - above;
      var g = gutter();
      if (top < g) fix = window.scrollY + top - g;
    }
    apply(i, false);
    if (fix !== null) CX5.scrollTo(Math.max(0, Math.round(fix)), CX5.reducedMQ.matches ? "auto" : "smooth");
  }

  rows.forEach(function (row, i) {
    row.addEventListener("click", function () { toggle(i); });
    row.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowDown") n = (i + 1) % rows.length;
      else if (e.key === "ArrowUp") n = (i - 1 + rows.length) % rows.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = rows.length - 1;
      if (n === null) return;
      e.preventDefault();
      rows[n].focus();
    });
  });

  apply(0, true);
})();
