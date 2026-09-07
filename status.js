/* ===========================================================================
   status.js – JEDYNE ŹRÓDŁO STANU PODSTRON
   ---------------------------------------------------------------------------
   Ten plik zasila trzy rzeczy naraz:
     1. plakietkę „Status: …" w lewym dolnym rogu każdej podstrony (chrome.js),
     2. tabelę informacyjną stan-podstron.html (generator),
     3. blok tabeli w 40-strona-www/stan-podstron.md (ten sam generator).

   ⚠️ ETAP I ETYKIETĘ USTAWIA WYŁĄCZNIE MATEUSZ. Agent ich nie zgaduje.
      Numer sekcji też pochodzi od niego (kolejność z górnej nawigacji).
      "wTabeli": false = plik jest w katalogu, ale nie pokazujemy go w tabelach.
      Póki `etap` jest null, plakietka mówi „do ustalenia”, a pole `prop`
      trzyma propozycję agenta do potwierdzenia (nigdy nie jest pokazywana
      klientowi jako stan faktyczny).

   Po każdej zmianie w tym pliku:
     python3 zasoby/kod/_narzedzia/stan-tabela.py
   Robi to za Ciebie skrypt deployu, więc ręcznie tylko przy podglądzie.
   =========================================================================== */
window.CW_STATUS = {
  "meta": {
    "zaktualizowano": "2026-09-07",
    "projektAC": 837,
    "bazaAC": "https://pm.bizwebstudio.pl/projects/837/tasks/",
    "live": "https://mpasti-jpg.github.io/carbohort-wireframe/v5/",
    "tabelaLive": "https://mpasti-jpg.github.io/carbohort-wireframe/stan-podstron.html",
    "katalogWersji": "v5/"
  },
  "etapy": {
    "lofi": "Lo-Fi",
    "hifi": "Hi-Fi",
    "ui": "UI Design"
  },
  "etykiety": {
    "budowa": {
      "tekst": "W budowie",
      "ton": "neutral"
    },
    "informacje": {
      "tekst": "Wymaga informacji",
      "ton": "uwaga"
    },
    "projektowanie": {
      "tekst": "Projektowanie",
      "ton": "praca"
    },
    "akceptacja": {
      "tekst": "Do akceptacji",
      "ton": "czeka"
    },
    "poprawki": {
      "tekst": "Poprawki",
      "ton": "poprawki"
    },
    "zaakceptowane": {
      "tekst": "Zaakceptowane",
      "ton": "ok"
    }
  },
  "strony": {
    "home.html": {
      "sekcja": "1. Strona główna",
      "nazwa": "Strona główna",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "Dwie martwe kotwice, brak social i telefonu. Sekcja „Program” do przepisania pod nową Próchnicę+. Przebudowa po projekcie UI sklepu"
    },
    "produkty.html": {
      "sekcja": "2. Produkty Carbohort",
      "nazwa": "Produkty Carbohort",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "hifi",
      "data": "02.08",
      "uwaga": "Filar całej gamy. Do zdjęcia przed bramką: „węgiel aktywowany” (3×) i −1119 m³/ha (2×)"
    },
    "carbomat.html": {
      "sekcja": "2. Produkty Carbohort",
      "nazwa": "CARBOMAT ECO",
      "etap": null,
      "etykieta": null,
      "ac": 31223,
      "prop": "ui",
      "data": "26.07",
      "uwaga": "Jedyna strona w projekcie UI (Figma, 14 uwag Sylwii z 13.08). Poszła do projektowania z pominięciem bramek – przypadek, którego nie powtarzamy"
    },
    "carbomat-mata.html": {
      "sekcja": "2. Produkty Carbohort",
      "nazwa": "CARBOMAT Mata Uprawowa",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "hifi",
      "data": "02.08",
      "uwaga": "⚠️ Cztery blokady publikacyjne (patogeny, woda, korzenie, cykle) – przed akceptacją"
    },
    "carbohumic.html": {
      "sekcja": "2. Produkty Carbohort",
      "nazwa": "CARBOHUMIC",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "hifi",
      "data": "02.08",
      "uwaga": "Sprzeczność o mieszaniu ze środkami ochrony roślin; pH filtrowanego w trzech wersjach"
    },
    "carbomat-humic.html": {
      "sekcja": "2. Produkty Carbohort",
      "nazwa": "CARBOMAT HUMIC",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "hifi",
      "data": "02.08",
      "uwaga": "„Węgiel aktywowany” 4× w pliku, w tym w tytule i opisie meta – to tożsamość strony, osobna decyzja treściowa"
    },
    "uprawy.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Hub upraw",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "07.09",
      "uwaga": "Sekcja „Program dla jednej rośliny” z kaflami roślin. Do zrobienia: kategorie wg podziału Darka z 04.08"
    },
    "kukurydza.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Kukurydza",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "hifi",
      "data": "07.09",
      "uwaga": "Nowa, 13 sekcji. Trzeci wzorzec strony pojedynczej uprawy; jedyna uprawa z programem po recenzji"
    },
    "ziemniak.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Ziemniak",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "hifi",
      "data": "07.09",
      "uwaga": "Pierwszy wzorzec strony pojedynczej uprawy, skala BBCH. ⚠️ Brak zejścia z żadnej strony segmentowej"
    },
    "borowka.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Borówka",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "hifi",
      "data": "07.09",
      "uwaga": "Wzorzec na uprawie wieloletniej: jednostki na roślinę i metr rzędu, dwa scenariusze plantacji"
    },
    "sadownicze.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Sadownicze",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "Segment. Czeka na ranking G1–G7 i model matrycy z 10.08. ⚠️ Punkt „Badamy” do przepisania pod nową Próchnicę+"
    },
    "jagodowe.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Jagodowe",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "07.09",
      "uwaga": "Segment. Zejście na borówkę dodane; do rozgraniczenia zakres segmentu wobec strony borówki"
    },
    "warzywnicze.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Warzywnicze",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "⚠️ CARBOHUMIC CALBOR w warzywach wbrew rejestracji G-1733/25 – do zdjęcia od ręki"
    },
    "zboza.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Zboża i pole",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "07.09",
      "uwaga": "Segment. Poleca MAXI PLUS na polu wbrew decyzji z 06.08; stara dawka próbna"
    },
    "szkolki.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Szkółki",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "Segment zostaje; persona do ustalenia"
    },
    "trawnik.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Trawnik",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "Wdrożyć pięć odpowiedzi klienta na obiekcje hobbysty 1:1"
    },
    "ogrod.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Ogród i działka",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "Kobiety rdzeniem segmentu – język i wizual do zmiany"
    },
    "krzewy.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Krzewy i tuje",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "Jak ogród i działka"
    },
    "zielen.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Zieleń miejska",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": null,
      "data": "25.07",
      "uwaga": "❄️ Persona odłożona 06.08. Zdjęta z nawigacji i hubu 07.09 – strona osierocona, wejście tylko adresem wprost"
    },
    "prochnica-plus.html": {
      "sekcja": "4. Programy i badania",
      "nazwa": "Próchnica+",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "hifi",
      "data": "06.09",
      "uwaga": "Hub programu wieloletniego: 12 sekcji, 6 gospodarstw, oś 2025–2028. 13 pytań do klienta w backlogu"
    },
    "centrum-wiedzy.html": {
      "sekcja": "5. Centrum wiedzy",
      "nazwa": "Centrum wiedzy",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "⚠️ Zakładka „Rolnik” się nie otwiera; układ z 10.08 niewdrożony; 13 artykułów Darka czeka"
    },
    "o-firmie.html": {
      "sekcja": "6. O nas",
      "nazwa": "O nas",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "⚠️ „Nasze złoże” – firma złoża nie ma; trzy rodziny zamiast czterech; osiem pytań faktograficznych"
    },
    "kontakt.html": {
      "sekcja": "7. Kontakt",
      "nazwa": "Kontakt",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "Formularz bez modelu danych; wszystkie dane kontaktowe zmyślone"
    },
    "konfigurator.html": {
      "sekcja": "8. Konfigurator",
      "nazwa": "Konfigurator",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "hifi",
      "data": "07.09",
      "uwaga": "Przebudowany od nowa: 4 pytania, 11 grup, matryca dawek ze źródłami. Logika czeka na akceptację Darka (15 pytań P-1…P-15)"
    },
    "sklep.html": {
      "sekcja": "9. Sklep",
      "nazwa": "Lista produktów",
      "etap": null,
      "etykieta": null,
      "ac": 31512,
      "prop": "hifi",
      "data": "10.08",
      "uwaga": "Katalog realny: 49 SKU w 20 kartach. Kierunek przyjęty 10.08 (akceptacja dorozumiana). Brak warstwy promocyjnej; termin 30.09"
    },
    "pdp.html": {
      "sekcja": "9. Sklep",
      "nazwa": "Karta produktu",
      "etap": null,
      "etykieta": null,
      "ac": 31512,
      "prop": "hifi",
      "data": "10.08",
      "uwaga": "Cel kodów QR z etykiet. Potrzebne karty per SKU (49 pozycji), dziś jest jedna"
    },
    "koszyk.html": {
      "sekcja": "9. Sklep",
      "nazwa": "Koszyk",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "Ceny demonstracyjne sprzed katalogu; do przebudowy po akceptacji sklepu"
    },
    "checkout.html": {
      "sekcja": "9. Sklep",
      "nazwa": "Kasa",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "Bez płatności (D2); sprzeczne SLA z potwierdzeniem"
    },
    "potwierdzenie.html": {
      "sekcja": "9. Sklep",
      "nazwa": "Potwierdzenie zamówienia",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "Jak kasa"
    },
    "platforma-b2b.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Panel zamówień",
      "etap": null,
      "etykieta": null,
      "ac": 31514,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "Warstwa 1 zmian gotowa do wykonania bez pytań; trzy nowe ekrany przed wyceną"
    },
    "rejestracja.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Rejestracja B2B",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "Jeden próg, weryfikacja po fakcie; zdjąć segment zieleni miejskiej"
    },
    "potwierdzenie-b2b.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Potwierdzenie B2B",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "Duplikuje sekcję w panelu; obietnica pakietu dokumentów bez pokrycia"
    },
    "admin.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Panel producenta",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "24.07",
      "uwaga": "Narzędzie wewnętrzne; słownik statusów niespójny z panelem klienta"
    },
    "partner.html": {
      "sekcja": "Pozostałe",
      "nazwa": "Zostań partnerem",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": "lofi",
      "data": "25.07",
      "uwaga": "W sekcji „Pozostałe\" do czasu decyzji o numeracji – tak jak przyszłe podstrony opisowe (regulaminy, cookies). Persona doradcy odłożona 06.08, więc otwarte zostaje też to, czy strona zostaje"
    },
    "zalecenia.html": {
      "sekcja": "Poza tabelą",
      "nazwa": "Zalecenia (QR)",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": null,
      "data": "25.07",
      "uwaga": "❌ Do usunięcia (decyzja 10.08: QR → karta produktu). Zdjęta z tabeli 07.09 na polecenie Mateusza. Plik nadal leży w katalogu, bo 44 linki w 15 podstronach czekają na przepięcie",
      "wTabeli": false
    },
    "carbomat-v2.html": {
      "sekcja": "Poza tabelą",
      "nazwa": "CARBOMAT – layout V2",
      "etap": null,
      "etykieta": null,
      "ac": null,
      "prop": null,
      "data": "10.07",
      "uwaga": "Koncept layoutu, nigdy na live, pomijany w każdym pushu. Do przeniesienia do archiwum-wersji",
      "wTabeli": false
    }
  }
};
