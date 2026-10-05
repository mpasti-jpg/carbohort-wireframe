/* =====================================================================
   b2b-zamow.js – page script of b2b-zamow.html (order table, CE-92).
   Spec: platforma-b2b-spec.md 16.4 (CE-92 contract) and 16.7.

   Two jobs, nothing else:
   1. quantities – at start and after every change of the mock-up state
      (event c5b:stan) the script writes one scenario from
      CWB2B.scenariusze into the quantity fields and sends "change" on
      each of them; the CE-92 module does all the counting. The address
      parameter ponow=<order number> picks the quantities of a past
      order for the first state shown. When that order is not the
      regular scenario, no button of the mock-up state bar is pressed;
   2. next step – after c5-order:zmiana it sets the target of the
      "Dalej" button: the large-order scenario from the threshold up,
      and state "ponow" of the delivery step (the example order with a
      one-line notice) while the quantities of a past order are shown.

   Stands after ce/CE-92-tabela-zamowieniowa.js. Listeners are attached
   right away, because both events fire once at start. No globals.
   ===================================================================== */
(function () {
  "use strict";

  var tabela = document.getElementById("tabela");
  var dane = window.CWB2B;
  if (!tabela || !dane) { return; }

  var dalej = tabela.querySelector(".c5-order__next");

  /* One parameter: address query first, then the fragment (read as
     parameters only when it contains "=") – the same order as CWB2B.stan(). */
  function parametr(nazwa) {
    var v = new URLSearchParams(window.location.search).get(nazwa);
    var hash = window.location.hash.replace(/^#/, "");
    if (v === null && hash.indexOf("=") !== -1) { v = new URLSearchParams(hash).get(nazwa); }
    return v;
  }

  /* Writes quantities (key = row id without "w-"); rows not named get 0. */
  function wpisz(ilosci) {
    Array.prototype.forEach.call(tabela.querySelectorAll(".c5-order__row"), function (wiersz) {
      var pole = wiersz.querySelector(".cws-qty__v");
      if (!pole) { return; }
      pole.value = ilosci[wiersz.id.replace(/^w-/, "")] || 0;
      pole.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  /* Drops ponow from the address – query and fragment – once a state was
     chosen by hand, so a reload shows the chosen state. */
  function zdejmijPonow() {
    try {
      var url = new URL(window.location.href);
      var zmiana = false;
      if (url.searchParams.has("ponow")) { url.searchParams.delete("ponow"); zmiana = true; }
      if (url.hash.indexOf("=") !== -1) {
        var h = new URLSearchParams(url.hash.slice(1));
        if (h.has("ponow")) { h.delete("ponow"); url.hash = h.toString(); zmiana = true; }
      }
      if (zmiana) { window.history.replaceState(window.history.state, "", url.href); }
    } catch (e) { /* preview bundles have no address of their own */ }
  }

  /* No state of the bar describes the quantities of a past order. */
  function odznacz() {
    Array.prototype.forEach.call(document.querySelectorAll(".c5b-stan [data-stan-ustaw][aria-pressed]"), function (b) {
      b.setAttribute("aria-pressed", "false");
    });
  }

  var ponow = parametr("ponow");
  var pierwszy = true;
  /* true while the table shows a past order that is not the regular scenario */
  var przyklad = false;

  tabela.addEventListener("c5-order:zmiana", function (e) {
    if (!dalej) { return; }
    dalej.setAttribute("href", e.detail && e.detail.duze ? "b2b-dostawa.html?stan=duze"
      : przyklad ? "b2b-dostawa.html?stan=ponow" : "b2b-dostawa.html");
  });

  document.addEventListener("c5b:stan", function (e) {
    var scenariusze = dane.scenariusze;
    var ilosci = null;
    if (pierwszy && ponow) { ilosci = scenariusze.ponow[ponow.toUpperCase()] || null; }
    if (!pierwszy) { zdejmijPonow(); }
    pierwszy = false;
    przyklad = !!ilosci && ilosci !== scenariusze.zwykle;
    if (przyklad) { odznacz(); }
    wpisz(ilosci || scenariusze[e.detail && e.detail.stan] || scenariusze.zwykle);
  });
})();
