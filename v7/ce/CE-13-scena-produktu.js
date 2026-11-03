/* ===== CE-13 · Przypięta scena produktu (rejestr: ce-rejestr.js) =============
   One track per product: 100svh of sticky stage + run screens, where run =
   intro + hold × N + outro and N is the number of frames read from the DOM. The
   per-frame state is written on the frame elements, so neither this module nor
   CE-13-scena-produktu.css knows how many frames a product has.

   Round of 18.10.2026 (E12, Mateusz): the scene no longer follows the wheel.
   The scroll loop reads one getBoundingClientRect() of the track, turns it into
   s – screens scrolled into the track – and compares it with THRESHOLDS:
     s ≥ dock                     → is-ui: wash, tabs, first description
     s ≥ intro + hold × k         → frame k is current (is-on on its layer and
                                    crop, is-past on the crops above it)
     s ≥ intro + hold × N         → is-ui off: the writing and the wash go, the
                                    clear photo stays until the track lets go
   Crossing a threshold back plays the same CSS transition backwards; between two
   thresholds nothing changes but the parallax of the photos (--par), which
   follows the page – the progress sign asked for in E12. Discrete writes only:
   classes, aria-pressed and a handful of custom properties.
   The track constants come from CSS (--use-intro / --use-hold / --use-outro /
   --use-dock on .c5-use), so a page whose descriptions need more reading time
   keeps its own track length without touching this file.

   Round of 02.11.2026 (Figma map 3:330): the strip is a rail of anchors to the
   tracks of the products. In the pinned scene a click jumps to the start of the
   chosen track without a glide – a smooth scroll would run through every frame
   on the way; the strip stands in the same place in each stage, so the jump
   reads as a switch of the product. In the static layout the anchors stay plain
   in-page links (ce/00-base.js).

   Variant lista (.c5-use--lista), moved here from carbohumic-dolistny.js:
   · the place of every name in one rolling list: --use-y (px, from the bottom
     line of its crop) and data-dist ("0" open, "1" a neighbour, "far"); the open
     name stands one line above the bottom, the next one under it, the previous
     one above it – heights are measured, so a name that wraps pushes its
     neighbours instead of covering them;
   · data-leaves (0–4) on the open crop: the hold of a term is cut into five
     parts, the first without a leaf, so the fourth leaf comes before the next
     term opens and scrolling back takes them away one by one.
   · the whole list on demand (round of 03.11.2026, U-10): pointing at a name or
     focusing one sets is-all on the root – every name stands in one column on
     the bottom line, a click scrolls to that term.

   ONE BOARD (round of 03.11.2026, U-11 / U-17): the products of a section are
   one pinned board. Every product keeps its own article and track (so its id,
   its anchor and the dot of CE-07 still mark where it starts), but from the
   second product on a track overlaps the previous one by one screen (CSS), so
   its stage pins at the very moment the previous one would let go. The script
   groups the articles of a parent, marks every one but the current is-behind
   (its stage fades out under the current one) and gives the outro – the clear
   photo before the board lets go – to the last product only.
   No markup -> no-op. ======================================================= */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var arts = $$(".c5-use");
  if (!arts.length) return;

  var PAR = 4;              /* parallax of a photo over its frame, ± % of the layer height (+PAR at the start of its stretch, -PAR at the end) */
  var UI_DELAY = 360;       /* ms before the writing comes in after the dock threshold  */
  var LEAF_STEPS = 5;       /* lista: parts of a hold – no leaf, then one to four        */

  function cvar(cs, name, dflt) {
    var v = parseFloat(cs.getPropertyValue(name));
    return isNaN(v) ? dflt : v;
  }
  /* write a custom property only when it really changes */
  function put(el, name, val) {
    var k = "_cx" + name;
    if (el[k] === val) return;
    el[k] = val;
    el.style.setProperty(name, val);
  }

  var items = arts.map(function (art) {
    var cs = window.getComputedStyle(art);
    var crops = $$("[data-use-crop]", art),
        n = crops.length,
        it = {
          art: art, track: $("[data-use-track]", art), stage: $(".c5-use__stage", art),
          crops: crops, layers: $$("[data-use-layer]", art), n: n,
          INTRO: cvar(cs, "--use-intro", .1), HOLD: cvar(cs, "--use-hold", .9),
          OUTRO: cvar(cs, "--use-outro", .35), DOCK: cvar(cs, "--use-dock", -.5),
          stageH: 0, docked: null, ui: null, act: -1, uiTimer: 0, mids: {},
          list: art.classList.contains("c5-use--lista"), GAP: cvar(cs, "--use-list-gap", 20),
          listH: [], listAct: -1, leaves: -1
        };
    crops.forEach(function (c, i) {
      /* how many tab lines stand below this one – the tabs are a single column
         growing upwards from the bottom edge of the scene */
      c.style.setProperty("--tabi", String(n - 1 - i));
      it.mids[c.getAttribute("data-use-crop")] = it.INTRO + it.HOLD * (i + .5);
    });
    return it;
  }).filter(function (it) { return it.n > 0 && it.track && it.stage; });

  /* the board: the articles of one parent, in document order; only the last one
     keeps the outro, so the board lets go after the last product */
  var groups = [];
  items.forEach(function (it) {
    var g = groups.filter(function (x) { return x.parent === it.art.parentNode; })[0];
    if (!g) { g = { parent: it.art.parentNode, items: [], cur: -1 }; groups.push(g); }
    g.items.push(it);
  });
  groups.forEach(function (g) {
    g.items.forEach(function (it, k) {
      it.last = k === g.items.length - 1;
      it.run = it.INTRO + it.HOLD * it.n + (it.last ? it.OUTRO : 0);
    });
  });

  /* lista: y of every name against the bottom line of its crop, for the open term a;
     with is-all every name stands in one column ending on the bottom line */
  function listPlace(it, a) {
    var h = it.listH, n = it.n, y = [], i;
    if (it.all) {
      y[n - 1] = 0;
      for (i = n - 2; i >= 0; i--) y[i] = y[i + 1] - h[i + 1] - it.GAP;
    } else {
      var lift = (a + 1 < n ? h[a + 1] : Math.min.apply(null, h)) + it.GAP;
      y[a] = -lift;
      for (i = a + 1; i < n; i++) y[i] = y[i - 1] + it.GAP + h[i];
      for (i = a - 1; i >= 0; i--) y[i] = y[i + 1] - h[i + 1] - it.GAP;
    }
    it.crops.forEach(function (c, k) {
      var d = Math.abs(k - a);
      c.style.setProperty("--use-y", String(Math.round(y[k])));
      c.setAttribute("data-dist", d === 0 ? "0" : d === 1 ? "1" : "far");
    });
  }
  function listMeasure(it) {
    it.listH = it.crops.map(function (c) {
      var t = $("[data-use-tab]", c);
      return t ? t.offsetHeight : 0;
    });
    it.listAct = -1; it.leaves = -1;
  }
  function listFrame(it, s, a) {
    var k = clamp(Math.floor(((s - it.INTRO - it.HOLD * a) / it.HOLD) * LEAF_STEPS), 0, LEAF_STEPS - 1);
    if (a !== it.listAct) { it.listAct = a; it.leaves = -1; listPlace(it, a); }
    if (k === it.leaves) return;
    it.leaves = k;
    it.crops.forEach(function (c, i) {
      if (i === a) c.setAttribute("data-leaves", String(k));
      else c.removeAttribute("data-leaves");
    });
  }
  function listClear(it) {
    it.crops.forEach(function (c) {
      c.style.removeProperty("--use-y");
      c.removeAttribute("data-dist");
      c.removeAttribute("data-leaves");
    });
    it.listAct = -1; it.leaves = -1;
  }

  function instant(it) {
    it.art.classList.add("is-instant");
    void it.art.offsetWidth;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { it.art.classList.remove("is-instant"); });
    });
  }

  /* is-ui on: after UI_DELAY when it follows the dock threshold, at once
     otherwise; off: at once. A pending „on" is kept while the
     reader goes on scrolling and dropped when the target changes. */
  function setUi(it, on, now) {
    if (on && it.uiTimer && !now) return;
    window.clearTimeout(it.uiTimer);
    it.uiTimer = 0;
    if (on === it.ui) return;
    if (on && !now) {
      it.uiTimer = window.setTimeout(function () {
        it.uiTimer = 0; it.ui = true; it.art.classList.add("is-ui");
      }, UI_DELAY);
      return;
    }
    it.ui = on;
    it.art.classList.toggle("is-ui", on);
  }

  function setFrame(it, act) {
    if (act === it.act) return;
    it.act = act;
    it.crops.forEach(function (c, k) {
      c.classList.toggle("is-on", k === act);
      c.classList.toggle("is-past", k < act);
      var tab = $("[data-use-tab]", c);
      if (tab) tab.setAttribute("aria-pressed", k === act ? "true" : "false");
    });
    it.layers.forEach(function (l, k) { l.classList.toggle("is-on", k === act); });
  }

  /* s = screens scrolled into the track; first = the first paint after a layout */
  function apply(it, s, first) {
    var docked = s >= it.DOCK,
        /* a product before the last hands the board over with its writing on */
        end = it.last ? it.INTRO + it.HOLD * it.n : Infinity,
        act = clamp(Math.floor((s - it.INTRO) / it.HOLD), 0, it.n - 1),
        ui = docked && s < end;
    if (first) instant(it);
    if (docked !== it.docked) {
      it.docked = docked;
      if (!docked) setUi(it, false, true);
    }
    setFrame(it, act);
    if (it.list) listFrame(it, s, act);
    /* the writing waits only right after the dock threshold; coming back from
       the outro it returns at once */
    setUi(it, ui, first || !ui || s > it.DOCK + it.INTRO);
    /* parallax: each photo drifts from +PAR to -PAR over its own stretch of the
       track (the first one from the dock on), so the current one always moves.
       20.10.2026 (owner): the direction is reversed – the photo travels up the
       frame while the page scrolls down, and back down when it scrolls up. */
    for (var i = 0; i < it.layers.length; i++) {
      var a = i === 0 ? it.DOCK : it.INTRO + it.HOLD * i,
          b = it.INTRO + it.HOLD * (i + 1) + (i === it.n - 1 && it.last ? it.OUTRO : 0),
          q = clamp((s - a) / (b - a), 0, 1);
      put(it.layers[i], "--par", (PAR * (1 - 2 * q)).toFixed(2));
    }
  }

  function layout() {
    items.forEach(function (it) {
      if (!CX5.motionOn()) {
        it.track.style.height = ""; it.stageH = 0;
        window.clearTimeout(it.uiTimer); it.uiTimer = 0;
        it.art.classList.remove("is-ui");
        it.docked = null; it.ui = null; it.act = -1;
        it.art.classList.remove("is-behind", "is-all"); it.all = false;
        it.crops.forEach(function (c) { c.classList.remove("is-on", "is-past"); });
        it.layers.forEach(function (l) { l.classList.remove("is-on"); l.style.removeProperty("--par"); l["_cx--par"] = undefined; });
        if (it.list) listClear(it);
        return;
      }
      it.track.style.height = "calc(100svh + " + Math.round(window.innerHeight * it.run) + "px)";
      it.stageH = it.stage.offsetHeight;
      if (it.list) listMeasure(it);
      it.fresh = true;
    });
    groups.forEach(function (g) { g.cur = -1; });
  }

  function frame() {
    groups.forEach(function (g) {
      if (!g.items[0].stageH) return;
      /* the current product: the last one whose track has reached the top (a
         couple of pixels early – an anchor jump lands on a fraction of a pixel) */
      var cur = 0, ss = g.items.map(function (it, k) {
        var s = -it.track.getBoundingClientRect().top / window.innerHeight;
        if (k && s >= -2 / window.innerHeight) cur = k;
        return s;
      });
      if (cur !== g.cur) {
        g.cur = cur;
        g.items.forEach(function (it, k) { it.art.classList.toggle("is-behind", k !== cur); });
      }
      g.items.forEach(function (it, k) {
        apply(it, ss[k], it.fresh || it.docked === null);
        it.fresh = false;
      });
    });
  }

  /* lista: the type arrives after the first layout, so the names are measured again */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      items.forEach(function (it) { if (it.list && it.stageH) { listMeasure(it); it.fresh = true; } });
      frame();
    });
  }

  /* The strip: in the pinned scene a tab jumps to the start of the track of its
     product and hands the focus over to the same tab there. The static layout
     leaves the anchor to ce/00-base.js. */
  $$(".c5-use__prod").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (!CX5.motionOn() || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var hash = link.getAttribute("href"),
          target = items.filter(function (it) { return "#" + it.art.id === hash; })[0];
      if (!target) return;
      e.preventDefault();
      target.fresh = true;
      var top = target.track.getBoundingClientRect().top + window.scrollY;
      if (CX5.lenis) CX5.lenis.scrollTo(top, { immediate: true, force: true });
      else CX5.scrollTo(top, "auto");
      var twin = $('.c5-use__prod[href="' + hash + '"]', target.art);
      if (twin) twin.focus({ preventScroll: true });
    });
  });

  /* Tabs stay clickable: a click scrolls to the middle of the matching hold
     (static layout: to the matching frame). Nothing is trapped, no wheel. */
  items.forEach(function (it) {
    $$("[data-use-tab]", it.art).forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute("data-use-tab");
        var soft = CX5.reducedMQ.matches ? "auto" : "smooth";
        if (!it.stageH) {
          var layer = $('[data-use-layer="' + key + '"]', it.art);
          if (layer) layer.scrollIntoView({ behavior: soft, block: "start" });
          return;
        }
        var top = it.track.getBoundingClientRect().top + window.scrollY + (it.mids[key] || 0) * window.innerHeight;
        CX5.scrollTo(Math.round(top), soft);
      });
    });
  });

  /* lista: the whole list while a name is pointed at or focused (U-10). Leaving
     a name closes it after a short pause, so the pointer can cross the gap to
     the next one; touch never opens it (a tap is a click). */
  items.forEach(function (it) {
    if (!it.list) return;
    var timer = 0;
    function show(on) {
      window.clearTimeout(timer); timer = 0;
      if (on === !!it.all || (on && !it.stageH)) return;
      it.all = on;
      it.art.classList.toggle("is-all", on);
      if (it.listAct >= 0) listPlace(it, it.listAct);
    }
    function later() {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () { show(false); }, 320);
    }
    $$("[data-use-tab]", it.art).forEach(function (tab) {
      tab.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") show(true); });
      tab.addEventListener("pointerleave", later);
      tab.addEventListener("focus", function () { show(true); });
      tab.addEventListener("blur", later);
    });
  });

  CX5.register({ scroll: frame, resize: layout });
})();
