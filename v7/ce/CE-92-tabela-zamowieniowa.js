/* ==========================================================================
   CE-92 – Order table (c5-order)
   General module: reads the DOM only. Rows, prices (data-cena-gr, in grosze)
   and quantities stand in the HTML; without this script the table still shows
   the quantities and amounts written there.

   What it does
   - quantity stepper 0–999 (cws-qty gives the look, the handling lives here),
   - row value, number of items, net and gross total – integers in grosze,
     gross = net + VAT from data-vat rounded to one grosz,
   - large-order block from the threshold in data-prog-gr (no attribute – no
     block); the block stands in the sticky dock, on the summary bar,
   - list scope ("my products / all") and search by name,
   - aria-disabled on the next-step button when the order is empty,
   - one aria-live region, updated with a delay,
   - the --c5-order-bar-h variable on <html>: height of the whole sticky dock
     (summary bar plus the large-order block when it is shown),
   - event on the root after every change and once at start:
       CustomEvent("c5-order:zmiana", { bubbles: true,
         detail: { pozycje, nettoGr, bruttoGr, duze } })

   What it does not do: it does not read the page address, does not set the
   target of the next-step button and does not fill other content elements.
   Starts by itself on DOMContentLoaded; no globals.
   ========================================================================== */
(function () {
  "use strict";

  var MAX = 999;
  var LIVE_DELAY = 400;
  var NBSP = " ";

  /* 1294572 -> "12 945,72 zł" (non-breaking spaces) */
  function fmt(gr) {
    var sign = gr < 0 ? "−" : "";
    var abs = Math.abs(gr);
    var zl = String(Math.floor(abs / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
    var rest = abs % 100;
    return sign + zl + "," + (rest < 10 ? "0" : "") + rest + NBSP + "zł";
  }

  /* 1 pozycja, 2–4 pozycje, 5+ pozycji */
  function plural(n) {
    var d = n % 10, h = n % 100;
    if (n === 1) return "pozycja";
    if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return "pozycje";
    return "pozycji";
  }

  /* Lower case, no diacritics, single spaces – for the search */
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD")
      .replace(/[̀-ͯ]/g, "").replace(/ł/g, "l")
      .replace(/\s+/g, " ").trim();
  }

  function qtyOf(input) {
    var n = parseInt(input.value, 10);
    if (!isFinite(n) || n < 0) return 0;
    return n > MAX ? MAX : n;
  }

  function init(root) {
    var vat = parseInt(root.getAttribute("data-vat"), 10) || 0;
    var prog = root.hasAttribute("data-prog-gr") ? parseInt(root.getAttribute("data-prog-gr"), 10) : NaN;
    var hasProg = isFinite(prog);

    var big = root.querySelector(".c5-order__big");
    /* The sticky box */
    var dock = root.querySelector(".c5-order__dock");
    var count = root.querySelector(".c5-order__count");
    var net = root.querySelector(".c5-order__net");
    var gross = root.querySelector(".c5-order__gross");
    var empty = root.querySelector(".c5-order__empty");
    var next = root.querySelector(".c5-order__next");
    var live = root.querySelector(".c5-order__live");
    var none = root.querySelector(".c5-order__none");
    var search = root.querySelector(".c5-order__search input");
    var scopeCtl = Array.prototype.slice.call(root.querySelectorAll("[data-zakres]"));

    var rows = Array.prototype.map.call(root.querySelectorAll(".c5-order__row"), function (el) {
      var name = el.querySelector(".c5-order__name");
      var pack = el.querySelector(".c5-order__pack");
      var btns = el.querySelectorAll(".cws-qty__b");
      return {
        el: el,
        input: el.querySelector(".cws-qty__v"),
        val: el.querySelector(".c5-order__val"),
        minus: el.querySelector('.cws-qty__b[data-krok="-1"]') || btns[0] || null,
        plus: el.querySelector('.cws-qty__b[data-krok="1"]') || btns[1] || null,
        cena: parseInt(el.getAttribute("data-cena-gr"), 10) || 0,
        moje: el.getAttribute("data-moje") === "1",
        text: norm((name ? name.textContent : "") + " " + (pack ? pack.textContent : ""))
      };
    }).filter(function (r) { return r.input; });

    var scope = "wszystkie";
    var query = "";
    var wasDuze = false;
    var bigPending = false;
    var liveTimer = null;

    /* --- Focus never under the sticky dock ------------------------------ */
    function keepClear(t) {
      if (!dock || !t || !root.contains(t) || dock.contains(t) || typeof t.getBoundingClientRect !== "function") return;
      requestAnimationFrame(function () {
        var over = t.getBoundingClientRect().bottom - dock.getBoundingClientRect().top + 12;
        if (over > 0) window.scrollBy(0, over);
      });
    }

    /* --- Totals --------------------------------------------------------- */
    function recompute(announce) {
      var pozycje = 0, netto = 0;
      rows.forEach(function (r) {
        var q = qtyOf(r.input);
        var line = q * r.cena;
        if (q > 0) { pozycje += 1; netto += line; }
        if (r.val) r.val.textContent = q > 0 ? fmt(line) : "–";
        r.el.classList.toggle("is-active", q > 0);
        if (r.minus) {
          if (q <= 0) r.minus.setAttribute("aria-disabled", "true"); else r.minus.removeAttribute("aria-disabled");
        }
        if (r.plus) {
          if (q >= MAX) r.plus.setAttribute("aria-disabled", "true"); else r.plus.removeAttribute("aria-disabled");
        }
      });
      /* Integer arithmetic: VAT rounded half up to one grosz */
      var brutto = netto + Math.floor((netto * vat + 50) / 100);
      var duze = hasProg && netto >= prog;

      if (count) count.textContent = pozycje + NBSP + plural(pozycje);
      if (net) net.textContent = fmt(netto) + " netto";
      if (gross) gross.textContent = "(" + fmt(brutto) + " brutto)";
      if (empty) empty.hidden = pozycje > 0;
      if (next) {
        if (pozycje === 0) {
          next.setAttribute("aria-disabled", "true");
          if (empty && empty.id) next.setAttribute("aria-describedby", empty.id);
        } else {
          next.removeAttribute("aria-disabled");
          next.removeAttribute("aria-describedby");
        }
      }
      if (big) {
        var grew = duze && big.hidden;
        big.hidden = !duze;
        /* The dock got taller: the control in use must stay above it */
        if (grew) keepClear(document.activeElement);
      }

      /* The large-order block is announced once, when it appears; the flag
         survives until the delayed text is actually written. */
      if (duze && !wasDuze && big) bigPending = true;
      if (!duze) bigPending = false;
      wasDuze = duze;
      var sentence = pozycje + " " + plural(pozycje) + ", " + fmt(netto) + " netto";
      if (bigPending) {
        /* The sentences of the block without the small print (c5-src) */
        var lead = big.querySelector("p");
        var said = "";
        if (lead) {
          var copy = lead.cloneNode(true);
          Array.prototype.forEach.call(copy.querySelectorAll(".c5-src"), function (n) { n.parentNode.removeChild(n); });
          said = copy.textContent.replace(/\s+/g, " ").trim();
        }
        sentence += ". " + said;
      }
      if (live) {
        clearTimeout(liveTimer);
        if (announce) {
          liveTimer = setTimeout(function () { live.textContent = sentence; bigPending = false; }, LIVE_DELAY);
        } else if (live.textContent.replace(/\s+/g, " ").trim() !== sentence.replace(/\s+/g, " ")) {
          live.textContent = sentence;
          bigPending = false;
        } else {
          bigPending = false;
        }
      }

      root.dispatchEvent(new CustomEvent("c5-order:zmiana", {
        bubbles: true,
        detail: { pozycje: pozycje, nettoGr: netto, bruttoGr: brutto, duze: duze }
      }));
    }

    /* --- Stepper and quantity fields ----------------------------------- */
    rows.forEach(function (r) {
      function step(delta) {
        var q = qtyOf(r.input);
        var v = Math.max(0, Math.min(MAX, q + delta));
        if (v === q && String(v) === r.input.value) return;
        r.input.value = String(v);
        r.input.dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (r.minus) r.minus.addEventListener("click", function () { step(-1); });
      if (r.plus) r.plus.addEventListener("click", function () { step(1); });

      /* While typing: keep the field as typed (only cap it), count the value */
      r.input.addEventListener("input", function () {
        if (parseInt(r.input.value, 10) > MAX) r.input.value = String(MAX);
        recompute(true);
      });
      /* On commit – also when the page script dispatches "change" */
      r.input.addEventListener("change", function () {
        r.input.value = String(qtyOf(r.input));
        recompute(true);
      });
      r.input.addEventListener("focus", function () {
        try { r.input.select(); } catch (e) { /* number fields may refuse */ }
      });
    });

    /* --- List scope and search ------------------------------------------ */
    function applyFilter() {
      var shown = 0;
      rows.forEach(function (r) {
        /* A row with a quantity never disappears from "my products" */
        var inScope = scope !== "moje" || r.moje || qtyOf(r.input) > 0;
        var match = !query || r.text.indexOf(query) !== -1;
        var show = inScope && match;
        r.el.hidden = !show;
        if (show) shown += 1;
      });
      if (none) none.hidden = shown > 0;
    }

    function setScope(value) {
      scope = value;
      scopeCtl.forEach(function (c) {
        var on = c.getAttribute("data-zakres") === value;
        if (c.tagName === "INPUT") c.checked = on;
        else c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      applyFilter();
    }

    scopeCtl.forEach(function (c) {
      var value = c.getAttribute("data-zakres");
      if (c.tagName === "INPUT") {
        if (c.checked) scope = value;
        c.addEventListener("change", function () { if (c.checked) setScope(value); });
      } else {
        if (c.getAttribute("aria-pressed") === "true") scope = value;
        c.addEventListener("click", function () { setScope(value); });
      }
    });

    if (search) {
      search.addEventListener("input", function () {
        query = norm(search.value);
        applyFilter();
      });
      query = norm(search.value);
    }

    /* --- Next-step button: inactive while the order is empty ------------- */
    if (next) {
      next.addEventListener("click", function (e) {
        if (next.getAttribute("aria-disabled") === "true") e.preventDefault();
      });
    }

    /* --- Sticky dock: height variable ----------------------------------- */
    if (dock) {
      var setBarH = function () {
        document.documentElement.style.setProperty("--c5-order-bar-h", dock.offsetHeight + "px");
      };
      setBarH();
      if (typeof ResizeObserver === "function") new ResizeObserver(setBarH).observe(dock);
      else window.addEventListener("resize", setBarH);

      root.addEventListener("focusin", function (e) { keepClear(e.target); });
    }

    recompute(false);
    applyFilter();
  }

  function start() {
    Array.prototype.forEach.call(document.querySelectorAll(".c5-order"), init);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
