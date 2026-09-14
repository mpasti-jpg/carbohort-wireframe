/* ===== Nakładka indeksu content elementów (CE) – makiety CarboHort V5 =======
   Development overlay for the CE index. For every element carrying
   `data-ce="CE-NN"` it draws a 1 px red line on the element's top edge and a
   small label right under it, linking to the generated index
   (`../ce-indeks.html#CE-NN`). Names come from `window.CW_CE` (../ce-rejestr.js);
   without the registry the label shows the bare code.

   Wiring on a page (the overlay itself is never imported by other scripts):
       <head> … <script src="../ce-rejestr.js"></script>
       </body> … <script src="ce-overlay.js"></script>   (after the page scripts)

   Design notes:
   - The overlay owns two layers of its own and NEVER writes to page elements
     (no `position:relative`, no attributes, no classes on page nodes).
   - Stacking: page content and sticky chrome sit at 0–100, dots at 90, mega
     menu at 1000, page overlays at 1300 and lightboxes at 1400 (tokens.css:
     --w-z-dropdown/-overlay/-modal/-popover/-toast). So the in-flow layer sits
     at 900 (above the page, below every dialog, which is what the contract
     asks for) and the labels of out-of-flow CE (an open lightbox) go to a
     separate fixed layer at 9000 so they stay readable above that dialog.
   - Scroll cost: lines live in document coordinates, so scrolling changes
     nothing; a scroll listener is attached only while at least one fixed
     label is on screen, and it only moves those few labels.
   - A CE root may have no box of its own (`display: contents`, the way
     `#sezon-licznik` sits in the static layout of CARBOMAT MATA). Its box is
     then the union of the boxes of its children – see unionRect().
   - Labels of out-of-flow CE stay inside the window: pushed left when they
     would be cut off at the right edge, and lifted above the element when it
     sits at the bottom edge, where the label would cover it.
   - `data-ce-od="<selector>"`: the CE starts, visually, at the top edge of the
     element that selector points at (a section heading standing above the first
     block of the CE, say `#dowod` for `#dowod-liczby`). Only the Y of the line
     and of the label moves; nesting, indent and width stay as they are, and a
     selector that matches nothing leaves the element's own edge in place.
   - Observer storms: pages drive their scenes by writing custom properties
     (`--facts-p`, `--pro-s`) on section elements every frame. Style mutations
     that touch custom properties only are dropped, and every remaining
     observer-driven pass is spaced by at least MIN_GAP ms.
   Teksty interfejsu po polsku, komentarze po angielsku, półpauza „–”.        */
(function () {
  "use strict";

  if (window.__cwCeOverlay) return;      /* a page must not load it twice */
  window.__cwCeOverlay = true;

  var KEY = "cw-ce-overlay";             /* localStorage: "0" = hidden */
  var INDENT = 18;                       /* px of shift per nesting level */
  var MIN_GAP = 120;                     /* ms between observer-driven passes */
  var LATE = [400, 1500];                /* ms after load: pick up late markup */
  var UNION = 4;                         /* levels to descend for a boxless CE */
  var DOL = 40;                          /* px from the window bottom: label goes above */

  var CSS = [
    '.cw-ce-layer{position:absolute;top:0;left:0;width:0;height:0;pointer-events:none;z-index:900}',
    '.cw-ce-fx{position:fixed;top:0;left:0;width:0;height:0;pointer-events:none;z-index:9000}',
    '.cw-ce-line{position:absolute;height:1px;background:#d00;opacity:.9}',
    '.cw-ce-tag{position:absolute;display:block;box-sizing:border-box;pointer-events:auto;',
    'max-width:min(60vw,34em);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;',
    'padding:1px 6px;background:#fff;color:#1b1b1b;border:1px solid #d00;border-top:0;',
    'border-radius:0 0 3px 3px;text-decoration:none;',
    'font:11px/1.5 ui-sans-serif,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}',
    '.cw-ce-tag:hover{background:#fff4f4;text-decoration:underline}',
    /* Out-of-flow CE (an open lightbox): the label is anchored to the viewport. */
    '.cw-ce-tag--fx{position:fixed;border-top:1px solid #d00;border-radius:3px}',
    '.cw-ce-hide{display:none!important}',
    '.cw-ce-switch{position:fixed;left:0;bottom:19px;z-index:9001;height:18px;padding:0 8px;',
    'box-sizing:border-box;display:flex;align-items:center;cursor:pointer;',
    'background:#fff;color:#a00;border:1px solid #d00;border-left:0;border-radius:0 4px 4px 0;',
    'opacity:.78;transition:opacity .15s ease;',
    'font:11px/1 ui-sans-serif,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}',
    '.cw-ce-switch:hover{opacity:1}',
    '@media print{.cw-ce-layer,.cw-ce-fx,.cw-ce-switch{display:none!important}}'
  ].join("");

  /* ---- state ------------------------------------------------------------ */
  var entries = [];          /* {el, code, level, line, tag, fx, vis, odSel, odEl, kid} */
  var seen = null;           /* elements already turned into entries */
  var layer, fxLayer, sw;
  var on = true;
  var rafId = 0, timerId = 0, lastRun = 0;
  var scrollRaf = 0, scrollBound = false;
  var elRO = null, bodyRO = null, attrMO = null, codeMO = null;

  function now() { return Date.now ? Date.now() : new Date().getTime(); }

  /* ---- registry (optional) ---------------------------------------------- */
  function regCe() { return (window.CW_CE && window.CW_CE.ce) || null; }

  function indexHref(code) {
    var meta = window.CW_CE && window.CW_CE.meta;
    var file = (meta && meta.indeks) || "ce-indeks.html";
    return "../" + file + "#" + code;
  }

  function labelText(el, code) {
    var db = regCe(), d = db && db[code];
    var txt = code;
    if (d && d.nazwa) txt += " · " + d.nazwa;
    var v = el.getAttribute("data-ce-wariant");
    if (v) txt += " · " + v;
    return txt;
  }

  /* ---- helpers ---------------------------------------------------------- */
  function hide(node) { if (node && !node.__off) { node.__off = 1; node.classList.add("cw-ce-hide"); } }
  function show(node) { if (node && node.__off) { node.__off = 0; node.classList.remove("cw-ce-hide"); } }

  /* `up` places the node by its BOTTOM edge (a label standing above a fixed
     element that touches the bottom of the window); the unused offset is reset
     to `auto`, so a node that changes sides is never stretched by both. */
  function place(node, x, y, up) {
    up = !!up;
    if (node.__x !== x) { node.__x = x; node.style.left = x + "px"; }
    if (node.__up !== up) {
      node.__up = up;
      node.style.top = up ? "auto" : "";
      node.style.bottom = up ? "" : "auto";
      node.__y = undefined;
    }
    if (node.__y !== y) {
      node.__y = y;
      if (up) node.style.bottom = y + "px"; else node.style.top = y + "px";
    }
  }

  /* A CE root can be `display: contents` (`#sezon-licznik` in the static layout
     of CARBOMAT MATA: below 900 px, with reduced motion or without JS). Such an
     element has no box at all – `getBoundingClientRect()` gives 0×0 and the line
     would land in the corner of the page. Its box is then the union of the boxes
     of its children, taken level by level: a child with no box of its own is
     descended into (down to UNION levels), a fixed child is skipped – it belongs
     to the viewport, not to this block. Returns null when nothing here is drawn
     and the caller hides the line, exactly as it did for a 0×0 element. */
  function unionRect(el, depth) {
    var kids = el.children, box = null;
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i], r = k.getBoundingClientRect();
      if (r.width || r.height) {
        if (getComputedStyle(k).position === "fixed") continue;
      } else {
        r = depth > 0 ? unionRect(k, depth - 1) : null;
        if (!r) continue;
      }
      box = box ? { top: Math.min(box.top, r.top), left: Math.min(box.left, r.left),
                    right: Math.max(box.right, r.right), bottom: Math.max(box.bottom, r.bottom) }
                : { top: r.top, left: r.left, right: r.right, bottom: r.bottom };
    }
    if (!box) return null;
    box.width = box.right - box.left;
    box.height = box.bottom - box.top;
    return box;
  }

  /* The rectangle a CE is drawn from: its own box, the union of its children when
     it has none, null when neither is drawn. */
  function boxOf(e) {
    var r = e.el.getBoundingClientRect();
    if (r.width || r.height) return r;
    r = unionRect(e.el, UNION);
    if (r) watchKid(e);
    return r;
  }

  /* A ResizeObserver never fires for an element with no box, so the union above
     would go stale after a reflow. The first element child is watched as well –
     that one does resize. */
  function watchKid(e) {
    if (e.kid || !elRO) return;
    var k = e.el.firstElementChild;
    if (!k) return;
    e.kid = k;
    elRO.observe(k);
  }

  /* The label of an out-of-flow CE follows its element, but has to stay inside
     the window: pushed left when it would be cut off at the right edge (the dot
     navigation hugs it), and lifted above the element when that element sits at
     the bottom edge (the status badge), where the label would cover it. */
  function placeFxTag(e, r, top) {
    var vw = document.documentElement.clientWidth;
    var vh = document.documentElement.clientHeight;
    var x = Math.round(r.left) + e.level * INDENT;
    var w = e.tag.offsetWidth;              /* the label is visible by now */
    if (w) x = Math.min(x, Math.round(vw - w));
    if (x < 0) x = 0;
    if (vh - top < DOL) {
      /* lifted labels share the bottom strip with the overlay switch: start
         to the right of it instead of underneath it */
      var sw = document.querySelector(".cw-ce-switch");
      if (sw) { var sr = sw.getBoundingClientRect(); if (x < sr.right + 4) x = Math.round(sr.right + 4); }
      place(e.tag, x, Math.round(vh - top), true);
    } else place(e.tag, x, Math.round(top), false);
  }

  /* An element is "out of the page flow" when it or an ancestor is fixed.
     Cached per entry; invalidated on class/style mutations and on resize. */
  function isFixed(el) {
    var n = el;
    while (n && n.nodeType === 1 && n !== document.documentElement) {
      if (getComputedStyle(n).position === "fixed") return true;
      n = n.parentElement;
    }
    return false;
  }

  /* Top edge to draw on: the `data-ce-od` element when its selector resolves,
     otherwise null (the caller falls back to the element's own edge). The lookup
     is cached per entry and dropped by invalidate(); the resolved element is
     watched too, so a heading that reflows moves the line with it. */
  function odTop(e) {
    if (!e.odSel) return null;
    if (e.odEl === undefined) {
      try { e.odEl = document.querySelector(e.odSel) || null; }
      catch (err) { e.odEl = null; }        /* a broken selector must not throw */
      if (e.odEl && elRO) elRO.observe(e.odEl);
    }
    if (!e.odEl || !e.odEl.isConnected) return null;
    var r = e.odEl.getBoundingClientRect();
    if (!r.width && !r.height) return null;
    return r.top;
  }

  /* An out-of-flow CE (the advisor dock, a closed lightbox) keeps a box even
     while it is hidden with `visibility`/`opacity` instead of `display`, so the
     rectangle alone would put a label over an empty corner. Contract §3.2: no
     label until the thing is actually visible. Only checked for fixed elements –
     in the page flow a scene may legitimately animate a block from opacity 0. */
  function fxVisible(el) {
    var cs = getComputedStyle(el);
    return cs.visibility !== "hidden" && parseFloat(cs.opacity || "1") > 0.01;
  }

  function nestingLevel(el) {
    var lvl = 0, p = el.parentElement;
    while (p && p.nodeType === 1) {
      if (p.hasAttribute("data-ce")) lvl++;
      p = p.parentElement;
    }
    return lvl;
  }

  /* ---- layers ----------------------------------------------------------- */
  function build() {
    var st = document.createElement("style");
    st.setAttribute("data-cw-ce", "");
    st.textContent = CSS;
    document.head.appendChild(st);

    layer = document.createElement("div");
    layer.className = "cw-ce-layer";
    layer.setAttribute("aria-hidden", "true");

    fxLayer = document.createElement("div");
    fxLayer.className = "cw-ce-fx";
    fxLayer.setAttribute("aria-hidden", "true");

    sw = document.createElement("button");
    sw.type = "button";
    sw.className = "cw-ce-switch";
    sw.title = "Nakładka indeksu CE (Alt+Shift+C)";
    sw.addEventListener("click", function () { setOn(!on, true); });

    document.body.appendChild(layer);
    document.body.appendChild(fxLayer);
    document.body.appendChild(sw);
  }

  /* ---- collecting [data-ce] --------------------------------------------- */
  function collect() {
    var list = document.querySelectorAll("[data-ce]");
    var added = 0;
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (seen.has ? seen.has(el) : seen.indexOf(el) >= 0) continue;
      var code = (el.getAttribute("data-ce") || "").trim();
      if (!code) continue;

      var line = document.createElement("div");
      line.className = "cw-ce-line cw-ce-hide";
      line.__off = 1;

      var tag = document.createElement("a");
      tag.className = "cw-ce-tag cw-ce-hide";
      tag.__off = 1;
      tag.tabIndex = -1;                 /* dev overlay: stays out of the tab order */
      tag.href = indexHref(code);
      tag.textContent = labelText(el, code);
      var note = el.getAttribute("data-ce-uwaga");
      if (note) tag.title = note;

      layer.appendChild(line);
      layer.appendChild(tag);

      entries.push({ el: el, code: code, level: nestingLevel(el), line: line, tag: tag,
                     fx: null, vis: false, kid: null,
                     odSel: el.getAttribute("data-ce-od") || null, odEl: undefined });
      if (seen.has) seen.add(el); else seen.push(el);
      if (elRO) elRO.observe(el);
      if (attrMO) attrMO.observe(el, {
        attributes: true, attributeOldValue: true,
        attributeFilter: ["hidden", "class", "style", "data-open", "aria-hidden", "open",
                          "data-ce-od"]
      });
      added++;
    }
    /* Names may arrive with the registry after this script – refresh them. */
    refreshLabels();
    return added;
  }

  function refreshLabels() {
    if (!regCe()) return;
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i], t = labelText(e.el, e.code);
      if (e.tag.textContent !== t) e.tag.textContent = t;
    }
  }

  /* ---- measuring -------------------------------------------------------- */
  function runMeasure() {
    rafId = 0;
    lastRun = now();
    if (!on) return;

    var vw = document.documentElement.clientWidth;   /* not 100vw: the scrollbar must not widen the page */
    var sy = window.pageYOffset || document.documentElement.scrollTop || 0;
    var fxLive = 0;

    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (!e.el.isConnected) { e.vis = false; hide(e.line); hide(e.tag); continue; }

      var r = boxOf(e);
      if (!r) { e.vis = false; hide(e.line); hide(e.tag); continue; }

      if (e.fx === null) e.fx = isFixed(e.el);
      e.vis = true;
      var ind = e.level * INDENT;
      var top = odTop(e);
      if (top === null) top = r.top;

      if (e.fx) {
        if (!fxVisible(e.el)) { e.vis = false; hide(e.line); hide(e.tag); continue; }
        fxLive++;
        if (e.tag.parentNode !== fxLayer) fxLayer.appendChild(e.tag);
        e.tag.classList.add("cw-ce-tag--fx");
        show(e.tag);
        placeFxTag(e, r, top);
        hide(e.line);
      } else {
        if (e.tag.parentNode !== layer) layer.appendChild(e.tag);
        e.tag.classList.remove("cw-ce-tag--fx");
        var y = Math.round(top + sy);
        var w = Math.max(0, vw - ind);
        if (e.line.__w !== w) { e.line.__w = w; e.line.style.width = w + "px"; }
        place(e.line, ind, y);
        place(e.tag, ind, y + 1);
        show(e.line);
        show(e.tag);
      }
    }
    bindScroll(fxLive > 0);
  }

  /* Cheap scroll pass: only the labels of out-of-flow CE move with the viewport. */
  function runFixed() {
    scrollRaf = 0;
    if (!on) return;
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (!e.fx || !e.vis) continue;
      var r = boxOf(e);
      if (!r) continue;
      var top = odTop(e);
      placeFxTag(e, r, top === null ? r.top : top);
    }
  }

  function onScroll() { if (!scrollRaf) scrollRaf = requestAnimationFrame(runFixed); }

  function bindScroll(want) {
    if (want === scrollBound) return;
    scrollBound = want;
    if (want) window.addEventListener("scroll", onScroll, { passive: true });
    else window.removeEventListener("scroll", onScroll);
  }

  /* `urgent` = a direct user/browser event (load, resize, toggle): run on the
     next frame. Everything else is spaced by MIN_GAP, so a scene writing
     inline styles on a CE cannot drag a measure pass into every frame. */
  function measureSoon(urgent) {
    if (!on || rafId) return;
    if (urgent) {
      if (timerId) { clearTimeout(timerId); timerId = 0; }
      rafId = requestAnimationFrame(runMeasure);
      return;
    }
    if (timerId) return;
    var wait = MIN_GAP - (now() - lastRun);
    if (wait <= 0) rafId = requestAnimationFrame(runMeasure);
    else timerId = setTimeout(function () { timerId = 0; rafId = requestAnimationFrame(runMeasure); }, wait);
  }

  function invalidate() {
    for (var i = 0; i < entries.length; i++) {
      entries[i].fx = null;
      entries[i].odEl = undefined;
    }
  }

  function rescan(urgent) {
    collect();
    measureSoon(urgent !== false);
  }

  /* ---- on / off --------------------------------------------------------- */
  function setOn(v, persist) {
    on = !!v;
    if (persist) { try { localStorage.setItem(KEY, on ? "1" : "0"); } catch (err) { /* private mode */ } }
    sw.textContent = on ? "CE: wł." : "CE: wył.";
    sw.setAttribute("aria-pressed", on ? "true" : "false");
    sw.setAttribute("aria-label", on ? "Ukryj nakładkę CE" : "Pokaż nakładkę CE");
    layer.classList.toggle("cw-ce-hide", !on);
    fxLayer.classList.toggle("cw-ce-hide", !on);
    if (on) { invalidate(); measureSoon(true); }
    else bindScroll(false);
  }

  function initialState() {
    var q = null;
    try {
      var m = /[?&]ce=([01])/.exec(location.search || "");
      if (m) q = m[1] === "1";
    } catch (err) { /* ignored */ }
    if (q !== null) {
      try { localStorage.setItem(KEY, q ? "1" : "0"); } catch (err) { /* ignored */ }
      return q;
    }
    try { return localStorage.getItem(KEY) !== "0"; } catch (err) { return true; }
  }

  /* ---- observers -------------------------------------------------------- */
  /* Drop style mutations that changed custom properties only – scroll-driven
     scenes write those every frame and they never move an element's box. */
  function stripVars(s) {
    return (s || "").replace(/(^|;)\s*--[^:;]+:[^;]*/g, "$1");
  }

  function attrHandler(records) {
    for (var i = 0; i < records.length; i++) {
      var rec = records[i];
      if (rec.attributeName === "style") {
        var el = rec.target;
        if (stripVars(rec.oldValue) === stripVars(el.getAttribute("style"))) continue;
      }
      for (var j = 0; j < entries.length; j++) {
        if (entries[j].el !== rec.target) continue;
        entries[j].fx = null;
        entries[j].odSel = rec.target.getAttribute("data-ce-od") || null;
        entries[j].odEl = undefined;
      }
      measureSoon(false);
      return;
    }
  }

  function wire() {
    if (window.MutationObserver) {
      attrMO = new MutationObserver(attrHandler);
      /* New or re-coded CE elements: cheap, `data-ce` is written by hand. */
      codeMO = new MutationObserver(function () { invalidate(); rescan(false); });
      codeMO.observe(document.documentElement,
                     { subtree: true, attributes: true, attributeFilter: ["data-ce", "data-ce-od"] });
    }
    if (window.ResizeObserver) {
      elRO = new ResizeObserver(function () { measureSoon(false); });
      bodyRO = new ResizeObserver(function () { measureSoon(false); });
      bodyRO.observe(document.body);
    }
    window.addEventListener("resize", function () { invalidate(); measureSoon(true); });
    window.addEventListener("load", function () { invalidate(); rescan(true); });
    window.addEventListener("hashchange", function () { measureSoon(false); });
    document.addEventListener("keydown", function (e) {
      if (e.altKey && e.shiftKey && (e.key === "C" || e.key === "c" || e.code === "KeyC")) {
        e.preventDefault();
        setOn(!on, true);
      }
    });
    for (var i = 0; i < LATE.length; i++) {
      (function (ms) { setTimeout(function () { invalidate(); rescan(false); }, ms); })(LATE[i]);
    }
  }

  /* ---- start ------------------------------------------------------------ */
  function init() {
    seen = (typeof Set === "function") ? new Set() : [];
    build();
    wire();
    collect();
    setOn(initialState(), false);
    measureSoon(true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
