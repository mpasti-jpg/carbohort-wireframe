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
/* ===== 40 · Program fazowy: lista faz + panel aktywnej fazy (spec §9.7) =====
   Dokładnie jeden panel otwarty naraz. Panel przełącza najechanie myszą
   (60 ms zwłoki, żeby przejazd kursorem przez listę nie migał), fokus, klik
   i klawisze ↑ ↓ Home End. Ten sam DOM obsługuje trzy stany opisane w CSS
   (bez JS / akordeon / dwie kolumny) – JS tylko chowa nieaktywne panele,
   więc bez niego cała treść zostaje widoczna.
   Przenikanie: klasa `is-swap` z `uprawa.css` zeruje przezroczystość bez
   przejścia, a zdjęta w następnej klatce pozwala panelowi wrócić po swoim
   przejściu (180 ms). Nic tu nie zależy od scrolla, więc moduł nie wchodzi
   na szynę CX5. ========================================================== */
(function () {
  "use strict";
  var box = CX5.$("[data-fz]");
  if (!box) return;
  var rows = CX5.$$(".u-fz__row", box);
  var panels = CX5.$$(".u-fz__panel", box);
  if (!rows.length || rows.length !== panels.length) return;
  /* liczba wierszy dla siatki: panel ma się rozciągnąć na wszystkie */
  box.style.setProperty("--u-fz-n", rows.length);

  var teraz = -1, zwloka = null;
  /* najechanie działa tylko tam, gdzie panel stoi obok listy: w akordeonie
     (< 900 px) przełącza dotknięcie, bo panel wchodzi między wiersze. */
  var hoverMQ = window.matchMedia("(hover: hover)");

  function przenikaj(el) {
    el.classList.add("is-swap");
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { el.classList.remove("is-swap"); });
    });
  }

  function pokaz(i, fokus) {
    if (i === teraz) { if (fokus) rows[i].focus(); return; }
    teraz = i;
    rows.forEach(function (r, j) { r.setAttribute("aria-expanded", j === i ? "true" : "false"); });
    panels.forEach(function (p, j) {
      var on = j === i, bylUkryty = p.hidden;
      p.hidden = !on;
      if (on && bylUkryty) przenikaj(p);
    });
    if (fokus) rows[i].focus();
  }

  rows.forEach(function (r, i) {
    r.addEventListener("click", function () { pokaz(i); });
    r.addEventListener("focus", function () { pokaz(i); });
    /* najechanie tylko myszą – dotyk i rysik załatwia klik */
    r.addEventListener("pointerenter", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      if (!hoverMQ.matches || !CX5.wideMQ.matches) return;
      window.clearTimeout(zwloka);
      zwloka = window.setTimeout(function () { pokaz(i); }, 60);
    });
    r.addEventListener("pointerleave", function () { window.clearTimeout(zwloka); });
    r.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowDown") n = (i + 1) % rows.length;
      else if (e.key === "ArrowUp") n = (i - 1 + rows.length) % rows.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = rows.length - 1;
      if (n === null) return;
      e.preventDefault();
      pokaz(n, true);
    });
  });

  pokaz(0);
})();

/* ===== 50 · Decyzje przed sezonem: lekki parallax kadru ====================
   Port modułu 70 wzorca. Kadr jest o 14 % wyższy od przycinającej go ramki,
   więc mieści przesunięcie bez odsłaniania krawędzi. `--dg-par` idzie od -6
   do 0 (procent wysokości kadru), gdy sekcja przejeżdża przez ekran – kadr
   jedzie wolniej niż strona. W pętli czytamy tylko prostokąt ramki i piszemy
   jedną custom property. Poniżej 900 px i przy ograniczonym ruchu parallaksu
   nie ma – kadr stoi wyśrodkowany (wartość domyślna w CSS). */
(function () {
  "use strict";
  var wrap = CX5.$("[data-dg-media]");
  if (!wrap) return;

  function update() {
    if (!CX5.motionOn()) { wrap.style.removeProperty("--dg-par"); return; }
    var h = window.innerHeight;
    var r = wrap.getBoundingClientRect();
    var span = h + r.height;
    var p = span > 0 ? CX5.clamp((h - r.top) / span, 0, 1) : 0;
    wrap.style.setProperty("--dg-par", CX5.lerp(-6, 0, p).toFixed(3));
  }
  CX5.register({ scroll: update, resize: update });
})();

/* ===== 55 · Krytyczne fakty: kafelki przejeżdżające po napisie =============
   Napis trzyma CSS (`position: sticky` na środku ekranu). JS dokłada tylko
   parallax kafelków: przesunięcie liczone z postępu sekcji przez ekran
   `(0.5 - p) * wysokość okna * (1 - speed)`, czyli kafelek o `--speed` > 1
   jedzie wolniej niż strona, a o `--speed` < 1 szybciej. Dzięki temu kafelki
   nachodzą na napis w różnych momentach toru. Poniżej 900 px i przy
   ograniczonym ruchu kafelki stoją w siatce – kasujemy `--par`. */
(function () {
  "use strict";
  var sec = CX5.$("[data-fk]");
  if (!sec) return;
  var track = CX5.$("[data-fk-track]", sec);
  var tiles = CX5.$$("[data-fk-tile]", sec);
  if (!track || !tiles.length) return;
  /* prędkości siedzą w atrybucie `style` znacznika – czytamy je raz */
  var speeds = tiles.map(function (t) {
    return parseFloat(t.style.getPropertyValue("--speed")) || 1;
  });
  var off = false;

  function update() {
    if (!CX5.motionOn()) {
      if (!off) { tiles.forEach(function (t) { t.style.removeProperty("--par"); }); off = true; }
      return;
    }
    off = false;
    var h = window.innerHeight;
    var r = track.getBoundingClientRect();
    var span = r.height + h;
    var p = span > 0 ? CX5.clamp((h - r.top) / span, 0, 1) : 0;
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].style.setProperty("--par", ((0.5 - p) * h * (1 - speeds[i])).toFixed(1) + "px");
    }
  }
  CX5.register({ scroll: update, resize: update });
})();

/* ===== 70 · Site-conditions carousel (spec §10.5) ==========================
   Arrows scroll the track by exactly one card, the counter and the disabled
   state are read back from the scroll position (index = card nearest the left
   edge, clamped to the last card at the far end), ← → work while the focus is
   inside the track and the mouse can drag the track (6 px threshold, so a
   click on a product chip still opens its popup). The progress bar under the
   track is the shared `u-rail` component driven by `uprawa.js`.
   Without JS none of this exists: the track is a plain native scroller.
   ========================================================================= */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$;

  $$("[data-cr]").forEach(function (root) {
    var track = $("[data-cr-track]", root);
    if (!track) return;
    var slides = $$(":scope > li", track);
    if (slides.length < 2) return;
    var prev = $("[data-cr-prev]", root);
    var next = $("[data-cr-next]", root);
    var now = $("[data-cr-now]", root);
    var index = 0;

    /* offsets measured from the first card, i.e. in the track's scroll space */
    function offsetOf(i) { return slides[i].offsetLeft - slides[0].offsetLeft; }
    function maxScroll() { return Math.max(0, track.scrollWidth - track.clientWidth); }
    /* one card + gap; falls back to the card width when there is only one step */
    function step() {
      var d = offsetOf(1) - offsetOf(0);
      return d > 0 ? d : slides[0].getBoundingClientRect().width;
    }

    function readIndex() {
      var max = maxScroll(), left = track.scrollLeft;
      if (max <= 0) return 0;
      if (left >= max - 2) return slides.length - 1;   /* far end = last card */
      if (left <= 2) return 0;
      var best = 0, bestD = Infinity;
      for (var i = 0; i < slides.length; i++) {
        var d = Math.abs(offsetOf(i) - left);
        if (d < bestD) { bestD = d; best = i; }
      }
      return best;
    }

    function pad(n) { return (n < 10 ? "0" : "") + n; }

    function sync() {
      var max = maxScroll(), left = track.scrollLeft, i = readIndex();
      if (i !== index) {
        index = i;
        if (now) now.textContent = pad(i + 1);
      }
      if (prev) prev.disabled = max <= 0 || left <= 2;
      if (next) next.disabled = max <= 0 || left >= max - 2;
    }

    function go(dir) {
      track.scrollBy({ left: dir * step(), behavior: CX5.reducedMQ.matches ? "auto" : "smooth" });
    }
    if (prev) prev.addEventListener("click", function () { go(-1); });
    if (next) next.addEventListener("click", function () { go(1); });

    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    });

    /* --- mouse drag (touch keeps the native scroll) -----------------------
       Threshold 6 px: below it the gesture is still a click, so a product chip
       opens its popup. `dragged` is cleared by the next pointerdown, so a drag
       that ends outside the track never swallows a later, genuine click. */
    var down = false, moved = false, dragged = false, startX = 0, startLeft = 0;
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; moved = false; dragged = false;
      startX = e.clientX; startLeft = track.scrollLeft;
      /* no preventDefault over real controls – a chip must keep its click and focus */
      if (!(e.target.closest && e.target.closest("a,button,input,select,textarea,label"))) e.preventDefault();
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (!moved) {
        if (Math.abs(dx) < 6) return;
        moved = true;
        track.classList.add("is-drag");   /* grab cursor, no selection, snap off */
      }
      track.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!down) return;
      down = false;
      if (!moved) return;
      dragged = true;
      track.classList.remove("is-drag");  /* snapping takes over again */
    });
    track.addEventListener("click", function (ev) {
      if (!dragged) return;
      dragged = false;
      ev.preventDefault();
      ev.stopPropagation();
    }, true);
    track.addEventListener("dragstart", function (e) { e.preventDefault(); });

    track.addEventListener("scroll", sync, { passive: true });
    CX5.register({ resize: sync });
    sync();
  });
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

/* ===== 90 · Pas zamykający: kadr rośnie przy przewijaniu =====================
   Port części PRO z modułu 80 wzorca (`carbomat.js`, „Pas PRO"). Delayed start:
   the frame holds .5 while the top edge of the band is above 75 % of the window
   height, then grows to 1 by the time that edge is 10 % from the top. Only with
   `motionOn()` (>= 900 px, no reduced motion); otherwise the property is dropped
   and CSS leaves the frame at scale 1. In the loop: one rectangle and one custom
   property. */
(function () {
  "use strict";
  var band = CX5.$("[data-endscale]");
  if (!band) return;
  function update() {
    if (!CX5.motionOn()) { band.style.removeProperty("--u-end-s"); return; }
    var h = window.innerHeight;
    var r = band.getBoundingClientRect();
    var p = CX5.clamp((0.75 * h - r.top) / (0.65 * h), 0, 1);
    var e = 1 - Math.pow(1 - p, 3);
    band.style.setProperty("--u-end-s", (0.5 + 0.5 * e).toFixed(4));
  }
  CX5.register({ scroll: update, resize: update });
})();


