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
   the only input. The track has N + 1 phases – one per card plus the closing
   beat that leaves all of them folded – and then the pin lets go. Its height
   is finite and computed here, so the reader is never held.

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
    var PHASES = N + 1;          /* N cards + the beat that closes the last one */

    /* the sheet keys its column rules on the number of cards */
    root.setAttribute("data-casc-n", String(N));
    /* one hairline per column boundary: N + 1 */
    var lines = $(".c5-casc__lines", root);
    if (lines) {
      while (lines.children.length < N + 1) lines.appendChild(doc.createElement("i"));
      while (lines.children.length > N + 1) lines.removeChild(lines.lastElementChild);
    }

    var cur = null;              /* open card, -1 = none                        */
    var on = null;               /* layout of the last resize: true = pin       */
    var entered = false;         /* the entrance has already been played        */
    var boxH = 0;                /* pinned box height (constant by design)      */
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
    function measure() {
      var max = 0;
      panels.forEach(function (p) {
        var inner = p.firstElementChild;
        var h = inner ? inner.getBoundingClientRect().height : 0;
        if (h > max) max = h;
      });
      panels.forEach(function (p) { p.style.transition = "none"; });
      root.style.setProperty("--c5-casc-h", Math.round(max) + "px");
      panels.forEach(function (p) { void p.offsetHeight; p.style.transition = ""; });
    }

    /* --- open / close ------------------------------------------------------
       `idx` of -1 is the closing beat: no card open. `instant` skips the height
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
    }

    /* --- the static layout -------------------------------------------------- */
    function toStatic() {
      root.setAttribute("data-casc", "off");
      root.removeAttribute("data-casc-level");
      root.removeAttribute("data-casc-fit-on");
      root.style.removeProperty("--c5-casc-heads");
      root.style.removeProperty("--c5-casc-headtop");
      box.style.removeProperty("--c5-casc-top");
      root.style.height = "";
      if (spacer) spacer.style.height = "";
      if (headWrap) headWrap.style.height = "";
      box.style.removeProperty("--c5-casc-box");
      box.style.removeProperty("--c5-casc-headroom");
      boxH = 0;
      cur = null;
      pinHead = true;
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
        /* the headers as they really stand: a title that wraps makes its card
           taller than the 70 px of the frame */
        var heads = 0;
        items.forEach(function (it, j) { heads += it.offsetHeight - panels[j].offsetHeight; });
        root.style.setProperty("--c5-casc-heads", Math.round(heads) + "px");
        paint(cur === null ? 0 : cur, true);
        pinHead = !!head && level < 2;
        headH = head ? head.offsetHeight : 0;
        boxH = box.offsetHeight;
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
       Track height = sticky top + box height + N+1 phases - start of the cycle,
       so the box lets go exactly at the end of the closing beat. Returns false
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
        /* constant: the list carries a min-height of the closed cards plus one
           open panel, so it does not matter which card is open while we measure */
        boxH = box.offsetHeight;
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
      root.style.height = Math.round(boxTop + boxH + s - startC) + "px";
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
          cur = null;
        }
        if (layout()) return;
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
      var i = Math.min(PHASES - 1, Math.floor(p * PHASES));
      paint(i >= N ? -1 : i);                 /* the last phase closes them all */
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
