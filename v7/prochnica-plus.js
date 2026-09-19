/* ===== prochnica-plus.js – warstwa strony (V7) ==========================================
   Szyna CX5, warstwa wspólna i moduły klocków wzorca leżą w ce/*.js (ładowane
   wcześniej). Tutaj zostają wyłącznie moduły klocków unikalnych tej podstrony.
   Bez własnej definicji `window.CX5` i bez `CX5.start()` – szyna startuje sama
   na DOMContentLoaded. ==================================================== */
/* ===== 40 · Scroll-driven scene of „Założenia i cele" and „Metodologia" =====
   Removed 19.09.2026 (iteration 2): both sections left this module. #zalozenia
   now runs on CE-70 (`ce/CE-70-scena-slajdow.js`) and #metodologia on the CE-12
   trial (`ce/CE-12-scena-faktow-proba.js`), so nothing on the page carries
   [data-ppscene] any more. Block 40 of the sheet keeps only the illustration
   boxes of the Metodologia figures – they have no script of their own. */

/* ===== 45 · Korzyści: napis z masek i kafle nad sceną (CE-44 `tlo-foto`) ====
   Port modułu 55 z Kukurydzy (spec §18.4). Scenę (kadr tła na cały ekran,
   `position: sticky`) trzyma CSS. JS robi dwie rzeczy i czyta na to jeden
   prostokąt – toru:
   (1) Napis. Scena stoi na górze toru, więc jej górna krawędź to krawędź toru,
   dopóki nie przyklei się na 0 (a wtedy warunek i tak jest spełniony).
   Przy `top` ≤ 35 % wysokości okna nadajemy `.is-in` – raz, bez animacji
   wyjścia; wchodzi na każdej szerokości, także przy wejściu z dołu strony.
   (2) Kafle. Dla postępu `q` kafla przez okno (0 = górna krawędź na dolnej
   krawędzi okna, 1 = dolna krawędź na górnej) przesunięcie wynosi
   `--par = (h + th) · (q − g(q))`, gdzie `g(q) = a·q + (1 − a)(0.5 + 4(q − 0.5)³)`
   i `a` (0,30–0,44) siedzi w znaczniku. Kafel wjeżdża i wyjeżdża szybciej niż
   strona, a w środku okna zwalnia do czytania; poza 0–1 przesunięcia nie ma,
   więc ruch łączy się płynnie z biegiem strony. Pozycje naturalne mierzymy raz
   i przy `resize`; poniżej 900 px i przy ograniczonym ruchu kafle stoją
   w siatce – kasujemy `--par`. */
(function () {
  "use strict";
  var sec = CX5.$("[data-ppkor]");
  if (!sec) return;
  var track = CX5.$("[data-ppkor-track]", sec);
  var title = CX5.$("[data-ppkor-title]", sec);
  var tiles = CX5.$$("[data-ppkor-tile]", sec);
  if (!track || !tiles.length) return;
  /* profil prędkości siedzi w atrybucie `style` znacznika – czytamy go raz */
  var eases = tiles.map(function (t) {
    return parseFloat(t.style.getPropertyValue("--a")) || 0.35;
  });
  var tops = [], hts = [], off = false, shown = false;

  function measure() {
    for (var i = 0; i < tiles.length; i++) {
      tops[i] = tiles[i].offsetTop;
      hts[i] = tiles[i].offsetHeight;
    }
  }

  function update() {
    var h = window.innerHeight;
    var r = track.getBoundingClientRect();
    if (!shown && title && r.top <= 0.35 * h) { title.classList.add("is-in"); shown = true; }
    if (!CX5.motionOn()) {
      if (!off) { tiles.forEach(function (t) { t.style.removeProperty("--par"); }); off = true; }
      return;
    }
    off = false;
    for (var i = 0; i < tiles.length; i++) {
      var span = h + hts[i];
      var q = span > 0 ? (h - (r.top + tops[i])) / span : 0;
      var par = 0;
      if (q > 0 && q < 1) {
        var a = eases[i], u = q - 0.5;
        par = span * (q - (a * q + (1 - a) * (0.5 + 4 * u * u * u)));
      }
      tiles[i].style.setProperty("--par", par.toFixed(1) + "px");
    }
  }
  CX5.register({ scroll: update, resize: function () { measure(); update(); } });
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

/* ===== 65 · Harmonogram programu ==========================================
   Przebudowany 19.09.2026 (spec §18.7): mechanika klocka CE-49 mieszka teraz
   w `ce/CE-49-harmonogram.js`. Stary moduł osi S1 (`pp-os`) usunięty.
   ====================================================================== */

/* ===== 70 · Rzetelność: delikatny parallaks kadru w tle (spec §18.9) =======
   Kadr sekcji przesuwa się o maks. ±40 px wobec strony – tyle, żeby zdjęcie
   „oddychało", i nie więcej (Mateusz: animacje mają dodawać tylko smaku).
   Ruch liczymy z pozycji sekcji w oknie na zdarzeniu scroll szyny CX5 (rAF),
   bez nasłuchu `wheel` i bez przechwytywania przewijania. Poniżej 900 px
   i przy `prefers-reduced-motion` zmienna znika i obraz stoi; obraz ma zapas
   60 px u góry i u dołu, więc przesunięcie nigdy nie odsłania krawędzi. */
(function () {
  "use strict";
  var sec = CX5.$("#rzetelnosc");
  var box = sec && CX5.$(".pp-rz__bg", sec);
  if (!box) return;
  var AMP = 40;
  var off = false;

  function frame() {
    if (!CX5.motionOn()) {
      if (!off) { box.classList.remove("is-parallax"); sec.style.removeProperty("--pp-rz-y"); off = true; }
      return;
    }
    off = false;
    var r = sec.getBoundingClientRect();
    var h = window.innerHeight || 1;
    if (r.bottom < -120 || r.top > h + 120) { box.classList.remove("is-parallax"); return; }
    box.classList.add("is-parallax");
    /* -1 = sekcja tuż pod oknem, 0 = na jego środku, 1 = tuż nad nim */
    var p = CX5.clamp((h / 2 - (r.top + r.height / 2)) / (h / 2 + r.height / 2), -1, 1);
    sec.style.setProperty("--pp-rz-y", (p * AMP).toFixed(1) + "px");
  }

  CX5.register({ scroll: frame, resize: frame });
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
   Od iteracji 2 (spec §18.4b) sceną sześciu kroków steruje moduł próby CE-12
   `ce/CE-12-scena-faktow-proba.js`: uruchamia się dla KAŻDEJ sekcji [data-fx],
   czyta liczbę kroków z DOM-u, a wariant bierze z `data-ce-wariant` sekcji –
   u nas `bez-naglowka` na stałe, bez przełącznika podglądu. Ten blok zostaje
   jako miejsce na ewentualne różnice Metodologii – celowo pusty. */

/* ===== 85 · Etapy prac – kod klocka mieszka w ce/CE-51-os-gantta.js ========
   Przebudowa 19.09 (spec §18.10) przeniosła oś Gantta do warstwy wspólnej
   `ce/`, razem ze źródłem treści i kartą okresu. Blok zostaje jako ślad po
   numeracji – moduł 50 (przyciski „etapy prac") rozmawia z klockiem przez
   `CX5.ppEtapy.focusFarm`, które publikuje CE-51. ======================== */


