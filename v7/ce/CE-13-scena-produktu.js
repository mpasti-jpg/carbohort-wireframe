/* ===== CE-13 · Przypięta scena produktu (rejestr: ce-rejestr.js) =============
   One track per product: 100svh of sticky stage + runway(N) screens, where N is
   the number of frames read from the DOM. Base = carbohumic.js 60 (the N-frame
   generalisation of the two-frame pattern module of carbomat.js 60): the
   per-frame numbers are written on the frame elements, so neither this module
   nor CE-13-scena-produktu.css knows how many frames a product has.
   The scroll loop reads a single getBoundingClientRect() of the track, turns it
   into p ∈ [0,1] and writes custom properties; CSS does every interpolation.
   NOTHING here is timed: the bar, the photo, the veil, the tabs and every card
   are pure functions of p, so the whole choreography scrubs with the wheel,
   holds when the wheel holds and reverses when the reader scrolls back. The only
   discrete writes are keyword properties (--ovis, --bvis) and aria-pressed.
   The track constants come from CSS (--use-intro / --use-hold / --use-switch /
   --use-outro / --use-card on .c5-use), so a page whose cards need more reading
   time keeps its own track length without touching this file.
   No markup -> no-op. ======================================================= */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var arts = $$(".c5-use");
  if (!arts.length) return;

  /* the intro keeps the pattern's proportions (A 0–.14, C .14–.24 of a 5.5
     track = .583 / .417 of the intro): bar docks at A_END, the photo starts
     growing at GROW_A, veil + tabs run UI_A…UI_B, the first card --use-card…1 */
  var A_END = .583, GROW_A = .208, UI_A = .583, UI_B = .792;
  var LIFT = 40;                    /* px a card travels in and out             */
  var EXIT = 24;                    /* px the last card drifts up while leaving */
  var PAR = 3;                      /* parallax of a photo layer, in %          */

  function ease(t) { return t * t * (3 - 2 * t); }                       /* smoothstep inside a phase */
  function seg(p, a, b) { return ease(clamp((p - a) / (b - a), 0, 1)); } /* eased progress of phase a…b */
  /* write a custom property only when it really changes – the cache lives on
     the element, so a frame that moved nothing costs no style invalidation */
  function put(el, name, val) {
    var k = "_cx" + name;
    if (el[k] === val) return;
    el[k] = val;
    el.style.setProperty(name, val);
  }
  /* per-product track constants, in viewport heights: intro (bar docks, photo
     grows, veil + tabs + first card), hold per frame, switch between two frames
     and outro; --use-card is where the first card starts inside the intro. */
  function cvar(cs, name, dflt) {
    var v = parseFloat(cs.getPropertyValue(name));
    return isNaN(v) ? dflt : v;
  }

  var items = arts.map(function (art) {
    var cs = window.getComputedStyle(art),
        INTRO = cvar(cs, "--use-intro", 1),
        HOLD = cvar(cs, "--use-hold", .75),
        SWITCH = cvar(cs, "--use-switch", .35),
        OUTRO = cvar(cs, "--use-outro", .5),
        K_A = cvar(cs, "--use-card", .917);
    var crops = $$("[data-use-crop]", art),
        layers = $$("[data-use-layer]", art),
        n = crops.length,
        run = INTRO + HOLD * n + SWITCH * (n - 1) + OUTRO,
        holds = [], mids = {}, i, start;
    for (i = 0; i < n; i++) {
      start = INTRO + i * (HOLD + SWITCH);
      holds.push({ start: start / run, end: (start + HOLD) / run });
      mids[crops[i].getAttribute("data-use-crop")] = (start + HOLD / 2) / run;
      /* how many tab lines stand below this one – the tabs are a single column
         growing upwards from the bottom edge of the scene */
      crops[i].style.setProperty("--tabi", String(n - 1 - i));
    }
    return {
      art: art, track: $("[data-use-track]", art), stage: $(".c5-use__stage", art),
      crops: crops, layers: layers, n: n, run: run, holds: holds, mids: mids,
      barEnd: A_END * INTRO / run,
      growIn: GROW_A * INTRO / run,
      uiIn: UI_A * INTRO / run, uiSet: UI_B * INTRO / run,
      k1In: K_A * INTRO / run, k1Set: INTRO / run,
      eIn: (run - OUTRO) / run, eTxt: (run - OUTRO / 2) / run,
      stageH: 0, p: -1, act: -1
    };
  }).filter(function (it) { return it.n > 0 && it.track && it.stage; });

  function layout() {
    items.forEach(function (it) {
      it.p = -1;
      if (!CX5.motionOn()) { it.track.style.height = ""; it.stageH = 0; return; }
      it.track.style.height = "calc(100svh + " + Math.round(window.innerHeight * it.run) + "px)";
      it.stageH = it.stage.offsetHeight;
    });
  }

  /* Continuous frame position f ∈ [0, n-1]: every switch contributes its own
     eased 0→1 and the switches never overlap, so the sum is the frame the scene
     is on (integer = a hold, fraction = a switch in progress). */
  function frameAt(it, p) {
    var f = 0;
    for (var k = 1; k < it.n; k++) f += seg(p, it.holds[k - 1].end, it.holds[k].start);
    return f;
  }

  function apply(it, p) {
    var t  = seg(p, 0, it.barEnd),               /* A – packshot into the bar, bar retracts */
        gr = seg(p, it.growIn, it.barEnd),       /* A – photo grows from the bottom edge    */
        et = seg(p, it.eIn, it.eTxt),            /* E – writing goes first                  */
        ev = seg(p, it.eIn, 1),                  /* E – and only then the veil              */
        ui = seg(p, it.uiIn, it.uiSet) * (1 - et),   /* tabs + note + cards presence        */
        vl = seg(p, it.uiIn, it.uiSet) * (1 - ev),   /* veil: rises with the tabs (C),
                                                        falls on its own to p=1 (E)         */
        f  = frameAt(it, p), i, d, inp, out, layer, crop;
    put(it.art, "--t", t.toFixed(4));
    put(it.art, "--grow", (.5 + .5 * gr).toFixed(4));
    put(it.art, "--ui", ui.toFixed(4));
    put(it.art, "--vl", vl.toFixed(4));

    for (i = 0; i < it.n; i++) {
      d = f - i;                                  /* distance from this frame, in frames */
      layer = it.layers[i];
      /* cross-fade: the frame being left and the frame arriving share the move */
      put(layer, "--o", clamp(1 - Math.abs(d), 0, 1).toFixed(4));
      /* the frame left behind drifts up, the one still to come waits below */
      put(layer, "--par", clamp(-PAR * d, -PAR, PAR).toFixed(3));

      crop = it.crops[i];
      /* card i: first one rises at the end of the intro, every other one in the
         second half of the switch that brings its frame in */
      inp = i === 0 ? seg(p, it.k1In, it.k1Set)
                    : seg(p, (it.holds[i - 1].end + it.holds[i].start) / 2, it.holds[i].start);
      /* card i leaves upwards in the first half of the next switch; the last
         card leaves in phase E instead, drifting a little less */
      out = i === it.n - 1 ? et
                           : seg(p, it.holds[i].end, (it.holds[i].end + it.holds[i + 1].start) / 2);
      put(crop, "--k", (inp * (1 - out)).toFixed(4));
      put(crop, "--ky", (LIFT * (1 - inp) - (i === it.n - 1 ? EXIT : LIFT) * out).toFixed(2));
      /* the active tab is fully lit, the others sit at .45 – interpolated */
      put(crop, "--tabo", (.45 + .55 * clamp(1 - Math.abs(d), 0, 1)).toFixed(4));
    }

    /* keywords and labels – touched only when they really change */
    var act = clamp(Math.round(f), 0, it.n - 1);
    if (act !== it.act) {
      it.act = act;
      it.crops.forEach(function (g, k) {
        var tab = $("[data-use-tab]", g);
        if (tab) tab.setAttribute("aria-pressed", k === act ? "true" : "false");
      });
    }
    put(it.art, "--ovis", ui > .02 ? "visible" : "hidden");   /* overlay out of the a11y tree while invisible */
    put(it.art, "--bvis", t > .5 ? "visible" : "hidden");     /* same for the shop button before it fades in */
  }

  function frame() {
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (!it.stageH) continue;
      var r = it.track.getBoundingClientRect();
      var span = r.height - it.stageH;
      if (span <= 0) continue;
      var p = clamp(-r.top / span, 0, 1);
      if (Math.abs(p - it.p) < 0.0004) continue;    /* nothing moved – skip the writes */
      it.p = p;
      apply(it, p);
    }
  }

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
        var r = it.track.getBoundingClientRect();
        var span = r.height - it.stageH;
        var top = r.top + window.scrollY + (it.mids[key] || 0) * span;
        CX5.scrollTo(Math.round(top), soft);
      });
    });
  });

  CX5.register({ scroll: frame, resize: layout });
})();
