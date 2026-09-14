/* ===== carbomat-mata.js – warstwa strony (V7) ===============================
   Szyna CX5, warstwa wspólna i moduły klocków wzorca leżą w ce/*.js (ładowane
   wcześniej). Tutaj zostają wyłącznie moduły klocków unikalnych tej podstrony.
   Bez własnej definicji `window.CX5` i bez `CX5.start()` – szyna startuje sama
   na DOMContentLoaded. ==================================================== */
/* ===== 55 · Dowód – liczby i lightbox (spec §10, §21.5) ====================
   Dwa niezależne moduły: wejście ciemnego pasa liczb i lightbox kart. ==== */

/* --- Liczby: jednorazowe wejście wierszy od dołu ---------------------------
   Sam ruch siedzi w CSS i jest zamknięty w zakresie motionOn() (≥ 900 px bez
   ograniczonego ruchu) – tutaj tylko wyzwalacz: `is-in` przy pierwszym
   pokazaniu pasa na ekranie. Poza tym zakresem (i bez IntersectionObserver)
   klasa leci od razu, bo i tak niczego nie zmienia, a wiersze mają być
   widoczne bez żadnego warunku. ------------------------------------------ */
(function () {
  "use strict";
  var band = CX5.$("[data-stats]");
  if (!band) return;
  if (!CX5.motionOn() || !("IntersectionObserver" in window)) { band.classList.add("is-in"); return; }
  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (!entries[i].isIntersecting) continue;
      band.classList.add("is-in");
      io.disconnect();
      return;
    }
  }, { threshold: 0.2 });
  io.observe(band);
})();

/* ===== 55 · Dowód – lightbox (spec §10) ====================================
   One implementation, any number of instances and pages – ported from the
   maize page (`uprawa.js` §7) and renamed to `c5-lb__*`. The page list comes
   from the DOM, so dropping or adding a page changes the counter by itself
   (iteration 2: three pages, "n / 3" – spec §21.5 pkt 5).
   Without JS the box is a plain block under the teaser cards with all the
   pages one after another (the footer hidden) – that is the whole no-JS state.
   This module adds `is-js`, the dialog semantics (role / aria-modal /
   aria-label are set here, never in the markup, so the no-JS state stays a
   plain block) and the overlay behaviour: open from a teaser button or from
   the hash, close with X / Escape / a click on the overlay, previous / next
   with a counter, a focus trap, focus back on the opener and a background
   scroll lock (html overflow + `CX5.lenis`).
   The hash is written with `replaceState`, so stepping through the pages does
   not pile up history entries. ============================================ */
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
     The box lives inside its own section, so besides the rest of <main> and
     the site chrome we also have to put that section's own content to sleep. */
  function bgNodes(box) {
    var host = box.parentElement;
    var out = $$("main > *").filter(function (n) { return n !== host && n !== box; });
    if (host) out = out.concat($$(":scope > *", host).filter(function (n) { return n !== box; }));
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
    inst.box.setAttribute("aria-labelledby", id + "-t");
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
    b.addEventListener("click", function (ev) {
      ev.preventDefault();
      openPage(b.getAttribute("data-lightbox-open"), b);
    });
  });

  /* --- hash: #dowod-sggw … opens that page, also on entry ------------------ */
  var first = (location.hash || "").replace("#", "");
  if (byPage[first]) {
    /* the browser jumped to the inline page before we hid it – park the page
       on the section, so closing the dialog lands on the teaser cards */
    var host = byPage[first].box.parentElement;
    if (host) window.scrollTo(0, Math.round(host.getBoundingClientRect().top + window.scrollY));
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
     next to the teaser cards instead of on them. */
  if (CX5.onHash) CX5.onHash(function (hash) {
    var id = (hash || "").replace("#", "");
    if (!byPage[id]) return false;
    openPage(id, null);
    return true;
  });
})();

/* ===== 60 · Przygotowanie – stos kart protokołu (spec §11) =================
   Sam stos jest czystym CSS-em (`position:sticky`, każda karta 16 px niżej).
   Ten moduł dokłada tylko wykończenie: dla każdej karty liczy `--c5-step-p`
   (0 → 1: w jakim stopniu przykrywa ją następna karta) i zapisuje je na
   elemencie – reszta dzieje się w CSS (`scale` karty, `brightness` zdjęcia).
   Wartość bierze się wyłącznie z pozycji przewijania, bez żadnych przejść
   czasowych, więc obraz zatrzymuje się razem z kółkiem myszy.
   Geometrię liczymy z układu (flow), nie z `getBoundingClientRect()` kart –
   karty są skalowane, więc ich prostokąty kłamią; prostokąt kontenera nie.
   Poniżej 900 px i przy `prefers-reduced-motion` moduł nie robi nic (CSS też
   nie przykleja kart). ==================================================== */
(function () {
  "use strict";
  var host = CX5.$("[data-steps]");
  if (!host) return;
  var cards = CX5.$$(".c5-step", host);
  if (cards.length < 2) return;
  var geo = null;

  function measure() {
    if (!CX5.motionOn()) {
      geo = null;
      cards.forEach(function (c) { c.style.removeProperty("--c5-step-p"); });
      return;
    }
    var gap = parseFloat(getComputedStyle(host).rowGap) || 0;
    var top = host.getBoundingClientRect().top + window.scrollY;   /* flow top of card 1 */
    var flow = [], hs = [], sticky = [], acc = 0;
    cards.forEach(function (c) {
      var h = c.offsetHeight;                                       /* layout height, transform-proof */
      flow.push(top + acc);
      hs.push(h);
      sticky.push(parseFloat(getComputedStyle(c).top) || 0);
      acc += h + gap;
    });
    geo = { flow: flow, h: hs, sticky: sticky };
  }

  function paint() {
    if (!geo) return;
    var y = window.scrollY;
    for (var i = 0; i < cards.length; i++) {
      var p = 0;
      if (i < cards.length - 1) {
        /* where both cards actually sit: flow position until they stick */
        var mine = Math.max(geo.flow[i] - y, geo.sticky[i]);
        var next = Math.max(geo.flow[i + 1] - y, geo.sticky[i + 1]);
        /* full cover = the next card reached its own stop, 16 px below ours */
        var span = geo.sticky[i] + geo.h[i] - geo.sticky[i + 1];
        if (span > 0) p = CX5.clamp((mine + geo.h[i] - next) / span, 0, 1);
      }
      cards[i].style.setProperty("--c5-step-p", p.toFixed(3));
    }
  }

  CX5.register({ resize: measure, scroll: paint });
})();

/* ===== 80 · Sezon: licznik sezonów sterowany scrollem (spec §21.7) =====
   The scroll position is the only input: the track is 100svh + 3 x 90svh tall,
   the stage inside it is sticky, and the progress through the track (0-1) is
   split into three stops. Nothing listens to `wheel`, nothing animates on a
   timer - one rAF-throttled read of the track's rectangle per frame.
     p 0-.33   stop 1: number "1", sleeve 1 filled
     p .33-.66 stop 2: 2 -> 3 -> 4 -> 5 in equal sub-steps (sleeves fill one by
               one), "5+" at the end of the segment
     p .66-1   stop 3: "5+" stays, the sleeve row dims, the CARBOMAT ECO bag
               rises in - the same raw material in its soil version
   Below 900 px, with reduced motion and without JS the section is static (CSS)
   and this module only clears the scene classes. ========================== */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var track = $("[data-yrs-track]");
  if (!track) return;
  var stage = $(".c5-yrs__stage", track);
  var num = $("[data-yrs-count]", track);
  var unit = $("[data-yrs-unit]", track);
  var row = $("[data-yrs-row]", track);
  var sleeves = $$("[data-yrs-sleeve]", track);
  var pack = $("[data-yrs-pack]", track);
  var stops = $$("[data-yrs-stop]", track);
  var panels = $$("[data-yrs-panel]", track);
  var segs = $$("[data-yrs-seg]", track);
  var fills = $$("[data-yrs-fill]", track);
  if (!stage || !num || panels.length !== 3) return;
  var STOPS = 3;
  var stageH = 0;
  var key = "";

  /* Polish plural of "sezon": 1 -> sezon, 2-4 -> sezony, 5 (and "5+") -> sezonów */
  function unitWord(n) { return n === 1 ? "sezon" : (n >= 2 && n <= 4 ? "sezony" : "sezonów"); }

  /* The whole choreography is a pure function of the progress through the track. */
  function stateFor(p) {
    if (p < 1 / STOPS) return { stop: 1, filled: 1, n: 1, label: "1" };
    if (p < 2 / STOPS) {
      var q = (p - 1 / STOPS) * STOPS;          /* 0-1 inside the second stop */
      var k = Math.min(4, Math.floor(q * 5));   /* five equal sub-steps */
      var n = Math.min(5, k + 2);               /* 2, 3, 4, 5, then 5+ */
      return { stop: 2, filled: n, n: n, label: k === 4 ? "5+" : String(n) };
    }
    return { stop: 3, filled: 5, n: 5, label: "5+" };
  }

  function apply(st) {
    var k = st.stop + "|" + st.label;
    if (k === key) return;
    key = k;
    num.textContent = st.label;                 /* the number jumps, it does not count */
    if (unit) unit.textContent = unitWord(st.n);
    sleeves.forEach(function (s, i) { s.classList.toggle("is-on", i < st.filled); });
    if (row) row.classList.toggle("is-dim", st.stop === 3);
    if (pack) pack.classList.toggle("is-on", st.stop === 3);
    stops.forEach(function (s) { s.classList.toggle("is-on", +s.getAttribute("data-yrs-stop") === st.stop); });
    panels.forEach(function (s) { s.classList.toggle("is-on", +s.getAttribute("data-yrs-panel") === st.stop); });
    segs.forEach(function (s) { s.setAttribute("aria-current", +s.getAttribute("data-yrs-seg") === st.stop ? "true" : "false"); });
  }

  function measure() {
    if (!CX5.motionOn()) {
      /* static layout: the counter and the bar are hidden, the blocks stand
         open by default - drop every class the scene might have left behind */
      stageH = 0;
      key = "";
      sleeves.forEach(function (s, i) { s.classList.toggle("is-on", i === 0); });
      if (row) row.classList.remove("is-dim");
      if (pack) pack.classList.remove("is-on");
      stops.forEach(function (s) { s.classList.remove("is-on"); });
      panels.forEach(function (s) { s.classList.remove("is-on"); });
      segs.forEach(function (s) { s.removeAttribute("aria-current"); });
      return;
    }
    /* the track height comes from CSS (100svh + 3 x 90svh); the stage is the
       sticky box that stands still while the counter runs inside it */
    stageH = stage.offsetHeight;
    key = "";
    update();
  }

  function span() { return track.getBoundingClientRect().height - stageH; }

  function update() {
    if (!stageH) return;
    var r = track.getBoundingClientRect();
    var s = r.height - stageH;
    var p = s > 0 ? clamp(-r.top / s, 0, 1) : 0;
    fills.forEach(function (f, i) {
      f.style.setProperty("--yrs-seg", clamp((p - i / STOPS) * STOPS, 0, 1).toFixed(4));
    });
    apply(stateFor(p));
  }

  /* Stop labels jump to the beginning of their segment of the track. */
  segs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var i = (+btn.getAttribute("data-yrs-seg") || 1) - 1;
      if (!stageH) {
        var g = $('[data-yrs-group="' + (i + 1) + '"]', track);
        if (g) CX5.scrollTo(g.getBoundingClientRect().top + window.scrollY - 24);
        return;
      }
      CX5.scrollTo(track.getBoundingClientRect().top + window.scrollY + (i / STOPS) * span() + 4);
    });
  });

  CX5.register({ scroll: update, resize: measure });
})();

/* ===== 80 · Ekonomia: pięć nagłówków z panelem opisu (spec §21.8) =====
   Desktop (>= 900 px): an automatic-activation tab list - hovering a heading
   (60 ms of patience), focusing it, clicking it or walking the list with the
   up/down arrows swaps the description in the right column. Below 900 px the
   same DOM works as an accordion on `CX5.panelSet`. The ARIA is written here,
   not in the markup, so a page without JS stays a plain list of headings with
   their descriptions open underneath. ==================================== */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$;
  var tco = $("[data-tco]");
  if (!tco) return;
  var heads = $$(".c5-tco__h", tco);
  var panels = $$(".c5-tco__p", tco);
  var items = $$(".c5-tco__item", tco);
  if (heads.length !== panels.length || !heads.length) return;
  var mode = null, cur = 0, hoverT = null;

  function tabsMode() { return CX5.wideMQ.matches; }

  function setTabs(i) {
    cur = i;
    heads.forEach(function (h, n) {
      h.setAttribute("aria-selected", n === i ? "true" : "false");
      h.setAttribute("tabindex", n === i ? "0" : "-1");
    });
    panels.forEach(function (p, n) { p.setAttribute("data-on", n === i ? "true" : "false"); });
  }

  function setAcc(i, instant) {
    cur = i;
    heads.forEach(function (h, n) { h.setAttribute("aria-expanded", n === i ? "true" : "false"); });
    panels.forEach(function (p, n) {
      p.setAttribute("data-on", n === i ? "true" : "false");
      CX5.panelSet(p, n === i, instant);
    });
  }

  function applyMode() {
    var tabs = tabsMode();
    var next = tabs ? "tabs" : "acc";
    if (mode === next) return;
    mode = next;
    if (cur < 0) cur = 0;
    if (tabs) {
      tco.setAttribute("role", "tablist");
      tco.setAttribute("aria-orientation", "vertical");
      /* the pair wrappers dissolve into the grid here, so they step out of the
         accessibility tree too and the tabs stay children of the tab list */
      items.forEach(function (it) { it.setAttribute("role", "presentation"); });
      heads.forEach(function (h, n) {
        h.setAttribute("role", "tab");
        h.setAttribute("aria-controls", panels[n].id);
        h.removeAttribute("aria-expanded");
      });
      panels.forEach(function (p, n) {
        p.setAttribute("role", "tabpanel");
        p.setAttribute("aria-labelledby", heads[n].id);
        /* drop whatever the accordion left inline - the grid takes over */
        p.style.height = "";
        p.inert = false;
      });
      setTabs(cur);
    } else {
      tco.removeAttribute("role");
      tco.removeAttribute("aria-orientation");
      items.forEach(function (it) { it.removeAttribute("role"); });
      heads.forEach(function (h, n) {
        h.removeAttribute("role");
        h.removeAttribute("aria-selected");
        h.removeAttribute("tabindex");
        h.setAttribute("aria-controls", panels[n].id);
      });
      panels.forEach(function (p, n) {
        p.setAttribute("role", "region");
        p.setAttribute("aria-labelledby", heads[n].id);
      });
      setAcc(cur, true);
    }
  }

  heads.forEach(function (h, n) {
    /* `mousemove`, not `mouseenter`: scrolling a heading under a parked cursor
       fires mouseenter too, and the list must not jump around while the reader
       scrolls past it - only an actual movement of the pointer counts. */
    h.addEventListener("mousemove", function () {
      if (!tabsMode() || cur === n) return;
      window.clearTimeout(hoverT);
      hoverT = window.setTimeout(function () { setTabs(n); }, 60);
    });
    h.addEventListener("mouseleave", function () { window.clearTimeout(hoverT); });
    h.addEventListener("focus", function () { if (tabsMode()) setTabs(n); });
    h.addEventListener("click", function () {
      if (tabsMode()) setTabs(n);
      else setAcc(cur === n ? -1 : n);
    });
    h.addEventListener("keydown", function (e) {
      if (!tabsMode()) return;
      var d = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var i = (n + d + heads.length) % heads.length;
      setTabs(i);
      heads[i].focus();
    });
  });

  CX5.register({ resize: applyMode });
})();


