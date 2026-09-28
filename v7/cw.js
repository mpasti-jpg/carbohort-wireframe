/* =====================================================================
   CarboHort wireframe — project interactions (cw.js).
   Vanilla, dependency-free, defensive (every block no-ops if its markup
   is absent on the page). Drives the chrome + shared widgets. Page-specific
   modules (shop filters, configurator, B2B) are appended in their phase.
   ===================================================================== */
(function () {
  "use strict";
  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };

  /* --- Page scrim (shared by mega-menus) ------------------------------- */
  function scrim() { return $("[data-cw-scrim]"); }
  function showScrim(on) { var s = scrim(); if (s) s.setAttribute("data-open", on ? "true" : "false"); }

  /* --- Mega-menus (disclosure: button + .cw-mega panel) ---------------- */
  var openMega = null;
  function closeMega(focusTrigger) {
    if (!openMega) return;
    var t = openMega.trigger, p = openMega.panel;
    p.setAttribute("data-open", "false");
    t.setAttribute("aria-expanded", "false");
    openMega = null;
    showScrim(false);
    if (focusTrigger && t) t.focus();
  }
  function openMegaFor(trigger) {
    var panel = $("#" + trigger.getAttribute("aria-controls"));
    if (!panel) return;
    if (openMega) closeMega(false);
    panel.setAttribute("data-open", "true");
    trigger.setAttribute("aria-expanded", "true");
    openMega = { trigger: trigger, panel: panel };
    showScrim(true);
  }
  $$("[data-mega-trigger]").forEach(function (t) {
    t.addEventListener("click", function (e) {
      e.preventDefault();
      var isOpen = t.getAttribute("aria-expanded") === "true";
      if (isOpen) closeMega(true); else openMegaFor(t);
    });
  });
  // outside click on scrim closes
  var sc = scrim();
  if (sc) sc.addEventListener("click", function () { closeMega(false); });

  /* --- Mobile nav toggle ----------------------------------------------- */
  $$("[data-navtoggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = $("#" + btn.getAttribute("aria-controls"));
      if (!panel) return;
      var open = panel.getAttribute("data-open") === "true";
      panel.setAttribute("data-open", open ? "false" : "true");
      btn.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });

  /* --- dr Jurek floating dock ------------------------------------------ */
  var dock = $("[data-jurek-dock]");
  var dockBackdrop = $("[data-jurek-backdrop]");
  var lastJurekTrigger = null;
  function setDock(open) {
    if (!dock) return;
    dock.setAttribute("data-open", open ? "true" : "false");
    if (dockBackdrop) dockBackdrop.setAttribute("data-open", open ? "true" : "false");
    if (open) { var inp = $("[data-jurek-input]", dock); if (inp) inp.focus(); }
    else if (lastJurekTrigger) { lastJurekTrigger.focus(); lastJurekTrigger = null; }
  }
  $$("[data-jurek-open]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); lastJurekTrigger = b; setDock(true); });
  });
  $$("[data-jurek-close]").forEach(function (b) { b.addEventListener("click", function () { setDock(false); }); });
  if (dockBackdrop) dockBackdrop.addEventListener("click", function () { setDock(false); });
  var jForm = $("[data-jurek-form]");
  if (jForm) {
    jForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var inp = $("[data-jurek-input]", dock); var msgs = $("[data-jurek-msgs]", dock);
      if (!inp || !msgs || !inp.value.trim()) return;
      if (dock && dock.getAttribute("data-open") !== "true") setDock(true);
      var u = doc.createElement("div"); u.className = "cw-msg cw-msg--user"; u.textContent = inp.value.trim(); msgs.appendChild(u);
      var a = doc.createElement("div"); a.className = "cw-msg";
      a.textContent = "Demo: w wersji docelowej dr Jurek dobierze odpowiedź na bazie wiedzy CarboHort.";
      msgs.appendChild(a); inp.value = ""; msgs.scrollTop = msgs.scrollHeight;
    });
  }

  /* --- Accordion (wf-accordion) ---------------------------------------- */
  $$(".wf-accordion__trigger").forEach(function (t) {
    var panel = t.nextElementSibling;
    var expanded = t.getAttribute("aria-expanded") === "true";
    if (panel && panel.classList.contains("wf-accordion__panel")) panel.hidden = !expanded;
    t.addEventListener("click", function () {
      var open = t.getAttribute("aria-expanded") === "true";
      t.setAttribute("aria-expanded", open ? "false" : "true");
      if (panel && panel.classList.contains("wf-accordion__panel")) panel.hidden = open;
    });
  });

  /* --- Tabs (wf-tabs: [data-tab] buttons + [data-panel] regions) ------- */
  $$("[data-tabs]").forEach(function (group) {
    var tabs = $$("[data-tab]", group);
    function select(name) {
      tabs.forEach(function (tb) {
        var on = tb.getAttribute("data-tab") === name;
        tb.setAttribute("aria-selected", on ? "true" : "false");
        tb.tabIndex = on ? 0 : -1;
      });
      $$("[data-panel]", group).forEach(function (p) {
        p.hidden = p.getAttribute("data-panel") !== name;
      });
    }
    tabs.forEach(function (tb) {
      tb.addEventListener("click", function () { select(tb.getAttribute("data-tab")); });
      tb.addEventListener("keydown", function (e) {
        var i = tabs.indexOf(tb), n = tabs.length;
        if (e.key === "ArrowRight") { e.preventDefault(); tabs[(i + 1) % n].focus(); tabs[(i + 1) % n].click(); }
        if (e.key === "ArrowLeft") { e.preventDefault(); tabs[(i - 1 + n) % n].focus(); tabs[(i - 1 + n) % n].click(); }
      });
    });
    var initial = group.getAttribute("data-tabs") || (tabs[0] && tabs[0].getAttribute("data-tab"));
    if (initial) select(initial);
  });

  /* --- Esc closes any open overlay ------------------------------------- */
  doc.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (openMega) { closeMega(true); return; }
    if (dock && dock.getAttribute("data-open") === "true") { setDock(false); return; }
  });

  /* --- Cart preview on hover (28.09.2026, round 3) ----------------------
     Spec 40-strona-www/koncepcja/sklep-v7-spec.md §12.11. A panel under the
     header lists the lines of the shop cart (sessionStorage "cw_cart_items",
     written by sklep-wspolne.js) while the pointer rests on the cart icon or
     on the panel. Only with a fine pointer from 980 px and never on the cart
     page; a click on the icon still opens the cart. */
  (function () {
    var link = $("a.cw-cart"), panel = $("[data-cw-minicart]");
    if (!link || !panel || !window.matchMedia) return;
    /* Not on the cart page – found by its main element, because in the
       artifact viewer the address is not koszyk.html. */
    if ($("[data-ks]") || /(^|\/)koszyk\.html$/.test(location.pathname)) return;
    var mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 980px)");
    var tOpen = null, tClose = null;

    function items() {
      if (window.CWSklep) return window.CWSklep.items();
      try { var a = JSON.parse(sessionStorage.getItem("cw_cart_items") || "[]"); return Array.isArray(a) ? a : []; }
      catch (_) { return []; }
    }
    function fmt(n) {
      if (window.CWSklep) return window.CWSklep.fmt(n);
      var p = (Math.round(n * 100) / 100).toFixed(2).split(".");
      return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (p[1] === "00" ? "" : "," + p[1]) + " zł";
    }
    function plural(n, one, few, many) {
      if (n === 1) return one;
      var d = n % 10, t = n % 100;
      return (d >= 2 && d <= 4 && (t < 12 || t > 14)) ? few : many;
    }
    function esc(s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }
    /* Keeps ranges like "6,0–6,5" on one line. */
    function nowrap(html) { return html.replace(/(\S*\d–\d\S*)/g, '<span class="cw-nowrap">$1</span>'); }
    function render() {
      var list = items();
      if (!list.length) {
        panel.innerHTML = '<div class="cw-minicart__empty"><p>Twój koszyk jest pusty.</p>' +
          '<a class="wf-btn wf-btn--secondary wf-btn--sm" href="sklep.html">Przejdź do sklepu</a></div>';
        return;
      }
      var n = 0, sum = 0, rows = "";
      list.forEach(function (it) {
        n += it.qty; sum += it.price * it.qty;
        var href = (it.url || "sklep.html") + (it.pack ? "#" + it.pack : "");
        rows += '<li class="cw-minicart__item">' +
          '<a class="cw-minicart__thumb" href="' + esc(href) + '" tabindex="-1" aria-hidden="true">' +
            (it.img ? '<img src="' + esc(it.img) + '" alt="">' : "") + "</a>" +
          '<div class="cw-minicart__txt">' +
            '<a class="cw-minicart__name" href="' + esc(href) + '">' + nowrap(esc(it.name)) + "</a>" +
            '<span class="cw-minicart__pack">' + esc(it.packLabel) + "</span>" +
            '<span class="cw-minicart__qty">' + it.qty + " × " + fmt(it.price) + "</span>" +
          "</div>" +
          '<b class="cw-minicart__sum">' + fmt(it.price * it.qty) + "</b></li>";
      });
      panel.innerHTML =
        '<div class="cw-minicart__head"><p class="cw-minicart__title">W koszyku</p>' +
          '<div class="cw-minicart__nav" data-mc-nav hidden>' +
            '<button type="button" class="wf-btn wf-btn--ghost wf-btn--icon wf-btn--sm" data-mc-prev aria-label="Poprzednie pozycje"><svg class="wf-icon" aria-hidden="true"><use href="#ti-chevron-left"></use></svg></button>' +
            '<button type="button" class="wf-btn wf-btn--ghost wf-btn--icon wf-btn--sm" data-mc-next aria-label="Następne pozycje"><svg class="wf-icon" aria-hidden="true"><use href="#ti-chevron-right"></use></svg></button>' +
          "</div></div>" +
        '<ul class="cw-minicart__list" data-mc-list>' + rows + "</ul>" +
        '<div class="cw-minicart__bar">' +
          '<span class="cw-minicart__count">' + n + " " + plural(n, "opakowanie", "opakowania", "opakowań") + " w koszyku</span>" +
          '<span class="cw-minicart__total">Wartość produktów <b>' + fmt(sum) + "</b></span>" +
          '<a class="wf-btn wf-btn--secondary wf-btn--sm" href="koszyk.html">Koszyk</a>' +
          '<a class="wf-btn wf-btn--primary wf-btn--sm" href="checkout.html">Przejdź do kasy</a>' +
        "</div>";
      wireScroll();
    }
    /* Arrows only when the row overflows; each click moves by ~one view. */
    function wireScroll() {
      var ul = $("[data-mc-list]", panel), nav = $("[data-mc-nav]", panel);
      if (!ul || !nav) return;
      var prev = $("[data-mc-prev]", panel), next = $("[data-mc-next]", panel);
      function sync() {
        var over = ul.scrollWidth > ul.clientWidth + 2;
        nav.hidden = !over;
        prev.disabled = ul.scrollLeft <= 2;
        next.disabled = ul.scrollLeft + ul.clientWidth >= ul.scrollWidth - 2;
      }
      prev.addEventListener("click", function () { ul.scrollBy({ left: -ul.clientWidth * 0.9, behavior: "smooth" }); });
      next.addEventListener("click", function () { ul.scrollBy({ left: ul.clientWidth * 0.9, behavior: "smooth" }); });
      ul.addEventListener("scroll", sync, { passive: true });
      requestAnimationFrame(sync);
    }
    function isOpen() { return panel.getAttribute("data-open") === "true"; }
    function show() {
      clearTimeout(tClose);
      if (isOpen()) return;
      if (openMega) closeMega(false);
      render();
      panel.setAttribute("data-open", "true");
    }
    function hide() { clearTimeout(tOpen); panel.setAttribute("data-open", "false"); }
    function enter() {
      if (!mq.matches) return;
      clearTimeout(tClose);
      if (!isOpen()) { clearTimeout(tOpen); tOpen = setTimeout(show, 150); }
    }
    function leave() {
      clearTimeout(tOpen);
      if (isOpen()) { clearTimeout(tClose); tClose = setTimeout(hide, 250); }
    }
    link.addEventListener("mouseenter", enter);
    link.addEventListener("mouseleave", leave);
    panel.addEventListener("mouseenter", function () { clearTimeout(tClose); });
    panel.addEventListener("mouseleave", leave);
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && isOpen()) hide(); });
    $$("[data-mega-trigger]").forEach(function (t) { t.addEventListener("click", hide); });
    window.addEventListener("cw:cart", function () { if (isOpen()) { render(); } });
    if (mq.addEventListener) mq.addEventListener("change", function () { if (!mq.matches) hide(); });
  })();

  /* --- Cart badge (demo: sessionStorage count) ------------------------- */
  try {
    var n = parseInt(sessionStorage.getItem("cw_cart") || "0", 10) || 0;
    $$("[data-cart-count]").forEach(function (el) {
      el.textContent = String(n);
      el.hidden = n === 0;
    });
  } catch (_) {}
})();
