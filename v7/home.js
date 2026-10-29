/* ===== 00 baza ===========================================================
   home.js – the home page layer (V7, new concept of 26.10.2026).
   The page runs on the shared modules only (00-base.js: reveal, dock, Lenis;
   CE-07 dots, CE-17 FAQ, CE-37 pop-up window). Motion on this page is limited
   to the entry reveal of the shared layer and the film window below: no
   pinned scenes, no scroll-driven motion, no counters, no parallax.

   Contract for every block of this file:
   1. One IIFE per block, "use strict" inside, nothing leaking to window.
   2. A no-op when the markup is absent.
   3. The bus CX5 (ce/00-base.js) starts itself; this file never defines CX5
      and never calls CX5.start().
   4. Comments in English, never the em dash, and never the literal
      end-of-script tag: it would close the block early in a bundle.
   ===================================================================== */

/* ===== 10 hero · film window =============================================
   The film thumbnail of the hero (CE-08 `miniatura`) is a plain link to the
   file; here a click opens the native dialog with <video preload="none">,
   so the film is fetched only on demand. Closing (X, Escape, backdrop)
   pauses and rewinds the film and returns the focus to the thumbnail. */
(function () {
  "use strict";
  var card = CX5.$("[data-film-open]");
  var dlg = CX5.$("[data-film-dialog]");
  var video = CX5.$("[data-film-video]");
  /* Without <dialog> support (or without the markup) the thumbnail stays an
     ordinary link to the file. */
  if (!card || !dlg || !video || typeof dlg.showModal !== "function") return;

  function open(e) {
    e.preventDefault();
    dlg.showModal();
    /* A rejected play() (autoplay policy, no codec) is not an error worth
       throwing: the controls are there and the viewer can press play. */
    var p = video.play();
    if (p && typeof p.catch === "function") p.catch(function () {});
    if (CX5.lenis) CX5.lenis.stop();
  }

  /* Every way out of the dialog ends in its `close` event. */
  function closed() {
    video.pause();
    try { video.currentTime = 0; } catch (err) { /* not seekable yet */ }
    if (CX5.lenis) CX5.lenis.start();
    card.focus();
  }

  /* A click lands on the dialog element itself only outside the panel, i.e.
     on the backdrop; the rectangle test keeps the video controls safe. */
  function backdrop(e) {
    if (e.target !== dlg) return;
    var r = dlg.getBoundingClientRect();
    var out = e.clientX < r.left || e.clientX > r.right ||
              e.clientY < r.top || e.clientY > r.bottom;
    if (out) dlg.close();
  }

  card.addEventListener("click", open);
  dlg.addEventListener("close", closed);
  dlg.addEventListener("click", backdrop);
  var x = CX5.$("[data-film-close]", dlg);
  if (x) x.addEventListener("click", function () { dlg.close(); });
})();
