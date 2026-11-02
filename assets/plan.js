/* Plan treningowy 10 km sub 50:00 — dane statyczne */
window.PLAN = {
  title: "10 km poniżej 50:00",
  subtitle: "9 tygodni · 3 biegi w tygodniu · czwartkowa ścianka",
  goal: "Cel: złamać 50 minut. Plan jest ułożony pod ten cel — z testem 5 km w 4. tygodniu i rosnącą pracą w 5:10. Jeśli test wyjdzie poniżej 24:30, atakujemy sub-50; jeśli nie, korygujemy tempa, nie ambicję.",

  paces: [
    {
      name: "Bieg spokojny",
      value: "6:20–6:45 min/km",
      desc: "Wysiłek 3–4/10. Możesz rozmawiać pełnymi zdaniami. Nie przyspieszaj.",
      tone: "green",
      icon: "heart"
    },
    {
      name: "Tempo progowe",
      value: "5:10–5:20 min/km",
      desc: "Wysiłek 6–7/10. Mocno, ale kontrolowanie — bez walki o życie.",
      tone: "orange",
      icon: "pulse"
    },
    {
      name: "Tempo docelowe na 10 km",
      value: "4:59 min/km",
      desc: "Tempo startowe. Pojawia się w krótkich odcinkach — nie wymuszamy go na całym treningu.",
      tone: "blue",
      icon: "bolt"
    }
  ],

  schedule: [
    { day: "Pn", label: "Bieg", type: "run" },
    { day: "Wt", label: "Regeneracja", type: "rest" },
    { day: "Śr", label: "Bieg", type: "run" },
    { day: "Czw", label: "Ścianka", type: "climb" },
    { day: "Pt", label: "Odpoczynek", type: "rest" },
    { day: "Sob", label: "Bieg", type: "run" },
    { day: "Nd", label: "Odpoczynek", type: "rest" }
  ],

  weeks: [
    {
      n: 1,
      title: "Powrót do rytmu",
      volume: "ok. 18 km",
      workouts: [
        {
          id: "w1-1", day: "Poniedziałek", title: "6 km spokojnie + przebieżki", type: "easy",
          distance: "6 km", km: 6, pace: "6:20–6:45 min/km",
          bullets: [
            "Bieg spokojny, rozmowny — bez patrzenia na tempo co kilometr.",
            "Na koniec 4 × 20 sekund luźnych przebieżek, 60 sekund marszu między nimi."
          ],
          goal: "Wrócić do regularności i obudzić nogi."
        },
        {
          id: "w1-2", day: "Środa", title: "5 km spokojnie", type: "easy",
          distance: "5 km", km: 5, pace: "6:20–6:45 min/km",
          bullets: [
            "Bez przyspieszeń.",
            "Zostaw świeżość na czwartkową ściankę."
          ],
          goal: "Spokojne drugie wyjście w tygodniu."
        },
        {
          id: "w1-3", day: "Sobota", title: "7 km spokojnie", type: "easy",
          distance: "7 km", km: 7, pace: "6:20–6:45 min/km",
          bullets: [
            "Równe, komfortowe tempo przez cały dystans.",
            "Nie sprawdzaj na końcu, ile masz w nogach."
          ],
          goal: "Zbudować czas na nogach."
        }
      ]
    },
    {
      n: 2,
      title: "Baza i przebieżki",
      volume: "ok. 20 km",
      workouts: [
        {
          id: "w2-1", day: "Poniedziałek", title: "6 km spokojnie + przebieżki", type: "easy",
          distance: "6 km", km: 6, pace: "6:20–6:45 min/km",
          bullets: [
            "Spokojny bieg.",
            "Na koniec 4 × 20 sekund przebieżek, 60 sekund marszu."
          ],
          goal: "Utrzymać rytm i lekkość kroku."
        },
        {
          id: "w2-2", day: "Środa", title: "6 km spokojnie", type: "easy",
          distance: "6 km", km: 6, pace: "6:20–6:45 min/km",
          bullets: [
            "Bez akcentów.",
            "Bieg ma być lekki."
          ],
          goal: "Spokojne wyjście między akcentami."
        },
        {
          id: "w2-3", day: "Sobota", title: "8 km spokojnie", type: "easy",
          distance: "8 km", km: 8, pace: "6:20–6:45 min/km",
          bullets: [
            "Nie walka o tempo — liczy się czas na nogach.",
            "Jeśli 6:20 nie pozwala rozmawiać, zwolnij."
          ],
          goal: "Zwiększyć wytrzymałość."
        }
      ]
    },
    {
      n: 3,
      title: "Pierwszy próg",
      volume: "ok. 23 km",
      workouts: [
        {
          id: "w3-1", day: "Poniedziałek", title: "8 km, w tym 4 × 1 km progowo", type: "quality",
          distance: "8 km", km: 8, pace: "odcinki 5:15–5:20 min/km",
          bullets: [
            "2 km rozgrzewki.",
            "4 × 1 km w 5:15–5:20, 90 sekund truchtu między odcinkami.",
            "1–2 km schłodzenia."
          ],
          goal: "Pierwszy kontakt z tempem progowym."
        },
        {
          id: "w3-2", day: "Środa", title: "6 km spokojnie", type: "easy",
          distance: "6 km", km: 6, pace: "6:20–6:45 min/km",
          bullets: [
            "Bez przyspieszeń.",
            "Zostaw świeżość na ściankę."
          ],
          goal: "Spokojny bieg bez kumulowania zmęczenia."
        },
        {
          id: "w3-3", day: "Sobota", title: "9 km spokojnie", type: "easy",
          distance: "9 km", km: 9, pace: "6:20–6:45 min/km",
          bullets: [
            "Trzymaj równe, komfortowe tempo."
          ],
          goal: "Budowanie wytrzymałości."
        }
      ]
    },
    {
      n: 4,
      title: "Test 5 km",
      volume: "ok. 22 km",
      workouts: [
        {
          id: "w4-1", day: "Poniedziałek", title: "6 km spokojnie + przebieżki", type: "easy",
          distance: "6 km", km: 6, pace: "6:20–6:45 min/km",
          bullets: [
            "Spokojny bieg.",
            "4 × 20 sekund przebieżek na koniec."
          ],
          goal: "Lekko przed testem."
        },
        {
          id: "w4-2", day: "Środa", title: "Test 5 km", type: "quality",
          distance: "5 km + rozgrzewka", km: 8, pace: "test na maksa",
          bullets: [
            "2 km rozgrzewki.",
            "5 km na maksa — zapisz czas.",
            "1 km schłodzenia.",
            "Wynik ≤ 24:30 = jesteś na kursie sub-50."
          ],
          goal: "Sprawdzić, gdzie naprawdę jesteś."
        },
        {
          id: "w4-3", day: "Sobota", title: "8 km spokojnie", type: "easy",
          distance: "8 km", km: 8, pace: "6:20–6:45 min/km",
          bullets: [
            "Spokojnie, bez sprawdzania formy."
          ],
          goal: "Zamknąć lżejszy tydzień."
        }
      ]
    },
    {
      n: 5,
      title: "Próg 2 km",
      volume: "ok. 26 km",
      workouts: [
        {
          id: "w5-1", day: "Poniedziałek", title: "9 km, w tym 3 × 2 km progowo", type: "quality",
          distance: "9 km", km: 9, pace: "odcinki 5:10–5:15 min/km",
          bullets: [
            "2 km rozgrzewki.",
            "3 × 2 km w 5:10–5:15, 2 minuty truchtu.",
            "1 km schłodzenia."
          ],
          goal: "Wydłużyć pracę w tempie progowym."
        },
        {
          id: "w5-2", day: "Środa", title: "7 km spokojnie", type: "easy",
          distance: "7 km", km: 7, pace: "6:20–6:45 min/km",
          bullets: [
            "Bez szybkich odcinków."
          ],
          goal: "Spokojne wyjście między akcentami."
        },
        {
          id: "w5-3", day: "Sobota", title: "10 km spokojnie", type: "easy",
          distance: "10 km", km: 10, pace: "6:20–6:45 min/km",
          bullets: [
            "Nie przyspieszaj na końcu po to, żeby sprawdzić formę."
          ],
          goal: "Wytrzymałość bez ścigania."
        }
      ]
    },
    {
      n: 6,
      title: "Próg 3 km",
      volume: "ok. 26 km",
      workouts: [
        {
          id: "w6-1", day: "Poniedziałek", title: "9 km, w tym 2 × 3 km progowo", type: "quality",
          distance: "9 km", km: 9, pace: "odcinki 5:10 min/km",
          bullets: [
            "2 km rozgrzewki.",
            "2 × 3 km w 5:10, 3 minuty truchtu.",
            "1 km schłodzenia."
          ],
          goal: "Utrzymać tempo pod zmęczeniem."
        },
        {
          id: "w6-2", day: "Środa", title: "6 km spokojnie", type: "easy",
          distance: "6 km", km: 6, pace: "6:20–6:45 min/km",
          bullets: [
            "Zachowaj lekkość kroku."
          ],
          goal: "Regeneracja między mocniejszymi jednostkami."
        },
        {
          id: "w6-3", day: "Sobota", title: "11 km z finiszem", type: "easy",
          distance: "11 km", km: 11, pace: "6:20–6:45; ostatnie 2 km 5:20",
          bullets: [
            "Spokojnie do 9 km.",
            "Ostatnie 2 km w 5:20."
          ],
          goal: "Nauczyć się biegać szybciej na zmęczonych nogach."
        }
      ]
    },
    {
      n: 7,
      title: "Najdłuższy tydzień",
      volume: "ok. 29 km",
      workouts: [
        {
          id: "w7-1", day: "Poniedziałek", title: "11 km, w tym 2 × 4 km progowo", type: "quality",
          distance: "11 km", km: 11, pace: "odcinki 5:10 min/km",
          bullets: [
            "2 km rozgrzewki.",
            "2 × 4 km w 5:10, 4 minuty truchtu.",
            "1 km schłodzenia."
          ],
          goal: "Najmocniejszy akcent w planie."
        },
        {
          id: "w7-2", day: "Środa", title: "6 km spokojnie", type: "easy",
          distance: "6 km", km: 6, pace: "6:20–6:45 min/km",
          bullets: [
            "Bez dokładania akcentów."
          ],
          goal: "Spokojnie przed długim biegiem."
        },
        {
          id: "w7-3", day: "Sobota", title: "12 km z finiszem", type: "easy",
          distance: "12 km", km: 12, pace: "6:20–6:45; ostatnie 3 km 5:15",
          bullets: [
            "Spokojnie do 9 km.",
            "Ostatnie 3 km w 5:15."
          ],
          goal: "Najdłuższy bieg i symulacja końcówki."
        }
      ]
    },
    {
      n: 8,
      title: "Rzeźbienie tempa",
      volume: "ok. 22 km",
      workouts: [
        {
          id: "w8-1", day: "Poniedziałek", title: "7 km, w tym 4 × 1 km w tempie startowym", type: "quality",
          distance: "7 km", km: 7, pace: "odcinki 4:55–5:00 min/km",
          bullets: [
            "2 km rozgrzewki.",
            "4 × 1 km w 4:55–5:00, 2 minuty truchtu.",
            "1 km schłodzenia."
          ],
          goal: "Oswoić tempo startowe."
        },
        {
          id: "w8-2", day: "Środa", title: "6 km spokojnie", type: "easy",
          distance: "6 km", km: 6, pace: "6:20–6:45 min/km",
          bullets: [
            "Na koniec 4 × 15 sekund luźnych przebieżek."
          ],
          goal: "Lekko, z krótkim pobudzeniem nóg."
        },
        {
          id: "w8-3", day: "Sobota", title: "9 km spokojnie", type: "easy",
          distance: "9 km", km: 9, pace: "6:20–6:45 min/km",
          bullets: [
            "Nie zwiększaj dystansu ani intensywności."
          ],
          goal: "Spokojnie domknąć tydzień."
        }
      ]
    },
    {
      n: 9,
      title: "Świeżość przed startem",
      volume: "plus start na 10 km",
      workouts: [
        {
          id: "w9-1", day: "Poniedziałek", title: "5 km spokojnie + przebieżki", type: "easy",
          distance: "5 km", km: 5, pace: "6:20–6:45 min/km",
          bullets: [
            "Wszystko ma być lekkie.",
            "Na koniec 4 × 20 sekund przebieżek."
          ],
          goal: "Pobudzić nogi, nie zmęczyć ich."
        },
        {
          id: "w9-2", day: "Środa", title: "5 km, w tym 2 × 1 km w tempie startowym", type: "quality",
          distance: "5 km", km: 5, pace: "odcinki 5:00 min/km",
          bullets: [
            "2 km rozgrzewki.",
            "2 × 1 km w 5:00, 2 minuty truchtu.",
            "1 km schłodzenia."
          ],
          goal: "Przypomnieć sobie tempo startowe, bez zmęczenia."
        },
        {
          id: "w9-3", day: "Sobota", title: "Start na 10 km", type: "race",
          distance: "10 km", km: 10, pace: "cel: poniżej 50:00",
          bullets: [
            "Przed startem 10–15 minut lekkiej rozgrzewki i kilka krótkich przebieżek.",
            "Nie zaczynaj szybciej niż 5:05/km, nawet jeśli czujesz się świetnie."
          ],
          goal: "Cel: poniżej 50:00.",
          race: [
            { split: "Km 1–2", target: "ok. 5:05/km" },
            { split: "Km 3–7", target: "ok. 5:00/km" },
            { split: "Km 8–9", target: "ok. 4:55/km" },
            { split: "Km 10", target: "najmocniej, jak dasz radę" }
          ]
        }
      ]
    }
  ],

  rules: [
    "Jeśli nie możesz utrzymać założeń tempa w kontrolowany sposób, zwolnij — lepszy wolniejszy trening niż wymuszony.",
    "Jeżeli ból narasta podczas biegu, zmienia krok albo utrzymuje się przez kolejne dni, przerwij progresję. Nie przechodź automatycznie do następnego tygodnia.",
    "Po ciężkiej ściance, szczególnie z mocnymi wysokimi stopniami i dynamiczną pracą nóg, dostosuj środowy bieg do samopoczucia.",
    "Jeżeli trening nie wszedł, nie nadrabiaj go następnego dnia."
  ],

  recovery: [
    "Czwartek to dzień ścianki, nie dodatkowy bieg — nie dokładaj kilometrów tego dnia.",
    "Piątek zostaw wolny: spacer, lekka mobilność, sen. To dzień, który chroni jakość sobotniego biegu.",
    "Jeśli po ściance nogi są obolałe, skróć i zwolnij środowy bieg. Lepiej stracić kilometr niż cały tydzień.",
    "W tygodniu z bardzo mocną ścianką nie dokładaj akcentu biegowego — plan i tak ma zapas."
  ],

  outro: "Plan jest ułożony pod sub-50, ale nie obiecuje go na papierze. Test 5 km w 4. tygodniu powie, czy jesteś na kursie. Jeśli tak — nie zmieniamy nic. Jeśli nie — korygujemy tempa, nie ambicję."
};

/* Bieg poza planem podpięty na stałe (staty dociągnie Strava API) */
window.PLAN.pinned = [
  {
    id: 20726886835,
    name: "Popołudniowy bieg",
    type: "Run",
    date: "2026-10-25T13:47:44",
    pinned: true
  }
];
