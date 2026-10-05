/* ==========================================================================
   CE-50 – Form (c5-form): mechanics of the form
   1. Mode switch – every radio option carries data-naglowek and data-cel;
      a change replaces the text of .c5-form__title and the href of
      the link button in .c5-form__actions. Focus stays where it was.
   2. Checkbox with aria-controls – shows and hides the group(s) of fields it
      points to and keeps aria-expanded in step.
   3. Message after sending – on submit the block .c5-form__msg (hidden,
      role="status", tabindex="-1") is shown and receives focus. Nothing is
      sent anywhere.
   The module reads the DOM only – it does not read the page address.
   Starts by itself on DOMContentLoaded; no globals.
   ========================================================================== */
(function () {
  "use strict";

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  function init(root) {
    /* --- 1. Mode switch ------------------------------------------------- */
    var title = root.querySelector(".c5-form__title");
    var go = root.querySelector(".c5-form__actions a.c5-btn");
    var modes = root.querySelectorAll('input[type="radio"][data-naglowek], input[type="radio"][data-cel]');

    function applyMode(radio) {
      var heading = radio.getAttribute("data-naglowek");
      var target = radio.getAttribute("data-cel");
      if (title && heading !== null && title.textContent !== heading) title.textContent = heading;
      if (go && target !== null) go.setAttribute("href", target);
    }

    each(modes, function (radio) {
      radio.addEventListener("change", function () { if (radio.checked) applyMode(radio); });
      if (radio.checked) applyMode(radio);
    });

    /* --- 2. Checkbox that reveals a group of fields ---------------------- */
    each(root.querySelectorAll('input[type="checkbox"][aria-controls]'), function (box) {
      var ids = (box.getAttribute("aria-controls") || "").split(/\s+/).filter(Boolean);
      function sync() {
        ids.forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.hidden = !box.checked;
        });
        box.setAttribute("aria-expanded", box.checked ? "true" : "false");
      }
      box.addEventListener("change", sync);
      sync();
    });

    /* --- 3. Message after sending ---------------------------------------- */
    each(root.querySelectorAll("form"), function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var msg = form.querySelector(".c5-form__msg") || root.querySelector(".c5-form__msg");
        if (!msg) return;
        msg.hidden = false;
        msg.focus();
      });
    });
  }

  function start() { each(document.querySelectorAll(".c5-form"), init); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
