/* ===== artykul.js · Szablon artykułu Centrum wiedzy (V7) ===================
   Page modules of `artykul.html`. They register on the shared CX5 bus
   (ce/00-base.js), which starts itself – this file never defines CX5 and
   never calls CX5.start().

   Four small things, and nothing else moves on this page (no Lenis, no dots,
   no reveal – it is a page for reading, decision of 13.07):
     60  reading progress bar + table of contents scrollspy (CE-60),
     60b table of contents as an accordion below 1100 px,
     08  „Udostępnij" (copy the address) and „Drukuj" (CE-08 wariant artykul),
     50  the demo form of „Zaproponuj temat" (CE-50 wariant temat).
   Every block no-ops when its markup is absent; without JS the article stays
   complete: the list of contents is a set of plain anchors, the FAQ answers
   are open and the progress bar simply stays at zero.      ================ */

/* ===== 60 · Pasek postępu + scrollspy spisu treści (CE-60) ================= */
(function () {
  "use strict";
  var doc = document, $ = CX5.$, $$ = CX5.$$;
  var art = $("[data-artykul]");
  var pas = $("[data-progress]");
  var belka = $("[data-progress-bar]");
  var linki = $$(".cw-a-toc__link");
  if (!art && !linki.length) return;

  /* --- pasek postępu: procent przewiniętego artykułu ----------------------- */
  var ostatni = -1;
  function postep() {
    if (!art || !pas || !belka) return;
    var r = art.getBoundingClientRect();
    var tor = r.height - window.innerHeight;
    var ile;
    if (tor > 0) ile = CX5.clamp(-r.top / tor, 0, 1);
    else ile = r.bottom <= window.innerHeight ? 1 : 0;
    /* przed artykułem pasek stoi na zerze, za nim na setce */
    if (r.top > 0) ile = 0;
    var proc = Math.round(ile * 100);
    if (proc === ostatni) return;
    ostatni = proc;
    belka.style.width = proc + "%";
    pas.setAttribute("aria-valuenow", String(proc));
  }

  /* --- scrollspy: aktywna pozycja spisu ------------------------------------
     Position of the scroll, not IntersectionObserver: the entries are short
     and long (one myth is a single paragraph, another five), and a threshold
     observer would leave the list empty between two of them. The active entry
     is the last heading whose top edge is above a line a third down the
     screen. */
  var cele = [];
  function zbierzCele() {
    cele = linki.map(function (a) {
      var id = (a.getAttribute("href") || "").slice(1);
      var el = id ? doc.getElementById(id) : null;
      return el ? { link: a, el: el } : null;
    }).filter(Boolean);
  }
  zbierzCele();
  var aktywny = null;
  function spy() {
    if (!cele.length) return;
    var linia = window.innerHeight * 0.34;
    var wybor = cele[0];
    for (var i = 0; i < cele.length; i++) {
      if (cele[i].el.getBoundingClientRect().top <= linia) wybor = cele[i];
    }
    /* na samym dole strony podświetlamy ostatnią pozycję */
    if (window.innerHeight + window.scrollY >= doc.documentElement.scrollHeight - 2) wybor = cele[cele.length - 1];
    if (wybor === aktywny) return;
    if (aktywny) aktywny.link.removeAttribute("aria-current");
    aktywny = wybor;
    aktywny.link.setAttribute("aria-current", "true");
  }

  CX5.register({ scroll: function () { postep(); spy(); }, resize: zbierzCele });
})();

/* ===== 60b · Spis treści jako akordeon poniżej 1100 px ====================
   One `details` serves both layouts. From 1100 px it stands open in the
   sticky column (CSS switches its summary off); below that the reader opens
   it. Without JS it stays open everywhere – the contents must never be
   unreachable. ========================================================== */
(function () {
  "use strict";
  var spis = document.getElementById("spis");
  if (!spis || !spis.tagName || spis.tagName.toLowerCase() !== "details") return;
  var szeroki = window.matchMedia("(min-width: 1100px)");
  function sync() { spis.open = szeroki.matches; }
  sync();
  if (szeroki.addEventListener) szeroki.addEventListener("change", sync);
})();

/* ===== 08 · „Udostępnij" i „Drukuj" (CE-08 wariant artykul) ================
   Share copies the address of the article to the clipboard and says so in the
   `role="status"` note next to the button that was pressed (the header row
   and the sticky column each have their own). The Clipboard API needs a
   secure context and a permission, so there is a plain textarea fallback and,
   if even that fails, the address itself in the message. ================= */
(function () {
  "use strict";
  var $$ = CX5.$$;
  var przyciski = $$("[data-share]");
  var druk = $$("[data-print]");
  if (!przyciski.length && !druk.length) return;

  function komunikat(btn, tekst) {
    var grupa = btn.closest(".cw-a-head__in") || btn.closest(".cw-a-sidemeta") || document;
    var el = grupa.querySelector("[data-share-msg]");
    if (!el) return;
    el.textContent = tekst;
    el.hidden = false;
  }
  function zapasowo(adres) {
    var pole = document.createElement("textarea");
    pole.value = adres;
    pole.setAttribute("readonly", "");
    pole.style.cssText = "position:fixed;top:0;left:-9999px;opacity:0;";
    document.body.appendChild(pole);
    pole.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(pole);
    return ok;
  }
  przyciski.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var adres = window.location.href;
      var udalo = function () { komunikat(btn, "Adres artykułu skopiowany do schowka."); };
      var nie = function () {
        komunikat(btn, zapasowo(adres) ? "Adres artykułu skopiowany do schowka." : "Adres artykułu: " + adres);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try { navigator.clipboard.writeText(adres).then(udalo, nie); return; } catch (e) { /* stary silnik */ }
      }
      nie();
    });
  });
  druk.forEach(function (btn) {
    btn.addEventListener("click", function () { window.print(); });
  });
})();

/* ===== 50 · Formularz demonstracyjny (CE-50 wariant temat) =================
   Nothing leaves the browser; submitting shows the `[data-demo-msg]` note.
   Same behaviour as the base version on prochnica-plus.html#zadaj-pytanie. */
(function () {
  "use strict";
  var $ = CX5.$, $$ = CX5.$$;
  $$("form[data-demo-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = $("[data-demo-msg]", form);
      if (msg) msg.hidden = false;
    });
  });
})();
