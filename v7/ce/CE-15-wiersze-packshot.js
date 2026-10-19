/* ===== CE-15 (pin) · Cascade of accordions driven by the scroll =============
   Variant „kaskada-z-pinem" of CE-15, built to the Figma frame 308-179 and to
   the designer's annotations of 20.09.2026 (spec §16.6).

   A shared module since 02.10.2026 – see the CSS half for what a page chooses.
   A root without a [data-casc-pin] box is not ours and is left alone.

   The annotation, word for word: „Akordeony same rozwijają się i zwijają
   podczas przewijania strony w dół. Po kolei. Pierwszy pojawia się już
   rozwinięty, pozostałe są zwinięte. Krótki scroll i zamyka się pierwszy
   a otwiera drugi. I tak aż zamknie się ostatni. Strona w tym czasie jest
   w jednym miejscu. Widać nagłówek i kicker tego CE/sekcji."

   So this is NOT a countdown: nothing runs on a clock, the scroll position is
   the only input. The track has N phases – one per card – and then the pin
   lets go with the last card open (until 18.10.2026 an extra closing beat
   folded them all). Its height is finite and computed here, so the reader is
   never held.

   Two behaviours, one DOM:
   · with CX5.motionOn() (>= 900 px and no reduced motion) the module sets
     `data-casc="on"`, pins the section and drives the cards from the scroll.
     A click or Enter on a header scrolls to the middle of that card's phase,
     so the buttons keep working and the scroll still owns the state – there is
     never a disagreement between the two;
   · otherwise (below 900 px, reduced motion, and without JS – which never gets
     here at all) the positions simply stand open one under another and a click
     folds a single card. No pin, no columns, no hairlines.

   What the module reads from the markup:
   · the number of cards N (three or four in the sheet) -> `data-casc-n` on the
     root; the hairlines are topped up to N + 1;
   · `data-casc-fit` on the root -> before pinning, the module checks that the
     pinned parts end above the gap line and steps down through
     `data-casc-level` 0 / 1 / 2 (see the CSS half); when even the box alone
     does not fit, the section stays in the static layout on that window.
     `data-casc-fit="frame"` runs the same check and keeps the composition of
     the frame. Without the attribute nothing is checked – the behaviour of
     20.09.2026.

   Round of 18.10.2026 (owner's comments E14 / R07) – the bar above the cards
   illustrates the OPEN card:
   · every card covers its own period on a grid of 12 columns
     (`data-casc-od` / `data-casc-do` on the <li>, 1-based and inclusive; a
     card without them takes its equal share). The card stands in its own row
     under that span, so cards differ in width and in where they start;
     `data-casc-kol` on the root changes the 12;
   · the axis keeps one label per card in N equal zones; the label of the
     open card is fully visible, the others are dimmed (CSS);
   · the brackets are ONE line (an SVG path drawn here). Where the period of the
     open card begins or ends inside the grid the line is creased: it folds
     down into two rounded corners that meet, the way two brackets touch.
     Changing the card moves, flattens and raises the creases in one eased
     tween – a crease that travels gets shallower half-way, one that is no
     longer needed straightens out, a new one sinks in from the flat line. Any
     number of creases is fine; `data-casc-podzial="4 8"` on a card sets them
     by hand (column boundaries) instead of the two ends of its period;
   · N phases instead of N + 1: the last card stays open when the pin lets
     go, so the page continues right under it (no empty frozen box).

   Nothing here moves the focus and nothing scrolls by itself except on a click.
   No [data-casc] -> no-op. ================================================= */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;

  $$("[data-casc]").forEach(function (root) {
    var list = $(".c5-casc__list", root);
    var box = $("[data-casc-pin]", root);
    if (!list || !box) return;
    var spacer = $("[data-casc-spacer]", root);
    var head = $("[data-casc-head]", root);
    var headWrap = $("[data-casc-headwrap]", root);
    var fit = root.hasAttribute("data-casc-fit");
    /* `data-casc-fit="frame"`: the same check, the composition of the frame */
    var fitFrame = root.getAttribute("data-casc-fit") === "frame";

    var items = $$(".c5-casc__item", list);
    var btns = items.map(function (it) { return $(".c5-casc__btn", it); });
    var panels = items.map(function (it) { return $(".c5-casc__panel", it); });
    var N = items.length;
    /* incomplete markup – the panels stay open, which is the readable state */
    if (!N || btns.indexOf(null) !== -1 || panels.indexOf(null) !== -1) return;
    var PHASES = N;              /* one phase per card; the last stays open     */

    /* the sheet keys its column rules on the number of cards */
    root.setAttribute("data-casc-n", String(N));
    root.style.setProperty("--c5-casc-n", String(N));
    /* one hairline per column boundary: N + 1 */
    var lines = $(".c5-casc__lines", root);
    if (lines) {
      while (lines.children.length < N + 1) lines.appendChild(doc.createElement("i"));
      while (lines.children.length > N + 1) lines.removeChild(lines.lastElementChild);
    }

    /* --- periods: where each card stands on the grid of columns -------------
       Read once from the markup. `od` / `do` are 1-based and inclusive; a card
       without them takes its equal share of the grid (the layout before
       18.10.2026). `cuts` are the column boundaries the axis line folds at
       while this card is open: the inner ends of its period, or the list in
       `data-casc-podzial`. */
    var COLS = Math.max(2, Math.round(parseFloat(root.getAttribute("data-casc-kol"))) || 12);
    function attrNum(el, name) {
      var v = parseFloat(el.getAttribute(name));
      return isFinite(v) ? Math.round(v) : null;
    }
    var periods = items.map(function (it, i) {
      var a = attrNum(it, "data-casc-od"), b = attrNum(it, "data-casc-do");
      if (a === null) a = Math.round(i * COLS / N) + 1;
      if (b === null) b = Math.round((i + 1) * COLS / N);
      a = Math.max(1, Math.min(COLS, a));
      b = Math.max(a, Math.min(COLS, b));
      var raw = it.getAttribute("data-casc-podzial");
      var cuts = raw ? raw.trim().split(/[\s,;]+/).map(Number) : [a - 1, b];
      cuts = cuts.filter(function (x, k, all) { return isFinite(x) && x > 0 && x < COLS && all.indexOf(x) === k; })
        .sort(function (x, y) { return x - y; });
      return { od: a, "do": b, cuts: cuts };
    });
    /* a card that covers more than half of the grid lays its panel out in two
       columns (product row | note), as the wide card of the frame does */
    var WIDE = Math.floor(COLS / 2) + 1;

    function placeCards(onGrid) {
      root.style.setProperty("--c5-casc-cols", String(COLS));
      items.forEach(function (it, j) {
        var per = periods[j];
        if (onGrid) {
          it.style.setProperty("--c5-casc-col", per.od + " / " + (per["do"] + 1));
          it.style.setProperty("--c5-casc-row", String(j + 1));
          it.classList.toggle("c5-casc__item--szeroka", per["do"] - per.od + 1 >= WIDE);
        } else {
          it.style.removeProperty("--c5-casc-col");
          it.style.removeProperty("--c5-casc-row");
          it.classList.remove("c5-casc__item--szeroka");
        }
      });
    }

    /* --- the axis line: one path with creases ---------------------------------
       Drawn over the whole grid, under the labels. Each crease is
       {x: column boundary, d: depth 0..1}; a tween moves them from where they
       stand to the creases of the open card. Paired by distance (up to a third
       of the grid): a pair travels, a crease without a partner straightens
       out (d -> 0) and a new one sinks in (d 0 -> 1). Only the `d` attribute
       of the path changes; nothing in the layout moves. */
    var axis = $(".c5-casc__axis", root);
    var labels = axis ? $$(".c5-casc__ax", axis) : [];
    var wave = null, wavePath = null, waveW = 0, waveH = 0;
    var creases = [];
    var waveRaf = 0;
    var WAVE_MS = 760, WAVE_DIP = 0.55, K = 0.5523;
    if (axis) {
      var NS = "http://www.w3.org/2000/svg";
      wave = doc.createElementNS(NS, "svg");
      wave.setAttribute("class", "c5-casc__wave");
      wave.setAttribute("aria-hidden", "true");
      wave.setAttribute("focusable", "false");
      wavePath = doc.createElementNS(NS, "path");
      wave.appendChild(wavePath);
      axis.appendChild(wave);
      axis.setAttribute("data-casc-wave", "");
    }
    function r2(v) { return Math.round(v * 100) / 100; }
    function wavePathD() {
      var w = waveW, h = waveH;
      if (!w || !h) return "";
      var sw = parseFloat(window.getComputedStyle(wavePath).strokeWidth) || 1.5;
      var e = sw / 2, top = e, L = e, Rr = w - e;
      var rad = parseFloat(window.getComputedStyle(wave).getPropertyValue("--c5-casc-wave-r")) || 24;
      var r = Math.min(rad, h - top, (Rr - L) / 4);
      var s = "M" + r2(L) + " " + r2(h) + "V" + r2(top + r) +
        "C" + r2(L) + " " + r2(top + r - K * r) + " " + r2(L + r - K * r) + " " + r2(top) + " " + r2(L + r) + " " + r2(top);
      var prev = L + r;
      creases.slice().sort(function (p, q) { return p.x - q.x; }).forEach(function (c) {
        var D = c.d * (h - top);
        if (D < 0.2) return;
        var X = L + (Rr - L) * c.x / COLS;
        /* never fold back past the previous corner, nor past the outer ones */
        var q = Math.max(0, Math.min(r, D, X - prev, Rr - r - X));
        s += "H" + r2(X - q) +
          "C" + r2(X - q + K * q) + " " + r2(top) + " " + r2(X) + " " + r2(top + q - K * q) + " " + r2(X) + " " + r2(top + q) +
          "V" + r2(top + D) + "V" + r2(top + q) +
          "C" + r2(X) + " " + r2(top + q - K * q) + " " + r2(X + q - K * q) + " " + r2(top) + " " + r2(X + q) + " " + r2(top);
        prev = X + q;
      });
      s += "H" + r2(Rr - r) +
        "C" + r2(Rr - r + K * r) + " " + r2(top) + " " + r2(Rr) + " " + r2(top + r - K * r) + " " + r2(Rr) + " " + r2(top + r) +
        "V" + r2(h);
      return s;
    }
    function drawWave() { if (wavePath) wavePath.setAttribute("d", wavePathD()); }
    function sizeWave() {
      if (!wave) return;
      var b = wave.getBoundingClientRect();
      waveW = b.width; waveH = b.height;
      if (waveW && waveH) wave.setAttribute("viewBox", "0 0 " + r2(waveW) + " " + r2(waveH));
      drawWave();
    }
    function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function waveTo(cuts, instant) {
      if (!wave) return;
      if (waveRaf) { window.cancelAnimationFrame(waveRaf); waveRaf = 0; }
      var live = creases.filter(function (c) { return c.d > 0.001; });
      var pairs = [];
      live.forEach(function (c, ci) {
        cuts.forEach(function (t, ti) { pairs.push({ ci: ci, ti: ti, dist: Math.abs(c.x - t) }); });
      });
      pairs.sort(function (p, q) { return p.dist - q.dist; });
      var usedC = {}, usedT = {}, next = [];
      pairs.forEach(function (p) {
        if (usedC[p.ci] || usedT[p.ti] || p.dist > COLS / 3) return;
        usedC[p.ci] = usedT[p.ti] = true;
        var c = live[p.ci];
        next.push({ x0: c.x, d0: c.d, x1: cuts[p.ti], d1: 1, x: c.x, d: c.d });
      });
      live.forEach(function (c, ci) {
        if (!usedC[ci]) next.push({ x0: c.x, d0: c.d, x1: c.x, d1: 0, x: c.x, d: c.d });
      });
      cuts.forEach(function (t, ti) {
        if (!usedT[ti]) next.push({ x0: t, d0: 0, x1: t, d1: 1, x: t, d: 0 });
      });
      creases = next;
      function settle() {
        creases = creases.filter(function (c) { return c.d1 > 0; });
        creases.forEach(function (c) { c.x = c.x1; c.d = c.d1; });
        drawWave();
      }
      if (instant || !CX5.motionOn()) { settle(); return; }
      var t0 = 0;
      function frame(now) {
        if (!t0) t0 = now;
        var t = Math.min(1, (now - t0) / WAVE_MS), k = ease(t);
        creases.forEach(function (c) {
          c.x = c.x0 + (c.x1 - c.x0) * k;
          var d = c.d0 + (c.d1 - c.d0) * k;
          /* a crease on the move gets shallower half-way, then sinks in again */
          if (c.x1 !== c.x0) d *= 1 - WAVE_DIP * Math.sin(Math.PI * k);
          c.d = d;
        });
        drawWave();
        if (t < 1) waveRaf = window.requestAnimationFrame(frame);
        else { waveRaf = 0; settle(); }
      }
      waveRaf = window.requestAnimationFrame(frame);
    }
    /* the open card: its label fully visible, the axis line creased for it */
    function showOnAxis(idx, instant) {
      labels.forEach(function (ax, j) { ax.classList.toggle("is-on", idx < 0 || j === idx); });
      waveTo(idx >= 0 && periods[idx] ? periods[idx].cuts : [], instant);
    }

    var cur = null;              /* open card, -1 = none                        */
    var on = null;               /* layout of the last resize: true = pin       */
    var entered = false;         /* the entrance has already been played        */
    var boxH = 0;                /* pinned box height, tallest state            */
    var boxTop = 0;              /* used sticky `top` of the box (px)           */
    var spacerH = 0;             /* flow room reserved for the absolute header  */
    var headTop = 0, headH = 0;
    var step = 0;                /* one „short scroll", in px                   */
    var pinHead = true;          /* false on level 2: the header is not pinned  */

    function span() { return step * PHASES; }
    /* The box starts `spacerH` below the track top, so it reaches its sticky
       offset when the track top is that much above it. The header sits at the top
       of the track, so it sticks when the track top reaches its own offset. The
       cycle starts once BOTH happened, i.e. at the smaller track `top`. */
    function startTop() { return Math.min(boxTop - spacerH, head && pinHead ? headTop : Infinity); }

    /* --- open height -------------------------------------------------------
       The panel inner keeps its natural height whatever the panel does (the panel
       only clips it), so it can be measured at any time. Every card takes the
       tallest of them, so the column heights and the hairlines do not jump.
       Applied with the transition off – a measurement must never look like an
       animation. */
    /* Since 18.10.2026 every card opens to its OWN height (`--c5-casc-ph` on the
       item): a wide card holds its product row and note side by side and is
       lower than a narrow one, as in the frames. `--c5-casc-h` keeps the
       tallest one – the pinned box is placed for that state, so whichever card
       opens the box only grows downwards up to it and never moves its top. */
    var hs = [];                 /* open height of every panel                  */
    var hMax = 0;
    function measure() {
      hMax = 0;
      hs = panels.map(function (p) {
        var inner = p.firstElementChild;
        var h = Math.round(inner ? inner.getBoundingClientRect().height : 0);
        if (h > hMax) hMax = h;
        return h;
      });
      panels.forEach(function (p) { p.style.transition = "none"; });
      root.style.setProperty("--c5-casc-h", hMax + "px");
      items.forEach(function (it, j) { it.style.setProperty("--c5-casc-ph", hs[j] + "px"); });
      panels.forEach(function (p) { void p.offsetHeight; p.style.transition = ""; });
    }
    /* box heights derived from the state on screen: the tallest state (for the
       fit and the sticky offset) and the state in which the pin lets go */
    var boxLast = 0;
    function boxHeights() {
      var now = box.offsetHeight, open = hs[cur] || 0;
      boxH = Math.round(now - open + hMax);
      boxLast = Math.round(now - open + (hs[N - 1] || 0));
    }

    /* --- open / close ------------------------------------------------------
       `idx` of -1 means no card open (not used by the scroll since 18.10.2026,
       which keeps the last card open). `instant` skips the height
       animation (page start, resize). Nothing here touches focus or scroll. */
    function paint(idx, instant) {
      if (cur === idx) return;
      cur = idx;
      if (instant) panels.forEach(function (p) { p.style.transition = "none"; });
      items.forEach(function (it, j) {
        var open = j === idx;
        btns[j].setAttribute("aria-expanded", open ? "true" : "false");
        if (open) it.setAttribute("data-open", ""); else it.removeAttribute("data-open");
        panels[j].inert = !open;
      });
      if (instant) panels.forEach(function (p) { void p.offsetHeight; p.style.transition = ""; });
      showOnAxis(idx, instant);
    }

    /* --- the static layout -------------------------------------------------- */
    function toStatic() {
      root.setAttribute("data-casc", "off");
      root.removeAttribute("data-casc-level");
      root.removeAttribute("data-casc-fit-on");
      root.style.removeProperty("--c5-casc-headtop");
      box.style.removeProperty("--c5-casc-top");
      root.style.height = "";
      if (spacer) spacer.style.height = "";
      if (headWrap) headWrap.style.height = "";
      box.style.removeProperty("--c5-casc-box");
      box.style.removeProperty("--c5-casc-headroom");
      boxH = 0;
      boxLast = 0;
      items.forEach(function (it) { it.style.removeProperty("--c5-casc-ph"); });
      cur = null;
      pinHead = true;
      placeCards(false);
      items.forEach(function (it, j) {
        it.removeAttribute("data-open");
        it.removeAttribute("data-shut");
        btns[j].setAttribute("aria-expanded", "true");
        panels[j].inert = false;
      });
    }

    /* --- the fit check (`data-casc-fit`) -------------------------------------
       Tries the levels of the sheet in turn and keeps the first one whose pinned
       parts end above the gap line. Returns false when nothing fits.
       `avail` is where the bottom edge of the box has to stop: read from the
       sticky offset of the frame layout with the box and the headroom taken out
       of the formula, so the gap knob of the sheet stays the single source.
       Where there is room to spare the header and the box keep the distance
       they have in the page flow and the pair is centred above the gap line;
       where it is tight the distance gives way first, down to nothing. Both
       offsets are written as custom properties (--c5-casc-headtop on the
       root, --c5-casc-top on the box), so on these levels the header and the
       box lock at the same scroll position and nothing shifts between them.
       With `data-casc-fit="frame"` the composition of the frame is kept
       instead: the header at its own offset, the box on the gap line – the
       geometry a root without the check has wherever it fits. */
    function fitLevel() {
      root.removeAttribute("data-casc-fit-on");
      root.removeAttribute("data-casc-level");
      root.style.removeProperty("--c5-casc-headtop");
      box.style.removeProperty("--c5-casc-top");
      box.style.setProperty("--c5-casc-box", "0px");
      box.style.setProperty("--c5-casc-headroom", "0px");
      var avail = parseFloat(window.getComputedStyle(box).top) || 0;
      var minTop = head ? (parseFloat(window.getComputedStyle(head).top) || 0) : 16;
      var flowGap = spacer ? (parseFloat(window.getComputedStyle(spacer).marginBottom) || 0) : 0;
      root.setAttribute("data-casc-fit-on", "");
      for (var level = 0; level <= 2; level++) {
        root.setAttribute("data-casc-level", String(level));
        measure();
        /* the box as it really stands (a title that wraps makes its card taller
           than the 80 px of the frame) – boxHeights() reads it */
        paint(cur === null ? 0 : cur, true);
        pinHead = !!head && level < 2;
        headH = head ? head.offsetHeight : 0;
        boxHeights();
        var free = avail - minTop - boxH - (pinHead ? headH : 0);
        if (free < 0) continue;
        if (fitFrame && pinHead) {
          /* header where the sheet puts it, box with its bottom edge on the gap line */
          headTop = minTop;
          boxTop = avail - boxH;
          box.style.setProperty("--c5-casc-top", boxTop + "px");
          return true;
        }
        var gap = pinHead ? Math.min(flowGap, free) : 0;
        var total = boxH + (pinHead ? headH + gap : 0);
        /* the pair centred above the gap line, never higher than the offset of the sheet */
        headTop = Math.max(Math.ceil(minTop), Math.floor((avail - total) / 2));
        /* never past the gap line, whatever the rounding does */
        boxTop = Math.min(Math.round(headTop + (pinHead ? headH + gap : 0)), Math.floor(avail - boxH));
        root.style.setProperty("--c5-casc-headtop", headTop + "px");
        box.style.setProperty("--c5-casc-top", boxTop + "px");
        return true;
      }
      return false;
    }

    /* --- the pinned layout --------------------------------------------------
       Track height = sticky top + box height + N phases - start of the cycle,
       so the box lets go exactly at the end of the last card's phase. Returns false
       when the fit check found no level that fits. */
    function layout() {
      if (fit) {
        if (!fitLevel()) return false;
        box.style.setProperty("--c5-casc-box", Math.round(boxH) + "px");
      } else {
        /* the panels are measured in the cascade layout – a third of the window is
           a different wrap than the reading column of the static state */
        measure();
        if (head) {
          headTop = parseFloat(window.getComputedStyle(head).top) || 0;
          headH = head.offsetHeight;
        }
        paint(cur === null ? 0 : cur, true);
        /* the tallest state, whichever card is open while we measure */
        boxHeights();
        box.style.setProperty("--c5-casc-box", Math.round(boxH) + "px");
        box.style.setProperty("--c5-casc-headroom", Math.round(headTop + headH) + "px");
        boxTop = parseFloat(window.getComputedStyle(box).top) || 0;
      }
      if (spacer) {
        spacer.style.height = Math.round(headH) + "px";
        spacerH = spacer.offsetHeight +
          (parseFloat(window.getComputedStyle(spacer).marginBottom) || 0);
      } else {
        spacerH = Math.round(headH);
      }
      /* „krótki scroll" – a third of the window, with a floor so a short window
         does not make the steps unusably twitchy */
      step = Math.max(200, Math.round(window.innerHeight * 0.32));
      var s = span(), startC = startTop();
      /* the box lets go with the LAST card open: the track ends where that
         state of the box ends, so the page continues right under the card */
      root.style.height = Math.round(boxTop + boxLast + s - startC) + "px";
      /* the wrapper ends where the box lets go – from there its bottom edge
         pushes the header up (it leaves, it does not vanish) */
      if (headWrap) {
        headWrap.style.height = pinHead ? Math.round(headTop + headH - startC + s) + "px" : "";
      }
      return true;
    }

    function sizePin() {
      var folded = null;
      if (CX5.motionOn()) {
        if (on !== true) {
          /* a window in which nothing fits comes back here on every resize: the
             cards the reader folded in the static layout stay folded */
          if (fit && on === false) folded = items.map(function (it) { return it.hasAttribute("data-shut"); });
          on = true;
          root.setAttribute("data-casc", "on");
          items.forEach(function (it) { it.removeAttribute("data-shut"); });
          placeCards(true);
          cur = null;
        }
        if (layout()) { sizeWave(); return; }
      }
      if (on !== false) {
        on = false;
        toStatic();
        if (folded) {
          items.forEach(function (it, j) {
            if (!folded[j]) return;
            it.setAttribute("data-shut", "");
            btns[j].setAttribute("aria-expanded", "false");
            panels[j].inert = true;
          });
        }
      }
    }

    function update() {
      if (!CX5.motionOn() || !boxH) return;
      var s = span();
      var p = s > 0 ? (startTop() - root.getBoundingClientRect().top) / s : 0;
      if (p < 0) { paint(0); return; }        /* card 1 stays open before the pin */
      paint(Math.min(PHASES - 1, Math.floor(p * PHASES)));  /* the last one stays open */
    }

    /* --- events -------------------------------------------------------------
       A <button> fires click on Enter and Space too, so this is the keyboard
       path as well. Under the pin the scroll owns the state, so a click scrolls
       to the middle of that card's phase and the scroll opens it – the two can
       never disagree. Outside the pin it is a plain fold. */
    btns.forEach(function (b, i) {
      b.addEventListener("click", function () {
        if (CX5.motionOn() && boxH) {
          var trackTopDoc = root.getBoundingClientRect().top + window.scrollY;
          CX5.scrollTo(Math.round(trackTopDoc - startTop() + ((i + 0.5) / PHASES) * span()), "smooth");
          return;
        }
        var shut = items[i].hasAttribute("data-shut");
        if (shut) items[i].removeAttribute("data-shut");
        else items[i].setAttribute("data-shut", "");
        b.setAttribute("aria-expanded", shut ? "true" : "false");
        panels[i].inert = !shut;
      });
    });

    /* --- entrance ------------------------------------------------------------
       One shot, the first time the box shows up: the axis arrives before the
       cards (the order lives in the CSS delays). */
    function release() {
      if (entered) return;
      entered = true;
      root.classList.add("is-in");
    }
    if (!window.IntersectionObserver) {
      release();
    } else {
      var io = new window.IntersectionObserver(function (entries) {
        for (var k = 0; k < entries.length; k++) {
          if (!entries[k].isIntersecting) continue;
          release();
          io.disconnect();
          return;
        }
      }, { threshold: 0.15 });
      io.observe(box);
    }

    /* --- start ---------------------------------------------------------------
       The bus calls resize and scroll on DOMContentLoaded; running once here as
       well keeps the static state from flashing on a wide screen. */
    sizePin();
    update();
    CX5.register({ scroll: update, resize: sizePin });
    /* web fonts land after the first measurement and change the text height */
    if (doc.fonts && doc.fonts.ready && doc.fonts.ready.then) {
      doc.fonts.ready.then(function () { sizePin(); update(); });
    }
  });
})();
