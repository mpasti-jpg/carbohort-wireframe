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

/* ===== CE-47 · Przelicznik – wariant: etapy ================================
   Cost of a crop programme for one season – template of the arable crop pages
   (Figma 560:205 and its annotations, 03.11.2026; the comments on the live
   page U-11–U-31, 04.11.2026; client comment U-38 and the answer of Mateusz,
   06.11.2026; the comments of Mateusz on the artifact, 07.11.2026). The box
   `.u-pk--etapy[data-pk-calc]` has no ruler (U-30): the native range
   ([data-calc-range], uprawa.js) writes the area into [data-calc-in]; this
   part only listens to that field.
   ONE dose per season for every product, the same in every package (U-38):
   - the list „Produkty na sezon” – one row `.u-pkc__prod` per product:
     data-prod (key in the product JSON of `script[data-pkc-products]`: id,
     name, img, url and packs with their volume `l` and gross price, the
     format of sklep-wspolne.js), data-dose (dose per hectare and season),
     data-unit, data-pk (packages of the product) and a checkbox
     [data-pkc-pick] (ticked = counted; unticked = `is-skip`, greyed and left
     out; a product of another package is `is-out`, without a checkbox and
     without a price). The price is counted per product: the amount for the
     field is covered by ONE pack size – the size that costs least for that
     amount („nie wysyłamy 100 × 10 kg, tylko 1 × 1000 kg” – annotation; an
     amount under the smallest pack is that pack – Mateusz, 03.11.2026); net =
     gross minus VAT (CWSklep.vatSplit with the rate of the pack). One price,
     no ranges (Mateusz, 03.11 and 06.11.2026).
   - the number of treatments: a product row with a radio group
     [data-zab-switch] (buttons [data-zab-set="1|2|3"], each with the sentence
     [data-zab-txt] written into [data-zab-out]) splits its season dose into
     that many equal parts. The open choice starts as the button marked
     aria-checked="true" (the default variant, „Domyślnie…”). Every change
     fires `c5:zabiegi` (group, prod, n) on document – the chart CE-100 draws
     the terms of the parts with it.
   - treatments ("slots"): the tiles `.u-pkc__tile` of the phase columns
     `.u-pkc__col[data-c]` – or, in a box with `data-pkc-bars` (one section
     for the chart and the calculator, 07.11.2026), the bars
     `.c5-we__bar[data-pkc-prod]` of the chart CE-100 of the same group, whose
     `.c5-we__val` gets the dose of one treatment and its amount for the field.
     An optional data-zab="2 3" names the numbers of treatments that put a
     part of the dose into that phase. A tile outside the chosen split is
     hidden; a phase without a visible tile shows its `.u-pkc__none` and is
     `is-empty`; a phase with a counted product is `is-on` (U-11).
   - phases left out of the price (07.11.2026, „Wyłącz wybrane fazy z
     obliczeń”): toggle buttons [data-pkc-excl] [data-c] (aria-pressed=true =
     left out). A product counts only its treatments in the phases that stay:
     amount = dose of one treatment × treatments left × area; a product with
     no treatment left is `is-excl` (greyed, no price). Tiles, bars and columns
     of a left-out phase are `is-excl`, and so are the cells of its column on
     the chart (a box with data-pkc-bars) – the column goes slightly darker.
   - [data-pkc-halab]: the head and the captions of the amount column say
     „Ilość na N ha” with the area of the field (07.11.2026);
   - the total [data-pkc-total] / [data-pkc-gross], what it covers
     [data-pkc-info] (package, area, „cena netto za N zaznaczone produkty”,
     the phases left out), the cart button [data-pkc-cart] (exactly the
     counted packs go to the cart – CWSklep.add), the status line
     [data-pkc-status] and the package switch ([data-pk-switch], the same
     radio semantics and `c5:pakiet` event as CE-100). A box without its own
     switch follows the switch of the chart of the same group (07.11.2026).
   Buttons `[data-pkc-buy="key"]` anywhere on the page (the product cards of the
   lightbox) open the quick view of that product from the same JSON.
   Without JS the rows and tiles stand with their doses and the prices show
   „–”. ===================================================================== */
(function () {
  "use strict";
  var doc = document;
  var slice = function (l) { return Array.prototype.slice.call(l); };
  var boxes = doc.querySelectorAll(".u-pk--etapy[data-pk-calc]");
  if (!boxes.length) return;
  var shop = window.CWSklep || null;
  var PK_NAME = { min: "minimalny", std: "standardowy", kompl: "kompleksowy" };

  function group3(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function num(x) {
    var v = x >= 100 ? Math.round(x) : Math.round(x * 10) / 10, p = String(v).split(".");
    p[0] = group3(p[0]);
    return p.join(",");
  }
  /* a part of a split dose keeps one decimal, so the parts add up to the season (3 × 133,3 l) */
  function num1(x) {
    var p = String(Math.round(x * 10) / 10).split(".");
    p[0] = group3(p[0]);
    return p.join(",");
  }
  function zl(a) { return group3(String(Math.round(a))) + " zł"; }
  function net(gross, product, pack) {
    if (shop && shop.vatSplit) return shop.vatSplit(gross, shop.rateOf ? shop.rateOf(product, pack) : undefined).net;
    return gross / 1.08;
  }
  function plural(n, a, b, c) {
    if (shop && shop.plural) return shop.plural(n, a, b, c);
    return n === 1 ? a : c;
  }
  function inList(list, v) { return (" " + (list || "") + " ").indexOf(" " + v + " ") >= 0; }

  /* one pack size for the whole amount: n × the same pack, the size that costs
     least for `need` (ties go to the bigger pack). Returns { gross, net, packs } */
  function cover(need, product) {
    var packs = (product.packs || []).filter(function (p) { return p.l > 0 && typeof p.price === "number"; });
    var out = { gross: 0, net: 0, packs: [] };
    if (!(need > 0) || !packs.length) return out;
    var best = null;
    packs.forEach(function (p) {
      var n = Math.ceil(need / p.l - 1e-9), cost = n * p.price;
      if (!best || cost < best.cost - 1e-6 || (Math.abs(cost - best.cost) < 1e-6 && p.l > best.pack.l)) best = { pack: p, n: n, cost: cost };
    });
    out.packs.push({ pack: best.pack, n: best.n });
    out.gross = best.cost;
    out.net = net(best.cost, product, best.pack);
    return out;
  }
  function packText(list) {
    return list.map(function (x) { return x.n + " × " + x.pack.label; }).join(" + ");
  }
  function catalogue(scope) {
    var data = (scope || doc).querySelector("script[data-pkc-products]");
    try { return JSON.parse(data ? data.textContent : "{}"); } catch (e) { return {}; }
  }
  /* radio semantics shared by the package switch and the split of a dose */
  function radios(opts, onPick) {
    opts.forEach(function (o, i) {
      o.addEventListener("click", function () { onPick(o); });
      o.addEventListener("keydown", function (e) {
        var n = opts.length, to = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") to = (i + 1) % n;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") to = (i - 1 + n) % n;
        else if (e.key === "Home") to = 0;
        else if (e.key === "End") to = n - 1;
        if (to < 0) return;
        e.preventDefault();
        onPick(opts[to]);
        opts[to].focus();
      });
    });
  }
  function mark(opts, hit) {
    opts.forEach(function (o) {
      var on = o === hit;
      o.setAttribute("aria-checked", on ? "true" : "false");
      o.tabIndex = on ? 0 : -1;
    });
  }

  slice(boxes).forEach(function (box) {
    var group = box.getAttribute("data-pakiety") || "";
    var field = box.querySelector("[data-calc-in]");
    var products = catalogue(box);
    var cols = slice(box.querySelectorAll(".u-pkc__col"));
    var tiles = slice(box.querySelectorAll(".u-pkc__tile"));
    var rows = slice(box.querySelectorAll(".u-pkc__prod"));
    var totalEl = box.querySelector("[data-pkc-total]");
    var grossEl = box.querySelector("[data-pkc-gross]");
    var infoEl = box.querySelector("[data-pkc-info]");
    var cartBtn = box.querySelector("[data-pkc-cart]");
    var status = box.querySelector("[data-pkc-status]");
    var sw = box.querySelector("[data-pk-switch]");
    var opts = sw ? slice(sw.querySelectorAll("[data-pk-set]")) : [];
    var halabs = slice(box.querySelectorAll("[data-pkc-halab]"));
    var exclBtns = slice(box.querySelectorAll("[data-pkc-excl] [data-c]"));
    var chart = box.hasAttribute("data-pkc-bars") ? doc.querySelector('[data-we][data-pakiety="' + group + '"]') : null;
    if (!field) return;
    var pk = null, plan = [], zab = {}, rowOf = {}, excl = {};

    /* the treatments: tiles of the phase columns, or the bars of the chart */
    var slots = tiles.map(function (t) {
      var col = t.closest(".u-pkc__col");
      return { el: t, kind: "tile", prod: t.getAttribute("data-prod"), c: col ? col.getAttribute("data-c") : "", zab: t.getAttribute("data-zab") };
    });
    if (chart) slice(chart.querySelectorAll(".c5-we__bar[data-pkc-prod]")).forEach(function (b) {
      var td = b.closest("td");
      slots.push({ el: b, kind: "bar", prod: b.getAttribute("data-pkc-prod"), c: td ? td.getAttribute("data-c") : "", zab: b.getAttribute("data-zab") });
    });
    function inSplit(s, n) { return !s.zab || inList(s.zab, n); }

    function area() {
      var v = parseFloat(String(field.value || "").replace(",", "."));
      return isFinite(v) && v > 0 ? v : 0;
    }
    function clear() { if (status) status.textContent = ""; }

    function run() {
      var ha = area(), tot = { net: 0, gross: 0 }, counted = 0;
      plan = [];
      /* the season: one price per product, from its treatments in the phases that stay */
      rows.forEach(function (r) {
        var key = r.getAttribute("data-prod"), prod = products[key], n = zab[key] || 1;
        var dose = parseFloat(r.getAttribute("data-dose")), unit = r.getAttribute("data-unit") || "l";
        var qty = r.querySelector("[data-pkc-qty]"), packsEl = r.querySelector("[data-pkc-packs]"), price = r.querySelector("[data-pkc-price]");
        var pick = r.querySelector("[data-pkc-pick]"), out = r.classList.contains("is-out");
        var mine = slots.filter(function (s) { return s.prod === key && inSplit(s, n); });
        var left = mine.filter(function (s) { return !excl[s.c]; }).length;
        var part = mine.length ? left / mine.length : 1, gone = mine.length > 0 && left === 0;
        if (pick) pick.disabled = out;
        var skip = !out && !!pick && !pick.checked;
        r.classList.toggle("is-skip", skip);
        r.classList.toggle("is-excl", !out && gone);
        var need = isFinite(dose) ? dose * ha * part : NaN;
        if (qty) qty.textContent = ha && isFinite(need) && !gone ? (part < 1 ? num1(need) : num(need)) + " " + unit : "–";
        if (out || !prod || !ha || !isFinite(need) || gone) {
          if (packsEl) packsEl.textContent = "–";
          if (price) price.textContent = "–";
          return;
        }
        var b = cover(need, prod);
        if (packsEl) packsEl.textContent = b.packs.length ? packText(b.packs) : "–";
        if (price) price.textContent = zl(b.net);
        if (skip) return;   /* left out of the price by its checkbox */
        tot.net += b.net; tot.gross += b.gross; counted++;
        plan.push({ product: prod, packs: b.packs });
      });
      /* the schedule: the dose of one treatment in the phases of the split */
      slots.forEach(function (s) {
        var r = rowOf[s.prod], n = zab[s.prod] || 1, on = inSplit(s, n);
        var dose = r ? parseFloat(r.getAttribute("data-dose")) / n : NaN, unit = r ? r.getAttribute("data-unit") || "l" : "l";
        var amount = ha && isFinite(dose) ? (n > 1 ? num1(dose * ha) : num(dose * ha)) + " " + unit : "–";
        s.el.classList.toggle("is-excl", !!excl[s.c]);
        if (s.kind === "tile") {
          s.el.hidden = !on;
          var doseEl = s.el.querySelector("[data-pkc-dose]"), qty = s.el.querySelector("[data-pkc-qty]");
          if (isFinite(dose)) {
            if (doseEl) doseEl.textContent = (doseEl.getAttribute("data-prefix") || "") + num(dose) + " " + unit + "/ha" + (doseEl.getAttribute("data-suffix") || "");
            if (qty) qty.textContent = amount;
          }
          s.el.classList.toggle("is-skip", !s.el.classList.contains("is-out") && !!r && r.classList.contains("is-skip"));
        } else {
          var val = s.el.querySelector(".c5-we__val");
          if (val) val.textContent = on && isFinite(dose) ? num(dose) + " " + unit + "/ha · " + amount : "";
          s.el.classList.toggle("is-skip", !!r && r.classList.contains("is-skip"));
        }
      });
      /* a phase left out of the price darkens its column on the chart (07.11.2026) */
      if (chart) slice(chart.querySelectorAll("td[data-c], th[data-c]")).forEach(function (cell) {
        cell.classList.toggle("is-excl", !!excl[cell.getAttribute("data-c")]);
      });
      cols.forEach(function (c) {
        var list = c.querySelector(".u-pkc__tiles"), none = c.querySelector(".u-pkc__none");
        var vis = slice(c.querySelectorAll(".u-pkc__tile")).filter(function (t) { return !t.hidden; });
        if (list) list.hidden = !vis.length;
        if (none) none.hidden = vis.length > 0;
        c.classList.toggle("is-empty", !vis.length);
        c.classList.toggle("is-excl", !!excl[c.getAttribute("data-c")]);
        var on = !excl[c.getAttribute("data-c")] && vis.some(function (t) { return !t.classList.contains("is-out") && !t.classList.contains("is-skip"); });
        c.classList.toggle("is-on", on);
        c.classList.toggle("is-off", !on);
      });
      if (totalEl) totalEl.textContent = tot.gross ? zl(tot.net) : "–";
      if (grossEl) grossEl.textContent = tot.gross ? "brutto " + zl(tot.gross) : "";
      if (infoEl) {
        infoEl.innerHTML = "";
        var b1 = doc.createElement("b"); b1.textContent = "Pakiet " + (PK_NAME[pk] || "");
        infoEl.appendChild(b1);
        var gone = exclBtns.filter(function (x) { return excl[x.getAttribute("data-c")]; }).map(function (x) { return x.textContent.trim(); });
        infoEl.appendChild(doc.createTextNode(" · " + (ha ? num(ha) : "–") + " ha · cena netto za " + counted + " " +
          plural(counted, "zaznaczony produkt", "zaznaczone produkty", "zaznaczonych produktów") + (gone.length ? " · bez faz: " + gone.join(", ") : "")));
      }
      if (cartBtn) cartBtn.disabled = !shop || !plan.some(function (p) { return p.packs.length; });
      /* the head of the amounts names the chosen area („Ilość na 10 ha” – 07.11.2026) */
      halabs.forEach(function (el) { el.textContent = "Ilość na " + (ha ? num(ha) : "–") + " ha"; });
    }

    function apply(next, silent) {
      if (!PK_NAME[next]) return;
      pk = next;
      if (opts.length) mark(opts, opts.filter(function (o) { return o.getAttribute("data-pk-set") === next; })[0]);
      tiles.concat(rows).forEach(function (el) { el.classList.toggle("is-out", !inList(el.getAttribute("data-pk"), pk)); });
      clear();
      run();
      if (!silent) doc.dispatchEvent(new CustomEvent("c5:pakiet", { detail: { group: group, pk: pk, from: box } }));
    }

    /* the split of the season dose of one product */
    rows.forEach(function (r) {
      var key = r.getAttribute("data-prod");
      rowOf[key] = r;
      zab[key] = 1;
      var zsw = r.querySelector("[data-zab-switch]");
      if (!zsw) return;
      var zopts = slice(zsw.querySelectorAll("[data-zab-set]")), out = r.querySelector("[data-zab-out]");
      function setZab(o, silent) {
        mark(zopts, o);
        zab[key] = parseInt(o.getAttribute("data-zab-set"), 10) || 1;
        if (out && o.getAttribute("data-zab-txt")) out.textContent = o.getAttribute("data-zab-txt");
        doc.dispatchEvent(new CustomEvent("c5:zabiegi", { detail: { group: group, prod: key, n: zab[key], from: box } }));
        if (!silent) { clear(); run(); }
      }
      radios(zopts, function (o) { setZab(o, false); });
      setZab(zopts.filter(function (o) { return o.getAttribute("aria-checked") === "true"; })[0] || zopts[0], true);
    });

    /* phases left out of the price (toggle buttons) */
    exclBtns.forEach(function (x) {
      x.setAttribute("aria-pressed", "false");
      x.addEventListener("click", function () {
        var c = x.getAttribute("data-c"), on = !excl[c];
        if (on) excl[c] = true; else delete excl[c];
        x.setAttribute("aria-pressed", on ? "true" : "false");
        clear(); run();
      });
    });

    if (opts.length) radios(opts, function (o) { apply(o.getAttribute("data-pk-set"), false); });
    doc.addEventListener("c5:pakiet", function (e) {
      var d = e.detail || {};
      if (d.from !== box && d.group === group) apply(d.pk, true);
    });
    field.addEventListener("input", function () { clear(); run(); });
    rows.forEach(function (r) {
      var pick = r.querySelector("[data-pkc-pick]");
      if (pick) pick.addEventListener("change", function () { clear(); run(); });
    });
    if (cartBtn) cartBtn.addEventListener("click", function () {
      if (!shop) return;
      var n = 0;
      plan.forEach(function (p) {
        p.packs.forEach(function (x) { if (shop.add(p.product, x.pack.id, x.n)) n += x.n; });
      });
      if (!status) return;
      status.textContent = "";
      if (!n) return;
      var a = doc.createElement("a");
      a.className = "wf-link";
      a.href = "koszyk.html";
      a.textContent = "Przejdź do koszyka";
      status.appendChild(doc.createTextNode("Dodano do koszyka: " + n + " " + plural(n, "opakowanie", "opakowania", "opakowań") + " na Twoje pole. "));
      status.appendChild(a);
    });

    /* the opening package: the box's own switch, else the switch of the chart of the group */
    var first = opts.filter(function (o) { return o.getAttribute("aria-checked") === "true"; })[0];
    var chartTab = doc.querySelector('[data-pakiety="' + group + '"] [data-pk-set][aria-checked="true"]');
    if (sw) sw.hidden = false;
    apply(first ? first.getAttribute("data-pk-set") : chartTab ? chartTab.getAttribute("data-pk-set") : "kompl", true);
  });

  /* „Kup produkt” on the product cards of the lightbox: the button also closes
     the lightbox (data-lightbox-close, uprawa.js), then the quick view opens. */
  var all = catalogue(doc);
  slice(doc.querySelectorAll("[data-pkc-buy]")).forEach(function (b) {
    var prod = all[b.getAttribute("data-pkc-buy")];
    if (!prod || !shop || !shop.open) return;
    b.addEventListener("click", function () {
      setTimeout(function () { shop.open(prod, b, {}); }, 40);
    });
  });
})();
