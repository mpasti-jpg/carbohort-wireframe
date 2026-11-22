/* ===== CE-105 · Porównanie zdjęć przed / po (rejestr: ce-rejestr.js) ========
   Turns every figure.c5-ba[data-ba] from two photos side by side into one
   frame with a dividing line (class c5-ba--on, CSS in
   CE-105-porownanie-przed-po.css).
     · The position lives in --c5-ba-pos on the root (0–100 %), read from the
       native range (input.c5-ba__range) – arrows, PageUp/PageDown, Home and
       End move it, screen readers announce it (aria-valuetext).
     · The pointer is read on the whole frame: a press jumps the line there,
       a drag moves it (pointer capture). touch-action: pan-y in the CSS
       leaves vertical swipes to the page, so a scroll over the photo still
       scrolls and never reaches the rows of an accordion around it.
     · Nothing moves by itself; no scroll or resize work (the position is a
       percentage of the frame).
   No [data-ba] -> no-op. ================================================== */
(function () {
  "use strict";
  var roots = document.querySelectorAll("[data-ba]");
  if (!roots.length) return;

  Array.prototype.forEach.call(roots, function (root) {
    var frame = root.querySelector(".c5-ba__frame");
    var range = root.querySelector(".c5-ba__range");
    if (!frame || !range) return;
    var labA = root.querySelector(".c5-ba__pane--a .c5-ba__lab");
    var labB = root.querySelector(".c5-ba__pane--b .c5-ba__lab");
    var nameA = labA ? labA.textContent.trim() : "";
    var nameB = labB ? labB.textContent.trim() : "";
    var dragging = false;

    function set(v) {
      v = Math.max(0, Math.min(100, Math.round(v)));
      range.value = String(v);
      root.style.setProperty("--c5-ba-pos", v + "%");
      range.setAttribute("aria-valuetext",
        (nameA ? nameA + " " : "") + v + "%, " + (nameB ? nameB + " " : "") + (100 - v) + "%");
    }
    function fromPointer(e) {
      var r = frame.getBoundingClientRect();
      if (r.width > 0) set((e.clientX - r.left) / r.width * 100);
    }

    range.addEventListener("input", function () { set(+range.value); });
    frame.addEventListener("pointerdown", function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      /* no native image drag, no text selection, and the mouse press does not take the focus off the slider */
      e.preventDefault();
      dragging = true;
      root.classList.add("c5-ba--drag");
      if (frame.setPointerCapture) frame.setPointerCapture(e.pointerId);
      fromPointer(e);
      range.focus({ preventScroll: true });
    });
    frame.addEventListener("pointermove", function (e) { if (dragging) fromPointer(e); });
    function stop() { dragging = false; root.classList.remove("c5-ba--drag"); }
    frame.addEventListener("pointerup", stop);
    frame.addEventListener("pointercancel", stop);
    frame.addEventListener("dragstart", function (e) { e.preventDefault(); });

    root.classList.add("c5-ba--on");
    set(+range.value || 50);
  });
})();
