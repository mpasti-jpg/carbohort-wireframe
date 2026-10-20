/* ===== CE-13 · Przypięta scena produktu (rejestr: ce-rejestr.js) =============
   One track per product: 100svh of sticky stage + run screens, where run =
   intro + hold × N + outro and N is the number of frames read from the DOM. The
   per-frame state is written on the frame elements, so neither this module nor
   CE-13-scena-produktu.css knows how many frames a product has.

   Round of 18.10.2026 (E12, Mateusz): the scene no longer follows the wheel.
   The scroll loop reads one getBoundingClientRect() of the track, turns it into
   s – screens scrolled into the track – and compares it with THRESHOLDS:
     s ≥ dock                     → is-docked: the hero panel retracts into the
                                    strip, the photo opens; a moment later is-ui:
                                    wash, tabs, first card
     s ≥ intro + hold × k         → frame k is current (is-on on its layer and
                                    crop, is-past on the crops above it)
     s ≥ intro + hold × N         → is-ui off: the writing and the wash go, the
                                    clear photo stays until the track lets go
   Crossing a threshold back plays the same CSS transition backwards; between two
   thresholds nothing changes but the parallax of the photos (--par), which
   follows the page – the progress sign asked for in E12. Discrete writes only:
   classes, aria-pressed and a handful of custom properties.
   The track constants come from CSS (--use-intro / --use-hold / --use-outro /
   --use-dock on .c5-use), so a page whose cards need more reading time keeps
   its own track length without touching this file.
   The geometry of the hero (where the packshot and the name stand in the middle
   of the panel) is measured on every resize and written as --use-pk-x,
   --use-nm-x and --use-pk-s; CSS moves the pieces between the two layouts.
   No markup -> no-op. ======================================================= */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var arts = $$(".c5-use");
  if (!arts.length) return;

  var PAR = 4;              /* parallax of a photo over its frame, ± % of the layer height (+PAR at the start of its stretch, -PAR at the end) */
  var UI_DELAY = 360;       /* ms after docking before the writing comes in            */
  var NAME_HERO = 40 / 24;  /* the name in the hero against the strip (Figma 40 / 24 px) */

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
          bar: $(".c5-use__bar", art), pack: $(".c5-use__pack", art), name: $(".c5-use__name", art),
          crops: crops, layers: $$("[data-use-layer]", art), n: n,
          INTRO: cvar(cs, "--use-intro", .45), HOLD: cvar(cs, "--use-hold", .9),
          OUTRO: cvar(cs, "--use-outro", .35), DOCK: cvar(cs, "--use-dock", .12),
          stageH: 0, docked: null, ui: null, act: -1, uiTimer: 0, mids: {}
        };
    it.run = it.INTRO + it.HOLD * n + it.OUTRO;
    crops.forEach(function (c, i) {
      /* how many tab lines stand below this one – the tabs are a single column
         growing upwards from the bottom edge of the scene */
      c.style.setProperty("--tabi", String(n - 1 - i));
      it.mids[c.getAttribute("data-use-crop")] = it.INTRO + it.HOLD * (i + .5);
    });
    return it;
  }).filter(function (it) { return it.n > 0 && it.track && it.stage; });

  /* the hero layout of the panel: the packshot (as tall as the hero allows) and
     the name (40 px) side by side in the middle of the panel, 40 px apart – the
     same gap as the strip; returned as shifts from their places in the strip */
  function heroGeometry(it) {
    if (!it.bar || !it.pack || !it.name) return;
    var img = it.pack;
    var r = (img.naturalWidth && img.naturalHeight) ? img.naturalWidth / img.naturalHeight
          : (parseFloat(img.getAttribute("width")) / parseFloat(img.getAttribute("height"))) || .66;
    put(it.art, "--use-pk-r", r.toFixed(4));
    var bcs = window.getComputedStyle(it.bar);
    var barW = it.bar.clientWidth,
        padL = parseFloat(bcs.paddingLeft) || 0,
        padR = parseFloat(bcs.paddingRight) || 0,
        gap = parseFloat(bcs.columnGap) || 40,
        stripH = parseFloat(window.getComputedStyle(it.art).getPropertyValue("--use-pk-h")) || 88,
        heroH = img.offsetHeight || 1,                  /* the layout height is the hero height */
        slotW = stripH * r,
        nameW = it.name.offsetWidth,
        content = barW - padL - padR,
        side = (content - slotW - nameW - 3 * gap) / 2,
        slotL = padL + side + gap,                      /* strip: 1fr | slot | name | 1fr */
        nameL = slotL + slotW + gap,
        packW = heroH * r,
        heroNameW = nameW * NAME_HERO,
        groupL = barW / 2 - (packW + gap + heroNameW) / 2;
    put(it.art, "--use-pk-s", (stripH / heroH).toFixed(4));
    put(it.art, "--use-pk-x", String(Math.round(groupL + packW / 2 - (slotL + slotW / 2))));
    put(it.art, "--use-nm-x", String(Math.round(groupL + packW + gap - nameL)));
  }

  function instant(it) {
    it.art.classList.add("is-instant");
    void it.art.offsetWidth;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { it.art.classList.remove("is-instant"); });
    });
  }

  /* is-ui on: after UI_DELAY when it follows the dock (the panel first, then the
     writing), at once otherwise; off: at once. A pending „on" is kept while the
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
        end = it.INTRO + it.HOLD * it.n,
        act = clamp(Math.floor((s - it.INTRO) / it.HOLD), 0, it.n - 1),
        ui = docked && s < end;
    if (first) instant(it);
    if (docked !== it.docked) {
      it.docked = docked;
      it.art.classList.toggle("is-docked", docked);
      if (!docked) setUi(it, false, true);
    }
    setFrame(it, act);
    /* the writing waits for the panel only right after a dock; coming back from
       the outro it returns at once */
    setUi(it, ui, first || !ui || s > it.DOCK + it.INTRO);
    /* parallax: each photo drifts from +PAR to -PAR over its own stretch of the
       track (the first one from the dock on), so the current one always moves.
       20.10.2026 (owner): the direction is reversed – the photo travels up the
       frame while the page scrolls down, and back down when it scrolls up. */
    for (var i = 0; i < it.layers.length; i++) {
      var a = i === 0 ? it.DOCK : it.INTRO + it.HOLD * i,
          b = it.INTRO + it.HOLD * (i + 1) + (i === it.n - 1 ? it.OUTRO : 0),
          q = clamp((s - a) / (b - a), 0, 1);
      put(it.layers[i], "--par", (PAR * (1 - 2 * q)).toFixed(2));
    }
  }

  function layout() {
    items.forEach(function (it) {
      if (!CX5.motionOn()) {
        it.track.style.height = ""; it.stageH = 0;
        window.clearTimeout(it.uiTimer); it.uiTimer = 0;
        it.art.classList.remove("is-docked", "is-ui");
        it.docked = null; it.ui = null; it.act = -1;
        it.crops.forEach(function (c) { c.classList.remove("is-on", "is-past"); });
        it.layers.forEach(function (l) { l.classList.remove("is-on"); l.style.removeProperty("--par"); l["_cx--par"] = undefined; });
        return;
      }
      it.track.style.height = "calc(100svh + " + Math.round(window.innerHeight * it.run) + "px)";
      it.stageH = it.stage.offsetHeight;
      heroGeometry(it);
      it.fresh = true;
    });
  }

  function frame() {
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (!it.stageH) continue;
      var s = -it.track.getBoundingClientRect().top / window.innerHeight;
      apply(it, s, it.fresh || it.docked === null);
      it.fresh = false;
    }
  }

  /* the packshot and the type may arrive after the first layout: measure again */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { items.forEach(function (it) { if (it.stageH) heroGeometry(it); }); });
  }
  items.forEach(function (it) {
    if (it.pack && !it.pack.complete) it.pack.addEventListener("load", function () { if (it.stageH) heroGeometry(it); }, { once: true });
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

  CX5.register({ scroll: frame, resize: layout });
})();
