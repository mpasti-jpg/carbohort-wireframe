/* ===== CE-21 · Dwie kolumny przewag (rejestr: ce-rejestr.js) ===============
   Variant `taby` (round of 02.11.2026, Figma map 3:415): EL-19 rail and EL-18
   tabs, one column visible at a time. The rail is `hidden` in the markup; this
   module shows it, adds the tab semantics to the panels and hides the other
   one, so without JS both columns stand in the flow. Click, arrows, Home and
   End with a roving tabindex. Moved from carbomat-mata.js 40 (03.11.2026).
   No .c5-cmp2--taby -> no-op. ============================================= */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;
  $$(".c5-cmp2--taby").forEach(function (root) {
    var rail = $('[role="tablist"]', root);
    var tabs = rail ? $$('[role="tab"]', rail) : [];
    var panels = tabs.map(function (t) { return doc.getElementById(t.getAttribute("aria-controls")); });
    if (tabs.length < 2 || panels.indexOf(null) !== -1) return;

    function select(i, focus) {
      tabs.forEach(function (t, j) {
        var on = j === i;
        t.setAttribute("aria-selected", on ? "true" : "false");
        if (on) t.removeAttribute("tabindex"); else t.setAttribute("tabindex", "-1");
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
    }

    panels.forEach(function (p) { p.setAttribute("role", "tabpanel"); });
    rail.hidden = false;
    select(0, false);

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i, false); });
      t.addEventListener("keydown", function (e) {
        var n = tabs.length, to = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") to = (i + 1) % n;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") to = (i - 1 + n) % n;
        else if (e.key === "Home") to = 0;
        else if (e.key === "End") to = n - 1;
        if (to < 0) return;
        e.preventDefault();
        select(to, true);
      });
    });
  });
})();
