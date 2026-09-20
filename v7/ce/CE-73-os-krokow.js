/* ===== CE-73 · Oś kroków z horyzontem efektu (rejestr: ce-rejestr.js) ==================================
   Prefix: c5-st. Module of the shared layer.
   One IIFE, a no-op when its markup is absent.

   The line fills from the left (scaleX) with the section crossing the window,
     the nodes light up one after another and the columns cascade in. The
     segments of the horizon fill once the bar enters the viewport. Only behind
     CX5.motionOn(); otherwise everything stands in its final state.

   The bus CX5 (ce/00-base.js) starts itself: this file never calls CX5.start()
   and never defines CX5. Comments in English, never the em dash, and never the
   literal end-of-script tag. ============================================= */
(function () {
  "use strict";
  var axes = CX5.$$("[data-st-axis]");
  if (!axes.length) return;

  /* Progress window of the spec: 0 while the line is at 80 % of the window
     height, 1 once it has climbed to 35 %. */
  var FROM = 0.80;
  var TO = 0.35;

  var items = axes.map(function (axis) {
    return {
      axis: axis,
      line: CX5.$(".c5-st__line", axis),
      steps: CX5.$$(".c5-st__step", axis),
      nodes: CX5.$$(".c5-st__node", axis),
      frac: []
    };
  }).filter(function (it) { return it.line && it.steps.length && it.nodes.length; });
  if (!items.length) return;

  /* Where each node sits on the line, as a share of its length. Measured on
     resize only: the fractions cannot change while the page merely scrolls. */
  function measure() {
    items.forEach(function (it) {
      var r = it.line.getBoundingClientRect();
      var span = r.width || 1;
      it.frac = it.nodes.map(function (node) {
        var n = node.getBoundingClientRect();
        return (n.left + n.width / 2 - r.left) / span;
      });
    });
  }

  function reset(it) {
    it.axis.removeAttribute("data-st");
    it.axis.style.removeProperty("--c5-st-p");
    it.steps.forEach(function (s) { s.removeAttribute("data-on"); });
  }

  function scroll() {
    var on = CX5.motionOn();
    var h = window.innerHeight;
    items.forEach(function (it) {
      if (!on) { reset(it); return; }
      if (!it.axis.hasAttribute("data-st")) it.axis.setAttribute("data-st", "");
      var top = it.line.getBoundingClientRect().top;
      var p = CX5.clamp((h * FROM - top) / (h * (FROM - TO)), 0, 1);
      it.axis.style.setProperty("--c5-st-p", p.toFixed(4));
      it.steps.forEach(function (step, i) {
        var lit = p >= (it.frac[i] === undefined ? i / it.steps.length : it.frac[i]);
        if (lit === step.hasAttribute("data-on")) return;
        if (lit) step.setAttribute("data-on", ""); else step.removeAttribute("data-on");
      });
    });
  }

  function resize() {
    if (CX5.motionOn()) measure();
    scroll();
  }

  CX5.register({ scroll: scroll, resize: resize });
})();
