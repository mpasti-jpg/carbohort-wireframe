/* ===== O nas – moduły strony (spec: 40-strona-www/koncepcja/o-nas-spec.md)
   Loaded after cw.js, Lenis, ce/00-base.js and the CE-NN modules the page uses.
   The page does NOT define CX5 and never calls CX5.start() – the bus in
   ce/00-base.js starts itself; modules only register their scroll/resize work.

   Every module is a no-op when its markup is missing, and every animation is
   gated by CX5.motionOn() (>= 900 px, no prefers-reduced-motion). Nothing
   listens to `wheel` and nothing blocks scrolling.

   Modules ported from other pages, renamed to the `on-` prefix:
     · 10 kołowrotek cyfr      <- prochnica-plus.js 60 (pp-odo)
     · 40 lista wartości       <- produkty.js 50 (c5pr-paths)
     · 50 szuflada biogramu    <- prochnica-plus.js 55 (pp-disc)
     · 30 parallax kadru       <- carbomat-humic.js 40, część 2 (c5-who)
     · 70 mapa i lista krajów  <- new block (CE-56)
   ===================================================================== */

/* ===== 10 · W liczbach: kołowrotek cyfr (spec §4) ==========================
   The markup carries a plain number – the strips are built by the script, so
   without JS, with reduced motion and below 900 px the final value is there
   from the start. A digit strip has the target at the bottom and the way to it
   above (a full turn 0–9), and starts pushed up by its whole length: a 0 stands
   in the window. The animation brings it back to zero, i.e. the digits roll
   FROM TOP TO BOTTOM. Digits start 90 ms apart, one pass takes 1.1 s (CSS).
   The value stays in the text for screen readers (wf-sr-only). */
(function () {
  "use strict";
  var doc = document;
  var els = CX5.$$("[data-on-odo]");
  var IO = window.IntersectionObserver;
  if (!els.length || !IO) return;
  var armed = false;

  function build(el) {
    var value = (el.getAttribute("data-on-odo") || "").trim();
    if (!/^[0-9]+$/.test(value)) return null;
    var sr = doc.createElement("span");
    sr.className = "wf-sr-only";
    sr.textContent = value;
    var wrap = doc.createElement("span");
    wrap.className = "on-odo__wrap";
    wrap.setAttribute("aria-hidden", "true");
    var strips = [];
    for (var i = 0; i < value.length; i++) {
      var target = +value.charAt(i);
      var cell = doc.createElement("span");
      cell.className = "on-odo__d";
      var strip = doc.createElement("span");
      strip.className = "on-odo__strip";
      var len = target + 11;                 /* dojazd do celu + pełny obrót */
      for (var k = 0; k < len; k++) {
        var unit = doc.createElement("span");
        unit.textContent = String((target - k + 100) % 10);
        strip.appendChild(unit);
      }
      strip.style.setProperty("--on-i", String(len - 1));   /* w okienku stoi 0 */
      cell.appendChild(strip);
      wrap.appendChild(cell);
      strips.push(strip);
    }
    el.textContent = "";
    el.appendChild(sr);
    el.appendChild(wrap);
    return strips;
  }

  function roll(el) {
    var strips = build(el);
    if (!strips) return;
    /* forced reflow: without it the start position of the strip is never
       computed and the browser has nothing to animate from */
    void el.offsetHeight;
    el.classList.add("is-roll");
    strips.forEach(function (strip, i) {
      strip.style.transitionDelay = (i * 90) + "ms";
      strip.style.setProperty("--on-i", "0");
    });
  }

  function arm() {
    if (armed || !CX5.motionOn()) return;
    armed = true;
    var io = new IO(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        roll(e.target);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  CX5.register({ resize: arm });
})();

/* ===== 30 · Najstarsza nowość: parallax kadru (spec §6) ====================
   The photo layer is taller than its frame, so the shift never uncovers an
   edge. `--on-par` runs from -6 to 0 (per cent of the layer height) while the
   row travels through the window; without CX5.motionOn() the property is
   removed and the crop stands still (CSS). */
(function () {
  "use strict";
  var medias = CX5.$$("[data-on-who-media]");
  if (!medias.length) return;

  function parallax() {
    var on = CX5.motionOn(), h = window.innerHeight;
    medias.forEach(function (m) {
      if (!on) { m.style.removeProperty("--on-par"); return; }
      var r = m.getBoundingClientRect();
      var span = h + r.height;
      var p = span > 0 ? CX5.clamp((h - r.top) / span, 0, 1) : 0;
      m.style.setProperty("--on-par", CX5.lerp(-6, 0, p).toFixed(3));
    });
  }

  CX5.register({ scroll: parallax, resize: parallax });
})();

/* ===== 40 · Wartości: lista z panelem opisu (spec §7) ======================
   One DOM (rows: list button + panel with the value card), three layouts:
   · no JS, or before this module runs: four cards in a grid, list buttons
     hidden (CSS default);
   · >= 900 px – tabs (data-vals="tabs"): vertical tablist in column 1, every
     panel in one sticky cell of column 2. Hovering a button previews its value
     after 80 ms and the list falls back to the chosen one when the pointer
     leaves it; click / Enter / Space choose; ArrowUp/ArrowDown (wrapping) and
     Home/End choose and move focus (APG tabs, automatic activation; shortcuts
     with Alt/Ctrl/Meta pass through). Using a previewed description (a click in
     it, or focus moving into it) chooses that value;
   · < 900 px – accordion (data-vals="acc"): one panel open at a time, the first
     one open at start, a click on the open row closes it.
   Roles follow the layout and are swapped on CX5.wideMQ "change". #wartosc-NN
   (a typed hash, Back/Forward) chooses the value and scrolls through
   CX5.onHash: in tabs to the top of the list so the list and the sticky
   description start together, in the accordion to the row button. */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;
  var root = $("[data-vals]");
  var list = root ? $(".on-val__list", root) : null;
  if (!list) return;
  var rows = $$(".on-val__row", list);
  var tabs = rows.map(function (r) { return $(".on-val__tab", r); });
  var panels = rows.map(function (r) { return $(".on-val__panel", r); });
  var n = rows.length;
  if (!n || tabs.indexOf(null) !== -1 || panels.indexOf(null) !== -1) return;   /* incomplete markup – the cards stay */

  var hoverMQ = window.matchMedia("(hover: hover)");
  var VAL_HASH = /^#wartosc-(\d\d)$/;
  var mode = "";          /* "tabs" | "acc" */
  var cur = 0;            /* chosen value */
  var shown = 0;          /* tabs: value on display (the chosen one or a hover preview) */
  var accOpen = true;     /* accordion: the chosen row is open */
  var hoverTimer = 0;

  list.style.setProperty("--on-val-n", String(n));

  function gutter() {
    return parseFloat(window.getComputedStyle(doc.documentElement).getPropertyValue("--c5-gutter")) || 0;
  }
  function focusInPanels() {
    var a = doc.activeElement;
    return !!(a && a.closest && root.contains(a) && a.closest(".on-val__panel"));
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
  /* Where #wartosc-NN lands (px below the top edge). Tabs: the list top goes to
     the line where the description sticks, so both start together; accordion:
     the row button, one gutter down. */
  function landing(i) {
    if (mode === "tabs") return Math.max(gutter(), parseFloat(window.getComputedStyle(panels[i]).top) || 0);
    return gutter();
  }
  /* While the page loads, the browser keeps a fragment target in view and wins
     over any earlier script scroll – so the native jump to the panel must land
     exactly where CX5.onHash puts it. */
  function anchorMargins() {
    panels.forEach(function (p, j) {
      var m = mode === "tabs" ? landing(j) : p.getBoundingClientRect().top - tabs[j].getBoundingClientRect().top + gutter();
      p.style.scrollMarginTop = Math.round(m) + "px";
    });
  }
  /* tabs: a panel taller than the window sticks by its bottom edge (CSS min() reads --on-val-ph) */
  function measure() {
    if (mode === "tabs") panels.forEach(function (p) { p.style.setProperty("--on-val-ph", p.offsetHeight + "px"); });
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

  /* the reader chose value i (click, key or hash) */
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
    root.setAttribute("data-vals", next);
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
        p.style.removeProperty("--on-val-ph");
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
    var t = e.target && e.target.closest ? e.target.closest(".on-val__tab") : null;
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

  /* --- #wartosc-NN ------------------------------------------------------------------ */
  CX5.onHash(function (hash, instant) {
    var m = VAL_HASH.exec(hash || "");
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
    if (fromLink) tabs[i].focus({ preventScroll: true });   /* the next Tab continues from the chosen value */
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

/* ===== 50 · Ludzie: szuflada „czytaj dalej" (spec §8) ======================
   Ported from prochnica-plus.js 55 without changing the mechanics; the height
   is animated by CX5.panelSet. Without JS the whole bio is visible, because the
   drawer is only collapsed once the module has run. */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;
  $$("[data-on-disc]").forEach(function (btn) {
    var panel = doc.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    var open0 = btn.getAttribute("aria-expanded") === "true";
    panel.setAttribute("data-open", open0 ? "true" : "false");
    CX5.panelSet(panel, open0, true);
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.setAttribute("data-open", open ? "true" : "false");
      CX5.panelSet(panel, open);
      var lbl = $("[data-on-disc-label]", btn);
      var txt = btn.getAttribute(open ? "data-label-less" : "data-label-more");
      if (lbl && txt) lbl.textContent = txt;
    });
  });
})();

/* ===== 70 · Gdzie jesteśmy: mapa i lista krajów (spec §10, CE-56) ==========
   Pointing at a country row lights its pin and the other way round – the class
   `is-hot` on both ends, so the pair is readable in either direction. Keyboard
   parity: focus on a row lights the pin too. Nothing here depends on motion;
   the module only toggles a class, and without JS both halves simply stand next
   to each other. */
(function () {
  "use strict";
  var root = CX5.$("[data-on-map]");
  if (!root) return;
  var rows = CX5.$$("[data-on-row]", root);
  var pins = CX5.$$("[data-on-pin]", root);
  if (!rows.length || !pins.length) return;

  var byKey = {};
  pins.forEach(function (p) { byKey[p.getAttribute("data-on-pin")] = p; });

  function hot(key, on) {
    var pin = byKey[key];
    if (pin) pin.classList.toggle("is-hot", on);
    rows.forEach(function (r) {
      if (r.getAttribute("data-on-row") === key) r.classList.toggle("is-hot", on);
    });
  }

  rows.forEach(function (r) {
    var key = r.getAttribute("data-on-row");
    r.addEventListener("mouseenter", function () { hot(key, true); });
    r.addEventListener("mouseleave", function () { hot(key, false); });
    r.addEventListener("focus", function () { hot(key, true); });
    r.addEventListener("blur", function () { hot(key, false); });
  });
  pins.forEach(function (p) {
    var key = p.getAttribute("data-on-pin");
    p.addEventListener("mouseenter", function () { hot(key, true); });
    p.addEventListener("mouseleave", function () { hot(key, false); });
  });
})();
