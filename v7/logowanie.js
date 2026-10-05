/* ==========================================================================
   logowanie.html – page script
   Reads the login mode from the address (?tryb=b2b) or from the fragment
   (#tryb=b2b), checks the matching option of the mode switch and sends
   "change". The heading and the target of the button are replaced by the
   CE-50 module (ce/CE-50-formularz.js), which listens to that event.
   Focus is not moved.
   ========================================================================== */
(function () {
  "use strict";

  function mode() {
    var fromQuery = new URLSearchParams(window.location.search).get("tryb");
    if (fromQuery) return fromQuery;
    return new URLSearchParams(window.location.hash.replace(/^#/, "")).get("tryb");
  }

  function apply() {
    var value = mode();
    if (!value) return;
    var radios = document.querySelectorAll('#logowanie input[type="radio"][name="tryb"]');
    Array.prototype.forEach.call(radios, function (radio) {
      if (radio.value !== value || radio.checked) return;
      radio.checked = true;
      radio.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
  window.addEventListener("hashchange", apply);
})();
