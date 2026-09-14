/* ===== CARBOMAT ECO – V5 · page layer (carbomat.js) ==========================
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
  /* the bar leaves as soon as the next chapter shows up from below (spec §13.4);
     below 900 px it is not pinned at all, so it never hides */
  var nextSec = doc.getElementById("czym-jest");
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

/* ===== 60 · Jak stosować: dwie przypięte sceny produktowe =====
   One track per product: 100svh of sticky stage + 5.5 screens of runway, so
   both readable holds last long enough in pixels, not only in p.
   The scroll loop reads a single getBoundingClientRect() of the track, turns
   it into p ∈ [0,1] and writes custom properties on the <article>; CSS does
   every interpolation (60-jak-stosowac.css). NOTHING here is timed: the bar,
   the photo, the shade, the tabs and both description cards are pure
   functions of p, so the whole choreography scrubs with the wheel, holds when
   the wheel holds and reverses when the user scrolls back. The only discrete
   writes are keyword properties (--ovis, --bvis) and aria-pressed, which keep
   invisible things out of the tab order and off the mouse.
   Scrolling is never intercepted; below 900 px and with reduced motion the
   module does nothing at all and the section stays a plain stack. */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var arts = $$(".c5-use");
  if (!arts.length) return;

  var RUNWAY = 5.5;                 /* runway per product, in viewport heights */
  /* phase edges on p – §14.8: A 0–.14 · C .14–.24 · hold · D .56–.64 · hold · E .92–1 */
  var BAR_END  = .14,               /* packshot docks into the 110 px bar        */
      GROW_IN  = .05, GROW_OUT = .14,   /* photo .5 → 1, anchored at the bottom  */
      UI_IN    = .14, UI_SET  = .19,    /* shade + both tabs                     */
      K1_IN    = .18, K1_SET  = .24,    /* card „gruntowe" rises 40 px           */
      SW_IN    = .56, SW_OUT  = .64,    /* frames cross-fade                     */
      K1_OUT   = .56, K1_GONE = .60,    /* card „gruntowe" leaves upwards        */
      K2_IN    = .60, K2_SET  = .64,    /* card „doniczkowe" rises 40 px         */
      E_IN     = .92, E_TXT   = .96;    /* E – the writing leaves first (.92–.96),
                                           the veil lifts over the whole .92–1,
                                           so nothing is read on a bright frame */
  var HOLD = { gruntowe: .40, doniczkowe: .78 };  /* middle of each hold – where a tab click lands */
  var SWITCH = K2_IN;               /* p at which the active crop flips (labels, aria) */
  var LIFT = 40;                    /* px a description card travels in and out  */
  var EXIT = 24;                    /* px the last card drifts up while it leaves */

  function ease(t) { return t * t * (3 - 2 * t); }                       /* smoothstep inside a phase */
  function seg(p, a, b) { return ease(clamp((p - a) / (b - a), 0, 1)); } /* eased progress of phase a…b */

  var items = arts.map(function (art) {
    return {
      art: art,
      track: $("[data-use-track]", art),
      stage: $(".c5-use__stage", art),
      crops: $$("[data-use-crop]", art),
      stageH: 0, p: -1, act: -1, ovis: null, bvis: null
    };
  });

  function layout() {
    var run = Math.round(window.innerHeight * RUNWAY);
    items.forEach(function (it) {
      it.p = -1;
      if (!CX5.motionOn()) { it.track.style.height = ""; it.stageH = 0; return; }
      it.track.style.height = "calc(100svh + " + run + "px)";
      it.stageH = it.stage.offsetHeight;
    });
  }

  function apply(it, p) {
    var st = it.art.style,
        t  = seg(p, 0, BAR_END),            /* A – packshot into the bar, bar retracts  */
        gr = seg(p, GROW_IN, GROW_OUT),     /* A – photo grows from the bottom edge     */
        et = seg(p, E_IN, E_TXT),           /* E – tabs and card go first               */
        ev = seg(p, E_IN, 1),               /* E – and only then the veil, geometry stays */
        ui = seg(p, UI_IN, UI_SET) * (1 - et),       /* tabs + card presence            */
        vl = seg(p, UI_IN, UI_SET) * (1 - ev),       /* veil: rises with the tabs (C),
                                                        falls on its own to p=1 (E)     */
        sw = seg(p, SW_IN, SW_OUT),                  /* D – gruntowe → doniczkowe       */
        k1in = seg(p, K1_IN, K1_SET), k1out = seg(p, K1_OUT, K1_GONE),
        k2in = seg(p, K2_IN, K2_SET);
    st.setProperty("--t", t.toFixed(4));
    st.setProperty("--grow", (.5 + .5 * gr).toFixed(4));
    st.setProperty("--ui", ui.toFixed(4));
    st.setProperty("--vl", vl.toFixed(4));
    st.setProperty("--sw", sw.toFixed(4));
    /* card 1: in from +40, out to −40 · card 2: in from +40, then only fades */
    st.setProperty("--k1", (k1in * (1 - k1out)).toFixed(4));
    st.setProperty("--k1y", (LIFT * (1 - k1in) - LIFT * k1out).toFixed(2));
    st.setProperty("--k2", (k2in * (1 - et)).toFixed(4));
    st.setProperty("--k2y", (LIFT * (1 - k2in) - EXIT * et).toFixed(2));
    st.setProperty("--par-a", (-3 * sw).toFixed(3));
    st.setProperty("--par-b", (3 * (1 - sw)).toFixed(3));

    /* keywords and labels – touched only when they really change */
    var act = p < SWITCH ? 0 : 1;
    if (act !== it.act) {
      it.act = act;
      it.crops.forEach(function (g, i) {
        var tab = $("[data-use-tab]", g);
        if (tab) tab.setAttribute("aria-pressed", i === act ? "true" : "false");
      });
    }
    var ovis = ui > .02 ? "visible" : "hidden";   /* overlay out of the a11y tree while invisible */
    if (ovis !== it.ovis) { it.ovis = ovis; st.setProperty("--ovis", ovis); }
    var bvis = t > .5 ? "visible" : "hidden";     /* same for „kup teraz" before it fades in */
    if (bvis !== it.bvis) { it.bvis = bvis; st.setProperty("--bvis", bvis); }
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
        var top = r.top + window.scrollY + (HOLD[key] || 0) * span;
        CX5.scrollTo(Math.round(top), soft);
      });
    });
  });

  CX5.register({ scroll: frame, resize: layout });
})();

/* ===== 70 · Dawkowanie: lekki parallax zdjęcia (spec §13.6) =================
   Obraz jest o 14 % wyższy od przycinającej go ramki, więc mieści przesunięcie
   bez odsłaniania krawędzi. `--dose-par` idzie od -6 do 0 (procent wysokości
   obrazu), gdy sekcja przejeżdża przez ekran – obraz jedzie wolniej niż strona.
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

/* ===== 80 · Sezon: oś kroków sterowana scrollem + pas PRO ===== */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$, panelSet = CX5.panelSet, reducedMQ = CX5.reducedMQ;

  var seasonWideMQ = window.matchMedia("(min-width: 900px)");
  var seasonPin = $("[data-season-pin]");
  var seasonBlock = seasonPin ? $(".c5-season", seasonPin) : null;
  var seasonSpacer = seasonPin ? $("[data-season-spacer]", seasonPin) : null;
  var seasonHead = $("[data-season-head]");
  var seasonBtns = $$("[data-season]");
  var seasonIdx = null;
  var seasonOpenH = 0;
  var seasonStep = 0;
  var seasonHeadTop = 0;
  var seasonHeadH = 0;
  var seasonHeadWrap = seasonPin ? $("[data-season-headwrap]", seasonPin) : null;
  var seasonBlockTop = 0;   /* used sticky `top` of the block (px) */
  var seasonSpacerH = 0;    /* flow room reserved for the absolute header */

  function seasonPinOn() { return !!seasonBlock && seasonWideMQ.matches && !reducedMQ.matches; }
  /* Jeden stan na wiersz: data-open steruje i panelem opisu, i animacją sceny
     (kwadrat + packshot), więc scena zachowuje się tak samo w pinie i na klik. */
  function setSeason(idx, instant) {
    if (seasonIdx === idx) return;
    seasonIdx = idx;
    /* Zamknięty krok nie rezerwuje już miejsca na kwadrat, więc wysokość bloku
       zależy od tego, który krok jest otwarty. Pomiar musi zastać stan docelowy
       – na czas przestawienia „na sztywno" wyłączamy przejścia sceny. */
    if (instant && seasonBlock) seasonBlock.classList.add("c5-season--instant");
    seasonBtns.forEach(function (b, i) {
      var panel = doc.getElementById(b.getAttribute("aria-controls"));
      var row = b.closest(".c5-season__row");
      var on = i === idx;
      b.setAttribute("aria-expanded", on ? "true" : "false");
      if (row) row.setAttribute("data-open", on ? "true" : "false");
      panelSet(panel, on, instant);
    });
    if (instant && seasonBlock) {
      void seasonBlock.offsetHeight;
      seasonBlock.classList.remove("c5-season--instant");
    }
  }
  /* Block height with one step open: the tallest of the three states, so the
     bottom edge cannot drift when a taller step opens (§14.7). Measured with
     --c5-season-h cleared, otherwise min-height would answer instead. */
  function measureSeasonBlock() {
    var keep = seasonIdx, max = 0, i;
    seasonBlock.style.removeProperty("--c5-season-h");
    for (i = 0; i < 3; i++) {
      seasonIdx = null;
      setSeason(i, true);
      max = Math.max(max, seasonBlock.offsetHeight);
    }
    seasonIdx = null;
    setSeason(keep === null || keep < 0 ? 0 : keep, true);
    seasonOpenH = max;
    seasonBlock.style.setProperty("--c5-season-h", max + "px");
  }
  /* Pozycja kontenera (jego `top` w oknie) w dwóch momentach granicznych:
     – gdy blok kroków dobija dołem do krawędzi ekranu,
     – gdy nagłówek H2+lead dojeżdża do swojej pozycji sticky.
     Cykl otwierania startuje dopiero, gdy zaszły OBA (czyli przy mniejszym C).
     The block starts `seasonSpacerH` below the container top, so it reaches its
     sticky offset when the container top is that much above it. */
  function seasonBlockPinC() { return seasonBlockTop - seasonSpacerH; }
  /* Nagłówek leży na górze kontenera pinu (absolutna rozpórka), więc przykleja
     się dokładnie wtedy, gdy `top` kontenera zrówna się z jego offsetem sticky. */
  function measureSeasonHead() {
    if (!seasonHead) return;
    seasonHeadTop = parseFloat(window.getComputedStyle(seasonHead).top) || 0;
    seasonHeadH = seasonHead.offsetHeight;
  }
  function seasonHeadStickC() { return seasonHead ? seasonHeadTop : Infinity; }
  function sizeSeasonPin() {
    if (!seasonPin || !seasonBlock) return;
    if (!seasonPinOn()) {
      seasonPin.style.height = "";
      if (seasonSpacer) seasonSpacer.style.height = "";
      if (seasonHeadWrap) seasonHeadWrap.style.height = "";
      seasonBlock.style.removeProperty("--c5-season-h");
      seasonBlock.style.removeProperty("--c5-season-headroom");
      setSeason(0);
      return;
    }
    measureSeasonBlock();                           /* pomiar w stanie „jeden krok otwarty" */
    measureSeasonHead();
    /* Floor for the sticky offset: the block must never slide under the header
       (§14.7 – solve an overlap with spacing, never with a background). */
    seasonBlock.style.setProperty("--c5-season-headroom", Math.round(seasonHeadTop + seasonHeadH) + "px");
    seasonBlockTop = parseFloat(window.getComputedStyle(seasonBlock).top) || 0;
    /* Spacer = header box + its CSS margin: that margin is the gap the reader
       sees between the lead and the first step while the block is still running
       with the page. */
    if (seasonSpacer) {
      seasonSpacer.style.height = Math.round(seasonHeadH) + "px";
      seasonSpacerH = seasonSpacer.offsetHeight +
        (parseFloat(window.getComputedStyle(seasonSpacer).marginBottom) || 0);
    } else {
      seasonSpacerH = Math.round(seasonHeadH);
    }
    seasonStep = Math.max(260, Math.round(window.innerHeight * 0.55));
    /* Cykl rusza dopiero, gdy zaszły OBA zdarzenia (blok przy dole, nagłówek
       u góry) – czyli przy mniejszym `top` kontenera. Różnica między nimi to
       „przedbieg", w którym pierwszy krok jest już otwarty. Kontener dobieramy
       tak, by blok odkleił się dokładnie na końcu trzeciej fazy:
       track = sticky top + block height + 3 phases - cycle start. With the wide
       gap under the header the block can reach its offset after the header does,
       so the start is whichever of the two happens later (smaller `top`). */
    var span = seasonStep * 3;
    var startC = seasonStartTop();
    seasonPin.style.height = Math.round(seasonBlockTop + seasonOpenH + span - startC) + "px";
    /* Rozpórka nagłówka kończy się tam, gdzie blok puszcza dół – od tego miejsca
       dolna krawędź wypycha nagłówek w górę (naturalne odjeżdżanie, bez znikania). */
    if (seasonHeadWrap) {
      seasonHeadWrap.style.height = Math.round(seasonHeadTop + seasonHeadH - startC + span) + "px";
    }
  }
  function seasonSpan() { return seasonStep * 3; }
  function seasonStartTop() { return Math.min(seasonBlockPinC(), seasonHeadStickC()); }
  function updateSeason() {
    if (!seasonPinOn() || !seasonOpenH) return;
    var span = seasonSpan();
    var p = span > 0 ? (seasonStartTop() - seasonPin.getBoundingClientRect().top) / span : 0;
    if (p < 0) { setSeason(0); return; }             /* step 1 stays open before the pin (§14.7) */
    setSeason(Math.min(2, Math.floor(p * 3)));
  }
  seasonBtns.forEach(function (btn, i) {
    btn.addEventListener("click", function () {
      if (seasonPinOn()) {
        /* przewiń do środka fazy tego kroku – scroll otworzy go sam */
        var pinTopDoc = seasonPin.getBoundingClientRect().top + window.scrollY;
        var target = pinTopDoc - seasonStartTop() + ((i + 0.5) / 3) * seasonSpan();
        CX5.scrollTo(Math.round(target), "smooth");
      } else if (btn.getAttribute("aria-expanded") !== "true") {
        setSeason(i);
      }
    });
  });

  $$(".c5-season__row").forEach(function (r) {
    panelSet($(".c5-season__panel", r), r.getAttribute("data-open") === "true", true);
  });

  /* Wejście kroków: one-shot fade-in from below, fired the first time the block
     shows up on screen. Timed (CSS transition), not tied to the scroll offset –
     the scroll drives only the opening of the steps. Without IntersectionObserver
     or with reduced motion the rows are simply there from the start. */
  if (seasonBlock) {
    if (!("IntersectionObserver" in window) || reducedMQ.matches) {
      seasonBlock.classList.add("is-in");
    } else {
      var seasonIO = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (!entries[i].isIntersecting) continue;
          seasonBlock.classList.add("is-in");
          seasonIO.disconnect();
          return;
        }
      }, { threshold: 0.2 });
      seasonIO.observe(seasonBlock);
    }
  }

  /* --- Pas PRO: kadr rośnie przy przewijaniu (wzór sensiq.co) ---------------
     Delayed start (§14.6): the media holds .5 while the top edge of the band is
     above 75 % of the window height, then grows to 1 by the time that edge is
     10 % from the top – easing unchanged (§13.8: start from half size).
     W pętli tylko prostokąt pasa i jedna custom property. */
  var pro = $("[data-pro]");
  function updatePro() {
    if (!pro) return;
    if (!CX5.motionOn()) { pro.style.removeProperty("--pro-s"); return; }
    var h = window.innerHeight;
    var r = pro.getBoundingClientRect();
    var p = CX5.clamp((0.75 * h - r.top) / (0.65 * h), 0, 1);
    var e = 1 - Math.pow(1 - p, 3);
    pro.style.setProperty("--pro-s", (0.5 + 0.5 * e).toFixed(4));
  }

  CX5.register({
    scroll: function () { updateSeason(); updatePro(); },
    resize: function () { sizeSeasonPin(); updatePro(); }
  });
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
