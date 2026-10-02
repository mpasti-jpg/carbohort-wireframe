/* ===== borowka.js – page layer (V7) ========================================
   The CX5 bus, the shared layer and the modules of pattern blocks live in
   ce/*.js (the stages accordion in ce/CE-68-akordeon-faz.js); lightboxes,
   tabs, reveal and the area slider in uprawa.js; the per-hectare calculator
   in c5.js. Since iteration 2 the page is built from registered blocks only,
   so this file holds nothing but the in-page jumps. No own `window.CX5` and
   no `CX5.start()` – the bus starts by itself on DOMContentLoaded. ========= */

/* ===== 10 · In-page jumps outside the dot rail ==============================
   The hero buttons and every „Policz dla swojej plantacji” link travel the
   same way as the dots: through the inertia layer, natively with reduced
   motion. The jump waits one task: a link inside a product pop-up is also a
   reason for uprawa.js to close the layer (its listener sits on the box, so
   it runs after this one), and the page scrolls again only once the layer is
   gone and the inertia is back on. ======================================== */
(function () {
  "use strict";
  var doc = document, $$ = CX5.$$, reducedMQ = CX5.reducedMQ;
  $$("[data-cx-scroll]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = doc.getElementById(a.getAttribute("href").slice(1));
      if (!target) return;
      e.preventDefault();
      window.setTimeout(function () {
        CX5.scrollTo(Math.round(target.getBoundingClientRect().top + window.scrollY), reducedMQ.matches ? "auto" : "smooth");
      }, 0);
    });
  });
})();
