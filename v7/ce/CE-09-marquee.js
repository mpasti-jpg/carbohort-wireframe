/* ===== CE-09 · Marquee – pointer steering (rejestr: ce-rejestr.js) ==========
   E02 (18.10.2026). The CSS loop of CE-09-marquee.css is the base: it runs on
   touch screens and without this file. With a mouse (hover + fine pointer) and
   no reduced motion the script takes the motion over, so the track can change
   its pace and direction without a jump:
     · pointer on the left half  -> the track runs to the left, faster towards
       the edge (1x in the middle, 2.5x at the very edge);
     · pointer on the right half -> it turns and runs to the right, same ramp;
     · pointer leaves the strip  -> the last direction stays, the pace eases
       back to the normal one of the CSS loop (--c5-marq-dur for half a track).
   The velocity eases towards its target every frame, so a change of direction
   slows down, crosses zero and speeds up the other way instead of flipping.
   Only `transform` moves. The loop runs only while the strip is on screen.
   The root gets `is-steer` (switches the CSS animation off); a change to
   reduced motion or a coarse pointer gives the strip back to CSS.
   No .c5-marq on the page -> no-op. ======================================= */
(function () {
  "use strict";
  var roots = Array.prototype.slice.call(document.querySelectorAll(".c5-marq"));
  if (!roots.length || !window.matchMedia || !window.requestAnimationFrame) return;

  var MAX = 2.5;          /* pace at the edge, in multiples of the normal pace */
  var EASE = 4;           /* how quickly the velocity follows its target (1/s) */
  var mqHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  var mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  function seconds(str) {
    var v = parseFloat(str);
    if (!isFinite(v) || v <= 0) return 42;
    return /ms\s*$/.test(str) ? v / 1000 : v;
  }

  function Strip(root) {
    this.root = root;
    this.track = root.querySelector(".c5-marq__track");
    this.on = false;
    this.visible = false;
    this.x = 0;           /* px, always within (-half, 0] */
    this.v = 0;           /* px per second, negative = to the left */
    this.dir = -1;        /* last direction: -1 left, 1 right */
    this.factor = 1;      /* target pace */
    this.raf = 0;
    this.last = 0;
    this.half = 0;
    this.base = 0;
    var self = this;
    this.tick = function (t) { self.frame(t); };
    root.addEventListener("pointermove", function (e) {
      if (!self.on || e.pointerType === "touch") return;
      var r = root.getBoundingClientRect();
      var rel = r.width ? (e.clientX - r.left) / r.width : 0.5;
      rel = rel < 0 ? 0 : rel > 1 ? 1 : rel;
      var d = rel - 0.5;                       /* -0.5 … 0.5 */
      /* a thin dead zone in the middle keeps the current direction */
      if (Math.abs(d) > 0.02) self.dir = d < 0 ? -1 : 1;
      self.factor = 1 + (MAX - 1) * Math.min(1, Math.abs(d) * 2);
    });
    root.addEventListener("pointerleave", function () { self.factor = 1; });
  }

  Strip.prototype.measure = function () {
    if (!this.track) return;
    this.half = this.track.scrollWidth / 2;
    var dur = seconds(getComputedStyle(this.root).getPropertyValue("--c5-marq-dur"));
    this.base = this.half / dur;
  };

  Strip.prototype.start = function () {
    if (this.on || !this.track) return;
    /* pick up the CSS loop where it stands, so the hand-over has no jump */
    var m = getComputedStyle(this.track).transform, x = 0;
    if (m && m !== "none") {
      var parts = m.replace(/^matrix(3d)?\(|\)$/g, "").split(",");
      x = parseFloat(parts.length === 16 ? parts[12] : parts[4]) || 0;
    }
    this.on = true;
    this.root.classList.add("is-steer");
    this.measure();
    this.x = this.half ? -(((-x) % this.half + this.half) % this.half) : 0;
    this.dir = -1;
    this.factor = 1;
    this.v = -this.base;
    this.paint();
    this.wake();
  };

  Strip.prototype.stop = function () {
    if (!this.on) return;
    this.on = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.root.classList.remove("is-steer");
    this.track.style.removeProperty("transform");
  };

  Strip.prototype.wake = function () {
    if (this.on && this.visible && !this.raf) {
      this.last = 0;
      this.raf = requestAnimationFrame(this.tick);
    }
  };

  Strip.prototype.paint = function () {
    this.track.style.transform = "translate3d(" + this.x.toFixed(2) + "px,0,0)";
  };

  Strip.prototype.frame = function (t) {
    this.raf = 0;
    if (!this.on || !this.visible) return;
    var dt = this.last ? Math.min(0.05, (t - this.last) / 1000) : 0;
    this.last = t;
    var target = this.dir * this.factor * this.base;
    this.v += (target - this.v) * (1 - Math.exp(-EASE * dt));
    this.x += this.v * dt;
    if (this.half > 0) {
      while (this.x <= -this.half) this.x += this.half;
      while (this.x > 0) this.x -= this.half;
    }
    this.paint();
    this.raf = requestAnimationFrame(this.tick);
  };

  var strips = roots.map(function (r) { return new Strip(r); });

  function sync() {
    var steer = mqHover.matches && !mqReduced.matches;
    strips.forEach(function (s) { if (steer) s.start(); else s.stop(); });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        strips.forEach(function (s) {
          if (s.root !== e.target) return;
          s.visible = e.isIntersecting;
          if (s.visible) s.wake();
        });
      });
    });
    strips.forEach(function (s) { io.observe(s.root); });
  } else {
    strips.forEach(function (s) { s.visible = true; });
  }

  if ("ResizeObserver" in window) {
    var ro = new ResizeObserver(function () {
      strips.forEach(function (s) { if (s.on) s.measure(); });
    });
    strips.forEach(function (s) { if (s.track) ro.observe(s.track); });
  }
  /* the label font arrives later than the script – the track grows */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { strips.forEach(function (s) { if (s.on) s.measure(); }); });
  }

  [mqHover, mqReduced].forEach(function (mq) {
    if (mq.addEventListener) mq.addEventListener("change", sync);
    else if (mq.addListener) mq.addListener(sync);
  });
  sync();
})();
