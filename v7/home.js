/* ===== 00 baza ===========================================================
   home.js – the home page layer (V7), built from numbered blocks; block 00 is
   the shared base of the page, the following blocks belong to the sections.

   Contract for every block of this file:
   1. One IIFE per block, "use strict" inside, nothing leaking to window.
   2. A no-op when the markup is absent – read the DOM first, return early if
      the section is not there. The page must never throw on a half-built file.
   3. The bus CX5 (ce/00-base.js) starts itself on DOMContentLoaded. This file
      NEVER defines CX5 and never calls CX5.start(). It only uses the API:
      CX5.$ / $$ / register({scroll,resize}) / requestScroll / clamp / lerp /
      motionOn / wideMQ / reducedMQ / panelSet / scrollTo / onHash /
      routeHash / scrollToHash / reveal / lenis.
   4. Scroll-driven mechanics run only behind CX5.motionOn() (>= 900 px and no
      prefers-reduced-motion). Below that, and without JS, the page is complete:
      every panel in the flow, every number and bar at its final value.
   5. Scroll progress is not a ready-made helper – count it in the block's own
      `scroll` function from getBoundingClientRect(), as the pattern does.
   6. Comments in English, never the em dash, and never the literal
      end-of-script tag: it would close the block early in a bundle.

   This block itself stays empty on purpose. Anything shared by two sections
   belongs in the shared layer (ce/), not here. ========================== */
(function () {
  "use strict";
  /* Slot S: nothing shared to run yet. */
})();

/* ===== 10 hero =========================================================
   Appended to home.js in file-name order.
   Each block is one IIFE and a no-op when its markup is absent, so a page
   without this section never throws.

   Block 10a – hero: the A/B heading switch of the mock-up (swaps the H1 text
     with data-h1-b and nothing else, also reachable as ?h1=b), the word by
     word entrance of the H1 and the parallax of the frame.
   Block 10b – CE-71: places the native popover of the „Mam już produkt” cell
     under its tile. The popover itself needs no JS; this only moves it, and
     where the browser has no popover at all the list is an ordinary block
     under the band (ce/CE-71-pas-wejsc.css).

   The bus CX5 (ce/00-base.js) starts itself: this file never calls CX5.start()
   and never defines CX5. Scroll-driven mechanics run only behind
   CX5.motionOn(). Comments in English, never the em dash, and never the
   literal end-of-script tag (it would close the block early in a bundle).
   ===================================================================== */

/* --- 10a · hero: heading switch, word entrance, parallax ---------------- */
(function () {
  "use strict";
  var sec = document.getElementById("hero");
  if (!sec) return;
  var h1 = sec.querySelector("[data-h1]");
  var img = sec.querySelector("[data-hero-par]");
  var btns = [].slice.call(sec.querySelectorAll("[data-h1-var]"));
  var bus = window.CX5 || null;
  if (!h1) return;

  var TEXT = { a: h1.textContent.trim(), b: (h1.getAttribute("data-h1-b") || "").trim() };
  var cur = "a";

  function motion() { return !!bus && bus.motionOn(); }

  /* The words are spans inside the h1 and the spaces stay as text nodes, so the
     headline is still one readable string: nothing here is aria-hidden. */
  function write(text) {
    if (!motion()) {
      h1.classList.remove("is-split");
      h1.textContent = text;
      return;
    }
    while (h1.firstChild) h1.removeChild(h1.firstChild);
    var parts = text.split(/(\s+)/), n = 0;
    parts.forEach(function (p) {
      if (!p) return;
      if (/^\s+$/.test(p)) { h1.appendChild(document.createTextNode(p)); return; }
      var s = document.createElement("span");
      s.className = "c5h-word";
      s.style.setProperty("--i", n++);
      s.textContent = p;
      h1.appendChild(s);
    });
    /* fresh elements, so the entrance runs again on every switch */
    h1.classList.add("is-split");
  }

  function pick(which, replay) {
    if (!TEXT[which]) which = "a";
    if (which === cur && !replay) return;
    cur = which;
    write(TEXT[which]);
    btns.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-h1-var") === which ? "true" : "false");
    });
  }

  btns.forEach(function (b) {
    b.addEventListener("click", function () { pick(b.getAttribute("data-h1-var"), true); });
  });

  var want = /(?:^|[?&])h1=([ab])/i.exec(window.location.search);
  pick(want ? want[1].toLowerCase() : "a", true);

  /* Parallax: written into the independent `translate` property, so the scale
     animation of ce/CE-08-hero.css keeps `transform` for itself. */
  if (img && bus) {
    bus.register({
      scroll: function () {
        if (!motion()) { img.style.translate = ""; return; }
        var r = sec.getBoundingClientRect();
        var h = r.height || 1;
        var p = bus.clamp(-r.top / h, 0, 1);
        img.style.translate = "0px " + (p * 64).toFixed(1) + "px";
      }
    });
  }
})();

/* --- 10a2 · the hero gives the entry band exactly its own height --------
   The hero is one window minus the menu minus the band under it, so that the
   whole band stands above the fold. How tall the band is depends on the width:
   from about 1400 px every label keeps one line and the row is 112 px, below
   that the longer labels break and it grows. The stylesheet carries a fallback
   for each of those ranges; with JS the measured height replaces it, so the
   two always meet exactly. ---------------------------------------------- */
(function () {
  "use strict";
  var hero = document.getElementById("hero");
  var band = document.getElementById("sytuacje");
  if (!hero || !band || !window.matchMedia) return;
  var wide = window.matchMedia("(min-width: 900px)");

  function sync() {
    if (!wide.matches) { hero.style.removeProperty("--c5h-band"); return; }
    var h = Math.round(band.getBoundingClientRect().height);
    if (h > 40) hero.style.setProperty("--c5h-band", h + "px");
  }

  if (window.ResizeObserver) new window.ResizeObserver(sync).observe(band);
  if (wide.addEventListener) wide.addEventListener("change", sync);
  window.addEventListener("resize", sync);
  sync();
})();

/* --- 10b · CE-71: the popover of the „Mam już produkt” cell ------------- */
(function () {
  "use strict";
  var pop = document.getElementById("c5-en-produkty");
  if (!pop) return;
  var btn = document.querySelector("[popovertarget='c5-en-produkty']");
  var bus = window.CX5 || null;
  /* No popover in this browser: the list already stands under the band as an
     ordinary block (CSS @supports), so there is nothing to place. */
  if (!btn || !("popover" in HTMLElement.prototype)) return;

  var GAP = 8, EDGE = 12;

  function open() {
    return typeof pop.matches === "function" && pop.matches(":popover-open");
  }

  function place() {
    if (!open()) return;
    var r = btn.getBoundingClientRect();
    var w = pop.offsetWidth, h = pop.offsetHeight;
    var left = r.left;
    if (left + w > window.innerWidth - EDGE) left = window.innerWidth - EDGE - w;
    if (left < EDGE) left = EDGE;
    var top = r.bottom + GAP;
    if (top + h > window.innerHeight - EDGE) top = Math.max(EDGE, r.top - GAP - h);
    pop.style.left = Math.round(left) + "px";
    pop.style.top = Math.round(top) + "px";
  }

  pop.addEventListener("toggle", function (e) {
    if (e.newState === "open") place();
  });
  if (bus) bus.register({ scroll: place, resize: place });
  else window.addEventListener("resize", place);
})();

/* ===== 30 asystent =========================================================
   Part of home.js.
   Each block is one IIFE and a no-op when its markup is absent, so a page
   without this section never throws.

   The three question chips of the CE-23 band: a chip opens the advisor dock
     and writes its question into [data-jurek-input]. It sends nothing.

   The bus CX5 (ce/00-base.js) starts itself: this file never calls CX5.start()
   and never defines CX5. Scroll-driven mechanics run only behind
   CX5.motionOn(). Comments in English, never the em dash, and never the
   literal end-of-script tag (it would close the block early in a bundle).
   ===================================================================== */
(function () {
  "use strict";
  var doc = document;
  var chips = CX5.$$("[data-c5h-ask]");
  if (!chips.length) return;

  /* cw.js owns the dock: it listens on every [data-jurek-open], opens the
     panel and puts focus in the field. Clicking the first such control is
     therefore the whole opening mechanism; the fallback below only matters if
     the page ever ships without one. */
  function openDock() {
    var opener = doc.querySelector("[data-jurek-open]");
    if (opener) { opener.click(); return; }
    var dock = doc.querySelector("[data-jurek-dock]");
    if (dock) dock.setAttribute("data-open", "true");
  }

  function ask(question) {
    openDock();
    var dock = doc.querySelector("[data-jurek-dock]");
    var input = dock ? dock.querySelector("[data-jurek-input]") : doc.querySelector("[data-jurek-input]");
    if (!input) return;
    input.value = question;
    input.focus();
    /* caret at the end, so the reader can go on typing */
    try { input.setSelectionRange(question.length, question.length); } catch (err) {}
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      ask((chip.getAttribute("data-c5h-ask") || chip.textContent || "").trim());
    });
  });
})();

/* ===== 40 dowod =========================================================
   Part of home.js.
   Each block is one IIFE and a no-op when its markup is absent, so a page
   without this section never throws.

   The counters of the number band and the growth of the retention bars, both
     fired once the block first enters the viewport. Final values are already
     in the HTML, so without JS the section reads correctly.

   The bus CX5 (ce/00-base.js) starts itself: this file never calls CX5.start()
   and never defines CX5. Scroll-driven mechanics run only behind
   CX5.motionOn(). Comments in English, never the em dash, and never the
   literal end-of-script tag (it would close the block early in a bundle).
   ===================================================================== */

/* The digit reel of the number band. Mechanics ported from o-firmie.js 10
   (CE-24 „kolowrotek”): the markup carries a plain number and the script turns
   each digit into a window with a strip of values, the target at the bottom
   and a full turn above it. The strip starts pushed up by its whole length, so
   a 0 stands in the window; the animation brings it back to zero, which reads
   as digits rolling from top to bottom. The value stays readable for screen
   readers (wf-sr-only). Without JS, with reduced motion and below 900 px the
   final value simply stands in the markup and nothing here runs.
   The growth of the retention bars is pure CSS (block 40.2 of home.css), gated
   by the same [data-reveal] the rest of the page uses. */
(function () {
  "use strict";
  var doc = document;
  var els = CX5.$$("[data-c5h-odo]");
  var IO = window.IntersectionObserver;
  if (!els.length || !IO) return;
  var armed = false;

  function build(el) {
    var value = (el.getAttribute("data-c5h-odo") || "").trim();
    if (!/^[0-9]+$/.test(value)) return null;
    var sr = doc.createElement("span");
    sr.className = "wf-sr-only";
    sr.textContent = value;
    var wrap = doc.createElement("span");
    wrap.className = "c5h-odo__wrap";
    wrap.setAttribute("aria-hidden", "true");
    var strips = [];
    for (var i = 0; i < value.length; i++) {
      var target = +value.charAt(i);
      var cell = doc.createElement("span");
      cell.className = "c5h-odo__d";
      var strip = doc.createElement("span");
      strip.className = "c5h-odo__strip";
      var len = target + 11;                 /* the run up to the target plus one full turn */
      for (var k = 0; k < len; k++) {
        var unit = doc.createElement("span");
        unit.textContent = String((target - k + 100) % 10);
        strip.appendChild(unit);
      }
      strip.style.setProperty("--c5h-i", String(len - 1));   /* a 0 stands in the window */
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
      strip.style.setProperty("--c5h-delay", (i * 90) + "ms");
      strip.style.setProperty("--c5h-i", "0");
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

/* ===== 60 uprawy =========================================================
   Each block is one IIFE and a no-op when its markup is absent, so a page
   without this section never throws.

   The crop list: click, focus and arrow keys pick a row, the frame panel
     wipes between pictures. Hover only previews where (hover:hover) holds and
     never as the only way in. Below 900 px it is an accordion.

   The bus CX5 (ce/00-base.js) starts itself: this file never calls CX5.start()
   and never defines CX5. Scroll-driven mechanics run only behind
   CX5.motionOn(). Comments in English, never the em dash, and never the
   literal end-of-script tag (it would close the block early in a bundle).
   ===================================================================== */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;

  var root = $("[data-crops]");
  if (!root) return;
  var list = $(".c5h-crops__list", root);
  var stage = $(".c5h-crops__stage", root);
  var rows = $$(".c5h-crops__row", root);
  if (!list || !rows.length) return;
  var tabs = rows.map(function (r) { return $(".c5h-crops__tab", r); });
  var panels = rows.map(function (r) { return $(".c5h-crops__panel", r); });
  var figs = $$(".c5h-crops__fig", root);
  var n = rows.length;
  if (tabs.indexOf(null) !== -1 || panels.indexOf(null) !== -1) return;  /* incomplete markup: the CSS keeps every row open */

  var hoverMQ = window.matchMedia("(hover: hover)");
  var CROP_HASH = /^#(uprawy-[a-z]+)$/;
  var cur = 0;        /* the chosen group */
  var shown = 0;      /* the group in the frame: the chosen one or a preview */
  var timer = 0;

  /* --- the frame ----------------------------------------------------------- */
  /* One picture is on top with `data-on` (it wipes in), the one it replaced
     keeps `data-prev` and stands still underneath, so the wipe never uncovers
     the empty stage. Everything else is hidden. */
  function show(i) {
    if (i === shown || !figs[i]) return;
    var old = figs[shown];
    figs.forEach(function (f) { f.removeAttribute("data-prev"); });
    if (old && old !== figs[i]) {
      old.removeAttribute("data-on");
      old.setAttribute("data-prev", "");
    }
    figs[i].setAttribute("data-on", "");
    shown = i;
  }

  /* --- the open row -------------------------------------------------------- */
  /* Exactly one group is open at a time (spec §5.7), so a click picks and never
     closes: the frame always illustrates something. `inert` keeps the links of
     a folded row out of the tab order while its height animates to zero. */
  function open(i) {
    i = ((i % n) + n) % n;
    rows.forEach(function (r, j) {
      var on = j === i;
      if (on) r.setAttribute("data-open", ""); else r.removeAttribute("data-open");
      tabs[j].setAttribute("aria-expanded", on ? "true" : "false");
      panels[j].inert = !on;
    });
    cur = i;
    show(i);
  }

  /* Where a #uprawy-NAZWA link lands: on the wide layout the row goes to the
     line where the frame sticks, so the two start together; below that one
     gutter under the top edge. */
  function landing() {
    if (stage && CX5.wideMQ.matches) {
      var t = parseFloat(window.getComputedStyle(stage).top);
      if (isFinite(t)) return t;
    }
    return 20;
  }
  /* The browser keeps a fragment target in view while the page loads and wins
     over an earlier script scroll, so the native jump has to land where the
     module puts it. */
  function measure() {
    var m = Math.round(landing()) + "px";
    rows.forEach(function (r) { r.style.scrollMarginTop = m; });
  }

  /* --- events -------------------------------------------------------------- */
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { if (i !== cur) open(i); });
    /* hover previews the picture without opening the row, and only where a
       pointer really hovers; the delay keeps the frame from flickering while
       the pointer crosses the list */
    t.addEventListener("mouseenter", function () {
      if (!hoverMQ.matches || !CX5.wideMQ.matches) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () { show(i); }, 80);
    });
    t.addEventListener("mouseleave", function () { window.clearTimeout(timer); });
    /* the keyboard gets the same preview as the pointer: arrows move focus
       through the titles and the frame follows */
    t.addEventListener("focus", function () {
      if (!CX5.wideMQ.matches) return;
      window.clearTimeout(timer);
      show(i);
    });
  });
  list.addEventListener("mouseleave", function () {
    window.clearTimeout(timer);
    if (shown !== cur) show(cur);
  });
  list.addEventListener("focusout", function (e) {
    if (e.relatedTarget && list.contains(e.relatedTarget)) return;
    if (shown !== cur) show(cur);
  });

  /* APG accordion keys: Up/Down wrap through the row buttons, Home/End jump to
     the ends. They move focus only – Enter and Space open, as on any button. */
  list.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target && e.target.closest ? e.target.closest(".c5h-crops__tab") : null;
    var i = tabs.indexOf(t);
    if (i === -1) return;
    var next;
    if (e.key === "ArrowDown") next = (i + 1) % n;
    else if (e.key === "ArrowUp") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    tabs[next].focus();
  });

  /* --- #uprawy-sad, #uprawy-jagodowe … ------------------------------------- */
  CX5.onHash(function (hash, instant) {
    var m = CROP_HASH.exec(hash || "");
    if (!m) return false;
    var i = -1;
    rows.forEach(function (r, j) { if (r.id === m[1]) i = j; });
    if (i === -1) return false;
    var a = doc.activeElement;
    var fromLink = !!(a && a.tagName === "A" && a.getAttribute("href") === hash);
    open(i);
    CX5.scrollTo(rows[i].getBoundingClientRect().top + window.scrollY - landing(),
      instant || CX5.reducedMQ.matches ? "auto" : "smooth");
    if (fromLink) tabs[i].focus({ preventScroll: true });
    return true;
  });

  CX5.register({ resize: measure });
  open(0);
  measure();
})();

/* ===== 90 o nas =========================================================
   The film card of section 10: opens a dialog with <video preload="none"> on
   demand only, pauses and rewinds on close, returns the focus to the card.

   One IIFE, a no-op without its markup. The bus CX5 (ce/00-base.js) starts
   itself; this block never defines CX5 and never calls CX5.start(). Comments
   in English, never the em dash, and never the literal end-of-script tag.
   ===================================================================== */

(function () {
  "use strict";
  var card = CX5.$("[data-film-open]");
  var dlg = CX5.$("[data-film-dialog]");
  var video = CX5.$("[data-film-video]");
  /* Without <dialog> support (or without the markup) the card stays what it is
     in the HTML: an ordinary link to the file. */
  if (!card || !dlg || !video || typeof dlg.showModal !== "function") return;

  function open(e) {
    e.preventDefault();
    dlg.showModal();
    /* preload="none" means the first byte is asked for here and nowhere
       earlier. A rejected promise (autoplay policy, no codec) is not an error
       worth throwing: the controls are there and the viewer can press play. */
    var p = video.play();
    if (p && typeof p.catch === "function") p.catch(function () {});
    if (CX5.lenis) CX5.lenis.stop();
  }

  /* Every way out of the dialog ends in the `close` event: the x button,
     Escape (the browser fires cancel, then close) and the backdrop below. */
  function closed() {
    video.pause();
    try { video.currentTime = 0; } catch (err) { /* not seekable yet */ }
    if (CX5.lenis) CX5.lenis.start();
    card.focus();
  }

  /* A click lands on the dialog itself only when it misses the panel, which is
     the backdrop; comparing against the panel rectangle keeps a click on the
     video controls from closing the overlay. */
  function backdrop(e) {
    if (e.target !== dlg) return;
    var r = dlg.getBoundingClientRect();
    var out = e.clientX < r.left || e.clientX > r.right ||
              e.clientY < r.top || e.clientY > r.bottom;
    if (out) dlg.close();
  }

  card.addEventListener("click", open);
  dlg.addEventListener("close", closed);
  dlg.addEventListener("click", backdrop);
  var x = CX5.$("[data-film-close]", dlg);
  if (x) x.addEventListener("click", function () { dlg.close(); });
})();

/* ===== 96 motto =========================================================
   The quote of section 13: words brighten one after another with the scroll
   position of the section (CX5.register plus CSS custom properties). Off at
   reduced motion and below 900 px.

   One IIFE, a no-op without its markup. The bus CX5 (ce/00-base.js) starts
   itself; this block never defines CX5 and never calls CX5.start(). Comments
   in English, never the em dash, and never the literal end-of-script tag.
   ===================================================================== */

(function () {
  "use strict";
  var quote = CX5.$("[data-motto]");
  var line = CX5.$("[data-motto-text]");
  if (!quote || !line) return;

  /* Split into words, keeping the spaces as text nodes between the spans: a
     screen reader then still reads one sentence, not a column of words. The
     index rides on the span and the word count on the paragraph, so the ramp
     itself is one CSS expression and the loop below writes a single value. */
  var tokens = line.textContent.split(/(\s+)/);
  var frag = document.createDocumentFragment();
  var n = 0;
  tokens.forEach(function (tok) {
    if (!tok) return;
    if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
    var w = document.createElement("span");
    w.className = "c5h-motto__w";
    w.style.setProperty("--mi", n);
    w.textContent = tok;
    frag.appendChild(w);
    n += 1;
  });
  if (!n) return;
  line.textContent = "";
  line.appendChild(frag);
  /* n + 1 so the last word is fully lit exactly at the end of the ramp. */
  line.style.setProperty("--mn", n + 1);

  /* The ramp runs while the bottom edge of the quote travels from 85 % of the
     window height to 40 % of it. Below 900 px and at reduced motion the
     property goes away and the fallback in the stylesheet lights every word. */
  function update() {
    if (!CX5.motionOn()) { line.style.removeProperty("--mp"); return; }
    var h = window.innerHeight;
    var r = quote.getBoundingClientRect();
    var p = CX5.clamp((0.85 * h - r.bottom) / (0.45 * h), 0, 1);
    line.style.setProperty("--mp", p.toFixed(3));
  }

  CX5.register({ scroll: update, resize: update });
})();
