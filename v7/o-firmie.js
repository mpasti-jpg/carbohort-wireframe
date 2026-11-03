/* ===== O nas – moduły strony (spec: 40-strona-www/koncepcja/o-nas-spec.md)
   Loaded after cw.js, Lenis, ce/00-base.js and the CE-NN modules the page uses.
   The page does NOT define CX5 and never calls CX5.start() – the bus in
   ce/00-base.js starts itself; modules only register their scroll/resize work.

   Every module is a no-op when its markup is missing, and every animation is
   gated by CX5.motionOn() (>= 900 px, no prefers-reduced-motion). Nothing
   listens to `wheel` and nothing blocks scrolling.

   Modules ported from other pages, renamed to the `on-` prefix:
     · 10 kołowrotek cyfr      <- prochnica-plus.js 60 (pp-odo)
     · 30 parallax kadru       <- carbomat-humic.js 40, część 2 (c5-who)
   Section 40 (values) is CE-70 since 02.11.2026 (ce/CE-70-scena-slajdow.js).
   Section 70 (globe and partner cards) is CE-96 variant kraje since 20.10.2026
   (variant łuki 15–20.10.2026) and runs from ce/CE-96-glob-dystrybutorow.js –
   nothing here.
   ===================================================================== */

/* ===== 10 · W liczbach: kołowrotek cyfr (spec §4) ==========================
   The markup carries a plain number – the strips are built by the script, so
   without JS, with reduced motion and below 900 px the final value is there
   from the start. A digit strip has the target at the bottom and the way to it
   above (a full turn 0–9), and starts pushed up by its whole length: a 0 stands
   in the window. The animation brings it back to zero, i.e. the digits roll
   FROM TOP TO BOTTOM. Digits start 90 ms apart, one pass takes 1.1 s (CSS).
   The value stays in the text for screen readers (wf-sr-only). */
(function () {
  "use strict";
  var doc = document;
  var els = CX5.$$("[data-on-odo]");
  var IO = window.IntersectionObserver;
  if (!els.length || !IO) return;
  var armed = false;

  function build(el) {
    var value = (el.getAttribute("data-on-odo") || "").trim();
    if (!/^[0-9]+$/.test(value)) return null;
    var sr = doc.createElement("span");
    sr.className = "wf-sr-only";
    sr.textContent = value;
    var wrap = doc.createElement("span");
    wrap.className = "on-odo__wrap";
    wrap.setAttribute("aria-hidden", "true");
    var strips = [];
    for (var i = 0; i < value.length; i++) {
      var target = +value.charAt(i);
      var cell = doc.createElement("span");
      cell.className = "on-odo__d";
      var strip = doc.createElement("span");
      strip.className = "on-odo__strip";
      var len = target + 11;                 /* dojazd do celu + pełny obrót */
      for (var k = 0; k < len; k++) {
        var unit = doc.createElement("span");
        unit.textContent = String((target - k + 100) % 10);
        strip.appendChild(unit);
      }
      strip.style.setProperty("--on-i", String(len - 1));   /* w okienku stoi 0 */
      cell.appendChild(strip);
      wrap.appendChild(cell);
      strips.push(strip);
    }
    el.textContent = "";
    el.appendChild(sr);
    el.appendChild(wrap);
    return strips;
  }

  function roll(el) {
    var strips = build(el);
    if (!strips) return;
    /* forced reflow: without it the start position of the strip is never
       computed and the browser has nothing to animate from */
    void el.offsetHeight;
    el.classList.add("is-roll");
    strips.forEach(function (strip, i) {
      strip.style.transitionDelay = (i * 90) + "ms";
      strip.style.setProperty("--on-i", "0");
    });
  }

  function arm() {
    if (armed || !CX5.motionOn()) return;
    armed = true;
    var io = new IO(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        roll(e.target);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  CX5.register({ resize: arm });
})();

/* ===== 30 · Najstarsza nowość: parallax kadru (spec §6) ====================
   The photo layer is taller than its frame, so the shift never uncovers an
   edge. `--on-par` runs from -6 to 0 (per cent of the layer height) while the
   row travels through the window; without CX5.motionOn() the property is
   removed and the crop stands still (CSS). */
(function () {
  "use strict";
  var medias = CX5.$$("[data-on-who-media]");
  if (!medias.length) return;

  function parallax() {
    var on = CX5.motionOn(), h = window.innerHeight;
    medias.forEach(function (m) {
      if (!on) { m.style.removeProperty("--on-par"); return; }
      var r = m.getBoundingClientRect();
      var span = h + r.height;
      var p = span > 0 ? CX5.clamp((h - r.top) / span, 0, 1) : 0;
      m.style.setProperty("--on-par", CX5.lerp(-6, 0, p).toFixed(3));
    });
  }

  CX5.register({ scroll: parallax, resize: parallax });
})();

/* 40 · Wartości: CE-70 since 02.11.2026 (ce/CE-70-scena-slajdow.js). */

/* 50 · Ludzie (bio drawer) – removed 26.10.2026 with the team section
   (AC #31863); the module is in archiwum-wersji/o-firmie-v7-przed-zmianami-2026-10-26.html. */
