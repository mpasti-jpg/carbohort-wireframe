/* ===== 00 baza ===========================================================
   home.js – the home page layer (V7, new concept of 26.10.2026).
   The page runs on the shared modules only (00-base.js: reveal, dock, Lenis;
   CE-07 dots, CE-16 band, CE-17 FAQ, CE-33 words, CE-37 pop-up window). This
   file has no block of its own since the film window left the hero
   (02.11.2026); it stays linked for the exceptions of the page to come.

   Contract for every block of this file:
   1. One IIFE per block, "use strict" inside, nothing leaking to window.
   2. A no-op when the markup is absent.
   3. The bus CX5 (ce/00-base.js) starts itself; this file never defines CX5
      and never calls CX5.start().
   4. Comments in English, never the em dash, and never the literal
      end-of-script tag: it would close the block early in a bundle.
   ===================================================================== */
