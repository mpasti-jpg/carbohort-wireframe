/* ===== CE-99 · Shop search (registry: ce-rejestr.js) ========================
   Prefix: c5-find. Module of the shared layer, one IIFE, a no-op when its
   markup or the list bridge (window.CWShopList, set by the shop page script
   of CE-78) is absent. The shop page has no CX5 bus, so nothing here uses it.

   What it does
   - Suggestions while typing (from 2 characters): products of the shop that
     the query would leave on the list (pack shot, name, price "od", "Do
     koszyka" opening the quick view of sklep-wspolne.js) and category /
     filter values that match the words (a click switches that one filter on).
   - Enter or "Szukaj" reads the query and switches filters of the list on:
     the answer is the filtered list and the visible filter chips, never a
     sentence.

   How a query is read (hybrid, lexical first) – resolve() below
   1. The dictionary turns known phrases into values of the existing
      filters: product and line names, price ("do 50 zł", "od 20 do 80 zł"),
      promotion, plant groups, use, form, pH, pack size, needs ("susza",
      "bez torfu"). Every value is checked against the filter labels read
      from the page, so a phrase can never invent a filter.
   2. Typos: a word the dictionary left over and no card contains is
      compared with the catalogue words (product and line names, dictionary
      keywords); within 1 edit (2 from 7 letters) it is replaced and the
      query is read again ("carbohumc" → "carbohumic").
   3. Several values of one group found in one query are checked against
      the rest of the query: a value that would show nothing is dropped
      ("CARBOHUMIC do oprysku" keeps only the foliar line); two kinds of
      offer must both hold ("zestaw w promocji"), loosened to either one
      when no product has both. A value no product holds ("nowości") is
      never switched on: it is named ("Brak produktów: Nowość").
   Negation (1a below): a phrase after "nie", "bez", "oprócz", "poza",
      "żadnych" excludes its filter values (chip "Bez: Dolistne") or, when
      it has none, stays in the rest unread – never switched on.
   4. The rest is soft. With understood filters it never narrows the list:
      words found in cards only move those cards up, the others are shown
      as "Nie zrozumiano". Without any filter, words found in cards are the
      text search; only a query nothing matches gives an empty list.
      In production this rest goes to a language model with the shop
      catalogue, which returns filter JSON in the same shape – never text
      (see the HTML comment over the markup).

   Keyboard (combobox with a dialog popup): ArrowDown moves into the panel,
   ArrowUp/Down between rows, ArrowLeft/Right between a product and its
   "Do koszyka", Escape closes and returns to the field.

   Comments in English, never the em dash, and never the literal
   end-of-script tag. ===================================================== */
(function () {
  "use strict";
  var doc = document;
  var root = doc.querySelector("[data-find]");
  var L = window.CWShopList;
  if (!root || !L) return;

  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }

  var form    = $("[data-find-form]", root);
  var field   = $("[data-shop-search]", root);
  var panel   = $("[data-find-panel]", root);
  var secProd = $("[data-find-sec-prod]", root);
  var headProd = $("[data-find-head-prod]", root);
  var listProd = $("[data-find-list-prod]", root);
  var secCat  = $("[data-find-sec-cat]", root);
  var listCat = $("[data-find-list-cat]", root);
  var moreEl  = $("[data-find-more]", root);
  var moreT   = $("[data-find-more-t]", root);
  var noneEl  = $("[data-find-none]", root);
  var noneQ   = $("[data-find-q]", root);
  var noneWhy = $("[data-find-none-why]", root) || doc.createElement("p");
  var footEl  = $("[data-find-foot]", root);
  var applyBtn = $("[data-find-apply]", root);
  var nT      = $("[data-find-n-t]", root);
  var filtT   = $("[data-find-filters]", root);
  var status  = $("[data-find-status]", root);
  if (!form || !field || !panel) return;

  var SK = window.CWSklep || null;
  var reduceMq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var coarseMq = window.matchMedia ? window.matchMedia("(pointer: coarse)") : { matches: false };
  var PROD_MAX = 5, CAT_MAX = 6;

  /* ===== 1. Dictionary ====================================================
     Patterns run on folded text (lower case, no Polish letters, digits kept,
     "zł" → "zl"), in this order; a matched phrase is cut out, so a later rule
     never reads it twice. \w* stands for any Polish ending. Effects:
       f: { facet: [values] }  q: words for the text search  sort: sort key
     Facet values are the data-facet values of the filter column. Facts
     behind the needs rules: water retention – CARBOMAT ECO and CARBOHUMIC
     (30-produkty/carbomat-eco.md, carbohumic.md); peat-free substrate –
     CARBOMAT ECO and CARBOMAT Mata (carbomat-eco.md, carbomat-mata.md);
     acid soil – CARBOMAT HUMIC "podnosi odczyn zakwaszonej gleby" (card). */
  var CARBOMAT_ALL = ["carbomat-eco", "carbomat-eco-sciolka", "carbomat-humic", "carbomat-mata"];
  var DICT = [
    /* product and line names */
    /* phonetic spellings ("karbomat", "eko", "humik") resolve here, before the
       generic "carbomat" and "eko" (certificate) rules below can take them */
    ["(?:carbomat|karbomat) (?:eco|eko) sciolk\\w*|(?:eco|eko) sciolk\\w*", { f: { linia: ["carbomat-eco-sciolka"] } }],
    ["(?:carbomat|karbomat) mat\\w*|mat[aey] uprawow\\w*|(?:carbomat|karbomat) rekaw\\w*", { f: { linia: ["carbomat-mata"] } }],
    ["(?:carbomat|karbomat) humi[ck]\\w*", { f: { linia: ["carbomat-humic"] } }],
    ["(?:carbomat|karbomat) (?:eco|eko)", { f: { linia: ["carbomat-eco"] } }],
    ["carbohumic ogrod\\w*", { q: "carbohumic ogrod" }],
    ["carbohumic flora|flora", { q: "flora" }],
    ["carbohumic sad\\w*", { q: "carbohumic sad" }],
    ["carbohumic biomas\\w*|biomas\\w*", { q: "biomas" }],
    ["carbohumic maxi plus|maxi plus|maxiplus|maxi", { q: "maxi" }],
    ["carbohumic calbor\\w*|calbor\\w*|wapn|wapnia|wapniem|wapniow\\w*|kaliber\\w*", { q: "calbor" }],
    ["niefiltrowan\\w*|20 mesh", { q: "niefiltrowany" }],
    ["filtrowan\\w*|187 mesh", { q: "187" }],
    ["carbohumic\\w*|karbohumik\\w*|carbo humic", { f: { linia: ["carbohumic", "carbohumic-dolistny"] } }],
    ["carbomat\\w*|karbomat\\w*", { f: { linia: CARBOMAT_ALL } }],
    ["humic\\w*", { f: { linia: ["carbomat-humic"] } }],
    ["vinass\\w*|vinas\\w*|winas\\w*", { f: { linia: ["vinassa"] } }],
    ["pure one|pureone|pure", { f: { linia: ["pure-one"] } }],
    ["bio algeen|bioalgeen|algeen|s90", { f: { linia: ["bio-algeen"] } }],
    ["eco", { f: { linia: ["carbomat-eco"] } }],
    ["mata|maty|mate|rekaw\\w*", { f: { linia: ["carbomat-mata"] } }],
    ["sciolk\\w*|zamiast kory|kor[aeyz]|mulcz\\w*", { f: { linia: ["carbomat-eco-sciolka"] } }],
    /* price and pack size: see PRICE below, they run here */
    "@price",
    ["big bag\\w*|bigbag\\w*", { fn: function (o) { if (!has(o, "poj", "1000") && !has(o, "poj", "1500")) add(o, "poj", ["1000", "1500"]); } }],
    ["mauzer\\w*|ibc|paletopojemnik\\w*", { f: { poj: ["1000"] } }],
    ["beczk\\w*", { f: { poj: ["200"] } }],
    ["worek|work[aiu]|workach|workami", { fn: function (o) { if (!(o.f.poj || []).length) add(o, "poj", ["20"]); } }],
    ["duz\\w* opakowan\\w*|duz\\w* ilosc\\w*|hurt\\w*|na hektar\\w*|hektar\\w*", { f: { poj: ["200", "1000", "1500"] } }],
    ["mal\\w* opakowan\\w*|na probe|na sprobowanie", { f: { poj: ["1", "2", "5"] } }],
    /* offer and certificate */
    ["promocj\\w*|promo|przecen\\w*|obnizk\\w*|obnizon\\w*|wyprzedaz\\w*|okazj\\w*|rabat|rabatem|rabatu|taniej", { f: { oferta: ["promocja"] } }],
    ["zestaw\\w*|pakiet\\w*|komplet\\w*", { f: { oferta: ["zestaw"] } }],
    ["nowosc\\w*|nowe produkty|nowy produkt", { f: { oferta: ["nowosc"] } }],
    ["ekologiczn\\w*|certyfikat\\w*|eko|bio", { f: { cert: ["eko"] } }],
    /* plant groups (before pH: "kwaśna gleba" reads differently under borówka) */
    ["rododendr\\w*|rozanecznik\\w*|azali\\w*|wrzos\\w*|hortensj\\w*", { f: { uprawa: ["ozdobne"], ph: ["kwasny"] } }],
    ["borowk\\w*|borowek|jagod\\w*|malin\\w*|truskaw\\w*|porzecz\\w*|zurawin\\w*|aroni\\w*|agrest\\w*|jezyn\\w*", { f: { uprawa: ["jagodowe"] } }],
    ["sad|sadu|sadzie|sady|sadow|sadach|sadami|sadowni\\w*|jablo\\w*|jabl\\w*|grusz\\w*|wisn\\w*|czeresn\\w*|sliw\\w*|drzew\\w* owocow\\w*", { f: { uprawa: ["sad"] } }],
    ["warzywnik\\w*", { f: { uprawa: ["warzywa", "ogrod"] } }],
    ["warzyw\\w*|pomidor\\w*|ogork\\w*|papryk\\w*|marchew\\w*|marchw\\w*|salat\\w*|kapust\\w*|cebul\\w*|ziemniak\\w*", { f: { uprawa: ["warzywa"] } }],
    ["kukurydz\\w*|zboz\\w*|pszenic\\w*|jeczmie\\w*|jeczmi\\w*|zyto|zyta|owies|owsa|rzepak\\w*|burak\\w*|polow\\w*|rolnic\\w*|rolnik\\w*|uprawy towarowe|pole|pola|polu", { f: { uprawa: ["rolnicze"] } }],
    ["ogrod\\w*|dzialk\\w*|przydomow\\w*", { f: { uprawa: ["ogrod"] } }],
    ["kwiat\\w*|ozdobn\\w*|iglak\\w*|tuj\\w*|tui|rabata|rabate|rabatach|rabatce|rabatk\\w*|ziol\\w*|zywoplot\\w*|bylin\\w*|storczyk\\w*", { f: { uprawa: ["ozdobne"] } }],
    ["szkolk\\w*|szkolkar\\w*|zielen\\w* miejsk\\w*|zielen\\w* urzadzon\\w*|nasadzen\\w*|sadzonk\\w*|zadrzewien\\w*", { f: { uprawa: ["szkolka"] } }],
    ["szklarn\\w*|tunel\\w*|pod oslon\\w*|oslon\\w*|bezglebow\\w*|hydropon\\w*", { f: { uprawa: ["bezglebowe"] } }],
    /* places: house plants only when no plant was named ("pomidory na
       balkonie" stays with vegetables) */
    ["domow\\w*|w domu|doniczk\\w*|balkon\\w*|taras\\w*|parapet\\w*|pokojow\\w*",
      { fn: function (o) { if (!(o.f.uprawa || []).length) add(o, "uprawa", ["ozdobne"]); } }],
    /* pH: acid SOIL wants a product that raises pH (CARBOMAT HUMIC), unless
       the query names acid-loving plants – then the acid product. */
    ["kwasn\\w* podloz\\w*|podloz\\w* kwasn\\w*", { f: { ph: ["kwasny"] } }],
    ["(?:gleb\\w*|ziemi\\w*|ziemia|grunt\\w*) (?:jest |bardzo )*(?:kwasn\\w*|zakwaszon\\w*)|(?:kwasn\\w*|zakwaszon\\w*) (?:gleb\\w*|ziemi\\w*|ziemia|grunt\\w*)|odkwas\\w*|(?:podnie\\w*|podwyzsz\\w*) (?:ph|odczyn\\w*)|wapnow\\w*",
      { fn: function (o) { add(o, "ph", [has(o, "uprawa", "jagodowe") || has(o, "ph", "kwasny") ? "kwasny" : "podnosi"]); } }],
    ["kwasolubn\\w*|nisk\\w* ph|nisk\\w* odczyn\\w*|kwasn\\w* odczyn\\w*|odczyn\\w* kwasn\\w*|ph 4\\S*|kwasn\\w*", { f: { ph: ["kwasny"] } }],
    ["uniwersaln\\w*|neutraln\\w*|ph 6\\S*", { f: { ph: ["uniwersalny"] } }],
    ["zasadow\\w*|alkaliczn\\w*|ph 9\\S*|wysok\\w* ph", { f: { ph: ["podnosi"] } }],
    /* needs (before use: "zatrzymać wodę w glebie" must not end as "gleba") */
    ["susz\\w*|sucho\\w*|such[aeiy]\\w*|przesusz\\w*|przesych\\w*|zatrzym\\w* wod\\w*|trzyma\\w* wod\\w*|magazyn\\w* wod\\w*|retencj\\w*|wilgo\\w*|brak wody|malo wody|oszczedz\\w* wod\\w*",
      { f: { linia: ["carbomat-eco", "carbohumic"], zast: ["doglebowe"] } }],
    /* "torf" in any wording ("bez torfu", "nie z torfu", "zamiast torfu")
       asks for a peat-free substrate: keep = a negation never flips it */
    ["bez torfu|zamiast torfu|torf\\w*|peat free", { keep: true, f: { linia: ["carbomat-eco", "carbomat-mata"], zast: ["doglebowe", "podloze"] } }],
    ["podloz\\w*|substrat\\w*", { f: { linia: ["carbomat-eco", "carbomat-mata"], zast: ["doglebowe", "podloze"] } }],
    /* equipment and use */
    ["opryskiwacz\\w*|kroplow\\w*|kroplownik\\w*|linia kroplujac\\w*|linii kroplujacej|fertygac\\w*|dysz\\w*|zraszacz\\w*|belk\\w*|przez filtr\\w*", { f: { filtry: ["tak"] } }],
    ["oprysk\\w*|dolistn\\w*|nalistn\\w*|na lisc\\w*|przez lisc\\w*|lisci\\w*|lisc|listow\\w*", { f: { zast: ["dolistne"] } }],
    ["do gleby|do ziemi|doglebow\\w*|glebow\\w*|pod korzen\\w*|do podloza|podlew\\w*|konewk\\w*|gleb\\w*|ziemi[aeę]?", { f: { zast: ["doglebowe"] } }],
    /* form */
    ["plynn\\w*|w plynie|plyn|koncentrat\\w*|ciecz\\w*", { f: { postac: ["plynny"] } }],
    ["sypk\\w*|granul\\w*|proszk\\w*|proszek", { f: { postac: ["sypki"] } }],
    /* sort */
    ["najtansz\\w*|tani\\w*|tanio|niedrog\\w*|budzetow\\w*", { sort: "cena" }],
    ["alfabetycz\\w*|od a do z", { sort: "nazwa" }]
  ];
  var STOP = (
    "a i oraz lub albo czy w we z ze na do dla od po pod przy bez o u za nad przez to ten ta te tego tej " +
    "jest sa byc mi mnie moj moja moje moich mojego mojej moim nasz nasze naszych chce chcialbym chcialabym " +
    "szukam szukamy potrzebuje potrzebujemy potrzebne potrzebny potrzebna prosze poprosze polec polecisz " +
    "jaki jaka jakie jakis jakies jakiegos cos czegos cokolwiek ktory ktora ktore ktorych co ile jak gdzie " +
    "produkt produkty produktu produktow srodek srodka srodki preparat preparaty preparatu nawoz nawozy " +
    "nawozu nawozow rzecz roslina rosliny roslin roslinom roslinach uprawa uprawy upraw uprawie " +
    "najlepszy najlepsze najlepszego dobry dobre dobrego sklep sklepie kupic kupie kup zamowic mam mamy ma " +
    "sie by bym aby zeby tylko wszystkie wszystko cena cenie cenach ceny zl pln l litr litry litrow szt sztuk " +
    "bardzo troche duzo dobrze lepiej inne inny innych oferta oferty ofercie typu rodzaj rodzaju np nie tak " +
    "cos coś pomoc pomoze pomozcie dzialanie dzialajacy dzialajace"
  ).split(" ");
  var POJ = ["1", "2", "5", "20", "200", "1000", "1500"];

  function has(o, k, v) { return (o.f[k] || []).indexOf(v) !== -1; }
  function add(o, k, vs) {
    o.f[k] = o.f[k] || [];
    vs.forEach(function (v) { if (o.f[k].indexOf(v) === -1) o.f[k].push(v); });
  }
  function norm(raw) {
    var t = L.fold(raw || "").replace(/[\u2013\u2014]/g, "-");
    t = t.replace(/(\d)\s*-\s*(\d)/g, "$1 do $2")       /* "20-80 zł" → "20 do 80 zł" */
         .replace(/(\d),(\d)/g, "$1.$2")                /* "4,5" → "4.5" */
         .replace(/(\d)(zl|pln|l|litr)(?![a-z])/g, "$1 $2");
    t = t.replace(/[^a-z0-9.]+/g, " ").replace(/\.(?!\d)/g, " ");
    return " " + t.replace(/\s+/g, " ").trim() + " ";
  }
  var NUM = "(\\d+(?:\\.\\d+)?)", CUR = "(zl\\w*|pln|zlot\\w*)";
  var UNIT = /^ (?:l|litr\w*|ml|kg|g|ha|m2|mm|mesh|szt\w*)(?= )/;
  function cutPrice(o, t) {
    /* range "od 20 do 80 zł", "20 do 80 zł" */
    t = t.replace(new RegExp(" (?:od |miedzy |w cenie od |cena od )?" + NUM + "(?: " + CUR + ")? (?:do|a) " + NUM + " " + CUR + "(?= )", "g"),
      function (m, a, c1, b) { o.cenaOd = +a; o.cenaDo = +b; return " "; });
    /* upper bound "do 50 zł", "poniżej 100", "max 80 zł" */
    t = t.replace(new RegExp(" (do|ponizej|max\\w*|maks\\w*|najwyzej|nie drozej niz|nie drozsze niz|nie wiecej niz|mniej niz|tansze niz|taniej niz|w cenie do|cena do|za mniej niz|za) " + NUM + "(?: " + CUR + ")?(?= )", "g"),
      function (m, w, n, cur, off, str) {
        if (!cur && (UNIT.test(str.slice(off + m.length)) || w === "za")) return m;
        o.cenaDo = +n; return " ";
      });
    /* lower bound "od 20 zł", "powyżej 500" ("od" alone needs the currency) */
    t = t.replace(new RegExp(" (od|powyzej|wiecej niz|minimum|co najmniej|drozsze niz|drozej niz) " + NUM + "(?: " + CUR + ")?(?= )", "g"),
      function (m, w, n, cur, off, str) {
        if (!cur && (w === "od" || UNIT.test(str.slice(off + m.length)))) return m;
        o.cenaOd = +n; return " ";
      });
    /* a bare amount "50 zł" reads as the upper bound */
    t = t.replace(new RegExp(" " + NUM + " " + CUR + "(?= )", "g"), function (m, n) {
      if (o.cenaDo === null) o.cenaDo = +n;
      return " ";
    });
    /* pack sizes "20 l", "1000 l" – only sizes the shop sells */
    t = t.replace(new RegExp(" " + NUM + " (?:l|litr\\w*)(?= )", "g"), function (m, n) {
      if (POJ.indexOf(String(+n)) === -1) return m;
      add(o, "poj", [String(+n)]); return " ";
    });
    return t;
  }
  var RULES = DICT.map(function (r) {
    if (r === "@price") return r;
    return { re: new RegExp(" (?:" + r[0] + ")(?= )", "g"), fx: r[1] };
  });

  /* ===== 1a. Negation ======================================================
     A phrase right after "nie", "bez", "oprócz", "poza", "żadnych", "z
     wyjątkiem" (filler words like "do", "dla" may stand between) is read
     as an exclusion: its filter values go to `not` (the list hides cards
     that hold them), never to the filters switched on. A negation carries
     over "i" / "ani" / "lub" to the next phrase ("bez zestawów i promocji").
     A negated phrase that has no filter value (a product text rule, a sort,
     a word the dictionary does not know) is not read at all: it stays in
     the rest as "nie zrozumiano", which in production goes to the model
     with the whole query. Rules marked `keep` mean the same with or without
     a negation ("bez torfu"). */
  var NEG = "nie bez oprocz procz poza zadnych zadnej zadnego zaden zadne zadna wyjatkiem wylaczeniem wykluczajac omijajac".split(" ");
  var NEG_SKIP = "do na w we dla z ze o od po pod jest sa ma maja byc chce chcialbym chcialabym potrzebuje zawiera zawierajace zawierajacy zawierajacych interesuje interesuja mnie mi sie moze".split(" ");
  var NEG_AND = "i ani lub albo oraz czy".split(" ");
  var NEG_BREAK = "a ale lecz tylko natomiast jednak raczej".split(" ");
  NEG.concat(NEG_BREAK, NEG_SKIP).forEach(function (w) { if (STOP.indexOf(w) === -1) STOP.push(w); });
  /* filler between a negation and its phrase ("nie dla roślin domowych") */
  function skippable(w) {
    if (NEG.indexOf(w) !== -1 || NEG_AND.indexOf(w) !== -1 || NEG_BREAK.indexOf(w) !== -1) return false;
    return NEG_SKIP.indexOf(w) !== -1 || STOP.indexOf(w) !== -1;
  }
  function negatedAt(T, i, neg) {
    for (var j = i - 1; j >= 0; j--) {
      var w = T[j];
      if (NEG.indexOf(w) !== -1) return true;
      if (NEG_AND.indexOf(w) !== -1) {
        for (var k = j - 1; k >= 0; k--) { if (!skippable(T[k])) return !!neg[k]; }
        return false;
      }
      if (skippable(w)) continue;
      return false;
    }
    return false;
  }
  /* the negation word in front of token i, or "" */
  function negWordBefore(T, i) {
    for (var j = i - 1; j >= 0; j--) {
      if (NEG.indexOf(T[j]) !== -1) return T[j];
      if (!skippable(T[j])) return "";
    }
    return "";
  }
  function snapshot(f) { var c = {}; Object.keys(f).forEach(function (k) { c[k] = f[k].slice(); }); return c; }

  /* parse(raw) → { raw, f, not, cenaOd, cenaDo, q, sort, words, rest,
     negRest }. Every matched phrase leaves a marker token "~n" in the text,
     so the negation pass reads the phrases in the order they were typed;
     the effects then run in dictionary order, as before. `words` are the
     meaningful folded words of the query that are not negated (for
     highlighting and categories). */
  function parse(raw) {
    var o = { raw: (raw || "").trim(), f: {}, not: {}, cenaOd: null, cenaDo: null, q: "", sort: "", negRest: [] };
    var t = norm(raw), recs = [];
    var allWords = t.trim().split(" ").filter(function (w) { return w && STOP.indexOf(w) === -1; });
    RULES.forEach(function (r) {
      if (r === "@price") { t = cutPrice(o, t); return; }
      t = t.replace(r.re, function (m) {
        recs.push({ fx: r.fx, m: m.trim() });
        return " ~" + (recs.length - 1) + " ";
      });
      t = t.replace(/\s+/g, " ");
      if (t === "") t = " ";
      if (t.charAt(0) !== " ") t = " " + t;
      if (t.charAt(t.length - 1) !== " ") t += " ";
    });
    /* negation pass, left to right */
    var T = t.trim().split(" "), neg = [], negWords = [];
    T.forEach(function (w, i) {
      var mk = /^~(\d+)$/.exec(w);
      if (mk) {
        var rec = recs[+mk[1]];
        neg[i] = !rec.fx.keep && negatedAt(T, i, neg);
        rec.neg = neg[i];
      } else if (w && STOP.indexOf(w) === -1 && !/^\d/.test(w) && negatedAt(T, i, neg)) {
        neg[i] = true;
      }
    });
    T.forEach(function (w, i) {
      if (!neg[i] || /^~/.test(w)) return;
      /* a negated word nothing reads: keep it with its negation word */
      var nw = negWordBefore(T, i);
      if (nw) o.negRest.push(nw);
      o.negRest.push(w); negWords.push(w);
    });
    /* effects in dictionary order */
    recs.forEach(function (rec) {
      var fx = rec.fx;
      if (!rec.neg) {
        if (fx.f) Object.keys(fx.f).forEach(function (k) { add(o, k, fx.f[k]); });
        if (fx.q) o.q = (o.q ? o.q + " " : "") + fx.q;
        if (fx.sort) o.sort = fx.sort;
        if (fx.fn) fx.fn(o);
        return;
      }
      rec.m.split(" ").forEach(function (w) { negWords.push(w); });
      if (!fx.f && !fx.fn) {
        /* nothing to exclude by: the phrase goes to the rest, with "nie" */
        var nw2 = negWordBefore(T, T.indexOf("~" + recs.indexOf(rec)));
        if (nw2) o.negRest.push(nw2);
        rec.m.split(" ").forEach(function (w) { o.negRest.push(w); });
        return;
      }
      var was = snapshot(o.f);
      if (fx.f) Object.keys(fx.f).forEach(function (k) { add(o, k, fx.f[k]); });
      if (fx.fn) fx.fn(o);
      Object.keys(o.f).forEach(function (k) {
        o.f[k].forEach(function (v) {
          if ((was[k] || []).indexOf(v) !== -1) return;
          o.not[k] = o.not[k] || [];
          if (o.not[k].indexOf(v) === -1) o.not[k].push(v);
        });
      });
      o.f = was;
    });
    /* a value both asked for and excluded: the exclusion wins */
    Object.keys(o.not).forEach(function (k) {
      if (o.f[k]) o.f[k] = o.f[k].filter(function (v) { return o.not[k].indexOf(v) === -1; });
      if (o.f[k] && !o.f[k].length) delete o.f[k];
    });
    o.words = allWords.filter(function (w) { return negWords.indexOf(w) === -1; });
    /* What is left and is not a filler word or a negated word: resolve()
       decides. */
    o.rest = T.filter(function (w, i) {
      if (!w || /^~/.test(w) || neg[i]) return false;
      return w.length > 1 && STOP.indexOf(w) === -1 && !/^\d+(\.\d+)?$/.test(w) || /^\d{3,}$/.test(w);
    });
    o.text = t;
    return o;
  }

  /* ===== 1b. Typos ==========================================================
     Optimal string alignment distance (Damerau–Levenshtein with adjacent
     swaps), capped: anything above `max` returns max + 1. */
  function dist(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev2 = null, prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      var low = i;
      for (j = 1; j <= b.length; j++) {
        var c = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        var v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + c);
        if (prev2 && i > 1 && j > 1 && a.charAt(i - 1) === b.charAt(j - 2) && a.charAt(i - 2) === b.charAt(j - 1)) v = Math.min(v, prev2[j - 2] + 1);
        cur[j] = v;
        if (v < low) low = v;
      }
      if (low > max) return max + 1;
      prev2 = prev; prev = cur;
    }
    return prev[b.length];
  }
  /* Catalogue words: product and line names from the cards plus the
     keywords of the dictionary (whole words, as people type them). */
  var KEYWORDS = (
    "promocja promocje promocji przecena wyprzedaz zestaw zestawy pakiet nowosc ekologiczny certyfikat " +
    "borowka borowki borowke malina truskawka porzeczka sad jablon jablka grusza wisnia sliwa " +
    "warzywa warzywnik pomidory pomidor ogorki papryka marchew salata kapusta cebula ziemniaki " +
    "kukurydza zboza pszenica jeczmien rzepak buraki rolnicze ogrod ogrodu dzialka " +
    "domowe doniczkowe doniczka balkon taras parapet kwiaty pokojowe ozdobne iglaki tuje rabaty ziola zywoplot byliny storczyki " +
    "rododendron rozanecznik azalia wrzos hortensja szkolka sadzonki szklarnia tunel hydroponika " +
    "oprysk opryskiwacz dolistnie dolistny nalistny liscie gleba glebowy doglebowy podlewanie konewka kroplowanie fertygacja " +
    "plynny koncentrat sypki granulat proszek kwasna kwasny odczyn zasadowy uniwersalny " +
    "susza suszy wilgoc retencja woda podloze substrat torf torfu sciolka mulcz kora " +
    "mauzer beczka worek hektar tanie najtansze"
  ).split(" ");
  var vocab = null;
  function vocabulary() {
    if (vocab) return vocab;
    var seen = {};
    vocab = [];
    function put(w) { if (w.length >= 4 && !seen[w] && STOP.indexOf(w) === -1) { seen[w] = 1; vocab.push(w); } }
    L.order().forEach(function (c) { L.fold(L.name(c)).split(/[^a-z0-9]+/).forEach(put); });
    KEYWORDS.forEach(put);
    return vocab;
  }
  function inCatalogue(w) {
    return L.order().some(function (c) { return L.text(c).indexOf(w) !== -1; });
  }
  /* The closest catalogue word, or "" when none is near enough. */
  function correct(w) {
    if (w.length < 4 || /\d/.test(w) || inCatalogue(w)) return "";
    var max = w.length >= 7 ? 2 : 1, best = "", bd = max + 1;
    vocabulary().forEach(function (v) {
      var d = dist(w, v, max);
      if (d < bd || (d === bd && best && Math.abs(v.length - w.length) < Math.abs(best.length - w.length))) { bd = d; best = v; }
    });
    return bd <= max ? best : "";
  }
  /* While typing: the last, unfinished word that no card contains is read
     as the shortest catalogue word it starts ("pomid" → "pomidory"). */
  function complete(w) {
    if (w.length < 3 || /\d/.test(w) || inCatalogue(w)) return "";
    var best = "";
    vocabulary().forEach(function (v) { if (v.indexOf(w) === 0 && (!best || v.length < best.length)) best = v; });
    return best;
  }

  /* ===== 1c. Resolve ========================================================
     parse → typo fixes → pruning and AND → the soft rest. Returns the parse
     with `spec` (what the list bridge takes) and `fixes`, `boost`, `unknown`
     for the summary. Used by the suggestions and by Enter alike, so the
     panel always previews exactly what Enter switches on. */
  /* The words as the visitor typed them (Polish letters kept), for chips. */
  function asTyped(raw, ws) {
    var toks = String(raw || "").split(/\s+/).map(function (t) { return t.replace(/^[^\wąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+|[^\wąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/g, ""); }).filter(Boolean);
    return ws.filter(Boolean).map(function (w) {
      for (var i = 0; i < toks.length; i++) if (norm(toks[i]).trim() === w) return toks[i];
      return w;
    }).join(" ");
  }
  function anyIn(o) { return Object.keys(o || {}).some(function (k) { return o[k].length; }); }
  function hasFilters(p) {
    return anyIn(p.f) || anyIn(p.not) || p.cenaOd !== null || p.cenaDo !== null || !!p.q;
  }
  function countOf(spec) { return L.count(L.preview(spec, false)); }
  /* products of the whole shop with this one value */
  function shopCount(k, v) { var f = {}; f[k] = [v]; return L.count(L.preview({ facets: f }, true)); }
  function baseSpec(p) {
    return { raw: p.raw, facets: p.f, not: p.not || {}, all: p.all || [], cenaOd: p.cenaOd, cenaDo: p.cenaDo, q: p.q, sort: p.sort };
  }
  function resolve(raw, partial) {
    var p = parse(raw), fixes = [];
    /* the word still being typed (no space after it yet) */
    var toks = norm(raw).trim().split(" ");
    var last = partial && !/\s$/.test(raw) ? toks[toks.length - 1] : null;
    p.rest.forEach(function (w) {
      var c = correct(w);
      if (c) { fixes.push([w, c]); return; }
      if (w === last && (c = complete(w))) fixes.push([w, c, true]);
    });
    if (fixes.length) {
      /* read the corrected words again in their place in the query */
      var again = parse(norm(raw).split(" ").map(function (w) {
        for (var i = 0; i < fixes.length; i++) if (fixes[i][0] === w) return fixes[i][1];
        return w;
      }).join(" "));
      again.raw = p.raw;
      p = again;
    }
    p.fixes = fixes;
    /* A value no product of the shop holds is never switched on: it is
       named ("Brak produktów: Nowość"), so an empty list never comes from
       a filter the visitor could not see. An exclusion of such a value
       changes nothing and is dropped. */
    p.skipped = [];
    Object.keys(p.f).forEach(function (k) {
      p.f[k] = p.f[k].filter(function (v) {
        if (shopCount(k, v) > 0) return true;
        p.skipped.push({ k: k, v: v, label: (L.labels[k] && L.labels[k][v]) || v });
        return false;
      });
      if (!p.f[k].length) delete p.f[k];
    });
    Object.keys(p.not).forEach(function (k) {
      p.not[k] = p.not[k].filter(function (v) { return shopCount(k, v) > 0; });
      if (!p.not[k].length) delete p.not[k];
    });
    /* several values of one group: drop the ones that show nothing with
       the rest of the query, unless all of them do */
    Object.keys(p.f).forEach(function (k) {
      var vs = p.f[k];
      if (vs.length < 2) return;
      var live = vs.filter(function (v) {
        var f = {}; Object.keys(p.f).forEach(function (x) { f[x] = x === k ? [v] : p.f[x]; });
        return countOf({ facets: f, not: p.not, cenaOd: p.cenaOd, cenaDo: p.cenaDo, q: p.q }) > 0;
      });
      if (live.length) p.f[k] = live;
    });
    /* Kinds of offer named together must all hold ("zestaw w promocji").
       When no product has all of them, the condition is loosened to any
       of them and the chips say so ("luźniej: Zestaw lub Promocja"). */
    p.all = (p.f.oferta || []).length > 1 ? ["oferta"] : [];
    p.relaxed = "";
    if (p.all.length && countOf(baseSpec(p)) === 0) {
      var loose = baseSpec(p); loose.all = [];
      if (countOf(loose) > 0) {
        p.relaxed = p.f.oferta.map(function (v) { return L.labels.oferta[v] || v; }).join(" lub ");
        p.all = [];
      }
    }
    /* the soft rest */
    p.boost = []; p.unknown = []; p.qUnknown = false;
    /* negated words nothing could exclude by go to the rest as typed */
    var negRest = p.negRest || [];
    var rest = p.rest.filter(function (w) { return w.length > 1; });
    if (rest.length) {
      var found = rest.filter(inCatalogue), lost = rest.filter(function (w) { return found.indexOf(w) === -1; });
      if (hasFilters(p)) {
        p.boost = found; p.unknown = lost;
      } else if (found.length) {
        /* plain text search: every found word, or the one with most hits */
        var spec = baseSpec(p); spec.q = found.join(" ");
        if (found.length > 1 && countOf(spec) === 0) {
          found.sort(function (a, b) { return countOf({ q: b }) - countOf({ q: a }); });
          p.boost = found.slice(1); found = found.slice(0, 1);
        }
        p.q = found.join(" "); p.unknown = lost;
      } else if (!Object.keys(p.f).length && !p.sort) {
        /* nothing understood and nothing found: the empty list says so */
        p.q = lost.join(" "); p.qUnknown = true;
      } else {
        p.unknown = lost;
      }
    }
    if (negRest.length) p.unknown = negRest.concat(p.unknown);
    p.spec = baseSpec(p);
    p.spec.boost = p.boost; p.spec.unknown = p.unknown; p.spec.qUnknown = p.qUnknown;
    p.spec.skipped = p.skipped.map(function (x) { return x.label; });
    p.spec.relaxed = p.relaxed;
    p.spec.labels = { q: asTyped(raw, p.q.split(" ")), boost: asTyped(raw, p.boost), unknown: asTyped(raw, p.unknown) };
    p.shown = p.spec.labels;
    return p;
  }
  function isEmpty(p) {
    return !hasFilters(p) && !p.sort && !p.boost.length && !p.unknown.length && !p.skipped.length;
  }
  /* the query named only values no product holds ("nowości") */
  function onlySkipped(p) {
    return p.skipped.length && !hasFilters(p) && !p.sort && !p.boost.length && !p.unknown.length;
  }

  /* Human labels of a parsed query, in the order of the filter column. */
  function priceText(od, d) {
    if (od !== null && d !== null) return "Cena " + od + "–" + d + " zł";
    return od !== null ? "Cena od " + od + " zł" : "Cena do " + d + " zł";
  }
  function summary(p) {
    var out = [];
    L.keys.forEach(function (k) {
      (p.f[k] || []).forEach(function (v) { var lab = L.labels[k] && L.labels[k][v]; if (lab) out.push(lab); });
    });
    if (p.relaxed) out.push("luźniej: " + p.relaxed);
    L.keys.forEach(function (k) {
      ((p.not || {})[k] || []).forEach(function (v) { var lab = L.labels[k] && L.labels[k][v]; if (lab) out.push("bez: " + lab); });
    });
    if (p.cenaOd !== null || p.cenaDo !== null) out.push(priceText(p.cenaOd, p.cenaDo));
    var sh = p.shown || {};
    if (p.q) out.push((p.qUnknown ? "nie zrozumiano: „" + (sh.q || p.q) : "„" + p.q) + "”");
    if (p.sort === "cena") out.push("od najtańszych");
    if (p.boost && p.boost.length) out.push("najpierw: „" + (sh.boost || p.boost.join(" ")) + "”");
    if (p.unknown && p.unknown.length) out.push("nie zrozumiano: „" + (sh.unknown || p.unknown.join(" ")) + "”");
    if (p.skipped && p.skipped.length) out.push("brak produktów: " + p.skipped.map(function (x) { return x.label; }).join(", "));
    return out;
  }
  function fixText(p) {
    return (p.fixes || []).filter(function (x) { return !x[2]; }).map(function (x) { return "„" + x[1] + "” zamiast „" + x[0] + "”"; }).join(", ");
  }

  /* ===== 2. Suggestions panel ============================================== */
  function plural(n) { return L.plural(n); }
  function fmt(n) { return SK ? SK.fmt(n) : n + " zł"; }
  function priceLine(card) {
    var lo = parseFloat(card.getAttribute("data-cena")), hi = parseFloat(card.getAttribute("data-cena-max"));
    if (isNaN(lo)) { var q = $(".c5sk-card__val--quiet", card); return q ? q.textContent.trim() : ""; }
    return (!isNaN(hi) && hi !== lo ? "od " : "") + fmt(lo);
  }
  /* Marks the query words in the name. fold() keeps the length of Polish
     text (one letter in, one letter out), so indexes carry over. */
  function markName(el, text, words) {
    var f = L.fold(text), spans = [];
    if (f.length === text.length) {
      words.forEach(function (w) {
        if (w.length < 2) return;
        var stem = w.length > 4 ? w.slice(0, w.length - 2) : w;
        var i = f.indexOf(stem);
        if (i !== -1 && (i === 0 || /[^a-z0-9]/.test(f.charAt(i - 1)))) {
          var e = i + stem.length;
          while (e < f.length && /[a-z0-9]/.test(f.charAt(e))) e++;
          spans.push([i, e]);
        }
      });
    }
    spans.sort(function (a, b) { return a[0] - b[0]; });
    var at = 0;
    spans.forEach(function (s) {
      if (s[0] < at) return;
      if (s[0] > at) el.appendChild(doc.createTextNode(text.slice(at, s[0])));
      var m = doc.createElement("mark"); m.textContent = text.slice(s[0], s[1]); el.appendChild(m);
      at = s[1];
    });
    if (at < text.length) el.appendChild(doc.createTextNode(text.slice(at)));
  }
  function productRow(card, words) {
    var li = doc.createElement("li");
    li.className = "c5-find__item";
    li.setAttribute("data-find-row", "");
    var link = $(".c5sk-card__name a", card);
    var name = L.name(card);
    var a = doc.createElement("a");
    a.className = "c5-find__link";
    a.href = link ? link.getAttribute("href") : "pdp.html";
    a.setAttribute("data-find-nav", "");
    var th = doc.createElement("span");
    th.className = "c5-find__thumb";
    th.setAttribute("aria-hidden", "true");
    var shots = $$(".c5sk-card__shot img:not(.c5sk-card__alt)", card);
    if (!shots.length) th.className += " wf-ph wf-ph--cross";
    shots.forEach(function (im) {
      var img = doc.createElement("img");
      img.src = im.getAttribute("src"); img.alt = ""; img.decoding = "async";
      th.appendChild(img);
    });
    var tx = doc.createElement("span"); tx.className = "c5-find__txt";
    var nm = doc.createElement("span"); nm.className = "c5-find__name";
    markName(nm, name, words);
    var mt = doc.createElement("span"); mt.className = "c5-find__meta";
    var meta = $(".c5sk-card__meta", card); mt.textContent = meta ? meta.textContent.trim() : "";
    var pr = doc.createElement("span"); pr.className = "c5-find__price"; pr.textContent = priceLine(card);
    tx.appendChild(nm); tx.appendChild(mt); tx.appendChild(pr);
    a.appendChild(th); a.appendChild(tx);
    li.appendChild(a);
    /* "Do koszyka" opens the quick view of the shared shop layer
       (sklep-wspolne.js): the row is the [data-cw-product] host. */
    var json = card.getAttribute("data-cw-product");
    var p = null;
    try { p = JSON.parse(json || "null"); } catch (e) { p = null; }
    if (p && p.packs && p.packs.length) {
      li.setAttribute("data-cw-product", json);
      var b = doc.createElement("button");
      b.type = "button"; b.className = "c5-find__add";
      b.setAttribute("data-cw-open", ""); b.setAttribute("data-find-alt", ""); b.setAttribute("aria-haspopup", "dialog");
      b.innerHTML = '<svg class="wf-icon" aria-hidden="true"><use href="#ti-shopping-cart"></use></svg><span>Do koszyka</span>';
      b.setAttribute("aria-label", "Do koszyka – " + name);
      li.appendChild(b);
    } else {
      var q = doc.createElement("a");
      q.className = "c5-find__add c5-find__add--quiet"; q.href = "kontakt.html";
      q.setAttribute("data-find-alt", "");
      q.textContent = "Wycena";
      q.setAttribute("aria-label", "Poproś o wycenę – " + name);
      li.appendChild(q);
    }
    return li;
  }
  function catRow(c) {
    var li = doc.createElement("li");
    li.setAttribute("data-find-row", "");
    var b = doc.createElement("button");
    b.type = "button"; b.className = "c5-find__cat";
    b.setAttribute("data-find-nav", "");
    b.innerHTML = '<span class="c5-find__cat-t"><span class="c5-find__cat-g"></span><span class="c5-find__cat-v"></span></span><span class="c5-find__cat-n"></span>';
    $(".c5-find__cat-g", b).textContent = c.group;
    $(".c5-find__cat-v", b).textContent = c.label;
    $(".c5-find__cat-n", b).textContent = "(" + c.n + ")";
    b.setAttribute("aria-label", c.group + ": " + c.label + ", " + c.n + " " + plural(c.n) + " – włącz filtr");
    b.addEventListener("click", function () { pickCategory(c); });
    li.appendChild(b);
    return li;
  }

  /* Words that point at a category: a word of the label starts with the
     stem of a query word ("borówka" → "Jagodowe, w tym borówka"). */
  function stemOf(w) { return w.length > 4 ? w.slice(0, Math.max(4, w.length - 2)) : w; }
  function labelHit(label, words) {
    var lw = L.fold(label).split(/[^a-z0-9]+/);
    return words.some(function (w) {
      if (w.length < 3 || /^\d/.test(w)) return false;
      var s = stemOf(w);
      return lw.some(function (x) { return x.indexOf(s) === 0; });
    });
  }
  function categories(p) {
    var out = [], seen = {};
    function push(c) {
      var id = c.shelf ? "shelf:" + c.shelf : c.k + ":" + c.v;
      if (seen[id]) return;
      seen[id] = 1;
      if (!c.shelf && ((p.not || {})[c.k] || []).indexOf(c.v) !== -1) return;
      if (c.shelf ? L.shelf() === c.shelf : L.active(c.k, c.v)) return;
      c.n = c.shelf ? L.countShelf(c.shelf) : L.countAdding(c.k, c.v);
      if (c.n > 0) out.push(c);
    }
    /* 1. what the dictionary understood */
    L.keys.forEach(function (k) {
      (p.f[k] || []).forEach(function (v) {
        var lab = L.labels[k] && L.labels[k][v];
        if (lab) push({ k: k, v: v, label: lab, group: L.groups[k] });
      });
    });
    /* 2. groups of the "Wybierz uprawę lub potrzebę" row */
    Object.keys(L.shelves).forEach(function (slug) {
      if (slug && labelHit(L.shelves[slug].label, p.words)) push({ shelf: slug, label: L.shelves[slug].label, group: "Uprawa lub potrzeba" });
    });
    /* 3. any filter value whose label holds a query word */
    L.keys.forEach(function (k) {
      Object.keys(L.labels[k] || {}).forEach(function (v) {
        if (v === "nd") return;
        if (labelHit(L.labels[k][v], p.words)) push({ k: k, v: v, label: L.labels[k][v], group: L.groups[k] });
      });
    });
    return out.slice(0, CAT_MAX);
  }

  /* Product order in the panel: name starts with a query word, name holds
     a query word, then the current order of the grid. */
  function rankOf(card, words, boost) {
    var n = " " + L.fold(L.name(card)).replace(/[^a-z0-9]+/g, " ") + " ";
    var best = 3;
    if (boost && boost.some(function (w) { return L.text(card).indexOf(w) !== -1; })) best = 2;
    words.forEach(function (w) {
      if (w.length < 2) return;
      var s = stemOf(w);
      if (n.indexOf(" " + s) === 1) best = Math.min(best, 0);
      else if (n.indexOf(" " + s) !== -1) best = Math.min(best, 1);
    });
    return best;
  }

  var timer = null;
  function announce(t) {
    clearTimeout(timer);
    timer = setTimeout(function () { if (status) status.textContent = t; }, 450);
  }
  /* The panel ends above the bottom of what is visible: the on-screen
     keyboard (visualViewport) and the advisor's dock (CE-05) take the
     bottom of a phone screen. The apply row sticks to the bottom of the
     panel, so the main action stays in view while the lists scroll. */
  var vv = window.visualViewport || null;
  function sizePanel() {
    if (panel.hidden) return;
    var top = panel.getBoundingClientRect().top;
    var bottom = vv ? vv.offsetTop + vv.height : window.innerHeight;
    var dock = doc.querySelector("[data-jurek-dock]");
    if (dock) {
      var d = dock.getBoundingClientRect();
      if (d.height > 0 && d.top > top + 120 && d.top < bottom && window.getComputedStyle(dock).visibility !== "hidden") bottom = d.top;
    }
    panel.style.maxHeight = "min(40rem, " + Math.max(180, Math.floor(bottom - top - 8)) + "px)";
  }
  var sizeQueued = false;
  function queueSize() {
    if (sizeQueued || panel.hidden) return;
    sizeQueued = true;
    window.requestAnimationFrame(function () { sizeQueued = false; sizePanel(); });
  }
  window.addEventListener("scroll", queueSize, { passive: true });
  window.addEventListener("resize", queueSize);
  if (vv) { vv.addEventListener("resize", queueSize); vv.addEventListener("scroll", queueSize); }
  function openPanel() {
    if (!panel.hidden) return;
    panel.hidden = false;
    field.setAttribute("aria-expanded", "true");
  }
  var quiet = false;   /* focus handed back by the panel must not reopen it */
  function closePanel(backToField) {
    if (panel.hidden) return;
    panel.hidden = true;
    field.setAttribute("aria-expanded", "false");
    if (backToField) { quiet = true; field.focus(); quiet = false; }
  }

  var current = null;   /* parse of the text in the field */
  function render() {
    var raw = field.value.trim();
    if (L.fold(raw).length < 2) { closePanel(false); announce(""); current = null; return; }
    var p = current = resolve(field.value, true);
    var empty = isEmpty(p), bare = onlySkipped(p);
    var seq = L.order();
    var hits = [], all = 0;
    if (!empty && !bare) {
      var probe = L.preview(p.spec, false), wideProbe = L.preview(p.spec, true);
      hits = seq.filter(function (c) { return L.passes(c, probe); });
      all = seq.filter(function (c) { return L.passes(c, wideProbe); }).length;
      hits.sort(function (a, b) { return rankOf(a, p.words, p.boost) - rankOf(b, p.words, p.boost) || seq.indexOf(a) - seq.indexOf(b); });
    }
    listProd.textContent = "";
    hits.slice(0, PROD_MAX).forEach(function (c) { listProd.appendChild(productRow(c, p.words)); });
    headProd.textContent = hits.length > PROD_MAX ? "Produkty – " + PROD_MAX + " z " + hits.length : "Produkty";
    secProd.hidden = !hits.length;

    var cats = categories(p);
    listCat.textContent = "";
    cats.forEach(function (c) { listCat.appendChild(catRow(c)); });
    secCat.hidden = !cats.length;

    var extra = all - hits.length;
    moreEl.hidden = !(L.narrowed() && extra > 0);
    if (!moreEl.hidden) {
      moreT.textContent = hits.length
        ? "Poza Twoimi filtrami pasuje jeszcze " + extra + " " + plural(extra) + "."
        : "Przy Twoich filtrach nic nie pasuje, w całym sklepie – " + all + " " + plural(all) + ".";
    }
    noneEl.hidden = empty || (all > 0 && !bare);
    if (!noneEl.hidden) {
      noneQ.textContent = raw;
      noneWhy.textContent = bare ? "Teraz żaden produkt nie ma oznaczenia: " + p.skipped.map(function (x) { return x.label; }).join(", ") + "." : "";
      noneWhy.hidden = !bare;
    }

    /* Nothing to switch on (only values no product holds): no apply row. */
    footEl.hidden = empty || bare;
    if (!footEl.hidden) {
      /* An honest label when the filters together leave nothing: the list
         then shows them as chips to take off one by one. */
      nT.textContent = hits.length ? "Pokaż " + hits.length + " " + plural(hits.length)
        : p.qUnknown && !anyIn(p.f) && !anyIn(p.not) ? "Szukaj mimo to – 0 produktów"
        : "Razem nic nie pasuje – włącz i zdejmij jeden z filtrów";
      var sm = summary(p), fx = fixText(p);
      filtT.textContent = (fx ? "Czytamy " + fx + ". " : "") + (sm.length ? "Filtry: " + sm.join(" · ") : "");
    }
    if (empty && !cats.length) { closePanel(false); announce(""); return; }
    openPanel();
    sizePanel();
    announce(hits.length
      ? "Podpowiedzi: " + hits.length + " " + plural(hits.length) + (cats.length ? " i " + cats.length + " kategorii" : "") + ". Strzałka w dół przenosi do listy, Enter włącza filtry."
      : (cats.length ? "Podpowiedzi: " + cats.length + " kategorii." : "Brak produktów dla tego zapytania."));
  }

  /* ===== 3. Applying ======================================================= */
  function bringIntoView() {
    var r = root.getBoundingClientRect();
    /* the sticky work bar of the list covers the top of the window */
    var cover = parseFloat(window.getComputedStyle(root).scrollMarginTop) || 0;
    if (r.top < cover || r.top > window.innerHeight * 0.6) {
      root.scrollIntoView({ behavior: reduceMq.matches ? "auto" : "smooth", block: "start" });
    }
  }
  function settle() {
    closePanel(false);
    bringIntoView();
    /* On touch screens the keyboard would cover the result. */
    if (coarseMq.matches) field.blur();
  }
  function run(wide) {
    var raw = field.value.trim();
    /* same reading as the panel, so Enter switches on what it previewed */
    var p = resolve(field.value, true);
    var sm = summary(p);
    if (onlySkipped(p)) {
      /* nothing to switch on: the panel says why and stays open */
      render();
      announce("Brak produktów: " + p.skipped.map(function (x) { return x.label; }).join(", ") + ". Nic nie włączono.");
      return;
    }
    L.run(p.spec, !!wide);
    announce(sm.length ? "Włączone filtry: " + sm.join(", ") + "." : "Wyszukiwanie wyczyszczone.");
    settle();
  }
  function pickCategory(c) {
    field.value = "";
    /* the category replaces the filters of the previous query, as Enter does */
    L.dropQuery();
    if (c.shelf) L.setShelf(c.shelf); else L.addFilter(c.k, c.v);
    announce("Włączony filtr: " + c.label + ".");
    closePanel(true);
    bringIntoView();
    typeSync();
  }

  function inScope(el) {
    return !!el && (root.contains(el) || !!(el.closest && el.closest(".cws-dlg, [data-jurek-dock]")));
  }
  function rows() {
    return $$("[data-find-row]", panel).filter(function (r) {
      return !r.hidden && r.getClientRects().length && $("[data-find-nav]", r);
    });
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); run(false); });
  field.addEventListener("input", function () { typeSync(); render(); });
  /* On a narrow screen the field goes to the top of the window (under the
     sticky work bar), so the suggestions get the screen between the field
     and the keyboard. */
  var narrowMq = window.matchMedia ? window.matchMedia("(max-width: 899px)") : { matches: false };
  function lift() {
    if (!narrowMq.matches || quiet) return;
    var r = root.getBoundingClientRect();
    var cover = parseFloat(window.getComputedStyle(root).scrollMarginTop) || 0;
    if (Math.abs(r.top - cover) > 24) {
      window.scrollTo({ top: window.pageYOffset + r.top - cover, behavior: reduceMq.matches ? "auto" : "smooth" });
    }
  }
  field.addEventListener("focus", function () {
    lift();
    typeSync();
    if (!quiet && panel.hidden && L.fold(field.value.trim()).length >= 2) {
      var tag = L.tag();
      if (!tag || tag.raw !== field.value.trim()) render();
    }
  });
  field.addEventListener("blur", typeSync);
  field.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") {
      if (panel.hidden) render();
      var first = panel.hidden ? null : rows()[0];
      if (first) { e.preventDefault(); $("[data-find-nav]", first).focus(); }
    } else if (e.key === "Escape") {
      if (!panel.hidden) { e.preventDefault(); closePanel(false); }
    }
  });
  /* The clear button of the search field also takes the query filters off. */
  field.addEventListener("search", function () { if (!field.value && L.tag()) run(false); });
  panel.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { e.preventDefault(); closePanel(true); return; }
    var row = e.target.closest ? e.target.closest("[data-find-row]") : null;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      var rs = rows();
      var j = rs.indexOf(row) + (e.key === "ArrowDown" ? 1 : -1);
      e.preventDefault();
      if (j < 0) { field.focus(); return; }
      $("[data-find-nav]", rs[Math.min(j, rs.length - 1)]).focus();
    } else if (e.key === "ArrowRight" && row && e.target.hasAttribute("data-find-nav")) {
      var alt = $("[data-find-alt]", row); if (alt) { e.preventDefault(); alt.focus(); }
    } else if (e.key === "ArrowLeft" && row && e.target.hasAttribute("data-find-alt")) {
      var nav = $("[data-find-nav]", row); if (nav) { e.preventDefault(); nav.focus(); }
    }
  });
  if (applyBtn) applyBtn.addEventListener("click", function () { run(false); });
  var wideBtn = $("[data-find-wide]", root);
  if (wideBtn) wideBtn.addEventListener("click", function () { run(true); });
  /* Clicks on the empty parts of the panel keep the focus where it was. */
  panel.addEventListener("mousedown", function (e) { if (!e.target.closest("a,button,input")) e.preventDefault(); });
  /* The panel closes when focus or a click leaves it – but not for the
     quick view it opened, nor for the assistant's dock. */
  doc.addEventListener("pointerdown", function (e) { if (!panel.hidden && !inScope(e.target)) closePanel(false); });
  root.addEventListener("focusout", function (e) {
    if (inScope(e.relatedTarget)) return;
    setTimeout(function () {
      if (!doc.hasFocus() || inScope(doc.activeElement)) return;
      closePanel(false);
    }, 0);
  });

  /* ===== 4. Animated placeholder ===========================================
     Example queries in the language of needs, typed and deleted letter by
     letter with a blinking caret. It stops on focus and whenever the field
     holds text; with reduced motion the static native placeholder stays. */
  var PHRASES = [
    "promocje do 50 zł dla roślin domowych",
    "CARBOHUMIC do oprysku",
    "podłoże bez torfu",
    "coś na suszę",
    "sypkie do gleby kwaśnej",
    "big bag pod borówkę"
  ];
  var PREFIX = "Np. ";
  var phEl = $("[data-find-ph]", root), phTxt = $("[data-find-ph-t]", root);
  var tw = { i: 0, n: 0, dir: 1, timer: null, on: false };
  function tick() {
    var w = PHRASES[tw.i], delay;
    if (tw.dir > 0) {
      tw.n++;
      if (tw.n >= w.length) { tw.dir = -1; delay = 1800; } else delay = 55 + Math.round(Math.random() * 45);
    } else {
      tw.n--;
      if (tw.n <= 0) { tw.n = 0; tw.dir = 1; tw.i = (tw.i + 1) % PHRASES.length; delay = 450; } else delay = 22;
    }
    phTxt.textContent = PREFIX + w.slice(0, tw.n);
    tw.timer = setTimeout(tick, delay);
  }
  function typeSync() {
    if (!phEl || !phTxt) return;
    var want = !reduceMq.matches && !field.value && doc.activeElement !== field && !doc.hidden;
    if (want === tw.on) return;
    tw.on = want;
    root.classList.toggle("is-typing", want);
    phEl.hidden = !want;
    clearTimeout(tw.timer);
    if (want) {
      phTxt.textContent = PREFIX + PHRASES[tw.i].slice(0, tw.n);
      tw.timer = setTimeout(tick, 400);
    }
  }
  doc.addEventListener("visibilitychange", typeSync);
  if (reduceMq.addEventListener) reduceMq.addEventListener("change", typeSync);

  /* The list re-renders after every change (chips, filters, history): the
     field may have been emptied there, so the placeholder follows. */
  L.onChange(typeSync);
  typeSync();

  /* For tests and for the production endpoint contract. */
  window.CWShopSearch = { parse: function (raw) {
    var p = resolve(raw, false);
    return { facets: p.f, not: p.not, skipped: p.skipped.map(function (x) { return x.label; }), relaxed: p.relaxed, all: p.all, cenaOd: p.cenaOd, cenaDo: p.cenaDo, q: p.q, sort: p.sort, boost: p.boost, unknown: p.unknown, fixes: p.fixes, labels: summary(p) };
  } };
})();
