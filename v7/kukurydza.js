/* ===== kukurydza.js – warstwa strony (V7) ==================================
   Szyna CX5, warstwa wspólna i moduły klocków wzorca leżą w ce/*.js (ładowane
   wcześniej). Tutaj zostają wyłącznie moduły klocków unikalnych tej podstrony.
   Bez własnej definicji `window.CX5` i bez `CX5.start()` – szyna startuje sama
   na DOMContentLoaded. ==================================================== */
/* ===== 10+ · Skoki w obrębie strony spoza nawigacji kropkowej ===============
   Przycisk w hero („Zobacz program krok po kroku", spec §9.3) skacze tą samą
   drogą co kropki – przez warstwę inercji, natywnie przy ograniczonym ruchu.
   Same kropki prowadzi ce/CE-07-nawigacja-kropkowa.js. =================== */
(function () {
  "use strict";
  var doc = document, $$ = CX5.$$, reducedMQ = CX5.reducedMQ;
  var links = $$("[data-cx-scroll]");
  if (!links.length) return;
  function jumpTo(a) {
    var target = doc.getElementById(a.getAttribute("href").slice(1));
    if (!target) return false;
    CX5.scrollTo(Math.round(target.getBoundingClientRect().top + window.scrollY), reducedMQ.matches ? "auto" : "smooth");
    return true;
  }
  links.forEach(function (a) {
    a.addEventListener("click", function (e) { if (jumpTo(a)) e.preventDefault(); });
  });
})();
/* ===== 55 · Krytyczne fakty: napis z masek i kafle nad sceną ===============
   Scenę (kadr tła na cały ekran, `position: sticky`) trzyma CSS. JS robi dwie
   rzeczy i czyta na to jeden prostokąt – toru:
   (1) Napis. Scena stoi na górze toru, więc jej górna krawędź to krawędź toru,
   dopóki nie przyklei się na 0 (a wtedy warunek i tak jest spełniony).
   Przy `top` ≤ 35 % wysokości okna nadajemy `.is-in` – raz, bez animacji
   wyjścia; wchodzi na każdej szerokości, także przy wejściu z dołu strony.
   (2) Kafle. Dla postępu `q` kafla przez okno (0 = górna krawędź na dolnej
   krawędzi okna, 1 = dolna krawędź na górnej) przesunięcie wynosi
   `--par = (h + th) · (q − g(q))`, gdzie `g(q) = a·q + (1 − a)(0.5 + 4(q − 0.5)³)`
   i `a` (0,30–0,45) siedzi w znaczniku. Kafel wjeżdża i wyjeżdża szybciej niż
   strona, a w środku okna zwalnia do czytania; poza 0–1 przesunięcia nie ma,
   więc ruch łączy się płynnie z biegiem strony. Pozycje naturalne mierzymy raz
   i przy `resize`; poniżej 900 px i przy ograniczonym ruchu kafle stoją
   w siatce – kasujemy `--par`. */
(function () {
  "use strict";
  var sec = CX5.$("[data-fk]");
  if (!sec) return;
  var track = CX5.$("[data-fk-track]", sec);
  var title = CX5.$("[data-fk-title]", sec);
  var tiles = CX5.$$("[data-fk-tile]", sec);
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

/* ===== 80 · Tank-mix table: clickable rows (spec §10.6) ====================
   The row is a shortcut, not a control: the accessible target stays the single
   link in the first cell, and a click anywhere else in the row just triggers
   it. Clicks that land on another link (the `*` footnote) are left alone, and
   so is a click that ends a text selection. Without JS the link still works.
   ========================================================================= */
(function () {
  "use strict";
  CX5.$$("[data-mt] tbody tr").forEach(function (row) {
    var link = CX5.$(".u-mt__prod", row);
    if (!link) return;
    row.addEventListener("click", function (e) {
      /* real controls (the link itself, the footnote link) handle their own click */
      if (e.target.closest && e.target.closest("a,button,input,select,textarea,label")) return;
      var sel = window.getSelection && window.getSelection();
      if (sel && !sel.isCollapsed && String(sel).length) return;   /* user was selecting text */
      link.click();
    });
  });
})();

/* ===== 90 · Pas zamykający – bez modułu strony ==============================
   Kadr skaluje bazowy klocek: `ce/CE-16-pas-pro.js` czyta `[data-pro]` i pisze
   `--pro-s` (spec §13.5). Tutaj nie ma już czego trzymać. */


