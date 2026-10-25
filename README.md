# 10 km sub 50 — plan treningowy

Mobilna aplikacja z 9-tygodniowym planem treningowym na 10 km poniżej 50 minut — na podstawie rozmowy z ChatGPT. Trzy biegi w tygodniu (poniedziałek, środa, sobota), czwartkowa ścianka i zasady regeneracji.

## Co potrafi

- 9 tygodni, 27 treningów z dystansem, tempem i celem każdej jednostki
- odhaczanie treningów, wpisywanie czasu i notatek
- pasek postępu, aktualny tydzień na podstawie daty startu
- **integracja ze Stravą**: automatyczne dopasowanie aktywności do dni treningowych i staty (dystans, czas, tempo, przewyższenia, tętno)
- tryb bez kluczy API: podpięcie pojedynczej aktywności linkiem (oficjalny embed Stravy)
- eksport / import danych, dane w `localStorage`
- PWA: dodanie do ekranu głównego i praca offline (poza statami ze Stravy)

## Strona

https://karoletrych.github.io/plan-10km-sub50/

## Połączenie ze Stravą

Aplikacja jest statyczna (GitHub Pages), więc korzysta z Twojej własnej aplikacji Strava API — tokeny zostają wyłącznie w Twojej przeglądarce.

1. Wejdź na https://www.strava.com/settings/api i utwórz aplikację.
2. **Website**: `https://karoletrych.github.io/plan-10km-sub50/`
3. **Authorization Callback Domain**: `karoletrych.github.io`
4. W aplikacji kliknij **Połącz Stravę** i wklej **Client ID** oraz **Client Secret**.
5. Zezwól na dostęp do aktywności (`activity:read_all`).

Po połączeniu aplikacja pobiera biegi z ostatnich 400 dni, dopasowuje je po dacie do treningów i odhacza pasujące jednostki. Nowe aktywności dociągają się przy każdym otwarciu (maks. raz na 30 minut) albo po kliknięciu **Synchronizuj**.

> Uwaga: Client Secret jest przechowywany w `localStorage` przeglądarki — nie trafia do repozytorium. Jeśli nie chcesz tworzyć aplikacji API, możesz podpiąć aktywność ręcznie linkiem, ale embed Stravy działa tylko dla aktywności publicznych.

## Lokalnie

Wystarczy dowolny serwer statyczny:

```bash
npx serve .
```

## Struktura

```
index.html
assets/plan.js      # dane planu
assets/app.js       # logika, localStorage, Strava API
assets/styles.css
sw.js               # cache offline
manifest.webmanifest
```
