/* =====================================================================
   chrome.js — WSPÓLNE ELEMENTY SERWISU W JEDNYM MIEJSCU.

   Nagłówek z mega-menu, nawigacja mobilna, przyciemnienie tła, stopka,
   sprite ikon i dok doradcy żyją TYLKO tutaj. Podstrony wstawiają je
   znacznikami i nie zawierają już ani jednej linii tego kodu:

       <cw-icons></cw-icons>
       <cw-navbar data-current="uprawy"></cw-navbar>
       <cw-footer></cw-footer>
       <cw-dock></cw-dock>

   Zmiana w menu albo w stopce = zmiana w TYM pliku. Podstron się nie dotyka.

   data-current przyjmuje wartość z data-nav w szablonie nawigacji:
   produkty · uprawy · ziemniak · borowka · prochnica-plus · centrum-wiedzy
   · o-firmie · kontakt · sklep · platforma-b2b. Puste = brak podświetlenia
   (strona główna).

   ZASADY:
   - Renderujemy do zwykłego DOM, nie do shadow DOM. Cały arkusz klas wf- i cw-
     ma działać bez zmian, a shadow DOM by go odciął.
   - Plik ładujemy w <head> BEZ defer. Dzięki temu definicje istnieją, zanim
     parser dojdzie do znaczników, elementy podnoszą się w locie, a cw.js
     z końca <body> zastaje kompletny DOM.
   - Sprite to suma ikon używanych w całym serwisie. Dokładanie ikony na
     jednej podstronie nie wymaga ruszania pozostałych.
   ===================================================================== */
(function () {
  "use strict";

  var ICONS = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true" id="wf-icon-sprite">
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
  <symbol id="ti-stack-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l-8 4l8 4l8 -4l-8 -4" /><path d="M4 12l8 4l8 -4" /><path d="M4 16l8 4l8 -4" /></symbol>
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

  var NAVBAR = `<header class="wf-navbar">
  <div class="wf-navbar__inner wf-container">
    <a class="cw-brand" href="home.html">Carbohort</a>
    <nav class="cw-nav" aria-label="Główna">
      <div class="cw-haspopup">
        <button class="cw-nav-trigger" data-mega-trigger aria-haspopup="true" aria-expanded="false" aria-controls="mega-produkty">Nasze produkty <svg class="wf-icon wf-icon--sm" aria-hidden="true"><use href="#ti-chevron-down"></use></svg></button>
        <div class="cw-mega cw-mega--wide" id="mega-produkty" data-open="false" role="region" aria-label="Nasze produkty">
          <div class="cw-mega__head">
            <span class="wf-overline wf-t-tertiary">Produkty Carbohort</span>
            <a class="wf-btn wf-btn--secondary wf-btn--sm" href="produkty.html">Poznaj całą gamę produktów</a>
          </div>
          <div class="cw-mega__layout">
            <!-- Cały box = link (bez osobnych przycisków); miniatura produktu dojdzie -->
            <a class="cw-prodbox" href="carbomat.html">
              <span class="wf-overline wf-t-tertiary">Sypkie · doglebowe</span>
              <span class="wf-h5 cw-prodbox__name">CARBOMAT ECO</span>
              <span class="wf-small wf-t-secondary">Surowy lignit, który na lata przebudowuje strukturę i retencję gleby.</span>
            </a>
            <a class="cw-prodbox" href="carbomat-mata.html">
              <span class="wf-overline wf-t-tertiary">Sypkie · uprawa bezglebowa</span>
              <span class="wf-h5 cw-prodbox__name">CARBOMAT Mata Uprawowa</span>
              <span class="wf-small wf-t-secondary">Naturalne podłoże nowej generacji do upraw bezglebowych – wieloletnia alternatywa dla wełny mineralnej i maty kokosowej.</span>
            </a>
            <a class="cw-prodbox" href="carbohumic.html">
              <span class="wf-overline wf-t-tertiary">Płynne · doglebowe i nalistne</span>
              <span class="wf-h5 cw-prodbox__name">CARBOHUMIC</span>
              <span class="wf-small wf-t-secondary">„Próchnica w płynie" – kondycjonuje glebę i biostymuluje roślinę.</span>
            </a>
            <a class="cw-prodbox" href="carbomat-humic.html">
              <span class="wf-overline wf-t-tertiary">Węgiel aktywowany · 3 w 1</span>
              <span class="wf-h5 cw-prodbox__name">CARBOMAT HUMIC</span>
              <span class="wf-small wf-t-secondary">Kondycjoner + potas + biostymulator; podnosi pH zakwaszonej gleby – na pole i do ogrodu.</span>
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
      <div class="cw-haspopup">
        <button class="cw-nav-trigger" data-mega-trigger aria-haspopup="true" aria-expanded="false" aria-controls="mega-uprawy">Rodzaje upraw <svg class="wf-icon wf-icon--sm" aria-hidden="true"><use href="#ti-chevron-down"></use></svg></button>
        <div class="cw-mega" id="mega-uprawy" data-open="false" role="region" aria-label="Rodzaje upraw">
          <div class="cw-mega__grid cw-mega__grid--3">
            <div class="cw-mega__col">
              <span class="wf-overline wf-t-tertiary">Uprawy profesjonalne</span>
              <div class="cw-mega__list">
                <a class="wf-link--quiet wf-small" href="sadownicze.html">Sadownicze</a>
                <a class="wf-link--quiet wf-small" href="jagodowe.html">Jagodowe</a>
                <a class="wf-link--quiet wf-small" href="warzywnicze.html">Warzywnicze</a>
                <a class="wf-link--quiet wf-small" href="zboza.html">Zboża, rzepak, kukurydza</a>
                <a class="wf-link--quiet wf-small" href="zielen.html">Zieleń miejska</a>
                <a class="wf-link--quiet wf-small" href="szkolki.html">Szkółki</a>
              </div>
            </div>
            <div class="cw-mega__col">
              <span class="wf-overline wf-t-tertiary">Wybrane uprawy</span>
              <div class="cw-mega__list">
                <a class="wf-link--quiet wf-small" href="ziemniak.html">Ziemniak</a>
                <a class="wf-link--quiet wf-small" href="borowka.html">Borówka</a>
              </div>
            </div>
            <div class="cw-mega__col">
              <span class="wf-overline wf-t-tertiary">Ogród i działka</span>
              <div class="cw-mega__list">
                <a class="wf-link--quiet wf-small" href="trawnik.html">Trawnik</a>
                <a class="wf-link--quiet wf-small" href="ogrod.html">Ogród / działka</a>
                <a class="wf-link--quiet wf-small" href="krzewy.html">Krzewy i tuje</a>
              </div>
              <a class="wf-btn wf-btn--secondary wf-btn--sm" href="uprawy.html">Wszystkie uprawy</a>
            </div>
          </div>
          <div class="cw-mega__foot">
            <span class="wf-small wf-t-secondary">Nie wiesz, co wybrać? Konfigurator dobierze produkty i dawki.</span>
            <a class="wf-btn wf-btn--secondary wf-btn--sm" href="konfigurator.html">Otwórz Konfigurator</a>
          </div>
        </div>
      </div>
      <div class="cw-haspopup">
        <button class="cw-nav-trigger" data-mega-trigger aria-haspopup="true" aria-expanded="false" aria-controls="mega-programy">Programy i badania <svg class="wf-icon wf-icon--sm" aria-hidden="true"><use href="#ti-chevron-down"></use></svg></button>
        <div class="cw-mega cw-mega--narrow" id="mega-programy" data-open="false" role="region" aria-label="Programy i badania">
          <div class="cw-mega__list">
            <a class="wf-link--quiet" href="prochnica-plus.html">Program Próchnica+</a>
          </div>
        </div>
      </div>
      <a class="wf-navbar__link" href="centrum-wiedzy.html">Centrum wiedzy</a>
      <a class="wf-navbar__link" href="o-firmie.html">O nas</a>
      <a class="wf-navbar__link" href="kontakt.html">Kontakt</a>
    </nav>
    <div class="wf-cluster wf-gap-2">
      <a class="wf-btn wf-btn--primary wf-btn--sm" href="konfigurator.html">Konfigurator</a>
      <a class="wf-btn wf-btn--ghost wf-btn--sm" href="sklep.html">Sklep</a>
      <a class="wf-btn wf-btn--ghost wf-btn--sm wf-inline" href="platforma-b2b.html"><svg class="wf-icon wf-icon--sm" aria-hidden="true"><use href="#ti-user"></use></svg> Zaloguj</a>
      <a class="wf-btn wf-btn--ghost wf-btn--icon wf-badge--count cw-cart" href="koszyk.html" aria-label="Koszyk, 0 produktów"><svg class="wf-icon" aria-hidden="true"><use href="#ti-shopping-cart"></use></svg><span class="wf-count" data-cart-count>0</span></a>
      <button class="wf-btn wf-btn--ghost wf-btn--icon cw-navtoggle" data-navtoggle aria-controls="mobilenav" aria-expanded="false" aria-label="Otwórz menu"><svg class="wf-icon" aria-hidden="true"><use href="#ti-menu-2"></use></svg></button>
    </div>
  </div>
  <nav class="cw-mobilenav wf-container" id="mobilenav" data-open="false" aria-label="Menu mobilne">
    <a class="wf-navitem" data-nav="produkty" href="produkty.html">Nasze produkty</a>
    <a class="wf-navitem" data-nav="uprawy" href="uprawy.html">Rodzaje upraw</a>
    <a class="wf-navitem cw-mobilenav__sub" data-nav="ziemniak" data-nav-parent="uprawy" href="ziemniak.html">Ziemniak</a>
    <a class="wf-navitem cw-mobilenav__sub" data-nav="borowka" data-nav-parent="uprawy" href="borowka.html">Borówka</a>
    <a class="wf-navitem" data-nav="prochnica-plus" href="prochnica-plus.html">Programy i badania</a>
    <a class="wf-navitem" data-nav="centrum-wiedzy" href="centrum-wiedzy.html">Centrum wiedzy</a>
    <a class="wf-navitem" data-nav="o-firmie" href="o-firmie.html">O nas</a>
    <a class="wf-navitem" data-nav="kontakt" href="kontakt.html">Kontakt</a>
    <a class="wf-navitem" data-nav="sklep" href="sklep.html">Sklep</a>
    <a class="wf-navitem" data-nav="platforma-b2b" href="platforma-b2b.html">Zaloguj</a>
  </nav>
</header>`;

  var SCRIM = '<div class="cw-scrim" data-cw-scrim data-open="false" aria-hidden="true"></div>';

  var FOOTER = `<footer class="wf-footer wf-section">
  <div class="wf-container">
    <div class="wf-footer__cols">
      <div class="wf-stack wf-stack--3">
        <span class="wf-h4 wf-w-bold">Carbohort</span>
        <p class="wf-small wf-t-secondary">Polski, rodzinny producent poprawiaczy gleby z lignitu i leonardytu. Dbając o glebę, inwestujemy w przyszłe pokolenia.</p>
      </div>
      <nav class="wf-stack wf-stack--2" aria-label="Produkty"><p class="wf-overline">Produkty</p>
        <a class="wf-link--quiet" href="produkty.html">Nasze produkty</a>
        <a class="wf-link--quiet" href="carbomat.html">CARBOMAT ECO</a>
        <a class="wf-link--quiet" href="carbomat-mata.html">CARBOMAT Mata Uprawowa</a>
        <a class="wf-link--quiet" href="carbohumic.html">CARBOHUMIC</a>
        <a class="wf-link--quiet" href="carbomat-humic.html">CARBOMAT HUMIC</a>
        <a class="wf-link--quiet" href="sklep.html">Sklep</a>
      </nav>
      <nav class="wf-stack wf-stack--2" aria-label="Wiedza i programy"><p class="wf-overline">Wiedza i programy</p>
        <a class="wf-link--quiet" href="centrum-wiedzy.html">Centrum wiedzy</a>
        <a class="wf-link--quiet" href="prochnica-plus.html">Program Próchnica+</a>
        <a class="wf-link--quiet" href="uprawy.html">Rodzaje upraw</a>
        <a class="wf-link--quiet" href="konfigurator.html">Konfigurator</a>
      </nav>
      <nav class="wf-stack wf-stack--2" aria-label="Firma i współpraca"><p class="wf-overline">Firma i współpraca</p>
        <a class="wf-link--quiet" href="o-firmie.html">O nas</a>
        <a class="wf-link--quiet" href="kontakt.html">Kontakt</a>
        <a class="wf-link--quiet" href="partner.html">Zostań partnerem</a>
        <a class="wf-link--quiet" href="platforma-b2b.html">Panel / Zaloguj</a>
      </nav>
    </div>
    <div class="wf-footer__bottom wf-cluster wf-cluster--between">
      <span class="wf-caption wf-t-secondary">© Carbohort – makieta. Treść i dane do akceptacji.</span>
      <span class="wf-caption wf-t-secondary">PL · poprawa gleby z lignitu</span>
    </div>
  </div>
</footer>`;

  var DOCK = `<!-- ===== dr Jurek – pływający dok (ukryty do przewinięcia) ===== -->
<div class="cw-jurek-backdrop" data-jurek-backdrop data-open="false" aria-hidden="true"></div>
<div class="cw-jurek cx-dockhide" data-jurek-dock data-open="false">
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
    var el = root.querySelector('[data-nav="' + key + '"]');
    if (!el) return;
    el.setAttribute("aria-current", "page");
    el.className += " wf-w-semibold";
    /* Pozycja drugiego poziomu podświetla też swojego rodzica, żeby nie zgubić
       orientacji, w której sekcji serwisu jesteśmy. */
    var parent = el.getAttribute("data-nav-parent");
    if (parent) {
      var pe = root.querySelector('[data-nav="' + parent + '"]');
      if (pe) pe.className += " wf-w-semibold";
    }
  }

  function define(tag, render) {
    if (window.customElements && !customElements.get(tag)) {
      customElements.define(tag, class extends HTMLElement {
        connectedCallback() { if (!this.dataset.cwReady) { this.dataset.cwReady = "1"; render(this); } }
      });
    }
  }

  define("cw-icons",  function (el) { el.innerHTML = ICONS; });
  define("cw-navbar", function (el) {
    el.innerHTML = NAVBAR + SCRIM;
    markCurrent(el, el.getAttribute("data-current"));
  });
  define("cw-footer", function (el) { el.innerHTML = FOOTER; });
  define("cw-dock",   function (el) { el.innerHTML = DOCK; });
})();
