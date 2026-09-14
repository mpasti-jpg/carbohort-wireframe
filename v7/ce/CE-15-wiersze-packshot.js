/* ===== CE-15 · Przypięte wiersze z packshotem (rejestr: ce-rejestr.js) ======
   The heading pins for the cycle, the block enters in the page flow with row 1
   open, sticks by its bottom edge, the scroll opens the remaining rows, then
   the whole block leaves. Pin only with CX5.motionOn(); below 900 px and with
   reduced motion it is a click accordion with row 1 open; without JS every row
   is open (CSS). The one-shot fade-in of the rows uses the same gates.
   Merged from produkty.js 65 – the generalised copy of carbomat.js 80 (rows
   counted from the DOM instead of a fixed three, everything looked up inside
   the pin, and a remembered layout so a resize that only moves the address bar
   does not close the row the reader opened). The PRO band that carbomat.js 80
   carried in the same IIFE lives in CE-16-pas-pro.js.
   No [data-season-pin] -> no-op. ========================================= */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$, panelSet = CX5.panelSet;

  var seasonPin = $("[data-season-pin]");
  if (!seasonPin) return;
  var seasonBlock = $(".c5-season", seasonPin);
  var seasonSpacer = $("[data-season-spacer]", seasonPin);
  var seasonHead = $("[data-season-head]", seasonPin);
  var seasonHeadWrap = $("[data-season-headwrap]", seasonPin);
  var seasonBtns = $$("[data-season]", seasonPin);
  var N = seasonBtns.length;
  if (!seasonBlock || !N) return;
  var seasonIdx = null;
  var seasonOpenH = 0;
  var seasonStep = 0;
  var seasonHeadTop = 0;
  var seasonHeadH = 0;
  var seasonBlockTop = 0;   /* used sticky `top` of the block (px) */
  var seasonSpacerH = 0;    /* flow room reserved for the absolute header */
  var pinMode = null;       /* layout of the last resize: true = pin, false = accordion */

  function seasonPinOn() { return CX5.motionOn(); }
  /* One state per row: data-open drives both the description panel and the scene animation
     (square + packshot), so the scene behaves the same in the pin and on click. */
  function setSeason(idx, instant) {
    if (seasonIdx === idx) return;
    seasonIdx = idx;
    /* A closed row reserves no room for the square, so the block height depends on the open
       row. The measurement must see the target state – transitions off while switching hard. */
    if (instant) seasonBlock.classList.add("c5-season--instant");
    seasonBtns.forEach(function (b, i) {
      var panel = doc.getElementById(b.getAttribute("aria-controls"));
      var row = b.closest(".c5-season__row");
      var on = i === idx;
      b.setAttribute("aria-expanded", on ? "true" : "false");
      if (row) row.setAttribute("data-open", on ? "true" : "false");
      panelSet(panel, on, instant);
    });
    if (instant) {
      void seasonBlock.offsetHeight;
      seasonBlock.classList.remove("c5-season--instant");
    }
  }
  /* Block height with one row open: the tallest of the states, so the bottom edge cannot
     drift when a taller row opens. Measured with --c5-season-h cleared, otherwise
     min-height would answer instead. */
  function measureSeasonBlock() {
    var keep = seasonIdx, max = 0, i;
    seasonBlock.style.removeProperty("--c5-season-h");
    for (i = 0; i < N; i++) {
      seasonIdx = null;
      setSeason(i, true);
      max = Math.max(max, seasonBlock.offsetHeight);
    }
    seasonIdx = null;
    setSeason(keep === null || keep < 0 ? 0 : keep, true);
    seasonOpenH = max;
    seasonBlock.style.setProperty("--c5-season-h", max + "px");
  }
  /* The block starts `seasonSpacerH` below the container top, so it reaches its sticky
     offset when the container top is that much above it. */
  function seasonBlockPinC() { return seasonBlockTop - seasonSpacerH; }
  /* The header sits at the top of the pin container (absolute wrapper), so it sticks exactly
     when the container top reaches its sticky offset. */
  function measureSeasonHead() {
    if (!seasonHead) return;
    seasonHeadTop = parseFloat(window.getComputedStyle(seasonHead).top) || 0;
    seasonHeadH = seasonHead.offsetHeight;
  }
  function seasonHeadStickC() { return seasonHead ? seasonHeadTop : Infinity; }
  function seasonSpan() { return seasonStep * N; }
  /* The cycle starts once BOTH happened (block at the bottom, header at the top), i.e. at
     the smaller container `top`. */
  function seasonStartTop() { return Math.min(seasonBlockPinC(), seasonHeadStickC()); }
  function sizeSeasonPin() {
    if (!seasonPinOn()) {
      seasonPin.style.height = "";
      if (seasonSpacer) seasonSpacer.style.height = "";
      if (seasonHeadWrap) seasonHeadWrap.style.height = "";
      seasonBlock.style.removeProperty("--c5-season-h");
      seasonBlock.style.removeProperty("--c5-season-headroom");
      /* back to row 1 only when leaving the pin (or at start) – a mobile resize while
         scrolling (address bar) must not close the row the reader opened */
      if (pinMode !== false) { seasonIdx = null; setSeason(0, true); }
      pinMode = false;
      return;
    }
    pinMode = true;
    measureSeasonBlock();                           /* measured in the "one row open" state */
    measureSeasonHead();
    /* floor for the sticky offset: the block must never slide under the header */
    seasonBlock.style.setProperty("--c5-season-headroom", Math.round(seasonHeadTop + seasonHeadH) + "px");
    seasonBlockTop = parseFloat(window.getComputedStyle(seasonBlock).top) || 0;
    /* spacer = header box + its CSS margin (the gap between the lead and row 1 while the
       block still runs with the page) */
    if (seasonSpacer) {
      seasonSpacer.style.height = Math.round(seasonHeadH) + "px";
      seasonSpacerH = seasonSpacer.offsetHeight +
        (parseFloat(window.getComputedStyle(seasonSpacer).marginBottom) || 0);
    } else {
      seasonSpacerH = Math.round(seasonHeadH);
    }
    seasonStep = Math.max(260, Math.round(window.innerHeight * 0.55));
    /* The container is sized so the block lets go exactly at the end of the last phase:
       track = sticky top + block height + N phases - cycle start. */
    var span = seasonSpan();
    var startC = seasonStartTop();
    seasonPin.style.height = Math.round(seasonBlockTop + seasonOpenH + span - startC) + "px";
    /* the header wrapper ends where the block lets go – from there its bottom edge pushes
       the header up (it leaves, it does not vanish) */
    if (seasonHeadWrap) {
      seasonHeadWrap.style.height = Math.round(seasonHeadTop + seasonHeadH - startC + span) + "px";
    }
  }
  function updateSeason() {
    if (!seasonPinOn() || !seasonOpenH) return;
    var span = seasonSpan();
    var p = span > 0 ? (seasonStartTop() - seasonPin.getBoundingClientRect().top) / span : 0;
    if (p < 0) { setSeason(0); return; }             /* row 1 stays open before the pin */
    setSeason(Math.min(N - 1, Math.floor(p * N)));
  }
  seasonBtns.forEach(function (btn, i) {
    btn.addEventListener("click", function () {
      if (seasonPinOn()) {
        /* scroll to the middle of this row's phase – the scroll opens it by itself */
        var pinTopDoc = seasonPin.getBoundingClientRect().top + window.scrollY;
        var target = pinTopDoc - seasonStartTop() + ((i + 0.5) / N) * seasonSpan();
        CX5.scrollTo(Math.round(target), "smooth");
      } else if (btn.getAttribute("aria-expanded") !== "true") {
        setSeason(i);
      }
    });
  });

  $$(".c5-season__row", seasonBlock).forEach(function (r) {
    panelSet($(".c5-season__panel", r), r.getAttribute("data-open") === "true", true);
  });

  /* Entrance of the rows: one-shot fade-in from below, the first time the block shows up on
     screen. Timed (CSS transition), not tied to the scroll offset. Without
     IntersectionObserver or without scroll mechanics the rows are simply there. */
  function releaseRows() { seasonBlock.classList.add("is-in"); }
  if (!("IntersectionObserver" in window) || !CX5.motionOn()) {
    releaseRows();
  } else {
    var seasonIO = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        releaseRows();
        seasonIO.disconnect();
        return;
      }
    }, { threshold: 0.2 });
    seasonIO.observe(seasonBlock);
    var releaseIfStatic = function () { if (!CX5.motionOn()) { seasonIO.disconnect(); releaseRows(); } };
    if (CX5.wideMQ.addEventListener) {
      CX5.wideMQ.addEventListener("change", releaseIfStatic);
      CX5.reducedMQ.addEventListener("change", releaseIfStatic);
    }
  }

  CX5.register({ scroll: updateSeason, resize: sizeSeasonPin });
})();
