/* ===== CE-49 · Harmonogram na osi – rebuilt 19.09.2026 (spec prochnica-plus-wzorzec-eco-spec §18.7). =====

   The markup is the single source of data AND of the base geometry: eleven
   stages in chronological order, each with --n (its place on the axis), plus
   --l/--w on the years and --n on the "jesteśmy tutaj" marker. This module only
   turns those numbers into pixels and writes them back as --hx / --hw / --hy.

   Mechanics (900 px and up):
   - the space between line i and line i+1 is the button of event i; hovering it
     shows the minimal description glued to the side of the line at cursor height,
     flipped to the left side when it would not fit on the right;
   - a click expands that segment to min(560 px, 45 % of the canvas) and squeezes
     the others proportionally, never below 14 px, so no line ever leaves the
     canvas (the Figma frame let them run off the right edge – that was a mock-up
     slip, not a rule). Years ride the very same piecewise-linear map.

   Nothing here listens to `wheel` and nothing captures page scrolling. Below
   900 px the same markup stays a vertical list and a tap expands one stage.
   With reduced motion the interactions work, only the transitions are gone. */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$, clamp = CX5.clamp;

  var root = $("[data-hz]");
  if (!root) return;
  var canvas = $("[data-hz-canvas]", root);
  var yearsBox = $("[data-hz-years]", root);
  var nowEl = $("[data-hz-now]", root);
  var say = $("[data-hz-say]", root);
  var items = $$(".c5-hz__item", root);
  var N = items.length;
  if (!canvas || !yearsBox || !N) return;

  var btns = items.map(function (li) { return li.querySelector(".c5-hz__line"); });
  var panels = items.map(function (li) { return li.querySelector(".c5-hz__panel"); });
  var years = $$("li", yearsBox);
  if (btns.indexOf(null) > -1 || panels.indexOf(null) > -1) return;

  function num(el, name) { return parseFloat(el.style.getPropertyValue(name)) || 0; }
  var basePct = items.map(function (li) { return num(li, "--n"); });
  var yearPct = years.map(function (li) { return { l: num(li, "--l"), w: num(li, "--w") }; });
  var nowPct = nowEl ? num(nowEl, "--n") : null;

  var MIN_SEG = 14;            /* narrowest a squeezed segment may become  */
  var MIN_HIT = 24;            /* narrowest hit target of a line (spec)    */
  var CARD_MAX = 560;          /* widest the open segment may become       */

  var W = 0, H = 0, span = 0, miniW = 300, gap = 16;
  var baseX = [], curX = [], open = -1, mini = -1, hinted = false, miniH = [];
  var yearW = [];              /* natural width of every year label, in px */

  /* ---------- geometry ---------------------------------------------------- */
  function wide() { return CX5.wideMQ.matches; }

  function measure() {
    var r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    var cs = window.getComputedStyle(root);
    miniW = parseFloat(cs.getPropertyValue("--hz-mini-w")) || 300;
    gap = parseFloat(cs.getPropertyValue("--hz-gap")) || 16;
    /* the last event owns the stretch to the right of its line, so the axis
       stops short of the right edge and keeps a readable tail */
    var tail = clamp(W * 0.09, 96, 180);
    span = Math.max(1, W - tail);
    baseX = basePct.map(function (p) { return p / 100 * span; });
    /* the label is an inline-block, so it always reports its natural width */
    yearW = years.map(function (li) {
      var s = li.firstElementChild;
      return s ? s.getBoundingClientRect().width : 0;
    });
  }

  function baseSeg(i) { return (i < N - 1 ? baseX[i + 1] : W) - baseX[i]; }

  /* Positions of every line for a given open event (-1 = nothing open). */
  function solve(k) {
    var i, seg = [];
    for (i = 0; i < N; i++) seg[i] = Math.max(0, baseSeg(i));
    if (k < 0) return baseX.slice();

    var big = Math.min(CARD_MAX, W * 0.45);
    big = Math.min(big, Math.max(MIN_SEG, W - MIN_SEG * (N - 1)));
    var rest = W - big;

    var out = new Array(N), fixed = new Array(N);
    for (i = 0; i < N; i++) { out[i] = seg[i]; fixed[i] = false; }
    out[k] = big; fixed[k] = true;

    for (var pass = 0; pass < N; pass++) {
      var free = 0, left = rest, changed = false;
      for (i = 0; i < N; i++) {
        if (i === k) continue;
        if (fixed[i]) left -= out[i]; else free += seg[i];
      }
      if (free <= 0) break;
      var s = left / free;
      for (i = 0; i < N; i++) {
        if (i === k || fixed[i]) continue;
        if (seg[i] * s < MIN_SEG) { out[i] = MIN_SEG; fixed[i] = true; changed = true; }
      }
      if (!changed) {
        for (i = 0; i < N; i++) if (i !== k && !fixed[i]) out[i] = seg[i] * s;
        break;
      }
    }

    var X = [0];
    for (i = 1; i < N; i++) X[i] = X[i - 1] + out[i - 1];
    return X;
  }

  /* One piecewise-linear map for lines, years and the "jesteśmy tutaj" tick. */
  function remap(x, X) {
    if (x <= 0) return 0;
    for (var i = 0; i < N; i++) {
      var a = baseX[i], b = (i < N - 1 ? baseX[i + 1] : W);
      if (x < b || i === N - 1) {
        var A = X[i], B = (i < N - 1 ? X[i + 1] : W);
        var t = (b - a) > 0 ? clamp((x - a) / (b - a), 0, 1) : 0;
        return A + (B - A) * t;
      }
    }
    return W;
  }

  function paint(X, instant) {
    if (instant) { root.classList.add("is-still"); void root.offsetWidth; }
    curX = X;
    items.forEach(function (li, i) {
      var next = (i < N - 1 ? X[i + 1] : W);
      li.style.setProperty("--hx", X[i] + "px");
      li.style.setProperty("--hw", Math.max(MIN_HIT, next - X[i]) + "px");
    });
    /* The year sits at the START of its range – the boundary, the hairline and
       the left edge of the label are the same x. Only when the label would run
       off the right edge of the canvas does it slide back (--hoff); the hairline
       stays on the boundary. A range too tight for its label drops the label. */
    years.forEach(function (li, j) {
      var a = remap(yearPct[j].l / 100 * span, X);
      var b = remap((yearPct[j].l + yearPct[j].w) / 100 * span, X);
      var lw = yearW[j] || 0;
      li.style.setProperty("--hx", a + "px");
      li.style.setProperty("--hw", Math.max(0, b - a) + "px");
      li.style.setProperty("--hoff", Math.min(0, W - (a + lw)) + "px");
      li.classList.toggle("is-tight", (b - a) < lw + 6);
    });
    if (nowEl) nowEl.style.setProperty("--hx", remap(nowPct / 100 * span, X) + "px");
    if (instant) { void root.offsetWidth; root.classList.remove("is-still"); }
    miniH = [];
  }

  function relayout(instant) {
    if (!wide()) { setMini(-1); return; }
    measure();
    paint(solve(open), instant !== false);
    if (mini > -1) placeMini(mini, lastY);
  }

  /* ---------- minimal description (hover / focus) -------------------------- */
  var lastY = 0;

  function placeMini(i, y) {
    if (!wide() || i < 0) return;
    var li = items[i];
    /* height is stable per event, so measure once and reuse while hovering */
    if (!miniH[i]) miniH[i] = panels[i].getBoundingClientRect().height || 150;
    li.style.setProperty("--hy", clamp(y - 22, 8, Math.max(8, H - miniH[i] - 8)) + "px");
    var x = curX[i] !== undefined ? curX[i] : 0;
    var fitsRight = x + gap + miniW <= W;
    var fitsLeft = x - gap - miniW >= 0;
    li.classList.toggle("is-flip", !fitsRight && fitsLeft);
  }

  function setMini(i, y) {
    if (mini === i) { if (i > -1) placeMini(i, y === undefined ? lastY : y); return; }
    if (mini > -1) { items[mini].classList.remove("is-mini", "is-flip"); }
    mini = i;
    if (i > -1) {
      items[i].classList.add("is-mini");
      placeMini(i, y === undefined ? lastY : y);
    }
  }

  /* ---------- open / close ------------------------------------------------- */
  function setOpen(k) {
    if (open === k) k = -1;
    if (open > -1) {
      items[open].classList.remove("is-open");
      btns[open].setAttribute("aria-expanded", "false");
    }
    open = k;
    if (k > -1) {
      items[k].classList.add("is-open");
      btns[k].setAttribute("aria-expanded", "true");
      if (say) say.textContent = btns[k].getAttribute("aria-label") || "";
      if (mini === k) setMini(-1);
    } else if (say) {
      say.textContent = "";
    }
    if (wide()) paint(solve(open), false);
  }

  /* ---------- events -------------------------------------------------------- */
  function indexOfBtn(t) {
    var b = t && t.closest ? t.closest(".c5-hz__line") : null;
    return b ? btns.indexOf(b) : -1;
  }

  function dropHint() {
    if (!hinted) { hinted = true; setMini(-1); }
  }

  canvas.addEventListener("pointerover", function (e) {
    if (!wide()) return;
    var i = indexOfBtn(e.target);
    if (i < 0) return;
    hinted = true;
    lastY = e.clientY - canvas.getBoundingClientRect().top;
    setMini(i === open ? -1 : i, lastY);
  });

  canvas.addEventListener("pointermove", function (e) {
    if (!wide() || mini < 0) return;
    lastY = e.clientY - canvas.getBoundingClientRect().top;
    placeMini(mini, lastY);
  });

  canvas.addEventListener("pointerleave", function () {
    if (!wide()) return;
    dropHint();
    setMini(-1);
  });

  items.forEach(function (li, i) {
    btns[i].addEventListener("click", function () { dropHint(); setOpen(i); });
    btns[i].addEventListener("focus", function () {
      if (!wide()) return;
      hinted = true;
      lastY = H * 0.22;
      setMini(i === open ? -1 : i, lastY);
    });
    btns[i].addEventListener("blur", function () { if (mini === i) setMini(-1); });
  });

  /* Arrows walk the events, Esc closes the card. Nothing here touches the page
     scroll – only the focus and the open card move. */
  root.addEventListener("keydown", function (e) {
    var k = e.key, to = null;
    if (k === "Escape") {
      if (open < 0) return;
      var back = open;
      e.preventDefault();
      setOpen(-1);
      btns[back].focus();
      return;
    }
    var from = indexOfBtn(e.target);
    if (from < 0) return;
    if (k === "ArrowRight") to = from + 1;
    else if (k === "ArrowLeft") to = from - 1;
    else if (k === "Home") to = 0;
    else if (k === "End") to = N - 1;
    if (to === null) return;
    to = clamp(to, 0, N - 1);
    e.preventDefault();
    if (to === from) return;
    btns[to].focus();
    if (open > -1) setOpen(to);
  });

  /* ---------- start --------------------------------------------------------- */
  items.forEach(function (li, i) {
    li.style.setProperty("--i", i);
    li.style.zIndex = String(N - i);   /* a line always owns its own left edge */
    btns[i].setAttribute("aria-expanded", "false");
  });
  root.classList.add("is-ready");
  relayout(true);
  CX5.register({ resize: function () { relayout(true); } });

  /* Nothing is open at the start (as in the frame); the next step shows its own
     minimal description until the reader first hovers the axis. */
  var hint = items.filter(function (li) { return li.getAttribute("data-next") === "true"; })[0];
  if (hint) {
    var hi = items.indexOf(hint);
    var show = function () {
      if (hinted || !wide()) return;
      lastY = H * 0.22;
      setMini(hi, lastY);
    };
    if (CX5.motionOn()) window.setTimeout(show, 900); else show();
  }
})();
