/* ===== CE-103 · Zapis na newsletter (rejestr: ce-rejestr.js) ===============
   The prototype sends nothing: on submit an empty or wrong address gets the
   browser's own message, a valid one shows the demo note (role="status").
   No [data-nl] -> no-op. Comments in English, never the em dash. ========== */
(function () {
  "use strict";
  var forms = document.querySelectorAll("form[data-nl]");
  Array.prototype.forEach.call(forms, function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var msg = form.querySelector("[data-nl-msg]");
      if (input && !input.checkValidity()) {
        if (msg) msg.hidden = true;
        input.reportValidity();
        return;
      }
      if (msg) msg.hidden = false;
    });
  });
})();
