/* =====================================================================
   pdp.js – shop product card V7 (28.09.2026): CARBOMAT ECO pH 6,0–6,5
   (pdp.html) and pH 4,5–5,0 (pdp-kwasny.html). One script, two pages.
   Spec: 40-strona-www/koncepcja/sklep-v7-spec.md §6, §12.9 and §12.14.

   1. Buy column – options and prices are drawn from the JSON in
      data-cw-product on the buy column (the same data as the list, the
      quick view and the cart): pH variant links carrying the pack anchor,
      pack chosen by the URL anchor (#w20, #bb1000, #bb1500), extra options
      (fraction), quantity, price with promotion and the 30-day lowest
      price, net price in small print, one-sentence shipping line, "add to
      cart" with a live message. State "zalogowany-pro" (platforma-b2b-spec.md
      16.5): a link to the B2B panel in place of the stepper and the cart
      button – from the address, the fragment or the mock-up state bar.
   2. "Od … zł" of the "Połącz z" and "Zobacz też" cards out of their own
      data-cw-product; their buttons open the shared quick view
      (sklep-wspolne.js, delegated).
   3. Sticky columns of the top layout (≥ 900 px).
   4. "Więcej o produkcie" – smooth jump to "O produkcie", focus on its
      heading.
   5. "O produkcie" – accordions below 900 px, open sections above.
   6. Photo slider – arrows, counter "2 / 6", scroll-snap.

   Needs sklep-wspolne.js (window.CWSklep) loaded before this file.
   ===================================================================== */
(function () {
  "use strict";
  var doc = document;
  var S = window.CWSklep;

  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ----- 1. Buy column ------------------------------------------------ */
  function initBuy() {
    var col = $("[data-c5pd-buycol]");
    var form = $("[data-c5pd-buy]");
    if (!S || !col || !form) return;
    var product = S.product(col);
    if (!product || !product.packs || !product.packs.length) return;

    var packsBox = $("[data-c5pd-packs]", form);
    var qtyIn = $("[data-c5pd-qty]", form);
    var priceOut = $("[data-c5pd-price]", col);
    var netOut = $("[data-c5pd-net]", col);
    var lowestOut = $("[data-c5pd-lowest]", col);
    var totalOut = $("[data-c5pd-total]", form);
    var shipOut = $("[data-c5pd-ship]", form);
    var fb = $("[data-c5pd-fb]", form);
    var variants = $$("[data-c5pd-variant]", form);
    var cartRow = $("[data-c5pd-cart]", form);
    var proBox = $("[data-c5pd-pro]", form);
    var specialOut = $("[data-c5pd-special]", form);
    var proBand = doc.getElementById("dla-profesjonalistow");
    var fbTimer = 0;

    function packById(id) {
      return product.packs.filter(function (k) { return k.id === id; })[0] || null;
    }
    var DEFAULT_PACK = packById("w20") ? "w20" : product.packs[0].id;
    /* The address anchor split at "&": a pack id may stand next to the view
       parameters of the mock-up ("#bb1000&widok=pro"). */
    function hashParts() {
      var h = (location.hash || "").slice(1);
      try { h = decodeURIComponent(h); } catch (e) { /* keep the raw text */ }
      return h ? h.split("&") : [];
    }
    /* Pack id from the address anchor, or null when it is not one of ours. */
    function packFromHash() {
      return hashParts().filter(function (t) { return !!packById(t); })[0] || null;
    }
    /* View of the page: a shop customer (default) or a logged-in professional
       account, optionally with a special price waiting in the panel. Read
       from the address query first, then from the fragment. */
    function viewFromAddress() {
      var q = new URLSearchParams(location.search || "");
      if (q.get("widok") !== "pro") {
        q = new URLSearchParams(hashParts().filter(function (t) { return t.indexOf("=") !== -1; }).join("&"));
      }
      var pro = q.get("widok") === "pro";
      return { pro: pro, cena: pro && q.get("cena") === "specjalna" };
    }
    var view = viewFromAddress();
    var state = { pack: packFromHash() || DEFAULT_PACK, qty: 1, opts: {}, pro: view.pro, special: view.cena };

    /* Packs: one radio each, price markup from the shared module. */
    packsBox.innerHTML = product.packs.map(function (k) {
      return '<label class="c5pd-opt" data-pack="' + esc(k.id) + '">' +
        '<input type="radio" name="c5pd-pack" value="' + esc(k.id) + '">' +
        '<span class="c5pd-opt__name">' + esc(k.label) + "</span>" + S.priceHTML(k) + "</label>";
    }).join("");

    /* Extra options (today the fraction of CARBOMAT ECO). The page holds a
       fieldset per group (so it can carry its own notes); a missing one is
       built after the packs. */
    (product.opts || []).forEach(function (g) {
      if (!g.values || !g.values.length) return;
      var box = $('[data-c5pd-opt="' + g.id + '"]', form);
      if (!box) {
        box = doc.createElement("fieldset");
        box.className = "c5pd-field";
        box.setAttribute("data-c5pd-opt", g.id);
        box.innerHTML = '<legend class="c5pd-label" data-c5pd-opt-label></legend>' +
          '<p class="c5pd-hint" data-c5pd-opt-hint></p><div class="c5pd-opts c5pd-opts--vals" data-c5pd-opt-values></div>';
        packsBox.closest("fieldset").insertAdjacentElement("afterend", box);
      }
      var legend = $("[data-c5pd-opt-label]", box);
      var hint = $("[data-c5pd-opt-hint]", box);
      if (legend) legend.textContent = g.label;
      if (hint) { hint.textContent = g.hint || ""; hint.hidden = !g.hint; }
      var ok = g.values.some(function (v) { return v.id === g.default; });
      state.opts[g.id] = ok ? g.default : g.values[0].id;
      $("[data-c5pd-opt-values]", box).innerHTML = g.values.map(function (v) {
        return '<label class="c5pd-opt c5pd-opt--val" data-val="' + esc(v.id) + '">' +
          '<input type="radio" name="c5pd-opt-' + esc(g.id) + '" value="' + esc(v.id) + '" data-group="' + esc(g.id) + '">' +
          '<span class="c5pd-opt__name">' + esc(v.label) + "</span></label>";
      }).join("");
    });

    function render() {
      var pack = packById(state.pack);
      $$("[data-pack]", packsBox).forEach(function (l) {
        var on = l.getAttribute("data-pack") === state.pack;
        l.classList.toggle("is-on", on);
        l.querySelector("input").checked = on;
      });
      $$("input[data-group]", form).forEach(function (r) {
        var on = state.opts[r.getAttribute("data-group")] === r.value;
        r.checked = on;
        r.closest(".c5pd-opt").classList.toggle("is-on", on);
      });

      priceOut.innerHTML = S.priceHTML(pack);
      /* Net price of the price shown (promotion included), product VAT rate. */
      if (netOut) {
        netOut.textContent = S.fmt(S.vatSplit(S.priceOf(pack), S.rateOf(product, pack)).net) + " netto";
      }
      var low = S.lowestText(pack);
      lowestOut.textContent = low;
      lowestOut.hidden = !low;
      if (state.qty >= 2 && !state.pro) {
        var each = S.priceOf(pack);
        totalOut.textContent = "Razem: " + state.qty + " × " + S.fmt(each) + " = " + S.fmt(each * state.qty);
        totalOut.hidden = false;
      } else {
        totalOut.textContent = "";
        totalOut.hidden = true;
      }
      shipOut.textContent = shipLine(pack);
      /* Both pH links carry the chosen pack, so the other variety opens on it. */
      variants.forEach(function (a) {
        a.setAttribute("href", a.getAttribute("data-c5pd-variant") + "#" + state.pack);
      });
    }

    /* Shipping in one sentence (§12.14): parcel or pallet, and the time. */
    function shipLine(pack) {
      var when = ", do " + S.SHIP.days + " dni roboczych od zaksięgowania wpłaty.";
      return pack.ship === "pallet"
        ? "Dostawa paletowa: jedno opakowanie to jedna paleta, od " + S.fmt(S.SHIP.palletPrice) + when
        : "Wysyłka kurierem: " + S.fmt(S.SHIP.parcelPrice) + " za paczkę przy przedpłacie" + when;
    }

    /* The anchor follows the chosen pack without a new history entry; view
       parameters carried by the fragment stay behind the pack id. */
    function writeHash(id) {
      var h = "#" + [id].concat(hashParts().filter(function (t) { return t.indexOf("=") !== -1; })).join("&");
      if (location.hash === h) return;
      try { history.replaceState(history.state, "", h); }
      catch (e) {
        try { location.replace(h); } catch (e2) { /* the address stays as it was */ }
      }
    }

    /* State "zalogowany-pro": the order goes through the B2B panel, so the
       stepper, the cart button and their messages give way to one link.
       The price stays public – no account price and no discount here. */
    function renderView() {
      form.classList.toggle("c5pd-buy--pro", state.pro);
      if (cartRow) cartRow.hidden = state.pro;
      if (proBox) proBox.hidden = !state.pro;
      if (specialOut) specialOut.hidden = !(state.pro && state.special);
      fb.hidden = state.pro;
      /* The PRO band invites to log in or to apply for an account – not for
         an account that is already logged in. */
      if (proBand) proBand.hidden = state.pro;
      if (state.pro) {
        window.clearTimeout(fbTimer);
        fb.textContent = "";
      }
      render();
      var name = !state.pro ? "sklep" : state.special ? "specjalna" : "pro";
      $$(".c5b-stan [data-stan-ustaw]").forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-stan-ustaw") === name ? "true" : "false");
      });
    }
    /* Sent by the mock-up state bar below; chrome.js listens to the same
       event and switches the header. */
    doc.addEventListener("cw:widok", function (e) {
      var d = e.detail || {};
      state.pro = !!d.pro;
      state.special = state.pro && !!d.cena;
      renderView();
    });
    /* Mock-up state bar above <main>. Focus stays on the pressed button. */
    doc.addEventListener("click", function (e) {
      var b = e.target && e.target.closest ? e.target.closest(".c5b-stan [data-stan-ustaw]") : null;
      if (!b) return;
      var name = b.getAttribute("data-stan-ustaw");
      doc.dispatchEvent(new CustomEvent("cw:widok", {
        detail: { pro: name !== "sklep", cena: name === "specjalna" }
      }));
    });

    packsBox.addEventListener("change", function (e) {
      if (e.target.name !== "c5pd-pack") return;
      state.pack = e.target.value;
      render();
      writeHash(state.pack);
    });
    form.addEventListener("change", function (e) {
      var g = e.target.getAttribute && e.target.getAttribute("data-group");
      if (!g) return;
      state.opts[g] = e.target.value;
      render();
    });
    /* Anchor typed or followed later: only our pack ids count (the skip link
       "#main" must not reset the choice). */
    window.addEventListener("hashchange", function () {
      var p = packFromHash();
      if (p && p !== state.pack) { state.pack = p; render(); }
    });
    /* The current variety needs no reload of itself. */
    variants.forEach(function (a) {
      if (a.getAttribute("aria-current") === "page") {
        a.addEventListener("click", function (e) { e.preventDefault(); });
      }
    });

    /* Quantity stepper, 1–99. */
    function setQty(q) {
      q = parseInt(q, 10);
      state.qty = isNaN(q) ? 1 : Math.max(1, Math.min(99, q));
    }
    $("[data-c5pd-dec]", form).addEventListener("click", function () { setQty(state.qty - 1); qtyIn.value = state.qty; render(); });
    $("[data-c5pd-inc]", form).addEventListener("click", function () { setQty(state.qty + 1); qtyIn.value = state.qty; render(); });
    qtyIn.addEventListener("input", function () { if (qtyIn.value !== "") { setQty(qtyIn.value); render(); } });
    qtyIn.addEventListener("change", function () { setQty(qtyIn.value); qtyIn.value = state.qty; render(); });

    /* Add to cart; the message is set after a short pause so a screen reader
       announces it again even when the same line is added twice. */
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (state.pro) return;
      var pack = packById(state.pack);
      var key = S.add(product, pack.id, state.qty, state.opts);
      if (!key) return;
      var item = S.items().filter(function (it) { return it.key === key; })[0];
      var n = S.count();
      var msg = "Dodano: " + product.name + " · " + (item ? item.packLabel : pack.label) + " × " + state.qty +
        ". W koszyku: " + n + " " + S.plural(n, "opakowanie", "opakowania", "opakowań") + ".";
      fb.textContent = "";
      window.clearTimeout(fbTimer);
      fbTimer = window.setTimeout(function () {
        fb.innerHTML = "<p>" + esc(msg) + '</p><a class="wf-link" href="koszyk.html">Przejdź do koszyka</a>';
      }, 50);
    });

    if (state.pro) renderView(); else render();
  }

  /* ----- 2. "Od … zł" of the small product cards ---------------------- */
  function cheapest(p) {
    if (S.minPack) return S.minPack(p);
    return (p.packs || []).filter(function (k) { return typeof k.price === "number"; })
      .sort(function (a, b) { return S.priceOf(a) - S.priceOf(b); })[0] || null;
  }
  function initFrom() {
    if (!S) return;
    $$("[data-c5pd-from]").forEach(function (out) {
      var p = S.product(out.closest("[data-cw-product]"));
      var best = p && cheapest(p);
      if (!best) return;
      var low = S.lowestText(best);
      out.innerHTML = "od " + S.priceHTML(best) +
        (low ? '<span class="c5pd-from__low">' + esc(low) + "</span>" : "");
    });
  }

  /* ----- 3. Sticky columns (spec §6.2, §12.14) ------------------------
     Both columns are position: sticky (pdp.css, ≥ 900 px). Their `top`
     follows the scroll: top = clamp(top − Δscroll, min(gap, vh − h − gap),
     gap). A column lower than the window – the slider – simply sticks to
     the top next to the longer buy column, so there is no empty field. If
     the shorter column ever grows past the window, it stops at its end
     going down and at its start going up, while the longer one runs on.
     Re-clamped on resize and whenever a column changes height. */
  function initSticky() {
    var cols = $$("[data-c5pd-col]");
    if (!cols.length) return;
    var MQ = window.matchMedia("(min-width: 900px)");
    var gap = 24;
    if (MQ.matches) {
      var cssTop = parseFloat(window.getComputedStyle(cols[0]).top);
      if (cssTop >= 0) gap = cssTop;
    }
    var tops = cols.map(function () { return gap; });
    var lastY = window.pageYOffset || 0;

    function update(dy) {
      if (!MQ.matches) {
        cols.forEach(function (c) { c.style.top = ""; });
        return;
      }
      var vh = window.innerHeight;
      cols.forEach(function (c, i) {
        var lo = Math.min(gap, vh - c.offsetHeight - gap);
        tops[i] = Math.max(lo, Math.min(gap, tops[i] - dy));
        c.style.top = tops[i] + "px";
      });
    }

    /* Start as if the page had been scrolled down from the very top. */
    update(lastY);
    window.addEventListener("scroll", function () {
      var y = window.pageYOffset || 0;
      var dy = y - lastY;
      lastY = y;
      if (dy) update(dy);
    }, { passive: true });
    window.addEventListener("resize", function () { update(0); });
    window.addEventListener("load", function () { update(0); });
    if (MQ.addEventListener) MQ.addEventListener("change", function () { update(0); });
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function () { update(0); });
      cols.forEach(function (c) { ro.observe(c); });
    }
  }

  /* ----- 4. "Więcej o produkcie" (§12.9 K11) --------------------------
     Smooth scroll to "O produkcie" (instant with reduced motion) and focus
     on its heading. The pack anchor in the address stays as it is; without
     the script the link is a plain in-page anchor. */
  function initMore() {
    var sec = doc.getElementById("o-produkcie");
    var head = sec && $(".c5pd-h2", sec);
    if (!head) return;
    var RM = window.matchMedia("(prefers-reduced-motion: reduce)");
    $$("[data-c5pd-more]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        /* window.scrollTo keeps the jump inside this document (an embedding
           frame does not scroll along, as it could with scrollIntoView). */
        var y = sec.getBoundingClientRect().top + (window.pageYOffset || 0);
        window.scrollTo({ top: y, behavior: RM.matches ? "auto" : "smooth" });
        head.focus({ preventScroll: true });
      });
    });
  }

  /* ----- 5. "O produkcie" (§12.9 K13, §12.14) --------------------------
     Each H3 holds a button and the same title as text; pdp.css shows the
     button only below 900 px and only once the list is .is-ready, so from
     900 px (and without the script) every section is open with nothing to
     toggle. The button flips .is-open on its section – no [hidden], which
     the artifact viewer forces to display: none. The state survives
     resizing across 900 px because the class stays put. */
  function initSections() {
    var box = $("[data-c5pd-secs]");
    if (!box) return;
    $$("[data-c5pd-sec]", box).forEach(function (sec) {
      var btn = $(".c5pd-sec__btn", sec);
      if (!btn) return;
      btn.setAttribute("aria-expanded", sec.classList.contains("is-open") ? "true" : "false");
      btn.addEventListener("click", function () {
        var open = !sec.classList.contains("is-open");
        sec.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
    box.classList.add("is-ready");
  }

  /* ----- 6. Photo slider (§12.14 item 1) -------------------------------
     The track scrolls sideways with scroll-snap (fingers, trackpads, arrow
     keys on the focused track); the buttons move one frame and the counter
     follows the scroll. The last frame sits at the end of the track, so no
     empty field is left after it. */
  function initSlider() {
    var track = $("[data-c5pd-track]");
    if (!track) return;
    var slides = $$(".c5pd-shot", track);
    var prev = $("[data-c5pd-prev]"), next = $("[data-c5pd-next]"), cur = $("[data-c5pd-cur]");
    if (!slides.length || !prev || !next || !cur) return;
    var RM = window.matchMedia("(prefers-reduced-motion: reduce)");
    var index = -1, frame = 0;

    function at() {
      var max = track.scrollWidth - track.clientWidth;
      if (max > 0 && track.scrollLeft >= max - 2) return slides.length - 1;
      var step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : 0;
      if (step <= 0) return 0;
      return Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / step)));
    }
    function sync() {
      frame = 0;
      var i = at();
      if (i === index) return;
      index = i;
      cur.textContent = String(i + 1);
      prev.setAttribute("aria-disabled", i === 0 ? "true" : "false");
      next.setAttribute("aria-disabled", i === slides.length - 1 ? "true" : "false");
    }
    function go(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: RM.matches ? "auto" : "smooth" });
    }
    prev.addEventListener("click", function () { if (index > 0) go(index - 1); });
    next.addEventListener("click", function () { if (index < slides.length - 1) go(index + 1); });
    track.addEventListener("scroll", function () {
      if (!frame) frame = window.requestAnimationFrame(sync);
    }, { passive: true });
    window.addEventListener("resize", sync);
    sync();
  }

  initBuy();
  initFrom();
  initSticky();
  initMore();
  initSections();
  initSlider();
})();
