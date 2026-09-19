/* ===== Kontakt · moduły strony ===========================================
   Loaded after `ce/00-base.js`, so the CX5 bus already exists and has already
   started itself – this file only registers modules on it and never defines
   or starts `CX5`. Three blocks of mechanics, each usable on its own:
     10 – demo form (CE-50, variant „kontakt")
     20 – chips „Wybierz sprawę" -> highlight of a department row (CE-55)
     30 – pins of the distributor map <-> location cards (CE-56)
   Everything here is an ADDITION: without JS the chips and the pins are plain
   anchors, the rows and the cards are readable, and the form simply does not
   pretend to send anything. ============================================== */


/* ===== 10 · Formularz demonstracyjny (CE-50 „kontakt") ====================
   Nothing goes to a server. On submit we check the required fields: if any is
   empty the form marks them and shows the alert; otherwise it shows the demo
   message (`role="status"`). Editing a field clears its mark. ============ */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$;

  $$("form[data-demo-form]").forEach(function (form) {
    var msg = $("[data-demo-msg]", form);
    var err = $("[data-demo-err]", form);

    function mark(field, ok) {
      if (field.type !== "checkbox") field.classList.toggle("wf-input--invalid", !ok);
      field.setAttribute("aria-invalid", ok ? "false" : "true");
    }

    function check(field) {
      return field.type === "checkbox" ? field.checked : String(field.value).trim() !== "";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var missing = [];
      $$("[required]", form).forEach(function (field) {
        var ok = check(field);
        mark(field, ok);
        if (!ok) missing.push(field);
      });
      if (missing.length) {
        if (msg) msg.hidden = true;
        if (err) err.hidden = false;
        missing[0].focus();
        return;
      }
      if (err) err.hidden = true;
      if (msg) msg.hidden = false;
    });

    /* a field that has just been filled in stops being marked immediately */
    form.addEventListener("input", function (e) {
      var field = e.target;
      if (field && field.hasAttribute && field.hasAttribute("required") && check(field)) mark(field, true);
    });
    form.addEventListener("change", function (e) {
      var field = e.target;
      if (field && field.hasAttribute && field.hasAttribute("required") && check(field)) mark(field, true);
    });
  });
})();


/* ===== 20 · Chipy „Wybierz sprawę" -> wiersz działu (CE-55) ===============
   The chips are ordinary anchors, so the bus (00-base.js) already handles the
   click, the smooth scroll and Back/Forward. This module only adds the second
   half of the gesture: the row the hash points at lights up for 1.5 s. The
   same happens when someone arrives at `kontakt.html#dzial-spedycja` from the
   outside, because the bus runs its hash routing at start and on hashchange.
   Returning a falsy value leaves the scrolling to the bus. ============== */
(function () {
  "use strict";
  var doc = document;
  var $$ = CX5.$$;
  var rows = $$(".kt-dept");
  if (!rows.length) return;

  var timer = null;

  function cool() {
    rows.forEach(function (row) { row.classList.remove("is-hot"); });
  }

  function heat(row) {
    cool();
    row.classList.add("is-hot");
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(function () { row.classList.remove("is-hot"); timer = null; }, 1500);
  }

  CX5.onHash(function (hash) {
    if (!hash || hash.length < 2) return false;
    var row;
    try { row = doc.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) { return false; }
    if (row && row.classList.contains("kt-dept")) heat(row);
    return false;   /* the bus scrolls */
  });
})();


/* ===== 30 · Mapa dystrybutorów: pinezki <-> karty (CE-56) =================
   Hovering or focusing a card lights the pin with the same `data-pin`, and the
   other way round; a click on a pin is a plain anchor to the card, so it works
   without this module as well. Below 900 px the map sits above the grid and
   pairing by hover stops making sense – the bus tells us about a layout change
   through `resize`, and we simply drop any highlight left over. ========== */
(function () {
  "use strict";
  var $$ = CX5.$$;
  var pins = $$(".kt-pin");
  var cards = $$(".kt-dcard");
  if (!pins.length || !cards.length) return;

  var byPin = {};
  cards.forEach(function (card) {
    var key = card.getAttribute("data-pin");
    if (key) byPin["c" + key] = card;
  });
  var pinByKey = {};
  pins.forEach(function (pin) {
    var key = pin.getAttribute("data-pin");
    if (key) pinByKey["p" + key] = pin;
  });

  function light(map, prefix, key, on) {
    var el = map[prefix + key];
    if (el) el.classList.toggle("is-hot", on);
  }

  pins.forEach(function (pin) {
    var key = pin.getAttribute("data-pin");
    if (!key) return;
    pin.addEventListener("mouseenter", function () { light(byPin, "c", key, true); });
    pin.addEventListener("mouseleave", function () { light(byPin, "c", key, false); });
    pin.addEventListener("focus", function () { light(byPin, "c", key, true); });
    pin.addEventListener("blur", function () { light(byPin, "c", key, false); });
  });

  cards.forEach(function (card) {
    var key = card.getAttribute("data-pin");
    if (!key) return;
    card.addEventListener("mouseenter", function () { light(pinByKey, "p", key, true); });
    card.addEventListener("mouseleave", function () { light(pinByKey, "p", key, false); });
    card.addEventListener("focusin", function () { light(pinByKey, "p", key, true); });
    card.addEventListener("focusout", function () { light(pinByKey, "p", key, false); });
  });

  CX5.register({
    resize: function () {
      pins.forEach(function (pin) { pin.classList.remove("is-hot"); });
      cards.forEach(function (card) { card.classList.remove("is-hot"); });
    }
  });
})();
