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
   · With JS: data-acc="on" – EVERY row closed at start; a click (or Enter /
     Space) on a title opens that row and closes the one open before; a click
     on the open row closes it. The root is bound after DOMContentLoaded, so
     the countdown module of produkty.js (it binds [data-acc] while the page
     loads) never sees it.
   · 19.10.2026 (Mateusz): the scroll mode of R04 (pinned stage, the scroll
     opening the rows one after another) is retired – the scroll never opens
     anything. The module keeps data-acc-scroll="off" on the root.
   · #sciezka-NN (goal cards, mega-menu, typed hash) comes through CX5.onHash:
     open that row and land on it one gutter under the top of the window.
   Nothing here listens to `wheel` or `scroll`; the module only writes
   attributes. ============================================================ */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;
  var roots = $$("[data-acc-scroll]");
  if (!roots.length) return;

  function gutter() {
    return parseFloat(window.getComputedStyle(doc.documentElement).getPropertyValue("--c5-gutter")) || 0;
  }

  function init(root) {
    var list = $(".c5pr-acc__list", root);
    if (!list) return null;
    var items = $$(".c5pr-acc__item", list).filter(function (it) { return it.parentNode === list; });
    var btns = items.map(function (it) { return $(".c5pr-acc__btn", it); });
    var panels = items.map(function (it) { return $(".c5pr-acc__panel", it); });
    var n = items.length;
    if (!n || btns.indexOf(null) !== -1 || panels.indexOf(null) !== -1) return null;   /* rows stay open */

    var cur = -1;             /* every row closed at start (19.10.2026) */

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
    }

    function openAt(i, instant, focusTitle) {
      cur = i;
      paint(instant);
      CX5.scrollTo(items[i].getBoundingClientRect().top + window.scrollY - gutter(),
                   instant || CX5.reducedMQ.matches ? "auto" : "smooth");
      if (focusTitle) btns[i].focus({ preventScroll: true });
    }

    btns.forEach(function (b, i) {
      b.addEventListener("click", function () {
        cur = i === cur ? -1 : i;
        paint(false);
        if (cur >= 0) landOpen(cur);
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

    /* Mateusz 20.10.2026: after a click the opened row lands with its top edge 25 px
       under the top of the window. The row above may be closing at the same moment,
       which moves the opened row up, so we measure after the height transition has
       settled (reduced motion: nothing animates, so at once and without a glide). */
    var landToken = 0, LAND_TOP = 25;
    function landOpen(i) {
      var token = ++landToken;
      var go = function () {
        if (token !== landToken || cur !== i) return;
        CX5.scrollTo(items[i].getBoundingClientRect().top + window.scrollY - LAND_TOP,
                     CX5.reducedMQ.matches ? "auto" : "smooth");
      };
      if (CX5.reducedMQ.matches) go();
      else window.setTimeout(go, 280);
    }

    paint(true);
    root.setAttribute("data-acc-scroll", "off");
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
