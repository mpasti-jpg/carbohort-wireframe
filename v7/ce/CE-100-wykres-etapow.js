/* ===== CE-100 · Wykres etapów z pakietami (rejestr: ce-rejestr.js) =========
   Gantt-like chart of a crop programme (Figma 560:167 and its annotations,
   03.11.2026). Phases are the columns, products the rows, a bar in a cell is the
   use of a product in that phase.
   - Package switch (`[data-pk-switch]`, radio semantics: click, arrows, Home,
     End): `data-pk="min std kompl"` lists the packages of a bar; a bar without
     `data-pk` (alternative) stands in every package. The product list always
     stands – only the bars change; a bar shows ONE dose, `data-txt-min` being
     its text in the minimal package (lower dose of the programme). The open
     package starts as the one marked
     `aria-checked="true"` in the markup (the full package – annotation).
   - The whole column of a phase opens its description: a click anywhere in a
     body cell or in the pill row clicks the pill of that column (the pill is the
     focusable target and opens the CE-25 lightbox through uprawa.js). Pointer
     and focus tint the column.
   - Every package switch of the same group (`data-pakiety`) keeps in step
     through a `c5:pakiet` event on document: the cost calculator (CE-47
     `etapy`) and the stage lightbox. In the lightbox (`[data-pk-sat]` with the
     same group) the switch filters the product cards (`[data-pk]`, cards
     without it are alternatives and stay) and shows `[data-pk-none]` in a
     `[data-pk-scope]` where no card of the package is left.
   - `[data-we-goto="#id"]` (the „Oblicz koszt stosowania” button of the lightbox,
     which also closes it through data-lightbox-close) scrolls to that section.
   - Package descriptions (U-37, 06.11.2026): `[data-pk-desc="min"]` etc.
     inside the chart – only the one of the open package stands.
   - Split of the season dose (U-38, 06.11.2026): a bar with
     `data-zab-prod="key"` and `data-zab="2 3"` is a possible term of a part
     of the dose of that product; it is solid when the number of treatments
     chosen in the calculator (`c5:zabiegi` event on document: group, prod, n)
     is in its list, otherwise hatched (`is-opt`). Its hidden text
     `[data-we-sr]` says which.
   - Variant „razem” (08.11.2026, U-75, U-76): a possible term shows nothing
     until the split fills it; a change of the number of treatments flies the
     parts between the bar of the first treatment (`data-zab-src="key"`) and
     the bars of their phases.
   - Controls inside the cells (`[data-we-ctl]`: the number of treatments under
     the bar, the row „Wyłącz wybrane fazy z obliczeń” – CE-47 `etapy`,
     07.11.2026) take their own clicks; the column does not open then.
   Without JS the switches stay hidden and all bars and cards stand. ======== */
(function () {
  "use strict";
  var doc = document;
  var slice = function (l) { return Array.prototype.slice.call(l); };

  /* one switch: radio buttons [data-pk-set] inside [data-pk-switch] */
  function wireSwitch(sw, onPick) {
    var opts = slice(sw.querySelectorAll("[data-pk-set]"));
    function mark(pk) {
      opts.forEach(function (o) {
        var on = o.getAttribute("data-pk-set") === pk;
        o.setAttribute("aria-checked", on ? "true" : "false");
        o.tabIndex = on ? 0 : -1;
      });
    }
    opts.forEach(function (o, i) {
      o.addEventListener("click", function () { onPick(o.getAttribute("data-pk-set")); });
      o.addEventListener("keydown", function (e) {
        var n = opts.length, to = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") to = (i + 1) % n;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") to = (i - 1 + n) % n;
        else if (e.key === "Home") to = 0;
        else if (e.key === "End") to = n - 1;
        if (to < 0) return;
        e.preventDefault();
        onPick(opts[to].getAttribute("data-pk-set"));
        opts[to].focus();
      });
    });
    var first = opts.filter(function (o) { return o.getAttribute("aria-checked") === "true"; })[0] || opts[0];
    sw.hidden = false;
    return { mark: mark, first: first ? first.getAttribute("data-pk-set") : null };
  }
  function inPk(el, pk) {
    return (" " + el.getAttribute("data-pk") + " ").indexOf(" " + pk + " ") >= 0;
  }
  function announce(group, pk, from) {
    doc.dispatchEvent(new CustomEvent("c5:pakiet", { detail: { group: group, pk: pk, from: from } }));
  }

  /* --- the chart ------------------------------------------------------------ */
  slice(doc.querySelectorAll("[data-we]")).forEach(function (root) {
    var group = root.getAttribute("data-pakiety") || "";
    var table = root.querySelector("table");
    var sw = root.querySelector("[data-pk-switch]");
    if (!table || !sw) return;
    var bars = slice(root.querySelectorAll(".c5-we__bar[data-pk]"));
    /* one dose per package: a bar with data-txt-min shows that text in the minimal package */
    var dosed = slice(root.querySelectorAll(".c5-we__bar[data-txt-min]"));
    dosed.forEach(function (b) { b.setAttribute("data-txt", b.textContent); });
    var cells = slice(table.querySelectorAll("td[data-c]"));
    var descs = slice(root.querySelectorAll("[data-pk-desc]"));
    var ctl;
    function apply(pk, silent) {
      ctl.mark(pk);
      root.setAttribute("data-pk-on", pk);
      descs.forEach(function (d) { d.hidden = d.getAttribute("data-pk-desc") !== pk; });
      dosed.forEach(function (b) { b.textContent = b.getAttribute(pk === "min" ? "data-txt-min" : "data-txt"); });
      bars.forEach(function (b) {
        var off = !inPk(b, pk);
        b.classList.toggle("is-off", off);
        if (off || (root.classList.contains("c5-we--razem") && b.classList.contains("is-opt"))) b.setAttribute("aria-hidden", "true"); else b.removeAttribute("aria-hidden");
      });
      if (!silent) announce(group, pk, root);
    }
    ctl = wireSwitch(sw, function (pk) { apply(pk, false); });
    doc.addEventListener("c5:pakiet", function (e) {
      var d = e.detail || {};
      if (d.from !== root && d.group === group) apply(d.pk, true);
    });

    /* the split of the season dose chosen in the calculator */
    var razem = root.classList.contains("c5-we--razem"), zabN = {};
    var scroller = root.querySelector(".c5-we__scroll");
    doc.addEventListener("c5:zabiegi", function (e) {
      var d = e.detail || {};
      if (d.group !== group || !d.prod) return;
      var parts = slice(root.querySelectorAll('.c5-we__bar[data-zab-prod="' + d.prod + '"]'));
      var was = parts.filter(function (b) { return !b.classList.contains("is-opt"); });
      parts.forEach(function (b) {
        var on = (" " + (b.getAttribute("data-zab") || "") + " ").indexOf(" " + d.n + " ") >= 0;
        b.classList.toggle("is-opt", !on);
        var sr = b.querySelector("[data-we-sr]");
        if (sr) sr.textContent = on ? "zabieg w pakiecie – część dawki na sezon" : "możliwy termin części dawki";
        /* „razem”: a possible term shows nothing until the split fills it (U-76) */
        if (razem) { if (!on || b.classList.contains("is-off")) b.setAttribute("aria-hidden", "true"); else b.removeAttribute("aria-hidden"); }
      });
      var prev = zabN[d.prod];
      zabN[d.prod] = d.n;
      if (!razem || prev === undefined || prev === d.n) return;
      var src = root.querySelector('.c5-we__bar[data-zab-src="' + d.prod + '"]');
      var now = parts.filter(function (b) { return !b.classList.contains("is-opt"); });
      fly(src, now.filter(function (b) { return was.indexOf(b) < 0; }), was.filter(function (b) { return now.indexOf(b) < 0; }));
    });
    /* U-75 (08.11.2026): a bigger number of treatments tears pieces off the right
       of the bar of the first treatment and flies them to the phases of the new
       parts, the bar regrowing behind them; a smaller one flies the parts back
       into it. Pieces are absolute children of the scroller, so they scroll
       with the table. No motion with prefers-reduced-motion. */
    function fly(src, add, back) {
      if (!src || !scroller || !src.animate || src.classList.contains("is-off")) return;
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      var base = scroller.getBoundingClientRect();
      function box(el) {
        var r = el.getBoundingClientRect();
        return { left: r.left - base.left + scroller.scrollLeft, top: r.top - base.top + scroller.scrollTop, width: r.width, height: r.height };
      }
      function px(b) { return { left: b.left + "px", top: b.top + "px", width: b.width + "px", height: b.height + "px" }; }
      function ghost(b) {
        var g = doc.createElement("span");
        g.className = "c5-we__ghost";
        g.setAttribute("aria-hidden", "true");
        var s = px(b);
        for (var k in s) g.style[k] = s[k];
        scroller.appendChild(g);
        return g;
      }
      function lift(a, b) { return { left: (a.left + b.left) / 2 + "px", top: Math.min(a.top, b.top) - 12 + "px", width: (a.width + b.width) / 2 + "px", height: b.height + "px", offset: 0.45 }; }
      var S = box(src), EASE = "cubic-bezier(.3,.7,.2,1)";
      var list = add.length ? add : back, k = list.length;
      if (!k) return;
      list.sort(function (a, b) { return box(a).left - box(b).left; });
      list.forEach(function (bar, j) {
        var T = box(bar), w = S.width / (k + 1);
        var P = { left: S.left + w * (j + 1), top: S.top, width: w, height: S.height };
        var from = add.length ? P : T, to = add.length ? T : P;
        var g = ghost(from);
        if (add.length) bar.classList.add("is-landing");
        var a = g.animate([px(from), lift(from, to), add.length ? px(to) : Object.assign(px(to), { opacity: 0 })],
          { duration: 620 + j * 120, easing: EASE, fill: "forwards" });
        a.onfinish = a.oncancel = function () { bar.classList.remove("is-landing"); g.remove(); };
      });
      /* the bar of the first treatment: cut where the pieces leave, then regrow */
      if (add.length) {
        var cut = "inset(0 " + Math.round(k / (k + 1) * 1000) / 10 + "% 0 0 round 999px)";
        src.animate([{ clipPath: cut }, { clipPath: cut, offset: 0.25 }, { clipPath: "inset(0 0% 0 0 round 999px)" }], { duration: 700, easing: EASE });
      }
    }

    /* the whole column is the link to the description of the phase */
    var pills = {};
    slice(table.querySelectorAll(".c5-we__pills td[data-c]")).forEach(function (td) {
      var p = td.querySelector(".c5-we__pill");
      if (p) pills[td.getAttribute("data-c")] = p;
    });
    table.addEventListener("click", function (e) {
      var cell = e.target.closest ? e.target.closest("td[data-c]") : null;
      /* the controls standing in the cells (the number of treatments under a bar,
         the phase switches of the last row – 07.11.2026) do their own job */
      if (!cell || !table.contains(cell) || e.target.closest(".c5-we__pill, [data-we-ctl]")) return;
      var p = pills[cell.getAttribute("data-c")];
      if (p) p.click();
    });
    var tinted = null;
    function tint(c) {
      if (c === tinted) return;
      tinted = c;
      cells.forEach(function (el) { el.classList.toggle("is-col", c !== null && el.getAttribute("data-c") === c); });
    }
    function colOf(t) {
      var cell = t && t.closest ? t.closest("[data-c]") : null;
      return cell && table.contains(cell) ? cell.getAttribute("data-c") : null;
    }
    table.addEventListener("pointerover", function (e) { tint(colOf(e.target)); });
    table.addEventListener("pointerleave", function () { tint(null); });
    table.addEventListener("focusin", function (e) { tint(colOf(e.target)); });
    table.addEventListener("focusout", function () { tint(null); });

    if (ctl.first) apply(ctl.first, true);
  });

  /* --- satellites: the package bar of the stage lightbox -------------------- */
  slice(doc.querySelectorAll("[data-pk-sat]")).forEach(function (sat) {
    var group = sat.getAttribute("data-pakiety") || "";
    var sw = sat.querySelector("[data-pk-switch]");
    if (!sw) return;
    var cards = slice(sat.querySelectorAll("[data-pk]"));
    var scopes = slice(sat.querySelectorAll("[data-pk-scope]"));
    var ctl;
    function apply(pk, silent) {
      ctl.mark(pk);
      cards.forEach(function (c) { c.hidden = !inPk(c, pk); });
      scopes.forEach(function (s) {
        var none = s.querySelector("[data-pk-none]");
        if (!none) return;
        none.hidden = slice(s.querySelectorAll("[data-pk]")).some(function (c) { return !c.hidden; });
      });
      if (!silent) announce(group, pk, sat);
    }
    ctl = wireSwitch(sw, function (pk) { apply(pk, false); });
    doc.addEventListener("c5:pakiet", function (e) {
      var d = e.detail || {};
      if (d.from !== sat && d.group === group) apply(d.pk, true);
    });
    if (ctl.first) apply(ctl.first, true);
  });

  /* --- „Oblicz koszt stosowania”: after the lightbox closes, go to the section */
  slice(doc.querySelectorAll("[data-we-goto]")).forEach(function (b) {
    b.addEventListener("click", function () {
      var target = doc.querySelector(b.getAttribute("data-we-goto"));
      if (!target) return;
      setTimeout(function () {
        var y = Math.round(target.getBoundingClientRect().top + window.scrollY);
        if (window.CX5 && CX5.scrollTo) CX5.scrollTo(y, CX5.reducedMQ && CX5.reducedMQ.matches ? "auto" : "smooth");
        else window.scrollTo(0, y);
      }, 60);
    });
  });
})();
