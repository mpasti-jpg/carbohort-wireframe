/* ce-rejestr.js – public copy of the CE registry (generated at deploy; the
   vault keeps the full file with the decision history of every block). */
window.CW_CE = {
  "meta": {
    "zaktualizowano": "2026-10-04",
    "katalogWersji": "v7/",
    "indeks": "ce-indeks.html",
    "opis": "Rejestr content elementów (CE) makiet CarboHort V7: metadane CE. Wystąpienia wynikają ze znaczników data-ce w HTML stron – skanuje je _narzedzia/ce-indeks.py. Spec: 40-strona-www/koncepcja/content-elementy-spec.md."
  },
  "grupy": {
    "wspolne": "Elementy wspólne serwisu (chrome.js)",
    "nawigacja": "Nawigacja po podstronie",
    "otwarcie": "Otwarcie strony",
    "sceny": "Sceny i bloki sterowane przewijaniem",
    "przelaczniki": "Taby, listy, karuzele, akordeony",
    "karty": "Karty, kolumny, panele",
    "dane": "Tabele, liczby, osie i formularze danych",
    "noty-i-cta": "Noty, boksy, pasy CTA, cytaty",
    "nakladki": "Nakładki: lightbox i pop-up"
  },
  "fasety": [
    {
      "klucz": "rodzina",
      "nazwa": "Rodzina",
      "grupuje": true,
      "glowny": true,
      "naKarcie": false,
      "wartosci": [
        {
          "klucz": "otwarcie",
          "nazwa": "Otwarcia i wstępy",
          "opis": "Pierwszy ekran podstrony albo sekcji: tytuł, lead, kadr, packshot."
        },
        {
          "klucz": "obraz-tekst",
          "nazwa": "Obraz i tekst",
          "opis": "Zdjęcie albo wideo równorzędne z tekstem – jedna, dwie pozycje."
        },
        {
          "klucz": "karty",
          "nazwa": "Karty i kafle",
          "opis": "Kilka krótkich pozycji obok siebie: ikona albo zdjęcie, tytuł, zdanie–dwa."
        },
        {
          "klucz": "zwijane",
          "nazwa": "Taby, akordeony, listy z panelem",
          "opis": "Dużo treści na małej powierzchni – opis odsłania klik."
        },
        {
          "klucz": "sceny",
          "nazwa": "Sceny przypięte",
          "opis": "Ekran stoi, treść wymienia się przy przewijaniu – jedna myśl naraz."
        },
        {
          "klucz": "dane",
          "nazwa": "Tabele, listy, liczby, osie",
          "opis": "Parametry, porównania, wyniki, przeliczniki, harmonogramy, wiersze z akcją."
        },
        {
          "klucz": "pasy",
          "nazwa": "Pasy, noty, wezwania",
          "opis": "Jedno zdanie, cytat, nota albo nagłówek z przyciskiem."
        },
        {
          "klucz": "sklep-formularze",
          "nazwa": "Sklep i formularze",
          "opis": "Pola, kontakt, lista produktów, koszyk."
        },
        {
          "klucz": "okna",
          "nazwa": "Okna",
          "opis": "Treść otwierana na żądanie nad stroną."
        },
        {
          "klucz": "wspolne",
          "nazwa": "Elementy wspólne",
          "opis": "Nagłówek, stopka, menu, nawigacja po stronie."
        }
      ]
    },
    {
      "klucz": "media",
      "nazwa": "Media",
      "glowny": true,
      "naKarcie": true,
      "wartosci": [
        {
          "klucz": "zdjecie",
          "nazwa": "zdjęcie"
        },
        {
          "klucz": "wideo",
          "nazwa": "wideo"
        },
        {
          "klucz": "packshot",
          "nazwa": "packshot"
        },
        {
          "klucz": "ikona",
          "nazwa": "ikona"
        },
        {
          "klucz": "schemat-wykres",
          "nazwa": "schemat, wykres"
        },
        {
          "klucz": "bez-mediow",
          "nazwa": "bez mediów"
        }
      ]
    },
    {
      "klucz": "tekst",
      "nazwa": "Ilość tekstu",
      "glowny": true,
      "naKarcie": true,
      "wartosci": [
        {
          "klucz": "tylko-naglowek",
          "nazwa": "sam nagłówek"
        },
        {
          "klucz": "krotki",
          "nazwa": "krótki opis"
        },
        {
          "klucz": "sredni",
          "nazwa": "średni opis"
        },
        {
          "klucz": "dlugi",
          "nazwa": "długi opis"
        }
      ]
    },
    {
      "klucz": "ukryte",
      "nazwa": "Opis ukryty",
      "glowny": true,
      "naKarcie": true,
      "wartosci": [
        {
          "klucz": "wszystko-widoczne",
          "nazwa": "wszystko widoczne"
        },
        {
          "klucz": "akordeon",
          "nazwa": "akordeon"
        },
        {
          "klucz": "taby-przelacznik",
          "nazwa": "taby, przełącznik"
        },
        {
          "klucz": "okno",
          "nazwa": "pop-up, lightbox"
        },
        {
          "klucz": "przewijanie",
          "nazwa": "odsłania przewijanie"
        },
        {
          "klucz": "hover",
          "nazwa": "po najechaniu"
        },
        {
          "klucz": "karuzela",
          "nazwa": "karuzela"
        }
      ]
    },
    {
      "klucz": "pozycje",
      "nazwa": "Liczba pozycji",
      "glowny": false,
      "naKarcie": false,
      "wartosci": [
        {
          "klucz": "1",
          "nazwa": "jedna"
        },
        {
          "klucz": "2-4",
          "nazwa": "2–4"
        },
        {
          "klucz": "5-8",
          "nazwa": "5–8"
        },
        {
          "klucz": "9+",
          "nazwa": "9 i więcej"
        }
      ]
    },
    {
      "klucz": "nadaje",
      "nazwa": "Nadaje się do",
      "glowny": false,
      "naKarcie": false,
      "wartosci": [
        {
          "klucz": "otwarcie-strony",
          "nazwa": "otwarcie strony"
        },
        {
          "klucz": "korzysci-argumenty",
          "nazwa": "korzyści i argumenty"
        },
        {
          "klucz": "opis-produktu",
          "nazwa": "opis produktu"
        },
        {
          "klucz": "lista-produktow",
          "nazwa": "lista produktów"
        },
        {
          "klucz": "porownanie-wybor",
          "nazwa": "porównanie i wybór"
        },
        {
          "klucz": "kroki-proces",
          "nazwa": "kroki i proces"
        },
        {
          "klucz": "harmonogram-czas",
          "nazwa": "harmonogram i czas"
        },
        {
          "klucz": "liczby-dane",
          "nazwa": "liczby i dane"
        },
        {
          "klucz": "dowod-zrodla",
          "nazwa": "dowód i źródła"
        },
        {
          "klucz": "faq",
          "nazwa": "pytania i odpowiedzi"
        },
        {
          "klucz": "tekst-ciagly",
          "nazwa": "tekst ciągły"
        },
        {
          "klucz": "ludzie",
          "nazwa": "ludzie"
        },
        {
          "klucz": "ostrzezenie-nota",
          "nazwa": "nota i ostrzeżenie"
        },
        {
          "klucz": "cta",
          "nazwa": "wezwanie do działania"
        },
        {
          "klucz": "kontakt-formularz",
          "nazwa": "kontakt i formularz"
        },
        {
          "klucz": "sklep-transakcja",
          "nazwa": "sklep i zakup"
        },
        {
          "klucz": "galeria-media",
          "nazwa": "galeria"
        },
        {
          "klucz": "nawigacja",
          "nazwa": "nawigacja"
        }
      ]
    },
    {
      "klucz": "mechanika",
      "nazwa": "Mechanika",
      "glowny": false,
      "naKarcie": false,
      "wartosci": [
        {
          "klucz": "statyczny",
          "nazwa": "statyczny"
        },
        {
          "klucz": "przewijanie",
          "nazwa": "sterowany przewijaniem"
        },
        {
          "klucz": "klik",
          "nazwa": "klik"
        },
        {
          "klucz": "okno",
          "nazwa": "otwiera okno"
        },
        {
          "klucz": "formularz",
          "nazwa": "pola, przelicznik"
        },
        {
          "klucz": "ruch-wlasny",
          "nazwa": "ruch własny"
        }
      ]
    },
    {
      "klucz": "zakres",
      "nazwa": "Zakres",
      "glowny": false,
      "naKarcie": false,
      "wartosci": [
        {
          "klucz": "uniwersalny",
          "nazwa": "uniwersalny"
        },
        {
          "klucz": "typ-strony",
          "nazwa": "jeden typ strony"
        },
        {
          "klucz": "jednorazowy",
          "nazwa": "jednorazowy"
        }
      ]
    }
  ],
  "projekt_stany": [
    {
      "klucz": "natywny",
      "nazwa": "Natywny projekt graficzny"
    },
    {
      "klucz": "do-przygotowania",
      "nazwa": "Projekt do przygotowania"
    },
    {
      "klucz": "brak",
      "nazwa": "Brak"
    }
  ],
  "ce": {
    "CE-01": {
      "nazwa": "Nagłówek serwisu",
      "grupa": "wspolne",
      "rodzina": "wspolne",
      "skrot": "Pasek nagłówka: wordmark, nawigacja z mega-menu, przyciski Konfigurator i Sklep, koszyk z licznikiem.",
      "projekt": null,
      "tagi": {
        "media": [
          "ikona"
        ],
        "tekst": [
          "tylko-naglowek"
        ],
        "ukryte": [
          "okno",
          "hover"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "nawigacja",
          "sklep-transakcja"
        ],
        "mechanika": [
          "klik",
          "okno"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "podglad-koszyka": "Nagłówek z wysuniętym panelem podglądu koszyka: pozycje z miniaturą, suma, przyciski.",
        "zalogowany-pro": "Pasek zalogowanego profesjonalisty nad nagłówkiem i przycisk „Panel B2B” zamiast koszyka."
      },
      "opis": "Pasek nagłówka na całą szerokość: wordmark po lewej, główna nawigacja na środku (trzy wyzwalacze mega-menu i trzy linki działów), po prawej przycisk Konfiguratora, przycisk „Sklep”, ikona koszyka z licznikiem opakowań i przycisk menu mobilnego. Pod paskiem, na szerokość kontenera, wysuwa się podgląd koszyka (od 28.09.2026). Renderowany przez chrome.js ze znacznika cw-navbar.",
      "mechanika": "Wyzwalacze otwierają mega-menu (aria-expanded, przyciemnienie tła), pozycja bieżąca podświetlona z data-current; poniżej progu mobilnego pasek pokazuje przycisk otwierający nawigację mobilną. Licznik przy ikonie koszyka i jej etykietę dostępną odświeża sklep-wspolne.js, na stronach bez tego skryptu cw.js czyta liczbę z sessionStorage. Podgląd koszyka: po najechaniu na ikonę koszyka (tylko wskaźnik z kursorem, od 980 px, nigdy na stronie koszyka) po 150 ms wysuwa się pod nagłówkiem panel – pozycje w rzędzie (miniatura opakowania, nazwa, opakowanie, „3 × 39 zł”, wartość; strzałki przewijania, gdy pozycje się nie mieszczą) i pasek z liczbą opakowań, wartością produktów oraz przyciskami „Koszyk” i „Przejdź do kasy”; przy pustym koszyku zdanie i „Przejdź do sklepu”. Zamyka się 250 ms po zjechaniu kursorem z ikony i panelu, Escape albo przy otwarciu mega-menu; klik w ikonę dalej prowadzi do koszyka, na dotyku panelu nie ma. Dane z sessionStorage cw_cart_items, przerysowanie przy zdarzeniu cw:cart. Obsługa w cw.js.",
      "baza": {
        "plik": "v7/chrome.js",
        "kotwica": "serwis-naglowek"
      },
      "kod": {
        "css": "wireframe.css (wf-navbar) + cw.css (cw-nav, cw-brand, cw-cart, cw-minicart) + cw.css (cw-probar)",
        "js": "chrome.js (szablon NAVBAR) + cw.js (mega-menu, podgląd koszyka, licznik) + sklep-wspolne.js (licznik na stronach sklepu) + chrome.js (stan zalogowany-pro)"
      },
      "czesci": [
        "wordmark",
        "3 wyzwalacze mega-menu i 3 linki działów",
        "przycisk Konfiguratora",
        "przycisk „Sklep”",
        "ikona koszyka z licznikiem",
        "podgląd koszyka (cw-minicart)",
        "przycisk menu mobilnego",
        "przyciemnienie tła (cw-scrim)"
      ],
      "warianty": {
        "podglad-koszyka": "stan, nie osobny układ: nagłówek z otwartym podglądem koszyka (od 28.09.2026, spec sklep-v7-spec §12.11). Zrzut z makiety demonstracyjnej v7/lab/ce-01-podglad-koszyka.html, która wczytuje przykładowy koszyk z makiety koszyka (trzy pozycje, sześć opakowań, 877 zł) i otwiera podgląd przez cw.js",
        "zalogowany-pro": "stan, nie osobny układ: nad nagłówkiem pasek z nazwą zalogowanego konta profesjonalnego, odnośnikiem powrotu do panelu i odnośnikiem do karty produktu (klasa cw-probar), w miejscu ikony koszyka przycisk „Panel B2B”"
      },
      "zrzut": {
        "strona": "v7/carbomat.html",
        "maxh": 200
      },
      "zrzuty_wariantow": {
        "podglad-koszyka": {
          "plik": "v7/lab/ce-01-podglad-koszyka.html",
          "kotwica": "cw-minicart",
          "od": "#serwis-naglowek",
          "czekaj": 900,
          "maxh": 500
        },
        "zalogowany-pro": {
          "plik": "v7/lab/ce-01-zalogowany-pro.html",
          "kotwica": "serwis-naglowek",
          "od": ".cw-probar",
          "maxh": 260
        }
      }
    },
    "CE-02": {
      "nazwa": "Mega-menu",
      "grupa": "wspolne",
      "rodzina": "wspolne",
      "skrot": "Rozwijany panel pod nagłówkiem: nagłówek, kolumny odnośników lub boksy produktów, stopka z akcją.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "hover"
        ],
        "pozycje": [
          "9+"
        ],
        "nadaje": [
          "nawigacja",
          "lista-produktow"
        ],
        "mechanika": [
          "klik",
          "okno"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "szerokie": "Cztery boksy produktów, dwa przyciski w nagłówku panelu, rząd potrzeb.",
        "domyslne": "Trzy kolumny list odnośników.",
        "waskie": "Jedna wąska lista odnośników.",
        "grupy": "Pięć grup upraw z listami nazw (Ozime i Jare), stopka z Konfiguratorem."
      },
      "opis": "Panel rozwijany pod nagłówkiem: nagłówek panelu, kolumny odnośników, boksy produktowe albo grupy upraw, stopka panelu. Cztery warianty układu zależnie od treści działu.",
      "mechanika": "Otwierany wyzwalaczem z nagłówka (data-open, aria-controls), zamykany klikiem poza panelem albo Escape; tło przyciemnione przez cw-scrim. Obsługa w cw.js.",
      "baza": {
        "plik": "v7/chrome.js",
        "kotwica": "mega-produkty"
      },
      "kod": {
        "css": "cw.css (cw-mega)",
        "js": "chrome.js (szablon NAVBAR) + cw.js"
      },
      "czesci": [
        "nagłówek panelu (w wariancie szerokim z dwoma przyciskami)",
        "kolumny odnośników albo boksy",
        "stopka panelu"
      ],
      "warianty": {
        "szerokie": "cztery boksy produktowe (Produkty Carbohort); w nagłówku panelu dwa przyciski – „Poznaj całą gamę produktów” (jasny) i „Przejdź do sklepu” (ciemny, z ikoną koszyka, od 28.09.2026)",
        "domyslne": "trzy kolumny list – bez wystąpień od 20.09.2026, zastąpiony wariantem „grupy”",
        "waskie": "jedna lista (Programy i badania)",
        "grupy": "pięć grup upraw na pełną szerokość kontenera (Rodzaje upraw, 20.09.2026; wygląd pozycji ujednolicony 01.10.2026): tytuł grupy z kreską 2 px i lista pozycji o jednym wyglądzie, a w grupie Rolnicze dwie listy pod śródtytułami Ozime i Jare, bez kart i ikon. Pozycja ze swoją stroną jest linkiem w ciemnym tonie, pozostałe 28 to jaśniejsze spany „cw-crop--soon”; bez strzałek, pogrubień i szyny wyróżnień. Spec: 40-strona-www/koncepcja/menu-rodzaje-upraw-spec.md"
      },
      "zrzut": {
        "strona": "v7/carbomat.html",
        "klik": "[data-mega-trigger][aria-controls=\"mega-produkty\"]",
        "maxh": 700
      },
      "zrzuty_wariantow": {
        "grupy": {
          "plik": "v7/carbomat.html",
          "kotwica": "mega-uprawy",
          "klik": "[data-mega-trigger][aria-controls=\"mega-uprawy\"]"
        }
      }
    },
    "CE-03": {
      "nazwa": "Nawigacja mobilna",
      "grupa": "wspolne",
      "rodzina": "wspolne",
      "skrot": "Pionowy panel nawigacji mobilnej: lista działów, rozwijane grupy upraw i przycisk.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "tylko-naglowek"
        ],
        "ukryte": [
          "akordeon"
        ],
        "pozycje": [
          "9+"
        ],
        "nadaje": [
          "nawigacja"
        ],
        "mechanika": [
          "klik",
          "okno"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "opis": "Panel nawigacji rozwijany pod paskiem nagłówka na wąskich ekranach: lista działów z CTA, a pod etykietą „Rodzaje upraw” pięć rozwijanych grup upraw z tą samą treścią i tymi samymi stanami pozycji co mega-menu (od 20.09.2026).",
      "mechanika": "Otwierany przyciskiem menu z nagłówka, z przyciemnieniem tła; pozycja bieżąca podświetlona (data-nav na obu poziomach). Grupy upraw to natywne znaczniki „details” ze wspólnym atrybutem „name”, więc otwarta zostaje jedna i działają bez JS; grupę bieżącej uprawy otwiera funkcja „markCurrent” z chrome.js. Reszta obsługi w cw.js.",
      "baza": {
        "plik": "v7/chrome.js",
        "kotwica": "mobilenav"
      },
      "kod": {
        "css": "cw.css (cw-mobilenav)",
        "js": "chrome.js (szablon NAVBAR) + cw.js"
      },
      "czesci": [
        "lista działów",
        "etykieta działu upraw",
        "pięć rozwijanych grup upraw",
        "listy Ozime i Jare pod śródtytułami w grupie Rolnicze",
        "CTA"
      ],
      "warianty": {},
      "zrzut": {
        "strona": "v7/carbomat.html",
        "szerokosc": 375,
        "klik": "[data-navtoggle]",
        "maxh": 900
      }
    },
    "CE-04": {
      "nazwa": "Stopka serwisu",
      "grupa": "wspolne",
      "rodzina": "wspolne",
      "skrot": "Stopka: kolumna marki z opisem, trzy kolumny odnośników i pas dolny z notą praw.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "9+"
        ],
        "nadaje": [
          "nawigacja",
          "kontakt-formularz"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "panel": "Sam pas dolny – stopka panelu."
      },
      "opis": "Stopka na całą szerokość: cztery kolumny (marka i opis, odnośniki działów, produkty, kontakt) i pas dolny z prawami i odnośnikami prawnymi.",
      "mechanika": "Statyczna.",
      "baza": {
        "plik": "v7/chrome.js",
        "kotwica": "serwis-stopka"
      },
      "kod": {
        "css": "wireframe.css (wf-footer)",
        "js": "chrome.js (szablon FOOTER) + chrome.js (szablon footerPanel())"
      },
      "czesci": [
        "4 kolumny",
        "pas dolny"
      ],
      "warianty": {
        "panel": "sam pas dolny z prawami i odnośnikami (klasa cw-footer--panel) – stopka stron z nagłówkiem panelu (CE-91)"
      },
      "zrzut": {
        "strona": "v7/carbomat.html",
        "maxh": 700
      },
      "zrzuty_wariantow": {
        "panel": {
          "plik": "v7/platforma-b2b.html",
          "kotwica": "serwis-stopka",
          "maxh": 120
        }
      }
    },
    "CE-05": {
      "nazwa": "Dok doradcy",
      "grupa": "wspolne",
      "rodzina": "wspolne",
      "skrot": "Pływający pasek z polem pytania do doradcy i przyciskiem wysyłki; po otwarciu panel rozmowy.",
      "projekt": null,
      "tagi": {
        "media": [
          "ikona"
        ],
        "tekst": [
          "tylko-naglowek"
        ],
        "ukryte": [
          "okno"
        ],
        "pozycje": [
          "1"
        ],
        "nadaje": [
          "kontakt-formularz",
          "cta"
        ],
        "mechanika": [
          "formularz",
          "okno"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "opis": "Pływający dok w prawym dolnym rogu: pasek z polem pytania i przyciskiem, po otwarciu panel rozmowy (nagłówek, wiadomości, formularz).",
      "mechanika": "Ukryty na stronach z sekcją hero do czasu zejścia z hero (sterowanie w warstwie strony), otwierany przyciskiem albo z linków data-jurek-open; panel z tłem przyciemnionym. Obsługa w cw.js.",
      "baza": {
        "plik": "v7/chrome.js",
        "kotwica": "serwis-dok"
      },
      "kod": {
        "css": "cw.css (cw-jurek)",
        "js": "chrome.js (szablon DOCK) + cw.js + moduł 00 stron (updateDock)"
      },
      "czesci": [
        "pasek pytania",
        "panel rozmowy",
        "przyciemnienie tła"
      ],
      "warianty": {},
      "zrzut": {
        "strona": "v7/carbomat.html",
        "przewin": "#parametry",
        "maxh": 400
      }
    },
    "CE-06": {
      "nazwa": "Plakietka stanu prac",
      "grupa": "wspolne",
      "rodzina": "wspolne",
      "skrot": "Mała plakietka w rogu ekranu ze stanem makiety i linkiem do zadania; narzędzie robocze projektu.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "tylko-naglowek"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "1"
        ],
        "nadaje": [
          "ostrzezenie-nota"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "jednorazowy"
        ]
      },
      "opis": "Niska plakietka w lewym dolnym rogu: stan makiety (akceptacja układu), po akceptacji także stany kolejnych torów, oraz odnośnik do zadania AC dla bieżącej podstrony. Słowo „Makieta” prowadzi do strony stanu podstron.",
      "mechanika": "Renderowana z manifestu status.js po nazwie pliku; bez wpisu nie pojawia się. Narzędzie wewnętrzne projektu.",
      "baza": {
        "plik": "v7/chrome.js",
        "kotwica": "serwis-status"
      },
      "kod": {
        "css": "chrome.js (STATUS_CSS)",
        "js": "chrome.js (renderStatus)"
      },
      "czesci": [
        "stan makiety",
        "stany kolejnych torów",
        "odnośnik AC"
      ],
      "warianty": {},
      "zrzut": {
        "strona": "v7/carbomat.html",
        "maxh": 60
      }
    },
    "CE-07": {
      "nazwa": "Nawigacja kropkowa",
      "grupa": "nawigacja",
      "rodzina": "wspolne",
      "skrot": "Pionowa lista kropek przy prawej krawędzi, jedna na rozdział strony; klik przewija do rozdziału.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "tylko-naglowek"
        ],
        "ukryte": [
          "hover"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "nawigacja"
        ],
        "mechanika": [
          "przewijanie",
          "klik"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "opis": "Pionowa lista kropek przyklejona przy prawej krawędzi ekranu, jedna kropka na rozdział strony; etykiety rozdziałów wysuwają się po najechaniu na całą nawigację.",
      "mechanika": "Scrollspy po sekcjach z data-chapter (kropka aktywna większa), klik przewija płynnie do rozdziału (przez Lenis, gdy aktywny); mix-blend-mode difference na ciemnym tle; ukryta poniżej 900 px.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "nawigacja-kropki"
      },
      "kod": {
        "css": "ce/CE-07-nawigacja-kropkowa.css",
        "js": "ce/CE-07-nawigacja-kropkowa.js"
      },
      "czesci": [
        "lista kropek",
        "etykiety"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 500
      }
    },
    "CE-08": {
      "nazwa": "Hero",
      "grupa": "otwarcie",
      "rodzina": "otwarcie",
      "skrot": "Pierwszy ekran: kicker, duży H1, lead, dwa przyciski i okruszki, obok panel z packshotem lub kadrem.",
      "projekt": null,
      "tagi": {
        "media": [
          "packshot",
          "zdjecie"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "1"
        ],
        "nadaje": [
          "otwarcie-strony",
          "opis-produktu"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "polka": "Półka czterech opakowań na jasnym panelu po prawej.",
        "linia-produktow": "Nagłówek i lead w górnym rzędzie, pod nim gama opakowań w jednej linii.",
        "kadr": "Kadr zdjęcia uprawy na panelu zamiast packshotu.",
        "kadr-w-tle": "Zdjęcie uprawy w tle sekcji, H1 u dołu po lewej, lead i przyciski po prawej.",
        "player": "Panel z odtwarzaczem filmu.",
        "foto": "Panel ze zdjęciem zamiast packshotu.",
        "dzial": "Wąska kolumna z nagłówkiem działu, wyszukiwarką i przyciskiem przewodnika.",
        "artykul": "Nagłówek artykułu: okruszki, chipy, H1, metryka autora, przyciski udostępnij i drukuj."
      },
      "opis": "Pierwszy ekran pod menu serwisu (min-height 100svh minus menu). Lewa kolumna: kicker, H1, lead, rząd dwóch przycisków wyśrodkowane w pionie, dyskretny breadcrumb przy dolnej krawędzi. Prawa: jasnoszary panel z marginesem 30 px, a na jego środku packshoty, półka opakowań, kadr zdjęcia albo player.",
      "mechanika": "Statyczne; po zejściu z hero pojawia się dok doradcy (moduł 00 strony).",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "hero"
      },
      "kod": {
        "css": "ce/CE-08-hero.css",
        "js": "ce/00-base.js (updateDock)"
      },
      "czesci": [
        "kicker",
        "h1",
        "lead",
        "rząd 2 przycisków",
        "breadcrumb",
        "panel z mediami"
      ],
      "warianty": {
        "para-w-pudle": "dwa opakowania różnej wielkości na jednej linii półki, wpisane w pudełko budżetowe panelu: większe z tyłu, mniejsze przed nim; od bazy różni się tym, że rozmiar pary wyznacza mniejszy z budżetów szerokości i wysokości, a nie sama wysokość packshotu (element c5-hero__packs w panelu; carbomat.html#hero)",
        "packshot-szeroki": "szeroki i niski packshot stoi w przepływie na środku panelu i jest sterowany szerokością (72 % panelu, 86 % na telefonie, panel 4:3) zamiast wysokością jak w bazie (modyfikator c5-hero--packshot-szeroki; carbomat-mata.html#hero)",
        "niskie-okno": "zagęszczenie kolumny tekstu na niskim oknie (do 920 px i do 760 px wysokości, od 900 px szerokości): mniejsze odstępy i H1, lead na całą kolumnę, oba przyciski w jednym rzędzie, żeby hero z długim leadem został jednym ekranem; baza takiego kroku nie ma (modyfikator c5-hero--niskie-okno; carbomat-mata.html#hero)",
        "polka": "półka czterech opakowań rodzin na jasnym panelu po prawej; od 20.09.2026 bez wystąpienia na stronie – Produkty przeszły na wariant linia-produktow, a ten został na stronie demonstracyjnej v7/lab/ce-08-polka.html (wzorzec „wersja alternatywna, stara zostaje w indeksie” jak przy CE-65 i CE-44)",
        "linia-produktow": "wariant Produktów od 20.09.2026 (komentarze Mateusza w artefakcie): sekcja bierze całą szerokość okna, kontener treści stoi na EL-29 c5-wrap--wide (1800 px, marginesy 40 px). W górnym rzędzie dwie kolumny: kicker i H1 po lewej, lead z dwoma przyciskami po prawej – tam, gdzie wariant polka trzymał panel z packshotami; okruszki schodzą pod nagłówek, bo dolna krawędź sekcji należy teraz do zdjęcia. Pod rzędem cała gama w jednej linii (mock-up klienta) na całą szerokość okna minus 40 px z każdej strony, przyklejona do dolnej krawędzi i skalowana object-fit:contain, więc przy niskim oknie maleje, zamiast wypychać hero. Wysokość sekcji nadal 100 svh minus pasek menu. Modyfikator c5-hero--linia-produktow w ce/CE-08-hero.css",
        "kadr": "kadr zdjęcia uprawy zamiast packshotu – od 19.09.2026 bez wystąpień, na Kukurydzy zastąpił go wariant kadr-w-tle",
        "kadr-w-tle": "hero podstron upraw (decyzja Mateusza z 19.09.2026): duży kadr uprawy w tle całej sekcji, jednolity scrim, bez kickera; okruszki u góry po lewej, wielki H1 u dołu po lewej, lead i dwa przyciski u dołu po prawej, treść kończy się nad dokiem doradcy; kadr osiada ze skali 1,06, treść wchodzi kaskadą; poniżej 900 px H1 na kadrze, lead i przyciski pod nim (modyfikator c5-hero--bg w ce/CE-08-hero.css; siłę scrimu ustawia strona własnością --c5-hero-scrim w atrybucie style na section#hero, domyślnie .4; --c5-hero-scrim-narrow daje osobną wartość do 1099 px)",
        "player": "player filmu na środku panelu zamiast packshotu; na telefonie wysokość panelu wyznacza film, bez kadru 4:5 (modyfikator c5-hero--player; prochnica-plus.html#hero)",
        "foto": "panel ze zdjęciem zamiast packshotu (o-firmie.html#hero)",
        "dzial": "jedna kolumna na dwie trzecie szerokości, wysokość wg treści, wyszukiwarka i przycisk przewodnika (centrum-wiedzy.html#hero, centrum-wiedzy-kategoria.html#hero)",
        "artykul": "nagłówek artykułu: okruszki, chipy, h1, metryka autora, przyciski udostępnij/drukuj (artykul.html#naglowek)"
      },
      "zrzuty_wariantow": {
        "kadr-w-tle": {
          "plik": "v7/kukurydza.html",
          "kotwica": "hero"
        }
      },
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-09": {
      "nazwa": "Marquee",
      "grupa": "otwarcie",
      "rodzina": "pasy",
      "skrot": "Poziomy pas zapętlonego dużego tekstu przeplatanego kwadratowymi miniaturami zdjęć.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie"
        ],
        "tekst": [
          "tylko-naglowek"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "korzysci-argumenty",
          "galeria-media"
        ],
        "mechanika": [
          "ruch-wlasny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "z-ikona": "Hasła przeplatane ikonami zamiast miniatur zdjęć."
      },
      "opis": "Poziomy pas między hero a następną sekcją: duży tekst pozycji przeplatany kwadratowymi miniaturami (narożniki 12 px), tor zdublowany, 130 px odstępu góra i dół (80 px na telefonie).",
      "mechanika": "Pętla bez szwu (translateX -50 %, ok. 42 s), pauza po najechaniu; przy reduced-motion statyczny pas przewijany w poziomie.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "zalety"
      },
      "kod": {
        "css": "ce/CE-09-marquee.css",
        "js": "brak (czysty CSS)"
      },
      "czesci": [
        "pozycje: tekst + miniatura"
      ],
      "warianty": {
        "z-ikona": "pozycja z 24 px ikoną przed tekstem, bez miniatury; włącza się obecnością ikony w etykiecie (strona główna)",
        "keep-3": "modyfikator c5-marq--keep-3: przy reduced-motion zostają widoczne trzy pierwsze pozycje",
        "keep-4": "modyfikator c5-marq--keep-4: przy reduced-motion zostają widoczne cztery pierwsze pozycje",
        "keep-5": "modyfikator c5-marq--keep-5: przy reduced-motion zostaje widocznych pięć pierwszych pozycji",
        "thumb-ph": "modyfikator miniatury c5-marq__thumb--ph: puste pole (span) zamiast zdjęcia, kolor z --c5-marq-ph",
        "thumb-pack": "modyfikator miniatury c5-marq__thumb--pack: packshot opakowania na jasnoszarym polu z 10 % marginesu"
      },
      "zrzut": {
        "maxh": 320
      }
    },
    "CE-10": {
      "nazwa": "Parametry na wideo",
      "grupa": "otwarcie",
      "rodzina": "sceny",
      "skrot": "Zdjęcie lub wideo w tle, na nim kicker, nagłówek i tabela parametrów w szklanych kafelkach.",
      "projekt": null,
      "tagi": {
        "media": [
          "wideo",
          "zdjecie"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "taby-przelacznik"
        ],
        "pozycje": [
          "9+"
        ],
        "nadaje": [
          "liczby-dane",
          "opis-produktu"
        ],
        "mechanika": [
          "przewijanie",
          "statyczny"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "skroty_wariantow": {
        "z-tabami": "Dwa zestawy parametrów przełączane tabami nad tabelą.",
        "kafelki-z-wejsciem": "Osiem półprzezroczystych kafelków parametrów na zdjęciu, wejście z przewijania."
      },
      "opis": "Sekcja bez własnego tła, 30 px marginesu z boków, min-height 100svh: wideo w pętli przyklejone na całą wysokość sekcji pod maską, nad nim wyśrodkowana treść (tytuł, tabela dl, dyskretny link do analizy, przyciski karty i certyfikatów, przypis).",
      "mechanika": "Wideo sticky na czas sekcji, pauza przy reduced-motion (poster); treść przewija się po wideo, gdy dłuższa niż ekran. Moduł 30.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "parametry"
      },
      "kod": {
        "css": "ce/CE-10-parametry.css – jeden plik dla wszystkich układów: kafelki domyślnie, warianty col, long i z-tabami w tym samym pliku; ustawienia wystąpienia na korzeniu: --c5-params-scrim, --c5-params-clear, --c5-params-title-font, --c5-params-title-wrap",
        "js": "kafelki z wejściem: ce/CE-10-parametry-kafelki-z-wejsciem.js (CARBOMAT ECO, CARBOHUMIC, CARBOMAT HUMIC); wariant z-tabami: ce/CE-10-parametry.js (CARBOMAT Mata)"
      },
      "czesci": [
        "warstwa wideo z maską",
        "tytuł",
        "tabela dl",
        "link do analizy",
        "rząd przycisków",
        "przypis"
      ],
      "warianty": {
        "z-tabami": "tabela z liniami między wierszami zamiast kafelków, mniejszy nagłówek i dwa zestawy parametrów przełączane tabami nad tabelą (klasa c5-params--tabs na korzeniu)",
        "kafelki-z-wejsciem": "układ i wejście wg ramek Figma „Frame 140-8364” (kicker) i „Frame 140-8369” (tabela), uwagi Mateusza z 20.09.2026 (CARBOMAT ECO „Parametry”): kicker to pigułka bez tła z obrysem 1 px w bieli, promień 10 px, wersaliki 13/14 px, 24 px nad nagłówkiem; nagłówek wyśrodkowany na P22 Mackinac Pro Book 46/54 px; tabela to nie wiersze z liniami, tylko osiem osobnych kafelków – tło rgb(255 255 255 / .07) z rozmyciem 6,7 px, promień 15 px na czterech rogach każdego, wysokość 68 px, odstęp 7 px, bez obramowań i bez naprzemiennych teł; link do analizy pod tabelą bez podkreślenia i bez ikony; wejście sterowane przewijaniem w czterech krokach – kadr wjeżdża od dołu i rozszerza się na pełną szerokość, potem narasta ciemna nakładka, potem kicker z nagłówkiem, na końcu wiersze jeden po drugim, żeby przez chwilę było widać samą warstwę mediów; animacja wisi na .c5-params__media, więc powrót ze zdjęcia na wideo to podmiana jednego znacznika; przy reduced-motion, bez JS i poniżej 900 px wszystko stoi w stanie końcowym od pierwszej klatki. Od 02.10.2026 moduł wspólny dla trzech stron (content-elementy-spec §12). Klasa c5-params--col trzyma treść w wyśrodkowanej kolumnie 732 px (CARBOMAT HUMIC: dziewięć wierszy, w warstwie mediów placeholder strony zamiast filmu). Klasa c5-params--long niesie długą tabelę (CARBOHUMIC: 18 wierszy): wartości zawijają się od jednej krawędzi, od 1240 px kafelki stoją w dwóch kolumnach, wiersze-zdania (c5-params__row--wide) biorą całą szerokość, wiersz-kontrapunkt ma cienką ramkę (c5-params__row--mark), a na telefonie krótki wiersz trzyma nazwę i wartość w jednej linii; przy więcej niż ośmiu wierszach krok wejścia skraca się, żeby ostatni wiersz zdążył przed końcem fazy. Krój P22 Mackinac i kicker-plakietka zostają wyłącznie na CARBOMAT ECO (krój przez --c5-params-title-font na korzeniu); na pozostałych stronach nagłówek stoi krojem kitu"
      },
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-11": {
      "nazwa": "Warianty na tabach",
      "grupa": "przelaczniki",
      "rodzina": "zwijane",
      "skrot": "Pasma produktów: packshot z przełącznikiem po lewej, biała karta opisu z funkcjami, pH i zakupem po prawej.",
      "projekt": null,
      "tagi": {
        "media": [
          "packshot",
          "ikona"
        ],
        "tekst": [
          "dlugi"
        ],
        "ukryte": [
          "taby-przelacznik"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "opis-produktu",
          "porownanie-wybor",
          "sklep-transakcja"
        ],
        "mechanika": [
          "przewijanie",
          "klik"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "skroty_wariantow": {
        "trzy-warianty": "Trzy taby i trzy bloki wariantów produktu.",
        "taby-lat": "Kompaktowe taby lat przełączające panele z tabelami wyników.",
        "karty-w-taby": "Karty wyboru sposobu aplikacji z packshotem, które w ruchu stają się tabami.",
        "pasma-z-przelacznikiem": "Pasmo z packshotem, pigułką przełącznika produktów i białą kartą opisu z cenami wariantów."
      },
      "opis": "Od 02.10.2026 CE stoi na dwóch stronach produktowych (CARBOMAT ECO, CARBOHUMIC) w wariancie pasma-z-przelacznikiem: pasmo na produkt na całą szerokość okna, po lewej packshot albo kadr zdjęcia z przełącznikiem produktów, po prawej karta opisu. Układ wcześniejszy (dziś tylko Próchnica+, wariant taby-lat): pasek tabów wariantów przyklejony do górnej krawędzi na czas bloku, pod nim bloki wariantów jeden pod drugim: nazwa wyśrodkowana, scena kafle | packshot | kafle, dwie kolumny (aplikacja | opakowania z cennikiem).",
      "mechanika": "Pasma: pasmo przypięte na wysokość okna, treść karty jedzie z przewijaniem, przełącznik to odnośniki do kotwic pasm (szczegóły w wariancie pasma-z-przelacznikiem). Taby (Próchnica+, mechanika z c5.js): taby nie ukrywają treści – klik przewija do bloku, scrollspy zaznacza tab bloku pod paskiem, pasek chowa się, gdy od dołu wchodzi następna sekcja.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "ktory-dla-mnie"
      },
      "kod": {
        "css": "wariant pasma-z-przelacznikiem: ce/CE-11-warianty-pasma.css (od 02.10.2026 moduł wspólny: CARBOMAT ECO, CARBOHUMIC); taby-lat (Próchnica+): kit c5.css",
        "js": "wariant pasma-z-przelacznikiem: ce/CE-11-warianty-pasma.js (od 02.10.2026 moduł wspólny: CARBOMAT ECO, CARBOHUMIC); taby-lat (Próchnica+): kit c5.js"
      },
      "czesci": [
        "pasmo produktu: packshot albo kadr zdjęcia (placeholder), przełącznik produktów",
        "karta opisu: nazwa i opcjonalne zdanie, grupy z etykietą – pigułki funkcji, akapity, listy, nota, pH z przyciskami zakupu, zwykłe przyciski",
        "wiersz zakupu: przycisk „Dodaj do koszyka” otwierający okno koszyka (przy wierszu pH albo jako samodzielny, ostatni wiersz karty)",
        "układ wcześniejszy: tablist i bloki wariantu (Próchnica+, taby-lat)"
      ],
      "warianty": {
        "trzy-warianty": "HISTORYCZNY – bez wystąpień od 02.10.2026 (CARBOHUMIC przeszedł na pasma-z-przelacznikiem; wersja do powrotu: archiwum-wersji/carbohumic-v7-przed-poprawkami-2026-10-02.html). Trzy taby i trzy bloki wariantów (CARBOHUMIC)",
        "taby-lat": "kompaktowe taby lat (ikona kalendarza w kółku + rok); od 02.10.2026 na Próchnicy+ przełączają panele – naraz widać jeden (tabele wyników 2025 / 2026 oraz lista raportów pod jednym tabem 2026), własny moduł strony z hakiem data-pp-tabs (prochnica-plus.js ===== 90), pasek nie przykleja się; bez JS panele stoją jeden pod drugim",
        "karty-w-taby": "HISTORYCZNY – bez wystąpień od 02.10.2026 (zastąpiony na CARBOMAT ECO wariantem pasma-z-przelacznikiem; wersja do powrotu: archiwum-wersji/carbomat-v7-przed-ce11-pasma-2026-10-02.html). karta i tab to jeden element w ruchu (button.c5-way), wg ramek Figma „Frame 310-461” (stan kart) i „Frame 310-418” (stan tabów) oraz trzech adnotacji projektanta (20.09.2026, CARBOMAT ECO „Który dla mnie”): pudełka wjeżdżają wyrównane do dolnej krawędzi okna (20 px nad nią), najpierw rysuje się sam obrys rosnący dwoma końcami ze środka dolnej krawędzi, potem wchodzą etykieta sposobu aplikacji, packshot i nazwa produktu, na końcu karta traci zdjęcie i nazwę, kurczy się 426 → 70 px i przykleja u góry jako tab. Szerokość, pozycje w poziomie i promień 10 px nie są animowane w ogóle – pasek to flex o równych kolumnach, więc oba stany są identyczne z definicji. Napęd to jedna wielkość p liczona z pustego pasa rozbiegu [data-ways-rail] stojącego przed paskiem; cała oś czasu jest odwracalna przy przewijaniu w górę, a przejście w zwykły sticky top:0 następuje dokładnie przy p = 1, bez skoku. Aktywny tab niesie zielony obrys #71C35F pokazujący postęp przewinięcia bloku wariantu pod linią przyklejonego paska – rośnie dwoma końcami ze środka lewej krawędzi i zapala się dopiero od p = 0,62 (przełącznik data-progress=„sekcja” na [data-variants] przestawia licznik na cały pojemnik sekcji); nieaktywne taby noszą tylko szary obrys, ciemne wypełnienie aktywnego tabu znika. Oba obrysy to ścieżki SVG z pathLength=„1”, więc dasharray operuje udziałem, nie pikselami, i jest poprawny przy każdej wysokości pudełka. Kicker to pigułka c5-kicker--outline (EL-06), H2 na P22 Mackinac Pro Book wagi 400 w 54/63 px, a panel wariantu stoi w dwóch kolumnach: kafel #F9F7F5 o proporcji 700/690 z packshotem i przyciskami wielkości opakowania nałożonymi na dole, obok kolumna z nazwą 40 px, siatką korzyści i parametrami (Aplikacja, Gdzie najlepiej, pH z chipami, Frakcja). Ceny przeniosły się z tabelki cennika na te przyciski (decyzja Mateusza z 20.09.2026, liczby co do znaku z AC #30867) – szkło rgb(0 0 0 / --c5-pkg-veil) z backdrop-filter: blur(10px), ikona koszyka i ukryty dopisek „– dodaj do koszyka”. Taby nawigują (przewijają do bloku), nie przełączają paneli, a roving tabindex jest zsynchronizowany ze scrollspy; strzałki, Home i End przenoszą fokus. Poniżej 900 px, przy reduced-motion i bez JS układ statyczny: pasek nieprzyklejony, taby jeden pod drugim, oba panele rozwinięte, przyciski opakowań pod packshotem",
        "pasma-z-przelacznikiem": "pasmo na produkt na całą szerokość okna, wg ramki Figma „382:1189” (02.10.2026, CARBOMAT ECO „Który dla mnie”): po lewej packshot produktu, pod nim przełącznik produktów (biała pigułka z odnośnikami do pasm, bieżący z aria-current), po prawej biała karta 609 px z nazwą produktu i grupami „Najważniejsze funkcje” (pigułki z ikoną), Aplikacja, Gdzie najlepiej, pH i Frakcja. Wjazd pudełek od dołu i przyklejane taby wariantu karty-w-taby zniknęły. Zakup stoi przy wierszach pH – każde pH to osobny produkt w sklepie: wiersz jest hostem konfiguracji data-cw-product (1:1 jak na kartach sklepu), a przycisk „Dodaj do koszyka” otwiera szybki podgląd CE-76 z sklep-wspolne.js, czyli dodanie do koszyka bez wychodzenia z podstrony; pojemności i cen w sekcji nie ma – wybiera się je w oknie koszyka (decyzja Mateusza z 02.10.2026: lista „Opakowania” zdjęta z kart). Mechanika od 900 px bez reduced-motion ([data-kdm=„ruch”]): pasmo przypięte na wysokość okna, karta jest oknem z wygaszeniem u dołu, a jej treść jedzie 1 px na 1 px przewinięcia strony aż do końca, potem pasmo puszcza i wchodzi następny produkt; budżet przewijania pasma (--kdm-extra) to nadmiar treści karty plus krótki postój, liczony przy każdej zmianie rozmiaru; fokus na kontrolce spod okna wciąga ją w kadr; na czas otwartego okna koszyka warstwa inercji stoi. Przełącznik to zwykłe odnośniki do kotwic pasm – działa bez skryptu przez szynę kotwic z ce/00-base.js. Bez JS i przy reduced-motion: dwie kolumny, lewa przyklejona, karta w pełnej wysokości; poniżej 900 px jedna kolumna. Kolorystyka ramki nie jest przeniesiona – pasma, pigułki i karta stoją w szarościach kitu za zmiennymi --c5-kdm-*; dolny odstęp przypiętego pasma to 104 px zamiast 40 px z ramki, żeby przełącznik i karta nie wchodziły pod dok doradcy (pokrętło --c5-kdm-pad-b). Liczba produktów dowolna: pasma to elementy [data-kdm-track], na CARBOHUMIC wejdą trzy. Od 02.10.2026 moduł wspólny (content-elementy-spec §12). CARBOHUMIC: trzy pasma z packshotami (niefiltrowany, filtrowany, OGRÓD), zakup jako samodzielny, ostatni wiersz karty (c5-kdm__buyrow – host konfiguracji sklepu), pod pasmami zostaje ostrzeżenie CE-31 (blok opakowań CE-28 zdjęty 02.10 na polecenie Mateusza). Moduł umie też kadr zdjęcia albo placeholder 4 : 5 w lewej kolumnie (c5-kdm__photo--frame + c5-kdm__fill), listy (c5-kdm__list), notę (c5-kdm__note) i zwykłe przyciski c5-btn w karcie – dziś bez wystąpień: próba na CARBOMAT HUMIC (pasma „Profesjonalista” i „Hobbysta”) została wycofana 02.10.2026. Przełącznik od trzech pozycji bierze mniejszy stopień pisma i przy wąskiej lewej kolumnie staje w pionie; to samo dla dwóch pozycji daje klasa c5-kdm__switch--auto (od 900 px; CARBOMAT ECO). Klasa c5-kdm--dock na korzeniu kończy przyklejoną lewą kolumnę nad dokiem doradcy w układzie bez ruchu",
        "glowa-frame": "głowa sekcji nad pasmami wg ramki Figma „382:1189”: kicker jako pigułka z ciemnozielonym obrysem, nagłówek w kroju P22 Mackinac Pro w ciemnej zieleni, lead w szarości tekstu karty i mniejszy dolny odstęp sekcji; baza zostawia głowę w stylu wspólnym (klasa c5-sec--kdm-frame na korzeniu)"
      },
      "zrzuty_wariantow": {
        "pasma-z-przelacznikiem": {
          "plik": "v7/carbomat.html",
          "kotwica": "ktory-dla-mnie",
          "ruch": true,
          "przewin": "#wariant-eco",
          "czekaj": 900
        }
      },
      "zrzut": {
        "maxh": 1400
      }
    },
    "CE-12": {
      "nazwa": "Scena faktów",
      "grupa": "sceny",
      "rodzina": "sceny",
      "skrot": "Przypięta scena: po lewej tytuł, opis i licznik jednego faktu naraz, po prawej zdjęcie z boksem ilustracji.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie",
          "schemat-wykres"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "przewijanie"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "korzysci-argumenty",
          "kroki-proces",
          "opis-produktu"
        ],
        "mechanika": [
          "przewijanie"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "naglowek-nad-scena": "Nagłówek i lead nad torem, w scenie tylko opis punktu.",
        "osiem-krokow": "Scena z ośmioma krokami, kroki 2–6 na wspólnym zdjęciu.",
        "z-leadem": "Scena z dwoma akapitami leadu przyklejonymi z nagłówkiem.",
        "z-naglowkiem": "Kicker i H2 przyklejone w lewej kolumnie, pod nimi fakt z linią postępu i licznikiem.",
        "bez-naglowka": "Scena bez kickera i H2; nagłówek stoi nad torem jako zwykły nagłówek sekcji.",
        "glass-i-zielen": "Warstwa wyglądu: szklane karty faktu i wizualizacji na zielonym tonie."
      },
      "opis": "Scena sticky 100svh w wysokim torze, układ wg ramki Figma „Frame 206”: kontener na całą szerokość okna (do 1800 px), po lewej przyklejony kicker i H2 (wariant z-naglowkiem) albo sama kolumna tekstu, przy dolnej krawędzi jeden fakt naraz – tytuł, cienka linia z postępem slajdu, opis i licznik „02/05”; po prawej panel zdjęcia na wysokość ekranu z marginesem 20 px, bez przyciemnienia, z boksem ilustracji na rozmytym tle (kolory odwrócone).",
      "mechanika": "Pozycja przewijania wybiera krok (długość kroku ze zmiennych --fx-step-min 480 i --fx-step-vh 0,8), zdjęcie panelu crossfade, ilustracja podmieniana, linia postępu bieżącego slajdu z --fx-f; jedyny blok [data-fx-head] w sekcji nigdy nie dostaje hidden (strażnik modułu). Poniżej 900 px, przy reduced-motion i bez JS bloki stoją jeden pod drugim. Moduł 50.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "czym-jest"
      },
      "kod": {
        "css": "ce/CE-12-scena-faktow.css – układ wg ramki Figma „Frame 206” i wszystkie warianty (sekcje „wariant: …” na końcu pliku); niesie też boks ilustracji c5-viz i wykres c5-bar. Arkusze stron nie zawierają żadnej reguły sceny: wariant wybiera klasa c5-fx--… na korzeniu, dopasowania pod treść idą przez style=„--nazwa: wartość” na korzeniu.",
        "js": "ce/CE-12-scena-faktow.js – jeden moduł dla wszystkich wystąpień; przy dwóch blokach nagłówka stan trzyma atrybut data-fx-state na korzeniu (brak = z-naglowkiem). Atrybutu data-ce-wariant moduł nie czyta i nie zmienia."
      },
      "czesci": [
        "kicker + h2 (+ lead)",
        "N opisów",
        "kreska postępu i licznik przy każdym opisie",
        "panel zdjęcia",
        "boks ilustracji"
      ],
      "warianty": {
        "naglowek-nad-scena": "nagłówek i lead nad torem, w scenie tylko opis punktu (Mata) – bez wystąpień od 19.09.2026, CARBOMAT MATA przeszła na wariant bez-naglowka",
        "osiem-krokow": "8 kroków, kroki 2–6 na wspólnym zdjęciu (CARBOMAT HUMIC) – bez wystąpień od 19.09.2026: liczba kroków jest treścią, a długość kroku toru ustawiają zmienne --fx-step-min i --fx-step-vh, więc CARBOMAT HUMIC stoi dziś na wariancie z-naglowkiem",
        "z-leadem": "dwa akapity leadu przyklejone razem z nagłówkiem (Próchnica+ Metodologia) – bez wystąpień od 19.09.2026, Metodologia przeszła na wariant bez-naglowka",
        "z-naglowkiem": "układ wg ramki Figma „Frame 206” z kickerem i H2 w scenie, bez leadu: jeden blok nagłówka przyklejony u góry lewej kolumny, przy dole jeden fakt naraz – tytuł, cienka linia z postępem bieżącego slajdu, opis i licznik „02/05” (Mateusz, 18.09.2026; od 19.09.2026 Produkty #jak-dzialaja, CARBOMAT ECO #czym-jest jako baza CE i CARBOMAT HUMIC #czym-jest – osiem kroków, --fx-step-min 420, --fx-step-vh 0,7)",
        "bez-naglowka": "ten sam układ bez kickera i H2 w scenie – kicker, H2 i lead stoją nad torem jako zwykły nagłówek sekcji (reguła Mateusza: lead nigdy w scenie); od 19.09.2026 Próchnica+ #metodologia, CARBOMAT MATA #czym-jest-scena (korzeń CE to wewnętrzny kontener w sekcji #czym-jest) i CARBOHUMIC #czym-jest, a na Produktach do obejrzenia przełącznikiem podglądu",
        "glass-i-zielen": "warstwa wyglądu nałożona na dowolny układ sceny, klasa c5-fx--glass na korzeniu: tytuł faktu wagi 400, opis 14 px w #777771, licznik 11 px, kreska postępu czerń .1 z wypełnieniem w zieleni #71C35F (--c5-fx-green), boks ilustracji z promieniem i paddingiem 24 px, tłem rgb(53 46 40 / .43) i szkłem (blur 18 px, krawędź inset), plakietka numeru 16 px, słupki 6 px z etykietami 13–16 px, odstępy przy kresce 11/13 px (CARBOMAT ECO, CARBOHUMIC, CARBOMAT HUMIC).",
        "glass-v1": "pierwsza wersja warstwy glass, klasa c5-fx--glass-v1: wszystko jak w glass-i-zielen poza typografią słupków w boksie (zostaje 13 px) i odstępami przy kresce (zostają 14/16 px) (Produkty).",
        "naglowek-ramka": "nagłówek sceny wg ramki Figma „Frame 140-8475”, klasa c5-fx--naglowek-ramka: kicker jako plakietka z obrysem #0c2b1c, 24 px pod nią H2 w P22 Mackinac Pro Book 46/51 px na mierze 661 px, ze stopniami dla wąskiego i niskiego okna (CARBOMAT ECO).",
        "szeroki": "klasa c5-fx--szeroki: w układzie statycznym od 900 px kolumna sceny stoi w szerokim kontenerze 1800 px z marginesem 40 px zamiast 1180 px (Próchnica+).",
        "viz-auto": "klasa c5-fx--viz-auto: boks ilustracji bierze wysokość treści zamiast kafla 4:5 z limitem 520 px (Próchnica+).",
        "viz-min-kafel": "klasa c5-fx--viz-min-kafel: poniżej 900 px kafel 4:5 jest minimum boksu, a boks rośnie z treścią zamiast ją przycinać (CARBOHUMIC).",
        "skala-opis-dlugi": "klasa c5-fx--skala-opis-dlugi: opis w scenie z interlinią 1,5 schodzi o stopień w oknie do 1000 px wysokości, na szerokości 900–1279 px i ponownie do 780 px wysokości (Próchnica+).",
        "skala-osiem-krokow": "klasa c5-fx--skala-osiem-krokow: boks ilustracji 68 svh zamiast 62, opis w scenie 14 px, a w oknie do 780 px wysokości opis 13 px i boks 74 svh (CARBOMAT HUMIC).",
        "skala-waskie-okno": "klasa c5-fx--skala-waskie-okno: boks ilustracji 68 svh, poniżej 1440 px szerokości do krawędzi doku doradcy; na szerokości 900–1199 px tytuł, opis i lista o stopień mniejsze, a przy wysokości do 740 px także tabela w boksie (CARBOHUMIC)."
      },
      "zrzuty_wariantow": {
        "z-naglowkiem": {
          "plik": "v7/produkty.html",
          "kotwica": "jak-dzialaja",
          "ruch": true,
          "przewin": "#jak-dzialaja [data-fx-track]",
          "czekaj": 900
        },
        "bez-naglowka": {
          "plik": "v7/carbohumic.html",
          "kotwica": "czym-jest",
          "ruch": true,
          "przewin": "#czym-jest [data-fx-track]",
          "czekaj": 900
        }
      },
      "zrzut": {
        "maxh": 900,
        "ruch": true,
        "przewin": "#czym-jest [data-fx-track]",
        "czekaj": 900
      }
    },
    "CE-13": {
      "nazwa": "Przypięta scena produktu",
      "grupa": "sceny",
      "rodzina": "sceny",
      "skrot": "Przypięta scena produktu: packshot kurczy się do paska z przyciskiem, pod nim zdjęcie i taby kadrów.",
      "projekt": null,
      "tagi": {
        "media": [
          "packshot",
          "zdjecie"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "przewijanie",
          "taby-przelacznik"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "opis-produktu",
          "kroki-proces"
        ],
        "mechanika": [
          "przewijanie",
          "klik"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "n-kadrow": "Scena z dowolną liczbą kadrów, tor liczony z liczby kadrów."
      },
      "opis": "Jeden article na produkt lub wariant: tor 100svh plus kilka ekranów, scena sticky; packshot z nazwą maleje do przyklejonego pasa z przyciskiem, zdjęcie rośnie od dołu, kartka opisu wjeżdża, taby kadrów przełączają zdjęcie i kartkę; napisy gasną na końcu.",
      "mechanika": "Wszystko interpolowane z pozycji przewijania (bez przejść w czasie), taby klikalne; poniżej 900 px pas jako blok i kadry jeden pod drugim. Moduł 60; wersja N kadrów liczy tor z liczby kadrów.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "jak-stosowac-eco"
      },
      "kod": {
        "css": "ce/CE-13-scena-produktu.css (warianty w tym samym pliku; kadrowanie zdjęcia drugiej warstwy: --use-pos-b na korzeniu)",
        "js": "ce/CE-13-scena-produktu.js"
      },
      "czesci": [
        "packshot z nazwą",
        "pas z przyciskiem",
        "zdjęcie kadru",
        "kartka opisu",
        "taby kadrów"
      ],
      "warianty": {
        "n-kadrow": "N kadrów = N terminów, tor liczony z liczby kadrów; kartka z nagłówkiem terminu i rozpiską dawek, nazwy terminów w tabach w jednej linii mniejszym stopniem pisma (klasa c5-use--n-kadrow na korzeniu)",
        "dwa-kadry": "dwa długie kadry na produkt i dłuższy tor niż w bazie – 5,5 ekranu na produkt, więcej czasu na każdą kartkę (klasa c5-use--dwa-kadry na korzeniu)"
      },
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-14": {
      "nazwa": "Sekcja 100svh z listą i zdjęciem",
      "grupa": "sceny",
      "rodzina": "obraz-tekst",
      "skrot": "Sekcja na ekran: kicker, H2, numerowana lista kroków z przyciskiem i zdjęcie na całą wysokość.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "kroki-proces",
          "cta"
        ],
        "mechanika": [
          "przewijanie"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "opis": "Sekcja na wysokość ekranu, 30 px góra i dół: lewa kolumna z kickerem i H2 u góry oraz listą ol z numerami w kółkach i przyciskiem u dołu; prawa kolumna to zdjęcie na całą wysokość.",
      "mechanika": "Lekki parallax zdjęcia z pozycji przewijania (tylko motionOn); poniżej 900 px zdjęcie nad listą. Moduł 70.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "dawka"
      },
      "kod": {
        "css": "ce/CE-14-sekcja-100svh.css",
        "js": "ce/CE-14-sekcja-100svh.js"
      },
      "czesci": [
        "kicker + h2",
        "lista ol",
        "przycisk",
        "zdjęcie"
      ],
      "warianty": {
        "rozpiska": "w dolnej części lewej kolumny rozpiska dawek zamiast listy numerowanej i dwa przyciski obok siebie; lewa kolumna szersza niż w bazie, pod przyciskami prześwit na dok doradcy (klasa c5-dose-sec--rozpiska na korzeniu)"
      },
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-15": {
      "nazwa": "Przypięte wiersze z packshotem",
      "grupa": "sceny",
      "rodzina": "zwijane",
      "skrot": "Akordeon wierszy z nagłówkiem i wierszami produktu z packshotem, otwieranymi kolejno przy przewijaniu.",
      "projekt": null,
      "tagi": {
        "media": [
          "packshot"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "akordeon",
          "przewijanie"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "harmonogram-czas",
          "lista-produktow",
          "kroki-proces"
        ],
        "mechanika": [
          "przewijanie",
          "klik",
          "ruch-wlasny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "kaskada-z-odliczaniem": "Trzy kolumny kart-akordeonów kaskadą, pierścień odliczania otwiera kolejną.",
        "kaskada-z-pinem": "Trzy kolumny akordeonów z nagłówkami faz, otwierane przewijaniem przypiętej sekcji."
      },
      "opis": "Nagłówek (kicker, H2, lead) przyklejony na czas cyklu; blok wierszy wchodzi w biegu z pierwszym wierszem otwartym i przykleja się dolną krawędzią; wiersz = tytuł | kwadratowa scena z packshotem | nazwa, opis, przycisk.",
      "mechanika": "Dalsze przewijanie otwiera kolejne wiersze (kwadrat rozwija się od dołu, potem wjeżdża packshot), po ostatnim całość odjeżdża; bez ruchu akordeon na klik z pierwszym otwartym; bez JS wszystkie otwarte. Moduł 80.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "sezon-wiersze"
      },
      "kod": {
        "css": "ce/CE-15-wiersze-packshot.css – wariant kaskada-z-pinem (od 02.10.2026 moduł wspólny: CARBOMAT ECO, CARBOHUMIC, CARBOMAT Mata, Produkty)",
        "js": "ce/CE-15-wiersze-packshot.js – wariant kaskada-z-pinem (od 02.10.2026 moduł wspólny: CARBOMAT ECO, CARBOHUMIC, CARBOMAT Mata, Produkty)"
      },
      "czesci": [
        "nagłówek przyklejony",
        "wiersze: tytuł, scena, packshot, opis, przycisk"
      ],
      "warianty": {
        "kaskada-z-odliczaniem": "⚠️ Bez wystąpień od 02.10.2026: „Co dają – i kiedy to zobaczysz” na Produktach przeszło na kaskada-z-pinem (polecenie Mateusza). Opis historyczny – układ wg ramki Figma „Frame 224” i adnotacji Mateusza (19.09.2026; Produkty „Co dają – i kiedy to zobaczysz”): bez pinu – nagłówek sekcji w zwykłym biegu, pod nim trzy kolumny rozdzielone pionowymi liniami włosowymi w szerokim kontenerze (1800 px, marginesy 40 px), w każdej jedna karta-akordeon, karty kaskadą w dół (góra następnej = dół poprzedniej, suma wysokości stała); nagłówek karty: tytuł z lewej, etykieta czasu z prawej, ikona plus / minus w okręgu; otwarta karta: wiersz produktu z packshotem (link na stronę produktu, wzór EL-33) i opis ze znacznikiem; pierwsza karta otwarta od startu, karty wchodzą po kolei, wokół ikony minus rysuje się pierścień odliczający 5 s, po nim otwiera się następna karta (po trzeciej pierwsza), jedna otwarta naraz, wszystkie można zamknąć, każde kliknięcie wyłącza automat; automat tylko na szerokim ekranie i przy włączonym ruchu, stoi pod kursorem i przy fokusie; poniżej 900 px i bez JS jedna kolumna",
        "kaskada-z-pinem": "ta sama kaskada trzech akordeonów, ale jako pin sterowany przewijaniem – wg ramki Figma „Frame 308-179” i adnotacji projektanta (20.09.2026; CARBOMAT ECO „Kiedy stosować”): sekcja stoi w jednym miejscu, nagłówek i kicker widoczne przez cały pin, najpierw wchodzi oś czasu (trzy etykiety i trzy klamry 457 × 30 px, promień 20 px na górnych narożnikach), dopiero po niej karty; start z pierwszą kartą rozwiniętą i resztą zwiniętą, każdy krótki scroll zamyka bieżącą kartę i otwiera następną, a po ostatniej wszystkie zostają zwinięte i dopiero wtedy strona jedzie dalej. Z wariantu kaskada-z-odliczaniem zostaje bez zmian: trzy kolumny rozdzielone liniami włosowymi, inset 6 px, karta zwinięta 70 px, stała suma wysokości 462 px, kaskada „dół n = góra n+1”, wejście po kolei i komplet fallbacków; odpada pierścień odliczający 5 s i zapętlenie, bo adnotacja opisuje pin, a nie odliczanie. Wygląd: promienie 7 i 12 px, tło karty otwartej #FBFBF9, znacznik 4 × 4 px w zieleni #71C35F, opis 15 px w czerni, wiersz produktu 406 × 69 px bez szarej podkładki i bez strzałki, packshot 45 × 50 px; klasy c5-casc*, poniżej 900 px, przy reduced-motion i bez JS trzy pozycje rozwinięte. Od 02.10.2026 moduł wspólny (content-elementy-spec §12): trzy albo cztery przystanki (karty liczy skrypt), wiersz produktu opcjonalny, w panelu opcjonalnie tytuł, akapit pomocniczy z linkiem i przycisk; etykieta osi może stać w nagłówku karty (c5-casc__when), żeby nie znikała na telefonie i bez JS. Atrybut data-casc-fit sprawdza, czy przypięta scena mieści się nad dokiem doradcy, i schodzi po poziomach: zwarty nagłówek, samo pudełko bez przypiętego nagłówka, układ statyczny. Wystąpienia: CARBOHUMIC „Próchnica w czasie” – trzy przystanki bez produktów (zastąpił CE-32; czwarty przystanek „gotowe do aplikacji” stoi jako nota CE-31 pod sceną – uwaga Mateusza z 02.10: na końcu osi czytał się jako etap najpóźniejszy); CARBOMAT Mata „Sezon po sezonie” – trzy przystanki z tytułem, tekstem i przyciskiem (zastąpił CE-29); CARBOMAT ECO – data-casc-fit=„frame”, czyli ta sama kontrola przy kompozycji z ramki"
      },
      "zrzuty_wariantow": {
        "kaskada-z-pinem": {
          "plik": "v7/carbomat.html",
          "kotwica": "sezon-wiersze",
          "ruch": true,
          "przewin": "#sezon-wiersze [data-casc-pin]",
          "czekaj": 900
        }
      },
      "zrzut": {
        "maxh": 1000
      }
    },
    "CE-16": {
      "nazwa": "Pas PRO",
      "grupa": "sceny",
      "rodzina": "pasy",
      "skrot": "Pas ze zdjęciem w zaokrąglonej ramce, pod nim nagłówek po lewej i akapit z przyciskami po prawej.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "1"
        ],
        "nadaje": [
          "cta",
          "kontakt-formularz"
        ],
        "mechanika": [
          "przewijanie"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "zamykajacy": "Kadr z nagłówkiem i dwoma przyciskami bez akapitu.",
        "kontakt": "Pas zamykający rozmową: nagłówek, akapit i akcje kontaktowe (telefon, przyciski).",
        "pozny-wzrost": "Kadr startuje na połowie szerokości i rośnie do pełnej z narastającym przyciemnieniem.",
        "zielen-i-scrim": "Warstwa wyglądu: szare tło, zielony przycisk, scrim na zdjęciu.",
        "kadr-z-prawej": "Statyczne zdjęcie na prawej połowie pasa, po lewej tekst i przycisk."
      },
      "opis": "Pas na szarym tle: kadr zdjęcia z narożnikami 30 px, pod nim nagłówek po lewej oraz akapit i dwa przyciski po prawej; pod przyciskami opcjonalny cichy link trzeciej akcji.",
      "mechanika": "Kadr skaluje się od .5 do 1, gdy górna krawędź sekcji schodzi poniżej 75 % okna (koniec przy 10 %); statyczny kadr 3:2 na telefonie. Moduł 80/85.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "uprawy-profesjonalne"
      },
      "kod": {
        "css": "ce/CE-16-pas-pro.css – jeden moduł dla wszystkich stron poza sklepem: baza i sekcje wariantów wybieranych klasami na korzeniu (c5-pro--ramka, c5-pro--kadr-3-2, c5-pro--zielen, c5-pro--scrim-ukosny, c5-pro--h-mackinac, c5-pro--zamykajacy; na placeholderze c5-pro__ph--obrys), dopasowania pod treść przez własności --pro-mt, --pro-img-pos, --pro-scrim i --pro-side-max w atrybucie style korzenia; arkusze stron nie niosą reguł pasa, poza dodatkami strony głównej w home.css (c5h-kontakt); wariant kadr-z-prawej: kit c5.css (c5-pro, c5-pro__photo, c5-pro__grid) + nadpisania strony – sklep.html <style> blok „PAS PRO” (c5sk-pro) i pdp.css (c5pd-pro)",
        "js": "ce/CE-16-pas-pro.js (Kukurydza, Borówka, O nas, strona główna); wariant pozny-wzrost: ce/CE-16-pas-pro-pozny-wzrost.js (Produkty, CARBOMAT ECO, CARBOMAT MATA, CARBOHUMIC, CARBOMAT HUMIC); wariant kadr-z-prawej: brak (statyczny)"
      },
      "czesci": [
        "kadr",
        "h2",
        "akapit",
        "rząd 2 przycisków",
        "link „Nie masz konta? Załóż konto” (c5-pro__signup, opcjonalny)"
      ],
      "warianty": {
        "zamykajacy": "bez akapitu: nagłówek po lewej, dwa przyciski po prawej, oba na kadrze (Kukurydza; od 18.09.2026 na bazowym kodzie CE zamiast własnego portu u-end). Od 20.09.2026 (uwaga Mateusza: „Zdjęcie w tle zostaw na pełną szerokość ekranu, natomiast teksty po lewej i przyciski po prawej są w ramach kontenera z treścią o maksymalnej szerokości 1180 px. Typografia i przyciski odwzoruj z Frame 186-253”) kadr zostaje pełnoekranowy, a treść wraca z c5-wrap--wide na c5-wrap; typografia i przyciski jak w wariancie zielen-i-scrim – nagłówek 52/53 px na P22 Mackinac Pro, zielony przycisk podstawowy #86D574 z tuszem #0C2B1C, promienie 20 px, wysokość 56 px, odstęp 11 px, obwódka drugorzędnego rgb(255 255 255 / .5). Reguły w module pod klasami c5-pro--zamykajacy, c5-pro--zielen i c5-pro--h-mackinac; zostaje podłożenie rgb(0 0 0 / .3) pod przyciskiem drugorzędnym (poprawka czytelności na rozświetlonym pyle) i tło pasa --w-gray-600, bo kadr zakrywa je w całości",
        "kontakt": "pas zamykający rozmową: nagłówek po lewej, po prawej akapit i akcje kontaktowe. Na O nas (#porozmawiajmy) dwa przyciski, Kontakt i Zostań partnerem; na stronie głównej (#kontakt, 20.09.2026) numer telefonu jako duży link tel: z cyframi tabelarycznymi, wiersz godzin drobnym drukiem, dwa przyciski i cichy link do wszystkich działów",
        "pozny-wzrost": "kadr stoi na 50 % szerokości ekranu, dopóki górna krawędź pasa jest niżej niż 35 % wysokości okna, potem rośnie i pełny rozmiar osiąga 2 % od góry okna; nakładka przyciemniająca narasta razem ze wzrostem, więc w postoju zdjęcie jest bez przyciemnienia (uwagi Mateusza z 18.09.2026; od 19.09.2026 na pięciu stronach: Produkty, CARBOMAT ECO, CARBOMAT MATA, CARBOHUMIC, CARBOMAT HUMIC)",
        "zielen-i-scrim": "sama warstwa wyglądu nałożona na mechanikę pozny-wzrost, wg ramki Figma „Frame 186-253”, w module pod klasami c5-pro--zielen i c5-pro--scrim-ukosny (20.09.2026, CARBOMAT ECO): tło pasa #777771 zamiast --w-gray-600, nagłówek 52/53 px, akapit 21/26 px w pełnej bieli zamiast krycia .75, przycisk podstawowy w zieleni #86D574 z tekstem #0C2B1C, promieniem 20 px i paddingiem 18/24 px, przycisk drugorzędny z obwódką rgb(255 255 255 / .5), odstęp między przyciskami 11 px; kadr to zdjęcie sadu zakotwiczone dołem pod ukośnym gradientem #1A2405 o kryciu 30/10/10/30 %, rozciągniętym na cały pas z podłogą .55 + .45 × --pro-o. Copy zostaje dzisiejsze – uwaga dotyczyła typografii i przycisków, nie treści; ikony znaku marki z przycisku podstawowego nie odwzorowano, bo nie ma jej w sprite, a ikon się nie dorysowuje. Od 20.09.2026 także na Produktach (#dla-profesjonalistow): typografia, przyciski, pas i nakładka 1:1 z wartościami ramki. Przez pierwsze trzy godziny stały tam podkręcone pokrętła --pro-wash-a .50 i --pro-wash-b .35, bo strona pożyczała kadr z CARBOMAT ECO z białym big bagiem w środku i wartości ramki dawały kontrast GORSZY niż zastąpiony scrim (5. percentyl: nagłówek 2,17 wobec 3,15, akapit 4,00 wobec 5,16). Wieczorem strona dostała własny kadr (paczki w prawej jednej trzeciej, po lewej ciemne pole o zmierzchu) i wartości ramki wróciły: 12,69 : 1 dla nagłówka, 11,42 : 1 dla akapitu. Wniosek do przeniesienia wariantu dalej: liczby nakładki są dopasowane do ZDJĘCIA z ramki, nie do dowolnego kadru – pokrętła są właśnie po to",
        "ramka": "klasa c5-pro--ramka: bez ruchu kadr stoi nad treścią jako ramka 3:2 odsunięta od krawędzi o margines strony, zamiast kadru 16:10 na pełną szerokość (O nas, Produkty)",
        "kadr-3-2": "klasa c5-pro--kadr-3-2: bez ruchu jak ramka, a w ruchu kadr trzyma proporcję 3:2 na środku pasa i przy pełnej skali sięga jego górnej i dolnej krawędzi, zamiast wypełniać cały pas (CARBOHUMIC)",
        "zielen": "klasa c5-pro--zielen: nagłówek do 52 px, zielony przycisk podstawowy #86D574 z ciemnym tekstem, promienie 20 px, wysokość 56 px i odstęp 11 px między przyciskami, zamiast białego przycisku i ostrych narożników bazy (CARBOMAT ECO, Produkty, Kukurydza, Borówka)",
        "scrim-ukosny": "klasa c5-pro--scrim-ukosny: tło pasa #777771, akapit 21 px w pełnej bieli i ukośny gradient na całym pasie zamiast płaskiego przyciemnienia kadru (CARBOMAT ECO, Produkty)",
        "h-mackinac": "klasa c5-pro--h-mackinac: nagłówek pasa w kroju P22 Mackinac Pro w wadze 400 zamiast Inter (Produkty, Kukurydza, Borówka)",
        "kadr-z-prawej": "wersja pasa z kitu c5.css na stronach sklepu (sklep.html, pdp.html, pdp-kwasny.html; od 28.09.2026): statyczne zdjęcie img/foto/pro.jpg na prawej połowie pasa, na całą jego wysokość (cover), po lewej kolumna tekstu – nagłówek, akapit, przycisk „Zapytaj o ofertę” (c5-btn--inv) i dwa linki: „Zaloguj się do platformy” i „Załóż konto”. Bez skalowania kadru i bez nakładki. Na liście produktów linki stoją we własnym wierszu pod przyciskiem, na karcie produktu w jednym rzędzie z nim. Poniżej 900 px zdjęcie 220 px w biegu pasa – na liście nad tekstem, na karcie produktu pod nim (kolejność w HTML)"
      },
      "zrzut": {
        "maxh": 900
      },
      "zrzuty_wariantow": {
        "kadr-z-prawej": {
          "plik": "v7/pdp.html",
          "kotwica": "dla-profesjonalistow",
          "maxh": 700
        }
      }
    },
    "CE-17": {
      "nazwa": "FAQ",
      "grupa": "przelaczniki",
      "rodzina": "zwijane",
      "skrot": "Kicker i H2, pod nimi lista pytań z rozwijanymi odpowiedziami, wszystkie zwinięte na starcie.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "akordeon"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "faq"
        ],
        "mechanika": [
          "klik"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "z-nota": "Nota o statusie odpowiedzi nad akordeonem.",
        "dla-dociekliwych": "Pytanie nad odpowiedzią na pełną szerokość, przycisk do Centrum wiedzy.",
        "plain": "Trzy pytania pod artykułem z odpowiedziami ze zdań tekstu.",
        "informacje": "Trzy akordeony informacji o produkcie z czarnymi liniami i plusem."
      },
      "opis": "Kicker i H2, pod nimi akordeon pytań: pytanie po lewej, odpowiedź po prawej, wszystkie zwinięte na starcie.",
      "mechanika": "Jedno pytanie otwarte naraz (panelSet animuje wysokość), otwarcie z kotwicy; bez JS wszystkie odpowiedzi widoczne. Moduł 90.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "faq"
      },
      "kod": {
        "css": "ce/CE-17-faq.css (baza i warianty plain, z-nota, dla-dociekliwych, grupy); wariant informacje: pdp.css (c5pd-info, c5pd-acc)",
        "js": "ce/CE-17-faq.js; wariant informacje: brak (natywne details)"
      },
      "czesci": [
        "kicker + h2",
        "pozycje: pytanie + odpowiedź"
      ],
      "warianty": {
        "z-nota": "modyfikator c5-faq--z-nota: nota o statusie odpowiedzi między nagłówkiem a akordeonem, odstęp wzorca podzielony na dwie części (CARBOHUMIC)",
        "dla-dociekliwych": "pytanie nad odpowiedzią, pełna szerokość, h4 i przycisk do Centrum wiedzy (klasa c5-faq--plain; Produkty, dawny CE-42)",
        "plain": "trzy pytania pod artykułem, odpowiedzi ze zdań tekstu (artykul.html#faq)",
        "grupy": "kilka akordeonów w grupach, nad każdą mały nagłówek wersalikami, pod spodem opcjonalny rząd linków do filmów (korzeń b-faq; Borówka)",
        "informacje": "trzy akordeony informacji o produkcie na pełną szerokość szerokiego kontenera, pod górną częścią karty produktu sklepu (pdp.html, pdp-kwasny.html; od 28.09.2026, wzór on.com): czarna linia 1 px nad i pod każdą pozycją, tytuł wersalikami z rozstrzeleniem .08 em, plus po prawej (minus po otwarciu), bez kickera i nagłówka sekcji. Natywne details: wszystkie zwinięte na starcie, dowolna liczba otwartych naraz, wysokość otwarcia animowana przez ::details-content (bez animacji przy reduced-motion). W treści tabela parametrów z wierszem metali ciężkich i źródłem, akapit o wysyłce i przyciski dokumentów PDF"
      },
      "zrzut": {
        "maxh": 900
      },
      "zrzuty_wariantow": {
        "informacje": {
          "plik": "v7/pdp.html",
          "kotwica": "informacje",
          "klik": "#informacje details:nth-of-type(2) > summary",
          "maxh": 500
        }
      }
    },
    "CE-18": {
      "nazwa": "CTA wyśrodkowane",
      "grupa": "noty-i-cta",
      "rodzina": "pasy",
      "skrot": "Wyśrodkowany nagłówek (opcjonalnie lead) i rząd przycisków.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "tylko-naglowek"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "1"
        ],
        "nadaje": [
          "cta"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "na-pasie": "Ten sam nagłówek i przyciski na jasnym pasie c5-band w środku strony.",
        "z-leadem": "Nagłówek z akapitem pod nim i dwoma przyciskami."
      },
      "opis": "Wyśrodkowany H2 (opcjonalnie lead) i rząd przycisków.",
      "mechanika": "Statyczne.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "cta-koncowe"
      },
      "kod": {
        "css": "ce/CE-18-cta.css",
        "js": "brak"
      },
      "czesci": [
        "h2",
        "lead (opcjonalnie)",
        "rząd przycisków"
      ],
      "warianty": {
        "na-pasie": "na jasnym pasie c5-band w środku strony (CARBOHUMIC „Dobierz produkt”)",
        "z-leadem": "z akapitem pod nagłówkiem (Mata; Próchnica+ „Zadaj pytanie” – przyciski „Zapytaj eksperta” i „Kontakt”)"
      },
      "zrzut": {
        "maxh": 500
      }
    },
    "CE-19": {
      "nazwa": "Model interaktywny",
      "grupa": "przelaczniki",
      "rodzina": "dane",
      "skrot": "Rysunek SVG w ramce po lewej, panel opisu po prawej i rząd przycisków przełączających części modelu.",
      "projekt": null,
      "tagi": {
        "media": [
          "schemat-wykres"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "taby-przelacznik"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "opis-produktu",
          "liczby-dane"
        ],
        "mechanika": [
          "klik"
        ],
        "zakres": [
          "jednorazowy"
        ]
      },
      "opis": "Scena z rysunkiem SVG w cienkiej ramce po lewej, panel opisu po prawej, pod nimi rząd etykiet-przełączników części modelu.",
      "mechanika": "Czysty CSS: grupa radio + :checked podświetla warstwę SVG, pokazuje panel opisu i wypełnia etykietę; poniżej 900 px jedna kolumna.",
      "baza": {
        "plik": "v7/carbomat-mata.html",
        "kotwica": "inwestycja-model"
      },
      "kod": {
        "css": "carbomat-mata.css ===== 35 (c5-mt-model)",
        "js": "brak (czysty CSS)"
      },
      "czesci": [
        "SVG z warstwami",
        "panele opisu",
        "etykiety-przełączniki"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 800
      }
    },
    "CE-20": {
      "nazwa": "Siatka kart",
      "grupa": "karty",
      "rodzina": "karty",
      "skrot": "Siatka kart w ramce: numer, ikona lub zdjęcie, tytuł, krótki opis, opcjonalnie lista i przyciski.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie",
          "packshot",
          "ikona"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "okno"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "korzysci-argumenty",
          "lista-produktow",
          "opis-produktu"
        ],
        "mechanika": [
          "statyczny",
          "klik"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "z-ikona": "Karty z ikoną w kółku, tytułem i akapitem.",
        "numerowane": "Karty z numerem porządkowym zamiast ikony.",
        "ze-zdjeciem": "Karty ze zdjęciem 4:3 u góry.",
        "z-przyciskami": "Karty ze zdjęciem lub packshotem, opisem i rzędem przycisków u dołu.",
        "produktowe": "Packshot na szarym polu, dwa wiersze etykieta-wartość, cała karta jest linkiem do pop-upu.",
        "kafle-danych": "Kafle z wartością, mini-wykresem słupków i chipem stanu.",
        "ostrzegawcze": "Karty z ikoną x na przygaszonym tle.",
        "sloty-poziome": "Miniatura 16:9 obok tekstu w karcie poziomej.",
        "miejsca-na-wykresy": "Numer, placeholder 16:9 i podpis.",
        "szerokie": "Dwie szerokie karty z ramką ikony, tytułem, zdaniem i strzałką, cały kafel linkiem.",
        "czytaj-dalej": "Trzy karty: dwa artykuły i jedna strona komercyjna.",
        "szklane": "Karty ze szkła na zdjęciu w tle sekcji, biały tekst.",
        "sklepowe": "Cztery karty sklepu: makieta opakowania, nazwa, cena od, przycisk Dodaj do koszyka.",
        "dorzuc": "Do czterech kart sklepowych z jasnym przyciskiem pod koszykiem.",
        "polacz-z": "Dwie małe karty z miniaturą, nazwą, zdaniem, ceną i przyciskiem Dodaj w kolumnie zakupu.",
        "z-rozpiska": "Karty bez mediów z rozpiską i przyciskami u dołu."
      },
      "opis": "Siatka kart auto-fit (2–5 kolumn zależnie od szerokości), karta w ramce: ikona, numer, zdjęcie albo packshot, tytuł, akapit, opcjonalnie lista dl i rząd przycisków.",
      "mechanika": "Statyczna albo z jednorazowym wejściem od dołu po wejściu w widok (data-reveal, IntersectionObserver, stagger 80–90 ms); poniżej 900 px, przy reduced-motion i bez JS karty po prostu widoczne; w wariancie produktowym na telefonie karuzela scroll-snap.",
      "baza": {
        "plik": "v7/carbomat-mata.html",
        "kotwica": "inwestycja-karty"
      },
      "kod": {
        "css": "per strona: c5-mt-grid, c5hu-mix, c5pr-goals/c5pr-foliar/c5pr-read, pp-cards/pp-tiles/pp-rels/pp-charts; strony upraw: ce/CE-20-siatka-kart.css (warianty produktowe – u-prod, u-rail – i numerowane – u-rules); sklep: pdp.css (c5pd-also, c5pd-connect, c5pd-pairs), koszyk.css (c5ks-more, c5ks-rec) + panel: ce/CE-20-siatka-kart.css (c5-cards, c5-cards--z-rozpiska)",
        "js": "reveal: ce/00-base.js ===== 02 (dawne moduły 72 na Carbohumic i Produktach oraz 02 na Próchnicy+ zeszły do warstwy wspólnej 14.09.2026), u-reveal (uprawa.js); sklep: pdp.js ===== 2 (ceny „od … zł”), koszyk.js (dobór „Dorzuć do zamówienia”), przyciski otwierają szybki podgląd z sklep-wspolne.js (CE-76)"
      },
      "czesci": [
        "karty: ikona / numer / zdjęcie / packshot",
        "tytuł",
        "akapit",
        "lista dl (opcjonalnie)",
        "rząd przycisków (opcjonalnie)"
      ],
      "warianty": {
        "z-ikona": "ikona w kółku, tytuł, akapit – bez wystąpień od 02.10.2026 (kafle „Jaka gleba” na CARBOHUMIC przeszły na CE-67)",
        "numerowane": "numer porządkowy zamiast ikony",
        "ze-zdjeciem": "zdjęcie 4:3 u góry karty",
        "z-przyciskami": "zdjęcie lub packshot, opis, rząd przycisków przy dolnej krawędzi; na Próchnicy+ od 19.09.2026 karta pozioma – zdjęcie po lewej 40 %, treść po prawej, siatka 2 × 3 w kontenerze 1180 px, bez akapitu opisu (opis w pop-upie profilu) Na Produktach (#doglebowo-nalistne) karty niosą od 20.09.2026 pole z packshotem zamiast kadru 16:10 („lepiej tutaj dać zdjęcia produktu, bo mówimy bezpośrednio o produkcie” – komentarz Mateusza): metryki pola jak w CE-22 z-packshotami, MAXI PLUS = butelka 1 l, CALBOR = baniak 5 l jako opakowanie poglądowe (kanon nie przypisuje opakowania osobno temu produktowi)",
        "produktowe": "packshot na szarym polu, cała karta jednym linkiem, który otwiera kartę zastosowania w pop-upie (Kukurydza; od 02.10.2026 także Borówka – sześć kart 3 + 3, dwa wiersze „etykieta | wartość” słowami klienta)",
        "kafle-danych": "wartość x → y, mini-wykres słupków, chip stanu (Mata)",
        "ostrzegawcze": "karta z ikoną x na przygaszonym tle",
        "sloty-poziome": "miniatura 16:9 obok tekstu (Próchnica+)",
        "miejsca-na-wykresy": "numer, placeholder 16:9, podpis – bez wystąpień od 02.10.2026 (wykresy Wyników na Próchnicy+ usunięte)",
        "szerokie": "dwie szerokie karty obok siebie w ramce 1 px: ramka ikony, tytuł, zdanie i strzałka w rogu; cały kafel jest linkiem, na hover i fokus tło o ton ciemniejsze i strzałka o 4 px w prawo, poniżej 900 px jeden kafel pod drugim",
        "czytaj-dalej": "trzy karty: dwa artykuły i jedna strona komercyjna (artykul.html#dalej-karty)",
        "szklane": "karty ze szkła na zdjęciu w tle sekcji: rozmycie tła pod kartą (backdrop-filter), półprzezroczyste jasne wypełnienie, jasny obrys, biały tekst, ostre narożniki (Próchnica+ #rzetelnosc-kafle, od 19.09.2026)",
        "sklepowe": "karty produktów sklepu – „Zobacz też” na karcie produktu (pdp.html, pdp-kwasny.html; od 28.09.2026): nagłówek sekcji i cztery karty jak na liście produktów – kadr 1 : 1 z makietą opakowania na jasnoszarym tle, nazwa, cena „od … zł” (przy obniżce z najniższą ceną z 30 dni), ciemny przycisk „Dodaj do koszyka” na całą szerokość karty, który otwiera szybki podgląd (CE-76); każda karta niesie własny JSON w data-cw-product. Od 900 px cztery kolumny, niżej rząd przewijany w poziomie ze scroll-snap. Nazwa jest linkiem tylko przy produkcie z własną kartą (druga odmiana CARBOMAT ECO)",
        "dorzuc": "„Dorzuć do zamówienia” pod koszykiem (koszyk.html; od 28.09.2026): nagłówek, zdanie i do czterech kart sklepowych z jasnym przyciskiem „Dodaj do koszyka” (kasa zostaje jedynym ciemnym przyciskiem strony). Karty rysuje koszyk.js: dla każdego produktu z koszyka pierwszy produkt stosowany razem z nim, którego w koszyku jeszcze nie ma, braki dopełnia stała lista „najczęściej wybierane”; przy pustym koszyku sama lista stała pod nagłówkiem „Najczęściej wybierane” z notą. Przeliczenie po każdej zmianie koszyka; dwie kolumny poniżej 900 px, cztery od 900 px",
        "polacz-z": "„Połącz z” w kolumnie zakupu karty produktu (pdp.html, pdp-kwasny.html; od 28.09.2026, zagnieżdżony w CE-82): pod przyciskiem „Dodaj do koszyka”, za linią – nagłówek, zdanie i rząd dwóch małych kart: pasek miniatury 132 px na jasnoszarym tle, nazwa, jedno zdanie, cena „od …” i jasny przycisk „+ Dodaj”, który otwiera szybki podgląd (CE-76); rząd przewija się w poziomie ze scroll-snap, gdy karty się nie mieszczą",
        "z-rozpiska": "karty bez mediów (klasa c5-cards--z-rozpiska; platforma-b2b.html#pulpit): tytuł, treść, rozpiska i rząd przycisków przy dolnej krawędzi; od 900 px trzy kolumny równej wysokości, niżej jedna pod drugą"
      },
      "zrzut": {
        "maxh": 900
      },
      "zrzuty_wariantow": {
        "sklepowe": {
          "plik": "v7/pdp.html",
          "kotwica": "zobacz-tez",
          "maxh": 800
        },
        "dorzuc": {
          "plik": "v7/koszyk.html",
          "kotwica": "dorzuc",
          "klik": "[data-ks-sample]",
          "maxh": 800
        },
        "polacz-z": {
          "plik": "v7/pdp.html",
          "kotwica": "polacz-z",
          "maxh": 600
        },
        "z-rozpiska": {
          "plik": "v7/platforma-b2b.html",
          "kotwica": "pulpit",
          "maxh": 600
        }
      }
    },
    "CE-21": {
      "nazwa": "Dwie kolumny przewag",
      "grupa": "karty",
      "rodzina": "obraz-tekst",
      "skrot": "Nagłówek nad dwiema równymi kolumnami: zdjęcie, tytuł, cztery punkty i link.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "porownanie-wybor",
          "korzysci-argumenty"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "opis": "Nadpis nad parą równych kolumn: w każdej zdjęcie, tytuł, cztery punkty i link.",
      "mechanika": "Statyczne (czysty CSS).",
      "baza": {
        "plik": "v7/carbomat-mata.html",
        "kotwica": "co-zastepujesz-kolumny"
      },
      "kod": {
        "css": "carbomat-mata.css ===== 40 (c5-cmp2)",
        "js": "brak"
      },
      "czesci": [
        "nadpis",
        "2 kolumny: zdjęcie, tytuł, punkty, link"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-22": {
      "nazwa": "Tabela",
      "grupa": "dane",
      "rodzina": "dane",
      "skrot": "Tabela w kontenerze przewijanym w poziomie, z nagłówkami kolumn, opcjonalnie packshotami i przypisem.",
      "projekt": null,
      "tagi": {
        "media": [
          "packshot",
          "zdjecie"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "okno"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "porownanie-wybor",
          "liczby-dane"
        ],
        "mechanika": [
          "statyczny",
          "okno"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "porownawcza": "Kolumny jako porównywane pozycje.",
        "danych": "Kolumny liczbowe wyrównane do prawej.",
        "z-packshotami": "Kwadratowe pole zdjęcia nad każdą kolumną.",
        "klikalne-wiersze": "Wiersze otwierają stronę lightboxa.",
        "z-akcja": "Tabela danych z przyciskiem albo polem w ostatniej kolumnie."
      },
      "opis": "Samodzielna tabela w kontenerze przewijanym w poziomie na wąskich ekranach (cw-scrollx, tabindex), nagłówki kolumn, opcjonalnie packshoty w nagłówkach i przypis pod tabelą.",
      "mechanika": "Statyczna; wariant z klikalnymi wierszami otwiera lightbox; wiersze mogą wchodzić z reveal. W panelu pierwsza kolumna przyklejona do lewej w przewijanym kontenerze. W module c5-tbl dwa pokrętła wpisywane w style na korzeniu wystąpienia: --c5-tbl-min (najmniejsza szerokość tabeli w przewijanym kontenerze, domyślnie 640 px) i --c5-tbl-first (stała szerokość przyklejonej pierwszej kolumny poniżej 600 px).",
      "baza": {
        "plik": "v7/produkty.html",
        "kotwica": "doglebowo-tabela"
      },
      "kod": {
        "css": "per strona: c5-mt-cmp/c5-mt-tbl, c5hu-cmp, c5pr-cmp/c5pr-cert; strony upraw: ce/CE-22-tabela.css (wariant klikalne-wiersze – u-mt, klasa korzenia u-mtce) + panel: ce/CE-22-tabela.css (c5-tbl, c5-tbl--danych, c5-tbl--z-akcja)",
        "js": "kukurydza.js ===== 80 (klikalne wiersze)"
      },
      "czesci": [
        "thead",
        "tbody",
        "przypis",
        "stopka z sumą (opcjonalnie)",
        "chip stanu albo odnośnik w komórce (opcjonalnie)"
      ],
      "warianty": {
        "porownawcza": "kolumny = porównywane pozycje (2×6, 3 podłoża)",
        "danych": "kolumny liczbowe wyrównane do prawej (analiza, certyfikaty)",
        "z-packshotami": "kwadratowe pole zdjęcia nad etykietą każdej kolumny (do 220 px, temat na 72 % wysokości, 140 px poniżej 900 px). Czym jest zdjęcie, decyduje treść sekcji: na CARBOHUMIC-u do 02.10.2026 packshot produktu, na Produktach od 20.09.2026 – a na CARBOHUMIC-u od 02.10.2026 – kadr SPOSOBU aplikacji (#doglebowo-tabela, dziś placeholdery – prompty w zasoby/brand/zdjecia-produkty/README.md), bo o produktach mówią dopiero karty pod tabelą. Tego samego dnia z nagłówków Produktów zniknęły nazwy produktów, które szły w parze z packshotami",
        "klikalne-wiersze": "klik w wiersz otwiera stronę lightboxa (Kukurydza)",
        "z-akcja": "tabela danych z kolumną kontrolek (klasa c5-tbl--z-akcja; b2b-zamowienia.html#lista): w ostatniej kolumnie przycisk, odnośnik albo pole wyboru, opcjonalnie przycisk dodania wiersza pod tabelą"
      },
      "zrzut": {
        "maxh": 900
      },
      "zrzuty_wariantow": {
        "z-akcja": {
          "plik": "v7/b2b-zamowienia.html",
          "kotwica": "lista",
          "szerokosc": 1440,
          "maxh": 500
        }
      }
    },
    "CE-23": {
      "nazwa": "Pas CTA",
      "grupa": "noty-i-cta",
      "rodzina": "pasy",
      "skrot": "Pas na szerokość kolumny między kreskami: tekst po lewej, jeden lub dwa przyciski po prawej.",
      "projekt": null,
      "tagi": {
        "media": [
          "ikona"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "1"
        ],
        "nadaje": [
          "cta"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "z-ikona": "Ikona przed tekstem, kreski góra i dół.",
        "kreski-gora-dol": "Bez ikony, kreski nad i pod.",
        "dwa-przyciski": "Tekst i dwa przyciski, tylko kreska górna.",
        "z-naglowkiem": "H4 w lewej kolumnie, tekst i przycisk w prawej.",
        "ciemny": "Czarny pas: kicker, h3, akapit, jasny przycisk i motyw czterech połączonych pól.",
        "cichy": "Jedno zdanie drobnym drukiem z linkiem w tekście na jasnoszarym pasie."
      },
      "opis": "Pas na szerokość kolumny między kreską górną (i dolną): po lewej tekst (zdanie wytłuszczone + zdanie drugorzędne, opcjonalnie ikona albo h4 w osobnej kolumnie), po prawej jeden lub dwa przyciski.",
      "mechanika": "Statyczne; poniżej 900 px przyciski schodzą pod tekst.",
      "baza": {
        "plik": "v7/produkty.html",
        "kotwica": "wg-potrzeby-pas"
      },
      "kod": {
        "css": "per strona: c5-cmp2__cta, c5-mt-cross, c5-proofs__cta, c5pr-bar, c5-who__note; wariant ciemny: c5h-cfg w home.css ===== 60; wariant cichy: sklep.html <style> (c5sk-hurt)",
        "js": "brak"
      },
      "czesci": [
        "kreski",
        "ikona (opcjonalnie)",
        "tekst",
        "h4 (opcjonalnie)",
        "1–2 przyciski",
        "motyw z linii: cztery puste pola-kroki (opcjonalnie)"
      ],
      "warianty": {
        "z-ikona": "ikona przed tekstem, kreski góra i dół",
        "kreski-gora-dol": "bez ikony, kreski góra i dół (Mata cross-sell)",
        "dwa-przyciski": "tekst i dwa przyciski, tylko kreska górna",
        "z-naglowkiem": "h4 w lewej kolumnie, tekst i przycisk w prawej",
        "ciemny": "pas na najciemniejszym tokenie, jasny tekst, na całą szerokość kontenera zamiast kresek: po lewej (7 kolumn) kicker w ramce o jasnym obrysie, h3 i akapit, po prawej (5 kolumn, wyrównanie do prawej krawędzi) dyskretny motyw z linii – cztery puste pola-kroki połączone kreską, bez podpisów – główny przycisk w wersji jasnej (c5-btn--inv) i pod nim cichy link. Jedyna ciemna płaszczyzna swojej sekcji, więc mówi, gdzie zaczyna się wybieranie. Statyczny; poniżej 900 px jedna kolumna, prawa strona schodzi pod tekst i wyrównuje się do lewej. Obrys kickera i pierścienie fokusu przechodzą na wersje jasne.",
        "cichy": "jedno zdanie drobnym drukiem (13 px) z linkiem w tekście zamiast przycisku, na jasnoszarym pasie na całą szerokość okna z linią pod spodem, tekst w szerokim kontenerze; bez ikony i kresek (sklep.html, nad listą produktów: „Kupujesz w większych ilościach albo potrzebujesz stałych dostaw? Zapytaj o ofertę”; od 28.09.2026, spec sklep-v7-spec §5.5 i §12.3)"
      },
      "zrzut": {
        "maxh": 300
      },
      "zrzuty_wariantow": {
        "ciemny": {
          "plik": "v7/home.html",
          "kotwica": "uprawy-konfigurator",
          "maxh": 420
        },
        "cichy": {
          "plik": "v7/sklep.html",
          "kotwica": "pasek-hurtowy",
          "maxh": 120
        }
      }
    },
    "CE-24": {
      "nazwa": "Pas liczb",
      "grupa": "dane",
      "rodzina": "dane",
      "skrot": "Panel z kilkoma wielkimi liczbami z jednostką i podpisem, rozdzielonymi liniami lub kaflami.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "liczby-dane",
          "dowod-zrodla"
        ],
        "mechanika": [
          "przewijanie",
          "ruch-wlasny",
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "odliczanie": "Liczby odliczają od zera.",
        "kolowrotek": "Cyfry wjeżdżają kołowrotkiem.",
        "kolumny": "Jasny panel, trzy kolumny z pionowymi liniami, chip nad liczbą i podpis pod nią.",
        "kafle-2x2": "Ciemny panel, tytuł i siatka 2 × 2 kafli z wielką liczbą, etykietą i źródłem.",
        "rzad": "Ciemny pas z tytułem i pięcioma kolumnami liczb z etykietą i źródłem."
      },
      "opis": "Kadr z marginesem 30 px na wysokość ekranu. Wersja podstawowa: ciemne tło, tytuł u góry po lewej, wiersze „etykieta i podpis | wielka liczba z sufiksem” rozdzielone cienkimi liniami (bez wystąpień od 02.10.2026 – CARBOMAT Mata przeszła na wariant kafle-2x2). Wersja alternatywna (wariant kolumny): jasne tło, trzy kolumny z pionowymi liniami, chip nad liczbą, podpis pod nią. Sufiksy liczb to element EL-31.",
      "mechanika": "Cyfry odliczają od zera (Kukurydza) albo wjeżdżają kołowrotkiem (Próchnica+, od 02.10.2026 także CARBOMAT Mata); wejście wierszy ze staggerem należało do układu podstawowego Maty (do 02.10.2026); bez JS i przy reduced-motion od razu wartości końcowe.",
      "baza": {
        "plik": "v7/carbomat-mata.html",
        "kotwica": "dowod-liczby"
      },
      "kod": {
        "css": "jeden plik ce/CE-24-pas-liczb.css, sekcje wg klas korzenia: c5-nums (kafle-2x2, moduł wspólny, CARBOMAT Mata), pp-dark/pp-liczby (kafle-2x2, własna implementacja Próchnicy+, do osobnej decyzji o przepięciu), on-dark/on-nums (kolowrotek, O firmie), u-nb (kolumny, Kukurydza), b-nb (kolumny, kopia na Borówce); c5h-nums (strona główna, wariant rzad) zostaje w home.css; sufiksy: ce/00-base.css EL-31",
        "js": "ce/CE-24-pas-liczb.js (kołowrotek cyfr data-c5-odo, CARBOMAT Mata) / uprawa.js data-count / prochnica-plus.js ===== 60 / home.js ===== 40 (kołowrotek pod prefiksem c5h-odo)"
      },
      "czesci": [
        "tytuł",
        "wiersze: etykieta, podpis, liczba, jednostka",
        "źródło"
      ],
      "warianty": {
        "odliczanie": "liczby odliczają od zera (mechanika data-count z uprawa.js; na Kukurydzy razem z wariantem kolumny)",
        "kolowrotek": "cyfry wjeżdżają kołowrotkiem (mechanika z Próchnicy+; od 19.09.2026 pracuje w układzie kafle-2x2, sam wariant bez własnych wystąpień)",
        "kolumny": "jasny panel, trzy kolumny rozdzielone pionowymi liniami: chip nad liczbą, wielka liczba z małą jednostką u górnej krawędzi cyfr, podpis pod liczbą (wersja alternatywna sekcji liczb; Kukurydza od 18.09 – decyzja Mateusza)",
        "kafle-2x2": "ciemny kadr, tytuł z dużym odstępem od górnej krawędzi, pod nim siatka 2 × 2 kafli o ton jaśniejszych od tła: wielka liczba przy górnej krawędzi kafla po prawej, etykieta i nota przy dolnej po lewej; cyfry wjeżdżają kołowrotkiem (Próchnica+ od 19.09.2026 – uwaga Mateusza, inspiracja: ramka Figma 306:2941); od 02.10.2026 także CARBOMAT Mata „Dowód” (uwaga Mateusza z 02.10: sekcja jak na Próchnicy+) na module wspólnym ce/CE-24-pas-liczb.* – panel bez nagłówka, cztery kafle, liczba ze znakiem i przecinkiem w kołowrotku, sufiksy EL-31 obok liczby, pod nią opis i wiersz źródła; rozmiar liczby liczony z szerokości kafla",
        "rzad": "ciemny kadr na szerokość kontenera (nie na wysokość ekranu): mały tytuł u góry po lewej, pod nim pięć kolumn rozdzielonych pionowymi liniami włosowymi, w kolumnie wielka liczba, etykieta i drobne źródło przy dolnej krawędzi kadru. Wersja pasowa CE – sekcja pod nią zaczyna się wysoko na stronie, więc liczby są wstępem do dowodu, a nie osobnym ekranem (strona główna od 20.09.2026). Od 1280 px pięć kolumn, między 900 a 1279 px podział 3 + 2, poniżej 900 px wiersze: liczba po lewej, etykieta po prawej, źródło pod nimi na całej szerokości"
      },
      "zrzuty_wariantow": {
        "kolumny": {
          "plik": "v7/kukurydza.html",
          "kotwica": "u-liczby"
        },
        "kafle-2x2": {
          "plik": "v7/prochnica-plus.html",
          "kotwica": "w-liczbach"
        },
        "rzad": {
          "plik": "v7/home.html",
          "kotwica": "dowod"
        }
      },
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-25": {
      "nazwa": "Lightbox wielostronicowy",
      "grupa": "nakladki",
      "rodzina": "okna",
      "skrot": "Okno modalne: nagłówek, strony z kartami lub tabelą, przyciski Poprzednie i Następne, licznik.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "dlugi"
        ],
        "ukryte": [
          "okno"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "dowod-zrodla",
          "liczby-dane",
          "opis-produktu"
        ],
        "mechanika": [
          "okno",
          "klik"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "popup-produktu": "Strona z mapą zastosowań produktu, packshot w nagłówku i własna stopka.",
        "jednostronicowy": "Jedna strona treści bez licznika i przycisków nawigacji, szerszy panel."
      },
      "opis": "Nakładka na całą stronę z panelem przewijanym: przycisk zamknięcia, N stron treści (każda z nagłówkiem i stopką), licznik „n / N”.",
      "mechanika": "Otwierany linkiem data-lightbox-open albo hashem, fokus-trap, Escape, tło inert i zablokowane przewijanie; bez JS strony renderują się jako zwykłe bloki pod sekcją. Moduł 55 (Mata) / uprawa.js (Kukurydza).",
      "baza": {
        "plik": "v7/carbomat-mata.html",
        "kotwica": "dowod-lb"
      },
      "kod": {
        "css": "carbomat-mata.css ===== 55 (c5-lb) / strony upraw: ce/CE-25-lightbox.css (u-overlay, u-lightbox, u-prodpop; wąski panel wariantu jednostronicowy: klasa u-lightbox--waski)",
        "js": "carbomat-mata.js ===== 55 / uprawa.js lbEgzemplarz"
      },
      "czesci": [
        "nakładka",
        "panel",
        "przycisk zamknięcia",
        "strony",
        "licznik"
      ],
      "warianty": {
        "popup-produktu": "strona = mapa zastosowań produktu z packshotem w nagłówku i własną stopką (Kukurydza)",
        "jednostronicowy": "jedna strona treści zamiast N, więc stopka, licznik i przyciski poprzednia/następna nie istnieją; panel szerszy (1280 px), bo niesie tabelę pięciu kolumn, a kontener treści gubi w nakładce swoją miarę i gutter. Klasy i moduł 1:1 z bazy; kod strony w produkty.css ===== 45 / produkty.js ===== 45 (Produkty „Technikalia czterech rodzin”, 20.09.2026). Od 02.10.2026 także CARBOMAT Mata: tabela trzech podłoży (#co-zastepujesz-lb) i pełna analiza podłoża (#analiza-lb) w oknach jednostronicowych na silniku lightboksa strony (klasa c5-lb--solo – pasek z przyciskiem zamknięcia nad treścią, bez osobnego tytułu); otwiera je przycisk w sekcji albo hash tabeli, bez JS tabela stoi w biegu strony (klasa c5-lb--solo na CARBOMAT Mata, u-lightbox--waski na Borówce)"
      },
      "zrzut": {
        "hash": "dowod-sggw",
        "maxh": 800
      }
    },
    "CE-26": {
      "nazwa": "Stos kart",
      "grupa": "sceny",
      "rodzina": "sceny",
      "skrot": "Stos kart kroków: każda z kadrem zdjęcia po lewej oraz dopiskiem, numerem, tytułem i opisem po prawej.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "przewijanie"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "kroki-proces"
        ],
        "mechanika": [
          "przewijanie"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "opis": "Karty kroków jedna pod drugą; każda karta: kadr po lewej, obok dopisek (faza albo „Krok 02”), numer, tytuł i opcjonalny opis. Jeden jasny ton kart, bez przemiennych ciemnych.",
      "mechanika": "Karty przyklejają się kolejno i nakładają na siebie przy przewijaniu; skrypt daje wszystkim wysokość najwyższej, przykryta karta cofa się i ciemnieje, ostatnia stoi chwilę, potem stos odjeżdża z sekcją. Stan przyklejony tylko przy włączonym ruchu (od 900 px) i tylko gdy karta mieści się między swoim przystankiem a dokiem doradcy; w za niskim oknie, bez JS, przy reduced-motion i poniżej 900 px zwykła lista kart. Fokus w przykrytej karcie wyciąga ją na wierzch.",
      "baza": {
        "plik": "v7/carbomat-mata.html",
        "kotwica": "przygotowanie-protokol"
      },
      "kod": {
        "css": "ce/CE-26-stos-kart.css (klasy c5-stack; moduł wspólny od 02.10.2026 – wcześniej dwie implementacje: c5-steps w carbomat-mata.css i c5hu-stack w carbohumic.css)",
        "js": "ce/CE-26-stos-kart.js"
      },
      "czesci": [
        "karty: kadr (zdjęcie albo placeholder), dopisek, numer, tytuł, opis"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-27": {
      "nazwa": "Blok materiału",
      "grupa": "noty-i-cta",
      "rodzina": "pasy",
      "skrot": "Wąski blok z kwadratową ikoną, tytułem, zdaniem opisu i małym przyciskiem do materiału (film, plik).",
      "projekt": null,
      "tagi": {
        "media": [
          "ikona"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "1"
        ],
        "nadaje": [
          "cta",
          "dowod-zrodla"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "dokument": "Ikona dokumentu zamiast odtwarzania, materiał do pobrania"
      },
      "opis": "Wąski poziomy blok: kwadratowa ikona po lewej, po prawej tytuł, zdanie opisu i mały przycisk.",
      "mechanika": "Statyczne.",
      "baza": {
        "plik": "v7/carbomat-mata.html",
        "kotwica": "przygotowanie-film"
      },
      "kod": {
        "css": "carbomat-mata.css (c5-mt-media)",
        "js": "brak"
      },
      "czesci": [
        "ikona",
        "tytuł",
        "opis",
        "przycisk"
      ],
      "warianty": {
        "dokument": "ikona dokumentu, materiał do pobrania"
      },
      "zrzut": {
        "maxh": 200
      }
    },
    "CE-28": {
      "nazwa": "Boks w ramce",
      "grupa": "noty-i-cta",
      "rodzina": "pasy",
      "skrot": "Obramowany boks z tytułem i akapitem, opcjonalnie rozpiska, przypis i przyciski.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "1"
        ],
        "nadaje": [
          "ostrzezenie-nota",
          "opis-produktu",
          "cta"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "z-przyciskiem": "Tytuł, akapit z oznaczeniem braku danych i jeden przycisk",
        "z-rozpiska": "Nazwa i akapit po lewej, rozpiska parametrów po prawej",
        "lista-opakowan": "Etykieta i zdanie oraz wiersze opakowań z miniaturami",
        "cross-sell": "Karta z polem packshotu po lewej, h3, akapit, przypis i rząd przycisków"
      },
      "opis": "Obramowany boks (1 px) z tytułem i akapitem; wnętrze w jednej lub dwóch kolumnach, opcjonalnie rozpiska dl, lista opakowań, przypis i przyciski.",
      "mechanika": "Statyczne; poniżej 900 px jedna kolumna. W module c5-box proporcje dwóch kolumn ustawia pokrętło --c5-box-cols wpisane w style na korzeniu wystąpienia (domyślnie dwie równe kolumny).",
      "baza": {
        "plik": "v7/carbomat-mata.html",
        "kotwica": "analiza-nota"
      },
      "kod": {
        "css": "per strona: c5-mt-note (Mata), c5hu-extra/c5hu-foliar (Carbohumic) + panel: ce/CE-28-boks-w-ramce.css (c5-box, c5-box--z-rozpiska)",
        "js": "brak"
      },
      "czesci": [
        "tytuł",
        "akapit",
        "rozpiska dl / lista / przypis (opcjonalnie)",
        "przyciski (opcjonalnie)",
        "tytuł boksu wersalikami (c5-box__title)",
        "dwie kolumny (c5-box__cols, c5-box__col)",
        "nazwa w kolumnie – osoba, zamówienie albo produkt (c5-box__name)",
        "stopka z przyciskami pod kolumnami, oddzielona linią (c5-box__foot)"
      ],
      "warianty": {
        "z-przyciskiem": "tytuł, akapit z oznaczeniem braku danych, przycisk (Mata)",
        "z-rozpiska": "nazwa i akapit | rozpiska dl (Carbohumic)",
        "lista-opakowan": "HISTORYCZNY – bez wystąpień od 02.10.2026 (blok opakowań pod pasmami na CARBOHUMIC zdjęty na polecenie Mateusza: opakowanie wybiera się w oknie koszyka albo w sklepie). Etykieta i zdanie | wiersze opakowań z miniaturami",
        "cross-sell": "h3, akapit, przypis, rząd przycisków (Carbohumic); od 02.10.2026 jako karta z polem packshotu po lewej (układ kart pod tabelą na Produktach)"
      },
      "zrzut": {
        "maxh": 400
      }
    },
    "CE-29": {
      "nazwa": "Licznik sezonów",
      "grupa": "sceny",
      "opis": "Nagłówek nad sceną; scena sticky w torze: po lewej tytuł przystanku, wielki numer sezonu z odmienianym słowem i rząd pięciu rękawów, po prawej panele treści; na dole pasek przystanków z klikalnymi etykietami.",
      "mechanika": "Wszystko z pozycji przewijania: numer rośnie, rękawy wypełniają się sezon po sezonie, worek CARBOMAT ECO wjeżdża na trzecim przystanku, panele crossfade; statycznie trzy bloki z glifami. Moduł 80.",
      "baza": {
        "plik": "v7/carbomat-mata.html",
        "kotwica": "sezon-licznik"
      },
      "kod": {
        "css": "carbomat-mata.css ===== 80 (c5-yrs)",
        "js": "carbomat-mata.js ===== 80"
      },
      "czesci": [
        "tytuł przystanku",
        "numer sezonu",
        "rząd rękawów",
        "panele treści",
        "pasek przystanków"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 900
      },
      "status": "wycofany"
    },
    "CE-30": {
      "nazwa": "Lista z panelem opisu",
      "grupa": "przelaczniki",
      "rodzina": "zwijane",
      "skrot": "Lista dużych tytułów po lewej i panel z opisem wybranej pozycji po prawej; na telefonie akordeon.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "taby-przelacznik",
          "hover",
          "akordeon"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "porownanie-wybor",
          "korzysci-argumenty",
          "opis-produktu"
        ],
        "mechanika": [
          "klik"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "z-lightboxem": "Panel opisu z przyciskiem otwierającym pełny opis w lightboxie",
        "akordeon-z-odliczaniem": "Akordeon: otwarta pozycja z opisem i kartami produktów z packshotem",
        "z-kadrem": "Lista grup z chipami i przyciskami oraz przyklejone zdjęcie wybranej grupy"
      },
      "opis": "Dwie kolumny: po lewej lista dużych tytułów (z numerami), po prawej przyklejony panel z opisem aktywnej pozycji (opcjonalnie przycisk); na telefonie akordeon.",
      "mechanika": "Najechanie podgląda, klik wybiera, strzałki nawigują, kotwice trafiają w pozycje; bez JS wszystkie opisy otwarte. Moduły 72 (Carbohumic) i 40 (O nas); moduł 80 Maty zszedł 02.10.2026 razem z przejściem „Ekonomii” na wariant akordeon-z-odliczaniem.",
      "baza": {
        "plik": "v7/carbohumic.html",
        "kotwica": "z-czym-laczyc-lista"
      },
      "kod": {
        "css": "jeden plik ce/CE-30-lista-z-panelem.css, sekcje wg klas korzenia: c5-acc30 (akordeon-z-odliczaniem, moduł wspólny, CARBOMAT Mata), c5pr-acc i c5pr-pcard (akordeon-z-odliczaniem, własna implementacja Produktów), c5hu-mixlist (CARBOHUMIC), on-val (O firmie); wariant z-kadrem: c5h-crops zostaje w home.css ===== 60",
        "js": "carbohumic.js ===== 72; wariant akordeon-z-odliczaniem: produkty.js ===== 50 oraz moduł wspólny ce/CE-30-lista-z-panelem.js (od 02.10.2026, CARBOMAT Mata); wariant z-kadrem: home.js ===== 60"
      },
      "czesci": [
        "lista tytułów",
        "panel opisu",
        "przycisk w panelu (opcjonalnie)"
      ],
      "warianty": {
        "z-lightboxem": "panel ma przycisk otwierający pełny opis w lightboxie (Kukurydza fazy do 18.09; sekcję przejął CE-65, wariant bez wystąpień)",
        "akordeon-z-odliczaniem": "akordeon na szerokość kontenera wg ramki Figma „Frame 207” (Mateusz, 18.09.2026; Produkty, ścieżki wg sytuacji): otwarta pozycja ma duży tytuł, po lewej opis z notami, ostrzeżeniem i linkami, po prawej karty produktów z packshotem (po dwie w rzędzie, kolejne zawijają się do następnego wiersza; cała karta prowadzi na stronę produktu, „Kup produkt” odsłania się pod opisem na karcie, a packshot maleje); pierwsza pozycja otwarta od początku, odliczanie 5 s z paskiem na górnej linii następnej pozycji otwiera kolejną i zamyka poprzednią, klik otwiera dowolną albo zamyka otwartą i wyłącza automat, kotwica pozycji otwiera ją i zatrzymuje automat; automat tylko na szerokim ekranie i przy włączonym ruchu, pod kursorem i przy fokusie odliczanie stoi Runda wierności 20.09.2026 („odwzoruj bardziej szczegółowo wygląd CE”): karta 10 px promienia i tło #f6f6f6 z ramki (bez 60 % krycia warstwy Figmy – nad pasem #fafafa kafel byłby niewidoczny), zielony znacznik 32 px #86d574 w prawym górnym rogu, packshot w polu 139 px, nazwa 14 px semibold 38 px pod nim, opis 14 px na mierze 275 px, wiersze zamknięte 15 px w czerni i podziałce 62 px, tytuł otwarty 35 px, opis pozycji 16 px/1,3 w #777771 na mierze 358 px. Od 02.10.2026 także CARBOMAT Mata „Ekonomia” (uwaga Mateusza z 02.10: użyć CE, którego używamy gdzie indziej) – pięć pozycji „tytuł + opis” bez kart produktów, na module wspólnym ce/CE-30-lista-z-panelem.* w skali szarości kitu",
        "z-kadrem": "wariant strony głównej (uprawy): po lewej lista sześciu grup upraw rozdzielona liniami włosowymi – numer w węźle, duży tytuł 28–44 px, przygaszony podpis pod tytułem i chevron; otwarta pozycja rozwija się w miejscu (grid 0fr → 1fr) i pokazuje chipy-linki stron upraw, dwa przyciski („Zobacz uprawę”, „Dobierz produkty i dawki”), a w razie potrzeby drugi, cichy link doboru. Po prawej nie ma panelu opisu, tylko przyklejony kadr: sześć warstw zdjęć jedna na drugiej, widoczna ta z wybranej pozycji, w lewym dolnym rogu jasna plakietka z numerem i nazwą grupy. Kadr stoi pod nagłówkiem serwisu (20 px zapasu) i kończy się 96 px nad dołem okna, ponad dokiem doradcy; zmiana kadru to wycieranie clip-path od dolnej krawędzi w górę w 0,7 s z osiadaniem skali 1,04 → 1, a poprzednie zdjęcie zostaje nieruchomo pod spodem, żeby wycieranie nie odsłaniało pustej sceny. Klik wybiera (nigdy nie zamyka – jedna pozycja jest zawsze otwarta), fokus i najechanie tylko podglądają kadr, strzałki oraz Home i End przenoszą fokus między nagłówkami wierszy; kotwice #uprawy-sad, #uprawy-jagodowe, #uprawy-warzywa, #uprawy-pole, #uprawy-szkolka i #uprawy-ogrod otwierają swoją pozycję. Poniżej 900 px akordeon z kadrem 4 : 3 wewnątrz otwartej pozycji, nad przyciskami. Bez JS-u wszystkie pozycje rozwinięte, lista na całą szerokość kontenera, kadry ukryte."
      },
      "zrzuty_wariantow": {
        "akordeon-z-odliczaniem": {
          "plik": "v7/produkty.html",
          "kotwica": "wg-potrzeby-sciezki",
          "maxh": 1100
        },
        "z-kadrem": {
          "plik": "v7/home.html",
          "kotwica": "uprawy",
          "maxh": 1100
        }
      },
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-31": {
      "nazwa": "Nota",
      "grupa": "noty-i-cta",
      "rodzina": "pasy",
      "skrot": "Obramowany pas z małą ikoną i jednym–dwoma zdaniami noty, opcjonalnie z przyciskiem po prawej.",
      "projekt": null,
      "tagi": {
        "media": [
          "ikona"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "1"
        ],
        "nadaje": [
          "ostrzezenie-nota",
          "cta"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "miekka": "Nota z mniejszą ikoną na tle strony",
        "z-przyciskiem": "Nota z ciemnym przyciskiem po prawej",
        "brak-danych": "Akapit w ramce z kreski przerywanej, bez ikony"
      },
      "opis": "Obramowany pas z małą ikoną i jednym–dwoma zdaniami (wstęp wytłuszczony), opcjonalnie przycisk po prawej; wariant „brak danych” to akapit w ramce z kreski przerywanej.",
      "mechanika": "Statyczne (role note).",
      "baza": {
        "plik": "v7/carbohumic.html",
        "kotwica": "ktory-dla-mnie-ostrzezenie"
      },
      "kod": {
        "css": "per strona: c5hu-warn/c5hu-faqnote, c5-gap, u-callout, pp-note + panel: ce/CE-31-nota.css (c5-note--akcja; baza c5-note z ce/00-base.css)",
        "js": "brak"
      },
      "czesci": [
        "ikona",
        "zdanie główne",
        "zdanie wyjaśniające (opcjonalnie)",
        "przycisk (opcjonalnie)",
        "treść obok ikony: tytuł i akapit (c5-note__body, c5-note__title; opcjonalnie)"
      ],
      "warianty": {
        "miekka": "mniejsza ikona, tło strony",
        "z-przyciskiem": "ciemny przycisk po prawej",
        "brak-danych": "ramka z kreski przerywanej, bez ikony (c5-note--dashed z ce/00-base.css)"
      },
      "zrzut": {
        "maxh": 200
      }
    },
    "CE-32": {
      "nazwa": "Oś czasu pozioma",
      "grupa": "sceny",
      "opis": "Pozioma oś z przystankami (etykieta czasu, tytuł, opis) i przypisem; na wąskich ekranach oś pionowa.",
      "mechanika": "Oś dorysowuje się przy przewijaniu, przystanki rozświetlają się kolejno (tylko motionOn). Moduł 48.",
      "baza": {
        "plik": "v7/carbohumic.html",
        "kotwica": "czas-prochnicy"
      },
      "kod": {
        "css": "carbohumic.css (c5hu-time)",
        "js": "carbohumic.js ===== 48"
      },
      "czesci": [
        "oś",
        "przystanki",
        "przypis"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 700
      },
      "status": "wycofany"
    },
    "CE-33": {
      "nazwa": "Cytat lub zasada",
      "grupa": "noty-i-cta",
      "rodzina": "pasy",
      "skrot": "Wyróżnione jedno zdanie lub akapit: duży cytat z kreską, ciemny boks albo pasek zasady.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "1"
        ],
        "nadaje": [
          "tekst-ciagly",
          "dowod-zrodla"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "ciemny-boks": "Ciemny boks z etykietą wersalikami i dużym akapitem",
        "pasek-zasady": "Gruba kreska górna, etykieta i wytłuszczone zdanie w jednym wierszu",
        "cytat": "Blockquote z kreską i cudzysłowami, biały na zdjęciu lub bardzo duży na jasnym"
      },
      "opis": "Wyróżnione jedno zdanie lub akapit: duży cytat z pionową kreską i cudzysłowami z CSS, ciemny boks z etykietą wersalikami, albo pasek pod grubą kreską z etykietą i zdaniem.",
      "mechanika": "Statyczne (opcjonalnie reveal). W wersji ze strony głównej JS dzieli cytat na wyrazy i podnosi ich krycie z .25 do 1 kolejno, w miarę jak dolna krawędź cytatu przejeżdża od 85 % do 40 % wysokości okna (jedna zmienna na akapicie, rampa liczona w CSS); tylko przy CX5.motionOn(), bez JS i przy ograniczonym ruchu pełne krycie.",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "rzetelnosc-cytat"
      },
      "kod": {
        "css": "per strona: pp-quote, c5hu-rule; strony upraw: ce/CE-33-cytat-zasada.css (wariant ciemny-boks – u-quote; etykieta w osobnej kolumnie od 1100 px: klasa u-quote--obok)",
        "js": "brak"
      },
      "czesci": [
        "etykieta (opcjonalnie)",
        "zdanie lub akapit"
      ],
      "warianty": {
        "ciemny-boks": "ciemne tło, etykieta wersalikami, duży akapit (Kukurydza; od 1100 px etykieta w osobnej kolumnie – klasa u-quote--obok)",
        "pasek-zasady": "gruba kreska górna, etykieta i wytłuszczone zdanie w jednym wierszu (Carbohumic)",
        "cytat": "blockquote z kreską i cudzysłowami; na Próchnicy+ od 19.09.2026 biały, na zdjęciu w tle sekcji; na stronie głównej (#motto, 20.09.2026) wyśrodkowany, bardzo duży (36–84 px, miara ok. 10 em, łamanie balance), bez kreski, pod nim wezwanie i podpis wersalikami"
      },
      "zrzut": {
        "maxh": 400
      }
    },
    "CE-34": {
      "nazwa": "Karty od → do",
      "grupa": "karty",
      "rodzina": "karty",
      "skrot": "Siatka kart równej wysokości czytanych jak zdanie: stan wyjściowy, strzałka, stan docelowy.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "porownanie-wybor",
          "korzysci-argumenty"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "przemiana": "Siatka 2 × 2 kart: warunek małym tekstem, strzałka, wynik dużym zdaniem, numer w rogu",
        "regula-z-packshotem": "Karta warunek → odpowiedź z packshotem produktu, cała karta jest linkiem"
      },
      "opis": "Siatka kart równej wysokości; karta czyta się jak zdanie na trzech poziomach: stan wyjściowy lub warunek u góry, łącznik ze strzałką, stan docelowy lub odpowiedź u dołu; opcjonalnie tag produktu i packshot obok.",
      "mechanika": "Jednorazowe wejście ze staggerem (reveal); łącznikiem jest sama strzałka (dociągana kreska zeszła 02.10.2026 razem ze starym układem kart przemiany); w wariancie reguł cała karta jest linkiem do lightboxa i ma dwa układy (produkt pod zdaniem albo w prawej kolumnie od 1100 px).",
      "baza": {
        "plik": "v7/carbomat-humic.html",
        "kotwica": "roznice-karty"
      },
      "kod": {
        "css": "carbomat-humic.css (c5-diff) / strony upraw: ce/CE-34-karty-od-do.css (wariant regula-z-packshotem – u-rl)",
        "js": "carbomat-humic.js ===== 40 (reveal przez ce/00-base.js ===== 02) / uprawa.js u-reveal"
      },
      "czesci": [
        "numer",
        "od: tag + zdanie",
        "łącznik",
        "do: tag + zdanie",
        "packshot (opcjonalnie)"
      ],
      "warianty": {
        "przemiana": "cztery karty CARBOMAT ECO → CARBOMAT HUMIC; od 02.10.2026 w układzie kart reguł z Kukurydzy (uwaga Mateusza z 02.10): siatka 2 × 2, etykieta produktu i małe zdanie o CARBOMAT ECO jako warunek, strzałka, etykieta i duże zdanie o CARBOMAT HUMIC jako wynik, numer 01–04 w rogu, bez packshotu; karty nie są linkami",
        "regula-z-packshotem": "warunek → odpowiedź + sam packshot produktu (bez nazwy i wskazówki od 16.09), karta jako link (Kukurydza)"
      },
      "zrzut": {
        "maxh": 700
      }
    },
    "CE-35": {
      "nazwa": "Panel kryteriów z CTA",
      "grupa": "noty-i-cta",
      "rodzina": "pasy",
      "skrot": "Jasnoszary panel: nagłówek i dwa przyciski po lewej, lista punktów z ptaszkiem w dwóch kolumnach po prawej.",
      "projekt": null,
      "tagi": {
        "media": [
          "ikona"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "porownanie-wybor",
          "cta"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "opis": "Szeroki jasnoszary panel w dwóch kolumnach: h3 i rząd dwóch przycisków po lewej, lista punktów z ikoną check w dwóch kolumnach po prawej.",
      "mechanika": "Jednorazowe wejście w widok (reveal); statyczny.",
      "baza": {
        "plik": "v7/carbomat-humic.html",
        "kotwica": "roznice-dla-ciebie"
      },
      "kod": {
        "css": "carbomat-humic.css (c5-pick)",
        "js": "carbomat-humic.js reveal"
      },
      "czesci": [
        "h3",
        "rząd 2 przycisków",
        "lista punktów z check"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 500
      }
    },
    "CE-36": {
      "nazwa": "Wiersz zdjęcie | opis",
      "grupa": "karty",
      "rodzina": "obraz-tekst",
      "skrot": "Dwie kolumny: kadr zdjęcia 4:5 obok nazwy, zajawki, skrótu najważniejszych rzeczy i przycisku.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "okno"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "opis-produktu",
          "porownanie-wybor"
        ],
        "mechanika": [
          "przewijanie",
          "statyczny",
          "okno"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "odwrocony": "Opis po lewej, zdjęcie po prawej",
        "z-wartosciami": "Przyklejone zdjęcie obok nagłówka, akapitów, trzech wartości z ikonami i karty filmu"
      },
      "opis": "Dwie równe kolumny wyrównane do środka: kadr zdjęcia 4:5 z jednej strony, z drugiej nazwa, zajawka, skrót najważniejszych rzeczy i przycisk (na CARBOMAT HUMIC skrót to trzy wiersze etykieta | wartość – dawki, częstotliwość, zakup – słowo w słowo z pop-upu; pełna karta stoi w pop-upie CE-37); kolejne wiersze naprzemiennie.",
      "mechanika": "Parallax kadru z pozycji przewijania, wejście kolumny opisu (reveal), przycisk pod skrótem otwiera pop-up z pełną kartą (CE-37); poniżej 900 px zdjęcie nad tekstem. Moduł 40. W wariancie „z-wartosciami” zamiast parallaksu kadr jest przyklejony (sticky, 40 px od góry, wysokość ograniczona do okna pomniejszonego o odstęp od doka doradcy), a przycisk odtwarzania otwiera natywny dialog z wideo ładowanym dopiero na żądanie (preload „none”): film rusza po otwarciu, zamknięcie (×, Escape, klik w tło) zatrzymuje go i przewija na początek, fokus wraca na kartę; bez JS karta jest zwykłym linkiem do pliku mp4.",
      "baza": {
        "plik": "v7/carbomat-humic.html",
        "kotwica": "wariant-pro"
      },
      "kod": {
        "css": "carbomat-humic.css (c5-who); o-firmie.css (on-who – port tych klas); strony upraw: ce/CE-36-wiersz-zdjecie-opis.css (b-row, b-brief, b-info – wiersz z boksem infografiki na kadrze; wariant odwrocony: klasa b-row--rev); wariant z-wartosciami: home.css blok 90 (c5h-about, c5h-vals, c5h-film)",
        "js": "carbomat-humic.js ===== 40; o-firmie.js (parallax kadru); wariant z-wartosciami: home.js blok 90 (nakładka filmu)"
      },
      "czesci": [
        "kadr zdjęcia",
        "h3",
        "zajawka",
        "skrót: wiersze etykieta | wartość",
        "przycisk",
        "trzy wartości: ramka ikony, nazwa, zdanie",
        "karta filmu: kadr 16:9, przycisk odtwarzania, podpis, zdanie",
        "rząd domykający: przycisk i dwa linki ze strzałką"
      ],
      "warianty": {
        "odwrocony": "opis po lewej, zdjęcie po prawej (klasa b-row--rev na Borówce, c5-who--flip na CARBOMAT HUMIC)",
        "z-wartosciami": "siatka 6 / 6 wyrównana do góry: po lewej kadr 4:5 przyklejony na czas prawej kolumny, po prawej kicker i nagłówek sekcji, akapit intro, wyróżniony akapit z kreską po lewej, trzy wartości jako wiersze rozdzielone liniami (ramka ikony, nazwa, zdanie), karta filmu w ramce (kadr 16:9 z plakatem, kwadratowy przycisk odtwarzania, podpis i zdanie) i rząd domykający: przycisk oraz dwa linki ze strzałką; poniżej 900 px kadr 4:3 nad treścią (strona główna #o-nas)"
      },
      "zrzut": {
        "maxh": 900
      },
      "zrzuty_wariantow": {
        "z-wartosciami": {
          "plik": "v7/home.html",
          "kotwica": "o-nas",
          "maxh": 1100
        }
      }
    },
    "CE-37": {
      "nazwa": "Pop-up karty",
      "grupa": "nakladki",
      "rodzina": "okna",
      "skrot": "Okno dialogowe na środku ekranu z nagłówkiem, jednokolumnową treścią karty, stopką i przyciskiem zamknięcia.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "dlugi"
        ],
        "ukryte": [
          "okno"
        ],
        "pozycje": [
          "1"
        ],
        "nadaje": [
          "opis-produktu",
          "tekst-ciagly"
        ],
        "mechanika": [
          "okno"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "jeden-dialog": "Jeden dialog na stronę z treścią podmienianą z ukrytych bloków źródłowych"
      },
      "opis": "Dialog na środku ekranu z tłem przyciemnionym: nagłówek (nazwa, packshot lub zdjęcie), treść karty w jednej kolumnie, stopka z przyciskami, przycisk zamknięcia.",
      "mechanika": "Otwierany przyciskiem, fokus-trap, Escape, tło inert; wariant z jednym dialogiem klonuje treść z ukrytego źródła na stronie; bez JS treść stoi w biegu strony. Moduły 40 (HUMIC) / 52 (Próchnica+).",
      "baza": {
        "plik": "v7/carbomat-humic.html",
        "kotwica": "pop-pro"
      },
      "kod": {
        "css": "carbomat-humic.css (c5-pop) / prochnica-plus.css ===== 52",
        "js": "carbomat-humic.js ===== 40 / prochnica-plus.js ===== 52"
      },
      "czesci": [
        "nakładka",
        "nagłówek",
        "treść",
        "stopka",
        "zamknięcie"
      ],
      "warianty": {
        "jeden-dialog": "jeden dialog na stronę, treść podmieniana z bloków źródłowych (Próchnica+ profile)"
      },
      "zrzut": {
        "klik": "#wariant-pro [data-pop-open]",
        "maxh": 800
      }
    },
    "CE-38": {
      "nazwa": "Dwa panele fotograficzne",
      "grupa": "karty",
      "rodzina": "obraz-tekst",
      "skrot": "Dwa równe panele fotograficzne obok siebie: zdjęcie w tle, tytuł, dwa akapity, przycisk przy dole.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "porownanie-wybor",
          "opis-produktu"
        ],
        "mechanika": [
          "przewijanie",
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "opis": "Dwa równe panele fotograficzne obok siebie, każdy z tytułem, dwoma akapitami i przyciskiem przy dolnej krawędzi.",
      "mechanika": "Parallax zdjęć i wejście paneli ze staggerem (reveal); poniżej 900 px jeden pod drugim. Moduł 80.",
      "baza": {
        "plik": "v7/carbomat-humic.html",
        "kotwica": "sezon-panele"
      },
      "kod": {
        "css": "carbomat-humic.css (c5-when)",
        "js": "carbomat-humic.js ===== 80"
      },
      "czesci": [
        "2 panele: zdjęcie, tytuł, akapity, przycisk"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-39": {
      "nazwa": "Pokaz rodzin na tabach",
      "grupa": "przelaczniki",
      "rodzina": "zwijane",
      "skrot": "Belka z przełącznikiem tabów, pod nią panel produktu: packshot, nazwa, obietnica, przyciski i parametry.",
      "projekt": null,
      "tagi": {
        "media": [
          "packshot"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "taby-przelacznik"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "lista-produktow",
          "porownanie-wybor",
          "opis-produktu"
        ],
        "mechanika": [
          "klik"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "opis": "Belka z przełącznikiem segmentowym tabów i linkiem „Porównaj”, pod nią panel rodziny: packshot na linii podłogi, nazwa i obietnica po lewej, rząd przycisków po prawej, cztery kolumny parametrów dl.",
      "mechanika": "Taby ARIA (klik, strzałki, Home/End), znacznik aktywnego tabu przesuwa się; stary panel wyjeżdża, nowy packshot wjeżdża z kierunku wyboru, kaskada podpisów, płynna wysokość; przeciąganie packshotu; deep link. Moduł 30.",
      "baza": {
        "plik": "v7/produkty.html",
        "kotwica": "gama"
      },
      "kod": {
        "css": "produkty.css ===== 30 (c5pr-show)",
        "js": "produkty.js ===== 30"
      },
      "czesci": [
        "tablist",
        "link Porównaj",
        "szeroki przycisk pełnej tabeli",
        "panele rodzin: packshot, nazwa, obietnica, przyciski, dl"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 1100
      }
    },
    "CE-40": {
      "nazwa": "Tabela technikaliów z podświetlaniem kolumn",
      "grupa": "dane",
      "rodzina": "dane",
      "skrot": "Tabela parametrów w kolumnach z przyklejonym nagłówkiem, przypisem i kartami uwag sterującymi tabelą.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "porownanie-wybor",
          "liczby-dane"
        ],
        "mechanika": [
          "przewijanie",
          "klik"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "w-lightboxie": "Ta sama tabela otwierana w oknie nakładki zamiast w biegu strony"
      },
      "opis": "Wyśrodkowany nagłówek, tabela pięciu kolumn (parametr | cztery rodziny) ze stopką przycisków dokumentów i przypisem, pod nią zasada ogólna i trzy karty uwag z przyciskami „pokaż w tabeli”, na końcu rząd przycisków nawigacyjnych.",
      "mechanika": "Od 900 px wiersz nagłówka przykleja się do górnej krawędzi; poniżej tabela przewija się w bok z przypiętą pierwszą kolumną; przycisk karty podświetla kolumnę (is-pick) z błyskiem nagłówka. Moduł 40.",
      "baza": {
        "plik": "v7/produkty.html",
        "kotwica": "porownanie"
      },
      "kod": {
        "css": "produkty.css ===== 40 (c5pr-techsheet) + ===== 45 (nakładka)",
        "js": "produkty.js ===== 40 + ===== 45 (nakładka)"
      },
      "czesci": [
        "tabela",
        "przyciski dokumentów",
        "przypis",
        "karty uwag sterujące",
        "rząd przycisków"
      ],
      "warianty": {
        "w-lightboxie": "ta sama treść i mechanika, tylko nie w biegu strony: sekcja jest jedyną stroną nakładki CE-25 (wariant jednostronicowy), którą otwiera link „Porównaj” przy tabach CE-39 i nowy szeroki przycisk „Pełna tabela porównawcza” pod pokazem. Razem z tabelą weszły do nakładki przypis i trzy karty „jak czytać tabelę”, bo dotyczą wprost tabeli. Bez JS blok stoi w biegu strony dokładnie tam, gdzie stała sekcja – treść nigdy nie znika; rozdział znika za to z nawigacji kropkowej, a „pokaż w tabeli” przewija panel nakładki zamiast strony (Produkty, 20.09.2026, komentarze Mateusza w artefakcie)"
      },
      "zrzut": {
        "hash": "porownanie",
        "maxh": 1400
      }
    },
    "CE-41": {
      "nazwa": "Bloki wiedzy (para)",
      "grupa": "karty",
      "rodzina": "dane",
      "skrot": "Dwa bloki w ramkach, każdy z nagłówkiem, wizualem (wykres, tabela, skala) i przypisem.",
      "projekt": null,
      "tagi": {
        "media": [
          "schemat-wykres"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "liczby-dane",
          "dowod-zrodla"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "jeden-pod-drugim": "Oba bloki na całą szerokość, jeden pod drugim"
      },
      "opis": "Dwa bloki w ramkach: każdy z h3, wizualem (tabela, skala, wykres słupkowy, lista źródeł z kaflami liczb) i przypisem; obok siebie albo jeden pod drugim na całą szerokość.",
      "mechanika": "Jednorazowe wejście (reveal); paski wykresu rosną po wejściu w widok. Moduł 02 (ce/00-base.js).",
      "baza": {
        "plik": "v7/produkty.html",
        "kotwica": "dowod-bloki"
      },
      "kod": {
        "css": "produkty.css (c5pr-two, c5pr-block)",
        "js": "ce/00-base.js ===== 02 (reveal; dawny produkty.js ===== 72 zszedł do warstwy wspólnej 14.09.2026)"
      },
      "czesci": [
        "2 bloki: h3, wizual, przypis"
      ],
      "warianty": {
        "jeden-pod-drugim": "oba bloki na całą szerokość (--stack)"
      },
      "zrzut": {
        "maxh": 1000
      }
    },
    "CE-42": {
      "nazwa": "Akordeon pogłębiający",
      "grupa": "przelaczniki",
      "opis": "Nagłówek h4, kilka pozycji akordeonu kitu (przycisk z szewronem, panel z akapitem), pod nimi przycisk do Centrum wiedzy.",
      "mechanika": "Akordeon kitu z cw.js: panele niezależne, pierwszy otwarty na start, bez animacji wysokości; reveal bloku.",
      "baza": {
        "plik": "v7/produkty.html",
        "kotwica": "co-daja-dociekliwi"
      },
      "kod": {
        "css": "produkty.css (c5pr-more)",
        "js": "cw.js (wf-accordion)"
      },
      "czesci": [
        "h4",
        "pozycje akordeonu",
        "przycisk"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 500
      },
      "status": "wycofany"
    },
    "CE-43": {
      "nazwa": "Przełącznik z paskiem proporcji",
      "grupa": "przelaczniki",
      "opis": "Jedna kolumna z góry na dół: h3 i zdanie, rząd przycisków wyboru, poziomy pasek wypełnienia z etykietą, blok interpretacji (duża wartość, etykieta, akapity). Do 20.09.2026 na Kukurydzy od 1280 px rozchodził się na trzy kolumny (pytanie | dawki i pasek | interpretacja); dwie uwagi Mateusza z tego dnia („Nagłówek i ten tekst daj nad wykresem z tabami dawka produktu”, „To możesz przenieść pod wykres”) zdjęły ten układ – blok czyta się w jednej kolumnie na każdej szerokości, a sekcja stoi na kontenerze 1180 px, więc pasek nie jest już kreską przez cały ekran.",
      "mechanika": "Przyciski aria-pressed ustawiają szerokość wypełnienia i pokazują swój blok tekstu; bez JS wszystkie bloki widoczne. uprawa.js (pasek potasu).",
      "baza": {
        "plik": "v7/kukurydza.html",
        "kotwica": "u-wybor-potas"
      },
      "kod": {
        "css": "brak – reguły u-kbar zdjęte z uprawa.css",
        "js": "uprawa.js 5 (pasek potasu)"
      },
      "czesci": [
        "h3",
        "przyciski wyboru",
        "pasek",
        "bloki interpretacji"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 600
      },
      "status": "wycofany"
    },
    "CE-44": {
      "nazwa": "Napis przyklejony z płynącymi kaflami",
      "grupa": "sceny",
      "rodzina": "sceny",
      "skrot": "Duży napis przyklejony na środku sceny, obok którego przepływają karty z ikoną, tytułem i krótkim opisem.",
      "projekt": null,
      "tagi": {
        "media": [
          "ikona"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "przewijanie"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "korzysci-argumenty"
        ],
        "mechanika": [
          "przewijanie"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "tlo-foto": "Biały napis na pełnoekranowym zdjęciu, kafle wjeżdżają po 2–3 w trzech pasach"
      },
      "opis": "Duży napis przyklejony na środku ekranu przez cały tor sekcji; kafelki lub karty rozłożone w torze nieregularnie (odsunięcie, obrót, własna prędkość) przepływają obok i po napisie.",
      "mechanika": "Parallax kafelków liczony z pozycji przewijania (tylko motionOn); statycznie napis i kafelki jeden pod drugim. Moduł 55 (Kukurydza) / 45 (Próchnica+).",
      "baza": {
        "plik": "v7/lab/ce-44-napis-z-kaflami.html",
        "kotwica": "korzysci"
      },
      "kod": {
        "css": "wersja bazowa: lab/ce-44-napis-z-kaflami.html (kod obok strony demonstracyjnej); wariant tlo-foto: prochnica-plus.css ===== 45 (pp-kor)",
        "js": "wersja bazowa: lab/ce-44-napis-z-kaflami.html; wariant tlo-foto: prochnica-plus.js ===== 45"
      },
      "czesci": [
        "napis",
        "kafelki lub karty"
      ],
      "warianty": {
        "tlo-foto": "jedno zdjęcie w tle sceny na pełny ekran (scena przyklejona 100svh, jednolity scrim), biały napis wchodzi wyraz po wyrazie zza maski, gdy kadr zajmuje ok. 2/3 okna; kafle proste, w trzech rozłącznych pasach, po 2–3 naraz, z profilem prędkości: szybki wjazd, zwolnienie w środku okna, szybki wyjazd; na końcu napis zostaje sam (Próchnica+ #korzysci; do 01.10.2026 także Kukurydza, sekcja „Krytyczne fakty”, zdjęta ze strony)"
      },
      "zrzuty_wariantow": {
        "tlo-foto": {
          "plik": "v7/prochnica-plus.html",
          "kotwica": "korzysci"
        }
      },
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-45": {
      "nazwa": "Pudełka-przełączniki",
      "grupa": "przelaczniki",
      "rodzina": "zwijane",
      "skrot": "Rząd pudełek-przełączników z numerem, nazwą i podpisem, pod nimi panel treści wybranej pozycji.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "taby-przelacznik"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "porownanie-wybor"
        ],
        "mechanika": [
          "klik"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "dwa-pakiety": "Dwa pudełka obok siebie z liczbą zabiegów i produktów, w parze z suwakiem powierzchni"
      },
      "opis": "Rząd pudełek (tablist) z numerem, nazwą i podpisem pozycji, pod nimi panel treści aktywnej pozycji (tabela wierszy). Od 01.10.2026 jedyne wystąpienie to wariant „dwa-pakiety” na Kukurydzy; układ trzech pudełek z szyną po lewej od 1280 px (sekcja „Trzy warianty technologii”) zszedł ze strony razem z nią.",
      "mechanika": "Tablist ARIA z klawiaturą; klik pokazuje panel; bez JS wszystkie panele widoczne. uprawa.js (pudełka wariantów).",
      "baza": {
        "plik": "v7/kukurydza.html",
        "kotwica": "u-pakiety-wybor"
      },
      "kod": {
        "css": "ce/CE-45-pudelka-przelaczniki.css (u-vtabs, u-vtab; wariant dwa-pakiety: klasa u-vtabs--2)",
        "js": "uprawa.js 10"
      },
      "czesci": [
        "pudełka",
        "panel treści"
      ],
      "warianty": {
        "dwa-pakiety": "dwa pudełka obok siebie (pakiet minimum, pakiet optimum) z trzecim wierszem – liczbą zabiegów i produktów (klasa u-vtabs--2); stoją w górnym rzędzie sekcji CE-47 „z-pakietami” obok suwaka powierzchni i przełączają panel z wierszami „Etap · Zabieg” oraz boksami przelicznika (Kukurydza, 01.10.2026; Borówka, 02.10.2026 – #b-pakiety-wybor)"
      },
      "zrzut": {
        "maxh": 700
      }
    },
    "CE-46": {
      "nazwa": "Karuzela kart",
      "grupa": "przelaczniki",
      "opis": "Nagłówek w jednym wierszu (kicker, h2, lead po lewej; licznik i strzałki po prawej), tor kart scroll-snap, pasek postępu pod torem.",
      "mechanika": "Strzałki, klawisze, przeciąganie myszą, licznik „01 / 08”; bez JS tor przewija się natywnie, sterowanie ukryte. Moduł 70.",
      "baza": {
        "plik": "v7/kukurydza.html",
        "kotwica": "u-stanowisko"
      },
      "kod": {
        "css": "kukurydza.css ===== 70 (u-cr)",
        "js": "kukurydza.js ===== 70"
      },
      "czesci": [
        "nagłówek z licznikiem i strzałkami",
        "tor kart",
        "pasek postępu"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 800
      },
      "status": "wycofany"
    },
    "CE-47": {
      "nazwa": "Przelicznik",
      "grupa": "dane",
      "rodzina": "dane",
      "skrot": "Suwak powierzchni z polem liczby i siatka boksów wyników przeliczanych na bieżąco.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "taby-przelacznik"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "liczby-dane",
          "sklep-transakcja",
          "porownanie-wybor"
        ],
        "mechanika": [
          "formularz"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "skroty_wariantow": {
        "z-pakietami": "Pudełka wyboru pakietu, suwak, wiersze zabiegów i boksy wyników z sumą kosztu"
      },
      "opis": "Nagłówek, suwak powierzchni z wartością, siatka boksów wyników (wartość, jednostka, wiersze pomocnicze). Głowa sekcji – kicker, h2 i lead – stoi NAD paskiem powierzchni, wyrównana do lewej (uwaga Mateusza z 20.09.2026; kolumna głowy obok przelicznika, którą wprowadzał szeroki kontener od 1560 px, zniknęła razem z nim). Boks wyniku może nieść wiersze pomocnicze z własnym `data-calc-out`: woda do zabiegu i koszt produktu brutto (etykieta mówi „brutto” przy każdej liczbie, nie tylko w nocie pod tabelą – decyzja Mateusza z 20.09.2026) – `data-lo`/`data-hi` są tam już w złotówkach na hektar (dawka × cena jednostkowa), więc przelicznik `c5.js` zostaje nietknięty.",
      "mechanika": "Suwak przelicza dawki na bieżąco (data-calc w c5.js, grupowanie tysięcy), bez JS wartości domyślne.",
      "baza": {
        "plik": "v7/kukurydza.html",
        "kotwica": "u-pakiety"
      },
      "kod": {
        "css": "ce/CE-47-przelicznik.css (u-pk, u-area, u-calc, u-out, u-cost)",
        "js": "c5.js (przelicznik data-calc) + uprawa.js 13 (suwak)"
      },
      "czesci": [
        "suwak",
        "boksy wyników"
      ],
      "warianty": {
        "z-pakietami": "przelicznik spięty z wyborem pakietu (Kukurydza, 01.10.2026): w górnym rzędzie pudełka-przełączniki CE-45 „dwa-pakiety” i suwak powierzchni, niżej panel wybranego pakietu – wiersze „Etap · Zabieg”, a pod nimi boksy wyników po jednym na produkt (ilość, woda do zabiegu, koszt brutto, przycisk sklepu) i ciemny boks sumy kosztu pakietu; trzy boksy w pakiecie minimum, cztery w optimum; `data-calc` i `data-tabs-group` siedzą na tym samym kontenerze, więc przelicznik wypełnia boksy obu paneli. Na Borówce (02.10.2026) panel ma dwie grupy boksów: „co roku” i „jednorazowo” – każda z ciemnym boksem sumy; boksy jednorazowe (podłoże, „Wodny Stoper”, ściółka) niosą ilość na powierzchnię bez wiersza wody i koszt brutto liczony z największego opakowania (uwaga Mateusza z 02.10: „A tu nie liczysz ceny?”); pod panelami zostaje tylko odnośnik „Jak liczymy pakiety: założenia i ceny”, który otwiera okno CE-25 „jednostronicowy” z notą o roboczej propozycji, założeniami przeliczenia na hektar i cenami"
      },
      "zrzut": {
        "maxh": 700
      }
    },
    "CE-48": {
      "nazwa": "Karty biogramów",
      "grupa": "karty",
      "rodzina": "zwijane",
      "skrot": "Karty biogramów jedna pod drugą: portret, nazwisko, pierwszy akapit i „czytaj dalej” z resztą tekstu.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "akordeon"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "ludzie"
        ],
        "mechanika": [
          "klik"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "siatka": "Osiem biogramów w siatce czterech kolumn z „czytaj dalej”",
        "kompakt": "Trzy karty autorów bez rozwijania"
      },
      "opis": "Karty biogramów jedna pod drugą w kontenerze 1180 px: mniejsze zdjęcie 4 : 5 po lewej (200 px), po prawej nazwisko, pierwszy akapit widoczny, reszta pod przyciskiem „czytaj dalej”, opcjonalna nota przy karcie; poniżej 700 px zdjęcie nad treścią.",
      "mechanika": "Szuflada rozwijana na klik (panelSet); bez JS cała treść widoczna, a przycisk ukryty. Moduł 55.",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "koordynatorzy"
      },
      "kod": {
        "css": "prochnica-plus.css ===== 55 (pp-bio)",
        "js": "prochnica-plus.js ===== 55"
      },
      "czesci": [
        "2 karty w jednej kolumnie: zdjęcie po lewej, nazwisko, akapity, przycisk, nota"
      ],
      "warianty": {
        "siatka": "osiem biogramów w siatce 4 kolumn z „czytaj dalej” (o-firmie.html#ludzie)",
        "kompakt": "trzy karty autorów bez rozwijania (centrum-wiedzy.html#autorzy)"
      },
      "zrzut": {
        "maxh": 700
      }
    },
    "CE-49": {
      "nazwa": "Harmonogram na osi",
      "grupa": "dane",
      "opis": "Szeroka sekcja (kontener do 1800 px): nagłówek do lewej, pod nim płótno osi na całą szerokość – u góry rząd lat, niżej pionowe linie wydarzeń rozstawione wg daty (zrobione: linia atramentowa ze znacznikiem-ptaszkiem, w toku: jasna ze znacznikiem zegara, zaplanowane: jasna) i znacznik „jesteśmy tutaj”. Przestrzeń między linią a następną należy do wydarzenia z lewej.",
      "mechanika": "Najechanie na przestrzeń pokazuje mini-opis (termin, miniatura, nazwa) przyklejony do boku linii na wysokości kursora; przy prawej krawędzi mini-opis przechodzi na lewą stronę linii. Klik, Enter albo spacja rozszerza odcinek do ok. 560 px i otwiera między liniami duży opis (termin, kadr 4 : 3, stan, nazwa, opis, ostrzeżenie), a pozostałe linie i rząd lat ściskają się jednym odwzorowaniem odcinkami liniowym; ponowny klik albo Esc zamyka, strzałki przenoszą między wydarzeniami. Przy pierwszym wejściu linie rysują się ze staggerem, a następny krok pokazuje mini-opis. Poniżej 900 px pionowa lista z rozwijaniem, bez JS komplet etapów jeden pod drugim, przy reduced-motion bez przejść.",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "harmonogram"
      },
      "kod": {
        "css": "usunięty 03.10.2026 (moduł bez wystąpień)",
        "js": "usunięty 03.10.2026 (moduł bez wystąpień)"
      },
      "czesci": [
        "nagłówek",
        "rząd lat",
        "linie wydarzeń ze znacznikami stanu",
        "mini-opis na hover",
        "duży opis między liniami",
        "znacznik „jesteśmy tutaj”"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 900
      },
      "status": "wycofany"
    },
    "CE-50": {
      "nazwa": "Formularz",
      "grupa": "dane",
      "rodzina": "sklep-formularze",
      "skrot": "Formularz z polami, zgodą i przyciskiem obok zdjęcia lub panelu z danymi firmy i mapą.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie",
          "schemat-wykres"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "kontakt-formularz"
        ],
        "mechanika": [
          "formularz"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "kontakt": "Formularz z wyborem tematu obok panelu danych firmy i pola mapy",
        "temat": "Formularz „Zaproponuj temat” obok pasa przewodnika",
        "z-przelacznikiem": "Pola logowania z przełącznikiem trybu i boksem wniosku.",
        "z-podsumowaniem": "Grupy pól obok przyklejonego podsumowania kwot z przyciskiem."
      },
      "opis": "Dwie kolumny: formularz (pola, zgoda, przycisk) i zdjęcie zespołu.",
      "mechanika": "Demonstracyjny: nic nie wychodzi na serwer, walidacja i komunikat po wysłaniu w JS. Moduł 75.",
      "baza": {
        "plik": "v7/kontakt.html",
        "kotwica": "napisz"
      },
      "kod": {
        "css": "prochnica-plus.css ===== 75 (pp-form) + panel i logowanie: osobna implementacja ce/CE-50-formularz.css (c5-form; segment w grupie pól: c5-form__switch, odnośnik w panelu: c5-form__more); Próchnica+ i Kontakt na swoich klasach",
        "js": "prochnica-plus.js ===== 75 + ce/CE-50-formularz.js"
      },
      "czesci": [
        "pola",
        "zgoda",
        "przycisk",
        "panel obok: zdjęcie albo tekst (kroki, dane, podsumowanie)",
        "segment w grupie pól – fieldset bez ramki z legendą jak etykieta pola",
        "odnośnik w panelu, w osobnym wierszu"
      ],
      "warianty": {
        "kontakt": "formularz z wyborem tematu obok panelu danych firmy i mapy (kontakt.html#napisz)",
        "temat": "formularz „Zaproponuj temat” obok pasa przewodnika (centrum-wiedzy.html#zaproponuj, artykul.html#zaproponuj-temat)",
        "z-przelacznikiem": "wąska kolumna pól z przełącznikiem trybu nad nagłówkiem (przełącznik zmienia nagłówek i cel przycisku), obok boks wejścia do wniosku o konto (klasa c5-form--z-przelacznikiem; logowanie.html#logowanie)",
        "z-podsumowaniem": "pola w nazwanych grupach, a panel obok to podsumowanie kwot – rozpiska, wiersz sumy, VAT – z przyciskiem wysyłki, przyklejone od 900 px (klasa c5-form--z-podsumowaniem; b2b-dostawa.html#dostawa)"
      },
      "zrzut": {
        "maxh": 800
      },
      "zrzuty_wariantow": {
        "z-przelacznikiem": {
          "plik": "v7/logowanie.html",
          "kotwica": "logowanie",
          "maxh": 700
        },
        "z-podsumowaniem": {
          "plik": "v7/b2b-dostawa.html",
          "kotwica": "dostawa",
          "maxh": 722
        }
      }
    },
    "CE-51": {
      "nazwa": "Oś Gantta",
      "grupa": "dane",
      "opis": "Komponent na pełną szerokość okna (do 1800 px, marginesy 20 px) i wysokość ekranu minus marginesy: przyklejony lewy panel z listą gospodarstw (chip uprawy i nazwisko) na jasnym tle, kolumny czasu o stałej szerokości z nagłówkami miesięcy i lat, zdarzenia jako pigułki w jednym wierszu (do ok. 250 px, wielokropek) jedna pod drugą w komórce miesiąca, miniatura filmu pod pigułką zdarzenia z relacją, linia „jesteśmy tutaj”.",
      "mechanika": "Tabela budowana z ukrytego źródła treści (osie kamieni per gospodarstwo); przewijanie w obu osiach wewnątrz komponentu (przeciąganie myszą, strzałki, start na bieżącym miesiącu, data-lenis-prevent), pas tła na wysokość wiersza przy najechaniu i fokusie oraz po skoku z karty uczestnika, dymek z pełną nazwą i terminem, klik otwiera kartę okresu – dialog wysuwany z prawej ze wszystkimi zdarzeniami gospodarstwa z danego miesiąca, przewinięty do klikniętego. Bez JS widoczne osie kamieni jako listy.",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "etapy-gantt"
      },
      "kod": {
        "css": "usunięty 03.10.2026 (moduł bez wystąpień; źródło treści bez JS: prochnica-plus.css ===== 85b)",
        "js": "usunięty 03.10.2026 (moduł bez wystąpień)"
      },
      "czesci": [
        "panel gospodarstw",
        "nagłówki kolumn czasu",
        "pigułki zdarzeń",
        "miniatury filmów",
        "pas wiersza",
        "dymek nazwy",
        "karta okresu (dialog)",
        "źródło treści (osie kamieni, wersja bez JS)"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 1000
      },
      "status": "wycofany"
    },
    "CE-52": {
      "nazwa": "Pasek pól wyboru",
      "grupa": "dane",
      "opis": "Siatka pól select z etykietami (jedno pole albo cztery w ramce), wysokość pola 44 px.",
      "mechanika": "W makiecie pola niczego nie filtrują (brak obsługi w JS).",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "wyniki-rok"
      },
      "kod": {
        "css": "prochnica-plus.css ===== 90 (pp-selects)",
        "js": "brak"
      },
      "czesci": [
        "pola select z etykietami"
      ],
      "warianty": {
        "w-ramce": "cztery pola w ramce z nagłówkiem Filtry – bez wystąpień od 02.10.2026 (filtry Wyników na Próchnicy+ usunięte)"
      },
      "zrzut": {
        "maxh": 300
      },
      "status": "wycofany"
    },
    "CE-53": {
      "nazwa": "Lista wierszy z akcją",
      "grupa": "dane",
      "rodzina": "dane",
      "skrot": "Lista wierszy rozdzielonych liniami: tytuł, metryka lub opis i przycisk akcji po prawej.",
      "projekt": null,
      "tagi": {
        "media": [
          "ikona"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "9+"
        ],
        "nadaje": [
          "dowod-zrodla",
          "cta"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "dokumenty": "Certyfikaty, poradniki i karty do pobrania z numerem lub metryką"
      },
      "opis": "Lista wierszy rozdzielonych cienkimi liniami: tytuł | metryka | przycisk po prawej.",
      "mechanika": "Fade-in wierszy; przyciski aktywne (w makiecie niczego nie pobierają).",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "wyniki-raporty"
      },
      "kod": {
        "css": "prochnica-plus.css ===== 90 (pp-reports) + panel: ce/CE-53-lista-wierszy.css (c5-rows, c5-rows--dokumenty)",
        "js": "prochnica-plus.js ===== 02 (reveal)"
      },
      "czesci": [
        "wiersze: tytuł, metryka, przycisk",
        "tytuł listy wersalikami (c5-rows__title)",
        "lista (c5-rows__list)",
        "wiersz: nazwa z opcjonalną ikoną, metryka z opcjonalnym odnośnikiem, akcja – przycisk albo odnośnik (c5-rows__row, c5-rows__name, c5-rows__meta, c5-rows__act)"
      ],
      "warianty": {
        "dokumenty": "certyfikaty, poradniki i karty do pobrania z numerem lub metryką (o-firmie.html#dowody-listy, centrum-wiedzy.html#poradniki)"
      },
      "zrzut": {
        "maxh": 700
      }
    },
    "CE-54": {
      "nazwa": "Kafle szybkiego kontaktu",
      "grupa": "karty",
      "rodzina": "otwarcie",
      "skrot": "Nagłówek strony i trzy duże kafle osób kontaktowych: portret, rola, telefon dużą czcionką, e-mail.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "kontakt-formularz",
          "ludzie",
          "otwarcie-strony"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "opis": "Nagłówek strony (kicker, h1, lead) i trzy duże kafle w ramce: pole pod zdjęcie, imię i nazwisko, rola, numer telefonu dużą czcionką jako link tel:, pod nim adres e-mail jako link mailto:.",
      "mechanika": "Statyczne; na telefonie (poniżej 600 px) numer staje się ciemnym przyciskiem „Zadzwoń” na całą szerokość kafla, od 600 px wraca do dużej liczby w jednym wierszu. Wejście kafli przez reveal.",
      "baza": {
        "plik": "v7/kontakt.html",
        "kotwica": "szybki-kontakt"
      },
      "kod": {
        "css": "kontakt.css ===== 10 (kt-quick)",
        "js": "00-base.js (reveal)"
      },
      "czesci": [
        "nagłówek strony",
        "3 kafle: zdjęcie, nazwisko, rola, telefon, e-mail"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 760
      }
    },
    "CE-55": {
      "nazwa": "Wiersze działów z akcjami",
      "grupa": "dane",
      "rodzina": "sklep-formularze",
      "skrot": "Wiersze działów w trzech kolumnach: nazwa i osoba, opis, przyciski z telefonem i e-mailem.",
      "projekt": null,
      "tagi": {
        "media": [
          "ikona"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "kontakt-formularz",
          "ludzie"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "opis": "Lista wierszy rozdzielonych cienkimi liniami, każdy w trzech kolumnach: nazwa działu z osobą | opis (1–3 zdania) | kolumna akcji z pełnym numerem telefonu i pełnym adresem e-mail jako przyciskami.",
      "mechanika": "Fade-in wierszy (reveal); wiersz wskazany chipem „Wybierz sprawę” albo hashem #dzial-… dostaje na 1,5 s klasę is-hot (obramowanie, jasne tło). Poniżej 900 px kolumny jedna pod drugą, przyciski na całą szerokość.",
      "baza": {
        "plik": "v7/kontakt.html",
        "kotwica": "dzialy"
      },
      "kod": {
        "css": "kontakt.css ===== 30 (kt-dept)",
        "js": "kontakt.js 20 (is-hot z chipów i hasha)"
      },
      "czesci": [
        "wiersze: dział + osoba, opis, telefon, e-mail"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-56": {
      "nazwa": "Mapa z listą lokalizacji",
      "grupa": "karty",
      "rodzina": "sklep-formularze",
      "skrot": "Pole mapy z numerowanymi pinezkami obok siatki kart lokalizacji z kontaktem.",
      "projekt": null,
      "tagi": {
        "media": [
          "schemat-wykres"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "kontakt-formularz",
          "ludzie"
        ],
        "mechanika": [
          "klik"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "skroty_wariantow": {
        "o-nas": "Kolumna adresu firmy z mapą i lista krajów bez osób"
      },
      "opis": "Pole mapy z numerowanymi pinezkami (pozycje w procentach w CSS) obok siatki kart lokalizacji: kraj wersalikami, firma, osoba, telefon i e-mail jako przyciski.",
      "mechanika": "Najechanie lub fokus na karcie podświetla pinezkę o tym samym numerze i odwrotnie; klik w pinezkę przewija do karty (kotwica). Poniżej 900 px mapa nad siatką, siatka w jednej kolumnie. Bez JS: mapa statyczna, karty widoczne.",
      "baza": {
        "plik": "v7/kontakt.html",
        "kotwica": "dystrybutorzy"
      },
      "kod": {
        "css": "kontakt.css ===== 50 (kt-eumap, kt-pin, kt-dcard)",
        "js": "kontakt.js 50 (hover i fokus ↔ pinezka)"
      },
      "czesci": [
        "pole mapy z pinezkami",
        "siatka kart lokalizacji"
      ],
      "warianty": {
        "o-nas": "kolumna adresu firmy z mapą i lista krajów bez osób (o-firmie.html#gdzie-jestesmy, prefiks on-map)"
      },
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-57": {
      "nazwa": "Indeks artykułów",
      "grupa": "dane",
      "rodzina": "dane",
      "skrot": "Chipy podgrup, sortowanie i wyszukiwarka nad listą artykułów (tytuł, zajawka, meta) ze stronicowaniem.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "taby-przelacznik"
        ],
        "pozycje": [
          "9+"
        ],
        "nadaje": [
          "nawigacja",
          "tekst-ciagly"
        ],
        "mechanika": [
          "klik",
          "formularz"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "skroty_wariantow": {
        "kategoria": "Lista jednej kategorii z chipami jej podgrup i wierszem „wkrótce”"
      },
      "opis": "Pasek sterowania (chipy podgrup, sortowanie, wyszukiwanie, licznik) i lista wierszy bez miniatur: tytuł, zajawka w dwóch liniach, meta (podgrupa, autor, miesiąc, czas czytania); pod listą stronicowanie numerowane.",
      "mechanika": "Filtrowanie chipami, sortowanie i wyszukiwanie po tytule i zajawce w JS (data-kat, data-date, data-title), stronicowanie 10 na stronę z zapisem ?kat= i ?strona= w adresie; pusty stan z przyciskiem czyszczącym. Bez JS wszystkie wiersze widoczne, kontrolki ukryte.",
      "baza": {
        "plik": "v7/centrum-wiedzy.html",
        "kotwica": "artykuly"
      },
      "kod": {
        "css": "centrum-wiedzy.css ===== 57 (cw-k-index, cw-k-row)",
        "js": "centrum-wiedzy.js (filtry, sortowanie, wyszukiwanie, stronicowanie)"
      },
      "czesci": [
        "pasek sterowania",
        "wiersze listy",
        "stronicowanie",
        "pusty stan"
      ],
      "warianty": {
        "kategoria": "lista jednej kategorii z chipami jej podgrup i wierszem „wkrótce” (centrum-wiedzy-kategoria.html#artykuly)"
      },
      "zrzut": {
        "maxh": 1000
      }
    },
    "CE-58": {
      "nazwa": "Karty najnowszych",
      "grupa": "karty",
      "rodzina": "karty",
      "skrot": "Trzy karty ostatnich artykułów: wiodąca z polem na infografikę i dwie mniejsze bez obrazu.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "nawigacja",
          "tekst-ciagly"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "opis": "Trzy ostatnie artykuły: karta wiodąca z polem pod infografikę 16:9, chipem podgrupy, tytułem, zajawką i meta oraz dwie mniejsze karty bez obrazu jedna nad drugą; pod rzędem nota o następnym tekście.",
      "mechanika": "Jednorazowe wejście kart (reveal); poniżej 900 px jedna kolumna.",
      "baza": {
        "plik": "v7/centrum-wiedzy.html",
        "kotwica": "najnowsze"
      },
      "kod": {
        "css": "centrum-wiedzy.css ===== 58 (cw-k-latest, cw-k-card)",
        "js": "00-base.js (reveal)"
      },
      "czesci": [
        "karta wiodąca z polem pod infografikę",
        "2 karty mniejsze",
        "nota o następnym artykule"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 800
      }
    },
    "CE-59": {
      "nazwa": "Nawigacja kategorii",
      "grupa": "karty",
      "rodzina": "karty",
      "skrot": "Dwa obramowane boksy kategorii: nazwa grupy jako link, zdanie opisu i lista podgrup z licznikami.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "nawigacja"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "kompakt": "Boksy z samą nazwą grupy i strzałką oraz dwa wiersze wyjścia z ikoną"
      },
      "opis": "Dwa obramowane boksy obok siebie: nazwa grupy głównej jako link, zdanie opisu i lista podgrup z licznikami artykułów.",
      "mechanika": "Statyczne; linki podgrup prowadzą do indeksu z parametrem ?kat=, który ustawia filtr. Poniżej 900 px boksy jeden pod drugim.",
      "baza": {
        "plik": "v7/centrum-wiedzy.html",
        "kotwica": "kategorie"
      },
      "kod": {
        "css": "centrum-wiedzy.css ===== 59 (cw-k-cats); wariant kompakt: c5h-kn__band, c5h-kn__cat, c5h-kn__row w home.css ===== 80",
        "js": "–"
      },
      "czesci": [
        "2 boksy grup głównych",
        "listy podgrup z licznikami"
      ],
      "warianty": {
        "kompakt": "wariant zajawkowy (strona główna): boksy kategorii bez zdania opisu, bez listy podgrup i bez liczników – zostaje sama nazwa grupy jako link ze strzałką, która dosuwa się o 4 px przy najechaniu i fokusie, a obrys boksu ciemnieje. Strona główna nie podaje liczb, których nie ma w źródłach, dlatego liczniki artykułów wypadają razem z podgrupami. Pas biegnie w rytmie 7 / 5: po lewej dwa boksy kategorii obok siebie, po prawej dwa wiersze wyjścia – poradniki upraw (ikona pliku, zdanie, cichy link do #poradniki) i przewodnik (ikona rozmowy, zdanie, przycisk z data-jurek-open otwierający dok doradcy). Statyczne, wejście kaskadą revealem strony; poniżej 900 px wszystko w jednej kolumnie."
      },
      "zrzut": {
        "maxh": 700
      },
      "zrzuty_wariantow": {
        "kompakt": {
          "plik": "v7/home.html",
          "kotwica": "wiedza-kategorie",
          "maxh": 420
        }
      }
    },
    "CE-60": {
      "nazwa": "Spis treści z paskiem postępu",
      "grupa": "nawigacja",
      "rodzina": "wspolne",
      "skrot": "Przyklejony spis treści artykułu z zaznaczaniem aktywnej sekcji i paskiem postępu czytania.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "akordeon"
        ],
        "pozycje": [
          "9+"
        ],
        "nadaje": [
          "nawigacja"
        ],
        "mechanika": [
          "przewijanie"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "opis": "Spis treści artykułu (lista linków do wszystkich h2, pozycja = etykieta i teza) w przyklejonej lewej kolumnie plus pasek postępu czytania 2 px u góry okna.",
      "mechanika": "Scrollspy: aktywna pozycja dostaje aria-current; pasek postępu = procent przewinięcia treści (role=progressbar); przy wąskich ekranach spis jest akordeonem details nad treścią, na desktopie sam wykaz przewija się wewnątrz kolumny. Bez JS zwykłe kotwice.",
      "baza": {
        "plik": "v7/artykul.html",
        "kotwica": "spis"
      },
      "kod": {
        "css": "artykul.css (CE-60)",
        "js": "artykul.js (scrollspy, pasek postępu)"
      },
      "czesci": [
        "pasek postępu",
        "spis treści",
        "metryka i przyciski udostępnij/drukuj"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 800,
        "przewin": "#spis"
      }
    },
    "CE-61": {
      "nazwa": "Kluczowe wnioski",
      "grupa": "noty-i-cta",
      "rodzina": "pasy",
      "skrot": "Obramowany boks z nagłówkiem i listą 3–5 zdań-wniosków, na początku tekstu.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "korzysci-argumenty",
          "tekst-ciagly"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "opis": "Obramowany boks na początku artykułu: nagłówek „Kluczowe wnioski” i lista pięciu zdań zaczerpniętych dosłownie z treści.",
      "mechanika": "Statyczne.",
      "baza": {
        "plik": "v7/artykul.html",
        "kotwica": "wnioski"
      },
      "kod": {
        "css": "artykul.css (CE-61)",
        "js": "–"
      },
      "czesci": [
        "nagłówek",
        "lista 3–5 zdań"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 600
      }
    },
    "CE-62": {
      "nazwa": "Boks produktowy w treści",
      "grupa": "noty-i-cta",
      "rodzina": "karty",
      "skrot": "Boks z packshotem, nazwą produktu, zdaniem opisu i dwoma przyciskami, wstawiony w tekst.",
      "projekt": null,
      "tagi": {
        "media": [
          "packshot"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "1"
        ],
        "nadaje": [
          "opis-produktu",
          "cta"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "skroty_wariantow": {
        "boczny": "Ten sam boks w wąskiej kolumnie bocznej, bez etykiety."
      },
      "opis": "Boks „Z tego artykułu” wstawiony raz w bieg tekstu: packshot, nazwa produktu, jedno zdanie z karty produktu i dwa przyciski (strona produktu, sklep).",
      "mechanika": "Statyczne; poniżej 700 px packshot nad tekstem.",
      "baza": {
        "plik": "v7/artykul.html",
        "kotwica": "produkt"
      },
      "kod": {
        "css": "artykul.css (CE-62)",
        "js": "–"
      },
      "czesci": [
        "etykieta „Z tego artykułu”",
        "packshot",
        "nazwa i zdanie",
        "2 przyciski"
      ],
      "warianty": {
        "boczny": "w kolumnie bocznej strony kategorii, bez etykiety (centrum-wiedzy-kategoria.html#obok-produkt)"
      },
      "zrzut": {
        "maxh": 500
      }
    },
    "CE-63": {
      "nazwa": "Karta autora",
      "grupa": "karty",
      "rodzina": "karty",
      "skrot": "Karta autora z polem na zdjęcie, rolą, bio i linkiem, pod nią wiersz eksperta.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie",
          "ikona"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "ludzie",
          "dowod-zrodla"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "opis": "Karta pod artykułem: pole pod zdjęcie, imię i nazwisko, rola, bio, link do wszystkich artykułów autora; pod nią wiersz konsultanta merytorycznego (z notą niezależności, gdy dotyczy).",
      "mechanika": "Statyczne.",
      "baza": {
        "plik": "v7/artykul.html",
        "kotwica": "autor"
      },
      "kod": {
        "css": "artykul.css (CE-63)",
        "js": "–"
      },
      "czesci": [
        "karta autora",
        "wiersz konsultanta"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 600
      }
    },
    "CE-64": {
      "nazwa": "Produkty wspomniane w artykule",
      "grupa": "noty-i-cta",
      "rodzina": "karty",
      "skrot": "Pas 3 produktów w rzędzie: pole packshotu, nazwa, przycisk kupna i cichy link.",
      "projekt": null,
      "tagi": {
        "media": [
          "packshot"
        ],
        "tekst": [
          "tylko-naglowek"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "lista-produktow",
          "sklep-transakcja"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "opis": "Poziomy pas nad kluczowymi wnioskami artykułu: nagłówek i rząd pozycji rozdzielonych cienkimi liniami – pole packshotu 112 × 112 px, nazwa produktu (maks. dwa wiersze), przycisk „Kup produkt” i cichy link do strony produktu. Bez zdań o produktach – tylko nazwy.",
      "mechanika": "Od 900 px trzy pozycje dzielą kolumnę tekstu (ok. 240 px każda); poniżej rząd przewija się poziomo ze scroll-snap, na telefonie trzecia pozycja wystaje zza krawędzi z zanikiem po prawej. Bez JS i bez animacji.",
      "baza": {
        "plik": "v7/artykul.html",
        "kotwica": "produkty-wspomniane"
      },
      "kod": {
        "css": "artykul.css (CE-64, cw-a-mprod)",
        "js": "–"
      },
      "czesci": [
        "nagłówek pasa",
        "pozycje: packshot, nazwa, przycisk, link"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 500
      }
    },
    "CE-65": {
      "nazwa": "Oś faz z akordeonem",
      "grupa": "przelaczniki",
      "rodzina": "dane",
      "skrot": "Pionowa oś numerowanych faz; otwarta faza pokazuje zdjęcie, opis i boksy produktów.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie",
          "packshot"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "akordeon",
          "okno"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "kroki-proces",
          "harmonogram-czas",
          "opis-produktu"
        ],
        "mechanika": [
          "klik",
          "okno",
          "statyczny"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "opis": "Dwie kolumny we własnym, szerszym kontenerze (do 1800 px, marginesy 40 px, odstęp kolumn clamp(3rem, 8vw, 10rem)): po lewej przyklejona głowa sekcji – kicker w ramce i nagłówek – po prawej pionowa oś z numerowanymi węzłami (numery krojem treści) i dużymi tytułami; otwarta pozycja rozwija pod tytułem panel: od 1200 px kadr pozycji (6 : 7) po lewej i kolumna treści po prawej – etykieta, skrót, boksy produktów z packshotem, przypis i przycisk pełnego opisu; poniżej 1200 px kadr 4 : 3 stoi nad treścią.",
      "mechanika": "Akordeon: jedna pozycja otwarta naraz (klik, Enter, spacja), strzałki oraz Home i End przenoszą fokus między tytułami; kadr wchodzi razem z panelem; gdy po zwinięciu pozycji powyżej otwierany tytuł wypada ponad okno, moduł dociąga go do górnej krawędzi; boksy produktów i przycisk otwierają lightboxy. Bez JS wszystkie panele otwarte z kadrami; reduced-motion bez animacji.",
      "baza": {
        "plik": "v7/lab/ce-65-os-faz.html",
        "kotwica": "u-fazy"
      },
      "kod": {
        "css": "ce/CE-65-os-faz.css",
        "js": "ce/CE-65-os-faz.js"
      },
      "czesci": [
        "blok nagłówka z kickerem w ramce (przyklejony)",
        "kadr pozycji w otwartym panelu",
        "oś z numerowanymi węzłami",
        "tytuł pozycji",
        "panel: etykieta, skrót, boksy produktów, przypis, przycisk"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 1100
      }
    },
    "CE-66": {
      "nazwa": "Tablica warunków",
      "grupa": "przelaczniki",
      "rodzina": "zwijane",
      "skrot": "Lista warunków po lewej, po prawej zielone pole priorytetu i jasne pole z produktami.",
      "projekt": null,
      "tagi": {
        "media": [
          "packshot",
          "ikona"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "taby-przelacznik",
          "okno"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "porownanie-wybor",
          "lista-produktow",
          "korzysci-argumenty"
        ],
        "mechanika": [
          "klik",
          "statyczny",
          "okno"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "opis": "Tablica warunków w układzie z ramki Figma: po lewej pionowa lista ośmiu warunków stanowiska z numerowanymi węzłami, po prawej tytuł aktywnego warunku i jeden złożony pas – zielone pole „Priorytet” zrośnięte z jasnym polem, w którym „Nasze produkty” (zdanie z programu i boksy produktów z packshotem) i „Uzupełnienie” stoją obok siebie, rozdzielone włosową linią. Osiem paneli leży w tych samych komórkach siatki co pola i dziedziczy jej tory przez subgrid, więc pas ma stałą wysokość dla każdego warunku, oba pola są równe co do piksela, a etykiety wszystkich warunków leżą w tym samym miejscu. Szeroki kontener (c5-wrap--wide), kicker w ramce, bez leadu. Warstwa wyglądu z 20.09.2026 (ramki Figma „Frame 285-2289” – lista, i „Frame 285-2334” – pas; trzy uwagi Mateusza „Zrób to, aby bardziej wyglądało jak w projekcie”): pole „Priorytet” w zieleni #4CA039 zamiast czerni, oba pola z promieniem 20 px, aktywny węzeł listy to zielony obrys z zielonymi cyframi zamiast czarnego kwadratu z białymi (promień 6 px), kwadracik przed każdą etykietą w zieleni marki #71C35F, etykieta na zieleni pełną bielą zamiast krycia .62, boks produktu z promieniem 10 px. Wszystko na pokrętłach --c5-cb-prio-bg / --c5-cb-lite-bg / --c5-cb-accent / --c5-cb-mark / --c5-cb-r / --c5-cb-node-r / --c5-cb-prod-r w module wspólnym – CE ma jedno wystąpienie, więc nie potrzebuje nadpisań strony. ⚠️ Kontrast: biel na #4CA039 to 3,3 : 1, a zdanie „Priorytet” ma 21 px wagi zwykłej (próg AA 4,5 : 1); wartość jest prosto z ramki, świadomie, wycofanie to jedna linia (#3F862F daje 4,5 : 1). Pasek chipów poniżej 900 px zostaje przy ciemnym chipie – ramki opisują wyłącznie listę desktopową. Wielkości, miary, tory siatki, ruch i krój bez zmian.",
      "mechanika": "Zakładki z aktywacją automatyczną: klik w pozycję listy, ↑ ↓ Home End z zawinięciem i roving tabindex, na telefonie przesunięcie palcem po pasie (próg 40 px, blokada kliknięcia, żeby przesunięcie nie otwierało popupu produktu). Przy zmianie tytuł wjeżdża zza maski, a treści pól wchodzą kaskadą co 70 ms – etykiety nigdy. Od 900 do 1199 px pas dzieli się 45 : 55, a jasne pole układa swoje dwie kolumny jedna pod drugą; poniżej 900 px lista jest poziomym przewijanym rzędem dosuwanym przez scrollLeft; bez JS zostaje osiem jasnych kart z numerem, przy reduced motion przełączanie jest natychmiastowe. Bez licznika, strzałek i autoprzełączania.",
      "baza": {
        "plik": "v7/kukurydza.html",
        "kotwica": "u-stanowisko"
      },
      "kod": {
        "css": "ce/CE-66-tablica-warunkow.css",
        "js": "ce/CE-66-tablica-warunkow.js"
      },
      "czesci": [
        "głowa sekcji: kicker w ramce, h2",
        "pionowa lista ośmiu warunków z numerowanymi węzłami",
        "tytuł aktywnego warunku",
        "ciemne pole „Priorytet”",
        "jasne pole: „Nasze produkty” (zdanie i boksy produktów) oraz „Uzupełnienie”"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 1100
      }
    },
    "CE-67": {
      "nazwa": "Karty z przyklejonym kadrem",
      "grupa": "karty",
      "rodzina": "obraz-tekst",
      "skrot": "Siatka 4–6 kart z numerem lub ikoną obok wysokiego, przyklejonego kadru z przyciskiem.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie",
          "ikona"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "korzysci-argumenty",
          "cta"
        ],
        "mechanika": [
          "przewijanie",
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "opis": "Szeroka sekcja o dwóch kolumnach: po lewej głowa (kicker w ramce, h2, krótki lead), nagłówek h3 i siatka sześciu kart 2 × 3, każda z numerem w węźle i jednym zdaniem; po prawej kadr z przyciskiem leżącym u jego dołu. Karty czyta się po kolei, a kadr trzyma temat na oku przez cały czas czytania. Na CARBOHUMIC („Jaka gleba”, od 02.10.2026) cztery karty 2 × 2 z ikoną w ramce i tytułem zamiast numeru w węźle, bez nagłówka h3 nad siatką; w kadrze placeholder i przycisk doradcy. Ten sam układ czterech kart z ikoną na Borówce („Masz już plantację”, od 02.10.2026): w kadrze zdjęcie młodej plantacji ze ściółką, przycisk otwiera kartę zastosowania CARBOMAT ECO Ściółka.",
      "mechanika": "Kadr jest przyklejony 20 px od górnej, dolnej i prawej krawędzi okna (uwaga Mateusza z 19.09.2026; prawa krawędź wychodzi 20 px w margines kontenera, lewa kolumna trzyma 40 px), więc stoi nieruchomo, gdy karty przewijają się obok, a odjeżdża z końcem sekcji; przycisk na kadrze leży w stanie przyklejonym 96 px nad jego dołem, ponad dokiem doradcy; karty wchodzą kaskadą co 60 ms revealem strony. Poniżej 900 px kolumny znikają i porządek jest jeden: głowa, kadr 4 : 3 z przyciskiem, h3, karty (jedna kolumna, dwie od 640 px), bez przyklejania. Bez JS-u.",
      "baza": {
        "plik": "v7/kukurydza.html",
        "kotwica": "u-decyzje"
      },
      "kod": {
        "css": "ce/CE-67-karty-z-kadrem.css",
        "js": ""
      },
      "czesci": [
        "głowa: kicker w ramce, h2, lead (opcjonalny)",
        "nagłówek h3 siatki (opcjonalny)",
        "siatka kart: sześć z numerem w węźle albo cztery z ikoną i tytułem",
        "kadr przyklejony",
        "przycisk na kadrze"
      ],
      "warianty": {
        "ikony": "cztery karty 2 × 2 z ikoną w ramce i tytułem zamiast numeru w węźle, bez nagłówka h3 nad siatką (siatka schodzi do dolnej linii kadru); klasa c5-kk--ikony na korzeniu"
      },
      "zrzuty_wariantow": {
        "ikony": {
          "plik": "v7/borowka.html",
          "kotwica": "b-sciolka"
        }
      },
      "zrzut": {
        "maxh": 1100
      }
    },
    "CE-68": {
      "nazwa": "Akordeon faz z panelem",
      "grupa": "przelaczniki",
      "rodzina": "zwijane",
      "skrot": "Lista numerowanych wierszy; otwarty wiersz to jasny panel ze zdjęciem, opisem i produktami.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie",
          "packshot"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "akordeon"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "kroki-proces",
          "harmonogram-czas",
          "opis-produktu"
        ],
        "mechanika": [
          "klik"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "opis": "Szeroka sekcja (kontener do 1800 px, marginesy 40 px) z jedną linią kolumny w połowie kontenera: w głowie kicker w ramce po lewej i nagłówek od połowy; niżej lista wierszy na całą szerokość – numer w węźle 20 px od lewej krawędzi, tekst wiersza 15 px od połowy kontenera, linia 1 px nad każdym zamkniętym wierszem (72 px). Otwarta pozycja jest jasnym panelem na całą szerokość kontenera: jej wiersz to pierwsza linia panelu, w prawej kolumnie tytuł 24 px, opis, boksy produktów jeden pod drugim (każdy na szerokość swojej treści), szara nota i przycisk na szerokość kolumny; w lewym dolnym rogu panelu kadr pozycji 7 : 5, 20 px od lewej i dolnej krawędzi. Poniżej 900 px jedna kolumna: kadr, tytuł, opis, boksy, nota, przycisk.",
      "mechanika": "Akordeon: jedna pozycja otwarta naraz, domyślnie pierwsza (klik, Enter, spacja; ponowny klik zwija), strzałki oraz Home i End przenoszą fokus między wierszami. Zamknięty wiersz pokazuje tytuł pozycji, otwarty – jej etykietę, a tytuł schodzi do panelu; przełącza to CSS po aria-expanded, nazwa dostępna przycisku jest stała („NN tytuł”). Wysokość panelu .35 s, kadr wchodzi krótkim zanikiem; gdy po zwinięciu pozycji powyżej otwierany wiersz wypada ponad okno, moduł dociąga go pod nagłówek serwisu. Od 900 px przycisk zawsze stoi w dolnej strefie panelu obok kadru (52 px i 20 px nad krawędzią) – także w pozycji bez produktów, gdzie kadr jest wyższy niż tekst. Boksy produktów i przycisk otwierają lightboxy. Bez JS wszystkie panele otwarte z kadrami; reduced-motion bez animacji.",
      "baza": {
        "plik": "v7/kukurydza.html",
        "kotwica": "u-fazy"
      },
      "kod": {
        "css": "ce/CE-68-akordeon-faz.css",
        "js": "ce/CE-68-akordeon-faz.js"
      },
      "czesci": [
        "głowa: kicker w ramce po lewej, nagłówek od połowy kontenera",
        "wiersz: numer w węźle + tekst od połowy kontenera",
        "panel otwartej pozycji na całą szerokość kontenera",
        "kadr 7 : 5 w lewym dolnym rogu panelu",
        "kolumna treści: tytuł, opis, boksy produktów w pionie, nota, przycisk na szerokość kolumny"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 1100,
        "przewin": "#u-fazy .c5-fa__list"
      }
    },
    "CE-69": {
      "nazwa": "Wstęp sekcji z kadrem i kaflami",
      "grupa": "otwarcie",
      "rodzina": "otwarcie",
      "skrot": "Wstęp z dużym nagłówkiem i opisem, kadrem zdjęcia, dwoma kaflami i szerokim boksem produktu.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie",
          "ikona",
          "packshot"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "otwarcie-strony",
          "korzysci-argumenty",
          "opis-produktu"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "jednorazowy"
        ]
      },
      "opis": "Szeroka sekcja (kontener do 1800 px, marginesy 40 px): u góry dwie równe kolumny – po lewej kicker, duży nagłówek i przygaszony akapit opisu wyrównane do góry, po prawej wysoki kadr zdjęcia 12 : 13 z podpisem; pod spodem rząd 1fr 1fr 2fr: dwa wysokie kafle na jasnoszarym tle (ikona u góry, tytuł i zdanie przy dolnej krawędzi) i szeroki boks produktu w ramce (packshot, nazwa, lista cech, dwa przyciski na całą szerokość boksu w proporcji 3 : 2).",
      "mechanika": "Jednorazowe wejście z szyny (data-reveal, stagger 80 ms); od 1100 px w dół kafle w dwóch kolumnach i boks produktu przez całą szerokość, poniżej 900 px jedna kolumna z kadrem 4 : 3, poniżej 600 px packshot nad tekstem. Bez JS i przy reduced-motion wszystko widoczne od razu.",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "o-programie"
      },
      "kod": {
        "css": "ce/CE-69-wstep-z-kadrem.css",
        "js": "brak (reveal z ce/00-base.js)"
      },
      "czesci": [
        "kicker + nagłówek + akapit opisu",
        "kadr zdjęcia",
        "2 kafle: ikona, tytuł, zdanie",
        "boks produktu: packshot, nazwa, cechy, dwa przyciski"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 1300
      }
    },
    "CE-70": {
      "nazwa": "Scena slajdów na tle wideo",
      "grupa": "sceny",
      "rodzina": "sceny",
      "skrot": "Przypięta scena z wideo w tle; przy przewijaniu wymieniają się jasne karty slajdów.",
      "projekt": null,
      "tagi": {
        "media": [
          "wideo",
          "schemat-wykres"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "przewijanie"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "kroki-proces",
          "korzysci-argumenty",
          "otwarcie-strony"
        ],
        "mechanika": [
          "przewijanie",
          "ruch-wlasny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "opis": "Scena przyklejona 100svh w wysokim torze: w tle zapętlone wideo na całą szerokość okna z jednolitym scrimem; pierwszy ekran to kicker i nagłówek sekcji wyśrodkowane na wideo; potem przy lewej krawędzi, w połowie wysokości, spis slajdów (numer w węźle i tytuł, bieżący podświetlony), a na środku jasna karta slajdu: kwadratowy ciemny boks ilustracji po lewej, tytuł i opis po prawej.",
      "mechanika": "Pozycja przewijania steruje sceną: tor = scena + (N + 1) × 110 svh. Nagłówek stoi na środku, przy przewijaniu wyjeżdża do góry równocześnie z wjazdem karty 01 od dołu; dalej karty wymieniają się tym samym ruchem, ostatnia stoi do odpięcia sceny. Spis slajdów jest ukryty i poza fokusem, dopóki stoi nagłówek; klik w pozycję przewija do slajdu, poniżej 1300 px spis pokazuje same numery. Tylko motionOn; poniżej 900 px, przy reduced-motion i bez JS plakat jest kadrem z nagłówkiem, karty stoją pod nim. Wideo: autoplay, muted, loop, playsinline, poster, pauza poza widokiem.",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "zalozenia"
      },
      "kod": {
        "css": "ce/CE-70-scena-slajdow.css",
        "js": "ce/CE-70-scena-slajdow.js"
      },
      "czesci": [
        "nagłówek sekcji na wideo (pierwszy ekran)",
        "tło wideo ze scrimem",
        "spis slajdów",
        "N kart slajdów: boks ilustracji, tytuł, opis"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 900,
        "ruch": true,
        "przewin": "#zalozenia [data-vs-shot]",
        "czekaj": 900
      }
    },
    "CE-71": {
      "nazwa": "Pas wejść sytuacyjnych",
      "grupa": "karty",
      "rodzina": "wspolne",
      "skrot": "Pas 7 komórek-wejść z numerem, strzałką i etykietą, ostatnia ciemna z telefonem.",
      "projekt": null,
      "tagi": {
        "media": [
          "ikona"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "okno"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "nawigacja",
          "cta"
        ],
        "mechanika": [
          "klik",
          "statyczny"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "opis": "Pas komórek tuż pod hero, na całą szerokość szerokiego kontenera, rozdzielonych liniami włosowymi, wysokość ok. 112 px. Pierwsza, wąska komórka to nadpis sekcji wersalikami („Co uprawiasz?”), dalej idzie siedem wejść. Komórka: numer w kwadratowym węźle 24 px i strzałka w jednym wierszu u góry, przy dolnej krawędzi etykieta 18 px semibold i przygaszony podpis 13 px, dla którego komórka zawsze rezerwuje dwa wiersze – dzięki temu etykiety wszystkich komórek stoją na jednej linii. Pięć komórek to zwykłe linki, szósta otwiera panel z listą linków, siódma jest ciemna i w całości jest numerem telefonu. Sprite nie ma symboli upraw, więc zamiast siedmiu przybliżonych ikon każda komórka niesie numer – jedna konwencja dla całego pasa.",
      "mechanika": "Czysty CSS, zero JS-u w części krytycznej. Linie włosowe to 1 px odstępu siatki: tło rysuje je w przerwach, komórki zasłaniają resztę, a ta sama reguła obsługuje oba układy. Hover i :focus-visible dają tło o ton ciemniejsze i przesuwają strzałkę o 4 px. Komórka „Mam już produkt” to przycisk z popovertarget i natywny [popover] z wejściem przez @starting-style; js/10-hero.js ustawia panel pod kaflem (position:fixed, korekta przy przewijaniu i zmianie rozmiaru), a gdy przeglądarka nie zna popovera, @supports not selector(:popover-open) zamienia listę w zwykły blok pod pasem i pięć linków zostaje dostępnych bez skryptu. Wejście: komórki kaskadą revealem strony (data-reveal). Poniżej 900 px siatka 2 × 3 z nadpisem nad nią i komórką telefonu na całą szerokość; trzy rzędy kafli mają równą wysokość (tory fr), zero przewijania w bok.",
      "baza": {
        "plik": "v7/home.html",
        "kotwica": "sytuacje"
      },
      "kod": {
        "css": "ce/CE-71-pas-wejsc.css",
        "js": "brak (popover natywny; pozycjonowanie panelu w home.js)"
      },
      "czesci": [
        "komórka-etykieta z nadpisem sekcji",
        "komórka wejścia: numer w węźle, strzałka, etykieta, podpis",
        "komórka z popoverem i listą linków",
        "ciemna komórka z numerem telefonu"
      ],
      "warianty": {},
      "zrzut": {
        "strona": "v7/home.html",
        "kotwica": "sytuacje",
        "maxh": 260,
        "przewin": "#sytuacje"
      }
    },
    "CE-72": {
      "nazwa": "Scena profilu gleby",
      "grupa": "sceny",
      "rodzina": "sceny",
      "skrot": "Przypięta scena: po lewej indeks problemów i szczegół kroku, po prawej schemat przekroju gleby.",
      "projekt": null,
      "tagi": {
        "media": [
          "schemat-wykres"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "przewijanie"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "kroki-proces",
          "korzysci-argumenty",
          "opis-produktu"
        ],
        "mechanika": [
          "przewijanie"
        ],
        "zakres": [
          "jednorazowy"
        ]
      },
      "opis": "Przypięta scena o dwóch kolumnach w szerokim kontenerze (5 / 7). Lewa kolumna: u góry głowa sekcji (kicker w ramce, h2, lead), pod nią indeks pięciu tytułów problemów – wszystkie widoczne, aktywny wyróżniony wypełnionym węzłem z numerem, pozostałe przygaszone – a przy dolnej krawędzi okna szczegół bieżącego kroku: tytuł, linia postępu kroku, zdanie problemu, etykieta „Co z tym robimy” ze zdaniem odpowiedzi, link i licznik „02/05”. Po kroku piątym wchodzi krok szósty, bez numeru w indeksie, z przyciskiem zamiast linku. Prawa kolumna: jasnoszary panel na wysokość okna z marginesem 20 px, a w nim ręcznie napisany inline SVG – rysunek techniczny przekroju gleby w skali szarości (miarka głębokości 0–40 cm ze znacznikiem postępu sceny, poziom próchniczny, podglebie z kreskowaniem, kamienie, spękania, gruzełki lignitu, krople wody, korzenie, punkty życia mikrobiologicznego, kwadraciki składników, skala odczynu z trzema strefami) oraz drobny podpis „Schemat poglądowy”. Cały SVG jest aria-hidden – każde jego słowo stoi w treści po lewej.",
      "mechanika": "Tor sekcji = scena 100svh plus sześć kroków po 0,7 × 100svh (pokrętła --sp-step-vh i --sp-step-min), scena position:sticky;top:0; krok wybiera pozycja przewijania liczona z szyny CX5. Stan rysunku jest kumulatywny: klasy is-s1…is-s6 dokładają się na korzeniu sekcji, więc każda naprawa zostaje na kolejnych krokach, a naprawa bieżącego kroku wchodzi dopiero kawałek w krok (próg z histerezą), żeby czytelnik zobaczył najpierw problem, a potem jego naprawę. Przejścia 600–900 ms cubic-bezier(.16,1,.3,1), kaskady po --d; pętle (spadające krople, dryf punktów życia, wędrówka składników) stoją, gdy scena jest poza oknem (IntersectionObserver) i przy reduced-motion. --sp-p to postęp całej sceny (znacznik na miarce), --sp-f postęp kroku (wypełnienie linii). Klik w pozycję indeksu przewija do swojego kroku przez CX5.scrollTo (Lenis, gdy działa); Tab przechodzi przez indeks i link kroku i wyprowadza dalej, bo nieaktywne kroki są visibility:hidden. O układzie decyduje jedna klasa, którą moduł stawia na korzeniu: is-scene (przypięta scena), is-tabs (poniżej 900 px albo w oknie za niskim, żeby treść utrzymała 96 px odstępu od doka doradcy: indeks staje się zawijanym tablistem chipów ze strzałkami i roving tabindex, pod nim SVG, pod nim panel wybranego kroku, a krok końcowy zostaje na dole), is-flat (reduced-motion: bez pinu, wszystkie kroki jeden pod drugim, rysunek w stanie końcowym). Bez JS-u nie ma żadnej z tych klas, a stanem domyślnym każdej reguły rysunku jest stan końcowy, więc strona bez skryptu jest kompletna. Pomocniczy parametr adresu ?sp=1…6 otwiera stronę na wskazanym kroku.",
      "baza": {
        "plik": "v7/home.html",
        "kotwica": "gleba"
      },
      "kod": {
        "css": "ce/CE-72-scena-profilu-gleby.css",
        "js": "ce/CE-72-scena-profilu-gleby.js"
      },
      "czesci": [
        "głowa sceny: kicker w ramce, h2, lead",
        "indeks pięciu tytułów z węzłami numerów",
        "szczegół kroku: tytuł, linia postępu, problem, „Co z tym robimy”, link, licznik",
        "krok końcowy z przyciskiem",
        "panel ilustracji z inline SVG przekroju gleby",
        "podpis „Schemat poglądowy”"
      ],
      "warianty": {},
      "zrzut": {
        "strona": "v7/home.html",
        "kotwica": "gleba",
        "maxh": 900,
        "ruch": true,
        "przewin": "#gleba"
      }
    },
    "CE-73": {
      "nazwa": "Oś kroków z horyzontem efektu",
      "grupa": "dane",
      "rodzina": "dane",
      "skrot": "Pozioma oś 4 kroków z węzłami, a pod nią oś czasu z dwoma odcinkami efektu.",
      "projekt": null,
      "tagi": {
        "media": [
          "schemat-wykres"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "kroki-proces",
          "harmonogram-czas"
        ],
        "mechanika": [
          "przewijanie",
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "skroty_wariantow": {
        "sama-os": "Sama oś z wypełnieniem do bieżącego kroku, bez horyzontu."
      },
      "opis": "Szeroka sekcja (kontener do 1800 px, marginesy 40 px) złożona z dwóch części pod wspólną głową. U góry oś procesu: cztery kolumny pod jedną poziomą linią 1 px, na linii kwadratowe węzły 30 px z numerami 01–04, pod każdym węzłem tytuł kroku i jedno zdanie. Niżej, oddzielony dużym odstępem, horyzont efektu: nadpis, wspólna oś czasu z dwoma odcinkami w proporcji 1 : 4 (nad paskiem etykieta okresu, pod paskiem znacznik czasu i treść), pierwszy pasek ciemny, drugi w średniej szarości; pod osią dopisek i link. Pasek ma 12 px wysokości i obrys 1 px.",
      "mechanika": "Linia osi wypełnia się od lewej (scaleX) wraz z przejściem sekcji przez okno: postęp 0 przy 80 % wysokości okna, 1 przy 35 %; węzeł zapala się (ciemne wypełnienie, jasna cyfra), gdy wypełnienie do niego dochodzi – moduł mierzy położenie każdego węzła na linii. Kolumny wchodzą kaskadą revealem strony. Odcinki horyzontu wypełniają się od lewej po wejściu w widok (600 ms i 900 ms). Mechanika scrollowa tylko za CX5.motionOn(); bez JS, poniżej 900 px i przy reduced-motion linia jest pełna, wszystkie węzły zapalone, a paski w stanie końcowym. Poniżej 900 px oś staje pionowo: węzły po lewej, linia wypełnia się w pionie, horyzont rozpada się na dwa wiersze z własnymi paskami, których szerokość trzyma proporcję 1 : 4.",
      "baza": {
        "plik": "v7/home.html",
        "kotwica": "jak-pomagamy"
      },
      "kod": {
        "css": "ce/CE-73-os-krokow.css + wariant sama-os w tym samym pliku (c5-st--sama-os)",
        "js": "ce/CE-73-os-krokow.js"
      },
      "czesci": [
        "głowa sekcji: kicker w ramce, h2, lead",
        "oś: linia z wypełnieniem + cztery węzły z numerami",
        "kolumna kroku: tytuł i zdanie",
        "horyzont: nadpis, dwa odcinki 1 : 4 z etykietami i znacznikami czasu",
        "dopisek i link pod osią czasu"
      ],
      "warianty": {
        "sama-os": "sama oś bez horyzontu (klasa c5-st--sama-os; potwierdzenie-b2b.html#stan): pięć węzłów, linia wypełniona na stałe do bieżącego kroku, pod węzłem nazwa i data; bez sterowania przewijaniem"
      },
      "zrzut": {
        "strona": "v7/home.html",
        "kotwica": "jak-pomagamy",
        "maxh": 900
      },
      "zrzuty_wariantow": {
        "sama-os": {
          "plik": "v7/potwierdzenie-b2b.html",
          "kotwica": "stan",
          "maxh": 300
        }
      }
    },
    "CE-74": {
      "nazwa": "Taby potrzeb z kartami produktów",
      "grupa": "przelaczniki",
      "rodzina": "zwijane",
      "skrot": "Przełącznik 3 potrzeb; panel z opisem, zdjęciem i trzema kartami produktów.",
      "projekt": null,
      "tagi": {
        "media": [
          "packshot",
          "zdjecie"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "taby-przelacznik"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "porownanie-wybor",
          "lista-produktow"
        ],
        "mechanika": [
          "klik"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "opis": "Szeroka sekcja (kontener do 1800 px, marginesy 40 px): głowa po lewej, pod leadem przełącznik segmentowy z trzema pozycjami – w każdej etykieta potrzeby, a pod nią mniejszym drukiem rodzaj produktu. Panel pozycji to siatka 4 / 8: po lewej nagłówek h3 powtarzający etykietę, opis potrzeby i kadr zdjęcia 4 : 3 „z terenu” przy dolnej krawędzi kolumny, po prawej trzy karty produktu w rzędzie. Karta: pole packshotu 4 : 5 na jasnoszarym tle z linią podłogi na 82 % wysokości (packshot stoi na linii), nazwa, rząd chipów postaci i sposobu aplikacji, jedno zdanie, a przy dolnej krawędzi – nad cienką linią – link „Poznaj produkt” ze strzałką i cichy link do sklepu. Wariant szerokiej karty: jeden produkt zajmuje cały rząd, packshot po lewej, po prawej nazwa, chipy, zdanie, trzy fakty jako lista z liniami i dwa przyciski. Pod tabami rząd linków: przycisk drugorzędny i dwa linki ze strzałką.",
      "mechanika": "Taby wg wzorca ARIA z automatyczną aktywacją: klik, strzałki w obie osie, Home i End, roving tabindex; znacznik aktywnej pozycji przesuwa się i zmienia rozmiar (transform), a etykiety leżą nad nim w trybie „difference”, więc odwracają kolor dokładnie pod znacznikiem. Przejście: stary panel gaśnie (160 ms) i odjeżdża w stronę przeciwną do wyboru, nowy wchodzi – kolumna opisu, potem karty kaskadą co 70 ms, packshoty podnoszą się o 24 px znad linii podłogi; wysokość kontenera paneli przechodzi płynnie, więc treść pod sekcją nie skacze. Deep linki na id paneli przez CX5.onHash (start, load, Back i Forward). Wszystkie panele zostają w DOM: bez JS przełącznik się nie pokazuje, a panele stoją jeden pod drugim, każdy ze swoim nagłówkiem. Między 900 a 1199 px opis i kadr stają obok siebie w pasie nad kartami; poniżej 900 px przełącznik ma trzy równe kolumny z etykietą łamaną na dwa wiersze, panel jest jedną kolumną (opis, karty jedna pod drugą z niższym polem packshotu 16 : 10, kadr z terenu na końcu).",
      "baza": {
        "plik": "v7/home.html",
        "kotwica": "produkty"
      },
      "kod": {
        "css": "ce/CE-74-taby-potrzeb.css",
        "js": "ce/CE-74-taby-potrzeb.js"
      },
      "czesci": [
        "głowa sekcji: kicker w ramce, h2, lead",
        "przełącznik segmentowy: etykieta potrzeby + rodzaj produktu pod nią",
        "kolumna opisu: h3, akapit, kadr 4 : 3 z terenu",
        "karta produktu: pole packshotu z linią podłogi, nazwa, chipy, zdanie, linki",
        "szeroka karta jednego produktu: packshot, nazwa, chipy, zdanie, lista faktów, dwa przyciski",
        "rząd linków pod tabami"
      ],
      "warianty": {},
      "zrzut": {
        "strona": "v7/home.html",
        "kotwica": "produkty",
        "maxh": 1100
      }
    },
    "CE-75": {
      "nazwa": "Zajawka programu z osią kamieni",
      "grupa": "karty",
      "rodzina": "obraz-tekst",
      "skrot": "Zajawka programu: tekst, liczby i przyciski obok zdjęcia z kartą osi pięciu kamieni.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie",
          "schemat-wykres"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "otwarcie-strony",
          "harmonogram-czas",
          "liczby-dane"
        ],
        "mechanika": [
          "statyczny",
          "przewijanie",
          "ruch-wlasny"
        ],
        "zakres": [
          "jednorazowy"
        ]
      },
      "opis": "Szeroka sekcja o dwóch kolumnach 5 / 7 (kontener do 1800 px, marginesy 40 px). Po lewej cały program: chip przerywany z opisem logo, pasek stanu między dwiema kreskami z kwadratowym znacznikiem „na żywo”, nagłówek h2, lead, zdanie-zasada wyróżnione grubą kreską po lewej, dwie liczby z jednostką i podpisem, linia koordynacji naukowej z notą o niezależności eksperta drobnym drukiem i dwa przyciski. Po prawej wysoki kadr 4 : 5, a na jego dolnej krawędzi jasna karta z poziomą osią pięciu kamieni: daty nad linią, opisy pod linią, punkt bieżący z większym węzłem i ciemną plakietką. Karta jest wsunięta 20 px od prawej i dolnej krawędzi kadru, a w lewo sięga poza jego krawędź, więc widać pasek zdjęcia, który mówi, co leży na czym.",
      "mechanika": "Kadr ma lekki parallaks z szyny: warstwa zdjęcia jest wyższa od ramki, przesuw biegnie od −6 do 0 procent jej wysokości i istnieje tylko przy CX5.motionOn(). Odcinek osi do punktu bieżącego jest ciemny i dorysowuje się od lewej w 0,9 s, gdy oś pierwszy raz wchodzi w okno; węzły wchodzą kaskadą wspólnym revealem, dalsza część osi zostaje jasna i przerywana. Znacznik „na żywo” w pasku stanu i węzeł punktu bieżącego pulsują kwadratowym pierścieniem. Wysokość kadru prowadzi pierwszy wiersz siatki, dzięki czemu karta trzyma się dolnej krawędzi kadru także wtedy, gdy kolumna treści jest wyższa. Poniżej 900 px kolejność zmienia wyłącznie kadr (4 : 3, na górze) – karta zostaje za treścią, żeby oś nie wyprzedzała programu w czytaniu; oś staje pionowo: linia po lewej, węzły jeden pod drugim, odcinek przebyty ciągły i ciemny, dalszy przerywany. Bez JS-u i przy reduced-motion wszystko stoi narysowane: kadr bez parallaksu, oś z ciemnym odcinkiem, bez pulsu.",
      "baza": {
        "plik": "v7/home.html",
        "kotwica": "prochnica-plus"
      },
      "kod": {
        "css": "ce/CE-75-zajawka-programu.css",
        "js": "ce/CE-75-zajawka-programu.js"
      },
      "czesci": [
        "chip przerywany z opisem logo programu",
        "pasek stanu ze znacznikiem „na żywo”",
        "nagłówek h2 i lead",
        "zdanie-zasada na grubej kresce",
        "dwie liczby z jednostką i podpisem",
        "linia koordynacji naukowej z notą o niezależności",
        "dwa przyciski",
        "wysoki kadr 4 : 5 z parallaksem",
        "karta z osią pięciu kamieni i plakietką punktu bieżącego"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 1100
      }
    },
    "CE-76": {
      "nazwa": "Szybki podgląd produktu",
      "grupa": "nakladki",
      "rodzina": "okna",
      "skrot": "Okno szybkiego podglądu produktu: makieta opakowania, cena i wybór odmiany, opakowania, ilości.",
      "projekt": null,
      "tagi": {
        "media": [
          "packshot"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "okno"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "sklep-transakcja",
          "opis-produktu"
        ],
        "mechanika": [
          "okno",
          "klik",
          "formularz"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "opis": "Okno ze skrótem karty produktu, otwierane przyciskami „dodaj do koszyka” w całym sklepie. Od 900 px panel do 1040 px w dwóch kolumnach 11 : 10: po lewej kwadratowy kadr z makietą wybranego opakowania na jasnoszarym tle (dwie makiety przy zestawie, pole zastępcze przy produktach partnerów), przyklejony, gdy formularz przewija się w panelu; po prawej meta, nazwa (H2), cena z obniżką i najniższą ceną z 30 dni, jedno–dwa zdania opisu, link „Zobacz pełną kartę produktu”, przełącznik odmiany (pH), opakowania z cenami, frakcja z podpowiedzią, liczba opakowań, suma, „Dodaj do koszyka” z „Anuluj” i zdanie o wysyłce. Poniżej 900 px jedna kolumna z niskim paskiem makiety nad treścią, poniżej 600 px arkusz przy dolnej krawędzi ekranu. Po dodaniu okno przechodzi w stan „Dodano do koszyka”: miniatura, nazwa, opakowanie × liczba i wartość, stan koszyka, „Przejdź do koszyka” i „Kontynuuj zakupy”.",
      "mechanika": "Otwiera je każdy element data-cw-open wewnątrz hosta data-cw-product (delegacja kliknięć; data-cw-pack wybiera opakowanie na start) albo CWSklep.open(). Okno powstaje w skrypcie przy pierwszym otwarciu i jest dopinane na końcu body. Fokus na wybranym opakowaniu, pułapka fokusu, Escape, klik w tło i „Anuluj” zamykają, fokus wraca na przycisk, który je otworzył; przewijanie strony zablokowane (cws-lock). Przełącznik odmiany przerysowuje okno w miejscu, gdy druga odmiana ma hosta na stronie (zachowuje opakowanie, liczbę i frakcję), inaczej jest linkiem do jej karty z kotwicą opakowania. Zmiana opakowania podmienia makietę, cenę i kotwicę linku do pełnej karty, suma liczy się na bieżąco; link do pełnej karty znika, gdy karta jest bieżącą stroną. „Dodaj do koszyka” zapisuje pozycję (sessionStorage cw_cart_items), odświeża licznik w nagłówku i wysyła zdarzenie cw:cart.",
      "baza": {
        "plik": "v7/sklep-wspolne.js",
        "kotwica": "szybki-podglad"
      },
      "kod": {
        "css": "sklep-wspolne.css (cws-dlg, cws-qv, cws-packs, cws-qty, cws-price, cws-btn)",
        "js": "sklep-wspolne.js (build, open, renderForm, renderAdded, close; API window.CWSklep)"
      },
      "czesci": [
        "nakładka z przyciemnieniem",
        "panel z przyciskiem zamknięcia",
        "kadr z makietą wybranego opakowania",
        "meta, nazwa i cena z obniżką",
        "opis i link do pełnej karty",
        "przełącznik odmiany (pH)",
        "opakowania z cenami",
        "frakcja z podpowiedzią",
        "liczba opakowań i suma",
        "„Dodaj do koszyka”, „Anuluj” i zdanie o wysyłce",
        "stan „Dodano do koszyka”"
      ],
      "warianty": {},
      "zrzut": {
        "strona": "v7/sklep.html",
        "klik": ".c5sk-card[data-sort-nazwa=\"CARBOMAT ECO pH 6,0–6,5\"] [data-cw-open]",
        "maxh": 800
      }
    },
    "CE-77": {
      "nazwa": "Pasek tytułowy",
      "grupa": "otwarcie",
      "rodzina": "otwarcie",
      "skrot": "Niski pasek otwarcia: okruszki i H1 po lewej, wyszukiwarka z podpowiedziami po prawej.",
      "projekt": null,
      "tagi": {
        "media": [
          "ikona"
        ],
        "tekst": [
          "tylko-naglowek"
        ],
        "ukryte": [
          "okno"
        ],
        "pozycje": [
          "1"
        ],
        "nadaje": [
          "otwarcie-strony",
          "nawigacja"
        ],
        "mechanika": [
          "formularz",
          "ruch-wlasny"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "skroty_wariantow": {
        "z-licznikiem": "Okruszki, duży H1 „Koszyk” i obok liczba opakowań, bez wyszukiwarki.",
        "z-akcja": "H1 z metą albo chipem stanu i rzędem akcji po prawej."
      },
      "opis": "Niski pasek otwierający stronę sklepu zamiast hero, w szerokim kontenerze (EL-29) z linią pod spodem: po lewej okruszki i pod nimi H1 w osobnym wierszu (1,35–1,75 rem), po prawej narzędzie strony – w wersji bazowej wyszukiwarka produktów: pole 48 px (do 520 px od 900 px) z ikoną lupy i animowanym placeholderem oraz panel podpowiedzi pod polem. Wysokość wg treści (ok. 90 px), żeby pierwsza karta listy stała jak najwyżej.",
      "mechanika": "Wyszukiwarka szuka tylko produktów sklepu. Placeholder „Szukaj: ” dopisuje i kasuje frazy po literze z migającym kursorem, staje przy fokusie i przy wpisanym tekście, przy reduced-motion zostaje stały tekst; nazwa dostępna pola jest stała. Od dwóch znaków panel podpowiedzi (niemodalny popup comboboxa): do sześciu produktów z miniaturą 56 px, nazwą z wyróżnioną frazą, meta i ceną „od …”; klik prowadzi do karty produktu, „+” otwiera szybki podgląd (CE-76). W zawężonym widoku wiersz o dopasowaniach poza bieżącym widokiem z przyciskiem „Szukaj w całym sklepie”; bez wyników zdanie i „Zapytaj wirtualnego asystenta”. Wpisywanie nie przestawia siatki – dopiero Enter albo stopka „Pokaż wszystkie wyniki (N)” nakłada frazę na listę (chip filtra w CE-78) i przewija do listy. Strzałka w dół przenosi do panelu, strzałki poruszają po pozycjach, Escape zamyka i wraca do pola (aria-expanded, aria-controls). Poniżej 700 px okruszki znikają, a pole zajmuje całą szerokość.",
      "baza": {
        "plik": "v7/sklep.html",
        "kotwica": "hero"
      },
      "kod": {
        "css": "sklep.html <style> bloki „2. PASEK TYTUŁOWY” i wyszukiwarka (c5sk-topbar, c5sk-search, c5sk-suggest); wariant z-licznikiem: koszyk.css (c5ks-top) + wariant z-akcja: ce/CE-77-pasek-tytulowy.css (c5-titlebar)",
        "js": "sklep.html <script> (wyszukiwarka, placeholder, podpowiedzi); wariant z-licznikiem: koszyk.js (licznik opakowań)"
      },
      "czesci": [
        "okruszki",
        "H1",
        "wyszukiwarka z animowanym placeholderem",
        "panel podpowiedzi: produkty z miniaturą i „+”, stopka „Pokaż wszystkie wyniki”",
        "liczba opakowań obok H1 (wariant z-licznikiem)",
        "wariant z-akcja – strefa lewa: okruszki albo link powrotu, wiersz H1 (c5-titlebar__l, c5-titlebar__back, c5-titlebar__head, c5-titlebar__h1)",
        "wariant z-akcja – zdanie meta albo chip stanu obok H1 (c5-titlebar__meta)",
        "wariant z-akcja – rząd akcji po prawej: przycisk, segment albo pole z etykietą (c5-titlebar__acts, c5-titlebar__field)"
      ],
      "warianty": {
        "z-licznikiem": "koszyk (koszyk.html#naglowek, od 28.09.2026): okruszki, pod nimi H1 „Koszyk” większym krojem (1,75–2,5 rem), a obok, na linii bazowej, liczba opakowań w koszyku („6 opakowań”; ukryta przy pustym koszyku, liczona przez koszyk.js); bez wyszukiwarki, linia pod spodem jak w bazie",
        "z-akcja": "pasek ekranu aplikacji (klasa c5-titlebar--z-akcja; platforma-b2b.html#naglowek): okruszki albo link powrotu (opcjonalnie), H1, obok meta albo chip stanu, po prawej rząd akcji – od zera do dwóch kontrolek (przycisk, segment albo pole)"
      },
      "zrzut": {
        "maxh": 200
      },
      "zrzuty_wariantow": {
        "z-licznikiem": {
          "plik": "v7/koszyk.html",
          "kotwica": "naglowek",
          "klik": "[data-ks-sample]",
          "maxh": 200
        },
        "z-akcja": {
          "plik": "v7/platforma-b2b.html",
          "kotwica": "naglowek",
          "maxh": 200
        }
      }
    },
    "CE-78": {
      "nazwa": "Lista produktów z filtrami",
      "grupa": "dane",
      "rodzina": "sklep-formularze",
      "skrot": "Lista produktów z pastylkami grup, filtrami, sortowaniem i siatką kart z ceną i przyciskiem.",
      "projekt": null,
      "tagi": {
        "media": [
          "packshot",
          "zdjecie"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "taby-przelacznik"
        ],
        "pozycje": [
          "9+"
        ],
        "nadaje": [
          "lista-produktow",
          "porownanie-wybor",
          "sklep-transakcja"
        ],
        "mechanika": [
          "klik",
          "formularz"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "opis": "Cała powierzchnia wyboru produktów sklepu w szerokim kontenerze. U góry pas grup: nagłówek „Wybierz uprawę lub potrzebę”, pastylki z okrągłym zdjęciem, etykietą i licznikiem oraz link do konfiguratora po prawej; pod nim przyklejony pasek roboczy – przełącznik kolumny filtrów z liczbą aktywnych, licznik „Pokazujemy N z N produktów”, przycisk szuflady filtrów i sortowanie. Niżej od 1000 px kolumna filtrów 280 px (11 grup: pięć rozwiniętych na wierzchu, sześć pod „Pokaż wszystkie filtry”; przy każdej opcji licznik) obok siatki trzech kolumn kart produktu; nad siatką wiersz aktywnych filtrów z chipami i „Resetuj wszystkie filtry”, podpowiedź „Zawęź dalej”, pas przywracania filtrów i zdanie wykluczające, pod siatką pusty stan i rozwijany pas „Poza wynikami”. Karta: kadr 1 : 1 z makietą opakowania na jasnoszarym tle, znacznik „promocja”, pastylki opakowań, linia meta, nazwa, cena „od …” (przy obniżce cena, przekreślona regularna, „−9%” i najniższa cena z 30 dni) i „dodaj do koszyka” na całą szerokość karty.",
      "mechanika": "Stan listy = grupa (wybór jednokrotny; pastylka to przycisk przełączający z aria-pressed, ponowny klik zdejmuje wybór) + fasety (wybór wielokrotny) + zakres ceny + fraza z wyszukiwarki (CE-77) + sortowanie. Każdy aktywny filtr ma chip z „×”, grupa jest pierwszym chipem. Liczniki przy pastylkach i opcjach liczone na żywo; opcja o wyniku 0 jest wygaszona, nigdy ukryta; produkt zdjęty z listy dostaje zdanie w „Poza wynikami”, reguła twarda – zdanie nad siatką. Sortowanie „Polecane”, „Nazwa A–Z”, „Cena rosnąco” i filtr ceny liczą cenę po obniżce. Stan w adresie (polka, f, q, cena_od, cena_do, sort) – świadome akcje przez pushState, Wstecz i Dalej odtwarzają widok. Od 1000 px przycisk „Ukryj filtry / Pokaż filtry” zwija kolumnę (siatka zostaje trzykolumnowa na całej szerokości), stan pamiętany w sesji, domyślny z data-filters-default; kolumna filtrów przyklejona pod paskiem roboczym. Poniżej 1000 px filtry to szuflada na pełny ekran z przyciskiem „Pokaż produkty”, siatka ma dwie kolumny, a poniżej 900 px pas grup przewija się w poziomie (kółka 56 px, scroll-snap). Karta: pastylki opakowań na kadrze po najechaniu albo przy fokusie (wskaźnik z kursorem, od 600 px), w pozostałych przypadkach stale pod kadrem; pastylka prowadzi do karty produktu z kotwicą opakowania; na kartach rodziny CARBOMAT ECO druga klatka z fakturą przenika się ze zdjęciem opakowania po najechaniu; „dodaj do koszyka” otwiera szybki podgląd (CE-76). W widoku bez zawężenia w siatkę wplecione są kafle promocyjne (CE-79).",
      "baza": {
        "plik": "v7/sklep.html",
        "kotwica": "lista"
      },
      "kod": {
        "css": "sklep.html <style> bloki 3–10 (c5sk-needsbar, c5sk-bar, c5sk-facets, c5sk-chips, c5sk-grid, c5sk-card, c5sk-empty, c5sk-outside) + sklep-wspolne.css (ceny cws-price)",
        "js": "sklep.html <script> (stan, fasety, liczniki, sortowanie, adres, zwijanie kolumny, szuflada, pastylki opakowań) + sklep-wspolne.js (ceny, szybki podgląd)"
      },
      "czesci": [
        "pas grup: nagłówek, pastylki ze zdjęciem i licznikiem, link do konfiguratora",
        "przyklejony pasek roboczy: przełącznik kolumny filtrów, licznik, szuflada, sortowanie",
        "kolumna filtrów: 11 grup z licznikami opcji, filtr ceny z presetami",
        "wiersz aktywnych filtrów, „Zawęź dalej”, pas przywracania, zdanie wykluczające",
        "siatka kart produktu (22 karty)",
        "karta: kadr z makietą, znacznik, pastylki opakowań, meta, nazwa, cena, przycisk",
        "kafle promocyjne (CE-79, zagnieżdżone)",
        "pusty stan",
        "pas „Poza wynikami”"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 1400
      }
    },
    "CE-79": {
      "nazwa": "Kafel promocyjny w siatce",
      "grupa": "karty",
      "rodzina": "karty",
      "skrot": "Kafel promocyjny w siatce produktów: zdjęcie pod gradientem, kicker, nagłówek i przycisk.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie",
          "wideo",
          "packshot"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "1"
        ],
        "nadaje": [
          "cta",
          "lista-produktow",
          "korzysci-argumenty"
        ],
        "mechanika": [
          "statyczny",
          "klik",
          "ruch-wlasny"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "skroty_wariantow": {
        "baner": "Zdjęcie na całą szerokość siatki z tekstem i jasnym przyciskiem po lewej.",
        "wideo": "Film na 2 × 2 komórki z tekstem i przyciskiem odtwarzania i pauzy.",
        "dwie-kolumny": "Zdjęcie na dwie kolumny siatki, tekst i przycisk u dołu.",
        "w-miejscu-produktu": "Kafel o rozmiarze karty: kadr 1:1, wyśrodkowany nagłówek, zdanie i przycisk-link."
      },
      "opis": "Kafel redakcyjny wpleciony w siatkę listy produktów między karty. Dwie rodziny wyglądu: kafle na zdjęciu albo filmie (ciemne tło, obraz cover pod gradientem przyciemniającym, biały tekst: opcjonalny kicker wersalikami, nagłówek, zdanie i jasny przycisk) oraz kafel w miejscu produktu (obrys i rozmiar karty: kadr 1 : 1, pod nim wyśrodkowany nagłówek większy niż nazwa produktu, jedno zdanie i przycisk-link wersalikami z kreską pod spodem). Żaden kafel nie prowadzi poza sklep.",
      "mechanika": "Skrypt listy wstawia każdy kafel za N-tym produktem bieżącej kolejności (data-tile-after), więc sortowanie zostawia kafle na miejscach, a grid-auto-flow: dense zamyka komórkę, którą zostawia kafel wielokolumnowy. Kafle widać tylko w widoku bez zawężenia (bez grupy, faset, zakresu ceny i frazy); licznik „Pokazujemy N z N” liczy wyłącznie produkty. Przycisk kafla na zdjęciu włącza grupę (data-tile-shelf) i przewija do początku listy, przycisk kafla promocyjnego otwiera szybki podgląd (CE-76) z wybranym opakowaniem (data-cw-pack). Film gra bez dźwięku w pętli tylko w widoku (IntersectionObserver, 35 % kafla) i nigdy sam przy reduced-motion – wtedy plakat; przycisk odtwarzania i pauzy działa zawsze. Na siatce dwukolumnowej (poniżej 1000 px) baner, film i baner dwukolumnowy zajmują całą szerokość.",
      "baza": {
        "plik": "v7/sklep.html",
        "kotwica": "kafel-borowka"
      },
      "kod": {
        "css": "sklep.html <style> blok „Promo tiles” (c5sk-tile, c5sk-tile--wide / --video / --slot / --half)",
        "js": "sklep.html <script> (placeTiles, akcje kafli, film)"
      },
      "czesci": [
        "obraz albo film pod gradientem",
        "kicker (opcjonalnie)",
        "nagłówek",
        "zdanie",
        "przycisk",
        "przycisk odtwarzania i pauzy (film)",
        "kadr 1 : 1 z makietą albo zdjęciem (kafel w miejscu produktu)",
        "znacznik „promocja”, „−9%” i najniższa cena z 30 dni (kafel promocyjny)"
      ],
      "warianty": {
        "baner": "zdjęcie na całą szerokość siatki (po 6. produkcie), gradient od lewej, kicker, nagłówek i jasny przycisk po lewej; wysokość 240–360 px",
        "wideo": "film na 2 × 2 komórki od 1000 px (po 8. produkcie; przez dense wizualnie po 9.), niżej 16 : 9 na całą szerokość, poniżej 600 px 1 : 1; nagłówek, zdanie i przycisk na filmie, kwadratowy przycisk odtwarzania i pauzy w prawym górnym rogu",
        "dwie-kolumny": "zdjęcie na dwie prawe kolumny siatki (po 15. produkcie; wizualnie po 16.), nagłówek, zdanie i jasny przycisk u dołu",
        "w-miejscu-produktu": "kafel o obrysie i rozmiarze karty produktu: kadr 1 : 1 z makietą opakowania na jasnoszarym tle, znacznikiem „promocja” i dużym „−9%” (kafel promocyjny po 12. produkcie, z najniższą ceną z 30 dni pod nagłówkiem) albo ze zdjęciem cover („Ściółka zamiast kory” po 18. produkcie); pod kadrem wyśrodkowany nagłówek, zdanie i przycisk-link wersalikami"
      },
      "zrzut": {
        "ukryj": ".c5sk-bar",
        "maxh": 800
      },
      "zrzuty_wariantow": {
        "wideo": {
          "plik": "v7/sklep.html",
          "kotwica": "kafel-film"
        },
        "dwie-kolumny": {
          "plik": "v7/sklep.html",
          "kotwica": "kafel-oprysk",
          "maxh": 600
        },
        "w-miejscu-produktu": {
          "plik": "v7/sklep.html",
          "kotwica": "kafel-promocja",
          "maxh": 600
        }
      }
    },
    "CE-80": {
      "nazwa": "Wstęp z linią zaufania",
      "grupa": "otwarcie",
      "rodzina": "otwarcie",
      "skrot": "Nagłówek H2, lead i linia trzech krótkich sygnałów zaufania w jednym rzędzie.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "1"
        ],
        "nadaje": [
          "otwarcie-strony",
          "dowod-zrodla"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "opis": "Krótki blok tekstowy w szerokim kontenerze: nagłówek H2, lead na mierze ok. 70 znaków i pod nim linia zaufania – trzy krótkie sygnały drobnym drukiem w jednym rzędzie, rozdzielone cienkimi pionowymi kreskami.",
      "mechanika": "Statyczny; na wąskim ekranie sygnały zawijają się do kolejnych wierszy.",
      "baza": {
        "plik": "v7/sklep.html",
        "kotwica": "o-sklepie"
      },
      "kod": {
        "css": "c5.css (c5-head, c5-h2, c5-lead, c5-trust) + sklep.html <style> (miara leadu c5sk-about)",
        "js": "brak"
      },
      "czesci": [
        "nagłówek H2",
        "lead",
        "linia zaufania: trzy sygnały z kreskami"
      ],
      "warianty": {},
      "zrzut": {
        "ukryj": ".c5sk-bar",
        "maxh": 500
      }
    },
    "CE-81": {
      "nazwa": "Baner CTA ze zdjęciem",
      "grupa": "noty-i-cta",
      "rodzina": "pasy",
      "skrot": "Jasnoszary panel: nagłówek, lead i dwa przyciski obok zdjęcia na pełną wysokość.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "1"
        ],
        "nadaje": [
          "cta"
        ],
        "mechanika": [
          "statyczny",
          "okno"
        ],
        "zakres": [
          "uniwersalny"
        ]
      },
      "opis": "Jasnoszary panel w szerokim kontenerze, od 900 px w dwóch równych kolumnach: po lewej, wyśrodkowane w pionie, nagłówek H2, lead (do 60 znaków w wierszu) i rząd dwóch przycisków – ciemny „Zapytaj wirtualnego asystenta” i jasny „Dobierz produkt do swojej uprawy”; po prawej zdjęcie cover na całą wysokość panelu (min. 420 px). Poniżej 900 px jedna kolumna ze zdjęciem 16 : 10 pod tekstem.",
      "mechanika": "Statyczny. Przycisk asystenta otwiera dok doradcy (data-jurek-open – cw.js wiąże go przy starcie strony, więc przycisk musi stać w HTML), drugi prowadzi do konfiguratora.",
      "baza": {
        "plik": "v7/sklep.html",
        "kotwica": "pomoc"
      },
      "kod": {
        "css": "sklep.html <style> blok „SEKCJE POD LISTĄ” (c5sk-help)",
        "js": "cw.js (data-jurek-open)"
      },
      "czesci": [
        "nagłówek H2",
        "lead",
        "rząd dwóch przycisków",
        "zdjęcie"
      ],
      "warianty": {},
      "zrzut": {
        "ukryj": ".c5sk-bar",
        "maxh": 700
      }
    },
    "CE-82": {
      "nazwa": "Galeria z kolumną zakupu",
      "grupa": "otwarcie",
      "rodzina": "otwarcie",
      "skrot": "Slider zdjęć z licznikiem obok kolumny zakupu: cena, odmiana, opakowanie i dodanie do koszyka.",
      "projekt": null,
      "tagi": {
        "media": [
          "zdjecie",
          "packshot"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "karuzela",
          "taby-przelacznik"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "sklep-transakcja",
          "opis-produktu",
          "galeria-media"
        ],
        "mechanika": [
          "klik",
          "formularz",
          "przewijanie"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "skroty_wariantow": {
        "zalogowany-pro": "Przycisk „Zamów w panelu B2B” zamiast koszyka."
      },
      "opis": "Górna część karty produktu sklepu w szerokim kontenerze. Od 900 px dwie kolumny 64 : 36: po lewej galeria jako poziomy slider – jeden duży kadr 1 : 1 (makiety opakowań na jasnoszarym tle w całości, zdjęcia cover), obok wystaje brzeg następnego, pod kadrem strzałki ← → i licznik „1 / 6”; po prawej okruszki i kolumna zakupu: kicker, H1, cena z obniżką i najniższą ceną z 30 dni, dwa zdania opisu z linkiem „Więcej o produkcie”, przełącznik odmiany (pH), opakowania z cenami, frakcja z podpowiedzią, liczba opakowań obok przycisku „Dodaj do koszyka”, komunikat po dodaniu, jedno zdanie o wysyłce, a pod nimi „Połącz z” (CE-20). Poniżej 900 px okruszki, slider na całą szerokość ekranu i kolumna zakupu pod nim.",
      "mechanika": "Slider przewija się w bok ze scroll-snap (palec, gładzik, strzałki na zogniskowanym torze); przyciski przesuwają o jeden kadr, licznik i stan przycisków (aria-disabled na końcach) idą za przewijaniem. Od 900 px obie kolumny są przyklejone z logiką dwukierunkową: krótsza kolumna jedzie ze stroną, aż jej koniec dojdzie do dołu okna, i tam staje, dłuższa jedzie dalej; po zmianie kierunku odwrotnie (top liczony na bieżąco, przeliczenie przy zmianie rozmiaru i wysokości kolumny). Opcje i ceny rysowane z JSON-u data-cw-product kolumny – tego samego co na liście, w szybkim podglądzie i w koszyku. Druga odmiana pH jest linkiem do jej karty z kotwicą wybranego opakowania; kotwica #w20 / #bb1000 / #bb1500 wybiera opakowanie przy wejściu i przy hashchange, a zmiana opakowania zapisuje ją przez replaceState. „Dodaj do koszyka” zapisuje pozycję w koszyku (CWSklep.add) i ogłasza w regionie aria-live „Dodano: … W koszyku: N opakowań.” z linkiem do koszyka; od dwóch opakowań pod przyciskiem pojawia się suma. „Więcej o produkcie” przewija do CE-83 i ustawia fokus na jego nagłówku (bez płynności przy reduced-motion).",
      "baza": {
        "plik": "v7/pdp.html",
        "kotwica": "hero"
      },
      "kod": {
        "css": "pdp.css (c5pd-top, c5pd-gallery, c5pd-shots, c5pd-buycol, c5pd-buy, c5pd-opts) + sklep-wspolne.css (cws-qty, cws-price, cws-btn) + pdp.css (c5pd-net, c5pd-proact, c5pd-special; stan niesie klasa c5pd-buy--pro bez własnych reguł)",
        "js": "pdp.js ===== 1 (kolumna zakupu), 3 (przyklejone kolumny), 4 („Więcej o produkcie”), 6 (slider) + sklep-wspolne.js (koszyk, ceny) + pdp.js (cena netto, stan zalogowany-pro)"
      },
      "czesci": [
        "okruszki",
        "slider zdjęć: kadr 1 : 1, strzałki, licznik",
        "kolumna zakupu: kicker, H1, cena z obniżką i najniższą ceną z 30 dni",
        "dwa zdania opisu i „Więcej o produkcie”",
        "przełącznik odmiany (pH), opakowania z cenami, frakcja",
        "liczba opakowań i „Dodaj do koszyka”, komunikat po dodaniu, zdanie o wysyłce",
        "„Połącz z” (CE-20, zagnieżdżony)",
        "cena netto małym drukiem pod ceną brutto"
      ],
      "warianty": {
        "zalogowany-pro": "stan dla zalogowanego konta profesjonalnego (klasa c5pd-buy--pro): przycisk „Zamów w panelu B2B” zamiast krokomierza i koszyka, opcjonalna linijka o cenie specjalnej; w tym stanie znikają zdanie o wysyłce sklepu pod przyciskiem i pas dla profesjonalistów pod kartą"
      },
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-83": {
      "nazwa": "Opis w sekcjach z faktami",
      "grupa": "przelaczniki",
      "rodzina": "zwijane",
      "skrot": "Pełny opis produktu: wstęp, 4 fakty z ikonami, chipy i sekcje korzyści, przepisów i pytań.",
      "projekt": null,
      "tagi": {
        "media": [
          "ikona",
          "zdjecie"
        ],
        "tekst": [
          "dlugi"
        ],
        "ukryte": [
          "akordeon"
        ],
        "pozycje": [
          "9+"
        ],
        "nadaje": [
          "opis-produktu",
          "faq",
          "liczby-dane"
        ],
        "mechanika": [
          "statyczny",
          "klik"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "opis": "Pełny opis produktu na karcie sklepu, w szerokim kontenerze: nagłówek H2 i akapit wstępu, rząd czterech kluczowych faktów (ikona, etykieta wersalikami, duża wartość, linia pod spodem; od 900 px cztery w rzędzie, niżej 2 × 2), chipy „Sprawdzi się, gdy”, a dalej trzy sekcje rozdzielone liniami: „Co zyskujesz” (cztery kafle – kadr 4 : 3, tytuł, zdanie), „Jak stosować” (lista przepisów z linkiem do konfiguratora obok kadru) i „Najczęstsze pytania” (odpowiedź pod pytaniem). Od 900 px sekcja to dwie kolumny 1 : 3 – nagłówek H3 po lewej, przyklejony na czas sekcji, treść po prawej; na końcu zdanie z linkiem do pełnej strony produktu.",
      "mechanika": "Od 900 px (i bez skryptu) wszystkie sekcje otwarte, nie ma nic do klikania ani do fokusu. Poniżej 900 px skrypt zamienia sekcje w akordeony: przycisk w H3 (aria-expanded) przełącza klasę is-open, pierwsza sekcja otwarta; wysokość animowana przez grid-template-rows 0fr ↔ 1fr, zamknięta treść poza kolejnością fokusu (visibility), bez atrybutu hidden. Stan przetrwa zmianę szerokości przez 900 px. Kafle i kadr „Jak stosować” układają się wg szerokości sekcji (container queries).",
      "baza": {
        "plik": "v7/pdp.html",
        "kotwica": "o-produkcie"
      },
      "kod": {
        "css": "pdp.css blok „O produkcie” (c5pd-about, c5pd-facts, c5pd-chips, c5pd-secs, c5pd-gains, c5pd-howto, c5pd-qas)",
        "js": "pdp.js ===== 5 (akordeony poniżej 900 px)"
      },
      "czesci": [
        "nagłówek H2 i akapit wstępu",
        "rząd czterech faktów z ikonami",
        "chipy „Sprawdzi się, gdy”",
        "sekcja: nagłówek H3 (przycisk akordeonu na telefonie) i treść",
        "kafle korzyści: kadr 4 : 3, tytuł, zdanie",
        "lista przepisów z kadrem",
        "pytania z odpowiedziami",
        "zdanie z linkiem do strony produktu"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-84": {
      "nazwa": "Koszyk z podsumowaniem",
      "grupa": "dane",
      "rodzina": "sklep-formularze",
      "skrot": "Lista pozycji koszyka z miniaturą, krokomierzem i ceną oraz kolumna podsumowania z przyciskami.",
      "projekt": null,
      "tagi": {
        "media": [
          "packshot"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "2-4"
        ],
        "nadaje": [
          "sklep-transakcja"
        ],
        "mechanika": [
          "klik",
          "formularz"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "opis": "Strona koszyka w szerokim kontenerze, od 900 px w dwóch kolumnach 7 : 5 (podsumowanie min. 340 px). Po lewej etykieta „Pozycje w koszyku” nad czarną linią i pozycje jako wiersze-karty rozdzielone liniami: kwadratowa miniatura 160 px (96 px na telefonie) z makietą opakowania na jasnoszarym tle, nazwa z linkiem do karty z kotwicą opakowania i „×” w prawym górnym rogu, pod nazwą opakowanie z frakcją i cena jednostkowa (przy obniżce przekreślona regularna, „−9%” i najniższa cena z 30 dni) ze stawką VAT, na dole krokomierz po lewej i wartość pozycji po prawej. Po prawej przyklejone podsumowanie: produkty, wysyłka kurierem z rozwijanym „Jak liczymy”, dostawa paletowa, „Razem do zapłaty (brutto)”, VAT osobno dla każdej stawki i wartość netto, noty i przyciski „Kontynuuj zakupy” oraz „Przejdź do kasy – suma”. Pusty koszyk: ikona, zdanie, „Przejdź do sklepu” i przycisk makiety „Wczytaj przykładowy koszyk”.",
      "mechanika": "Wszystko rysuje koszyk.js ze wspólnego koszyka (CWSklep) i przelicza po każdej zmianie: krokomierz 1–99 (aria-disabled na końcach), „×” usuwa pozycję i na 6 s zostawia na jej miejscu pasek „Usunięto … – Cofnij” (pauza przy fokusie; przywrócenie przez CWSklep.restore), fokus przechodzi na następną pozycję albo na nagłówek pustego stanu. Kalkulator wysyłki układa opakowania w paczki od najcięższych do 30 kg (10 zł za paczkę), opakowania paletowe liczy sztukami (od 300 zł); wiersz palet tylko przy opakowaniach paletowych. VAT liczony osobno dla każdej stawki w koszyku, wysyłka rozkładana proporcjonalnie. Suma w przycisku kasy aktualizuje się na bieżąco, zmiany ogłasza jedyny region aria-live strony. Od 900 px podsumowanie przyklejone do góry (offset obniżany, gdy podsumowanie jest wyższe niż okno); przyciski obok siebie od 1200 px. Bez JS komunikat w noscript.",
      "baza": {
        "plik": "v7/koszyk.html",
        "kotwica": "pozycje"
      },
      "kod": {
        "css": "koszyk.css (c5ks-grid, c5ks-item, c5ks-undo, c5ks-empty, c5ks-sum) + sklep-wspolne.css (cws-qty, cws-price, cws-btn)",
        "js": "koszyk.js (pozycje, cofanie, kalkulator wysyłki, VAT, przykładowy koszyk) + sklep-wspolne.js (koszyk, wysyłka, VAT)"
      },
      "czesci": [
        "etykiety kolumn nad czarną linią",
        "pozycja: miniatura, nazwa, „×”, opakowanie, cena jednostkowa, krokomierz, wartość",
        "pasek „Usunięto – Cofnij”",
        "podsumowanie: produkty, wysyłka z „Jak liczymy”, palety, razem brutto, VAT i netto",
        "przyciski „Kontynuuj zakupy” i „Przejdź do kasy”",
        "noty o wysyłce i VAT",
        "pusty stan z przykładowym koszykiem"
      ],
      "warianty": {},
      "zrzut": {
        "klik": "[data-ks-sample]",
        "maxh": 900
      }
    },
    "CE-85": {
      "nazwa": "Przekrój rzędu z punktami produktów",
      "grupa": "przelaczniki",
      "opis": "Szeroka sekcja w dwóch kolumnach. Po lewej schemat – rysunek przekroju rzędu po posadzeniu (gleba rodzima, bruzda z podłożem, warstwa na dnie bruzdy, ściółka, linia kroplująca, krzew z liśćmi i owocami) z ponumerowanymi punktami. Po prawej te same pozycje jako lista: numer w kółku, miejsce działania (etykieta nadkreślona), nazwa produktu; otwarta pozycja pokazuje packshot, jedno zdanie, skrót trzech wierszy „etykieta | wartość” i dwa przyciski (pełna karta w pop-upie CE-25, sklep). Schemat jest przyklejony na czas listy; poniżej 900 px stoi nad listą.",
      "mechanika": "Akordeon z jedną otwartą pozycją (domyślnie pierwsza; ponowny klik zamyka). Punkt na schemacie i wiersz listy to dwa uchwyty tej samej pozycji: oba ją otwierają, zaznaczają punkt (zielone koło z poświatą) i wysuwają strefę rysunku, a pozostałe strefy produktów bledną (data-on na scenie, reszta w CSS). Poniżej 900 px klik w punkt przewija do wiersza. Bez JS wszystkie pozycje są rozwinięte, a punkt jest kotwicą do pozycji; przy reduced-motion bez animacji wysokości.",
      "baza": {
        "plik": "v7/borowka.html",
        "kotwica": "b-produkty"
      },
      "kod": {
        "css": "borowka.css blok 30 (b-cut) i 32 (b-brief)",
        "js": "borowka.js ===== 30"
      },
      "czesci": [
        "schemat SVG ze strefami produktów",
        "punkty z numerami (36 px, pole trafienia 48 px)",
        "podpis schematu",
        "wiersz listy: numer, miejsce działania, nazwa produktu",
        "panel: packshot, zdanie, skrót trzech wierszy, przyciski"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 1100
      },
      "status": "wycofany"
    },
    "CE-86": {
      "nazwa": "Kroki ze zdjęciem i paskiem proporcji",
      "grupa": "karty",
      "opis": "Lista kroków w kolejności prac, wiersze 50 / 50 naprzemiennie: kadr 5 : 4 z jednej strony, z drugiej numer z etykietą miejsca (mono), nagłówek, akapity, pasek proporcji (segmenty o szerokości z liczb, podpis pod paskiem), ponumerowane wskazówki w wierszach z liniami włosowymi i rząd akcji – przycisk i link. Poniżej 900 px kadr nad treścią.",
      "mechanika": "Statyczny; wiersze wchodzą przy przewijaniu (reveal). Paski proporcji są ozdobą (aria-hidden) – te same liczby stoją w podpisie. Przyciski prowadzą do pop-upu produktu (CE-25) i do przelicznika, w którym wybierają zakładkę (CE-47 „trzy-obliczenia”).",
      "baza": {
        "plik": "v7/borowka.html",
        "kotwica": "b-sadzenie"
      },
      "kod": {
        "css": "borowka.css blok 40 (b-steps, b-step, b-mix, b-tips)",
        "js": "brak własnego (wejście do przelicznika: borowka.js ===== 70)"
      },
      "czesci": [
        "głowa sekcji",
        "kadr 5 : 4",
        "numer kroku z etykietą miejsca",
        "pasek proporcji z podpisem",
        "wskazówki w wierszach",
        "rząd akcji: przycisk i link"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 1200
      },
      "status": "wycofany"
    },
    "CE-87": {
      "nazwa": "Porównanie trwałości z kaflami zalet",
      "grupa": "dane",
      "rodzina": "dane",
      "skrot": "Dwa porównywane wiersze z wielką liczbą i paskiem, obok siatki 2 × 2 kafli z akapitami.",
      "projekt": null,
      "tagi": {
        "media": [
          "schemat-wykres"
        ],
        "tekst": [
          "sredni"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "porownanie-wybor",
          "liczby-dane",
          "korzysci-argumenty"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "jednorazowy"
        ]
      },
      "opis": "Jasny pas: głowa sekcji, pod nią dwie kolumny 5 / 7. Po lewej etykieta i dwa wiersze „nazwa | wielka liczba” z paskiem w skali (drugi pasek wygasa, gdy wartość jest otwarta – „ponad 20 lat”) oraz zdanie źródłowe drobnym drukiem; po prawej siatka 2 × 2 kafli: tytuł i akapit. Poniżej 1000 px jedna kolumna, poniżej 640 px kafle jeden pod drugim.",
      "mechanika": "Statyczny; bloki wchodzą przy przewijaniu (reveal). Paski są ozdobą (aria-hidden), liczby stoją w tekście.",
      "baza": {
        "plik": "v7/borowka.html",
        "kotwica": "b-torf"
      },
      "kod": {
        "css": "borowka.css blok 45 (b-peat, b-dur, b-tiles)",
        "js": "brak"
      },
      "czesci": [
        "głowa sekcji",
        "wiersz porównania: nazwa, liczba, pasek w skali",
        "zdanie źródłowe",
        "kafel: tytuł i akapit"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 1000
      }
    },
    "CE-88": {
      "nazwa": "Kadr panoramiczny z listą działań i wskazówkami",
      "grupa": "karty",
      "opis": "Kadr panoramiczny (ok. 3 : 1) na szerokość szerokiego kontenera, pod nim głowa sekcji i dwie kolumny: po lewej lista „tytuł + zdanie” rozdzielona liniami, po prawej etykieta, ponumerowane wskazówki i rząd akcji (przycisk do przelicznika, link do karty produktu). Poniżej 1000 px jedna kolumna; na telefonie kadr 16 : 9.",
      "mechanika": "Statyczny; bloki wchodzą przy przewijaniu (reveal). Przycisk wybiera zakładkę przelicznika (CE-47 „trzy-obliczenia”), link otwiera pop-up produktu (CE-25).",
      "baza": {
        "plik": "v7/borowka.html",
        "kotwica": "b-sciolka"
      },
      "kod": {
        "css": "borowka.css blok 50 (b-mulch, b-does) oraz b-tips z bloku 40",
        "js": "brak własnego"
      },
      "czesci": [
        "kadr panoramiczny",
        "głowa sekcji",
        "lista: tytuł i zdanie",
        "wskazówki w wierszach",
        "rząd akcji"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 1200
      },
      "status": "wycofany"
    },
    "CE-89": {
      "nazwa": "Etapy sezonu nad mapą produktów",
      "grupa": "przelaczniki",
      "opis": "Szeroka sekcja z mapą: wiersz nagłówka jest listą kart (etapy sezonu – numer, nazwa, dopowiedzenie), a pod nim stoi po jednym wierszu na produkt z paskami w etapach, w których produkt jest stosowany (pasek może obejmować kilka etapów); kolumna otwartego etapu jest podbarwiona. Pod mapą panel etapu: kadr 4 : 3 i karta zabiegu (packshot, rodzaj zabiegu, nazwa produktu, zdanie, skrót „etykieta | wartość”, przyciski). Niżej dwie karty całosezonowe obok siebie i nota „Ważne”. Poniżej 900 px mapa znika, a etapy stoją w siatce 2 × 2.",
      "mechanika": "Karty przełącza data-tabs-group z uprawa.js (klik, strzałki, Home, End; jeden panel naraz). Moduł strony wpisuje numer otwartego etapu do --b-sez-on, z którego mapa bierze kolumnę podbarwienia. Mapa jest ozdobą (aria-hidden): te same informacje stoją w panelach i w kartach całosezonowych. Bez JS panele stoją jeden pod drugim.",
      "baza": {
        "plik": "v7/borowka.html",
        "kotwica": "b-sezon"
      },
      "kod": {
        "css": "borowka.css blok 60 (b-sez, b-zab, b-always)",
        "js": "uprawa.js 10 (tablist) + borowka.js ===== 60"
      },
      "czesci": [
        "wiersz kart etapów",
        "wiersze produktów z paskami",
        "panel etapu: kadr i karta zabiegu",
        "karty całosezonowe",
        "nota „Ważne”"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 1200
      },
      "status": "wycofany"
    },
    "CE-90": {
      "nazwa": "Oś programu z punktami zdarzeń",
      "grupa": "dane",
      "rodzina": "dane",
      "skrot": "Oś czasu gospodarstw z pionowymi liniami miesięcy i kwadratami zdarzeń wg stanu.",
      "projekt": null,
      "tagi": {
        "media": [
          "schemat-wykres",
          "ikona"
        ],
        "tekst": [
          "tylko-naglowek"
        ],
        "ukryte": [
          "okno"
        ],
        "pozycje": [
          "9+"
        ],
        "nadaje": [
          "harmonogram-czas",
          "ludzie"
        ],
        "mechanika": [
          "klik",
          "okno",
          "przewijanie"
        ],
        "zakres": [
          "jednorazowy"
        ]
      },
      "opis": "Oś czasu gospodarstw w stylu pionowych linii: u góry rząd lat i miesięcy z podpisem „jesteśmy tutaj” nad bieżącym miesiącem, po lewej przyklejona kolumna wierszy (chip uprawy i gospodarz); miesiąc ze zdarzeniami to cienka pionowa linia przez wszystkie wiersze, zdarzenia stoją tuż po jej prawej stronie jako kwadraty 16 px, których kształt niesie stan (ciemny z białym ptaszkiem = zrobione, obrys z pełnym środkiem = w toku, obrys = zaplanowane, obrys kreskowany = nie dotyczy); zdarzenie z filmem ma znak odtwarzacza. Miesiące puste są wąskie, lata bez zdarzeń zwinięte do wąskiego pasa. Pod osią legenda. Nad osią tytuł harmonogramu (kotwica #harmonogram).",
      "mechanika": "Oś buduje się z list w HTML-u (po jednej na gospodarstwo), które są zarazem wersją bez JS; miesiąc zdarzenia stoi w data-od, znacznik „jesteśmy tutaj” w jednym elemencie z data-m. Szerokości kolumn liczy skrypt ze źródła (miesiąc ze zdarzeniami = 1, pusty = 1/3, pusty rok = pas 56 px). Najechanie na kolumnę miesiąca, fokus na punkcie albo dotknięcie rozszerza kolumnę do ok. 320 px jednym przejściem (.45 s), a kwadraty tej kolumny rozwijają się w etykiety na tle: ikona stanu z przodu, sama nazwa zdarzenia (bez terminu), materiał wg stanu (zrobione – ciemne tło, biały ptaszek i tekst; pozostałe – jasne tło z obrysem); wyjście z osi albo Esc zwija. Klik / Enter / spacja otwiera wyśrodkowany pop-up ze wszystkimi zdarzeniami gospodarstwa z tego miesiąca. Wiersz pod kursorem, z fokusem albo po skoku z karty uczestnika (CX5.ppEtapy.focusFarm, kotwice #etapy-<klucz>) dostaje białe tło na pełną szerokość okna. Przy 1440 i 1920 px oś mieści się bez przewijania, poniżej 900 px przewija się w poziomie wewnątrz komponentu.",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "etapy-os"
      },
      "kod": {
        "css": "ce/CE-90-os-programu.css",
        "js": "ce/CE-90-os-programu.js"
      },
      "czesci": [
        "kolumna wierszy gospodarstw",
        "rząd lat i miesięcy o nierównych szerokościach",
        "podpis „jesteśmy tutaj” w rzędzie lat",
        "pionowe linie miesięcy",
        "kwadraty zdarzeń wg stanu",
        "znak filmu",
        "etykiety na tle w rozszerzonej kolumnie",
        "biały pas aktywnego wiersza",
        "pop-up opisu",
        "legenda",
        "źródło treści (wersja bez JS)"
      ],
      "warianty": {},
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-91": {
      "nazwa": "Nagłówek panelu",
      "grupa": "wspolne",
      "rodzina": "wspolne",
      "skrot": "Nagłówek aplikacji w dwóch wierszach: marka z nazwą konta i odnośnikami, pod nią zakładki działów.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "tylko-naglowek"
        ],
        "ukryte": [
          "wszystko-widoczne"
        ],
        "pozycje": [
          "5-8"
        ],
        "nadaje": [
          "nawigacja"
        ],
        "mechanika": [
          "statyczny"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "skroty_wariantow": {
        "handlowiec": "Etykieta „Stanowisko handlowca”, nazwisko pracownika i jedna zakładka."
      },
      "opis": "Pas na całą szerokość w szerokim kontenerze, zamiast nagłówka serwisu. Wiersz górny: wordmark, etykieta obszaru „Platforma B2B”, nazwa zalogowanego konta, po prawej odnośnik „Strona CarboHort” i „Wyloguj”. Wiersz dolny: zakładki działów na linii, bieżąca podkreślona.",
      "mechanika": "Renderowany przez chrome.js ze znacznika cw-navbar z atrybutem data-uklad. Zakładki to nawigacja ze zwykłymi odnośnikami, bieżąca z data-current dostaje aria-current. Bez mega-menu, koszyka i nawigacji mobilnej. Poniżej 900 px wiersz górny zawija się, a zakładki przewijają się w poziomie; bieżąca zakładka jest przy starcie przewijana w widok.",
      "baza": {
        "plik": "v7/chrome.js",
        "kotwica": "panel-naglowek"
      },
      "kod": {
        "css": "ce/CE-91-naglowek-panelu.css (c5-panelbar)",
        "js": "chrome.js (szablon panelbar())"
      },
      "czesci": [
        "wordmark",
        "etykieta obszaru",
        "nazwa konta",
        "odnośnik do serwisu",
        "„Wyloguj”",
        "zakładki działów"
      ],
      "warianty": {
        "handlowiec": "stanowisko pracownika (klasa c5-panelbar--handlowiec): etykieta „Stanowisko handlowca”, nazwisko pracownika, „Wyloguj” i jedna zakładka „Zamówienia klientów” (admin.html i strony handlowiec-*)"
      },
      "zrzut": {
        "strona": "v7/platforma-b2b.html",
        "maxh": 160
      },
      "zrzuty_wariantow": {
        "handlowiec": {
          "plik": "v7/admin.html",
          "kotwica": "panel-naglowek",
          "maxh": 160
        }
      }
    },
    "CE-92": {
      "nazwa": "Tabela zamówieniowa",
      "grupa": "dane",
      "rodzina": "sklep-formularze",
      "skrot": "Lista produktów i koszyk w jednej tabeli: dwie ceny, krokomierz, wartość i przyklejony pasek sumy z przyciskiem.",
      "projekt": null,
      "tagi": {
        "media": [
          "bez-mediow"
        ],
        "tekst": [
          "krotki"
        ],
        "ukryte": [
          "taby-przelacznik"
        ],
        "pozycje": [
          "9+"
        ],
        "nadaje": [
          "sklep-transakcja",
          "lista-produktow"
        ],
        "mechanika": [
          "klik",
          "formularz"
        ],
        "zakres": [
          "typ-strony"
        ]
      },
      "skroty_wariantow": {
        "handlowiec": "Z polem wyboru klienta i kolumną „Cena klienta”, bez paska sumy."
      },
      "opis": "Tabela w szerokim kontenerze: produkt z odnośnikiem „Karta produktu (PDF)”, opakowanie, cena w sklepie netto, cena klienta z rabatem zapisanym słownie albo ze znacznikiem ceny specjalnej, krokomierz ilości i wartość netto. Nad tabelą pasek narzędzi – przełącznik „Moje produkty / Wszystkie” i wyszukiwarka – oraz zdanie o cenach; pod tabelą blok dużego zamówienia i pasek sumy przyklejony do dołu okna: liczba pozycji, wartość netto, małym drukiem brutto i przycisk następnego kroku. Blok dużego zamówienia stoi bezpośrednio nad paskiem sumy i przykleja się razem z nim – oba tworzą jeden dok w ramce (c5-order__dock).",
      "mechanika": "Wiersze i ceny stoją w HTML (data-cena-gr w groszach); moduł czyta wyłącznie DOM. Krokomierz 0–999 przelicza wartość wiersza i pasek sumy, a zmianę ogłasza osobny region aria-live i zdarzenie c5-order:zmiana (pozycje, nettoGr, bruttoGr, duze). Przełącznik zawęża listę do produktów klienta, wyszukiwarka filtruje po nazwie. Od progu z data-prog-gr pojawia się blok dużego zamówienia z przyciskiem uzgodnienia – w przyklejonym doku, nad paskiem sumy, więc jest widoczny od razu i nie przesuwa tabeli; wysokość całego doku niesie zmienna --c5-order-bar-h (scroll-padding strony), a kontrolka z fokusem nie chowa się pod dokiem; przy pustym zamówieniu przycisk następnego kroku ma aria-disabled. Poniżej 900 px wiersz składa się w kartę z etykietami kolumn (role tabeli zostają); poniżej 600 px pasek sumy ma dwa wiersze. Bez JS tabela stoi z ilościami wpisanymi w HTML.",
      "baza": {
        "plik": "v7/b2b-zamow.html",
        "kotwica": "tabela"
      },
      "kod": {
        "css": "ce/CE-92-tabela-zamowieniowa.css (c5-order) + sklep-wspolne.css (cws-qty)",
        "js": "ce/CE-92-tabela-zamowieniowa.js"
      },
      "czesci": [
        "pasek narzędzi: przełącznik zakresu, wyszukiwarka",
        "zdanie o cenach",
        "wiersz: produkt z kartą PDF, opakowanie, dwie ceny, rabat albo znacznik ceny specjalnej, krokomierz, wartość",
        "zdanie o progu dużego zamówienia w biegu strony",
        "blok dużego zamówienia",
        "przyklejony pasek sumy z przyciskiem",
        "przyklejony dok: blok dużego zamówienia nad paskiem sumy, przyklejane razem"
      ],
      "warianty": {
        "handlowiec": "zamówienie wpisywane przez pracownika (klasa c5-order--handlowiec; handlowiec-zamowienie.html): pole wyboru klienta w pasku narzędzi, kolumna „Cena klienta”, bez karty PDF, bez bloku dużego zamówienia i bez przyklejonego paska – sumę niesie panel formularza obok (CE-50 z-podsumowaniem), wypełniany ze zdarzenia c5-order:zmiana"
      },
      "zrzut": {
        "maxh": 900,
        "ukryj": ".c5-order__dock"
      },
      "zrzuty_wariantow": {
        "handlowiec": {
          "plik": "v7/handlowiec-zamowienie.html",
          "kotwica": "pozycje",
          "maxh": 648
        }
      }
    }
  },
  "grupyEl": {
    "akcje": "Przyciski i linki",
    "typografia": "Kicker, nagłówki, lead",
    "pojemniki": "Karty, boksy, pasy",
    "sterowanie": "Taby, chipy, akordeony, pola",
    "dane": "Tabele, listy dl, kafle liczb, paski",
    "ikony": "Ikony i wizuale",
    "tokeny": "Kolory, typografia, odstępy"
  },
  "elementy": {
    "EL-01": {
      "nazwa": "Przycisk",
      "grupa": "akcje",
      "klasa": "c5-btn",
      "warianty": {
        "c5-btn--dark": "ciemny, akcja główna",
        "c5-btn--light": "jasny z obrysem, akcja drugorzędna",
        "c5-btn--inv": "odwrócony – biały na ciemnym tle",
        "c5-btn--ondark": "ciemny przycisk na ciemnym pasie – działa tylko w kontekście .c5-params (CE-10)",
        "c5-btn--sm": "mały, 0.8125 rem, nadal 44 px wysokości",
        "c5-btn--tight": "wąski boczny padding, gdy przyciski stoją ciasno",
        "c5-btn--ghost": "konturowy na zdjęciu: biały obrys, tło rgb(0 0 0 / .3) – działa tylko w kontekście .c5-hero--bg (CE-08, wariant kadr-w-tle); bliźniak c5-pro__login z pasa PRO, do scalenia w fali 2b"
      },
      "opis": "Podstawowa akcja: ostre narożniki, obrys 1 px, etykieta małymi literami, ikona po lewej. Cel dotykowy 44 px siedzi w bazie – nie łata się go już punktowo, a boczny padding ustawia token --c5-btn-px zamiast ośmiu kontekstowych nadpisań.",
      "przyklad": "<div class=\"c5-btnrow\"><a class=\"c5-btn c5-btn--dark\" href=\"#\">kup teraz</a><a class=\"c5-btn c5-btn--light\" href=\"#\">dobierz dawki</a><a class=\"c5-btn c5-btn--light c5-btn--sm\" href=\"#\"><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-file-text\"></use></svg> karta produktu</a><a class=\"c5-btn c5-btn--light c5-btn--sm c5-btn--tight\" href=\"#\">zaloguj się</a></div><div class=\"sg-ondark\"><a class=\"c5-btn c5-btn--inv\" href=\"#\">zamów próbkę</a></div>",
      "przyklad_tlo": "jasne",
      "kod": "ce/00-base.css – Przyciski nowego języka",
      "uzywany_w": [
        "CE-08",
        "CE-10",
        "CE-11",
        "CE-13",
        "CE-14",
        "CE-15",
        "CE-16",
        "CE-17",
        "CE-18",
        "CE-20",
        "CE-23",
        "CE-25",
        "CE-27",
        "CE-28",
        "CE-29",
        "CE-30",
        "CE-31",
        "CE-35",
        "CE-36",
        "CE-37",
        "CE-38",
        "CE-39",
        "CE-40",
        "CE-46",
        "CE-47",
        "CE-50",
        "CE-53"
      ],
      "zastepuje": [
        "sześć łat min-height:44px (produkty.css, prochnica-plus.css)",
        "osiem kontekstowych nadpisań padding-inline – dziś token --c5-btn-px",
        "wf-btn z kitu i osiem jego modyfikatorów – w V7 nieużywane"
      ]
    },
    "EL-02": {
      "nazwa": "Przycisk ikonowy",
      "grupa": "akcje",
      "klasa": "c5-iconbtn",
      "warianty": {
        "c5-iconbtn--sm": "40 px – róg lightboxa"
      },
      "opis": "Kwadrat 44 × 44 px z obrysem kitu i samą ikoną w środku: zamknięcie nakładki, strzałki karuzeli, sterowanie harmonogramem. Jedna definicja zamiast czterech klas, które różniły się wyłącznie rozmiarem.",
      "przyklad": "<div class=\"c5-btnrow\"><button type=\"button\" class=\"c5-iconbtn\" aria-label=\"Zamknij\"><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-x\"></use></svg></button><button type=\"button\" class=\"c5-iconbtn\" aria-label=\"Poprzedni\"><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-chevron-left\"></use></svg></button><button type=\"button\" class=\"c5-iconbtn\" aria-label=\"Następny\" disabled><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-chevron-right\"></use></svg></button><button type=\"button\" class=\"c5-iconbtn c5-iconbtn--sm\" aria-label=\"Zamknij podgląd\"><svg class=\"wf-icon wf-icon--sm\" aria-hidden=\"true\"><use href=\"#ti-x\"></use></svg></button></div>",
      "przyklad_tlo": "jasne",
      "kod": "ce/00-base.css – EL · Interface elements → EL-02",
      "uzywany_w": [
        "CE-25",
        "CE-37",
        "CE-49"
      ],
      "zastepuje": [
        "pp-ctrl__btn (Próchnica+, 14)",
        "c5-pop__close (CARBOMAT HUMIC, 2)",
        "u-lightbox__close (Kukurydza, 2)",
        "c5-lb__close (CARBOMAT Mata, 1)"
      ]
    },
    "EL-03": {
      "nazwa": "Link cichy",
      "grupa": "akcje",
      "klasa": "c5-quiet",
      "warianty": {
        "c5-quiet--underline": "podkreślenie w kolorze obrysu",
        "c5-quiet--rule": "kreska pod spodem, chevron obraca się",
        "c5-quiet--ondark": "na ciemnym pasie, przygaszony"
      },
      "opis": "Link z ikoną, który nie udaje przycisku: pobranie karty produktu, rozwinięcie dłuższego tekstu, odnośnik w ciemnym pasie parametrów. Trzy dzisiejsze dekoracje schodzą do trzech wariantów jednej klasy.",
      "przyklad": "<div class=\"sg-stos\"><a class=\"c5-quiet c5-quiet--underline\" href=\"#\"><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-download\"></use></svg> Pobierz aktualną analizę</a><a class=\"c5-quiet c5-quiet--rule\" href=\"#\">więcej <svg class=\"wf-icon wf-icon--sm\" aria-hidden=\"true\"><use href=\"#ti-chevron-down\"></use></svg></a></div>",
      "przyklad_tlo": "jasne",
      "kod": "do dopisania w ce/00-base.css (fala 2b)",
      "uzywany_w": [
        "CE-10",
        "CE-25",
        "CE-40",
        "CE-48"
      ],
      "zastepuje": [
        "c5pr-doc (Produkty, 7)",
        "c5-params__dl (4 strony, 4)",
        "u-more (Kukurydza, 3)",
        "pp-more (Próchnica+, 2)"
      ],
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "c5pr-doc",
        "pp-more",
        "u-more",
        "c5-params__dl"
      ]
    },
    "EL-04": {
      "nazwa": "Rząd przycisków",
      "grupa": "akcje",
      "klasa": "c5-btnrow",
      "warianty": {
        "c5-btnrow--stack": "kolumna na wąskim ekranie",
        "c5-btnrow--end": "wyrównanie do prawej"
      },
      "opis": "Poziomy rząd akcji z odstępem 6 px, zawijany, gdy zabraknie miejsca. Osiem lokalnych nadpisań odstępu i marginesu czeka na sprowadzenie do dwóch wariantów.",
      "przyklad": "<div class=\"c5-btnrow\"><a class=\"c5-btn c5-btn--dark\" href=\"#\">kup teraz</a><a class=\"c5-btn c5-btn--light\" href=\"#\">porównaj warianty</a><a class=\"c5-btn c5-btn--light\" href=\"#\">zapytaj doradcę</a></div>",
      "przyklad_tlo": "jasne",
      "kod": "ce/00-base.css – Przyciski nowego języka",
      "uzywany_w": [
        "CE-08",
        "CE-11",
        "CE-14",
        "CE-16",
        "CE-18",
        "CE-20",
        "CE-23",
        "CE-28",
        "CE-30",
        "CE-35",
        "CE-37",
        "CE-39"
      ],
      "zastepuje": [
        "dziewięć identycznych kopii reguły w arkuszach stron",
        "osiem lokalnych nadpisań gap/margin"
      ]
    },
    "EL-05": {
      "nazwa": "Link treściowy",
      "grupa": "akcje",
      "klasa": "wf-link",
      "warianty": {
        "wf-link--muted": "przygaszony, nadal podkreślony",
        "wf-link--quiet": "podkreślenie dopiero po najechaniu"
      },
      "opis": "Zwykły link w zdaniu, prosto z kitu – jedyny element akcji, którego V7 nie przepisuje. Zostaje bez zmian, bo działa i jest używany na pięciu stronach.",
      "przyklad": "<p class=\"sg-tekst\">Dawki dobierzesz w <a class=\"wf-link\" href=\"#\">konfiguratorze</a>, a metodykę opisuje <a class=\"wf-link wf-link--muted\" href=\"#\">karta produktu</a>. Szczegóły badań zostawiamy w <a class=\"wf-link wf-link--quiet\" href=\"#\">centrum wiedzy</a>.</p>",
      "przyklad_tlo": "jasne",
      "kod": "wireframe.css – 3. TYPOGRAPHY / links",
      "uzywany_w": [
        "CE-08",
        "CE-17",
        "CE-18",
        "CE-19",
        "CE-20",
        "CE-21",
        "CE-22",
        "CE-25",
        "CE-28",
        "CE-29",
        "CE-38"
      ],
      "zastepuje": []
    },
    "EL-06": {
      "nazwa": "Kicker",
      "grupa": "typografia",
      "klasa": "c5-kicker",
      "warianty": {
        "c5-kicker--center": "wyśrodkowany",
        "c5-kicker--flush": "bez odstępu pod spodem",
        "c5-kicker--outline": "w ramce: obrys 1 px, narożniki 8 px, 0.75 rem – wyjątek Mateusza od ostrych narożników (18.09.2026, wzór: ramki Figma Mateusza); na Kukurydzy w CE-66, CE-67 i CE-68 (CE-65 na stronie demonstracyjnej). Od 20.09.2026 plakietka stoi na KAŻDEJ głowie sekcji Kukurydzy (siedem uwag Mateusza „popraw kicker”), w metrykach ramki – padding 9 px, promień 8 px, 13/14 px, tusz #0c2b1c – regułą strony w kukurydza.css, tak jak wcześniej na Produktach (produkty.css blok 05) i na CARBOMAT ECO; jedna strona nie niesie dwóch stylów kickera naraz"
      },
      "opis": "Nadtytuł sekcji: 0.875 rem, wersaliki, tracking .03em i duży odstęp do treści pod spodem. Dwanaście lokalnych nadpisań margin-bottom:0 czeka na wariant --flush.",
      "przyklad": "<span class=\"c5-kicker\">Czym jest CARBOMAT ECO</span><span class=\"c5-kicker c5-kicker--center\">Dla dociekliwych</span>",
      "przyklad_tlo": "jasne",
      "kod": "ce/00-base.css – Wspólne CE nowego layoutu",
      "uzywany_w": [
        "CE-08",
        "CE-11",
        "CE-12",
        "CE-14",
        "CE-15",
        "CE-17",
        "CE-20",
        "CE-30",
        "CE-32",
        "CE-39",
        "CE-40",
        "CE-45",
        "CE-46",
        "CE-47"
      ],
      "zastepuje": [
        "c5-kicker--center (osobna kopia w ośmiu arkuszach)"
      ]
    },
    "EL-07": {
      "nazwa": "Overline",
      "grupa": "typografia",
      "klasa": "c5-overline",
      "warianty": {
        "c5-overline--plain": "bez wersalików",
        "c5-overline--ondark": "na ciemnym tle",
        "c5-overline--solid": "biała na ciemnym prostokącie"
      },
      "opis": "Mała etykieta 0.75 rem z trackingiem .06em nad liczbą, kafelkiem albo wierszem tabeli – rola inna niż kicker, bo nie otwiera sekcji. Trzynaście klas o identycznej treści schodzi do jednej z trzema modyfikatorami.",
      "przyklad": "<div class=\"sg-stos\"><span class=\"c5-overline\">01 · Pochodzenie</span><span class=\"c5-overline c5-overline--plain\">02</span></div><div class=\"sg-ondark\"><span class=\"c5-overline c5-overline--ondark\">Zasobność</span></div>",
      "przyklad_tlo": "jasne",
      "kod": "do dopisania w ce/00-base.css (fala 2b)",
      "uzywany_w": [
        "CE-12",
        "CE-20",
        "CE-21",
        "CE-25",
        "CE-26",
        "CE-30",
        "CE-33",
        "CE-43",
        "CE-44",
        "CE-45",
        "CE-46"
      ],
      "zastepuje": [
        "c5-viz__tag, c5-mt-card__no, c5-mt-proof__tag, c5hu-rule__label",
        "c5hu-stack__no, c5pr-path__no, c5-cmp2__no, c5-tco__no",
        "u-lab, u-fz__no, u-cr__no, u-rules__no, u-vtab__no (linia kitu)"
      ],
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "c5-viz__tag",
        "c5-mt-card__no",
        "u-lab",
        "i dziesięć innych klas"
      ]
    },
    "EL-08": {
      "nazwa": "Nagłówek strony",
      "grupa": "typografia",
      "klasa": "c5-h1",
      "warianty": {},
      "opis": "Jedyny h1 na podstronie, w hero: clamp od 2,1 do 3,125 rem, waga 500, tracking −0.01em. Element bez wariantów – siedem stron, siedem wystąpień, jedna definicja.",
      "przyklad": "<h1 class=\"c5-h1\">CARBOMAT ECO – surowy polski lignit</h1>",
      "przyklad_tlo": "jasne",
      "kod": "ce/00-base.css – Wspólne CE nowego layoutu",
      "uzywany_w": [
        "CE-08"
      ],
      "zastepuje": [
        "lokalne zmniejszenie w carbomat-humic.css (do decyzji)"
      ]
    },
    "EL-09": {
      "nazwa": "Nagłówek sekcji",
      "grupa": "typografia",
      "klasa": "c5-h2",
      "warianty": {
        "c5-h2--center": "wyśrodkowany",
        "c5-h2--tight": "mniejszy, do pasa parametrów",
        "c5-h2--sm": "scena sterowana przewijaniem"
      },
      "opis": "Nagłówek sekcji: clamp od 1,7 do 2,5 rem, waga 500, szerokość łamania 784 px. Wchłania c5-params__title i nagłówki kitu z Kukurydzy, które dziś mają wagę 700.",
      "przyklad": "<h2 class=\"c5-h2\">Pięć rzeczy, które warto wiedzieć o lignicie</h2><h2 class=\"c5-h2 c5-h2--center\">Który wariant dla mnie</h2>",
      "przyklad_tlo": "jasne",
      "kod": "ce/00-base.css – Wspólne CE nowego layoutu",
      "uzywany_w": [
        "CE-10",
        "CE-11",
        "CE-12",
        "CE-14",
        "CE-15",
        "CE-16",
        "CE-17",
        "CE-18",
        "CE-20",
        "CE-24",
        "CE-25",
        "CE-30",
        "CE-32",
        "CE-39",
        "CE-40",
        "CE-44",
        "CE-45",
        "CE-46",
        "CE-47",
        "CE-48",
        "CE-49",
        "CE-50"
      ],
      "zastepuje": [
        "wf-h2 (Kukurydza, 15 – waga 700 schodzi do 500)",
        "c5-params__title",
        "u-fk__title",
        "pp-liczby__title"
      ],
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "wf-h2",
        "c5-params__title",
        "u-fk__title"
      ]
    },
    "EL-10": {
      "nazwa": "Nagłówek CE",
      "grupa": "typografia",
      "klasa": "c5-h3",
      "warianty": {
        "c5-h3--xs": "1 rem",
        "c5-h3--sm": "1,0625 rem (baza)",
        "c5-h3--md": "1,125 rem",
        "c5-h3--lg": "clamp 1,125 – 1,5 rem",
        "c5-h3--xl": "clamp 2 – 3 rem"
      },
      "opis": "Nagłówek wewnątrz CE – karty, kroku, kafla, pozycji listy – w pięciu rozmiarach jednej skali. To największy bałagan inwentarza: 36 klas o tym samym kroju czeka na scalenie w fali 2c.",
      "przyklad": "<div class=\"sg-stos\"><h3 class=\"c5-h3 c5-h3--xl\">Dodatek do gleby</h3><h3 class=\"c5-h3 c5-h3--lg\">Trwała próchnica, nie nawóz</h3><h3 class=\"c5-h3 c5-h3--md\">Nasiąkliwość</h3><h3 class=\"c5-h3\">Dawka na hektar</h3><h3 class=\"c5-h3 c5-h3--xs\">Opakowanie</h3></div>",
      "przyklad_tlo": "jasne",
      "kod": "ce/00-base.css – EL · Interface elements → EL-10",
      "uzywany_w": [
        "CE-12",
        "CE-14",
        "CE-17",
        "CE-20",
        "CE-22",
        "CE-25",
        "CE-26",
        "CE-28",
        "CE-30",
        "CE-37",
        "CE-40",
        "CE-41",
        "CE-43",
        "CE-44",
        "CE-46",
        "CE-48"
      ],
      "zastepuje": [
        "36 klas h3/h4/h5 z siedmiu stron – m.in. c5-fact__title, pp-step__title, c5-mt-card__title, c5-band__title, u-h3, u-h4"
      ],
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "c5-fact__title",
        "pp-step__title",
        "c5-mt-card__title",
        "u-h3",
        "i 32 inne klasy"
      ]
    },
    "EL-11": {
      "nazwa": "Głowa sekcji",
      "grupa": "typografia",
      "klasa": "c5-head",
      "warianty": {
        "c5-head--center": "wyśrodkowana"
      },
      "opis": "Kontener kickera, nagłówka i leadu: kolumna z odstępem clamp od 1,25 do 2,25 rem. Element czysto strukturalny – dziewięć klas __head i __hd robi dziś dokładnie to samo.",
      "przyklad": "<div class=\"c5-head\"><span class=\"c5-kicker c5-kicker--flush\">Parametry</span><h2 class=\"c5-h2\">Co dokładnie jest w worku</h2><p class=\"c5-lead\">Wartości z karty produktu – zakres, nie jedna liczba, bo pokład różni się partiami.</p></div>",
      "przyklad_tlo": "jasne",
      "kod": "ce/00-base.css – Wspólne CE nowego layoutu",
      "uzywany_w": [
        "CE-11",
        "CE-12",
        "CE-13",
        "CE-15",
        "CE-20",
        "CE-25",
        "CE-30",
        "CE-37",
        "CE-39",
        "CE-40",
        "CE-45",
        "CE-46",
        "CE-47"
      ],
      "zastepuje": [
        "c5-facts-head",
        "c5-season__head",
        "c5-pop__head",
        "pp-scene__head",
        "u-cr__hd",
        "u-lightbox__head",
        "c5hu-use__head",
        "c5-mt-proof__head"
      ],
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "c5-facts-head",
        "c5-season__head",
        "u-cr__hd",
        "i sześć innych"
      ]
    },
    "EL-12": {
      "nazwa": "Lead",
      "grupa": "typografia",
      "klasa": "c5-lead",
      "warianty": {
        "c5-lead--center": "wyśrodkowany",
        "c5-lead--hero": "większy, 1,125 rem – tylko w hero"
      },
      "opis": "Akapit wprowadzający pod nagłówkiem: 1 rem, kolor secondary, łamanie do 710 px. W hero rośnie do 1,125 rem i łamie się węziej.",
      "przyklad": "<p class=\"c5-lead\">Jeden składnik, który pracuje w glebie latami – nie nawóz na sezon, tylko trwała próchnica.</p><p class=\"c5-lead c5-lead--center\">Dwa warianty, jedno źródło – ten sam pokład lignitu.</p>",
      "przyklad_tlo": "jasne",
      "kod": "ce/00-base.css – Wspólne CE nowego layoutu",
      "uzywany_w": [
        "CE-08",
        "CE-11",
        "CE-12",
        "CE-14",
        "CE-15",
        "CE-18",
        "CE-20",
        "CE-25",
        "CE-30",
        "CE-37",
        "CE-39",
        "CE-40",
        "CE-45",
        "CE-46",
        "CE-47"
      ],
      "zastepuje": [
        "c5-hero__lead",
        "c5-facts-lead",
        "u-fz__lead",
        "u-lightbox__lead",
        "pp-scene__lead",
        "pp-farm__lead",
        "c5pr-read__lead",
        "c5pr-goals__lead",
        "c5hu-recipe__lead"
      ]
    },
    "EL-13": {
      "nazwa": "Akapit",
      "grupa": "typografia",
      "klasa": "c5-p",
      "warianty": {
        "c5-p--sm": "0,9375 rem – treść karty",
        "c5-p--xs": "0,875 rem",
        "c5-p--ondark": "na ciemnym tle"
      },
      "opis": "Zwykły akapit treści w CE, w dwóch rozmiarach zamiast szesnastu klas o nazwach __txt, __body i __desc. Decyzja z inwentarza §4: bazą jest 0,9375 rem ze wzorca ECO.",
      "przyklad": "<div class=\"sg-stos\"><p class=\"c5-p\">Lignit nie mineralizuje się jak obornik – zostaje w glebie kilkanaście lat.</p><p class=\"c5-p c5-p--sm\">Dawka zależy od zasobności gleby i uprawy; konfigurator liczy ją na hektar.</p></div>",
      "przyklad_tlo": "jasne",
      "kod": "do dopisania w ce/00-base.css (fala 2b)",
      "uzywany_w": [
        "CE-11",
        "CE-12",
        "CE-13",
        "CE-15",
        "CE-19",
        "CE-20",
        "CE-21",
        "CE-23",
        "CE-25",
        "CE-26",
        "CE-27",
        "CE-28",
        "CE-30",
        "CE-31",
        "CE-32",
        "CE-36",
        "CE-37",
        "CE-38",
        "CE-41",
        "CE-44",
        "CE-49"
      ],
      "zastepuje": [
        "c5-muted i 16 klas treści karty – m.in. c5-mt-card__txt, pp-kcard__body, c5-fact__body, c5hu-extra__body, pp-os__desc"
      ],
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "c5-muted",
        "c5-fact__body",
        "c5-mt-card__txt",
        "i 14 innych"
      ]
    },
    "EL-14": {
      "nazwa": "Przypis / źródło",
      "grupa": "typografia",
      "klasa": "c5-src",
      "warianty": {
        "c5-src--ondark": "na ciemnym tle – biel .8, nie .55"
      },
      "opis": "Linijka pod danymi, wykresem albo tabelą: skąd wzięta jest liczba. 0,75 rem w kolorze tertiary; na ciemnym tle biel .8, czyli więcej niż dotychczasowe .55 – świadoma poprawka kontrastu AA.",
      "przyklad": "<p class=\"c5-src\">Wartości z karty produktu, partia 2026/01.</p><div class=\"sg-ondark\"><p class=\"c5-src c5-src--ondark\">Stopień humifikacji – porównanie jakościowe wg materiałów producenta.</p></div>",
      "przyklad_tlo": "jasne",
      "kod": "ce/00-base.css – EL · Interface elements → EL-14",
      "uzywany_w": [
        "CE-10",
        "CE-12",
        "CE-20",
        "CE-22",
        "CE-24",
        "CE-25",
        "CE-30",
        "CE-32",
        "CE-40",
        "CE-41"
      ],
      "zastepuje": [
        "c5-viz__cap (6 stron, 37)",
        "c5pr-tab__note (14)",
        "c5-mt-stat__src (7)",
        "c5pr-block__src (5)",
        "c5-params__src (4 strony, 5)",
        "u-fz__src",
        "u-num__cap",
        "c5-lb__src",
        "c5pr-techsheet__src",
        "u-end__src",
        "c5hu-time__cap",
        "c5pr-lead-note"
      ]
    },
    "EL-15": {
      "nazwa": "Karta",
      "grupa": "pojemniki",
      "klasa": "c5-card",
      "warianty": {
        "c5-card--pad-sm": "padding 16 px",
        "c5-card--pad-lg": "padding clamp 1,5 – 2 rem",
        "c5-card--hover": "obrys ciemnieje po najechaniu",
        "c5-card--dashed": "obrys przerywany",
        "c5-card--dark": "odwrócona, na przyciemnionym tle",
        "c5-card--photo": "ze zdjęciem 4:3 nad treścią"
      },
      "opis": "Prostokąt z obrysem 1 px, bez cienia i bez promienia – anatomia wspólna dla 25 dzisiejszych klas kart i kafli. Największa pojedyncza wygrana inwentarza i zarazem największe ryzyko, dlatego robimy ją na końcu, stroną po stronie.",
      "przyklad": "<div class=\"sg-siatka\"><div class=\"c5-card\"><h3 class=\"c5-h3 c5-h3--md\">Dodatek do gleby</h3><p class=\"c5-p c5-p--sm\">Miesza się z glebą przed siewem.</p></div><div class=\"c5-card c5-card--hover c5-card--pad-sm\"><h3 class=\"c5-h3 c5-h3--md\">Ściółka</h3><p class=\"c5-p c5-p--sm\">Warstwa na powierzchni.</p></div></div>",
      "przyklad_tlo": "jasne",
      "kod": "do dopisania w ce/00-base.css (fala 2c)",
      "uzywany_w": [
        "CE-11",
        "CE-13",
        "CE-20",
        "CE-22",
        "CE-25",
        "CE-26",
        "CE-28",
        "CE-34",
        "CE-41",
        "CE-44",
        "CE-45",
        "CE-46",
        "CE-48",
        "CE-50",
        "CE-52"
      ],
      "zastepuje": [
        "25 klas kart i kafli – m.in. c5-mt-card, c5hu-tile, c5pr-block, pp-mcard, pp-kcard, u-fk__tile, u-cr__card, c5-var__tile, c5-use__box"
      ],
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "c5-mt-card",
        "pp-mcard",
        "u-fk__tile",
        "i 21 innych"
      ]
    },
    "EL-16": {
      "nazwa": "Chip",
      "grupa": "sterowanie",
      "klasa": "c5-chip",
      "warianty": {
        "c5-chip--dashed": "obrys przerywany – do zrobienia",
        "c5-chip--dotted": "obrys kropkowany – nie dotyczy",
        "c5-chip--solid": "obrys ciemny, pogrubiony – w trakcie",
        "c5-chip--ondark": "na ciemnym tle"
      },
      "opis": "Pigułka z obrysem i etykietą wersalikami – stan niesie STYL OBRYSU, nigdy kolor. To świadomy wzorzec z Próchnicy+, przeniesiony na wszystkie strony zamiast ośmiu podobnych pigułek.",
      "przyklad": "<div class=\"c5-btnrow\"><span class=\"c5-chip\">nowość</span><span class=\"c5-chip c5-chip--solid\">w trakcie</span><span class=\"c5-chip c5-chip--dashed\">do zrobienia</span><span class=\"c5-chip c5-chip--dotted\">nie dotyczy</span></div><div class=\"sg-ondark\"><span class=\"c5-chip c5-chip--ondark\">edycja 2026</span><span class=\"c5-chip c5-chip--ondark c5-chip--dashed\">w przygotowaniu</span></div>",
      "przyklad_tlo": "jasne",
      "kod": "ce/00-base.css – EL · Interface elements → EL-16",
      "uzywany_w": [
        "CE-10",
        "CE-11",
        "CE-12",
        "CE-20",
        "CE-22",
        "CE-24",
        "CE-28",
        "CE-30",
        "CE-37",
        "CE-40",
        "CE-46",
        "CE-49",
        "CE-50"
      ],
      "zastepuje": [
        "pp-ms__state i trzy jego stany (Próchnica+, 110)",
        "u-chip-prod i u-phase__chip (Kukurydza, 17)",
        "pp-chip i pp-chip--alt (8)",
        "c5-mt-chip (4)",
        "c5pr-gap, pp-todo, c5-gap, c5hu-todo (inline)",
        "u-num__chip",
        "c5hu-scope",
        "wf-badge z kitu"
      ]
    },
    "EL-17": {
      "nazwa": "Nota",
      "grupa": "pojemniki",
      "klasa": "c5-note",
      "warianty": {
        "c5-note--strong": "obrys ciemny – ostrzeżenie",
        "c5-note--soft": "obrys jasny, tekst secondary",
        "c5-note--rule": "tylko kreska u góry, bez ramki",
        "c5-note--dashed": "obrys przerywany – brak danych",
        "c5-note--sm": "mniejszy krój, 0,875 rem"
      },
      "opis": "Ikona i akapit w ramce: ostrzeżenie, wyjaśnienie pod FAQ, informacja o niezależności badania. Dziewięć klas miało tę samą anatomię – flex, odstęp 12 px, ikona wyrównana do pierwszego wiersza.",
      "przyklad": "<div class=\"sg-stos\"><div class=\"c5-note c5-note--strong\"><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-alert-triangle\"></use></svg><p>Nie mieszaj z nawozami wapniowymi w jednym przejeździe.</p></div><div class=\"c5-note c5-note--soft c5-note--sm\"><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-info-circle\"></use></svg><p>Wartości dotyczą partii z jednego pokładu – zakres, nie jedna liczba.</p></div><div class=\"c5-note c5-note--rule\"><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-flask\"></use></svg><p>Badanie prowadzi niezależne laboratorium.</p></div><div class=\"c5-note c5-note--dashed c5-note--sm\"><p>dane w uzupełnieniu</p></div></div>",
      "przyklad_tlo": "jasne",
      "kod": "ce/00-base.css – EL · Interface elements → EL-17",
      "uzywany_w": [
        "CE-17",
        "CE-28",
        "CE-31",
        "CE-37",
        "CE-40",
        "CE-48",
        "CE-50"
      ],
      "zastepuje": [
        "c5hu-warn i c5hu-warn--soft (CARBOHUMIC, 4)",
        "c5pr-note (Produkty, 3)",
        "pp-note (Próchnica+, 2)",
        "c5-mt-note (Mata, 2)",
        "c5-gap blokowy (HUMIC, 4)",
        "c5hu-faqnote",
        "pp-msg",
        "pp-person__indep"
      ]
    },
    "EL-18": {
      "nazwa": "Tab",
      "grupa": "sterowanie",
      "klasa": "c5-tab",
      "warianty": {
        "c5-tab--tile": "kafel z ikoną, 56 px",
        "c5-tab--compact": "kafel 44 px – pasek z sześcioma pozycjami",
        "c5-tab--text": "tekstowy, bez tła",
        "c5-tab--pill": "pigułka na ciemnym pasie"
      },
      "opis": "Przełącznik widoku w pięciu dzisiejszych mechanikach – kafel z ikoną, tab tekstowy, pigułka, radio i nagłówek klikalny. Baza to kafel ECO: 56 px, 1 rem, ikona w ramce ⌀36.",
      "przyklad": "<div class=\"sg-stos\"><button type=\"button\" class=\"c5-tab c5-tab--tile\" aria-selected=\"true\"><span class=\"c5-icoframe c5-icoframe--circle\"><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-arrows-sort\"></use></svg></span><span>Dodatek do gleby</span></button><button type=\"button\" class=\"c5-tab c5-tab--compact\" aria-selected=\"false\"><span class=\"c5-icoframe c5-icoframe--circle c5-icoframe--sm\"><svg class=\"wf-icon wf-icon--sm\" aria-hidden=\"true\"><use href=\"#ti-calendar\"></use></svg></span><span>2026</span></button></div>",
      "przyklad_tlo": "jasne",
      "kod": "c5.css (c5-way, c5-way--compact)",
      "uzywany_w": [
        "CE-10",
        "CE-11",
        "CE-13",
        "CE-19",
        "CE-29",
        "CE-30",
        "CE-45"
      ],
      "zastepuje": [
        "c5-way i trzy jego skale (110 / 56 / 44 px)",
        "c5pr-paths__tab",
        "c5-params__tab",
        "c5-mt-model__tab",
        "c5hu-mixlist__name",
        "c5-tco__h",
        "c5-yrs__seg",
        "c5-use__tab",
        "u-vtab"
      ],
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "c5-way",
        "c5-way--compact",
        "c5pr-paths__tab",
        "c5-params__tab"
      ]
    },
    "EL-19": {
      "nazwa": "Segment",
      "grupa": "sterowanie",
      "klasa": "c5-seg",
      "warianty": {
        "c5-seg--pill": "zaokrąglony kciuk"
      },
      "opis": "Przełącznik segmentowy z pływającym kciukiem – świadomie osobny element, bo ma inną mechanikę niż tab. Dziś jeden egzemplarz na Produktach i jedyne miejsce w serwisie, które używa cienia z kitu.",
      "przyklad": "<div class=\"c5-seg\" role=\"tablist\"><span class=\"c5-seg__thumb\"></span><button type=\"button\" class=\"c5-seg__tab\" aria-selected=\"true\"><span class=\"c5-seg__lbl\">doglebowo</span></button><button type=\"button\" class=\"c5-seg__tab\" aria-selected=\"false\"><span class=\"c5-seg__lbl\">dolistnie</span></button></div>",
      "przyklad_tlo": "jasne",
      "kod": "dziś produkty.css (c5pr-seg)",
      "uzywany_w": [
        "CE-39"
      ],
      "zastepuje": [
        "c5pr-seg i trzy klasy jego wnętrza (Produkty)"
      ],
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "c5pr-seg",
        "c5pr-seg__tab",
        "c5pr-seg__thumb",
        "c5pr-seg__lbl"
      ]
    },
    "EL-20": {
      "nazwa": "Akordeon",
      "grupa": "sterowanie",
      "klasa": "c5-faq",
      "warianty": {
        "c5-faq--plain": "pytanie nad odpowiedzią, pełna szerokość"
      },
      "opis": "Pytanie z lewej, odpowiedź z prawej od 900 px w górę; jedno pytanie otwarte naraz. Wariant --plain zdejmuje podział na kolumny tam, gdzie blok nie jest kolumną FAQ, tylko listą na pełnej szerokości.",
      "przyklad": "<div class=\"c5-faq\"><div class=\"c5-faq__item\"><button type=\"button\" class=\"c5-faq__q\" aria-expanded=\"false\" aria-controls=\"sg-faq-1\">Czym CARBOMAT ECO różni się od obornika?<svg class=\"wf-icon wf-icon--sm\" aria-hidden=\"true\"><use href=\"#ti-chevron-down\"></use></svg></button><div class=\"c5-faq__a\" id=\"sg-faq-1\"><div class=\"c5-faq__ain\">Obornik mineralizuje się w około trzy lata, lignit zostaje w glebie kilkanaście lat.</div></div></div><div class=\"c5-faq__item\"><button type=\"button\" class=\"c5-faq__q\" aria-expanded=\"false\" aria-controls=\"sg-faq-2\">Czy można przedawkować?<svg class=\"wf-icon wf-icon--sm\" aria-hidden=\"true\"><use href=\"#ti-chevron-down\"></use></svg></button><div class=\"c5-faq__a\" id=\"sg-faq-2\"><div class=\"c5-faq__ain\">Nie ma progu fitotoksyczności – dawka wynika z budżetu, nie z ryzyka.</div></div></div></div>",
      "przyklad_tlo": "jasne",
      "szeroki": true,
      "kod": "ce/CE-17-faq.css – FAQ oraz wariant --plain",
      "uzywany_w": [
        "CE-17"
      ],
      "zastepuje": [
        "wf-accordion__item / __trigger / __panel (Produkty, 3)",
        "pięć identycznych kopii reguł w arkuszach stron"
      ]
    },
    "EL-21": {
      "nazwa": "Tabela",
      "grupa": "dane",
      "klasa": "c5-table",
      "warianty": {
        "c5-table--num": "liczby wyrównane do prawej",
        "c5-table--sticky": "przyklejony nagłówek",
        "c5-table--ondark": "na ciemnym tle"
      },
      "opis": "Tabela danych: 0,875 rem, padding 12/16, nagłówek na tle subtle, podświetlany wiersz. Scala tabelę kitu z dwiema tabelami Maty; porównywarka z Produktów zostaje osobnym CE, bo ma własną mechanikę podświetlania kolumn.",
      "przyklad": "<table class=\"wf-table\"><thead><tr><th>Materiał</th><th>Sucha masa</th><th>Trwałość w glebie</th></tr></thead><tbody><tr><td>CARBOMAT ECO</td><td>~87%</td><td>kilkanaście lat</td></tr><tr><td>Obornik</td><td>~25%</td><td>około 3 lata</td></tr><tr><td>Kompost dojrzały</td><td>~40%</td><td>3 – 5 lat</td></tr></tbody></table>",
      "przyklad_tlo": "jasne",
      "szeroki": true,
      "kod": "dziś wireframe.css (wf-table)",
      "uzywany_w": [
        "CE-11",
        "CE-12",
        "CE-22",
        "CE-41"
      ],
      "zastepuje": [
        "wf-table z kitu (8 wystąpień na 5 stronach)",
        "c5-mt-cmp i c5-mt-tbl (Mata)",
        "u-mt (Kukurydza)"
      ],
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "wf-table",
        "c5-mt-cmp",
        "c5-mt-tbl",
        "u-mt"
      ]
    },
    "EL-22": {
      "nazwa": "Lista definicyjna",
      "grupa": "dane",
      "klasa": "c5-dl",
      "warianty": {
        "c5-dl--rows": "wiersze z kreską",
        "c5-dl--grid": "siatka kolumnowa",
        "c5-dl--ondark": "na ciemnym tle – kreska biała .35"
      },
      "opis": "Para nazwa – wartość: parametry produktu, dawki, specyfikacja opakowania. Jedenaście dzisiejszych list dl robi to samo w trzech układach, więc zostają trzy warianty jednej klasy.",
      "przyklad": "<dl class=\"c5-dl c5-dl--rows\"><div class=\"c5-dl__row\"><dt>Odczyn (pH)</dt><dd>4,5 – 5,0</dd></div><div class=\"c5-dl__row\"><dt>Sucha masa</dt><dd>~87%</dd></div><div class=\"c5-dl__row\"><dt>Substancje humusowe</dt><dd>do ~70%</dd></div></dl>",
      "przyklad_tlo": "jasne",
      "szeroki": true,
      "kod": "do dopisania w ce/00-base.css (fala 2b)",
      "uzywany_w": [
        "CE-10",
        "CE-13",
        "CE-14",
        "CE-20",
        "CE-25",
        "CE-28",
        "CE-36",
        "CE-37",
        "CE-39",
        "CE-45"
      ],
      "zastepuje": [
        "c5-params__rows (4 strony, 51 wierszy)",
        "c5hu-dose (34)",
        "u-defs (18)",
        "c5pr-foliar__rows (12)",
        "pp-facts (6)",
        "c5pr-specs (4)",
        "u-rows (4)",
        "c5-who__brief (6, CARBOMAT HUMIC)"
      ],
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "c5-params__rows",
        "c5hu-dose",
        "u-defs",
        "pp-facts",
        "i 7 innych"
      ]
    },
    "EL-23": {
      "nazwa": "Ikona",
      "grupa": "ikony",
      "klasa": "wf-icon",
      "warianty": {
        "wf-icon--sm": "16 × 16",
        "wf-icon--lg": "24 × 24",
        "wf-icon--muted": "przygaszona (zero użyć w V7)"
      },
      "opis": "Ikona liniowa z sprite: 20 × 20, obrys w kolorze tekstu, grubość z tokena. Jedyny element, który już działa jak style guide – 648 wystąpień na siedmiu stronach i ani jednego wyjątku.",
      "przyklad": "<div class=\"c5-btnrow\"><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-leaf\"></use></svg><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-droplet\"></use></svg><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-calendar\"></use></svg><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-flask\"></use></svg><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-truck\"></use></svg><svg class=\"wf-icon wf-icon--sm\" aria-hidden=\"true\"><use href=\"#ti-check\"></use></svg><svg class=\"wf-icon wf-icon--sm\" aria-hidden=\"true\"><use href=\"#ti-chevron-down\"></use></svg><svg class=\"wf-icon wf-icon--lg\" aria-hidden=\"true\"><use href=\"#ti-alert-triangle\"></use></svg></div>",
      "przyklad_tlo": "jasne",
      "kod": "wireframe.css – 5. ICON; sprite w v7/chrome.js",
      "uzywany_w": [
        "CE-08",
        "CE-09",
        "CE-10",
        "CE-11",
        "CE-12",
        "CE-15",
        "CE-17",
        "CE-20",
        "CE-21",
        "CE-22",
        "CE-23",
        "CE-25",
        "CE-27",
        "CE-30",
        "CE-31",
        "CE-34",
        "CE-35",
        "CE-37",
        "CE-39",
        "CE-40",
        "CE-44",
        "CE-46",
        "CE-48",
        "CE-49",
        "CE-50",
        "CE-53"
      ],
      "zastepuje": []
    },
    "EL-24": {
      "nazwa": "Ramka ikony",
      "grupa": "ikony",
      "klasa": "c5-icoframe",
      "warianty": {
        "c5-icoframe--circle": "koło ⌀36 w kolorze tekstu",
        "c5-icoframe--square": "kwadrat 44 px z obrysem strong",
        "c5-icoframe--sm": "⌀32 – pasek kompaktowy"
      },
      "opis": "Obrys wokół ikony w kaflu tabu albo w kafelku listy. Trzy klasy o tej samej geometrii schodzą do jednej z dwoma kształtami i jednym rozmiarem mniejszym.",
      "przyklad": "<div class=\"c5-btnrow\"><span class=\"c5-icoframe c5-icoframe--circle\"><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-arrows-sort\"></use></svg></span><span class=\"c5-icoframe c5-icoframe--circle c5-icoframe--sm\"><svg class=\"wf-icon wf-icon--sm\" aria-hidden=\"true\"><use href=\"#ti-calendar\"></use></svg></span><span class=\"c5-icoframe c5-icoframe--square\"><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-stack-2\"></use></svg></span></div>",
      "przyklad_tlo": "jasne",
      "kod": "ce/00-base.css – EL · Interface elements → EL-24",
      "uzywany_w": [
        "CE-09",
        "CE-11",
        "CE-20"
      ],
      "zastepuje": [
        "c5-way__ico (ECO, CARBOHUMIC, Próchnica+ – 11)",
        "c5hu-tile__ico (CARBOHUMIC, 4)",
        "c5-marq__ico"
      ]
    },
    "EL-25": {
      "nazwa": "Boks ilustracji",
      "grupa": "ikony",
      "klasa": "c5-viz",
      "warianty": {
        "c5-viz--light": "wersja jasna (dziś martwa kopia w c5.css)",
        "c5-viz--rosnie": "w układzie statycznym boks bierze wysokość treści, nie mniej niż 520 px, zamiast kafla 4:5 z przycinaniem",
        "c5-viz--luz-mobile": "do 456 px szerokości okna boks nie ma limitu wysokości i nie przycina treści"
      },
      "opis": "Ciemny kadr 4:5 pod rysunek, pierścień albo wykres: tło rgb(20 20 20 / .78), tekst biały, przypis pod spodem. Sześć stron ma wersję ciemną – jasna kopia w c5.css jest starsza i nigdzie nie wygrywa kaskadą.",
      "przyklad": "<div class=\"sg-waskie\"><figure class=\"c5-viz\"><span class=\"c5-viz__tag\">02 · Zasobność</span><div class=\"c5-viz__body\"><span class=\"c5-viz__num\">do 70%</span><p class=\"c5-muted\">udział substancji humusowych w suchej masie</p></div><figcaption class=\"c5-src c5-src--ondark\">Karta produktu, partia 2026/01.</figcaption></figure></div>",
      "przyklad_tlo": "jasne",
      "kod": "ce/CE-12-scena-faktow.css – kadr ilustracji",
      "uzywany_w": [
        "CE-12"
      ],
      "zastepuje": [
        "siedem kopii w arkuszach stron (osiem rozjechanych selektorów wnętrza)"
      ],
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "c5-viz (kopie w siedmiu arkuszach)",
        "pp-sviz (Próchnica+)"
      ]
    },
    "EL-26": {
      "nazwa": "Kafel liczby",
      "grupa": "dane",
      "klasa": "c5-stat",
      "warianty": {
        "c5-stat--sm": "1,5 rem",
        "c5-stat--md": "clamp 1,75 – 2,5 rem",
        "c5-stat--lg": "clamp 2 – 3 rem",
        "c5-stat--hero": "clamp 6 – 15 rem"
      },
      "opis": "Duża liczba z etykietą i przypisem – zasobność, wynik badania, rok. Osiem klas dawało dziś osiem różnych skal, zostają cztery stopnie jednej.",
      "przyklad": "<div class=\"sg-stos\"><span class=\"c5-overline\">Substancje humusowe</span><span class=\"c5-stat c5-stat--lg\">do 70%</span><p class=\"c5-src\">Zależnie od pokładu – karta produktu.</p></div>",
      "przyklad_tlo": "jasne",
      "kod": "do dopisania w ce/00-base.css (fala 2b)",
      "uzywany_w": [
        "CE-12",
        "CE-20",
        "CE-24",
        "CE-29",
        "CE-34",
        "CE-41"
      ],
      "zastepuje": [
        "c5-viz__num",
        "pp-liczba__num",
        "u-num__val",
        "c5pr-stat__num",
        "c5-diff__num",
        "c5-mt-stat__val",
        "c5-mt-delta__val",
        "c5-yrs__num"
      ],
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "c5-viz__num",
        "u-num__val",
        "i 5 innych"
      ]
    },
    "EL-27": {
      "nazwa": "Pasek postępu",
      "grupa": "dane",
      "klasa": "c5-bar",
      "warianty": {
        "c5-bar--hairline": "kreska 1 – 2 px sterowana scaleX",
        "c5-bar--thick": "tor 40 px",
        "c5-bar--ondark": "na ciemnym tle – tor biały .25",
        "c5-barchart--siatka": "na kontenerze wykresu w boksie ilustracji: wiersze na wspólnej siatce – kolumna etykiet tak szeroka jak najdłuższa etykieta, słupki zaczynają się w jednej linii"
      },
      "opis": "Poziomy wykres słupkowy: etykieta, tor z wypełnieniem i wartość. Wysokość wypełnienia steruje zmienna --bw; trzy cienkie paski postępu na stronach to dziś trzy kopie tej samej reguły.",
      "przyklad": "<div class=\"c5-barchart\"><div class=\"c5-bar\"><span class=\"wf-w-semibold\">Lignit</span><div class=\"c5-bar__track\"><div class=\"c5-bar__fill\" style=\"--bw:100%;\"></div></div><span class=\"c5-muted\">bardzo wysoki</span></div><div class=\"c5-bar\"><span>Torf</span><div class=\"c5-bar__track\"><div class=\"c5-bar__fill\" style=\"--bw:62%;\"></div></div><span class=\"c5-muted\">wysoki / średni</span></div><div class=\"c5-bar\"><span>Obornik</span><div class=\"c5-bar__track\"><div class=\"c5-bar__fill\" style=\"--bw:24%;\"></div></div><span class=\"c5-muted\">niski / średni</span></div></div>",
      "przyklad_tlo": "jasne",
      "kod": "ce/CE-12-scena-faktow.css – wykres słupkowy",
      "uzywany_w": [
        "CE-12",
        "CE-13",
        "CE-20",
        "CE-29",
        "CE-32",
        "CE-41",
        "CE-43"
      ],
      "zastepuje": [
        "c5-facts-progress, pp-prog, c5-yrs__segtrack – trzy kopie tej samej kreski",
        "c5hu-time__track",
        "u-kbar__track",
        "c5-use__bar"
      ]
    },
    "EL-28": {
      "nazwa": "Pole formularza",
      "grupa": "sterowanie",
      "klasa": "wf-input / wf-select / wf-textarea",
      "warianty": {},
      "opis": "Pola zostają z kitu, ale warstwa projektu zdejmuje im promień 8 px i podnosi wysokość do 44 px. To był jeden z dwóch najwyraźniejszych punktów dwóch stylów – jedyne zaokrąglone elementy w całym serwisie.",
      "przyklad": "<div class=\"sg-siatka\"><div class=\"wf-field\"><label class=\"wf-label\" for=\"sg-ha\">Powierzchnia (ha)</label><input class=\"wf-input\" id=\"sg-ha\" type=\"text\" value=\"12,5\"></div><div class=\"wf-field\"><label class=\"wf-label\" for=\"sg-up\">Uprawa</label><select class=\"wf-select\" id=\"sg-up\"><option>kukurydza</option><option>pszenica ozima</option></select></div></div><div class=\"wf-field\"><label class=\"wf-label\" for=\"sg-uw\">Uwagi</label><textarea class=\"wf-textarea\" id=\"sg-uw\" rows=\"2\"></textarea></div>",
      "przyklad_tlo": "jasne",
      "scena_id": "main",
      "kod": "ce/00-base.css – EL · Interface elements → EL-28",
      "uzywany_w": [
        "CE-47",
        "CE-50",
        "CE-52"
      ],
      "zastepuje": [
        "lokalne min-height:44px w prochnica-plus.css"
      ]
    },
    "EL-29": {
      "nazwa": "Kontener",
      "grupa": "pojemniki",
      "klasa": "c5-wrap",
      "warianty": {
        "c5-wrap--narrow": "węższa kolumna do czytania",
        "c5-wrap--wide": "szeroki kontener: od 900 px maks. 1800 px i 40 px bocznego marginesu (ramki Figma Mateusza z 18–19.09.2026); decyzją Mateusza z 19.09.2026 stała na nim cała Kukurydza, a 20.09.2026 sześć jej sekcji wróciło na 1180 px (Produkty, Zasada wyboru, Warianty, Mieszaniny, Skala, pas zamykający – w tym ostatnim kadr zostaje pełnoekranowy, wąska jest tylko treść); szeroki kontener został tam, gdzie stoją CE budowane wprost z ramek Figma: hero, liczby, program fazowy, decyzje, fakty i tablica warunków (CE-65 ma te same liczby we własnym kontenerze, panel liczb wyrównany ręcznie); pozostałe strony przejdą przy swoich przebudowach; od 19.09.2026 także Próchnica+ (poza Uczestnikami i Koordynatorami, które zostają na 1180 px)"
      },
      "opis": "Środkowa kolumna strony: maksymalnie 1180 px, boczny padding 20 px, wyśrodkowana. Osiem identycznych kopii w arkuszach stron zeszło do jednej definicji – zmierzone wartości są na siedmiu stronach takie same.",
      "przyklad": "<div class=\"c5-wrap sg-ramka\"><p class=\"c5-p\">Wszystko, co czyta się w tekście, mieści się w tej kolumnie – pasy tła idą pełną szerokością, treść nigdy.</p></div>",
      "przyklad_tlo": "jasne",
      "szeroki": true,
      "kod": "ce/00-base.css – Wspólne CE nowego layoutu",
      "uzywany_w": [
        "CE-08",
        "CE-10",
        "CE-11",
        "CE-12",
        "CE-14",
        "CE-16",
        "CE-17",
        "CE-18",
        "CE-20",
        "CE-24",
        "CE-29",
        "CE-30",
        "CE-32",
        "CE-37",
        "CE-39",
        "CE-40",
        "CE-44",
        "CE-45",
        "CE-46",
        "CE-47",
        "CE-48",
        "CE-49",
        "CE-50"
      ],
      "zastepuje": [
        "osiem identycznych kopii w arkuszach stron",
        "wf-container z kitu – zero użyć w V7"
      ]
    },
    "EL-30": {
      "nazwa": "Sekcja",
      "grupa": "pojemniki",
      "klasa": "c5-sec",
      "warianty": {
        "c5-sec--band": "jasny pas (dziś osobna klasa c5-band)",
        "c5-sec--dark": "ciemny pas",
        "c5-sec--flush": "bez odstępu pionowego"
      },
      "opis": "Pionowy rytm strony: padding-block clamp od 3,5 do 6,25 rem. Jasny pas jest dziś osobną klasą c5-band, a cztery strony mają własne warianty sekcji z sufiksem.",
      "przyklad": "<section class=\"c5-sec c5-band sg-ramka\"><div class=\"c5-wrap\"><h2 class=\"c5-h2\">Jasny pas</h2><p class=\"c5-lead\">Sekcja na tle --w-surface-subtle – rytm pionowy taki sam jak w sekcji zwykłej.</p></div></section>",
      "przyklad_tlo": "jasne",
      "szeroki": true,
      "kod": "ce/00-base.css – Wspólne CE nowego layoutu",
      "uzywany_w": [
        "CE-11",
        "CE-12",
        "CE-14",
        "CE-16",
        "CE-17",
        "CE-18",
        "CE-20",
        "CE-24",
        "CE-30",
        "CE-32",
        "CE-37",
        "CE-39",
        "CE-40",
        "CE-44",
        "CE-45",
        "CE-46",
        "CE-47",
        "CE-48",
        "CE-49",
        "CE-50"
      ],
      "zastepuje": [
        "siedem identycznych kopii w arkuszach stron",
        "c5-facts-sec, c5-dose-sec, c5-diff-sec, pp-scene-sec"
      ]
    },
    "EL-31": {
      "nazwa": "Sufiks liczby",
      "grupa": "dane",
      "klasa": "c5-aff",
      "warianty": {},
      "opis": "Jednostka, procent, mnożnik albo słowo przy wielkiej liczbie: 0,24 wysokości liczby, w kolorze liczby, wyrównane do górnej krawędzi cyfr. Znaki plus i minus zostają w rozmiarze liczby. Kontener liczby: flex, align-items flex-start, gap .12em, line-height 1; przesunięcie dostraja zmienna --c5-aff-pt.",
      "przyklad": "<p style=\"display:flex;align-items:flex-start;gap:.12em;margin:0;font-size:4.5rem;line-height:1;color:var(--w-text-primary)\">20–40<span class=\"c5-aff\">l/ha</span></p><p style=\"display:flex;align-items:flex-start;gap:.12em;margin:12px 0 0;font-size:4.5rem;line-height:1;color:var(--w-text-primary)\">+40<span class=\"c5-aff\">%</span></p>",
      "przyklad_tlo": "jasne",
      "kod": "ce/00-base.css – EL · Interface elements → EL-31",
      "uzywany_w": [
        "CE-24"
      ],
      "zastepuje": [
        "u-num__unit",
        "u-nb__unit",
        "pp-liczba__aff (jednostki)",
        "sufiksy w c5-mt-stat__val"
      ]
    },
    "EL-32": {
      "nazwa": "Węzeł z numerem",
      "grupa": "dane",
      "klasa": "c5-node",
      "warianty": {
        "c5-node--on": "pozycja aktywna: wypełnienie --w-gray-900, jasna cyfra"
      },
      "opis": "Mały kwadratowy znacznik z numerem: 24–25 px, obrys 1 px, cyfry 11 px krojem treści, tabelaryczne; stan aktywny wypełniony. Numeruje pozycje osi, listy albo karty. Dziś trzy lokalne kopie w CE zbudowanych z ramek Figma Mateusza (18–19.09.2026).",
      "przyklad": "<div class=\"sg-rzad\"><span class=\"c5-node\">01</span><span class=\"c5-node c5-node--on\">02</span><span class=\"c5-node\">03</span></div>",
      "przyklad_tlo": "jasne",
      "kod": "do dopisania w ce/00-base.css (fala 2b)",
      "uzywany_w": [
        "CE-65",
        "CE-66",
        "CE-67",
        "CE-68"
      ],
      "zastepuje": [
        "c5-tl__no (CE-65, oś faz)",
        "c5-cb__tabno (CE-66, tablica warunków)",
        "c5-kk__card::before (CE-67, karty z kadrem – licznik CSS)",
        "c5-fa__no (CE-68, akordeon faz)"
      ],
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "c5-tl__no",
        "c5-cb__tabno",
        "c5-kk__card::before",
        "c5-fa__no"
      ]
    },
    "EL-33": {
      "nazwa": "Boks produktu z packshotem",
      "grupa": "akcje",
      "klasa": "c5-prodbox",
      "warianty": {
        "c5-prodbox--plain": "produkt bez mapy zastosowań i packshotu: obrys przerywany, ikona zamiast zdjęcia, bez strzałki"
      },
      "opis": "Klikalny boks produktu: ramka 1 px, packshot na jasnym polu, pełna nazwa produktu, strzałka; otwiera mapę zastosowań produktu (data-lightbox-open). Dziś dwie lokalne kopie: w panelach faz i na tablicy warunków.",
      "przyklad": "<button class=\"c5-prodbox\" type=\"button\"><span class=\"c5-prodbox__pack\"></span><span class=\"c5-prodbox__name\">CARBOMAT ECO</span><svg class=\"wf-icon\" aria-hidden=\"true\"><use href=\"#ti-arrow-right\"></use></svg></button>",
      "przyklad_tlo": "jasne",
      "kod": "do dopisania w ce/00-base.css (fala 2b)",
      "uzywany_w": [
        "CE-65",
        "CE-66",
        "CE-68"
      ],
      "zastepuje": [
        "c5-tl__prod (CE-65, oś faz)",
        "c5-cb__prod (CE-66, tablica warunków)",
        "c5-fa__prod (CE-68, akordeon faz)"
      ],
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "c5-tl__prod",
        "c5-cb__prod",
        "c5-fa__prod"
      ]
    }
  }
};
