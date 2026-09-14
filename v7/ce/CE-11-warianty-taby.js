/* ===== CE-11 · Warianty na tabach (rejestr: ce-rejestr.js) ==================
   The tabs only navigate: the variant blocks lie one under another and a click
   scrolls to one of them; the bar hides upwards as soon as the next section
   shows up from below. Merged from carbohumic.js 40 – the same module as
   carbomat.js 40 except that the next section is read from the DOM instead of
   a fixed id, so a page can reorder its chapters without a code change.
   No [data-tabs] -> no-op. =============================================== */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$, reducedMQ = CX5.reducedMQ;
  var tabsBar = $("[data-tabs]");
  if (!tabsBar) return;
  var tabBtns = $$("[data-tab]");
  var varBlocks = $$("[data-variant-block]");
    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var block = doc.getElementById(btn.getAttribute("aria-controls"));
        if (!block) return;
        /* the tab bar is the only thing pinned to the top edge here */
        var offset = tabsBar.offsetHeight + 16;
        CX5.scrollTo(Math.round(block.getBoundingClientRect().top + window.scrollY - offset), reducedMQ.matches ? "auto" : "smooth");
      });
    });
  /* The bar leaves as soon as the NEXT section shows up from below (pattern
     §3.4); below 900 px it is not pinned at all, so it never hides. The next
     section is read from the DOM (next <section> sibling of the one holding the
     bar) instead of a fixed id, so reordering the page needs no code change. */
  var ownSec = tabsBar ? tabsBar.closest("section") : null;
  var nextSec = ownSec ? ownSec.nextElementSibling : null;
  while (nextSec && nextSec.tagName !== "SECTION") nextSec = nextSec.nextElementSibling;
  function updateBarVisibility() {
    if (!tabsBar) return;
    var out = CX5.wideMQ.matches && !!nextSec &&
              nextSec.getBoundingClientRect().top < window.innerHeight;
    tabsBar.classList.toggle("is-out", out);
  }

  function updateTabs() {
    if (!tabsBar || !varBlocks.length) return;
    updateBarVisibility();
    var line = tabsBar.offsetHeight + 24;          /* pod przyklejonym paskiem tabów */
    var current = varBlocks[0].getAttribute("data-variant-block");
    varBlocks.forEach(function (b) {
      if (b.getBoundingClientRect().top <= line) current = b.getAttribute("data-variant-block");
    });
    tabBtns.forEach(function (b) {
      b.setAttribute("aria-selected", b.getAttribute("data-tab") === current ? "true" : "false");
    });
  }
  CX5.register({ scroll: updateTabs });
})();
