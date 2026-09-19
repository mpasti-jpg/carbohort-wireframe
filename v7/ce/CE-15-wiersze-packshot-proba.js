/* ===== CE-15 (trial) · Cascade of three accordions with a countdown ==========
   Trial version of CE-15 „Wiersze z packshotem” for the Figma frame „Frame 224”
   (303:2863), linked by produkty.html ONLY (spec §22.2). The shared module
   ce/CE-15-wiersze-packshot.js stays untouched until Mateusz accepts this trial
   (spec §21.0.1), so carbomat.html keeps the pinned rows.

   One DOM, three behaviours:
   · no JS (or before this module runs): every panel is open – the CSS default;
   · with JS: `data-casc="on"`, one card open at a time, the first at start. A
     click on a closed card opens it, a click on the open one closes it (then
     none is open – Mateusz: „Możemy zamknąć wszystkie, ale otwarty może być
     tylko jeden”);
   · with CX5.motionOn() (so never below 900 px and never with reduced motion)
     the countdown runs: a 5 s CSS animation winds the ring around the minus
     icon of the OPEN card, then the next card opens and this one closes; after
     the third it comes back to the first. It runs only while the cascade is on
     screen (IntersectionObserver) and the browser tab is visible, and it holds
     (the ring stands still) while the pointer is over the open card or the
     focus is inside the cascade. Any click or keyboard activation of any header
     stops it until the page is reloaded.
   The countdown never moves the focus and never scrolls; the open cards all
   share one height (--c5-casc-h), so the cascade, the hairlines and the page
   keep exactly the height they had before the automatic change.

   Entrance: the first time the cascade shows up the cards arrive one after
   another (`is-in` on the root, delays in CSS), with the first already open. */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;
  var roots = $$("[data-casc]");
  if (!roots.length) return;
  roots.forEach(setup);

  function setup(root) {
    var list = $(".c5-casc__list", root);
    if (!list) return;
    var items = $$(".c5-casc__item", list);
    var btns = items.map(function (it) { return $(".c5-casc__btn", it); });
    var panels = items.map(function (it) { return $(".c5-casc__panel", it); });
    var n = items.length;
    /* incomplete markup – the panels stay open, which is the readable state */
    if (!n || btns.indexOf(null) !== -1 || panels.indexOf(null) !== -1) return;

    var cur = 0;              /* open card, -1 = none                         */
    var stopped = false;      /* a click switched the countdown off for good   */
    var auto = false;         /* countdown allowed right now                   */
    var inView = false;       /* the cascade is on screen                      */
    var entered = false;      /* the entrance has already been played          */
    var hovered = -1, focusIn = false;

    /* --- open height -----------------------------------------------------
       The panel inner keeps its natural height whatever the panel does (the
       panel only clips it), so it can be measured at any time. In the cascade
       every card takes the tallest of the three, so the column heights and the
       hairlines do not jump; in the one-column accordion each card takes its
       own. Applied with the transition off – a measurement must never look
       like an animation. */
    function measure() {
      var wide = CX5.wideMQ.matches, own = [], max = 0;
      items.forEach(function (it, j) {
        var inner = panels[j].firstElementChild;
        var h = inner ? inner.getBoundingClientRect().height : 0;
        own.push(h);
        if (h > max) max = h;
      });
      panels.forEach(function (p) { p.style.transition = "none"; });
      items.forEach(function (it, j) {
        it.style.setProperty("--c5-casc-h", (wide ? max : own[j]) + "px");
      });
      panels.forEach(function (p) { void p.offsetHeight; p.style.transition = ""; });
    }

    /* --- open / close ----------------------------------------------------
       `instant` skips the height animation (page start). Nothing here touches
       the focus or the scroll position. */
    function paint(instant) {
      if (instant) panels.forEach(function (p) { p.style.transition = "none"; });
      items.forEach(function (it, j) {
        var on = j === cur;
        btns[j].setAttribute("aria-expanded", on ? "true" : "false");
        if (on) it.setAttribute("data-open", ""); else it.removeAttribute("data-open");
        panels[j].inert = !on;
      });
      if (instant) panels.forEach(function (p) { void p.offsetHeight; p.style.transition = ""; });
    }

    /* --- countdown -------------------------------------------------------- */
    function held() { return hovered === cur || focusIn; }
    function clearTimer() {
      items.forEach(function (it) { it.removeAttribute("data-casc-timer"); });
    }
    function armTimer() {
      clearTimer();
      if (!auto || cur < 0 || !inView || doc.hidden) return;
      var it = items[cur];
      void it.offsetWidth;                                   /* restart the CSS animation */
      it.setAttribute("data-casc-timer", held() ? "hold" : "run");
    }
    /* only the attribute VALUE changes, so the ring keeps its position */
    function syncHold() {
      var h = held();
      items.forEach(function (it) {
        if (it.hasAttribute("data-casc-timer")) it.setAttribute("data-casc-timer", h ? "hold" : "run");
      });
    }
    function stopAuto() {
      stopped = true;
      auto = false;
      clearTimer();
    }
    function syncAuto() {
      auto = !stopped && CX5.motionOn();
      if (auto) armTimer(); else clearTimer();
    }

    /* --- events ----------------------------------------------------------- */
    btns.forEach(function (b, i) {
      /* a <button> fires click on Enter and Space too, so this is also the
         keyboard activation Mateusz asked to stop the automatic changes */
      b.addEventListener("click", function () {
        stopAuto();
        cur = i === cur ? -1 : i;
        paint(false);
      });
    });
    items.forEach(function (it, j) {
      it.addEventListener("mouseenter", function () { hovered = j; syncHold(); });
      it.addEventListener("mouseleave", function () { if (hovered === j) hovered = -1; syncHold(); });
    });
    root.addEventListener("focusin", function () { focusIn = true; syncHold(); });
    root.addEventListener("focusout", function (e) {
      if (e.relatedTarget && root.contains(e.relatedTarget)) return;
      focusIn = false;
      syncHold();
    });
    /* the ring closed – hand the open state over to the next card */
    list.addEventListener("animationend", function (e) {
      if (e.animationName !== "c5-casc-count" || !auto) return;
      var it = e.target && e.target.closest ? e.target.closest(".c5-casc__item") : null;
      if (!it || !it.hasAttribute("data-casc-timer") || items.indexOf(it) !== cur) return;
      cur = (cur + 1) % n;
      paint(false);
      armTimer();
    });
    doc.addEventListener("visibilitychange", function () {
      if (doc.hidden) clearTimer(); else armTimer();
    });
    if (window.IntersectionObserver) {
      var io = new window.IntersectionObserver(function (entries) {
        inView = entries[entries.length - 1].isIntersecting;
        if (inView && !entered) { entered = true; root.classList.add("is-in"); }
        if (inView) armTimer(); else clearTimer();
      }, { threshold: 0 });
      io.observe(list);
    } else {
      inView = entered = true;
      root.classList.add("is-in");
    }

    /* --- start ------------------------------------------------------------ */
    measure();                         /* while the panels still stand open */
    root.setAttribute("data-casc", "on");
    paint(true);
    syncAuto();
    CX5.register({ resize: measure });
    /* web fonts land after the first measurement and change the text height */
    if (doc.fonts && doc.fonts.ready && doc.fonts.ready.then) doc.fonts.ready.then(measure);
    if (CX5.wideMQ.addEventListener) {
      CX5.wideMQ.addEventListener("change", syncAuto);
      CX5.reducedMQ.addEventListener("change", syncAuto);
    } else if (CX5.wideMQ.addListener) {
      CX5.wideMQ.addListener(syncAuto);
      CX5.reducedMQ.addListener(syncAuto);
    }
  }
})();
