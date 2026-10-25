/* Plan treningowy 10 km sub 50:00 — dane statyczne */
window.PLAN = {
  title: "10 km poniżej 50:00",
  subtitle: "9 tygodni · 3 biegi w tygodniu · czwartkowa ścianka",
  goal: "Realny cel: zejść poniżej 50 minut, budując formę po przerwie — bez nadrabiania szybkości na siłę.",

  paces: [
    {
      name: "Bieg spokojny i długi",
      value: "6:10–7:00 min/km",
      desc: "Wysiłek 3–4/10. Możesz rozmawiać pełnymi zdaniami.",
      tone: "green",
      icon: "heart"
    },
    {
      name: "Tempo progowe",
      value: "5:15–5:30 min/km",
      desc: "Wysiłek 6–7/10. Wymagające, ale kontrolowane.",
      tone: "orange",
      icon: "pulse"
    },
    {
      name: "Tempo docelowe na 10 km",
      value: "4:59 min/km",
      desc: "Tego tempa nie wymuszamy na początku planu.",
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
      title: "Powrót do regularności",
      volume: "ok. 17 km",
      workouts: [
        {
          id: "w1-1", day: "Poniedziałek", title: "5 km spokojnie", type: "easy",
          distance: "5 km", km: 5, pace: "6:15–7:00 min/km",
          bullets: [
            "Bez przyspieszeń i bez kończenia biegu na maksa.",
            "Bieg ma być łatwy — to budowanie nawyku, nie test formy."
          ],
          goal: "Przyzwyczaić nogi do regularnych obciążeń."
        },
        {
          id: "w1-2", day: "Środa", title: "5 km spokojnie", type: "easy",
          distance: "5 km", km: 5, pace: "6:15–7:00 min/km",
          bullets: [
            "Bez dodatkowych akcentów.",
            "Zostaw świeżość na czwartkową ściankę."
          ],
          goal: "Spokojne drugie wyjście w tygodniu, bez kumulowania zmęczenia."
        },
        {
          id: "w1-3", day: "Sobota", title: "7 km spokojnie", type: "easy",
          distance: "7 km", km: 7, pace: "6:15–7:00 min/km",
          bullets: [
            "Równe, komfortowe tempo przez cały dystans.",
            "Nie sprawdzaj na końcu, ile masz w nogach."
          ],
          goal: "Podtrzymanie wytrzymałości — masz zakończyć z poczuciem, że mógłbyś pobiec dalej."
        }
      ]
    },
    {
      n: 2,
      title: "Pierwsze przebieżki",
      volume: "ok. 19 km",
      workouts: [
        {
          id: "w2-1", day: "Poniedziałek", title: "5,5 km spokojnie", type: "easy",
          distance: "5,5 km", km: 5.5, pace: "6:10–7:00 min/km",
          bullets: [
            "Na koniec 4 × 15 sekund luźnego przyspieszenia.",
            "Po każdym przyspieszeniu 60–90 sekund marszu lub truchtu."
          ],
          goal: "Spokojny bieg z lekkim pobudzeniem nóg."
        },
        {
          id: "w2-2", day: "Środa", title: "5,5 km spokojnie", type: "easy",
          distance: "5,5 km", km: 5.5, pace: "6:15–7:00 min/km",
          bullets: [
            "Bez dodatkowych interwałów.",
            "Bieg ma być lekki."
          ],
          goal: "Spokojne drugie wyjście w tygodniu."
        },
        {
          id: "w2-3", day: "Sobota", title: "8 km spokojnie", type: "easy",
          distance: "8 km", km: 8, pace: "6:15–7:00 min/km",
          bullets: [
            "Nie walka o tempo — liczy się czas na nogach.",
            "Jeśli tempo 6:15/km nie pozwala rozmawiać, zwolnij."
          ],
          goal: "Zwiększyć czas spędzany na nogach."
        }
      ]
    },
    {
      n: 3,
      title: "Pierwsza praca nad szybkością",
      volume: "ok. 20–21 km",
      workouts: [
        {
          id: "w3-1", day: "Poniedziałek", title: "6,5 km, w tym 6 × 1 minuta szybciej", type: "quality",
          distance: "6,5 km", km: 6.5, pace: "5:00–5:20 min/km",
          bullets: [
            "Rozgrzewka: 1,5 km lekkiego biegu.",
            "6 × 1 minuta w tempie około 5:00–5:20 min/km, ale bez sprintu.",
            "Po każdym odcinku 2 minuty bardzo wolnego truchtu.",
            "Dokończ spokojnie do 6,5 km."
          ],
          goal: "Ponownie przyzwyczaić organizm do szybszego biegania, a nie sprawdzać rekord."
        },
        {
          id: "w3-2", day: "Środa", title: "5,5 km spokojnie", type: "easy",
          distance: "5,5 km", km: 5.5, pace: "6:15–7:00 min/km",
          bullets: [
            "Bez przyspieszeń.",
            "Zostaw świeżość na ściankę."
          ],
          goal: "Spokojny bieg bez kumulowania zmęczenia."
        },
        {
          id: "w3-3", day: "Sobota", title: "8,5 km spokojnie", type: "easy",
          distance: "8,5 km", km: 8.5, pace: "6:15–7:00 min/km",
          bullets: [
            "Trzymaj równe, komfortowe tempo przez cały dystans."
          ],
          goal: "Budowanie wytrzymałości bez walki o tempo."
        }
      ]
    },
    {
      n: 4,
      title: "Lżejszy tydzień",
      volume: "ok. 19 km",
      workouts: [
        {
          id: "w4-1", day: "Poniedziałek", title: "5,5 km spokojnie", type: "easy",
          distance: "5,5 km", km: 5.5, pace: "6:15–7:00 min/km",
          bullets: [
            "Jeśli nogi są wypoczęte, zakończ 4 × 15 sekundami luźnych przebieżek."
          ],
          goal: "Spokojny bieg w lżejszym tygodniu."
        },
        {
          id: "w4-2", day: "Środa", title: "6 km, w tym 6 × 1 minuta szybciej", type: "quality",
          distance: "6 km", km: 6, pace: "4:55–5:10 min/km",
          bullets: [
            "1,5 km rozgrzewki.",
            "6 × 1 minuta w tempie około 4:55–5:10 min/km.",
            "Po każdym odcinku 90 sekund spokojnego truchtu.",
            "Resztę dystansu wykonaj spokojnie."
          ],
          goal: "Zachować kontakt z szybkością przy mniejszym zmęczeniu."
        },
        {
          id: "w4-3", day: "Sobota", title: "7,5 km spokojnie", type: "easy",
          distance: "7,5 km", km: 7.5, pace: "6:15–7:00 min/km",
          bullets: [
            "Krótszy bieg regeneracyjny w stosunku do poprzedniego tygodnia."
          ],
          goal: "Lekko domknąć lżejszy tydzień."
        }
      ]
    },
    {
      n: 5,
      title: "Rozwój tempa progowego",
      volume: "ok. 21–22 km",
      workouts: [
        {
          id: "w5-1", day: "Poniedziałek", title: "7 km, w tym 3 × 6 minut progowo", type: "quality",
          distance: "7 km", km: 7, pace: "5:15–5:30 min/km",
          bullets: [
            "1,5 km rozgrzewki.",
            "3 × 6 minut w tempie 5:15–5:30 min/km.",
            "Pomiędzy odcinkami 2 minuty truchtu.",
            "Schłodzenie do łącznego dystansu około 7 km."
          ],
          goal: "Poprawić zdolność utrzymywania mocnego, równomiernego wysiłku."
        },
        {
          id: "w5-2", day: "Środa", title: "5,5 km spokojnie", type: "easy",
          distance: "5,5 km", km: 5.5, pace: "6:15–7:00 min/km",
          bullets: [
            "Bez szybkich odcinków."
          ],
          goal: "Spokojne wyjście między akcentami."
        },
        {
          id: "w5-3", day: "Sobota", title: "9 km spokojnie", type: "easy",
          distance: "9 km", km: 9, pace: "6:15–7:00 min/km",
          bullets: [
            "Nie przyspieszaj na końcu tylko po to, żeby sprawdzić formę."
          ],
          goal: "Wytrzymałość — bez testowania się na siłę."
        }
      ]
    },
    {
      n: 6,
      title: "Interwały w tempie zbliżonym do startowego",
      volume: "ok. 23 km",
      workouts: [
        {
          id: "w6-1", day: "Poniedziałek", title: "ok. 8 km, w tym 5 × 800 m", type: "quality",
          distance: "8 km", km: 8, pace: "5:00–5:10 min/km",
          bullets: [
            "1,5 km rozgrzewki.",
            "5 × 800 m w tempie 5:00–5:10 min/km.",
            "Po każdym odcinku około 2–2,5 minuty spokojnego truchtu.",
            "Schłodzenie do łącznego dystansu około 8 km."
          ],
          goal: "Oswoić się z tempem docelowym bez biegania całych 5 km na granicy możliwości."
        },
        {
          id: "w6-2", day: "Środa", title: "5,5 km spokojnie", type: "easy",
          distance: "5,5 km", km: 5.5, pace: "6:15–7:00 min/km",
          bullets: [
            "Zachowaj lekkość kroku."
          ],
          goal: "Regeneracja między mocniejszymi jednostkami."
        },
        {
          id: "w6-3", day: "Sobota", title: "9,5 km spokojnie", type: "easy",
          distance: "9,5 km", km: 9.5, pace: "6:15–7:00 min/km",
          bullets: [
            "Nie rób z tego biegu testu na 10 km.",
            "Liczy się wytrzymałość."
          ],
          goal: "Spokojne wydłużenie długiego biegu."
        }
      ]
    },
    {
      n: 7,
      title: "Najmocniejszy tydzień wytrzymałościowy",
      volume: "ok. 23–24 km",
      workouts: [
        {
          id: "w7-1", day: "Poniedziałek", title: "7,5–8 km, w tym 2 × 10 minut progowo", type: "quality",
          distance: "7,5–8 km", km: 7.75, pace: "5:10–5:25 min/km",
          bullets: [
            "1,5 km rozgrzewki.",
            "2 × 10 minut w tempie 5:10–5:25 min/km.",
            "Przerwa: 3 minuty spokojnego truchtu.",
            "Schłodzenie do łącznego dystansu 7,5–8 km."
          ],
          goal: "Utrzymać wymagające tempo przez dłuższy czas. Jeśli musisz mocno walczyć o każdą minutę, zwolnij."
        },
        {
          id: "w7-2", day: "Środa", title: "5,5 km spokojnie", type: "easy",
          distance: "5,5 km", km: 5.5, pace: "6:15–7:00 min/km",
          bullets: [
            "Nie dokładaj kolejnego akcentu."
          ],
          goal: "Spokojnie, przed sobotnim długim biegiem."
        },
        {
          id: "w7-3", day: "Sobota", title: "10 km spokojnie", type: "easy",
          distance: "10 km", km: 10, pace: "6:15–7:00 min/km",
          bullets: [
            "Pierwsze 8 km szczególnie spokojnie.",
            "Celem jest komfortowe ukończenie 10 km, a nie wynik."
          ],
          goal: "Najdłuższy bieg w planie — komfortowo, bez ścigania."
        }
      ]
    },
    {
      n: 8,
      title: "Próba tempa startowego",
      volume: "ok. 21–22 km",
      workouts: [
        {
          id: "w8-1", day: "Poniedziałek", title: "ok. 8 km, w tym 4 × 1 km", type: "quality",
          distance: "8 km", km: 8, pace: "4:55–5:00 min/km",
          bullets: [
            "1,5 km rozgrzewki.",
            "4 × 1 km w tempie 4:55–5:00 min/km.",
            "Po każdym kilometrze 2 minuty truchtu.",
            "Schłodzenie do około 8 km łącznie."
          ],
          goal: "Najważniejszy sprawdzian przed startem. Każdy odcinek mocny, ale kontrolowany — jeśli tempo wymaga dużego wysiłku, biegnij wolniej."
        },
        {
          id: "w8-2", day: "Środa", title: "5,5 km spokojnie", type: "easy",
          distance: "5,5 km", km: 5.5, pace: "6:15–7:00 min/km",
          bullets: [
            "Na koniec 4 × 15 sekund luźnych przebieżek."
          ],
          goal: "Lekko, z krótkim pobudzeniem nóg."
        },
        {
          id: "w8-3", day: "Sobota", title: "8 km spokojnie", type: "easy",
          distance: "8 km", km: 8, pace: "6:15–7:00 min/km",
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
          id: "w9-1", day: "Poniedziałek", title: "4,5 km spokojnie", type: "easy",
          distance: "4,5 km", km: 4.5, pace: "6:15–7:00 min/km",
          bullets: [
            "Na koniec 4 × 15 sekund luźnych przebieżek.",
            "Wszystko ma być lekkie."
          ],
          goal: "Pobudzić nogi, nie zmęczyć ich."
        },
        {
          id: "w9-2", day: "Środa", title: "4 km, w tym 3 × 2 minuty w tempie startowym", type: "quality",
          distance: "4 km", km: 4, pace: "4:55–5:00 min/km",
          bullets: [
            "Około 1 km rozgrzewki.",
            "3 × 2 minuty w tempie 4:55–5:00 min/km.",
            "Po każdym odcinku 2 minuty spokojnego truchtu.",
            "Resztę dystansu przebiegnij lekko."
          ],
          goal: "Pobudzenie nóg przed startem, bez zmęczenia."
        },
        {
          id: "w9-3", day: "Sobota", title: "Start na 10 km", type: "race",
          distance: "10 km", km: 10, pace: "cel: poniżej 50:00",
          bullets: [
            "Przed startem 10–15 minut lekkiej rozgrzewki i kilka krótkich przebieżek.",
            "Nie zaczynaj pierwszego kilometra tempem 4:40/km, nawet jeśli czujesz się świetnie."
          ],
          goal: "Cel: poniżej 50:00.",
          race: [
            { split: "Km 1–2", target: "ok. 5:03/km" },
            { split: "Km 3–7", target: "ok. 4:59/km" },
            { split: "Km 8–9", target: "ok. 4:55/km" },
            { split: "Km 10", target: "najmocniej, jak dasz radę" }
          ]
        }
      ]
    }
  ],

  rules: [
    "Jeśli nie możesz przebiec szybkich odcinków w kontrolowany sposób, biegnij je wolniej.",
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

  outro: "Plan jest ustawiony tak, żeby dać realną szansę na sub-50 bez udawania, że po czterech miesiącach przerwy forma jest taka sama jak przy rekordzie. Najważniejsze będzie to, czy w tygodniach 6–8 utrzymasz tempa bez nadmiernego wysiłku."
};
