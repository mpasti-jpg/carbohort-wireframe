/* =====================================================================
   koszyk.js – cart page of the V7 shop (28.09.2026, round 3).
   Draws the line items, the summary (live shipping calculator, gross total
   with VAT) and the "Dorzuć do zamówienia" cards from the shared store
   (window.CWSklep in sklep-wspolne.js) and keeps them in step with every
   change: quantity, removal, undo, sample cart, quick view.
   Spec: 40-strona-www/koncepcja/sklep-v7-spec.md §7 and §12.10
   (data: §4 and §12.2).
   ===================================================================== */
(function () {
  "use strict";
  var S = window.CWSklep;
  var doc = document;
  var main = doc.querySelector("[data-ks]");
  if (!S || !main) return;

  var UNDO_MS = 6000;   /* lifetime of the "Cofnij" bar (spec §7) */
  var MAX = 99;         /* the store clamps quantities to 1–99 */
  var RECS = 4;         /* cards in "Dorzuć do zamówienia" (spec §12.10) */
  var NB = " ";    /* no-break space */

  /* ----- product configs --------------------------------------------------
     Source: data-cw-product of the cards in sklep.html (spec §4), with the
     round 3 fields of §12.2 – packs[].img, short (V5 card texts, §12.6) and
     variants for CARBOMAT ECO – and without "partner" in meta (§12.6, L20).
     Used by the suggestion cards and the sample cart; keep in step with
     sklep.html. Partner products have no CarboHort mock-ups. */
  var FRAKCJA_HINT = "drobniejsza na gleby lekkie i piaszczyste, grubsza na cięższe gliniaste";
  var ECO_VARIANTS = [
    { id: "carbomat-eco-4", label: "pH 4,5–5,0", sub: "odmiana kwaśna", url: "pdp-kwasny.html" },
    { id: "carbomat-eco-6", label: "pH 6,0–6,5", sub: "odmiana uniwersalna", url: "pdp.html" }
  ];
  var PRODUCTS = {
    "carbomat-eco-4": {
      id: "carbomat-eco-4", name: "CARBOMAT ECO pH 4,5–5,0", meta: "odmiana kwaśna · sypki · doglebowy",
      img: "img/opakowania/worek_20l.png", url: "pdp-kwasny.html",
      short: "Surowy lignit o niskim odczynie – pod borówkę, żurawinę, wrzosowate, różaneczniki i azalie. Zakładasz raz, pracuje kolejne sezony.",
      variants: ECO_VARIANTS,
      opts: [{ id: "frakcja", label: "Frakcja", hint: FRAKCJA_HINT, "default": "f4",
               values: [{ id: "f2", label: "0,1–2 mm" }, { id: "f4", label: "2–4 mm" }, { id: "f8", label: "4–8 mm" }] }],
      packs: [
        { id: "w20", label: "worek 20 l", short: "20 l", img: "img/opakowania/worek_20l.png", price: 43, ship: "parcel", kg: 12 },
        { id: "bb1000", label: "big bag 1000 l", short: "1000 l", img: "img/opakowania/worek_1000l_1500l.png", price: 600, ship: "pallet" },
        { id: "bb1500", label: "big bag 1500 l", short: "1500 l", img: "img/opakowania/worek_1000l_1500l.png", price: 800, ship: "pallet" }
      ]
    },
    "carbomat-eco-6": {
      id: "carbomat-eco-6", name: "CARBOMAT ECO pH 6,0–6,5", meta: "odmiana uniwersalna · sypki · doglebowy",
      img: "img/opakowania/worek_20l.png", url: "pdp.html",
      short: "Surowy lignit do wymieszania z glebą lub podłożem. Odczyn dla większości grup roślin – buduje strukturę i magazyn na wodę.",
      variants: ECO_VARIANTS,
      opts: [{ id: "frakcja", label: "Frakcja", hint: FRAKCJA_HINT, "default": "f4",
               values: [{ id: "f4", label: "2–4 mm" }, { id: "f8", label: "4–8 mm" }] }],
      packs: [
        { id: "w20", label: "worek 20 l", short: "20 l", img: "img/opakowania/worek_20l.png", price: 43, promo: 39, lowest30: 43, ship: "parcel", kg: 12 },
        { id: "bb1000", label: "big bag 1000 l", short: "1000 l", img: "img/opakowania/worek_1000l_1500l.png", price: 650, ship: "pallet" },
        { id: "bb1500", label: "big bag 1500 l", short: "1500 l", img: "img/opakowania/worek_1000l_1500l.png", price: 850, ship: "pallet" }
      ]
    },
    "carbomat-eco-sciolka": {
      id: "carbomat-eco-sciolka", name: "CARBOMAT ECO Ściółka pH 4,5–5,0", meta: "sypki · ściółka · frakcja 8–20 mm",
      img: "img/opakowania/worek_20l.png", url: "pdp.html",
      short: "Grubsza frakcja do rozsypania warstwą 3–5 cm, bez mieszania. W przeciwieństwie do kory nie powoduje głodu azotowego.",
      packs: [
        { id: "w20", label: "worek 20 l", short: "20 l", img: "img/opakowania/worek_20l.png", price: 43, ship: "parcel", kg: 12 },
        { id: "bb1000", label: "big bag 1000 l", short: "1000 l", img: "img/opakowania/worek_1000l_1500l.png", price: 600, ship: "pallet" },
        { id: "bb1500", label: "big bag 1500 l", short: "1500 l", img: "img/opakowania/worek_1000l_1500l.png", price: 800, ship: "pallet" }
      ]
    },
    "carbohumic-20mesh": {
      id: "carbohumic-20mesh", name: "CARBOHUMIC niefiltrowany (20 mesh)", meta: "płynny · doglebowy",
      img: "img/opakowania/kanister_20l.png", url: "pdp.html",
      short: "„Intensywna odbudowa gleby i budowanie trwałej próchnicy”. Podajesz polewaniem z beczki lub mauzera.",
      packs: [
        { id: "k20", label: "kanister 20 l", short: "20 l", img: "img/opakowania/kanister_20l.png", price: 170, ship: "parcel", kg: 22 },
        { id: "b200", label: "beczka 200 l", short: "200 l", img: "img/opakowania/beczka_200l.png", price: 1400, ship: "pallet" },
        { id: "m1000", label: "mauzer 1000 l", short: "1000 l", img: "img/opakowania/mauzer_1000l_1500l.png", price: 6000, ship: "pallet" }
      ]
    },
    "carbohumic-187mesh": {
      id: "carbohumic-187mesh", name: "CARBOHUMIC filtrowany (187 mesh)", meta: "płynny · doglebowy · przez dysze",
      img: "img/opakowania/kanister_5l.png", url: "pdp.html",
      short: "Przechodzi przez opryskiwacze, belki herbicydowe, zraszacze i linie kroplujące. Bieżąca biostymulacja gleby i roślin.",
      packs: [
        { id: "b1", label: "butelka 1 l", short: "1 l", img: "img/opakowania/butelka_1l.png", price: 25, ship: "parcel", kg: 1.2 },
        { id: "k5", label: "kanister 5 l", short: "5 l", img: "img/opakowania/kanister_5l.png", price: 80, ship: "parcel", kg: 5.8 },
        { id: "k20", label: "kanister 20 l", short: "20 l", img: "img/opakowania/kanister_20l.png", price: 260, ship: "parcel", kg: 22 },
        { id: "b200", label: "beczka 200 l", short: "200 l", img: "img/opakowania/beczka_200l.png", price: 2200, ship: "pallet" },
        { id: "m1000", label: "mauzer 1000 l", short: "1000 l", img: "img/opakowania/mauzer_1000l_1500l.png", price: 9200, ship: "pallet" }
      ]
    },
    "maxi-plus": {
      id: "maxi-plus", name: "CARBOHUMIC MAXI PLUS", meta: "płynny · dolistny",
      img: "img/opakowania/butelka_1l.png", url: "pdp.html",
      short: "Dolistna biostymulacja w fazie wzrostu – kwasy huminowe i fulwowe pracują na masę liściową. Program podstawowy to minimum trzy zabiegi.",
      packs: [
        { id: "b1", label: "butelka 1 l", short: "1 l", img: "img/opakowania/butelka_1l.png", price: 119, ship: "parcel", kg: 1.2 },
        { id: "k5", label: "kanister 5 l", short: "5 l", img: "img/opakowania/kanister_5l.png", price: 295, ship: "parcel", kg: 5.8 },
        { id: "k20", label: "kanister 20 l", short: "20 l", img: "img/opakowania/kanister_20l.png", price: 850, ship: "parcel", kg: 22 }
      ]
    },
    "calbor": {
      id: "calbor", name: "CARBOHUMIC CALBOR", meta: "płynny · dolistny · tylko sady",
      img: "img/opakowania/butelka_1l.png", url: "pdp.html",
      short: "Wapń i bor w chelacie kwasów humusowych – jakość, kaliber i trwałość owocu po zbiorze. Rejestracja obejmuje wyłącznie uprawy sadownicze.",
      packs: [
        { id: "b1", label: "butelka 1 l", short: "1 l", img: "img/opakowania/butelka_1l.png", price: 138, ship: "parcel", kg: 1.2 },
        { id: "k5", label: "kanister 5 l", short: "5 l", img: "img/opakowania/kanister_5l.png", price: 380, ship: "parcel", kg: 5.8 },
        { id: "k20", label: "kanister 20 l", short: "20 l", img: "img/opakowania/kanister_20l.png", price: 999, ship: "parcel", kg: 22 }
      ]
    },
    "pure-one": {
      id: "pure-one", name: "PURE ONE biostymulator mineralny", meta: "płynny · dolistny",
      url: "pdp.html",
      short: "Biostymulator mineralny zewnętrznego producenta, stosowany w zestawach z CARBOHUMIC MAXI PLUS. ⚠️ Kanon bez danych.",
      packs: [
        { id: "b1", label: "1 l", short: "1 l", price: 160, ship: "parcel", kg: 1.2 },
        { id: "k5", label: "5 l", short: "5 l", price: 800, ship: "parcel", kg: 6 }
      ]
    }
  };

  /* Pairs for "Dorzuć do zamówienia" (spec §12.10, from the canon and §6.9):
     for each product in the cart the first entry that is not in the cart
     yet and not suggested already. FIXED fills the rest ⚠️ – "najczęściej
     wybierane", to be named by CarboHort. */
  var PAIRS = {
    "carbomat-eco-6": ["carbohumic-20mesh", "maxi-plus"],
    "carbomat-eco-4": ["carbomat-eco-sciolka", "carbohumic-20mesh"],
    "carbomat-eco-sciolka": ["carbomat-eco-4"],
    "carbohumic-20mesh": ["maxi-plus"],        /* soil base + foliar (configurator) */
    "carbohumic-187mesh": ["maxi-plus"],
    "carbohumic-biomas": ["maxi-plus"],
    "carbohumic-sad": ["calbor"],              /* CALBOR: orchards only */
    "carbohumic-ogrod": ["carbomat-eco-6"],    /* shop sets */
    "carbohumic-flora": ["carbomat-eco-6"],
    "maxi-plus": ["pure-one"]                  /* 30-produkty/pure-one.md */
  };
  var FIXED = ["carbomat-eco-6", "carbohumic-187mesh", "maxi-plus", "carbomat-eco-sciolka"];

  /* Sample cart (spec §7): the artefact preview keeps its own session, so
     without this button a reviewer would only ever see the empty state. */
  var SAMPLE = [
    { id: "carbomat-eco-6", pack: "w20", qty: 3, opts: { frakcja: "f4" } },
    { id: "carbohumic-187mesh", pack: "k5", qty: 2 },
    { id: "carbomat-eco-4", pack: "bb1000", qty: 1 }
  ];

  /* ----- line helpers ---------------------------------------------------- */
  /* Mock-up per pack id (spec §12.2). New lines carry it in item.img; lines
     stored before round 3 carry the product mock-up (a big bag line showed
     the 20 l sack), so for those the pack id picks it. Lines without a
     CarboHort mock-up (partner products) keep the placeholder. */
  var MOCK = "img/opakowania/";
  var PACK_IMG = {
    w20: "worek_20l.png", bb1000: "worek_1000l_1500l.png", bb1500: "worek_1000l_1500l.png",
    t1: "torba_1l_2l.png", t2: "torba_1l_2l.png", b1: "butelka_1l.png",
    k5: "kanister_5l.png", k20: "kanister_20l.png", b200: "beczka_200l.png", m1000: "mauzer_1000l_1500l.png"
  };
  function thumbOf(it) {
    var src = it.img || "", fix = PACK_IMG[it.pack] ? MOCK + PACK_IMG[it.pack] : "";
    return fix && src.indexOf(MOCK) === 0 && src !== fix ? fix : src;
  }
  /* The product card reads the pack from the anchor (spec §6.3). */
  function hrefOf(it) {
    if (!it.url) return "sklep.html";
    return it.url.indexOf("#") < 0 && it.pack ? it.url + "#" + it.pack : it.url;
  }
  function lineName(it) { return it.name + ", " + it.packLabel; }
  function packsText(n) { return n + NB + S.plural(n, "opakowanie", "opakowania", "opakowań"); }
  function kgText(n) { return String(Math.round(n * 10) / 10).replace(".", ",") + NB + "kg"; }
  /* A line as a pack-like object, so the shared price helpers apply to it. */
  function priceOfLine(it) {
    var regular = typeof it.regular === "number" ? it.regular : it.price;
    var p = { price: regular };
    if (it.price < regular) { p.promo = it.price; p.lowest30 = it.lowest30; }
    return p;
  }
  function countOf(items) { return items.reduce(function (n, it) { return n + it.qty; }, 0); }
  function sums(items) {
    var products = items.reduce(function (s, it) { return s + it.price * it.qty; }, 0);
    var ship = S.shipping(items);
    return { products: products, ship: ship, total: products + ship.total };
  }
  function indexOfKey(items, key) {
    for (var i = 0; i < items.length; i++) { if (items[i].key === key) return i; }
    return -1;
  }
  function current(key) { var items = S.items(), i = indexOfKey(items, key); return i < 0 ? null : items[i]; }

  /* Line breaks only between parts: a pack label never splits inside
     "2–4 mm", a name never inside "6,0–6,5" or "(187 mesh)", a sum never
     inside "1 197 zł". */
  function nowrap(text) {
    var s = doc.createElement("span");
    s.className = "c5ks-nw";
    s.textContent = text;
    return s;
  }
  function setPack(node, label) {
    node.textContent = "";
    label.split(" · ").forEach(function (part, i) {
      if (i) node.appendChild(doc.createTextNode(" · "));
      node.appendChild(nowrap(part));
    });
  }
  function setName(node, name) {
    node.textContent = "";
    name.split(/(\([^)]*\)|\S*\d–\d\S*)/).forEach(function (part, i) {
      if (part) node.appendChild(i % 2 ? nowrap(part) : doc.createTextNode(part));
    });
  }

  /* ----- page elements --------------------------------------------------- */
  function q(sel) { return main.querySelector(sel); }
  var el = {
    grid: q("[data-ks-grid]"), itemsH: q("[data-ks-items-h]"), list: q("[data-ks-list]"),
    empty: q("[data-ks-empty]"), emptyH: q("[data-ks-empty-h]"), sample: q("[data-ks-sample]"),
    count: q("[data-ks-count]"), sum: q("[data-ks-sum]"), live: q("[data-ks-live]"),
    products: q("[data-ks-products]"), total: q("[data-ks-total]"),
    sumList: q("[data-ks-sumlist]"), go: q("[data-ks-go]"),
    parcels: q("[data-ks-parcels]"), parcelsCalc: q("[data-ks-parcels-calc]"),
    parcelsCost: q("[data-ks-parcels-cost]"), parcelsKg: q("[data-ks-parcels-kg]"),
    pallets: q("[data-ks-pallets]"), palletsCalc: q("[data-ks-pallets-calc]"), palletsCost: q("[data-ks-pallets-cost]"),
    more: q("[data-ks-more]"), moreH: q("[data-ks-more-h]"), moreLead: q("[data-ks-more-lead]"),
    moreList: q("[data-ks-more-list]"), moreNote: q("[data-ks-more-note]")
  };

  /* ----- announcements (one polite live region) -------------------------- */
  var sayTimer = 0;
  function say(msg, delay) {
    clearTimeout(sayTimer);
    sayTimer = setTimeout(function () {
      el.live.textContent = "";
      /* set after a beat, so a repeated message is read again; a newer
         message cancels this stage too */
      sayTimer = setTimeout(function () {
        el.live.textContent = typeof msg === "function" ? msg() : msg;
      }, 40);
    }, delay || 0);
  }
  function sumsText() {
    var s = sums(S.items());
    return "Produkty: " + S.fmt(s.products) + ", wysyłka: " + S.fmt(s.ship.total) +
      ", razem do zapłaty: " + S.fmt(s.total) + ".";
  }
  function sayQty(key) {
    say(function () {
      var it = current(key);
      return (it ? lineName(it) + ": " + packsText(it.qty) + ". " : "") + sumsText();
    }, 700);
  }

  /* ----- line rows -------------------------------------------------------
     Rows are kept per key and patched in place, in the store's order, so a
     click on the stepper never rebuilds the row under the focused button. */
  var rows = {};     /* key -> row refs */
  var undo = null;   /* { el, item, index, timer, left, since } */

  function buildRow(key) {
    var li = doc.createElement("li");
    li.className = "c5ks-item";
    li.innerHTML =
      '<a class="c5ks-item__img" tabindex="-1" aria-hidden="true" data-r-thumb></a>' +
      '<div class="c5ks-item__body">' +
        '<div class="c5ks-item__head">' +
          '<h3 class="c5ks-item__name"><a data-r-link></a></h3>' +
          '<button type="button" class="c5ks-item__rm" data-r-rm><svg class="wf-icon" aria-hidden="true"><use href="#ti-x"></use></svg></button>' +
        "</div>" +
        '<p class="c5ks-item__pack" data-r-pack></p>' +
        '<p class="c5ks-item__price"><span class="wf-sr-only">Cena za opakowanie: </span><span data-r-price></span> <span class="c5ks-item__vat" data-r-vat></span></p>' +
        '<p class="c5ks-item__low" data-r-low></p>' +
        '<div class="c5ks-item__foot">' +
          '<div class="cws-qty c5ks-item__qty" role="group" data-r-qty>' +
            '<button type="button" class="cws-qty__b" data-r-dec>−</button>' +
            '<input class="cws-qty__v" type="number" min="1" max="' + MAX + '" step="1" inputmode="numeric" data-r-val>' +
            '<button type="button" class="cws-qty__b" data-r-inc>+</button>' +
          "</div>" +
          '<p class="c5ks-item__sum"><span class="wf-sr-only">Wartość: </span><b data-r-sum></b></p>' +
        "</div>" +
      "</div>";
    var r = { key: key, li: li, sig: "" };
    ["thumb", "link", "rm", "pack", "price", "vat", "low", "qty", "dec", "val", "inc", "sum"].forEach(function (n) {
      r[n] = li.querySelector("[data-r-" + n + "]");
    });
    r.dec.addEventListener("click", function () { step(key, -1); });
    r.inc.addEventListener("click", function () { step(key, 1); });
    r.val.addEventListener("input", function () {
      var v = parseInt(r.val.value, 10);
      if (!isNaN(v) && v >= 1) { S.setQty(key, v); sayQty(key); }
    });
    /* on commit show the stored (clamped) value, also after an empty field */
    r.val.addEventListener("change", function () {
      var it = current(key);
      if (it) r.val.value = it.qty;
    });
    r.rm.addEventListener("click", function () { removeLine(key); });
    return r;
  }

  function fillRow(r, it) {
    var src = thumbOf(it);
    var sig = [it.name, it.packLabel, src, it.url, it.price, it.regular, it.lowest30, it.vat].join("|");
    if (sig !== r.sig) {   /* static parts: touched only when the line itself changes */
      r.sig = sig;
      var href = hrefOf(it), label = lineName(it), pp = priceOfLine(it);
      r.thumb.href = href;
      r.thumb.textContent = "";
      r.thumb.classList.toggle("wf-ph", !src);
      r.thumb.classList.toggle("wf-ph--cross", !src);
      if (src) {
        var img = doc.createElement("img");
        img.src = src; img.alt = ""; img.width = 160; img.height = 160; img.decoding = "async";
        r.thumb.appendChild(img);
      }
      r.link.href = href;
      setName(r.link, it.name);
      setPack(r.pack, it.packLabel);
      r.price.innerHTML = S.priceHTML(pp);
      r.vat.textContent = "brutto, VAT " + (typeof it.vat === "number" ? it.vat : S.TAX.rate) + "%";
      r.low.textContent = S.lowestText(pp);
      r.low.hidden = !r.low.textContent;
      r.rm.setAttribute("aria-label", "Usuń " + label);
      r.qty.setAttribute("aria-label", "Liczba opakowań – " + label);
      r.val.setAttribute("aria-label", "Liczba opakowań – " + label);
      r.dec.setAttribute("aria-label", "Mniej opakowań – " + label);
      r.inc.setAttribute("aria-label", "Więcej opakowań – " + label);
    }
    if (doc.activeElement !== r.val) r.val.value = it.qty;   /* never under the typing caret */
    r.dec.setAttribute("aria-disabled", it.qty <= 1 ? "true" : "false");
    r.inc.setAttribute("aria-disabled", it.qty >= MAX ? "true" : "false");
    r.sum.textContent = S.fmt(it.price * it.qty);
  }

  function step(key, d) {
    var it = current(key);
    if (!it) return;
    var n = Math.max(1, Math.min(MAX, it.qty + d));
    if (n === it.qty) return;
    S.setQty(key, n);
    sayQty(key);
  }

  /* ----- summary: shipping calculator, gross total, VAT (C2) ------------- */
  var goText = "";
  function fillSummary(items) {
    var s = sums(items), sh = s.ship, P = sh.params, tax = S.vatByRate(items, sh.total);
    el.products.textContent = S.fmt(s.products);
    el.parcels.hidden = sh.parcels === 0;
    el.parcelsCalc.textContent = sh.parcels + NB + S.plural(sh.parcels, "paczka", "paczki", "paczek") + " × " + S.fmt(P.parcelPrice);
    el.parcelsCost.textContent = S.fmt(sh.parcelCost);
    el.parcelsKg.textContent = sh.parcelKg.map(function (w, i) {
      return (i ? "paczka" : "Paczka") + NB + (i + 1) + ": " + kgText(w);
    }).join(" · ");
    el.pallets.hidden = sh.pallets === 0;
    el.palletsCalc.textContent = sh.pallets + NB + S.plural(sh.pallets, "paleta", "palety", "palet") + " × " + S.fmt(P.palletPrice);
    el.palletsCost.textContent = S.fmt(sh.palletCost);
    el.total.textContent = S.fmt(s.total);
    /* One row per VAT rate in the cart, then the net value (C2, rates per
       product – Mateusz 28.09: mostly 8%, some 23%). */
    var html = "";
    tax.rows.forEach(function (r) {
      html += '<div class="c5ks-sum__row c5ks-sum__row--tax"><dt>w tym VAT ' + r.rate + '% ⚠️:</dt> <dd>' + S.fmt(r.vat) + "</dd></div>";
    });
    html += '<div class="c5ks-sum__row c5ks-sum__row--tax"><dt>wartość netto:</dt> <dd>' + S.fmt(tax.net) + "</dd></div>";
    /* Rows go straight into the <dl> (one div level only), replacing the last ones. */
    Array.prototype.forEach.call(el.sumList.querySelectorAll(".c5ks-sum__row--tax"), function (n) { n.parentNode.removeChild(n); });
    el.sumList.insertAdjacentHTML("beforeend", html);
    var go = S.fmt(s.total);
    if (go !== goText) {   /* "Przejdź do kasy – 1 197 zł", the sum in one piece */
      goText = go;
      el.go.textContent = "Przejdź do kasy – ";
      el.go.appendChild(nowrap(go));
    }
  }
  /* Numbers in the shipping note come from CWSklep.SHIP, so they follow it. */
  function fillParams() {
    Array.prototype.forEach.call(main.querySelectorAll("[data-ks-p]"), function (n) {
      var k = n.getAttribute("data-ks-p"), v = S.SHIP[k];
      if (typeof v === "number") n.textContent = /Price$/.test(k) ? S.fmt(v) : String(v);
    });
  }

  /* Sticky summary (from 900 px): 24 px from the top; when it is taller than
     the window it sticks by its bottom edge instead, so the buttons stay in
     view while long item lists scroll by. */
  var wide = window.matchMedia ? window.matchMedia("(min-width: 900px)") : null;
  function stick() {
    if (!wide || !wide.matches || el.sum.hidden) { el.sum.style.removeProperty("--ks-sum-top"); return; }
    var gap = 24;
    el.sum.style.setProperty("--ks-sum-top", Math.min(gap, window.innerHeight - el.sum.offsetHeight - gap) + "px");
  }

  /* ----- render ---------------------------------------------------------- */
  function render(items) {
    var byKey = {};
    items.forEach(function (it) { byKey[it.key] = it; });
    Object.keys(rows).forEach(function (k) {
      if (!byKey[k]) { rows[k].li.remove(); delete rows[k]; }
    });
    var seq = [], seen = {};
    items.forEach(function (it) {
      if (seen[it.key]) return;
      seen[it.key] = true;
      var r = rows[it.key] || (rows[it.key] = buildRow(it.key));
      fillRow(r, it);
      seq.push(r.li);
    });
    if (undo) seq.splice(Math.min(undo.index, seq.length), 0, undo.el);   /* the bar keeps the line's slot */
    seq.forEach(function (li, i) {   /* move only what is out of place */
      if (el.list.children[i] !== li) el.list.insertBefore(li, el.list.children[i] || null);
    });

    var has = items.length > 0;
    el.grid.classList.toggle("is-empty", !has);
    el.itemsH.hidden = !has;
    el.list.hidden = !has && !undo;
    el.empty.hidden = has;
    el.sum.hidden = !has;
    el.count.hidden = !has;
    el.count.textContent = has ? packsText(countOf(items)) : "";
    if (has) fillSummary(items);
    stick();
    renderRecs(items);
  }

  /* ----- remove and undo ------------------------------------------------- */
  function removeLine(key) {
    var items = S.items(), i = indexOfKey(items, key);
    if (i < 0) return;
    var it = items[i], next = items[i + 1] || items[i - 1] || null;
    dropUndo();
    undo = makeUndo(it, i);
    S.remove(key);   /* → onChange → render: the bar takes the line's slot */
    resume(undo);
    (next && rows[next.key] ? rows[next.key].link : el.emptyH).focus();
    say("Usunięto z koszyka: " + lineName(it) + " × " + it.qty + ". Przycisk Cofnij przywraca pozycję. " + sumsText());
  }

  function makeUndo(it, index) {
    var li = doc.createElement("li");
    li.className = "c5ks-undo";
    li.innerHTML =
      '<p class="c5ks-undo__txt">Usunięto <b></b><span></span></p>' +
      '<button type="button" class="c5ks-undo__btn">Cofnij</button>' +
      '<span class="c5ks-undo__bar" aria-hidden="true"></span>';
    setName(li.querySelector("b"), it.name);
    var tail = li.querySelector(".c5ks-undo__txt span"), pack = doc.createElement("span");
    setPack(pack, it.packLabel);
    tail.appendChild(doc.createTextNode(", "));
    tail.appendChild(pack);
    tail.appendChild(doc.createTextNode(" "));
    tail.appendChild(nowrap("× " + it.qty + "."));
    li.querySelector(".c5ks-undo__bar").style.animationDuration = UNDO_MS + "ms";
    var btn = li.querySelector("button");
    btn.setAttribute("aria-label", "Cofnij usunięcie: " + lineName(it));
    btn.addEventListener("click", restoreLine);
    var u = { el: li, item: it, index: index, timer: 0, left: UNDO_MS, since: 0 };
    /* keyboard users get the time they need: the clock stops while focused */
    li.addEventListener("focusin", function () { pause(u); });
    li.addEventListener("focusout", function (e) { if (!li.contains(e.relatedTarget)) resume(u); });
    return u;
  }
  function pause(u) {
    if (undo !== u || !u.timer) return;
    clearTimeout(u.timer);
    u.timer = 0;
    u.left -= Date.now() - u.since;
    u.el.classList.add("is-paused");
  }
  function resume(u) {
    if (!u || undo !== u || u.timer) return;
    u.since = Date.now();
    u.el.classList.remove("is-paused");
    u.timer = setTimeout(function () {
      if (undo !== u) return;
      dropUndo();
      render(S.items());
    }, Math.max(0, u.left));
  }
  function dropUndo() {
    if (!undo) return;
    var u = undo;
    undo = null;
    clearTimeout(u.timer);
    u.el.remove();
  }
  /* "Cofnij": the store puts the line back at its old index (§12.2). */
  function restoreLine() {
    var u = undo;
    if (!u) return;
    dropUndo();
    S.restore(u.item, u.index);   /* → onChange → render */
    var r = rows[u.item.key];
    if (r) r.link.focus();
    say("Przywrócono: " + lineName(u.item) + " × " + u.item.qty + ". " + sumsText());
  }

  /* ----- "Dorzuć do zamówienia" (C3) --------------------------------------
     Up to RECS cards: for each product in the cart (cart order) the first
     pair not in the cart and not picked yet, then FIXED. Cards are kept per
     product id, so a card that stays keeps its node (and the focus). */
  var cards = {};           /* product id -> li */
  var recsPending = false;  /* cards to update once the quick view closes */
  var addedInDialog = false; /* the quick view changed the cart */

  function pickRecs(items) {
    var inCart = {}, ids = [], out = [];
    items.forEach(function (it) { if (!inCart[it.id]) { inCart[it.id] = true; ids.push(it.id); } });
    function take(id, fixed) {
      if (out.length >= RECS || inCart[id] || !PRODUCTS[id] || out.some(function (o) { return o.id === id; })) return false;
      out.push({ id: id, fixed: fixed });
      return true;
    }
    ids.forEach(function (id) { (PAIRS[id] || []).some(function (p) { return take(p, false); }); });
    FIXED.forEach(function (id) { take(id, true); });
    return out;
  }

  function buildCard(p) {
    var li = doc.createElement("li");
    li.className = "c5ks-rec";
    li.setAttribute("data-cw-product", JSON.stringify(p));   /* host of the shared quick view */
    var pack = S.minPack(p), low = S.lowestText(pack);
    li.innerHTML =
      '<a class="c5ks-rec__shot' + (p.img ? "" : " wf-ph wf-ph--cross") + '" tabindex="-1" aria-hidden="true">' +
        (p.img ? '<img alt="" loading="lazy" decoding="async">' : "") + "</a>" +
      '<div class="c5ks-rec__body">' +
        '<h3 class="c5ks-rec__name"><a></a></h3>' +
        '<p class="c5ks-rec__price">' + ((p.packs || []).length > 1 ? '<span class="c5ks-rec__from">od</span> ' : "") + S.priceHTML(pack) + "</p>" +
        (low ? '<p class="c5ks-rec__low"></p>' : "") +
        '<button type="button" class="cws-btn cws-btn--light c5ks-rec__add" data-cw-open aria-haspopup="dialog">Dodaj do koszyka<span class="wf-sr-only"></span></button>' +
      "</div>";
    li.querySelector(".c5ks-rec__shot").href = p.url;
    if (p.img) li.querySelector("img").src = p.img;
    var a = li.querySelector(".c5ks-rec__name a");
    a.href = p.url;
    setName(a, p.name);
    if (low) li.querySelector(".c5ks-rec__low").textContent = low;
    var b = li.querySelector(".c5ks-rec__add");
    b.setAttribute("data-cw-pack", pack.id);   /* the quick view opens on the "od" pack */
    b.querySelector(".wf-sr-only").textContent = " – " + p.name;
    return li;
  }

  function dialogOpen() {
    var d = doc.querySelector(".cws-dlg");
    return doc.documentElement.classList.contains("cws-lock") || !!(d && !d.hidden);
  }

  function renderRecs(items) {
    /* The quick view returns the focus to its opener on close: keep the cards
       as they are until it closes, then update (flushRecs). */
    if (dialogOpen()) { recsPending = true; return; }
    recsPending = false;
    var empty = items.length === 0, picks = pickRecs(items);
    el.moreH.textContent = empty ? "Najczęściej wybierane" : "Dorzuć do zamówienia";
    el.moreLead.hidden = empty;
    el.moreNote.hidden = !picks.some(function (p) { return p.fixed; });
    var focused = doc.activeElement, hadFocus = el.moreList.contains(focused);
    var want = {};
    picks.forEach(function (p) { want[p.id] = true; });
    Object.keys(cards).forEach(function (id) {
      if (!want[id]) { cards[id].remove(); delete cards[id]; }
    });
    picks.forEach(function (p, i) {
      var li = cards[p.id] || (cards[p.id] = buildCard(PRODUCTS[p.id]));
      if (el.moreList.children[i] !== li) el.moreList.insertBefore(li, el.moreList.children[i] || null);
    });
    el.more.hidden = picks.length === 0;
    if (hadFocus && doc.activeElement !== focused) {
      /* the card in focus went into the cart: the section heading takes over */
      if (el.moreList.contains(focused)) focused.focus();
      else (el.more.hidden ? main : el.moreH).focus();
    }
  }
  function flushRecs() {
    if (!recsPending || dialogOpen()) return;
    renderRecs(S.items());
    if (addedInDialog) { addedInDialog = false; say(sumsText()); }
  }
  if (window.MutationObserver) {   /* the quick view toggles html.cws-lock */
    new MutationObserver(flushRecs).observe(doc.documentElement, { attributes: true, attributeFilter: ["class"] });
  }
  doc.addEventListener("focusin", function () { if (recsPending) setTimeout(flushRecs, 0); });

  /* ----- sample cart button ---------------------------------------------- */
  el.sample.addEventListener("click", function () {
    dropUndo();
    SAMPLE.forEach(function (s) { S.add(PRODUCTS[s.id], s.pack, s.qty, s.opts); });
    var items = S.items();
    if (items[0] && rows[items[0].key]) rows[items[0].key].link.focus();
    say("Wczytano przykładowy koszyk: " + items.length + " " + S.plural(items.length, "pozycja", "pozycje", "pozycji") +
      ", " + packsText(countOf(items)) + ". " + sumsText());
  });

  /* Back from another page (bfcache): the cart may have changed there. A
     no-op write makes the store refresh the header badge and call render. */
  window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    var items = S.items();
    if (items.length) S.setQty(items[0].key, items[0].qty); else S.clear();
  });

  if (window.ResizeObserver) new ResizeObserver(stick).observe(el.sum);
  window.addEventListener("resize", stick);
  fillParams();
  S.onChange(function (items) {
    if (dialogOpen()) addedInDialog = true;
    render(items);
  });
  render(S.items());
})();
