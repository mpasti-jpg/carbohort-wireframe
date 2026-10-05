/* =====================================================================
   handlowiec.js – page script of the four sales-desk pages
   (admin.html, handlowiec-zamowienie.html, handlowiec-klient.html,
   handlowiec-uzgodnienie.html). Spec: platforma-b2b-spec.md 16.6–16.8.

   1. admin.html – the segment "Moi klienci / Wszyscy" filters the list
      (rows of the signed-in employee carry data-moj="1").
   2. handlowiec-zamowienie.html – the panel of #warunki is filled from the
      c5-order:zmiana event of #pozycje and from the discount field.
   3. handlowiec-klient.html – the level segment swaps the large-order
      threshold and the three discounts (CWB2B.progi, CWB2B.rabaty).
   4. handlowiec-uzgodnienie.html – the offer summary is recounted after
      a change of the discount or of the delivery cost.

   Start values stand in the HTML; all sums go through CWB2B.suma()
   (integers in grosze). Output cells are marked with data-wynik.
   Stands after the CE modules at the end of <body>; no globals.
   ===================================================================== */
(function () {
  "use strict";

  var B = window.CWB2B;
  if (!B) { return; }

  var LIVE_DELAY = 400;

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  /* "2,5" -> 2.5 · "2 400,00 zł" -> 2400 · "" or text -> 0 */
  function liczba(tekst) {
    var n = parseFloat(String(tekst || "").replace(/[^\d,.\-]/g, "").replace(",", "."));
    return isFinite(n) && n > 0 ? n : 0;
  }

  /* Discount in percent, 0–100 */
  function procent(tekst) { return Math.min(100, liczba(tekst)); }

  /* 2.5 -> "2,5%" */
  function zapisProcentu(p) { return String(p).replace(".", ",") + "%"; }

  /* 1 pozycja, 2–4 pozycje, 5+ pozycji */
  function pozycji(n) {
    var d = n % 10, h = n % 100;
    if (n === 1) { return "pozycja"; }
    if (d >= 2 && d <= 4 && (h < 12 || h > 14)) { return "pozycje"; }
    return "pozycji";
  }

  function pole(root, klucz) { return root.querySelector('[data-wynik="' + klucz + '"]'); }

  function wpisz(root, klucz, tekst) {
    var el = pole(root, klucz);
    if (el && el.textContent !== tekst) { el.textContent = tekst; }
  }

  /* --- 1. admin.html: list scope ---------------------------------------- */
  (function () {
    var lista = document.getElementById("lista");
    var przyciski = document.querySelectorAll("#naglowek .c5-seg__tab[data-zakres]");
    if (!lista || !przyciski.length) { return; }
    var wiersze = lista.querySelectorAll("tbody tr");

    function ustaw(zakres) {
      each(przyciski, function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-zakres") === zakres ? "true" : "false");
      });
      each(wiersze, function (w) {
        w.hidden = zakres === "moi" && w.getAttribute("data-moj") !== "1";
      });
    }

    each(przyciski, function (b) {
      b.addEventListener("click", function () { ustaw(b.getAttribute("data-zakres")); });
      if (b.getAttribute("aria-pressed") === "true") { ustaw(b.getAttribute("data-zakres")); }
    });
  })();

  /* --- 2. handlowiec-zamowienie.html: panel next to the order table ------ */
  (function () {
    var tabela = document.getElementById("pozycje");
    var warunki = document.getElementById("warunki");
    var rabat = document.getElementById("wr-rabat");
    if (!tabela || !warunki || !rabat || !tabela.classList.contains("c5-order")) { return; }

    var ostatnie = null;   /* detail of the last c5-order:zmiana */

    function przelicz() {
      if (!ostatnie) { return; }
      var p = procent(rabat.value);
      var s = B.suma(ostatnie.nettoGr, { rabatProc: p });
      var wiersz = pole(warunki, "rabat-wiersz");
      wpisz(warunki, "pozycje-nazwa", ostatnie.pozycje + " " + pozycji(ostatnie.pozycje) + " netto");
      wpisz(warunki, "pozycje", B.fmt(s.pozycje));
      if (wiersz) { wiersz.hidden = p === 0; }
      wpisz(warunki, "rabat-nazwa", "Dodatkowy rabat na całe zamówienie " + zapisProcentu(p));
      wpisz(warunki, "rabat", B.fmt(-s.rabat));
      wpisz(warunki, "po-rabacie-nazwa", p === 0 ? "Razem netto, bez rabatu" : "Po rabacie netto");
      wpisz(warunki, "po-rabacie", B.fmt(s.poRabacie));
    }

    /* The listener is set right away – the module sends the first event at its start. */
    tabela.addEventListener("c5-order:zmiana", function (e) {
      ostatnie = e.detail;
      przelicz();
    });
    rabat.addEventListener("input", przelicz);
    rabat.addEventListener("change", przelicz);
  })();

  /* --- 3. handlowiec-klient.html: account level --------------------------- */
  (function () {
    var konto = document.getElementById("konto");
    if (!konto) { return; }
    var opcje = konto.querySelectorAll('input[type="radio"][name="poziom"]');
    if (!opcje.length) { return; }

    function ustaw(radio) {
      var poziom = radio.value;
      var rabaty = B.rabaty[poziom];
      if (!rabaty || !B.progi[poziom]) { return; }
      wpisz(konto, "poziom", radio.getAttribute("data-nazwa") || poziom);
      wpisz(konto, "prog", B.fmt(B.progi[poziom], true));
      wpisz(konto, "carbomat", "rabat " + rabaty.carbomat + "%");
      wpisz(konto, "carbohumic", "rabat " + rabaty.carbohumic + "%");
      wpisz(konto, "pozostale", "rabat " + rabaty.pozostale + "%");
    }

    each(opcje, function (radio) {
      radio.addEventListener("change", function () { if (radio.checked) { ustaw(radio); } });
      if (radio.checked) { ustaw(radio); }
    });
  })();

  /* --- 4. handlowiec-uzgodnienie.html: offer summary ---------------------- */
  (function () {
    var odp = document.getElementById("odpowiedz");
    var rabat = document.getElementById("od-rabat");
    var dostawa = document.getElementById("od-dostawa");
    var wazna = document.getElementById("od-wazna");
    if (!odp || !rabat || !dostawa) { return; }

    var pozycjeGr = parseInt(odp.getAttribute("data-pozycje-gr"), 10) || 0;
    var komunikat = pole(odp, "komunikat");
    var zegar = null;

    function przelicz(oglos) {
      var p = procent(rabat.value);
      var s = B.suma(pozycjeGr, { rabatProc: p, dostawaGr: Math.round(liczba(dostawa.value) * 100) });
      wpisz(odp, "pozycje", B.fmt(s.pozycje));
      wpisz(odp, "rabat-nazwa", "Dodatkowy rabat na całe zamówienie " + zapisProcentu(p));
      wpisz(odp, "rabat", B.fmt(-s.rabat));
      wpisz(odp, "po-rabacie", B.fmt(s.poRabacie));
      wpisz(odp, "dostawa", B.fmt(s.dostawa));
      wpisz(odp, "netto", B.fmt(s.netto));
      wpisz(odp, "vat", B.fmt(s.vat));
      wpisz(odp, "brutto", B.fmt(s.brutto));
      if (wazna) { wpisz(odp, "wazna", wazna.value.trim() || "–"); }
      /* One live region, written with a delay so typing is not announced key by key. */
      if (komunikat && oglos) {
        clearTimeout(zegar);
        zegar = setTimeout(function () {
          komunikat.textContent = "Razem netto " + B.fmt(s.netto) + ", brutto " + B.fmt(s.brutto);
        }, LIVE_DELAY);
      }
    }

    each([rabat, dostawa, wazna], function (el) {
      if (!el) { return; }
      el.addEventListener("input", function () { przelicz(true); });
      el.addEventListener("change", function () { przelicz(true); });
    });
    przelicz(false);
  })();
})();
