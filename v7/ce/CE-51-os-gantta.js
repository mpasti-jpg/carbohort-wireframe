/* ===== CE-51 · Oś Gantta – rebuilt 19.09.2026 (spec prochnica-plus-wzorzec-eco-spec §18.10).
   ---------------------------------------------------------------------------
   The six per-farm timelines in `[data-etapy-src]` are the ONLY source of data
   and at the same time the no-JS version of this block: the script reads them,
   builds one table (row = farm, column = month) and hides the source.
   Nothing but the calendar of columns is hard-coded – another participant is
   another `[data-etapy-block]` in the HTML and another row here.
   Mechanics from the Figma frame 306:2991: any number of events per cell one
   under another, names clipped to ~250 px with the full name in a tooltip, a
   film thumbnail under an event that has one, a row-tall highlight band, and a
   click that opens the farm x month card scrolled to the clicked event.
   Scrolling stays inside the frame (`data-lenis-prevent`, no `wheel` listener);
   mouse dragging and the arrow keys move it, and it starts on the current month.
   ========================================================================= */
(function () {
  "use strict";
  var doc = document;
  var $ = CX5.$, $$ = CX5.$$;
  var SVGNS = "http://www.w3.org/2000/svg";

  var root = doc.getElementById("etapy-gantt");
  if (!root) return;
  var src = $("[data-etapy-src]", root);
  if (!src) return;

  /* --- 1. calendar of columns -------------------------------------------- */
  /* months XI 2025 … XII 2026, then one roll-up column for 2027 and for 2028 */
  var ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  var COLS = [{ y: 2025, m: 11 }, { y: 2025, m: 12 }];
  for (var mi = 1; mi <= 12; mi++) COLS.push({ y: 2026, m: mi });
  COLS.push({ y: 2027 }, { y: 2028 });
  var NOW_COL = 10;                                  /* wrzesień 2026 – „jesteśmy tutaj” */

  function colLabel(c) { return c.m ? ROMAN[c.m - 1] + " " + c.y : String(c.y); }

  var MONTHS = [["stycz", 1], ["lut", 2], ["marz", 3], ["marc", 3], ["kwie", 4], ["maj", 5], ["maja", 5],
                ["czerw", 6], ["lip", 7], ["sierp", 8], ["wrze", 9], ["paździer", 10],
                ["listopad", 11], ["grud", 12]];
  var SEASONS = [["wiosn", 3], ["lato", 6], ["latem", 6], ["jesie", 9], ["zim", 12]];

  function colOf(y, m) {
    if (y <= 2025) return m >= 12 ? 1 : 0;
    if (y === 2026) return CX5.clamp(1 + m, 2, 13);
    if (y === 2027) return 14;
    return 15;
  }
  function monthIn(part) {
    for (var i = 0; i < MONTHS.length; i++) if (part.indexOf(MONTHS[i][0]) >= 0) return MONTHS[i][1];
    for (var j = 0; j < SEASONS.length; j++) if (part.indexOf(SEASONS[j][0]) >= 0) return SEASONS[j][1];
    return null;
  }
  /* an event sits in the column of the month it STARTS in – „marzec–kwiecień
     2026” lands in III 2026, „wiosna–lato 2026” in III 2026 */
  function startCol(text) {
    var s = (text || "").toLowerCase().replace(/\s+/g, " ");
    var head = s.split("–")[0];
    var yr = head.match(/20\d\d/) || s.match(/20\d\d/);
    return colOf(yr ? parseInt(yr[0], 10) : 2026, monthIn(head) || 1);
  }

  /* --- 2. farms and events read out of the DOM ---------------------------- */
  var farms = $$("[data-etapy-block]", src).map(function (block) {
    var head = $(".pp-varname", block);
    var items = $$(".pp-ms", block).map(function (li) {
      var term = $(".pp-ms__term", li), name = $(".pp-ms__name", li), chip = $(".c5-chip", li);
      var rel = $(".pp-rel__title", li);
      return {
        li: li,
        term: term ? term.textContent.trim() : "",
        name: name ? name.textContent.trim() : "",
        state: li.getAttribute("data-state") || "todo",
        /* the state label is copy – it comes from the milestone chip, verbatim */
        stateLabel: chip ? chip.textContent.replace(/\s+/g, " ").trim() : "",
        film: !!$(".pp-rel", li),
        filmTitle: rel ? rel.textContent.trim() : "",
        col: startCol(term ? term.textContent : "")
      };
    });
    return {
      key: block.getAttribute("data-etapy-block"),
      who: block.getAttribute("data-gospodarz") || "",
      crop: block.getAttribute("data-uprawa") || "",
      full: head ? head.textContent.replace(/\s+/g, " ").trim() : "",
      items: items
    };
  }).filter(function (f) { return f.key && f.items.length; });
  if (!farms.length) return;

  var byKey = {};
  farms.forEach(function (f) { byKey[f.key] = f; });

  /* --- 3. small DOM helpers ---------------------------------------------- */
  function el(tag, cls, txt) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function icon(id, cls) {
    var s = doc.createElementNS(SVGNS, "svg");
    s.setAttribute("class", "wf-icon" + (cls ? " " + cls : ""));
    s.setAttribute("aria-hidden", "true");
    var u = doc.createElementNS(SVGNS, "use");
    u.setAttribute("href", "#" + id);
    s.appendChild(u);
    return s;
  }
  var STATE_ICON = { done: "ti-check", doing: "ti-clock", todo: "ti-calendar", na: "ti-minus" };

  /* --- 4. skeleton -------------------------------------------------------- */
  var frame = el("div", "c5-gt__frame");
  frame.tabIndex = 0;
  frame.setAttribute("role", "group");
  frame.setAttribute("aria-label", "Etapy prac gospodarstw – oś czasu, przewijana w poziomie i w pionie");
  frame.setAttribute("data-lenis-prevent", "");

  /* role=table, not role=grid: the cells hold ordinary buttons and the block is
     read, not operated like a spreadsheet – a grid would owe the reader full
     two-dimensional roving-tabindex navigation. */
  var table = el("div", "c5-gt__table");
  table.setAttribute("role", "table");
  table.setAttribute("aria-label", "Etapy prac – gospodarstwa w kolejnych miesiącach programu");
  frame.appendChild(table);

  var tip = el("div", "c5-gt__tip");
  tip.hidden = true;
  tip.setAttribute("aria-hidden", "true");   /* the button already carries the full name */
  table.appendChild(tip);

  /* header row */
  var hrow = el("div", "c5-gt__hrow");
  hrow.setAttribute("role", "row");
  var corner = el("div", "c5-gt__corner");
  corner.setAttribute("role", "columnheader");
  corner.appendChild(el("span", "c5-gt__cornert", "GOSPODARSTWO"));
  hrow.appendChild(corner);
  COLS.forEach(function (c, i) {
    var h = el("div", "c5-gt__head" + (i === NOW_COL ? " c5-gt__head--now" : ""));
    h.setAttribute("role", "columnheader");
    h.appendChild(el("span", "c5-gt__m", colLabel(c)));
    if (i === NOW_COL) h.appendChild(el("span", "c5-gt__nowlab", "jesteśmy tutaj"));
    hrow.appendChild(h);
  });
  table.appendChild(hrow);

  /* --- 5. farm rows ------------------------------------------------------- */
  var rows = {};
  farms.forEach(function (f) {
    var row = el("div", "c5-gt__row");
    row.setAttribute("role", "row");
    row.id = "etapy-" + f.key;

    var name = el("div", "c5-gt__name");
    name.setAttribute("role", "rowheader");
    if (f.crop) name.appendChild(el("span", "c5-gt__crop", f.crop));
    var who = el("span", "c5-gt__who", f.who || f.full);
    who.title = f.full || f.who;                 /* full farm name on hover */
    name.appendChild(who);
    row.appendChild(name);

    var cells = COLS.map(function (c, i) {
      var cell = el("div", "c5-gt__cell" + (i === NOW_COL ? " c5-gt__cell--now" : ""));
      cell.setAttribute("role", "cell");
      row.appendChild(cell);
      return cell;
    });

    f.items.forEach(function (it, idx) {
      var cell = cells[CX5.clamp(it.col, 0, COLS.length - 1)];
      var b = el("button", "c5-gt__ev");
      b.type = "button";
      b.setAttribute("data-state", it.state);
      b.setAttribute("aria-label", [it.term, it.name, it.stateLabel].filter(Boolean).join(" – "));
      b.appendChild(icon(STATE_ICON[it.state] || "ti-calendar", "wf-icon--sm"));
      b.appendChild(el("span", "c5-gt__evname", it.name));
      if (it.state === "doing") b.appendChild(el("span", "c5-gt__pulse"));
      b.addEventListener("click", function () { openCard(f, it.col, idx, b); });
      b.addEventListener("mouseenter", function () { showTip(b, it); });
      b.addEventListener("mouseleave", hideTip);
      b.addEventListener("focus", function () { showTip(b, it); });
      b.addEventListener("blur", hideTip);
      cell.appendChild(b);

      if (it.film) {
        /* the thumbnail repeats what the pill already does, so it stays out of
           the tab order and out of the accessibility tree – mouse affordance only */
        var ph = el("span", "c5-gt__film wf-ph");
        ph.setAttribute("aria-hidden", "true");
        ph.appendChild(icon("ti-player-play"));
        ph.addEventListener("click", function () { openCard(f, it.col, idx, b); });
        cell.appendChild(ph);
      }
    });

    table.appendChild(row);
    rows[f.key] = row;
  });

  /* --- 6. tooltip: full name and term, on hover and on focus -------------- */
  function hideTip() { if (!tip.hidden) { tip.hidden = true; tip.textContent = ""; } }
  function showTip(btn, it) {
    if (!CX5.wideMQ.matches) return;
    tip.textContent = "";
    if (it.term) tip.appendChild(el("span", "c5-gt__tipterm", it.term));
    tip.appendChild(doc.createTextNode(it.name));
    tip.hidden = false;
    var br = btn.getBoundingClientRect(), tr = table.getBoundingClientRect();
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var left = br.left - tr.left;
    var minL = frame.scrollLeft + 8, maxL = frame.scrollLeft + frame.clientWidth - w - 8;
    tip.style.left = Math.round(CX5.clamp(left, minL, Math.max(minL, maxL))) + "px";
    var top = br.bottom - tr.top + 6;
    if (top + h > frame.scrollTop + frame.clientHeight - 6) top = br.top - tr.top - h - 6;
    tip.style.top = Math.round(Math.max(frame.scrollTop + 4, top)) + "px";
  }

  /* --- 7. period card: farm x month, as a dialog sliding in from the right -
     accessibility pattern taken over from the farm profile pop-up (module 52):
     native <dialog> for the focus trap and Esc, manual scroll lock, Lenis
     stopped while it is open, focus handed back to the opener. */
  var dlg = el("dialog", "c5-gt__card");
  dlg.setAttribute("aria-labelledby", "c5-gt-card-t");
  var cardHead = el("div", "c5-gt__cardhead");
  var cardCrop = el("span", "c5-gt__crop");
  var cardTitle = el("h3", "c5-gt__cardtitle");
  cardTitle.id = "c5-gt-card-t";
  var cardPeriod = el("span", "c5-gt__cardperiod");
  var cardClose = el("button", "c5-gt__cardclose");
  cardClose.type = "button";
  cardClose.setAttribute("aria-label", "zamknij");
  cardClose.appendChild(icon("ti-x"));
  cardHead.appendChild(cardCrop);
  cardHead.appendChild(cardTitle);
  cardHead.appendChild(cardPeriod);
  cardHead.appendChild(cardClose);
  var cardScroll = el("div", "c5-gt__cardscroll");
  cardScroll.tabIndex = -1;
  cardScroll.setAttribute("data-lenis-prevent", "");
  dlg.appendChild(cardHead);
  dlg.appendChild(cardScroll);
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
  /* the source heading is an h5 under the timeline – inside the card it sits
     one level under the card title */
  function retitle(article) {
    var h5 = $(".pp-ms__name", article);
    if (!h5 || h5.tagName !== "H5") return h5;
    var h4 = doc.createElement("h4");
    h4.className = h5.className;
    while (h5.firstChild) h4.appendChild(h5.firstChild);
    h5.parentNode.replaceChild(h4, h5);
    return h4;
  }

  function openCard(farm, col, itemIdx, btn) {
    if (dlg.open) return;
    opener = btn || null;
    cardCrop.textContent = farm.crop;
    cardCrop.hidden = !farm.crop;
    cardTitle.textContent = farm.who || farm.full;
    cardPeriod.textContent = colLabel(COLS[CX5.clamp(col, 0, COLS.length - 1)]);
    cardScroll.textContent = "";

    /* annotation 6: the card holds EVERY event of this farm in this period */
    var hitHead = null, hitArt = null;
    farm.items.forEach(function (it, idx) {
      if (it.col !== col) return;
      var art = doc.createElement("article");
      art.className = "pp-ms";
      art.setAttribute("data-state", it.state);
      var clone = clean(it.li.cloneNode(true));
      while (clone.firstChild) art.appendChild(clone.firstChild);
      var head = retitle(art);
      if (idx === itemIdx) {
        art.classList.add("is-hit");
        if (head) { head.tabIndex = -1; hitHead = head; }
        hitArt = art;
      }
      cardScroll.appendChild(art);
    });

    dlg.showModal();
    doc.documentElement.classList.add("c5-gt-lock");
    if (CX5.lenis) CX5.lenis.stop();
    if (hitHead) hitHead.focus({ preventScroll: true });
    else cardScroll.focus();
    /* scrolled straight to the event that was clicked (its film included) */
    cardScroll.scrollTop = hitArt ? Math.max(0, hitArt.offsetTop - 12) : 0;
  }

  cardClose.addEventListener("click", function () { dlg.close(); });

  /* backdrop click: a modal dialog gets the click itself, so compare with its box;
     a keyboard-activated click reports 0,0 and must not count as "outside" */
  dlg.addEventListener("click", function (e) {
    if (e.target !== dlg) return;
    if (e.clientX === 0 && e.clientY === 0) return;
    var r = dlg.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
  });

  dlg.addEventListener("close", function () {
    doc.documentElement.classList.remove("c5-gt-lock");
    if (CX5.lenis) CX5.lenis.start();
    cardScroll.textContent = "";
    if (opener && opener.focus) opener.focus();
    opener = null;
  });

  /* --- 8. moving inside the frame: drag, arrow keys, start on this month --- */
  /* measured, not parsed: the custom properties may carry rem, not px */
  function colW() {
    var h = $(".c5-gt__head", hrow);
    var v = h ? h.getBoundingClientRect().width : 0;
    return v > 0 ? v : 270;
  }
  function nameW() {
    var v = corner.getBoundingClientRect().width;
    return v > 0 ? v : 290;
  }

  var drag = null, suppress = false, dragT = null;
  frame.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, sl: frame.scrollLeft, st: frame.scrollTop, moved: false };
  });
  doc.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved) {
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      drag.moved = true;
      frame.classList.add("is-dragging");
      hideTip();
    }
    frame.scrollLeft = drag.sl - dx;
    frame.scrollTop = drag.st - dy;
    e.preventDefault();
  });
  doc.addEventListener("pointerup", function () {
    if (!drag) return;
    /* a drag must not fire the pill underneath the cursor */
    suppress = drag.moved;
    if (dragT) window.clearTimeout(dragT);
    if (suppress) dragT = window.setTimeout(function () { suppress = false; }, 150);
    frame.classList.remove("is-dragging");
    drag = null;
  });
  frame.addEventListener("click", function (e) {
    if (!suppress) return;
    suppress = false;
    e.preventDefault();
    e.stopPropagation();
  }, true);

  frame.addEventListener("keydown", function (e) {
    if (e.target !== frame || e.metaKey || e.ctrlKey || e.altKey) return;
    var step = colW(), page = Math.max(120, frame.clientHeight * 0.8), used = true;
    if (e.key === "ArrowRight") frame.scrollLeft += step;
    else if (e.key === "ArrowLeft") frame.scrollLeft -= step;
    else if (e.key === "ArrowDown") frame.scrollTop += 64;
    else if (e.key === "ArrowUp") frame.scrollTop -= 64;
    else if (e.key === "PageDown") frame.scrollTop += page;
    else if (e.key === "PageUp") frame.scrollTop -= page;
    else if (e.key === "Home") frame.scrollLeft = 0;
    else if (e.key === "End") frame.scrollLeft = frame.scrollWidth;
    else used = false;
    if (used) { e.preventDefault(); hideTip(); }
  });

  frame.addEventListener("scroll", hideTip, { passive: true });
  CX5.register({ resize: hideTip });

  /* --- 9. start ----------------------------------------------------------- */
  /* the timelines keep their content but hand the anchors over to the rows */
  $$("[data-etapy-block]", src).forEach(function (b) { if (b.id) b.id = b.id + "-lista"; });
  src.hidden = true;
  src.classList.add("c5-gt__src");
  root.insertBefore(frame, src);
  /* start on wrzesień 2026: one month of run-up when there is room for it, and
     the current month right at the edge of the panel when there is not (mobile) */
  (function () {
    var col = colW(), free = frame.clientWidth - nameW();
    frame.scrollLeft = Math.max(0, (free >= col * 2 ? NOW_COL - 1 : NOW_COL) * col);
  })();

  /* --- 10. jump from a participant card: scroll to the row and light it up - */
  var hlT = null;
  function focusFarm(key, instant) {
    var row = rows[key];
    if (!row) return false;
    var off = Math.min(160, window.innerHeight * 0.12);
    CX5.scrollTo(window.scrollY + root.getBoundingClientRect().top - off,
                 instant || CX5.reducedMQ.matches ? "auto" : "smooth");
    var d = row.getBoundingClientRect().top - table.getBoundingClientRect().top;
    frame.scrollTop = Math.max(0, d - hrow.offsetHeight);
    row.classList.add("is-target");
    if (hlT) window.clearTimeout(hlT);
    hlT = window.setTimeout(function () { row.classList.remove("is-target"); }, 1200);
    return true;
  }

  CX5.onHash(function (hash, instant) {
    if (!hash || hash.indexOf("#etapy-") !== 0) return false;
    return focusFarm(hash.slice(7), instant);
  });
  CX5.ppEtapy = { focusFarm: function (key) { focusFarm(key, false); } };
})();
