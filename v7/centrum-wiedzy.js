/* ===== Centrum wiedzy – mechaniki strony działu i strony kategorii =========
   Two modules, both guarded: no markup -> no-op, so one file serves
   centrum-wiedzy.html and centrum-wiedzy-kategoria.html.
     57 · CE-57 indeks artykułów – chip filters, sorting, search, paging by 10
          (never infinite loading – decision of 10.08), result counter, empty
          state and `?kat=` / `?strona=` kept in the address bar.
     50 · CE-50 formularz demonstracyjny – submit shows the mock-up notice.
   The bus (CX5) comes from ce/00-base.js and starts itself; this file only
   registers into it and never defines CX5. ================================ */

/* ===== 57 · Indeks artykułów ==============================================
   One module drives every control on the page: the chips in the hero of the
   category page and the chips above the list are the same `[data-cw-filter]`
   buttons, the hero search field and the field above the list are the same
   `[data-cw-search]` inputs. Sorting and filtering work on `data-*` written
   into each row, so the module never reads the copy itself. Rows marked
   `data-cw-pin` (an article announced but not published yet) stay at the end
   of the list whatever the sorting. ====================================== */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$;
  var root = $("[data-cw-index]");
  if (!root) return;

  var NA_STRONE = 10;
  var list = $("[data-cw-list]", root);
  var items = $$(".cw-k-list__item", list);
  var chips = $$("[data-cw-filter]");
  var sortSel = $("[data-cw-sort]", root);
  var searchIn = $$("[data-cw-search]");
  var pager = $("[data-cw-pager]", root);
  var pagerNums = pager ? $("[data-cw-nums]", pager) : null;
  var pagerPrev = pager ? $('[data-cw-page="prev"]', pager) : null;
  var pagerNext = pager ? $('[data-cw-page="next"]', pager) : null;
  var countEl = $("[data-cw-count]", root);
  var emptyEl = $("[data-cw-empty]", root);
  var clearBtn = $("[data-cw-clear]", root);

  var stan = { kat: "", sort: "nowe", q: "", strona: 1 };

  /* lowercase without diacritics – „Próchnica” has to match a typed „prochnica” */
  function fold(s) {
    return String(s || "").toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/ł/g, "l");
  }

  function pasuje(li) {
    if (stan.kat && li.getAttribute("data-kat") !== stan.kat) return false;
    if (stan.q && (li.getAttribute("data-search") || "").indexOf(stan.q) < 0) return false;
    return true;
  }

  function porownaj(a, b) {
    var pa = a.hasAttribute("data-cw-pin"), pb = b.hasAttribute("data-cw-pin");
    if (pa !== pb) return pa ? 1 : -1;                     /* zapowiedzi zawsze na końcu */
    if (pa && pb) return 0;
    var da = a.getAttribute("data-date") || "", db = b.getAttribute("data-date") || "";
    if (stan.sort === "stare") return da < db ? -1 : da > db ? 1 : 0;
    if (stan.sort === "az") {
      return String(a.getAttribute("data-title")).localeCompare(String(b.getAttribute("data-title")), "pl");
    }
    return da > db ? -1 : da < db ? 1 : 0;                  /* „nowe” = domyślne */
  }

  function slowo(n) {
    if (n === 1) return "artykuł";
    var d = n % 10, s = n % 100;
    return (d >= 2 && d <= 4 && (s < 12 || s > 14)) ? "artykuły" : "artykułów";
  }

  function adres() {
    if (!window.history || !window.history.replaceState) return;
    var p = [];
    if (stan.kat) p.push("kat=" + encodeURIComponent(stan.kat));
    if (stan.strona > 1) p.push("strona=" + stan.strona);
    var url = window.location.pathname + (p.length ? "?" + p.join("&") : "") + window.location.hash;
    try { window.history.replaceState(null, "", url); } catch (e) { /* ignored */ }
  }

  function rysujPager(stron) {
    if (!pager) return;
    if (pagerPrev) pagerPrev.disabled = stan.strona <= 1;
    if (pagerNext) pagerNext.disabled = stan.strona >= stron;
    if (!pagerNums) return;
    pagerNums.textContent = "";
    for (var i = 1; i <= stron; i++) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cw-k-pager__num";
      b.textContent = String(i);
      b.setAttribute("data-cw-page", String(i));
      b.setAttribute("aria-label", "Strona " + i);
      if (i === stan.strona) { b.setAttribute("aria-current", "page"); b.disabled = stron === 1; }
      pagerNums.appendChild(b);
    }
  }

  function zastosuj() {
    var pasujace = items.filter(pasuje);
    pasujace.sort(porownaj);
    /* jedno przeliczenie kolejności w DOM – 13 wierszy, więc bez wirtualizacji */
    pasujace.forEach(function (li) { list.appendChild(li); });
    items.forEach(function (li) { if (pasujace.indexOf(li) < 0) list.appendChild(li); });

    var stron = Math.max(1, Math.ceil(pasujace.length / NA_STRONE));
    if (stan.strona > stron) stan.strona = stron;
    if (stan.strona < 1) stan.strona = 1;
    var od = (stan.strona - 1) * NA_STRONE;
    var doo = od + NA_STRONE;

    items.forEach(function (li) { li.hidden = true; });
    pasujace.slice(od, doo).forEach(function (li) { li.hidden = false; });

    if (countEl) {
      countEl.textContent = pasujace.length
        ? "Pokazujemy " + (od + 1) + "–" + Math.min(doo, pasujace.length) + " z " + pasujace.length + " " + slowo(pasujace.length)
        : "Brak wyników";
    }
    if (emptyEl) emptyEl.hidden = pasujace.length > 0;
    if (pager) pager.hidden = pasujace.length === 0;
    rysujPager(stron);

    chips.forEach(function (c) {
      c.setAttribute("aria-pressed", (c.getAttribute("data-cw-filter") || "") === stan.kat ? "true" : "false");
    });
    adres();
  }

  function doListy() {
    var cel = document.getElementById("artykuly");
    if (!cel) return;
    CX5.scrollTo(cel.getBoundingClientRect().top + window.scrollY,
                 CX5.reducedMQ.matches ? "auto" : "smooth");
  }

  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      stan.kat = c.getAttribute("data-cw-filter") || "";
      stan.strona = 1;
      zastosuj();
      if (!root.contains(c)) doListy();          /* chip z hero kategorii */
    });
  });

  if (sortSel) {
    sortSel.addEventListener("change", function () {
      stan.sort = sortSel.value;
      stan.strona = 1;
      zastosuj();
    });
  }

  searchIn.forEach(function (input) {
    input.addEventListener("input", function () {
      stan.q = fold(input.value);
      stan.strona = 1;
      searchIn.forEach(function (o) { if (o !== input) o.value = input.value; });
      zastosuj();
    });
    /* Enter i przycisk lupy przewijają do listy; samo pisanie filtruje w miejscu,
       żeby strona nie uciekała spod palca przy każdym znaku. */
    input.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      e.preventDefault();
      doListy();
    });
  });
  $$("[data-cw-go]").forEach(function (b) {
    b.addEventListener("click", function () { doListy(); });
  });

  if (pager) {
    pager.addEventListener("click", function (e) {
      var b = e.target && e.target.closest ? e.target.closest("[data-cw-page]") : null;
      if (!b || b.disabled) return;
      var v = b.getAttribute("data-cw-page");
      var stron = Math.max(1, Math.ceil(items.filter(pasuje).length / NA_STRONE));
      if (v === "prev") stan.strona = Math.max(1, stan.strona - 1);
      else if (v === "next") stan.strona = Math.min(stron, stan.strona + 1);
      else stan.strona = parseInt(v, 10) || 1;
      zastosuj();
      doListy();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      stan.kat = ""; stan.q = ""; stan.strona = 1;
      searchIn.forEach(function (o) { o.value = ""; });
      zastosuj();
    });
  }

  /* wejście z adresu: ?kat=<slug> ustawia filtr, ?strona=N otwiera stronę listy */
  (function zAdresu() {
    var q = window.location.search || "";
    var mk = /[?&]kat=([^&]*)/.exec(q);
    var ms = /[?&]strona=(\d+)/.exec(q);
    if (mk) {
      var kat = decodeURIComponent(mk[1].replace(/\+/g, " "));
      if (items.some(function (li) { return li.getAttribute("data-kat") === kat; })) stan.kat = kat;
    }
    if (ms) stan.strona = Math.max(1, parseInt(ms[1], 10) || 1);
  })();

  zastosuj();
})();

/* ===== 50 · Formularz demonstracyjny =======================================
   Makieta nic nie wysyła – po „wyślij” pokazujemy notę role="status".
   Ta sama mechanika co na Próchnicy+ (prochnica-plus.js 75). ============== */
(function () {
  "use strict";
  CX5.$$("form[data-demo-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = CX5.$("[data-demo-msg]", form);
      if (msg) msg.hidden = false;
    });
  });
})();
