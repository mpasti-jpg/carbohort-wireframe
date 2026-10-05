/* status.js – public copy of the page-state manifest (generated at deploy;
   the vault keeps the full file with internal notes). */
window.CW_STATUS = {
  "meta": {
    "wersja": "0.2.0",
    "zaktualizowano": "2026-10-04",
    "projektAC": 837,
    "bazaAC": "https://pm.bizwebstudio.pl/projects/837/tasks/",
    "live": "https://mpasti-jpg.github.io/carbohort-wireframe/v7/",
    "tabelaLive": "https://mpasti-jpg.github.io/carbohort-wireframe/stan-podstron.html",
    "katalogWersji": "v7/"
  },
  "tory": [
    {
      "klucz": "makieta",
      "nazwa": "Makieta",
      "pelna": "Makieta – akceptacja układu",
      "kto": "CarboHort",
      "stany": [
        {
          "klucz": "w-przygotowaniu",
          "nazwa": "w przygotowaniu",
          "ton": "neutral"
        },
        {
          "klucz": "do-akceptacji",
          "nazwa": "do akceptacji",
          "ton": "czeka"
        },
        {
          "klucz": "poprawki",
          "nazwa": "poprawki",
          "ton": "poprawki",
          "wraca_do": "do-akceptacji"
        },
        {
          "klucz": "zaakceptowany",
          "nazwa": "układ zaakceptowany",
          "ton": "ok"
        }
      ]
    },
    {
      "klucz": "tresc",
      "nazwa": "Treść",
      "pelna": "Treść – ostateczne teksty i dane",
      "kto": "CarboHort",
      "stany": [
        {
          "klucz": "oczekuje",
          "nazwa": "oczekuje na ostateczną treść",
          "ton": "czeka"
        },
        {
          "klucz": "zaakceptowana",
          "nazwa": "zaakceptowana",
          "ton": "ok"
        }
      ]
    },
    {
      "klucz": "projekt",
      "nazwa": "Projekt graficzny",
      "pelna": "Projekt graficzny",
      "kto": "crear",
      "stany": [
        {
          "klucz": "do-grafika",
          "nazwa": "do grafika",
          "ton": "neutral"
        },
        {
          "klucz": "w-trakcie-projektowania",
          "nazwa": "w trakcie projektowania",
          "ton": "praca"
        },
        {
          "klucz": "poprawki",
          "nazwa": "poprawki",
          "ton": "poprawki",
          "wraca_do": "w-trakcie-projektowania"
        },
        {
          "klucz": "gotowy",
          "nazwa": "gotowy",
          "ton": "ok"
        },
        {
          "klucz": "bez-projektu",
          "nazwa": "bez osobnego projektu",
          "ton": "neutral"
        }
      ]
    },
    {
      "klucz": "media",
      "nazwa": "Media",
      "pelna": "Media – zdjęcia i filmy",
      "kto": "crear",
      "stany": [
        {
          "klucz": "do-zebrania",
          "nazwa": "do zebrania",
          "ton": "neutral"
        },
        {
          "klucz": "w-przygotowaniu",
          "nazwa": "w przygotowaniu",
          "ton": "praca"
        },
        {
          "klucz": "poprawki",
          "nazwa": "poprawki",
          "ton": "poprawki",
          "wraca_do": "w-przygotowaniu"
        },
        {
          "klucz": "gotowe",
          "nazwa": "gotowe",
          "ton": "ok"
        },
        {
          "klucz": "nie-dotyczy",
          "nazwa": "nie dotyczy",
          "ton": "neutral"
        }
      ]
    },
    {
      "klucz": "infografiki",
      "nazwa": "Infografiki",
      "pelna": "Infografiki",
      "kto": "crear",
      "stany": [
        {
          "klucz": "do-zrobienia",
          "nazwa": "do zrobienia",
          "ton": "neutral"
        },
        {
          "klucz": "gotowe",
          "nazwa": "gotowe",
          "ton": "ok"
        },
        {
          "klucz": "nie-dotyczy",
          "nazwa": "nie dotyczy",
          "ton": "neutral"
        }
      ]
    },
    {
      "klucz": "wdrozenie",
      "nazwa": "Wdrożenie",
      "pelna": "Wdrożenie",
      "kto": "crear",
      "stany": []
    }
  ],
  "akceptacja_ukladu": "Akceptujesz układ: kolejność sekcji i to, o czym mówi każda z nich. Teksty, liczby i tabele są robocze – ich akceptacja będzie osobnym krokiem.",
  "strony": {
    "home.html": {
      "sekcja": "1. Strona główna",
      "nazwa": "Strona główna",
      "stan": {
        "makieta": "w-przygotowaniu",
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": 31562,
      "data": "20.09"
    },
    "produkty.html": {
      "sekcja": "2. Produkty Carbohort",
      "nazwa": "Produkty Carbohort",
      "stan": {
        "makieta": "do-akceptacji",
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": 31789,
      "data": "02.10"
    },
    "carbomat.html": {
      "sekcja": "2. Produkty Carbohort",
      "nazwa": "CARBOMAT ECO",
      "stan": {
        "makieta": "do-akceptacji",
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": 31223,
      "data": "02.10"
    },
    "carbomat-mata.html": {
      "sekcja": "2. Produkty Carbohort",
      "nazwa": "CARBOMAT Mata Uprawowa",
      "stan": {
        "makieta": "do-akceptacji",
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": 31563,
      "data": "02.10"
    },
    "carbohumic.html": {
      "sekcja": "2. Produkty Carbohort",
      "nazwa": "CARBOHUMIC",
      "stan": {
        "makieta": "do-akceptacji",
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": 31564,
      "data": "02.10"
    },
    "carbomat-humic.html": {
      "sekcja": "2. Produkty Carbohort",
      "nazwa": "CARBOMAT HUMIC",
      "stan": {
        "makieta": "do-akceptacji",
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": 31565,
      "data": "02.10"
    },
    "uprawy.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Hub upraw",
      "stan": {
        "makieta": "w-przygotowaniu",
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": 30722,
      "data": "07.09"
    },
    "kukurydza.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Kukurydza",
      "stan": {
        "makieta": "do-akceptacji",
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": 31566,
      "data": "02.10"
    },
    "ziemniak.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Ziemniak",
      "stan": {
        "makieta": "do-akceptacji",
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": 31567,
      "data": "07.09"
    },
    "borowka.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Borówka",
      "stan": {
        "makieta": "do-akceptacji",
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": 31568,
      "data": "02.10"
    },
    "sadownicze.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Sadownicze",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "25.07"
    },
    "jagodowe.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Jagodowe",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "07.09"
    },
    "warzywnicze.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Warzywnicze",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "25.07"
    },
    "zboza.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Zboża i pole",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "07.09"
    },
    "szkolki.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Szkółki",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "25.07"
    },
    "trawnik.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Trawnik",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "25.07"
    },
    "ogrod.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Ogród i działka",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "25.07"
    },
    "krzewy.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Krzewy i tuje",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "25.07"
    },
    "zielen.html": {
      "sekcja": "3. Rodzaje upraw",
      "nazwa": "Zieleń miejska",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "25.07"
    },
    "prochnica-plus.html": {
      "sekcja": "4. Programy i badania",
      "nazwa": "Próchnica+",
      "stan": {
        "makieta": "do-akceptacji",
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": 31569,
      "data": "02.10"
    },
    "centrum-wiedzy.html": {
      "sekcja": "5. Centrum wiedzy",
      "nazwa": "Centrum wiedzy",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "15.09"
    },
    "centrum-wiedzy-kategoria.html": {
      "sekcja": "5. Centrum wiedzy",
      "nazwa": "Centrum wiedzy – kategoria",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "15.09"
    },
    "artykul.html": {
      "sekcja": "5. Centrum wiedzy",
      "nazwa": "Centrum wiedzy – artykuł",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "15.09"
    },
    "o-firmie.html": {
      "sekcja": "6. O nas",
      "nazwa": "O nas",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "15.09"
    },
    "kontakt.html": {
      "sekcja": "7. Kontakt",
      "nazwa": "Kontakt",
      "stan": {
        "makieta": "w-przygotowaniu",
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": 31570,
      "data": "15.09"
    },
    "konfigurator.html": {
      "sekcja": "8. Konfigurator",
      "nazwa": "Konfigurator",
      "stan": {
        "makieta": "w-przygotowaniu",
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": 30721,
      "data": "08.09"
    },
    "sklep.html": {
      "sekcja": "9. Sklep",
      "nazwa": "Lista produktów",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": 31512,
      "data": "28.09"
    },
    "pdp.html": {
      "sekcja": "9. Sklep",
      "nazwa": "Karta produktu – CARBOMAT ECO pH 6,0–6,5",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": 31512,
      "data": "28.09"
    },
    "pdp-kwasny.html": {
      "sekcja": "9. Sklep",
      "nazwa": "Karta produktu – CARBOMAT ECO pH 4,5–5,0",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "28.09"
    },
    "koszyk.html": {
      "sekcja": "9. Sklep",
      "nazwa": "Koszyk",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "28.09"
    },
    "checkout.html": {
      "sekcja": "9. Sklep",
      "nazwa": "Kasa",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "25.07"
    },
    "potwierdzenie.html": {
      "sekcja": "9. Sklep",
      "nazwa": "Potwierdzenie zamówienia",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "25.07"
    },
    "logowanie.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Logowanie",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "04.10"
    },
    "rejestracja.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Wniosek o konto PRO",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "04.10"
    },
    "platforma-b2b.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Panel – Pulpit",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": 31514,
      "data": "04.10"
    },
    "b2b-zamow.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Panel – Zamów",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "04.10"
    },
    "b2b-dostawa.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Panel – Dostawa i płatność",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "04.10"
    },
    "potwierdzenie-b2b.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Panel – Zamówienie",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "04.10"
    },
    "b2b-zamowienia.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Panel – Zamówienia",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "04.10"
    },
    "b2b-uzgodnienie.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Panel – Uzgodnienie z opiekunem",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "04.10"
    },
    "b2b-oferta.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Panel – Oferta od opiekuna",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "04.10"
    },
    "b2b-dokumenty.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Panel – Dokumenty",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "04.10"
    },
    "b2b-opiekun.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Panel – Opiekun",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "04.10"
    },
    "admin.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Handlowiec – Zamówienia klientów PRO",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "04.10"
    },
    "handlowiec-zamowienie.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Handlowiec – Zamówienie z telefonu",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "04.10"
    },
    "handlowiec-klient.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Handlowiec – Karta klienta",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "04.10"
    },
    "handlowiec-uzgodnienie.html": {
      "sekcja": "10. Platforma B2B",
      "nazwa": "Handlowiec – Odpowiedź na prośbę",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "04.10"
    },
    "partner.html": {
      "sekcja": "Pozostałe",
      "nazwa": "Zostań partnerem",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "25.07"
    },
    "zalecenia.html": {
      "sekcja": "Poza tabelą",
      "nazwa": "Zalecenia (QR)",
      "stan": {
        "makieta": null,
        "tresc": null,
        "projekt": null,
        "media": null,
        "infografiki": null,
        "wdrozenie": null
      },
      "ac": null,
      "data": "25.07",
      "wTabeli": false
    }
  }
};
