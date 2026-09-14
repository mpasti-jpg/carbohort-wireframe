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

/* ===== 02 · Ujawnianie przy przewijaniu ([data-reveal]) =====================
   Jednorazowy fade-in sekcji, których wzorzec produktowy nie ma (wzorzec §4a).
   Klasę `.pp-reveal` dokłada WYŁĄCZNIE skrypt i tylko elementom, które przy
   starcie leżą pod pierwszym ekranem oraz mieszczą się w poziomie – dzięki
   temu nic nigdy nie zostaje niewidoczne (także w torach przewijanych w bok).
   Bez JS i przy prefers-reduced-motion treść jest po prostu widoczna. ====== */
(function () {
  "use strict";
  var $$ = CX5.$$;
  var IO = window.IntersectionObserver;
  if (!IO || CX5.reducedMQ.matches) return;

  var pending = [];
  var io = new IO(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) show(e.target); });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });

  function show(el) {
    el.classList.add("is-in");
    io.unobserve(el);
    var i = pending.indexOf(el);
    if (i > -1) pending.splice(i, 1);
  }

  $$("[data-reveal]").forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top > window.innerHeight && r.left < window.innerWidth && r.right > 0) {
      el.classList.add("pp-reveal");
      pending.push(el);
      io.observe(el);
    }
  });
  if (!pending.length) return;

  /* Safety net: if IntersectionObserver stays silent (background tab, preview
     without a render pass, print), the content MUST still appear. The CX5
     scroll bus and beforeprint do the same job. */
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

/* ===== 40 · Sceny sterowane przewijaniem: Założenia i cele, Metodologia =====
   Port modułu 50 „Czym jest" z CARBOMAT ECO (spec §6, §12). Tor jest wysoki
   (100svh + N × krok), scena w środku jest sticky. Pozycja na osi = pozycja
   scrolla; w pętli czytamy wyłącznie prostokąt toru, a wynik zapisujemy w
   custom property i klasach. Moduł obsługuje KAŻDĄ sekcję [data-ppscene], więc
   Metodologia (sześć kroków) nie potrzebuje własnego kodu. Poniżej 900 px,
   przy ograniczonym ruchu i bez JS sekcja jest statyczna – cała treść
   widoczna (CSS). */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;

  $$("[data-ppscene]").forEach(function (sec) {
    var track = $("[data-ppscene-track]", sec);
    var stage = $(".pp-scene", sec);
    var steps = $$(".pp-step", sec);
    var vizs = $$("[data-ppviz]", sec);
    var bgs = $$("[data-ppbg]", sec);
    var bar = $("[data-ppprog]", sec);
    if (!track || !stage || !steps.length) return;
    var STEPS = steps.length;
    var stageH = 0, idx = -1;

    function show(i) {
      if (i === idx) return;
      idx = i;
      steps.forEach(function (s, n) { s.classList.toggle("is-on", n === i); });
      vizs.forEach(function (v) { v.setAttribute("data-on", +v.getAttribute("data-ppviz") === i + 1 ? "true" : "false"); });
      /* photo layer of the panel switches with the topic (spec §6) */
      bgs.forEach(function (b) { b.setAttribute("data-on", +b.getAttribute("data-ppbg") === i + 1 ? "true" : "false"); });
      if (bar) {
        var title = $(".pp-step__title", steps[i]);
        bar.setAttribute("aria-valuenow", String(i + 1));
        if (title) bar.setAttribute("aria-valuetext", title.textContent);
      }
    }
    function measure() {
      if (!CX5.motionOn()) {
        track.style.height = "";
        sec.style.removeProperty("--pp-p");
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
      sec.style.setProperty("--pp-p", p.toFixed(4));
      show(Math.min(STEPS - 1, Math.floor(p * STEPS)));
    }
    CX5.register({ scroll: update, resize: measure });
  });
})();

/* ===== 45 · Korzyści: karty płynące z różną prędkością nad napisem =========
   Każda karta dostaje własną prędkość (data-pp-speed 0.7–1.3). Przesunięcie
   liczymy z pozycji JEJ SLOTU w oknie (slot nie jest transformowany, więc
   pomiar nie karmi się własnym wynikiem): p = 0 gdy slot wchodzi dołem, 1 gdy
   wychodzi górą, a przesunięcie = (0.5 − p) × wysokość okna × (1 − prędkość).
   Wartości < 1 wyprzedzają scroll, > 1 zostają w tyle – dzięki temu karty
   rozjeżdżają się względem siebie i nachodzą na napis w różnych momentach.
   Tylko transform, tylko przy CX5.motionOn(); niżej układ jest siatką. */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var sec = $("[data-ppkor]");
  if (!sec) return;
  var slots = $$(".pp-kslot", sec).map(function (slot) {
    var card = $(".pp-kcard", slot);
    return { slot: slot, card: card, speed: parseFloat(card && card.getAttribute("data-pp-speed")) || 1 };
  }).filter(function (it) { return it.card; });
  if (!slots.length) return;
  var on = false;

  function update() {
    if (!on) return;
    var vh = window.innerHeight;
    /* read first, write second – nie mieszamy pomiarów z zapisami */
    var ys = slots.map(function (it) {
      var r = it.slot.getBoundingClientRect();
      var p = clamp((vh - r.top) / (vh + r.height), 0, 1);
      return (0.5 - p) * vh * (1 - it.speed);
    });
    slots.forEach(function (it, i) { it.card.style.setProperty("--pp-y", ys[i].toFixed(1) + "px"); });
  }
  function measure() {
    on = CX5.motionOn();
    if (!on) slots.forEach(function (it) { it.card.style.removeProperty("--pp-y"); });
  }
  CX5.register({ scroll: update, resize: measure });
})();

/* ===== 50 · Uczestnicy programu – dwa przyciski na karcie ==================
   Obie kontrolki są kotwicami, więc bez JS (albo gdy moduł 52/85 nie wystartuje)
   po prostu skaczą do profilu i do osi gospodarstwa. Z JS „zobacz profil"
   otwiera pop-up (moduł 52), a „etapy prac" przewija do wiersza wspólnego
   wykresu Gantta i podświetla go na 1,2 s (moduł 85). ===================== */
(function () {
  "use strict";
  var $$ = CX5.$$;

  $$("#uczestnicy-programu [data-profil]").forEach(function (a) {
    a.setAttribute("aria-haspopup", "dialog");
    a.addEventListener("click", function (e) {
      /* module 52 publishes the API; without it the anchor does its job */
      if (!CX5.ppProfile) return;
      e.preventDefault();
      CX5.ppProfile.open(a.getAttribute("data-profil"), a);
    });
  });

  $$("#uczestnicy-programu [data-etapy]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (!CX5.ppEtapy) return;
      e.preventDefault();
      CX5.ppEtapy.focusFarm(a.getAttribute("data-etapy"));
    });
  });
})();

/* ===== 52 · Pop-up profilu gospodarstwa (spec §8) ==========================
   Jedna implementacja, sześć egzemplarzy – jak lightbox strony kukurydzy
   (v5/uprawa.js §7), tylko na natywnym <dialog>: `showModal()` daje pułapkę
   fokusu, `Esc` i `::backdrop`, więc ręcznie obsługujemy tylko klik w tło,
   powrót fokusu, blokadę przewijania i zatrzymanie inercji (Lenis).
   Treść pop-upu to KLON bloku z sekcji #profile (nic nie jest powielone w
   kodzie) plus klon noty o rozbieżnościach. Sekcja źródłowa znika dopiero
   tutaj – bez JS zostaje w biegu strony. ================================== */
(function () {
  "use strict";
  var doc = document;
  var $ = CX5.$, $$ = CX5.$$;

  var src = $("[data-profil-src]");
  if (!src) return;
  var note = $("[data-profil-note]", src);
  var blocks = {};
  $$("[data-profil-block]", src).forEach(function (b) {
    blocks[b.getAttribute("data-profil-block")] = b;
  });
  if (!Object.keys(blocks).length) return;

  /* --- pop-up (jeden na stronę, treść podmieniana przy otwarciu) ---------- */
  var dlg = doc.createElement("dialog");
  dlg.className = "pp-profile";
  dlg.setAttribute("aria-labelledby", "pp-profile-t");

  var close = doc.createElement("button");
  close.type = "button";
  close.className = "pp-profile__close";
  close.setAttribute("aria-label", "zamknij");
  close.innerHTML = '<svg class="wf-icon" aria-hidden="true"><use href="#ti-x"></use></svg>';

  var scroll = doc.createElement("div");
  scroll.className = "pp-profile__scroll";
  scroll.tabIndex = -1;
  scroll.setAttribute("data-lenis-prevent", "");

  dlg.appendChild(close);
  dlg.appendChild(scroll);
  doc.body.appendChild(dlg);

  var opener = null;

  /* a clone must not duplicate ids or re-run the reveal module */
  function clean(node) {
    node.removeAttribute("data-reveal");
    $$("[data-reveal]", node).forEach(function (n) { n.removeAttribute("data-reveal"); });
    if (node.id) node.removeAttribute("id");
    $$("[id]", node).forEach(function (n) { n.removeAttribute("id"); });
    node.classList.remove("pp-reveal", "is-in");
    $$(".pp-reveal", node).forEach(function (n) { n.classList.remove("pp-reveal", "is-in"); });
    return node;
  }

  function open(key, btn) {
    var block = blocks[key];
    if (!block || dlg.open) return;
    opener = btn || null;
    scroll.textContent = "";
    var body = clean(block.cloneNode(true));
    var title = $(".c5-variant__name", body);
    if (title) title.id = "pp-profile-t";
    scroll.appendChild(body);
    if (note) scroll.appendChild(clean(note.cloneNode(true)));
    dlg.showModal();
    scroll.scrollTop = 0;
    doc.documentElement.classList.add("pp-lock");
    if (CX5.lenis) CX5.lenis.stop();
    scroll.focus();
  }

  close.addEventListener("click", function () { dlg.close(); });

  /* backdrop click: a modal dialog gets the click itself, so compare with its box;
     a keyboard-activated click reports 0,0 and must not count as "outside" */
  dlg.addEventListener("click", function (e) {
    if (e.target !== dlg && !(e.clientX === 0 && e.clientY === 0)) {
      var r = dlg.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
      return;
    }
    if (e.target === dlg) dlg.close();
  });

  dlg.addEventListener("close", function () {
    doc.documentElement.classList.remove("pp-lock");
    if (CX5.lenis) CX5.lenis.start();
    scroll.textContent = "";
    if (opener && opener.focus) opener.focus();
    opener = null;
  });

  src.hidden = true;
  CX5.ppProfile = { open: open };

  /* deep link: #<klucz>-profil otwiera profil, skoro sekcja jest już ukryta */
  var hash = (location.hash || "").replace("#", "");
  if (hash.indexOf("-profil") > 0 && blocks[hash.replace("-profil", "")]) {
    open(hash.replace("-profil", ""), null);
  }
})();

/* ===== 55 · Koordynatorzy: szuflada „czytaj dalej" ==========================
   Przeniesione z warstwy 99 bez zmian mechaniki (spec §9); zamiast własnego
   klona `ppPanel` moduł używa `CX5.panelSet`. Selektor `[data-disc]` zostaje
   ogólny – obsłuży każdą szufladę tego typu na stronie. =================== */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;
  $$("[data-disc]").forEach(function (btn) {
    var panel = doc.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    var open0 = btn.getAttribute("aria-expanded") === "true";
    panel.setAttribute("data-open", open0 ? "true" : "false");
    CX5.panelSet(panel, open0, true);
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.setAttribute("data-open", open ? "true" : "false");
      CX5.panelSet(panel, open);
      var lbl = $("[data-disc-label]", btn);
      var txt = btn.getAttribute(open ? "data-label-less" : "data-label-more");
      if (lbl && txt) lbl.textContent = txt;
    });
  });
})();

/* ===== 60 · Program w liczbach: kołowrotek cyfr (spec §10) =================
   W kodzie strony stoi zwyczajna liczba – taśmy buduje dopiero skrypt, więc
   bez JS, przy ograniczonym ruchu i poniżej 900 px widać od razu wartość
   końcową. Taśma cyfry ma na dole cel, a nad nim drogę do niego (pełny obrót
   0–9), i startuje przesunięta w górę o całą długość: w okienku stoi wtedy 0.
   Animacja sprowadza ją do zera, czyli cyfry przewijają się OD GÓRY DO DOŁU.
   Kolejne cyfry ruszają co 90 ms, przejazd trwa 1,1 s (krzywa w CSS).
   Wartość dla czytników ekranu zostaje w tekście (wf-sr-only). */
(function () {
  "use strict";
  var doc = document;
  var els = CX5.$$("[data-ppodo]");
  var IO = window.IntersectionObserver;
  if (!els.length || !IO) return;
  var armed = false;

  function build(el) {
    var value = (el.getAttribute("data-ppodo") || "").trim();
    if (!/^[0-9]+$/.test(value)) return null;
    var sr = doc.createElement("span");
    sr.className = "wf-sr-only";
    sr.textContent = value;
    var wrap = doc.createElement("span");
    wrap.className = "pp-odo__wrap";
    wrap.setAttribute("aria-hidden", "true");
    var strips = [];
    for (var i = 0; i < value.length; i++) {
      var target = +value.charAt(i);
      var cell = doc.createElement("span");
      cell.className = "pp-odo__d";
      var strip = doc.createElement("span");
      strip.className = "pp-odo__strip";
      var len = target + 11;                 /* dojazd do celu + pełny obrót */
      for (var k = 0; k < len; k++) {
        var unit = doc.createElement("span");
        unit.textContent = String((target - k + 100) % 10);
        strip.appendChild(unit);
      }
      strip.style.setProperty("--pp-i", String(len - 1));   /* w okienku stoi 0 */
      cell.appendChild(strip);
      wrap.appendChild(cell);
      strips.push(strip);
    }
    el.textContent = "";
    el.appendChild(sr);
    el.appendChild(wrap);
    return strips;
  }

  function roll(el) {
    var strips = build(el);
    if (!strips) return;
    /* wymuszony przelicz: bez niego pozycja startowa taśmy nigdy nie zostaje
       policzona i przeglądarka nie ma od czego animować */
    void el.offsetHeight;
    el.classList.add("is-roll");
    strips.forEach(function (strip, i) {
      strip.style.transitionDelay = (i * 90) + "ms";
      strip.style.setProperty("--pp-i", "0");
    });
  }

  function arm() {
    if (armed || !CX5.motionOn()) return;
    armed = true;
    var io = new IO(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        roll(e.target);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  CX5.register({ resize: arm });
})();

/* ===== 65 · Harmonogram programu: oś czasu (styl S1 z laboratorium) ========
   Przeniesione z warstwy 99 BEZ ZMIAN mechaniki (spec §4). Sekcja NIGDY nie
   wchodzi w drogę przewijaniu strony. Etap zmieniają wyłącznie: przyciski,
   węzły osi, klawiatura (strzałki lewo/prawo, Home, End przy fokusie na sekcji
   lub w niej) i przesunięcie palcem >= 40 px. Żadnego nasłuchu kółka, scrolla
   ani IntersectionObservera – i nigdzie preventDefault na wheel/touchmove.

   Wszystkie jedenaście etapów, geometria osi (--n na węzłach, --l/--w na
   latach) i stan startowy stoją w HTML-u; skrypt tylko przełącza klasy,
   licznik, datę i --a na torze, więc bez JS sekcja pokazuje komplet. ====== */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;
  function reduced() { return CX5.reducedMQ.matches; }

  var box = $("[data-os]");
  if (!box) return;
  var slides = $$(".pp-os__slide", box);
  var nodes = $$("[data-os-node]", box);
  var track = $("[data-os-track]", box);
  var prev = $("[data-os-prev]", box);
  var next = $("[data-os-next]", box);
  var counter = $("[data-os-i]", box);
  var termEl = $("[data-os-term]", box);
  var yearEl = $("[data-os-year]", box);
  var N = slides.length;
  if (!N || nodes.length !== N || !track || !prev || !next || !counter || !termEl || !yearEl) return;

  /* Pozycje węzłów czytamy z markupu – jedno źródło geometrii. */
  var pos = nodes.map(function (b) { return b.style.getPropertyValue("--n") || "0%"; });
  var idx = 0;
  slides.forEach(function (s, k) { if (s.classList.contains("is-active")) idx = k; });
  var curYear = slides[idx].getAttribute("data-year");
  var dropT = null;

  function apply(i) {
    var m = slides[i], instant = reduced();
    idx = i;

    slides.forEach(function (s, k) {
      if (k === i) {
        s.classList.add("is-active");
        s.removeAttribute("aria-hidden");
        if (!instant) {
          s.classList.add("is-enter");
          void s.offsetWidth;              /* reflow: przejście ma od czego startować */
          s.classList.remove("is-enter");
        }
      } else {
        s.classList.remove("is-active", "is-enter");
        s.setAttribute("aria-hidden", "true");
      }
    });

    counter.textContent = String(i + 1);

    /* Termin tylko wtedy, gdy niesie więcej niż sam rok. */
    var term = m.getAttribute("data-term") || "";
    var year = m.getAttribute("data-year") || "";
    termEl.textContent = (term === year) ? "" : term;

    /* Rok podmieniamy WYŁĄCZNIE przy zmianie roku: stary w górę, nowy z dołu. */
    if (year !== curYear) {
      curYear = year;
      var old = yearEl.querySelector("b.is-in");
      if (old) {
        old.classList.remove("is-in");
        old.classList.add("is-out");
        if (dropT) clearTimeout(dropT);
        dropT = setTimeout(function () {
          if (old.parentNode) old.parentNode.removeChild(old);
        }, instant ? 0 : 400);
      }
      var nb = doc.createElement("b");
      nb.textContent = year;
      yearEl.appendChild(nb);
      void nb.offsetWidth;
      nb.classList.add("is-in");
    }

    nodes.forEach(function (b, k) {
      if (k === i) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
    });
    track.style.setProperty("--a", pos[i]);
    prev.disabled = (i === 0);
    next.disabled = (i === N - 1);
    centre(instant);
  }

  /* Linijka węższa niż treść (telefon): aktywny węzeł dosuwamy do środka
     TORU – przewija się tor, nigdy strona. */
  function centre(instant) {
    if (track.scrollWidth <= track.clientWidth + 2) return;
    var b = nodes[idx].getBoundingClientRect(), t = track.getBoundingClientRect();
    var left = track.scrollLeft + (b.left + b.width / 2) - (t.left + t.width / 2);
    left = Math.max(0, Math.min(track.scrollWidth - track.clientWidth, left));
    if (track.scrollTo) track.scrollTo({ left: left, behavior: instant ? "auto" : "smooth" });
    else track.scrollLeft = left;
  }

  function go(i) {
    i = Math.max(0, Math.min(N - 1, i));
    if (i === idx) return;
    apply(i);
  }

  prev.addEventListener("click", function () { go(idx - 1); });
  next.addEventListener("click", function () { go(idx + 1); });
  nodes.forEach(function (b, k) {
    b.addEventListener("click", function () { go(k); });
  });

  box.addEventListener("keydown", function (e) {
    var k = e.key, to = null;
    if (k === "ArrowRight") to = idx + 1;
    else if (k === "ArrowLeft") to = idx - 1;
    else if (k === "Home") to = 0;
    else if (k === "End") to = N - 1;
    if (to === null) return;
    e.preventDefault();
    go(to);
  });

  var pid = null, px = 0, py = 0;
  box.addEventListener("pointerdown", function (e) {
    var t = e.target;
    if (t && t.closest && t.closest("button, .pp-os__track")) return;
    pid = e.pointerId; px = e.clientX; py = e.clientY;
  });
  box.addEventListener("pointerup", function (e) {
    if (pid === null || e.pointerId !== pid) return;
    pid = null;
    var dx = e.clientX - px, dy = e.clientY - py;
    if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy)) go(idx + (dx < 0 ? 1 : -1));
  });
  box.addEventListener("pointercancel", function () { pid = null; });

  /* Start: dopiero teraz chowamy pozostałe etapy – bez JS widać komplet. */
  box.classList.add("is-ready");
  slides.forEach(function (s, k) { if (k !== idx) s.setAttribute("aria-hidden", "true"); });
  prev.disabled = (idx === 0);
  next.disabled = (idx === N - 1);
  centre(true);
  CX5.register({ resize: function () { centre(true); } });
})();

/* ===== 75 · Formularz demonstracyjny ======================================
   Przeniesione z warstwy 99 bez zmian: nic nie wychodzi na serwer, wysłanie
   pokazuje komunikat `[data-demo-msg]` (role="status"). =================== */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$;
  $$("form[data-demo-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = $("[data-demo-msg]", form);
      if (msg) msg.hidden = false;
    });
  });
})();

/* ===== 80 · Metodologia – bez własnego kodu ================================
   Scena sześciu tematów jest tą samą sceną co „Założenia i cele": obsługuje ją
   moduł 40 (`js/40-zalozenia.js`), który uruchamia się dla KAŻDEJ sekcji
   [data-ppscene] i czyta liczbę kroków z DOM-u. Ten plik zostaje jako miejsce
   na ewentualne różnice Metodologii – celowo pusty. */

/* ===== 85 · Etapy prac – wspólna oś Gantta z filtrami (spec §13) ===========
   Wykres powstaje z DOM-u: czyta sześć osi `.pp-tl` (termin, nazwa, opis, stan,
   relacja) i układa je w jednym widoku – wiersz na gospodarstwo, kolumna na
   miesiąc (XI 2025 → XII 2026) plus zbiorcze 2027 i 2028. Kolejny uczestnik =
   kolejny blok `[data-etapy-block]` w HTML i kolejny wiersz tutaj; nic w
   skrypcie nie jest wpisane na sztywno poza kalendarzem kolumn.
   Zdarzenia o zachodzących terminach idą na kolejne pasy tego samego wiersza
   (pakowanie w pasy jak na Gantcie). Opis: dymek przy kaflu na hover/fokus,
   klik przypina kartę pod wykresem (`aria-live`). Bez JS nic się nie dzieje –
   zostaje sześć osi pod spodem. ========================================== */
(function () {
  "use strict";
  var doc = document;
  var $ = CX5.$, $$ = CX5.$$;
  var SVGNS = "http://www.w3.org/2000/svg";

  var src = $("[data-etapy-src]");
  var mount = $("[data-gantt]");
  if (!src || !mount) return;

  /* --- 1. kalendarz kolumn ------------------------------------------------ */
  /* months XI 2025 … XII 2026, then two roll-up columns for 2027 and 2028 */
  var ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  var COLS = [{ y: 2025, m: 11 }, { y: 2025, m: 12 }];
  for (var mi = 1; mi <= 12; mi++) COLS.push({ y: 2026, m: mi });
  COLS.push({ y: 2027 }, { y: 2028 });
  var NOW_COL = 10;                                   /* wrzesień 2026 – „jesteśmy tutaj" */

  var MONTHS = [["stycz", 1], ["lut", 2], ["marz", 3], ["marc", 3], ["kwie", 4], ["maj", 5], ["maja", 5],
                ["czerw", 6], ["lip", 7], ["sierp", 8], ["wrze", 9], ["paździer", 10],
                ["listopad", 11], ["grud", 12]];
  var SEASONS = [["wiosn", 3, 5], ["lato", 6, 8], ["latem", 6, 8], ["jesie", 9, 11], ["zim", 12, 12]];

  function colOf(y, m) {
    if (y <= 2025) return m >= 12 ? 1 : 0;
    if (y === 2026) return CX5.clamp(1 + m, 2, 13);
    if (y === 2027) return 14;
    return 15;
  }
  function monthsIn(part) {
    for (var i = 0; i < MONTHS.length; i++) if (part.indexOf(MONTHS[i][0]) >= 0) return [MONTHS[i][1], MONTHS[i][1]];
    for (var j = 0; j < SEASONS.length; j++) if (part.indexOf(SEASONS[j][0]) >= 0) return [SEASONS[j][1], SEASONS[j][2]];
    return null;
  }
  function yearIn(part, fallback) {
    var m = part.match(/20\d\d/);
    return m ? parseInt(m[0], 10) : fallback;
  }
  /* „marzec–kwiecień 2026" -> cols III..IV 2026; „listopad 2025" -> one column */
  function parseTerm(text) {
    var s = (text || "").toLowerCase().replace(/\s+/g, " ");
    var year = yearIn(s, 2026);
    var parts = s.split("–");
    var a = monthsIn(parts[0]) || [1, 12];
    var b = monthsIn(parts[parts.length - 1]) || a;
    var ya = yearIn(parts[0], year), yb = yearIn(parts[parts.length - 1], year);
    var from = colOf(ya, a[0]), to = colOf(yb, b[1]);
    if (to < from) to = from;
    return { a: from, b: to };
  }

  /* --- 2. odczyt gospodarstw i zdarzeń z DOM-u ---------------------------- */
  var farms = $$("[data-etapy-block]", src).map(function (block) {
    var head = $(".pp-varname", block);
    var items = $$(".pp-ms", block).map(function (li) {
      var term = $(".pp-ms__term", li), name = $(".pp-ms__name", li);
      return {
        li: li,
        term: term ? term.textContent.trim() : "",
        name: name ? name.textContent.trim() : "",
        state: li.getAttribute("data-state") || "todo",
        film: !!$(".pp-rel", li),
        span: parseTerm(term ? term.textContent : "")
      };
    });
    return {
      key: block.getAttribute("data-etapy-block"),
      who: block.getAttribute("data-gospodarz") || "",
      crop: block.getAttribute("data-uprawa") || "",
      full: head ? head.textContent.replace(/\s+/g, " ").trim() : "",
      items: items,
      lanes: 1
    };
  }).filter(function (f) { return f.key && f.items.length; });
  if (!farms.length) return;

  /* lane packing: an event goes to the first lane whose last event ended earlier */
  farms.forEach(function (f) {
    var ends = [];
    f.items.slice().sort(function (x, y) { return x.span.a - y.span.a; }).forEach(function (it) {
      var l = 0;
      while (l < ends.length && ends[l] >= it.span.a) l++;
      it.lane = l;
      ends[l] = it.span.b;
    });
    f.lanes = Math.max(1, ends.length);
  });

  var byKey = {};
  farms.forEach(function (f) { byKey[f.key] = f; });

  /* --- 3. klocki DOM ------------------------------------------------------ */
  function el(tag, cls, txt) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function icon(id, cls) {
    var s = doc.createElementNS(SVGNS, "svg");
    s.setAttribute("class", "wf-icon" + (cls ? " " + cls : ""));
    s.setAttribute("aria-hidden", "true");
    var u = doc.createElementNS(SVGNS, "use");
    u.setAttribute("href", "#" + id);
    s.appendChild(u);
    return s;
  }
  function srOnly(txt) { return el("span", "wf-sr-only", txt); }

  var STATE_ICON = { done: "ti-check", doing: "ti-clock", todo: "ti-calendar", na: "ti-minus" };

  /* --- 4. szkielet: filtry, wykres, karta przypięta, dymek ---------------- */
  var filters = el("div", "pp-gt__filters");
  filters.setAttribute("role", "group");
  filters.setAttribute("aria-label", "Filtr gospodarstw");

  var scroll = el("div", "pp-gt__scroll");
  scroll.tabIndex = 0;
  scroll.setAttribute("role", "group");
  scroll.setAttribute("aria-label", "Etapy prac gospodarstw – oś czasu, przewijana w poziomie");
  scroll.setAttribute("data-lenis-prevent", "");
  var grid = el("div", "pp-gt__grid");
  grid.style.setProperty("--pp-cols", String(COLS.length));
  scroll.appendChild(grid);

  var pin = el("div", "pp-gt__pin");
  pin.setAttribute("aria-live", "polite");
  var bubble = el("div", "pp-gt__bubble");
  bubble.hidden = true;

  mount.appendChild(filters);
  mount.appendChild(scroll);
  mount.appendChild(pin);
  mount.appendChild(bubble);

  /* --- 5. filtry ---------------------------------------------------------- */
  var allMode = true, active = {};
  var chips = [];

  function chip(label, key, ico) {
    var b = el("button", "pp-gt__chip");
    b.type = "button";
    if (ico) b.appendChild(icon(ico));
    b.appendChild(el("span", null, label));
    if (key) b.setAttribute("data-farm", key);
    b.addEventListener("click", function () {
      if (!key) { allMode = true; active = {}; }
      else if (allMode) { allMode = false; active = {}; active[key] = true; }
      else if (active[key]) {
        delete active[key];
        if (!Object.keys(active).length) allMode = true;
      } else active[key] = true;
      syncChips();
      render();
    });
    chips.push({ btn: b, key: key });
    filters.appendChild(b);
    return b;
  }
  function syncChips() {
    chips.forEach(function (c) {
      c.btn.setAttribute("aria-pressed", String(c.key ? (!allMode && !!active[c.key]) : allMode));
    });
  }
  chip("wszystkie gospodarstwa", null, "ti-filter");
  farms.forEach(function (f) { chip(f.who || f.full, f.key, "ti-leaf"); });
  syncChips();

  function visible(f) { return allMode || !!active[f.key]; }

  /* --- 6. karta opisu (dymek i wersja przypięta mają tę samą treść) ------- */
  function cardFor(it, farm) {
    var card = el("div", "pp-gt__card");
    card.appendChild(el("span", "pp-gt__card-farm", farm.full));
    /* verbatim clone of the milestone: term, name, description, state, relation */
    var body = el("div", "pp-ms");
    body.setAttribute("data-state", it.state);
    var clone = it.li.cloneNode(true);
    $$("[id]", clone).forEach(function (n) { n.removeAttribute("id"); });
    $$("[data-reveal]", clone).forEach(function (n) { n.removeAttribute("data-reveal"); });
    $$(".pp-reveal", clone).forEach(function (n) { n.classList.remove("pp-reveal", "is-in"); });
    while (clone.firstChild) body.appendChild(clone.firstChild);
    card.appendChild(body);
    return card;
  }

  var pinnedKey = null, pinnedIdx = -1;

  function unpin() {
    pin.textContent = "";
    pinnedKey = null; pinnedIdx = -1;
    $$(".pp-gt__tile.is-pinned", grid).forEach(function (t) { t.classList.remove("is-pinned"); });
  }
  function doPin(farm, idx) {
    pin.textContent = "";
    var box = el("div", "pp-gt__pinned");
    var x = el("button", "pp-gt__pinclose");
    x.type = "button";
    x.setAttribute("aria-label", "zamknij");
    x.appendChild(icon("ti-x"));
    x.addEventListener("click", unpin);
    box.appendChild(x);
    box.appendChild(cardFor(farm.items[idx], farm));
    pin.appendChild(box);
    pinnedKey = farm.key; pinnedIdx = idx;
    markPinned();
  }
  function markPinned() {
    $$(".pp-gt__tile", grid).forEach(function (t) {
      t.classList.toggle("is-pinned",
        t.getAttribute("data-farm") === pinnedKey && t.getAttribute("data-idx") === String(pinnedIdx));
    });
  }

  function hideBubble() { if (!bubble.hidden) { bubble.hidden = true; bubble.textContent = ""; } }
  function showBubble(tile, it, farm) {
    if (!CX5.wideMQ.matches) return;
    bubble.textContent = "";
    bubble.appendChild(cardFor(it, farm));
    bubble.hidden = false;
    var gr = mount.getBoundingClientRect(), tr = tile.getBoundingClientRect();
    var w = bubble.offsetWidth;
    var left = CX5.clamp(tr.left - gr.left, 0, Math.max(0, gr.width - w));
    bubble.style.left = Math.round(left) + "px";
    bubble.style.top = Math.round(tr.bottom - gr.top + 8) + "px";
  }

  /* --- 7. rysowanie wykresu ---------------------------------------------- */
  function render() {
    grid.textContent = "";
    var rows = farms.filter(visible);
    /* rows must be EXPLICIT: the column guides span `2 / -1`, and a negative
       line only counts back from the end of the explicit grid */
    var lanes = 0;
    rows.forEach(function (f) { lanes += f.lanes; });
    grid.style.gridTemplateRows = "auto repeat(" + lanes + ", minmax(52px, auto))";

    /* nagłówki kolumn + linie prowadzące */
    var corner = el("div", "pp-gt__h pp-gt__h--corner");
    corner.appendChild(el("span", "pp-gt__corner-t", "gospodarstwo"));
    grid.appendChild(corner);
    COLS.forEach(function (c, i) {
      var h = el("div", "pp-gt__h" + (i === NOW_COL ? " pp-gt__h--now" : ""));
      h.style.gridColumn = String(i + 2);
      h.appendChild(el("span", "pp-gt__m", c.m ? ROMAN[c.m - 1] : String(c.y)));
      if (c.m) h.appendChild(el("span", "pp-gt__y", String(c.y)));
      if (i === NOW_COL) h.appendChild(el("span", "pp-gt__nowlab", "jesteśmy tutaj"));
      grid.appendChild(h);
      var g = el("div", "pp-gt__guide" + (i === NOW_COL ? " pp-gt__guide--now" : ""));
      g.style.gridColumn = String(i + 2);
      grid.appendChild(g);
    });

    /* wiersze gospodarstw */
    var row = 2;
    rows.forEach(function (f) {
      var band = el("div", "pp-gt__band");
      band.id = "etapy-" + f.key;
      band.setAttribute("data-band", f.key);
      band.style.gridRow = row + " / span " + f.lanes;
      grid.appendChild(band);

      var name = el("div", "pp-gt__name");
      name.setAttribute("data-band", f.key);
      name.style.gridRow = row + " / span " + f.lanes;
      name.appendChild(el("span", "pp-gt__farm", f.who || f.full));
      var cropChip = el("span", "pp-gt__cropchip");
      cropChip.appendChild(icon("ti-leaf"));
      cropChip.appendChild(el("span", null, f.crop));
      if (f.crop) name.appendChild(cropChip);
      grid.appendChild(name);

      f.items.forEach(function (it, idx) {
        var t = el("button", "pp-gt__tile");
        t.type = "button";
        t.setAttribute("data-state", it.state);
        t.setAttribute("data-farm", f.key);
        t.setAttribute("data-idx", String(idx));
        t.style.gridColumn = (it.span.a + 2) + " / " + (it.span.b + 3);
        t.style.gridRow = String(row + it.lane);
        t.appendChild(srOnly("pokaż opis"));
        var top = el("span", "pp-gt__top");
        top.appendChild(icon(STATE_ICON[it.state] || "ti-calendar", "wf-icon--sm"));
        /* a one-column bar has no room for the term and its month is already in
           the column header – the term stays in the accessible name and the card */
        top.appendChild(el("span", it.span.b > it.span.a ? "pp-gt__term" : "wf-sr-only", it.term));
        if (it.film) top.appendChild(icon("ti-player-play", "wf-icon--sm"));
        t.appendChild(top);
        t.appendChild(el("span", "pp-gt__ev", it.name));
        if (it.state === "doing") t.appendChild(el("span", "pp-gt__pulse"));

        t.addEventListener("mouseenter", function () { showBubble(t, it, f); });
        t.addEventListener("mouseleave", hideBubble);
        t.addEventListener("focus", function () { showBubble(t, it, f); });
        t.addEventListener("blur", hideBubble);
        t.addEventListener("click", function (e) {
          if (e.detail > 0) hideBubble();
          if (pinnedKey === f.key && pinnedIdx === idx) unpin();
          else doPin(f, idx);
        });
        grid.appendChild(t);
      });
      row += f.lanes;
    });
    markPinned();
  }

  /* --- 8. skok z kart uczestników: przewiń do wiersza i podświetl go ------ */
  var hlT = null;
  function focusFarm(key) {
    var f = byKey[key];
    if (!f) return;
    if (!visible(f)) { active[key] = true; syncChips(); render(); }
    var band = $('[data-band="' + key + '"]', grid);
    if (!band) return;
    var r = band.getBoundingClientRect();
    var off = Math.min(220, window.innerHeight * 0.28);
    CX5.scrollTo(window.scrollY + r.top - off, CX5.reducedMQ.matches ? "auto" : "smooth");
    var nodes = $$('[data-band="' + key + '"]', grid);
    nodes.forEach(function (n) { n.classList.add("is-target"); });
    if (hlT) window.clearTimeout(hlT);
    hlT = window.setTimeout(function () {
      nodes.forEach(function (n) { n.classList.remove("is-target"); });
    }, 1200);
  }

  /* --- 9. start ----------------------------------------------------------- */
  /* the timelines keep their content but hand over the anchors to the chart rows */
  $$("[data-etapy-block]", src).forEach(function (b) {
    if (b.id) b.id = b.id + "-lista";
  });
  src.hidden = true;
  mount.hidden = false;
  render();

  /* deep link: #etapy-<klucz> trafia w wiersz wykresu, nie w ukrytą oś.
     Dopiero po `load` – wcześniej układ jeszcze się przesuwa (zdjęcia, sceny),
     a skok liczony z bieżących pozycji trafiłby w próżnię. */
  var hash = (location.hash || "").replace("#etapy-", "");
  if (location.hash.indexOf("#etapy-") === 0 && byKey[hash]) {
    window.addEventListener("load", function () {
      window.setTimeout(function () { focusFarm(hash); }, 160);
    });
  }

  scroll.addEventListener("scroll", hideBubble, { passive: true });
  CX5.register({ scroll: hideBubble, resize: hideBubble });
  CX5.ppEtapy = { focusFarm: focusFarm };
})();

CX5.start();
