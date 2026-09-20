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

  /* --- „Porównaj": opens the comparison overlay ----------------------------------------
     Until 19.09.2026 the link only scrolled to the section and moved focus to the table. Since
     20.09 (Mateusz's comment in the preview) the whole comparison lives in a lightbox, so the
     link carries `data-lightbox-open="porownanie"` and module 45 owns the click: it calls
     preventDefault, opens the dialog and puts focus inside it. Nothing to do here – the
     reference to the link stays only for the tab bar layout above. Without JS the href still
     leads to the block, which then stands in the flow of the page. */
  void compare;

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
      /* the table sits above the cards: come back up to it, 30 px above its top edge.
         Since 20.09.2026 the section lives inside the lightbox, so the panel is what
         scrolls – the page underneath is locked and must not move. Outside the overlay
         (no JS never gets here; a future inline use would) the page scrolls as before. */
      var gutter = parseFloat(window.getComputedStyle(doc.documentElement).getPropertyValue("--c5-gutter")) || 0;
      var pane = box.closest ? box.closest("[data-lightbox-scroll]") : null;
      if (pane) {
        var top = pane.scrollTop + box.getBoundingClientRect().top - pane.getBoundingClientRect().top - gutter;
        top = Math.max(0, top);
        if (pane.scrollTo) pane.scrollTo({ top: top, behavior: motion() ? "smooth" : "auto" });
        else pane.scrollTop = top;
        return;
      }
      CX5.scrollTo(box.getBoundingClientRect().top + window.scrollY - gutter, motion() ? "smooth" : "auto");
    });
  });
})();

/* ===== 45 · Lightbox porównania – CE-25 (20.09.2026) ==========================
   Ported from `carbomat-mata.js ===== 55` (itself a port of the maize lightbox), with the
   page list kept generic even though this page has exactly ONE page of content: the module
   costs nothing extra for it and a second page would work the day it is written.
   Differences against the source: no footer, so no counter and no previous / next; the box
   is a direct child of <main>, so the background list is simply the rest of <main> plus the
   site chrome; on entry through #porownanie the page is parked on the Gama section above,
   because that is where the block stands without JS and where closing the dialog should land.
   Without JS none of this runs and `.c5-lb` stays a plain block in the flow of the page.
   This module adds `is-js`, the dialog semantics (role / aria-modal / aria-label are set
   here, never in the markup) and the overlay behaviour: open from a trigger or from the hash,
   close with X / Escape / a click beside the panel, a focus trap, focus back on the opener and
   a background scroll lock (html overflow + `CX5.lenis`). ==================== */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;
  var boxes = $$("[data-lightbox]");
  if (!boxes.length) return;

  var byPage = {};          /* page id -> instance */
  var live = null;          /* instance currently open */
  var opener = null;        /* element that opened it */

  var list = boxes.map(function (box) {
    var pages = $$("[data-lightbox-page]", box);
    var inst = {
      box: box,
      pages: pages,
      ids: pages.map(function (p) { return p.getAttribute("data-lightbox-page"); }),
      scroll: $("[data-lightbox-scroll]", box),
      now: null
    };
    inst.ids.forEach(function (id) { byPage[id] = inst; });
    return inst;
  }).filter(function (e) { return e.ids.length; });
  if (!list.length) return;

  /* --- background: inert while the dialog is open --------------------------- */
  function bgNodes(box) {
    return $$("main > *").filter(function (n) { return n !== box; })
      .concat($$("cw-navbar, cw-footer, cw-dock, .c5-dots"));
  }
  function bgInert(box, on) { bgNodes(box).forEach(function (n) { n.inert = on; }); }

  function focusables(box) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', box)
      .filter(function (n) { return n.offsetWidth > 0 || n.offsetHeight > 0; });
  }

  /* --- background scroll lock ----------------------------------------------- */
  var locked = false, savedOverflow = "";
  function lock(on) {
    if (on === locked) return;
    locked = on;
    if (on) {
      savedOverflow = doc.documentElement.style.overflow;
      doc.documentElement.style.overflow = "hidden";
      if (CX5.lenis && CX5.lenis.stop) CX5.lenis.stop();
    } else {
      doc.documentElement.style.overflow = savedOverflow;
      if (CX5.lenis && CX5.lenis.start) CX5.lenis.start();
    }
  }

  /* `file://` refuses replaceState – the lightbox works, the address bar does not */
  function hashSet(v) {
    if (!window.history || !history.replaceState) return;
    try { history.replaceState(null, "", v || (location.pathname + location.search)); } catch (e) { /* ignored */ }
  }

  function show(inst, id, setHash) {
    var i = inst.ids.indexOf(id);
    if (i < 0) return;
    inst.now = id;
    inst.pages.forEach(function (p, j) { p.hidden = j !== i; });
    inst.box.setAttribute("aria-labelledby", id + "-t");
    if (inst.scroll) inst.scroll.scrollTop = 0;
    if (setHash !== false) hashSet("#" + id);
  }

  function close(returnFocus) {
    if (!live) return;
    var inst = live, who = opener;
    live = null; opener = null;
    inst.box.setAttribute("data-open", "false");
    inst.box.setAttribute("aria-hidden", "true");
    inst.box.inert = true;
    bgInert(inst.box, false);
    lock(false);
    hashSet(null);
    if (returnFocus !== false && who && who.focus) who.focus();
  }

  function openPage(id, who) {
    var inst = byPage[id];
    if (!inst) return;
    if (live && live !== inst) close(false);
    var already = live === inst;
    show(inst, id, true);
    if (already) return;
    live = inst; opener = who || null;
    inst.box.removeAttribute("aria-hidden");
    inst.box.inert = false;
    inst.box.setAttribute("data-open", "true");
    bgInert(inst.box, true);
    lock(true);
    var f = focusables(inst.box);
    (f[0] || inst.box).focus();
  }

  /* --- Escape and the focus trap -------------------------------------------- */
  doc.addEventListener("keydown", function (e) {
    if (!live) return;
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key !== "Tab") return;
    var f = focusables(live.box);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!live.box.contains(doc.activeElement)) { e.preventDefault(); first.focus(); }
  });

  list.forEach(function (inst) {
    inst.box.classList.add("is-js");
    inst.box.setAttribute("role", "dialog");
    inst.box.setAttribute("aria-modal", "true");
    var label = inst.box.getAttribute("data-lightbox");
    if (label) inst.box.setAttribute("aria-label", label);
    inst.box.tabIndex = -1;
    inst.box.setAttribute("data-open", "false");
    inst.box.setAttribute("aria-hidden", "true");
    inst.box.inert = true;
    /* Lenis swallows wheel events while it is stopped – the panel scrolls natively */
    if (inst.scroll) inst.scroll.setAttribute("data-lenis-prevent", "");
    show(inst, inst.ids[0], false);

    inst.box.addEventListener("click", function (ev) {
      if (ev.target === inst.box) { close(); return; }   /* click beside the panel = overlay */
      var a = ev.target.closest ? ev.target.closest('a[href^="#"]') : null;
      if (!a || !inst.box.contains(a)) return;
      /* a link into the page underneath („Certyfikaty…", „Nie wiem, którego potrzebuję",
         „Doglebowo czy nalistnie"): close first, then scroll there */
      ev.preventDefault();
      var target = doc.getElementById(a.getAttribute("href").slice(1));
      close(false);
      if (target) CX5.scrollTo(target.getBoundingClientRect().top + window.scrollY);
    });
  });

  $$("[data-lightbox-close]").forEach(function (b) {
    b.addEventListener("click", function () { close(); });
  });
  $$("[data-lightbox-open]").forEach(function (b) {
    b.addEventListener("click", function (ev) {
      if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      ev.preventDefault();
      openPage(b.getAttribute("data-lightbox-open"), b);
    });
  });

  /* --- hash: #porownanie opens the dialog, also on entry --------------------- */
  var first = (location.hash || "").replace("#", "");
  if (byPage[first]) {
    /* the browser jumped to the inline block before we hid it – park the page on the
       section above, so closing the dialog lands where the block stands without JS */
    var host = byPage[first].box.previousElementSibling;
    while (host && host.nodeName !== "SECTION") host = host.previousElementSibling;
    if (host) window.scrollTo(0, Math.round(host.getBoundingClientRect().top + window.scrollY));
    openPage(first, null);
  }
  window.addEventListener("hashchange", function () {
    var id = (location.hash || "").replace("#", "");
    if (byPage[id]) openPage(id, null);
  });
  /* tell the shared bus that this hash is handled here (ce/00-base.js §3): a module that
     returns true keeps the bus from scrolling to the element inside the fixed dialog */
  if (CX5.onHash) CX5.onHash(function (hash) {
    var id = (hash || "").replace("#", "");
    if (!byPage[id]) return false;
    openPage(id, null);
    return true;
  });
})();

/* ===== 50 · Wg potrzeby – paths as an accordion with a countdown (spec §21.2) =====
   Trial variant of CE-30 for Frame 207, on this page only. One DOM, two behaviours:
   · no JS (or before this module runs): all ten rows open – the CSS default;
   · with JS: `data-acc="on"`, one row open at a time, the first one at start. A click on a
     closed row opens it, a click on the open row closes it (then none is open).
   Countdown (only with CX5.motionOn(), so never below 900 px or with reduced motion): a 5 s
   CSS animation fills the bar on the top line of the NEXT row, then that row opens and the
   previous one closes; after the tenth it comes back to the first. It runs only while the
   accordion is on screen (IntersectionObserver) and the tab is visible, and holds (the bar
   stands still) while the pointer is over the open panel or the focus is inside the accordion.
   Any click or keyboard activation of any row button – and any arrival through #sciezka-NN –
   stops it until the page is reloaded. The countdown never moves the focus and never scrolls.
   #sciezka-NN (the goal index, a typed hash, Back/Forward) comes through CX5.onHash: open the
   row, scroll to it, stop the countdown. The anchor sits on the <li>, whose scroll-margin-top
   (CSS) matches the landing this module uses, so the browser's own jump lands in the same place.
   The goal cards (§8.1) need no script: :target in CSS, reveal in module 72. */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;
  var root = $("[data-acc]");
  var list = root ? $(".c5pr-acc__list", root) : null;
  if (!list) return;
  var items = $$(".c5pr-acc__item", list);
  var btns = items.map(function (it) { return $(".c5pr-acc__btn", it); });
  var panels = items.map(function (it) { return $(".c5pr-acc__panel", it); });
  var n = items.length;
  if (!n || btns.indexOf(null) !== -1 || panels.indexOf(null) !== -1) return;   /* incomplete markup – the rows stay open */

  var PATH_HASH = /^#sciezka-(\d\d)$/;
  var cur = 0;              /* open row, -1 = none */
  var stopped = false;      /* a click switched the countdown off for good */
  var auto = false;         /* countdown allowed right now */
  var inView = false;       /* the accordion is on screen */
  var overPanel = false, focusIn = false;

  root.setAttribute("data-acc", "on");

  function gutter() {
    return parseFloat(window.getComputedStyle(doc.documentElement).getPropertyValue("--c5-gutter")) || 0;
  }

  /* --- open / close ------------------------------------------------------------------ */
  /* `instant` skips the height animation (page start); `instantAbove` collapses the rows above
     the one being opened at once, so its final place is known before we scroll to it. The row
     title carries the same transition as the panel (size and the air above and below it), so a
     row painted at once must drop that transition too – otherwise the rows above keep shrinking
     after we have measured where to land and the anchor ends up ~90 px too high. */
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

  /* --- countdown --------------------------------------------------------------------- */
  function clearTimer() {
    items.forEach(function (it) { it.removeAttribute("data-timer"); });
  }
  function armTimer() {
    clearTimer();
    if (!auto || cur < 0 || !inView || doc.hidden) return;
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

  /* --- events ------------------------------------------------------------------------ */
  btns.forEach(function (b, i) {
    b.addEventListener("click", function () {
      stopAuto();
      cur = i === cur ? -1 : i;
      paint(false, false);
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
    if (e.animationName !== "c5pr-count" || !auto) return;
    var it = e.target && e.target.closest ? e.target.closest(".c5pr-acc__item") : null;
    if (!it || !it.hasAttribute("data-timer")) return;
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

  /* --- #sciezka-NN ------------------------------------------------------------------- */
  CX5.onHash(function (hash, instant) {
    var m = PATH_HASH.exec(hash || "");
    var i = m ? parseInt(m[1], 10) - 1 : -1;
    if (i < 0 || i >= n) return false;
    var a = doc.activeElement;
    var fromLink = !!(a && a.tagName === "A" && a.getAttribute("href") === hash);
    stopAuto();
    cur = i;
    paint(instant, true);
    CX5.scrollTo(items[i].getBoundingClientRect().top + window.scrollY - gutter(),
                 instant || CX5.reducedMQ.matches ? "auto" : "smooth");
    if (fromLink) btns[i].focus({ preventScroll: true });   /* the next Tab continues from this path */
    return true;
  });

  /* --- start ------------------------------------------------------------------------- */
  paint(true);
  syncAuto();
  if (CX5.wideMQ.addEventListener) {
    CX5.wideMQ.addEventListener("change", syncAuto);
    CX5.reducedMQ.addEventListener("change", syncAuto);
  } else if (CX5.wideMQ.addListener) {
    CX5.wideMQ.addListener(syncAuto);
    CX5.reducedMQ.addListener(syncAuto);
  }
})();


