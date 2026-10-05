/* =====================================================================
   b2b-wspolne.js – shared data and page-state helper of the B2B platform
   mock-ups (window.CWB2B). Spec: platforma-b2b-spec.md 16.6 and 16.7.

   Loaded in <head>, before chrome.js. Touches no DOM while loading – the
   first state is shown on DOMContentLoaded.

   CWB2B is NOT a pricing engine: it holds no catalogue, orders, documents
   or cases. Rows, prices and amounts stand in the HTML of each page. What
   lives here: the two VAT rates, the two display names for the headers,
   the quantities of the order scenarios, the thresholds and discounts of
   the three account levels, one sum function, one formatter and the
   state switch of the mock-up (stan / pokaz).
   All amounts are integers in grosze.
   ===================================================================== */
(function (window, document) {
  "use strict";

  var NBSP = " ";
  var MINUS = "−";

  /* Accepts a number or a string typed into a field ("2,5", " 2400 "). */
  function num(v) {
    if (typeof v === "string") { v = parseFloat(v.replace(/\s/g, "").replace(",", ".")); }
    return typeof v === "number" && isFinite(v) ? v : 0;
  }

  /* Sum of an order. `pozycjeGr` – total of the lines in grosze (or an array
     of line values). Every step is rounded to one grosz; percentages are
     applied as integer * percent / 100, never as a decimal fraction. */
  function suma(pozycjeGr, opcje) {
    var o = opcje || {};
    var pozycje = Array.isArray(pozycjeGr)
      ? pozycjeGr.reduce(function (s, v) { return s + Math.round(num(v)); }, 0)
      : Math.round(num(pozycjeGr));
    var rabatProc = Math.max(0, num(o.rabatProc));
    var dostawa = Math.max(0, Math.round(num(o.dostawaGr)));
    var rabat = Math.round(pozycje * rabatProc / 100);
    var poRabacie = pozycje - rabat;
    var vat8 = Math.round(poRabacie * CWB2B.VAT.produkty / 100);
    var vat23 = Math.round(dostawa * CWB2B.VAT.dostawa / 100);
    var netto = poRabacie + dostawa;
    var vat = vat8 + vat23;
    return {
      pozycje: pozycje, rabat: rabat, poRabacie: poRabacie, dostawa: dostawa,
      netto: netto, vat8: vat8, vat23: vat23, vat: vat, brutto: netto + vat
    };
  }

  /* 1294572 -> "12 945,72 zł" (non-breaking spaces, always with grosze).
     Second argument `true` drops the grosze: 4000000 -> "40 000 zł". */
  function fmt(gr, bezGroszy) {
    var n = Math.round(num(gr));
    var znak = n < 0 ? MINUS : "";
    n = Math.abs(n);
    var zl = String(Math.floor(n / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
    var grosze = ("0" + (n % 100)).slice(-2);
    return znak + zl + (bezGroszy ? "" : "," + grosze) + NBSP + "zł";
  }

  /* State from one source: `stan`, and when it is missing – `nr` in lower case. */
  function zParametrow(tekst) {
    var p = new URLSearchParams(tekst);
    return p.get("stan") || (p.get("nr") || "").toLowerCase();
  }

  /* Current page state: address query first, then the fragment (read as
     parameters only when it contains "="), then <body data-stan-domyslny>. */
  function stan() {
    var s = zParametrow(window.location.search);
    var hash = window.location.hash.replace(/^#/, "");
    if (!s && hash.indexOf("=") !== -1) { s = zParametrow(hash); }
    return s || (document.body && document.body.getAttribute("data-stan-domyslny")) || "";
  }

  function lista(el) {
    return (el.getAttribute("data-stan") || "").split(/\s+/);
  }

  /* Is the state known to this page – named by a state block or by a button? */
  function znany(s, bloki, przyciski) {
    var i;
    for (i = 0; i < bloki.length; i++) { if (lista(bloki[i]).indexOf(s) !== -1) { return true; } }
    for (i = 0; i < przyciski.length; i++) { if (przyciski[i].getAttribute("data-stan-ustaw") === s) { return true; } }
    return false;
  }

  /* Keeps the state in the address so a reload shows the same screen. The
     state goes back to the part of the address it came from: the query when
     the query already names a state, the fragment otherwise (also on a page
     opened without parameters) – a fragment survives where the query never
     reaches the page. A plain anchor in the fragment is replaced. */
  function zapisz(s) {
    if (stan() === s) { return; }
    try {
      var url = new URL(window.location.href);
      var wZapytaniu = url.searchParams.has("stan") || url.searchParams.has("nr");
      var h = new URLSearchParams(url.hash.indexOf("=") !== -1 ? url.hash.slice(1) : "");
      h.delete("stan"); h.delete("nr");
      if (wZapytaniu) {
        url.searchParams.delete("nr");
        url.searchParams.set("stan", s);
      } else {
        h.set("stan", s);
      }
      url.hash = h.toString();
      window.history.replaceState(window.history.state, "", url.href);
    } catch (e) { /* preview bundles have no address of their own */ }
  }

  /* On a phone the state bar is one row that scrolls sideways: bring the
     pressed button into it. Only the bar is scrolled, never the page. */
  function wWidok(b) {
    var pas = b.parentNode;
    if (!pas || pas.scrollWidth <= pas.clientWidth) { return; }
    var rb = b.getBoundingClientRect();
    var rp = pas.getBoundingClientRect();
    pas.scrollLeft += rb.left - rp.left - (rp.width - rb.width) / 2;
  }

  /* Shows the blocks of one state, hides the rest, marks the buttons of the
     mock-up state bar and announces the change. Does not move focus. */
  function pokaz(s) {
    var bloki = document.querySelectorAll("[data-stan]");
    var przyciski = document.querySelectorAll("[data-stan-ustaw]");
    var domyslny = (document.body && document.body.getAttribute("data-stan-domyslny")) || "";
    s = String(s || "");
    if (!znany(s, bloki, przyciski)) { s = domyslny; }
    if (!s) { return; }
    bloki.forEach(function (el) { el.hidden = lista(el).indexOf(s) === -1; });
    przyciski.forEach(function (b) {
      /* only toggle buttons carry aria-pressed; an action button that sets a state stays plain */
      if (b.hasAttribute("aria-pressed")) {
        var on = b.getAttribute("data-stan-ustaw") === s;
        b.setAttribute("aria-pressed", on ? "true" : "false");
        if (on) { wWidok(b); }
      }
    });
    zapisz(s);
    document.dispatchEvent(new CustomEvent("c5b:stan", { detail: { stan: s } }));
  }

  var ZWYKLE = { "carbomat-eco-6-bb1000": 6, "carbohumic-187mesh-m1000": 1, "maxi-plus-k20": 4 };

  var CWB2B = {
    VAT: { produkty: 8, dostawa: 23 },
    klient: { nazwa: "Gospodarstwo Sadownicze Zielony Jar (przykład)" },
    opiekun: { nazwa: "Anna Przykładowa (przykład)" },
    /* quantities for the order table; key = row id without the "w-" prefix */
    scenariusze: {
      zwykle: ZWYKLE,
      duze: { "carbomat-eco-6-bb1000": 24, "carbohumic-187mesh-m1000": 4, "maxi-plus-k20": 10, "carbomat-eco-sciolka-bb1000": 12 },
      ponow: {
        "B2B-0412": ZWYKLE,
        "B2B-0388": { "carbohumic-187mesh-m1000": 1 },
        "B2B-0351": { "carbomat-eco-6-bb1000": 6 }
      }
    },
    /* large-order threshold per account level, net, in grosze */
    progi: { bronze: 2000000, silver: 4000000, gold: 8000000 },
    /* discount per account level and product group, in percent */
    rabaty: {
      bronze: { carbomat: 10, carbohumic: 8, pozostale: 5 },
      silver: { carbomat: 15, carbohumic: 12, pozostale: 10 },
      gold: { carbomat: 20, carbohumic: 16, pozostale: 15 }
    },
    suma: suma,
    fmt: fmt,
    stan: stan,
    pokaz: pokaz
  };

  window.CWB2B = CWB2B;

  /* Message of the state just set: a visible role="status" block that can
     take focus and belongs to this state. */
  function komunikat(s) {
    var lista2 = document.querySelectorAll('[role="status"][tabindex="-1"]');
    for (var i = 0; i < lista2.length; i++) {
      var blok = lista2[i].closest("[data-stan]");
      if (blok && lista(blok).indexOf(s) !== -1 && !lista2[i].closest("[hidden]")) { return lista2[i]; }
    }
    return null;
  }

  /* Mock-up state bar and any other control that sets a state. The bar
     (toggle buttons with aria-pressed) never moves focus; an action button
     that sets a state hands focus to the message of that state, because the
     button itself may be gone by then. */
  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest ? e.target.closest("[data-stan-ustaw]") : null;
    if (!b) { return; }
    var s = b.getAttribute("data-stan-ustaw");
    pokaz(s);
    if (!b.hasAttribute("aria-pressed")) {
      var k = komunikat(s);
      if (k) { k.focus(); }
    }
  });

  function start() { pokaz(stan()); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})(window, document);
