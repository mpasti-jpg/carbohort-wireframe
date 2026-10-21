/* =====================================================================
   chrome.js – WSPÓLNE ELEMENTY SERWISU W JEDNYM MIEJSCU.

   Nagłówek z mega-menu, nawigacja mobilna, przyciemnienie tła, stopka,
   sprite ikon i dok doradcy żyją TYLKO tutaj. Podstrony wstawiają je
   znacznikami i nie zawierają już ani jednej linii tego kodu:

       <cw-icons></cw-icons>
       <cw-navbar data-current="uprawy"></cw-navbar>
       <cw-footer></cw-footer>
       <cw-dock></cw-dock>

   Zmiana w menu albo w stopce = zmiana w TYM pliku. Podstron się nie dotyka.

   data-current przyjmuje wartość z data-nav w szablonie nawigacji:
   produkty · carbohumic · carbohumic-dolistny · uprawy · ziemniak · kukurydza · borowka
   · prochnica-plus · centrum-wiedzy · o-firmie · kontakt · sklep. Puste = brak podświetlenia
   (strona główna).

   ZASADY:
   - Renderujemy do zwykłego DOM, nie do shadow DOM. Cały arkusz klas wf- i cw-
     ma działać bez zmian, a shadow DOM by go odciął.
   - Plik ładujemy w <head> BEZ defer. Dzięki temu definicje istnieją, zanim
     parser dojdzie do znaczników, elementy podnoszą się w locie, a cw.js
     z końca <body> zastaje kompletny DOM.
   - The dock hides over the opening block of the page and shows once the
     reader has scrolled past it – one rule for every page with <cw-dock>,
     in this file (dockLanding): the opening block is #hero, else
     [data-dock-hero], else the first section of <main> (16.10.2026; before,
     c5.js and ce/00-base.js did it on pages with #hero only).
   - Sprite to suma ikon używanych w całym serwisie. Dokładanie ikony na
     jednej podstronie nie wymaga ruszania pozostałych.
   - The "Rodzaje upraw" mega menu (#mega-uprawy) is CE-02 in the variant
     "grupy-ze-zdjeciem" (class cw-mega--crop-switch, 15.10.2026; it replaced
     the five-column variant "grupy" of 20.09.2026). Five groups and 31 items
     from the supplied list: the left column holds the five group names as
     vertical tabs, the middle shows the list of the active group, the right
     its photo (illustrative, one photo per group). The first group is active
     by default; on a crop page the group of that crop. Switching: pointer
     (with an intent triangle, so a diagonal move towards the list does not
     switch groups), focus and arrow keys (up/down, Home/End), touch (the
     first tap on a group shows its list). Tab leads from the group into its
     list, Escape closes the panel (cw.js). Group names are text, not links;
     only Borówka amerykańska, Kukurydza and Ziemniak have a page – the rest
     are <span class="cw-crop--soon">. All items look alike (link dark, item
     without a page lighter); Ozime / Jare are plain subheadings.
     li.is-featured stays as data from the supplied list, without a look of
     its own. The fruit tree group is called "Drzewa sadownicze" (the source
     document says "Sadownicze"). The panel starts under the left edge of its
     trigger and ends on the right edge of the content container (16.10.2026,
     placeCropPanel(); in a narrow panel the photo gives way, see
     ce/CE-02-mega-menu.css). Behaviour:
     bindCropSwitch() below; styles:
     ce/CE-02-mega-menu.css, attached by this file. Below 980 px the same
     content comes back in #mobilenav as five <details> (unchanged). Both
     lists must stay identical; _narzedzia/qa-menu.py checks it. Spec:
     40-strona-www/koncepcja/menu-rodzaje-upraw-spec.md.
   - Advisor dock (CE-05) on every page with <cw-dock>: this file inserts a
     landing section right before the site footer (#serwis-dok-sekcja,
     heading and one sentence) and moves the dock (#serwis-dok) right below
     it. The dock is position: sticky (class cw-jurek--land), so it floats at
     the bottom of the window and stops in its slot above the footer instead
     of running over it; once it stands in the slot it gets is-landed – the
     field grows and the heading fades in. Scrolling back up returns it to
     the floating state. Over the opening block of the page the floating
     dock hides (cx-dockhide, see above); an open or a landed dock stays
     visible. Styles:
     ce/CE-05-dok-doradcy.css, attached by this file; logic: dockLanding().

   data-ce attributes mark content elements (CE) of the site: the registry
   of codes and names lives in ../ce-rejestr.js, the highlighting overlay
   in ce-overlay.js. They are metadata only and change no layout or behaviour.

   B2B platform (04.10.2026) – three additions, all in this file:
   - <cw-navbar data-uklad="panel" data-current="zamow"> renders the panel
     header (CE-91, template panelbar()) instead of the site header; no mega
     menus, no cart, no mobile navigation, no scrim. data-uklad="handlowiec"
     renders the same block in the sales desk variant. data-current takes:
     pulpit · zamow · zamowienia · oferty · dokumenty · opiekun (panel),
     zamowienia (sales desk). Styles: ce/CE-91-naglowek-panelu.css.
   - <cw-footer> on a page that holds cw-navbar[data-uklad] renders CE-04 in
     the "panel" variant: the bottom strip only.
   - State "zalogowany-pro" of the site header (CE-01): switched on by
     <cw-navbar data-widok="pro">, by widok=pro in the address, by widok=pro
     in the address fragment, or by the cw:widok event on document
     (detail: {pro: true/false}). It adds the cw-probar strip above the header
     and puts the "Panel B2B" button in place of the cart icon (from 1280 px;
     a narrower header shows the strip only). A page without
     the state has no strip in the DOM. Styles: .cw-probar in cw.css.

   Promotion strip (CE-95, 15.10.2026): one configuration below (PROMO –
   id, text, address, on/off). When on, the site header (not the B2B panel
   header) gets the strip as its first child, and this file attaches
   ce/CE-95-pasek-promocji.css. Closing is remembered in localStorage under
   "cw-promo-zamknieta:<id>", so a promotion with a new id shows again.

   Comments on the mock-up (21.10.2026): ?uwagi=1 in the address turns on the
   Agentation toolbar for the reader; every comment is saved at once through
   the worker _narzedzia/uwagi-worker.js. Configuration (UWAGI) and the full
   description sit next to the code, below the page-state badge.
   ===================================================================== */
(function () {
  "use strict";

  /* Folder of this file as the page sees it ("" on pages in v7/, "../" in
     v7/lab/). The packshots of the product menu are addressed from here, so
     they load on every page that renders the header. */
  var HERE = (/^(.*)chrome\.js(?:[?#].*)?$/.exec(
    (document.currentScript && document.currentScript.getAttribute("src")) || "") || ["", ""])[1];

  /* ===== CE-95 – promotion strip: the ONE place to change or switch it off ===
     EXAMPLE promotion (placeholder copy for the mock-up, not a real offer).
     wlaczona: false hides the strip on every page. Give a new promotion a new
     id – a reader who closed the previous one will see the new one. */
  var PROMO = {
    id: "dolistne-30-2026-11",
    wlaczona: true,
    etykieta: "Promocja",
    tekst: "Superpromocja: wszystkie produkty dolistne –30% do końca listopada",
    link: "Zobacz w sklepie",
    adres: "sklep.html?f=linia:carbohumic-dolistny"
  };
  /* Temporarily (Produkty comment, 19.10.2026) the strip shows ONLY on the shop pages –
     the pages whose <cw-navbar> has data-current="sklep". To bring it back everywhere,
     set this to null. */
  var PROMO_PAGES = ["sklep.html", "pdp.html", "pdp-kwasny.html", "koszyk.html", "checkout.html", "potwierdzenie.html"];
  function promoPage() {
    if (!PROMO_PAGES) return true;
    var f = (location.pathname.split("/").pop() || "");
    return PROMO_PAGES.indexOf(f) > -1;
  }

  var ICONS =`<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true" id="wf-icon-sprite">
  <!-- ch-liscie: the four-leaf sign of the logo (Figma 397:1685, button icon in the footer).
       Two mirrored halves exported from Figma 17.10.2026; filled, not stroked. -->
  <!-- ch-suwaki: the "settings-2" icon of the Figma buttons (Konfigurator, dawki); no Tabler match. -->
  <symbol id="ch-suwaki" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></symbol>
  <symbol id="ch-liscie" viewBox="0 0 19 19"><g fill="currentColor" stroke="none"><g transform="translate(1.117 2.352)"><path d="M6.40047 5.58824C6.47878 5.58824 6.55709 5.58824 6.6354 5.5805C6.71371 5.57276 6.69022 5.55728 6.69022 5.52632C6.70588 5.44118 6.70588 5.36378 6.70588 5.28638C6.70588 2.36842 4.30958 0 1.35727 0C-1.59504 0 1.20065 0 1.12233 0.00773994C1.04402 0.0154799 1.06752 0.0309598 1.06752 0.0619195C1.06752 0.139319 1.05969 0.216718 1.05969 0.294118C1.05969 3.21207 3.45599 5.5805 6.4083 5.5805L6.40047 5.58824Z"/><path d="M1.41234 14.4115C1.33484 14.4115 1.25733 14.4115 1.17982 14.4037C1.10232 14.396 1.12557 14.3805 1.12557 14.3495C1.12557 14.272 1.11782 14.1945 1.11782 14.117C1.11782 11.1949 3.48953 8.82324 6.41153 8.82324C6.48904 8.82324 6.56654 8.82324 6.64405 8.83099C6.72156 8.83874 6.6983 8.85425 6.6983 8.88525C6.70605 8.96275 6.70605 9.04026 6.70605 9.11777C6.70605 12.0398 4.33435 14.4115 1.41234 14.4115Z"/></g><g transform="translate(17.765 2.352) scale(-1 1)"><path d="M6.40047 5.58824C6.47878 5.58824 6.55709 5.58824 6.6354 5.5805C6.71371 5.57276 6.69022 5.55728 6.69022 5.52632C6.70588 5.44118 6.70588 5.36378 6.70588 5.28638C6.70588 2.36842 4.30958 0 1.35727 0C-1.59504 0 1.20065 0 1.12233 0.00773994C1.04402 0.0154799 1.06752 0.0309598 1.06752 0.0619195C1.06752 0.139319 1.05969 0.216718 1.05969 0.294118C1.05969 3.21207 3.45599 5.5805 6.4083 5.5805L6.40047 5.58824Z"/><path d="M1.41234 14.4115C1.33484 14.4115 1.25733 14.4115 1.17982 14.4037C1.10232 14.396 1.12557 14.3805 1.12557 14.3495C1.12557 14.272 1.11782 14.1945 1.11782 14.117C1.11782 11.1949 3.48953 8.82324 6.41153 8.82324C6.48904 8.82324 6.56654 8.82324 6.64405 8.83099C6.72156 8.83874 6.6983 8.85425 6.6983 8.88525C6.70605 8.96275 6.70605 9.04026 6.70605 9.11777C6.70605 12.0398 4.33435 14.4115 1.41234 14.4115Z"/></g></g></symbol>
  <!-- ch-sygnet: the sign of the logo as a background motif (G12, 18.10.2026), Figma 803:1629,
       four filled leaves; in CSS the same shape is the mask of .c5-sygnet (ce/00-base.css). -->
  <symbol id="ch-sygnet" viewBox="0 0 980 980"><g fill="currentColor" stroke="none"><path d="M25.5 472.8C19 472.8 12.4 472.8 5.9 472.2C-0.7 471.5 1.3 470.2 1.3 467.6C0 460.4 0 453.9 0 447.3C0 200.9 200 0.9 446.4 0.9C692.9 0.9 459.5 0.9 466.1 1.5C472.6 2.2 470.6 3.5 470.6 6.1C470.6 12.6 471.3 19.2 471.3 25.7C471.3 272.1 271.3 472.2 24.8 472.2L25.5 472.8Z"/><path d="M454.1 977.5C460.6 977.5 467.1 977.5 473.7 976.8C480.2 976.2 478.2 974.9 478.2 972.3C478.2 965.7 478.9 959.2 478.9 952.7C478.9 706.6 279.2 506.9 33.1 506.9C26.6 506.9 20 506.9 13.5 507.5C7 508.2 8.9 509.5 8.9 512.1C8.3 518.6 8.3 525.2 8.3 531.7C8.3 777.8 208 977.5 454.1 977.5Z"/><path d="M978.6 973.3C966.2 711.2 669.5 500.7 301.5 495.5C298.2 495.5 296.9 500.1 300.2 501.4C500.9 603.3 641.4 788.9 658.4 974.6C658.4 977.2 661 979.1 663.6 979.1H974C976.7 979.1 979.3 976.5 979.3 973.9L978.6 973.3Z"/><path d="M967.3 5.2C954.9 267.6 657.8 478.2 289.5 483.5C286.3 483.5 285 478.9 288.2 477.6C489.1 375.5 629.7 189.7 646.7 4.6C646.7 2 648.7 0 651.3 0H962C964.7 0 967.3 2.6 967.3 5.2Z"/></g></symbol>
  <!-- ch-sadzonka, ch-organiczny: icons of the CE-11 product switch (Figma 397:2187, "seeding" / "organic"; stroke, 20 px). -->
  <symbol id="ch-sadzonka" viewBox="0 0 20 20"><g transform="translate(0.032 0.963)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"><path d="M17.625 9.50953H16.0153C15.2751 9.50953 14.6852 10.0419 14.4888 10.7557C13.9431 12.7396 12.1261 14.197 9.96875 14.197C7.81137 14.197 5.99441 12.7396 5.44867 10.7557C5.25234 10.0419 4.66242 9.50953 3.92219 9.50953H2.3125C1.44957 9.50953 0.75 10.2091 0.75 11.072V15.7595C0.75 16.6225 1.44957 17.322 2.3125 17.322H17.625C18.4879 17.322 19.1875 16.6225 19.1875 15.7595V11.072C19.1875 10.2091 18.4879 9.50953 17.625 9.50953Z"/><path d="M11.0733 9.83312C10.1581 10.7484 8.3112 10.3855 8.3112 10.3855C8.3112 10.3855 7.94835 8.53871 8.86362 7.6234C9.77889 6.70809 11.6258 7.07098 11.6258 7.07098C11.6258 7.07098 11.9887 8.91781 11.0733 9.83312Z"/><path d="M14.1983 3.58312C13.2831 4.4984 11.4362 4.13555 11.4362 4.13555C11.4362 4.13555 11.0733 2.28871 11.9886 1.3734C12.9039 0.458086 14.7508 0.820976 14.7508 0.820976C14.7508 0.820976 15.1137 2.66781 14.1983 3.58312Z"/><path d="M4.17613 5.14563C5.09141 6.0609 6.93828 5.69805 6.93828 5.69805C6.93828 5.69805 7.30113 3.85121 6.38586 2.9359C5.47059 2.02059 3.62371 2.38348 3.62371 2.38348C3.62371 2.38348 3.26082 4.23031 4.17613 5.14563Z"/></g></symbol>
  <symbol id="ch-organiczny" viewBox="0 0 20 20"><g transform="translate(0.032 0.346)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square"><path d="M5.75005 9.81066C5.75005 5.43566 10.1251 1.06066 10.1251 1.06066C10.1251 1.06066 14.5001 5.43566 14.5001 9.81066C14.5001 12.9357 12.5413 15.4357 10.1251 15.4357C7.7088 15.4357 5.75005 12.9357 5.75005 9.81066Z"/><path d="M15.7501 4.40504C16.5239 3.91709 17.3318 3.48536 18.1676 3.11316C18.1676 3.11316 20.5713 8.81441 18.9219 12.8663C17.8307 15.5488 15.3838 17.1 13.2501 16.5888"/><path d="M4.50005 4.40504C3.72619 3.91709 2.91828 3.48536 2.08255 3.11316C2.08255 3.11316 -0.321196 8.81441 1.32818 12.8663C2.41943 15.5488 4.8663 17.1 7.00005 16.5888"/><path d="M10.1251 19.1857V9.18566"/></g></symbol>
  <symbol id="ti-alert-triangle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4" /><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" /><path d="M12 16h.01" /></symbol>
  <symbol id="ti-arrow-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5l0 14" />
  <path d="M18 13l-6 6" />
  <path d="M6 13l6 6" /></symbol>
  <symbol id="ti-arrow-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l14 0" />
  <path d="M5 12l6 6" />
  <path d="M5 12l6 -6" /></symbol>
  <symbol id="ti-arrow-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l14 0" />
  <path d="M13 18l6 -6" />
  <path d="M13 6l6 6" /></symbol>
  <symbol id="ti-arrow-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5l0 14" />
  <path d="M18 11l-6 -6" />
  <path d="M6 11l6 -6" /></symbol>
  <symbol id="ti-arrows-sort" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l4 -4l4 4m-4 -4v14" />
  <path d="M21 15l-4 4l-4 -4m4 4v-14" /></symbol>
  <symbol id="ti-calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12" />
  <path d="M16 3v4" />
  <path d="M8 3v4" />
  <path d="M4 11h16" />
  <path d="M11 15h1" />
  <path d="M12 15v3" /></symbol>
  <symbol id="ti-chart-line" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19l16 0" /><path d="M4 15l4 -6l4 2l4 -5l4 4" /></symbol>
  <symbol id="ti-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10" /></symbol>
  <symbol id="ti-chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6l6 -6" /></symbol>
  <symbol id="ti-chevron-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6l6 6" /></symbol>
  <symbol id="ti-chevron-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6l-6 6" /></symbol>
  <symbol id="ti-chevron-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6 -6l6 6" /></symbol>
  <symbol id="ti-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 7v5l3 3" /></symbol>
  <symbol id="ti-dots" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></symbol>
  <symbol id="ti-download" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" /></symbol>
  <symbol id="ti-droplet" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M7.502 19.423c2.602 2.105 6.395 2.105 8.996 0c2.602 -2.105 3.262 -5.708 1.566 -8.546l-4.89 -7.26c-.42 -.625 -1.287 -.803 -1.936 -.397a1.376 1.376 0 0 0 -.41 .397l-4.893 7.26c-1.695 2.838 -1.035 6.441 1.567 8.546z" /></symbol>
  <symbol id="ti-external-link" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
  <path d="M11 13l9 -9" />
  <path d="M15 4h5v5" /></symbol>
  <symbol id="ti-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
  <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></symbol>
  <symbol id="ti-file-download" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M12 17v-6" /><path d="M9.5 14.5l2.5 2.5l2.5 -2.5" /></symbol>
  <symbol id="ti-file-invoice" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21v-16a2 2 0 0 1 2 -2h7l5 5v13a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M9 7l1 0" /><path d="M9 13l6 0" /><path d="M13 17l2 0" /></symbol>
  <symbol id="ti-file-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" /><path d="M9 9l1 0" /><path d="M9 13l6 0" /><path d="M9 17l6 0" /></symbol>
  <symbol id="ti-filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227" /></symbol>
  <symbol id="ti-flag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5a5 5 0 0 1 7 0a5 5 0 0 0 7 0v9a5 5 0 0 1 -7 0a5 5 0 0 0 -7 0v-9z" /><path d="M5 21v-7" /></symbol>
  <symbol id="ti-flask" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3l6 0" /><path d="M10 9l4 0" /><path d="M10 3v6l-4.5 8a1.5 1.5 0 0 0 1.3 2.5h10.4a1.5 1.5 0 0 0 1.3 -2.5l-4.5 -8v-6" /></symbol>
  <symbol id="ti-info-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M12 9h.01" />
  <path d="M11 12h1v4h1" /></symbol>
  <symbol id="ti-leaf" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21c.5 -4.5 2.5 -8 7 -10" /><path d="M9 18c6.218 0 10.5 -3.288 11 -12v-2h-4.014c-9 0 -11.986 4 -12 9c0 1 0 3 2 5h3z" /></symbol>
  <symbol id="ti-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6" />
  <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
  <path d="M8 11v-4a4 4 0 1 1 8 0v4" /></symbol>
  <symbol id="ti-magnet" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13v-8a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v8a3 3 0 0 0 6 0v-8a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v8a7 7 0 0 1 -14 0" /><path d="M4 8l5 0" /><path d="M15 8l4 0" /></symbol>
  <symbol id="ti-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
  <path d="M3 7l9 6l9 -6" /></symbol>
  <symbol id="ti-map-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" /></symbol>
  <symbol id="ti-menu-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l16 0" />
  <path d="M4 12l16 0" />
  <path d="M4 18l16 0" /></symbol>
  <symbol id="ti-message-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9h8" />
  <path d="M8 13h6" />
  <path d="M9 18h-3a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-3l-3 3l-3 -3" /></symbol>
  <symbol id="ti-minus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l14 0" /></symbol>
  <symbol id="ti-notes" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /><path d="M9 7l6 0" /><path d="M9 11l6 0" /><path d="M9 15l4 0" /></symbol>
  <symbol id="ti-package" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /><path d="M12 12l8 -4.5" /><path d="M12 12l0 9" /><path d="M12 12l-8 -4.5" /><path d="M16 5.25l-8 4.5" /></symbol>
  <symbol id="ti-pencil" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
  <path d="M13.5 6.5l4 4" /></symbol>
  <symbol id="ti-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /></symbol>
  <symbol id="ti-photo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M15 8h.01" /><path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" /></symbol>
  <symbol id="ti-player-play" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v16l13 -8z" /></symbol>
  <symbol id="ti-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5l0 14" /><path d="M5 12l14 0" /></symbol>
  <symbol id="ti-layout-grid" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /></symbol>
  <symbol id="ti-rotate" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5" /></symbol>
  <symbol id="ti-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
  <path d="M21 21l-6 -6" /></symbol>
  <symbol id="ti-seeding" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10a6 6 0 0 0 -6 -6h-3v2a6 6 0 0 0 6 6h3" /><path d="M12 14a6 6 0 0 1 6 -6h3v1a6 6 0 0 1 -6 6h-3" /><path d="M12 20v-10" /></symbol>
  <symbol id="ti-send" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14l11 -11" />
  <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" /></symbol>
  <symbol id="ti-settings" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></symbol>
  <symbol id="ti-shopping-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M15 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M17 17h-11v-14h-2" />
  <path d="M6 5l14 1l-1 7h-13" /></symbol>
  <symbol id="ti-snowflake" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4l2 1l2 -1" /><path d="M12 2v6.5l3 1.72" /><path d="M17.928 6.268l.134 2.232l1.866 1.232" /><path d="M20.66 7l-5.629 3.25l.01 3.458" /><path d="M19.928 14.268l-1.866 1.232l-.134 2.232" /><path d="M20.66 17l-5.629 -3.25l-2.99 1.738" /><path d="M14 20l-2 -1l-2 1" /><path d="M12 22v-6.5l-3 -1.72" /><path d="M6.072 17.732l-.134 -2.232l-1.866 -1.232" /><path d="M3.34 17l5.629 -3.25l-.01 -3.458" /><path d="M4.072 9.732l1.866 -1.232l.134 -2.232" /><path d="M3.34 7l5.629 3.25l2.99 -1.738" /></symbol>
  <symbol id="ti-stack-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l-8 4l8 4l8 -4l-8 -4" /><path d="M4 12l8 4l8 -4" /><path d="M4 16l8 4l8 -4" /></symbol>
  <symbol id="ti-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" /></symbol>
  <symbol id="ti-trash" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7l16 0" />
  <path d="M10 11l0 6" />
  <path d="M14 11l0 6" />
  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></symbol>
  <symbol id="ti-truck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" /></symbol>
  <symbol id="ti-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></symbol>
  <symbol id="ti-users" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></symbol>
  <symbol id="ti-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6l-12 12" />
  <path d="M6 6l12 12" /></symbol>
</svg>`;

  var NAVBAR = `<header class="wf-navbar" id="serwis-naglowek" data-ce="CE-01">
  <div class="wf-navbar__inner wf-container">
    <a class="cw-brand" href="home.html"><img src="img/carbohort-logo.svg" width="169" height="33" alt="Carbohort"></a>
    <nav class="cw-nav" aria-label="Główna">
      <div class="cw-haspopup" data-nav-grupa="produkty">
        <button class="cw-nav-trigger" data-mega-trigger aria-haspopup="true" aria-expanded="false" aria-controls="mega-produkty">Produkty Carbohort <svg class="wf-icon wf-icon--sm" aria-hidden="true"><use href="#ti-chevron-down"></use></svg></button>
        <div class="cw-mega cw-mega--wide" id="mega-produkty" data-ce="CE-02" data-ce-wariant="szerokie" data-open="false" role="region" aria-label="Produkty Carbohort">
          <div class="cw-mega__head">
            <span class="wf-overline wf-t-tertiary">Produkty Carbohort</span>
            <!-- The shop button (28.09.2026): whoever opens "Produkty
                 Carbohort" expecting to buy gets to the shop in one click. -->
            <div class="cw-mega__actions">
              <a class="wf-btn wf-btn--secondary wf-btn--sm" href="produkty.html">Poznaj całą gamę produktów</a>
              <a class="wf-btn wf-btn--primary wf-btn--sm" href="sklep.html"><svg class="wf-icon wf-icon--sm" aria-hidden="true"><use href="#ti-shopping-cart"></use></svg>Przejdź do sklepu</a>
            </div>
          </div>
          <div class="cw-mega__layout">
            <!-- The whole box is one link. Four parts in a fixed order: category,
                 name, packshot, description (09.10.2026). The packshot is
                 decorative, the name next to it carries the meaning, hence the
                 empty alt. CARBOHUMIC shows two grey tiles 8 px apart, each with
                 a bottle of one shape and size and a caption: white for soil
                 application, black for foliar application. -->
            <a class="cw-prodbox" href="carbomat.html">
              <span class="wf-overline wf-t-tertiary">Sypkie · doglebowe</span>
              <span class="wf-h5 cw-prodbox__name">Carbomat Eco</span>
              <span class="cw-prodbox__media"><img class="cw-prodbox__img" src="img/opakowania/worek_20l.png" alt="" width="578" height="875" decoding="async" fetchpriority="low"></span>
              <span class="cw-prodbox__desc">Surowy lignit, który na lata przebudowuje strukturę i retencję gleby.</span>
            </a>
            <a class="cw-prodbox" href="carbomat-mata.html">
              <span class="wf-overline wf-t-tertiary">Sypkie · uprawa bezglebowa</span>
              <span class="wf-h5 cw-prodbox__name">Carbomat Mata Uprawowa</span>
              <span class="cw-prodbox__media"><img class="cw-prodbox__img" src="img/opakowania/mata_uprawowa.png" alt="" width="1000" height="313" decoding="async" fetchpriority="low"></span>
              <span class="cw-prodbox__desc">Naturalne podłoże nowej generacji do upraw bezglebowych – wieloletnia alternatywa dla wełny mineralnej i maty kokosowej.</span>
            </a>
            <!-- CARBOHUMIC has two pages since 15.10.2026 (soil and foliar) but keeps
                 one box. Since 16.10.2026 the box itself is not a link and has no
                 hover: it is a plain <div>, and only its two grey tiles (bottle and
                 caption) are links – white bottle to the soil page, black bottle
                 to the foliar page. -->
            <div class="cw-prodbox cw-prodbox--split">
              <span class="wf-overline wf-t-tertiary">Płynne · doglebowe i nalistne</span>
              <span class="wf-h5 cw-prodbox__name">Carbohumic</span>
              <span class="cw-prodbox__media cw-prodbox__media--pair">
                <a class="cw-prodbox__variant" data-nav="carbohumic" data-nav-parent="produkty" href="carbohumic-doglebowy.html" aria-label="Carbohumic doglebowy"><img class="cw-prodbox__img" src="img/opakowania/butelka_1l_biala.webp" alt="" width="391" height="1000" decoding="async" fetchpriority="low"><span class="cw-prodbox__tag">Doglebowe</span></a>
                <a class="cw-prodbox__variant" data-nav="carbohumic-dolistny" data-nav-parent="produkty" href="carbohumic-dolistny.html" aria-label="Carbohumic dolistny"><img class="cw-prodbox__img" src="img/opakowania/butelka_1l_czarna.webp" alt="" width="391" height="1000" decoding="async" fetchpriority="low"><span class="cw-prodbox__tag">Dolistne</span></a>
              </span>
              <span class="cw-prodbox__desc">„Próchnica w płynie" – kondycjonuje glebę i biostymuluje roślinę.</span>
            </div>
            <a class="cw-prodbox" href="carbomat-humic.html">
              <span class="wf-overline wf-t-tertiary">Sypkie · doglebowe</span>
              <span class="wf-h5 cw-prodbox__name">Carbomat Humic</span>
              <span class="cw-prodbox__media"><img class="cw-prodbox__img" src="img/opakowania/worek_20l.png" alt="" width="578" height="875" decoding="async" fetchpriority="low"></span>
              <span class="cw-prodbox__desc">Kondycjoner + potas + biostymulator; podnosi pH zakwaszonej gleby – na pole i do ogrodu.</span>
            </a>
          </div>
          <div class="cw-mega__needs">
            <span class="wf-overline wf-t-tertiary">Wg potrzeby</span>
            <div class="cw-mega__list">
              <a class="wf-link--quiet wf-small" href="produkty.html#retencja">Zatrzymać wodę / susza</a>
              <a class="wf-link--quiet wf-small" href="produkty.html#prochnica">Odbudować próchnicę</a>
              <a class="wf-link--quiet wf-small" href="produkty.html#jakosc">Jakość i trwałość owocu</a>
              <a class="wf-link--quiet wf-small" href="produkty.html#start">Lepszy start i wzrost</a>
              <a class="wf-link--quiet wf-small" href="produkty.html#ph">Uregulować pH gleby</a>
              <a class="wf-link--quiet wf-small" href="produkty.html#bez-torfu">Podłoże bez torfu</a>
            </div>
          </div>
        </div>
      </div>
      <div class="cw-haspopup" data-nav-grupa="uprawy">
        <button class="cw-nav-trigger" data-mega-trigger aria-haspopup="true" aria-expanded="false" aria-controls="mega-uprawy">Rodzaje upraw <svg class="wf-icon wf-icon--sm" aria-hidden="true"><use href="#ti-chevron-down"></use></svg></button>
        <div class="cw-mega cw-mega--wide cw-mega--crop-switch" id="mega-uprawy" data-ce="CE-02" data-ce-wariant="grupy-ze-zdjeciem" data-open="false" role="region" aria-label="Rodzaje upraw">
          <!-- Wariant „grupy ze zdjęciem” (15.10.2026): po lewej pięć grup jako zakładki,
               w środku lista roślin aktywnej grupy, po prawej jej zdjęcie (poglądowe).
               Przełączanie: najechanie (z „trójkątem intencji”), fokus i strzałki,
               dotyk. Obsługa: bindCropSwitch() niżej w tym pliku; style:
               ce/CE-02-mega-menu.css. -->
          <div class="cw-cropsw" data-crop-switch>
            <div class="cw-cropsw__groups" role="tablist" aria-orientation="vertical" aria-label="Grupy upraw">
              <button type="button" class="cw-cropsw__group" role="tab" id="cw-cropsw-t1" aria-controls="cw-cropsw-p1" aria-selected="true" tabindex="0">Jagodowe<svg class="wf-icon wf-icon--sm cw-cropsw__chev" aria-hidden="true"><use href="#ti-chevron-right"></use></svg></button>
              <button type="button" class="cw-cropsw__group" role="tab" id="cw-cropsw-t2" aria-controls="cw-cropsw-p2" aria-selected="false" tabindex="-1">Drzewa sadownicze<svg class="wf-icon wf-icon--sm cw-cropsw__chev" aria-hidden="true"><use href="#ti-chevron-right"></use></svg></button>
              <button type="button" class="cw-cropsw__group" role="tab" id="cw-cropsw-t3" aria-controls="cw-cropsw-p3" aria-selected="false" tabindex="-1">Warzywnicze<svg class="wf-icon wf-icon--sm cw-cropsw__chev" aria-hidden="true"><use href="#ti-chevron-right"></use></svg></button>
              <button type="button" class="cw-cropsw__group" role="tab" id="cw-cropsw-t4" aria-controls="cw-cropsw-p4" aria-selected="false" tabindex="-1">Rolnicze<svg class="wf-icon wf-icon--sm cw-cropsw__chev" aria-hidden="true"><use href="#ti-chevron-right"></use></svg></button>
              <button type="button" class="cw-cropsw__group" role="tab" id="cw-cropsw-t5" aria-controls="cw-cropsw-p5" aria-selected="false" tabindex="-1">Rośliny ozdobne<svg class="wf-icon wf-icon--sm cw-cropsw__chev" aria-hidden="true"><use href="#ti-chevron-right"></use></svg></button>
            </div>
            <div class="cw-cropsw__panel" role="tabpanel" id="cw-cropsw-p1" aria-labelledby="cw-cropsw-t1">
              <div class="cw-cropsw__list">
                <ul class="cw-crops__list">
                  <li class="is-featured"><a class="cw-crop" data-nav="borowka" data-nav-parent="uprawy" href="borowka.html">Borówka amerykańska</a></li>
                  <li class="is-featured"><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Malina</span></li>
                  <li class="is-featured"><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Truskawka</span></li>
                  <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Porzeczka</span></li>
                  <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Aronia</span></li>
                  <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Winogrono</span></li>
                </ul>
              </div>
              <img class="cw-cropsw__photo" src="img/foto/borowka-zbior.jpg" alt="Skrzynki z zebraną borówką między rzędami krzewów na plantacji" width="2000" height="1116" loading="lazy" decoding="async">
            </div>
            <div class="cw-cropsw__panel" role="tabpanel" id="cw-cropsw-p2" aria-labelledby="cw-cropsw-t2" tabindex="0" hidden>
              <div class="cw-cropsw__list">
                <ul class="cw-crops__list">
                  <li class="is-featured"><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Jabłoń</span></li>
                  <li class="is-featured"><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Grusza</span></li>
                  <li class="is-featured"><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Czereśnia</span></li>
                  <li class="is-featured"><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Wiśnia</span></li>
                  <li class="is-featured"><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Morela / Brzoskwinia</span></li>
                </ul>
              </div>
              <img class="cw-cropsw__photo" src="img/foto/eco-pro-sad.jpg" alt="Zbiór jabłek z drzewa w słonecznym sadzie" width="2000" height="1333" loading="lazy" decoding="async">
            </div>
            <div class="cw-cropsw__panel" role="tabpanel" id="cw-cropsw-p3" aria-labelledby="cw-cropsw-t3" tabindex="0" hidden>
              <div class="cw-cropsw__list">
                <ul class="cw-crops__list">
                  <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Papryka</span></li>
                  <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Ogórek</span></li>
                  <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Pomidor</span></li>
                  <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Kapustne</span></li>
                </ul>
              </div>
              <img class="cw-cropsw__photo" src="img/foto/prochnica-06-leafy-greens-rows.jpg" alt="Rzędy młodych warzyw liściowych na polu" width="933" height="1400" loading="lazy" decoding="async">
            </div>
            <div class="cw-cropsw__panel" role="tabpanel" id="cw-cropsw-p4" aria-labelledby="cw-cropsw-t4" hidden>
              <div class="cw-cropsw__list">
                <div class="cw-crops__split">
                  <div class="cw-crops__season">
                    <span class="cw-crops__season-name">Ozime</span>
                    <ul class="cw-crops__list">
                      <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Rzepak ozimy</span></li>
                      <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Pszenica ozima</span></li>
                      <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Pszenżyto ozime</span></li>
                      <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Jęczmień ozimy</span></li>
                      <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Żyto</span></li>
                    </ul>
                  </div>
                  <div class="cw-crops__season">
                    <span class="cw-crops__season-name">Jare</span>
                    <ul class="cw-crops__list">
                      <li class="is-featured"><a class="cw-crop" data-nav="kukurydza" data-nav-parent="uprawy" href="kukurydza.html">Kukurydza</a></li>
                      <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Słonecznik</span></li>
                      <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Soja</span></li>
                      <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Burak cukrowy</span></li>
                      <li class="is-featured"><a class="cw-crop" data-nav="ziemniak" data-nav-parent="uprawy" href="ziemniak.html">Ziemniak</a></li>
                      <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Jęczmień jary</span></li>
                      <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Owies</span></li>
                    </ul>
                  </div>
                </div>
              </div>
              <img class="cw-cropsw__photo" src="img/foto/kukurydza-hero.jpg" alt="Łan kukurydzy w równych rzędach pod błękitnym niebem" width="2000" height="1333" loading="lazy" decoding="async">
            </div>
            <div class="cw-cropsw__panel" role="tabpanel" id="cw-cropsw-p5" aria-labelledby="cw-cropsw-t5" tabindex="0" hidden>
              <div class="cw-cropsw__list">
                <ul class="cw-crops__list">
                  <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Trawnik</span></li>
                  <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Liściaste</span></li>
                  <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Iglaste</span></li>
                  <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Kwasolubne</span></li>
                </ul>
              </div>
              <img class="cw-cropsw__photo" src="img/foto/sciolka-doniczkowe.jpg" alt="Kwitnący różanecznik w białej donicy na ogrodowym tarasie" width="2000" height="1116" loading="lazy" decoding="async">
            </div>
          </div>
          <div class="cw-mega__foot">
            <span class="wf-small wf-t-secondary">Nie wiesz, co wybrać? Konfigurator dobierze produkty i dawki.</span>
            <a class="wf-btn wf-btn--secondary wf-btn--sm" href="konfigurator.html">Otwórz Konfigurator</a>
          </div>
        </div>
      </div>
      <div class="cw-haspopup" data-nav-grupa="prochnica-plus">
        <button class="cw-nav-trigger" data-mega-trigger aria-haspopup="true" aria-expanded="false" aria-controls="mega-programy">Programy i badania <svg class="wf-icon wf-icon--sm" aria-hidden="true"><use href="#ti-chevron-down"></use></svg></button>
        <div class="cw-mega cw-mega--narrow" id="mega-programy" data-ce="CE-02" data-ce-wariant="waskie" data-open="false" role="region" aria-label="Programy i badania">
          <div class="cw-mega__list">
            <a class="wf-link--quiet" href="prochnica-plus.html">Program Próchnica+</a>
          </div>
        </div>
      </div>
      <a class="wf-navbar__link" data-nav="centrum-wiedzy" href="centrum-wiedzy.html">Strefa wiedzy</a>
      <a class="wf-navbar__link" data-nav="o-firmie" href="o-firmie.html">O nas</a>
      <a class="wf-navbar__link" data-nav="kontakt" href="kontakt.html">Kontakt</a>
    </nav>
    <div class="wf-cluster wf-gap-2">
      <!-- No "Zaloguj" to the B2B platform here since 28.09.2026: the top bar serves
           visitors who do not know the site yet; the platform keeps its link in the footer. -->
      <a class="wf-btn wf-btn--primary wf-btn--sm" data-nav="konfigurator" href="konfigurator.html">Konfigurator<svg class="wf-icon cw-btn-ico" aria-hidden="true"><use href="#ch-suwaki"></use></svg></a>
      <a class="wf-btn wf-btn--ghost wf-btn--sm" data-nav="sklep" href="sklep.html">Sklep</a>
      <a class="wf-btn wf-btn--ghost wf-btn--icon wf-badge--count cw-cart" href="koszyk.html" aria-label="Koszyk, 0 produktów"><svg class="wf-icon" aria-hidden="true"><use href="#ti-shopping-cart"></use></svg><span class="wf-count" data-cart-count>0</span></a>
      <button class="wf-btn wf-btn--ghost wf-btn--icon cw-navtoggle" data-navtoggle aria-controls="mobilenav" aria-expanded="false" aria-label="Otwórz menu"><svg class="wf-icon" aria-hidden="true"><use href="#ti-menu-2"></use></svg></button>
    </div>
    <!-- Cart preview (28.09.2026, round 3): cw.js fills it from the shop's cart
         store and shows it while the pointer rests on the cart icon; the icon
         itself still leads to the cart page, touch screens get no preview. -->
    <div class="cw-minicart" id="cw-minicart" data-cw-minicart data-open="false" role="region" aria-label="Podgląd koszyka"></div>
  </div>
  <nav class="cw-mobilenav wf-container" id="mobilenav" data-ce="CE-03" data-open="false" aria-label="Menu mobilne">
    <a class="wf-navitem" data-nav="produkty" href="produkty.html">Produkty Carbohort</a>
    <!-- The two CARBOHUMIC pages (15.10.2026) – the second level under the
         products, indented like the crop groups. -->
    <a class="wf-navitem cw-mobilenav__sub" data-nav="carbohumic" data-nav-parent="produkty" href="carbohumic-doglebowy.html">Carbohumic doglebowy</a>
    <a class="wf-navitem cw-mobilenav__sub" data-nav="carbohumic-dolistny" data-nav-parent="produkty" href="carbohumic-dolistny.html">Carbohumic dolistny</a>
    <p class="wf-navitem cw-mobilenav__label" data-nav="uprawy">Rodzaje upraw</p>
    <!-- Ta sama treść co w #mega-uprawy: pięć grup, 31 pozycji, te same stany.
         Obie listy trzyma w zgodzie regresja _narzedzia/qa-menu.py. -->
    <details class="cw-mobilenav__group" name="cw-uprawy">
      <summary class="wf-navitem cw-mobilenav__sub">Jagodowe<svg class="wf-icon wf-icon--sm cw-mobilenav__chev" aria-hidden="true"><use href="#ti-chevron-down"></use></svg></summary>
      <ul class="cw-crops__list">
        <li class="is-featured"><a class="cw-crop" data-nav="borowka" data-nav-parent="uprawy" href="borowka.html">Borówka amerykańska</a></li>
        <li class="is-featured"><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Malina</span></li>
        <li class="is-featured"><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Truskawka</span></li>
        <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Porzeczka</span></li>
        <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Aronia</span></li>
        <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Winogrono</span></li>
      </ul>
    </details>
    <details class="cw-mobilenav__group" name="cw-uprawy">
      <summary class="wf-navitem cw-mobilenav__sub">Drzewa sadownicze<svg class="wf-icon wf-icon--sm cw-mobilenav__chev" aria-hidden="true"><use href="#ti-chevron-down"></use></svg></summary>
      <ul class="cw-crops__list">
        <li class="is-featured"><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Jabłoń</span></li>
        <li class="is-featured"><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Grusza</span></li>
        <li class="is-featured"><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Czereśnia</span></li>
        <li class="is-featured"><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Wiśnia</span></li>
        <li class="is-featured"><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Morela / Brzoskwinia</span></li>
      </ul>
    </details>
    <details class="cw-mobilenav__group" name="cw-uprawy">
      <summary class="wf-navitem cw-mobilenav__sub">Warzywnicze<svg class="wf-icon wf-icon--sm cw-mobilenav__chev" aria-hidden="true"><use href="#ti-chevron-down"></use></svg></summary>
      <ul class="cw-crops__list">
        <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Papryka</span></li>
        <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Ogórek</span></li>
        <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Pomidor</span></li>
        <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Kapustne</span></li>
      </ul>
    </details>
    <details class="cw-mobilenav__group" name="cw-uprawy">
      <summary class="wf-navitem cw-mobilenav__sub">Rolnicze<svg class="wf-icon wf-icon--sm cw-mobilenav__chev" aria-hidden="true"><use href="#ti-chevron-down"></use></svg></summary>
      <div class="cw-crops__split">
        <div class="cw-crops__season">
          <span class="cw-crops__season-name">Ozime</span>
          <ul class="cw-crops__list">
            <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Rzepak ozimy</span></li>
            <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Pszenica ozima</span></li>
            <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Pszenżyto ozime</span></li>
            <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Jęczmień ozimy</span></li>
            <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Żyto</span></li>
          </ul>
        </div>
        <div class="cw-crops__season">
          <span class="cw-crops__season-name">Jare</span>
          <ul class="cw-crops__list">
            <li class="is-featured"><a class="cw-crop" data-nav="kukurydza" data-nav-parent="uprawy" href="kukurydza.html">Kukurydza</a></li>
            <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Słonecznik</span></li>
            <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Soja</span></li>
            <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Burak cukrowy</span></li>
            <li class="is-featured"><a class="cw-crop" data-nav="ziemniak" data-nav-parent="uprawy" href="ziemniak.html">Ziemniak</a></li>
            <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Jęczmień jary</span></li>
            <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Owies</span></li>
          </ul>
        </div>
      </div>
    </details>
    <details class="cw-mobilenav__group" name="cw-uprawy">
      <summary class="wf-navitem cw-mobilenav__sub">Rośliny ozdobne<svg class="wf-icon wf-icon--sm cw-mobilenav__chev" aria-hidden="true"><use href="#ti-chevron-down"></use></svg></summary>
      <ul class="cw-crops__list">
        <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Trawnik</span></li>
        <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Liściaste</span></li>
        <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Iglaste</span></li>
        <li><span class="cw-crop cw-crop--soon" title="Strona w przygotowaniu">Kwasolubne</span></li>
      </ul>
    </details>
    <a class="wf-navitem" data-nav="prochnica-plus" href="prochnica-plus.html">Programy i badania</a>
    <a class="wf-navitem" data-nav="centrum-wiedzy" href="centrum-wiedzy.html">Strefa wiedzy</a>
    <a class="wf-navitem" data-nav="o-firmie" href="o-firmie.html">O nas</a>
    <a class="wf-navitem" data-nav="kontakt" href="kontakt.html">Kontakt</a>
    <a class="wf-navitem" data-nav="sklep" href="sklep.html">Sklep</a>
  </nav>
</header>`;

  var SCRIM = '<div class="cw-scrim" data-cw-scrim data-open="false" aria-hidden="true"></div>';

  /* CE-04 – site footer, design system v0.1 (Figma 397:1668, decision 3 of
     17.10.2026): a dark panel with 32 px bottom corners (claim, contact button,
     three link columns) over a photo strip with the white logo and the small
     print. Links and texts are those of the v7 footer; the claim is the v7
     brand line split as in Figma. Styles: ce/CE-04-stopka.css. The photo comes
     from the Figma file – licence unconfirmed, local only (backlog). */
  var FOOTER = `<footer class="cw-foot" id="serwis-stopka" data-ce="CE-04">
  <div class="cw-foot__panel">
    <div class="cw-foot__in cw-foot__grid">
      <div class="cw-foot__brand">
        <p class="cw-foot__claim">Polski, rodzinny producent poprawiaczy gleby z lignitu i leonardytu.</p>
        <p class="cw-foot__sub">Dbając o glebę, inwestujemy w przyszłe pokolenia.</p>
        <a class="cw-foot__btn" href="kontakt.html">Kontakt z nami<svg class="wf-icon" aria-hidden="true"><use href="#ch-liscie"></use></svg></a>
      </div>
      <div class="cw-foot__cols">
        <nav class="cw-foot__col" aria-label="Produkty"><p class="cw-foot__head">Produkty</p>
          <a href="produkty.html">Produkty Carbohort</a>
          <a href="carbomat.html">Carbomat Eco</a>
          <a href="carbomat-mata.html">Carbomat Mata Uprawowa</a>
          <a href="carbohumic-doglebowy.html">Carbohumic doglebowy</a>
          <a href="carbohumic-dolistny.html">Carbohumic dolistny</a>
          <a href="carbomat-humic.html">Carbomat Humic</a>
          <a href="sklep.html">Sklep</a>
        </nav>
        <nav class="cw-foot__col" aria-label="Wiedza i programy"><p class="cw-foot__head">Wiedza i programy</p>
          <a href="centrum-wiedzy.html">Strefa wiedzy</a>
          <a href="prochnica-plus.html">Program Próchnica+</a>
          <a href="uprawy.html">Rodzaje upraw</a>
          <a href="konfigurator.html">Konfigurator</a>
        </nav>
        <nav class="cw-foot__col" aria-label="Firma i współpraca"><p class="cw-foot__head">Firma i współpraca</p>
          <a href="o-firmie.html">O nas</a>
          <a href="kontakt.html">Kontakt</a>
          <a href="kontakt.html#partner">Zostań partnerem</a>
          <a href="logowanie.html?tryb=b2b">Panel / Zaloguj</a>
        </nav>
      </div>
    </div>
  </div>
  <div class="cw-foot__strip">
    <img class="cw-foot__photo" src="img/foto/stopka-mikroskop.jpg" alt="" loading="lazy" decoding="async">
    <div class="cw-foot__in cw-foot__base">
      <img class="cw-foot__logo" src="img/carbohort-logo-biale.svg" width="559" height="110" alt="Carbohort">
      <p class="cw-foot__note">© Carbohort – makieta. Treść i dane do akceptacji.</p>
      <p class="cw-foot__note">PL · poprawa gleby z lignitu</p>
    </div>
  </div>
</footer>`;

  /* ===== B2B platform: panel header (CE-91) and panel footer (CE-04 "panel") ===== */
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* Names come from the sample data script (b2b-wspolne.js, window.CWB2B) that
     stands in <head> before this file; the fallback keeps the header complete
     on a page that does not load it. */
  function b2bName(key, fallback) {
    var d = window.CWB2B && window.CWB2B[key];
    return (d && d.nazwa) || fallback;
  }
  var KLIENT = "Gospodarstwo Sadownicze Zielony Jar (przykład)";
  var OPIEKUN = "Anna Przykładowa (przykład)";

  /* data-nav → file → label; data-current on <cw-navbar> picks the current one. */
  var PANEL_TABS = [
    ["pulpit", "platforma-b2b.html", "Pulpit"],
    ["zamow", "b2b-zamow.html", "Zamów"],
    ["zamowienia", "b2b-zamowienia.html", "Zamówienia"],
    ["oferty", "b2b-oferta.html", "Oferty"],
    ["dokumenty", "b2b-dokumenty.html", "Dokumenty"],
    ["opiekun", "b2b-opiekun.html", "Opiekun"]
  ];
  var DESK_TABS = [["zamowienia", "admin.html", "Zamówienia klientów"]];

  /* Two rows: brand, area label, account name and links; below them the tabs –
     plain links in a <nav>, the current one gets aria-current (no tab roles). */
  function panelbar(desk) {
    var tabs = desk ? DESK_TABS : PANEL_TABS, li = "", i;
    for (i = 0; i < tabs.length; i++) {
      li += '\n        <li><a class="c5-panelbar__tab" data-nav="' + tabs[i][0] + '" href="' + tabs[i][1] + '">' + tabs[i][2] + "</a></li>";
    }
    return '<header class="c5-panelbar' + (desk ? " c5-panelbar--handlowiec" : "") + '" id="panel-naglowek" data-ce="CE-91"' +
      (desk ? ' data-ce-wariant="handlowiec"' : "") + `>
  <div class="c5-wrap c5-wrap--wide">
    <div class="c5-panelbar__top">
      <a class="c5-panelbar__brand" href="` + (desk ? "admin.html" : "platforma-b2b.html") + `">Carbohort</a>
      <span class="c5-panelbar__area">` + (desk ? "Stanowisko handlowca" : "Platforma B2B") + `</span>
      <span class="c5-panelbar__who"><span class="wf-sr-only">` + (desk ? "Zalogowany pracownik: " : "Zalogowane konto: ") + "</span>" +
        esc(desk ? b2bName("opiekun", OPIEKUN) : b2bName("klient", KLIENT)) + `</span>
      <div class="c5-panelbar__links">` + (desk ? "" : `
        <a class="c5-panelbar__link" href="home.html?widok=pro">Strona CarboHort<svg class="wf-icon wf-icon--sm" aria-hidden="true"><use href="#ti-external-link"></use></svg></a>`) + `
        <a class="c5-panelbar__link" href="` + (desk ? "logowanie.html" : "logowanie.html?tryb=b2b") + `">Wyloguj</a>
      </div>
    </div>
    <nav class="c5-panelbar__tabs" aria-label="` + (desk ? "Stanowisko handlowca" : "Platforma B2B") + `">
      <ul>` + li + `
      </ul>
    </nav>
  </div>
</header>`;
  }

  /* Below 900 px the tabs scroll sideways; the current one is brought to the
     middle of the strip. The strip's own scrollLeft is set instead of calling
     scrollIntoView, so a page opened at an anchor is never moved vertically. */
  function centerTab(host) {
    var strip = host.querySelector(".c5-panelbar__tabs");
    var tab = strip && strip.querySelector('[aria-current="page"]');
    if (!tab || strip.scrollWidth <= strip.clientWidth) return;
    var s = strip.getBoundingClientRect(), t = tab.getBoundingClientRect();
    strip.scrollLeft += (t.left + t.width / 2) - (s.left + s.width / 2);
  }

  /* The sales desk is not a customer account: its footer links to the site
     without the professional state and carries no platform terms. */
  function footerPanel(desk) {
    return `<footer class="wf-footer cw-footer--panel" id="serwis-stopka" data-ce="CE-04" data-ce-wariant="panel">
  <div class="c5-wrap c5-wrap--wide">
    <div class="wf-cluster wf-cluster--between">
      <span class="wf-caption wf-t-secondary">© Carbohort – makieta. Kwoty i dane przykładowe.</span>
      <span class="wf-cluster wf-gap-4">` + (desk ? "" : `
        <button type="button" class="wf-link--quiet wf-caption">Regulamin platformy</button>`) + `
        <a class="wf-link--quiet wf-caption" href="` + (desk ? "home.html" : "home.html?widok=pro") + `">Strona CarboHort</a>
      </span>
    </div>
  </div>
</footer>`;
  }

  /* ===== CE-01, state "zalogowany-pro" ======================================
     A professional account looking at the site: a strip above the header with
     the account name, the way back to the panel and a link to a product page,
     and the "Panel B2B" button in place of the cart icon. Everything is added
     and taken away in place – the header itself is not rendered again, so the
     listeners cw.js hangs on it stay. `carry` says how the state travels on
     the local links of the header and the strip – in the form it came in:
     "?" appends ?widok=pro, "#" appends #widok=pro (a link with its own anchor
     keeps it), "" leaves the links alone. The product page link is left out
     on the product pages themselves. */
  function proBar(carry) {
    var onPdp = /(?:^|\/)pdp(?:-kwasny)?\.html$/.test(location.pathname || "");
    return '<div class="wf-container cw-probar__inner">' +
      '<span class="cw-probar__who">Zalogowany: <b>' + esc(b2bName("klient", KLIENT)) + "</b></span>" +
      '<a class="cw-probar__link" href="platforma-b2b.html">← wróć do panelu B2B</a>' +
      (onPdp ? "" : '<a class="cw-probar__link" href="pdp.html' + (carry === "#" ? "#widok=pro" : "?widok=pro") + '">Zobacz kartę produktu</a>') +
      "</div>";
  }

  function setPro(host, on, carry) {
    var head = host.querySelector("#serwis-naglowek");
    if (!head) return;
    var bar = host.querySelector(".cw-probar");
    if (!!bar === !!on) return;
    var cart = head.querySelector("a.cw-cart"), btn = head.querySelector("[data-cw-panelbtn]");
    var mini = head.querySelector("[data-cw-minicart]");

    if (!on) {
      bar.parentNode.removeChild(bar);
      if (btn) btn.parentNode.removeChild(btn);
      if (cart) { cart.hidden = false; cart.style.display = ""; }
      head.classList.remove("cw-nav--pro");
      head.removeAttribute("data-ce-wariant");
      head.removeAttribute("data-ce-od");
      (host._cwCarried || []).forEach(function (p) { p[0].setAttribute("href", p[1]); });
      host._cwCarried = null;
      return;
    }

    bar = document.createElement("div");
    bar.className = "cw-probar";
    bar.id = "serwis-pasek-pro";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Konto profesjonalne");
    bar.innerHTML = proBar(carry);
    host.insertBefore(bar, head);

    if (cart) {
      btn = document.createElement("a");
      btn.className = "wf-btn wf-btn--secondary wf-btn--sm cw-probar-btn";
      btn.setAttribute("data-cw-panelbtn", "");
      btn.href = "platforma-b2b.html";
      btn.textContent = "Panel B2B";
      cart.parentNode.insertBefore(btn, cart);
      /* The cart link stays in the DOM, hidden, so the preview wiring of cw.js
         survives switching the state off again. */
      cart.hidden = true;
      cart.style.display = "none";
    }
    if (mini) mini.setAttribute("data-open", "false");
    head.classList.add("cw-nav--pro");
    head.setAttribute("data-ce-wariant", "zalogowany-pro");
    head.setAttribute("data-ce-od", "#serwis-pasek-pro");

    if (carry) {
      var done = [];
      Array.prototype.forEach.call(host.querySelectorAll("a[href]"), function (a) {
        /* m[2] – own query (e.g. the CE-95 promotion link): widok=pro is appended to it */
        var h = a.getAttribute("href"), m = /^([a-z0-9-]+\.html)(\?[^#]*)?(#.*)?$/i.exec(h || "");
        if (!m || m[1] === "platforma-b2b.html") return;
        if (carry === "#" && m[3]) return; /* a link with its own anchor keeps it */
        done.push([a, h]);
        a.setAttribute("href", carry === "#" ? m[1] + (m[2] || "") + "#widok=pro"
          : m[1] + (m[2] ? m[2] + "&" : "?") + "widok=pro" + (m[3] || ""));
      });
      host._cwCarried = done;
    }
  }

  function proInQuery() { return /[?&]widok=pro(?:&|$)/.test(location.search || ""); }
  function proInHash() { return /(?:^#|&)widok=pro(?:&|$)/.test(location.hash || ""); }
  function proCarry() { return proInQuery() ? "?" : proInHash() ? "#" : ""; }

  document.addEventListener("cw:widok", function (e) {
    var host = document.querySelector("cw-navbar:not([data-uklad])");
    if (host) setPro(host, !!(e.detail && e.detail.pro), proCarry());
  });

  /* ===== CE-95 – promotion strip above the site menu =====================
     Inserted as the first child of header.wf-navbar, so ce/00-base.js
     (--cx-navbar-h) and c5.js (sub-navigation) measure it together with the
     menu. Storage may be blocked (private mode, previews) – then the strip
     still closes, until the next reload. */
  var PROMO_KEY = "cw-promo-zamknieta:" + PROMO.id;
  function promoClosed() {
    try { return window.localStorage.getItem(PROMO_KEY) === "1"; } catch (e) { return false; }
  }
  function promoSheet() {
    if (document.querySelector("link[data-cw-promo-css]")) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = HERE + "ce/CE-95-pasek-promocji.css";
    l.setAttribute("data-cw-promo-css", "");
    /* keep the first paint from showing the strip unstyled (Chromium) */
    l.setAttribute("blocking", "render");
    document.head.appendChild(l);
  }

  /* CE module stylesheet attached by this file (CE-02, CE-05) – once per page,
     render-blocking like the promotion strip above. */
  function ceSheet(file) {
    if (document.querySelector('link[data-cw-ce-css="' + file + '"]')) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = HERE + "ce/" + file;
    l.setAttribute("data-cw-ce-css", file);
    l.setAttribute("blocking", "render");
    document.head.appendChild(l);
  }
  function promoBar(head) {
    if (!PROMO.wlaczona || !promoPage() || !head || promoClosed() || head.querySelector(".c5-promo")) return;
    promoSheet();
    var href = HERE ? HERE + PROMO.adres : PROMO.adres;
    var bar = document.createElement("div");
    bar.className = "c5-promo";
    bar.id = "serwis-promocja";
    bar.setAttribute("data-ce", "CE-95");
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", PROMO.etykieta);
    bar.innerHTML = '<div class="wf-container c5-promo__in">' +
      '<p class="c5-promo__txt"><span class="c5-promo__badge">' + esc(PROMO.etykieta) + "</span>" +
      '<span class="c5-promo__t">' + esc(PROMO.tekst) + "</span>" +
      '<a class="c5-promo__link" href="' + esc(href) + '">' + esc(PROMO.link) + "</a></p>" +
      '<button type="button" class="c5-promo__x" data-cw-promo-close aria-label="Zamknij">' +
      '<svg class="wf-icon" aria-hidden="true"><use href="#ti-x"></use></svg></button></div>';
    head.insertBefore(bar, head.firstChild);

    /* height of the strip -> --c5-promo-h on the header (sticky header offset) */
    var setH = function () {
      if (bar.isConnected) head.style.setProperty("--c5-promo-h", Math.round(bar.getBoundingClientRect().height) + "px");
    };
    setH();
    if (window.ResizeObserver) new ResizeObserver(setH).observe(bar);

    bar.querySelector("[data-cw-promo-close]").addEventListener("click", function () {
      try { window.localStorage.setItem(PROMO_KEY, "1"); } catch (e) {}
      var focusTo = head.querySelector(".cw-brand");
      bar.parentNode.removeChild(bar);
      head.style.removeProperty("--c5-promo-h");
      if (focusTo && focusTo.focus) focusTo.focus();
      /* ce/00-base.js re-measures --cx-navbar-h on resize */
      try { window.dispatchEvent(new Event("resize")); } catch (e) {}
    });
  }

  var DOCK = `<!-- ===== dr Jurek – pływający dok (ukryty do przewinięcia) ===== -->
<div class="cw-jurek-backdrop" data-jurek-backdrop data-open="false" aria-hidden="true"></div>
<div class="cw-jurek" id="serwis-dok" data-ce="CE-05" data-jurek-dock data-open="false">
  <div class="cw-jurek__panel" role="dialog" aria-label="Wirtualny dr Jurek">
    <div class="cw-jurek__head">
      <span class="wf-ph wf-ph--avatar" aria-hidden="true"></span>
      <div class="wf-stack wf-stack--1" style="flex:1;">
        <span class="wf-w-semibold">Wirtualny dr Jurek</span>
        <span class="wf-small wf-t-secondary">asystent doboru i wiedzy</span>
      </div>
      <button class="wf-btn wf-btn--ghost wf-btn--icon" data-jurek-close aria-label="Zamknij"><svg class="wf-icon" aria-hidden="true"><use href="#ti-x"></use></svg></button>
    </div>
    <div class="cw-jurek__msgs" data-jurek-msgs></div>
    <p class="wf-caption wf-t-tertiary" style="padding:0 var(--w-space-4) var(--w-space-3);">Makieta · odpowiedzi demonstracyjne.</p>
  </div>
  <form class="cw-jurek__bar" data-jurek-form>
    <svg class="wf-icon wf-icon--muted" aria-hidden="true" style="align-self:center;"><use href="#ti-message-2"></use></svg>
    <input class="wf-input" type="text" data-jurek-input placeholder="Zapytaj o dobór, dawki, uprawę…" aria-label="Zapytaj dr Jurka">
    <button class="wf-btn wf-btn--primary wf-btn--icon" type="submit" aria-label="Wyślij"><svg class="wf-icon" aria-hidden="true"><use href="#ti-send"></use></svg></button>
  </form>
</div>`;

  /* Znacznik bieżącej sekcji – ustawiany z data-current na <cw-navbar>. */
  function markCurrent(root, key) {
    if (!key) return;
    var els = root.querySelectorAll('[data-nav="' + key + '"]');
    if (!els.length) return;
    Array.prototype.forEach.call(els, function (el) {
      el.setAttribute("aria-current", "page");
      if (el.classList.contains("wf-navitem")) el.className += " wf-w-semibold";
      /* Pozycja siedząca w rozwijanej grupie (uprawy w nawigacji mobilnej) ma
         być widoczna od razu, bez rozwijania grupy ręką – otwieramy jej
         <details>. Grupy mają wspólny atrybut name, więc otwarta zostaje jedna. */
      var det = el.closest && el.closest("details");
      if (det) det.open = true;
    });
    var el = els[0];
    /* Pozycja drugiego poziomu podświetla też swojego rodzica, żeby nie zgubić
       orientacji, w której sekcji serwisu jesteśmy. */
    var parent = el.getAttribute("data-nav-parent");
    if (parent) {
      var pe = root.querySelector('[data-nav="' + parent + '"]');
      if (pe) pe.className += " wf-w-semibold";
    }
  }

  /* ===== CE-02 "grupy-ze-zdjeciem" – the panel starts under its trigger ======
     The right edge is set in CSS (the right edge of the content container);
     this sets the left edge to the left edge of the trigger, measured on every
     opening and on window resize while open. The left edge stays under the
     trigger at every desktop width (981 px and up); when the panel gets
     narrow, CSS drops the photo first (container query in
     ce/CE-02-mega-menu.css). Only a panel narrower than CROP_MIN_REM (the
     groups and the list without a photo, a safety net for a large root font
     size) keeps that width and moves left, never past the left edge of the
     container (the container is symmetric, so its left inset equals the
     right one). Styles: ce/CE-02-mega-menu.css (--cw-mega-left). */
  var CROP_MIN_REM = 36;
  function placeCropPanel(root, mega) {
    var trig = mega && mega.id && root.querySelector('[aria-controls="' + mega.id + '"]');
    if (!trig) return;
    function place() {
      if (mega.getAttribute("data-open") !== "true") return;
      var host = mega.offsetParent;
      if (!host) return;
      var hb = host.getBoundingClientRect(), tb = trig.getBoundingClientRect();
      var inset = parseFloat(getComputedStyle(mega).right) || 0;
      var rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      var left = Math.min(tb.left - hb.left, hb.width - inset - CROP_MIN_REM * rem);
      mega.style.setProperty("--cw-mega-left", Math.round(Math.max(inset, left)) + "px");
    }
    if (window.MutationObserver) {
      new MutationObserver(place).observe(mega, { attributes: true, attributeFilter: ["data-open"] });
    }
    window.addEventListener("resize", place);
  }

  /* ===== CE-02 "grupy-ze-zdjeciem" – group switcher of #mega-uprawy =========
     Vertical tabs on the left, one tab panel (list + photo) per group. */
  var AIM_DELAY = 280;   /* ms a pointer heading for the list may cross other groups */
  function bindCropSwitch(root) {
    var box = root.querySelector("[data-crop-switch]");
    if (!box) return;
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return box.querySelector("#" + t.getAttribute("aria-controls")); });
    var cur = -1, hover = -1, timer = 0, trail = [];

    function select(i, focus) {
      if (i < 0 || i >= tabs.length) return;
      clearTimeout(timer); timer = 0;
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (panels[k]) panels[k].hidden = !on;
      });
      cur = i;
      if (focus) tabs[i].focus();
    }

    /* Default: the group holding the current page (markCurrent ran before), else the first. */
    var start = 0;
    panels.forEach(function (p, k) { if (p && p.querySelector('[aria-current="page"]')) start = k; });
    select(start, false);

    /* Photos load only once the panel is first opened; then all five at once,
       so switching groups never shows an empty frame. */
    var mega = box.closest(".cw-mega"), warm = false;
    placeCropPanel(root, mega);
    function warmUp() {
      if (warm) return;
      warm = true;
      Array.prototype.forEach.call(box.querySelectorAll("img[loading]"), function (im) { im.loading = "eager"; });
    }
    if (mega && window.MutationObserver) {
      new MutationObserver(function () {
        if (mega.getAttribute("data-open") === "true") warmUp();
      }).observe(mega, { attributes: true, attributeFilter: ["data-open"] });
    }

    /* Intent triangle: is the pointer moving from the group column towards the
       left edge of the open panel (between its top and bottom corner)?
       The trail only describes the current stroke: a pause (PAUSE ms without
       movement) or a horizontal turn starts a new one from the last
       point, so an earlier approach from the right never counts as aiming. */
    var PAUSE = 100;
    function slope(a, b) { return (b[1] - a[1]) / ((b[0] - a[0]) || 0.0001); }
    function aiming() {
      var p = panels[cur];
      if (!p || trail.length < 2) return false;
      var r = p.getBoundingClientRect();
      var prev = trail[0], now = trail[trail.length - 1];
      if (now[0] >= r.left || now[0] <= prev[0]) return false;
      var up = [r.left, r.top - 8], down = [r.left, r.bottom + 8];
      return slope(now, up) < slope(prev, up) && slope(now, down) > slope(prev, down);
    }
    function track(e) {
      var t = e.timeStamp || Date.now(), last = trail[trail.length - 1];
      if (last) {
        if (last[0] === e.clientX && last[1] === e.clientY) { last[2] = t; return; }
        var gone = t - last[2] > PAUSE;
        var turn = trail.length > 1 && (e.clientX - last[0]) * (last[0] - trail[trail.length - 2][0]) < 0;
        if (gone || turn) trail = [last];
      }
      trail.push([e.clientX, e.clientY, t]);
      if (trail.length > 4) trail.shift();
    }
    function tryHover() {
      timer = 0;
      if (hover < 0 || hover === cur) return;
      if (aiming()) { timer = setTimeout(tryHover, AIM_DELAY); trail = trail.slice(-1); return; }
      select(hover, false);
    }
    box.addEventListener("mousemove", track);
    tabs.forEach(function (t, i) {
      t.addEventListener("mouseenter", function (e) {
        /* boundary events come before the mousemove that caused them */
        track(e);
        hover = i;
        if (i === cur) { clearTimeout(timer); timer = 0; trail = trail.slice(-1); return; }
        if (!timer) tryHover();
      });
      t.addEventListener("mouseleave", function () { if (hover === i) hover = -1; });
      /* touch, pen and click: the first tap shows the list */
      t.addEventListener("click", function () { select(i, false); });
      t.addEventListener("focus", function () { if (cur !== i) select(i, false); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, n = tabs.length, to = -1;
        if (k === "ArrowDown") to = (i + 1) % n;
        else if (k === "ArrowUp") to = (i - 1 + n) % n;
        else if (k === "Home") to = 0;
        else if (k === "End") to = n - 1;
        if (to < 0) return;
        e.preventDefault();
        select(to, true);
      });
    });
    box.addEventListener("mouseleave", function () { hover = -1; clearTimeout(timer); timer = 0; trail = []; });
  }

  /* ===== CE-05 – hidden over the opening block of the page =================
     One rule for every page with <cw-dock>: while the opening block is on
     screen the floating dock hides (cx-dockhide; styles in cw.css) and it shows
     once the reader has scrolled past 60 % of that block. The opening block is
     #hero, else the section marked [data-dock-hero], else the first section of
     <main>. An open dock and a landed dock stay visible (CSS). */
  function dockHero(host) {
    /* runs before dockLanding(), which moves the dock out of its host */
    var dock = host.querySelector(".cw-jurek");
    var hero = document.getElementById("hero") || document.querySelector("[data-dock-hero]") ||
      document.querySelector("main > section, main section");
    if (!dock || !hero) return;
    var raf = 0;
    function check() {
      raf = 0;
      dock.classList.toggle("cx-dockhide", window.scrollY <= hero.offsetHeight * 0.6);
    }
    function ask() { if (!raf) raf = requestAnimationFrame(check); }
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", ask);
    window.addEventListener("load", ask);
    check();
  }

  /* ===== CE-05 – landing section above the footer ==========================
     Inserted once, right before <cw-footer>; the dock moves right below the
     section, so the footer follows it. The dock is sticky (CSS), the script
     only tells the two states apart: floating (stuck to the bottom edge) and
     landed (standing in its own place, i.e. above the bottom edge). */
  var LAND_TITLE = "Czy chcesz jeszcze o coś zapytać?";
  var LAND_LEAD = "Jeśli masz pytanie o tę stronę albo inne zagadnienie, zadaj je tutaj.";
  function dockLanding(host) {
    var dock = host.querySelector(".cw-jurek");
    var foot = document.querySelector("cw-footer");
    if (!dock || !foot || !foot.parentNode || document.getElementById("serwis-dok-sekcja")) return;
    /* the site footer only – the B2B panel has no dock anyway */
    ceSheet("CE-05-dok-doradcy.css");

    var sec = document.createElement("section");
    sec.className = "cw-dockland";
    sec.id = "serwis-dok-sekcja";
    sec.setAttribute("aria-labelledby", "serwis-dok-tytul");
    sec.innerHTML = '<div class="cw-dockland__in">' +
      '<h2 class="cw-dockland__title" id="serwis-dok-tytul">' + esc(LAND_TITLE) + "</h2>" +
      '<p class="cw-dockland__lead">' + esc(LAND_LEAD) + "</p></div>";
    foot.parentNode.insertBefore(sec, foot);
    foot.parentNode.insertBefore(dock, foot);
    dock.classList.add("cw-jurek--land");

    var bar = dock.querySelector(".cw-jurek__bar");
    var landed = false, raf = 0, busy = 0, vw = 0;
    function apply(on) {
      if (on === landed) return;
      landed = on;
      dock.classList.toggle("is-landed", on);
      sec.classList.toggle("is-on", on);
      /* the bar height animates for .4s after each switch; no re-measuring
         until it settles (a mid-transition value would become the new base) */
      clearTimeout(busy);
      busy = setTimeout(function () { busy = 0; }, 600);
    }
    /* Natural height of the floating bar (--cw-dock-h0). The landed bar grows
       by a fixed amount above it and the dock pulls itself up by the same
       amount, so its bottom edge – and the footer below – never move.
       Measured with the inline height lifted (height:auto, no transition),
       never from the animated value; only while floating and settled. */
    function sizeBar() {
      if (!bar || landed || busy) return;
      var ts = bar.style.transition;
      bar.style.transition = "none";
      bar.style.height = "auto";
      var h = bar.getBoundingClientRect().height;
      bar.style.height = "";
      if (h > 0) dock.style.setProperty("--cw-dock-h0", h + "px");
      void bar.offsetHeight;
      bar.style.transition = ts;
      vw = window.innerWidth;
    }
    /* The chat panel opens above the bar. A landed dock can stand high in the
       window (the footer below it), and then the panel would leave the top
       edge: it opens below the bar instead (is-drop), and its message list is
       capped to the room on the chosen side. The floating dock is untouched. */
    var panel = dock.querySelector(".cw-jurek__panel");
    var msgs = dock.querySelector(".cw-jurek__msgs");
    function place() {
      if (!panel || !bar) return;
      if (msgs) msgs.style.maxHeight = "";
      if (!landed || dock.getAttribute("data-open") !== "true") {
        dock.classList.remove("is-drop");
        return;
      }
      var r = bar.getBoundingClientRect(), pad = 24;
      var above = r.top - pad, below = window.innerHeight - r.bottom - pad;
      var need = panel.getBoundingClientRect().height;
      var drop = need > above && below > above;
      dock.classList.toggle("is-drop", drop);
      var room = drop ? below : above;
      if (msgs && need > room) {
        var rest = need - msgs.getBoundingClientRect().height;
        msgs.style.maxHeight = Math.max(120, Math.floor(room - rest)) + "px";
      }
    }
    if (window.MutationObserver) {
      new MutationObserver(place).observe(dock, { attributes: true, attributeFilter: ["data-open"] });
    }
    function measure() {
      raf = 0;
      if (window.innerWidth !== vw) sizeBar();
      var cs = getComputedStyle(dock);
      var stick = parseFloat(cs.bottom) || 0;
      /* the tucked dock (G10) is moved down by a transform; the slot is the box
         without it, so the shift is taken off before comparing */
      var ty = 0;
      if (cs.transform && cs.transform !== "none" && window.DOMMatrixReadOnly) ty = new DOMMatrixReadOnly(cs.transform).m42;
      var gap = window.innerHeight - stick - (dock.getBoundingClientRect().bottom - ty);
      apply(landed ? gap > 0.5 : gap > 1.5);
      if (dock.getAttribute("data-open") === "true") place();
    }
    function ask() { if (!raf) raf = requestAnimationFrame(measure); }
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", ask);
    window.addEventListener("load", function () { vw = 0; ask(); });
    if (window.ResizeObserver) new ResizeObserver(ask).observe(document.body);

    /* G10 (Mateusz 18.10.2026): until the dock gets a better form, the floating
       dock waits tucked under the bottom edge – a 15 px strip at 25 % – and
       slides up to its full form under the pointer or the keyboard focus
       (ce/CE-05-dok-doradcy.css). A touch screen has no hover: the first tap on
       the strip only lifts the dock (is-peek, the tap does not reach the field),
       a tap elsewhere tucks it again. */
    function tucked() {
      return !landed && dock.getAttribute("data-open") !== "true" &&
        !dock.classList.contains("is-peek") && !dock.contains(document.activeElement);
    }
    dock.addEventListener("touchstart", function (e) {
      if (!tucked()) return;
      e.preventDefault();
      dock.classList.add("is-peek");
    }, { passive: false });
    document.addEventListener("touchstart", function (e) {
      if (dock.classList.contains("is-peek") && !dock.contains(e.target) && dock.getAttribute("data-open") !== "true") {
        dock.classList.remove("is-peek");
      }
    }, { passive: true });
    sizeBar();
    ask();
  }

  /* ===== EL-01 – motion of the buttons (G04, Mateusz 18.10.2026) =============
     Hover of an L button: the label moves 4 px to the right and the icon at its
     end moves in its own way (Figma 938:1629 – the four leaves of the sign draw
     closer; the sliders – the two knobs run in opposite directions). CSS
     (ce/00-base.css, c5.css) can move only elements, so this block:
     - wraps every non-empty text node that is a direct child of .c5-btn in
       <span class="c5-btn__t">;
     - gives a button with `c5-btn--ico-liscie` / `c5-btn--ico-suwaki` an inline
       copy of its icon (.c5-btn__ico, parts with classes), which replaces the
       CSS mask icon (::after) while it is there.
     Runs once the document is parsed and again lazily when the pointer enters a
     button, so buttons built later by page scripts (or relabelled with
     textContent) get it too. Without this file the buttons keep the static look. */
  var ICO_LEAVES = '<svg class="c5-btn__ico" viewBox="0 0 19 19" aria-hidden="true" focusable="false"><g fill="currentColor">' +
    '<g transform="translate(1.117 2.352)"><path class="c5-ico-tl" d="M6.40047 5.58824C6.47878 5.58824 6.55709 5.58824 6.6354 5.5805C6.71371 5.57276 6.69022 5.55728 6.69022 5.52632C6.70588 5.44118 6.70588 5.36378 6.70588 5.28638C6.70588 2.36842 4.30958 0 1.35727 0C-1.59504 0 1.20065 0 1.12233 0.00773994C1.04402 0.0154799 1.06752 0.0309598 1.06752 0.0619195C1.06752 0.139319 1.05969 0.216718 1.05969 0.294118C1.05969 3.21207 3.45599 5.5805 6.4083 5.5805L6.40047 5.58824Z"/>' +
    '<path class="c5-ico-bl" d="M1.41234 14.4115C1.33484 14.4115 1.25733 14.4115 1.17982 14.4037C1.10232 14.396 1.12557 14.3805 1.12557 14.3495C1.12557 14.272 1.11782 14.1945 1.11782 14.117C1.11782 11.1949 3.48953 8.82324 6.41153 8.82324C6.48904 8.82324 6.56654 8.82324 6.64405 8.83099C6.72156 8.83874 6.6983 8.85425 6.6983 8.88525C6.70605 8.96275 6.70605 9.04026 6.70605 9.11777C6.70605 12.0398 4.33435 14.4115 1.41234 14.4115Z"/></g>' +
    '<g transform="translate(17.765 2.352) scale(-1 1)"><path class="c5-ico-tl" d="M6.40047 5.58824C6.47878 5.58824 6.55709 5.58824 6.6354 5.5805C6.71371 5.57276 6.69022 5.55728 6.69022 5.52632C6.70588 5.44118 6.70588 5.36378 6.70588 5.28638C6.70588 2.36842 4.30958 0 1.35727 0C-1.59504 0 1.20065 0 1.12233 0.00773994C1.04402 0.0154799 1.06752 0.0309598 1.06752 0.0619195C1.06752 0.139319 1.05969 0.216718 1.05969 0.294118C1.05969 3.21207 3.45599 5.5805 6.4083 5.5805L6.40047 5.58824Z"/>' +
    '<path class="c5-ico-bl" d="M1.41234 14.4115C1.33484 14.4115 1.25733 14.4115 1.17982 14.4037C1.10232 14.396 1.12557 14.3805 1.12557 14.3495C1.12557 14.272 1.11782 14.1945 1.11782 14.117C1.11782 11.1949 3.48953 8.82324 6.41153 8.82324C6.48904 8.82324 6.56654 8.82324 6.64405 8.83099C6.72156 8.83874 6.6983 8.85425 6.6983 8.88525C6.70605 8.96275 6.70605 9.04026 6.70605 9.11777C6.70605 12.0398 4.33435 14.4115 1.41234 14.4115Z"/></g>' +
    "</g></svg>";
  /* the leaf paths are those of the ch-liscie symbol above (both halves alike) */
  var ICO_SLIDERS = '<svg class="c5-btn__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path class="c5-ico-s1" d="M20 7h-9"/><path class="c5-ico-s2" d="M14 17H5"/><circle class="c5-ico-k1" cx="7" cy="7" r="3"/><circle class="c5-ico-k2" cx="17" cy="17" r="3"/></svg>';
  function btnMotion(b) {
    var n = b.firstChild, next;
    while (n) {
      next = n.nextSibling;
      if (n.nodeType === 3 && /\S/.test(n.nodeValue)) {
        var t = document.createElement("span");
        t.className = "c5-btn__t";
        b.insertBefore(t, n);
        t.appendChild(n);
      }
      n = next;
    }
    if (!b.querySelector(":scope > .c5-btn__ico")) {
      var ico = b.classList.contains("c5-btn--ico-liscie") ? ICO_LEAVES :
        b.classList.contains("c5-btn--ico-suwaki") ? ICO_SLIDERS : "";
      if (ico) b.insertAdjacentHTML("beforeend", ico);
    }
  }
  function btnMotionAll() {
    Array.prototype.forEach.call(document.querySelectorAll(".c5-btn"), btnMotion);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", btnMotionAll);
  else btnMotionAll();
  document.addEventListener("pointerover", function (e) {
    var b = e.target && e.target.closest && e.target.closest(".c5-btn");
    if (b) btnMotion(b);
  }, true);

  function define(tag, render) {
    if (window.customElements && !customElements.get(tag)) {
      customElements.define(tag, class extends HTMLElement {
        connectedCallback() { if (!this.dataset.cwReady) { this.dataset.cwReady = "1"; render(this); } }
      });
    }
  }

  /* ===== Page-state badge (bottom-left corner of every page) ===============
     Reads status.js (window.CW_STATUS) and injects itself – no tag in the HTML,
     so a new page gets it as soon as it lands in the manifest. It sits in the
     0–20 px strip above the bottom edge, i.e. below the advisor dock (the dock
     stands at bottom: var(--w-space-5) = 20 px) – the two never overlap.
     Model: one gate (track "makieta" = layout approval) and independent tracks
     after it. The badge shows the gate state, e.g. "Makieta: do akceptacji";
     once the layout is approved it appends the tracks that have a value.
     States are set by the project owner only: no value = "do ustalenia",
     the badge never guesses.                                                  */
  var STATUS_CSS = `
/* Height is coupled with the advisor dock offset: the dock stands at
   bottom: var(--w-space-5) = 20 px, so the badge has to fit below it.
   17 px leaves 3 px of slack; re-check after changing font-size or padding. */
.cw-status{position:fixed;left:0;bottom:0;z-index:var(--w-z-sticky);
  display:flex;align-items:center;max-width:min(92vw,56em);
  height:17px;padding:0 9px 0 7px;border-radius:0 6px 0 0;box-sizing:border-box;
  background:var(--w-surface-raised);border-top:1px solid var(--w-border-subtle);
  border-right:1px solid var(--w-border-subtle);
  font-family:var(--w-font-sans);font-size:11px;line-height:1.3;
  color:var(--w-text-tertiary);opacity:.72;transition:opacity .15s ease;
  white-space:nowrap;overflow:hidden}
.cw-status:hover,.cw-status:focus-within{opacity:1}
.cw-status>*{flex:none}
.cw-status__tor{color:inherit;text-decoration:none;margin-right:.3em}
.cw-status__tor:hover,.cw-status__tor:focus-visible{color:var(--w-text-primary);
  text-decoration:underline;text-underline-offset:2px}
.cw-status__stan{font-weight:600}
.cw-status__sep{opacity:.5;margin:0 .4em}
/* The follow-up tracks are the only part allowed to shrink: a long list is cut
   with an ellipsis, the gate state and the task link always stay whole. */
.cw-status__grupa{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis}
.cw-status__grupa .cw-status__stan{font-weight:400}
/* Hard-coded colours: the kit has no feedback tokens, so we do not pretend a
   link that is not there. One tone per state tone in the manifest. */
.cw-status__stan--brak,.cw-status__stan--neutral{color:var(--w-text-secondary)}
.cw-status__stan--praca{color:#6d28d9}
.cw-status__stan--czeka{color:#1d4ed8}
.cw-status__stan--poprawki{color:#b91c1c}
.cw-status__stan--ok{color:#166534}
.cw-status__ac{color:inherit;text-decoration:underline;text-underline-offset:2px}
.cw-status__ac:hover{color:var(--w-text-primary)}
@media (max-width:640px){.cw-status__grupa{display:none}}
@media print{.cw-status{display:none}}`;

  function renderStatus() {
    var cfg = window.CW_STATUS;
    if (!cfg || document.querySelector(".cw-status")) return;
    var plik = (location.pathname.split("/").pop() || "home.html").split("?")[0];
    if (!plik) plik = "home.html";
    var d = cfg.strony[plik];
    if (!d) return;

    var st = document.createElement("style");
    st.textContent = STATUS_CSS;
    document.head.appendChild(st);

    var esc = function (t) {
      return String(t).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    };
    /* state of one track: the manifest keeps the state KEY, the track lists its states */
    var stany = d.stan || {};
    var stanToru = function (tor) {
      var k = stany[tor.klucz], i;
      for (i = 0; k && i < tor.stany.length; i++) if (tor.stany[i].klucz === k) return tor.stany[i];
      return null;
    };
    var tory = cfg.tory || [], brama = null, i;
    for (i = 0; i < tory.length; i++) if (tory[i].klucz === "makieta") brama = tory[i];
    var s = brama && stanToru(brama);

    /* the state table stands next to status.js, above the version folders */
    var tag = document.querySelector('script[src$="status.js"]');
    var tabela = tag ? tag.getAttribute("src").replace(/status\.js$/, "stan-podstron.html") : "../stan-podstron.html";

    /* A separator travels WITH its element instead of being glued between parts,
       so hiding the group on a narrow screen leaves no dangling dot. */
    var SEP = '<span class="cw-status__sep">·</span>';
    var html = '<a class="cw-status__tor" href="' + esc(tabela) + '" title="Stan wszystkich podstron">' +
      esc(brama ? brama.nazwa : "Makieta") + ":</a>" +
      '<span class="cw-status__stan cw-status__stan--' + (s ? esc(s.ton) : "brak") + '">' +
      (s ? esc(s.nazwa) : "do ustalenia") + "</span>";

    if (s && s.klucz === "zaakceptowany") {
      var dalej = [];
      for (i = 0; i < tory.length; i++) {
        var t = tory[i], ts = t !== brama && stanToru(t);
        if (ts) dalej.push(esc(t.nazwa.split(" ")[0]) + ': <span class="cw-status__stan cw-status__stan--' +
          esc(ts.ton) + '">' + esc(ts.nazwa) + "</span>");
      }
      if (dalej.length) html += '<span class="cw-status__grupa">' + SEP + dalej.join(SEP) + "</span>";
    }
    if (d.ac) html += SEP + '<a class="cw-status__ac" href="' + cfg.meta.bazaAC + d.ac +
      '" target="_blank" rel="noopener">AC #' + d.ac + "</a>";

    var box = document.createElement("div");
    box.className = "cw-status";
    box.id = "serwis-status";
    box.setAttribute("data-ce", "CE-06");
    box.setAttribute("role", "note");
    var label = "Stan prac nad tą podstroną";
    if (s && s.klucz === "do-akceptacji" && cfg.akceptacja_ukladu) {
      /* what exactly is asked to be approved */
      box.title = cfg.akceptacja_ukladu;
      label += ": makieta do akceptacji. " + cfg.akceptacja_ukladu;
    }
    box.setAttribute("aria-label", label);
    box.innerHTML = html;
    document.body.appendChild(box);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderStatus);
  } else {
    renderStatus();
  }

  /* ===== Comments on the mock-up (Agentation, 21.10.2026) ==================
     Off by default: a page opened without ?uwagi=1 loads nothing of this.
     ?uwagi=1 switches it on for this browser (remembered, so it stays on while
     the reader moves between pages); ?uwagi=0 switches it off and forgets the
     name. When on, a browser with a mouse gets:
     - a one-time question for the reader's name (remembered),
     - the Agentation toolbar (React component loaded on demand from esm.sh,
       versions pinned in UWAGI): click an element, type, Enter saves,
     - one POST per added, edited or removed comment to UWAGI.adres – the
       Cloudflare Worker _narzedzia/uwagi-worker.js, which appends a line to
       <projekt>.md in a private GitHub repository,
     - a short confirmation after every save. A comment that could not be sent
       waits in localStorage and goes out with the next one or on the next
       page load; one the worker rejects (4xx) is dropped with a message,
     - the comments already made on this page, by anyone, read back from the
       worker before the toolbar mounts and shown as markers, each placed at
       its element again (the layout may have changed since). Other people's
       comments carry the author's name in front; editing or removing them
       is not sent – only the author can change a comment.
     Touch screens get a one-line note instead: Agentation is desktop only.
     For a local test, localStorage "cw-uwagi-adres" overrides UWAGI.adres
     (node _narzedzia/uwagi-worker-test.mjs --serwer 8740). */
  var UWAGI = {
    projekt: "carbohort",
    adres: "https://uwagi.arbohort.workers.dev",
    react: "https://esm.sh/react@18.3.1",
    reactDom: "https://esm.sh/react-dom@18.3.1/client",
    agentation: "https://esm.sh/agentation@3.1.2?deps=react@18.3.1,react-dom@18.3.1"
  };
  var UWAGI_ON = "cw-uwagi", UWAGI_WHO = "cw-uwagi-kto", UWAGI_QUEUE = "cw-uwagi-kolejka";
  var UWAGI_CSS = `
.cw-uwagi,.cw-uwagi-toast{position:fixed;right:24px;bottom:84px;z-index:2147483000;
  box-sizing:border-box;max-width:calc(100vw - 32px);
  font-family:var(--w-font-sans,system-ui,sans-serif);box-shadow:0 12px 40px rgba(0,0,0,.18)}
.cw-uwagi{display:grid;gap:10px;width:340px;padding:18px 18px 16px;border-radius:12px;
  background:#fff;color:#1a1a1a;font-size:14px;line-height:1.45}
.cw-uwagi__tytul{margin:0;font-size:15px;font-weight:600}
.cw-uwagi__opis{color:#555}
.cw-uwagi__pole{font:inherit;padding:8px 10px;border:1px solid #c8c8c8;border-radius:8px}
.cw-uwagi__ok{justify-self:start;font:inherit;font-weight:600;padding:8px 14px;border:0;
  border-radius:8px;background:#1a1a1a;color:#fff;cursor:pointer}
.cw-uwagi-toast{width:max-content;padding:10px 14px;border-radius:10px;background:#1a1a1a;
  color:#fff;font-size:13px;line-height:1.4;opacity:0;transform:translateY(6px);
  transition:opacity .2s ease,transform .2s ease;pointer-events:none}
.cw-uwagi-toast.is-on{opacity:1;transform:none}
.cw-uwagi-toast--blad{background:#b91c1c}
@media (max-width:640px){.cw-uwagi,.cw-uwagi-toast{right:16px;bottom:16px}}
@media print{.cw-uwagi,.cw-uwagi-toast,#cw-uwagi-pasek{display:none}}`;

  function lsGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function lsSet(key, value) {
    try {
      if (value === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, value);
    } catch (e) {}
  }

  function commentsWanted() {
    var m = /[?&]uwagi=([01])(?:&|$)/.exec(location.search || "");
    if (m && m[1] === "1") lsSet(UWAGI_ON, "1");
    if (m && m[1] === "0") { lsSet(UWAGI_ON, null); lsSet(UWAGI_WHO, null); }
    return lsGet(UWAGI_ON) === "1";
  }

  var toastTimer;
  function toast(text, bad, ms) {
    var t = document.querySelector(".cw-uwagi-toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "cw-uwagi-toast";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.textContent = text;
    t.classList.toggle("cw-uwagi-toast--blad", !!bad);
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-on"); }, ms || 2200);
  }

  function readQueue() {
    try { return JSON.parse(lsGet(UWAGI_QUEUE) || "[]"); } catch (e) { return []; }
  }
  function dropFromQueue(k) {
    var q = readQueue().filter(function (x) { return x.k !== k; });
    lsSet(UWAGI_QUEUE, q.length ? JSON.stringify(q) : null);
  }

  var SAVED = { nowa: "Zapisano uwagę", poprawka: "Zapisano poprawkę", usunieta: "Usunięto uwagę" };
  var flushing = false;
  function flush() {
    var adres = lsGet("cw-uwagi-adres") || UWAGI.adres;
    var q = readQueue();
    if (flushing || !q.length) return;
    if (!adres) {
      toast("Uwaga została tylko w tej przeglądarce: zapis na serwerze nie jest jeszcze ustawiony.", true, 5000);
      return;
    }
    var item = q[0];
    flushing = true;
    fetch(adres, {
      method: "POST",
      /* text/plain keeps it a simple request: no CORS preflight */
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(item.d),
      keepalive: true
    }).then(function (r) {
      flushing = false;
      if (r.ok) {
        dropFromQueue(item.k);
        toast(SAVED[item.d.typ]);
        flush();
      } else if (r.status >= 400 && r.status < 500 && r.status !== 429) {
        dropFromQueue(item.k);
        toast("Serwer nie przyjął uwagi (" + r.status + "). Napisz ją jeszcze raz albo daj znać.", true, 6000);
        flush();
      } else {
        throw new Error(r.status);
      }
    }).catch(function () {
      flushing = false;
      toast("Nie udało się zapisać uwagi. Spróbujemy ponownie przy następnej.", true, 5000);
    });
  }

  function sendComment(kto, typ, a) {
    var q = readQueue();
    q.push({
      k: String(Date.now()) + Math.random().toString(36).slice(2, 6),
      d: {
        projekt: UWAGI.projekt, typ: typ, id: a.id, kto: kto,
        strona: location.pathname, element: a.element, sciezka: a.elementPath,
        zaznaczenie: a.selectedText || "", komentarz: a.comment, szer: window.innerWidth,
        x: a.x, y: a.y, fixed: !!a.isFixed
      }
    });
    lsSet(UWAGI_QUEUE, JSON.stringify(q));
    flush();
  }

  function askName(done) {
    var box = document.createElement("form");
    box.className = "cw-uwagi";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-labelledby", "cw-uwagi-tytul");
    box.innerHTML =
      '<p class="cw-uwagi__tytul" id="cw-uwagi-tytul">Uwagi do makiety</p>' +
      '<label class="cw-uwagi__opis" for="cw-uwagi-kto">Jak masz na imię? Podpiszemy nim Twoje uwagi.</label>' +
      '<input class="cw-uwagi__pole" id="cw-uwagi-kto" name="kto" maxlength="60" autocomplete="given-name" required>' +
      '<button class="cw-uwagi__ok" type="submit">Zaczynam</button>';
    box.addEventListener("submit", function (e) {
      e.preventDefault();
      var kto = box.elements.kto.value.trim();
      if (!kto) return;
      lsSet(UWAGI_WHO, kto);
      box.remove();
      done(kto);
      toast("Kliknij ikonę w prawym dolnym rogu, potem element strony. Wpisz uwagę i wciśnij Enter – zapisze się od razu.", false, 9000);
    });
    document.body.appendChild(box);
    box.elements.kto.focus();
  }

  /* The element of a comment: Agentation's path when it matches exactly one
     element (it is a readable path, not always a strict selector), else the
     last #id in the path, else the one element whose text starts with the
     quoted text of Agentation's label (h1 "Program…", button "Dodaj"). */
  var TEXT_TAGS = "a,button,h1,h2,h3,h4,h5,h6,p,li,label,summary,figcaption,th,td,dt,dd";
  function findElement(path, label) {
    var all, id, t;
    if (path) {
      try {
        all = document.querySelectorAll(path);
        if (all.length === 1) return all[0];
      } catch (e) {}
      id = /#([A-Za-z][\w-]*)\s*$/.exec(path);
      if (id && document.getElementById(id[1])) return document.getElementById(id[1]);
    }
    t = /"(.{3,})"\s*$/.exec(label || "");
    if (!t) return null;
    var cut = /\.\.\.$/.test(t[1]), want = t[1].replace(/\.\.\.$/, "").trim();
    var hits = [].filter.call(document.querySelectorAll(TEXT_TAGS), function (el) {
      if (el.closest("[data-feedback-toolbar], .cw-uwagi, .cw-uwagi-toast")) return false;
      var s = (el.textContent || "").replace(/\s+/g, " ").trim();
      return cut ? s.indexOf(want) === 0 : s === want;
    });
    /* the innermost of nested matches (a link inside a list item, say) */
    hits = hits.filter(function (el) {
      return !hits.some(function (o) { return o !== el && el.contains(o); });
    });
    return hits.length === 1 ? hits[0] : null;
  }

  /* Marker at the element of the comment when it is still found, otherwise
     where it was saved. */
  function placeAt(a) {
    var el = findElement(a.elementPath, a.element);
    var r = el && el.getBoundingClientRect();
    if (!r || (!r.width && !r.height)) return a;
    var top = r.top + (a.isFixed ? 0 : window.scrollY);
    a.x = Math.min(98, (r.left + Math.min(16, r.width / 2)) / window.innerWidth * 100);
    a.y = top + Math.min(12, r.height / 2);
    a.boundingBox = { x: r.left, y: top, width: r.width, height: r.height };
    return a;
  }

  /* Replaces Agentation's stored annotations of this page with the worker's
     list (plus this reader's comments still waiting to be sent). Returns the
     ids of other people's comments; null when the list could not be read,
     and then the stored annotations stay as they are. */
  function loadEarlier(A, kto) {
    var adres = lsGet("cw-uwagi-adres") || UWAGI.adres;
    if (!adres || !window.fetch) return Promise.resolve(null);
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = ctl && setTimeout(function () { ctl.abort(); }, 6000);
    return fetch(adres + "?projekt=" + encodeURIComponent(UWAGI.projekt) +
      "&strona=" + encodeURIComponent(location.pathname), ctl ? { signal: ctl.signal } : {})
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (res) {
        clearTimeout(timer);
        if (!res || !res.uwagi) return null;
        var path = location.pathname, local = {}, waiting = {}, foreign = {};
        A.loadAnnotations(path).forEach(function (a) { local[a.id] = a; });
        readQueue().forEach(function (x) { waiting[x.d.id] = true; });
        var list = res.uwagi.map(function (u) {
          if (waiting[u.id] && local[u.id]) return local[u.id];
          var own = u.kto === kto;
          if (!own) foreign[u.id] = u.kto;
          return placeAt({
            id: u.id, comment: own ? u.komentarz : u.kto + ": " + u.komentarz,
            element: u.element, elementPath: u.sciezka, selectedText: u.zaznaczenie || undefined,
            x: u.x == null ? 50 : u.x, y: u.y == null ? 0 : u.y, isFixed: !!u.fixed,
            timestamp: Date.now()
          });
        });
        var seen = {};
        list.forEach(function (a) { seen[a.id] = true; });
        Object.keys(local).forEach(function (id) {
          if (waiting[id] && !seen[id]) list.push(local[id]);
        });
        A.saveAnnotations(path, list);
        return foreign;
      })
      .catch(function () { clearTimeout(timer); return null; });
  }

  /* Markers are placed from element positions, so wait for images and fonts. */
  function pageLoaded() {
    return new Promise(function (ok) {
      if (document.readyState === "complete") ok();
      else window.addEventListener("load", function () { ok(); }, { once: true });
    });
  }

  function mountToolbar(kto) {
    Promise.all([import(UWAGI.react), import(UWAGI.reactDom), import(UWAGI.agentation), pageLoaded()]).then(function (m) {
      return loadEarlier(m[2], kto).then(function (foreign) {
        foreign = foreign || {};
        function change(typ) {
          return function (a) {
            if (foreign[a.id]) {
              toast("To uwaga od: " + foreign[a.id] + ". Zmienić albo usunąć może ją tylko autor – po odświeżeniu strony wróci.", true, 7000);
              return;
            }
            sendComment(kto, typ, a);
          };
        }
        var host = document.createElement("div");
        host.id = "cw-uwagi-pasek";
        document.body.appendChild(host);
        m[1].createRoot(host).render(m[0].createElement(m[2].Agentation, {
          onAnnotationAdd: change("nowa"),
          onAnnotationUpdate: change("poprawka"),
          onAnnotationDelete: change("usunieta")
        }));
        flush();
      });
    }).catch(function () {
      toast("Nie udało się wczytać paska uwag. Odśwież stronę.", true, 6000);
    });
  }

  function startComments() {
    if (!commentsWanted()) return;
    var st = document.createElement("style");
    st.id = "cw-uwagi-css";
    st.textContent = UWAGI_CSS;
    document.head.appendChild(st);
    if (!(window.matchMedia && window.matchMedia("(pointer: fine)").matches)) {
      toast("Uwagi do makiety dodasz na komputerze.", false, 4000);
      return;
    }
    var kto = lsGet(UWAGI_WHO);
    if (kto) mountToolbar(kto);
    else askName(mountToolbar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startComments);
  } else {
    startComments();
  }

  define("cw-icons",  function (el) { el.innerHTML = ICONS; });
  define("cw-navbar", function (el) {
    var uklad = el.getAttribute("data-uklad");
    if (uklad === "panel" || uklad === "handlowiec") {
      el.innerHTML = panelbar(uklad === "handlowiec");
      markCurrent(el, el.getAttribute("data-current"));
      centerTab(el);
      /* once more when the stylesheets and fonts have settled the widths */
      window.addEventListener("load", function () { centerTab(el); });
      return;
    }
    el.innerHTML = (HERE ? NAVBAR.replace(/src="img\//g, 'src="' + HERE + "img/") : NAVBAR) + SCRIM;
    ceSheet("CE-01-naglowek.css");
    ceSheet("CE-02-mega-menu.css");
    markCurrent(el, el.getAttribute("data-current"));
    bindCropSwitch(el);
    promoBar(el.querySelector("#serwis-naglowek"));
    /* Three sources, in this order: attribute, address query, address fragment. */
    if (el.getAttribute("data-widok") === "pro") setPro(el, true, "");
    else if (proInQuery()) setPro(el, true, "?");
    else if (proInHash()) setPro(el, true, "#");
  });
  define("cw-footer", function (el) {
    var bar = document.querySelector("cw-navbar[data-uklad]");
    if (bar) { el.innerHTML = footerPanel(bar.getAttribute("data-uklad") === "handlowiec"); return; }
    el.innerHTML = HERE ? FOOTER.replace(/src="img\//g, 'src="' + HERE + "img/") : FOOTER;
    ceSheet("CE-04-stopka.css");
  });
  define("cw-dock",   function (el) {
    el.innerHTML = DOCK;
    /* <cw-dock> stands after <cw-footer> on every page; should a page ever put
       it first, the landing waits for the parser to reach the footer */
    if (document.querySelector("cw-footer")) { dockHero(el); dockLanding(el); }
    else document.addEventListener("DOMContentLoaded", function () { dockHero(el); dockLanding(el); });
  });
})();
