/* ===== CE-70 · Scena slajdów (spec prochnica-plus-wzorzec-eco-spec §18.3 + §19.4;
   stage E 18.10.2026: motion after usealia.com – "ProblemScroll" feed and
   "WhyAliaScroll" tabs, research u5 §6–§7). =====================================
   The track is tall (a sticky 100 svh stage plus one segment per step) and the
   position on it IS the animation: the scroll pass reads ONE rectangle – the
   track – and writes custom properties only; CSS turns them into transform and
   opacity. Two variants share the track, the tabs and the anchor routing:

   · slides (default, Próchnica+ #zalozenia) – pieces ride vertically through
     the middle of the stage. Per piece:
       --vs-t      where it stands: 1 below, 0 in the middle, -1 above;
       --vs-travel how far t = 1 is in pixels – for the heading half the stage
                   plus half the heading (it leaves the clipped stage), for a
                   card its own height plus the feed gap (the next card of the
                   feed stands right under it, as on usealia);
       --vs-s      scale  1 − .25·|t|  (neighbours shrink to .75),
       --vs-o      opacity 1 − smoothstep(.4, 1, |t|)  (and fade out).
     The heading is the first screen: it stands while the stage pins, then
     leaves upward over the first 30 % of the next segment, while card 1 rides
     in. Then one segment = one slide: card i rides in over the first 30 % of
     its segment and parks; it leaves while card i + 1 rides in. The last card
     keeps the middle until the stage unpins.

   · stos (`data-vs="stos"`, Produkty #wg-potrzeby) – a stack of goal cards in
     the middle column: the card in focus is open (photo, text, links), the
     others are rows (icon + title). The focus f runs 0 … N−1 with the scroll
     (it parks on each card for 60 % of a segment, then glides to the next).
     Each card has a fixed layout height (always the open one); what changes
     is drawn: --vs-e (0 row … 1 open; drives the opacity of the content),
     --vs-k (scaleY of the white sheet behind the card – row … open height),
     --vs-y (translateY of the card from the focus line), --vs-o (opacity –
     cards beyond the window of the stack fade out). The window itself is a
     masked box (--vs-win = half its height, set once per resize from the
     tallest open card), so the neighbours fade out on the mask (R03,
     18.10.2026). The photo of a card rolls down from / up to its top edge
     with --vs-e (CSS); below e = .02 the card carries data-shut and the
     photo frame is hidden.
     Path links of a card stand one per row (19.10.2026 – the one-line
     marquee of R03 is gone; CSS only).

   The tab row under the stage ([data-vs-go]) marks the current step with
   aria-current (+ .is-active for EL-18) and a click / Enter scrolls to the
   middle of that step's stop. A hash pointing at a card (or anything inside
   it – mega-menu anchors #retencja … #bez-torfu) lands on that step through
   CX5.onHash.

   Nothing here listens to `wheel` and nothing intercepts scrolling: the module
   only registers on the CX5 bus. Below 900 px, with reduced motion and without
   JS the section is static (CSS) and this module only clears what it wrote.
   The looping video (slides) never plays while its layer is hidden (variant
   zielen) and pauses whenever the stage is off screen.
   No [data-vs] -> no-op. ===================================================== */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var scenes = $$("[data-vs]");
  if (!scenes.length) return;

  /* shares of one segment: the ride in, and the ride out that overlaps the next ride in */
  var ENTER = 0.3, EXIT = 0.3;
  /* stack: the share of a segment in which the focus glides to the next card */
  var MOVE = 0.4;
  /* smoothstep – the same curve read forwards and backwards, so scrolling back
     retraces the move instead of jumping */
  function ease(q) { return q * q * (3 - 2 * q); }
  function smooth(a, b, x) { return ease(clamp((x - a) / (b - a), 0, 1)); }

  scenes.forEach(function (root) {
    var stack = root.getAttribute("data-vs") === "stos";
    var track = $("[data-vs-track]", root);
    var stage = $(".c5-vs__stage", root);
    var head = $("[data-vs-head]", root);
    var index = $(".c5-vs__index", root);
    var cards = $$("[data-vs-card]", root);
    var btns = $$("[data-vs-go]", root);
    var list = stack ? $(".c5-vs__stack", root) : null;
    var video = $("[data-vs-video]", root);
    if (!track || !stage || !cards.length) return;
    var STEPS = cards.length, HEAD = 0, stageH = 0, step = 0, active = -1, inView = true, videoOn = false;
    /* stack geometry, measured on resize: row height, open height, gap */
    var hc = [], he = [], gap = 24, heMax = 0;

    function cssNum(name, dflt) {
      var v = parseFloat(window.getComputedStyle(root).getPropertyValue(name));
      return isNaN(v) ? dflt : v;
    }

    function setActive(i) {
      if (i === active) return;
      active = i;
      btns.forEach(function (b, n) {
        if (n === i) { b.setAttribute("aria-current", "true"); b.classList.add("is-active"); }
        else { b.removeAttribute("aria-current"); b.classList.remove("is-active"); }
      });
    }

    function syncVideo() {
      if (!video) return;
      if (CX5.motionOn() && inView && videoOn) {
        var pr = video.play();
        /* a play a browser refuses must not reach the console */
        if (pr && pr.catch) pr.catch(function () {});
      } else if (!video.paused) {
        video.pause();
      }
    }

    var PROPS = ["--vs-t", "--vs-travel", "--vs-s", "--vs-o", "--vs-e", "--vs-k", "--vs-y"];

    /* Path links of a card: since 19.10.2026 (Mateusz: no marquee) every link stands in its
       own row, one under another – pure CSS (.c5-vs__ggo), nothing to measure here. */
    function clear() {
      track.style.height = "";
      cards.concat(head ? [head] : []).forEach(function (c) {
        PROPS.forEach(function (p) { c.style.removeProperty(p); });
        c.removeAttribute("data-off");
        c.removeAttribute("data-open");
        c.removeAttribute("data-shut");
      });
      if (index) {
        index.style.removeProperty("--vs-idx");
        index.removeAttribute("data-off");
      }
      if (list) list.style.removeProperty("--vs-win");
      stageH = 0;
      active = -1;
      setActive(0);
    }

    function measure() {
      /* the video layer is hidden by the zielen variant – then it never plays */
      videoOn = !!video && video.getClientRects().length > 0;
      if (!CX5.motionOn()) { clear(); syncVideo(); return; }
      /* the stage is the sticky 100 svh box – the part of the track that stands
         still while the pieces swap inside it */
      stageH = stage.offsetHeight;
      step = Math.max(cssNum("--vs-step-min", 620),
                      Math.round(window.innerHeight * cssNum("--vs-step-vh", 1.1)));
      HEAD = head ? Math.max(0, cssNum("--vs-head-seg", 1)) : 0;
      track.style.height = Math.round(stageH + step * (HEAD + STEPS)) + "px";
      if (stack) {
        gap = cssNum("--vs-stack-gap", 24);
        heMax = 0;
        var hcMax = 0;
        cards.forEach(function (c, i) {
          var h = $(".c5-vs__ghead", c);
          hc[i] = h ? h.offsetHeight : 72;
          he[i] = Math.max(c.offsetHeight, hc[i] + 1);
          heMax = Math.max(heMax, he[i]);
          hcMax = Math.max(hcMax, hc[i]);
        });
        /* the masked window: the tallest open card and one row (+ gap) on each side */
        list.style.setProperty("--vs-win", Math.ceil(heMax / 2 + gap + hcMax) + "px");
      } else {
        var fg = cssNum("--vs-feed-gap", 40);
        /* 24 px of slack so the heading is fully clear of the clipped stage */
        if (head) head.style.setProperty("--vs-travel", Math.ceil((stageH + head.offsetHeight) / 2 + 24) + "px");
        cards.forEach(function (c) { c.style.setProperty("--vs-travel", Math.ceil(c.offsetHeight + fg) + "px"); });
      }
      syncVideo();
    }

    /* scroll position -> u, counted in segments from the end of the heading's stop */
    function progress() {
      var r = track.getBoundingClientRect();
      var span = r.height - stageH;
      return (span > 0 ? clamp(-r.top / span, 0, 1) : 0) * (HEAD + STEPS) - HEAD;
    }

    function updateSlides(u) {
      if (head) {
        /* no visibility switch for the heading: it stays in the accessibility
           tree, the clipped stage alone takes it out of sight */
        var th = u <= 0 ? 0 : u < EXIT ? -ease(u / EXIT) : -1;
        head.style.setProperty("--vs-t", th.toFixed(4));
      }
      if (index) {
        /* second half of the swap: the heading is already above the tab row */
        var show = head ? ease(clamp((u / EXIT - 0.5) * 2, 0, 1)) : 1;
        index.style.setProperty("--vs-idx", show.toFixed(3));
        index.setAttribute("data-off", show < 0.001 ? "true" : "false");
      }
      for (var i = 0; i < STEPS; i++) {
        var t;
        if (u <= i) t = 1;                                        /* still below the middle */
        else if (u < i + ENTER) t = 1 - ease((u - i) / ENTER);    /* riding in from below */
        else if (i === STEPS - 1 || u <= i + 1) t = 0;            /* parked in the middle */
        else if (u < i + 1 + EXIT) t = -ease((u - i - 1) / EXIT); /* leaving upward */
        else t = -1;
        var a = Math.abs(t), c = cards[i];
        c.style.setProperty("--vs-t", t.toFixed(4));
        c.style.setProperty("--vs-s", (1 - 0.25 * a).toFixed(4));
        c.style.setProperty("--vs-o", (1 - smooth(0.4, 1, a)).toFixed(4));
        c.setAttribute("data-off", a > 0.999 ? "true" : "false");
      }
      /* the tab row turns over halfway through the swap */
      setActive(clamp(Math.floor(u - EXIT / 2), 0, STEPS - 1));
    }

    function updateStack(u) {
      /* focus: parks on card i, glides to i + 1 in the last MOVE of the segment */
      var seg = clamp(Math.floor(u), 0, STEPS - 1);
      var f = seg >= STEPS - 1 ? STEPS - 1 : seg + ease(clamp((u - seg - (1 - MOVE)) / MOVE, 0, 1));
      var e = [], H = [], T = [], acc = 0, i;
      for (i = 0; i < STEPS; i++) {
        e[i] = clamp(1 - Math.abs(f - i), 0, 1);
        H[i] = hc[i] + e[i] * (he[i] - hc[i]);
        T[i] = acc;
        acc += H[i] + gap;
      }
      /* the anchor glides between the centres of the two cards around f */
      var k = Math.min(Math.floor(f), STEPS - 2), q = f - k, A;
      if (k < 0) A = T[0] + H[0] / 2;
      else A = (T[k] + H[k] / 2) * (1 - q) + (T[k + 1] + H[k + 1] / 2) * q;
      /* the window of the stack: the open card and one row on each side */
      var hOpen = H[k < 0 ? 0 : (q < 0.5 ? k : k + 1)];
      var half = hOpen / 2 + gap + (hc[0] || 72);
      for (i = 0; i < STEPS; i++) {
        var c = cards[i], d = Math.abs(T[i] + H[i] / 2 - A);
        var o = 1 - smooth(half - hc[i] / 2, half + hc[i] / 4, d);
        var kk = he[i] > 0 ? H[i] / he[i] : 1;
        c.style.setProperty("--vs-y", (T[i] - A).toFixed(1) + "px");
        c.style.setProperty("--vs-e", e[i].toFixed(4));
        c.style.setProperty("--vs-k", kk.toFixed(4));
        c.style.setProperty("--vs-o", o.toFixed(4));
        c.setAttribute("data-off", o < 0.001 ? "true" : "false");
        /* the content of a card counts as shown (focusable) from half open */
        c.setAttribute("data-open", e[i] > 0.5 ? "true" : "false");
        c.setAttribute("data-shut", e[i] < 0.02 ? "true" : "false");
      }
      if (index) index.setAttribute("data-off", "false");
      setActive(clamp(Math.round(f), 0, STEPS - 1));
    }

    function update() {
      if (!stageH) return;
      var u = progress();
      if (stack) updateStack(u); else updateSlides(u);
    }

    /* a tab click (or a hash) lands in the middle of that step's stop */
    function jump(i, instant) {
      var how = instant ? "auto" : "smooth";
      if (!stageH) {
        var m = parseFloat(window.getComputedStyle(cards[i]).scrollMarginTop) || 24;
        CX5.scrollTo(cards[i].getBoundingClientRect().top + window.scrollY - m, how);
        return;
      }
      var u = stack ? i + (1 - MOVE) / 2 : HEAD + i + ENTER + (1 - ENTER) / 2;
      CX5.scrollTo(track.getBoundingClientRect().top + window.scrollY + step * u, how);
    }

    btns.forEach(function (b, n) {
      b.addEventListener("click", function () { jump(n, false); });
    });

    /* anchors (mega-menu, in-page links, a typed hash): only the scene needs
       routing – the static layout keeps the browser's own jump and :target */
    if (CX5.onHash) CX5.onHash(function (hash, instant) {
      if (!stageH || !hash || hash.length < 2) return false;
      var el;
      try { el = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (err) { return false; }
      var card = el && el.closest ? el.closest("[data-vs-card]") : null;
      var n = card ? cards.indexOf(card) : -1;
      if (n < 0) return false;
      jump(n, instant);
      return true;
    });

    if (video && window.IntersectionObserver) {
      new window.IntersectionObserver(function (entries) {
        entries.forEach(function (e) { inView = e.isIntersecting; });
        syncVideo();
      }, { threshold: 0 }).observe(stage);
    }

    CX5.register({ scroll: update, resize: measure });
  });
})();
