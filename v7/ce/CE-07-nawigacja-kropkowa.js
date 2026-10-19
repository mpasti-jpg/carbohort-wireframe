/* ===== CE-07 · Nawigacja kropkowa (rejestr: ce-rejestr.js) ==================
   Ticks on an arc (Figma 959:1632 / 959:1607 / 959:1608, 18.10.2026; round 2 the
   same evening: taller arc, wider activation area, one continuous open zone).
   1. Geometry: the Figma arc – a circle of R 337 px over ±21.2° (nine ticks
      31.2 px apart) – stretched vertically only, so the outermost ticks span 35 %
      of the window height while the horizontal swing stays as in Figma. Ticks sit
      at equal steps of that arc; each tick and label follows the normal of the
      stretched arc. The box's right edge is the right edge of the outermost
      square (round 4, 18.10), so that square stands --c5-dots-edge (15 px) from
      the window edge. Recomputed on resize. Positions go to --x / --y / --a on
      each <li>.
   2. Squares (runda 3, 18.10): the marks are 5 × 5 px squares, not rotated, centred
      where the middle of the old 6 px tick was. Two twin lists next to the nav
      (aria-hidden, no pointer): .c5-dots__marks – white 30 %, blended with
      difference – and .c5-dots__accent – the green square in normal blend, on
      for the active chapter and for the item under the pointer or with keyboard
      focus. The nav itself is not blended any more: the labels sit on light
      blurred backgrounds (Figma 959:1681) and the spacing rule in layout() keeps
      those backgrounds from overlapping.
   3. Open / close (round 5, 19.10): at rest the squares stand in a straight
      column (Figma 966:1440 – 5 px squares every 35 px), 10 px from the window
      edge, and only a narrow strip opens the fan: 25 px from the window edge,
      along the column plus 12 px. The pointer is tracked on the whole document
      (no element covers the page). Opening (.is-open on all three layers) moves
      the squares from the column onto the arc; the labels are allowed in only
      once the squares have arrived (.is-ready). While open, a narrow zone
      (.c5-dots__zone: from the leftmost square minus 16 px to the window edge,
      from the top to the bottom item plus 16 px) picks the item under the
      pointer – the nearest one vertically (.is-hot) – and a click in it jumps
      to that item; the two shown labels (active and hot) also keep the fan
      open. The fan closes 250 ms after the pointer leaves the zone by more
      than 24 px. Keyboard focus opens it too.
   4. Scrollspy over [data-chapter] (active = the last chapter whose top edge is
      above 40 % of the viewport) + a smooth jump to the chapter behind a tick.
   5. Footer: once the site footer zone (#serwis-dok-sekcja, else #serwis-stopka)
      reaches the bottom of the rail, both layers slide out into the right edge
      (.is-away) and come back when the footer leaves.
   No markup -> no-op. ======================================================= */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$, reducedMQ = CX5.reducedMQ;
  var nav = $(".c5-dots");
  var dotLinks = $$("[data-dot]");
  var chapters = $$("[data-chapter]");
  if (!nav || !dotLinks.length) return;

  var R = 337, PHI0 = 4 * 31.2 / 337;   /* Figma arc: ±4 steps of 31.2 px on R 337 */
  var SPAN_VH = 0.35, CHIP_GAP = 4, SCREEN_M = 12;
  var STEP = 31.2, HIT_LEFT = 16, PAD = 24, MARK = 3, SIZE = 5;   /* square centre: 3 px along the old 6 px tick; square 5 px */
  var ZONE_PAD = 16, LEAVE = 24, CLOSE_MS = 250, READY_MS = 170;
  var LINE_PITCH = 35, LINE_EDGE = 10, ACT_W = 25, ACT_PAD = 12;   /* round 5: column at rest, activation strip */

  var items = $$("ol > li", nav);
  var links = items.map(function (li) { return li.querySelector("[data-dot]"); });
  var n = items.length;

  /* two twin lists of squares next to the nav: grey ones blended with difference,
     green ones in normal blend (runda 3) */
  function layer(cls) {
    var ol = doc.createElement("ol");
    ol.className = cls;
    ol.setAttribute("aria-hidden", "true");
    items.forEach(function () { ol.appendChild(doc.createElement("li")).appendChild(doc.createElement("i")); });
    nav.parentNode.insertBefore(ol, nav.nextSibling);
    return ol;
  }
  var accent = layer("c5-dots__accent"), marks = layer("c5-dots__marks");
  var accentItems = Array.prototype.slice.call(accent.children);
  var markItems = Array.prototype.slice.call(marks.children);
  var layers = [nav, marks, accent];
  var zone = doc.createElement("div");
  zone.className = "c5-dots__zone";
  zone.setAttribute("aria-hidden", "true");
  nav.insertBefore(zone, nav.firstChild);
  nav.setAttribute("data-arc", "");

  /* --- 1. geometry --------------------------------------------------------- */
  var span = 0, ticks = [], chipH = 33;   /* ticks: box coordinates of the arc points */
  function place(sp) {
    var s = sp / (2 * R * Math.sin(PHI0));                 /* vertical stretch of the Figma arc */
    var pts = items.map(function (li, i) {
      var phi = n > 1 ? -PHI0 + i * 2 * PHI0 / (n - 1) : 0;
      var ang = Math.atan2(-Math.sin(phi), s * Math.cos(phi));   /* normal, pointing right */
      return { x: -R * Math.cos(phi), y: s * R * Math.sin(phi), ang: ang };
    });
    var xRight = Math.max.apply(null, pts.map(function (p) { return p.x + MARK * Math.cos(p.ang); })) + SIZE / 2;
    var xLeft = -R - HIT_LEFT - 2;
    var W = Math.ceil(xRight - xLeft), H = Math.ceil(sp + STEP + 2 * PAD);
    xLeft = xRight - W;   /* rounding goes to the left, the outermost square keeps the 15 px */
    layers.forEach(function (el) {
      el.style.setProperty("--c5-dots-w", W + "px");
      el.style.setProperty("--c5-dots-h", H + "px");
    });
    /* the column at rest: its squares end LINE_EDGE from the window edge, the
       box ends --c5-dots-edge from it, so the column stands just right of the box */
    var edge = parseFloat(window.getComputedStyle(nav).right) || 15;
    var lx = W + (edge - LINE_EDGE) - SIZE / 2;
    ticks = pts.map(function (p, i) {
      var t = { x: p.x - xLeft, y: p.y + H / 2, ang: p.ang };
      var ly = H / 2 + (i - (n - 1) / 2) * LINE_PITCH;
      items[i].style.setProperty("--x", t.x.toFixed(2) + "px");
      items[i].style.setProperty("--y", t.y.toFixed(2) + "px");
      items[i].style.setProperty("--a", (p.ang * 180 / Math.PI).toFixed(2) + "deg");
      items[i].style.setProperty("--i", i);
      [markItems[i], accentItems[i]].forEach(function (el) {     /* squares are not rotated */
        el.style.setProperty("--x", (t.x + MARK * Math.cos(p.ang)).toFixed(2) + "px");
        el.style.setProperty("--y", (t.y + MARK * Math.sin(p.ang)).toFixed(2) + "px");
        el.style.setProperty("--lx", lx.toFixed(2) + "px");
        el.style.setProperty("--ly", ly.toFixed(2) + "px");
        el.style.setProperty("--k", Math.abs(i - (n - 1) / 2).toFixed(1));   /* distance from the middle: opening fans out from it */
      });
      return t;
    });
  }
  /* smallest gap between neighbouring label backgrounds, measured across them */
  function minGap() {
    var g = Infinity;
    for (var i = 1; i < n; i++) {
      var a = (Math.abs(ticks[i].ang) + Math.abs(ticks[i - 1].ang)) / 2;
      g = Math.min(g, (ticks[i].y - ticks[i - 1].y) * Math.cos(a));
    }
    return g;
  }
  /* vertical reach of the labels and squares relative to the centre of the screen */
  function reach() {
    var box = nav.getBoundingClientRect(), mid = box.top + box.height / 2, top = 0, bottom = 0;
    links.forEach(function (a, i) {
      var r = a.querySelector(".c5-dots__label").getBoundingClientRect();
      top = Math.max(top, mid - Math.min(r.top, box.top + ticks[i].y - 3));
      bottom = Math.max(bottom, Math.max(r.bottom, box.top + ticks[i].y + 3) - mid);
    });
    return Math.max(top, bottom);
  }
  /* Spacing rule (runda 3): the outer squares stand on 35 % of the window; if the
     label backgrounds (≈ 33 px) would then come closer than 4 px, the arc grows
     until they do not; in both cases every background and square stays at least
     12 px inside the window – on a very low window the arc shrinks back and the
     backgrounds may overlap a little. */
  function layout() {
    var vh = window.innerHeight;
    var l0 = links[0] && links[0].querySelector(".c5-dots__label");
    chipH = (l0 && l0.offsetHeight) || 33;
    span = n > 1 ? SPAN_VH * vh : 0;
    place(span);
    if (n > 1) {
      var g = minGap();
      if (g < chipH + CHIP_GAP) { span = span * (chipH + CHIP_GAP) / g; place(span); }
      for (var k = 0; k < 4; k++) {
        var over = reach() - (vh / 2 - SCREEN_M);
        if (over <= 0.5) break;
        span = Math.max(0, span - 2 * over);
        place(span);
      }
    }
    if (open) measureZone();
  }

  /* --- 2. green ticks + hot item -------------------------------------------- */
  var current = null, hotPtr = -1, hotFocus = -1;
  function paint() {
    links.forEach(function (a, i) {
      var hot = i === hotPtr || i === hotFocus;
      items[i].classList.toggle("is-hot", hot);
      var on = hot || (a && a.getAttribute("data-dot") === current);
      accentItems[i].classList.toggle("is-on", !!on);
      markItems[i].classList.toggle("is-on", !!on);
    });
  }
  links.forEach(function (a, i) {
    if (!a) return;
    a.addEventListener("focus", function () { if (a.matches(":focus-visible")) { hotFocus = i; paint(); } });
    a.addEventListener("blur", function () { if (hotFocus === i) { hotFocus = -1; paint(); } });
  });

  /* --- 3. open / close ------------------------------------------------------- */
  var open = false, closeTimer = 0, readyTimer = 0, zoneRect = null, labelY = [];
  /* round 5: the zone covers the squares of the arc only, not the labels */
  function measureZone() {
    var box = nav.getBoundingClientRect();
    var left = Infinity, top = Infinity, bottom = -Infinity;
    labelY = ticks.map(function (t) {
      var sx = box.left + t.x + MARK * Math.cos(t.ang), sy = box.top + t.y + MARK * Math.sin(t.ang);
      left = Math.min(left, sx - SIZE / 2);
      top = Math.min(top, sy - STEP / 2);
      bottom = Math.max(bottom, sy + STEP / 2);
      return sy;
    });
    zoneRect = { left: left - ZONE_PAD, top: top - ZONE_PAD, right: window.innerWidth, bottom: bottom + ZONE_PAD };
    zone.style.setProperty("--zx", (zoneRect.left - box.left).toFixed(1) + "px");
    zone.style.setProperty("--zy", (zoneRect.top - box.top).toFixed(1) + "px");
    zone.style.setProperty("--zw", (zoneRect.right - zoneRect.left).toFixed(1) + "px");
    zone.style.setProperty("--zh", (zoneRect.bottom - zoneRect.top).toFixed(1) + "px");
  }
  /* the activation strip: ACT_W px from the window edge, along the column at rest */
  function inBand(x, y) {
    var mid = window.innerHeight / 2, half = (n - 1) / 2 * LINE_PITCH + SIZE / 2 + ACT_PAD;
    return x >= window.innerWidth - ACT_W && y >= mid - half && y <= mid + half;
  }
  function inZone(x, y, pad) {
    return zoneRect && x >= zoneRect.left - pad && x <= zoneRect.right + pad && y >= zoneRect.top - pad && y <= zoneRect.bottom + pad;
  }
  /* the shown labels (active and hot) keep the fan open while the pointer is on them */
  function onLabel(x, y) {
    return items.some(function (li, i) {
      if (!li.classList.contains("is-hot") && links[i].getAttribute("data-dot") !== current) return false;
      var r = links[i].querySelector(".c5-dots__label").getBoundingClientRect();
      return x >= r.left - 6 && x <= r.right + 6 && y >= r.top - 6 && y <= r.bottom + 6;
    });
  }
  function focusInside() {
    var el = doc.activeElement;
    return !!(el && nav.contains(el) && el.matches(":focus-visible"));
  }
  function nearest(y) {
    var best = 0, d = Infinity;
    labelY.forEach(function (ly, i) { var e = Math.abs(ly - y); if (e < d) { d = e; best = i; } });
    return best;
  }
  function setOpen(on) {
    clearTimeout(closeTimer); closeTimer = 0;
    if (on === open) return;
    open = on;
    if (on) measureZone();
    layers.forEach(function (el) { el.classList.toggle("is-open", on); });
    clearTimeout(readyTimer); readyTimer = 0;
    if (on) readyTimer = setTimeout(function () { readyTimer = 0; nav.classList.add("is-ready"); }, reducedMQ.matches ? 0 : READY_MS);
    else nav.classList.remove("is-ready");
    if (!on) holdY = null;
    if (!on && hotPtr !== -1) { hotPtr = -1; paint(); }
  }
  function scheduleClose() {
    if (open && !closeTimer && !focusInside()) closeTimer = setTimeout(function () { closeTimer = 0; setOpen(false); }, CLOSE_MS);
  }
  /* item of the column at rest under the pointer: the squares move when the fan
     opens, so that item stays hot until the pointer moves on by HOLD px */
  var HOLD = 8, holdY = null;
  function nearestInColumn(y) {
    var top = window.innerHeight / 2 - (n - 1) / 2 * LINE_PITCH;
    return Math.min(n - 1, Math.max(0, Math.round((y - top) / LINE_PITCH)));
  }
  doc.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch" || away || !CX5.wideMQ.matches) return;
    var x = e.clientX, y = e.clientY;
    if (!open) {
      if (!inBand(x, y)) return;
      setOpen(true);
      holdY = y; hotPtr = nearestInColumn(y); paint();
      return;
    }
    if (holdY !== null) { if (Math.abs(y - holdY) < HOLD && inZone(x, y, 0)) return; holdY = null; }
    var h = hotPtr;
    if (inZone(x, y, 0)) h = nearest(y);              /* on the squares: the nearest item */
    else if (onLabel(x, y)) h = hotPtr;               /* on a shown label: keep it */
    else if (inZone(x, y, LEAVE) || inBand(x, y)) h = -1;
    else { if (hotPtr !== -1) { hotPtr = -1; paint(); } scheduleClose(); return; }
    clearTimeout(closeTimer); closeTimer = 0;
    if (h !== hotPtr) { hotPtr = h; paint(); }
  }, { passive: true });
  /* keyboard: focus inside the nav opens the fan, leaving it folds it back */
  nav.addEventListener("focusin", function () { if (focusInside() && !away) setOpen(true); });
  nav.addEventListener("focusout", function (e) { if (!nav.contains(e.relatedTarget)) scheduleClose(); });
  window.addEventListener("pointerout", function (e) { if (!e.relatedTarget) scheduleClose(); });
  zone.addEventListener("click", function (e) {
    measureZone();                          /* labels are settled now – fresh centres */
    var a = links[nearest(e.clientY)];
    if (a) a.click();
  });

  /* --- 4. scrollspy + jump ----------------------------------------------------- */
  function updateSpy() {
    var mid = window.innerHeight * 0.4;
    var next = null;
    chapters.forEach(function (sec) {
      if (sec.getBoundingClientRect().top < mid) next = sec.getAttribute("data-chapter");
    });
    if (next !== current) {
      current = next;
      dotLinks.forEach(function (a) {
        if (a.getAttribute("data-dot") === current) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
      paint();
    }
  }

  /* nothing is pinned to the top edge any more, so anchors need no offset */
  dotLinks.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = doc.getElementById(a.getAttribute("href").slice(1));
      if (!target) return;
      e.preventDefault();
      /* the first item („Początek”, Mateusz 19.10) goes to the very top, header included */
      var y = a === links[0] ? 0 : Math.round(target.getBoundingClientRect().top + window.scrollY);
      CX5.scrollTo(y, reducedMQ.matches ? "auto" : "smooth");
    });
  });

  /* --- 5. hide at the footer ------------------------------------------------- */
  var away = false;
  function footerTop() {
    var f = doc.getElementById("serwis-dok-sekcja") || doc.getElementById("serwis-stopka");
    return f ? f.getBoundingClientRect().top : Infinity;
  }
  function updateAway() {
    /* bottom of the rail = centre of the screen + half of the taller of arc and column */
    var railBottom = window.innerHeight / 2 + Math.max(span, (n - 1) * LINE_PITCH) / 2 + STEP / 2;
    var next = footerTop() < railBottom;
    if (next === away) return;
    away = next;
    layers.forEach(function (el) { el.classList.toggle("is-away", away); });
    if (away) setOpen(false);
    if (away && nav.contains(doc.activeElement)) doc.activeElement.blur();
  }

  function onScroll() { updateSpy(); updateAway(); }
  layout();
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { layout(); onScroll(); });
  CX5.register({ scroll: onScroll, resize: function () { layout(); onScroll(); } });
  onScroll();
})();
