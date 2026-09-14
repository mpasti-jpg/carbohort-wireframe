/* ===== carbomat-humic.js – warstwa strony (V7) ==============================
   Szyna CX5, warstwa wspólna i moduły klocków wzorca leżą w ce/*.js (ładowane
   wcześniej). Tutaj zostają wyłącznie moduły klocków unikalnych tej podstrony.
   Bez własnej definicji `window.CX5` i bez `CX5.start()` – szyna startuje sama
   na DOMContentLoaded. ==================================================== */
/* ===== 40 · Który dla mnie: pop-up z pełną kartą, parallax, reveal (spec §7) ==
   1. Pop-up – wzór: jedyny modal V5 (lightbox strony kukurydzy, uprawa.js
      l. 60–131). Bez JS pop-upy leżą w biegu strony pod swoimi wierszami i cała
      treść jest widoczna; tutaj jadą na koniec <body> i zachowują się jak okno
      modalne: nakładka, X, klik obok panelu, Escape, pułapka Tab, `inert` na
      tle, zablokowane przewijanie strony, powrót fokusu na przycisk. Hash się
      nie zmienia.
   2. Parallax zdjęć – tylko przy `CX5.motionOn()`.
   3. Reveal opisów i noty – przez `CX5.reveal` (ce/00-base.js, moduł 02). == */
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

/* ===== 80 · Kiedy stosować: dwa panele fotograficzne (spec §16.1) ===========
   Iteration 2: the pin module of iteration 1 is gone – nothing is pinned and
   nothing is opened by the scroll any more. What is left here:
   1. Parallax of the two panel photos – only at `CX5.motionOn()`.
   2. Reveal of the panels – through `CX5.reveal` (ce/00-base.js).
   Pas PRO tej sekcji prowadzi ce/CE-16-pas-pro.js. ====================== */
(function () {
  "use strict";
  var $$ = CX5.$$;

  /* --- 1. Parallax zdjęć w panelach ----------------------------------------
     Warstwa zdjęcia jest wyższa od kadru (118 %), więc mieści przesunięcie bez
     odsłaniania krawędzi panelu. `--when-par` idzie od -6 do 0 (procent
     wysokości warstwy), gdy panel przejeżdża przez ekran; bez ruchu własność
     znika i kadr stoi na wartości domyślnej. */
  var whenMedias = $$("[data-when-media]");
  if (!whenMedias.length) return;
  function whenParallax() {
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

  CX5.register({ scroll: whenParallax, resize: whenParallax });
})();

