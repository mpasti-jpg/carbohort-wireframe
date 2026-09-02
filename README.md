# Carbohort – prototyp serwisu (makiety)

Jedno repo na wszystkie wersje prototypu. Każda wersja mieszka w osobnym katalogu
i ma własny adres na GitHub Pages, dzięki czemu można je porównywać, a dostęp do
repozytorium nadaje się raz – działa też dla wersji, które dopiero powstaną.

## Wersje

| Wersja | Katalog | Adres |
| --- | --- | --- |
| V5 – linia rozwojowa | `v5/` | https://mpasti-jpg.github.io/carbohort-wireframe/v5/ |

Wersja V4 (zamrożona, do porównania) stoi w osobnym repo:
https://mpasti-jpg.github.io/carbohort-wireframe-v4/

`index.html` w korzeniu to rozdzielacz z listą wersji. `404.html` przekierowuje
stare linki bez numeru wersji (np. `/carbohort-wireframe/home.html`) na aktualną
linię rozwojową, więc adresy rozesłane przed reorganizacją nadal działają.

## Jak dodać kolejną wersję

1. Skopiuj katalog poprzedniej wersji: `cp -R v5 v6`.
2. Dopisz wiersz do tabeli wyżej i do listy w `index.html`.
3. Podnieś `LATEST` w `404.html`, jeśli nowa wersja ma przejmować stare linki.
4. Commit i `git push origin main`. GitHub Pages publikuje z gałęzi `main`, katalog `/`.

Linki wewnątrz stron są względne, więc katalog wersji można kopiować i przenosić
bez poprawek w kodzie.
