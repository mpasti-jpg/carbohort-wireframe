/* ===== produkty.js – warstwa strony (V7) ====================================
   Szyna CX5, warstwa wspólna i moduły klocków wzorca leżą w ce/*.js (ładowane
   wcześniej). Tutaj zostają wyłącznie moduły klocków unikalnych tej podstrony.
   Bez własnej definicji `window.CX5` i bez `CX5.start()` – szyna startuje sama
   na DOMContentLoaded. ==================================================== */
/* ===== 30 · Gama – pokaz czterech rodzin (11.09.2026; decoupled from the table 14.09.2026) =====
   Pattern: version picker on rivian.com/r1s. A mechanism of this page only; every part is guarded.
   – ARIA tabs with automatic activation: click, arrows (wrapping), Home/End;
   – the marker of the active tab slides and changes size (also in the 2×2 grid on phones);
   – panel swap: the old panel slides away opposite to the direction of the choice, the new
     packshot comes in from that direction, the caption and the spec columns cascade in and the
     block height changes smoothly (content below does not jump);
   – swipe on the packshot = previous / next family (at the ends the packshot springs back);
   – deep links #gama-eco | #gama-mata | #gama-humic | #gama-carbohumic through CX5.onHash:
     select the family and scroll to the show (at start, after load, on Back/Forward);
   – „Porównaj" is an ordinary in-page link: the shared anchor handler (00-base.js) pushes
     #porownanie and scrolls through Lenis. This module only moves focus to the table container,
     so the next Tab starts in the table. No column highlight, no remembered family, no #gama-…
     history entry (spec §6.3) – the table's own „pokaż w tabeli" buttons live in module 40.
   Content is visible from the first frame (no reveal). With prefers-reduced-motion everything
   switches instantly. */
(function () {
  "use strict";
  var doc = document;
  doc.documentElement.classList.add("c5pr-js");
  var show = CX5.$("[data-gama]");
  if (!show) return;
  var $$ = CX5.$$;
  var seg = CX5.$(".c5pr-seg", show);
  var thumb = CX5.$(".c5pr-seg__thumb", show);
  var wrap = CX5.$(".c5pr-show__panels", show);
  var compare = CX5.$("[data-gama-compare]", show);
  var tabs = $$('[role="tab"]', show);
  var panels = tabs.map(function (t) { return doc.getElementById(t.getAttribute("aria-controls")); });
  if (!seg || !thumb || !wrap || tabs.length < 2 || panels.indexOf(null) !== -1) {
    doc.documentElement.classList.remove("c5pr-js");      /* incomplete markup – back to the layout without tabs */
    return;
  }
  var keys = tabs.map(function (t) { return t.getAttribute("data-key"); });
  var reducedMQ = CX5.reducedMQ;
  var EASE = "cubic-bezier(0.2, 0, 0, 1)";            /* = --w-ease from the kit */
  var EASE_IN = "cubic-bezier(0.4, 0, 1, 1)";
  function motion() { return typeof Element.prototype.animate === "function" && !reducedMQ.matches; }
  function anim(el, frames, o) {
    if (!el || !motion()) return null;
    o.id = "c5pr-gama";
    if (!o.easing) o.easing = EASE;
    if (!o.fill) o.fill = "backwards";
    return el.animate(frames, o);
  }
  var cur = 0;
  tabs.forEach(function (t, i) { if (t.getAttribute("aria-selected") === "true") cur = i; });

  /* --- marker of the active tab ------------------------------------------------ */
  function placeThumb(animate) {
    var t = tabs[cur];
    if (!animate) thumb.style.transition = "none";
    thumb.style.width = t.offsetWidth + "px";
    thumb.style.height = t.offsetHeight + "px";
    thumb.style.transform = "translate(" + t.offsetLeft + "px," + t.offsetTop + "px)";
    if (!animate) { void thumb.offsetWidth; thumb.style.transition = ""; }
    seg.setAttribute("data-ready", "");
  }

  /* --- panel animations -------------------------------------------------------- */
  function parts(p) {
    return {
      shot: p.querySelector(".c5pr-shot__img"),
      floor: p.querySelector(".c5pr-shot__floor"),
      cap: p.querySelector(".c5pr-fam__cap"),
      specs: $$(".c5pr-spec", p)
    };
  }
  function enter(p, dx, dy, delay) {
    var q = parts(p);
    anim(q.shot, [{ opacity: 0, transform: "translate(" + dx + "px," + dy + "px) scale(.965)" }, { opacity: 1, transform: "none" }], { duration: 680, delay: delay });
    anim(q.floor, [{ opacity: 0, transform: "translateX(-50%) scaleX(.5)" }, { opacity: 1, transform: "translateX(-50%) scaleX(1)" }], { duration: 680, delay: delay });
    anim(q.cap, [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 480, delay: delay + 120 });
    q.specs.forEach(function (s, k) {
      anim(s, [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], { duration: 480, delay: delay + 200 + k * 70 });
    });
  }
  function running(p) {
    if (!p.getAnimations) return false;
    return p.getAnimations({ subtree: true }).some(function (a) { return a.id === "c5pr-gama" && a.playState === "running"; });
  }
  function stopAll() {
    if (show.getAnimations) {
      show.getAnimations({ subtree: true }).forEach(function (a) { if (a.id === "c5pr-gama") a.cancel(); });
    }
    panels.forEach(function (p) { p.removeAttribute("data-leaving"); });
    wrap.style.overflowY = "";
  }

  /* --- selecting a family (touches only this section) --------------------------------- */
  function select(i, o) {
    o = o || {};
    var n = tabs.length;
    i = ((i % n) + n) % n;
    if (i === cur) return;
    var from = panels[cur];
    var to = panels[i];
    var dir = o.dir || (i > cur ? 1 : -1);
    /* Measure BEFORE interrupting the animation: on fast re-clicks the height starts from the
       current (animated) one, and a panel caught while entering disappears at once – no flash
       to full opacity and no jump of the content below. */
    var h0 = wrap.getBoundingClientRect().height;
    var busy = running(from);
    stopAll();
    tabs.forEach(function (t, j) {
      var on = j === i;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    cur = i;
    placeThumb(!o.instant);
    from.removeAttribute("data-on");
    from.inert = true;
    to.setAttribute("data-on", "");
    to.inert = false;
    if (o.instant || !motion()) return;
    if (!busy) from.setAttribute("data-leaving", "");
    var h1 = wrap.offsetHeight;
    wrap.style.overflowY = "clip";      /* vertical only – the leaving panel must not lose letters at the sides */
    if (!busy) {
      var leave = anim(from, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(" + (-40 * dir) + "px)" }], { duration: 260, easing: EASE_IN, fill: "forwards" });
      leave.onfinish = function () { from.removeAttribute("data-leaving"); leave.cancel(); };
    }
    var grow = anim(wrap, [{ height: h0 + "px" }, { height: h1 + "px" }], { duration: 520, fill: "none" });
    grow.onfinish = function () { wrap.style.overflowY = ""; };
    enter(to, 72 * dir, 0, 110);
  }

  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(i); });
  });
  seg.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;       /* browser shortcuts (Back/Forward) */
    var k = e.key;
    var i;
    var dir;
    if (k === "ArrowRight") { i = cur + 1; dir = 1; }
    else if (k === "ArrowLeft") { i = cur - 1; dir = -1; }
    else if (k === "Home") { i = 0; }
    else if (k === "End") { i = tabs.length - 1; }
    else return;
    e.preventDefault();
    select(i, { dir: dir });
    tabs[cur].focus();
  });

  /* --- swipe on the packshot ------------------------------------------------------- */
  var swipe = null;
  wrap.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" || !e.target.closest(".c5pr-stage")) return;
    swipe = { x: e.clientX, y: e.clientY, id: e.pointerId };
  });
  wrap.addEventListener("pointerup", function (e) {
    if (!swipe || e.pointerId !== swipe.id) return;
    var dx = e.clientX - swipe.x;
    var dy = e.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    var next = cur + (dx < 0 ? 1 : -1);
    if (next < 0 || next >= tabs.length) {
      anim(parts(panels[cur]).shot, [{ transform: "none" }, { transform: "translateX(" + (dx < 0 ? -18 : 18) + "px)" }, { transform: "none" }], { duration: 380, fill: "none" });
      return;
    }
    select(next);
  });
  wrap.addEventListener("pointercancel", function () { swipe = null; });

  /* --- „Porównaj": focus only ---------------------------------------------------------
     No preventDefault – the shared handler in 00-base.js pushes #porownanie and scrolls.
     This listener runs first (on the link, before the delegated document listener) and moves
     focus to the table container without scrolling; the shared handler then leaves focus alone,
     because it is no longer on the link. Modifier and middle clicks stay ordinary links. */
  var tableBox = doc.querySelector(".c5pr-tabwrap");
  if (compare && tableBox) {
    compare.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!doc.getElementById("porownanie")) return;
      tableBox.focus({ preventScroll: true });
    });
  }

  /* --- start ------------------------------------------------------------------------ */
  panels.forEach(function (p, i) {
    p.setAttribute("role", "tabpanel");
    p.setAttribute("aria-labelledby", tabs[i].id);
    p.tabIndex = 0;
    if (i === cur) p.setAttribute("data-on", ""); else p.removeAttribute("data-on");
    p.inert = i !== cur;
  });
  tabs.forEach(function (t, i) { t.tabIndex = i === cur ? 0 : -1; });
  placeThumb(false);
  if (window.ResizeObserver) new ResizeObserver(function () { placeThumb(false); }).observe(seg);
  else window.addEventListener("resize", function () { placeThumb(false); });
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { placeThumb(false); });

  /* --- deep link #gama-<family> -------------------------------------------------------
     The bus calls this at start (instant), once more after load (layout settled), on
     hashchange (Back/Forward) and after an in-page link click. Handled = selected + scrolled. */
  CX5.onHash(function (hash, instant) {
    var m = /^#gama-([a-z]+)$/.exec(hash || "");
    var i = m ? keys.indexOf(m[1]) : -1;
    if (i === -1) return false;
    select(i, { instant: instant });
    CX5.scrollTo(show.getBoundingClientRect().top + window.scrollY, instant || reducedMQ.matches ? "auto" : "smooth");
    return true;
  });
})();

/* ===== 40 · Porównanie: „pokaż w tabeli" (spec §7) =====
   Own content element since 14.09.2026 – no video, so the module only drives the three note
   cards under the table: data-cols = one or two column keys, aria-pressed on the button,
   .is-pick on <col> and <th>, a short flash of the header, on a narrow screen the table container
   scrolls sideways so the picked column(s) sit in the free part next to the pinned parameter
   column, then the page scrolls up to the table. A second click on the pressed button clears the
   highlight. The mechanism is local to this section – the Gama „Porównaj" link only scrolls here
   and moves focus to the table (spec §6.3). */
(function () {
  "use strict";
  var doc = document;
  var sec = CX5.$("[data-techsheet]");
  if (!sec) return;
  var table = CX5.$(".c5pr-tab", sec);
  var box = CX5.$(".c5pr-tabwrap", sec);
  var buttons = CX5.$$("[data-cols]", sec);
  if (!table || !box || !buttons.length) return;
  function motion() { return !CX5.reducedMQ.matches; }
  function token(name, fallback) {
    return window.getComputedStyle(doc.documentElement).getPropertyValue(name).trim() || fallback;
  }

  function markColumns(list, flash) {
    CX5.$$("[data-col]", table).forEach(function (el) {
      el.classList.toggle("is-pick", list.indexOf(el.getAttribute("data-col")) !== -1);
    });
    var heads = list.map(function (key) { return table.querySelector('thead th[data-col="' + key + '"]'); })
                    .filter(Boolean);
    if (!heads.length) return;
    /* narrow screen: centre the picked column(s) in the part of the container that the pinned
       parameter column leaves free (a pair wider than that starts at its first column) */
    if (box.scrollWidth > box.clientWidth) {
      var first = table.querySelector("thead th:first-child");
      var pinned = first && window.getComputedStyle(first).position === "sticky" ? first.offsetWidth : 0;
      var free = box.clientWidth - pinned;
      var l = Infinity, r = -Infinity;
      heads.forEach(function (th) { l = Math.min(l, th.offsetLeft); r = Math.max(r, th.offsetLeft + th.offsetWidth); });
      var left = r - l > free ? l - pinned : (l + r) / 2 - pinned - free / 2;
      left = CX5.clamp(left, 0, box.scrollWidth - box.clientWidth);
      if (box.scrollTo) box.scrollTo({ left: left, behavior: motion() ? "smooth" : "auto" });
      else box.scrollLeft = left;
    }
    if (flash && motion()) {
      var from = token("--w-gray-300", "#d4d4d4"), to = token("--w-gray-100", "#f5f5f5");
      heads.forEach(function (th) {
        if (th.animate) th.animate([{ backgroundColor: from }, { backgroundColor: to }], { duration: 1400, delay: 450, easing: "ease-out" });
      });
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var on = b.getAttribute("aria-pressed") === "true";
      buttons.forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
      if (on) { markColumns([], false); return; }          /* second click clears the highlight */
      b.setAttribute("aria-pressed", "true");
      markColumns(b.getAttribute("data-cols").split(/\s+/), true);
      /* the table sits above the cards: scroll up to it, 30 px above its top edge */
      var gutter = parseFloat(window.getComputedStyle(doc.documentElement).getPropertyValue("--c5-gutter")) || 0;
      CX5.scrollTo(box.getBoundingClientRect().top + window.scrollY - gutter, motion() ? "smooth" : "auto");
    });
  });
})();

/* ===== 50 · Wg potrzeby – paths as two columns (spec §8.2) ==================
   One DOM (rows: list button + panel with the path card), three layouts:
   · no JS, or before this module runs: ten cards in a grid, list buttons hidden (CSS default);
   · >= 900 px – tabs (data-paths="tabs"): vertical tablist in column 1, every panel in one
     sticky cell of column 2. Hovering a button previews its path after 80 ms and the list
     falls back to the chosen path when the pointer leaves it; click / Enter / Space choose;
     ArrowUp/ArrowDown (wrapping) and Home/End choose and move focus (APG tabs, automatic
     activation; shortcuts with Alt/Ctrl/Meta pass through). Using a previewed description
     (a click in it, or focus moving into it) chooses that path;
   · < 900 px – accordion (data-paths="acc"): one panel open at a time, the first one open at
     start, a click on the open row closes it.
   Roles follow the layout and are swapped on CX5.wideMQ "change". #sciezka-NN (goal links,
   a typed hash, Back/Forward) chooses the path and scrolls through CX5.onHash: in tabs to the
   top of the list so the list and the sticky description start together, in the accordion to
   the row button. The goal cards (§8.1) need no script: :target in CSS, reveal in module 72. */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;
  var root = $("[data-paths]");
  var list = root ? $(".c5pr-paths__list", root) : null;
  if (!list) return;
  var rows = $$(".c5pr-paths__row", list);
  var tabs = rows.map(function (r) { return $(".c5pr-paths__tab", r); });
  var panels = rows.map(function (r) { return $(".c5pr-paths__panel", r); });
  var n = rows.length;
  if (!n || tabs.indexOf(null) !== -1 || panels.indexOf(null) !== -1) return;   /* incomplete markup – the cards stay */

  var hoverMQ = window.matchMedia("(hover: hover)");
  var PATH_HASH = /^#sciezka-(\d\d)$/;
  var mode = "";          /* "tabs" | "acc" */
  var cur = 0;            /* chosen path */
  var shown = 0;          /* tabs: path on display (the chosen one or a hover preview) */
  var accOpen = true;     /* accordion: the chosen row is open */
  var hoverTimer = 0;

  list.style.setProperty("--c5pr-n", String(n));

  function gutter() {
    return parseFloat(window.getComputedStyle(doc.documentElement).getPropertyValue("--c5-gutter")) || 0;
  }
  function focusInPanels() {
    var a = doc.activeElement;
    return !!(a && a.closest && root.contains(a) && a.closest(".c5pr-paths__panel"));
  }

  /* --- tabs ------------------------------------------------------------------ */
  function setShown(i) {
    shown = i;
    panels.forEach(function (p, j) {
      var on = j === i;
      if (on) p.setAttribute("data-on", ""); else p.removeAttribute("data-on");
      p.inert = !on;      /* a fading panel leaves hit-testing and the tab order at once */
      tabs[j].classList.toggle("is-on", on);
    });
  }
  function choose(i) {
    window.clearTimeout(hoverTimer);
    cur = i;
    tabs.forEach(function (t, j) {
      t.setAttribute("aria-selected", j === i ? "true" : "false");
      t.tabIndex = j === i ? 0 : -1;
    });
    setShown(i);
  }
  /* Where #sciezka-NN lands (px below the top edge). Tabs: the list top goes to the line where
     the description sticks, so both start together; accordion: the row button, one gutter down. */
  function landing(i) {
    if (mode === "tabs") return Math.max(gutter(), parseFloat(window.getComputedStyle(panels[i]).top) || 0);
    return gutter();
  }
  /* While the page loads, the browser keeps a fragment target in view and wins over any earlier
     script scroll – so the native jump to the panel must land exactly where CX5.onHash puts it.
     Tabs: the panel's static top is the list top; accordion: the panel starts under its button. */
  function anchorMargins() {
    panels.forEach(function (p, j) {
      var m = mode === "tabs" ? landing(j) : p.getBoundingClientRect().top - tabs[j].getBoundingClientRect().top + gutter();
      p.style.scrollMarginTop = Math.round(m) + "px";
    });
  }
  /* tabs: a panel taller than the window sticks by its bottom edge (CSS min() reads --c5pr-ph) */
  function measure() {
    if (mode === "tabs") panels.forEach(function (p) { p.style.setProperty("--c5pr-ph", p.offsetHeight + "px"); });
    if (mode) anchorMargins();
  }

  /* --- accordion --------------------------------------------------------------- */
  function paintAcc(instant, instantAbove) {
    panels.forEach(function (p, j) {
      var on = accOpen && j === cur;
      tabs[j].setAttribute("aria-expanded", on ? "true" : "false");
      CX5.panelSet(p, on, !!(instant || (instantAbove && j < cur)));
    });
  }

  /* the reader chose path i (click, key or hash) */
  function commit(i, o) {
    o = o || {};
    i = ((i % n) + n) % n;
    if (mode === "tabs") { choose(i); return; }
    accOpen = o.toggle && i === cur ? !accOpen : true;      /* a click on the open row closes it */
    cur = i;
    paintAcc(o.instant, o.instantAbove);
  }

  /* --- layout switch: roles and state for tabs or accordion ----------------------- */
  function setMode(next) {
    if (next === mode) return;
    mode = next;
    window.clearTimeout(hoverTimer);
    var tabsMode = next === "tabs";
    root.setAttribute("data-paths", next);
    if (tabsMode) {
      list.setAttribute("role", "tablist");
      list.setAttribute("aria-orientation", "vertical");
    } else {
      list.removeAttribute("role");
      list.removeAttribute("aria-orientation");
    }
    rows.forEach(function (r) {
      if (tabsMode) r.setAttribute("role", "none"); else r.removeAttribute("role");
    });
    tabs.forEach(function (t, j) {
      t.setAttribute("aria-controls", panels[j].id);
      if (tabsMode) {
        t.setAttribute("role", "tab");
        t.removeAttribute("aria-expanded");
      } else {
        t.removeAttribute("role");
        t.removeAttribute("aria-selected");
        t.removeAttribute("tabindex");
        t.classList.remove("is-on");
      }
    });
    panels.forEach(function (p, j) {
      p.setAttribute("aria-labelledby", tabs[j].id);
      if (tabsMode) {
        p.setAttribute("role", "tabpanel");
        p.tabIndex = 0;
        p.style.transition = "";
        p.style.height = "";          /* drop the accordion's inline height */
      } else {
        p.setAttribute("role", "region");
        p.removeAttribute("tabindex");
        p.removeAttribute("data-on");
        p.style.removeProperty("--c5pr-ph");
      }
    });
    if (tabsMode) {
      choose(cur);
    } else {
      accOpen = true;
      paintAcc(true);
    }
    measure();
  }
  function sync() { setMode(CX5.wideMQ.matches ? "tabs" : "acc"); }

  /* --- events --------------------------------------------------------------------- */
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () {
      if (mode === "tabs") commit(i);
      else if (mode === "acc") commit(i, { toggle: true });
    });
    t.addEventListener("focus", function () {
      if (mode !== "tabs") return;
      window.clearTimeout(hoverTimer);
      setShown(i);
    });
    t.addEventListener("mouseenter", function () {
      if (mode !== "tabs" || !hoverMQ.matches || focusInPanels()) return;
      window.clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(function () { setShown(i); }, 80);   /* no flicker when the pointer crosses the list */
    });
    t.addEventListener("mouseleave", function () { window.clearTimeout(hoverTimer); });
  });
  list.addEventListener("mouseleave", function () {
    window.clearTimeout(hoverTimer);
    if (mode === "tabs" && shown !== cur) setShown(cur);
  });
  panels.forEach(function (p, j) {
    function take() { if (mode === "tabs" && j === shown && j !== cur) commit(j); }
    p.addEventListener("click", take);
    p.addEventListener("focusin", take);
  });
  list.addEventListener("keydown", function (e) {
    if (mode !== "tabs" || e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target && e.target.closest ? e.target.closest(".c5pr-paths__tab") : null;
    var i = tabs.indexOf(t);
    if (i === -1) return;             /* keys inside a description keep their native job */
    var next;
    if (e.key === "ArrowDown") next = i + 1;
    else if (e.key === "ArrowUp") next = i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    commit(next);
    tabs[cur].focus();
  });

  /* --- #sciezka-NN ------------------------------------------------------------------ */
  CX5.onHash(function (hash, instant) {
    var m = PATH_HASH.exec(hash || "");
    var i = m ? parseInt(m[1], 10) - 1 : -1;
    if (i < 0 || i >= n) return false;
    var a = doc.activeElement;
    var fromLink = !!(a && a.tagName === "A" && a.getAttribute("href") === hash);
    var top;
    if (mode === "tabs") {
      commit(i);
      top = list.getBoundingClientRect().top + window.scrollY - landing(i);
    } else {
      /* rows above close without animation, so the row's final place is known now */
      commit(i, { instant: instant, instantAbove: true });
      top = tabs[i].getBoundingClientRect().top + window.scrollY - landing(i);
    }
    CX5.scrollTo(top, instant || CX5.reducedMQ.matches ? "auto" : "smooth");
    if (fromLink) tabs[i].focus({ preventScroll: true });   /* the next Tab continues from the chosen path */
    return true;
  });

  /* --- start ------------------------------------------------------------------------ */
  sync();
  if (CX5.wideMQ.addEventListener) CX5.wideMQ.addEventListener("change", sync);
  else if (CX5.wideMQ.addListener) CX5.wideMQ.addListener(sync);
  CX5.register({ resize: measure });
  if (window.ResizeObserver) {
    var ro = new window.ResizeObserver(function () { if (mode === "tabs") measure(); });
    panels.forEach(function (p) { ro.observe(p); });
  }
})();


