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
    "zaktualizowano": "2026-09-18",
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
        "css": "ce/CE-07-nawigacja-kropkowa.css",
        "js": "ce/CE-07-nawigacja-kropkowa.js"
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
        "css": "ce/CE-08-hero.css (geometria packshotów per strona w <strona>.css)",
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
        "polka": "półka czterech opakowań rodzin (Produkty)",
        "kadr": "kadr zdjęcia uprawy zamiast packshotu (Kukurydza)",
        "player": "player filmu na panelu (Próchnica+)",
        "foto": "panel ze zdjęciem zamiast packshotu (o-firmie.html#hero)",
        "dzial": "jedna kolumna na dwie trzecie szerokości, wysokość wg treści, wyszukiwarka i przycisk przewodnika (centrum-wiedzy.html#hero, centrum-wiedzy-kategoria.html#hero)",
        "artykul": "nagłówek artykułu: okruszki, chipy, h1, metryka autora, przyciski udostępnij/drukuj (artykul.html#naglowek)"
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
        "css": "ce/CE-09-marquee.css",
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
        "css": "ce/CE-10-parametry.css (wariant z-tabami w pliku)",
        "js": "ce/CE-10-parametry.js"
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
        "css": "ce/CE-11-warianty-taby.css (Próchnica+: kit c5.css)",
        "js": "ce/CE-11-warianty-taby.js (Próchnica+: c5.js)"
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
        "css": "ce/CE-12-scena-faktow.css (Próchnica+: własna pp-scene, do scalenia); nowy układ z 18.09.2026: ce/CE-12-scena-faktow-proba.css (na razie tylko Produkty)",
        "js": "ce/CE-12-scena-faktow.js; nowy układ z 18.09.2026: ce/CE-12-scena-faktow-proba.js (na razie tylko Produkty)"
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
        "z-leadem": "dwa akapity leadu przyklejone razem z nagłówkiem (Próchnica+ Metodologia)",
        "z-naglowkiem": "nowy układ wg ramki Figma „Frame 206” (Mateusz, 18.09.2026; na razie tylko Produkty): scena we własnym kontenerze na całą szerokość okna (do 1800 px, tekst 40 px od lewej krawędzi), zdjęcie na prawą połowę kontenera i całą wysokość ekranu z marginesami 20 px, ilustracja na środku zdjęcia na rozmytym ciemnym tle, u góry lewej kolumny kicker i H2, przy dole jeden fakt naraz – tytuł, cienka linia z postępem bieżącego slajdu, opis i licznik „02/05”; bez leadu",
        "bez-naglowka": "ten sam nowy układ bez kickera i H2 w scenie – gdy sekcja potrzebuje leadu, kicker, H2 i lead stoją nad torem jako zwykły nagłówek sekcji (reguła Mateusza: lead nigdy w scenie); na Produktach do obejrzenia przełącznikiem podglądu"
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
          "plik": "v7/produkty.html",
          "kotwica": "jak-dzialaja",
          "ruch": true,
          "klik": "#jak-dzialaja [data-fx-var=\"bez-naglowka\"]",
          "przewin": "#jak-dzialaja [data-fx-track]",
          "czekaj": 900
        }
      },
      "uwagi": "Liczba kroków (4–8) jest treścią; jeden moduł czyta ją z DOM. 18.09.2026: przebudowa klocka wg Frame 206 – próba na Produktach (warianty z-naglowkiem / bez-naglowka, spec produkty-wzorzec-eco-spec §21.3 i §21.8); pozostałe strony stoją na układzie bazowym do decyzji Mateusza o przeniesieniu nowego układu do warstwy wspólnej.",
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
        "css": "ce/CE-13-scena-produktu.css (stałe toru per strona: --use-*)",
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
        "css": "ce/CE-14-sekcja-100svh.css (Kukurydza: własna u-dg, do scalenia)",
        "js": "ce/CE-14-sekcja-100svh.js"
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
        "css": "ce/CE-15-wiersze-packshot.css",
        "js": "ce/CE-15-wiersze-packshot.js"
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
        "css": "ce/CE-16-pas-pro.css",
        "js": "ce/CE-16-pas-pro.js; wariant pozny-wzrost: ce/CE-16-pas-pro-proba.js (na razie tylko Produkty)"
      },
      "czesci": [
        "kadr",
        "h2",
        "akapit",
        "rząd 2 przycisków"
      ],
      "warianty": {
        "zamykajacy": "bez akapitu: nagłówek po lewej, dwa przyciski po prawej, oba na kadrze (Kukurydza; od 18.09.2026 na bazowym kodzie klocka zamiast własnego portu u-end)",
        "kontakt": "pas „Wolisz porozmawiać z człowiekiem?” z przyciskami Kontakt i Zostań partnerem (o-firmie.html#porozmawiajmy)",
        "pozny-wzrost": "kadr stoi na 50 % szerokości ekranu, dopóki górna krawędź pasa jest niżej niż 35 % wysokości okna, potem rośnie i pełny rozmiar osiąga 2 % od góry okna; nakładka przyciemniająca narasta razem ze wzrostem, więc w postoju zdjęcie jest bez przyciemnienia (uwagi Mateusza z 18.09.2026; na razie tylko Produkty)"
      },
      "uwagi": "Na CARBOMAT ECO i CARBOMAT HUMIC stoi wewnątrz sekcji Sezon, na pozostałych jako osobna sekcja. Wariant pozny-wzrost: spec produkty-wzorzec-eco-spec §21.4 i §21.8; do decyzji Mateusza kontrast białego tekstu na nieprzyciemnionym zdjęciu (akapit min 2,32).",
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
        "css": "ce/CE-17-faq.css",
        "js": "ce/CE-17-faq.js"
      },
      "czesci": [
        "kicker + h2",
        "pozycje: pytanie + odpowiedź"
      ],
      "warianty": {
        "z-nota": "nota o statusie odpowiedzi między nagłówkiem a akordeonem (CARBOHUMIC)",
        "dla-dociekliwych": "wariant c5-faq--plain: pytanie nad odpowiedzią, pełna szerokość, h4 i przycisk do Centrum wiedzy (Produkty, dawny CE-42)",
        "plain": "trzy pytania pod artykułem, odpowiedzi ze zdań tekstu (artykul.html#faq)"
      },
      "uwagi": "Moduł „zadaj pytanie” zdjęty 13.09. Jeden moduł ce/CE-17-faq.js obsługuje kilka akordeonów na stronie (zakres per blok).",
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
        "szerokie": "dwie szerokie karty",
        "czytaj-dalej": "trzy karty: dwa artykuły i jedna strona komercyjna (artykul.html#dalej-karty)"
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
      "nazwa": "Pas liczb",
      "grupa": "dane",
      "opis": "Kadr z marginesem 30 px na wysokość ekranu. Wersja podstawowa: ciemne tło, tytuł u góry po lewej, wiersze „etykieta i podpis | wielka liczba z sufiksem” rozdzielone cienkimi liniami. Wersja alternatywna (wariant kolumny): jasne tło, trzy kolumny z pionowymi liniami, chip nad liczbą, podpis pod nią. Sufiksy liczb to element EL-31.",
      "mechanika": "Wiersze wchodzą od dołu ze staggerem przy pierwszym wejściu w widok (Mata), cyfry odliczają od zera (Kukurydza) albo wjeżdżają kołowrotkiem (Próchnica+); bez JS i przy reduced-motion od razu wartości końcowe.",
      "baza": {
        "plik": "v7/carbomat-mata.html",
        "kotwica": "dowod-liczby"
      },
      "kod": {
        "css": "per strona: c5-stats (Mata), u-nb (Kukurydza, wariant kolumny), pp-liczby (Próchnica+); sufiksy: ce/00-base.css EL-31",
        "js": "carbomat-mata.js ===== 55 / uprawa.js data-count / prochnica-plus.js ===== 60"
      },
      "czesci": [
        "tytuł",
        "wiersze: etykieta, podpis, liczba, jednostka",
        "źródło"
      ],
      "warianty": {
        "odliczanie": "liczby odliczają od zera (mechanika data-count z uprawa.js; na Kukurydzy razem z wariantem kolumny)",
        "kolowrotek": "cyfry wjeżdżają kołowrotkiem (Próchnica+)",
        "kolumny": "jasny panel, trzy kolumny rozdzielone pionowymi liniami: chip nad liczbą, wielka liczba z małą jednostką u górnej krawędzi cyfr, podpis pod liczbą (wersja alternatywna sekcji liczb; Kukurydza od 18.09 – decyzja Mateusza)"
      },
      "zrzuty_wariantow": {
        "kolumny": {
          "plik": "v7/kukurydza.html",
          "kotwica": "u-liczby"
        }
      },
      "uwagi": "Wzór: serverobotics.com (uwaga Mateusza 14.09). Jednostka i sufiksy (%, +) małe i wyrównane do górnej krawędzi cyfr (uwaga Mateusza 15.09) – od 18.09 jako element EL-31 c5-aff (0,24 em, kolor liczby) na wszystkich wystąpieniach: Mata, Próchnica+, Kukurydza; wariant kolumny – wzór UPC Renewables i Yerevan (zrzuty 15.09). Nazwa klocka zmieniona 18.09 z „Ciemny pas liczb”, bo doszła jasna wersja alternatywna.",
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
      "mechanika": "Najechanie podgląda, klik wybiera, strzałki nawigują, kotwice trafiają w pozycje; bez JS wszystkie opisy otwarte. Moduły 72 (Carbohumic), 80 (Mata), 40 (O nas).",
      "baza": {
        "plik": "v7/carbohumic.html",
        "kotwica": "z-czym-laczyc-lista"
      },
      "kod": {
        "css": "per strona: c5hu-mixlist, c5-tco, on-val; wariant akordeon-z-odliczaniem: c5pr-acc i c5pr-pcard w produkty.css",
        "js": "carbohumic.js ===== 72; wariant akordeon-z-odliczaniem: produkty.js ===== 50"
      },
      "czesci": [
        "lista tytułów",
        "panel opisu",
        "przycisk w panelu (opcjonalnie)"
      ],
      "warianty": {
        "z-lightboxem": "panel ma przycisk otwierający pełny opis w lightboxie (Kukurydza fazy do 18.09; sekcję przejął CE-65, wariant bez wystąpień)",
        "akordeon-z-odliczaniem": "akordeon na szerokość kontenera wg ramki Figma „Frame 207” (Mateusz, 18.09.2026; Produkty, ścieżki wg sytuacji): otwarta pozycja ma duży tytuł, po lewej opis z notami, ostrzeżeniem i linkami, po prawej karty produktów z packshotem (po dwie w rzędzie, kolejne zawijają się do następnego wiersza; cała karta prowadzi na stronę produktu, „Kup produkt” odsłania się pod opisem na karcie, a packshot maleje); pierwsza pozycja otwarta od początku, odliczanie 5 s z paskiem na górnej linii następnej pozycji otwiera kolejną i zamyka poprzednią, klik otwiera dowolną albo zamyka otwartą i wyłącza automat, kotwica pozycji otwiera ją i zatrzymuje automat; automat tylko na szerokim ekranie i przy włączonym ruchu, pod kursorem i przy fokusie odliczanie stoi"
      },
      "zrzuty_wariantow": {
        "akordeon-z-odliczaniem": {
          "plik": "v7/produkty.html",
          "kotwica": "wg-potrzeby-sciezki",
          "maxh": 1100
        }
      },
      "uwagi": "Trzy implementacje tej samej mechaniki (Carbohumic, Mata, O nas) – kandydat do konsolidacji. Do 18.09.2026 bazą były ścieżki na Produktach; po ich przebudowie na wariant akordeon-z-odliczaniem (spec produkty-wzorzec-eco-spec §21.2 i §21.8) baza przeszła na CARBOHUMIC „Z czym łączyć”.",
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
        "regula-z-packshotem": "warunek → odpowiedź + sam packshot produktu (bez nazwy i wskazówki od 16.09), karta jako link (Kukurydza)"
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
      "uwagi": "WYCOFANY 15.09.2026 – scalony z CE-17 (FAQ) jako wariant dla-dociekliwych po decyzji Mateusza o jednym stylu (dwa akordeony obok siebie na Produktach). Kod zostaje w rejestrze na stałe, nie jest używany ponownie.",
      "zrzut": {
        "maxh": 500
      },
      "status": "wycofany"
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
        "css": "prochnica-plus.css ===== 45 (pp-kor) / kukurydza.css ===== 55 (u-fk, wariant tlo-foto)",
        "js": "prochnica-plus.js ===== 45 / kukurydza.js ===== 55"
      },
      "czesci": [
        "napis",
        "kafelki lub karty"
      ],
      "warianty": {
        "tlo-foto": "jedno zdjęcie w tle sceny na pełny ekran (scena przyklejona 100svh, jednolity scrim), biały napis wchodzi wyraz po wyrazie zza maski, gdy kadr zajmuje ok. 2/3 okna; kafle proste, w trzech rozłącznych pasach, po 2–3 naraz, z profilem prędkości: szybki wjazd, zwolnienie w środku okna, szybki wyjazd; na końcu napis zostaje sam (Kukurydza, #u-fakty-scena)"
      },
      "zrzuty_wariantow": {
        "tlo-foto": {
          "plik": "v7/kukurydza.html",
          "kotwica": "u-fakty-scena"
        }
      },
      "uwagi": "Wariant tlo-foto: uwagi Mateusza z 18.09.2026 (iteracja 9 Kukurydzy, spec kukurydza-hifi-spec §13.4); baza na Próchnicy+ bez zmian.",
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
      "uwagi": "WYCOFANY 18.09.2026 – karuzelę kart na Kukurydzy (jedyne wystąpienie) zastąpił CE-66 „Tablica warunków” po uwadze Mateusza z 18.09 (wspólne elementy ośmiu kart wykorzystane jako stała rama). Kod u-cr* zdjęty z kukurydza.css i kukurydza.js; ostatnia wersja w repo makiet (deploy V7 z 14–15.09). Kod CE-46 zostaje w rejestrze na stałe, nie jest używany ponownie.",
      "zrzut": {
        "maxh": 800
      },
      "status": "wycofany"
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
      "warianty": {
        "siatka": "osiem biogramów w siatce 4 kolumn z „czytaj dalej” (o-firmie.html#ludzie)",
        "kompakt": "trzy karty autorów bez rozwijania (centrum-wiedzy.html#autorzy)"
      },
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
      "warianty": {
        "kontakt": "formularz z wyborem tematu obok panelu danych firmy i mapy (kontakt.html#napisz)",
        "temat": "formularz „Zaproponuj temat” obok pasa przewodnika (centrum-wiedzy.html#zaproponuj, artykul.html#zaproponuj-temat)"
      },
      "uwagi": "Warianty 15.09: „kontakt” na kontakt.html#napisz, „temat” na dziale i artykule Centrum wiedzy.",
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
      "warianty": {
        "dokumenty": "certyfikaty, poradniki i karty do pobrania z numerem lub metryką (o-firmie.html#dowody-listy, centrum-wiedzy.html#poradniki)"
      },
      "uwagi": "",
      "zrzut": {
        "maxh": 700
      }
    },
    "CE-54": {
      "nazwa": "Kafle szybkiego kontaktu",
      "grupa": "karty",
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
      "uwagi": "Treść 1:1 z dokumentu Sylwii 09.09 (AC #31570).",
      "zrzut": {
        "maxh": 760
      }
    },
    "CE-55": {
      "nazwa": "Wiersze działów z akcjami",
      "grupa": "dane",
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
      "uwagi": "",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-56": {
      "nazwa": "Mapa z listą lokalizacji",
      "grupa": "karty",
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
      "uwagi": "",
      "zrzut": {
        "maxh": 900
      }
    },
    "CE-57": {
      "nazwa": "Indeks artykułów",
      "grupa": "dane",
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
      "uwagi": "Układ z decyzji klienta 10.08: bez miniatur, stronicowanie zamiast doładowywania, podpis autora w każdym wierszu.",
      "zrzut": {
        "maxh": 1000
      }
    },
    "CE-58": {
      "nazwa": "Karty najnowszych",
      "grupa": "karty",
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
      "uwagi": "",
      "zrzut": {
        "maxh": 800
      }
    },
    "CE-59": {
      "nazwa": "Nawigacja kategorii",
      "grupa": "karty",
      "opis": "Dwa obramowane boksy obok siebie: nazwa grupy głównej jako link, zdanie opisu i lista podgrup z licznikami artykułów.",
      "mechanika": "Statyczne; linki podgrup prowadzą do indeksu z parametrem ?kat=, który ustawia filtr. Poniżej 900 px boksy jeden pod drugim.",
      "baza": {
        "plik": "v7/centrum-wiedzy.html",
        "kotwica": "kategorie"
      },
      "kod": {
        "css": "centrum-wiedzy.css ===== 59 (cw-k-cats)",
        "js": "–"
      },
      "czesci": [
        "2 boksy grup głównych",
        "listy podgrup z licznikami"
      ],
      "warianty": {},
      "uwagi": "",
      "zrzut": {
        "maxh": 700
      }
    },
    "CE-60": {
      "nazwa": "Spis treści z paskiem postępu",
      "grupa": "nawigacja",
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
      "uwagi": "",
      "zrzut": {
        "maxh": 800,
        "przewin": "#spis"
      }
    },
    "CE-61": {
      "nazwa": "Kluczowe wnioski",
      "grupa": "noty-i-cta",
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
      "uwagi": "Zdania wybierane z tekstu autora, nie pisane na nowo (spec Centrum wiedzy §5.1).",
      "zrzut": {
        "maxh": 600
      }
    },
    "CE-62": {
      "nazwa": "Boks produktowy w treści",
      "grupa": "noty-i-cta",
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
      "uwagi": "Jeden boks na artykuł, po sekcji, która uzasadnia produkt (życzenie klienta z 01.06: „kup teraz” przy wzmiance produktu).",
      "zrzut": {
        "maxh": 500
      }
    },
    "CE-63": {
      "nazwa": "Karta autora",
      "grupa": "karty",
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
      "uwagi": "Podpisy autorów obowiązkowe (Darek 10.08); dane w makiecie przykładowe – Google Doc nie podaje autorów.",
      "zrzut": {
        "maxh": 600
      }
    },
    "CE-64": {
      "nazwa": "Produkty wspomniane w artykule",
      "grupa": "noty-i-cta",
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
      "uwagi": "Uwaga Mateusza 15.09: produkty wymienione w artykule widoczne u góry, każdy z przyciskiem „Kup produkt”. Boks „Z tego artykułu” (CE-62) w treści zostaje – decyzja, czy nie jest nadmiarowy.",
      "zrzut": {
        "maxh": 500
      }
    },
    "CE-65": {
      "nazwa": "Oś faz z akordeonem",
      "grupa": "przelaczniki",
      "opis": "Dwie kolumny we własnym, szerszym kontenerze (do 1800 px, marginesy 40 px, odstęp kolumn clamp(3rem, 8vw, 10rem)): po lewej kicker w ramce i nagłówek sekcji, pod nimi kwadratowy kadr aktywnej pozycji przyklejony do dolnej krawędzi okna (nagłówek przewija się ze stroną, kadr jedzie wzdłuż listy i nigdy nie nachodzi na nagłówek); po prawej pionowa oś z numerowanymi węzłami (numery krojem treści) i dużymi tytułami; otwarta pozycja rozwija pod tytułem panel: etykieta, skrót, boksy produktów z packshotem, przypis i przycisk pełnego opisu. Na telefonie jedna kolumna, kadr 4:3 wewnątrz panelu.",
      "mechanika": "Akordeon: jedna pozycja otwarta naraz (klik, Enter, spacja), strzałki oraz Home i End przenoszą fokus między tytułami; kadr w lewej kolumnie przenika przy zmianie pozycji; gdy po zwinięciu pozycji powyżej otwierany tytuł wypada ponad okno, moduł dociąga go do górnej krawędzi; boksy produktów i przycisk otwierają lightboxy. Bez JS wszystkie panele otwarte i kadry w panelach; reduced-motion bez animacji.",
      "baza": {
        "plik": "v7/kukurydza.html",
        "kotwica": "u-fazy"
      },
      "kod": {
        "css": "ce/CE-65-os-faz.css",
        "js": "ce/CE-65-os-faz.js"
      },
      "czesci": [
        "blok nagłówka z kickerem w ramce",
        "kadr aktywnej pozycji (kwadrat, przyklejony do dołu okna)",
        "oś z numerowanymi węzłami",
        "tytuł pozycji",
        "panel: etykieta, skrót, boksy produktów, przypis, przycisk"
      ],
      "warianty": {},
      "uwagi": "Wzór: ramka Figma „Frame 213” (Mateusz, 18.09.2026); decyzja Mateusza z 18.09: osobny content element. Zastąpił na Kukurydzy wariant z-lightboxem klocka CE-30. Na razie jedno wystąpienie (Kukurydza, fazy). Iteracja 9 (18.09 po południu, uwagi Mateusza): numery krojem treści, bez leadu, szeroki kontener, kicker EL-06 w ramce, kadr 1:1 przyklejony do dołu okna – poniżej 1600 px zatrzymuje się 96 px nad krawędzią, żeby nie wchodzić pod dok doradcy (zmienna --c5-tl-stage-bot).",
      "zrzut": {
        "maxh": 1100
      }
    },
    "CE-66": {
      "nazwa": "Tablica warunków",
      "grupa": "przelaczniki",
      "opis": "Ciemna tablica ośmiu warunków stanowiska: wspólny szkielet – wielki licznik i etykiety „Priorytet”, „Carbohort”, „Uzupełnienie” – jest nadrukowany raz i się nie rusza, zmienia się wyłącznie treść wybranego warunku (tytuł, trzy odpowiedzi, chipy produktów). Nad tablicą wybierak ośmiu kafli z numerem i nazwą warunku (4 × 2 na desktopie, przewijany rząd poniżej 640 px); bez JS klocek rozkłada się na osiem jasnych kart z numerem.",
      "mechanika": "Zakładki z aktywacją automatyczną: kafel, klawiatura w tabliście (← → Home End, roving tabindex), przyciski poprzedni/następny z zawijaniem i przesunięcie palcem po tablicy (próg 40 px). Osiem paneli leży w jednej komórce siatki i dziedziczy jej tory przez subgrid, więc wysokość tablicy nie skacze, a etykiety nie drgną; licznik przewija taśmę cyfr (600 ms, zdublowane cyfry na zawinięcie 8 → 1 i 1 → 8), tytuł wjeżdża zza maski, trzy sloty wchodzą kaskadą co 70 ms. Autoprzełączanie co 8 s napędza pasek postępu na aktywnym kaflu: rusza przy co najmniej 50 % widoczności, pauzuje na hover i fokusie, gaśnie na stałe po pierwszej świadomej akcji i wraca przyciskiem pauzy; przy prefers-reduced-motion nie startuje, a przełączanie jest natychmiastowe.",
      "baza": {
        "plik": "v7/kukurydza.html",
        "kotwica": "u-stanowisko"
      },
      "kod": {
        "css": "ce/CE-66-tablica-warunkow.css",
        "js": "ce/CE-66-tablica-warunkow.js"
      },
      "czesci": [
        "nagłówek sekcji (kicker, h2, lead)",
        "wybierak ośmiu kafli z paskiem postępu",
        "licznik z taśmą cyfr",
        "sterowanie: pauza, poprzedni, następny",
        "stos ośmiu paneli: tytuł i trzy sloty z etykietami"
      ],
      "warianty": {},
      "uwagi": "Uwaga Mateusza z 18.09.2026 (iteracja 9 Kukurydzy): osiem kart karuzeli miało wspólne elementy – numer i trzy etykiety – więc stoją na tablicy raz; nowy content element tylko dla tego miejsca. Zastąpił CE-46 (karuzela kart, wycofany). Chipy produktów z EL c5-chip w wersji na ciemnym tle, 32 px wysokości (stoją w zdaniu).",
      "zrzut": {
        "maxh": 1100
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
        "c5-btn--tight": "wąski boczny padding, gdy przyciski stoją ciasno"
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
      ],
      "uwagi": "Przycisków kitu (wf-btn) w V7 nie używamy – zero wystąpień na siedmiu stronach. Nowy przycisk to zawsze c5-btn. Wariant --ondark nie ma własnej definicji w warstwie wspólnej: żyje w regule .c5-params .c5-btn--ondark, więc poza pasem parametrów nic nie robi – dlatego nie ma go w przykładzie obok."
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
      ],
      "uwagi": "Reguły pozycjonujące krzyżyk w rogu i chowające go bez JS zostają w pliku strony – tu mieszka sama anatomia przycisku."
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
      "uwagi": "Do rozstrzygnięcia przed scaleniem: która dekoracja jest domyślna – podkreślenie czy kreska pod spodem.",
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
      ],
      "uwagi": "Warianty --stack i --end są na razie planem – dziś odstępy poprawia się lokalnie w plikach stron."
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
      "zastepuje": [],
      "uwagi": ""
    },
    "EL-06": {
      "nazwa": "Kicker",
      "grupa": "typografia",
      "klasa": "c5-kicker",
      "warianty": {
        "c5-kicker--center": "wyśrodkowany",
        "c5-kicker--flush": "bez odstępu pod spodem",
        "c5-kicker--outline": "w ramce: obrys 1 px, narożniki 8 px, 0.75 rem – wyjątek Mateusza od ostrych narożników (18.09.2026, wzór: ramka Figma „Frame 213”); na razie tylko CE-65 na Kukurydzy"
      },
      "opis": "Nadtytuł sekcji: 0.875 rem, wersaliki, tracking .03em i duży odstęp do treści pod spodem. Dwanaście lokalnych nadpisań margin-bottom:0 czeka na wariant --flush.",
      "przyklad": "<span class=\"c5-kicker\">Czym jest CARBOMAT ECO</span><span class=\"c5-kicker c5-kicker--center\">Dla dociekliwych</span>",
      "przyklad_tlo": "jasne",
      "kod": "ce/00-base.css – Wspólne klocki nowego layoutu",
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
      ],
      "uwagi": ""
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
      "uwagi": "Decyzja z inwentarza §2: skala ECO (0.75 rem / .06em), nie skala kitu (--w-font-caption + .08em) – 92 wystąpienia na sześciu stronach wobec 123 skupionych na jednej.",
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
      "kod": "ce/00-base.css – Wspólne klocki nowego layoutu",
      "uzywany_w": [
        "CE-08"
      ],
      "zastepuje": [
        "lokalne zmniejszenie w carbomat-humic.css (do decyzji)"
      ],
      "uwagi": ""
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
      "kod": "ce/00-base.css – Wspólne klocki nowego layoutu",
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
      "uwagi": "Warianty --tight i --sm nie są jeszcze w arkuszu; zamiana wf-h2 na Kukurydzy idzie w fali 2a, reszta w 2b.",
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "wf-h2",
        "c5-params__title",
        "u-fk__title"
      ]
    },
    "EL-10": {
      "nazwa": "Nagłówek klocka",
      "grupa": "typografia",
      "klasa": "c5-h3",
      "warianty": {
        "c5-h3--xs": "1 rem",
        "c5-h3--sm": "1,0625 rem (baza)",
        "c5-h3--md": "1,125 rem",
        "c5-h3--lg": "clamp 1,125 – 1,5 rem",
        "c5-h3--xl": "clamp 2 – 3 rem"
      },
      "opis": "Nagłówek wewnątrz klocka – karty, kroku, kafla, pozycji listy – w pięciu rozmiarach jednej skali. To największy bałagan inwentarza: 36 klas o tym samym kroju czeka na scalenie w fali 2c.",
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
      "uwagi": "Skala jest już w arkuszu (zaliczka z fali 2a), ale prawie nic jej jeszcze nie używa – scalenie 292 wystąpień idzie stroną po stronie w fali 2c.",
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
      "kod": "ce/00-base.css – Wspólne klocki nowego layoutu",
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
      "uwagi": "Do rozstrzygnięcia razem z odstępami kitu (wf-stack--N na Kukurydzy, 17 wystąpień) – dwa systemy odstępów obok siebie.",
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
      "kod": "ce/00-base.css – Wspólne klocki nowego layoutu",
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
      ],
      "uwagi": "Wariant --hero jeszcze nie istnieje – dziś hero ma własną klasę c5-hero__lead."
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
      "opis": "Zwykły akapit treści w klocku, w dwóch rozmiarach zamiast szesnastu klas o nazwach __txt, __body i __desc. Decyzja z inwentarza §4: bazą jest 0,9375 rem ze wzorca ECO.",
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
      "uwagi": "c5-muted ma dziś dwie definicje (jasny kontekst i wnętrze c5-viz) – wariant --ondark ma je zastąpić.",
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
      ],
      "uwagi": "Podniesienie bieli z .55/.6 do .8 to jedyna zamierzona zmiana wyglądu w tym elemencie – zapisana w backlogu jako poprawka AA."
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
      "uwagi": "Padding schodzi z ośmiu wartości do trzech (16 / clamp 1,25–1,75 / clamp 1,5–2). Cień zniknął już w fali 2a – jedyny w całym serwisie siedział na u-fk__tile.",
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "c5-mt-card",
        "c5hu-tile",
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
      ],
      "uwagi": "Chip niesie wersaliki, więc etykieta musi być krótka – tam, gdzie dziś w pigułce siedzi całe zdanie (c5hu-scope, część c5pr-gap), element czeka na decyzję zamiast na sed."
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
      ],
      "uwagi": "Wariant --dashed to dawna nota brak danych – jedyny bez ikony. c5-mt-note ma dziś kreskę z lewej, nie z góry: przejście na --rule jest widoczną zmianą i czeka na decyzję Mateusza."
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
      "kod": "dziś ce/CE-11-warianty-taby.css (c5-way, c5-way--compact)",
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
      "uwagi": "Rozjazd 5 jest już spłacony: baza c5-way to skala ECO, a wariant --compact daje 44 px dla paska lat. Przemianowanie na c5-tab czeka na falę 2b razem z wycofaniem c5.css.",
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
      "uwagi": "Do rozstrzygnięcia przy przenoszeniu: promień sterowany zmienną --c5pr-seg-r (dziś 0) i jedyne użycie --w-shadow-xs w całym serwisie.",
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
      ],
      "uwagi": "Bez JS odpowiedzi zostają otwarte – tak jak w przykładzie obok. Na stronie panel otwiera CE-17-faq.js."
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
      "opis": "Tabela danych: 0,875 rem, padding 12/16, nagłówek na tle subtle, podświetlany wiersz. Scala tabelę kitu z dwiema tabelami Maty; porównywarka z Produktów zostaje osobnym klockiem, bo ma własną mechanikę podświetlania kolumn.",
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
      "uwagi": "Przykład obok pokazuje dzisiejszą tabelę kitu – klasa c5-table pojawi się w arkuszu razem z przemianowaniem w fali 2b.",
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
        "u-rows (4)"
      ],
      "uwagi": "Wariant --ondark jest obowiązkowy: pas parametrów stoi na ciemnym tle i ma kreskę w innym kolorze.",
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
      "zastepuje": [],
      "uwagi": "Źródłem ikon jest chrome.js (53 ikony, użytych 38). Plik tabler-sprite.svg nie jest ładowany przez żadną z siedmiu stron – dla V7 jest martwy."
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
      ],
      "uwagi": ""
    },
    "EL-25": {
      "nazwa": "Boks ilustracji",
      "grupa": "ikony",
      "klasa": "c5-viz",
      "warianty": {
        "c5-viz--light": "wersja jasna (dziś martwa kopia w c5.css)"
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
      "uwagi": "Rozjazd 8 sprawdzony w przeglądarce w fali 2a: kadr jest ciemny na wszystkich pięciu stronach wzorca, Kukurydza nie ma tego klocka, a Próchnica+ ma własny ciemny odpowiednik pp-sviz.",
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
      "uwagi": "c5-yrs__num używa tokena --w-weight-light, którego w tokens.css nie ma (działa fallback 300) – do sprzątnięcia przy scaleniu.",
      "status": "planowane (fala 2b/2c)",
      "dzis": [
        "c5-viz__num",
        "u-num__val",
        "c5-mt-stat__val",
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
        "c5-bar--ondark": "na ciemnym tle – tor biały .25"
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
      ],
      "uwagi": "Warianty --hairline, --thick i --ondark czekają na falę 2b; wersja na ciemnym tle działa dziś przez kontekst .c5-viz."
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
      ],
      "uwagi": "Reguła celuje w #main, więc pole w doku doradcy (buduje je chrome.js) zostaje z promieniem 8 px – do backlogu."
    },
    "EL-29": {
      "nazwa": "Kontener",
      "grupa": "pojemniki",
      "klasa": "c5-wrap",
      "warianty": {
        "c5-wrap--narrow": "węższa kolumna do czytania"
      },
      "opis": "Środkowa kolumna strony: maksymalnie 1180 px, boczny padding 20 px, wyśrodkowana. Osiem identycznych kopii w arkuszach stron zeszło do jednej definicji – zmierzone wartości są na siedmiu stronach takie same.",
      "przyklad": "<div class=\"c5-wrap sg-ramka\"><p class=\"c5-p\">Wszystko, co czyta się w tekście, mieści się w tej kolumnie – pasy tła idą pełną szerokością, treść nigdy.</p></div>",
      "przyklad_tlo": "jasne",
      "szeroki": true,
      "kod": "ce/00-base.css – Wspólne klocki nowego layoutu",
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
      ],
      "uwagi": ""
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
      "kod": "ce/00-base.css – Wspólne klocki nowego layoutu",
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
      ],
      "uwagi": "Na Kukurydzy sekcja jest niższa (76,8 px zamiast 89,6) przez lokalne nadpisanie u-num – do sprzątnięcia w fali 2b."
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
      ],
      "uwagi": "Uwagi Mateusza 15–17.09.2026: jednostki i symbol procentu małe, u górnej krawędzi cyfr, w kolorze liczby; jedna reguła dla wszystkich wystąpień CE-24."
    }
  }
};
