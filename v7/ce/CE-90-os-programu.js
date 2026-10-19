/* ===== CE-90 · Oś programu z punktami zdarzeń – 02.10.2026, vertical-line look
   (spec prochnica-plus-wzorzec-eco-spec §19.5, §20.2 and §21); look of Figma
   888:4324 and 903:1447 since 18.10.2026.
   ---------------------------------------------------------------------------
   The blocks in `[data-etapy-src]` are the ONLY source of data and at the same
   time the no-JS version: one block per farm. The script reads them, builds one
   axis (row = farm, column = month) and hides the source. Nothing is guessed
   from the copy: every event carries the month it starts in (`data-od="YYYY-MM"`;
   `data-do` stays in the source, unused), the „we are here” marker carries
   `data-m`, a film report is a `.pp-rel` inside the event (its title is
   `.pp-rel__title`). Another participant is another block in the HTML and
   another row here.
   Column widths come from the data: a month with events is full, an empty
   month is narrow, a year without events is one narrow strip. The widths go to
   CSS as one px track list, so every grid of the block moves at once.
   Hovering a month, focusing one of its points or tapping the column widens it
   and unfolds its marks into labels (names of the events, titles of the films);
   leaving the axis or `Esc` folds it back. The columns glide to their new
   places on transform only (FLIP; not below 900 px, not with reduced motion).
   Click / Enter / Space on a point opens a centred dialog. The lit row (hover,
   focus, jump from a participant card) turns beige. Scrolling sideways stays
   inside the frame (`data-lenis-prevent`, no `wheel` listener).
   Public API for the participant cards: CX5.ppEtapy.focusFarm(key).
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

  /* --- 1. calendar --------------------------------------------------------- */
  var ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  function ym(s) {
    var m = /^(\d{4})-(\d{2})$/.exec(s || "");
    return m ? { y: +m[1], m: +m[2] } : null;
  }
  var FROM = ym(root.getAttribute("data-ax-od")) || { y: 2025, m: 11 };
  var TO = ym(root.getAttribute("data-ax-do")) || { y: 2028, m: 12 };
  function idx(d) { return (d.y - FROM.y) * 12 + (d.m - FROM.m); }
  var N = idx(TO) + 1;
  if (N < 1) return;
  function at(i) {
    var k = FROM.m - 1 + i;
    return { y: FROM.y + Math.floor(k / 12), m: (k % 12) + 1 };
  }
  function label(i) { var d = at(i); return ROMAN[d.m - 1] + " " + d.y; }

  /* --- 2. rows and events read out of the DOM ------------------------------ */
  function text(n) { return n ? n.textContent.replace(/\s+/g, " ").trim() : ""; }

  var used = [];                                    /* events starting in month i */
  for (var u = 0; u < N; u++) used[u] = 0;

  var rows = $$("[data-etapy-block]", src).map(function (block) {
    var items = [];
    $$(".pp-ms", block).forEach(function (li) {
      var od = ym(li.getAttribute("data-od"));
      if (!od) return;                              /* no explicit period – no point */
      var a = CX5.clamp(idx(od), 0, N - 1);
      used[a]++;
      var rel = $(".pp-rel", li);
      items.push({
        li: li, i: a, lane: 0,
        term: text($(".pp-ms__term", li)),
        name: text($(".pp-ms__name", li)),
        state: li.getAttribute("data-state") || "todo",
        /* the state label is copy – it comes from the milestone chip, verbatim */
        stateLabel: text($(".c5-chip", li)),
        film: !!rel,
        filmTitle: rel ? text($(".pp-rel__title", rel)) : ""
      });
    });
    /* events that share a month stand one under another, in lanes */
    var perMonth = {}, lanes = 1;
    items.forEach(function (it) {
      it.lane = perMonth[it.i] || 0;
      perMonth[it.i] = it.lane + 1;
      lanes = Math.max(lanes, perMonth[it.i]);
    });
    return {
      key: block.getAttribute("data-etapy-block"),
      block: block,
      who: block.getAttribute("data-gospodarz") || text($(".pp-varname", block)),
      crop: block.getAttribute("data-uprawa") || "",
      full: text($(".pp-varname", block)),
      lanes: lanes,
      items: items
    };
  }).filter(function (r) { return r.key && r.items.length; });
  if (!rows.length) return;

  /* --- 3. columns: full month, empty month, strip of an empty year --------- */
  var cols = [], colOf = [], years = [];
  (function () {
    var i = 0;
    while (i < N) {
      var y = at(i).y, j = i, any = false;
      while (j < N && at(j).y === y) { if (used[j]) any = true; j++; }
      var first = cols.length;
      if (!any) {
        cols.push({ type: "strip", i: i, n: j - i, ys: i > 0 });
        for (var s = i; s < j; s++) colOf[s] = first;
      } else {
        for (var m = i; m < j; m++) {
          colOf[m] = cols.length;
          cols.push({ type: used[m] ? "ev" : "empty", i: m, n: 1, ys: m === i && i > 0 });
        }
      }
      years.push({ y: y, a: first, b: cols.length - 1, strip: !any });
      i = j;
    }
  })();
  /* weights of month columns; a strip has a fixed width (Figma: ~47 px for 2027) */
  var UNIT = { ev: 1, empty: 0.32 };
  var STRIP = 52, MIN_FULL = 76, EMPTY_MIN = 24, OPEN_MAX = 600, OPEN_PART = 0.46;

  /* --- 4. small DOM helpers ------------------------------------------------ */
  function el(tag, cls, txt) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function hide(n) { n.setAttribute("aria-hidden", "true"); return n; }
  function place(n, a, b) { n.style.gridColumn = (a + 1) + " / " + (b + 2); return n; }

  /* the marks: symbols drawn after the „States” component of Figma 884:1155
     (20 x 20, 5 px corners, 1.5 px line); the crop icon after the chip 888:4333 */
  var SYM = {
    done: '<rect width="20" height="20" rx="5" style="fill:var(--ch-status-done)"/>' +
          '<path d="M14.727 7 8.727 13 6 10.273" style="fill:none;stroke:var(--ch-text-inverse);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round"/>',
    doing: '<rect x=".75" y=".75" width="18.5" height="18.5" rx="4.25" style="fill:var(--ch-surface-page);stroke:var(--ch-status-in-progress);stroke-width:1.5"/>' +
           '<circle cx="10" cy="10" r="3" style="fill:var(--ch-status-in-progress)"/>',
    todo: '<rect x=".75" y=".75" width="18.5" height="18.5" rx="4.25" style="fill:var(--ch-surface-page);stroke:var(--ch-status-planned);stroke-width:1.5"/>',
    na: '<rect x=".75" y=".75" width="18.5" height="18.5" rx="4.25" style="fill:var(--ch-surface-page);stroke:var(--ch-status-not-applicable);stroke-width:1.5;stroke-dasharray:3 2"/>',
    yt: '<rect width="20" height="20" rx="5" style="fill:var(--ch-status-film)"/>' +
        '<path transform="translate(4 5.5)" style="fill:var(--ch-text-inverse)" d="M11.85 2.1C11.7 1.125 11.25.45 10.2.3 8.55 0 6 0 6 0S3.45 0 1.8.3C.75.45.225 1.125.15 2.1 0 3.075 0 4.5 0 4.5s0 1.425.15 2.4c.15.975.6 1.65 1.65 1.8C3.45 9 6 9 6 9s2.55 0 4.2-.3c1.05-.225 1.5-.825 1.65-1.8.15-.975.15-2.4.15-2.4s0-1.425-.15-2.4ZM4.5 6.75v-4.5L8.25 4.5 4.5 6.75Z"/>',
    crop: '<g style="fill:none;stroke:currentColor;stroke-miterlimit:10;stroke-linecap:square">' +
          '<path d="M6.5 8.497a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>' +
          '<path d="M7.5 5.668a2.997 2.997 0 0 1 3.997 2.83 2.997 2.997 0 0 1-3.997 2.829"/>' +
          '<path d="M3.042 3.997a3 3 0 1 1 5.917 0"/></g>' +
          '<g style="fill:currentColor"><circle cx="6" cy="2.497" r=".5"/><circle cx="2.5" cy="7.497" r=".5"/><circle cx="9.5" cy="8.497" r=".5"/></g>'
  };
  var sprite = doc.createElementNS(NS, "svg");
  sprite.setAttribute("class", "c5-ax__sprite");
  sprite.setAttribute("aria-hidden", "true");
  sprite.setAttribute("focusable", "false");
  sprite.innerHTML = Object.keys(SYM).map(function (k) {
    return '<symbol id="c5-ax-i-' + k + '" viewBox="' + (k === "crop" ? "0 0 12 12" : "0 0 20 20") + '">' + SYM[k] + "</symbol>";
  }).join("");
  function icon(name, cls) {
    var s = doc.createElementNS(NS, "svg");
    s.setAttribute("class", cls || "c5-ax__mk");
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("focusable", "false");
    s.setAttribute("viewBox", name === "crop" ? "0 0 12 12" : "0 0 20 20");
    var use = doc.createElementNS(NS, "use");
    use.setAttribute("href", "#c5-ax-i-" + name);
    s.appendChild(use);
    return s;
  }

  /* --- 5. skeleton: calendar head and rows ---------------------------------- */
  var frame = el("div", "c5-ax__frame");
  frame.setAttribute("data-lenis-prevent", "");
  var table = el("div", "c5-ax__table");
  frame.appendChild(table);

  var colEls = cols.map(function () { return []; }); /* every cell of a column */

  /* the calendar is decoration for assistive tech: every point names its own term */
  var head = hide(el("div", "c5-ax__head"));
  var corner = el("div", "c5-ax__corner");
  head.appendChild(corner);
  var cal = el("div", "c5-ax__cal");
  var yearsRow = el("div", "c5-ax__years"), monthsRow = el("div", "c5-ax__months");
  var yearEls = [];
  years.forEach(function (yr, n) {
    var yc = place(el("div", "c5-ax__year" + (yr.strip ? " c5-ax__year--strip" : "")), yr.a, yr.b);
    yc.appendChild(el("span", "", String(yr.y)));
    if (n > 0) yc.setAttribute("data-ys", "");
    yearsRow.appendChild(yc);
    yearEls.push(yc);
  });
  cols.forEach(function (c, k) {
    var mc = el("div", "c5-ax__month c5-ax__month--" + c.type);
    if (c.type !== "strip") mc.appendChild(el("span", "", ROMAN[at(c.i).m - 1]));
    if (c.ys) mc.setAttribute("data-ys", "");
    mc.setAttribute("data-c", k);
    colEls[k].push(mc);
    monthsRow.appendChild(mc);
  });
  cal.appendChild(yearsRow);
  cal.appendChild(monthsRow);
  head.appendChild(cal);
  table.appendChild(head);

  var body = el("div", "c5-ax__body");
  table.appendChild(body);

  /* „we are here”: one marker in the source; the label stands over the years,
     centred on the line of its month */
  var nowSrc = $("[data-m]", src), nowAt = nowSrc ? ym(nowSrc.getAttribute("data-m")) : null;
  var nowI = nowAt ? idx(nowAt) : -1;
  var nowCol = nowI >= 0 && nowI < N && cols[colOf[nowI]].type !== "strip" ? colOf[nowI] : -1;
  var nowLab = null, nowBox = null;
  if (nowCol >= 0) {
    nowBox = el("div", "c5-ax__nowcol" + (cols[nowCol].type === "ev" ? "" : " c5-ax__nowcol--mid"));
    nowBox.style.gridColumn = String(nowCol + 1);
    nowLab = el("span", "c5-ax__nowlab", text(nowSrc));
    nowBox.appendChild(nowLab);
    yearsRow.appendChild(nowBox);
    colEls[nowCol][0].classList.add("c5-ax__month--now");
  }

  function cellFor(c, k) {
    var cell = el("div", "c5-ax__cell c5-ax__cell--" + c.type + (k === nowCol ? " c5-ax__cell--now" : ""));
    if (c.ys) cell.setAttribute("data-ys", "");
    cell.setAttribute("data-c", k);
    cell.style.gridColumn = String(k + 1);
    return cell;
  }

  var rowEls = {}, rowList = [], items = [];
  rows.forEach(function (r) {
    var row = el("div", "c5-ax__row");
    row.setAttribute("role", "group");
    var nameId = "c5-ax-n-" + r.key;
    row.setAttribute("aria-labelledby", nameId);

    var name = el("div", "c5-ax__name");
    name.id = nameId;
    if (r.crop) {
      var crop = el("span", "c5-ax__crop");
      crop.appendChild(icon("crop", "c5-ax__cropico"));
      crop.appendChild(el("span", "", r.crop));
      name.appendChild(crop);
    }
    var who = el("span", "c5-ax__who", r.who);
    if (r.full && r.full !== r.who) who.title = r.full;        /* full farm name on hover */
    name.appendChild(who);
    row.appendChild(name);

    var track = el("div", "c5-ax__track");
    track.style.setProperty("--lanes", r.lanes);
    var cells = cols.map(function (c, k) {
      var cell = cellFor(c, k);
      colEls[k].push(cell);
      track.appendChild(cell);
      return cell;
    });

    r.items.forEach(function (it) {
      var k = colOf[it.i];
      it.col = k;
      var b = el("button", "c5-ax__pt" + (it.film ? " c5-ax__pt--film" : ""));
      b.type = "button";
      b.setAttribute("data-state", it.state);
      b.setAttribute("data-m", at(it.i).y + "-" + ("0" + at(it.i).m).slice(-2));
      b.setAttribute("aria-haspopup", "dialog");
      b.setAttribute("aria-label", [it.term, it.name, it.stateLabel,
        it.film ? "relacja filmowa" + (it.filmTitle ? ": " + it.filmTitle : "") : ""].filter(Boolean).join(" – "));
      b.style.setProperty("--i", k);
      b.style.setProperty("--lane", it.lane);
      /* the mark is the icon of the label; the name unfolds behind it while the
         column is widened (the term stays on the axis and in the accessible name) */
      var ev = hide(el("span", "c5-ax__ev"));
      ev.appendChild(icon(it.state === "done" || it.state === "doing" || it.state === "na" ? it.state : "todo"));
      it.seg = ev.appendChild(el("span", "c5-ax__seg", it.name));
      b.appendChild(ev);
      if (it.film) {
        var fm = hide(el("span", "c5-ax__film"));
        fm.appendChild(icon("yt"));
        it.filmSeg = fm.appendChild(el("span", "c5-ax__seg", it.filmTitle || "Film"));
        it.filmEl = fm;
        b.appendChild(fm);
      }
      b.addEventListener("click", function () { openDialog(r, it, b); });
      it.btn = b;
      cells[k].appendChild(b);
      items.push(it);
    });
    row.appendChild(track);
    body.appendChild(row);
    rowEls[r.key] = row;
    rowList.push(row);
  });

  /* the right edge fades out where the axis scrolls sideways (CSS) */
  body.appendChild(hide(el("div", "c5-ax__fade")));

  /* legend: four states (labels as on the chips) and the film mark (Figma 888:4758) */
  var legend = el("ul", "c5-ax__legend");
  [["done", "zrobione"], ["doing", "w toku"], ["todo", "zaplanowane"], ["na", "nie dotyczy"], ["yt", "YouTube"]].forEach(function (s) {
    var li = el("li");
    li.appendChild(icon(s[0]));
    li.appendChild(el("span", "", s[1]));
    legend.appendChild(li);
  });

  /* --- 6. geometry: one px track list for every grid of the block ----------- */
  var open = -1, cur = [], total = 0, need = [];

  function nameW() { return corner.getBoundingClientRect().width || 0; }

  /* natural widths of the unfolded labels (measured on the folded labels,
     which stay laid out while hidden) and the room a widened column needs:
     20 px to the marks, the widest unfolded point, 24 px of air */
  function measureNeed() {
    need = cols.map(function () { return 0; });
    fitLabels(-1, 0);
    items.forEach(function (it) {
      it.segW = it.seg.offsetWidth;
      it.filmW = it.film ? it.filmSeg.offsetWidth : 0;
      need[it.col] = Math.max(need[it.col], 20 + pointW(it, it.segW, it.filmW) + 24);
    });
  }
  /* an unfolded point: mark + label (overlapping by 5), film mark + label 10 px on */
  function pointW(it, a, f) { return 20 + a - 5 + (it.film ? 10 + 20 + f - 5 : 0); }
  /* the labels of the widened column share its room; a label that does not fit
     is cut with an ellipsis (the film title gives way first) */
  function fitLabels(k, w) {
    items.forEach(function (it) {
      if (it.col !== k) { it.seg.style.maxWidth = ""; if (it.filmSeg) it.filmSeg.style.maxWidth = ""; return; }
      var room = w - 20 - 16;
      var a = it.segW, f = it.filmW, cut = pointW(it, a, f) > room;
      if (cut) {
        if (it.film) {
          var both = room - (20 - 5) - (10 + 20 - 5);
          a = Math.min(a, Math.max(both * 0.5, both - f));
          f = Math.max(40, both - a);
        } else {
          a = room - 15;
        }
      }
      /* a label that fits keeps its natural width (rounded up, so no ellipsis) */
      it.seg.style.maxWidth = (cut ? Math.floor(a) : Math.ceil(a) + 1) + "px";
      if (it.filmSeg) it.filmSeg.style.maxWidth = (cut ? Math.floor(f) : Math.ceil(f) + 1) + "px";
    });
  }

  function apply() {
    var avail = Math.floor(frame.clientWidth - nameW());
    if (!(avail > 0)) return;
    /* an empty month right before a month with events keeps some extra room, so
       its label clears the label centred on the next month line */
    var bump = cols.map(function (c, k) { return c.type === "empty" && cols[k + 1] && cols[k + 1].type === "ev" ? 14 : 0; });
    var units = 0, fixed0 = 0;
    cols.forEach(function (c, k) { if (c.type === "strip") fixed0 += STRIP; else { units += UNIT[c.type]; fixed0 += bump[k]; } });
    var full = Math.max(MIN_FULL, (avail - fixed0) / (units || 1));
    var empty = Math.max(EMPTY_MIN, full * UNIT.empty);
    var rest = cols.map(function (c, k) { return c.type === "strip" ? STRIP : c.type === "ev" ? full : empty + bump[k]; });
    total = rest.reduce(function (x, y) { return x + y; }, 0);
    var scrolls = total > avail + 0.5;
    root.classList.toggle("is-scroll", scrolls);
    cur = rest.slice();
    if (open >= 0) {
      /* Figma 903: the widened month takes about half of the axis and at least
         what its labels need – as far as the other months leave room */
      var want = Math.max(need[open] || 0, Math.min(OPEN_MAX, total * OPEN_PART));
      if (scrolls) {
        /* a frame that scrolls: the axis grows, nothing squeezes; the column
           never outgrows the visible part of the axis */
        cur[open] = Math.max(rest[open], Math.min(want, avail - 8));
      } else {
        var minO = 0, evO = 0, fixO = 0, nEv = 0, emO = 0;
        cols.forEach(function (c, k) {
          if (k === open) return;
          if (c.type === "ev") { evO += rest[k]; nEv++; minO += MIN_FULL; }
          else { fixO += rest[k]; minO += c.type === "strip" ? STRIP : EMPTY_MIN + bump[k]; if (c.type === "empty") emO += rest[k] - bump[k]; }
        });
        var wide = Math.max(rest[open], Math.min(want, total - minO));
        var R = total - wide;
        var f = evO ? (R - fixO) / evO : 1;
        if (!evO || full * f >= MIN_FULL) {
          /* the other months with events give way, empty months keep their room */
          cur = rest.map(function (w, k) { return k === open ? wide : cols[k].type === "ev" ? w * f : w; });
        } else {
          /* events at their minimum, empty months share what is left */
          var g = emO ? (R - nEv * MIN_FULL - (fixO - emO)) / emO : 1;
          cur = rest.map(function (w, k) {
            if (k === open) return wide;
            if (cols[k].type === "ev") return MIN_FULL;
            if (cols[k].type === "empty") return (w - bump[k]) * g + bump[k];
            return w;
          });
        }
      }
      fitLabels(open, cur[open]);
    } else {
      fitLabels(-1, 0);
    }
    var sum = cur.reduce(function (x, y) { return x + y; }, 0);
    table.style.setProperty("--c5-ax-cols", cur.map(function (w) { return (Math.floor(w * 100) / 100) + "px"; }).join(" "));
    table.style.setProperty("--c5-ax-w", (Math.floor(sum * 100) / 100) + "px");
    root.style.setProperty("--c5-ax-e", (open >= 0 ? cur[open] : full).toFixed(2) + "px");
    /* an empty month too narrow for its label („VIII” is ~20 px) loses the label */
    root.classList.toggle("is-tight", cur.some(function (w, k) { return cols[k].type === "empty" && w - bump[k] < 23; }));
    /* the dashes of a month line run on unbroken from row to row */
    rowList.forEach(function (row) { row.style.setProperty("--c5-ax-ry", row.offsetTop + "px"); });
    if (nowLab) {
      /* the label must stay inside the axis and clear of the next year's number */
      var x = xOf(nowCol), lim = sum;
      years.forEach(function (yr) { if (yr.a > nowCol && lim === sum) lim = xOf(yr.a); });
      nowLab.classList.toggle("is-flip", x + nowLab.offsetWidth / (scrolls ? 1 : 2) + 4 > lim);
    }
  }
  function xOf(k) { var x = 0; for (var j = 0; j < k; j++) x += cur[j]; return x; }

  /* --- 6b. the lit row ------------------------------------------------------- */
  var litRow = null, hoverRow = null, focusRow = null, targetRow = null;
  function syncLit() {
    var row = targetRow || focusRow || hoverRow;
    if (litRow && litRow !== row) litRow.classList.remove("is-lit");
    litRow = row;
    if (row) row.classList.add("is-lit");
  }
  function rowOf(target) {
    var row = target && target.closest ? target.closest(".c5-ax__row") : null;
    return row && body.contains(row) ? row : null;
  }

  /* --- 6c. widening with FLIP: the layout jumps, every column is shifted back
     to where it stood and glides home on transform alone ---------------------- */
  var flipEls = [].concat(
    Array.prototype.slice.call(monthsRow.children),
    yearEls,
    nowBox ? [nowBox] : [],
    Array.prototype.slice.call(body.querySelectorAll(".c5-ax__cell"))
  );
  var flipT = null;
  function setOpen(k) {
    if (k === open) return;
    var anim = CX5.motionOn() && !CX5.reducedMQ.matches;
    var before = null, films = [];
    if (anim) {
      before = flipEls.map(function (n) { return n.getBoundingClientRect().left; });
      [open, k].forEach(function (c) {
        if (c < 0) return;
        items.forEach(function (it) {
          if (it.col === c && it.filmEl) films.push({ n: it.filmEl, cell: it.btn.parentNode, x: it.filmEl.getBoundingClientRect().left });
        });
      });
    }
    if (open >= 0) colEls[open].forEach(function (c) { c.classList.remove("is-open"); });
    open = k;
    if (k >= 0) colEls[k].forEach(function (c) { c.classList.add("is-open"); });
    apply();
    if (anim) {
      if (flipT) { window.clearTimeout(flipT); flipT = null; }
      /* writes, then reads, then writes – one layout pass for the whole axis */
      flipEls.forEach(function (n) { n.style.transition = "none"; n.style.transform = ""; });
      films.forEach(function (f) { f.n.style.transition = "none"; f.n.style.transform = ""; });
      var after = flipEls.map(function (n) { return n.getBoundingClientRect().left; });
      var cellDx = new Map();
      flipEls.forEach(function (n, i) {
        var dx = before[i] - after[i];
        if (Math.abs(dx) > 0.5) n.style.transform = "translateX(" + dx.toFixed(1) + "px)";
        cellDx.set(n, dx);
      });
      films.forEach(function (f) {
        var dx = (f.x - f.n.getBoundingClientRect().left) - (cellDx.get(f.cell) || 0);
        if (Math.abs(dx) > 0.5) f.n.style.transform = "translateX(" + dx.toFixed(1) + "px)";
      });
      void table.offsetWidth;
      var tr = "transform .45s cubic-bezier(.22,.61,.36,1)";
      flipEls.forEach(function (n) { if (n.style.transform) { n.style.transition = tr; n.style.transform = ""; } });
      films.forEach(function (f) { if (f.n.style.transform) { f.n.style.transition = tr; f.n.style.transform = ""; } });
      flipT = window.setTimeout(function () {
        flipT = null;
        flipEls.forEach(function (n) { n.style.transition = ""; });
        films.forEach(function (f) { f.n.style.transition = ""; });
      }, 500);
    }
    /* a frame that scrolls brings the widened column into view */
    if (k >= 0 && frame.scrollWidth > frame.clientWidth + 1) {
      var x = xOf(k), vis = frame.clientWidth - nameW(), sl = frame.scrollLeft;
      if (x < sl + 4 || x + cur[k] > sl + vis) {
        frame.scrollTo({ left: Math.max(0, x - 6), behavior: CX5.reducedMQ.matches ? "auto" : "smooth" });
      }
    }
  }

  /* --- 7. widening a month: hover, focus, tap; folding: leave, Esc ----------- */
  var hoverCol = -1, hoverT = null, closeT = null, lastX = -1, lastY = -1, muted = -1;
  function clearTimers() {
    if (hoverT) { window.clearTimeout(hoverT); hoverT = null; }
    if (closeT) { window.clearTimeout(closeT); closeT = null; }
  }
  function evCol(target) {
    var cell = target && target.closest ? target.closest("[data-c]") : null;
    if (!cell || !table.contains(cell)) return -1;
    var k = +cell.getAttribute("data-c");
    return cols[k] && cols[k].type === "ev" ? k : -1;
  }
  function keyboardInside() {
    var a = doc.activeElement;
    return !!(a && table.contains(a) && a.matches && a.matches(":focus-visible"));
  }
  function foldSoon(ms) {
    closeT = window.setTimeout(function () {
      closeT = null;
      if (!keyboardInside() && !dlg.open) setOpen(-1);
    }, ms);
  }

  /* only a real move of the pointer counts – the axis sliding under a resting
     cursor must not pick another month; a short pause filters a sweep across */
  table.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    if (e.clientX === lastX && e.clientY === lastY) return;
    lastX = e.clientX; lastY = e.clientY;
    var hr = rowOf(e.target);
    if (hr !== hoverRow) { hoverRow = hr; syncLit(); }
    var inName = !!(e.target.closest && e.target.closest(".c5-ax__name, .c5-ax__corner"));
    var k = evCol(e.target);
    if (k !== muted) muted = -1;
    if (k === hoverCol && !inName) return;
    hoverCol = k;
    clearTimers();
    if (k >= 0) {
      if (k !== muted && k !== open) hoverT = window.setTimeout(function () { hoverT = null; setOpen(k); }, open >= 0 ? 90 : 40);
    } else if (inName && open >= 0) {
      foldSoon(200);                       /* over the names = outside the axis */
    }
    /* an empty month keeps the last widened one – no folding halfway across */
  });
  table.addEventListener("pointerleave", function (e) {
    if (e.pointerType === "touch") return;
    hoverCol = -1; lastX = lastY = -1;
    if (hoverRow) { hoverRow = null; syncLit(); }
    clearTimers();
    if (open >= 0) foldSoon(160);
  });
  /* touch (and a plain click): the column under the finger widens, any other place folds */
  table.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(".c5-ax__pt")) return;
    clearTimers();
    setOpen(evCol(e.target));
  });
  doc.addEventListener("pointerdown", function (e) {
    if (open < 0 || root.contains(e.target) || dlg.contains(e.target)) return;
    clearTimers();
    setOpen(-1);
  });
  /* keyboard: the column of the focused point widens */
  table.addEventListener("focusin", function (e) {
    var pt = e.target.closest ? e.target.closest(".c5-ax__pt") : null;
    if (!pt) return;
    clearTimers();
    focusRow = rowOf(pt);
    setOpen(+pt.style.getPropertyValue("--i"));
    syncLit();
  });
  table.addEventListener("focusout", function (e) {
    if (dlg.open) return;                           /* focus went into the pop-up */
    if (e.relatedTarget && table.contains(e.relatedTarget)) return;
    if (focusRow) { focusRow = null; syncLit(); }
    if (hoverCol >= 0 && hoverCol === open) return; /* the pointer still holds it */
    clearTimers();
    setOpen(-1);
  });
  doc.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || open < 0 || dlg.open) return;
    clearTimers();
    muted = hoverCol;                               /* stays folded until the pointer moves on */
    setOpen(-1);
  });

  /* --- 8. pop-up: centred dialog ----------------------------------------------
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

  function openDialog(r, hit, btn) {
    if (dlg.open) return;
    clearTimers();
    opener = btn || null;
    dCrop.textContent = r.crop;
    dCrop.hidden = !r.crop;
    dTitle.textContent = r.who;
    dPeriod.textContent = label(hit.i);
    dScroll.textContent = "";

    /* the dialog holds EVERY event of this farm in this month */
    var hitHead = null, hitArt = null;
    r.items.forEach(function (it) {
      if (it.i !== hit.i) return;
      var art = doc.createElement("article");
      art.className = "pp-ms";
      art.setAttribute("data-state", it.state);
      var clone = clean(it.li.cloneNode(true));
      while (clone.firstChild) art.appendChild(clone.firstChild);
      var h = retitle(art);
      if (it === hit) {
        art.classList.add("is-hit");
        if (h) { h.tabIndex = -1; hitHead = h; }
        hitArt = art;
      }
      dScroll.appendChild(art);
    });

    dlg.showModal();
    doc.documentElement.classList.add("c5-ax-lock");
    if (CX5.lenis) CX5.lenis.stop();
    if (hitHead) hitHead.focus({ preventScroll: true });
    else dScroll.focus();
    /* scrolled straight to the event that was clicked (its film included) */
    dScroll.scrollTop = hitArt && hitArt !== dScroll.firstElementChild ? Math.max(0, hitArt.offsetTop - 12) : 0;
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

  /* --- 9. start ---------------------------------------------------------------- */
  /* the source keeps its content but hands the anchors over to the rows */
  rows.forEach(function (r) {
    if (r.block.id) r.block.id = r.block.id + "-lista";
    rowEls[r.key].id = "etapy-" + r.key;
  });
  src.hidden = true;
  root.insertBefore(sprite, src);
  root.insertBefore(frame, src);
  root.insertBefore(legend, src);

  /* widths follow the frame; a resize never animates. A frame that scrolls
     starts with the current month in view */
  var placed = false;
  function measure() {
    measureNeed();
    apply();
    if (!placed && total > 0) {
      placed = true;
      if (frame.scrollWidth > frame.clientWidth + 1 && nowCol >= 0) {
        /* the current month a little left of the middle – or further left on
           a narrow phone, so its label („we are here”) fits on screen */
        var vis = frame.clientWidth - nameW(), lw = nowLab ? nowLab.offsetWidth : 0;
        frame.scrollLeft = Math.max(0, xOf(nowCol) - Math.max(14, Math.min(vis * 0.4, vis - lw - 20)));
      }
    }
  }
  CX5.register({ resize: measure });
  measure();
  /* the labels are measured in the page font – measure again once it is in */
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(measure);

  /* first entry into view: points appear with a short stagger (motion only) */
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
    /* safety net: a silent observer must never leave the points invisible */
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

  /* --- 10. jump from a participant card: scroll to the row and light it up --- */
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
