/* ===== carbohumic-dolistny.js – page layer (V7) ============================
   The CX5 rail, the shared layer and the CE modules live in ce/*.js (loaded
   earlier). Only the module of the blocks without a file of their own in ce/
   stays here: the CE-36 rows with the CE-37 pop-ups („Który dla mnie”). No
   `window.CX5` of its own and no `CX5.start()` – the rail starts by itself on
   DOMContentLoaded. The module is carried 1:1 from carbomat-humic.js
   (section 40): both pages share one behaviour until it is cut into ce/. === */
/* ===== 40 · Który dla mnie: pop-up with the full card, parallax, reveal ======
   1. Pop-up – pattern: the lightbox of the maize page. Without JS the pop-ups
      lie in the flow of the page under their rows and the whole content is
      visible; here they move to the end of <body> and behave like a modal
      window: an overlay, the X, a click beside the panel, Escape, a Tab trap,
      `inert` on the background, the page scroll locked, focus back on the
      button. The hash does not change.
   2. Parallax of the photos – only at `CX5.motionOn()`.
   3. Reveal of the copy columns and of the note – through `CX5.reveal`
      (ce/00-base.js, module 02). ========================================== */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;
  var pops = $$("[data-pop]");
  var overlay = $("[data-pop-overlay]");
  var revealEls = $$("#ktory-dla-mnie [data-reveal]");
  var medias = $$("[data-who-media]");

  /* --- 1. Pop-up ----------------------------------------------------------- */
  var openBox = null, opener = null;

  function focusables(box) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', box)
      .filter(function (n) { return n.offsetWidth > 0 || n.offsetHeight > 0; });
  }
  function sleep(box) {
    box.setAttribute("data-open", "false");
    box.setAttribute("aria-hidden", "true");
    box.inert = true;
  }
  /* everything in <body> goes inert while a dialog is open; the pop-ups that are
     not open stay inert afterwards, because that is their resting state */
  function bgInert(on, keep) {
    Array.prototype.forEach.call(doc.body.children, function (n) {
      if (n === overlay) return;
      n.inert = n === keep ? false : (on || n.hasAttribute("data-pop"));
    });
  }
  function closePop(returnFocus) {
    if (!openBox) return;
    var box = openBox, btn = opener;
    openBox = null; opener = null;
    sleep(box);
    if (overlay) { overlay.setAttribute("data-open", "false"); overlay.hidden = true; }
    doc.documentElement.classList.remove("c5-pop-lock");
    bgInert(false, null);
    if (CX5.lenis) CX5.lenis.start();
    if (returnFocus !== false && btn && btn.focus) btn.focus();
  }
  function openPop(box, btn) {
    if (!box || openBox === box) return;
    if (openBox) closePop(false);
    openBox = box; opener = btn || null;
    if (overlay) { overlay.hidden = false; void overlay.offsetWidth; overlay.setAttribute("data-open", "true"); }
    box.removeAttribute("aria-hidden");
    box.inert = false;
    box.setAttribute("data-open", "true");
    doc.documentElement.classList.add("c5-pop-lock");
    bgInert(true, box);
    if (CX5.lenis) CX5.lenis.stop();
    var x = $("[data-pop-close]", box);
    (x || focusables(box)[0] || box).focus();
  }

  if (pops.length) {
    pops.forEach(function (box) {
      doc.body.appendChild(box);
      sleep(box);
      var panel = $(".c5-pop__panel", box);
      box.addEventListener("click", function (e) {
        if (panel && !panel.contains(e.target)) closePop();
      });
      $$("[data-pop-close]", box).forEach(function (b) {
        b.addEventListener("click", function () { closePop(); });
      });
    });
    if (overlay) {
      doc.body.appendChild(overlay);
      overlay.hidden = true;
      overlay.setAttribute("data-open", "false");
      overlay.addEventListener("click", function () { closePop(); });
    }
    $$("[data-pop-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openPop(doc.getElementById(btn.getAttribute("data-pop-open")), btn);
      });
    });
    doc.addEventListener("keydown", function (e) {
      if (!openBox) return;
      if (e.key === "Escape") { e.preventDefault(); closePop(); return; }
      if (e.key !== "Tab") return;
      var f = focusables(openBox);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!openBox.contains(doc.activeElement)) { e.preventDefault(); first.focus(); }
    });
  }

  /* --- 2. Parallax of the photos --------------------------------------------
     The photo layer is taller than its frame, so it has room for the shift
     without uncovering an edge. `--who-par` goes from -6 to 0 (per cent of the
     layer height) while the row travels through the window. */
  function parallax() {
    if (!medias.length) return;
    var on = CX5.motionOn(), h = window.innerHeight;
    medias.forEach(function (m) {
      if (!on) { m.style.removeProperty("--who-par"); return; }
      var r = m.getBoundingClientRect();
      var span = h + r.height;
      var p = span > 0 ? CX5.clamp((h - r.top) / span, 0, 1) : 0;
      m.style.setProperty("--who-par", CX5.lerp(-6, 0, p).toFixed(3));
    });
  }
  CX5.register({ scroll: parallax, resize: parallax });

  /* --- 3. Reveal ----------------------------------------------------------- */
  if (CX5.reveal) CX5.reveal(revealEls);
})();

/* ===== 50 · Efekty: CE-13 variant `lista` – the rolling list and the leaves ==
   Figma 948:1437 (D01, 18.10.2026). CE-13-scena-produktu.js runs the scene
   (thresholds, is-on / is-past, parallax); this block only adds two things
   the variant `lista` draws in carbohumic-dolistny.css:
   · the place of every name in one rolling list: --use-y (px, from the bottom
     line of its crop) and data-dist ("0" open, "1" a neighbour, "far");
     the open name stands one line above the bottom, the next one under it,
     the previous one above it – heights are measured, so a name that wraps
     pushes its neighbours instead of covering them;
   · data-leaves (0–4) on the open crop: how far the reader is in this term –
     the hold of a term is cut into five parts, the first without a leaf, so
     the fourth leaf comes before the next term opens and scrolling back takes
     them away one by one.
   The term index uses the very formula of the module (the constants come from
   the same custom properties), so both always agree. Discrete writes only;
   one getBoundingClientRect() of the track per frame. Below 900 px, with
   reduced motion and without JS nothing is written (the static layout).
   ⚠ To be moved into ce/CE-13-scena-produktu.js as the variant `lista`
   (moduleRequests of round 18.10.2026). ===================================== */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var art = $("[data-use-list]");
  if (!art) return;
  var track = $("[data-use-track]", art);
  var crops = $$("[data-use-crop]", art);
  var tabs = crops.map(function (c) { return $("[data-use-tab]", c); });
  var n = crops.length;
  if (!track || !n) return;

  var on = false, INTRO = .1, HOLD = .8, GAP = 20, h = [], act = -1, leaves = -1;

  function num(cs, name, dflt) {
    var v = parseFloat(cs.getPropertyValue(name));
    return isNaN(v) ? dflt : v;
  }
  function clear() {
    crops.forEach(function (c) {
      c.style.removeProperty("--use-y");
      c.removeAttribute("data-dist");
      c.removeAttribute("data-leaves");
    });
    act = -1; leaves = -1;
  }
  /* y of every name against the bottom line of its crop, for the open term a */
  function place(a) {
    var y = [], i;
    var lift = (a + 1 < n ? h[a + 1] : Math.min.apply(null, h)) + GAP;
    y[a] = -lift;
    for (i = a + 1; i < n; i++) y[i] = y[i - 1] + GAP + h[i];
    for (i = a - 1; i >= 0; i--) y[i] = y[i + 1] - h[i + 1] - GAP;
    crops.forEach(function (c, k) {
      var d = Math.abs(k - a);
      c.style.setProperty("--use-y", String(Math.round(y[k])));
      c.setAttribute("data-dist", d === 0 ? "0" : d === 1 ? "1" : "far");
    });
  }
  function measure() {
    on = CX5.motionOn();
    if (!on) { clear(); return; }
    var cs = window.getComputedStyle(art);
    INTRO = num(cs, "--use-intro", INTRO);
    HOLD = num(cs, "--use-hold", HOLD);
    GAP = num(cs, "--use-list-gap", GAP);
    h = tabs.map(function (t) { return t ? t.offsetHeight : 0; });
    act = -1; leaves = -1;
  }
  function frame() {
    if (!on) return;
    var s = -track.getBoundingClientRect().top / window.innerHeight;
    var a = clamp(Math.floor((s - INTRO) / HOLD), 0, n - 1);
    var k = clamp(Math.floor(((s - INTRO - HOLD * a) / HOLD) * 5), 0, 4);
    if (a !== act) { act = a; leaves = -1; place(a); }
    if (k === leaves) return;
    leaves = k;
    crops.forEach(function (c, i) {
      if (i === a) c.setAttribute("data-leaves", String(k));
      else c.removeAttribute("data-leaves");
    });
  }

  /* the type arrives after the first layout: measure the names again */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { if (on) { measure(); frame(); } });
  }
  CX5.register({ scroll: frame, resize: measure });
})();
