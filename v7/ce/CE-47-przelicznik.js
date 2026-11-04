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
   Cost of a crop programme phase by phase (Figma 560:205 and its annotations,
   03.11.2026). Since U-30 (04.11.2026) the box `.u-pk--etapy[data-pk-calc]`
   has no ruler: the native range ([data-calc-range], uprawa.js) writes the
   area into [data-calc-in]; this part only listens to that field.
   Markup: one `.u-pkc__col` per phase with tiles `.u-pkc__tile` – data-prod
   (key in the product JSON of `script[data-pkc-products]`: id, name, img, url
   and packs with their volume `l` and gross price, the format of
   sklep-wspolne.js), data-lo / data-hi (dose per hectare), data-pk (packages of
   the tile); a tile without a dose (a partner product whose dose is still to be
   given) only stands and counts nothing. Every tile has its checkbox
   [data-pkc-pick] (U-19, 04.11.2026 – it replaced the box „Uwzględnij” of the
   phase): ticked = counted, unticked = `is-skip` (greyed, left out); a tile of
   another package has its checkbox disabled. Per phase the sum [data-pkc-sum];
   the total [data-pkc-total] / [data-pkc-gross], what it
   covers [data-pkc-info], the cart button [data-pkc-cart], the status line
   [data-pkc-status] and the package switch ([data-pk-switch], the same radio
   semantics and `c5:pakiet` event as CE-100).
   Counting: ONE dose per tile and package – the lower dose of the programme
   in the minimal package, the upper one in the others; no ranges anywhere
   (Mateusz, 03.11.2026: the client must not be left with the choice). The
   amount for the field (dose × area) is covered by ONE pack size of the product – the size
   that costs least for that amount („nie wysyłamy 100 × 10 kg, tylko
   1 × 1000 kg” – annotation; an amount under the smallest pack is that pack –
   Mateusz, 03.11.2026); net = gross minus VAT (CWSklep.vatSplit with the rate of the
   pack). A phase with at least one counted product gets `is-on` (tinted
   body). „Dodaj wybrane produkty do koszyka” puts exactly the counted packs
   into the cart (CWSklep.add).
   Buttons `[data-pkc-buy="key"]` anywhere on the page (the product cards of the
   lightbox) open the quick view of that product from the same JSON.
   Without JS the tiles stand with their doses and the sums show „–”. ===== */
(function () {
  "use strict";
  var doc = document;
  var boxes = doc.querySelectorAll(".u-pk--etapy[data-pk-calc]");
  if (!boxes.length) return;
  var shop = window.CWSklep || null;
  var PK_NAME = { min: "minimalny", std: "standardowy", kompl: "kompleksowy" };

  function group3(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function num(x) {
    var v = x >= 100 ? Math.round(x) : Math.round(x * 10) / 10, p = String(v).split(".");
    p[0] = group3(p[0]);
    return p.join(",");
  }
  function zl(a, b) {
    var x = group3(String(Math.round(a))), y = group3(String(Math.round(b)));
    return (x === y ? x : x + "–" + y) + " zł";
  }
  function net(gross, product, pack) {
    if (shop && shop.vatSplit) return shop.vatSplit(gross, shop.rateOf ? shop.rateOf(product, pack) : undefined).net;
    return gross / 1.08;
  }
  function plural(n, a, b, c) {
    if (shop && shop.plural) return shop.plural(n, a, b, c);
    return n === 1 ? a : c;
  }

  /* one pack size for the whole amount: n × the same pack, the size that costs
     least for `need` (ties go to the bigger pack) – „nie wysyłamy 100 × 10 kg,
     tylko 1 × 1000 kg”; an amount under the smallest pack is that pack.
     Returns { gross, net, packs: [{ pack, n }] }. */
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
    return list.map(function (x) { return x.n + " × " + x.pack.label; }).join(" + ");
  }
  function catalogue(scope) {
    var data = (scope || doc).querySelector("script[data-pkc-products]");
    try { return JSON.parse(data ? data.textContent : "{}"); } catch (e) { return {}; }
  }

  Array.prototype.forEach.call(boxes, function (box) {
    var group = box.getAttribute("data-pakiety") || "";
    var field = box.querySelector("[data-calc-in]");
    var products = catalogue(box);
    var cols = Array.prototype.slice.call(box.querySelectorAll(".u-pkc__col"));
    var tiles = Array.prototype.slice.call(box.querySelectorAll(".u-pkc__tile"));
    var totalEl = box.querySelector("[data-pkc-total]");
    var grossEl = box.querySelector("[data-pkc-gross]");
    var infoEl = box.querySelector("[data-pkc-info]");
    var cartBtn = box.querySelector("[data-pkc-cart]");
    var status = box.querySelector("[data-pkc-status]");
    var sw = box.querySelector("[data-pk-switch]");
    var opts = sw ? Array.prototype.slice.call(sw.querySelectorAll("[data-pk-set]")) : [];
    if (!field || !opts.length) return;
    var pk = null, plan = [];

    cols.forEach(function (c) { if (!c.querySelector(".u-pkc__tile")) c.classList.add("is-empty"); });

    function area() {
      var v = parseFloat(String(field.value || "").replace(",", "."));
      return isFinite(v) && v > 0 ? v : 0;
    }

    function run() {
      var ha = area(), tot = { lo: 0, hi: 0, glo: 0, ghi: 0 }, counted = 0;
      plan = [];
      cols.forEach(function (c) {
        var sumEl = c.querySelector("[data-pkc-sum]");
        var s = { lo: 0, hi: 0, glo: 0, ghi: 0 }, any = false, mine = [];
        Array.prototype.forEach.call(c.querySelectorAll(".u-pkc__tile"), function (t) {
          var prod = products[t.getAttribute("data-prod")];
          var lo = parseFloat(t.getAttribute("data-lo")), hi = parseFloat(t.getAttribute("data-hi"));
          var unit = t.getAttribute("data-unit") || "l";
          var qty = t.querySelector("[data-pkc-qty]"), packsEl = t.querySelector("[data-pkc-packs]"), doseEl = t.querySelector("[data-pkc-dose]");
          var pick = t.querySelector("[data-pkc-pick]"), out = t.classList.contains("is-out");
          if (pick) pick.disabled = out;
          var skip = !out && !!pick && !pick.checked;
          t.classList.toggle("is-skip", skip);
          if (!isFinite(lo)) { return; }   /* no dose yet: the tile only stands */
          if (!isFinite(hi)) hi = lo;
          /* ONE dose, no ranges: the lower dose of the programme in the minimal
             package, the upper one in the others (Mateusz, 03.11.2026) */
          var dose = pk === "min" ? lo : hi;
          if (doseEl) doseEl.textContent = (doseEl.getAttribute("data-prefix") || "") + num(dose) + "\u00a0" + unit + "/ha" + (doseEl.getAttribute("data-suffix") || "");
          if (qty) qty.textContent = ha ? num(dose * ha) + "\u00a0" + unit : "–";
          if (out || !prod || !ha) { if (packsEl) packsEl.textContent = ""; return; }
          var b = cover(dose * ha, prod);
          if (packsEl) packsEl.textContent = b.packs.length ? packText(b.packs) : "";
          if (skip) return;   /* left out of the price by its checkbox (U-19) */
          any = true;
          s.lo += b.net; s.hi += b.net; s.glo += b.gross; s.ghi += b.gross;
          mine.push({ product: prod, packs: b.packs });
        });
        if (sumEl) sumEl.textContent = any ? zl(s.lo, s.hi) : "–";
        var on = any;
        c.classList.toggle("is-off", !on);
        c.classList.toggle("is-on", on);
        if (on) { tot.lo += s.lo; tot.hi += s.hi; tot.glo += s.glo; tot.ghi += s.ghi; counted++; plan = plan.concat(mine); }
      });
      if (totalEl) totalEl.textContent = tot.ghi ? zl(tot.lo, tot.hi) : "–";
      if (grossEl) grossEl.textContent = tot.ghi ? "brutto " + zl(tot.glo, tot.ghi) : "";
      if (infoEl) {
        infoEl.innerHTML = "";
        var b1 = doc.createElement("b"); b1.textContent = "Pakiet " + (PK_NAME[pk] || "");
        infoEl.appendChild(b1);
        infoEl.appendChild(doc.createTextNode(" · " + (ha ? num(ha) : "–") + " ha · " + counted + " " + plural(counted, "faza", "fazy", "faz") + " w sumie"));
      }
      if (cartBtn) cartBtn.disabled = !shop || !plan.some(function (p) { return p.packs.length; });
    }

    function apply(next, silent) {
      var hit = opts.filter(function (o) { return o.getAttribute("data-pk-set") === next; })[0];
      if (!hit) return;
      pk = next;
      opts.forEach(function (o) {
        var on = o === hit;
        o.setAttribute("aria-checked", on ? "true" : "false");
        o.tabIndex = on ? 0 : -1;
      });
      tiles.forEach(function (t) {
        t.classList.toggle("is-out", (" " + (t.getAttribute("data-pk") || "") + " ").indexOf(" " + pk + " ") < 0);
      });
      if (status) status.textContent = "";
      run();
      if (!silent) doc.dispatchEvent(new CustomEvent("c5:pakiet", { detail: { group: group, pk: pk, from: box } }));
    }

    opts.forEach(function (o, i) {
      o.addEventListener("click", function () { apply(o.getAttribute("data-pk-set"), false); });
      o.addEventListener("keydown", function (e) {
        var n = opts.length, to = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") to = (i + 1) % n;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") to = (i - 1 + n) % n;
        else if (e.key === "Home") to = 0;
        else if (e.key === "End") to = n - 1;
        if (to < 0) return;
        e.preventDefault();
        apply(opts[to].getAttribute("data-pk-set"), false);
        opts[to].focus();
      });
    });
    doc.addEventListener("c5:pakiet", function (e) {
      var d = e.detail || {};
      if (d.from !== box && d.group === group) apply(d.pk, true);
    });
    field.addEventListener("input", function () { if (status) status.textContent = ""; run(); });
    tiles.forEach(function (t) {
      var pick = t.querySelector("[data-pkc-pick]");
      if (pick) pick.addEventListener("change", function () { if (status) status.textContent = ""; run(); });
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

    sw.hidden = false;
    var first = opts.filter(function (o) { return o.getAttribute("aria-checked") === "true"; })[0] || opts[0];
    apply(first.getAttribute("data-pk-set"), true);
  });

  /* „Kup produkt” on the product cards of the lightbox: the button also closes
     the lightbox (data-lightbox-close, uprawa.js), then the quick view opens. */
  var all = catalogue(doc);
  Array.prototype.forEach.call(doc.querySelectorAll("[data-pkc-buy]"), function (b) {
    var prod = all[b.getAttribute("data-pkc-buy")];
    if (!prod || !shop || !shop.open) return;
    b.addEventListener("click", function () {
      setTimeout(function () { shop.open(prod, b, {}); }, 40);
    });
  });
})();
