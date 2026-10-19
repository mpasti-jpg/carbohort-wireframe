/* ===== CE-30 · Lista z panelem opisu – wariant „akordeon-z-odliczaniem" =======
   (rejestr: ce-rejestr.js). Shared copy of the accordion of the product
   overview page (its own module stays in that page's script), for any number
   of accordions on one page. One DOM, two behaviours:

   · no JS (or before this script runs): every row open – the CSS default;
   · with JS: [data-c5-acc30="on"], one row open at a time, the first one at
     start. A click on a closed row opens it, a click on the open row closes it
     (then none is open). Enter and Space do the same – the titles are buttons;
     the arrows, Home and End move the focus between the titles.

   Countdown (only with CX5.motionOn(), so never below 900 px or with reduced
   motion): a CSS animation of `--c5-acc30-time` fills the bar on the top line
   of the NEXT row, then that row opens and the previous one closes; after the
   last row it comes back to the first. It runs only while the accordion is on
   screen (IntersectionObserver) and the tab is visible, and it holds – the bar
   stands still – while the pointer is over the open panel or the focus is
   inside the accordion. Any click or keyboard activation of a row title, and
   any arrival through an anchor, stops it until the page is reloaded. The
   countdown never moves the focus and never scrolls.
   `data-c5-acc30-auto="off"` on the root gives a plain accordion with no
   countdown at all.

   Anchors come through CX5.onHash: a hash that names a row – its <li>, its
   title or its panel, or anything inside them – opens that row, scrolls to it
   and stops the countdown. The landing is the row's top edge one gutter below
   the top of the window, the same place its `scroll-margin-top` gives the
   browser's own jump.

   No [data-c5-acc30] -> no-op. =============================================== */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;

  function gutter() {
    return parseFloat(window.getComputedStyle(doc.documentElement).getPropertyValue("--c5-gutter")) || 0;
  }

  function init(root) {
    var list = $(".c5-acc30__list", root);
    if (!list) return null;
    var items = $$(".c5-acc30__item", list).filter(function (it) { return it.parentNode === list; });
    var btns = items.map(function (it) { return $(".c5-acc30__btn", it); });
    var panels = items.map(function (it) { return $(".c5-acc30__panel", it); });
    var n = items.length;
    if (!n || btns.indexOf(null) !== -1 || panels.indexOf(null) !== -1) return null;   /* incomplete markup – the rows stay open */

    var cur = 0;              /* open row, -1 = none */
    var stopped = root.getAttribute("data-c5-acc30-auto") === "off";   /* true = no countdown, for good */
    var auto = false;         /* countdown allowed right now */
    var inView = false;       /* the accordion is on screen */
    var overPanel = false, focusIn = false;

    /* the countdown bar of every row – decoration, so it is not part of the markup contract */
    items.forEach(function (it) {
      if ($(".c5-acc30__timer", it)) return;
      var bar = doc.createElement("span");
      bar.className = "c5-acc30__timer";
      bar.setAttribute("aria-hidden", "true");
      it.insertBefore(bar, it.firstChild);
    });

    root.setAttribute("data-c5-acc30", "on");

    /* --- open / close ---------------------------------------------------------------
       `instant` skips the height animation (page start); `instantAbove` collapses the
       rows above the one being opened at once, so its final place is known before we
       scroll to it. The row title carries the same transition as the panel (size and
       the air above and below it), so a row painted at once must drop that transition
       too – otherwise the rows above keep shrinking after the landing was measured. */
    function paint(instant, instantAbove) {
      items.forEach(function (it, j) {
        var on = j === cur;
        var now = !!(instant || (instantAbove && j < cur));
        if (now) btns[j].style.transition = "none";
        btns[j].setAttribute("aria-expanded", on ? "true" : "false");
        if (on) it.setAttribute("data-open", ""); else it.removeAttribute("data-open");
        CX5.panelSet(panels[j], on, now);
        if (now) { void btns[j].offsetHeight; btns[j].style.transition = ""; }
      });
    }

    /* --- countdown ------------------------------------------------------------------ */
    function clearTimer() {
      items.forEach(function (it) { it.removeAttribute("data-timer"); });
    }
    function armTimer() {
      clearTimer();
      if (!auto || cur < 0 || n < 2 || !inView || doc.hidden) return;
      var next = items[(cur + 1) % n];
      void next.offsetWidth;                                     /* restart the CSS animation */
      next.setAttribute("data-timer", overPanel || focusIn ? "hold" : "run");
    }
    /* only the attribute VALUE changes, so the animation keeps its position and merely pauses */
    function syncHold() {
      var held = overPanel || focusIn;
      items.forEach(function (it) {
        if (it.hasAttribute("data-timer")) it.setAttribute("data-timer", held ? "hold" : "run");
      });
    }
    function stopAuto() {
      stopped = true;
      auto = false;
      clearTimer();
    }
    function syncAuto() {
      auto = !stopped && CX5.motionOn();
      if (auto) armTimer(); else clearTimer();
    }

    /* --- events --------------------------------------------------------------------- */
    btns.forEach(function (b, i) {
      b.addEventListener("click", function () {
        stopAuto();
        cur = i === cur ? -1 : i;
        paint(false, false);
      });
      /* arrows, Home and End walk the row titles; Tab keeps its usual order */
      b.addEventListener("keydown", function (e) {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
        var to = -1;
        if (e.key === "ArrowDown") to = Math.min(i + 1, n - 1);
        else if (e.key === "ArrowUp") to = Math.max(i - 1, 0);
        else if (e.key === "Home") to = 0;
        else if (e.key === "End") to = n - 1;
        if (to < 0) return;
        e.preventDefault();
        btns[to].focus();
      });
    });
    panels.forEach(function (p, j) {
      p.addEventListener("mouseenter", function () { if (j === cur) { overPanel = true; syncHold(); } });
      p.addEventListener("mouseleave", function () { overPanel = false; syncHold(); });
    });
    root.addEventListener("focusin", function () { focusIn = true; syncHold(); });
    root.addEventListener("focusout", function (e) {
      if (e.relatedTarget && root.contains(e.relatedTarget)) return;
      focusIn = false;
      syncHold();
    });
    /* the bar reached its end – open the row it was counting to */
    list.addEventListener("animationend", function (e) {
      if (e.animationName !== "c5-acc30-count" || !auto) return;
      var it = e.target && e.target.closest ? e.target.closest(".c5-acc30__item") : null;
      if (!it || !it.hasAttribute("data-timer") || items.indexOf(it) < 0) return;
      cur = items.indexOf(it);
      paint(false, false);
      armTimer();
    });
    doc.addEventListener("visibilitychange", function () {
      if (doc.hidden) clearTimer(); else armTimer();
    });
    if (window.IntersectionObserver) {
      var io = new window.IntersectionObserver(function (entries) {
        inView = entries[entries.length - 1].isIntersecting;
        if (inView) armTimer(); else clearTimer();
      }, { threshold: 0 });
      io.observe(root);
    } else {
      inView = true;
    }

    /* --- start ---------------------------------------------------------------------- */
    paint(true);
    syncAuto();
    if (CX5.wideMQ.addEventListener) {
      CX5.wideMQ.addEventListener("change", syncAuto);
      CX5.reducedMQ.addEventListener("change", syncAuto);
    } else if (CX5.wideMQ.addListener) {
      CX5.wideMQ.addListener(syncAuto);
      CX5.reducedMQ.addListener(syncAuto);
    }

    return {
      items: items,
      /* open a row from an anchor: scroll to it, stop the countdown */
      openAt: function (i, instant, focusTitle) {
        stopAuto();
        cur = i;
        paint(instant, true);
        CX5.scrollTo(items[i].getBoundingClientRect().top + window.scrollY - gutter(),
                     instant || CX5.reducedMQ.matches ? "auto" : "smooth");
        if (focusTitle) btns[i].focus({ preventScroll: true });   /* the next Tab continues from this row */
      }
    };
  }

  var accs = $$("[data-c5-acc30]").map(init).filter(function (a) { return !!a; });
  if (!accs.length) return;

  /* --- anchors: one listener for every accordion of the page ------------------------- */
  CX5.onHash(function (hash, instant) {
    if (!hash || hash.length < 2) return false;
    var el = null;
    try { el = doc.getElementById(decodeURIComponent(hash.slice(1))); } catch (err) { el = null; }
    var item = el && el.closest ? el.closest(".c5-acc30__item") : null;
    if (!item) return false;
    for (var k = 0; k < accs.length; k++) {
      var i = accs[k].items.indexOf(item);
      if (i < 0) continue;
      var a = doc.activeElement;
      accs[k].openAt(i, instant, !!(a && a.tagName === "A" && a.getAttribute("href") === hash));
      return true;
    }
    return false;
  });
})();


/* ===== CE-30 · wariant „akordeon-przewijany” (Produkty, R04 18.10.2026) ======
   Root: .c5pr-acc[data-acc-scroll] with .c5pr-acc__head and .c5pr-acc__stage >
   ol.c5pr-acc__list > li.c5pr-acc__item (button .c5pr-acc__btn, panel
   .c5pr-acc__panel). Classes of the Produkty accordion (CSS: block
   „akordeon-z-odliczaniem – implementacja Produktów” + „akordeon-przewijany”).

   · No JS: every row open (CSS default).
   · With JS: data-acc="on" – one row open at a time, the first at start.
     The root is bound after DOMContentLoaded, so the countdown module of
     produkty.js (it binds [data-acc] while the page loads) never sees it.
   · Scroll mode (CX5.motionOn() and a window of at least 640 px):
     data-acc-scroll="on". The root becomes a track: head + one pinned screen
     + one stretch per row (32 % of the window, at least 220 px). The scroll
     position picks the open row – down and up alike – and the list rides up
     inside the pinned stage (transform, CSS transition) so the open row
     stands right under the row before it. A row taller than the stage scrolls
     through its own stretch. A click (or Enter / Space) on a title opens that
     row by scrolling to the middle of its stretch; the focus landing on a
     title of another row does the same at once, so Tab never ends up behind
     the clipped stage.
   · Plain mode (below 900 px, reduced motion, a low window): a click opens a
     row and a click on the open one closes it.
   · #sciezka-NN (goal cards, mega-menu, typed hash) comes through CX5.onHash:
     scroll mode – the stretch of that row; plain mode – open it and land on it
     one gutter under the top of the window.
   Nothing here listens to `wheel`; the module only writes attributes, one
   custom property (--acc-y) and the inline height of the track. ======== */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var roots = $$("[data-acc-scroll]");
  if (!roots.length) return;

  var MIN_H = 640;          /* lower windows keep the plain accordion */
  var STEP_VH = 0.32, STEP_MIN = 220;

  function gutter() {
    return parseFloat(window.getComputedStyle(doc.documentElement).getPropertyValue("--c5-gutter")) || 0;
  }

  function init(root) {
    var stage = $(".c5pr-acc__stage", root);
    var head = $(".c5pr-acc__head", root);
    var list = $(".c5pr-acc__list", root);
    if (!stage || !list) return null;
    var items = $$(".c5pr-acc__item", list).filter(function (it) { return it.parentNode === list; });
    var btns = items.map(function (it) { return $(".c5pr-acc__btn", it); });
    var panels = items.map(function (it) { return $(".c5pr-acc__panel", it); });
    var n = items.length;
    if (!n || btns.indexOf(null) !== -1 || panels.indexOf(null) !== -1) return null;   /* rows stay open */

    var cur = 0, scroll = false, step = 0, stageH = 0, sTop = 0, pad = 0;
    var hcl = [];             /* closed height of every row, refreshed when the rows settle */
    var settle = 0;

    root.setAttribute("data-acc", "on");

    function paint(instant) {
      items.forEach(function (it, j) {
        var on = j === cur;
        if (instant) btns[j].style.transition = "none";
        btns[j].setAttribute("aria-expanded", on ? "true" : "false");
        if (on) it.setAttribute("data-open", ""); else it.removeAttribute("data-open");
        CX5.panelSet(panels[j], on, instant);
        if (instant) { void btns[j].offsetHeight; btns[j].style.transition = ""; }
      });
      /* the closed heights are read again once the rows have settled */
      window.clearTimeout(settle);
      settle = window.setTimeout(readClosed, instant ? 0 : 520);
    }

    function readClosed() {
      var known = [];
      items.forEach(function (it, j) {
        if (j !== cur) { hcl[j] = it.offsetHeight; known.push(hcl[j]); }
      });
      if (cur >= 0 && !hcl[cur]) {
        known.sort(function (a, b) { return a - b; });
        hcl[cur] = known.length ? known[Math.floor(known.length / 2)] : 89;
      }
      place();
    }

    /* rows above the open one: all but the one right before it leave the stage */
    function place() {
      if (!scroll) return;
      var k = Math.max(cur, 0), y = 0, j;
      for (j = 0; j < k - 1; j++) y -= hcl[j] || 0;
      /* a row taller than the stage scrolls through its own stretch */
      var u = progress() - k;
      var above = k > 0 ? (hcl[k - 1] || 0) : 0;
      var room = stageH - pad - above - pad;
      /* the open row's height once its panel has opened (estimated while it still moves:
         the closed title is ~22 px taller than the open one, the panel adds its inside) */
      var settled = panels[k].style.height === "auto";
      var inner = panels[k].firstElementChild;
      var openH = settled || !inner ? items[k].offsetHeight
        : (hcl[k] || 89) - 22 + inner.getBoundingClientRect().height;
      var tall = openH - room;
      if (tall > 0) y -= tall * clamp((u - 0.15) / 0.7, 0, 1);
      /* never leave the bottom of the stage empty (the last rows): the list ends one pad
         above the bottom edge at the latest */
      var listH = openH;
      for (j = 0; j < n; j++) if (j !== k) listH += hcl[j] || 0;
      y = Math.max(y, Math.min(0, stageH - pad - pad - listH));
      list.style.setProperty("--acc-y", Math.round(y) + "px");
    }

    function progress() {
      var r = root.getBoundingClientRect();
      var span = n * step;
      return span > 0 ? clamp(-(r.top + sTop) / span, 0, 1) * n : 0;
    }

    function update() {
      if (!scroll) return;
      var k = clamp(Math.floor(progress()), 0, n - 1);
      if (k !== cur) { cur = k; paint(false); }
      place();
    }

    function measure() {
      var want = CX5.motionOn() && window.innerHeight >= MIN_H;
      if (!want) {
        if (scroll) {
          scroll = false;
          root.setAttribute("data-acc-scroll", "off");
          root.style.height = "";
          list.style.removeProperty("--acc-y");
        } else {
          root.setAttribute("data-acc-scroll", "off");
        }
        return;
      }
      if (!scroll) {
        scroll = true;
        root.setAttribute("data-acc-scroll", "on");
        if (cur < 0) { cur = 0; paint(true); }
      }
      root.style.height = "";
      stageH = stage.offsetHeight;
      /* where the stage starts in the track: under the head and its margin (a sticky box
         reports its stuck place, so it is not measured directly) */
      sTop = 0;
      if (head) sTop = head.offsetHeight + (parseFloat(window.getComputedStyle(head).marginBottom) || 0);
      pad = parseFloat(window.getComputedStyle(stage).paddingTop) || 0;
      step = Math.max(STEP_MIN, Math.round(window.innerHeight * STEP_VH));
      root.style.height = Math.round(sTop + stageH + n * step) + "px";
      readClosed();
    }

    /* the scroll position of the middle of row i's stretch */
    function stretchTop(i) {
      return root.getBoundingClientRect().top + window.scrollY + sTop + step * (i + 0.5);
    }

    function openAt(i, instant, focusTitle) {
      if (scroll) {
        CX5.scrollTo(stretchTop(i), instant || CX5.reducedMQ.matches ? "auto" : "smooth");
      } else {
        cur = i;
        paint(instant);
        CX5.scrollTo(items[i].getBoundingClientRect().top + window.scrollY - gutter(),
                     instant || CX5.reducedMQ.matches ? "auto" : "smooth");
      }
      if (focusTitle) btns[i].focus({ preventScroll: true });
    }

    btns.forEach(function (b, i) {
      b.addEventListener("click", function () {
        if (scroll) { openAt(i, false, false); return; }
        cur = i === cur ? -1 : i;
        paint(false);
      });
      b.addEventListener("focus", function () {
        if (scroll && i !== cur) openAt(i, true, false);
      });
      /* arrows, Home and End walk the row titles; Tab keeps its usual order */
      b.addEventListener("keydown", function (e) {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
        var to = -1;
        if (e.key === "ArrowDown") to = Math.min(i + 1, n - 1);
        else if (e.key === "ArrowUp") to = Math.max(i - 1, 0);
        else if (e.key === "Home") to = 0;
        else if (e.key === "End") to = n - 1;
        if (to < 0) return;
        e.preventDefault();
        btns[to].focus();
      });
    });

    paint(true);
    CX5.register({ scroll: update, resize: measure });
    return { items: items, openAt: openAt };
  }

  function start() {
    var accs = roots.map(init).filter(function (a) { return !!a; });
    if (!accs.length) return;
    CX5.onHash(function (hash, instant) {
      if (!hash || hash.length < 2) return false;
      var el = null;
      try { el = doc.getElementById(decodeURIComponent(hash.slice(1))); } catch (err) { el = null; }
      var item = el && el.closest ? el.closest(".c5pr-acc__item") : null;
      if (!item) return false;
      for (var k = 0; k < accs.length; k++) {
        var i = accs[k].items.indexOf(item);
        if (i < 0) continue;
        var a = doc.activeElement;
        accs[k].openAt(i, instant, !!(a && a.tagName === "A" && a.getAttribute("href") === hash));
        return true;
      }
      return false;
    });
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", start);
  else start();
})();
