/* =========================================================================
   uprawa.js - mechaniki warstwy stron pojedynczych upraw (V5).
   Wchodzi PO cw.js i c5.js. Nic z c5.js nie duplikuje: subnawigacja,
   scrollspy, dok doradcy i przelicznik [data-calc] zostaja tam.
   Kazda mechanika ma guard na brak markupu, wiec plik jest bezpieczny
   dla dowolnej podstrony uprawy.
   Zawartosc: 0 wspolna warstwa nakladek (overlay, pulapka fokusa, inert,
   stop/start inercji), 1 reveal, 2 odliczanie liczb, 3 popup produktu (drugi
   egzemplarz lightboxa), 5 pasek potasu, 7 lightbox (jedna implementacja dla
   wielu egzemplarzy), 8 rozwijanie w miejscu, 10 pudelka wariantow,
   12 wskaznik karuzeli (u-rail - uzywa go rzad produktow i karuzela
   stanowiska), 13 suwak powierzchni. (9 - checklista - usunieta w iteracji 2;
   6 - pionowa os faz - usunieta w iteracji 5, fazy sa lista z panelem w
   kukurydza.js; 4 - wybieracz - i 11 - lista-karta stanowiska - usuniete w
   iteracji 6, po scenie wyboru i karuzeli u-cr nic ich nie uzywa.)
   ========================================================================= */
(function () {
  "use strict";
  var doc = document;
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  var reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* przenikanie panelu: pokazany element wchodzi z opacity 0 -> 1 */
  function przenikaj(el) {
    if (reducedMQ.matches) return;
    el.classList.add("is-swap");
    void el.offsetWidth;
    el.classList.remove("is-swap");
  }

  /* --- panelSet: animowana wysokosc panelu ---------------------------------
     Celowa kopia funkcji z c5.js (spec: kopiowac, nie importowac) - warstwa
     uprawy nie moze zalezec od wewnetrznych symboli c5.js. */
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

  /* --- 0. Wspolna warstwa nakladek ----------------------------------------
     Oba lightboxy - fazy i produkty - mowia tym samym jezykiem: jeden
     overlay, jeden przycisk X, ta sama pulapka fokusa, ten sam `inert`
     na tle i ta sama blokada przewijania. */
  var overlay = $("[data-overlay]");
  var warstwa = null;        /* aktualnie otwarty .u-lightbox */
  var opener = null;         /* element, ktory go otworzyl */
  var przyZamknieciu = null; /* sprzatanie zalezne od warstwy (hash) */
  var powrot = null;         /* {id, przycisk} - warstwa, do ktorej wracamy */

  function tloNodes() {
    var out = $$("main > *").filter(function (n) {
      return !n.classList.contains("u-lightbox") && !n.hasAttribute("data-overlay");
    });
    return out.concat($$("cw-navbar, .c5-dots, cw-footer, cw-dock"));
  }
  function tloInert(on) { tloNodes().forEach(function (n) { n.inert = on; }); }
  function focusables(box) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', box)
      .filter(function (n) { return n.offsetWidth > 0 || n.offsetHeight > 0; });
  }
  /* Inercja (Lenis) zyje w warstwie strony i moze jej nie byc - dlatego
     siegamy po nia leniwie, dopiero w chwili otwarcia. Bez Lenis przewijanie
     tla blokuje sama klasa `u-locked` na <body>. */
  function inercja(metoda) {
    var l = window.CX5 && window.CX5.lenis;
    if (l && typeof l[metoda] === "function") l[metoda]();
  }

  function uspij(box) {
    box.setAttribute("data-open", "false");
    box.setAttribute("aria-hidden", "true");
    box.inert = true;
  }
  function zamknij(wrocFokus) {
    if (!warstwa) return;
    var box = warstwa, ktoOtworzyl = opener, sprzataczka = przyZamknieciu, wracamy = powrot;
    warstwa = null; opener = null; przyZamknieciu = null; powrot = null;
    uspij(box);
    if (overlay) { overlay.setAttribute("data-open", "false"); overlay.hidden = true; }
    doc.body.classList.remove("u-locked");
    tloInert(false);
    if (sprzataczka) sprzataczka();
    /* popup otwarty z wnetrza innej warstwy wraca do niej z fokusem na
       przycisku, ktory go otworzyl - inercja zostaje wtedy zatrzymana */
    if (wracamy) { lbOtworz(wracamy.id, wracamy.przycisk, null, wracamy.przycisk); return; }
    inercja("start");
    if (wrocFokus !== false && ktoOtworzyl && ktoOtworzyl.focus) ktoOtworzyl.focus();
  }
  function otworz(box, ktoOtworzyl, sprzataczka, wracajDo, fokusEl) {
    if (!box || warstwa === box) return;
    if (warstwa) { powrot = null; zamknij(false); }
    opener = ktoOtworzyl || null;
    przyZamknieciu = sprzataczka || null;
    powrot = wracajDo || null;
    warstwa = box;
    if (overlay) { overlay.hidden = false; void overlay.offsetWidth; overlay.setAttribute("data-open", "true"); }
    box.removeAttribute("aria-hidden");
    box.inert = false;
    box.setAttribute("data-open", "true");
    doc.body.classList.add("u-locked");
    inercja("stop");
    tloInert(true);
    var f = focusables(box);
    (fokusEl || f[0] || box).focus();
  }
  if (overlay) {
    overlay.hidden = true;
    overlay.setAttribute("data-open", "false");
    overlay.addEventListener("click", function () { zamknij(); });
  }
  doc.addEventListener("keydown", function (e) {
    if (!warstwa) return;
    if (e.key === "Escape") { e.preventDefault(); zamknij(); return; }
    if (e.key !== "Tab") return;
    var f = focusables(warstwa);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!warstwa.contains(doc.activeElement)) { e.preventDefault(); first.focus(); }
  });

  /* --- 1. reveal: wejscie sekcji w widok ---------------------------------- */
  var revealEls = $$(".u-reveal");
  if (revealEls.length) {
    if (!("IntersectionObserver" in window) || reducedMQ.matches) {
      revealEls.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          /* elementy wyzsze od ekranu nie osiagna progu 0.15 - lapiemy je osobno */
          var tall = en.boundingClientRect.height > window.innerHeight * 0.8;
          if (en.isIntersecting && (en.intersectionRatio >= 0.15 || tall)) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      }, { threshold: [0, 0.15], rootMargin: "0px 0px -10%" });
      revealEls.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
        else io.observe(el);
      });
    }
  }

  /* --- 2. kafle liczb: odliczanie od zera --------------------------------- */
  $$("[data-count]").forEach(function (el) {
    var txt = (el.getAttribute("data-count") || el.textContent || "").trim();
    el.textContent = txt;
    var m = /^(\d+)(?:[.,](\d+))?$/.exec(txt);
    /* zakresy („20-40") i wszystko nieliczbowe tylko wjezdzaja z kaflem */
    if (!m || reducedMQ.matches || !("IntersectionObserver" in window)) return;
    var dec = m[2] ? m[2].length : 0;
    var target = parseFloat(txt.replace(",", "."));
    function fmt(v) { return v.toFixed(dec).replace(".", ","); }
    var ran = false;
    function run() {
      if (ran) return; ran = true;
      var t0 = 0, dur = 600;
      function frame(now) {
        if (!t0) t0 = now;
        var p = Math.min(1, (now - t0) / dur);
        el.textContent = fmt(target * (p * (2 - p)));
        if (p < 1) window.requestAnimationFrame(frame); else el.textContent = txt;
      }
      el.textContent = fmt(0);
      window.requestAnimationFrame(frame);
    }
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(); cio.unobserve(en.target); } });
    }, { threshold: 0.2 });
    cio.observe(el);
  });

  /* --- 7. lightbox: jedna implementacja, dowolna liczba egzemplarzy --------
     Egzemplarz 1 to opisy faz, egzemplarz 2 to popup produktu (mechanika 3).
     Kazdy ma wlasne strony i wspolny slownik hasha. Prev/next i wspolna stopka
     sa opcjonalne: popup produktu nie ma ani strzalek, ani wspolnej stopki
     (kazda strona niesie wlasna, ze swoimi adresami - spec 9.5). */
  var lbMapa = {};                         /* id strony -> egzemplarz */
  var lbEgz = $$("[data-lightbox]").map(function (box) {
    var strony = $$("[data-lightbox-page]", box);
    var e = {
      box: box,
      strony: strony,
      ids: strony.map(function (p) { return p.getAttribute("data-lightbox-page"); }),
      scroll: $("[data-lightbox-scroll]", box),
      prev: $("[data-lightbox-prev]", box),
      next: $("[data-lightbox-next]", box),
      teraz: null
    };
    e.ids.forEach(function (id) { lbMapa[id] = e; });
    return e;
  }).filter(function (e) { return e.ids.length; });

  function hashSet(v) {
    if (!window.history || !history.replaceState) return;
    history.replaceState(null, "", v || (location.pathname + location.search));
  }
  function lbPokaz(e, id, setHash) {
    var i = e.ids.indexOf(id);
    if (i < 0) return;
    e.teraz = id;
    e.strony.forEach(function (p, j) { p.hidden = j !== i; });
    e.box.setAttribute("aria-labelledby", id + "-t");
    if (e.prev) e.prev.disabled = i === 0;
    if (e.next) e.next.disabled = i === e.ids.length - 1;
    if (e.scroll) e.scroll.scrollTop = 0;
    if (setHash !== false) hashSet("#" + id);
  }
  function lbOtworz(id, ktoOtworzyl, wracajDo, fokusEl) {
    var e = lbMapa[id];
    if (!e) return;
    lbPokaz(e, id, true);
    otworz(e.box, ktoOtworzyl, function () { hashSet(null); }, wracajDo, fokusEl);
  }
  function lbEgzemplarz(box) {
    for (var i = 0; i < lbEgz.length; i++) if (lbEgz[i].box === box) return lbEgz[i];
    return null;
  }
  lbEgz.forEach(function (e) {
    uspij(e.box);
    e.strony.forEach(function (p) { p.hidden = true; });
    lbPokaz(e, e.ids[0], false);
    if (e.prev) e.prev.addEventListener("click", function () {
      var i = e.ids.indexOf(e.teraz);
      if (i > 0) { lbPokaz(e, e.ids[i - 1], true); przenikaj(e.strony[i - 1]); }
    });
    if (e.next) e.next.addEventListener("click", function () {
      var i = e.ids.indexOf(e.teraz);
      if (i >= 0 && i < e.ids.length - 1) { lbPokaz(e, e.ids[i + 1], true); przenikaj(e.strony[i + 1]); }
    });
    e.box.addEventListener("click", function (ev) {
      /* klik obok panelu = klik w nakladke (lightbox lezy nad overlayem) */
      if (ev.target === e.box) { zamknij(); return; }
      /* link w tresci prowadzi na strone pod spodem - najpierw zamykamy */
      var a = ev.target.closest ? ev.target.closest('a[href^="#"]') : null;
      if (a && e.box.contains(a) && !a.hasAttribute("data-lightbox-close")) zamknij(false);
    });
  });
  if (lbEgz.length) {
    $$("[data-lightbox-close]").forEach(function (b) {
      b.addEventListener("click", function () { zamknij(); });
    });
    $$("[data-lightbox-open]").forEach(function (b) {
      b.addEventListener("click", function (ev) {
        ev.preventDefault();
        var id = b.getAttribute("data-lightbox-open");
        var cel = lbMapa[id];
        if (!cel) return;
        /* wyzwalacz z wnetrza innej warstwy - zapamietujemy droge powrotna */
        var wracajDo = null;
        if (warstwa && warstwa !== cel.box) {
          var skad = lbEgzemplarz(warstwa);
          if (skad && skad.teraz) wracajDo = { id: skad.teraz, przycisk: b };
        }
        lbOtworz(id, b, wracajDo);
      });
    });
    var zHasha = (location.hash || "").replace("#", "");
    if (lbMapa[zHasha]) lbOtworz(zHasha, null);
    window.addEventListener("hashchange", function () {
      var hh = (location.hash || "").replace("#", "");
      if (lbMapa[hh]) lbOtworz(hh, null);
    });
  }

  /* --- 5. pasek potasu ---------------------------------------------------- */
  $$("[data-kbar]").forEach(function (box) {
    var doses = $$("[data-k-dose]", box);
    var bar = $("[data-k-bar]", box);
    var texts = $$("[data-k-text]", box);
    if (!doses.length) return;
    function pick(key) {
      var pct = 0;
      doses.forEach(function (b) {
        var on = b.getAttribute("data-k-dose") === key;
        b.setAttribute("aria-pressed", on ? "true" : "false");
        if (on) pct = parseFloat(b.getAttribute("data-k-pct")) || 0;
      });
      if (bar) bar.style.width = pct + "%";
      texts.forEach(function (t) { t.hidden = t.getAttribute("data-k-text") !== key; });
    }
    doses.forEach(function (b) {
      b.addEventListener("click", function () { pick(b.getAttribute("data-k-dose")); });
    });
    pick(doses[0].getAttribute("data-k-dose"));
  });

  /* --- 8. rozwijanie w miejscu ------------------------------------------- */
  $$("[data-disclose]").forEach(function (btn) {
    var panel = doc.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    panelSet(panel, btn.getAttribute("aria-expanded") === "true", true);
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panelSet(panel, open);
    });
  });

  /* --- 10. pudelka wariantow (tablist) ------------------------------------ */
  $$("[data-tabs-group]").forEach(function (g) {
    var tabs = $$('[role="tab"]', g);
    var panels = $$('[role="tabpanel"]', g);
    if (tabs.length < 2 || tabs.length !== panels.length) return;
    function pick(i, focus) {
      tabs.forEach(function (t, j) {
        t.setAttribute("aria-selected", j === i ? "true" : "false");
        t.tabIndex = j === i ? 0 : -1;
      });
      panels.forEach(function (p, j) {
        var on = j === i, bylUkryty = p.hidden;
        p.hidden = !on;
        if (on && bylUkryty) przenikaj(p);
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { pick(i); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % tabs.length;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") n = 0;
        else if (e.key === "End") n = tabs.length - 1;
        if (n === null) return;
        e.preventDefault();
        pick(n, true);
      });
    });
    pick(0);
  });

  /* --- 12. wskaznik przewijania karuzeli produktow ------------------------ */
  $$("[data-rail]").forEach(function (rail) {
    var scroller = doc.getElementById(rail.getAttribute("data-rail"));
    var thumb = $("[data-rail-thumb]", rail);
    if (!scroller || !thumb) return;
    function sync() {
      var trackW = rail.clientWidth;
      var ratio = scroller.scrollWidth > 0 ? scroller.clientWidth / scroller.scrollWidth : 1;
      var thumbW = Math.max(24, Math.round(trackW * Math.min(1, ratio)));
      var max = scroller.scrollWidth - scroller.clientWidth;
      var p = max > 0 ? scroller.scrollLeft / max : 0;
      thumb.style.width = thumbW + "px";
      thumb.style.transform = "translateX(" + Math.round(p * (trackW - thumbW)) + "px)";
    }
    scroller.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    window.addEventListener("load", sync);
    sync();
  });

  /* --- 13. suwak powierzchni ---------------------------------------------
     Liczy nadal c5.js: suwak tylko wpisuje wartosc do [data-calc-in]
     i wysyla na nim `input`. Wpis w polu cofa sie do suwaka. */
  $$("[data-calc-range]").forEach(function (range) {
    var box = range.closest ? range.closest("[data-calc]") : null;
    var field = box ? $("[data-calc-in]", box) : null;
    if (!field) return;
    var lo = parseFloat(range.min), hi = parseFloat(range.max);
    range.addEventListener("input", function () {
      field.value = range.value;
      field.dispatchEvent(new Event("input", { bubbles: true }));
    });
    field.addEventListener("input", function () {
      var v = parseFloat(String(field.value || "").replace(",", "."));
      if (!isFinite(v)) return;
      range.value = Math.min(hi, Math.max(lo, v));
    });
  });
})();
