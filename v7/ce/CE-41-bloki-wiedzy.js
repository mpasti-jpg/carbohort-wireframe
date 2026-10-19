/* ===== CE-41 · Bloki wiedzy – proof numbers as an odometer, bar values counting ======
   1) Odometer (20.10.2026, owner: „fajniejsza animacja odliczania… im większa cyfra –
   tysiące, setki, dziesiątki – tym wolniej się odlicza”). Every `.c5pr-stat__num` carries
   its final value as plain text („−1119,4 ”, „+31”) followed by a unit span. When the
   number crosses the trigger line (CX5.onEnter, 00-base.js) every digit becomes its own
   column that rolls like a meter: the lowest place spins through several full turns,
   quickly; each higher place turns fewer times and takes longer (1.0 s for the lowest,
   +0.3 s per place up). Sign, decimal comma and unit stand still. Each column is sized
   by the final digit (hidden under the strip) and the digits are tabular, so the width
   never changes; at the end the original text node comes back – EXACTLY the HTML value.
   Screen readers get the final value from a visually hidden copy during the run.
   2) Bar values (20.10.2026): in the retention chart `.c5-barchart--karty[data-reveal]` the
   value on the right of every bar („11,9%”, „>48%”) counts up together with ITS bar – same
   delay and duration as the fill transition (read from the computed style) – and ends on
   the original string. Prefixes such as „>” and the „%” stay as they are.
   Without JS and with reduced motion the final values simply stand there; the bar values
   also stay put whenever the bars do not grow (phone, motion off). ================== */
(function () {
  "use strict";
  if (CX5.reducedMQ.matches || !CX5.onEnter) return;
  var NUM = /^(\s*)([−+-]?)(\d+)(?:,(\d+))?(\s*)$/;

  /* --- 1) odometer ---------------------------------------------------------- */
  var BASE = 1000, PER_PLACE = 300, MAX_TURNS = 3;
  var EASE = "cubic-bezier(.2,.75,.25,1)";

  function span(cls, text) {
    var s = document.createElement("span");
    if (cls) s.className = cls;
    if (text != null) s.textContent = text;
    return s;
  }

  function odometer(el) {
    var node = el.firstChild;
    if (!node || node.nodeType !== 3) return;
    var raw = node.nodeValue;
    var m = NUM.exec(raw);
    if (!m) return;
    el.style.fontVariantNumeric = "tabular-nums";
    /* lock the width to the final value before anything changes */
    var w = el.getBoundingClientRect().width;
    if (w > 0) el.style.minWidth = Math.ceil(w) + "px";

    var digits = (m[3] + (m[4] || "")).split("");
    var count = digits.length;
    var odo = span("c5-odo");
    odo.setAttribute("aria-hidden", "true");
    if (m[2]) odo.appendChild(document.createTextNode(m[2]));
    var runs = [];
    digits.forEach(function (d, j) {
      if (m[4] && j === m[3].length) odo.appendChild(document.createTextNode(","));
      var turns = Math.min(j, MAX_TURNS);          /* the lower the place, the more turns */
      var col = span("c5-odo__col");
      col.appendChild(span("c5-odo__fin", d));     /* sizes the column, never visible */
      var strip = span("c5-odo__strip");
      var n = turns * 10 + Number(d) + 1;
      for (var i = 0; i < n; i++) strip.appendChild(span("", String(i % 10)));
      col.appendChild(strip);
      odo.appendChild(col);
      runs.push({ strip: strip, steps: n - 1, total: n, dur: BASE + (count - 1 - j) * PER_PLACE });
    });
    var sr = span("wf-sr-only", raw);
    el.replaceChild(odo, node);
    el.insertBefore(sr, odo);

    function finish() {
      if (!odo.parentNode) return;
      el.replaceChild(node, odo);
      if (sr.parentNode) el.removeChild(sr);
    }
    CX5.onEnter(el, function () {
      var longest = 0;
      runs.forEach(function (r) {
        longest = Math.max(longest, r.dur);
        var to = "translateY(" + (-100 * r.steps / r.total) + "%)";
        if (r.strip.animate) r.strip.animate([{ transform: "translateY(0)" }, { transform: to }], { duration: r.dur, easing: EASE, fill: "forwards" });
        else r.strip.style.transform = to;
      });
      window.setTimeout(finish, longest + 60);
    });
  }
  CX5.$$(".c5pr-stat__num").forEach(odometer);

  /* --- 2) values of the growing bars ---------------------------------------- */
  var VAL = /^(\s*[^\d−+-]*)([−+-]?)(\d+)(?:,(\d+))?(.*)$/;
  function sec(v) {
    v = String(v || "0s").split(",")[0].trim();
    return v.indexOf("ms") > 0 ? parseFloat(v) : parseFloat(v) * 1000;
  }
  CX5.$$(".c5-barchart--karty[data-reveal]").forEach(function (chart) {
    if (!CX5.motionOn() || chart.classList.contains("is-in")) return;
    var bars = [];
    CX5.$$(".c5-bar", chart).forEach(function (bar) {
      var val = bar.querySelector(".c5-bar__track ~ .c5-muted");
      var fill = bar.querySelector(".c5-bar__fill");
      if (!val || !fill || val.children.length) return;
      var raw = val.textContent;
      var m = VAL.exec(raw);
      if (!m) return;
      var w = val.getBoundingClientRect().width;
      if (w > 0) val.style.minWidth = Math.ceil(w) + "px";
      var dec = m[4] ? m[4].length : 0;
      var it = { val: val, fill: fill, raw: raw, m: m, dec: dec, target: parseFloat(m[3] + (m[4] ? "." + m[4] : "")) };
      it.show = function (x) { val.textContent = m[1] + m[2] + x.toFixed(dec).replace(".", ",") + m[5]; };
      it.show(0);
      bars.push(it);
    });
    if (!bars.length) return;
    function run(it) {
      var cs = getComputedStyle(it.fill);
      var delay = sec(cs.transitionDelay), dur = sec(cs.transitionDuration);
      if (!(dur > 0)) { it.val.textContent = it.raw; return; }
      var t0 = performance.now() + delay;
      function frame(now) {
        var p = Math.max(0, Math.min(1, (now - t0) / dur));
        if (p >= 1) { it.val.textContent = it.raw; return; }
        it.show(it.target * (1 - Math.pow(1 - p, 3)));
        window.requestAnimationFrame(frame);
      }
      window.requestAnimationFrame(frame);
    }
    /* the chart gets `is-in` from the reveal layer (00-base.js) – the bars start with it */
    var mo = new MutationObserver(function () {
      if (!chart.classList.contains("is-in")) return;
      mo.disconnect();
      bars.forEach(run);
    });
    mo.observe(chart, { attributes: true, attributeFilter: ["class"] });
  });
})();
