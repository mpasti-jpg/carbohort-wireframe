/* ===== CE-96 · Glob dystrybutorów (rejestr: ce-rejestr.js) =================
   Draws a dotted globe (variant łuki: a flat dotted map of Europe) and pairs
   its points with the partner cards.
     · Content lives in the cards only. Each `.c5-glob__item` carries its point:
       data-glob-lon / data-glob-lat (degrees, approximate centre of the
       country), data-glob-label (country label on the globe) and optionally
       data-glob-strona = r | l | t | b (label side in variant A, default r).
       A partner on another continent = one more card. The head office is
       optional: data-glob-hq="lon,lat" on the root (an outlined diamond, no
       label).
     · Land: the TopoJSON file named by data-glob-land on the root (Natural
       Earth 110m via world-atlas@2.0.2, saved locally – see v7/data/ZRODLA.txt).
       It is rasterised once into an equirectangular mask and sampled into an
       even grid of dots (drawn on canvas); if it fails to load, the globe is
       drawn without land. The flat map draws the land in its own projection
       and samples an even grid of screen points instead.
     · Libraries from CDN: d3@7.9.0 (projections, easing) and
       topojson-client@3.1.0. Missing either -> no-op, the cards stay a plain
       grid (no `is-ready`).
     · Variant = modifier class on the root (c5-glob--pol-kuli / c5-glob--srodek);
       when the class changes the widget rebuilds its layout and ARIA state.
         A (pol-kuli): the upper half of a globe above a row of cards; points
           are small squares with a country label. No page uses A today (the
           comparison switch on the contact page is gone); the code stays,
           variant łuki borrows its points and labels.
         B (srodek): a large globe filling the section from below the heading,
           cut by the left and bottom edges, its right rim in view, and seen
           from close by (Europe larger than on a flat view); points are
           numbered vertical stems (the stem's lower end sits on the country;
           no stem crosses another point, and a point right above another gets
           a hanging stem) in the right part of the globe; the cards form a
           numbered accordion in the bottom left corner (one open at a time).
           Near the rim the land dots thin out, so the crowded rows there do
           not merge into stripes. At rest the box around all the points (and
           the head office) sits in the middle of the free field between the
           cards and the rim; a picked country lands in the middle of that
           field too, and the frame moves right if a point would slip under
           the cards.
     · Drag anywhere on the globe (mouse, pen) to turn it freely: longitude
       without limits, latitude of the centre kept within ±85°. Touch turns it
       sideways only – vertical moves scroll the page (touch-action: pan-y).
       Dragging stops any turn in progress; the globe stays where it is left,
       with a short glide unless prefers-reduced-motion. A click on a
       point without movement (under 4 px) still picks the partner.
     · A click on a point or a card selects the partner: the globe turns to the
       country (eased; at once with prefers-reduced-motion), the point and the
       card light up. Variant A scrolls the card row sideways; variant B opens
       the accordion item. A `#dyst-…` hash (links from other pages) selects too.
     · The globe never moves by itself: it turns only when a partner is
       picked (card, point, hash) or when it is dragged.
     · data-glob-center="lon,lat" on the root mirrors the centre on screen.
     · Variant łuki (c5-glob--luki, read once at load, not switchable): no
       globe – a flat dotted map of Europe (conformal conic projection) fitted
       to all points and the head office; it stands still and takes no
       pointer input. Points are read from
       any element in the list that carries data-glob-lon / data-glob-lat
       (the rows are plain links, the list stays the only navigation);
       data-glob-skrot (optional) is the short label used below 600 px.
       An arc runs from the head office to every point: the straight line
       between them, bowed out to one side. How far, and to which side, is
       chosen per arc (fitArcs) so that no arc passes close to another
       partner's point and two arcs do not run along each other. Labels pick
       the free side of their point (placeTags; data-glob-strona is the
       preferred side). The arcs draw in one after another when the stage
       comes into view (`is-drawn` on the root; at once with reduced motion).
       Points and arcs take no pointer input. Pointing at or focusing a row
       lights its arc and point (`is-hot`, `has-hot` on the root).
     · data-glob-hq-label (optional) writes a small label next to the head
       office; data-glob-hq-strona = r | l | t | b sets its side (default r).
   No [data-glob] -> no-op. ================================================== */
(function () {
  "use strict";
  if (!window.CX5) return;
  var $ = CX5.$, $$ = CX5.$$;
  var roots = $$("[data-glob]");
  if (!roots.length) return;
  var d3 = window.d3, topojson = window.topojson;
  if (!d3 || !topojson || !d3.geoEquirectangular) return;

  var RAD = Math.PI / 180;
  var SVGNS = "http://www.w3.org/2000/svg";
  var DRAG_MIN = 4;             /* px before a press becomes a drag */
  var LAT_MAX = 85;             /* the globe never stands on its head */
  var STEM = 94, STEM_S = 56;   /* variant B stem length: desktop / phone */
  /* variant B, desktop: room kept between the cards and the leftmost point
     (a number may stand left of its stem) */
  var SIDE_GAP = 26;
  /* variant B looks at the globe from close by (distance in globe radii), so
     the middle of the disc – Europe – comes out larger than on a flat view
     while the outline stays a full circle: desktop / phone */
  var PERSP = 1.8, PERSP_S = 2.4;
  /* variant B: towards the rim the rows crowd (q = spacing across the rim on
     screen / spacing in the middle); below RIM_CUT a dot is not drawn, up to
     RIM_FULL it fades in, so the rim fades out instead of turning into stripes */
  var RIM_CUT = 0.24, RIM_FULL = 0.62;
  /* variant łuki: samples per arc; the bow of an arc as a share of its chord –
     the usual one and the ones tried when it crowds a neighbour */
  var ARC_N = 36, ARC_K0 = 0.2, ARC_KS = [0.06, 0.1, 0.14, 0.2, 0.26, 0.32, 0.4];
  /* variant łuki: two arcs closer than this (px) count as running together */
  var ARC_SEP = 9;
  /* variant łuki: opacity of the land dots on the flat map (the arcs lead) */
  var FLAT_ALPHA = 0.7;
  var reduced = CX5.reducedMQ;
  var phoneMQ = window.matchMedia("(max-width: 767px)");
  var smallMQ = window.matchMedia("(max-width: 599px)");

  /* one land mask per file, shared by every globe on the page */
  var maskCache = {};
  function loadMask(url) {
    if (maskCache[url]) return maskCache[url];
    maskCache[url] = window.fetch(url)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (topo) {
        var key = Object.keys(topo.objects)[0];
        var land = topojson.feature(topo, topo.objects[key]);
        var W = 1440, H = 720;
        var cv = document.createElement("canvas");
        cv.width = W; cv.height = H;
        var ctx = cv.getContext("2d");
        var proj = d3.geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2]).precision(0.1);
        ctx.fillStyle = "#000";
        ctx.beginPath();
        d3.geoPath(proj, ctx)(land);
        ctx.fill();
        return { w: W, h: H, px: ctx.getImageData(0, 0, W, H).data, land: land };
      });
    return maskCache[url];
  }

  /* even grid of dots on land: rows every `step` degrees, columns widened by
     1/cos(lat) so the spacing on the sphere stays the same */
  function buildDots(mask, step) {
    var out = [];
    for (var lat = -84; lat <= 84; lat += step) {
      var c = Math.cos(lat * RAD);
      var lstep = step / Math.max(c, 0.05);
      var y = Math.min(mask.h - 1, Math.round((90 - lat) / 180 * mask.h));
      for (var lon = -180 + (lstep / 2); lon < 180; lon += lstep) {
        var x = Math.min(mask.w - 1, Math.round((lon + 180) / 360 * mask.w));
        if (mask.px[(y * mask.w + x) * 4 + 3] > 127) out.push(lon * RAD, lat * RAD);
      }
    }
    var n = out.length / 2;
    var d = { n: n, cl: new Float32Array(n), sl: new Float32Array(n), cp: new Float32Array(n), sp: new Float32Array(n),
      x: new Float32Array(n), y: new Float32Array(n), a: new Uint8Array(n), s: new Float32Array(n) };
    for (var i = 0; i < n; i++) {
      d.cl[i] = Math.cos(out[2 * i]); d.sl[i] = Math.sin(out[2 * i]);
      d.cp[i] = Math.cos(out[2 * i + 1]); d.sp[i] = Math.sin(out[2 * i + 1]);
    }
    return d;
  }

  function norm180(a) { a = ((a + 180) % 360 + 360) % 360 - 180; return a; }
  function clampLat(a) { return Math.max(-LAT_MAX, Math.min(LAT_MAX, a)); }

  /* scale at the middle of the disc relative to its radius: 1 for the
     orthographic view, more for a view from distance P (in globe radii) */
  function gain(P) { return P ? 1 / Math.sqrt((P - 1) / (P + 1)) : 1; }
  /* (lon, lat) seen from a centre c = [lon, lat]: coordinates relative to the
     disc radius, y up; P = 0 orthographic, P > 1 seen from that distance */
  function unit(lon, lat, c, P) {
    var l = (lon - c[0]) * RAD, p = lat * RAD, pc = c[1] * RAD;
    var x = Math.cos(p) * Math.sin(l);
    var y = Math.cos(pc) * Math.sin(p) - Math.sin(pc) * Math.cos(p) * Math.cos(l);
    if (!P) return [x, y];
    var cosc = Math.sin(pc) * Math.sin(p) + Math.cos(pc) * Math.cos(p) * Math.cos(l);
    var f = gain(P) * (P - 1) / (P - cosc);
    return [x * f, y * f];
  }
  /* the centre that puts (lon, lat) at unit point (X, Y) – Newton on two angles */
  function centreFor(lon, lat, X, Y, P) {
    var g = gain(P);
    var c = [lon - Math.asin(Math.max(-1, Math.min(1, X / g))) / RAD, lat - Math.asin(Math.max(-1, Math.min(1, Y / g))) / RAD];
    var e = 0.01;
    for (var k = 0; k < 24; k++) {
      var q = unit(lon, lat, c, P);
      var fx = q[0] - X, fy = q[1] - Y;
      if (fx * fx + fy * fy < 1e-12) break;
      var qa = unit(lon, lat, [c[0] + e, c[1]], P), qb = unit(lon, lat, [c[0], c[1] + e], P);
      var a = (qa[0] - q[0]) / e, b = (qb[0] - q[0]) / e, cc = (qa[1] - q[1]) / e, dd = (qb[1] - q[1]) / e;
      var det = a * dd - b * cc;
      if (Math.abs(det) < 1e-9) break;
      c[0] -= (dd * fx - b * fy) / det;
      c[1] -= (-cc * fx + a * fy) / det;
      c[1] = clampLat(c[1]);
    }
    return [norm180(c[0]), clampLat(c[1])];
  }

  function svg(tag, attrs, parent) {
    var el = document.createElementNS(SVGNS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  }

  roots.forEach(function (root) {
    var stage = $("[data-glob-stage]", root);
    var list = $("[data-glob-list]", root) || $(".c5-glob__list", root);
    var nav = $("[data-glob-nav]", root);
    var head = $(".c5-glob__head", root);
    var side = $(".c5-glob__side", root) || list;
    var body = $(".c5-glob__body", root);
    if (!stage || !list) return;
    /* variant łuki: a still flat map with arcs, points read from the list rows */
    var still = root.classList.contains("c5-glob--luki");

    /* --- partners from the cards ------------------------------------------ */
    var items = [];
    $$(still ? "[data-glob-lon]" : ".c5-glob__item", list).forEach(function (li, i) {
      var lon = parseFloat(li.getAttribute("data-glob-lon"));
      var lat = parseFloat(li.getAttribute("data-glob-lat"));
      if (isNaN(lon) || isNaN(lat)) return;
      if (!li.id && !still) li.id = "glob-" + i;
      items.push({ el: li, id: li.id || "glob-" + i, lon: lon, lat: lat,
        label: li.getAttribute("data-glob-label") || "",
        short: li.getAttribute("data-glob-skrot") || "",
        side: li.getAttribute("data-glob-strona") || "r" });
    });
    if (!items.length) return;
    var byId = {};
    items.forEach(function (it, i) { byId[it.id] = it; it.no = i + 1; });

    var hq = null;
    var hqAttr = (root.getAttribute("data-glob-hq") || "").split(",");
    if (hqAttr.length === 2 && !isNaN(parseFloat(hqAttr[0]))) hq = { lon: parseFloat(hqAttr[0]), lat: parseFloat(hqAttr[1]) };
    var home = hq || items[0];
    /* variant B frames all partners (and the head office) at once */
    var homeAll = (function () {
      var pts = items.concat(hq ? [hq] : []);
      var lo = Infinity, hi = -Infinity, la = Infinity, lb = -Infinity;
      pts.forEach(function (p) { lo = Math.min(lo, p.lon); hi = Math.max(hi, p.lon); la = Math.min(la, p.lat); lb = Math.max(lb, p.lat); });
      return { lon: (lo + hi) / 2, lat: (la + lb) / 2 };
    })();

    /* --- card headings become buttons ------------------------------------- */
    if (!still) items.forEach(function (it) {
      var h = $(".c5-glob__name", it.el);
      var more = $(".c5-glob__more", it.el);
      if (!h) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "c5-glob__pick";
      /* the number shared with the stem on the globe (shown in variant B) */
      var no = document.createElement("span");
      no.className = "c5-glob__no";
      no.setAttribute("aria-hidden", "true");
      no.textContent = it.no;
      btn.appendChild(no);
      var txt = document.createElement("span");
      txt.className = "c5-glob__pick-txt";
      while (h.firstChild) {
        var node = h.firstChild;
        if (node.nodeType === 3 && node.textContent.trim()) {
          var span = document.createElement("span");
          span.className = "c5-glob__pick-n";
          span.textContent = node.textContent.trim();
          h.removeChild(node);
          txt.appendChild(span);
        } else if (node.nodeType === 3) {
          h.removeChild(node);
        } else {
          txt.appendChild(node);
        }
      }
      btn.appendChild(txt);
      h.appendChild(btn);
      if (more) { if (!more.id) more.id = it.id + "-dane"; it.more = more; }
      it.btn = btn;
      btn.addEventListener("click", function () {
        if (variant() === "B" && active === it && it.el.classList.contains("is-open")) { deselect(); return; }
        select(it, "card");
      });
      /* variant A: the whole card is a target for the mouse (links keep theirs) */
      it.el.addEventListener("click", function (e) {
        if (variant() !== "A" || e.target.closest("a, button")) return;
        select(it, "card");
      });
      it.el.addEventListener("mouseenter", function () { if (it.pt) it.pt.classList.add("is-hot"); });
      it.el.addEventListener("mouseleave", function () { if (it.pt) it.pt.classList.remove("is-hot"); });
    });

    /* --- stage: canvas for the globe, SVG for the points ------------------- */
    stage.innerHTML = "";
    var canvas = document.createElement("canvas");
    canvas.className = "c5-glob__canvas";
    stage.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var over = svg("svg", { "class": "c5-glob__svg", "aria-hidden": "true", focusable: "false" }, stage);

    /* variant łuki: the arcs lie under the head office and the points */
    var arcG = still && hq ? svg("g", { "class": "c5-glob__arcs" }, over) : null;
    var hqG = null, hqT = null;
    if (hq) {
      hqG = svg("g", { "class": "c5-glob__hq" }, over);
      svg("rect", { "class": "c5-glob__hq-dot", x: -4.5, y: -4.5, width: 9, height: 9, transform: "rotate(45)" }, hqG);
      var hqLabel = root.getAttribute("data-glob-hq-label");
      if (hqLabel) {
        var hs = root.getAttribute("data-glob-hq-strona") || "r";
        var ht = svg("text", { "class": "c5-glob__hq-t",
          "text-anchor": hs === "l" ? "end" : (hs === "t" || hs === "b") ? "middle" : "start",
          x: hs === "l" ? -12 : hs === "r" ? 12 : 0, y: hs === "t" ? -12 : hs === "b" ? 22 : 4 }, hqG);
        ht.textContent = hqLabel;
        hqT = { el: ht, side: hs };
      }
    }
    if (arcG) items.forEach(function (it, i) {
      it.arc = svg("path", { "class": "c5-glob__arc", pathLength: 1, style: "--i:" + i }, arcG);
    });
    items.forEach(function (it) {
      var g = svg("g", { "class": "c5-glob__pt", "data-glob-pt": it.id }, over);
      if (!still) {
        var t = svg("title", {}, g);
        var name = $(".c5-glob__pick-n", it.el);
        t.textContent = it.no + ". " + it.label + (name ? " – " + name.textContent : "");
      }
      /* variant A: a square with a label */
      var ga = svg("g", { "class": "c5-glob__pt-a" }, g);
      svg("rect", { "class": "c5-glob__pt-hit", x: -12, y: -12, width: 24, height: 24 }, ga);
      svg("rect", { "class": "c5-glob__pt-ring", x: -9, y: -9, width: 18, height: 18 }, ga);
      svg("rect", { "class": "c5-glob__pt-dot", x: -5, y: -5, width: 10, height: 10 }, ga);
      it.bg = svg("rect", { "class": "c5-glob__pt-bg", height: 20 }, ga);
      it.text = svg("text", { "class": "c5-glob__pt-t" }, ga);
      it.text.textContent = it.label;
      /* variant B: a numbered stem whose lower end sits on the country */
      var gb = svg("g", { "class": "c5-glob__pt-b" }, g);
      /* two click targets that never overlap a neighbour's: a strip along the
         stem (its width set by placeStems) and the box of the number */
      it.sHit = svg("rect", { "class": "c5-glob__pt-hit" }, gb);
      it.nHit = svg("rect", { "class": "c5-glob__pt-hit" }, gb);
      it.sLine = svg("line", { "class": "c5-glob__stem", x1: 0, y1: 0, x2: 0 }, gb);
      svg("rect", { "class": "c5-glob__stem-tip", x: -2, y: -2, width: 4, height: 4 }, gb);
      it.sBg = svg("rect", { "class": "c5-glob__stem-bg", x: -6, width: 24, height: 20, rx: 5 }, gb);
      it.sNo = svg("text", { "class": "c5-glob__stem-no", x: -1 }, gb);
      it.sNo.textContent = it.no + ".";
      it.stem = "";
      it.pt = g;
      if (!still) g.addEventListener("click", function () { select(it, "globe"); });
    });

    /* variant łuki: a row pointed at or focused lights its arc and point */
    function hot(it, on) {
      it.pt.classList.toggle("is-hot", on);
      if (it.arc) it.arc.classList.toggle("is-hot", on);
      root.classList.toggle("has-hot", items.some(function (x) { return x.pt.classList.contains("is-hot"); }));
    }
    if (still) items.forEach(function (it) {
      it.el.addEventListener("mouseenter", function () { hot(it, true); });
      it.el.addEventListener("mouseleave", function () { hot(it, false); });
      it.el.addEventListener("focusin", function () { hot(it, true); });
      it.el.addEventListener("focusout", function () { hot(it, false); });
    });

    var legend = document.createElement("ul");
    legend.className = "c5-glob__legend";
    legend.setAttribute("aria-hidden", "true");
    legend.innerHTML = '<li><span class="c5-glob__key"></span>dystrybutor</li>' +
      (hq ? '<li><span class="c5-glob__key c5-glob__key--hq"></span>siedziba CarboHort</li>' : "");
    stage.appendChild(legend);

    /* --- state ------------------------------------------------------------ */
    var L = { w: 0, h: 0, r: 0, k: 0, P: 0, cx: 0, cy: 0, dpr: 1, offset: 0, step: 0, size: 2, quiet: false,
      ax: 0, ay: 0, hx: 0, stem: STEM, v: "A" };
    var colors = {};
    var mask = null, dots = null;
    var active = null;
    var center = [0, 0];          /* lon, lat at the middle of the projection (rest position) */
    var shown = [0, 0];           /* what is on screen right now */
    var anim = null;              /* { from, to, t0, dur } */
    var drag = null;              /* pointer held on the globe */
    var glide = null;             /* { vx, vy (deg/ms), t } after a fling */
    var justDragged = false;
    var moved = false;            /* the user turned the globe by hand since the last pick */
    var raf = 0;
    var flat = null;              /* variant łuki: { proj, dots } */
    var currentVariant = null;

    function variant() { return root.classList.contains("c5-glob--srodek") ? "B" : "A"; }

    function readColors() {
      var cs = window.getComputedStyle(root);
      colors.dot = cs.getPropertyValue("--c5-glob-dot").trim() || "#a3a3a3";
      colors.sphere = cs.getPropertyValue("--c5-glob-sphere").trim() || "#fafafa";
      colors.edge = cs.getPropertyValue("--c5-glob-edge").trim() || "#e5e5e5";
      L.ratio = parseFloat(cs.getPropertyValue("--c5-glob-r")) || 0.7;
      L.spacing = parseFloat(cs.getPropertyValue("--c5-glob-spacing")) || 0;
      colors.dotMin = parseFloat(cs.getPropertyValue("--c5-glob-dot-min"));
      if (isNaN(colors.dotMin)) colors.dotMin = 0.3;
    }

    /* where a partner goes: variant A keeps it in the upper part of the dome,
       variant B at the anchor – the middle of the globe area left free by the
       heading and the cards */
    function focusFor(p) {
      if (L.v === "B" && L.r) return frameOn(p);
      return [p.lon, Math.max(-89, Math.min(89, p.lat - L.offset))];
    }
    /* variant B: the box around all the points and the head office on screen
       for a centre c */
    function pointsBox(c) {
      var b = [Infinity, Infinity, -Infinity, -Infinity];
      items.concat(hq ? [hq] : []).forEach(function (q) {
        var u = unit(q.lon, q.lat, c, L.P), x = L.cx + u[0] * L.r, y = L.cy - u[1] * L.r;
        b[0] = Math.min(b[0], x); b[1] = Math.min(b[1], y);
        b[2] = Math.max(b[2], x); b[3] = Math.max(b[3], y);
      });
      return b;
    }
    /* variant B: a picked partner goes to the anchor; the rest frame (all
       partners) puts the middle of their box there. Then the frame moves as
       little as needed to keep every point inside the free field (L.field:
       left, top, right, bottom of the points themselves – the stems and
       numbers stand above them). When the points do not fit, the left edge
       wins on a desktop (nothing slips under the cards) and the box is
       centred on a phone */
    function frameOn(p) {
      var X = L.ax, Y = L.ay, c, b, k;
      function solve() { return centreFor(p.lon, p.lat, (X - L.cx) / L.r, (L.cy - Y) / L.r, L.P); }
      function shift(lo, hi, keepLo) {
        if (lo <= hi) return Math.max(lo, Math.min(hi, 0));
        return keepLo ? lo : (lo + hi) / 2;
      }
      c = solve();
      if (p === homeAll) for (k = 0; k < 6; k++) {
        b = pointsBox(c);
        var dx = L.ax - (b[0] + b[2]) / 2, dy = L.ay - (b[1] + b[3]) / 2;
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) break;
        X += dx; Y += dy; c = solve();
      }
      var f = L.field;
      if (f) for (k = 0; k < 6; k++) {
        b = pointsBox(c);
        var sx = shift(f[0] - b[0], f[2] - b[2], L.sideR != null);
        var sy = shift(f[1] - b[1], f[3] - b[3], true);
        if (Math.abs(sx) < 0.5 && Math.abs(sy) < 0.5) break;
        X += sx; Y += sy; c = solve();
      }
      return c;
    }
    function homeFor() { return variant() === "B" || still ? homeAll : home; }

    function layout() {
      readColors();
      var v = variant();
      L.v = v;
      var w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      L.w = w; L.h = h;
      L.dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * L.dpr); canvas.height = Math.round(h * L.dpr);
      L.P = 0;
      L.hole = null;
      L.sideR = null;
      L.field = null;
      if (still) { layoutFlat(w, h); return; }
      if (v === "A") {
        L.r = w * L.ratio;
        L.cx = w / 2;
        L.cy = Math.max(28, h * 0.1) + L.r;
        var yTarget = h * 0.46;
        L.offset = Math.asin(Math.max(-1, Math.min(1, (L.cy - yTarget) / L.r))) / RAD;
      } else if (phoneMQ.matches) {
        /* phone: the upper part of a globe in a band under the heading */
        L.r = w * 1.4;
        L.cx = w * 0.5;
        L.cy = 14 + L.r;
        L.ax = w * 0.5; L.ay = h * 0.6;
        L.stem = STEM_S;
        L.field = [22, STEM_S + 30, w - 22, h - 14];
        L.P = PERSP_S;
        L.offset = 0;
      } else {
        /* desktop (Figma 528-184, mirrored): a globe about 1.1 × the section
           wide, coming out from under the left edge with its right rim in
           view, its top just under the heading, its centre close to the
           bottom edge of the collapsed section. The radius comes from the CSS
           (min-height of the body = radius - 16 px) and the centre is measured
           from the top, so the globe stays put when an open card makes the
           section taller. The anchor (where a partner turns to) lies in the
           free right part of the globe, between the cards and the rim. */
        var sr = stage.getBoundingClientRect();
        var hb = head ? head.getBoundingClientRect().bottom - sr.top : h * 0.3;
        var se = side ? side.getBoundingClientRect().right - sr.left : w * 0.3;
        L.sideR = se;
        var top = hb + 18;
        var mh = body ? parseFloat(window.getComputedStyle(body).minHeight) : 0;
        L.r = Math.max(160, mh > 0 ? mh + 16 : Math.min(w * 0.557, 900));
        L.cy = top + L.r;
        L.cx = w * 0.387;
        L.stem = STEM;
        L.P = PERSP;
        var x2 = Math.min(w - 16, L.cx + L.r * 0.85), x1 = Math.min(x2 - 60, se + 24);
        var y1 = top + L.stem + 40, y2 = L.cy - 40;
        L.ax = (x1 + x2) / 2; L.ay = (y1 + y2) / 2;
        L.field = [se + SIDE_GAP, top + L.stem + 28, x2, h - 24];
        L.offset = 0;
        measureHole();
      }
      L.k = L.r * gain(L.P);
      L.quiet = v === "A" && w < 600;
      items.forEach(function (it) { it.pt.classList.toggle("is-quiet", L.quiet); });
      var spacing = L.spacing || (w < 600 ? 6 : 7);
      var minStep = v === "B" ? 0.25 : 0.55;
      var step = Math.max(minStep, Math.min(2.2, spacing / L.k / RAD));
      step = Math.round(step * 20) / 20;
      if (mask && step !== L.step) dots = buildDots(mask, step);
      L.step = step;
      L.size = Math.max(1.4, Math.min(3.4, L.k * step * RAD * 0.42));
      placeLabels();
    }

    /* variant łuki: a flat map of Europe. A conformal conic projection (the
       usual one for maps of Europe) fitted to all points and the head office,
       with room left for the labels and the bows of the arcs; the land is
       drawn once in that projection and sampled on an even grid of screen
       points, so the dots keep one spacing across the map */
    function layoutFlat(w, h) {
      var small = smallMQ.matches;
      items.forEach(function (it) {
        var t = small && it.short ? it.short : it.label;
        if (it.text.textContent !== t) it.text.textContent = t;
        it.pt.classList.remove("is-quiet");
      });
      arcKey = "";
      var pts = items.map(function (it) { return [it.lon, it.lat]; });
      if (hq) pts.push([hq.lon, hq.lat]);
      var mx = w * (small ? 0.14 : 0.2), top = h * (small ? 0.17 : 0.15), bot = h * (small ? 0.17 : 0.18);
      var proj = d3.geoConicConformal().parallels([43, 57]).rotate([-homeAll.lon, 0])
        .fitExtent([[mx, top], [w - mx, h - bot]], { type: "MultiPoint", coordinates: pts })
        .clipExtent([[-20, -20], [w + 20, h + 20]]);
      var sp = L.spacing || (small ? 6 : 7);
      L.size = Math.max(1.4, Math.min(3.4, sp * 0.42));
      var xy = [];
      if (mask && mask.land) {
        var cw = Math.ceil(w), ch = Math.ceil(h);
        var cv = document.createElement("canvas");
        cv.width = cw; cv.height = ch;
        var c2 = cv.getContext("2d");
        c2.fillStyle = "#000";
        c2.beginPath();
        d3.geoPath(proj, c2)(mask.land);
        c2.fill();
        var px = c2.getImageData(0, 0, cw, ch).data;
        /* the grid is tied to the head office, so it does not slide over the
           land when the stage changes width */
        var o = hq ? proj([hq.lon, hq.lat]) : [w / 2, h / 2];
        var x0 = ((o[0] % sp) + sp) % sp, y0 = ((o[1] % sp) + sp) % sp;
        for (var y = y0; y < ch; y += sp) {
          for (var x = x0; x < cw; x += sp) {
            if (px[((y | 0) * cw + (x | 0)) * 4 + 3] > 127) xy.push(x, y);
          }
        }
      }
      flat = { proj: proj, dots: xy };
      placeLabels();
    }

    /* variant B, desktop: the column of cards (plus a few px) as seen on the
       stage – the land dots leave it out. Measured again when a card opens */
    function measureHole() {
      L.hole = null;
      if (L.v !== "B" || phoneMQ.matches || !side) return;
      var sr = stage.getBoundingClientRect(), r = list.getBoundingClientRect();
      if (!r.width || !r.height) return;
      L.hole = [r.left - sr.left - 5, r.top - sr.top - 5, r.right - sr.left + 5, r.bottom - sr.top + 5];
    }

    function placeLabels() {
      items.forEach(function (it) {
        var t = it.text, s = it.side;
        var anchor = s === "l" ? "end" : (s === "t" || s === "b") ? "middle" : "start";
        var x = s === "l" ? -15 : s === "r" ? 15 : 0;
        var y = s === "t" ? -15 : s === "b" ? 25 : 4;
        t.setAttribute("text-anchor", anchor);
        t.setAttribute("x", x); t.setAttribute("y", y);
        it.lx = x; it.ly = y; it.anchor = anchor;
        it.stem = "";
      });
      sizePill();
    }

    /* the dark pill behind the active label, sized to the text */
    function sizePill() {
      items.forEach(function (it) {
        if (it !== active) return;
        var tw = 0;
        try { tw = it.text.getComputedTextLength(); } catch (e) { tw = 0; }
        if (!tw) tw = it.label.length * 7.4;
        var padX = 7, x = it.lx;
        if (it.anchor === "end") x = it.lx - tw;
        else if (it.anchor === "middle") x = it.lx - tw / 2;
        it.bg.setAttribute("x", x - padX);
        it.bg.setAttribute("y", it.ly - 14);
        it.bg.setAttribute("width", tw + 2 * padX);
      });
    }

    /* variant B: every marker looks for a free spot, from the lowest point up.
       A stem may not run through another point, the head office or a stem
       already placed, and its number may not cover any of them. On a desktop
       globe two stems side by side also keep 14 px apart (also from the usual
       stem of a marker not placed yet) and the number is measured as the
       badge plus a 6 px margin (14 px above and below towards a point). Tried in turn: the usual stem with the number above it (then
       to its left), longer stems, shorter stems, and – when a point sits right
       above another – a stem hanging down with the number under it. */
    /* desktop: the box of the number is the box of its yellow badge (the
       active look), so an active marker keeps the same distance from its
       neighbours; the phone globe is too small for that air and keeps the box
       of the number and the plain rules */
    function roomy() { return L.stem !== STEM_S; }
    function stemBox(s) {
      if (!roomy()) {
        var a0 = s.left ? -19 : 1, a1 = s.left ? -1 : 19;
        return s.down ? [a0, s.len + 3, a1, s.len + 21] : [a0, -s.len - 19, a1, -s.len - 3];
      }
      var x0 = s.left ? -21 : -6, x1 = s.left ? 3 : 18;
      return s.down ? [x0, s.len + 2, x1, s.len + 22] : [x0, -s.len - 21, x1, -s.len - 1];
    }
    function setStem(it, s, hw) {
      var key = s.len + (s.left ? "l" : "r") + (s.down ? "d" : "u") + hw;
      if (it.stem === key) return;
      it.stem = key;
      var b = stemBox(s);
      it.sLine.setAttribute("y2", s.down ? s.len : -s.len);
      it.sNo.setAttribute("x", s.left ? -3 : -1);
      it.sNo.setAttribute("text-anchor", s.left ? "end" : "start");
      it.sNo.setAttribute("y", s.down ? s.len + 17 : -s.len - 6);
      it.sBg.setAttribute("x", s.left ? -21 : -6);
      it.sBg.setAttribute("y", s.down ? s.len + 2 : -s.len - 21);
      it.nHit.setAttribute("x", b[0] - 2); it.nHit.setAttribute("y", b[1] - 2);
      it.nHit.setAttribute("width", b[2] - b[0] + 4); it.nHit.setAttribute("height", b[3] - b[1] + 4);
      it.sHit.setAttribute("x", -hw); it.sHit.setAttribute("width", 2 * hw);
      it.sHit.setAttribute("y", s.down ? -7 : -s.len);
      it.sHit.setAttribute("height", s.len + 7);
    }
    var CANDS = null, CANDS_FOR = 0;
    function candidates(base) {
      if (CANDS && CANDS_FOR === base) return CANDS;
      var c = [], k, len;
      for (k = 0; k < 7; k++) { len = base + k * 14; c.push({ len: len, left: false }, { len: len, left: true }); }
      for (len = base - 12; len >= 30; len -= 12) c.push({ len: len, left: false }, { len: len, left: true });
      [0.5, 0.75, 1, 1.25].forEach(function (q) {
        len = Math.round(base * q);
        c.push({ len: len, left: false, down: true }, { len: len, left: true, down: true });
      });
      CANDS = c; CANDS_FOR = base;
      return c;
    }
    function hit(a, o) { return a[0] < o[2] && a[2] > o[0] && a[1] < o[3] && a[3] > o[1]; }
    function placeStems() {
      var base = L.stem;
      var vis = items.filter(function (it) { return it.visible; });
      vis.sort(function (a, b) { return b.sy - a.sy; });
      var pts = vis.map(function (it) { return [it.sx - 5, it.sy - 5, it.sx + 5, it.sy + 5]; });
      var hqBox = hqG && L.hq ? [L.hq[0] - 8, L.hq[1] - 8, L.hq[0] + 8, L.hq[1] + 8] : null;
      /* until a marker is placed, its usual stem stands in for it */
      var stems = vis.map(function (it) { return [it.sx - 2, it.sy - base, it.sx + 2, it.sy]; });
      var boxes = [], placed = [];
      function abs(it, b) { return [it.sx + b[0], it.sy + b[1], it.sx + b[2], it.sy + b[3]]; }
      function stemRect(it, s) {
        return s.down ? [it.sx - 4, it.sy + 6, it.sx + 4, it.sy + s.len]
                      : [it.sx - 4, it.sy - s.len, it.sx + 4, it.sy - 6];
      }
      /* 0 = a free spot; otherwise the weight of what it would cover (a stem
         through a point counts most), so a crowded globe still gets the
         least bad spot */
      function grow(b, m) { return [b[0] - m, b[1] - m, b[2] + m, b[3] + m]; }
      function cost(it, i, s) {
        var sr = stemRect(it, s), nb = abs(it, stemBox(s)), c = 0;
        var big = roomy(), m = big ? 6 : 0, mv = big ? 14 : 0;
        var nm = grow(nb, m), side = [sr[0] - m, sr[1], sr[2] + m, sr[3]];
        /* a point straight above or below a badge needs more air, or the stem,
           the badge and the next stem read as one line */
        var np = [nb[0] - m, nb[1] - mv, nb[2] + m, nb[3] + mv];
        if (nb[1] < 0 || nb[3] > L.h) c += 5;
        if (hqBox) { if (hit(sr, hqBox)) c += 100; if (hit(nm, hqBox)) c += 10; }
        for (var j = 0; j < vis.length; j++) {
          if (j === i) continue;
          if (hit(sr, pts[j])) c += 100;
          if (hit(np, pts[j])) c += 10;
          if (j < i) {
            if (hit(sr, placed[j])) c += 50;
            else if (hit(side, placed[j])) c += 20;
            if (hit(sr, grow(boxes[j], m)) || hit(nb, boxes[j])) c += 10;
          } else if (big && hit(side, grow(stems[j], 2))) c += 20;
          if (hit(nm, stems[j])) c += 10;
        }
        return c;
      }
      var cands = candidates(base);
      vis.forEach(function (it, i) {
        var pick = null, best = Infinity;
        for (var k = 0; k < cands.length; k++) {
          var c = cost(it, i, cands[k]);
          if (c < best) { best = c; pick = cands[k]; }
          if (!c) break;
        }
        it.st = pick;
        var sr = stemRect(it, pick);
        placed[i] = [it.sx - 4, Math.min(sr[1], it.sy - 7), it.sx + 4, Math.max(sr[3], it.sy + 7)];
        stems[i] = [it.sx - 2, sr[1], it.sx + 2, sr[3]];
        boxes[i] = abs(it, stemBox(pick));
      });
      /* the strip along each stem is as wide as its neighbours allow */
      vis.forEach(function (it, i) {
        var hw = 8, a = placed[i];
        for (var j = 0; j < vis.length; j++) {
          if (j === i) continue;
          var o = placed[j], b = boxes[j];
          if (a[1] < o[3] && a[3] > o[1]) hw = Math.min(hw, Math.abs(vis[j].sx - it.sx) / 2 - 0.5);
          if (a[1] < b[3] && a[3] > b[1]) {
            var gap = it.sx < b[0] ? b[0] - it.sx : it.sx > b[2] ? it.sx - b[2] : 0;
            hw = Math.min(hw, gap - 2.5);
          }
        }
        setStem(it, it.st, Math.max(2, Math.round(hw * 2) / 2));
      });
    }

    /* --- variant łuki: arcs and labels that keep clear of each other -------- */
    function segDist(p, a, b) {
      var vx = b[0] - a[0], vy = b[1] - a[1], wx = p[0] - a[0], wy = p[1] - a[1];
      var t = vx || vy ? Math.max(0, Math.min(1, (wx * vx + wy * vy) / (vx * vx + vy * vy))) : 0;
      var dx = wx - t * vx, dy = wy - t * vy;
      return Math.sqrt(dx * dx + dy * dy);
    }
    function polyDist(p, poly) {
      var m = Infinity;
      for (var i = 1; i < poly.length; i++) m = Math.min(m, segDist(p, poly[i - 1], poly[i]));
      return m;
    }
    function ptHalf() { return smallMQ.matches ? 3.75 : 5; }
    /* Every arc is the straight line from the head office to the point on the
       map, bent sideways by h · sin(πt), h = ±k · chord. Starting from the usual bow, each arc in
       turn (longest first) takes the k and side that cost least: passing
       closer than 8 px to the edge of another partner's point costs most,
       then the share of its length that runs within ARC_SEP px of another arc
       (the first 24 px from the head office do not count – all arcs start
       there), crossing another arc, a bow other than the usual one (the
       further from it, the more), running into the faded edges of the map
       and, a little, a downward bow. So two partners in nearly the same
       direction (Slovakia / Hungary, Romania / Bulgaria) bow to opposite
       sides. A few rounds settle it. */
    var arcKey = "", arcs = [];
    function fitArcs() {
      var h0 = L.hq;
      var key = L.w + "x" + L.h + ":" + h0[0].toFixed(1) + "," + h0[1].toFixed(1) + ":" + smallMQ.matches;
      if (key === arcKey) return;
      arcKey = key;
      var half = ptHalf(), clear = half + 8, sep = ARC_SEP, near = 24;
      arcs = items.map(function (it) {
        var s = [];
        for (var n = 0; n <= ARC_N; n++) {
          var t = n / ARC_N;
          s.push([h0[0] + (it.sx - h0[0]) * t, h0[1] + (it.sy - h0[1]) * t]);
        }
        var dx = it.sx - h0[0], dy = it.sy - h0[1], len = Math.sqrt(dx * dx + dy * dy) || 1;
        var nx = dy / len, ny = -dx / len;
        if (ny > 0) { nx = -nx; ny = -ny; }          /* side 1 bows upwards */
        return { it: it, s: s, len: len, nx: nx, ny: ny, k: ARC_K0, side: 1, pts: null };
      });
      function path(a, k, side) {
        var h = side * Math.max(8, k * a.len), out = [];
        for (var n = 0; n <= ARC_N; n++) {
          var b = Math.sin(Math.PI * n / ARC_N) * h;
          out.push([a.s[n][0] + a.nx * b, a.s[n][1] + a.ny * b]);
        }
        return out;
      }
      /* the number of times two polylines cross, away from the head office */
      function crossings(p, q) {
        var n = 0;
        for (var i = 1; i < p.length; i++) {
          var a0 = p[i - 1], a1 = p[i];
          var ex = a1[0] - h0[0], ey = a1[1] - h0[1];
          if (ex * ex + ey * ey < near * near) continue;
          for (var j = 1; j < q.length; j++) {
            var b0 = q[j - 1], b1 = q[j];
            var d1 = (b1[0] - b0[0]) * (a0[1] - b0[1]) - (b1[1] - b0[1]) * (a0[0] - b0[0]);
            var d2 = (b1[0] - b0[0]) * (a1[1] - b0[1]) - (b1[1] - b0[1]) * (a1[0] - b0[0]);
            if ((d1 > 0) === (d2 > 0)) continue;
            var d3 = (a1[0] - a0[0]) * (b0[1] - a0[1]) - (a1[1] - a0[1]) * (b0[0] - a0[0]);
            var d4 = (a1[0] - a0[0]) * (b1[1] - a0[1]) - (a1[1] - a0[1]) * (b1[0] - a0[0]);
            if ((d3 > 0) !== (d4 > 0)) n++;
          }
        }
        return n;
      }
      function cost(a, pts, k, side) {
        var dk = Math.abs(k - ARC_K0);
        var c = dk * 12 + dk * dk * 60 + (side < 0 ? 1.5 : 0);
        for (var j = 0; j < arcs.length; j++) {
          var b = arcs[j];
          if (b === a) continue;
          var d = polyDist([b.it.sx, b.it.sy], pts);
          if (d < clear) c += (clear - d) * 30;
          var close = 0;
          for (var n = 1; n < ARC_N; n++) {
            var q = pts[n];
            var ex = q[0] - h0[0], ey = q[1] - h0[1];
            if (ex * ex + ey * ey < near * near) continue;
            if (polyDist(q, b.pts) < sep) close++;
          }
          c += 40 * close / ARC_N;
          c += 4 * crossings(pts, b.pts);
        }
        for (var m = 0; m <= ARC_N; m++) {
          var y = pts[m][1], x = pts[m][0];
          if (y < L.h * 0.06) c += (L.h * 0.06 - y) * 0.5;
          if (y > L.h * 0.85) c += (y - L.h * 0.85) * 0.5;
          if (x < L.w * 0.08 || x > L.w * 0.92) c += 1;
        }
        return c;
      }
      arcs.forEach(function (a) { a.pts = path(a, a.k, a.side); });
      var order = arcs.slice().sort(function (p, q) { return q.len - p.len; });
      for (var pass = 0; pass < 5; pass++) {
        var changed = false;
        order.forEach(function (a) {
          var best = Infinity, bk = a.k, bs = a.side, bp = a.pts;
          [1, -1].forEach(function (side) {
            ARC_KS.forEach(function (k) {
              var p = path(a, k, side), cc = cost(a, p, k, side);
              if (cc < best - 1e-6) { best = cc; bk = k; bs = side; bp = p; }
            });
          });
          if (bk !== a.k || bs !== a.side) changed = true;
          a.k = bk; a.side = bs; a.pts = bp;
        });
        if (!changed) break;
      }
      arcs.forEach(function (a) {
        a.it.arc.setAttribute("d", a.pts.map(function (q, n) {
          return (n ? "L" : "M") + q[0].toFixed(1) + "," + q[1].toFixed(1);
        }).join(""));
      });
      placeTags();
    }

    /* labels: each takes the side of its point that covers least – another
       label, a point, the head office, an arc or the faded edge of the stage;
       the authored side (data-glob-strona) wins a tie. Head office first. */
    var SIDES = ["r", "l", "t", "b", "tr", "br", "tl", "bl"];
    function tagBox(side, w, H, half) {
      var g = half + 5, v = half + 3, e = half + 1;
      switch (side) {
        case "l": return [-g - w, -H / 2, -g, H / 2];
        case "t": return [-w / 2, -v - H, w / 2, -v];
        case "b": return [-w / 2, v, w / 2, v + H];
        case "tr": return [e, -v - H, e + w, -v];
        case "br": return [e, v, e + w, v + H];
        case "tl": return [-e - w, -v - H, -e, -v];
        case "bl": return [-e - w, v, -e, v + H];
        default: return [g, -H / 2, g + w, H / 2];
      }
    }
    function overlap(a, b) {
      var w = Math.min(a[2], b[2]) - Math.max(a[0], b[0]), h = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
      return w > 0 && h > 0 ? w * h : 0;
    }
    function placeTags() {
      var half = ptHalf();
      var tags = [];
      if (hqT && L.hq) tags.push({ el: hqT.el, x: L.hq[0], y: L.hq[1], pref: hqT.side, half: 6 });
      items.forEach(function (it) {
        if (it.visible) tags.push({ el: it.text, x: it.sx, y: it.sy, pref: it.side, half: half, it: it });
      });
      var dotsAt = items.filter(function (it) { return it.visible; }).map(function (it) {
        return { it: it, b: [it.sx - half - 2, it.sy - half - 2, it.sx + half + 2, it.sy + half + 2] };
      });
      if (L.hq) dotsAt.push({ it: null, b: [L.hq[0] - 8, L.hq[1] - 8, L.hq[0] + 8, L.hq[1] + 8] });
      var samples = [];
      arcs.forEach(function (a) { for (var n = 2; n < ARC_N - 1; n++) samples.push(a.pts[n]); });
      tags.forEach(function (t) {
        var fs = parseFloat(window.getComputedStyle(t.el).fontSize) || 11, w = 0;
        try { w = t.el.getBBox().width; } catch (e) { w = 0; }
        if (!w) w = (t.el.textContent || "").length * fs * 0.72;
        t.w = w; t.H = fs;
      });
      function cost(t, side, boxes) {
        var r = tagBox(side, t.w, t.H, t.half);
        var b = [t.x + r[0], t.y + r[1], t.x + r[2], t.y + r[3]];
        var c = side === t.pref ? 0 : side.length === 1 ? 1.5 : 2.5;
        boxes.forEach(function (o) { var a = overlap(b, o); if (a) c += 60 + a; });
        dotsAt.forEach(function (d) {
          if (d.it && d.it.text === t.el) return;
          if (!d.it && t.el === (hqT && hqT.el)) return;
          var a = overlap(b, d.b); if (a) c += 60 + a;
        });
        samples.forEach(function (q) {
          if (q[0] > b[0] - 2 && q[0] < b[2] + 2 && q[1] > b[1] - 2 && q[1] < b[3] + 2) c += 3;
        });
        if (b[0] < L.w * 0.07 || b[2] > L.w * 0.93 || b[1] < L.h * 0.05 || b[3] > L.h * 0.87) c += 30;
        return { c: c, r: r, b: b };
      }
      var placed = [];
      for (var pass = 0; pass < 2; pass++) {
        tags.forEach(function (t, i) {
          var others = [];
          tags.forEach(function (o, j) { if (j !== i && placed[j]) others.push(placed[j]); });
          var best = null;
          SIDES.forEach(function (side) {
            var k = cost(t, side, others);
            if (!best || k.c < best.c) { best = k; best.side = side; }
          });
          placed[i] = best.b;
          t.best = best;
        });
      }
      tags.forEach(function (t) {
        var r = t.best.r, s = t.best.side;
        var anchor = s === "t" || s === "b" ? "middle" : r[0] < 0 && r[2] <= 0 ? "end" : "start";
        var x = anchor === "middle" ? 0 : anchor === "end" ? r[2] : r[0];
        t.el.setAttribute("text-anchor", anchor);
        t.el.setAttribute("x", x.toFixed(1));
        t.el.setAttribute("y", (r[1] + t.H * 0.82).toFixed(1));
        t.el.setAttribute("data-strona", s);
      });
    }

    /* projection by hand – cheap enough for every dot each frame. P = 0 is
       the flat (orthographic) view, P > 1 the view from that distance */
    var LEVELS = 8, hqX = 0, hqY = 0;
    function draw(c) {
      if (still) { drawFlat(); shown = [c[0], c[1]]; return; }
      var lc = c[0] * RAD, pc = c[1] * RAD;
      var clc = Math.cos(lc), slc = Math.sin(lc), cpc = Math.cos(pc), spc = Math.sin(pc);
      var R = L.r, K = L.k, P = L.P, pin = P ? 1 / P : 0, cx = L.cx, cy = L.cy, w = L.w, h = L.h;
      ctx.setTransform(L.dpr, 0, 0, L.dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 2 * Math.PI);
      ctx.fillStyle = colors.sphere; ctx.fill();
      if (colors.edge && colors.edge !== "transparent") { ctx.lineWidth = 1; ctx.strokeStyle = colors.edge; ctx.stroke(); }
      if (dots) {
        /* project, then paint in a few alpha bands (fewer state changes) */
        var s = L.size, hs = s / 2, d = dots, m = 0, span = 1 - pin;
        var X = d.x, Y = d.y, A = d.a, S = d.s, ho = L.hole;
        for (var i = 0; i < d.n; i++) {
          var cl = d.cl[i] * clc + d.sl[i] * slc;          /* cos(lon - lonC) */
          var cosc = spc * d.sp[i] + cpc * d.cp[i] * cl;
          if (cosc <= pin) continue;
          var f = P ? K * (P - 1) / (P - cosc) : K;
          var sl = d.sl[i] * clc - d.cl[i] * slc;          /* sin(lon - lonC) */
          var x = cx + f * d.cp[i] * sl;
          var y = cy - f * (cpc * d.sp[i] - spc * d.cp[i] * cl);
          if (x < -s || y < -s || x > w + s || y > h + s) continue;
          if (P) {
            /* no dots under the column of cards (they would show in the gaps) */
            if (ho && x > ho[0] && x < ho[2] && y > ho[1] && y < ho[3]) continue;
            /* seen from close by, the rows crowd towards the rim: on screen the
               spacing across the rim shrinks to qz = (P - 1)(P cos c - 1) / (P - cos c)²
               of the spacing in the middle. Where that drops below 0.7 the dot
               shrinks with it (a dot is 0.42 of the spacing, so even its
               diagonal stays short of the next row); from RIM_FULL down to
               RIM_CUT it also fades out, and below RIM_CUT it is left out, so
               the crowded rows never read as stripes */
            var qz = (P - 1) * (P * cosc - 1) / ((P - cosc) * (P - cosc));
            if (qz < RIM_CUT) continue;
            var fz = Math.min(1, (qz - RIM_CUT) / (RIM_FULL - RIM_CUT));
            var az = (colors.dotMin + (1 - colors.dotMin) * (cosc - pin) / span) * fz * (3 - 2 * fz) * fz;
            if (az < 0.5 / LEVELS) continue;
            var sk = s * Math.min(1, 1.4 * qz);
            S[m] = sk; X[m] = x - sk / 2; Y[m] = y - sk / 2;
            A[m] = Math.min(LEVELS - 1, (az * LEVELS) | 0); m++;
            continue;
          }
          X[m] = x - hs; Y[m] = y - hs;
          A[m] = Math.min(LEVELS - 1, ((cosc - pin) / span * LEVELS) | 0); m++;
        }
        ctx.fillStyle = colors.dot;
        for (var k = 0; k < LEVELS; k++) {
          var q = (k + 0.5) / LEVELS;
          /* variant B: the band is the dot's own opacity (rim fade included) */
          ctx.globalAlpha = P ? q : colors.dotMin + (1 - colors.dotMin) * q;
          if (P) { for (var j = 0; j < m; j++) if (A[j] === k) ctx.fillRect(X[j], Y[j], S[j], S[j]); }
          else for (var j2 = 0; j2 < m; j2++) if (A[j2] === k) ctx.fillRect(X[j2], Y[j2], s, s);
        }
        ctx.globalAlpha = 1;
      }
      function put(g, lon, lat, it) {
        var l = lon * RAD, p = lat * RAD;
        var cl = Math.cos(l) * clc + Math.sin(l) * slc;
        var sl = Math.sin(l) * clc - Math.cos(l) * slc;
        var cosc = spc * Math.sin(p) + cpc * Math.cos(p) * cl;
        var f = P ? K * (P - 1) / (P - cosc) : K;
        var x = cx + f * Math.cos(p) * sl;
        var y = cy - f * (cpc * Math.sin(p) - spc * Math.cos(p) * cl);
        var vis = cosc > pin + 0.06 * (1 - pin) && x > -40 && x < w + 40 && y > -40 && y < h + 40;
        g.setAttribute("transform", "translate(" + x.toFixed(1) + "," + y.toFixed(1) + ")");
        g.style.display = vis ? "" : "none";
        if (it) { it.sx = x; it.sy = y; } else { hqX = x; hqY = y; }
        return vis;
      }
      if (hqG) L.hq = put(hqG, hq.lon, hq.lat) ? [hqX, hqY] : null;
      items.forEach(function (it) { it.visible = put(it.pt, it.lon, it.lat, it); });
      if (L.v === "B") placeStems();
      shown = [c[0], c[1]];
      root.setAttribute("data-glob-center", norm180(c[0]).toFixed(2) + "," + c[1].toFixed(2));
    }

    /* variant łuki: the flat map – land dots, the head office, the points,
       then the arcs and the labels */
    function drawFlat() {
      var w = L.w, h = L.h;
      ctx.setTransform(L.dpr, 0, 0, L.dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!flat) return;
      var d = flat.dots, s = L.size, hs = s / 2;
      ctx.fillStyle = colors.dot;
      ctx.globalAlpha = FLAT_ALPHA;
      for (var i = 0; i < d.length; i += 2) ctx.fillRect(d[i] - hs, d[i + 1] - hs, s, s);
      ctx.globalAlpha = 1;
      function put(g, lon, lat) {
        var q = flat.proj([lon, lat]);
        g.setAttribute("transform", "translate(" + q[0].toFixed(1) + "," + q[1].toFixed(1) + ")");
        g.style.display = "";
        return q;
      }
      L.hq = hqG ? put(hqG, hq.lon, hq.lat) : null;
      items.forEach(function (it) {
        var q = put(it.pt, it.lon, it.lat);
        it.sx = q[0]; it.sy = q[1]; it.visible = true;
      });
      if (arcG && L.hq) fitArcs();
      else placeTags();
    }

    /* --- animation loop --------------------------------------------------- */
    function current(now) {
      if (anim) {
        var k = Math.min(1, (now - anim.t0) / anim.dur);
        var e = d3.easeCubicInOut(k);
        var c = [anim.from[0] + anim.dlon * e, anim.from[1] + (anim.to[1] - anim.from[1]) * e];
        if (k >= 1) { anim = null; center = [norm180(c[0]), c[1]]; return center.slice(); }
        return c;
      }
      if (drag && drag.on) return center.slice();
      if (glide) {
        var dt = Math.min(40, now - glide.t);
        glide.t = now;
        center = [norm180(center[0] + glide.vx * dt), clampLat(center[1] + glide.vy * dt)];
        var dec = Math.exp(-dt / 280);
        glide.vx *= dec; glide.vy *= dec;
        if (Math.abs(glide.vx) + Math.abs(glide.vy) < 0.0015 || reduced.matches) glide = null;
        return center.slice();
      }
      /* at rest the globe stays where it is – nothing turns it by itself */
      return center.slice();
    }
    function frame(now) {
      raf = 0;
      var c = current(now);
      if (Math.abs(c[0] - shown[0]) > 1e-4 || Math.abs(c[1] - shown[1]) > 1e-4) draw(c);
      if (anim || glide) kick();
    }
    function kick() { if (!raf) raf = window.requestAnimationFrame(frame); }
    function redraw() { draw(shown); kick(); }

    function turnTo(target, instant) {
      var now = window.performance.now();
      glide = null;
      if (instant || reduced.matches) {
        anim = null; center = [norm180(target[0]), target[1]];
        draw(center); kick();
        return;
      }
      var from = shown.slice();
      var dlon = norm180(target[0] - from[0]);
      var dist = Math.sqrt(dlon * dlon + Math.pow(target[1] - from[1], 2));
      anim = { from: from, to: target, dlon: dlon, t0: now, dur: Math.min(1700, 650 + dist * 14) };
      center = [norm180(target[0]), target[1]];
      kick();
    }

    /* --- free rotation by dragging (not in variant łuki) --------------------- */
    function local(e) {
      var r = stage.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    }
    function onGlobe(p) {
      var dx = p[0] - L.cx, dy = p[1] - L.cy;
      return L.r > 0 && dx * dx + dy * dy <= L.r * L.r && p[1] >= 0 && p[1] <= L.h;
    }
    function endDrag(e, cancelled) {
      if (!drag) return;
      var d = drag;
      drag = null;
      if (!d.on) return;
      root.classList.remove("is-dragging");
      try { if (stage.hasPointerCapture && stage.hasPointerCapture(d.id)) stage.releasePointerCapture(d.id); } catch (err) { /* already released */ }
      var now = window.performance.now();
      justDragged = true;
      window.setTimeout(function () { justDragged = false; }, 0);
      if (cancelled || reduced.matches) return;
      /* a short glide when released while moving */
      var s = null;
      for (var i = d.hist.length - 1; i >= 0; i--) { if (now - d.hist[i][0] > 90) break; s = d.hist[i]; }
      if (!s || now - d.hist[d.hist.length - 1][0] > 60 || now - s[0] < 12) return;
      var dt = now - s[0];
      var vx = norm180(center[0] - s[1]) / dt, vy = (center[1] - s[2]) / dt;
      if (Math.abs(vx) + Math.abs(vy) < 0.004) return;
      glide = { vx: vx, vy: vy, t: now };
      kick();
    }
    if (!still) {
      stage.addEventListener("pointerdown", function (e) {
        if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
        var p = local(e);
        if (!onGlobe(p)) return;
        drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY,
          touch: e.pointerType === "touch", on: false, hist: [] };
      });
      stage.addEventListener("pointermove", function (e) {
        if (!drag && e.pointerType === "mouse") stage.style.cursor = onGlobe(local(e)) ? "grab" : "";
      });
      stage.addEventListener("pointerleave", function (e) { if (!drag && e.pointerType === "mouse") stage.style.cursor = ""; });
      /* the drag itself is followed on the window, so it survives leaving the stage */
      window.addEventListener("pointermove", function (e) {
        if (!drag || e.pointerId !== drag.id) return;
        var dx0 = e.clientX - drag.x0, dy0 = e.clientY - drag.y0;
        if (!drag.on) {
          if (dx0 * dx0 + dy0 * dy0 < DRAG_MIN * DRAG_MIN) return;
          /* touch: a mostly vertical move belongs to the page */
          if (drag.touch && Math.abs(dy0) > Math.abs(dx0)) { drag = null; return; }
          drag.on = true;
          moved = true;
          anim = null; glide = null;
          center = [norm180(shown[0]), shown[1]];
          drag.x = e.clientX; drag.y = e.clientY;
          root.classList.add("is-dragging");
          if (!drag.touch) { try { stage.setPointerCapture(e.pointerId); } catch (err) { /* capture is optional */ } }
        }
        var k = 1 / (L.k * RAD);                         /* degrees per pixel at the centre */
        var mx = e.clientX - drag.x, my = drag.touch ? 0 : e.clientY - drag.y;
        drag.x = e.clientX; drag.y = e.clientY;
        center = [norm180(center[0] - mx * k), clampLat(center[1] + my * k)];
        var now = window.performance.now();
        drag.hist.push([now, center[0], center[1]]);
        if (drag.hist.length > 12) drag.hist.shift();
        kick();
      });
      window.addEventListener("pointerup", function (e) { if (drag && e.pointerId === drag.id) endDrag(e, false); });
      window.addEventListener("pointercancel", function (e) { if (drag && e.pointerId === drag.id) endDrag(e, true); });
      /* the click that ends a drag does not pick a point */
      stage.addEventListener("click", function (e) {
        if (justDragged) { e.stopPropagation(); e.preventDefault(); }
      }, true);
    }

    /* --- selection -------------------------------------------------------- */
    function syncAria() {
      var v = variant();
      items.forEach(function (it) {
        var on = it === active;
        it.el.classList.toggle("is-active", on);
        it.pt.classList.toggle("is-active", on);
        if (!it.btn) return;
        if (v === "A") {
          it.btn.setAttribute("aria-pressed", on ? "true" : "false");
          it.btn.removeAttribute("aria-expanded");
          it.btn.removeAttribute("aria-controls");
          it.el.classList.remove("is-open");
        } else {
          it.btn.removeAttribute("aria-pressed");
          var open = on;
          it.el.classList.toggle("is-open", open);
          it.btn.setAttribute("aria-expanded", open ? "true" : "false");
          if (it.more) it.btn.setAttribute("aria-controls", it.more.id);
        }
      });
      /* the active point is drawn last, above its neighbours */
      if (active) over.appendChild(active.pt);
      if (L.v === "B" && L.w) { measureHole(); draw(shown); }
      sizePill();
      if (nav) {
        var cnt = $(".c5-glob__count", nav);
        var i = items.indexOf(active);
        if (cnt) cnt.textContent = (i < 0 ? "–" : (i + 1)) + " / " + items.length + (active ? " · " + active.label : "");
      }
    }

    function revealCard(it, from) {
      var v = variant();
      var smooth = reduced.matches ? "auto" : "smooth";
      if (v === "A") {
        /* land on a snap position (a card's start) that shows the whole card,
           with the card as close to the middle of the row as the ends allow */
        var cards = items.map(function (x) { return x.el; });
        var idx = cards.indexOf(it.el);
        var base = cards[0].offsetLeft;
        var pitch = cards.length > 1 ? cards[1].offsetLeft - base : it.el.offsetWidth;
        var per = Math.max(1, Math.floor((list.clientWidth + 2) / pitch));
        var lo = list.scrollLeft, hi = lo + list.clientWidth;
        var a = it.el.offsetLeft - base, b = a + it.el.offsetWidth;
        if (a >= lo - 1 && b <= hi + 1 && from !== "switch") return;
        var first = Math.max(0, Math.min(cards.length - per, idx - Math.floor((per - 1) / 2)));
        var left = Math.min(list.scrollWidth - list.clientWidth, cards[first].offsetLeft - base);
        if (list.scrollTo) list.scrollTo({ left: left, behavior: smooth }); else list.scrollLeft = left;
      } else if (from === "globe") {
        /* bring the opened card into view when it is off screen (phones) */
        var r = it.el.getBoundingClientRect();
        if (r.top < 60 || r.bottom > window.innerHeight - 20) {
          CX5.scrollTo(Math.max(0, r.top + window.scrollY - window.innerHeight * 0.35), smooth);
        }
      }
    }

    function select(it, from, instant) {
      active = it;
      moved = false;
      syncAria();
      turnTo(focusFor(it), instant);
      revealCard(it, from);
    }
    function deselect() {
      active = null;
      syncAria();
    }

    function step(dir) {
      var i = items.indexOf(active);
      if (i < 0) i = dir > 0 ? -1 : 0;
      select(items[(i + dir + items.length) % items.length], "nav");
    }
    if (nav) {
      var prev = $("[data-glob-prev]", nav), next = $("[data-glob-next]", nav);
      if (prev) prev.addEventListener("click", function () { step(-1); });
      if (next) next.addEventListener("click", function () { step(1); });
    }

    /* --- variant switch (class on the root) -------------------------------- */
    function applyVariant() {
      currentVariant = variant();
      if (nav) nav.hidden = currentVariant !== "A";
      /* variants B and łuki show the legend under the lead, variant A on the stage */
      if ((currentVariant === "B" || still) && head) head.appendChild(legend); else stage.appendChild(legend);
      list.scrollLeft = 0; list.scrollTop = 0;
      drag = null; glide = null; moved = false; root.classList.remove("is-dragging");
      syncAria();
      layout();
      anim = null;
      center = focusFor(active || homeFor());
      draw(center);
      if (active) revealCard(active, "switch");
      kick();
    }
    if (window.MutationObserver) {
      new MutationObserver(function () {
        if (variant() !== currentVariant) applyVariant();
      }).observe(root, { attributes: true, attributeFilter: ["class"] });
    }

    /* the frame of variant B depends on the heading and the cards: keep the
       partner in view when the stage changes size */
    var lastSize = "";
    function relayout() {
      var size = stage.clientWidth + "x" + stage.clientHeight;
      if (size === lastSize) return;
      lastSize = size;
      var was = (L.v === "B" || still) && !moved && !drag && !glide ? (active || homeFor()) : null;
      layout();
      if (was && !anim) { center = focusFor(was); draw(center); }
      redraw();
    }
    CX5.register({ resize: function () { lastSize = ""; relayout(); } });
    if (window.ResizeObserver) new ResizeObserver(function () { relayout(); }).observe(stage);
    if (phoneMQ.addEventListener) phoneMQ.addEventListener("change", function () { lastSize = ""; relayout(); });
    if (still && smallMQ.addEventListener) smallMQ.addEventListener("change", function () { lastSize = ""; relayout(); });

    /* links like kontakt.html#dyst-rumunia select the partner; the bus scrolls */
    if (!still) CX5.onHash(function (hash) {
      if (!hash || hash.length < 2) return false;
      var id;
      try { id = decodeURIComponent(hash.slice(1)); } catch (e) { return false; }
      if (byId[id]) select(byId[id], "hash", true);
      return false;
    });

    /* --- start ------------------------------------------------------------ */
    root.classList.add("is-ready");
    applyVariant();
    /* variant łuki: the arcs draw in once the stage is well in view */
    if (arcG) {
      if (reduced.matches || !window.IntersectionObserver) root.classList.add("is-drawn");
      else {
        var drawIO = new IntersectionObserver(function (es) {
          if (!es[es.length - 1].isIntersecting) return;
          root.classList.add("is-drawn");
          drawIO.disconnect();
        }, { threshold: 0.4 });
        drawIO.observe(stage);
      }
    }
    lastSize = stage.clientWidth + "x" + stage.clientHeight;
    try { root.dispatchEvent(new CustomEvent("c5-glob:ready", { bubbles: true })); } catch (e) { /* old browsers */ }

    var url = root.getAttribute("data-glob-land");
    if (url) {
      loadMask(url).then(function (m) {
        mask = m; L.step = 0; layout(); root.classList.add("has-land"); redraw();
      }, function (err) {
        if (window.console) window.console.warn("CE-96: land data not loaded (" + url + ")", err && err.message);
      });
    }
  });
})();
