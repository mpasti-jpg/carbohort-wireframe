/* ===== 00 · Warstwa wspólna – szyna CX5 (rejestr: ce-rejestr.js) ============
   The one bus every page of the pattern rides: modules register their scroll /
   resize functions and the bus calls them in a single rAF-throttled pass.
   Shared helpers: $, $$, panelSet (animated panel height), reducedMQ, wideMQ,
   clamp, lerp, motionOn, scrollTo, and the hash routing for in-page links
   (onHash / routeHash / scrollToHash). Also here: the advisor dock, the reveal
   of [data-reveal] and the scroll inertia (Lenis).
   Merged from produkty.js 00 + 05 (the fullest copy of the bus – the other six
   pages carried the same code without the hash routing), carbohumic.js 72,
   produkty.js 72, prochnica-plus.js 02 and carbomat-humic.js 35 (reveal).
   Nothing leaks globally except `CX5`. The bus starts itself on
   DOMContentLoaded, so a page never calls CX5.start() – a second call is
   harmless anyway (guard `started`). ======================================= */
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
  /* The dock hides while the opening block is on screen. Pages without an
     `#hero` (Kontakt, the article template) opt in with `data-dock-hero`
     on their opening section (15.09). */
  var hero = doc.getElementById("hero") || doc.querySelector("[data-dock-hero]");
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


/* ===== 02 · Ujawnianie przy przewijaniu ([data-reveal]) =====================
   One-shot fade-in of the blocks that have no analogue in the pattern. This
   module only adds `is-in` when the container first shows up on screen; WHAT is
   hidden before that is decided by CSS, and the three pages that use the layer
   hide different things:
     · Carbohumic and Produkty hide the CHILDREN of [data-reveal] (00-reveal.css),
     · CARBOMAT HUMIC hides the [data-reveal] element itself and staggers a
       group with --i (its own rule in carbomat-humic.css),
     · Próchnica+ animates only what starts BELOW the first screen, and the
       start state is the class `pp-reveal` this module adds (prochnica-plus.css).
   Hence the union here: --i for elements inside a [data-reveal-group], the
   `pp-reveal` start class for what begins below the fold and inside the window
   horizontally (a track scrolled sideways must never stay invisible), `is-in`
   on entry, plus a scroll-bus safety net and beforeprint. With reduced motion
   or without IntersectionObserver everything simply gets `is-in` at once.
   `CX5.reveal(els)` stays exported: a module that reveals elements of its own
   (CARBOMAT HUMIC 40) keeps working unchanged. No [data-reveal] -> no-op. */
(function () {
  "use strict";
  var $$ = CX5.$$;
  var IO = window.IntersectionObserver;
  var els = $$("[data-reveal]");
  /* a page without the layer still gets the API – a module may add elements later */
  if (!els.length) {
    CX5.reveal = function (more) {
      Array.prototype.slice.call(more || []).forEach(function (el) { el.classList.add("is-in"); });
    };
    return;
  }

  function showAll() { els.forEach(function (el) { el.classList.add("is-in"); }); }

  /* --i = position inside [data-reveal-group]; drives the stagger in CSS */
  els.forEach(function (el) {
    var group = el.closest && el.closest("[data-reveal-group]");
    if (group) el.style.setProperty("--i", $$("[data-reveal]", group).indexOf(el));
  });

  /* with reduced motion or without the observer nothing is ever hidden – every
     block gets `is-in` at once, and so does anything revealed later */
  if (!IO || CX5.reducedMQ.matches) {
    showAll();
    CX5.reveal = function (more) {
      Array.prototype.slice.call(more || []).forEach(function (el) { el.classList.add("is-in"); });
    };
    return;
  }

  var pending = els.slice();
  function show(el) {
    el.classList.add("is-in");
    io.unobserve(el);
    var i = pending.indexOf(el);
    if (i > -1) pending.splice(i, 1);
  }
  var io = new IO(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) show(e.target); });
  }, { threshold: 0, rootMargin: "0px 0px -12% 0px" });

  function observe(list) {
    list.forEach(function (el) {
      var r = el.getBoundingClientRect();
      /* only what starts below the fold gets the JS start state – a block that
         is already on screen (or outside the window horizontally) must stay
         visible whatever happens next */
      if (r.top > window.innerHeight && r.left < window.innerWidth && r.right > 0) el.classList.add("pp-reveal");
      if (pending.indexOf(el) < 0) pending.push(el);
      io.observe(el);
    });
  }
  observe(els);

  /* Safety net: if IntersectionObserver stays silent (background tab, preview
     without a render pass, print), the content MUST still appear. */
  function scan() {
    if (!pending.length) return;
    var h = window.innerHeight * 0.94;
    pending.slice().forEach(function (el) {
      var b = el.getBoundingClientRect();
      if (b.top < h && b.bottom > 0) show(el);
    });
  }
  CX5.register({ scroll: scan });
  window.addEventListener("beforeprint", function () { pending.slice().forEach(show); });

  /* switching to a narrow window or to reduced motion later: release everything
     at once, so nothing stays hidden if the reader comes back */
  function releaseIfStatic() {
    if (CX5.motionOn()) return;
    io.disconnect();
    showAll();
  }
  if (CX5.wideMQ.addEventListener) {
    CX5.wideMQ.addEventListener("change", releaseIfStatic);
    CX5.reducedMQ.addEventListener("change", releaseIfStatic);
  }

  /* a module that adds its own elements later reveals them through the bus */
  CX5.reveal = function (more) {
    more = Array.prototype.slice.call(more || []);
    if (!more.length) return;
    more.forEach(function (el) {
      var group = el.closest && el.closest("[data-reveal-group]");
      if (group) el.style.setProperty("--i", $$("[data-reveal]", group).indexOf(el));
    });
    if (CX5.reducedMQ.matches) { more.forEach(function (el) { el.classList.add("is-in"); }); return; }
    observe(more);
  };
})();

/* ===== 99 · Auto-start szyny ===============================================
   Every module of the page has registered by the time the document is parsed,
   so the bus starts on DOMContentLoaded (or right away if it already fired).
   `CX5.start()` guards itself, so an extra call from a page changes nothing. */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () { CX5.start(); });
} else {
  CX5.start();
}
