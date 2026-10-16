/* ===== CE-47 · Przelicznik – wariant: linijka (rejestr: ce-rejestr.js) =====
   Area ruler of the package calculator. Switched on by the modifier class
   `u-pk--linijka` on the calculator box ([data-calc]); a box without it is
   left alone, so a page can link this file without changing its calculator.

   What it does:
   - builds a ruler over the native range ([data-calc-range]): dense even
     ticks, longer ticks with a label at the marked values (logarithmic scale,
     default 0,5 · 1 · 2 · 5 · 10 · 20 · 50), a handle with a vertical line and
     a ←→ grip, and the large value beside the handle („3” + small „ha”);
   - dragging anywhere on the ruler moves the value, a click or a tap jumps;
     the slider (role=slider) takes the arrows, PageUp/PageDown (the next
     marked value), Home and End;
   - every change writes the value into the area field ([data-calc-in]) and
     fires `input` on it, so the calculator of c5.js counts the boxes at once
     and uprawa.js moves the native range – nothing is counted here.
   The ruler stands in the flow of the page, right below the package switch
   (CSS in CE-47-przelicznik.css); it is not pinned and does not touch the
   advisor dock.
   Steps of the value grid: `data-ruler-steps="fine split coarse"` on .u-area
   (default "0.5 10 1": 0,5 ha up to 10 ha, then 1 ha); marked values:
   `data-ruler-marks` (default "0.5 1 2 5 10 20 50").
   The number field takes any area (CSS shows it from 600 px): a value
   outside the scale pins the handle to the end and the large value shows it.
   Without JS the native range and the number field stay as they are. ===== */
(function () {
  "use strict";
  var doc = document;
  var boxes = doc.querySelectorAll(".u-pk--linijka[data-calc]");
  if (!boxes.length) return;

  function nums(s, dflt) {
    var out = String(s || dflt).trim().split(/\s+/).map(parseFloat).filter(isFinite);
    return out.length ? out : String(dflt).split(/\s+/).map(parseFloat);
  }
  function fmt(v) { return String(Math.round(v * 100) / 100).replace(".", ","); }
  function svgIcon(id) {
    return '<svg class="wf-icon" aria-hidden="true"><use href="#' + id + '"></use></svg>';
  }

  Array.prototype.forEach.call(boxes, function (box) {
    var area = box.querySelector(".u-area");
    var field = box.querySelector("[data-calc-in]");
    var range = box.querySelector("[data-calc-range]");
    if (!area || !field || !range) return;
    var min = parseFloat(range.min) || 0.5, max = parseFloat(range.max) || 50;
    var marks = nums(area.getAttribute("data-ruler-marks"), "0.5 1 2 5 10 20 50")
      .filter(function (m) { return m >= min && m <= max; });
    var st = nums(area.getAttribute("data-ruler-steps"), "0.5 10 1");
    var fine = st[0] || 0.5, split = st[1] || max, coarse = st[2] || fine;

    /* the value grid, kept in hundredths so 0.5 steps never drift */
    var grid = [], v = Math.round(min * 100), f = Math.round(fine * 100),
        sp = Math.round(split * 100), c = Math.round(coarse * 100), hi = Math.round(max * 100);
    while (v <= hi) { grid.push(v / 100); v += v < sp ? f : c; }
    if (grid[grid.length - 1] !== max) grid.push(max);

    var lmin = Math.log(min), lspan = Math.log(max) - lmin;
    function pos(x) { return (Math.log(Math.min(max, Math.max(min, x))) - lmin) / lspan; }
    function nearestIndex(p) {
      var best = 0, d = Infinity;
      for (var i = 0; i < grid.length; i++) {
        var dd = Math.abs(pos(grid[i]) - p);
        if (dd < d) { d = dd; best = i; }
      }
      return best;
    }

    /* --- markup ----------------------------------------------------------- */
    var label = area.querySelector(".wf-label");
    if (label && !label.id) label.id = (field.id || "u-area") + "-label";
    var ruler = doc.createElement("div");
    ruler.className = "u-ruler";
    ruler.setAttribute("role", "slider");
    ruler.setAttribute("tabindex", "0");
    ruler.setAttribute("aria-orientation", "horizontal");
    ruler.setAttribute("aria-valuemin", String(min));
    ruler.setAttribute("aria-valuemax", String(max));
    if (label) ruler.setAttribute("aria-labelledby", label.id);
    else ruler.setAttribute("aria-label", range.getAttribute("aria-label") || "");
    ruler.innerHTML =
      '<div class="u-ruler__track">' +
        '<div class="u-ruler__ticks" aria-hidden="true"></div>' +
        '<div class="u-ruler__handle" aria-hidden="true">' +
          '<span class="u-ruler__line"></span>' +
          '<span class="u-ruler__grip">' + svgIcon("ti-arrow-left") + svgIcon("ti-arrow-right") + '</span>' +
          '<span class="u-ruler__val"><b class="u-ruler__num"></b><small class="u-ruler__unit">ha</small></span>' +
        '</div>' +
      '</div>' +
      '<div class="u-ruler__marks" aria-hidden="true"></div>';
    area.appendChild(ruler);
    area.classList.add("is-ruler");
    var track = ruler.querySelector(".u-ruler__track");
    var ticksEl = ruler.querySelector(".u-ruler__ticks");
    var marksEl = ruler.querySelector(".u-ruler__marks");
    var handle = ruler.querySelector(".u-ruler__handle");
    var valEl = ruler.querySelector(".u-ruler__val");
    var numEl = ruler.querySelector(".u-ruler__num");

    marks.forEach(function (m, i) {
      var s = doc.createElement("span");
      s.className = "u-ruler__mark" + (i === 0 ? " u-ruler__mark--first" : "") + (i === marks.length - 1 ? " u-ruler__mark--last" : "");
      s.style.left = (pos(m) * 100) + "%";
      s.textContent = fmt(m);
      marksEl.appendChild(s);
    });

    /* ticks: evenly spaced minor ticks plus one major tick per marked value;
       a minor tick too close to a major one is dropped */
    var ticks = [], width = 0;
    function buildTicks() {
      width = track.clientWidth;
      if (!width) return;
      ticksEl.textContent = "";
      ticks = [];
      var gap = width < 480 ? 8 : 10;
      var n = Math.max(12, Math.floor(width / gap));
      var majors = marks.map(pos);
      function add(p, major) {
        var t = doc.createElement("i");
        t.className = "u-ruler__tick" + (major ? " u-ruler__tick--major" : "");
        t.style.left = (p * 100) + "%";
        ticksEl.appendChild(t);
        ticks.push({ el: t, p: p });
      }
      for (var i = 0; i <= n; i++) {
        var p = i / n, near = false;
        for (var j = 0; j < majors.length; j++) if (Math.abs(majors[j] - p) * width < gap * 0.6) near = true;
        if (!near) add(p, false);
      }
      majors.forEach(function (p) { add(p, true); });
      paint();
    }

    /* --- state -------------------------------------------------------------- */
    var value = parseFloat(String(field.value || "").replace(",", "."));
    if (!isFinite(value) || value <= 0) value = grid[0];

    function paint() {
      var p = pos(value);
      handle.style.left = (p * 100) + "%";
      numEl.textContent = fmt(value);
      ruler.setAttribute("aria-valuenow", String(Math.min(max, Math.max(min, value))));
      ruler.setAttribute("aria-valuetext", fmt(value) + " ha");
      var hx = p * width, reach = width < 480 ? 36 : 56;
      ticks.forEach(function (t) {
        var k = Math.max(0, 1 - Math.abs(t.p * width - hx) / reach);
        t.el.style.setProperty("--k", (Math.round(k * 100) / 100).toString());
      });
      /* the value sits right of the line; near the right end it moves left */
      var room = width - hx;
      valEl.classList.toggle("is-left", valEl.offsetWidth + 24 > room);
    }

    var writing = false;
    function commit(x) {
      x = Math.min(max, Math.max(min, x));
      if (x === value && String(field.value) === String(x)) { paint(); return; }
      value = x;
      paint();
      writing = true;
      field.value = String(x);
      field.dispatchEvent(new Event("input", { bubbles: true }));
      writing = false;
    }
    /* the field (typed, or moved by the native range through uprawa.js) leads back to the ruler */
    field.addEventListener("input", function () {
      if (writing) return;
      var n = parseFloat(String(field.value || "").replace(",", "."));
      if (!isFinite(n) || n <= 0) return;
      value = n;
      paint();
    });

    /* --- pointer: drag anywhere, click or tap = jump ------------------------ */
    function fromX(clientX) {
      var r = track.getBoundingClientRect();
      var p = r.width ? (clientX - r.left) / r.width : 0;
      return grid[nearestIndex(Math.min(1, Math.max(0, p)))];
    }
    var drag = null;
    ruler.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      drag = { id: e.pointerId, x: e.clientX, moved: e.pointerType === "mouse" };
      if (e.pointerType === "mouse") {
        e.preventDefault();
        ruler.focus({ preventScroll: true });
        try { ruler.setPointerCapture(e.pointerId); } catch (err) {}
        ruler.classList.add("is-drag");
        commit(fromX(e.clientX));
      }
    });
    ruler.addEventListener("pointermove", function (e) {
      if (!drag || drag.id !== e.pointerId) return;
      if (!drag.moved) {
        if (Math.abs(e.clientX - drag.x) < 5) return;
        drag.moved = true;
        try { ruler.setPointerCapture(e.pointerId); } catch (err) {}
        ruler.classList.add("is-drag");
      }
      commit(fromX(e.clientX));
    });
    function end(e) {
      if (!drag || drag.id !== e.pointerId) return;
      if (e.type === "pointerup" && !drag.moved) commit(fromX(e.clientX));
      drag = null;
      ruler.classList.remove("is-drag");
    }
    ruler.addEventListener("pointerup", end);
    ruler.addEventListener("pointercancel", function (e) {
      if (drag && drag.id === e.pointerId) { drag = null; ruler.classList.remove("is-drag"); }
    });

    /* --- keyboard ------------------------------------------------------------ */
    ruler.addEventListener("keydown", function (e) {
      var up = grid.filter(function (g) { return g > value + 1e-6; }),
          down = grid.filter(function (g) { return g < value - 1e-6; }), next = null;
      switch (e.key) {
        case "ArrowRight": case "ArrowUp": next = up.length ? up[0] : max; break;
        case "ArrowLeft": case "ArrowDown": next = down.length ? down[down.length - 1] : min; break;
        case "PageUp": next = marks.filter(function (m) { return m > value + 1e-6; })[0]; if (next == null) next = max; break;
        case "PageDown": next = marks.filter(function (m) { return m < value - 1e-6; }).pop(); if (next == null) next = min; break;
        case "Home": next = min; break;
        case "End": next = max; break;
        default: return;
      }
      e.preventDefault();
      commit(next);
    });

    if ("ResizeObserver" in window) new ResizeObserver(function () {
      if (track.clientWidth !== width) buildTicks();
    }).observe(track);
    else window.addEventListener("resize", buildTicks);
    buildTicks();
    paint();
  });
})();
