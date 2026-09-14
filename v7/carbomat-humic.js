/* ===== CARBOMAT HUMIC – V5 · page layer (carbomat-humic.js) ==========================
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
   ograniczonym ruchu.
   HUMIC (spec §5): the clip is still a placeholder, so there is no <video> in the
   frame yet and the module simply bails out. It starts working the moment the
   generated loop replaces the placeholder – the element keeps the same class. */
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

/* ===== 35 · ECO czy HUMIC: wejście kart w widok (spec §6) ====================
   Jednorazowy reveal: IntersectionObserver dokłada `is-in`, CSS robi resztę
   (fade + 18 px w górę, w grupie 80 ms po sobie, potem dociąga się kreska
   łącznika). Bez IntersectionObserver i przy ograniczonym ruchu wszystko
   dostaje `is-in` od razu, więc nic nie zostaje ukryte.
   Wystawiamy to jako `CX5.reveal(elements)` – z tej samej funkcji korzysta
   moduł 40 (oba należą do sekcji B, 35 ładuje się pierwszy). ============== */
(function () {
  "use strict";
  var $$ = CX5.$$, reducedMQ = CX5.reducedMQ;
  var io = null;

  function markIn(el) { el.classList.add("is-in"); }

  function observer() {
    if (io) return io;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        /* a block taller than the viewport never reaches ratio .2, so a slice
           of a quarter of the screen counts as "in view" as well */
        if (en.intersectionRatio < 0.2 &&
            en.intersectionRect.height < window.innerHeight * 0.25) return;
        markIn(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: [0, 0.2] });
    return io;
  }

  function reveal(els) {
    els = Array.prototype.slice.call(els || []);
    if (!els.length) return;
    /* --i = position inside [data-reveal-group]; drives the stagger in CSS */
    els.forEach(function (el) {
      var group = el.closest && el.closest("[data-reveal-group]");
      if (!group) return;
      el.style.setProperty("--i", $$("[data-reveal]", group).indexOf(el));
    });
    if (!("IntersectionObserver" in window) || reducedMQ.matches) {
      els.forEach(markIn);
      return;
    }
    var ob = observer();
    els.forEach(function (el) { ob.observe(el); });
  }
  CX5.reveal = reveal;

  reveal($$("#roznice-eco-humic [data-reveal]"));
})();

/* ===== 40 · Który dla mnie: pop-up z pełną kartą, parallax, reveal (spec §7) ==
   1. Pop-up – wzór: jedyny modal V5 (lightbox strony kukurydzy, uprawa.js
      l. 60–131). Bez JS pop-upy leżą w biegu strony pod swoimi wierszami i cała
      treść jest widoczna; tutaj jadą na koniec <body> i zachowują się jak okno
      modalne: nakładka, X, klik obok panelu, Escape, pułapka Tab, `inert` na
      tle, zablokowane przewijanie strony, powrót fokusu na przycisk. Hash się
      nie zmienia.
   2. Parallax zdjęć – tylko przy `CX5.motionOn()`.
   3. Reveal opisów i noty – przez `CX5.reveal` z modułu 35. ================== */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;
  var pops = $$("[data-pop]");
  var overlay = $("[data-pop-overlay]");
  var revealEls = $$("#ktory-dla-mnie [data-reveal]");
  var medias = $$("[data-who-media]");

  /* --- 1. Pop-up ----------------------------------------------------------- */
  var openBox = null, opener = null;

  function focusables(box) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', box)
      .filter(function (n) { return n.offsetWidth > 0 || n.offsetHeight > 0; });
  }
  function sleep(box) {
    box.setAttribute("data-open", "false");
    box.setAttribute("aria-hidden", "true");
    box.inert = true;
  }
  /* everything in <body> goes inert while a dialog is open; the pop-ups that are
     not open stay inert afterwards, because that is their resting state */
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
    if (CX5.lenis) CX5.lenis.start();
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
    if (CX5.lenis) CX5.lenis.stop();
    var x = $("[data-pop-close]", box);
    (x || focusables(box)[0] || box).focus();
  }

  if (pops.length) {
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
      btn.addEventListener("click", function () {
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
  }

  /* --- 2. Parallax zdjęć ---------------------------------------------------
     Warstwa zdjęcia jest wyższa od ramki, więc mieści przesunięcie bez
     odsłaniania krawędzi. `--who-par` idzie od -6 do 0 (procent wysokości
     warstwy), gdy wiersz przejeżdża przez ekran. */
  function parallax() {
    if (!medias.length) return;
    var on = CX5.motionOn(), h = window.innerHeight;
    medias.forEach(function (m) {
      if (!on) { m.style.removeProperty("--who-par"); return; }
      var r = m.getBoundingClientRect();
      var span = h + r.height;
      var p = span > 0 ? CX5.clamp((h - r.top) / span, 0, 1) : 0;
      m.style.setProperty("--who-par", CX5.lerp(-6, 0, p).toFixed(3));
    });
  }
  CX5.register({ scroll: parallax, resize: parallax });

  /* --- 3. Reveal ----------------------------------------------------------- */
  if (CX5.reveal) CX5.reveal(revealEls);
})();

/* ===== 50 · Czym jest: osiem kroków na scenie sterowanej przewijaniem =====
   Tor jest wysoki (100svh + 8 × krok), scena w środku jest sticky. Pozycja na
   osi = pozycja scrolla; w pętli czytamy wyłącznie prostokąt toru, a wynik
   zapisujemy w custom property i klasach. Kadry zdjęć i boksy ilustracji mogą
   obsługiwać ZAKRES kroków (data-fact-bg="2-6"): pięć funkcji produktu to pięć
   kroków przy jednym kadrze zdjęcia, ale każdy z nich ma już własny boks
   ilustracji (spec §16.4). Poniżej 900 px, przy ograniczonym ruchu i bez JS
   sekcja jest statyczna – cała treść widoczna (CSS). */
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

  /* "7" = one step, "2-6" = a range of steps; both return the 1-based first step */
  function rangeFrom(spec) { var d = spec.indexOf("-"); return d < 0 ? +spec : +spec.slice(0, d); }
  function rangeTo(spec) { var d = spec.indexOf("-"); return d < 0 ? +spec : +spec.slice(d + 1); }
  function inRange(spec, n) { return n >= rangeFrom(spec) && n <= rangeTo(spec); }

  function show(i) {
    if (i === idx) return;
    idx = i;
    facts.forEach(function (f, n) { f.classList.toggle("is-on", n === i); });
    /* one box per step; a range is still honoured, the photo frames use it */
    vizs.forEach(function (v) {
      v.setAttribute("data-on", inRange(v.getAttribute("data-fact-viz"), i + 1) ? "true" : "false");
    });
    /* photo layer of the panel switches with the description (spec §8) */
    bgs.forEach(function (b) { b.setAttribute("data-on", inRange(b.getAttribute("data-fact-bg"), i + 1) ? "true" : "false"); });
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
    /* krok = 70 % wysokości okna, nie mniej niż 420 px (osiem kroków to ~5,6 ekranu) */
    var step = Math.max(420, Math.round(window.innerHeight * 0.7));
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

/* ===== 80 · Kiedy stosować: dwa panele fotograficzne + pas PRO (spec §16.1) ===
   Iteration 2: the pin module of iteration 1 (block measurement, scroll phases,
   click on a row title, row IntersectionObserver) is gone – nothing is pinned
   and nothing is opened by the scroll any more. What is left:
   1. Parallax of the two panel photos – only at `CX5.motionOn()`.
   2. Reveal of the panels – through `CX5.reveal` from module 35.
   3. Pas PRO – media growing .5 -> 1, unchanged. ========================= */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$;

  /* --- 1. Parallax zdjęć w panelach ----------------------------------------
     Warstwa zdjęcia jest wyższa od kadru (118 %), więc mieści przesunięcie bez
     odsłaniania krawędzi panelu. `--when-par` idzie od -6 do 0 (procent
     wysokości warstwy), gdy panel przejeżdża przez ekran; bez ruchu własność
     znika i kadr stoi na wartości domyślnej. */
  var whenMedias = $$("[data-when-media]");
  function whenParallax() {
    if (!whenMedias.length) return;
    var on = CX5.motionOn(), h = window.innerHeight;
    whenMedias.forEach(function (m) {
      if (!on) { m.style.removeProperty("--when-par"); return; }
      var r = m.getBoundingClientRect();
      var span = h + r.height;
      var p = span > 0 ? CX5.clamp((h - r.top) / span, 0, 1) : 0;
      m.style.setProperty("--when-par", CX5.lerp(-6, 0, p).toFixed(3));
    });
  }

  /* --- 2. Wejście paneli w widok ------------------------------------------- */
  if (CX5.reveal) CX5.reveal($$("#sezon [data-reveal]"));

  /* --- 3. Pas PRO: kadr rośnie przy przewijaniu (wzór sensiq.co) ------------
     Delayed start: the media holds .5 while the top edge of the band is above
     75 % of the window height, then grows to 1 by the time that edge is 10 %
     from the top. W pętli tylko prostokąt pasa i jedna custom property. */
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
    scroll: function () { whenParallax(); updatePro(); },
    resize: function () { whenParallax(); updatePro(); }
  });
})();

/* ===== 90 · FAQ: akordeon – naraz otwarte jest jedno pytanie =====
   HUMIC (spec §10): wszystkie pozycje startują zwinięte, ale strona ma most
   z hero do pytania o rozpuszczalność (`#faq-1`). Dlatego moduł czyta kotwicę –
   na starcie i przy każdym `hashchange` – i jeśli wskazuje ona panel odpowiedzi,
   otwiera tę pozycję i przewija do niej. Kotwica zostaje w adresie; akordeon
   sam jej nie zmienia. */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$, panelSet = CX5.panelSet;
  var faqItems = $$(".c5-faq__item");
  if (!faqItems.length) return;

  /* one item open at a time; `instant` skips the height animation (page load) */
  function openOnly(item, instant) {
    faqItems.forEach(function (it) {
      var b = $(".c5-faq__q", it);
      var a = $(".c5-faq__a", it);
      var on = it === item;
      if (b) b.setAttribute("aria-expanded", on ? "true" : "false");
      panelSet(a, on, instant);
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

  /* initial state from the markup (all collapsed unless someone sets data-open) */
  faqItems.forEach(function (it) {
    panelSet($(".c5-faq__a", it), it.hasAttribute("data-open"), true);
  });

  /* --- Otwarcie z kotwicy ---------------------------------------------------
     `#faq-1` jest id panelu odpowiedzi, więc z elementu wracamy do jego pozycji
     akordeonu. Po otwarciu przewijamy do wiersza pytania – natywny skok do
     zwiniętego (wysokość 0) panelu wylądowałby obok. */
  function itemFromHash() {
    var h = location.hash;
    if (!h || h.length < 2) return null;
    var el = null;
    try { el = doc.getElementById(decodeURIComponent(h.slice(1))); } catch (e) { el = doc.getElementById(h.slice(1)); }
    if (!el || !el.closest) return null;
    return el.closest(".c5-faq__item");
  }
  function applyHash(instant) {
    var item = itemFromHash();
    if (!item) return;
    openOnly(item, instant);
    CX5.scrollTo(Math.round(item.getBoundingClientRect().top + window.scrollY),
                 instant || CX5.reducedMQ.matches ? "auto" : "smooth");
  }
  applyHash(true);
  window.addEventListener("hashchange", function () { applyHash(false); });
  /* a repeated click on the same in-page link fires no hashchange – catch it here
     so the bridge from the hero always opens the answer */
  doc.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a || a.getAttribute("href").length < 2) return;
    var el = doc.getElementById(a.getAttribute("href").slice(1));
    if (!el || !el.closest || !el.closest(".c5-faq__item")) return;
    e.preventDefault();
    if (location.hash === a.getAttribute("href")) applyHash(false);
    else location.hash = a.getAttribute("href");
  });
})();

CX5.start();
