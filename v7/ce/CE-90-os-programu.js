/* ===== CE-90 · Oś programu z punktami zdarzeń – quarter look of 08.11.2026
   (comment U-70: Figma 996:2431 and 996:3195 with their annotations, two
   rounds on 08.11; spec prochnica-plus-wzorzec-eco-spec §24). The month look
   of 02.10–07.11.2026 lives in
   archiwum-wersji/prochnica-plus-v7-przed-uwagami-2026-11-08.html.
   ---------------------------------------------------------------------------
   The blocks in `[data-etapy-src]` are the ONLY source of data and at the same
   time the no-JS version: one block per farm. The script reads them, builds one
   axis (row = farm, column = quarter) and hides the source. Nothing is guessed
   from the copy: every event carries the month it starts in (`data-od="YYYY-MM"`;
   `data-do` stays in the source, unused) and its state (`data-state`: „done”
   is done, anything else is drawn as planned – there is no „in progress”);
   the marker of the last quarter that has begun carries `data-m`; a film
   report is a `.pp-rel` inside the event. Another participant is another
   block in the HTML and another row here. The range of the axis stands on
   the root (`data-ax-od`, `data-ax-do`); events outside it are not drawn.
   Every quarter of the range takes the same width. The widths go to CSS as one
   px track list, so every grid of the block moves at once (CSS transitions the
   list). The quarter of `data-m` is marked dark (a line on its start, a badge
   on its month); the pointer over a quarter moves the mark there, half a
   second on a quarter widens it and leaving it folds it at once. The whole
   cell (farm × quarter) is one button: click / Enter / Space opens one dialog
   with every event of the farm in that quarter. Keyboard focus widens the
   quarter at once; `Esc` folds it. Hovering a row makes the bar float down
   onto it. Scrolling sideways stays inside the frame (`data-lenis-prevent`, no
   `wheel` listener). Public API for the participant cards:
   CX5.ppEtapy.focusFarm(key).
   ========================================================================= */
(function () {
  "use strict";
  var doc = document;
  var $ = CX5.$, $$ = CX5.$$;
  var NS = "http://www.w3.org/2000/svg";

  var root = doc.getElementById("etapy-os");
  if (!root) return;
  var src = $("[data-etapy-src]", root);
  if (!src) return;

  /* --- 1. calendar: quarters ------------------------------------------------ */
  var ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  var MONTHS = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec",
    "sierpień", "wrzesień", "październik", "listopad", "grudzień"];
  function ym(s) {
    var m = /^(\d{4})-(\d{2})$/.exec(s || "");
    return m ? { y: +m[1], m: +m[2] } : null;
  }
  var FROM = ym(root.getAttribute("data-ax-od")) || { y: 2025, m: 11 };
  var TO = ym(root.getAttribute("data-ax-do")) || { y: 2028, m: 3 };
  var Q0 = { y: FROM.y, q: Math.floor((FROM.m - 1) / 3) };
  function qIdx(d) { return (d.y - Q0.y) * 4 + Math.floor((d.m - 1) / 3) - Q0.q; }
  var N = qIdx(TO) + 1;
  if (N < 1) return;
  function qAt(k) {
    var t = Q0.q + k;
    return { y: Q0.y + Math.floor(t / 4), q: t % 4 };
  }
  /* „lipiec–wrzesień 2026” */
  function period(k) {
    var d = qAt(k);
    return MONTHS[d.q * 3] + "–" + MONTHS[d.q * 3 + 2] + " " + d.y;
  }

  /* --- 2. rows and events read out of the DOM ------------------------------ */
  function text(n) { return n ? n.textContent.replace(/\s+/g, " ").trim() : ""; }

  var used = [];                                    /* events in quarter k, all rows */
  for (var u = 0; u < N; u++) used[u] = 0;

  var rows = $$("[data-etapy-block]", src).map(function (block) {
    var cells = [];
    for (var c = 0; c < N; c++) cells[c] = [];
    var count = 0;
    $$(".pp-ms", block).forEach(function (li) {
      var od = ym(li.getAttribute("data-od"));
      if (!od) return;                              /* no explicit period – no mark */
      var k = qIdx(od);
      if (k < 0 || k >= N) return;                  /* outside the range of the axis */
      var rel = $(".pp-rel", li);
      cells[k].push({
        li: li, k: k,
        name: text($(".pp-ms__name", li)),
        done: li.getAttribute("data-state") === "done",
        /* the state label is copy – it comes from the milestone chip, verbatim */
        stateLabel: text($(".c5-chip", li)),
        film: !!rel,
        filmTitle: rel ? text($(".pp-rel__title", rel)) : ""
      });
      used[k]++;
      count++;
    });
    var most = 1;
    cells.forEach(function (list) { most = Math.max(most, list.length); });
    return {
      key: block.getAttribute("data-etapy-block"),
      block: block,
      who: block.getAttribute("data-gospodarz") || text($(".pp-varname", block)),
      crop: block.getAttribute("data-uprawa") || "",
      full: text($(".pp-varname", block)),
      most: most,
      cells: cells,
      count: count
    };
  }).filter(function (r) { return r.key && r.count; });
  if (!rows.length) return;

  /* --- 3. small DOM helpers and the marks ----------------------------------- */
  function el(tag, cls, txt) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function hide(n) { n.setAttribute("aria-hidden", "true"); return n; }
  function place(n, a, b) { n.style.gridColumn = (a + 1) + " / " + (b + 2); return n; }

  /* marks after the „States” component (Figma 884:1155 / 996:3195): the tick
     of a done event, the YouTube mark (both 22 px in the axis, 20 px in the
     legend), the solid outline of a planned event (legend only – in the axis
     it is the CSS outline of the capsule); crop icons drawn in the style of
     the „blueberries” chip icon (Figma 996:2441): 12 px, 1 px line, square
     caps, a few dots; the object stays self-contained – style-guide.py
     evaluates it with node to draw the icons */
  var SYM = {
    done: { vb: "0 0 20 20", g: '<rect width="20" height="20" rx="5" style="fill:var(--ch-status-done)"/>' +
          '<path d="M14.727 7 8.727 13 6 10.273" style="fill:none;stroke:var(--ch-text-inverse);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round"/>' },
    plan: { vb: "0 0 20 20", g: '<rect x=".6" y=".6" width="18.8" height="18.8" rx="4.4" style="fill:var(--ch-surface-page);stroke:var(--ch-status-planned);stroke-width:1.2"/>' },
    tick: { vb: "0 0 22 22", g: '<path d="M15.2 8.3 9.6 13.9 7 11.3" style="fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round"/>' },
    yt: { vb: "0 0 20 20", g: '<rect width="20" height="20" rx="5" style="fill:var(--ch-status-film)"/>' +
        '<path transform="translate(4 5.5)" style="fill:var(--ch-text-inverse)" d="M11.85 2.1C11.7 1.125 11.25.45 10.2.3 8.55 0 6 0 6 0S3.45 0 1.8.3C.75.45.225 1.125.15 2.1 0 3.075 0 4.5 0 4.5s0 1.425.15 2.4c.15.975.6 1.65 1.65 1.8C3.45 9 6 9 6 9s2.55 0 4.2-.3c1.05-.225 1.5-.825 1.65-1.8.15-.975.15-2.4.15-2.4s0-1.425-.15-2.4ZM4.5 6.75v-4.5L8.25 4.5 4.5 6.75Z"/>' },
    /* aronia – the „blueberries” icon of the chip, verbatim */
    berries: { vb: "0 0 12 12", g: '<g style="fill:none;stroke:currentColor;stroke-miterlimit:10;stroke-linecap:square">' +
          '<path d="M6.5 8.497a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>' +
          '<path d="M7.5 5.668a2.997 2.997 0 0 1 3.997 2.83 2.997 2.997 0 0 1-3.997 2.829"/>' +
          '<path d="M3.042 3.997a3 3 0 1 1 5.917 0"/></g>' +
          '<g style="fill:currentColor"><circle cx="6" cy="2.497" r=".5"/><circle cx="2.5" cy="7.497" r=".5"/><circle cx="9.5" cy="8.497" r=".5"/></g>' },
    /* jabłoń – an apple with a stem and a leaf */
    apple: { vb: "0 0 12 12", g: '<g style="fill:none;stroke:currentColor;stroke-miterlimit:10;stroke-linecap:square">' +
          '<path d="M6 4.1c-.9-.6-2.3-.7-3.2.1C1.6 5.2 1.6 7 2.4 8.6c.8 1.6 2.2 2.8 3.6 2.2 1.4.6 2.8-.6 3.6-2.2.8-1.6.8-3.4-.4-4.4-.9-.8-2.3-.7-3.2-.1Z"/>' +
          '<path d="M6 4V2"/><path d="M6.5 2.4c.4-.9 1.3-1.4 2.3-1.3-.3.9-1.2 1.4-2.3 1.3Z"/></g>' +
          '<g style="fill:currentColor"><circle cx="3.9" cy="6.3" r=".5"/></g>' },
    /* grusza – a pear with a stem and a leaf */
    pear: { vb: "0 0 12 12", g: '<g style="fill:none;stroke:currentColor;stroke-miterlimit:10;stroke-linecap:square">' +
          '<path d="M6 3c-1 0-1.4.9-1.6 1.9-.2 1-.8 1.5-1.4 2.4-.8 1.2-.5 2.7.6 3.4 1.3.8 3.5.8 4.8 0 1.1-.7 1.4-2.2.6-3.4-.6-.9-1.2-1.4-1.4-2.4C7.4 3.9 7 3 6 3Z"/>' +
          '<path d="M6 3V1.2"/><path d="M6.4 1.9c.4-.6 1.2-.9 1.9-.7-.4.6-1.2.9-1.9.7Z"/></g>' +
          '<g style="fill:currentColor"><circle cx="4.9" cy="8.4" r=".5"/></g>' },
    /* malina – a round berry of drupelets under a calyx */
    raspberry: { vb: "0 0 12 12", g: '<g style="fill:none;stroke:currentColor;stroke-miterlimit:10;stroke-linecap:square">' +
          '<path d="M6 11c-2.1 0-3.6-1.7-3.6-3.8C2.4 5.3 4 3.8 6 3.8s3.6 1.5 3.6 3.4C9.6 9.3 8.1 11 6 11Z"/>' +
          '<path d="M3.9 3.9C4.3 3 5.1 2.4 6 2.4s1.7.6 2.1 1.5M6 2.4V1"/></g>' +
          '<g style="fill:currentColor"><circle cx="4.5" cy="6.2" r=".5"/><circle cx="7.5" cy="6.2" r=".5"/><circle cx="6" cy="7.7" r=".5"/><circle cx="4.5" cy="9.1" r=".5"/><circle cx="7.5" cy="9.1" r=".5"/></g>' },
    /* truskawka – a strawberry pointing down, a calyx and seeds */
    strawberry: { vb: "0 0 12 12", g: '<g style="fill:none;stroke:currentColor;stroke-miterlimit:10;stroke-linecap:square">' +
          '<path d="M6 11.1C3.9 9.9 2.1 7.8 2.2 5.6c.1-1.1 1-1.8 2-1.8.7 0 1.2.3 1.8.3s1.1-.3 1.8-.3c1 0 1.9.7 2 1.8.1 2.2-1.7 4.3-3.8 5.5Z"/>' +
          '<path d="M3.9 3.4 6 2.4l2.1 1M6 2.4V1"/></g>' +
          '<g style="fill:currentColor"><circle cx="4.4" cy="5.9" r=".5"/><circle cx="7.6" cy="5.9" r=".5"/><circle cx="6" cy="7.3" r=".5"/><circle cx="6" cy="9.3" r=".5"/></g>' }
  };
  var CROP_ICON = { "aronia": "berries", "jabłoń": "apple", "jabłko": "apple", "grusza": "pear", "gruszka": "pear",
    "malina": "raspberry", "truskawka": "strawberry" };
  function cropIcon(crop) { return CROP_ICON[(crop || "").toLowerCase()] || "berries"; }

  var sprite = doc.createElementNS(NS, "svg");
  sprite.setAttribute("class", "c5-ax__sprite");
  sprite.setAttribute("aria-hidden", "true");
  sprite.setAttribute("focusable", "false");
  sprite.innerHTML = Object.keys(SYM).map(function (k) {
    return '<symbol id="c5-ax-i-' + k + '" viewBox="' + SYM[k].vb + '">' + SYM[k].g + "</symbol>";
  }).join("");
  function icon(name, cls) {
    var s = doc.createElementNS(NS, "svg");
    s.setAttribute("class", cls);
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("focusable", "false");
    s.setAttribute("viewBox", SYM[name].vb);
    var use = doc.createElementNS(NS, "use");
    use.setAttribute("href", "#c5-ax-i-" + name);
    s.appendChild(use);
    return s;
  }

  /* --- 4. skeleton: calendar head and rows ---------------------------------- */
  var frame = el("div", "c5-ax__frame");
  frame.setAttribute("data-lenis-prevent", "");
  var table = el("div", "c5-ax__table");
  frame.appendChild(table);
  /* the bar: it lies under the quarter labels and floats down onto a hovered row */
  var band = hide(el("div", "c5-ax__hl"));
  table.appendChild(band);

  var colEls = [];                                  /* every cell of a quarter */
  for (var ce = 0; ce < N; ce++) colEls[ce] = [];

  /* the calendar is decoration for assistive tech: every cell names its period */
  var head = hide(el("div", "c5-ax__head"));
  var corner = el("div", "c5-ax__corner");
  head.appendChild(corner);
  var cal = el("div", "c5-ax__cal");
  var yearsRow = el("div", "c5-ax__years"), monthsRow = el("div", "c5-ax__months");
  var yr0 = -1, ya = 0;
  for (var k0 = 0; k0 <= N; k0++) {
    var yk = k0 < N ? qAt(k0).y : null;
    if (yk !== yr0) {
      if (yr0 >= 0) {
        var yc = place(el("div", "c5-ax__year"), ya, k0 - 1);
        yc.appendChild(el("span", "", String(yr0)));
        if (ya > 0) yc.setAttribute("data-ys", "");
        yearsRow.appendChild(yc);
      }
      yr0 = yk; ya = k0;
    }
  }
  /* the label of a quarter: its first month – not January, where the line of
     the year stands (annotation 996:2855) */
  var qEls = [];
  for (var k1 = 0; k1 < N; k1++) {
    var d1 = qAt(k1);
    var qc = el("div", "c5-ax__q");
    if (d1.q > 0) qc.appendChild(el("span", "", ROMAN[d1.q * 3]));
    if (d1.q === 0 && k1 > 0) qc.setAttribute("data-ys", "");
    qc.setAttribute("data-c", k1);
    qEls.push(qc);
    monthsRow.appendChild(qc);
  }
  cal.appendChild(yearsRow);
  cal.appendChild(monthsRow);
  head.appendChild(cal);
  table.appendChild(head);

  /* the last quarter that has begun: one marker in the source (data-m) */
  var nowSrc = $("[data-m]", src), nowAt = nowSrc ? ym(nowSrc.getAttribute("data-m")) : null;
  var nowQ = nowAt ? qIdx(nowAt) : -1;
  if (nowQ >= N) nowQ = N - 1;
  if (nowQ < 0) nowQ = -1;

  var body = el("div", "c5-ax__body");
  table.appendChild(body);

  var rowEls = {}, rowList = [], pts = [];
  rows.forEach(function (r) {
    var row = el("div", "c5-ax__row");
    row.setAttribute("role", "group");
    var nameId = "c5-ax-n-" + r.key;
    row.setAttribute("aria-labelledby", nameId);

    var name = el("div", "c5-ax__name");
    name.id = nameId;
    if (r.crop) {
      var crop = el("span", "c5-ax__crop");
      crop.appendChild(icon(cropIcon(r.crop), "c5-ax__cropico"));
      crop.appendChild(el("span", "", r.crop));
      name.appendChild(crop);
    }
    var who = el("span", "c5-ax__who", r.who);
    if (r.full && r.full !== r.who) who.title = r.full;        /* full farm name on hover */
    name.appendChild(who);
    row.appendChild(name);

    var track = el("div", "c5-ax__track");
    track.style.setProperty("--n", r.most);
    for (var k = 0; k < N; k++) {
      var list = r.cells[k];
      var cell = el(list.length ? "button" : "div", "c5-ax__cell");
      cell.setAttribute("data-c", k);
      cell.style.gridColumn = String(k + 1);
      if (qAt(k).q === 0 && k > 0) cell.setAttribute("data-ys", "");
      if (list.length) {
        cell.type = "button";
        cell.setAttribute("aria-haspopup", "dialog");
        cell.style.setProperty("--i", k);
        cell.setAttribute("aria-label", period(k) + ": " + list.map(function (it) {
          return it.name + " – " + (it.stateLabel || (it.done ? "zrobione" : "zaplanowane")) +
            (it.film ? ", relacja filmowa" + (it.filmTitle ? ": " + it.filmTitle : "") : "");
        }).join("; "));
        list.forEach(function (it) {
          var pt = hide(el("span", "c5-ax__pt c5-ax__pt--" + (it.done ? "done" : "plan")));
          var pill = el("span", "c5-ax__pill");
          var sign = el("span", "c5-ax__sign");
          sign.appendChild(it.done ? icon("tick", "c5-ax__tick") : el("span", "c5-ax__dot"));
          pill.appendChild(sign);
          it.lab = pill.appendChild(el("span", "c5-ax__lab", it.name));
          it.pill = pill;
          pt.appendChild(pill);
          if (it.film) pt.appendChild(icon("yt", "c5-ax__yt"));
          pt.style.setProperty("--i", k);
          cell.appendChild(pt);
          pts.push(it);
        });
        (function (row0, k0) {
          cell.addEventListener("click", function () { openDialog(row0, k0, this); });
        })(r, k);
      }
      colEls[k].push(cell);
      track.appendChild(cell);
    }
    row.appendChild(track);
    body.appendChild(row);
    rowEls[r.key] = row;
    rowList.push(row);
  });

  /* the right edge fades out where the axis scrolls sideways (CSS) */
  body.appendChild(hide(el("div", "c5-ax__fade")));

  /* legend: the three marks of Figma 996:2431 */
  var legend = el("ul", "c5-ax__legend");
  [["done", "Wykonane"], ["plan", "Zaplanowane"], ["yt", "Relacja na YouTube"]].forEach(function (s) {
    var li = el("li");
    li.appendChild(icon(s[0], "c5-ax__lg"));
    li.appendChild(el("span", "", s[1]));
    legend.appendChild(li);
  });

  /* the marked quarter, for assistive tech (the calendar is decoration) */
  var nowSr = nowQ >= 0 ? el("p", "c5-ax__sr", "Bieżący kwartał: " + period(nowQ)) : null;

  /* --- 5. geometry: one px track list for every grid of the block ----------- */
  var MIN_REST = 72;        /* narrower quarters at rest: the axis scrolls      */
  var MIN_SQUEEZE = 62;     /* a quarter giving way to the widened one          */
  var OPEN_MAX = 560;
  var OPEN_DELAY = 500;     /* annotation 996:2646: half a second               */
  var open = -1, cur = [], total = 0, scrolls = false, need = [];

  function nameW() { return corner.getBoundingClientRect().width || 0; }

  /* natural widths of the labels (measured on the folded capsules, which stay
     laid out while hidden) and the room a widened quarter needs: 20 px to the
     marks, the widest capsule (+ the YouTube mark), 16 px of air */
  function capW(it) { return Math.ceil(22 + it.labW); }
  function measureNeed() {
    need = [];
    for (var k = 0; k < N; k++) need[k] = 0;
    pts.forEach(function (it) {
      it.labW = it.lab.scrollWidth;
      need[it.k] = Math.max(need[it.k], 20 + capW(it) + (it.film ? 30 : 0) + 16);
    });
  }

  function apply() {
    var avail = Math.floor(frame.clientWidth - nameW());
    if (!(avail > 0)) return;
    var q = avail / N;
    scrolls = q < MIN_REST;
    if (scrolls) q = MIN_REST + 8;
    root.classList.toggle("is-scroll", scrolls);
    cur = [];
    for (var k = 0; k < N; k++) cur[k] = q;
    if (open >= 0) {
      var want = Math.min(OPEN_MAX, need[open] || 0);
      if (scrolls) {
        /* a frame that scrolls: the axis grows, nothing squeezes; the quarter
           never outgrows the visible part of the axis */
        cur[open] = Math.max(q, Math.min(want, avail - 8));
      } else {
        var wide = Math.max(q, Math.min(want, avail - (N - 1) * MIN_SQUEEZE));
        var rest = (avail - wide) / (N - 1);
        for (var j = 0; j < N; j++) cur[j] = j === open ? wide : rest;
      }
      /* the capsules of the widened quarter share its room; one that does not
         fit is cut with an ellipsis (the full name stands in the dialog) */
      var room = cur[open] - 20 - 12;
      pts.forEach(function (it) {
        if (it.k !== open) return;
        var w = Math.min(capW(it) + 1, room - (it.film ? 30 : 0));
        it.pill.style.setProperty("--w", Math.max(22, Math.floor(w)) + "px");
      });
    }
    total = cur.reduce(function (x, y) { return x + y; }, 0);
    table.style.setProperty("--c5-ax-cols", cur.map(function (w) { return (Math.floor(w * 100) / 100) + "px"; }).join(" "));
    table.style.setProperty("--c5-ax-w", (Math.floor(total * 100) / 100) + "px");
    /* the dashes of a quarter line run on unbroken from row to row */
    rowList.forEach(function (row) { row.style.setProperty("--c5-ax-ry", row.offsetTop + "px"); });
  }
  function xOf(k) { var x = 0; for (var j = 0; j < k; j++) x += cur[j]; return x; }

  /* --- 6. the marked quarter, the lit row ------------------------------------- */
  var act = -1;
  function setAct(k) {
    if (k === act) return;
    if (act >= 0) { qEls[act].classList.remove("is-act"); colEls[act].forEach(function (c) { c.classList.remove("is-act"); }); }
    act = k;
    if (k >= 0) { qEls[k].classList.add("is-act"); colEls[k].forEach(function (c) { c.classList.add("is-act"); }); }
  }

  var litRow = null, hoverRow = null, focusRow = null, targetRow = null;
  function syncLit() {
    var row = targetRow || focusRow || hoverRow;
    if (litRow && litRow !== row) litRow.classList.remove("is-lit");
    litRow = row;
    root.classList.toggle("has-lit", !!row);
    if (row) {
      row.classList.add("is-lit");
      band.style.height = row.offsetHeight + "px";
      band.style.transform = "translateY(" + (head.offsetHeight + row.offsetTop) + "px)";
    } else {
      band.style.height = "";
      band.style.transform = "";
    }
  }
  function rowOf(target) {
    var row = target && target.closest ? target.closest(".c5-ax__row") : null;
    return row && body.contains(row) ? row : null;
  }

  /* --- 7. widening a quarter ---------------------------------------------------- */
  function setOpen(k) {
    if (k >= 0 && !used[k]) k = -1;                 /* nothing to unfold */
    if (k === open) return;
    if (open >= 0) colEls[open].forEach(function (c) { c.classList.remove("is-open"); });
    open = k;
    if (k >= 0) colEls[k].forEach(function (c) { c.classList.add("is-open"); });
    apply();
    if (litRow) syncLit();
    /* a frame that scrolls brings the widened quarter into view */
    if (k >= 0 && scrolls) {
      var x = xOf(k), vis = frame.clientWidth - nameW(), sl = frame.scrollLeft;
      if (x < sl + 4 || x + cur[k] > sl + vis) {
        frame.scrollTo({ left: Math.max(0, x - 6), behavior: CX5.reducedMQ.matches ? "auto" : "smooth" });
      }
    }
  }

  /* --- 8. the pointer: the mark goes to the quarter under it, half a second
     widens that quarter, leaving it folds it at once; keyboard focus widens
     at once --------------------------------------------------------------- */
  var hoverQ = -1, openT = null, lastX = -1, lastY = -1, muted = -1;
  function clearOpenT() { if (openT) { window.clearTimeout(openT); openT = null; } }
  /* the quarter under a screen x – read from the bar, so it is right while the
     columns glide */
  function quarterAt(clientX) {
    for (var k = 0; k < N; k++) {
      var b = qEls[k].getBoundingClientRect();
      if (clientX >= b.left && clientX < b.right) return k;
    }
    return -1;
  }
  function keyboardInside() {
    var a = doc.activeElement;
    return !!(a && table.contains(a) && a.matches && a.matches(":focus-visible"));
  }
  function restMark() { setAct(hoverQ >= 0 ? hoverQ : nowQ); }
  /* the timer asks again which quarter is under the pointer: a fold may have
     slid another one there in the meantime */
  function openUnder() {
    openT = null;
    var k = lastX >= 0 ? quarterAt(lastX) : -1;
    if (k < 0 || k === muted) return;
    hoverQ = k;
    setAct(k);
    setOpen(k);
  }
  function enterQuarter(k) {
    if (k === hoverQ) return;
    hoverQ = k;
    clearOpenT();
    if (open >= 0 && k !== open) setOpen(-1);      /* left the widened quarter: fold at once */
    restMark();
    if (k >= 0 && k !== open && k !== muted) openT = window.setTimeout(openUnder, OPEN_DELAY);
  }

  table.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    if (e.clientX === lastX && e.clientY === lastY) return;   /* the axis slid under a resting pointer */
    lastX = e.clientX; lastY = e.clientY;
    var hr = rowOf(e.target);
    if (hr !== hoverRow) { hoverRow = hr; syncLit(); }
    var inName = !!(e.target.closest && e.target.closest(".c5-ax__name, .c5-ax__corner"));
    var k = inName ? -1 : quarterAt(e.clientX);
    if (k !== muted) muted = -1;
    enterQuarter(k);
  });
  table.addEventListener("pointerleave", function (e) {
    if (e.pointerType === "touch") return;
    lastX = lastY = -1;
    if (hoverRow) { hoverRow = null; syncLit(); }
    clearOpenT();
    hoverQ = -1;
    if (open >= 0 && !keyboardInside() && !dlg.open) setOpen(-1);
    restMark();
  });
  doc.addEventListener("pointerdown", function (e) {
    if (open < 0 || root.contains(e.target) || dlg.contains(e.target)) return;
    clearOpenT();
    setOpen(-1);
  });
  /* keyboard: the quarter of the focused cell widens at once */
  table.addEventListener("focusin", function (e) {
    var cell = e.target.closest ? e.target.closest("button.c5-ax__cell") : null;
    if (!cell) return;
    focusRow = rowOf(cell);
    syncLit();
    if (cell.matches(":focus-visible")) {
      clearOpenT();
      var k = +cell.getAttribute("data-c");
      setAct(k);
      setOpen(k);
    }
  });
  table.addEventListener("focusout", function (e) {
    if (dlg.open) return;                           /* focus went into the pop-up */
    if (e.relatedTarget && table.contains(e.relatedTarget)) return;
    if (focusRow) { focusRow = null; syncLit(); }
    if (hoverQ >= 0 && hoverQ === open) return;     /* the pointer still holds it */
    setOpen(-1);
    restMark();
  });
  doc.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || open < 0 || dlg.open) return;
    clearOpenT();
    muted = hoverQ;                                 /* stays folded until the pointer moves on */
    setOpen(-1);
  });

  /* --- 9. pop-up: centred dialog ----------------------------------------------
     accessibility pattern taken over from the farm profile pop-up (module 52):
     native <dialog> for the focus trap and Esc, manual scroll lock, Lenis
     stopped while it is open, focus handed back to the opener. */
  var dlg = el("dialog", "c5-ax__dlg");
  dlg.setAttribute("aria-labelledby", "c5-ax-dlg-t");
  var dHead = el("div", "c5-ax__dlghead");
  var dCrop = el("span", "c5-ax__crop");
  var dTitle = el("h3", "c5-ax__dlgtitle");
  dTitle.id = "c5-ax-dlg-t";
  var dPeriod = el("span", "c5-ax__dlgperiod");
  var dClose = el("button", "c5-ax__dlgclose");
  dClose.type = "button";
  dClose.setAttribute("aria-label", "zamknij");
  dClose.innerHTML = '<svg class="wf-icon" aria-hidden="true"><use href="#ti-x"></use></svg>';
  dHead.appendChild(dCrop);
  dHead.appendChild(dTitle);
  dHead.appendChild(dPeriod);
  dHead.appendChild(dClose);
  var dScroll = el("div", "c5-ax__dlgscroll");
  dScroll.tabIndex = -1;
  dScroll.setAttribute("data-lenis-prevent", "");
  dlg.appendChild(dHead);
  dlg.appendChild(dScroll);
  doc.body.appendChild(dlg);

  var opener = null;

  /* a clone must not duplicate ids or re-run the reveal module */
  function clean(node) {
    node.removeAttribute("data-reveal");
    $$("[data-reveal]", node).forEach(function (n) { n.removeAttribute("data-reveal"); });
    if (node.id) node.removeAttribute("id");
    $$("[id]", node).forEach(function (n) { n.removeAttribute("id"); });
    node.classList.remove("pp-reveal", "is-in");
    $$(".pp-reveal", node).forEach(function (n) { n.classList.remove("pp-reveal", "is-in"); });
    return node;
  }
  /* the source heading is an h5 under the timeline – inside the dialog it sits
     one level under the dialog title */
  function retitle(article) {
    var h5 = $(".pp-ms__name", article);
    if (!h5 || h5.tagName !== "H5") return h5;
    var h4 = doc.createElement("h4");
    h4.className = h5.className;
    while (h5.firstChild) h4.appendChild(h5.firstChild);
    h5.parentNode.replaceChild(h4, h5);
    return h4;
  }

  /* the dialog holds EVERY event of this farm in this quarter */
  function openDialog(r, k, btn) {
    if (dlg.open) return;
    clearOpenT();
    opener = btn || null;
    dCrop.textContent = "";
    if (r.crop) {
      dCrop.appendChild(icon(cropIcon(r.crop), "c5-ax__cropico"));
      dCrop.appendChild(el("span", "", r.crop));
    }
    dCrop.hidden = !r.crop;
    dTitle.textContent = r.who;
    dPeriod.textContent = period(k);
    dScroll.textContent = "";
    var first = null;
    r.cells[k].forEach(function (it) {
      var art = doc.createElement("article");
      art.className = "pp-ms";
      art.setAttribute("data-state", it.li.getAttribute("data-state") || "todo");
      var clone = clean(it.li.cloneNode(true));
      while (clone.firstChild) art.appendChild(clone.firstChild);
      var h = retitle(art);
      if (!first && h) { h.tabIndex = -1; first = h; }
      dScroll.appendChild(art);
    });
    dlg.showModal();
    doc.documentElement.classList.add("c5-ax-lock");
    if (CX5.lenis) CX5.lenis.stop();
    if (first) first.focus({ preventScroll: true });
    else dScroll.focus();
    dScroll.scrollTop = 0;
  }

  dClose.addEventListener("click", function () { dlg.close(); });

  /* backdrop click: a modal dialog gets the click itself, so compare with its box;
     a keyboard-activated click reports 0,0 and must not count as "outside" */
  dlg.addEventListener("click", function (e) {
    if (e.target !== dlg) return;
    if (e.clientX === 0 && e.clientY === 0) return;
    var b = dlg.getBoundingClientRect();
    if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) dlg.close();
  });

  dlg.addEventListener("close", function () {
    doc.documentElement.classList.remove("c5-ax-lock");
    if (CX5.lenis) CX5.lenis.start();
    dScroll.textContent = "";
    if (opener && opener.focus) opener.focus();
    opener = null;
  });

  /* --- 10. start ---------------------------------------------------------------- */
  /* the source keeps its content but hands the anchors over to the rows */
  rows.forEach(function (r) {
    if (r.block.id) r.block.id = r.block.id + "-lista";
    rowEls[r.key].id = "etapy-" + r.key;
  });
  src.hidden = true;
  root.insertBefore(sprite, src);
  if (nowSr) root.insertBefore(nowSr, src);
  root.insertBefore(frame, src);
  root.insertBefore(legend, src);

  /* widths follow the frame; a resize never animates. A frame that scrolls
     starts with the marked quarter in view */
  var placed = false;
  function measure() {
    root.classList.remove("is-ready");
    measureNeed();
    apply();
    restMark();
    if (litRow) syncLit();
    if (!placed && total > 0) {
      placed = true;
      /* the quarter before the marked one starts 16 px right of the glued
         names, so its label is whole and the marked quarter follows it */
      if (scrolls && nowQ >= 0) frame.scrollLeft = Math.max(0, xOf(Math.max(0, nowQ - 1)) - 16);
    }
    void table.offsetWidth;
    root.classList.add("is-ready");
  }
  CX5.register({ resize: measure });
  measure();
  /* the labels are measured in the page font – measure again once it is in */
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(measure);

  /* first entry into view: marks appear with a short stagger (motion only) */
  (function () {
    if (!CX5.motionOn() || !window.IntersectionObserver) return;
    if (root.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    root.classList.add("c5-ax--arm");
    var done = false, io = null;
    function go() {
      if (done) return;
      done = true;
      if (io) io.disconnect();
      root.classList.add("is-in");
      /* the delays belong to the entry only – drop them once it has played */
      window.setTimeout(function () { root.classList.remove("c5-ax--arm", "is-in"); }, 1400);
    }
    io = new window.IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) go(); });
    }, { threshold: 0.12 });
    io.observe(root);
    /* safety net: a silent observer must never leave the marks invisible */
    CX5.register({ scroll: function () {
      if (done) return;
      var b = root.getBoundingClientRect();
      if (b.top < window.innerHeight * 0.85 && b.bottom > 0) go();
    } });
    window.addEventListener("beforeprint", go);
    if (CX5.wideMQ.addEventListener) {
      CX5.wideMQ.addEventListener("change", function () { if (!CX5.motionOn()) go(); });
      CX5.reducedMQ.addEventListener("change", function () { if (!CX5.motionOn()) go(); });
    }
  })();

  /* --- 11. jump from a participant card: scroll to the row and light it up --- */
  var hlT = null;
  function focusFarm(key, instant) {
    var row = rowEls[key];
    if (!row) return false;
    var off = Math.min(160, window.innerHeight * 0.12);
    var top = window.scrollY + root.getBoundingClientRect().top - off;
    /* a short window: the row itself must end up on screen */
    var rowBottom = window.scrollY + row.getBoundingClientRect().bottom;
    if (rowBottom - top > window.innerHeight - 24) top = rowBottom - window.innerHeight + 24;
    CX5.scrollTo(top, instant || CX5.reducedMQ.matches ? "auto" : "smooth");
    row.classList.add("is-target");
    targetRow = row;
    syncLit();
    if (hlT) window.clearTimeout(hlT);
    hlT = window.setTimeout(function () {
      row.classList.remove("is-target");
      if (targetRow === row) { targetRow = null; syncLit(); }
    }, 1200);
    return true;
  }

  CX5.onHash(function (hash, instant) {
    if (!hash || hash.indexOf("#etapy-") !== 0) return false;
    return focusFarm(hash.slice(7), instant);
  });
  CX5.ppEtapy = { focusFarm: function (key) { focusFarm(key, false); } };
})();
