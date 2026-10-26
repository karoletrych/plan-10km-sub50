/* Plan 10 km sub 50 — logika aplikacji */
(() => {
  "use strict";

  const PLAN = window.PLAN;
  const KEY = "plan10k.sub50.v1";
  const AUTH_KEY = "plan10k.strava.auth.v1";
  const OAUTH_STATE_KEY = "plan10k.oauth.state";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const WORKOUTS = PLAN.weeks.flatMap((week) =>
    week.workouts.map((w) => Object.assign({}, w, { week: week.n }))
  );
  const TOTAL = WORKOUTS.length;
  const DAY_OFFSET = { "Poniedziałek": 0, "Środa": 2, "Sobota": 5 };
  const DAY_NAMES = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
  const CHIP = { easy: "Spokojny", quality: "Jakość", race: "Start" };

  const ICONS = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    chevron: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z"/></svg>',
    pulse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h3l2-5 3 10 2.5-7 2 2H21"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg>',
    strava: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.9 2 3.4 14.2h3.7L9.9 8l2.8 6.2h3.6L9.9 2Zm4.5 12.2L11.8 20l-2.6-5.8H6.5l5.3 9.8 5.3-9.8h-2.7Z"/></svg>'
  };

  /* ---------- Stan ---------- */

  const defaultState = () => ({
    start: null,
    done: {},
    log: {},
    links: {},
    manualUndone: {},
    manualStats: {},
    strava: { fetchedAt: null, activities: [] }
  });

  let state = loadState();
  state.strava.activities = mergePinned(state.strava.activities);
  let auth = loadAuth();
  let syncing = false;
  let syncError = "";
  let lastSyncDebug = null;

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const base = defaultState();
      return {
        start: typeof parsed.start === "string" ? parsed.start : base.start,
        done: parsed.done && typeof parsed.done === "object" ? parsed.done : base.done,
        log: parsed.log && typeof parsed.log === "object" ? parsed.log : base.log,
        links: parsed.links && typeof parsed.links === "object" ? parsed.links : base.links,
        manualUndone: parsed.manualUndone && typeof parsed.manualUndone === "object" ? parsed.manualUndone : base.manualUndone,
        manualStats: parsed.manualStats && typeof parsed.manualStats === "object" ? parsed.manualStats : base.manualStats,
        strava: {
          fetchedAt: parsed.strava && parsed.strava.fetchedAt ? parsed.strava.fetchedAt : null,
          activities: parsed.strava && Array.isArray(parsed.strava.activities) ? parsed.strava.activities : []
        }
      };
    } catch (err) {
      console.warn("Nie udało się wczytać danych", err);
      return defaultState();
    }
  }

  let saveTimer = null;
  function saveState(immediate = false) {
    const persist = () => {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch (err) {
        console.warn("Nie udało się zapisać danych", err);
        toast("Brak miejsca w localStorage — dane nie zostały zapisane.");
      }
    };
    if (immediate) {
      clearTimeout(saveTimer);
      persist();
      return;
    }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 350);
  }

  function loadAuth() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
    } catch {
      return null;
    }
  }

  function saveAuth(next) {
    auth = next;
    if (next) localStorage.setItem(AUTH_KEY, JSON.stringify(next));
    else localStorage.removeItem(AUTH_KEY);
  }

  /* ---------- Formatowanie ---------- */

  const nf2 = new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const nf0 = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 });
  const dateFmt = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short" });
  const dateFmtFull = new Intl.DateTimeFormat("pl-PL", { weekday: "short", day: "numeric", month: "short" });

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function fmtKm(meters) {
    return nf2.format((Number(meters) || 0) / 1000) + " km";
  }

  function plBiegi(n) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (n === 1) return "bieg";
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return "biegi";
    return "biegów";
  }

  function fmtDuration(seconds) {
    const s = Math.max(0, Math.round(Number(seconds) || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return h + ":" + String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
    return m + ":" + String(sec).padStart(2, "0");
  }

  function fmtPace(secondsPerKm) {
    const s = Math.round(Number(secondsPerKm) || 0);
    if (!s || !isFinite(s)) return "—";
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }

  function parseTimeInput(value) {
    const raw = String(value || "").trim().replace(",", ":");
    if (!raw) return null;
    const parts = raw.split(":").map((p) => p.trim());
    if (parts.some((p) => !/^\d+$/.test(p))) return null;
    if (parts.length === 2) {
      const m = Number(parts[0]);
      const s = Number(parts[1]);
      if (s > 59) return null;
      return m * 60 + s;
    }
    if (parts.length === 3) {
      const h = Number(parts[0]);
      const m = Number(parts[1]);
      const s = Number(parts[2]);
      if (m > 59 || s > 59) return null;
      return h * 3600 + m * 60 + s;
    }
    if (parts.length === 1) return Number(parts[0]) * 60;
    return null;
  }

  function toISODate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
  }

  function parseISODate(value) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
    if (!m) return null;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return isNaN(d.getTime()) ? null : d;
  }

  function addDays(date, days) {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + days);
    return d;
  }

  function mondayOf(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diff = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - diff);
    return d;
  }

  function ensureStartDate() {
    if (state.start) return false;
    const monday = mondayOf(new Date());
    state.start = toISODate(monday);
    const input = $("#start-date");
    if (input) input.value = state.start;
    saveState(true);
    toast("Start planu ustawiony na poniedziałek. Możesz zmienić datę w nagłówku.");
    return true;
  }

  function planStart() {
    return parseISODate(state.start);
  }

  function weekStartDate(weekNumber) {
    const start = planStart();
    if (!start) return null;
    return addDays(start, (weekNumber - 1) * 7);
  }

  function workoutDate(workout) {
    const base = weekStartDate(workout.week);
    if (!base) return null;
    return addDays(base, DAY_OFFSET[workout.day] || 0);
  }

  function currentWeekNumber() {
    const start = planStart();
    if (!start) return null;
    const today = new Date();
    const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diff = Math.floor((t0 - start) / 86400000);
    if (diff < 0) return 0;
    return Math.min(9, Math.floor(diff / 7) + 1);
  }

  function countDone() {
    return WORKOUTS.reduce((n, w) => n + (state.done[w.id] ? 1 : 0), 0);
  }

  /* ---------- Toast ---------- */

  let toastTimer = null;
  function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* ---------- Render: statyczne sekcje ---------- */

  function renderPaces() {
    $("#paces").innerHTML = PLAN.paces.map((p) => `
      <div class="pace-card">
        <div class="pace-icon tone-${esc(p.tone)}">${ICONS[p.icon] || ICONS.pulse}</div>
        <div class="pace-body">
          <div class="pace-name">${esc(p.name)}</div>
          <div class="pace-value">${esc(p.value)}</div>
          <div class="pace-desc">${esc(p.desc)}</div>
        </div>
      </div>`).join("");
  }

  function renderSchedule() {
    $("#schedule").innerHTML = PLAN.schedule.map((d) => `
      <div class="ws-day ws-${esc(d.type)}">
        <div class="ws-name">${esc(d.day)}</div>
        <div class="ws-dot"></div>
        <div class="ws-label">${esc(d.label)}</div>
      </div>`).join("");
  }

  function renderRules() {
    $("#rules").innerHTML = PLAN.rules.map((r) => `<li>${esc(r)}</li>`).join("");
    $("#recovery").innerHTML = PLAN.recovery.map((r) => `<li>${esc(r)}</li>`).join("");
    $("#outro").textContent = PLAN.outro;
  }

  /* ---------- Render: tygodnie ---------- */

  function workoutHTML(w) {
    const splits = w.race
      ? `<table class="splits">
          <thead><tr><th>Odcinek</th><th>Target</th></tr></thead>
          <tbody>${w.race.map((r) => `<tr><td>${esc(r.split)}</td><td>${esc(r.target)}</td></tr>`).join("")}</tbody>
        </table>`
      : "";

    return `
      <article class="workout" data-workout="${esc(w.id)}">
        <div class="wo-top">
          <button type="button" class="check" data-action="toggle" data-id="${esc(w.id)}" aria-pressed="false" aria-label="Oznacz jako zrobione: ${esc(w.title)}">
            ${ICONS.check}
          </button>
          <div class="wo-title-wrap">
            <span class="wo-day">${esc(w.day)}</span>
            <h3 class="wo-title">${esc(w.title)}</h3>
          </div>
          <span class="chip chip-${esc(w.type)}">${esc(CHIP[w.type] || "Bieg")}</span>
        </div>
        <div class="wo-meta">
          <span class="wo-pace">${esc(w.pace)}</span>
          <span class="wo-dist">${esc(w.distance)}</span>
        </div>
        <ul class="wo-bullets">${w.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        <p class="wo-goal"><strong>Cel:</strong> ${esc(w.goal)}</p>
        ${splits}
        <div class="wo-log" data-log="${esc(w.id)}" hidden>
          <div class="log-row">
            <label class="field">Czas
              <input class="time-input" data-id="${esc(w.id)}" inputmode="numeric" autocomplete="off" placeholder="mm:ss">
            </label>
            <span class="calc-pace" data-calc="${esc(w.id)}"></span>
          </div>
          <input class="note-field" data-note="${esc(w.id)}" autocomplete="off" placeholder="Notatka (np. ciężkie nogi, upał)">
        </div>
        <div class="wo-strava" data-strava-slot="${esc(w.id)}"></div>
      </article>`;
  }

  function renderWeeks() {
    const current = currentWeekNumber();
    $("#weeks").innerHTML = PLAN.weeks.map((week) => {
      const isCurrent = current === week.n;
      return `
        <details class="week${isCurrent ? " is-current" : ""}" data-week="${week.n}">
          <summary>
            <span class="week-no">${String(week.n).padStart(2, "0")}</span>
            <span class="week-head">
              <span class="week-title">${esc(week.title)}</span>
              <span class="week-sub">
                ${esc(week.volume)}${/^ok\./i.test(week.volume) ? " łącznie" : ""}
                ${isCurrent ? '<span class="now-tag">Teraz</span>' : ""}
              </span>
            </span>
            <span class="week-right">
              <span class="week-count" data-count="${week.n}">0/3</span>
              ${ICONS.chevron}
            </span>
          </summary>
          <div class="week-body">${week.workouts.map(workoutHTML).join("")}</div>
        </details>`;
    }).join("");

    WORKOUTS.forEach((w) => {
      const log = state.log[w.id] || {};
      const timeInput = $(`.time-input[data-id="${w.id}"]`);
      const noteInput = $(`.note-field[data-note="${w.id}"]`);
      if (timeInput) timeInput.value = log.t || "";
      if (noteInput) noteInput.value = log.n || "";
    });

    if (current && current >= 1) {
      const details = $(`.week[data-week="${current}"]`);
      if (details) details.open = true;
    }
    updateToggleAllLabel();
    renderWorkoutStrava();
  }

  function updateToggleAllLabel() {
    const all = $$("#weeks details");
    const allOpen = all.length > 0 && all.every((d) => d.open);
    $("#toggle-all").textContent = allOpen ? "Zwiń wszystko" : "Rozwiń wszystko";
  }

  /* ---------- Progress ---------- */

  function refreshProgress() {
    const done = countDone();
    const pct = Math.round((done / TOTAL) * 100);
    const allDone = done === TOTAL;

    $("#progress-text").textContent = allDone
      ? "Plan ukończony — dobra robota!"
      : `${done} z ${TOTAL} treningów`;
    $("#progress-pct").textContent = pct + "%";
    const bar = $("#bar");
    bar.setAttribute("aria-valuenow", String(done));
    $("#bar-fill").style.width = pct + "%";

    $("#week-now").innerHTML = weekNowHTML();

    PLAN.weeks.forEach((week) => {
      const weekDone = week.workouts.filter((w) => state.done[w.id]).length;
      const badge = $(`[data-count="${week.n}"]`);
      if (badge) {
        badge.textContent = `${weekDone}/${week.workouts.length}`;
        badge.classList.toggle("done", weekDone === week.workouts.length);
      }
      const details = $(`.week[data-week="${week.n}"]`);
      if (details) details.classList.toggle("is-current", currentWeekNumber() === week.n);
    });

    WORKOUTS.forEach((w) => {
      const card = $(`[data-workout="${w.id}"]`);
      if (!card) return;
      const isDone = Boolean(state.done[w.id]);
      card.classList.toggle("done", isDone);
      const check = $(".check", card);
      if (check) check.setAttribute("aria-pressed", String(isDone));
      const log = $(`[data-log="${w.id}"]`, card);
      if (log) log.hidden = !isDone;
      updateCalc(w.id);
    });

    if (allDone && !state.celebrated) {
      state.celebrated = true;
      saveState();
    }
  }

  function weekNowHTML() {
    const start = planStart();
    if (!start) {
      return "Ustaw datę startu planu";
    }
    const today = new Date();
    const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diff = Math.floor((t0 - start) / 86400000);
    if (diff < 0) {
      const days = Math.abs(diff);
      return `Start za <strong>${days} ${days === 1 ? "dzień" : "dni"}</strong>`;
    }
    if (diff > 62) {
      return "Plan zakończony <strong>· 9/9</strong>";
    }
    const week = Math.floor(diff / 7) + 1;
    return `<span class="now-dot"></span> Tydzień <strong>${week} z 9</strong> · dziś ${DAY_NAMES[today.getDay()]}`;
  }

  function updateCalc(id) {
    const workout = WORKOUTS.find((w) => w.id === id);
    const calc = $(`[data-calc="${id}"]`);
    if (!workout || !calc) return;
    const log = state.log[id] || {};
    const seconds = parseTimeInput(log.t);
    if (!seconds || !workout.km) {
      calc.textContent = "";
      return;
    }
    const pace = seconds / workout.km;
    calc.textContent = "≈ " + fmtPace(pace) + " /km";
  }

  /* ---------- Log treningu ---------- */

  function setLog(id, patch) {
    state.log[id] = Object.assign({}, state.log[id] || {}, patch);
    saveState();
  }

  function setDone(id, value) {
    if (value) state.done[id] = true;
    else delete state.done[id];
    saveState(true);
  }

  /* ---------- Strava: mapowanie aktywności ---------- */

  function parseActivityId(value) {
    const raw = String(value || "").trim();
    if (/^\d{5,}$/.test(raw)) return Number(raw);
    const m = raw.match(/(?:activities\/|activity\/)(\d{5,})/);
    return m ? Number(m[1]) : null;
  }

  function activityByUrl(value) {
    const id = parseActivityId(value);
    if (!id) return null;
    return state.strava.activities.find((a) => a.id === id) || null;
  }

  function activityDate(activity) {
    return String(activity.date || activity.start_date_local || "").slice(0, 10);
  }

  function activityPace(activity) {
    if (!activity.distance || !activity.moving_time) return null;
    return activity.moving_time / (activity.distance / 1000);
  }

  function mergePinned(activities) {
    const list = Array.isArray(activities) ? activities.slice() : [];
    (PLAN.pinned || []).forEach((pinned) => {
      if (!list.some((a) => String(a.id) === String(pinned.id))) {
        list.push(Object.assign({ pinned: true }, pinned));
      }
    });
    return list.sort((a, b) => String(activityDate(b)).localeCompare(String(activityDate(a))));
  }

  function recentItemHTML(activity) {
    const date = parseISODate(activityDate(activity));
    const meta = [
      date ? dateFmt.format(date) : "",
      activity.distance ? fmtKm(activity.distance) : "",
      activity.moving_time ? fmtDuration(activity.moving_time) : "",
      activityPace(activity) ? fmtPace(activityPace(activity)) + "/km" : ""
    ].filter(Boolean).join(" · ");
    return `<div class="recent-item">
      <div class="ri-main">
        <div class="ri-name">${esc(activity.name || "Bieg")}</div>
        <div class="ri-meta">${esc(meta)}${activity.distance ? "" : (isConnected() ? " · staty po synchronizacji" : " · staty po połączeniu")}</div>
        ${activity.distance
          ? (activity.manualStats ? `<button type="button" class="text-btn ri-stats-btn" data-action="stats" data-activity="${esc(activity.id)}">Zmień staty</button>` : "")
          : `<button type="button" class="text-btn ri-stats-btn" data-action="stats" data-activity="${esc(activity.id)}">Wpisz staty</button>`}
      </div>
      <a href="https://www.strava.com/activities/${esc(activity.id)}" target="_blank" rel="noopener">↗</a>
    </div>`;
  }

  function findActivityForDate(iso, activities, used) {
    const target = parseISODate(iso);
    if (!target) return null;
    let best = null;
    activities.forEach((a) => {
      if (used.has(String(a.id))) return;
      const d = parseISODate(activityDate(a));
      if (!d) return;
      const diff = Math.round((d - target) / 86400000);
      if (Math.abs(diff) > 1) return;
      if (!best || Math.abs(diff) < Math.abs(best.diff) ||
          (Math.abs(diff) === Math.abs(best.diff) && (a.moving_time || 0) > (best.a.moving_time || 0))) {
        best = { a, diff };
      }
    });
    return best;
  }

  function buildMapping() {
    const map = {};
    const used = new Set();

    // Ręczne podpięcia mają priorytet.
    WORKOUTS.forEach((w) => {
      const linkedId = state.links[w.id];
      if (!linkedId) return;
      const activity = state.strava.activities.find((a) => String(a.id) === String(linkedId)) || null;
      map[w.id] = { manualId: Number(linkedId), activity, auto: false };
      if (activity) used.add(String(activity.id));
    });

    // Automatyczne dopasowanie po dacie treningu (z tolerancją ±1 dzień).
    WORKOUTS.forEach((w) => {
      if (map[w.id] || !state.start) return;
      const date = workoutDate(w);
      if (!date) return;
      const match = findActivityForDate(toISODate(date), state.strava.activities, used);
      if (match) {
        map[w.id] = { manualId: null, activity: match.a, auto: true, diff: match.diff };
        used.add(String(match.a.id));
      }
    });

    return map;
  }

  function manualStatsCardHTML(workout, ms) {
    const pace = ms.distance ? ms.moving_time / (ms.distance / 1000) : 0;
    const stats = [
      ["Dystans", fmtKm(ms.distance)],
      ["Czas", fmtDuration(ms.moving_time)],
      ["Tempo", fmtPace(pace) + "\u00A0/km"]
    ];
    if (ms.avg_hr) stats.push(["Śr. tętno", Math.round(ms.avg_hr) + " bpm"]);
    return `
      <div class="sa-card">
        <div class="sa-head">
          <span class="sa-brand manual">Twoje staty</span>
          <span class="sa-tools">
            <button type="button" class="text-btn" data-action="stats" data-workout="${esc(workout.id)}">Zmień</button>
            <button type="button" class="text-btn" data-action="stats-remove" data-workout="${esc(workout.id)}">Usuń</button>
          </span>
        </div>
        <div class="sa-stats">
          ${stats.map(([label, value]) => `<div class="sa-stat"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("")}
        </div>
      </div>`;
  }

  function stravaSlotHTML(workout, entry) {
    if (!entry) {
      const ms = state.manualStats[workout.id];
      if (ms) return manualStatsCardHTML(workout, ms);
      return `<div class="wo-actions-row">
        <button type="button" class="stats-btn" data-action="stats" data-workout="${esc(workout.id)}">Wpisz staty</button>
        <button type="button" class="text-btn" data-action="link-strava" data-id="${esc(workout.id)}">Podepnij Stravę</button>
      </div>`;
    }

    const a = entry.activity;
    if (!a) {
      const id = entry.manualId;
      return `
        <div class="sa-card">
          <div class="sa-head">
            <span class="sa-brand">${ICONS.strava} Strava</span>
            <a href="https://www.strava.com/activities/${esc(id)}" target="_blank" rel="noopener">Otwórz ↗</a>
          </div>
          <div class="sa-name">Aktywność podpięta ręcznie</div>
          <div class="sp-actions" style="margin-top:8px">
            <button type="button" class="btn" data-action="stats" data-activity="${esc(id)}" data-workout="${esc(workout.id)}">Wpisz staty</button>
            <button type="button" class="btn" data-action="strava-embed" data-id="${esc(workout.id)}">Pokaż podgląd</button>
            <button type="button" class="text-btn" data-action="link-strava" data-id="${esc(workout.id)}">Zmień lub usuń</button>
          </div>
          <p class="sa-note">Staty możesz wpisać ręcznie albo spróbować podglądu (działa dla aktywności publicznych).</p>
        </div>`;
    }

    if (!a.distance) {
      return `
        <div class="sa-card">
          <div class="sa-head">
            <span class="sa-brand">${ICONS.strava} Strava</span>
            <a href="https://www.strava.com/activities/${esc(a.id)}" target="_blank" rel="noopener">Otwórz ↗</a>
          </div>
          <div class="sa-name">${esc(a.name || "Bieg")}</div>
          <p class="sa-note">Strava nie zwróciła statów tej aktywności. Możesz wpisać je ręcznie.</p>
          <div class="sp-actions" style="margin-top:8px">
            <button type="button" class="btn" data-action="stats" data-activity="${esc(a.id)}" data-workout="${esc(workout.id)}">Wpisz staty</button>
            <button type="button" class="text-btn" data-action="link-strava" data-id="${esc(workout.id)}">Zmień lub usuń</button>
          </div>
        </div>`;
    }

    const stats = [
      ["Dystans", fmtKm(a.distance)],
      ["Czas", fmtDuration(a.moving_time)],
      ["Tempo", fmtPace(activityPace(a)) + "\u00A0/km"]
    ];
    if (a.elevation) stats.push(["Przewyższenia", nf0.format(a.elevation) + " m"]);
    if (a.avg_hr) stats.push(["Śr. tętno", Math.round(a.avg_hr) + " bpm"]);
    if (a.max_hr) stats.push(["Max tętno", Math.round(a.max_hr) + " bpm"]);
    if (a.kudos) stats.push(["Kudosy", nf0.format(a.kudos)]);

    const date = parseISODate(activityDate(a));
    return `
      <div class="sa-card">
        <div class="sa-head">
          <span class="sa-brand">${ICONS.strava} Strava</span>
          <a href="https://www.strava.com/activities/${esc(a.id)}" target="_blank" rel="noopener">Otwórz ↗</a>
        </div>
        <div class="sa-name">${esc(a.name || "Bieg")}${date ? " · " + esc(dateFmtFull.format(date)) : ""}</div>
        <div class="sa-stats">
          ${stats.map(([label, value]) => `<div class="sa-stat"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("")}
        </div>
        <p class="sa-note">${entry.auto ? (entry.diff ? "Dopasowane po najbliższej dacie (±1 dzień)." : "Dopasowane automatycznie po dacie treningu.") : "Podpięte ręcznie."}</p>
        <button type="button" class="text-btn" data-action="link-strava" data-id="${esc(workout.id)}">Zmień lub usuń</button>
      </div>`;
  }

  function renderWorkoutStrava() {
    const mapping = buildMapping();
    $$("[data-strava-slot]").forEach((slot) => {
      const id = slot.dataset.stravaSlot;
      const workout = WORKOUTS.find((w) => w.id === id);
      if (!workout) return;
      slot.innerHTML = stravaSlotHTML(workout, mapping[id]);
    });
  }

  /* ---------- Strava: panel ---------- */

  function isConnected() {
    return Boolean(auth && auth.refreshToken && auth.clientId && auth.clientSecret);
  }

  function lastSyncText() {
    if (!state.strava.fetchedAt) return "jeszcze nie synchronizowano";
    return "sync " + dateFmt.format(new Date(state.strava.fetchedAt)) + ", " +
      new Date(state.strava.fetchedAt).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  }

  function renderStravaPanel() {
    const panel = $("#strava-panel");
    const info = $("#strava-sync-info");

    if (!isConnected()) {
      info.textContent = "opcjonalnie";
      const recent = state.strava.activities.slice(0, 3);
      panel.innerHTML = `
        <div class="sp-row">
          <div class="sp-logo">${ICONS.strava}</div>
          <div class="sp-grow">
            <div class="sp-title">Wpisz staty przy treningu</div>
            <div class="sp-sub">Dystans i czas wystarczą — tempo wyliczy się samo. Stravę możesz podpiąć, jeśli chcesz automat.</div>
          </div>
          <button type="button" class="btn btn-primary" data-strava="connect">Połącz Stravę</button>
        </div>
        <div class="sp-actions">
          <button type="button" class="text-btn" data-strava="help">Jak to działa?</button>
          <span class="sa-note">Bez Stravy: przycisk „Wpisz staty” przy każdym treningu.</span>
        </div>
        ${recent.length ? `<div class="sp-recent">
          <div class="sp-recent-head"><span>Ostatnie biegi</span></div>
          <div class="recent-list">${recent.map(recentItemHTML).join("")}</div>
          <p class="sa-note" style="margin-top:8px">Staty uzupełnisz ręcznie przy biegu.</p>
        </div>` : ""}`;
      return;
    }

    const athlete = auth.athlete || {};
    const name = [athlete.firstname, athlete.lastname].filter(Boolean).join(" ") || "Twoje konto";
    info.textContent = lastSyncText();
    const recent = state.strava.activities.slice(0, 4);
    const withStats = state.strava.activities.filter((a) => a.distance && a.moving_time).length;
    const scopeOk = !auth.scope || /activity:read/.test(auth.scope);
    const inactive = Boolean(lastSyncDebug && lastSyncDebug.inactive);
    const needsReconnect = !inactive && (!scopeOk || /dostęp do aktywności|odrzuciła|wygasł|403|401|forbidden|authorization/i.test(syncError));
    const problem = !scopeOk && !syncError
      ? "Strava nie przyznała dostępu do aktywności. Połącz ponownie i zaznacz zgodę."
      : syncError;
    const diag = lastSyncDebug
      ? `<div class="sp-diag">HTTP ${esc(lastSyncDebug.status || "?")}${lastSyncDebug.body ? " · " + esc(lastSyncDebug.body) : ""}<br>scope: ${esc(lastSyncDebug.scope || "brak")} · ${esc(lastSyncDebug.at)}</div>`
      : "";

    panel.innerHTML = `
      <div class="sp-row">
        <div class="sp-logo">${ICONS.strava}</div>
        <div class="sp-grow">
          <div class="sp-title">Połączono ze Stravą</div>
          <div class="sp-sub">${esc(name)} · ${esc(lastSyncText())} · ${withStats} ${plBiegi(withStats)} ze statami</div>
        </div>
        <button type="button" class="btn" data-strava="sync" ${syncing ? "disabled" : ""}>
          ${syncing ? "Synchronizuję…" : "Synchronizuj"}
        </button>
      </div>
      ${problem ? `<div class="warn" style="margin-top:10px">
        <div>${esc(problem)}</div>
        ${diag}
        <div class="sp-actions" style="margin-top:8px">
          ${needsReconnect ? '<button type="button" class="btn btn-primary" data-strava="reconnect">Połącz ponownie</button>' : ""}
          ${lastSyncDebug ? '<button type="button" class="text-btn" data-strava="copy-diag">Kopiuj diagnostykę</button>' : ""}
          <a class="text-btn" href="${inactive ? "https://www.strava.com/settings/api" : "https://www.strava.com/settings/apps"}" target="_blank" rel="noopener">${inactive ? "Ustawienia API Stravy ↗" : "Aplikacje w Stravie ↗"}</a>
        </div>
      </div>` : ""}
      ${!state.start ? `<p class="sp-hint">Ustaw datę startu, żeby biegi automatycznie dopasowały się do treningów.
        <button type="button" class="text-btn" data-strava="start">Ustaw datę</button></p>` : ""}
      <div class="sp-recent">
        <div class="sp-recent-head"><span>Ostatnie biegi</span><button type="button" class="text-btn" data-strava="settings">Ustawienia</button></div>
        ${recent.length ? `<div class="recent-list">${recent.map(recentItemHTML).join("")}</div>` : '<p class="empty-note">Brak pobranych biegów. Kliknij „Synchronizuj”.</p>'}
      </div>
      <p class="sa-note" style="margin-top:10px">Dane i tokeny zostają w tej przeglądarce. Aktywności pobierane są przez oficjalne Strava API.</p>`;
  }

  /* ---------- Strava: OAuth ---------- */

  function redirectUri() {
    return location.origin + location.pathname;
  }

  function openDialog(dialog) {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function renderStravaDialog(message) {
    const body = $("#strava-dialog-body");
    if (isConnected()) {
      const athlete = auth.athlete || {};
      const name = [athlete.firstname, athlete.lastname].filter(Boolean).join(" ") || "Twoje konto";
      body.innerHTML = `
        <div class="status-line"><span class="status-dot"></span> Połączono jako <strong>${esc(name)}</strong></div>
        <p style="margin-top:12px">Aktywności są pobierane z ostatnich 400 dni i dopasowywane do dni treningowych. Token odświeża się sam.</p>
        <div class="dialog-actions">
          <button type="button" class="btn btn-primary" data-strava-action="sync">Synchronizuj teraz</button>
          <button type="button" class="btn btn-ghost danger" data-strava-action="disconnect">Odłącz Stravę</button>
        </div>
        <p class="sa-note" style="margin-top:14px">Tokeny są zapisane wyłącznie w localStorage tej przeglądarki. Nie trafiają do repozytorium.</p>`;
      return;
    }

    const host = location.hostname || "twoja-domena.github.io";
    const callback = host === "localhost" || host === "127.0.0.1" ? host : host;
    body.innerHTML = `
      <p>Połączenie działa przez własną aplikację Strava API. Potrzebujesz jednorazowej konfiguracji (około 2 minut).</p>
      <h4>1. Utwórz aplikację API</h4>
      <ol>
        <li>Wejdź na <a href="https://www.strava.com/settings/api" target="_blank" rel="noopener">strava.com/settings/api</a>.</li>
        <li>Uzupełnij „Create an Application”: nazwa dowolna, kategoria np. Running.</li>
        <li><strong>Website</strong>: <code>${esc(location.origin + location.pathname)}</code></li>
        <li><strong>Authorization Callback Domain</strong>: <code>${esc(callback)}</code></li>
        <li>Skopiuj <strong>Client ID</strong> i <strong>Client Secret</strong>.</li>
      </ol>
      <h4>2. Wklej dane</h4>
      <div class="input-block">
        <label>Client ID
          <input id="strava-client-id" inputmode="numeric" autocomplete="off" placeholder="np. 123456" value="${esc(auth && auth.clientId ? auth.clientId : "")}">
        </label>
        <label>Client Secret
          <input id="strava-client-secret" type="password" autocomplete="off" placeholder="np. a1b2c3d4…" value="${esc(auth && auth.clientSecret ? auth.clientSecret : "")}">
        </label>
      </div>
      <div class="warn" style="margin-top:10px">Client Secret zostaje tylko w localStorage tej przeglądarki — nie jest wysyłany nigdzie poza Strava. Po połączeniu możesz go usunąć z ustawień aplikacji.</div>
      ${message ? `<p class="warn" style="margin-top:10px">${esc(message)}</p>` : ""}
      <div class="dialog-actions">
        <button type="button" class="btn btn-primary" data-strava-action="authorize">Zapisz i połącz</button>
        <button type="button" class="btn btn-ghost" data-close>Anuluj</button>
      </div>
      <p class="sa-note" style="margin-top:14px">Alternatywa bez kluczy: w treningu kliknij „Podepnij Stravę” i wklej link do aktywności — apka pokaże oficjalny embed (aktywność musi być publiczna).</p>`;
  }

  function authorize() {
    const id = ($("#strava-client-id") || {}).value;
    const secret = ($("#strava-client-secret") || {}).value;
    beginAuth(id, secret);
  }

  function beginAuth(id, secret, force) {
    if (!id || !/^\d+$/.test(String(id).trim())) {
      toast("Podaj poprawny Client ID (same cyfry).");
      return;
    }
    if (!secret || String(secret).trim().length < 10) {
      toast("Podaj Client Secret z ustawień aplikacji Strava.");
      return;
    }
    saveAuth({ clientId: String(id).trim(), clientSecret: String(secret).trim() });
    const oauthState = (crypto.randomUUID && crypto.randomUUID()) || String(Math.random()).slice(2);
    localStorage.setItem(OAUTH_STATE_KEY, oauthState);
    const params = new URLSearchParams({
      client_id: auth.clientId,
      redirect_uri: redirectUri(),
      response_type: "code",
      approval_prompt: force ? "force" : "auto",
      scope: "read,activity:read_all",
      state: oauthState
    });
    location.href = "https://www.strava.com/oauth/authorize?" + params.toString();
  }

  async function exchangeCode(code) {
    const res = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: auth.clientId,
        client_secret: auth.clientSecret,
        code: code,
        grant_type: "authorization_code"
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.access_token) {
      throw new Error(data.message || "Strava odrzuciła kod autoryzacji.");
    }
    return data;
  }

  async function getAccessToken(forceRefresh = false) {
    if (!isConnected()) throw new Error("Brak połączenia ze Stravą.");
    const now = Math.floor(Date.now() / 1000);
    if (!forceRefresh && auth.accessToken && auth.expiresAt && auth.expiresAt > now + 120) {
      return auth.accessToken;
    }
    const res = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: auth.clientId,
        client_secret: auth.clientSecret,
        grant_type: "refresh_token",
        refresh_token: auth.refreshToken
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.access_token) {
      throw new Error(data.message || "Nie udało się odświeżyć tokenu Stravy. Połącz konto ponownie.");
    }
    saveAuth(Object.assign({}, auth, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || auth.refreshToken,
      expiresAt: data.expires_at,
      scope: data.scope || auth.scope,
      athlete: data.athlete || auth.athlete
    }));
    return auth.accessToken;
  }

  function slimActivity(a) {
    return {
      id: a.id,
      name: a.name,
      type: a.sport_type || a.type,
      date: a.start_date_local || a.start_date,
      distance: a.distance,
      moving_time: a.moving_time,
      elapsed_time: a.elapsed_time,
      elevation: a.total_elevation_gain,
      avg_speed: a.average_speed,
      max_speed: a.max_speed,
      avg_hr: a.average_heartrate || null,
      max_hr: a.max_heartrate || null,
      kudos: a.kudos_count || 0,
      suffer: a.suffer_score || null
    };
  }

  function isRun(a) {
    const type = a.sport_type || a.type || "";
    return /run/i.test(type);
  }

  async function fetchActivities() {
    const after = Math.floor(Date.now() / 1000) - 400 * 86400;
    const all = [];
    for (let page = 1; page <= 5; page++) {
      const url = "https://www.strava.com/api/v3/athlete/activities?after=" + after +
        "&per_page=200&page=" + page;
      let token = await getAccessToken();
      let res = await fetch(url, { headers: { Authorization: "Bearer " + token } });
      if (res.status === 401) {
        token = await getAccessToken(true);
        res = await fetch(url, { headers: { Authorization: "Bearer " + token } });
      }
      if (!res.ok) {
        const raw = await res.text().catch(() => "");
        let detail = {};
        try { detail = JSON.parse(raw); } catch (e) { detail = {}; }
        const err = new Error(detail.message || "Strava API zwróciło błąd " + res.status + ".");
        err.status = res.status;
        err.body = raw.slice(0, 400);
        err.requestUrl = url;
        throw err;
      }
      const batch = await res.json();
      if (!Array.isArray(batch)) break;
      all.push(...batch);
      if (batch.length < 200) break;
    }
    return all.filter(isRun).map(slimActivity);
  }

  function markWorkoutDoneFromActivity(workout, activity) {
    if (state.links[workout.id]) return;
    if (state.done[workout.id]) return;
    if (state.manualUndone[workout.id]) return;
    state.done[workout.id] = true;
    const log = state.log[workout.id] || {};
    if (!log.t && activity.moving_time) {
      state.log[workout.id] = Object.assign({}, log, { t: fmtDuration(activity.moving_time) });
    }
    return true;
  }

  async function syncActivities(options) {
    if (syncing) return;
    if (!isConnected()) {
      toast("Najpierw połącz Stravę.");
      return;
    }
    syncing = true;
    renderStravaPanel();
    try {
      const fresh = await fetchActivities();
      syncError = "";
      lastSyncDebug = null;
      const known = new Set(state.strava.activities.map((a) => String(a.id)));
      const added = fresh.filter((a) => !known.has(String(a.id)));
      // Nie gub statów wpisanych ręcznie, jeśli API ich nie zwróci.
      const localById = new Map(state.strava.activities.map((a) => [String(a.id), a]));
      const merged = fresh.map((a) => {
        const local = localById.get(String(a.id));
        if (local && local.manualStats && !a.distance) {
          return Object.assign({}, a, {
            distance: local.distance,
            moving_time: local.moving_time,
            avg_hr: local.avg_hr,
            manualStats: true
          });
        }
        return a;
      });
      state.strava.activities.forEach((a) => {
        if (a.manualStats && !merged.some((b) => String(b.id) === String(a.id))) merged.push(a);
      });
      state.strava = { fetchedAt: Date.now(), activities: mergePinned(merged) };

      let completed = 0;
      if (state.start) {
        const used = new Set(Object.values(state.links).map(String));
        WORKOUTS.forEach((w) => {
          if (state.links[w.id]) return;
          const day = workoutDate(w);
          if (!day) return;
          const match = findActivityForDate(toISODate(day), fresh, used);
          if (!match) return;
          used.add(String(match.a.id));
          if (markWorkoutDoneFromActivity(w, match.a)) completed++;
        });
      }

      saveState(true);
      renderWeeks();
      refreshProgress();
      renderStravaPanel();
      if (!options || !options.silent) {
        const bits = [`${fresh.length} biegów`];
        if (added.length) bits.push(`+${added.length} nowych`);
        if (completed) bits.push(`dopisano ${completed} treningów`);
        toast("Strava: " + bits.join(" · "));
      }
    } catch (err) {
      console.error(err);
      const status = err.status || 0;
      const scope = (auth && auth.scope) || "";
      const hasScope = /activity:read/.test(scope);
      lastSyncDebug = {
        status,
        body: err.body || "",
        scope,
        requestUrl: err.requestUrl || "",
        at: new Date().toISOString(),
        inactive: /Application/.test(err.body || "") && /Inactive/.test(err.body || "")
      };
      if (lastSyncDebug.inactive) {
        syncError = "Aplikacja Strava jest nieaktywna. Strava wymaga aktywnej subskrypcji, żeby aplikacja API działała. Staty możesz wpisać ręcznie przy biegu.";
      } else if (status === 401) {
        syncError = "Token Stravy wygasł lub został unieważniony. Połącz ponownie.";
      } else if (status === 403 && !hasScope) {
        syncError = "Strava nie przyznała dostępu do aktywności. Połącz ponownie i zaznacz zgodę na aktywności.";
      } else if (status === 403) {
        syncError = "Strava odrzuciła dostęp (403). Odłącz aplikację w Stravie i połącz ponownie.";
      } else if (status === 429) {
        syncError = "Limit zapytań do Stravy. Spróbuj ponownie za kilka minut.";
      } else {
        syncError = err.message || "Nie udało się pobrać danych ze Stravy.";
      }
      toast(syncError);
      if (String(err.message || "").toLowerCase().includes("token")) {
        saveAuth(Object.assign({}, auth, { accessToken: null, expiresAt: 0 }));
      }
    } finally {
      syncing = false;
      renderStravaPanel();
    }
  }

  async function handleOAuthCallback() {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    const code = params.get("code");
    if (error) {
      history.replaceState({}, "", location.pathname);
      toast("Strava: autoryzacja anulowana.");
      return;
    }
    if (!code) return;

    const expected = localStorage.getItem(OAUTH_STATE_KEY);
    const got = params.get("state");
    history.replaceState({}, "", location.pathname);
    localStorage.removeItem(OAUTH_STATE_KEY);

    if (expected && got !== expected) {
      toast("Nieprawidłowy stan autoryzacji. Spróbuj ponownie.");
      return;
    }
    if (!auth || !auth.clientId || !auth.clientSecret) {
      openDialog($("#strava-dialog"));
      renderStravaDialog("Brak Client ID / Secret w tej przeglądarce. Wklej je ponownie.");
      return;
    }

    try {
      const data = await exchangeCode(code);
      saveAuth(Object.assign({}, auth, {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_at,
        scope: data.scope || auth.scope,
        athlete: data.athlete
      }));
      toast("Połączono ze Stravą. Pobieram aktywności…");
      ensureStartDate();
      renderStravaPanel();
      await syncActivities({ silent: false });
      closeDialog($("#strava-dialog"));
    } catch (err) {
      console.error(err);
      openDialog($("#strava-dialog"));
      renderStravaDialog(err.message || "Nie udało się połączyć ze Stravą.");
    }
  }

  function disconnectStrava() {
    if (!confirm("Odłączyć Stravę i usunąć pobrane aktywności z tej przeglądarki?")) return;
    saveAuth(null);
    state.strava = { fetchedAt: null, activities: [] };
    saveState(true);
    renderStravaPanel();
    renderWorkoutStrava();
    closeDialog($("#strava-dialog"));
    toast("Strava odłączona. Dane treningowe zostały.");
  }

  /* ---------- Dialog podpinania aktywności ---------- */

  let linkWorkoutId = null;

  function openLinkDialog(workoutId) {
    const workout = WORKOUTS.find((w) => w.id === workoutId);
    if (!workout) return;
    linkWorkoutId = workoutId;
    const current = state.links[workoutId];
    const body = $("#link-dialog-body");
    $("#link-dialog-title").textContent = `Strava · tydzień ${workout.week} · ${workout.day.toLowerCase()}`;

    const picks = state.strava.activities.filter((a) => {
      const date = parseISODate(activityDate(a));
      return date && Math.abs(date - new Date()) < 1000 * 86400 * 120;
    }).slice(0, 30);

    body.innerHTML = `
      ${isConnected() ? `
        <p>Wybierz aktywność, którą chcesz podpiąć do tego treningu. Staty pojawią się od razu, a trening zostanie odhaczony.</p>
        ${picks.length ? `<div class="pick-list">${picks.map((a) => {
          const date = parseISODate(activityDate(a));
          return `<button type="button" class="pick-item" data-pick="${esc(a.id)}">
            <span class="pi-main">
              <span class="pi-name">${esc(a.name || "Bieg")}</span>
              <span class="pi-meta">${date ? esc(dateFmtFull.format(date)) : ""} · ${fmtDuration(a.moving_time)}</span>
            </span>
            <span class="pi-stats">${fmtKm(a.distance)}<br>${fmtPace(activityPace(a))}/km</span>
          </button>`;
        }).join("")}</div>` : '<p class="empty-note">Brak pobranych aktywności. Najpierw kliknij „Synchronizuj” w panelu Stravy.</p>'}
        <h4>Albo podepnij ręcznie linkiem</h4>
      ` : `<p>Wklej link do aktywności Strava. Apka pokaże oficjalny embed ze statami (aktywność musi mieć widoczność „Everyone”).</p>`}
      <div class="input-block">
        <label>Link do aktywności
          <input id="activity-url" inputmode="url" autocomplete="off" placeholder="https://www.strava.com/activities/1234567890" value="${current ? "https://www.strava.com/activities/" + esc(current) : ""}">
        </label>
      </div>
      <div class="dialog-actions">
        <button type="button" class="btn btn-primary" data-link-action="save">Podepnij</button>
        ${current ? '<button type="button" class="btn btn-ghost danger" data-link-action="remove">Usuń podpięcie</button>' : ""}
        <button type="button" class="btn btn-ghost" data-close>Anuluj</button>
      </div>
      <p class="sa-note" style="margin-top:12px">Ręczne podpięcie zapisuje się lokalnie i nie wymaga kluczy API.</p>`;

    openDialog($("#link-dialog"));
  }

  function openEmbedDialog(workoutId) {
    const id = state.links[workoutId];
    if (!id) return;
    $("#embed-dialog-body").innerHTML = `
      <iframe class="embed-frame" src="https://strava-embeds.com/activity/${esc(id)}?fromEmbed=false" loading="eager" title="Aktywność Strava" referrerpolicy="no-referrer-when-downgrade"></iframe>
      <div class="embed-footer">
        <a class="btn" href="https://www.strava.com/activities/${esc(id)}" target="_blank" rel="noopener">Otwórz w Stravie ↗</a>
        <span class="sa-note">Podgląd działa dla aktywności publicznych.</span>
      </div>`;
    openDialog($("#embed-dialog"));
  }

  function linkManualActivity() {
    const input = $("#activity-url");
    const id = parseActivityId(input ? input.value : "");
    if (!id) {
      toast("To nie wygląda na link do aktywności Strava.");
      return;
    }
    state.links[linkWorkoutId] = id;
    state.done[linkWorkoutId] = true;
    saveState(true);
    renderWeeks();
    refreshProgress();
    closeDialog($("#link-dialog"));
    toast("Aktywność podpięta.");
    if (!state.strava.activities.some((a) => Number(a.id) === id)) {
      openEmbedDialog(linkWorkoutId);
    }
  }

  function unlinkActivity() {
    delete state.links[linkWorkoutId];
    saveState(true);
    renderWeeks();
    refreshProgress();
    closeDialog($("#link-dialog"));
    toast("Podpięcie usunięte.");
  }

  /* ---------- Ręczne staty aktywności ---------- */

  let statsContext = null;

  function openStatsDialog(activityId, workoutId) {
    let activity = activityId
      ? state.strava.activities.find((a) => String(a.id) === String(activityId))
      : null;
    let draft = null;
    if (!activity && activityId) {
      const workout = workoutId ? WORKOUTS.find((w) => w.id === workoutId) : null;
      const pinned = (PLAN.pinned || []).find((p) => String(p.id) === String(activityId));
      const day = workout ? workoutDate(workout) : new Date();
      draft = {
        id: pinned ? pinned.id : Number(activityId),
        name: (pinned && pinned.name) || "Bieg",
        date: (pinned && pinned.date) || toISODate(day || new Date()),
        distance: 0,
        moving_time: 0
      };
      activity = draft;
    } else if (!activity) {
      const ms = workoutId ? state.manualStats[workoutId] : null;
      activity = {
        distance: ms ? ms.distance : 0,
        moving_time: ms ? ms.moving_time : 0,
        avg_hr: ms ? ms.avg_hr : 0
      };
    }
    statsContext = { activityId: activityId ? String(activityId) : null, workoutId: workoutId || null, draft };
    const km = activity.distance ? (activity.distance / 1000).toFixed(2).replace(".", ",") : "";
    const time = activity.moving_time ? fmtDuration(activity.moving_time) : "";
    const hr = activity.avg_hr ? String(Math.round(activity.avg_hr)) : "";
    $("#stats-dialog-body").innerHTML = `
      <p>${activityId ? "Wpisz dane z aktywności Strava." : "Wpisz dystans i czas treningu."} Tempo policzy się samo.</p>
      <div class="input-block">
        <label>Dystans (km)
          <input id="stats-distance" inputmode="decimal" autocomplete="off" placeholder="np. 6,02" value="${esc(km)}">
        </label>
        <label>Czas (mm:ss)
          <input id="stats-time" inputmode="numeric" autocomplete="off" placeholder="np. 35:00" value="${esc(time)}">
        </label>
        <label>Śr. tętno (opcjonalnie)
          <input id="stats-hr" inputmode="numeric" autocomplete="off" placeholder="np. 152" value="${esc(hr)}">
        </label>
      </div>
      <div class="dialog-actions">
        <button type="button" class="btn btn-primary" data-stats-action="save">Zapisz staty</button>
        <button type="button" class="btn btn-ghost" data-close>Anuluj</button>
      </div>`;
    openDialog($("#stats-dialog"));
  }

  function saveStats() {
    if (!statsContext) return;
    const kmRaw = String(($("#stats-distance") || {}).value || "").replace(",", ".").trim();
    const timeRaw = String(($("#stats-time") || {}).value || "").trim();
    const hrRaw = String(($("#stats-hr") || {}).value || "").trim();
    const km = Number(kmRaw);
    const seconds = parseTimeInput(timeRaw);
    if (!km || !isFinite(km) || km <= 0) {
      toast("Podaj dystans w km, np. 6,02.");
      return;
    }
    if (!seconds) {
      toast("Podaj czas, np. 35:00.");
      return;
    }
    if (!statsContext.activityId) {
      const wid = statsContext.workoutId;
      if (!wid) {
        toast("Nie znaleziono treningu.");
        return;
      }
      const prev = state.manualStats[wid] || {};
      state.manualStats[wid] = {
        distance: Math.round(km * 1000),
        moving_time: seconds,
        avg_hr: hrRaw ? Number(hrRaw) || null : prev.avg_hr || null
      };
      markManualDone(wid, seconds);
      finishStatsSave();
      return;
    }

    let activity = state.strava.activities.find((a) => String(a.id) === statsContext.activityId);
    if (!activity) {
      if (statsContext.draft) {
        activity = statsContext.draft;
        state.strava.activities.push(activity);
        state.strava.activities = mergePinned(state.strava.activities);
      } else {
        toast("Nie znaleziono aktywności.");
        return;
      }
    }
    activity.distance = Math.round(km * 1000);
    activity.moving_time = seconds;
    activity.avg_hr = hrRaw ? Number(hrRaw) || null : activity.avg_hr || null;
    activity.manualStats = true;

    if (statsContext.workoutId) markManualDone(statsContext.workoutId, seconds);
    finishStatsSave();
  }

  function markManualDone(workoutId, seconds) {
    state.done[workoutId] = true;
    delete state.manualUndone[workoutId];
    const log = state.log[workoutId] || {};
    if (!log.t) {
      state.log[workoutId] = Object.assign({}, log, { t: fmtDuration(seconds) });
    }
  }

  function finishStatsSave() {
    saveState(true);
    renderWeeks();
    refreshProgress();
    renderStravaPanel();
    closeDialog($("#stats-dialog"));
    statsContext = null;
    toast("Staty zapisane.");
  }

  function removeManualStats(workoutId) {
    if (!state.manualStats[workoutId]) return;
    delete state.manualStats[workoutId];
    saveState(true);
    renderWeeks();
    refreshProgress();
    toast("Staty usunięte.");
  }

  /* ---------- Eksport / import ---------- */

  function exportData() {
    const payload = {
      app: "plan-10km-sub50",
      version: 1,
      exportedAt: new Date().toISOString(),
      state: state
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plan-10km-dane-" + toISODate(new Date()) + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Kopia danych pobrana.");
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const next = parsed && parsed.state ? parsed.state : parsed;
        if (!next || typeof next !== "object" || typeof next.done !== "object") {
          throw new Error("Nieprawidłowy plik.");
        }
        if (!confirm("Import zastąpi obecne dane treningowe. Kontynuować?")) return;
        state = {
          start: typeof next.start === "string" ? next.start : null,
          done: next.done || {},
          log: next.log || {},
          links: next.links || {},
          manualUndone: next.manualUndone && typeof next.manualUndone === "object" ? next.manualUndone : {},
          manualStats: next.manualStats && typeof next.manualStats === "object" ? next.manualStats : {},
          strava: {
            fetchedAt: next.strava && next.strava.fetchedAt ? next.strava.fetchedAt : null,
            activities: mergePinned(next.strava && Array.isArray(next.strava.activities) ? next.strava.activities : [])
          }
        };
        saveState(true);
        $("#start-date").value = state.start || "";
        renderWeeks();
        refreshProgress();
        renderStravaPanel();
        toast("Dane zaimportowane.");
      } catch (err) {
        toast("Nie udało się zaimportować pliku.");
      }
    };
    reader.readAsText(file);
  }

  function resetData() {
    if (!confirm("Usunąć wszystkie dane treningowe i odłączyć Stravę? Tej operacji nie można cofnąć.")) return;
    localStorage.removeItem(KEY);
    localStorage.removeItem(AUTH_KEY);
    state = defaultState();
    state.strava.activities = mergePinned([]);
    auth = null;
    $("#start-date").value = "";
    renderWeeks();
    refreshProgress();
    renderStravaPanel();
    toast("Dane wyczyszczone.");
  }

  /* ---------- Zdarzenia ---------- */

  function bindEvents() {
    $("#weeks").addEventListener("click", (event) => {
      const actionEl = event.target.closest("[data-action]");
      if (!actionEl) return;
      const action = actionEl.dataset.action;
      const id = actionEl.dataset.id;

      if (action === "toggle") {
        const next = !state.done[id];
        setDone(id, next);
        if (next) delete state.manualUndone[id];
        else state.manualUndone[id] = true;
        saveState(true);
        refreshProgress();
        if (next) {
          const calc = $(`[data-calc="${id}"]`);
          if (calc) calc.textContent = "";
        }
      }

      if (action === "link-strava") openLinkDialog(id);
      if (action === "strava-embed") openEmbedDialog(id);
    });

    $("#weeks").addEventListener("input", (event) => {
      const timeInput = event.target.closest(".time-input");
      const noteInput = event.target.closest(".note-field");
      if (timeInput) {
        setLog(timeInput.dataset.id, { t: timeInput.value });
        updateCalc(timeInput.dataset.id);
      }
      if (noteInput) {
        setLog(noteInput.dataset.note, { n: noteInput.value });
      }
    });

    $("#weeks").addEventListener("toggle", (event) => {
      if (event.target.matches("details.week")) updateToggleAllLabel();
    }, true);

    $("#toggle-all").addEventListener("click", () => {
      const all = $$("#weeks details");
      const allOpen = all.length > 0 && all.every((d) => d.open);
      all.forEach((d) => { d.open = !allOpen; });
      updateToggleAllLabel();
    });

    $("#start-date").addEventListener("change", (event) => {
      state.start = event.target.value || null;
      saveState(true);
      renderWeeks();
      refreshProgress();
      if (state.start && state.strava.activities.length) {
        autoCompleteFromCache();
      }
      if (state.start) toast("Start planu ustawiony.");
    });

    document.addEventListener("click", (event) => {
      const close = event.target.closest("[data-close]");
      if (close) {
        const dialog = close.closest("dialog");
        if (dialog) closeDialog(dialog);
      }
      const action = event.target.closest("[data-strava]");
      if (action) handleStravaAction(action.dataset.strava);
      const saAction = event.target.closest("[data-strava-action]");
      if (saAction) handleStravaAction(saAction.dataset.stravaAction);
      const linkAction = event.target.closest("[data-link-action]");
      if (linkAction) {
        if (linkAction.dataset.linkAction === "save") linkManualActivity();
        if (linkAction.dataset.linkAction === "remove") unlinkActivity();
      }
      const statsAction = event.target.closest("[data-stats-action]");
      if (statsAction && statsAction.dataset.statsAction === "save") saveStats();
      const statsBtn = event.target.closest('[data-action="stats"]');
      if (statsBtn) openStatsDialog(statsBtn.dataset.activity, statsBtn.dataset.workout);
      const statsRemove = event.target.closest('[data-action="stats-remove"]');
      if (statsRemove) removeManualStats(statsRemove.dataset.workout);
      const pick = event.target.closest("[data-pick]");
      if (pick) {
        const activity = state.strava.activities.find((a) => String(a.id) === pick.dataset.pick);
        if (activity && linkWorkoutId) {
          state.links[linkWorkoutId] = activity.id;
          state.done[linkWorkoutId] = true;
          const log = state.log[linkWorkoutId] || {};
          if (!log.t) state.log[linkWorkoutId] = Object.assign({}, log, { t: fmtDuration(activity.moving_time) });
          saveState(true);
          renderWeeks();
          refreshProgress();
          closeDialog($("#link-dialog"));
          toast("Aktywność podpięta.");
        }
      }
      if (event.target.closest('[data-action="export"]')) exportData();
      if (event.target.closest('[data-action="import"]')) $("#import-file").click();
      if (event.target.closest('[data-action="reset"]')) resetData();
    });

    $("#import-file").addEventListener("change", (event) => {
      const file = event.target.files && event.target.files[0];
      if (file) importData(file);
      event.target.value = "";
    });

    $("#strava-dialog").addEventListener("close", () => {
      $("#strava-dialog-body").innerHTML = "";
    });
  }

  function copyDiagnostics() {
    const d = lastSyncDebug || {};
    const text = [
      "Strava diag",
      "status: " + (d.status || "brak"),
      "body: " + (d.body || "brak"),
      "scope: " + (d.scope || (auth && auth.scope) || "brak"),
      "url: " + (d.requestUrl || "brak"),
      "kiedy: " + (d.at || "brak"),
      "tokenExp: " + ((auth && auth.expiresAt) || "brak"),
      "athlete: " + ((auth && auth.athlete && auth.athlete.id) || "brak")
    ].join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => toast("Diagnostyka skopiowana — wklej mi ją w czacie."))
        .catch(() => window.prompt("Skopiuj diagnostykę:", text));
      return;
    }
    window.prompt("Skopiuj diagnostykę:", text);
  }

  function handleStravaAction(action) {
    if (action === "connect" || action === "help") {
      openDialog($("#strava-dialog"));
      renderStravaDialog();
      return;
    }
    if (action === "authorize") return authorize();
    if (action === "sync") return syncActivities();
    if (action === "copy-diag") return copyDiagnostics();
    if (action === "reconnect") {
      syncError = "";
      lastSyncDebug = null;
      if (auth && auth.clientId && auth.clientSecret) {
        beginAuth(auth.clientId, auth.clientSecret, true);
      } else {
        openDialog($("#strava-dialog"));
        renderStravaDialog("Połącz Stravę ponownie, żeby przyznać dostęp do aktywności.");
      }
      return;
    }
    if (action === "start") {
      const input = $("#start-date");
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      input.focus();
      if (typeof input.showPicker === "function") {
        try { input.showPicker(); } catch (err) { /* przeglądarka może zablokować */ }
      }
      return;
    }
    if (action === "settings") {
      openDialog($("#strava-dialog"));
      renderStravaDialog();
      return;
    }
    if (action === "disconnect") return disconnectStrava();
  }

  function autoCompleteFromCache() {
    if (!state.start || !state.strava.activities.length) return;
    const used = new Set(Object.values(state.links).map(String));
    let completed = 0;
    WORKOUTS.forEach((w) => {
      if (state.links[w.id]) return;
      const date = workoutDate(w);
      if (!date) return;
      const match = findActivityForDate(toISODate(date), state.strava.activities, used);
      if (!match) return;
      used.add(String(match.a.id));
      if (markWorkoutDoneFromActivity(w, match.a)) completed++;
    });
    if (completed) {
      saveState(true);
      renderWeeks();
      refreshProgress();
    }
  }

  /* ---------- Start ---------- */

  function applySetupHash() {
    const match = /^#strava=([^:&]+):(.+)$/.exec(location.hash || "");
    if (!match) return false;
    const clientId = decodeURIComponent(match[1]).trim();
    const clientSecret = decodeURIComponent(match[2]).trim();
    history.replaceState({}, "", location.pathname + location.search);
    if (!/^\d+$/.test(clientId) || clientSecret.length < 10) {
      toast("Nieprawidłowe dane aplikacji Strava w linku.");
      return false;
    }
    beginAuth(clientId, clientSecret, true);
    return true;
  }

  function init() {
    if (applySetupHash()) return;
    renderPaces();
    renderSchedule();
    renderRules();
    renderWeeks();

    $("#start-date").value = state.start || "";
    refreshProgress();
    renderStravaPanel();
    bindEvents();

    if (isConnected() && state.strava.activities.some((a) => a.distance && a.moving_time)) {
      ensureStartDate();
    }
    if (state.start) autoCompleteFromCache();

    handleOAuthCallback();

    if (isConnected()) {
      const hasStats = state.strava.activities.some((a) => a.distance && a.moving_time);
      const stale = Date.now() - (state.strava.fetchedAt || 0) > 1000 * 60 * 30;
      if (!hasStats || stale) syncActivities({ silent: true });
    }

    if ("serviceWorker" in navigator && location.protocol === "https:") {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js", { updateViaCache: "none" })
          .then((reg) => reg.update())
          .catch(() => {});
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
