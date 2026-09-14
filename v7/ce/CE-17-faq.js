/* ===== CE-17 · FAQ (rejestr: ce-rejestr.js) ================================
   Accordion, one question open at a time; every item starts collapsed unless
   the markup says otherwise. An anchor on an item or on its answer panel opens
   that item and scrolls to its question row – a native jump to a collapsed
   (height 0) panel would land beside it. The hash arrives through CX5.onHash
   (page start = instant, in-page links, Back/Forward), so this module has no
   hashchange or link-click listeners of its own; the hash stays in the address,
   the accordion itself never changes it. Without JS the answers stay open (CSS).
   Merged from produkty.js 90 – the fullest copy: carbomat.js, carbohumic.js and
   carbomat-mata.js carry the accordion alone (no item there has an id, so the
   anchor half never fires) and carbomat-humic.js the same anchor behaviour
   written against `location.hash` before the bus had hash routing.
   No .c5-faq__item -> no-op. ============================================= */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$, panelSet = CX5.panelSet;
  var faqItems = $$(".c5-faq__item");
  if (!faqItems.length) return;

  /* one item open at a time; `instant` skips the height animation (page start);
     `instantAbove` collapses the items above `item` at once, so its final place is known now */
  function openOnly(item, instant, instantAbove, group) {
    /* scope to one accordion: a page may carry several .c5-faq blocks (FAQ + "Dla dociekliwych") */
    group = group || (item && item.closest ? item.closest(".c5-faq") : null);
    var at = faqItems.indexOf(item);
    faqItems.forEach(function (it, j) {
      if (group && it.closest(".c5-faq") !== group) return;
      var b = $(".c5-faq__q", it);
      var a = $(".c5-faq__a", it);
      var on = it === item;
      if (b) b.setAttribute("aria-expanded", on ? "true" : "false");
      panelSet(a, on, !!(instant || (instantAbove && j < at)));
      if (on) { it.setAttribute("data-open", ""); } else { it.removeAttribute("data-open"); }
    });
  }

  faqItems.forEach(function (item) {
    var btn = $(".c5-faq__q", item);
    var ans = $(".c5-faq__a", item);
    if (!btn || !ans) return;
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      openOnly(open ? null : item, false, false, item.closest(".c5-faq"));
    });
  });

  /* initial state from the markup (all collapsed unless an item carries data-open) */
  faqItems.forEach(function (it) {
    panelSet($(".c5-faq__a", it), it.hasAttribute("data-open"), true);
  });

  function gutter() {
    return parseFloat(window.getComputedStyle(doc.documentElement).getPropertyValue("--c5-gutter")) || 0;
  }
  /* While the page loads, the browser keeps a fragment target in view and wins over any earlier
     script scroll – so a native jump to #faq-N must land where CX5.onHash puts the item: its
     question row one gutter below the top edge. The answer panel sits beside the question
     (>= 900 px) or under it, hence scroll margin = its offset from the item top + gutter. */
  function anchorMargins() {
    var g = gutter();
    faqItems.forEach(function (it) {
      var a = $(".c5-faq__a", it);
      if (!a || !a.id) return;
      a.style.scrollMarginTop = Math.round(a.getBoundingClientRect().top - it.getBoundingClientRect().top + g) + "px";
    });
  }
  anchorMargins();
  CX5.register({ resize: anchorMargins });

  /* --- open from an anchor ------------------------------------------------------- */
  function itemFor(hash) {
    if (!hash || hash.length < 2) return null;
    var el = null;
    try { el = doc.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) { el = null; }
    return el && el.closest ? el.closest(".c5-faq__item") : null;
  }
  CX5.onHash(function (hash, instant) {
    var item = itemFor(hash);
    if (!item) return false;
    var a = doc.activeElement;
    var fromLink = !!(a && a.tagName === "A" && a.getAttribute("href") === hash);
    openOnly(item, instant, true);
    CX5.scrollTo(item.getBoundingClientRect().top + window.scrollY - gutter(),
                 instant || CX5.reducedMQ.matches ? "auto" : "smooth");
    var q = $(".c5-faq__q", item);
    if (fromLink && q) q.focus({ preventScroll: true });   /* the next Tab continues from this question */
    return true;
  });
})();
