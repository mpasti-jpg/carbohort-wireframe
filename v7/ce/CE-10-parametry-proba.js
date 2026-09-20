/* ===== CE-10 · Parametry na wideo – trial build „figma" (spec §16.4) ========
   ONLY carbomat.html links this file. The shared ce/CE-10-parametry.js keeps
   serving carbomat-mata.html, carbohumic.html and carbomat-humic.html, tabs and
   all, so nothing written here can reach them. Copied from the shared module on
   20.09.2026; the tab half is not copied (this page has no parameter tabs) and
   the entry animation of §16.4 is new.

   Two jobs.

   1. The media layer. It holds a still photo since 20.09.2026 (the loop reads
      too dark – spec §16.1 note 1) and will hold a <video> again as soon as
      Mateusz delivers the new film. Everything below therefore works off
      `.c5-params__media` whatever element carries it, and the video-only part –
      no loop under reduced motion – runs only when the element really is a
      <video>.

   2. The entry animation. It reads ONE number: how far the top edge of the
      section has climbed through the window (q = 0 when that edge sits on the
      bottom of the window, 1 when it reaches the top, and it keeps growing
      while the section is pinned). Four properties come out of it:
        --pv-g     the crop rises from the bottom, holds its narrow width for a
                   moment, then widens to the whole section   (q 0.30 -> 0.72)
        --pv-o     only then does the scrim grow over it       (q 0.72 -> 0.88)
        --pv-h     then the kicker with the heading            (q 0.86 -> 1.00)
        --pv-rows  then the rows, one after another            (q 0.98 -> 1.16)
      so the reader watches the picture alone for a moment before the content
      covers it (Mateusz, 20.09: „żeby ono też coś przekazywało, poza byciem po
      prostu tłem").

   The progress never goes back down. A scroll-driven value that did would take
   the table away from under a reader who scrolls up one notch to re-read it –
   the reveal ranges sit exactly where the content is centred on screen. So the
   intro plays forward once, driven by scroll position and by nothing else, and
   the section then stands in its end state.

   Without CX5.motionOn() the four properties are dropped and `is-anim` comes
   off the section, which switches every animation rule in the CSS off at once:
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

  /* --- wejście sterowane przewijaniem -------------------------------------- */
  /* phase bounds in units of q – waiting for Mateusz to confirm the pace */
  var G_A = 0.30, G_B = 0.72;       /* crop: holds narrow to G_A, full width at G_B */
  var O_A = 0.72, O_B = 0.88;       /* scrim */
  var H_A = 0.86, H_B = 1.00;       /* kicker + heading */
  var R_A = 0.98, R_B = 1.16;       /* rows, staggered by --i in the CSS */
  var PROPS = ["--pv-g", "--pv-o", "--pv-h", "--pv-rows"];

  var reached = 0;

  function ramp(q, a, b) { return CX5.clamp((q - a) / (b - a), 0, 1); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  /* the crop leaves the hold gently and lands gently – same curve as CE-16 */
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function update() {
    if (!CX5.motionOn()) {
      sec.classList.remove("is-anim");
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
    sec.style.setProperty("--pv-h", easeOut(ramp(q, H_A, H_B)).toFixed(4));
    /* linear, so the eight rows keep an even beat; each row eases on its own */
    sec.style.setProperty("--pv-rows", ramp(q, R_A, R_B).toFixed(4));
  }

  /* set the start state before the first paint, then ride the bus */
  update();
  CX5.register({ scroll: update, resize: update });
})();
