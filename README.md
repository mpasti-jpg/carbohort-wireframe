# CarboHort – prototyp serwisu (makiety)

Klikalny prototyp nowego serwisu CarboHort. Repozytorium jest publikowane przez
GitHub Pages z gałęzi `main`, katalog `/`.

Adres startowy: https://mpasti-jpg.github.io/carbohort-wireframe/
(prowadzi na stronę stanu podstron).

## Co tu jest

| Ścieżka | Zawartość |
| --- | --- |
| `v7/` | makiety podstron (strona główna: `v7/home.html`) |
| `stan-podstron.html` | lista podstron z etapem prac i odnośnikami |
| `ce-indeks.html`, `ce-indeks/` | indeks content elementów (CE), z których zbudowane są podstrony, wraz z danymi i miniaturami |
| `style-guide.html` | elementy interfejsu |
| `ce-rejestr.js` | rejestr CE i elementów interfejsu |
| `status.js` | manifest stanu podstron |
| `index.html` | przekierowanie na `stan-podstron.html` |
| `404.html` | przekierowanie dawnych adresów na odpowiednik w `v7/` |

## Jak powstają pliki

Strony są generowane i wysyłane skryptem z prywatnego źródła. Zmian nie wprowadza
się bezpośrednio w tym repozytorium – kolejna wysyłka je nadpisze.
