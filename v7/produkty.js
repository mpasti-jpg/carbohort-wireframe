/* ===== 00 · Produkty Carbohort – V5 · page layer (produkty.js) ==================
   Base = CARBOMAT ECO bus (carbomat.js 00) + hash routing for in-page links (spec §3).
   Jedna szyna dla wszystkich sekcji: moduły rejestrują swoje funkcje scroll /
   resize, a szyna woła je w jednym przebiegu (rAF-throttled). Wspólne pomocniki:
   $, $$, panelSet (animacja wysokości paneli), reducedMQ, wideMQ, clamp, lerp.
   Każda sekcja to osobny moduł (IIFE) niżej w pliku – nic nie wycieka globalnie
   poza `CX5`. ========================================================== */
window.CX5 = (function () {
  "use strict";
  var doc = document;
  doc.documentElement.classList.add("cx-js");
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  var reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var wideMQ = window.matchMedia("(min-width: 900px)");
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  /* scroll-driven helpers: motion is on only on wide screens without reduced motion */
  function motionOn() { return wideMQ.matches && !reducedMQ.matches; }

  /* --- Rozwijanie/zwijanie paneli (wspólne dla wszystkich akordeonów) --------
     Animujemy wysokość mierzoną z wnętrza panelu; po otwarciu wracamy na `auto`. */
  function panelSet(panel, open, instant) {
    if (!panel) return;
    var inner = panel.firstElementChild;
    panel.inert = !open;
    if (!inner) return;
    if (instant || reducedMQ.matches) {
      panel.style.transition = "none";
      panel.style.height = open ? "auto" : "0px";
      void panel.offsetHeight;
      panel.style.transition = "";
      return;
    }
    var from = panel.getBoundingClientRect().height;
    var to = open ? inner.getBoundingClientRect().height : 0;
    if (Math.abs(from - to) < 0.5) { if (open) panel.style.height = "auto"; return; }
    panel.style.height = from + "px";
    void panel.offsetHeight;
    panel.style.height = to + "px";
    if (open) {
      var done = function (e) {
        if (e.target !== panel || e.propertyName !== "height") return;
        panel.removeEventListener("transitionend", done);
        if (!panel.inert) panel.style.height = "auto";
      };
      panel.addEventListener("transitionend", done);
    }
  }

  /* --- Szyna scroll/resize ---------------------------------------------------- */
  var scrollFns = [], resizeFns = [], ticking = false, started = false;

  /* --- Wysokość menu serwisu -> --cx-navbar-h --------------------------------
     Menu nie jest przyklejone, ale hero ma zająć dokładnie pierwszy ekran pod
     nim, więc jego wysokość mierzymy i udostępniamy wszystkim sekcjom. */
  var navbarEl = null;
  function measureNavbar() {
    if (!navbarEl || !navbarEl.isConnected) navbarEl = doc.querySelector(".wf-navbar");
    var h = navbarEl ? Math.round(navbarEl.getBoundingClientRect().height) : 0;
    doc.documentElement.style.setProperty("--cx-navbar-h", h + "px");
  }
  resizeFns.push(measureNavbar);
  function register(m) {
    if (m.scroll) scrollFns.push(m.scroll);
    if (m.resize) resizeFns.push(m.resize);
    if (started && m.resize) m.resize();
    if (started && m.scroll) m.scroll();
  }
  function runScroll() {
    ticking = false;
    for (var i = 0; i < scrollFns.length; i++) scrollFns[i]();
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(runScroll);
  }
  function onResize() {
    for (var i = 0; i < resizeFns.length; i++) resizeFns[i]();
    runScroll();
  }
  function start() {
    if (started) return;
    started = true;
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    if (wideMQ.addEventListener) { wideMQ.addEventListener("change", onResize); reducedMQ.addEventListener("change", onResize); }
    if (window.location.hash) {
      routeHash(window.location.hash, true);
      if (doc.readyState !== "complete") {
        /* Chrome keeps the hash element in view until load and can override a module's own
           scroll, so route once more on load – unless the reader has already interacted.
           Passive one-shot listeners only detect intent; nothing intercepts scrolling. */
        var interacted = false;
        var mark = function () { interacted = true; };
        ["pointerdown", "keydown", "touchstart", "wheel"].forEach(function (t) {
          window.addEventListener(t, mark, { once: true, passive: true });
        });
        window.addEventListener("load", function () {
          if (!interacted) routeHash(window.location.hash, true);
        }, { once: true });
      }
    }
  }

  /* --- Hash routing shared by modules (spec §3) ------------------------------
     Modules register fn(hash, instant) and return true when they handled the scroll
     themselves (a Gama family tab, a path in "Wg potrzeby", an FAQ answer). The bus
     calls them at start (instant), once more on load (layout settled), on hashchange
     (Back/Forward) and after its own pushState when an in-page link is clicked. */
  var hashFns = [];
  function onHash(fn) { hashFns.push(fn); }
  function runHash(hash, instant) {
    var handled = false;
    for (var i = 0; i < hashFns.length; i++) {
      try { if (hashFns[i](hash, !!instant)) handled = true; }
      catch (err) { if (window.console) window.console.error(err); }
    }
    return handled;
  }
  function hashTarget(hash) {
    if (!hash || hash.length < 2) return null;
    try { return doc.getElementById(decodeURIComponent(hash.slice(1))); } catch (err) { return null; }
  }
  function scrollToHash(hash, instant) {
    var el = hashTarget(hash);
    if (!el) return false;
    var margin = parseFloat(window.getComputedStyle(el).scrollMarginTop) || 0;
    api.scrollTo(el.getBoundingClientRect().top + window.scrollY - margin, instant || reducedMQ.matches ? "auto" : "smooth");
    return true;
  }
  function routeHash(hash, instant) {
    if (!runHash(hash, instant)) scrollToHash(hash, instant);
  }
  function pushHash(hash) {
    if (window.location.hash !== hash && window.history && window.history.pushState) window.history.pushState(null, "", hash);
  }
  /* In-page links: smooth scroll through Lenis, working Back/Forward, modules first.
     Dots handle their own clicks; modifier and middle clicks keep browser behaviour. */
  doc.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a || a.hasAttribute("data-dot")) return;
    var hash = a.getAttribute("href");
    var el = hashTarget(hash);
    if (!el) {
      /* no element carries this id – only a module may know the hash (e.g. #gama-humic) */
      if (!runHash(hash, false)) return;
      e.preventDefault();
      pushHash(hash);
      return;
    }
    e.preventDefault();
    pushHash(hash);
    var handled = runHash(hash, false);
    if (!handled) scrollToHash(hash, false);
    /* keyboard activation: move focus with the reader unless a module already moved it */
    if (e.detail === 0 && doc.activeElement === a) {
      if (!el.hasAttribute("tabindex")) { el.setAttribute("tabindex", "-1"); el.setAttribute("data-anchor-focus", ""); }
      el.focus({ preventScroll: true });
    }
  });
  window.addEventListener("hashchange", function () { routeHash(window.location.hash, false); });

  /* --- Dok dr. Jurka: pojawia się po zejściu z hero ------------------------- */
  var dock = $("[data-jurek-dock]");
  var hero = doc.getElementById("hero");
  function updateDock() {
    if (!dock || !hero) return;
    var past = window.scrollY > hero.offsetHeight * 0.6;
    dock.classList.toggle("cx-dockhide", !past);
  }
  scrollFns.push(updateDock);

  /* Programmatic scroll: through the inertia layer (Lenis) when it is active, else native.
     `behavior` "auto" forces an instant native jump. */
  var api = { $: $, $$: $$, panelSet: panelSet, reducedMQ: reducedMQ, wideMQ: wideMQ,
              clamp: clamp, lerp: lerp, motionOn: motionOn, register: register, start: start, requestScroll: onScroll, lenis: null,
              onHash: onHash, routeHash: routeHash, scrollToHash: scrollToHash };
  api.scrollTo = function (top, behavior) {
    if (api.lenis && behavior !== "auto") { api.lenis.scrollTo(Math.round(top), { duration: 1.1 }); return; }
    window.scrollTo({ top: Math.round(top), behavior: behavior || "smooth" });
  };
  return api;
})();

/* ===== 05 · Scroll inertia (Lenis) =========================================
   A slight lag between the wheel and the page, as on serverobotics.com/robot.
   Desktop only (>= 900 px) and only without prefers-reduced-motion; touch stays
   native; without the CDN script the page simply scrolls natively. Lenis moves
   the real window scroll, so sticky layouts and the CX5 scroll bus keep working. */
(function () {
  "use strict";
  var instance = null;
  function make() {
    if (instance || !window.Lenis) return;
    instance = new window.Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true, syncTouch: false, autoRaf: true });
    CX5.lenis = instance;
    document.documentElement.classList.add("cx-lenis");
  }
  function drop() {
    if (!instance) return;
    instance.destroy(); instance = null; CX5.lenis = null;
    document.documentElement.classList.remove("cx-lenis");
  }
  function sync() { if (CX5.motionOn()) make(); else drop(); }
  sync();
  if (CX5.wideMQ.addEventListener) { CX5.wideMQ.addEventListener("change", sync); CX5.reducedMQ.addEventListener("change", sync); }
})();

/* ===== 10 · Nawigacja kropkowa: scrollspy + płynne przewijanie do rozdziału ===== */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$, reducedMQ = CX5.reducedMQ;
  var dotLinks = $$("[data-dot]");
  var chapters = $$("[data-chapter]");
  if (!dotLinks.length) return;

  /* active chapter = the last one whose top edge is above 40 % of the viewport */
  function updateSpy() {
    var mid = window.innerHeight * 0.4;
    var current = null;
    chapters.forEach(function (sec) {
      if (sec.getBoundingClientRect().top < mid) current = sec.getAttribute("data-chapter");
    });
    dotLinks.forEach(function (a) {
      var on = a.getAttribute("data-dot") === current;
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }

  /* nothing is pinned to the top edge any more, so anchors need no offset */
  dotLinks.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = doc.getElementById(a.getAttribute("href").slice(1));
      if (!target) return;
      e.preventDefault();
      CX5.scrollTo(Math.round(target.getBoundingClientRect().top + window.scrollY), reducedMQ.matches ? "auto" : "smooth");
    });
  });

  CX5.register({ scroll: updateSpy });
})();

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

  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(i); });
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

  /* --- „Porównaj": focus only ---------------------------------------------------------
     No preventDefault – the shared handler in 00-base.js pushes #porownanie and scrolls.
     This listener runs first (on the link, before the delegated document listener) and moves
     focus to the table container without scrolling; the shared handler then leaves focus alone,
     because it is no longer on the link. Modifier and middle clicks stay ordinary links. */
  var tableBox = doc.querySelector(".c5pr-tabwrap");
  if (compare && tableBox) {
    compare.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!doc.getElementById("porownanie")) return;
      tableBox.focus({ preventScroll: true });
    });
  }

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

/* ===== 40 · Porównanie: „pokaż w tabeli" (spec §7) =====
   Own content element since 14.09.2026 – no video, so the module only drives the three note
   cards under the table: data-cols = one or two column keys, aria-pressed on the button,
   .is-pick on <col> and <th>, a short flash of the header, on a narrow screen the table container
   scrolls sideways so the picked column(s) sit in the free part next to the pinned parameter
   column, then the page scrolls up to the table. A second click on the pressed button clears the
   highlight. The mechanism is local to this section – the Gama „Porównaj" link only scrolls here
   and moves focus to the table (spec §6.3). */
(function () {
  "use strict";
  var doc = document;
  var sec = CX5.$("[data-techsheet]");
  if (!sec) return;
  var table = CX5.$(".c5pr-tab", sec);
  var box = CX5.$(".c5pr-tabwrap", sec);
  var buttons = CX5.$$("[data-cols]", sec);
  if (!table || !box || !buttons.length) return;
  function motion() { return !CX5.reducedMQ.matches; }
  function token(name, fallback) {
    return window.getComputedStyle(doc.documentElement).getPropertyValue(name).trim() || fallback;
  }

  function markColumns(list, flash) {
    CX5.$$("[data-col]", table).forEach(function (el) {
      el.classList.toggle("is-pick", list.indexOf(el.getAttribute("data-col")) !== -1);
    });
    var heads = list.map(function (key) { return table.querySelector('thead th[data-col="' + key + '"]'); })
                    .filter(Boolean);
    if (!heads.length) return;
    /* narrow screen: centre the picked column(s) in the part of the container that the pinned
       parameter column leaves free (a pair wider than that starts at its first column) */
    if (box.scrollWidth > box.clientWidth) {
      var first = table.querySelector("thead th:first-child");
      var pinned = first && window.getComputedStyle(first).position === "sticky" ? first.offsetWidth : 0;
      var free = box.clientWidth - pinned;
      var l = Infinity, r = -Infinity;
      heads.forEach(function (th) { l = Math.min(l, th.offsetLeft); r = Math.max(r, th.offsetLeft + th.offsetWidth); });
      var left = r - l > free ? l - pinned : (l + r) / 2 - pinned - free / 2;
      left = CX5.clamp(left, 0, box.scrollWidth - box.clientWidth);
      if (box.scrollTo) box.scrollTo({ left: left, behavior: motion() ? "smooth" : "auto" });
      else box.scrollLeft = left;
    }
    if (flash && motion()) {
      var from = token("--w-gray-300", "#d4d4d4"), to = token("--w-gray-100", "#f5f5f5");
      heads.forEach(function (th) {
        if (th.animate) th.animate([{ backgroundColor: from }, { backgroundColor: to }], { duration: 1400, delay: 450, easing: "ease-out" });
      });
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var on = b.getAttribute("aria-pressed") === "true";
      buttons.forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
      if (on) { markColumns([], false); return; }          /* second click clears the highlight */
      b.setAttribute("aria-pressed", "true");
      markColumns(b.getAttribute("data-cols").split(/\s+/), true);
      /* the table sits above the cards: scroll up to it, 30 px above its top edge */
      var gutter = parseFloat(window.getComputedStyle(doc.documentElement).getPropertyValue("--c5-gutter")) || 0;
      CX5.scrollTo(box.getBoundingClientRect().top + window.scrollY - gutter, motion() ? "smooth" : "auto");
    });
  });
})();

/* ===== 50 · Wg potrzeby – paths as two columns (spec §8.2) ==================
   One DOM (rows: list button + panel with the path card), three layouts:
   · no JS, or before this module runs: ten cards in a grid, list buttons hidden (CSS default);
   · >= 900 px – tabs (data-paths="tabs"): vertical tablist in column 1, every panel in one
     sticky cell of column 2. Hovering a button previews its path after 80 ms and the list
     falls back to the chosen path when the pointer leaves it; click / Enter / Space choose;
     ArrowUp/ArrowDown (wrapping) and Home/End choose and move focus (APG tabs, automatic
     activation; shortcuts with Alt/Ctrl/Meta pass through). Using a previewed description
     (a click in it, or focus moving into it) chooses that path;
   · < 900 px – accordion (data-paths="acc"): one panel open at a time, the first one open at
     start, a click on the open row closes it.
   Roles follow the layout and are swapped on CX5.wideMQ "change". #sciezka-NN (goal links,
   a typed hash, Back/Forward) chooses the path and scrolls through CX5.onHash: in tabs to the
   top of the list so the list and the sticky description start together, in the accordion to
   the row button. The goal cards (§8.1) need no script: :target in CSS, reveal in module 72. */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;
  var root = $("[data-paths]");
  var list = root ? $(".c5pr-paths__list", root) : null;
  if (!list) return;
  var rows = $$(".c5pr-paths__row", list);
  var tabs = rows.map(function (r) { return $(".c5pr-paths__tab", r); });
  var panels = rows.map(function (r) { return $(".c5pr-paths__panel", r); });
  var n = rows.length;
  if (!n || tabs.indexOf(null) !== -1 || panels.indexOf(null) !== -1) return;   /* incomplete markup – the cards stay */

  var hoverMQ = window.matchMedia("(hover: hover)");
  var PATH_HASH = /^#sciezka-(\d\d)$/;
  var mode = "";          /* "tabs" | "acc" */
  var cur = 0;            /* chosen path */
  var shown = 0;          /* tabs: path on display (the chosen one or a hover preview) */
  var accOpen = true;     /* accordion: the chosen row is open */
  var hoverTimer = 0;

  list.style.setProperty("--c5pr-n", String(n));

  function gutter() {
    return parseFloat(window.getComputedStyle(doc.documentElement).getPropertyValue("--c5-gutter")) || 0;
  }
  function focusInPanels() {
    var a = doc.activeElement;
    return !!(a && a.closest && root.contains(a) && a.closest(".c5pr-paths__panel"));
  }

  /* --- tabs ------------------------------------------------------------------ */
  function setShown(i) {
    shown = i;
    panels.forEach(function (p, j) {
      var on = j === i;
      if (on) p.setAttribute("data-on", ""); else p.removeAttribute("data-on");
      p.inert = !on;      /* a fading panel leaves hit-testing and the tab order at once */
      tabs[j].classList.toggle("is-on", on);
    });
  }
  function choose(i) {
    window.clearTimeout(hoverTimer);
    cur = i;
    tabs.forEach(function (t, j) {
      t.setAttribute("aria-selected", j === i ? "true" : "false");
      t.tabIndex = j === i ? 0 : -1;
    });
    setShown(i);
  }
  /* Where #sciezka-NN lands (px below the top edge). Tabs: the list top goes to the line where
     the description sticks, so both start together; accordion: the row button, one gutter down. */
  function landing(i) {
    if (mode === "tabs") return Math.max(gutter(), parseFloat(window.getComputedStyle(panels[i]).top) || 0);
    return gutter();
  }
  /* While the page loads, the browser keeps a fragment target in view and wins over any earlier
     script scroll – so the native jump to the panel must land exactly where CX5.onHash puts it.
     Tabs: the panel's static top is the list top; accordion: the panel starts under its button. */
  function anchorMargins() {
    panels.forEach(function (p, j) {
      var m = mode === "tabs" ? landing(j) : p.getBoundingClientRect().top - tabs[j].getBoundingClientRect().top + gutter();
      p.style.scrollMarginTop = Math.round(m) + "px";
    });
  }
  /* tabs: a panel taller than the window sticks by its bottom edge (CSS min() reads --c5pr-ph) */
  function measure() {
    if (mode === "tabs") panels.forEach(function (p) { p.style.setProperty("--c5pr-ph", p.offsetHeight + "px"); });
    if (mode) anchorMargins();
  }

  /* --- accordion --------------------------------------------------------------- */
  function paintAcc(instant, instantAbove) {
    panels.forEach(function (p, j) {
      var on = accOpen && j === cur;
      tabs[j].setAttribute("aria-expanded", on ? "true" : "false");
      CX5.panelSet(p, on, !!(instant || (instantAbove && j < cur)));
    });
  }

  /* the reader chose path i (click, key or hash) */
  function commit(i, o) {
    o = o || {};
    i = ((i % n) + n) % n;
    if (mode === "tabs") { choose(i); return; }
    accOpen = o.toggle && i === cur ? !accOpen : true;      /* a click on the open row closes it */
    cur = i;
    paintAcc(o.instant, o.instantAbove);
  }

  /* --- layout switch: roles and state for tabs or accordion ----------------------- */
  function setMode(next) {
    if (next === mode) return;
    mode = next;
    window.clearTimeout(hoverTimer);
    var tabsMode = next === "tabs";
    root.setAttribute("data-paths", next);
    if (tabsMode) {
      list.setAttribute("role", "tablist");
      list.setAttribute("aria-orientation", "vertical");
    } else {
      list.removeAttribute("role");
      list.removeAttribute("aria-orientation");
    }
    rows.forEach(function (r) {
      if (tabsMode) r.setAttribute("role", "none"); else r.removeAttribute("role");
    });
    tabs.forEach(function (t, j) {
      t.setAttribute("aria-controls", panels[j].id);
      if (tabsMode) {
        t.setAttribute("role", "tab");
        t.removeAttribute("aria-expanded");
      } else {
        t.removeAttribute("role");
        t.removeAttribute("aria-selected");
        t.removeAttribute("tabindex");
        t.classList.remove("is-on");
      }
    });
    panels.forEach(function (p, j) {
      p.setAttribute("aria-labelledby", tabs[j].id);
      if (tabsMode) {
        p.setAttribute("role", "tabpanel");
        p.tabIndex = 0;
        p.style.transition = "";
        p.style.height = "";          /* drop the accordion's inline height */
      } else {
        p.setAttribute("role", "region");
        p.removeAttribute("tabindex");
        p.removeAttribute("data-on");
        p.style.removeProperty("--c5pr-ph");
      }
    });
    if (tabsMode) {
      choose(cur);
    } else {
      accOpen = true;
      paintAcc(true);
    }
    measure();
  }
  function sync() { setMode(CX5.wideMQ.matches ? "tabs" : "acc"); }

  /* --- events --------------------------------------------------------------------- */
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () {
      if (mode === "tabs") commit(i);
      else if (mode === "acc") commit(i, { toggle: true });
    });
    t.addEventListener("focus", function () {
      if (mode !== "tabs") return;
      window.clearTimeout(hoverTimer);
      setShown(i);
    });
    t.addEventListener("mouseenter", function () {
      if (mode !== "tabs" || !hoverMQ.matches || focusInPanels()) return;
      window.clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(function () { setShown(i); }, 80);   /* no flicker when the pointer crosses the list */
    });
    t.addEventListener("mouseleave", function () { window.clearTimeout(hoverTimer); });
  });
  list.addEventListener("mouseleave", function () {
    window.clearTimeout(hoverTimer);
    if (mode === "tabs" && shown !== cur) setShown(cur);
  });
  panels.forEach(function (p, j) {
    function take() { if (mode === "tabs" && j === shown && j !== cur) commit(j); }
    p.addEventListener("click", take);
    p.addEventListener("focusin", take);
  });
  list.addEventListener("keydown", function (e) {
    if (mode !== "tabs" || e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target && e.target.closest ? e.target.closest(".c5pr-paths__tab") : null;
    var i = tabs.indexOf(t);
    if (i === -1) return;             /* keys inside a description keep their native job */
    var next;
    if (e.key === "ArrowDown") next = i + 1;
    else if (e.key === "ArrowUp") next = i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    commit(next);
    tabs[cur].focus();
  });

  /* --- #sciezka-NN ------------------------------------------------------------------ */
  CX5.onHash(function (hash, instant) {
    var m = PATH_HASH.exec(hash || "");
    var i = m ? parseInt(m[1], 10) - 1 : -1;
    if (i < 0 || i >= n) return false;
    var a = doc.activeElement;
    var fromLink = !!(a && a.tagName === "A" && a.getAttribute("href") === hash);
    var top;
    if (mode === "tabs") {
      commit(i);
      top = list.getBoundingClientRect().top + window.scrollY - landing(i);
    } else {
      /* rows above close without animation, so the row's final place is known now */
      commit(i, { instant: instant, instantAbove: true });
      top = tabs[i].getBoundingClientRect().top + window.scrollY - landing(i);
    }
    CX5.scrollTo(top, instant || CX5.reducedMQ.matches ? "auto" : "smooth");
    if (fromLink) tabs[i].focus({ preventScroll: true });   /* the next Tab continues from the chosen path */
    return true;
  });

  /* --- start ------------------------------------------------------------------------ */
  sync();
  if (CX5.wideMQ.addEventListener) CX5.wideMQ.addEventListener("change", sync);
  else if (CX5.wideMQ.addListener) CX5.wideMQ.addListener(sync);
  CX5.register({ resize: measure });
  if (window.ResizeObserver) {
    var ro = new window.ResizeObserver(function () { if (mode === "tabs") measure(); });
    panels.forEach(function (p) { ro.observe(p); });
  }
})();

/* ===== 60 · Jak działają: five topics on a scroll-driven scene (spec §9, port of CARBOMAT ECO 50) =====
   The track is tall (stage + 5 × step), the stage inside is sticky. Position on the axis =
   scroll position; the loop reads only the track rectangle and writes the result into a
   custom property, classes and data attributes. Below 900 px, with reduced motion and
   without JS the section is static – everything visible (CSS). The background layers
   (photos and the placeholder of topic 05) switch with the same data-on as the
   illustrations. */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var sec = $("[data-facts]");
  if (!sec) return;
  var track = $("[data-facts-track]", sec);
  var stage = $(".c5-facts-stage", sec);
  var facts = $$(".c5-fact", sec);
  var vizs = $$("[data-fact-viz]", sec);
  var bgs = $$("[data-fact-bg]", sec);
  var bar = $(".c5-facts-progress", sec);
  if (!track || !stage || !facts.length) return;
  var STEPS = facts.length;
  var stageH = 0, idx = -1;

  function show(i) {
    if (i === idx) return;
    idx = i;
    facts.forEach(function (f, n) { f.classList.toggle("is-on", n === i); });
    vizs.forEach(function (v) { v.setAttribute("data-on", +v.getAttribute("data-fact-viz") === i + 1 ? "true" : "false"); });
    /* the background layer of the panel switches together with the description */
    bgs.forEach(function (b) { b.setAttribute("data-on", +b.getAttribute("data-fact-bg") === i + 1 ? "true" : "false"); });
    if (bar) bar.setAttribute("aria-valuenow", String(i + 1));
  }
  function measure() {
    if (!CX5.motionOn()) {
      track.style.height = "";
      sec.style.removeProperty("--facts-p");
      stageH = 0;
      idx = -1;
      show(0);
      return;
    }
    stageH = stage.offsetHeight;
    /* step = 80 % of the window height, never less than 480 px */
    var step = Math.max(480, Math.round(window.innerHeight * 0.8));
    track.style.height = (stageH + step * STEPS) + "px";
  }
  function update() {
    if (!stageH) return;
    var r = track.getBoundingClientRect();
    var span = r.height - stageH;
    var p = span > 0 ? clamp(-r.top / span, 0, 1) : 0;
    sec.style.setProperty("--facts-p", p.toFixed(4));
    show(Math.min(STEPS - 1, Math.floor(p * STEPS)));
  }
  CX5.register({ scroll: update, resize: measure });
})();

/* ===== 65 · Co dają: rows opened by the scroll (spec §10, port of CARBOMAT ECO 80 "Sezon") =====
   The heading pins for the cycle, the block enters in the page flow with row 1 open, sticks
   by its bottom edge, the scroll opens rows 2 and 3, then the whole block leaves. Pin only
   with CX5.motionOn(); below 900 px and with reduced motion it is a click accordion with
   row 1 open; without JS every row is open (CSS). The one-shot fade-in of the rows uses the
   same gates. The PRO band of ECO 80 lives in 80-pro.js. */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$, panelSet = CX5.panelSet;

  var seasonPin = $("[data-season-pin]");
  if (!seasonPin) return;
  var seasonBlock = $(".c5-season", seasonPin);
  var seasonSpacer = $("[data-season-spacer]", seasonPin);
  var seasonHead = $("[data-season-head]", seasonPin);
  var seasonHeadWrap = $("[data-season-headwrap]", seasonPin);
  var seasonBtns = $$("[data-season]", seasonPin);
  var N = seasonBtns.length;
  if (!seasonBlock || !N) return;
  var seasonIdx = null;
  var seasonOpenH = 0;
  var seasonStep = 0;
  var seasonHeadTop = 0;
  var seasonHeadH = 0;
  var seasonBlockTop = 0;   /* used sticky `top` of the block (px) */
  var seasonSpacerH = 0;    /* flow room reserved for the absolute header */
  var pinMode = null;       /* layout of the last resize: true = pin, false = accordion */

  function seasonPinOn() { return CX5.motionOn(); }
  /* One state per row: data-open drives both the description panel and the scene animation
     (square + packshot), so the scene behaves the same in the pin and on click. */
  function setSeason(idx, instant) {
    if (seasonIdx === idx) return;
    seasonIdx = idx;
    /* A closed row reserves no room for the square, so the block height depends on the open
       row. The measurement must see the target state – transitions off while switching hard. */
    if (instant) seasonBlock.classList.add("c5-season--instant");
    seasonBtns.forEach(function (b, i) {
      var panel = doc.getElementById(b.getAttribute("aria-controls"));
      var row = b.closest(".c5-season__row");
      var on = i === idx;
      b.setAttribute("aria-expanded", on ? "true" : "false");
      if (row) row.setAttribute("data-open", on ? "true" : "false");
      panelSet(panel, on, instant);
    });
    if (instant) {
      void seasonBlock.offsetHeight;
      seasonBlock.classList.remove("c5-season--instant");
    }
  }
  /* Block height with one row open: the tallest of the states, so the bottom edge cannot
     drift when a taller row opens. Measured with --c5-season-h cleared, otherwise
     min-height would answer instead. */
  function measureSeasonBlock() {
    var keep = seasonIdx, max = 0, i;
    seasonBlock.style.removeProperty("--c5-season-h");
    for (i = 0; i < N; i++) {
      seasonIdx = null;
      setSeason(i, true);
      max = Math.max(max, seasonBlock.offsetHeight);
    }
    seasonIdx = null;
    setSeason(keep === null || keep < 0 ? 0 : keep, true);
    seasonOpenH = max;
    seasonBlock.style.setProperty("--c5-season-h", max + "px");
  }
  /* The block starts `seasonSpacerH` below the container top, so it reaches its sticky
     offset when the container top is that much above it. */
  function seasonBlockPinC() { return seasonBlockTop - seasonSpacerH; }
  /* The header sits at the top of the pin container (absolute wrapper), so it sticks exactly
     when the container top reaches its sticky offset. */
  function measureSeasonHead() {
    if (!seasonHead) return;
    seasonHeadTop = parseFloat(window.getComputedStyle(seasonHead).top) || 0;
    seasonHeadH = seasonHead.offsetHeight;
  }
  function seasonHeadStickC() { return seasonHead ? seasonHeadTop : Infinity; }
  function seasonSpan() { return seasonStep * N; }
  /* The cycle starts once BOTH happened (block at the bottom, header at the top), i.e. at
     the smaller container `top`. */
  function seasonStartTop() { return Math.min(seasonBlockPinC(), seasonHeadStickC()); }
  function sizeSeasonPin() {
    if (!seasonPinOn()) {
      seasonPin.style.height = "";
      if (seasonSpacer) seasonSpacer.style.height = "";
      if (seasonHeadWrap) seasonHeadWrap.style.height = "";
      seasonBlock.style.removeProperty("--c5-season-h");
      seasonBlock.style.removeProperty("--c5-season-headroom");
      /* back to row 1 only when leaving the pin (or at start) – a mobile resize while
         scrolling (address bar) must not close the row the reader opened */
      if (pinMode !== false) { seasonIdx = null; setSeason(0, true); }
      pinMode = false;
      return;
    }
    pinMode = true;
    measureSeasonBlock();                           /* measured in the "one row open" state */
    measureSeasonHead();
    /* floor for the sticky offset: the block must never slide under the header */
    seasonBlock.style.setProperty("--c5-season-headroom", Math.round(seasonHeadTop + seasonHeadH) + "px");
    seasonBlockTop = parseFloat(window.getComputedStyle(seasonBlock).top) || 0;
    /* spacer = header box + its CSS margin (the gap between the lead and row 1 while the
       block still runs with the page) */
    if (seasonSpacer) {
      seasonSpacer.style.height = Math.round(seasonHeadH) + "px";
      seasonSpacerH = seasonSpacer.offsetHeight +
        (parseFloat(window.getComputedStyle(seasonSpacer).marginBottom) || 0);
    } else {
      seasonSpacerH = Math.round(seasonHeadH);
    }
    seasonStep = Math.max(260, Math.round(window.innerHeight * 0.55));
    /* The container is sized so the block lets go exactly at the end of the last phase:
       track = sticky top + block height + N phases - cycle start. */
    var span = seasonSpan();
    var startC = seasonStartTop();
    seasonPin.style.height = Math.round(seasonBlockTop + seasonOpenH + span - startC) + "px";
    /* the header wrapper ends where the block lets go – from there its bottom edge pushes
       the header up (it leaves, it does not vanish) */
    if (seasonHeadWrap) {
      seasonHeadWrap.style.height = Math.round(seasonHeadTop + seasonHeadH - startC + span) + "px";
    }
  }
  function updateSeason() {
    if (!seasonPinOn() || !seasonOpenH) return;
    var span = seasonSpan();
    var p = span > 0 ? (seasonStartTop() - seasonPin.getBoundingClientRect().top) / span : 0;
    if (p < 0) { setSeason(0); return; }             /* row 1 stays open before the pin */
    setSeason(Math.min(N - 1, Math.floor(p * N)));
  }
  seasonBtns.forEach(function (btn, i) {
    btn.addEventListener("click", function () {
      if (seasonPinOn()) {
        /* scroll to the middle of this row's phase – the scroll opens it by itself */
        var pinTopDoc = seasonPin.getBoundingClientRect().top + window.scrollY;
        var target = pinTopDoc - seasonStartTop() + ((i + 0.5) / N) * seasonSpan();
        CX5.scrollTo(Math.round(target), "smooth");
      } else if (btn.getAttribute("aria-expanded") !== "true") {
        setSeason(i);
      }
    });
  });

  $$(".c5-season__row", seasonBlock).forEach(function (r) {
    panelSet($(".c5-season__panel", r), r.getAttribute("data-open") === "true", true);
  });

  /* Entrance of the rows: one-shot fade-in from below, the first time the block shows up on
     screen. Timed (CSS transition), not tied to the scroll offset. Without
     IntersectionObserver or without scroll mechanics the rows are simply there. */
  function releaseRows() { seasonBlock.classList.add("is-in"); }
  if (!("IntersectionObserver" in window) || !CX5.motionOn()) {
    releaseRows();
  } else {
    var seasonIO = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        releaseRows();
        seasonIO.disconnect();
        return;
      }
    }, { threshold: 0.2 });
    seasonIO.observe(seasonBlock);
    var releaseIfStatic = function () { if (!CX5.motionOn()) { seasonIO.disconnect(); releaseRows(); } };
    if (CX5.wideMQ.addEventListener) {
      CX5.wideMQ.addEventListener("change", releaseIfStatic);
      CX5.reducedMQ.addEventListener("change", releaseIfStatic);
    }
  }

  CX5.register({ scroll: updateSeason, resize: sizeSeasonPin });
})();

/* ===== 72 · Reveal: one-shot fade-in for sections without a pattern analogue (spec §0.3, pattern §4a) =====
   Port of carbohumic.js 72, generic for the whole page (sections 50, 65, 70, 75): every
   container marked `data-reveal` gets `is-in` the first time it shows up on screen and its
   children run in, 90 ms apart (CSS timing in 00-base, not the scroll offset).
   The start state lives in CSS behind the same gates as CX5.motionOn() (>= 900 px, no
   reduced motion), so on a phone, with reduced motion or without JS everything is simply
   there. `is-in` is set in those cases too, so a later resize into the wide layout cannot
   leave anything hidden. The observer uses a bottom margin instead of an area threshold,
   so a container taller than the window reveals as reliably as a small card. */
(function () {
  "use strict";
  var groups = CX5.$$("[data-reveal]");
  if (!groups.length) return;

  function showAll() {
    groups.forEach(function (g) { g.classList.add("is-in"); });
  }
  if (!("IntersectionObserver" in window) || !CX5.motionOn()) {
    showAll();
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { threshold: 0, rootMargin: "0px 0px -12% 0px" });
  groups.forEach(function (g) { io.observe(g); });

  /* switching to a narrow window or to reduced motion later: release everything at once,
     so nothing stays hidden if the reader comes back to the wide layout */
  function releaseIfStatic() {
    if (CX5.motionOn()) return;
    io.disconnect();
    showAll();
  }
  if (CX5.wideMQ.addEventListener) {
    CX5.wideMQ.addEventListener("change", releaseIfStatic);
    CX5.reducedMQ.addEventListener("change", releaseIfStatic);
  }
})();

/* ===== 80 · Pas PRO: the media grows while scrolling (spec §13, updatePro of CARBOMAT ECO 80) =====
   Delayed start: the media holds .5 while the top edge of the band is above 75 % of the
   window height, then grows to 1 by the time that edge is 10 % from the top (ease-out
   cubic). The loop reads only the band rectangle and writes one custom property. Without
   CX5.motionOn() the property is removed and the frame stands static (CSS). */
(function () {
  "use strict";
  var pro = CX5.$("[data-pro]");
  if (!pro) return;
  function updatePro() {
    if (!CX5.motionOn()) { pro.style.removeProperty("--pro-s"); return; }
    var h = window.innerHeight;
    var r = pro.getBoundingClientRect();
    var p = CX5.clamp((0.75 * h - r.top) / (0.65 * h), 0, 1);
    var e = 1 - Math.pow(1 - p, 3);
    pro.style.setProperty("--pro-s", (0.5 + 0.5 * e).toFixed(4));
  }
  CX5.register({ scroll: updatePro, resize: updatePro });
})();

/* ===== 90 · FAQ – accordion, one question open at a time (spec §14) ==========
   Port of carbomat-humic.js 90. Every item starts collapsed. An anchor on an item
   (#pytanie-humic-carbohumic) or on its answer panel (#faq-1…9) opens that item and scrolls
   to its question row – a native jump to a collapsed (height 0) panel would land beside it.
   The hash arrives through CX5.onHash (page start = instant, in-page links, Back/Forward),
   so this module has no hashchange or link-click listeners of its own; the hash stays in
   the address, the accordion itself never changes it. Without JS the answers stay open (CSS). */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$, panelSet = CX5.panelSet;
  var faqItems = $$(".c5-faq__item");
  if (!faqItems.length) return;

  /* one item open at a time; `instant` skips the height animation (page start);
     `instantAbove` collapses the items above `item` at once, so its final place is known now */
  function openOnly(item, instant, instantAbove) {
    var at = faqItems.indexOf(item);
    faqItems.forEach(function (it, j) {
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
      openOnly(open ? null : item);
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

CX5.start();
