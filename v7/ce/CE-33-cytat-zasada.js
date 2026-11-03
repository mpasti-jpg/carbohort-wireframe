/* ===== CE-33 · Cytat / zasada (rejestr: ce-rejestr.js) ======================
   Variant `slowa` (home.html#idea): the words of a big statement light up one
   by one with the scroll, the idea of `c5-vs--slowa` in CE-70 without the
   pinned scene. Every word of [data-slowa] gets its own span.c5-quote__w (--i =
   index) once, text nodes only, so nested spans stay and a no-break space keeps
   its two words in one span. One loop writes `--q-w` (words lit, a float):
   0 while the top of the text is below 78 % of the window, all of them when
   its middle reaches 45 %. CSS turns that into opacity and only under
   prefers-reduced-motion: no-preference. Works at every width, nothing is
   pinned and `wheel` is not touched. No [data-slowa] -> no-op. =============== */
(function () {
  "use strict";
  if (!window.CX5) return;
  var START = 0.78, END = 0.45;
  var els = CX5.$$("[data-slowa]");
  if (!els.length) return;

  function wrap(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), nodes = [], tn, count = 0;
    while ((tn = walker.nextNode())) nodes.push(tn);
    nodes.forEach(function (node) {
      if (!node.nodeValue.trim()) return;
      var frag = document.createDocumentFragment();
      /* ordinary white space only: U+00A0 belongs to \s and would split a word pair */
      node.nodeValue.split(/([ \t\r\n]+)/).forEach(function (part) {
        if (!part) return;
        if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
        var w = document.createElement("span");
        w.className = "c5-quote__w";
        w.style.setProperty("--i", String(count++));
        w.textContent = part;
        frag.appendChild(w);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return count;
  }

  var counts = els.map(wrap);
  var last = els.map(function () { return -1; });

  function update() {
    var vh = window.innerHeight;
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect();
      var from = START * vh;
      var to = END * vh - r.height / 2;
      var p = from > to ? CX5.clamp((from - r.top) / (from - to), 0, 1) : (r.top <= to ? 1 : 0);
      var w = Math.round(p * counts[i] * 20) / 20;
      if (w !== last[i]) { els[i].style.setProperty("--q-w", w); last[i] = w; }
    }
  }

  CX5.register({ scroll: update, resize: update });
})();
