/* ===== CE-70 · Scena slajdów na tle wideo (spec prochnica-plus-wzorzec-eco-spec §18.3). =====
   The track is tall (a sticky 100 svh stage plus one segment per slide) and the
   position on it IS the animation: the scroll pass reads only the track
   rectangle and writes two custom properties per card.
     · --vs-t      = where the card stands: 1 below the stage, 0 in the middle,
                     -1 above it; CSS multiplies it by --vs-travel.
     · --vs-travel = half the stage plus half the card, i.e. the distance that
                     takes the card fully out of the clipped stage (px, resize).
   One segment of the track = one slide. Card i rides in over the first 30 % of
   its segment, then stands still; its exit falls into the first 30 % of the
   NEXT segment, which is exactly when card i + 1 rides in – so the two move
   together and the stage is never empty ("wyjeżdża do góry a kolejny od razu
   wjeżdża od dołu"). The last card keeps the middle until the stage unpins.

   Nothing here listens to `wheel` and nothing intercepts scrolling: the module
   only registers on the CX5 bus. Below 900 px, with reduced motion and without
   JS the section is static (CSS) – the poster as a plain frame, the cards one
   under another – and this module only clears what it wrote.

   The looping video pauses whenever the stage is off screen (IntersectionObserver)
   or the scene is static, so reduced motion leaves the poster alone.
   No [data-vs] -> no-op. ================================================== */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;
  var scenes = $$("[data-vs]");
  if (!scenes.length) return;

  /* shares of one segment: the ride in, and the ride out that overlaps the next ride in */
  var ENTER = 0.3, EXIT = 0.3;
  /* smoothstep – the same curve read forwards and backwards, so scrolling back
     retraces the move instead of jumping */
  function ease(q) { return q * q * (3 - 2 * q); }

  scenes.forEach(function (root) {
    var track = $("[data-vs-track]", root);
    var stage = $(".c5-vs__stage", root);
    var cards = $$("[data-vs-card]", root);
    var btns = $$("[data-vs-go]", root);
    var video = $("[data-vs-video]", root);
    if (!track || !stage || !cards.length) return;
    var STEPS = cards.length, stageH = 0, active = -1, inView = true;

    function cssNum(name, dflt) {
      var v = parseFloat(window.getComputedStyle(root).getPropertyValue(name));
      return isNaN(v) ? dflt : v;
    }

    /* the slide index marks the card on the stage; the others stay at 60 % (CSS) */
    function setActive(i) {
      if (i === active) return;
      active = i;
      btns.forEach(function (b, n) {
        if (n === i) b.setAttribute("aria-current", "true");
        else b.removeAttribute("aria-current");
      });
    }

    function syncVideo() {
      if (!video) return;
      if (CX5.motionOn() && inView) {
        var pr = video.play();
        /* an autoplay a browser refuses must not reach the console */
        if (pr && pr.catch) pr.catch(function () {});
      } else if (!video.paused) {
        video.pause();
      }
    }

    function measure() {
      if (!CX5.motionOn()) {
        track.style.height = "";
        cards.forEach(function (c) {
          c.style.removeProperty("--vs-t");
          c.style.removeProperty("--vs-travel");
          c.removeAttribute("data-off");
        });
        stageH = 0;
        active = -1;
        setActive(0);
        syncVideo();
        return;
      }
      /* the stage is the sticky 100 svh box – the part of the track that stands
         still while the cards swap inside it */
      stageH = stage.offsetHeight;
      var step = Math.max(cssNum("--vs-step-min", 620),
                          Math.round(window.innerHeight * cssNum("--vs-step-vh", 1.1)));
      track.style.height = (stageH + step * STEPS) + "px";
      /* 24 px of slack so a card is fully clear of the clipped stage */
      cards.forEach(function (c) {
        c.style.setProperty("--vs-travel", Math.ceil((stageH + c.offsetHeight) / 2 + 24) + "px");
      });
      syncVideo();
    }

    function update() {
      if (!stageH) return;
      var r = track.getBoundingClientRect();
      var span = r.height - stageH;
      var u = (span > 0 ? clamp(-r.top / span, 0, 1) : 0) * STEPS;
      for (var i = 0; i < STEPS; i++) {
        var t;
        if (u <= i) t = 1;                                        /* still below the stage */
        else if (u < i + ENTER) t = 1 - ease((u - i) / ENTER);    /* riding in from below */
        else if (i === STEPS - 1 || u <= i + 1) t = 0;            /* parked in the middle */
        else if (u < i + 1 + EXIT) t = -ease((u - i - 1) / EXIT); /* leaving upward */
        else t = -1;
        cards[i].style.setProperty("--vs-t", t.toFixed(4));
        cards[i].setAttribute("data-off", Math.abs(t) > 0.999 ? "true" : "false");
      }
      /* the index turns over halfway through the swap */
      setActive(clamp(Math.floor(u - EXIT / 2), 0, STEPS - 1));
    }

    /* a click in the index lands in the middle of that slide's stop */
    function jump(i) {
      if (!stageH) {
        CX5.scrollTo(cards[i].getBoundingClientRect().top + window.scrollY - 24, "smooth");
        return;
      }
      var r = track.getBoundingClientRect();
      var span = r.height - stageH;
      var u = i + ENTER + (1 - ENTER) / 2;
      CX5.scrollTo(r.top + window.scrollY + span * (u / STEPS), "smooth");
    }

    btns.forEach(function (b, n) {
      b.addEventListener("click", function () { jump(n); });
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
