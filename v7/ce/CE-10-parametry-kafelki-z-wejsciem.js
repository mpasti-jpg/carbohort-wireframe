/* ===== CE-10 · Parametry na wideo – variant „kafelki-z-wejsciem" (spec §16.4) ====
   A shared module since 02.10.2026 (see the CSS half for what a page chooses).
   ce/CE-10-parametry.js keeps the ruled table and the tabs of the variant
   „z-tabami"; a page links one pair or the other, never both.

   Two jobs.

   1. The media layer. Everything below works off `.c5-params__media` whatever
      element carries it – a <video>, an <img> or a placeholder block – and the
      video-only part (no loop under reduced motion) runs only when the element
      really is a <video>.

   2. The entry animation. It reads ONE number: how far the top edge of the
      section has climbed through the window (q = 0 when that edge sits on the
      bottom of the window, 1 when it reaches the top, and it keeps growing
      while the section is pinned). Out of it come:
        --pv-g     the crop rises from the bottom, holds its narrow width for a
                   moment, then widens to the whole frame     (q 0.30 -> 0.72)
        --pv-o     only then does the scrim grow over it       (q 0.72 -> 0.88)
        is-head    the panel fades in and rises (time-based)   (q >= 0.80)
        is-rows    the rows fly in one by one (time-based)     (q >= 0.90)
      so the reader watches the picture alone for a moment before the content
      covers it. E04 (18.10.2026): the panel and the rows used to be scrubbed
      by the scroll; they now play on their own once their point is reached,
      quick and even, like the prototype of September.

   The progress never goes back down. A scroll-driven value that did would take
   the table away from under a reader who scrolls up one notch to re-read it –
   the reveal ranges sit exactly where the content is centred on screen. So the
   intro plays forward once, driven by scroll position and by nothing else, and
   the section then stands in its end state.

   A table of more than eight rows: the sheet numbers eight rows by itself, so
   here every row gets its number inline (`--i`), the section gets
   `data-params-n` with --pv-n (the number of rows) and a shorter step between
   two rows (--pv-step), and the closing group – link, buttons, source line –
   still arrives last. Eight rows or fewer: nothing is written, the sheet rules.

   Without CX5.motionOn() the properties and the classes are dropped and
   `is-anim` comes off the section, which switches every animation rule in the
   CSS off at once:
   no JS, a window under 900 px or reduced motion means the end state from the
   first frame. No [data-params] -> no-op. ================================= */
(function () {
  "use strict";
  var $ = CX5.$;
  var sec = $("[data-params]");
  if (!sec) return;

  /* --- warstwa mediów ------------------------------------------------------ */
  var media = $(".c5-params__media", sec);
  if (media && media.tagName === "VIDEO") {
    /* Reduced motion: the loop must not run – drop autoplay, stop on frame 0 so
       the poster stays. Re-checked when the preference changes mid-session. */
    var syncVideo = function () {
      if (CX5.reducedMQ.matches) {
        media.removeAttribute("autoplay");
        media.pause();
        try { media.currentTime = 0; } catch (e) { /* metadata not ready yet */ }
      } else if (media.paused) {
        var played = media.play();
        if (played && played.catch) played.catch(function () { /* autoplay blocked – poster stays */ });
      }
    };
    syncVideo();
    if (CX5.reducedMQ.addEventListener) CX5.reducedMQ.addEventListener("change", syncVideo);
    media.addEventListener("loadedmetadata", syncVideo);
  }

  /* --- more rows than the sheet numbers ------------------------------------ */
  var rows = CX5.$$(".c5-params__row", sec);
  if (rows.length > 8) {
    rows.forEach(function (r, i) { r.style.setProperty("--i", String(i)); });
    sec.setAttribute("data-params-n", String(rows.length));
    sec.style.setProperty("--pv-n", String(rows.length));
    /* eight rows at 55 ms take 440 ms – a longer table keeps about that time */
    sec.style.setProperty("--pv-step", Math.max(22, Math.round(440 / rows.length)) + "ms");
  }

  /* --- wejście sterowane przewijaniem -------------------------------------- */
  /* phase bounds in units of q */
  var G_A = 0.30, G_B = 0.72;       /* crop: holds narrow to G_A, full width at G_B */
  var O_A = 0.72, O_B = 0.88;       /* scrim */
  var H_AT = 0.80;                  /* panel with kicker + heading: fade-in-up */
  var R_AT = 0.90;                  /* rows, staggered by --i in the CSS */
  var PROPS = ["--pv-g", "--pv-o"];

  var reached = 0;

  function ramp(q, a, b) { return CX5.clamp((q - a) / (b - a), 0, 1); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  /* the crop leaves the hold gently and lands gently – same curve as CE-16 */
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function update() {
    if (!CX5.motionOn()) {
      sec.classList.remove("is-anim", "is-head", "is-rows");
      for (var i = 0; i < PROPS.length; i++) sec.style.removeProperty(PROPS[i]);
      reached = 0;
      return;
    }
    sec.classList.add("is-anim");
    var h = window.innerHeight;
    var q = (h - sec.getBoundingClientRect().top) / h;
    if (q > reached) reached = q;
    q = reached;
    sec.style.setProperty("--pv-g", easeInOut(ramp(q, G_A, G_B)).toFixed(4));
    sec.style.setProperty("--pv-o", easeOut(ramp(q, O_A, O_B)).toFixed(4));
    if (q >= H_AT) sec.classList.add("is-head");
    if (q >= R_AT) sec.classList.add("is-rows");
  }

  /* set the start state before the first paint, then ride the bus */
  update();
  CX5.register({ scroll: update, resize: update });
})();
