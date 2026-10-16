/* ===== CE-97 · Oś historii (rejestr: ce-rejestr.js) ==========================
   Turns the stacked milestone cards into one row that scrolls sideways and
   ties it to the axis of years.
     · Adds .is-ready to the root (the CSS switches to the sideways row), makes
       the row focusable (role="group", tabindex="0", aria-label from
       data-hist-label) and unhides the axis. Without this script the cards
       stand one under another and the axis stays hidden.
     · The row scrolls natively with scroll snap (touch, trackpad, keyboard on
       the focused row). A mouse can also drag it; on release the row settles
       on the nearest card, or on the next one in the direction of the drag.
     · Active card = the one whose snap position is nearest to the scroll
       position (the last card once the row reaches its end). It gets
       .is-active, its year on the axis gets aria-current="true"; on a phone the
       axis scrolls itself so the active year stays in view.
     · A click on a year (or Enter on it) scrolls the row to its card – smoothly,
       at once with reduced motion; the page itself does not move. Arrow keys,
       Home and End move between the years of the axis.
     · An address with the hash of a card (#<card id>) opens the row on that
       card; the page scroll is left to the shared hash routing.
     · A sideways wheel gesture (horizontal wheel, Shift + wheel, a sideways
       swipe on a trackpad) over the row moves it by one card per gesture; the
       event stops here, so the page inertia layer does not turn it into a
       vertical page scroll. A vertical wheel is left alone and scrolls the page.
     · On resize the row returns to the active card (CX5 bus).
   The row never moves by itself.
   No [data-hist] -> no-op. =================================================== */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp, reducedMQ = CX5.reducedMQ;
  var roots = $$("[data-hist]");
  if (!roots.length) return;

  roots.forEach(function (root) {
    var view = $("[data-hist-view]", root);
    var axis = $("[data-hist-axis]", root);
    var cards = view ? $$("[data-hist-card]", view) : [];
    if (!view || !axis || cards.length < 2) return;
    var years = $(".c5-hist__years", axis) || axis;
    var links = $$("[data-hist-go]", axis);
    /* card index behind every year link (-1 = no such card) */
    var target = links.map(function (a) {
      var id = (a.getAttribute("href") || "").slice(1);
      for (var i = 0; i < cards.length; i++) if (cards[i].id === id) return i;
      return -1;
    });
    /* `goal` = the card a click is taking the row to; null when the row rests */
    var active = -1, goal = null, goalTimer = 0, ticking = false, drag = null;

    function max() { return Math.max(0, view.scrollWidth - view.clientWidth); }
    /* scroll position that puts card i at the snap line (the container edge) */
    function cardX(i) { return clamp(cards[i].offsetLeft - cards[0].offsetLeft, 0, max()); }
    function nearest() {
      var x = view.scrollLeft, m = max();
      if (m > 1 && x >= m - 2) return cards.length - 1;
      var best = 0, dist = Infinity;
      for (var i = 0; i < cards.length; i++) {
        var d = Math.abs(cardX(i) - x);
        if (d < dist) { dist = d; best = i; }
      }
      return best;
    }

    /* on a phone the axis is its own scroller: keep the active year in view */
    function showYear(a, instant) {
      if (!a || years.scrollWidth <= years.clientWidth + 1) return;
      var li = a.parentNode;
      var centre = li.offsetLeft + a.offsetLeft + a.offsetWidth / 2;
      var left = clamp(centre - years.clientWidth / 2, 0, years.scrollWidth - years.clientWidth);
      years.scrollTo({ left: left, behavior: instant || reducedMQ.matches ? "auto" : "smooth" });
    }

    function setActive(i, instant) {
      if (i === active) return;
      active = i;
      cards.forEach(function (c, k) { c.classList.toggle("is-active", k === i); });
      links.forEach(function (a, k) {
        if (target[k] === i) { a.setAttribute("aria-current", "true"); showYear(a, instant); }
        else a.removeAttribute("aria-current");
      });
    }

    function sync() {
      ticking = false;
      if (drag && drag.moved) return;
      setActive(goal === null ? nearest() : goal);
    }

    function go(i, instant) {
      i = clamp(i, 0, cards.length - 1);
      goal = i;
      window.clearTimeout(goalTimer);
      goalTimer = window.setTimeout(function () { goal = null; sync(); }, 900);
      view.scrollTo({ left: cardX(i), behavior: instant || reducedMQ.matches ? "auto" : "smooth" });
      setActive(i, instant);
    }

    view.addEventListener("scroll", function () {
      /* the row reached the card the click asked for: back to the real position */
      if (goal !== null && Math.abs(view.scrollLeft - cardX(goal)) < 2) {
        goal = null;
        window.clearTimeout(goalTimer);
      }
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(sync);
    }, { passive: true });

    /* --- the axis: click, Enter, arrows ----------------------------------------- */
    links.forEach(function (a, k) {
      a.addEventListener("click", function (e) {
        if (target[k] < 0 || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();          /* the shared hash routing skips prevented clicks */
        go(target[k]);
      });
    });
    axis.addEventListener("keydown", function (e) {
      var k = links.indexOf(document.activeElement);
      if (k < 0) return;
      var to = e.key === "ArrowRight" || e.key === "ArrowDown" ? k + 1
             : e.key === "ArrowLeft" || e.key === "ArrowUp" ? k - 1
             : e.key === "Home" ? 0 : e.key === "End" ? links.length - 1 : null;
      if (to === null) return;
      e.preventDefault();
      to = clamp(to, 0, links.length - 1);
      links[to].focus({ preventScroll: true });
      if (target[to] >= 0) go(target[to]);
    });

    /* --- mouse drag (touch and trackpad scroll natively) ------------------------ */
    $$("img", view).forEach(function (img) { img.draggable = false; });
    view.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag = { id: e.pointerId, x: e.clientX, left: view.scrollLeft, from: nearest(), moved: false };
    });
    view.addEventListener("pointermove", function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x;
      if (!drag.moved) {
        if (Math.abs(dx) < 5) return;
        drag.moved = true;
        goal = null;
        window.clearTimeout(goalTimer);
        view.classList.add("is-dragging");
        try { view.setPointerCapture(drag.id); } catch (err) { /* pointer already gone */ }
      }
      view.scrollLeft = drag.left - dx;
      e.preventDefault();
    });
    function endDrag(e) {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      var d = drag;
      drag = null;
      if (!d.moved) return;
      var moved = view.scrollLeft - d.left;
      var to = nearest();
      /* a deliberate pull moves at least one card, even if it stopped short */
      if (to === d.from && Math.abs(moved) > 40) to = d.from + (moved > 0 ? 1 : -1);
      go(to);
      /* snap comes back only when the row has settled, so it cannot fight the move */
      var done = false;
      var release = function () {
        if (done) return;
        done = true;
        view.removeEventListener("scrollend", release);
        view.classList.remove("is-dragging");
      };
      view.addEventListener("scrollend", release);
      window.setTimeout(release, 700);
    }
    view.addEventListener("pointerup", endDrag);
    view.addEventListener("pointercancel", endDrag);
    view.addEventListener("lostpointercapture", endDrag);

    /* --- sideways wheel: one card per gesture ------------------------------------
       Snap points are a card apart, so single wheel notches (about 120 px) would
       snap back to the same card; the gesture is turned into a step instead. A
       gesture ends after a short pause in wheel events. */
    var wheel = { sum: 0, used: false, timer: 0 };
    view.addEventListener("wheel", function (e) {
      if (e.ctrlKey || drag) return;
      var dx = e.deltaX, dy = e.deltaY;
      if (e.shiftKey && !dx) { dx = dy; dy = 0; }
      if (!dx || Math.abs(dx) <= Math.abs(dy)) return;      /* vertical: the page scrolls */
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaMode === 1) dx *= 40; else if (e.deltaMode === 2) dx *= view.clientWidth;
      window.clearTimeout(wheel.timer);
      wheel.timer = window.setTimeout(function () { wheel.sum = 0; wheel.used = false; }, 220);
      if (wheel.used) return;
      wheel.sum += dx;
      if (Math.abs(wheel.sum) < 30) return;
      wheel.used = true;
      var from = goal === null ? active : goal;
      go(from + (wheel.sum > 0 ? 1 : -1));
    }, { passive: false });

    /* --- an address that points at one of the cards ---------------------------- */
    CX5.onHash(function (hash, instant) {
      var id = (hash || "").slice(1);
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].id === id) { go(i, instant); break; }
      }
      return false;                  /* the page scroll stays with the shared routing */
    });

    /* --- switch on ------------------------------------------------------------- */
    root.classList.add("is-ready");
    view.setAttribute("role", "group");
    view.setAttribute("tabindex", "0");
    view.setAttribute("aria-label", view.getAttribute("data-hist-label") || "Oś czasu – karty przewijane w poziomie");
    axis.hidden = false;
    CX5.register({ resize: function () {
      if (drag) return;
      goal = null;
      view.scrollLeft = cardX(active < 0 ? 0 : active);
      sync();
    } });
    setActive(nearest(), true);
  });
})();
