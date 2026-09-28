/* =====================================================================
   sklep-wspolne.js – shared shop layer of V7 (28.09.2026, round 3).

   One place for the cart store (sessionStorage of this origin), the
   header cart badge, the quick view dialog (product summary, variant,
   pack size, options, quantity) and the shipping estimate. Used by
   sklep.html, pdp.html, pdp-kwasny.html and koszyk.html; content pages
   can adopt the dialog later.
   Spec: 40-strona-www/koncepcja/sklep-v7-spec.md §3 and §12.2.

   Product config lives on an element, as JSON in data-cw-product:
     { "id": "carbomat-eco-6", "name": "CARBOMAT ECO pH 6,0–6,5",
       "meta": "sypki · doglebowy", "img": "img/opakowania/worek_20l.png",
       "url": "pdp.html", "short": "One or two sentences for the quick view.",
       "variants": [ { "id": "carbomat-eco-4", "label": "pH 4,5–5,0",
                       "sub": "odmiana kwaśna", "url": "pdp-kwasny.html" }, … ],
       "packs": [ { "id": "w20", "label": "worek 20 l", "short": "20 l",
                    "img": "img/opakowania/worek_20l.png",
                    "price": 43, "promo": 39, "lowest30": 43,
                    "ship": "parcel", "kg": 12 }, … ] }
   Optional "opts" – extra choices that do not change the price, e.g.
     "opts": [ { "id": "frakcja", "label": "Frakcja", "hint": "…",
                 "values": [ { "id": "f4", "label": "2–4 mm" }, … ],
                 "default": "f4" } ]
   Optional "imgs" – two mock-ups shown side by side (sets); optional
   "packsLabel" – legend of the pack choice ("Rozmiar zestawu" for sets),
   "qtyLabel" – label of the quantity stepper ("Liczba zestawów").
   price    – regular gross price of one pack,
   promo    – promotional price (optional),
   lowest30 – lowest price in the 30 days before the reduction; required
              whenever promo is set (art. 6a of the Polish act on price
              information),
   ship     – "parcel" or "pallet"; kg – rough weight of one parcel pack,
   vat      – VAT rate in % of this product or pack (optional; TAX.rate
              otherwise – rates differ per product: mostly 8%, some 23%),
   img      – mock-up of this very pack (falls back to the product img).
   variants – versions of the same product (today: pH). The quick view
              switches in place when the other version has a host on the
              page, otherwise the option is a link to its url#pack.

   Any element with data-cw-open inside a [data-cw-product] host opens the
   quick view; data-cw-pack on it preselects a pack. Public API: window.CWSklep.
   Every cart change also fires a "cw:cart" event on window (detail.items),
   which the header cart preview in cw.js listens to.
   ===================================================================== */
(function () {
  "use strict";
  var doc = document;
  var KEY = "cw_cart_items";   /* line items, JSON */
  var LEGACY = "cw_cart";      /* item counter that cw.js reads on page load */
  var memory = [];             /* fallback when sessionStorage is blocked */
  var listeners = [];

  /* Shipping parameters – illustrative (spec §3.4). 10 zł per parcel is the
     current carbohort.com rate with prepayment (checked 28.09.2026; big bags
     and IBCs are excluded from it there). The pallet price is the placeholder
     from the B2B admin mock-up and waits for CarboHort's courier terms. */
  var SHIP = { parcelPrice: 10, parcelMaxKg: 30, palletPrice: 300, days: 7 };

  /* VAT – rates differ per product (Mateusz 28.09: mostly 8%, some 23%), so
     every product or pack may carry its own "vat"; without it the default
     rate applies. The rates are illustrative – CarboHort confirms them per
     product (the carbohort.com shop states none). Prices are gross. */
  var TAX = { rate: 8, rates: [8, 23] };

  /* ----- helpers ------------------------------------------------------ */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function plural(n, one, few, many) {
    if (n === 1) return one;
    var d = n % 10, t = n % 100;
    return (d >= 2 && d <= 4 && (t < 12 || t > 14)) ? few : many;
  }
  /* "43 zł", "38,70 zł", "9 200 zł" – thousands grouped from four digits,
     the same rule as the calculators in c5.js. */
  function fmt(n) {
    var parts = (Math.round(n * 100) / 100).toFixed(2).split(".");
    var whole = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (parts[1] === "00" ? whole : whole + "," + parts[1]) + " zł";
  }
  function round2(n) { return Math.round(n * 100) / 100; }
  function hasPromo(pack) { return !!pack && typeof pack.promo === "number" && pack.promo < pack.price; }
  function priceOf(pack) { return hasPromo(pack) ? pack.promo : pack.price; }
  function pct(pack) { return hasPromo(pack) ? Math.round((1 - pack.promo / pack.price) * 100) : 0; }
  /* Price markup shared by the list, the product card and the dialog. */
  function priceHTML(pack) {
    if (!pack || typeof pack.price !== "number") return '<span class="cws-price"><b class="cws-price__now">cena do potwierdzenia</b></span>';
    if (!hasPromo(pack)) return '<span class="cws-price"><b class="cws-price__now">' + fmt(pack.price) + "</b></span>";
    return '<span class="cws-price"><b class="cws-price__now">' + fmt(pack.promo) + "</b> " +
      '<s class="cws-price__old"><span class="wf-sr-only">cena regularna </span>' + fmt(pack.price) + "</s> " +
      '<span class="cws-price__pct">−' + pct(pack) + "%</span></span>";
  }
  function lowestText(pack) {
    return hasPromo(pack) && typeof pack.lowest30 === "number"
      ? "Najniższa cena z 30 dni przed obniżką: " + fmt(pack.lowest30) : "";
  }
  /* Pack with the lowest effective price – the "od … zł" of lists. */
  function minPack(product) {
    var best = null;
    ((product && product.packs) || []).forEach(function (k) {
      if (typeof k.price !== "number") return;
      if (!best || priceOf(k) < priceOf(best)) best = k;
    });
    return best;
  }
  /* Gross amount split into net and VAT at the given rate (TAX.rate by default). */
  function vatSplit(gross, rate) {
    var r = typeof rate === "number" ? rate : TAX.rate;
    var vat = round2(gross * r / (100 + r));
    return { net: round2(gross - vat), vat: vat, rate: r };
  }
  function rateOf(product, pack) {
    if (pack && typeof pack.vat === "number") return pack.vat;
    if (product && typeof product.vat === "number") return product.vat;
    return TAX.rate;
  }
  /* VAT of a cart per rate. Shipping has no rate of its own: it goes with the
     goods, split across the rates in proportion to their gross value (usual
     treatment of delivery charged by the seller ⚠️ to confirm by CarboHort).
     Returns [{ rate, gross, vat, net }] sorted by rate, plus the totals. */
  function vatByRate(items, extra) {
    var by = {}, goods = 0;
    (items || []).forEach(function (it) {
      var r = typeof it.vat === "number" ? it.vat : TAX.rate, g = it.price * it.qty;
      by[r] = (by[r] || 0) + g; goods += g;
    });
    extra = extra || 0;
    var rates = Object.keys(by).map(Number).sort(function (a, b) { return a - b; });
    if (!rates.length && extra) { by[TAX.rate] = 0; rates = [TAX.rate]; }
    var rows = rates.map(function (r) {
      var g = by[r] + (goods ? extra * by[r] / goods : extra);
      var sp = vatSplit(g, r);
      return { rate: r, gross: round2(g), vat: sp.vat, net: sp.net };
    });
    return {
      rows: rows,
      vat: round2(rows.reduce(function (s, x) { return s + x.vat; }, 0)),
      net: round2(rows.reduce(function (s, x) { return s + x.net; }, 0)),
      gross: round2(goods + extra)
    };
  }
  function parse(host) {
    if (!host) return null;
    try { return JSON.parse(host.getAttribute("data-cw-product")); } catch (e) { return null; }
  }
  /* Config of a product that has a host on this page, or null. */
  function find(id) {
    var hosts = doc.querySelectorAll("[data-cw-product]");
    for (var i = 0; i < hosts.length; i++) {
      var p = parse(hosts[i]);
      if (p && p.id === id) return p;
    }
    return null;
  }

  /* ----- store -------------------------------------------------------- */
  function load() {
    var raw;
    try { raw = sessionStorage.getItem(KEY); } catch (e) { return memory.slice(); }
    if (raw === null) return [];
    try { var a = JSON.parse(raw); return Array.isArray(a) ? a : []; } catch (e) { return []; }
  }
  function countOf(items) { return items.reduce(function (n, it) { return n + (it.qty || 0); }, 0); }
  function totalOf(items) { return items.reduce(function (s, it) { return s + it.price * it.qty; }, 0); }
  function persist(items) {
    memory = items.slice();
    try {
      sessionStorage.setItem(KEY, JSON.stringify(items));
      sessionStorage.setItem(LEGACY, String(countOf(items)));
    } catch (e) { /* storage blocked – the in-memory copy serves this page */ }
    syncBadge(items);
    listeners.forEach(function (fn) { try { fn(items.slice()); } catch (e) { /* a listener error stays local */ } });
    try { window.dispatchEvent(new CustomEvent("cw:cart", { detail: { items: items.slice() } })); } catch (e) { /* old engines */ }
  }
  function clampQty(q) { q = parseInt(q, 10); return isNaN(q) ? 1 : Math.max(1, Math.min(99, q)); }

  /* chosen = { groupId: valueId } for product.opts; each choice becomes part
     of the line key and of the pack label ("worek 20 l · frakcja 2–4 mm"). */
  function optSuffix(product, chosen) {
    var key = "", label = "";
    (product.opts || []).forEach(function (g) {
      var id = (chosen && chosen[g.id]) || g.default || (g.values[0] && g.values[0].id);
      var v = g.values.filter(function (x) { return x.id === id; })[0];
      if (!v) return;
      key += "|" + g.id + ":" + v.id;
      label += " · " + g.label.toLowerCase() + " " + v.label;
    });
    return { key: key, label: label };
  }
  function add(product, packId, qty, chosen) {
    var pack = (product.packs || []).filter(function (k) { return k.id === packId; })[0];
    if (!pack || typeof pack.price !== "number") return null;
    var suf = optSuffix(product, chosen);
    var items = load(), key = product.id + "|" + pack.id + suf.key, hit = null;
    items.forEach(function (it) { if (it.key === key) hit = it; });
    if (hit) {
      hit.qty = clampQty(hit.qty + clampQty(qty));
      hit.price = priceOf(pack); hit.regular = pack.price; hit.lowest30 = pack.lowest30; hit.vat = rateOf(product, pack);
    } else {
      items.push({
        key: key, id: product.id, name: product.name, img: pack.img || product.img || (product.imgs && product.imgs[0]) || "", url: product.url || "",
        pack: pack.id, packLabel: pack.label + suf.label, price: priceOf(pack), regular: pack.price, lowest30: pack.lowest30,
        qty: clampQty(qty), ship: pack.ship === "pallet" ? "pallet" : "parcel", kg: pack.kg || 1, vat: rateOf(product, pack)
      });
    }
    persist(items);
    return key;
  }
  function setQty(key, qty) {
    var items = load();
    items.forEach(function (it) { if (it.key === key) it.qty = clampQty(qty); });
    persist(items);
  }
  function remove(key) { persist(load().filter(function (it) { return it.key !== key; })); }
  /* Puts a removed line back where it was ("Cofnij" in the cart). A line
     with the same key added in the meantime just gets the quantity back. */
  function restore(item, index) {
    if (!item || !item.key) return;
    var items = load(), hit = null;
    items.forEach(function (it) { if (it.key === item.key) hit = it; });
    if (hit) hit.qty = clampQty(hit.qty + clampQty(item.qty));
    else {
      var i = typeof index === "number" ? Math.max(0, Math.min(items.length, index)) : items.length;
      items.splice(i, 0, item);
    }
    persist(items);
  }

  /* Parcels: packs are packed first-fit-decreasing into parcels of at most
     parcelMaxKg, each parcel at parcelPrice. Pallet packs (big bags, IBCs,
     200 l drums) travel one pack per pallet. */
  function shipping(items) {
    items = items || load();
    var weights = [], pallets = 0, kg = 0;
    items.forEach(function (it) {
      if (it.ship === "pallet") { pallets += it.qty; return; }
      for (var i = 0; i < it.qty; i++) { weights.push(it.kg || 1); kg += it.kg || 1; }
    });
    weights.sort(function (a, b) { return b - a; });
    var bins = [];
    weights.forEach(function (w) {
      for (var i = 0; i < bins.length; i++) { if (bins[i] + w <= SHIP.parcelMaxKg) { bins[i] += w; return; } }
      bins.push(w);
    });
    var parcelCost = bins.length * SHIP.parcelPrice, palletCost = pallets * SHIP.palletPrice;
    return { parcels: bins.length, parcelKg: bins, kg: kg, parcelCost: parcelCost,
             pallets: pallets, palletCost: palletCost, total: parcelCost + palletCost, params: SHIP };
  }
  function shipText(pack) {
    if (!pack) return "";
    return pack.ship === "pallet"
      ? "Dostawa paletowa: jedno opakowanie to jedna paleta, od " + fmt(SHIP.palletPrice) + ". Łączny koszt wysyłki policzymy w koszyku."
      : "Wysyłka kurierem: " + fmt(SHIP.parcelPrice) + " za paczkę przy przedpłacie. Łączny koszt wysyłki policzymy w koszyku.";
  }

  /* ----- header badge ------------------------------------------------- */
  function syncBadge(items) {
    var n = countOf(items || load());
    Array.prototype.forEach.call(doc.querySelectorAll("[data-cart-count]"), function (el) {
      el.textContent = String(n); el.hidden = n === 0;
    });
    Array.prototype.forEach.call(doc.querySelectorAll("a.cw-cart"), function (a) {
      a.setAttribute("aria-label", "Koszyk, " + n + " " + plural(n, "produkt", "produkty", "produktów"));
    });
  }

  /* ----- quick view ----------------------------------------------------
     From 900 px two columns (mock-up of the chosen pack | summary and the
     buying form), below one column; under 600 px a bottom sheet. The
     "added" state keeps the narrow layout of round 2. */
  var dlg = null, panel = null, body = null, lastOpener = null, current = null, mediaPack = null;
  var state = { pack: null, qty: 1, opts: {} };

  function build() {
    dlg = doc.createElement("div");
    dlg.className = "cws-dlg";
    dlg.hidden = true;
    dlg.innerHTML =
      '<div class="cws-dlg__scrim" data-cws-close></div>' +
      '<div class="cws-dlg__panel" role="dialog" aria-modal="true" aria-labelledby="cws-dlg-title">' +
        '<button type="button" class="cws-dlg__x" data-cws-close aria-label="Zamknij"><svg class="wf-icon" aria-hidden="true"><use href="#ti-x"></use></svg></button>' +
        '<div class="cws-dlg__body" data-cws-body></div>' +
      "</div>";
    doc.body.appendChild(dlg);
    /* CE-76 of the CE index (ce-rejestr.js): anchor and marker, set once the
       node is in the document, so the dev overlay's observer picks it up. */
    dlg.id = "szybki-podglad";
    dlg.setAttribute("data-ce", "CE-76");
    panel = dlg.querySelector(".cws-dlg__panel");
    body = dlg.querySelector("[data-cws-body]");
    dlg.addEventListener("click", function (e) { if (e.target.closest("[data-cws-close]")) close(); });
    dlg.addEventListener("keydown", trap);
  }
  function packById(id) { return (current.packs || []).filter(function (k) { return k.id === id; })[0]; }

  /* Mock-up of the chosen pack; two mock-ups for sets; a placeholder for
     partner products, which have no CarboHort mock-ups. */
  function mediaHTML(p, pack) {
    if (pack && pack.img) return '<img class="cws-qv__img" src="' + esc(pack.img) + '" alt="' + esc("Makieta opakowania – " + pack.label) + '">';
    if (p.imgs && p.imgs.length) {
      return '<span class="cws-qv__pair">' + p.imgs.map(function (s) {
        return '<img class="cws-qv__img" src="' + esc(s) + '" alt="">';
      }).join("") + "</span>";
    }
    if (p.img) return '<img class="cws-qv__img" src="' + esc(p.img) + '" alt="">';
    return '<span class="cws-qv__ph" aria-hidden="true"></span>';
  }
  /* A product whose card is the page we are on (the model card stands in for
     several products) gets no "Zobacz pełną kartę" link – it would only
     change the address under an open dialog. */
  function samePage(url) {
    try { var u = new URL(url, location.href); return u.origin === location.origin && u.pathname === location.pathname; }
    catch (e) { return false; }
  }
  function variantsHTML(p) {
    var vs = p.variants || [];
    if (vs.length < 2) return "";
    var h = '<fieldset class="cws-dlg__packs"><legend class="cws-dlg__label">Odmiana</legend><div class="cws-packs cws-packs--var">';
    vs.forEach(function (v) {
      var on = v.id === p.id;
      var inner = '<span class="cws-pack__label">' + esc(v.label) + "</span>" +
        (v.sub ? '<span class="cws-pack__sub">' + esc(v.sub) + "</span>" : "");
      if (on || find(v.id)) {
        h += '<label class="cws-pack cws-pack--var' + (on ? " is-on" : "") + '">' +
          '<input type="radio" name="cws-var" value="' + esc(v.id) + '"' + (on ? " checked" : "") + ">" + inner + "</label>";
      } else {
        /* The other version has no host here – go to its page with the pack. */
        h += '<a class="cws-pack cws-pack--var" data-cws-varurl="' + esc(v.url) + '" href="' + esc(v.url + "#" + state.pack) + '">' + inner + "</a>";
      }
    });
    return h + "</div></fieldset>";
  }

  function renderForm() {
    var p = current;
    panel.classList.add("cws-dlg__panel--qv");
    if (p.short) panel.setAttribute("aria-describedby", "cws-dlg-desc"); else panel.removeAttribute("aria-describedby");
    mediaPack = null;
    var html = '<div class="cws-qv">' +
      '<div class="cws-qv__media" data-cws-media></div>' +
      '<div class="cws-qv__main">' +
        '<div class="cws-qv__head">' +
          (p.meta ? '<p class="cws-dlg__kicker">' + esc(p.meta) + "</p>" : "") +
          '<h2 class="cws-dlg__title" id="cws-dlg-title">' + esc(p.name) + "</h2>" +
          '<div class="cws-qv__price" data-cws-price></div>' +
          '<p class="cws-qv__lowest" data-cws-lowest></p>' +
        "</div>" +
        (p.short ? '<p class="cws-qv__short" id="cws-dlg-desc">' + esc(p.short) + "</p>" : "") +
        (p.url && !samePage(p.url) ? '<a class="cws-qv__more" data-cws-more href="' + esc(p.url) + '">Zobacz pełną kartę produktu' +
          '<svg class="wf-icon wf-icon--sm" aria-hidden="true"><use href="#ti-arrow-right"></use></svg></a>' : "") +
        variantsHTML(p);
    html += '<fieldset class="cws-dlg__packs"><legend class="cws-dlg__label">' + esc(p.packsLabel || "Opakowanie") + '</legend><div class="cws-packs">';
    (p.packs || []).forEach(function (k) {
      var on = state.pack === k.id;
      html += '<label class="cws-pack' + (on ? " is-on" : "") + '">' +
        '<input type="radio" name="cws-pack" value="' + esc(k.id) + '"' + (on ? " checked" : "") + ">" +
        '<span class="cws-pack__label">' + esc(k.label) + "</span>" + priceHTML(k) + "</label>";
    });
    html += "</div></fieldset>";
    (p.opts || []).forEach(function (g) {
      html += '<fieldset class="cws-dlg__packs"><legend class="cws-dlg__label">' + esc(g.label) + "</legend>" +
        (g.hint ? '<p class="cws-dlg__hint">' + esc(g.hint) + "</p>" : "") + '<div class="cws-packs cws-packs--opt">';
      g.values.forEach(function (v) {
        var on = state.opts[g.id] === v.id;
        html += '<label class="cws-pack cws-pack--opt' + (on ? " is-on" : "") + '">' +
          '<input type="radio" name="cws-opt-' + esc(g.id) + '" value="' + esc(v.id) + '" data-cws-group="' + esc(g.id) + '"' + (on ? " checked" : "") + ">" +
          '<span class="cws-pack__label">' + esc(v.label) + "</span></label>";
      });
      html += "</div></fieldset>";
    });
    html += '<div class="cws-dlg__row"><span class="cws-dlg__label" id="cws-qty-l">' + esc(p.qtyLabel || "Liczba opakowań") + "</span>" +
      '<div class="cws-qty" role="group" aria-labelledby="cws-qty-l">' +
        '<button type="button" class="cws-qty__b" data-cws-dec aria-label="Mniej opakowań">−</button>' +
        '<input class="cws-qty__v" type="number" min="1" max="99" inputmode="numeric" value="' + state.qty + '" aria-label="' + esc(p.qtyLabel || "Liczba opakowań") + '" data-cws-qty>' +
        '<button type="button" class="cws-qty__b" data-cws-inc aria-label="Więcej opakowań">+</button>' +
      "</div></div>";
    html += '<div class="cws-dlg__sum"><span>Razem</span><b data-cws-total></b></div>' +
      '<p class="cws-dlg__note" data-cws-ship></p>' +
      '<div class="cws-dlg__actions">' +
        '<button type="button" class="cws-btn cws-btn--dark" data-cws-add>Dodaj do koszyka</button>' +
        '<button type="button" class="cws-btn cws-btn--light" data-cws-close>Anuluj</button>' +
      "</div>" +
      "</div></div>";
    body.innerHTML = html;

    Array.prototype.forEach.call(body.querySelectorAll('input[name="cws-var"]'), function (r) {
      r.addEventListener("change", function () { if (r.checked && r.value !== current.id) switchVariant(r.value); });
    });
    Array.prototype.forEach.call(body.querySelectorAll('input[name="cws-pack"]'), function (r) {
      r.addEventListener("change", function () {
        state.pack = r.value;
        Array.prototype.forEach.call(body.querySelectorAll('input[name="cws-pack"]'), function (x) {
          x.closest(".cws-pack").classList.toggle("is-on", x.checked);
        });
        update();
      });
    });
    Array.prototype.forEach.call(body.querySelectorAll("input[data-cws-group]"), function (r) {
      r.addEventListener("change", function () {
        var g = r.getAttribute("data-cws-group");
        state.opts[g] = r.value;
        Array.prototype.forEach.call(body.querySelectorAll('input[name="cws-opt-' + g + '"]'), function (x) {
          x.closest(".cws-pack").classList.toggle("is-on", x.checked);
        });
      });
    });
    var qIn = body.querySelector("[data-cws-qty]");
    qIn.addEventListener("input", function () { state.qty = clampQty(qIn.value); update(); });
    qIn.addEventListener("change", function () { state.qty = clampQty(qIn.value); qIn.value = state.qty; update(); });
    body.querySelector("[data-cws-dec]").addEventListener("click", function () { state.qty = clampQty(state.qty - 1); qIn.value = state.qty; update(); });
    body.querySelector("[data-cws-inc]").addEventListener("click", function () { state.qty = clampQty(state.qty + 1); qIn.value = state.qty; update(); });
    body.querySelector("[data-cws-add]").addEventListener("click", function () {
      var pack = packById(state.pack);
      if (!pack) return;
      add(current, pack.id, state.qty, state.opts);
      renderAdded(pack, state.qty);
    });
    update();
  }
  function update() {
    var pack = packById(state.pack);
    body.querySelector("[data-cws-total]").textContent = pack ? fmt(priceOf(pack) * state.qty) : "";
    body.querySelector("[data-cws-price]").innerHTML = priceHTML(pack);
    var low = body.querySelector("[data-cws-lowest]");
    low.textContent = lowestText(pack);
    low.hidden = !low.textContent;
    body.querySelector("[data-cws-ship]").textContent = shipText(pack);
    if (mediaPack !== state.pack) {       /* redraw the mock-up only on a pack change */
      mediaPack = state.pack;
      body.querySelector("[data-cws-media]").innerHTML = mediaHTML(current, pack);
    }
    var more = body.querySelector("[data-cws-more]");
    if (more && pack) more.setAttribute("href", current.url + "#" + pack.id);
    Array.prototype.forEach.call(body.querySelectorAll("a[data-cws-varurl]"), function (a) {
      a.setAttribute("href", a.getAttribute("data-cws-varurl") + "#" + state.pack);
    });
  }
  /* Other version found on the page: keep the pack, quantity and options
     where they exist there, redraw, and keep the focus on the switch. */
  function switchVariant(id) {
    var next = find(id);
    if (!next || !next.packs || !next.packs.length) return;
    var keep = { pack: state.pack, opts: state.opts };
    current = next;
    state.pack = (packById(keep.pack) || next.packs[0]).id;
    state.opts = {};
    (next.opts || []).forEach(function (g) {
      var want = keep.opts[g.id];
      var ok = g.values.some(function (v) { return v.id === want; });
      state.opts[g.id] = ok ? want : (g.default || (g.values[0] && g.values[0].id));
    });
    renderForm();
    var r = body.querySelector('input[name="cws-var"]:checked');
    if (r) r.focus();
  }
  function renderAdded(pack, qty) {
    var items = load(), n = countOf(items);
    var img = pack.img || current.img || (current.imgs && current.imgs[0]) || "";
    panel.classList.remove("cws-dlg__panel--qv");
    panel.removeAttribute("aria-describedby");
    body.innerHTML =
      '<div class="cws-dlg__head">' +
        (img ? '<img class="cws-dlg__img" src="' + esc(img) + '" alt="">' : '<span class="cws-dlg__img cws-dlg__img--ph" aria-hidden="true"></span>') +
        '<div class="cws-dlg__done" role="status">' +
          '<p class="cws-dlg__kicker">Dodano do koszyka</p>' +
          '<h2 class="cws-dlg__title" id="cws-dlg-title">' + esc(current.name) + "</h2>" +
          '<p class="cws-dlg__meta">' + esc(pack.label + optSuffix(current, state.opts).label) + " × " + qty + " · " + fmt(priceOf(pack) * qty) + "</p>" +
          '<p class="cws-dlg__note">W koszyku: ' + n + " " + plural(n, "opakowanie", "opakowania", "opakowań") + " za " + fmt(totalOf(items)) + ".</p>" +
        "</div>" +
      "</div>" +
      '<div class="cws-dlg__actions">' +
        '<a class="cws-btn cws-btn--dark" href="koszyk.html">Przejdź do koszyka</a>' +
        '<button type="button" class="cws-btn cws-btn--light" data-cws-close>Kontynuuj zakupy</button>' +
      "</div>";
    var first = body.querySelector(".cws-btn");
    if (first) first.focus();
  }
  function focusables() {
    return Array.prototype.filter.call(
      dlg.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]):not([type="radio"]),input[type="radio"]:checked'),
      function (el) { return el.getClientRects().length > 0; });
  }
  function trap(e) {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key !== "Tab") return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function open(product, opener, opts) {
    if (!product || !product.packs || !product.packs.length) return;
    if (!dlg) build();
    current = product;
    lastOpener = opener || null;
    var want = opts && opts.pack;
    var start = product.packs.filter(function (k) { return k.id === want; })[0] || product.packs[0];
    state.pack = start.id;
    state.qty = clampQty(opts && opts.qty);
    state.opts = {};
    (product.opts || []).forEach(function (g) {
      var want = opts && opts.opts && opts.opts[g.id];
      var ok = g.values.some(function (v) { return v.id === want; });
      state.opts[g.id] = ok ? want : (g.default || (g.values[0] && g.values[0].id));
    });
    renderForm();
    dlg.hidden = false;
    panel.scrollTop = 0;
    doc.documentElement.classList.add("cws-lock");
    var first = body.querySelector('input[name="cws-pack"]:checked') || body.querySelector("[data-cws-add]");
    if (first) first.focus();
  }
  function close() {
    if (!dlg || dlg.hidden) return;
    dlg.hidden = true;
    doc.documentElement.classList.remove("cws-lock");
    if (lastOpener && lastOpener.focus) lastOpener.focus();
    lastOpener = null;
  }

  /* Delegated opener: [data-cw-open] inside a [data-cw-product] host. */
  doc.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-cw-open]");
    if (!b) return;
    var p = parse(b.closest("[data-cw-product]"));
    if (!p) return;
    e.preventDefault();
    open(p, b, { pack: b.getAttribute("data-cw-pack") });
  });

  window.CWSklep = {
    items: load,
    count: function () { return countOf(load()); },
    total: function () { return totalOf(load()); },
    add: add,
    setQty: setQty,
    remove: remove,
    restore: restore,
    clear: function () { persist([]); },
    onChange: function (fn) { if (typeof fn === "function") listeners.push(fn); },
    open: open,
    close: close,
    product: parse,
    find: find,
    minPack: minPack,
    shipping: shipping,
    shipText: shipText,
    priceHTML: priceHTML,
    lowestText: lowestText,
    priceOf: priceOf,
    hasPromo: hasPromo,
    vatSplit: vatSplit,
    vatByRate: vatByRate,
    rateOf: rateOf,
    fmt: fmt,
    plural: plural,
    SHIP: SHIP,
    TAX: TAX
  };

  syncBadge();
})();
