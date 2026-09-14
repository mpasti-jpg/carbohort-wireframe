/* ===========================================================================
   ce-rejestr.js – JEDYNE ŹRÓDŁO METADANYCH CONTENT ELEMENTÓW (CE)
   ---------------------------------------------------------------------------
   Kod CE-NN nadawany raz, nigdy nie zmieniany ani nie używany ponownie.
   Wystąpień tu NIE ma – wynikają ze znaczników data-ce="CE-NN" w HTML stron
   (skanuje je zasoby/kod/_narzedzia/ce-indeks.py, który generuje ce-indeks.html).
   Strony ładują ten plik jako ../ce-rejestr.js (obok status.js); używa go
   nakładka v5/ce-overlay.js do nazw w etykietach.
   W tekstach tylko cudzysłowy typograficzne „…” – prosty " łamie literał.
   Po edycji: node -e "const c=require('fs').readFileSync('zasoby/kod/ce-rejestr.js','utf8'); new Function('window',c)({})"
   Spec: 40-strona-www/koncepcja/content-elementy-spec.md
   =========================================================================== */
window.CW_CE = {
  "meta": {
    "zaktualizowano": "2026-09-14",
    "katalogWersji": "v7/",
    "indeks": "ce-indeks.html",
    "opis": "Rejestr content elementów (CE) makiet CarboHort V5: metadane klocków. Wystąpienia wynikają ze znaczników data-ce w HTML stron – skanuje je _narzedzia/ce-indeks.py. Spec: 40-strona-www/koncepcja/content-elementy-spec.md."
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
  "ce": {
    "CE-01": {
      "nazwa": "Nagłówek serwisu",
      "grupa": "wspolne",
      "opis": "Pasek nagłówka na całą szerokość: wordmark po lewej, główna nawigacja z trzema wyzwalaczami mega-menu na środku, przycisk CTA i przycisk menu mobilnego po prawej. Renderowany przez chrome.js ze znacznika cw-navbar.",
      "mechanika": "Wyzwalacze otwierają mega-menu (aria-expanded, przyciemnienie tła), pozycja bieżąca podświetlona z data-current; poniżej progu mobilnego pasek pokazuje przycisk otwierający nawigację mobilną. Obsługa w cw.js.",
      "baza": {
        "plik": "v7/chrome.js",
        "kotwica": "serwis-naglowek"
      },
      "kod": {
        "css": "wireframe.css (wf-navbar) + cw.css (cw-nav, cw-brand)",
        "js": "chrome.js (szablon NAVBAR) + cw.js (mega-menu)"
      },
      "czesci": [
        "wordmark",
        "3 wyzwalacze mega-menu",
        "przycisk CTA",
        "przycisk menu mobilnego",
        "przyciemnienie tła (cw-scrim)"
      ],
      "warianty": {},
      "uwagi": "Jeden plik dla całego serwisu: zmiana w menu = edycja chrome.js, nigdy podstron.",
      "zrzut": {
        "strona": "v7/carbomat.html",
        "maxh": 200
      }
    },
    "CE-02": {
      "nazwa": "Mega-menu",
      "grupa": "wspolne",
      "opis": "Panel rozwijany pod nagłówkiem: nagłówek panelu, kolumny odnośników albo boksy produktowe, stopka panelu. Trzy warianty układu zależnie od treści działu.",
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
        "nagłówek panelu",
        "kolumny odnośników albo boksy",
        "stopka panelu"
      ],
      "warianty": {
        "szerokie": "cztery boksy produktowe (Produkty Carbohort)",
        "domyslne": "trzy kolumny list (Rodzaje upraw)",
        "waskie": "jedna lista (Programy i badania)"
      },
      "uwagi": "CE zagnieżdżony w CE-01; ukryty do otwarcia.",
      "zrzut": {
        "strona": "v7/carbomat.html",
        "klik": "[data-mega-trigger][aria-controls=\"mega-produkty\"]",
        "maxh": 700
      }
    },
    "CE-03": {
      "nazwa": "Nawigacja mobilna",
      "grupa": "wspolne",
      "opis": "Panel nawigacji rozwijany pod paskiem nagłówka na wąskich ekranach: lista działów z pozycjami drugiego poziomu i CTA.",
      "mechanika": "Otwierany przyciskiem menu z nagłówka, z przyciemnieniem tła; pozycja bieżąca podświetlona (data-nav na obu poziomach). Obsługa w cw.js.",
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
        "pozycje drugiego poziomu",
        "CTA"
      ],
      "warianty": {},
      "uwagi": "Widoczna tylko poniżej progu mobilnego.",
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
      "opis": "Stopka na całą szerokość: cztery kolumny (marka i opis, odnośniki działów, produkty, kontakt) i pas dolny z prawami i odnośnikami prawnymi.",
      "mechanika": "Statyczna.",
      "baza": {
        "plik": "v7/chrome.js",
        "kotwica": "serwis-stopka"
      },
      "kod": {
        "css": "wireframe.css (wf-footer)",
        "js": "chrome.js (szablon FOOTER)"
      },
      "czesci": [
        "4 kolumny",
        "pas dolny"
      ],
      "warianty": {},
      "uwagi": "",
      "zrzut": {
        "strona": "v7/carbomat.html",
        "maxh": 700
      }
    },
    "CE-05": {
      "nazwa": "Dok doradcy",
      "grupa": "wspolne",
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
      "uwagi": "Element position: fixed – etykieta nakładki pojawia się, gdy dok jest widoczny.",
      "zrzut": {
        "strona": "v7/carbomat.html",
        "przewin": "#parametry",
        "maxh": 400
      }
    },
    "CE-06": {
      "nazwa": "Plakietka stanu prac",
      "grupa": "wspolne",
      "opis": "Niska plakietka w lewym dolnym rogu: etap, etykieta i odnośnik do zadania AC dla bieżącej podstrony.",
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
        "etap",
        "etykieta",
        "odnośnik AC"
      ],
      "warianty": {},
      "uwagi": "Nakładka CE stoi tuż nad plakietką.",
      "zrzut": {
        "strona": "v7/carbomat.html",
        "maxh": 60
      }
    },
    "CE-07": {
      "nazwa": "Nawigacja kropkowa",
      "grupa": "nawigacja",
      "opis": "Pionowa lista kropek przyklejona przy prawej krawędzi ekranu, jedna kropka na rozdział strony; etykiety rozdziałów wysuwają się po najechaniu na całą nawigację.",
      "mechanika": "Scrollspy po sekcjach z data-chapter (kropka aktywna większa), klik przewija płynnie do rozdziału (przez Lenis, gdy aktywny); mix-blend-mode difference na ciemnym tle; ukryta poniżej 900 px.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "nawigacja-kropki"
      },
      "kod": {
        "css": "<strona>.css ===== 10",
        "js": "<strona>.js ===== 10"
      },
      "czesci": [
        "lista kropek",
        "etykiety"
      ],
      "warianty": {},
      "uwagi": "Liczba i nazwy rozdziałów są treścią strony. Zastąpiła przyklejoną belkę subnawigacji (13.09).",
      "zrzut": {
        "maxh": 500
      }
    },
    "CE-08": {
      "nazwa": "Hero",
      "grupa": "otwarcie",
      "opis": "Pierwszy ekran pod menu serwisu (min-height 100svh minus menu). Lewa kolumna: kicker, H1, lead, rząd dwóch przycisków wyśrodkowane w pionie, dyskretny breadcrumb przy dolnej krawędzi. Prawa: jasnoszary panel z marginesem 30 px, a na jego środku packshoty, półka opakowań, kadr zdjęcia albo player.",
      "mechanika": "Statyczne; po zejściu z hero pojawia się dok doradcy (moduł 00 strony).",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "hero"
      },
      "kod": {
        "css": "<strona>.css /* --- HERO */",
        "js": "<strona>.js ===== 00 (updateDock)"
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
        "polka": "półka czterech opakowań rodzin (Produkty)",
        "kadr": "kadr zdjęcia uprawy zamiast packshotu (Kukurydza)",
        "player": "player filmu na panelu (Próchnica+)"
      },
      "uwagi": "Domyślnie 1–2 packshoty na panelu (strony produktowe).",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-09": {
      "nazwa": "Marquee",
      "grupa": "otwarcie",
      "opis": "Poziomy pas między hero a następną sekcją: duży tekst pozycji przeplatany kwadratowymi miniaturami (narożniki 12 px), tor zdublowany, 130 px odstępu góra i dół (80 px na telefonie).",
      "mechanika": "Pętla bez szwu (translateX -50 %, ok. 42 s), pauza po najechaniu; przy reduced-motion statyczny pas przewijany w poziomie.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "zalety"
      },
      "kod": {
        "css": "<strona>.css /* --- ZALETY */ (c5-marq)",
        "js": "brak (czysty CSS)"
      },
      "czesci": [
        "pozycje: tekst + miniatura"
      ],
      "warianty": {
        "z-ikona": "pozycja z ikoną przed tekstem (Próchnica+)"
      },
      "uwagi": "Liczba pozycji (3–4) jest treścią; tor musi być szerszy niż okno 2560 px.",
      "zrzut": {
        "maxh": 320
      }
    },
    "CE-10": {
      "nazwa": "Parametry na wideo",
      "grupa": "otwarcie",
      "opis": "Sekcja bez własnego tła, 30 px marginesu z boków, min-height 100svh: wideo w pętli przyklejone na całą wysokość sekcji pod maską, nad nim wyśrodkowana treść (tytuł, tabela dl, dyskretny link do analizy, przyciski karty i certyfikatów, przypis).",
      "mechanika": "Wideo sticky na czas sekcji, pauza przy reduced-motion (poster); treść przewija się po wideo, gdy dłuższa niż ekran. Moduł 30.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "parametry"
      },
      "kod": {
        "css": "<strona>.css /* --- PARAMETRY */ (c5-params)",
        "js": "<strona>.js ===== 30"
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
        "z-tabami": "dwa zestawy parametrów przełączane tabami nad tabelą (Mata)"
      },
      "uwagi": "Kontrast linii źródła (.c5-params__src) do poprawy na wszystkich stronach przy pushu zbiorczym (backlog).",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-11": {
      "nazwa": "Warianty na tabach",
      "grupa": "przelaczniki",
      "opis": "Pasek tabów wariantów przyklejony do górnej krawędzi na czas bloku, pod nim bloki wariantów jeden pod drugim: nazwa wyśrodkowana, scena kafle | packshot | kafle, dwie kolumny (aplikacja | opakowania z cennikiem).",
      "mechanika": "Taby nie ukrywają treści: klik przewija do bloku, scrollspy zaznacza tab bloku pod paskiem, pasek chowa się, gdy od dołu wchodzi następna sekcja. Moduł 40 (na Próchnica+ ta sama mechanika z c5.js).",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "ktory-dla-mnie"
      },
      "kod": {
        "css": "<strona>.css /* --- KTÓRY DLA MNIE */ (c5-ways, c5-variant)",
        "js": "<strona>.js ===== 40"
      },
      "czesci": [
        "tablist",
        "bloki wariantu: nazwa, kafle, packshot, kolumny",
        "cennik opakowań (c5-price)"
      ],
      "warianty": {
        "trzy-warianty": "trzy taby i trzy bloki (CARBOHUMIC)",
        "taby-lat": "taby lat i bloki lat w Wynikach (Próchnica+, kit c5)"
      },
      "uwagi": "Cennik opakowań w bloku wariantu to element interfejsu wspólny z CE-28 (lista opakowań).",
      "zrzut": {
        "maxh": 1400
      }
    },
    "CE-12": {
      "nazwa": "Scena faktów",
      "grupa": "sceny",
      "opis": "Scena sticky 100svh w wysokim torze: lewa kolumna z przyklejonym kickerem i H2 (opcjonalnie lead), jeden opis naraz przy dolnej krawędzi, pasek progresu ze znacznikami; prawa kolumna to panel na wysokość ekranu ze zmieniającym się zdjęciem i boksem ilustracji o stałym rozmiarze (kolory odwrócone).",
      "mechanika": "Pozycja przewijania wybiera krok (N kroków po ok. 80 % okna każdy), zdjęcie panelu crossfade, ilustracja podmieniana; poniżej 900 px, przy reduced-motion i bez JS bloki stoją jeden pod drugim. Moduł 50.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "czym-jest"
      },
      "kod": {
        "css": "<strona>.css /* --- CZYM JEST */ (c5-facts, c5-viz)",
        "js": "<strona>.js ===== 50"
      },
      "czesci": [
        "kicker + h2 (+ lead)",
        "N opisów",
        "pasek progresu",
        "panel zdjęcia",
        "boks ilustracji"
      ],
      "warianty": {
        "naglowek-nad-scena": "nagłówek i lead nad torem, w scenie tylko opis punktu (Mata)",
        "osiem-krokow": "8 kroków, kroki 2–6 na wspólnym zdjęciu (CARBOMAT HUMIC)",
        "z-leadem": "dwa akapity leadu przyklejone razem z nagłówkiem (Próchnica+ Metodologia)"
      },
      "uwagi": "Liczba kroków (4–8) jest treścią; jeden moduł czyta ją z DOM.",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-13": {
      "nazwa": "Przypięta scena produktu",
      "grupa": "sceny",
      "opis": "Jeden article na produkt lub wariant: tor 100svh plus kilka ekranów, scena sticky; packshot z nazwą maleje do przyklejonego pasa z przyciskiem, zdjęcie rośnie od dołu, kartka opisu wjeżdża, taby kadrów przełączają zdjęcie i kartkę; napisy gasną na końcu.",
      "mechanika": "Wszystko interpolowane z pozycji przewijania (bez przejść w czasie), taby klikalne; poniżej 900 px pas jako blok i kadry jeden pod drugim. Moduł 60; wersja N kadrów liczy tor z liczby kadrów.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "jak-stosowac-eco"
      },
      "kod": {
        "css": "<strona>.css /* --- JAK STOSOWAĆ */ (c5-use)",
        "js": "<strona>.js ===== 60"
      },
      "czesci": [
        "packshot z nazwą",
        "pas z przyciskiem",
        "zdjęcie kadru",
        "kartka opisu",
        "taby kadrów"
      ],
      "warianty": {
        "n-kadrow": "N kadrów = N terminów, tor liczony z liczby kadrów (CARBOHUMIC)"
      },
      "uwagi": "Nagłówek sekcji „Jak stosować” stoi nad pierwszym article (data-ce-od).",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-14": {
      "nazwa": "Sekcja 100svh z listą i zdjęciem",
      "grupa": "sceny",
      "opis": "Sekcja na wysokość ekranu, 30 px góra i dół: lewa kolumna z kickerem i H2 u góry oraz listą ol z numerami w kółkach i przyciskiem u dołu; prawa kolumna to zdjęcie na całą wysokość.",
      "mechanika": "Lekki parallax zdjęcia z pozycji przewijania (tylko motionOn); poniżej 900 px zdjęcie nad listą. Moduł 70.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "dawka"
      },
      "kod": {
        "css": "<strona>.css /* --- DAWKOWANIE */ (c5-dose)",
        "js": "<strona>.js ===== 70"
      },
      "czesci": [
        "kicker + h2",
        "lista ol",
        "przycisk",
        "zdjęcie"
      ],
      "warianty": {},
      "uwagi": "",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-15": {
      "nazwa": "Przypięte wiersze z packshotem",
      "grupa": "sceny",
      "opis": "Nagłówek (kicker, H2, lead) przyklejony na czas cyklu; blok wierszy wchodzi w biegu z pierwszym wierszem otwartym i przykleja się dolną krawędzią; wiersz = tytuł | kwadratowa scena z packshotem | nazwa, opis, przycisk.",
      "mechanika": "Dalsze przewijanie otwiera kolejne wiersze (kwadrat rozwija się od dołu, potem wjeżdża packshot), po ostatnim całość odjeżdża; bez ruchu akordeon na klik z pierwszym otwartym; bez JS wszystkie otwarte. Moduł 80.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "sezon-wiersze"
      },
      "kod": {
        "css": "<strona>.css /* --- SEZON */ (c5-season)",
        "js": "<strona>.js ===== 80"
      },
      "czesci": [
        "nagłówek przyklejony",
        "wiersze: tytuł, scena, packshot, opis, przycisk"
      ],
      "warianty": {},
      "uwagi": "Na Produktach ten sam pin niesie „efekty w czasie”.",
      "zrzut": {
        "maxh": 1000
      }
    },
    "CE-16": {
      "nazwa": "Pas PRO",
      "grupa": "sceny",
      "opis": "Pas na szarym tle: kadr zdjęcia z narożnikami 30 px, pod nim nagłówek po lewej oraz akapit i dwa przyciski po prawej.",
      "mechanika": "Kadr skaluje się od .5 do 1, gdy górna krawędź sekcji schodzi poniżej 75 % okna (koniec przy 10 %); statyczny kadr 3:2 na telefonie. Moduł 80/85.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "uprawy-profesjonalne"
      },
      "kod": {
        "css": "<strona>.css /* --- Pas PRO */ (c5-pro)",
        "js": "<strona>.js updatePro"
      },
      "czesci": [
        "kadr",
        "h2",
        "akapit",
        "rząd 2 przycisków"
      ],
      "warianty": {
        "zamykajacy": "bez akapitu: nagłówek po lewej, dwa przyciski po prawej (Kukurydza)"
      },
      "uwagi": "Na CARBOMAT ECO i CARBOMAT HUMIC stoi wewnątrz sekcji Sezon, na pozostałych jako osobna sekcja.",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-17": {
      "nazwa": "FAQ",
      "grupa": "przelaczniki",
      "opis": "Kicker i H2, pod nimi akordeon pytań: pytanie po lewej, odpowiedź po prawej, wszystkie zwinięte na starcie.",
      "mechanika": "Jedno pytanie otwarte naraz (panelSet animuje wysokość), otwarcie z kotwicy; bez JS wszystkie odpowiedzi widoczne. Moduł 90.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "faq"
      },
      "kod": {
        "css": "<strona>.css /* --- FAQ */ (c5-faq)",
        "js": "<strona>.js ===== 90"
      },
      "czesci": [
        "kicker + h2",
        "pozycje: pytanie + odpowiedź"
      ],
      "warianty": {
        "z-nota": "nota o statusie odpowiedzi między nagłówkiem a akordeonem (CARBOHUMIC)"
      },
      "uwagi": "Moduł „zadaj pytanie” zdjęty 13.09.",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-18": {
      "nazwa": "CTA wyśrodkowane",
      "grupa": "noty-i-cta",
      "opis": "Wyśrodkowany H2 (opcjonalnie lead) i rząd przycisków.",
      "mechanika": "Statyczne.",
      "baza": {
        "plik": "v7/carbomat.html",
        "kotwica": "cta-koncowe"
      },
      "kod": {
        "css": "<strona>.css /* --- CTA końcowe */ (c5-cta)",
        "js": "brak"
      },
      "czesci": [
        "h2",
        "lead (opcjonalnie)",
        "rząd przycisków"
      ],
      "warianty": {
        "na-pasie": "na jasnym pasie c5-band w środku strony (CARBOHUMIC „Dobierz produkt”)",
        "z-leadem": "z akapitem pod nagłówkiem (Mata)"
      },
      "uwagi": "",
      "zrzut": {
        "maxh": 500
      }
    },
    "CE-19": {
      "nazwa": "Model interaktywny",
      "grupa": "przelaczniki",
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
      "uwagi": "Jedyne wystąpienie (model rękawa maty).",
      "zrzut": {
        "maxh": 800
      }
    },
    "CE-20": {
      "nazwa": "Siatka kart",
      "grupa": "karty",
      "opis": "Siatka kart auto-fit (2–5 kolumn zależnie od szerokości), karta w ramce: ikona, numer, zdjęcie albo packshot, tytuł, akapit, opcjonalnie lista dl i rząd przycisków.",
      "mechanika": "Statyczna albo z jednorazowym wejściem od dołu po wejściu w widok (data-reveal, IntersectionObserver, stagger 80–90 ms); poniżej 900 px, przy reduced-motion i bez JS karty po prostu widoczne; w wariancie produktowym na telefonie karuzela scroll-snap.",
      "baza": {
        "plik": "v7/carbohumic.html",
        "kotwica": "jaka-gleba-kafle"
      },
      "kod": {
        "css": "per strona: c5-mt-grid, c5hu-tiles/c5hu-mix, c5pr-goals/c5pr-foliar/c5pr-read, u-cards/u-rules, pp-cards/pp-tiles/pp-rels/pp-charts",
        "js": "reveal: moduł 72 (Carbohumic, Produkty), 02 (Próchnica+), u-reveal (uprawa.js)"
      },
      "czesci": [
        "karty: ikona / numer / zdjęcie / packshot",
        "tytuł",
        "akapit",
        "lista dl (opcjonalnie)",
        "rząd przycisków (opcjonalnie)"
      ],
      "warianty": {
        "z-ikona": "ikona w kółku, tytuł, akapit",
        "numerowane": "numer porządkowy zamiast ikony",
        "ze-zdjeciem": "zdjęcie 4:3 u góry karty",
        "z-przyciskami": "zdjęcie lub packshot, opis, rząd przycisków przy dolnej krawędzi",
        "produktowe": "packshot na szarym polu, cała karta jednym linkiem (Kukurydza)",
        "kafle-danych": "wartość x → y, mini-wykres słupków, chip stanu (Mata)",
        "ostrzegawcze": "karta z ikoną x na przygaszonym tle",
        "sloty-poziome": "miniatura 16:9 obok tekstu (Próchnica+)",
        "miejsca-na-wykresy": "numer, placeholder 16:9, podpis",
        "szerokie": "dwie szerokie karty"
      },
      "uwagi": "Najczęstszy klocek serwisu (ponad 20 wystąpień) z osobnymi klasami na każdej stronie – pierwszy kandydat do konsolidacji kodu (faza 2).",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-21": {
      "nazwa": "Dwie kolumny przewag",
      "grupa": "karty",
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
      "uwagi": "Jedyne wystąpienie („Co zastępujesz”).",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-22": {
      "nazwa": "Tabela",
      "grupa": "dane",
      "opis": "Samodzielna tabela w kontenerze przewijanym w poziomie na wąskich ekranach (cw-scrollx, tabindex), nagłówki kolumn, opcjonalnie packshoty w nagłówkach i przypis pod tabelą.",
      "mechanika": "Statyczna; wariant z klikalnymi wierszami otwiera lightbox; wiersze mogą wchodzić z reveal.",
      "baza": {
        "plik": "v7/produkty.html",
        "kotwica": "doglebowo-tabela"
      },
      "kod": {
        "css": "per strona: c5-mt-cmp/c5-mt-tbl, c5hu-cmp, c5pr-cmp/c5pr-cert, u-mt",
        "js": "kukurydza.js ===== 80 (klikalne wiersze)"
      },
      "czesci": [
        "thead",
        "tbody",
        "przypis"
      ],
      "warianty": {
        "porownawcza": "kolumny = porównywane pozycje (2×6, 3 podłoża)",
        "danych": "kolumny liczbowe wyrównane do prawej (analiza, certyfikaty)",
        "z-packshotami": "packshoty nad etykietami kolumn (CARBOHUMIC)",
        "klikalne-wiersze": "klik w wiersz otwiera stronę lightboxa (Kukurydza)"
      },
      "uwagi": "Tabela technikaliów na Produktach to osobny CE-40 (ma własną mechanikę).",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-23": {
      "nazwa": "Pas CTA",
      "grupa": "noty-i-cta",
      "opis": "Pas na szerokość kolumny między kreską górną (i dolną): po lewej tekst (zdanie wytłuszczone + zdanie drugorzędne, opcjonalnie ikona albo h4 w osobnej kolumnie), po prawej jeden lub dwa przyciski.",
      "mechanika": "Statyczne; poniżej 900 px przyciski schodzą pod tekst.",
      "baza": {
        "plik": "v7/produkty.html",
        "kotwica": "wg-potrzeby-pas"
      },
      "kod": {
        "css": "per strona: c5-cmp2__cta, c5-mt-cross, c5-proofs__cta, c5pr-bar, c5-who__note",
        "js": "brak"
      },
      "czesci": [
        "kreski",
        "ikona (opcjonalnie)",
        "tekst",
        "h4 (opcjonalnie)",
        "1–2 przyciski"
      ],
      "warianty": {
        "z-ikona": "ikona przed tekstem, kreski góra i dół",
        "kreski-gora-dol": "bez ikony, kreski góra i dół (Mata cross-sell)",
        "dwa-przyciski": "tekst i dwa przyciski, tylko kreska górna",
        "z-naglowkiem": "h4 w lewej kolumnie, tekst i przycisk w prawej"
      },
      "uwagi": "Pięć różnych klas o tym samym kształcie – kandydat do jednej klasy w fazie 2.",
      "zrzut": {
        "maxh": 300
      }
    },
    "CE-24": {
      "nazwa": "Ciemny pas liczb",
      "grupa": "dane",
      "opis": "Ciemny kadr z marginesem 30 px na wysokość ekranu: tytuł u góry po lewej, wiersze „etykieta i podpis | wielka liczba z jednostką” rozdzielone cienkimi liniami.",
      "mechanika": "Wiersze wchodzą od dołu ze staggerem przy pierwszym wejściu w widok (Mata), cyfry odliczają od zera (Kukurydza) albo wjeżdżają kołowrotkiem (Próchnica+); bez JS i przy reduced-motion od razu wartości końcowe.",
      "baza": {
        "plik": "v7/carbomat-mata.html",
        "kotwica": "dowod-liczby"
      },
      "kod": {
        "css": "per strona: c5-stats (Mata), u-num (Kukurydza), pp-liczby (Próchnica+)",
        "js": "carbomat-mata.js ===== 55 / uprawa.js data-count / prochnica-plus.js ===== 60"
      },
      "czesci": [
        "tytuł",
        "wiersze: etykieta, podpis, liczba, jednostka",
        "źródło"
      ],
      "warianty": {
        "odliczanie": "liczby odliczają od zera (Kukurydza)",
        "kolowrotek": "cyfry wjeżdżają kołowrotkiem (Próchnica+)"
      },
      "uwagi": "Wzór: serverobotics.com (uwaga Mateusza 14.09).",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-25": {
      "nazwa": "Lightbox wielostronicowy",
      "grupa": "nakladki",
      "opis": "Nakładka na całą stronę z panelem przewijanym: przycisk zamknięcia, N stron treści (każda z nagłówkiem i stopką), licznik „n / N”.",
      "mechanika": "Otwierany linkiem data-lightbox-open albo hashem, fokus-trap, Escape, tło inert i zablokowane przewijanie; bez JS strony renderują się jako zwykłe bloki pod sekcją. Moduł 55 (Mata) / uprawa.js (Kukurydza).",
      "baza": {
        "plik": "v7/carbomat-mata.html",
        "kotwica": "dowod-lb"
      },
      "kod": {
        "css": "carbomat-mata.css ===== 55 (c5-lb) / uprawa.css 8 (u-lightbox)",
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
        "popup-produktu": "strona = mapa zastosowań produktu z packshotem w nagłówku i własną stopką (Kukurydza)"
      },
      "uwagi": "Treść stron lightboxa to zwykłe klocki (np. CE-20) oznaczone jako zagnieżdżone.",
      "zrzut": {
        "hash": "dowod-sggw",
        "maxh": 800
      }
    },
    "CE-26": {
      "nazwa": "Stos kart",
      "grupa": "sceny",
      "opis": "Karty kroków jedna pod drugą; każda karta: numer, tytuł, opis, zdjęcie, dopisek fazy.",
      "mechanika": "Karty przyklejają się kolejno i nakładają na siebie przy przewijaniu (transform z pozycji scrolla, tylko motionOn); bez ruchu zwykły stos. Moduł 60 (Mata) / 72 (Carbohumic).",
      "baza": {
        "plik": "v7/carbomat-mata.html",
        "kotwica": "przygotowanie-protokol"
      },
      "kod": {
        "css": "carbomat-mata.css ===== 60 (c5-steps)",
        "js": "carbomat-mata.js ===== 60"
      },
      "czesci": [
        "karty: numer, tytuł, opis, zdjęcie, dopisek"
      ],
      "warianty": {},
      "uwagi": "Wzór: portfolio.widehue.co/rezonbio.",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-27": {
      "nazwa": "Blok materiału",
      "grupa": "noty-i-cta",
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
      "uwagi": "Przydatny także w Centrum wiedzy.",
      "zrzut": {
        "maxh": 200
      }
    },
    "CE-28": {
      "nazwa": "Boks w ramce",
      "grupa": "noty-i-cta",
      "opis": "Obramowany boks (1 px) z tytułem i akapitem; wnętrze w jednej lub dwóch kolumnach, opcjonalnie rozpiska dl, lista opakowań, przypis i przyciski.",
      "mechanika": "Statyczne; poniżej 900 px jedna kolumna.",
      "baza": {
        "plik": "v7/carbomat-mata.html",
        "kotwica": "analiza-nota"
      },
      "kod": {
        "css": "per strona: c5-mt-note (Mata), c5hu-note/c5hu-extra/c5hu-foliar (Carbohumic)",
        "js": "brak"
      },
      "czesci": [
        "tytuł",
        "akapit",
        "rozpiska dl / lista / przypis (opcjonalnie)",
        "przyciski (opcjonalnie)"
      ],
      "warianty": {
        "z-przyciskiem": "tytuł, akapit z oznaczeniem braku danych, przycisk (Mata)",
        "z-rozpiska": "nazwa i akapit | rozpiska dl (Carbohumic)",
        "lista-opakowan": "etykieta i zdanie | wiersze opakowań z miniaturami (Carbohumic)",
        "cross-sell": "h3, akapit, przypis, rząd przycisków (Carbohumic)"
      },
      "uwagi": "Różni się od CE-31 (nota) tym, że niesie treść blokową, nie jedno zdanie z ikoną.",
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
      "uwagi": "Jedyne wystąpienie; na CARBOMAT ECO tę rolę pełni CE-15.",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-30": {
      "nazwa": "Lista z panelem opisu",
      "grupa": "przelaczniki",
      "opis": "Dwie kolumny: po lewej lista dużych tytułów (z numerami), po prawej przyklejony panel z opisem aktywnej pozycji (opcjonalnie przycisk); na telefonie akordeon.",
      "mechanika": "Najechanie podgląda, klik wybiera, strzałki nawigują, kotwice trafiają w pozycje; bez JS wszystkie opisy otwarte. Moduły 50 (Produkty), 72 (Carbohumic), 80 (Mata), 40 (Kukurydza).",
      "baza": {
        "plik": "v7/produkty.html",
        "kotwica": "wg-potrzeby-sciezki"
      },
      "kod": {
        "css": "per strona: c5pr-paths, c5hu-mixlist, c5-tco, u-fz",
        "js": "produkty.js ===== 50"
      },
      "czesci": [
        "lista tytułów",
        "panel opisu",
        "przycisk w panelu (opcjonalnie)"
      ],
      "warianty": {
        "z-lightboxem": "panel ma przycisk otwierający pełny opis w lightboxie (Kukurydza fazy)"
      },
      "uwagi": "Cztery implementacje tej samej mechaniki – kandydat do konsolidacji.",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-31": {
      "nazwa": "Nota",
      "grupa": "noty-i-cta",
      "opis": "Obramowany pas z małą ikoną i jednym–dwoma zdaniami (wstęp wytłuszczony), opcjonalnie przycisk po prawej; wariant „brak danych” to akapit w ramce z kreski przerywanej.",
      "mechanika": "Statyczne (role note).",
      "baza": {
        "plik": "v7/carbohumic.html",
        "kotwica": "ktory-dla-mnie-ostrzezenie"
      },
      "kod": {
        "css": "per strona: c5hu-warn/c5hu-faqnote, c5-gap, u-callout, pp-note",
        "js": "brak"
      },
      "czesci": [
        "ikona",
        "zdanie główne",
        "zdanie wyjaśniające (opcjonalnie)",
        "przycisk (opcjonalnie)"
      ],
      "warianty": {
        "miekka": "mniejsza ikona, tło strony",
        "z-przyciskiem": "ciemny przycisk po prawej",
        "brak-danych": "ramka z kreski przerywanej, bez ikony (helper c5-gap)"
      },
      "uwagi": "Wewnątrz innych bloków (przypis pod tabelą, ostrzeżenie w lightboxie) nota jest częścią bloku, nie osobnym CE.",
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
      "uwagi": "Jedyne wystąpienie („Skala czasu”).",
      "zrzut": {
        "maxh": 700
      }
    },
    "CE-33": {
      "nazwa": "Cytat lub zasada",
      "grupa": "noty-i-cta",
      "opis": "Wyróżnione jedno zdanie lub akapit: duży cytat z pionową kreską i cudzysłowami z CSS, ciemny boks z etykietą wersalikami, albo pasek pod grubą kreską z etykietą i zdaniem.",
      "mechanika": "Statyczne (opcjonalnie reveal).",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "rzetelnosc-cytat"
      },
      "kod": {
        "css": "per strona: pp-quote, u-quote, c5hu-rule",
        "js": "brak"
      },
      "czesci": [
        "etykieta (opcjonalnie)",
        "zdanie lub akapit"
      ],
      "warianty": {
        "ciemny-boks": "ciemne tło, etykieta wersalikami, duży akapit (Kukurydza)",
        "pasek-zasady": "gruba kreska górna, etykieta i wytłuszczone zdanie w jednym wierszu (Carbohumic)",
        "cytat": "blockquote z kreską i cudzysłowami"
      },
      "uwagi": "",
      "zrzut": {
        "maxh": 400
      }
    },
    "CE-34": {
      "nazwa": "Karty od → do",
      "grupa": "karty",
      "opis": "Siatka kart równej wysokości; karta czyta się jak zdanie na trzech poziomach: stan wyjściowy lub warunek u góry, łącznik ze strzałką, stan docelowy lub odpowiedź u dołu; opcjonalnie tag produktu i packshot obok.",
      "mechanika": "Jednorazowe wejście ze staggerem (reveal), po wejściu dociąga się kreska łącznika; w wariancie reguł cała karta jest linkiem do lightboxa i ma dwa układy (produkt pod zdaniem albo w prawej kolumnie od 1100 px).",
      "baza": {
        "plik": "v7/carbomat-humic.html",
        "kotwica": "roznice-karty"
      },
      "kod": {
        "css": "carbomat-humic.css (c5-diff) / kukurydza.css ===== 35 (u-rl)",
        "js": "carbomat-humic.js ===== 35 / uprawa.js u-reveal"
      },
      "czesci": [
        "numer",
        "od: tag + zdanie",
        "łącznik",
        "do: tag + zdanie",
        "packshot (opcjonalnie)"
      ],
      "warianty": {
        "przemiana": "cztery karty CARBOMAT ECO → CARBOMAT HUMIC",
        "regula-z-packshotem": "warunek → odpowiedź + produkt, karta jako link (Kukurydza)"
      },
      "uwagi": "",
      "zrzut": {
        "maxh": 700
      }
    },
    "CE-35": {
      "nazwa": "Panel kryteriów z CTA",
      "grupa": "noty-i-cta",
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
      "uwagi": "Kandydat na blok „dla kogo / kiedy wybrać” na pozostałych stronach produktowych.",
      "zrzut": {
        "maxh": 500
      }
    },
    "CE-36": {
      "nazwa": "Wiersz zdjęcie | opis",
      "grupa": "karty",
      "opis": "Dwie równe kolumny wyrównane do środka: kadr zdjęcia 4:5 z jednej strony, z drugiej nazwa, zajawka, blok dawek i przycisk; kolejne wiersze naprzemiennie.",
      "mechanika": "Parallax kadru z pozycji przewijania, wejście kolumny opisu (reveal), przycisk otwiera pop-up z pełną kartą (CE-37); poniżej 900 px zdjęcie nad tekstem. Moduł 40.",
      "baza": {
        "plik": "v7/carbomat-humic.html",
        "kotwica": "wariant-pro"
      },
      "kod": {
        "css": "carbomat-humic.css (c5-who)",
        "js": "carbomat-humic.js ===== 40"
      },
      "czesci": [
        "kadr zdjęcia",
        "h3",
        "zajawka",
        "blok dawek",
        "przycisk"
      ],
      "warianty": {
        "odwrocony": "opis po lewej, zdjęcie po prawej"
      },
      "uwagi": "",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-37": {
      "nazwa": "Pop-up karty",
      "grupa": "nakladki",
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
      "uwagi": "Pop-up wg lightboxu kukurydzy (CE-25).",
      "zrzut": {
        "klik": "#wariant-pro [data-pop-open]",
        "maxh": 800
      }
    },
    "CE-38": {
      "nazwa": "Dwa panele fotograficzne",
      "grupa": "karty",
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
      "uwagi": "Zastąpił przypięte wiersze (CE-15) na CARBOMAT HUMIC (uwaga Mateusza 14.09).",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-39": {
      "nazwa": "Pokaz rodzin na tabach",
      "grupa": "przelaczniki",
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
        "panele rodzin: packshot, nazwa, obietnica, przyciski, dl"
      ],
      "warianty": {},
      "uwagi": "Wzór: rivian.com/r1s.",
      "zrzut": {
        "maxh": 1100
      }
    },
    "CE-40": {
      "nazwa": "Tabela technikaliów z podświetlaniem kolumn",
      "grupa": "dane",
      "opis": "Wyśrodkowany nagłówek, tabela pięciu kolumn (parametr | cztery rodziny) ze stopką przycisków dokumentów i przypisem, pod nią zasada ogólna i trzy karty uwag z przyciskami „pokaż w tabeli”, na końcu rząd przycisków nawigacyjnych.",
      "mechanika": "Od 900 px wiersz nagłówka przykleja się do górnej krawędzi; poniżej tabela przewija się w bok z przypiętą pierwszą kolumną; przycisk karty podświetla kolumnę (is-pick) z błyskiem nagłówka. Moduł 40.",
      "baza": {
        "plik": "v7/produkty.html",
        "kotwica": "porownanie"
      },
      "kod": {
        "css": "produkty.css ===== 40 (c5pr-techsheet)",
        "js": "produkty.js ===== 40"
      },
      "czesci": [
        "tabela",
        "przyciski dokumentów",
        "przypis",
        "karty uwag sterujące",
        "rząd przycisków"
      ],
      "warianty": {},
      "uwagi": "Osobny CE, nie port Parametrów (CE-10) – decyzja Mateusza 14.09.",
      "zrzut": {
        "maxh": 1400
      }
    },
    "CE-41": {
      "nazwa": "Bloki wiedzy (para)",
      "grupa": "karty",
      "opis": "Dwa bloki w ramkach: każdy z h3, wizualem (tabela, skala, wykres słupkowy, lista źródeł z kaflami liczb) i przypisem; obok siebie albo jeden pod drugim na całą szerokość.",
      "mechanika": "Jednorazowe wejście (reveal); paski wykresu rosną po wejściu w widok. Moduł 72.",
      "baza": {
        "plik": "v7/produkty.html",
        "kotwica": "dowod-bloki"
      },
      "kod": {
        "css": "produkty.css (c5pr-two, c5pr-block)",
        "js": "produkty.js ===== 72"
      },
      "czesci": [
        "2 bloki: h3, wizual, przypis"
      ],
      "warianty": {
        "jeden-pod-drugim": "oba bloki na całą szerokość (--stack)"
      },
      "uwagi": "",
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
      "uwagi": "Inny klocek niż FAQ (CE-17): pytanie nad odpowiedzią, panele niezależne.",
      "zrzut": {
        "maxh": 500
      }
    },
    "CE-43": {
      "nazwa": "Przełącznik z paskiem proporcji",
      "grupa": "przelaczniki",
      "opis": "Jedna kolumna: h3 i zdanie, rząd przycisków wyboru, poziomy pasek wypełnienia z etykietą, blok interpretacji (duża wartość, etykieta, akapity).",
      "mechanika": "Przyciski aria-pressed ustawiają szerokość wypełnienia i pokazują swój blok tekstu; bez JS wszystkie bloki widoczne. uprawa.js (pasek potasu).",
      "baza": {
        "plik": "v7/kukurydza.html",
        "kotwica": "u-wybor-potas"
      },
      "kod": {
        "css": "uprawa.css 6 (u-kbar)",
        "js": "uprawa.js 5 (pasek potasu)"
      },
      "czesci": [
        "h3",
        "przyciski wyboru",
        "pasek",
        "bloki interpretacji"
      ],
      "warianty": {},
      "uwagi": "Krewny CE-45 (pudełka-przełączniki).",
      "zrzut": {
        "maxh": 600
      }
    },
    "CE-44": {
      "nazwa": "Napis przyklejony z płynącymi kaflami",
      "grupa": "sceny",
      "opis": "Duży napis przyklejony na środku ekranu przez cały tor sekcji; kafelki lub karty rozłożone w torze nieregularnie (odsunięcie, obrót, własna prędkość) przepływają obok i po napisie.",
      "mechanika": "Parallax kafelków liczony z pozycji przewijania (tylko motionOn); statycznie napis i kafelki jeden pod drugim. Moduł 55 (Kukurydza) / 45 (Próchnica+).",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "korzysci"
      },
      "kod": {
        "css": "prochnica-plus.css ===== 45 (pp-kor) / kukurydza.css ===== 55 (u-fk)",
        "js": "prochnica-plus.js ===== 45 / kukurydza.js ===== 55"
      },
      "czesci": [
        "napis",
        "kafelki lub karty"
      ],
      "warianty": {},
      "uwagi": "",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-45": {
      "nazwa": "Pudełka-przełączniki",
      "grupa": "przelaczniki",
      "opis": "Rząd pudełek (tablist) z nazwą i podpisem wariantu, pod nimi panel treści aktywnego wariantu (tabela).",
      "mechanika": "Tablist ARIA z klawiaturą; klik pokazuje panel; bez JS wszystkie panele widoczne. uprawa.js (pudełka wariantów).",
      "baza": {
        "plik": "v7/kukurydza.html",
        "kotwica": "u-warianty"
      },
      "kod": {
        "css": "uprawa.css 11",
        "js": "uprawa.js 10"
      },
      "czesci": [
        "pudełka",
        "panel treści"
      ],
      "warianty": {},
      "uwagi": "",
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
      "uwagi": "",
      "zrzut": {
        "maxh": 800
      }
    },
    "CE-47": {
      "nazwa": "Przelicznik",
      "grupa": "dane",
      "opis": "Nagłówek, suwak powierzchni z wartością, siatka boksów wyników (wartość, jednostka, wiersz pomocniczy).",
      "mechanika": "Suwak przelicza dawki na bieżąco (data-calc w c5.js, grupowanie tysięcy), bez JS wartości domyślne.",
      "baza": {
        "plik": "v7/kukurydza.html",
        "kotwica": "u-skala"
      },
      "kod": {
        "css": "uprawa.css 16 (u-calc, u-out)",
        "js": "c5.js (przelicznik data-calc) + uprawa.js 13 (suwak)"
      },
      "czesci": [
        "suwak",
        "boksy wyników"
      ],
      "warianty": {},
      "uwagi": "Ten sam mechanizm na ziemniak.html i borowka.html (poza zakresem 14.09).",
      "zrzut": {
        "maxh": 700
      }
    },
    "CE-48": {
      "nazwa": "Karty biogramów",
      "grupa": "karty",
      "opis": "Dwie karty biogramów: zdjęcie, nazwisko i rola, pierwszy akapit widoczny, reszta pod przyciskiem „czytaj dalej”.",
      "mechanika": "Szuflada rozwijana na klik (panelSet); bez JS cała treść widoczna. Moduł 55.",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "koordynatorzy"
      },
      "kod": {
        "css": "prochnica-plus.css ===== 55 (pp-bio)",
        "js": "prochnica-plus.js ===== 55"
      },
      "czesci": [
        "2 karty: zdjęcie, nazwisko, rola, akapity, przycisk"
      ],
      "warianty": {},
      "uwagi": "",
      "zrzut": {
        "maxh": 700
      }
    },
    "CE-49": {
      "nazwa": "Harmonogram na osi",
      "grupa": "dane",
      "opis": "Jeden etap na ekran: duży rok i termin, tytuł i pełny opis po lewej, makieta zdjęcia po prawej; na dole oś czasu z węzłami wg daty, latami, znacznikiem „teraz” i licznikiem „n / N”, przyciski strzałek.",
      "mechanika": "Sterowanie wyłącznie strzałkami, klawiszami i klikiem w oś (bez przechwytywania przewijania); wyśrodkowanie węzła na osi. Moduł 65 (styl S1 z laboratorium).",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "harmonogram"
      },
      "kod": {
        "css": "prochnica-plus.css ===== 65 (pp-os)",
        "js": "prochnica-plus.js ===== 65"
      },
      "czesci": [
        "etap: rok, termin, tytuł, opis, zdjęcie",
        "oś z węzłami",
        "licznik",
        "strzałki"
      ],
      "warianty": {},
      "uwagi": "Laboratorium stylów: v5/lab/harmonogram.html.",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-50": {
      "nazwa": "Formularz",
      "grupa": "dane",
      "opis": "Dwie kolumny: formularz (pola, zgoda, przycisk) i zdjęcie zespołu.",
      "mechanika": "Demonstracyjny: nic nie wychodzi na serwer, walidacja i komunikat po wysłaniu w JS. Moduł 75.",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "zadaj-pytanie"
      },
      "kod": {
        "css": "prochnica-plus.css ===== 75 (pp-form)",
        "js": "prochnica-plus.js ===== 75"
      },
      "czesci": [
        "pola",
        "zgoda",
        "przycisk",
        "zdjęcie"
      ],
      "warianty": {},
      "uwagi": "Formularz kontaktu na kontakt.html poza zakresem 14.09.",
      "zrzut": {
        "maxh": 800
      }
    },
    "CE-51": {
      "nazwa": "Oś Gantta z filtrami",
      "grupa": "dane",
      "opis": "Filtry-chipy gospodarstw nad wykresem, wykres z wierszem na gospodarstwo i kaflami zdarzeń w kolumnach miesięcy i lat, karta opisu jako dymek i wersja przypięta pod wykresem.",
      "mechanika": "Wykres budowany z ukrytego źródła treści (osie kamieni per gospodarstwo), filtry przełączają wiersze, klik w kafel otwiera opis; bez JS widoczne pionowe osie kamieni. Moduł 85.",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "etapy-gantt"
      },
      "kod": {
        "css": "prochnica-plus.css ===== 85 (pp-gt)",
        "js": "prochnica-plus.js ===== 85"
      },
      "czesci": [
        "filtry",
        "wykres",
        "kafle zdarzeń",
        "karta opisu",
        "źródło treści (osie kamieni, wersja bez JS)"
      ],
      "warianty": {},
      "uwagi": "",
      "zrzut": {
        "maxh": 1000
      }
    },
    "CE-52": {
      "nazwa": "Pasek pól wyboru",
      "grupa": "dane",
      "opis": "Siatka pól select z etykietami (jedno pole albo cztery w ramce), wysokość pola 44 px.",
      "mechanika": "W makiecie pola niczego nie filtrują (brak obsługi w JS).",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "wyniki-filtry"
      },
      "kod": {
        "css": "prochnica-plus.css ===== 90 (pp-selects, pp-filters)",
        "js": "brak"
      },
      "czesci": [
        "pola select z etykietami"
      ],
      "warianty": {
        "w-ramce": "cztery pola w ramce z nagłówkiem Filtry"
      },
      "uwagi": "",
      "zrzut": {
        "maxh": 300
      }
    },
    "CE-53": {
      "nazwa": "Lista wierszy z akcją",
      "grupa": "dane",
      "opis": "Lista wierszy rozdzielonych cienkimi liniami: tytuł | metryka | przycisk po prawej; pod listą pusty stan w ramce kreskowanej.",
      "mechanika": "Fade-in wierszy; przyciski wyłączone, gdy materiał w przygotowaniu.",
      "baza": {
        "plik": "v7/prochnica-plus.html",
        "kotwica": "wyniki-raporty"
      },
      "kod": {
        "css": "prochnica-plus.css ===== 90 (pp-reports)",
        "js": "prochnica-plus.js ===== 02 (reveal)"
      },
      "czesci": [
        "wiersze: tytuł, metryka, przycisk",
        "pusty stan"
      ],
      "warianty": {},
      "uwagi": "",
      "zrzut": {
        "maxh": 700
      }
    }
  }
};
