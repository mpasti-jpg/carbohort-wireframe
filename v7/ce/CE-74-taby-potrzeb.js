/* ===== CE-74 · Taby potrzeb z kartami produktów (rejestr: ce-rejestr.js) ==================================
   Prefix: c5-nt. Module of the shared layer.
   One IIFE, a no-op when its markup is absent.

   ARIA tabs: click, arrows, Home/End, roving tabindex, deep links
     #produkty-gleba / #produkty-rosliny / #produkty-bez-gleby through
     CX5.onHash. The active marker slides, the old panel fades, the cards of
     the new one cascade 70 ms apart and the packshots rise 24 px off the floor
     line.

   The bus CX5 (ce/00-base.js) starts itself: this file never calls CX5.start()
   and never defines CX5. Comments in English, never the em dash, and never the
   literal end-of-script tag. ============================================= */
(function () {
  "use strict";
  var doc = document;
  var root = CX5.$("[data-nt]");
  if (!root) return;

  var seg = CX5.$(".c5-nt__seg", root);
  var thumb = CX5.$(".c5-nt__thumb", root);
  var wrap = CX5.$(".c5-nt__panels", root);
  var tabs = CX5.$$('[role="tab"]', root);
  var panels = tabs.map(function (t) { return doc.getElementById(t.getAttribute("aria-controls")); });
  if (!seg || !thumb || !wrap || tabs.length < 2 || panels.indexOf(null) !== -1) return;

  var reducedMQ = CX5.reducedMQ;
  var EASE = "cubic-bezier(0.2, 0, 0, 1)";        /* = --w-ease of the kit */
  var EASE_IN = "cubic-bezier(0.4, 0, 1, 1)";
  var RISE = 24;                                   /* how far a packshot comes up */
  var STEP = 70;                                   /* cascade between two cards */

  function motion() {
    return typeof Element.prototype.animate === "function" && !reducedMQ.matches;
  }
  function anim(el, frames, o) {
    if (!el || !motion()) return null;
    o.id = "c5-nt";
    if (!o.easing) o.easing = EASE;
    if (!o.fill) o.fill = "backwards";
    return el.animate(frames, o);
  }

  var cur = 0;
  tabs.forEach(function (t, i) { if (t.getAttribute("aria-selected") === "true") cur = i; });

  /* --- marker of the chosen position ------------------------------------ */
  function placeThumb(animate) {
    var t = tabs[cur];
    if (!animate) thumb.style.transition = "none";
    thumb.style.width = t.offsetWidth + "px";
    thumb.style.height = t.offsetHeight + "px";
    thumb.style.transform = "translate(" + t.offsetLeft + "px," + t.offsetTop + "px)";
    if (!animate) { void thumb.offsetWidth; thumb.style.transition = ""; }
    seg.setAttribute("data-ready", "");
  }

  /* --- entry of a panel -------------------------------------------------- */
  function enter(p, delay) {
    var side = CX5.$(".c5-nt__side", p);
    var cards = CX5.$$(".c5-nt__card, .c5-nt__wide", p);
    anim(side, [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }],
      { duration: 440, delay: delay });
    cards.forEach(function (card, i) {
      anim(card, [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }],
        { duration: 520, delay: delay + i * STEP });
      anim(CX5.$(".c5-nt__img", card),
        [{ opacity: 0, transform: "translateY(" + RISE + "px)" }, { opacity: 1, transform: "none" }],
        { duration: 620, delay: delay + i * STEP + 40 });
    });
  }
  function running(p) {
    if (!p.getAnimations) return false;
    return p.getAnimations({ subtree: true }).some(function (a) {
      return a.id === "c5-nt" && a.playState === "running";
    });
  }
  function stopAll() {
    if (root.getAnimations) {
      root.getAnimations({ subtree: true }).forEach(function (a) { if (a.id === "c5-nt") a.cancel(); });
    }
    panels.forEach(function (p) { p.removeAttribute("data-leaving"); });
    wrap.style.overflowY = "";
  }

  /* --- choosing a need --------------------------------------------------- */
  function select(i, o) {
    o = o || {};
    var n = tabs.length;
    i = ((i % n) + n) % n;
    if (i === cur) return;
    var from = panels[cur];
    var to = panels[i];
    var dir = o.dir || (i > cur ? 1 : -1);
    /* measured before the running animation is cut: on a fast second click the
       height starts from the one on screen and nothing under the section jumps */
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
    wrap.style.overflowY = "clip";   /* vertical only: a leaving panel keeps its sides */
    if (!busy) {
      var leave = anim(from, [{ opacity: 1 }, { opacity: 0, transform: "translateX(" + (-24 * dir) + "px)" }],
        { duration: 160, easing: EASE_IN, fill: "forwards" });
      leave.onfinish = function () { from.removeAttribute("data-leaving"); leave.cancel(); };
    }
    var grow = anim(wrap, [{ height: h0 + "px" }, { height: h1 + "px" }], { duration: 480, fill: "none" });
    grow.onfinish = function () { wrap.style.overflowY = ""; };
    enter(to, 110);
  }

  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(i); });
  });
  seg.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;      /* leave browser shortcuts alone */
    var k = e.key;
    var i;
    var dir;
    if (k === "ArrowRight" || k === "ArrowDown") { i = cur + 1; dir = 1; }
    else if (k === "ArrowLeft" || k === "ArrowUp") { i = cur - 1; dir = -1; }
    else if (k === "Home") { i = 0; }
    else if (k === "End") { i = tabs.length - 1; }
    else return;
    e.preventDefault();
    select(i, { dir: dir });
    tabs[cur].focus();
  });

  /* --- start ------------------------------------------------------------- */
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

  /* --- deep link #produkty-<need> -----------------------------------------
     The bus calls this at start (instant), once more on load, on hashchange
     (Back / Forward) and after a click on an in-page link. Handled = the tab
     is chosen and the section scrolled, so the bus leaves the scroll alone. */
  var ids = panels.map(function (p) { return "#" + p.id; });
  CX5.onHash(function (hash, instant) {
    var i = ids.indexOf(hash || "");
    if (i === -1) return false;
    select(i, { instant: instant });
    CX5.scrollTo(root.getBoundingClientRect().top + window.scrollY,
      instant || reducedMQ.matches ? "auto" : "smooth");
    return true;
  });
})();
