/* ===== CARBOHUMIC – V5 · page layer (carbohumic.js) ==========================
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
  }

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
              clamp: clamp, lerp: lerp, motionOn: motionOn, register: register, start: start, requestScroll: onScroll, lenis: null };
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

/* ===== 30 · Parametry: wideo w tle (spec §13.3, §14.4) =====
   §14.4 zdjęło wjazd ramki od dołu (`--params-in`) – kadrem jest cała sekcja,
   a film stoi w niej od pierwszego piksela (sticky + `overflow:clip` w CSS).
   Zostaje jedno zadanie dla JS: pilnować, żeby pętla nie chodziła przy
   ograniczonym ruchu. */
(function () {
  "use strict";
  var sec = CX5.$("[data-params]");
  if (!sec) return;

  /* Reduced motion: the loop must not run – drop autoplay, stop on frame 0 so the
     poster stays. Re-checked when the preference changes mid-session. */
  var video = CX5.$("video.c5-params__media", sec);
  if (!video) return;
  function syncVideo() {
    if (CX5.reducedMQ.matches) {
      video.removeAttribute("autoplay");
      video.pause();
      try { video.currentTime = 0; } catch (e) { /* metadata not ready yet */ }
    } else if (video.paused) {
      var played = video.play();
      if (played && played.catch) played.catch(function () { /* autoplay blocked – poster stays */ });
    }
  }
  syncVideo();
  if (CX5.reducedMQ.addEventListener) CX5.reducedMQ.addEventListener("change", syncVideo);
  video.addEventListener("loadedmetadata", syncVideo);
})();

/* ===== 40 · Który dla mnie: taby przewijające do bloków ===== */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$, reducedMQ = CX5.reducedMQ;
  var tabsBar = $("[data-tabs]");
  var tabBtns = $$("[data-tab]");
  var varBlocks = $$("[data-variant-block]");
  if (tabsBar) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var block = doc.getElementById(btn.getAttribute("aria-controls"));
        if (!block) return;
        /* the tab bar is the only thing pinned to the top edge here */
        var offset = tabsBar.offsetHeight + 16;
        CX5.scrollTo(Math.round(block.getBoundingClientRect().top + window.scrollY - offset), reducedMQ.matches ? "auto" : "smooth");
      });
    });
  }
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

/* ===== 48 · Skala czasu: oś rysuje się przy przewijaniu =====================
   Wypełnienie linii jedzie od lewej do prawej razem z pozycją scrolla, a
   przystanek zapala się (`is-on`), gdy wypełnienie dojdzie do jego znacznika.
   Progi zapalenia to zmierzone pozycje znaczników na linii (środki kolumn,
   czyli około (i+.5)/N) – mierzymy je przy każdym resize, żeby odstęp siatki
   nie rozjeżdżał się z progiem. Poniżej 900 px, przy ograniczonym ruchu
   i bez JS linia jest pełna, a cała treść widoczna (CSS). ================= */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var axis = $("[data-time]");
  if (!axis) return;
  var track = $(".c5hu-time__track", axis);
  var stops = $$(".c5hu-time__stop", axis);
  if (!track || !stops.length) return;
  var N = stops.length;
  /* how far along the line every marker sits; the grid gap makes the column
     centres slightly tighter than (i+.5)/N, so measure instead of assuming */
  var at = stops.map(function (s, i) { return (i + 0.5) / N; });

  function light(p) {
    for (var i = 0; i < N; i++) stops[i].classList.toggle("is-on", p >= at[i]);
  }
  function update() {
    if (!CX5.motionOn()) return;
    var vh = window.innerHeight || 1;
    var top = axis.getBoundingClientRect().top;
    /* the axis draws itself over half a viewport, starting when it is 85 % down the window */
    var raw = clamp((0.85 * vh - top) / (0.5 * vh), 0, 1);
    var p = raw * raw * (3 - 2 * raw); /* smoothstep: soft start and finish */
    axis.style.setProperty("--time-p", p.toFixed(4));
    light(p);
  }
  function measure() {
    var i;
    if (!CX5.motionOn()) {
      /* static layout: hand the line back to the CSS default (full) */
      axis.style.removeProperty("--time-p");
      for (i = 0; i < N; i++) stops[i].classList.remove("is-on");
      return;
    }
    var line = track.getBoundingClientRect();
    if (line.width <= 0) return;
    for (i = 0; i < N; i++) {
      var dot = $(".c5hu-time__dot", stops[i]);
      if (!dot) continue;
      var r = dot.getBoundingClientRect();
      at[i] = CX5.clamp((r.left + r.width / 2 - line.left) / line.width, 0, 1);
    }
  }
  CX5.register({ scroll: update, resize: measure });
})();

/* ===== 50 · Czym jest: pięć punktów na scenie sterowanej przewijaniem =====
   Tor jest wysoki (100svh + 5 × krok), scena w środku jest sticky. Pozycja na
   osi = pozycja scrolla; w pętli czytamy wyłącznie prostokąt toru, a wynik
   zapisujemy w custom property i klasach. Poniżej 900 px, przy ograniczonym
   ruchu i bez JS sekcja jest statyczna – cała treść widoczna (CSS). */
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
    /* photo layer of the panel switches with the description (spec §13.5) */
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
    /* krok = 80 % wysokości okna, nie mniej niż 480 px */
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

/* ===== 60 · Jak stosować: dwie przypięte sceny produktowe, N kadrów ==========
   One track per product: 100svh of sticky stage + runway(N) screens, where N is
   the number of frames read from the DOM (here four terms per product). The
   CARBOMAT ECO pattern had exactly two frames and wrote --k1/--k2 on the
   <article>; the generalisation writes the per-frame numbers on the frame
   elements themselves, so neither this module nor the stylesheet knows how many
   frames a product has.
   The scroll loop reads a single getBoundingClientRect() of the track, turns it
   into p ∈ [0,1] and writes custom properties; CSS does every interpolation
   (60-jak-stosowac.css). NOTHING here is timed: the bar, the photo, the veil,
   the note, the tabs and every card are pure functions of p, so the whole
   choreography scrubs with the wheel, holds when the wheel holds and reverses
   when the user scrolls back. The only discrete writes are keyword properties
   (--ovis, --bvis) and aria-pressed, which keep invisible things out of the tab
   order and off the mouse.
   Scrolling is never intercepted; below 900 px and with reduced motion the
   module does nothing at all and the section stays a plain stack. */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var arts = $$(".c5-use");
  if (!arts.length) return;

  /* Runway per product, in viewport heights (spec §4): one screen of intro
     (bar docks, photo grows, veil + tabs + first card), .9 screen of hold per
     frame, .35 screen per switch and .5 screen of outro. N = 4 -> 6.15 screens,
     so two products make ~13 screens – the same length CARBOMAT ECO reaches
     with two frames each. */
  /* HOLD .75 (not .9): with four frames per product the section ran to ~16 screens;
     .75 keeps ~600 px of reading per frame at 800 px windows and trims ~1.2 screens per product */
  var INTRO = 1.0, HOLD = .75, SWITCH = .35, OUTRO = .5;
  /* the intro keeps the pattern's proportions (A 0–.14, C .14–.24 of a 5.5
     track = .583 / .417 of the intro): bar docks at A_END, the photo starts
     growing at GROW_A, veil + tabs run UI_A…UI_B, the first card K_A…1 */
  var A_END = .583, GROW_A = .208, UI_A = .583, UI_B = .792, K_A = .917;
  var LIFT = 40;                    /* px a card travels in and out             */
  var EXIT = 24;                    /* px the last card drifts up while leaving */
  var PAR = 3;                      /* parallax of a photo layer, in %          */

  function ease(t) { return t * t * (3 - 2 * t); }                       /* smoothstep inside a phase */
  function seg(p, a, b) { return ease(clamp((p - a) / (b - a), 0, 1)); } /* eased progress of phase a…b */
  /* write a custom property only when it really changes – the cache lives on
     the element, so a frame that moved nothing costs no style invalidation */
  function put(el, name, val) {
    var k = "_cx" + name;
    if (el[k] === val) return;
    el[k] = val;
    el.style.setProperty(name, val);
  }

  var items = arts.map(function (art) {
    var crops = $$("[data-use-crop]", art),
        layers = $$("[data-use-layer]", art),
        n = crops.length,
        run = INTRO + HOLD * n + SWITCH * (n - 1) + OUTRO,
        holds = [], mids = {}, i, start;
    for (i = 0; i < n; i++) {
      start = INTRO + i * (HOLD + SWITCH);
      holds.push({ start: start / run, end: (start + HOLD) / run });
      mids[crops[i].getAttribute("data-use-crop")] = (start + HOLD / 2) / run;
      /* how many tab lines stand below this one – the tabs are a single column
         growing upwards from the bottom edge of the scene */
      crops[i].style.setProperty("--tabi", String(n - 1 - i));
    }
    return {
      art: art, track: $("[data-use-track]", art), stage: $(".c5-use__stage", art),
      crops: crops, layers: layers, n: n, run: run, holds: holds, mids: mids,
      barEnd: A_END * INTRO / run,
      growIn: GROW_A * INTRO / run,
      uiIn: UI_A * INTRO / run, uiSet: UI_B * INTRO / run,
      k1In: K_A * INTRO / run, k1Set: INTRO / run,
      eIn: (run - OUTRO) / run, eTxt: (run - OUTRO / 2) / run,
      stageH: 0, p: -1, act: -1
    };
  }).filter(function (it) { return it.n > 0 && it.track && it.stage; });

  function layout() {
    items.forEach(function (it) {
      it.p = -1;
      if (!CX5.motionOn()) { it.track.style.height = ""; it.stageH = 0; return; }
      it.track.style.height = "calc(100svh + " + Math.round(window.innerHeight * it.run) + "px)";
      it.stageH = it.stage.offsetHeight;
    });
  }

  /* Continuous frame position f ∈ [0, n-1]: every switch contributes its own
     eased 0→1 and the switches never overlap, so the sum is the frame the scene
     is on (integer = a hold, fraction = a switch in progress). */
  function frameAt(it, p) {
    var f = 0;
    for (var k = 1; k < it.n; k++) f += seg(p, it.holds[k - 1].end, it.holds[k].start);
    return f;
  }

  function apply(it, p) {
    var t  = seg(p, 0, it.barEnd),               /* A – packshot into the bar, bar retracts */
        gr = seg(p, it.growIn, it.barEnd),       /* A – photo grows from the bottom edge    */
        et = seg(p, it.eIn, it.eTxt),            /* E – writing goes first                  */
        ev = seg(p, it.eIn, 1),                  /* E – and only then the veil              */
        ui = seg(p, it.uiIn, it.uiSet) * (1 - et),   /* tabs + note + cards presence        */
        vl = seg(p, it.uiIn, it.uiSet) * (1 - ev),   /* veil: rises with the tabs (C),
                                                        falls on its own to p=1 (E)         */
        f  = frameAt(it, p), i, d, inp, out, layer, crop;
    put(it.art, "--t", t.toFixed(4));
    put(it.art, "--grow", (.5 + .5 * gr).toFixed(4));
    put(it.art, "--ui", ui.toFixed(4));
    put(it.art, "--vl", vl.toFixed(4));

    for (i = 0; i < it.n; i++) {
      d = f - i;                                  /* distance from this frame, in frames */
      layer = it.layers[i];
      /* cross-fade: the frame being left and the frame arriving share the move */
      put(layer, "--o", clamp(1 - Math.abs(d), 0, 1).toFixed(4));
      /* the frame left behind drifts up, the one still to come waits below */
      put(layer, "--par", clamp(-PAR * d, -PAR, PAR).toFixed(3));

      crop = it.crops[i];
      /* card i: first one rises at the end of the intro, every other one in the
         second half of the switch that brings its frame in */
      inp = i === 0 ? seg(p, it.k1In, it.k1Set)
                    : seg(p, (it.holds[i - 1].end + it.holds[i].start) / 2, it.holds[i].start);
      /* card i leaves upwards in the first half of the next switch; the last
         card leaves in phase E instead, drifting a little less */
      out = i === it.n - 1 ? et
                           : seg(p, it.holds[i].end, (it.holds[i].end + it.holds[i + 1].start) / 2);
      put(crop, "--k", (inp * (1 - out)).toFixed(4));
      put(crop, "--ky", (LIFT * (1 - inp) - (i === it.n - 1 ? EXIT : LIFT) * out).toFixed(2));
      /* the active tab is fully lit, the others sit at .45 – interpolated */
      put(crop, "--tabo", (.45 + .55 * clamp(1 - Math.abs(d), 0, 1)).toFixed(4));
    }

    /* keywords and labels – touched only when they really change */
    var act = clamp(Math.round(f), 0, it.n - 1);
    if (act !== it.act) {
      it.act = act;
      it.crops.forEach(function (g, k) {
        var tab = $("[data-use-tab]", g);
        if (tab) tab.setAttribute("aria-pressed", k === act ? "true" : "false");
      });
    }
    put(it.art, "--ovis", ui > .02 ? "visible" : "hidden");   /* overlay out of the a11y tree while invisible */
    put(it.art, "--bvis", t > .5 ? "visible" : "hidden");     /* same for the shop button before it fades in */
  }

  function frame() {
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (!it.stageH) continue;
      var r = it.track.getBoundingClientRect();
      var span = r.height - it.stageH;
      if (span <= 0) continue;
      var p = clamp(-r.top / span, 0, 1);
      if (Math.abs(p - it.p) < 0.0004) continue;    /* nothing moved – skip the writes */
      it.p = p;
      apply(it, p);
    }
  }

  /* Tabs stay clickable: a click scrolls to the middle of the matching hold
     (static layout: to the matching frame). Nothing is trapped, no wheel. */
  items.forEach(function (it) {
    $$("[data-use-tab]", it.art).forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute("data-use-tab");
        var soft = CX5.reducedMQ.matches ? "auto" : "smooth";
        if (!it.stageH) {
          var layer = $('[data-use-layer="' + key + '"]', it.art);
          if (layer) layer.scrollIntoView({ behavior: soft, block: "start" });
          return;
        }
        var r = it.track.getBoundingClientRect();
        var span = r.height - it.stageH;
        var top = r.top + window.scrollY + (it.mids[key] || 0) * span;
        CX5.scrollTo(Math.round(top), soft);
      });
    });
  });

  CX5.register({ scroll: frame, resize: layout });
})();

/* ===== 70 · Dawki domowe: lekki parallax zdjęcia (spec §5, wzorzec §13.6) ===
   Kadr jest o 14 % wyższy od przycinającej go ramki, więc mieści przesunięcie
   bez odsłaniania krawędzi (dziś stoi w nim placeholder – mechanika czeka na
   docelowe zdjęcie). `--dose-par` idzie od -6 do 0 (procent wysokości kadru),
   gdy sekcja przejeżdża przez ekran – kadr jedzie wolniej niż strona.
   W pętli czytamy tylko prostokąt ramki i zapisujemy jedną custom property.
   Poniżej 900 px i przy ograniczonym ruchu parallaksu nie ma – kadr stoi
   wyśrodkowany (wartość domyślna w CSS). */
(function () {
  "use strict";
  var wrap = CX5.$("[data-dose-media]");
  if (!wrap) return;

  function update() {
    if (!CX5.motionOn()) { wrap.style.removeProperty("--dose-par"); return; }
    var h = window.innerHeight;
    var r = wrap.getBoundingClientRect();
    var span = h + r.height;
    var p = span > 0 ? CX5.clamp((h - r.top) / span, 0, 1) : 0;
    wrap.style.setProperty("--dose-par", CX5.lerp(-6, 0, p).toFixed(3));
  }
  CX5.register({ scroll: update, resize: update });
})();

/* ===== 72 · „Z czym łączyć" – lista z podglądem (spec §11.5) ================
   Five names on the left, one panel area on the right. Hovering, focusing or
   clicking a name shows its panel; the rest stay in the same grid cell with
   `visibility:hidden`, so the box keeps the height of the tallest panel and
   nothing jumps. Not scroll-driven, so it also runs with reduced motion.
   Below 900 px the layout is static (every name followed by its own example
   line and description), so the tab roles would lie – they are stripped there
   and restored when the window gets wide again. Without JS the page keeps the
   same static layout, which is why the CSS start state sits behind `.cx-js`.
   ======================================================================== */
(function () {
  "use strict";
  var host = CX5.$("[data-mixlist]");
  if (!host) return;
  var nav = CX5.$(".c5hu-mixlist__nav", host);
  var tabs = CX5.$$("[data-mix-tab]", host);
  var panels = CX5.$$("[data-mix-panel]", host);
  if (!nav || tabs.length < 2 || tabs.length !== panels.length) return;

  var active = -1;
  var live = null;   /* null = not decided yet, true = tabs, false = static list */

  function select(i) {
    if (i === active) return;
    active = i;
    tabs.forEach(function (t, n) {
      var on = n === i;
      t.classList.toggle("is-on", on);
      if (live) t.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach(function (p, n) { p.classList.toggle("is-on", n === i); });
  }

  /* Roles follow the layout: they describe a tab list only while one panel at
     a time is visible. */
  function setMode(on) {
    if (on === live) return;
    live = on;
    if (on) {
      nav.setAttribute("role", "tablist");
      tabs.forEach(function (t, n) {
        t.setAttribute("role", "tab");
        t.setAttribute("aria-selected", n === active ? "true" : "false");
      });
      panels.forEach(function (p) { p.setAttribute("role", "tabpanel"); });
    } else {
      nav.removeAttribute("role");
      tabs.forEach(function (t) { t.removeAttribute("role"); t.removeAttribute("aria-selected"); });
      panels.forEach(function (p) { p.removeAttribute("role"); });
    }
  }

  tabs.forEach(function (t, n) {
    t.addEventListener("mouseenter", function () { if (live) select(n); });
    t.addEventListener("focus", function () { if (live) select(n); });
    t.addEventListener("click", function () { select(n); });
  });

  select(0);
  CX5.register({ resize: function () { setMode(CX5.wideMQ.matches); } });
})();

/* ===== 72 · Wejście elementów w sekcjach bez analogu we wzorcu (spec §6) ====
   One-shot fade-in from below for every container marked `data-reveal`: cards
   („Z czym łączyć", „Czego unikamy"), steps, tiles („Jaka gleba") and the table
   rows („Doglebowo czy nalistnie"). The first time a container shows up on
   screen it gets `is-in` and its children run in, 90 ms apart (CSS timing, not
   the scroll offset – the scroll drives nothing here).
   The start state lives in CSS behind the same gates as CX5.motionOn()
   (>=900 px, no reduced motion), so with reduced motion, on a phone or without
   JS the elements are simply there. `is-in` is still set in those cases, so a
   later resize into the wide layout cannot leave anything hidden. */
(function () {
  "use strict";
  var groups = CX5.$$("[data-reveal]");
  if (!groups.length) return;

  function showAll() {
    groups.forEach(function (g) { g.classList.add("is-in"); });
  }
  if (!("IntersectionObserver" in window) || CX5.reducedMQ.matches || !CX5.motionOn()) {
    showAll();
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  groups.forEach(function (g) { io.observe(g); });
})();

/* ===== 72 · „Prosta zasada przygotowania mieszaniny" – stos kart (spec §11.6)
   Port of the protocol stack from carbomat-mata.js (module 60).
   The stack itself is plain CSS (`position:sticky`, every card stopping 16 px
   lower than the one before). This module only adds the finish: for each card
   it computes `--c5hu-stack-p` (0 -> 1: how far the next card already covers
   it) and writes it on the element – the rest happens in CSS (card `scale`,
   photo `brightness`). The value comes from the scroll position alone, with no
   timed transitions, so the picture stops when the wheel stops.
   Geometry is read from the flow (container rect + offsetHeight), not from the
   cards' own `getBoundingClientRect()`: the cards are scaled, so their rects
   lie – the container's does not.
   Below 900 px and with reduced motion this module does nothing (CSS does not
   pin the cards there either). ========================================== */
(function () {
  "use strict";
  var host = CX5.$("[data-stack]");
  if (!host) return;
  var cards = CX5.$$(".c5hu-stack__card", host);
  if (cards.length < 2) return;
  var geo = null;

  function measure() {
    if (!CX5.motionOn()) {
      geo = null;
      cards.forEach(function (c) { c.style.removeProperty("--c5hu-stack-p"); });
      return;
    }
    var gap = parseFloat(getComputedStyle(host).rowGap) || 0;
    var top = host.getBoundingClientRect().top + window.scrollY;   /* flow top of card 1 */
    var flow = [], hs = [], sticky = [], acc = 0;
    cards.forEach(function (c) {
      var h = c.offsetHeight;                                       /* layout height, transform-proof */
      flow.push(top + acc);
      hs.push(h);
      sticky.push(parseFloat(getComputedStyle(c).top) || 0);
      acc += h + gap;
    });
    geo = { flow: flow, h: hs, sticky: sticky };
  }

  function paint() {
    if (!geo) return;
    var y = window.scrollY;
    for (var i = 0; i < cards.length; i++) {
      var p = 0;
      if (i < cards.length - 1) {
        /* where both cards actually sit: flow position until they stick */
        var mine = Math.max(geo.flow[i] - y, geo.sticky[i]);
        var next = Math.max(geo.flow[i + 1] - y, geo.sticky[i + 1]);
        /* full cover = the next card reached its own stop, 16 px below ours */
        var span = geo.sticky[i] + geo.h[i] - geo.sticky[i + 1];
        if (span > 0) p = CX5.clamp((mine + geo.h[i] - next) / span, 0, 1);
      }
      cards[i].style.setProperty("--c5hu-stack-p", p.toFixed(3));
    }
  }

  CX5.register({ resize: measure, scroll: paint });
})();

/* ===== 80 · Pas PRO: kadr rośnie przy przewijaniu (wzór sensiq.co) =========
   Delayed start (§14.6): the media holds .5 while the top edge of the band is
   above 75 % of the window height, then grows to 1 by the time that edge is
   10 % from the top – easing as in §13.8 (start from half size).
   W pętli tylko prostokąt pasa i jedna custom property. Sekcji „Sezon" ta
   strona nie ma (terminy są kadrami „Jak stosować"), więc moduł to sam pas. */
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

/* ===== 90 · FAQ: akordeon – naraz otwarte jest jedno pytanie ===== */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, panelSet = CX5.panelSet;
  var faqItems = $$(".c5-faq__item");
  faqItems.forEach(function (item) {
    var btn = $(".c5-faq__q", item);
    var ans = $(".c5-faq__a", item);
    if (!btn || !ans) return;
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      faqItems.forEach(function (it) {
        var b = $(".c5-faq__q", it);
        var a = $(".c5-faq__a", it);
        var on = it === item && !open;
        if (b) b.setAttribute("aria-expanded", on ? "true" : "false");
        panelSet(a, on);
        if (on) { it.setAttribute("data-open", ""); } else { it.removeAttribute("data-open"); }
      });
    });
  });

  $$(".c5-faq__item").forEach(function (it) {
    panelSet($(".c5-faq__a", it), it.hasAttribute("data-open"), true);
  });
})();

CX5.start();
