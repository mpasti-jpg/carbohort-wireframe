/* ===== CE-37 · Pop-up karty – shared opener of the `c5-pop` variant ==========
   Generic form of block 1 of carbomat-humic.js (stage G18, 18.10.2026): any
   `.c5-pop[data-pop]` on the page becomes a modal window, any `[data-pop-open="id"]`
   opens it. Without JS the cards lie in the flow of the page (the whole content
   visible) and an inline trigger `a.c5-pop-link[href="#id"]` is a plain anchor to
   its card; here the cards and the one `[data-pop-overlay]` move to the end of
   <body> and behave like a modal window: the overlay, the X, a click beside the
   panel, Escape, a Tab trap, `inert` on the background, the page scroll locked
   (`html.c5-pop-lock` + Lenis stopped), focus back on the trigger. The hash does
   not change. Pages that keep their own copy of this code (carbomat-humic.js,
   carbohumic-dolistny.js) must not load this file as well. ===================== */
(function () {
  "use strict";
  var doc = document;
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  var pops = $$("[data-pop]");
  if (!pops.length) return;
  var overlay = $("[data-pop-overlay]");
  var openBox = null, opener = null;
  function lenis() { return window.CX5 && window.CX5.lenis; }

  function focusables(box) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', box)
      .filter(function (n) { return n.offsetWidth > 0 || n.offsetHeight > 0; });
  }
  function sleep(box) {
    box.setAttribute("data-open", "false");
    box.setAttribute("aria-hidden", "true");
    box.inert = true;
  }
  /* everything in <body> goes inert while a window is open; the closed cards stay
     inert afterwards, because that is their resting state */
  function bgInert(on, keep) {
    Array.prototype.forEach.call(doc.body.children, function (n) {
      if (n === overlay) return;
      n.inert = n === keep ? false : (on || n.hasAttribute("data-pop"));
    });
  }
  function closePop(returnFocus) {
    if (!openBox) return;
    var box = openBox, btn = opener;
    openBox = null; opener = null;
    sleep(box);
    if (overlay) { overlay.setAttribute("data-open", "false"); overlay.hidden = true; }
    doc.documentElement.classList.remove("c5-pop-lock");
    bgInert(false, null);
    if (lenis() && lenis().start) lenis().start();
    if (returnFocus !== false && btn && btn.focus) btn.focus();
  }
  function openPop(box, btn) {
    if (!box || openBox === box) return;
    if (openBox) closePop(false);
    openBox = box; opener = btn || null;
    if (overlay) { overlay.hidden = false; void overlay.offsetWidth; overlay.setAttribute("data-open", "true"); }
    box.removeAttribute("aria-hidden");
    box.inert = false;
    box.setAttribute("data-open", "true");
    doc.documentElement.classList.add("c5-pop-lock");
    bgInert(true, box);
    if (lenis() && lenis().stop) lenis().stop();
    var x = $("[data-pop-close]", box);
    (x || focusables(box)[0] || box).focus();
  }

  pops.forEach(function (box) {
    doc.body.appendChild(box);
    sleep(box);
    var panel = $(".c5-pop__panel", box);
    box.addEventListener("click", function (e) {
      if (panel && !panel.contains(e.target)) closePop();
    });
    $$("[data-pop-close]", box).forEach(function (b) {
      b.addEventListener("click", function () { closePop(); });
    });
  });
  if (overlay) {
    doc.body.appendChild(overlay);
    overlay.hidden = true;
    overlay.setAttribute("data-open", "false");
    overlay.addEventListener("click", function () { closePop(); });
  }
  $$("[data-pop-open]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      /* an anchor trigger keeps its href for the page without JS – no jump here */
      if (btn.tagName === "A") {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
      }
      openPop(doc.getElementById(btn.getAttribute("data-pop-open")), btn);
    });
  });
  doc.addEventListener("keydown", function (e) {
    if (!openBox) return;
    if (e.key === "Escape") { e.preventDefault(); closePop(); return; }
    if (e.key !== "Tab") return;
    var f = focusables(openBox);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!openBox.contains(doc.activeElement)) { e.preventDefault(); first.focus(); }
  });
})();
