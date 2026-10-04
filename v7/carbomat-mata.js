/* ===== carbomat-mata.js – warstwa strony (V7) ===============================
   Szyna CX5, warstwa wspólna i moduły klocków wzorca leżą w ce/*.js (ładowane
   wcześniej). Tutaj zostają wyłącznie moduły klocków unikalnych tej podstrony.
   Bez własnej definicji `window.CX5` i bez `CX5.start()` – szyna startuje sama
   na DOMContentLoaded. ==================================================== */
/* ===== 55 · Lightbox (spec §10, §23) =======================================
   One implementation, any number of instances and pages – ported from the
   maize page (`uprawa.js` §7) and renamed to `c5-lb__*`. Three boxes on this
   page: "Dowód" with three pages, a counter and previous / next, and two
   single-page boxes (`c5-lb--solo`) that carry the tables of "Co zastępujesz"
   and "Analiza podłoża". The page list comes from the DOM, so dropping or
   adding a page changes the counter by itself; a box without a footer simply
   has no counter and no steps.
   Without JS a box is a plain block in the flow of the page with all its
   pages one after another (the footer hidden) – that is the whole no-JS state.
   This module adds `is-js`, the dialog semantics (role / aria-modal /
   aria-label are set here, never in the markup, so the no-JS state stays a
   plain block) and the overlay behaviour: open from a trigger or from the
   hash, close with X / Escape / a click on the overlay, previous / next with
   a counter, a focus trap, focus back on the opener and a background scroll
   lock (html overflow + `CX5.lenis`).
   A page is named by `data-lightbox-page`; that name is the hash that opens
   it. The pages of "Dowód" carry the name as their own id, the pages of the
   single-page boxes are named after the table they hold, so the anchors
   #co-zastepujesz-tabela and #analiza-tabela keep working: with JS they open
   the dialog, without JS they lead to the table in the flow.
   The hash is written with `replaceState`, so stepping through the pages does
   not pile up history entries.
   (The four numbers of "Dowód" are CE-24 now – ce/CE-24-pas-liczb.js.) */
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
      prev: $("[data-lightbox-prev]", box),
      next: $("[data-lightbox-next]", box),
      count: $("[data-lightbox-count]", box),
      now: null
    };
    inst.ids.forEach(function (id) { byPage[id] = inst; });
    return inst;
  }).filter(function (e) { return e.ids.length; });
  if (!list.length) return;

  /* --- background: inert while the dialog is open ---------------------------
     A box stands somewhere inside <main>: as a direct child of its section
     ("Dowód") or deeper, inside the section's container (the two tables). So
     we climb from the box up to <main> and put to sleep the siblings met on
     every level, then the site chrome. The box and its ancestors stay awake –
     `inert` on an ancestor could not be undone further down. */
  function bgNodes(box) {
    var out = [], main = $("main");
    for (var node = box; node && node !== main && node.parentElement; node = node.parentElement) {
      var sibs = node.parentElement.children;
      for (var i = 0; i < sibs.length; i++) if (sibs[i] !== node) out.push(sibs[i]);
      if (node.parentElement === doc.body) break;      /* no <main> above the box */
    }
    return out.concat($$("cw-navbar, cw-footer, cw-dock, .c5-dots"));
  }
  function bgInert(box, on) { bgNodes(box).forEach(function (n) { n.inert = on; }); }

  function focusables(box) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', box)
      .filter(function (n) { return n.offsetWidth > 0 || n.offsetHeight > 0; });
  }

  /* --- background scroll lock ---------------------------------------------- */
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
    /* a page with a title of its own names the dialog; a page without one (a
       single table) leaves the name to the `aria-label` set at start */
    if (doc.getElementById(id + "-t")) inst.box.setAttribute("aria-labelledby", id + "-t");
    else inst.box.removeAttribute("aria-labelledby");
    if (inst.prev) inst.prev.disabled = i === 0;
    if (inst.next) inst.next.disabled = i === inst.ids.length - 1;
    if (inst.count) inst.count.textContent = (i + 1) + " / " + inst.ids.length;
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
    if (already) return;                 /* same dialog, only the page changed */
    live = inst; opener = who || null;
    inst.box.removeAttribute("aria-hidden");
    inst.box.inert = false;
    inst.box.setAttribute("data-open", "true");
    bgInert(inst.box, true);
    lock(true);
    var f = focusables(inst.box);
    (f[0] || inst.box).focus();
  }

  /* --- Escape and the focus trap (one listener for every instance) --------- */
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

    if (inst.prev) inst.prev.addEventListener("click", function () {
      var i = inst.ids.indexOf(inst.now);
      if (i > 0) show(inst, inst.ids[i - 1], true);
    });
    if (inst.next) inst.next.addEventListener("click", function () {
      var i = inst.ids.indexOf(inst.now);
      if (i >= 0 && i < inst.ids.length - 1) show(inst, inst.ids[i + 1], true);
    });
    inst.box.addEventListener("click", function (ev) {
      if (ev.target === inst.box) { close(); return; }   /* click beside the panel = overlay */
      var a = ev.target.closest ? ev.target.closest('a[href^="#"]') : null;
      if (!a || !inst.box.contains(a)) return;
      /* a link into the page underneath (e.g. „…sezon po sezonie”): close, then scroll there */
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
    b.setAttribute("aria-haspopup", "dialog");
    b.addEventListener("click", function (ev) {
      /* a trigger may be a link (without JS it leads to the block in the flow):
         a modified click keeps the browser's own behaviour */
      if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      ev.preventDefault();
      openPage(b.getAttribute("data-lightbox-open"), b);
    });
  });

  /* --- hash: #dowod-sggw, #analiza-tabela … opens that page, also on entry -- */
  /* Entry with the hash in the address: the browser jumped to the inline page
     before we hid it – park the page on the section that holds the box, so
     closing the dialog lands on the block that opens it. */
  function park(inst) {
    var host = (inst.box.closest && inst.box.closest("section")) || inst.box.parentElement;
    if (host) window.scrollTo(0, Math.round(host.getBoundingClientRect().top + window.scrollY));
  }
  var first = (location.hash || "").replace("#", "");
  if (byPage[first]) {
    park(byPage[first]);
    openPage(first, null);
  }
  window.addEventListener("hashchange", function () {
    var id = (location.hash || "").replace("#", "");
    if (byPage[id]) openPage(id, null);
  });
  /* page-specific: tell the shared bus that a lightbox hash is handled here
     (ce/00-base.js §3 – a module that returns true keeps the bus from scrolling
     to the element). Without it the bus would scroll to the page inside the
     fixed dialog and undo the parking above, so closing the dialog would land
     next to the block that opens it instead of on it.
     The bus routes the entry hash with `instant` twice – when it starts, right
     after every module has measured, and once more on load. Blocks above the
     box change their height at those moments (the card stack switches to its
     pinned layout), so the page is parked again each time. */
  if (CX5.onHash) CX5.onHash(function (hash, instant) {
    var id = (hash || "").replace("#", "");
    if (!byPage[id]) return false;
    openPage(id, null);
    if (instant) park(byPage[id]);
    return true;
  });
})();
