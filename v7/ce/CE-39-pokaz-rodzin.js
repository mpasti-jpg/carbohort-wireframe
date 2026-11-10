/* ===== CE-39 · Pokaz rodzin na tabach – module script (10.11.2026) =====
   The mechanics of the family show (ARIA tabs, sliding marker, panel swap, swipe on the
   packshot, deep links #gama-<key>) as one module, for every page that links it. The code
   below is the module „30 · Gama” of produkty.js, word for word: produkty.html still runs
   its own copy and does NOT link this file, so the two never bind the same section. When
   produkty-katalog.html replaces produkty.html, produkty.js loses its module 30 and the
   page links this file instead (backlog, „PRODUKTY – wersja uproszczona wg Darka”).
   Root: [data-gama] with .c5pr-seg (tablist), .c5pr-seg__thumb and .c5pr-show__panels;
   the head of the page sets the class c5pr-js on <html> before the CSS paints (the CSS
   of the tabs keys on it) and this module removes it again when the markup is incomplete.
   The optional link [data-gama-compare] is only kept for the old layout of produkty.html. */
/* ===== 30 · Gama – pokaz czterech rodzin (11.09.2026; decoupled from the table 14.09.2026) =====
   Pattern: version picker on rivian.com/r1s. A mechanism of this page only; every part is guarded.
   – ARIA tabs with automatic activation: click, arrows (wrapping), Home/End;
   – the marker of the active tab slides and changes size (also in the 2×2 grid on phones);
   – panel swap: the old panel slides away opposite to the direction of the choice, the new
     packshot comes in from that direction, the caption and the spec columns cascade in and the
     block height changes smoothly (content below does not jump);
   – swipe on the packshot = previous / next family (at the ends the packshot springs back);
   – deep links #gama-eco | #gama-mata | #gama-humic | #gama-carbohumic through CX5.onHash:
     select the family and scroll to the show (at start, after load, on Back/Forward);
   – „Porównaj" is an ordinary in-page link: the shared anchor handler (00-base.js) pushes
     #porownanie and scrolls through Lenis. This module only moves focus to the table container,
     so the next Tab starts in the table. No column highlight, no remembered family, no #gama-…
     history entry (spec §6.3) – the table's own „pokaż w tabeli" buttons live in module 40.
   Content is visible from the first frame (no reveal). With prefers-reduced-motion everything
   switches instantly. */
(function () {
  "use strict";
  var doc = document;
  doc.documentElement.classList.add("c5pr-js");
  var show = CX5.$("[data-gama]");
  if (!show) return;
  var $$ = CX5.$$;
  var seg = CX5.$(".c5pr-seg", show);
  var thumb = CX5.$(".c5pr-seg__thumb", show);
  var wrap = CX5.$(".c5pr-show__panels", show);
  var compare = CX5.$("[data-gama-compare]", show);
  var tabs = $$('[role="tab"]', show);
  var panels = tabs.map(function (t) { return doc.getElementById(t.getAttribute("aria-controls")); });
  if (!seg || !thumb || !wrap || tabs.length < 2 || panels.indexOf(null) !== -1) {
    doc.documentElement.classList.remove("c5pr-js");      /* incomplete markup – back to the layout without tabs */
    return;
  }
  var keys = tabs.map(function (t) { return t.getAttribute("data-key"); });
  var reducedMQ = CX5.reducedMQ;
  var EASE = "cubic-bezier(0.2, 0, 0, 1)";            /* = --w-ease from the kit */
  var EASE_IN = "cubic-bezier(0.4, 0, 1, 1)";
  function motion() { return typeof Element.prototype.animate === "function" && !reducedMQ.matches; }
  function anim(el, frames, o) {
    if (!el || !motion()) return null;
    o.id = "c5pr-gama";
    if (!o.easing) o.easing = EASE;
    if (!o.fill) o.fill = "backwards";
    return el.animate(frames, o);
  }
  var cur = 0;
  tabs.forEach(function (t, i) { if (t.getAttribute("aria-selected") === "true") cur = i; });

  /* --- marker of the active tab ------------------------------------------------ */
  function placeThumb(animate) {
    var t = tabs[cur];
    if (!animate) thumb.style.transition = "none";
    thumb.style.width = t.offsetWidth + "px";
    thumb.style.height = t.offsetHeight + "px";
    thumb.style.transform = "translate(" + t.offsetLeft + "px," + t.offsetTop + "px)";
    if (!animate) { void thumb.offsetWidth; thumb.style.transition = ""; }
    seg.setAttribute("data-ready", "");
  }

  /* --- panel animations -------------------------------------------------------- */
  function parts(p) {
    return {
      shot: p.querySelector(".c5pr-shot__img"),
      floor: p.querySelector(".c5pr-shot__floor"),
      cap: p.querySelector(".c5pr-fam__cap"),
      specs: $$(".c5pr-spec", p)
    };
  }
  function enter(p, dx, dy, delay) {
    var q = parts(p);
    anim(q.shot, [{ opacity: 0, transform: "translate(" + dx + "px," + dy + "px) scale(.965)" }, { opacity: 1, transform: "none" }], { duration: 680, delay: delay });
    anim(q.floor, [{ opacity: 0, transform: "translateX(-50%) scaleX(.5)" }, { opacity: 1, transform: "translateX(-50%) scaleX(1)" }], { duration: 680, delay: delay });
    anim(q.cap, [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 480, delay: delay + 120 });
    q.specs.forEach(function (s, k) {
      anim(s, [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], { duration: 480, delay: delay + 200 + k * 70 });
    });
  }
  function running(p) {
    if (!p.getAnimations) return false;
    return p.getAnimations({ subtree: true }).some(function (a) { return a.id === "c5pr-gama" && a.playState === "running"; });
  }
  function stopAll() {
    if (show.getAnimations) {
      show.getAnimations({ subtree: true }).forEach(function (a) { if (a.id === "c5pr-gama") a.cancel(); });
    }
    panels.forEach(function (p) { p.removeAttribute("data-leaving"); });
    wrap.style.overflowY = "";
  }

  /* --- selecting a family (touches only this section) --------------------------------- */
  function select(i, o) {
    o = o || {};
    var n = tabs.length;
    i = ((i % n) + n) % n;
    if (i === cur) return;
    var from = panels[cur];
    var to = panels[i];
    var dir = o.dir || (i > cur ? 1 : -1);
    /* Measure BEFORE interrupting the animation: on fast re-clicks the height starts from the
       current (animated) one, and a panel caught while entering disappears at once – no flash
       to full opacity and no jump of the content below. */
    var h0 = wrap.getBoundingClientRect().height;
    var busy = running(from);
    stopAll();
    tabs.forEach(function (t, j) {
      var on = j === i;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    cur = i;
    placeThumb(!o.instant);
    from.removeAttribute("data-on");
    from.inert = true;
    to.setAttribute("data-on", "");
    to.inert = false;
    if (o.instant || !motion()) return;
    if (!busy) from.setAttribute("data-leaving", "");
    var h1 = wrap.offsetHeight;
    wrap.style.overflowY = "clip";      /* vertical only – the leaving panel must not lose letters at the sides */
    if (!busy) {
      var leave = anim(from, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(" + (-40 * dir) + "px)" }], { duration: 260, easing: EASE_IN, fill: "forwards" });
      leave.onfinish = function () { from.removeAttribute("data-leaving"); leave.cancel(); };
    }
    var grow = anim(wrap, [{ height: h0 + "px" }, { height: h1 + "px" }], { duration: 520, fill: "none" });
    grow.onfinish = function () { wrap.style.overflowY = ""; };
    enter(to, 72 * dir, 0, 110);
  }

  /* 19.10.2026 (Mateusz): a click on any tab brings the beige panel to the top of the window,
     25 px under its edge, so the four columns under it are in view. Smooth through CX5.scrollTo
     (Lenis), a plain jump with reduced motion. Below 1120 px the rail stands above the panel,
     so the rail gets the 25 px instead – the tabs stay at hand. */
  var FIT_GAP = 25;
  var railInside = window.matchMedia("(min-width: 1120px)");
  function fitPanel() {
    var box = railInside.matches ? panels[cur].querySelector(".c5pr-fam__panel") : seg;
    if (!box) return;
    CX5.scrollTo(Math.round(box.getBoundingClientRect().top + window.scrollY - FIT_GAP),
                 reducedMQ.matches ? "auto" : "smooth");
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(i); fitPanel(); });
  });
  seg.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;       /* browser shortcuts (Back/Forward) */
    var k = e.key;
    var i;
    var dir;
    if (k === "ArrowRight") { i = cur + 1; dir = 1; }
    else if (k === "ArrowLeft") { i = cur - 1; dir = -1; }
    else if (k === "Home") { i = 0; }
    else if (k === "End") { i = tabs.length - 1; }
    else return;
    e.preventDefault();
    select(i, { dir: dir });
    tabs[cur].focus();
  });

  /* --- swipe on the packshot ------------------------------------------------------- */
  var swipe = null;
  wrap.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" || !e.target.closest(".c5pr-stage")) return;
    swipe = { x: e.clientX, y: e.clientY, id: e.pointerId };
  });
  wrap.addEventListener("pointerup", function (e) {
    if (!swipe || e.pointerId !== swipe.id) return;
    var dx = e.clientX - swipe.x;
    var dy = e.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    var next = cur + (dx < 0 ? 1 : -1);
    if (next < 0 || next >= tabs.length) {
      anim(parts(panels[cur]).shot, [{ transform: "none" }, { transform: "translateX(" + (dx < 0 ? -18 : 18) + "px)" }, { transform: "none" }], { duration: 380, fill: "none" });
      return;
    }
    select(next);
  });
  wrap.addEventListener("pointercancel", function () { swipe = null; });

  /* --- „Porównaj": opens the comparison overlay ----------------------------------------
     Until 19.09.2026 the link only scrolled to the section and moved focus to the table. Since
     20.09 (review comment in the preview) the whole comparison lives in a lightbox, so the
     link carries `data-lightbox-open="porownanie"` and module 45 owns the click: it calls
     preventDefault, opens the dialog and puts focus inside it. Nothing to do here – the
     reference to the link stays only for the tab bar layout above. Without JS the href still
     leads to the block, which then stands in the flow of the page. */
  void compare;

  /* --- start ------------------------------------------------------------------------ */
  panels.forEach(function (p, i) {
    p.setAttribute("role", "tabpanel");
    p.setAttribute("aria-labelledby", tabs[i].id);
    p.tabIndex = 0;
    if (i === cur) p.setAttribute("data-on", ""); else p.removeAttribute("data-on");
    p.inert = i !== cur;
  });
  tabs.forEach(function (t, i) { t.tabIndex = i === cur ? 0 : -1; });
  placeThumb(false);
  if (window.ResizeObserver) new ResizeObserver(function () { placeThumb(false); }).observe(seg);
  else window.addEventListener("resize", function () { placeThumb(false); });
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { placeThumb(false); });

  /* --- deep link #gama-<family> -------------------------------------------------------
     The bus calls this at start (instant), once more after load (layout settled), on
     hashchange (Back/Forward) and after an in-page link click. Handled = selected + scrolled. */
  CX5.onHash(function (hash, instant) {
    var m = /^#gama-([a-z]+)$/.exec(hash || "");
    var i = m ? keys.indexOf(m[1]) : -1;
    if (i === -1) return false;
    select(i, { instant: instant });
    CX5.scrollTo(show.getBoundingClientRect().top + window.scrollY, instant || reducedMQ.matches ? "auto" : "smooth");
    return true;
  });
})();
