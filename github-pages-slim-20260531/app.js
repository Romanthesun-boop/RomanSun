const state = {
  data: null,
  route: ["start"],
  screen: "start",
  currentCaseId: 1,
  metrics: {},
  selectedFormat: "",
  selectedBranch: null,
  finalOutcome: "",
  mapAnswers: {},
  mapStage: 0,
  mapErrors: 0,
  mapStageErrors: {},
  channelErrors: 0,
  formErrors: 0,
  decisionHistory: [],
  player: {
    firstName: "Алексей",
    lastName: "",
    role: "Руководитель команды",
    gender: "male",
    hair: "dark",
    skin: "medium",
    hairStyle: "short",
    accessory: "none",
    outfit: "gold",
    portrait: "assets/player/leader-ai-1.png",
  },
  openMember: "",
  teamStats: {},
};

const view = document.querySelector("#view");
const sectionName = document.querySelector("#sectionName");
const topMetrics = document.querySelector("#topMetrics");
const theoryDialog = document.querySelector("#theoryDialog");

// Core game metrics
const metricOrder = ["sla", "trust", "quality", "turnover", "hiddenConflict"];
const riskMetrics = new Set(["turnover", "hiddenConflict"]);
const mapStageCounts = [1, 2, 4, 6];
const mapSideLabels = {
  1: ["Олега", "Марины и команды"],
  2: ["Олега", "команды"],
  3: ["Олега", "команды"],
  4: ["Олега", "команды"],
  5: ["сотрудников смены", "QA и клиентов"],
  6: ["команды", "новичков"],
  7: ["Светланы", "Ильи"],
  8: ["Дениса", "команды"],
  9: ["руководителя", "команды"],
  10: ["руководителя", "команды"],
};

const iconShapes = {
  home: `
    <path d="m4 11 8-7 8 7"></path>
    <path d="M6 10v10h12V10"></path>
    <path d="M10 20v-6h4v6"></path>
  `,
  inbox: `
    <path d="M4 7h16v12H4z"></path>
    <path d="m4 8 8 6 8-6"></path>
    <path d="m4 19 6-6"></path>
    <path d="m20 19-6-6"></path>
  `,
  team: `
    <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
    <path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
    <path d="M4 19c.6-3 2-5 4-5s3.4 2 4 5"></path>
    <path d="M12 19c.6-3 2-5 4-5s3.4 2 4 5"></path>
  `,
  map: `
    <path d="M5 6h5l4 3h5v9h-5l-4-3H5z"></path>
    <path d="M10 6v9"></path>
    <path d="M14 9v9"></path>
    <circle cx="7.5" cy="9" r="1"></circle>
    <circle cx="16.5" cy="15" r="1"></circle>
  `,
  bank: `
    <path d="M4 10h16"></path>
    <path d="M6 10v8"></path>
    <path d="M10 10v8"></path>
    <path d="M14 10v8"></path>
    <path d="M18 10v8"></path>
    <path d="M3 18h18"></path>
    <path d="m12 4 8 4H4z"></path>
  `,
  settings: `
    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"></path>
    <path d="M19 13.2v-2.4l-2.2-.5-.7-1.6 1.2-1.9-1.7-1.7-1.9 1.2-1.7-.6L11.5 3h-2.4l-.5 2.2-1.6.7-1.9-1.2-1.7 1.7 1.2 1.9-.6 1.7-2 .5v2.4l2 .5.6 1.7-1.2 1.9 1.7 1.7 1.9-1.2 1.6.7.5 2.2h2.4l.5-2.2 1.7-.6 1.9 1.2 1.7-1.7-1.2-1.9.7-1.6z"></path>
  `,
  result: `
    <path d="M5 12.5 10 17 20 6"></path>
    <path d="M4 5h9"></path>
    <path d="M4 19h16"></path>
  `,
  warning: `
    <path d="m12 4 9 16H3z"></path>
    <path d="M12 9v5"></path>
    <path d="M12 17h.01"></path>
  `,
  sla: `
    <circle cx="12" cy="13" r="7"></circle>
    <path d="M9 3h6"></path>
    <path d="M12 7v6l4 2"></path>
  `,
  trust: `
    <path d="M7 12 4 15l4 4 4-4"></path>
    <path d="m17 12 3 3-4 4-4-4"></path>
    <path d="M8 13h8"></path>
    <path d="M10 11h4"></path>
  `,
  quality: `
    <path d="m12 4 2.2 4.5 5 .7-3.6 3.5.8 5-4.4-2.4-4.4 2.4.8-5L4.8 9.2l5-.7z"></path>
  `,
  turnover: `
    <path d="M5 4h8v16H5z"></path>
    <path d="M13 12h7"></path>
    <path d="m17 8 4 4-4 4"></path>
  `,
  hiddenConflict: `
    <path d="M5 9c2-3 12-3 14 0v4c0 4-3 7-7 7s-7-3-7-7z"></path>
    <path d="M8 12h3"></path>
    <path d="M13 12h3"></path>
    <path d="M9 16c2 1 4 1 6 0"></path>
  `,
  engagement: `
    <path d="M12 4v4"></path>
    <path d="M12 16v4"></path>
    <path d="M4 12h4"></path>
    <path d="M16 12h4"></path>
    <path d="m6.3 6.3 2.8 2.8"></path>
    <path d="m14.9 14.9 2.8 2.8"></path>
    <path d="m17.7 6.3-2.8 2.8"></path>
    <path d="m9.1 14.9-2.8 2.8"></path>
    <circle cx="12" cy="12" r="3"></circle>
  `,
  load: `
    <path d="M7 9h10l2 10H5z"></path>
    <path d="M9 9a3 3 0 0 1 6 0"></path>
    <path d="M9 14h6"></path>
  `,
  tension: `
    <path d="M13 3 5 14h6l-1 7 8-11h-6z"></path>
  `,
  expert: `
    <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
    <path d="M5 21c.8-4 3.2-6 7-6s6.2 2 7 6"></path>
    <path d="m16.5 5.5 2-2"></path>
    <path d="M18 8h3"></path>
  `,
  process: `
    <path d="M5 7h8"></path>
    <path d="M5 12h14"></path>
    <path d="M5 17h8"></path>
    <circle cx="17" cy="7" r="2"></circle>
    <circle cx="17" cy="17" r="2"></circle>
  `,
  chat: `
    <path d="M4 6h16v10H9l-5 4z"></path>
    <path d="M8 10h8"></path>
    <path d="M8 13h5"></path>
  `,
  newcomer: `
    <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"></path>
    <path d="M5 21c.8-4 3-6 7-6s6.2 2 7 6"></path>
    <path d="M19 5v5"></path>
    <path d="M16.5 7.5h5"></path>
  `,
  overload: `
    <path d="M7 9h10l2 10H5z"></path>
    <path d="M9 9a3 3 0 0 1 6 0"></path>
    <path d="M7 13h10"></path>
    <path d="m12 4 1.5 2.5H10.5z"></path>
  `,
  crisis: `
    <path d="M12 4 3 20h18z"></path>
    <path d="M12 9v5"></path>
    <path d="M8 20c1.2-2 2.5-3 4-3s2.8 1 4 3"></path>
  `,
};

const metricIcons = {
  sla: "sla",
  trust: "trust",
  quality: "quality",
  turnover: "turnover",
  hiddenConflict: "hiddenConflict",
};

const metricDescriptions = {
  sla: {
    title: "SLA",
    goal: "Показывает, успевает ли команда обрабатывать рабочие вопросы и клиентские кейсы в нужные сроки.",
    meaning: [
      "Для лида это индикатор операционной устойчивости: хватает ли людям ясности, поддержки и процесса, чтобы не зависать на спорных ситуациях.",
      "Если SLA падает, конфликт уже влияет не только на атмосферу, но и на клиентский опыт, сроки и нагрузку смежных функций.",
      "На SLA влияют понятные правила эскалации, доступность экспертов, скорость ответа в чате и качество распределения нагрузки.",
    ],
  },
  trust: {
    title: "Доверие",
    goal: "Показывает, насколько сотрудники готовы открыто говорить о проблемах и верят, что руководитель решит их безопасно.",
    meaning: [
      "Для лида это главный индикатор управленческой безопасности: принесут ли люди проблему заранее или начнут молчать и обходить официальные каналы.",
      "Низкое доверие усиливает скрытые договорённости, личные переписки и осторожность в обсуждении ошибок.",
      "Доверие растёт, когда руководитель признаёт интересы сторон, не унижает участников и переводит конфликт в понятный рабочий процесс.",
    ],
  },
  quality: {
    title: "Качество",
    goal: "Показывает, насколько решения команды остаются точными, устойчивыми и соответствуют стандартам работы.",
    meaning: [
      "Для лида это связь между коммуникацией и результатом: если люди боятся уточнять, ошибки начинают расти даже у сильной команды.",
      "Качество падает, когда знания держатся у одного эксперта, вопросы уходят в личные сообщения или сотрудники действуют наугад.",
      "Качество растёт, когда команда понимает критерии решения, знает куда эскалировать вопрос и получает поддержку без стыда.",
    ],
  },
  turnover: {
    title: "Риск текучести",
    goal: "Показывает вероятность потери людей из-за усталости, несправедливости, давления или ощущения небезопасности.",
    meaning: [
      "Для лида это ранний сигнал, что конфликт начинает стоить команде мотивации и удержания сотрудников.",
      "Риск растёт, когда сильных сотрудников перегружают, новичков оставляют без поддержки, а раздражение нормализуется как стиль общения.",
      "Риск снижается, когда нагрузка распределяется честнее, вклад признаётся, а правила помощи становятся явными.",
    ],
  },
  hiddenConflict: {
    title: "Скрытый конфликт",
    goal: "Показывает, сколько напряжения осталось под поверхностью: в личных переписках, молчании, сарказме и обходных практиках.",
    meaning: [
      "Для лида это показатель того, насколько проблема реально проговорена, а не просто временно притихла.",
      "Высокий скрытый конфликт означает, что команда может внешне выполнять правила, но внутри копить недоверие и сопротивление.",
      "Он снижается, когда руководитель помогает сторонам назвать интересы и опасения, а затем закрепляет понятный процесс взаимодействия.",
    ],
  },
};

const aiLeaderPortraits = {
  male: ["assets/player/leader-ai-1.png"],
  female: ["assets/player/leader-ai-2.png"],
};

const caseIconMap = {
  1: "expert",
  2: "process",
  3: "settings",
  4: "warning",
  5: "quality",
  6: "chat",
  7: "newcomer",
  8: "overload",
  9: "trust",
  10: "crisis",
};

function uiIcon(name, className = "") {
  return `
    <span class="ui-icon ${className} icon-${name}" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        ${iconShapes[name] || iconShapes.result}
      </svg>
    </span>
  `;
}

const screenFlow = [
  { id: "start", title: "Экран 1 — Старт симуляции", image: "01-start.png" },
  { id: "intro", title: "Экран 2 — Введение и показатели команды", image: "02-intro.png" },
  { id: "inbox", title: "Экран 3 — Почта руководителя", image: "03-inbox.png" },
  { id: "case", title: "Экран 4 — Получение кейса", image: "04-case.png" },
  { id: "map", title: "Экран 5 — Карта конфликта", image: "05-map.png" },
  { id: "format", title: "Экран 6 — Выбор способа взаимодействия", image: "06-format.png" },
  { id: "communication", title: "Экран 7 — Выбор формы коммуникации", image: "07-communication.png" },
  { id: "result", title: "Экран 8 — Результат решения кейса", image: "08-result.png" },
];

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function currentCase() {
  return state.data.cases.find((item) => item.id === state.currentCaseId) || state.data.cases[0];
}

function branchesFor(caseId, format = state.selectedFormat) {
  return state.data.branches.filter((item) => item.caseId === caseId && (!format || item.format === format));
}

function push(screen) {
  document.activeElement?.blur();
  state.route.push(screen);
  state.screen = screen;
  render();
  resetScrollPositions();
  requestAnimationFrame(resetScrollPositions);
  window.setTimeout(resetScrollPositions, 0);
  window.setTimeout(resetScrollPositions, 50);
  window.setTimeout(resetScrollPositions, 250);
}

function resetScrollPositions() {
  view.scrollTop = 0;
  view.querySelectorAll(".chat-thread, .mail-list, .map-grid, .draft-list, .team-room-grid").forEach((node) => {
    node.scrollTop = 0;
  });
}

function setMetricStarts() {
  Object.entries(state.data.metrics).forEach(([key, value]) => {
    state.metrics[key] = value.start;
  });
}

function setTeamStarts() {
  state.teamStats = {};
  teamMembers().forEach((member) => {
    state.teamStats[member.name] = {
      engagement: member.engagement,
      load: member.load,
      tension: member.tension,
    };
  });
}

function renderMetricBars(target, compact = false) {
  target.innerHTML = metricOrder
    .map((key) => {
      const meta = state.data.metrics[key];
      const value = state.metrics[key];
      const filled = Math.round(value / 10);
      if (compact) {
        return `
          <button class="metric-chip ${riskMetrics.has(key) ? "risk" : ""}" type="button" data-metric-info="${key}" aria-label="Что значит ${meta.label}">
            ${uiIcon(metricIcons[key], "metric-icon")}
            ${meta.label}
            <span class="mini-bar">${Array.from({ length: 10 }, (_, index) => `<span class="${index < filled ? "on" : ""}"></span>`).join("")}</span>
            ${value}
          </button>
        `;
      }
      return `
        <button class="metric-row ${riskMetrics.has(key) ? "risk" : ""}" type="button" data-metric-info="${key}" aria-label="Что значит ${meta.label}">
          <div class="metric-head"><span>${uiIcon(metricIcons[key], "metric-icon")}${meta.label}</span><span>${value}</span></div>
          <div class="bar"><span style="width:${value}%"></span></div>
        </button>
      `;
    })
    .join("");
}

function metricStackHTML() {
  return metricOrder
    .map((key) => {
      const meta = state.data.metrics[key];
      const value = state.metrics[key];
      const risk = riskMetrics.has(key);
      return `
        <button class="messenger-metric ${risk ? "risk" : ""}" type="button" data-metric-info="${key}" aria-label="Что значит ${meta.label}">
          <span>${uiIcon(metricIcons[key], "metric-icon")}${meta.label}</span>
          <b>${value}</b>
          <div class="bar"><span style="width:${value}%"></span></div>
        </button>
      `;
    })
    .join("");
}

function topActionHTML() {
  return `
    <div class="top-actions-label">Учебный центр</div>
    <button class="top-action-button home" type="button" data-action="home">${uiIcon("home")} Главный экран</button>
    <button class="top-action-button kpi" type="button" data-action="kpiPanel">${uiIcon("sla")} KPI</button>
    <button class="top-action-button" type="button" data-action="theory">${uiIcon("map")} Теория</button>
    <button class="top-action-button" type="button" data-action="teamRoom">${uiIcon("team")} Команда</button>
    <button class="top-action-button" type="button" data-action="learningEvent">${uiIcon("engagement")} Практикум</button>
  `;
}

function updateFrame(title) {
  view.style.setProperty("--screen-bg", "none");
  document.body.classList.toggle("is-start-screen", state.screen === "start" || state.screen === "orientation");
  sectionName.textContent = title;
  topMetrics.innerHTML = topActionHTML();
}

const portraitByName = {
  Марина: "assets/team/portrait-1.png",
  Олег: "assets/team/portrait-2.png",
  Светлана: "assets/team/portrait-3.png",
  Денис: "assets/team/portrait-4.png",
  Антон: "assets/team/portrait-5.png",
  Юлия: "assets/team/portrait-6.png",
};

function portraitFor(seed = "") {
  const text = String(seed || "");
  return Object.entries(portraitByName).find(([name]) => text.includes(name))?.[1] || "";
}

const avatarOptions = {
  genders: [
    { id: "male", label: "Муж." },
    { id: "female", label: "Жен." },
  ],
  hair: [
    { id: "dark", label: "Тёмные", color: "#171714" },
    { id: "brown", label: "Каштан", color: "#6a3f25" },
    { id: "blond", label: "Светлые", color: "#d4ad55" },
    { id: "gray", label: "Седые", color: "#b8b7ad" },
  ],
  skin: [
    { id: "light", label: "Светлая", color: "#f1c38d" },
    { id: "medium", label: "Средняя", color: "#c98f5b" },
    { id: "dark", label: "Тёмная", color: "#8a5737" },
  ],
  hairStyles: [
    { id: "short", label: "Короткие" },
    { id: "side", label: "Пробор" },
    { id: "long", label: "Длинные" },
  ],
  accessories: [
    { id: "none", label: "Без очков" },
    { id: "glasses", label: "Очки" },
  ],
  outfits: [
    { id: "gold", label: "Золото", color: "#d9b83e" },
    { id: "blue", label: "Синий", color: "#315d7c" },
    { id: "green", label: "Зелёный", color: "#56724b" },
    { id: "gray", label: "Графит", color: "#6f6c62" },
  ],
};

function playerAvatarMarkup(size = "normal") {
  if (state.player.portrait) {
    return `
      <span class="portrait-avatar player-portrait ${size} ${state.player.customPortrait ? "custom" : ""}" aria-hidden="true">
        <img src="${state.player.portrait}" alt="" />
      </span>
    `;
  }
  const hair = avatarOptions.hair.find((item) => item.id === state.player.hair) || avatarOptions.hair[0];
  const skin = avatarOptions.skin.find((item) => item.id === state.player.skin) || avatarOptions.skin[1];
  const outfit = avatarOptions.outfits.find((item) => item.id === state.player.outfit) || avatarOptions.outfits[0];
  return `
    <span
      class="profile-avatar ${size} ${state.player.gender === "female" ? "is-female" : "is-male"} hair-${state.player.hairStyle} accessory-${state.player.accessory}"
      style="--avatar-hair:${hair.color}; --avatar-skin:${skin.color}; --avatar-outfit:${outfit.color};"
      aria-hidden="true"
    >
      <span class="avatar-back-hair"></span>
      <span class="avatar-hair"></span>
      <span class="avatar-face"></span>
      <span class="avatar-nose"></span>
      <span class="avatar-mouth"></span>
      <span class="avatar-glasses"></span>
      <span class="avatar-neck"></span>
      <span class="avatar-shirt"></span>
    </span>
  `;
}

function randomFrom(items) {
  const item = items[Math.floor(Math.random() * items.length)];
  return item?.id || item;
}

function generatePlayerAvatar() {
  const portraits = aiLeaderPortraits[state.player.gender] || aiLeaderPortraits.male;
  state.player.portrait = randomFrom(portraits);
  state.player.customPortrait = false;
  state.player.aiGenerated = true;
  render();
}

function syncPlayerPortraitToGender() {
  const portraits = aiLeaderPortraits[state.player.gender] || aiLeaderPortraits.male;
  if (!portraits.includes(state.player.portrait)) {
    state.player.portrait = portraits[0];
  }
  state.player.customPortrait = false;
}

async function tryAiPortraitAdapter(file) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);
  const form = new FormData();
  form.append("photo", file);
  form.append("style", "conflict-simulation-team-card");
  form.append("gender", state.player.gender);
  form.append("prompt", [
    "Transform the uploaded person photo into a cohesive team-card portrait.",
    "Keep likeness and face orientation, but redraw it as a semi-realistic corporate game portrait.",
    "Use muted bank office background, warm black and gold palette, painterly detail, no pixel art.",
    "Return a cropped vertical portrait matching the existing employee cards."
  ].join(" "));

  try {
    const response = await fetch("/api/adapt-portrait", {
      method: "POST",
      body: form,
      signal: controller.signal
    });
    if (!response.ok) return "";
    const data = await response.json();
    return data.portrait || data.image || data.url || "";
  } catch (error) {
    return "";
  } finally {
    window.clearTimeout(timeout);
  }
}

async function createUnifiedPortrait(file) {
  const aiPortrait = await tryAiPortraitAdapter(file);
  if (aiPortrait) return aiPortrait;
  return adaptPhotoToTeamStyle(file);
}

function adaptPhotoToTeamStyle(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("error", reject);
    reader.addEventListener("load", () => {
      const image = new Image();
      image.addEventListener("error", reject);
      image.addEventListener("load", () => {
        const width = 178;
        const height = 205;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;

        const sourceRatio = image.width / image.height;
        const targetRatio = width / height;
        const sourceWidth = sourceRatio > targetRatio ? image.height * targetRatio : image.width;
        const sourceHeight = sourceRatio > targetRatio ? image.height : image.width / targetRatio;
        const sourceX = (image.width - sourceWidth) / 2;
        const sourceY = (image.height - sourceHeight) / 2;

        const bg = ctx.createLinearGradient(0, 0, width, height);
        bg.addColorStop(0, "#5f625c");
        bg.addColorStop(0.58, "#34362f");
        bg.addColorStop(1, "#151512");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        const painted = document.createElement("canvas");
        const paintedCtx = painted.getContext("2d");
        painted.width = width;
        painted.height = height;
        paintedCtx.filter = "saturate(0.7) contrast(1.28) brightness(0.9) sepia(0.16)";
        paintedCtx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
        paintedCtx.filter = "none";

        const imageData = paintedCtx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const original = new Uint8ClampedArray(data);
        for (let index = 0; index < data.length; index += 4) {
          const gray = data[index] * 0.28 + data[index + 1] * 0.48 + data[index + 2] * 0.24;
          const shadow = gray < 80 ? -16 : gray > 190 ? 8 : 0;
          data[index] = Math.min(235, Math.round((data[index] * 0.72 + gray * 0.28 + shadow + 8) / 22) * 22);
          data[index + 1] = Math.min(228, Math.round((data[index + 1] * 0.66 + gray * 0.34 + shadow + 4) / 22) * 22);
          data[index + 2] = Math.min(218, Math.round((data[index + 2] * 0.58 + gray * 0.42 + shadow) / 22) * 22);
        }
        for (let y = 1; y < height - 1; y += 1) {
          for (let x = 1; x < width - 1; x += 1) {
            const index = (y * width + x) * 4;
            const left = (y * width + x - 1) * 4;
            const right = (y * width + x + 1) * 4;
            const top = ((y - 1) * width + x) * 4;
            const bottom = ((y + 1) * width + x) * 4;
            const currentGray = original[index] * 0.3 + original[index + 1] * 0.5 + original[index + 2] * 0.2;
            const edge =
              Math.abs(currentGray - (original[left] * 0.3 + original[left + 1] * 0.5 + original[left + 2] * 0.2)) +
              Math.abs(currentGray - (original[right] * 0.3 + original[right + 1] * 0.5 + original[right + 2] * 0.2)) +
              Math.abs(currentGray - (original[top] * 0.3 + original[top + 1] * 0.5 + original[top + 2] * 0.2)) +
              Math.abs(currentGray - (original[bottom] * 0.3 + original[bottom + 1] * 0.5 + original[bottom + 2] * 0.2));
            if (edge > 88) {
              data[index] = Math.max(0, data[index] - 48);
              data[index + 1] = Math.max(0, data[index + 1] - 48);
              data[index + 2] = Math.max(0, data[index + 2] - 48);
            }
          }
        }
        paintedCtx.putImageData(imageData, 0, 0);

        const low = document.createElement("canvas");
        const lowCtx = low.getContext("2d");
        low.width = 90;
        low.height = 104;
        lowCtx.imageSmoothingEnabled = true;
        lowCtx.drawImage(painted, 0, 0, low.width, low.height);

        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.globalAlpha = 0.96;
        ctx.drawImage(low, 0, 0, width, height);
        ctx.restore();

        ctx.globalCompositeOperation = "overlay";
        ctx.fillStyle = "rgba(215, 191, 121, 0.12)";
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "source-over";

        ctx.globalCompositeOperation = "multiply";
        const vignette = ctx.createRadialGradient(width / 2, height * 0.42, 28, width / 2, height * 0.45, 122);
        vignette.addColorStop(0, "rgba(255, 255, 255, 0)");
        vignette.addColorStop(1, "rgba(0, 0, 0, 0.42)");
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "rgba(12, 12, 10, 0.16)";
        for (let y = 0; y < height; y += 3) ctx.fillRect(0, y, width, 1);
        ctx.fillStyle = "rgba(227, 185, 39, 0.06)";
        for (let x = 1; x < width; x += 5) ctx.fillRect(x, 0, 1, height);
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.fillRect(0, 0, width, 7);
        ctx.fillRect(0, height - 7, width, 7);
        ctx.fillRect(0, 0, 7, height);
        ctx.fillRect(width - 7, 0, 7, height);
        ctx.strokeStyle = "#050504";
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, width - 6, height - 6);
        resolve(canvas.toDataURL("image/png"));
      });
      image.src = reader.result;
    });
    reader.readAsDataURL(file);
  });
}

function avatarMarkup(seed = "", usePlayer = false) {
  if (usePlayer) return playerAvatarMarkup();
  const text = String(seed || "Р").trim();
  const first = text.match(/[А-ЯA-ZЁ]/i)?.[0] || "Р";
  const portrait = portraitFor(text);
  if (portrait) {
    return `
      <span class="portrait-avatar" aria-hidden="true">
        <img src="${portrait}" alt="" />
      </span>
    `;
  }
  return `
    <span class="icon-avatar" aria-hidden="true">
      <span class="avatar-initial">${first.toUpperCase()}</span>
    </span>
  `;
}

function caseMessageIcon(item, locked = false) {
  const icon = caseIconMap[item.id] || "inbox";
  return `<span class="case-message-icon ${locked ? "locked" : ""}">${uiIcon(icon)}</span>`;
}

function chatSidebar(active) {
  return `
    <aside class="chat-sidebar">
      <div class="lead-card">
        ${playerAvatarMarkup("large")}
        <div>
          <strong>${state.player.firstName} ${state.player.lastName}</strong>
          <span>${state.player.role}</span>
        </div>
      </div>
      <div class="bank-card"><span class="bank-icon">${uiIcon("bank")}</span><strong>Горячая линия банка</strong></div>
      <div class="rail-metrics">${metricStackHTML()}</div>
      <div class="warning-card"><strong>${uiIcon("warning")} ПРЕДУПРЕЖДЕНИЕ</strong><span>Следите за скрытым конфликтом и риском текучести</span></div>
      <details class="team-drawer" open>
        <summary>${uiIcon("team")} Команда</summary>
        <button class="team-room-link" type="button" data-action="teamRoom">Открыть комнату команды</button>
        <div class="team-list">
          ${teamMembers()
            .map(
              (member) => `
                <button class="team-member ${state.openMember === member.name ? "active" : ""}" type="button" data-member="${member.name}">
                  ${avatarMarkup(member.name)}
                  <span><strong>${member.name}</strong><small>${member.type}</small></span>
                </button>
                ${
                  state.openMember === member.name
                    ? `<article class="member-profile"><strong>${member.role}</strong><span>${member.description}</span></article>`
                    : ""
                }
              `,
            )
            .join("")}
        </div>
      </details>
    </aside>
  `;
}

function teamMembers() {
  return [
    { name: "Денис", type: "Результатник", role: "Топ по скорости", description: "Ценность: признание и премия. Триггер: потеря статуса.", engagement: 72, load: 68, tension: 34 },
    { name: "Марина", type: "Эксперт", role: "Глубокие знания процессов", description: "Ценность: уважение к опыту. Риск: пассивная агрессия.", engagement: 70, load: 58, tension: 46 },
    { name: "Олег", type: "Старший оператор", role: "Формальный лидер смены", description: "Ценность: контроль. Риск: токсичность.", engagement: 64, load: 76, tension: 52 },
    { name: "Светлана", type: "Перфекционист", role: "Максимальное качество", description: "Триггер: снижение стандартов. Риск: давление на новичков.", engagement: 75, load: 62, tension: 38 },
    { name: "Антон", type: "Прагматик", role: "Упрощает процессы", description: "Триггер: бюрократия. Риск: саботаж регламентов.", engagement: 68, load: 54, tension: 32 },
    { name: "Юлия", type: "Эмоциональный драйвер", role: "Высокая эмпатия", description: "Триггер: несправедливость. Риск: эскалации в HR.", engagement: 73, load: 56, tension: 42 },
  ];
}

function startView() {
  updateFrame("Старт");
  view.innerHTML = `
    <div class="start-render-screen">
      <button class="render-start-button" type="button" data-action="orientation">Начать симуляцию</button>
    </div>
  `;
}

function orientationView() {
  updateFrame("Рабочий стол");
  const members = teamMembers();
  view.innerHTML = `
    <section class="onboarding-screen">
      <header class="onboarding-header">
        <span class="app-mark">${uiIcon("bank")}</span>
        <div>
          <h2>Перед вами рабочий стол руководителя</h2>
          <p>Сначала вы читаете сообщение, затем разбираете ситуацию, сверяете её с состоянием команды и выбираете управленческое действие.</p>
        </div>
        <button type="button" data-action="intro">Понятно</button>
      </header>

      <div class="onboarding-map">
        <article class="onboarding-card">
          <span class="desk-icon">${uiIcon("inbox")}</span>
          <strong>Входящие</strong>
          <p>Отслеживайте в этой папке сообщения от своих сотрудников. Каждое входящее письмо открывает новую рабочую ситуацию для разбора.</p>
        </article>
        <article class="onboarding-card">
          <span class="desk-icon">${uiIcon("team")}</span>
          <div class="desk-team-strip compact">
            ${members.map((member) => `<span title="${member.name}">${avatarMarkup(member.name)}</span>`).join("")}
          </div>
          <strong>Команда</strong>
          <p>Сотрудники не просто фон. Их роли, интересы и опасения помогают понять, почему конфликт держится.</p>
        </article>
        <article class="onboarding-card">
          <span class="desk-icon">${uiIcon("sla")}</span>
          <div class="desk-metric-grid compact">${metricStackHTML()}</div>
          <strong>Метрики</strong>
          <p>Следите за результатом, доверием, качеством и рисками. Хорошее решение не должно чинить один показатель ценой разрушения другого.</p>
        </article>
        <article class="onboarding-card">
          <span class="desk-icon">${uiIcon("map")}</span>
          <strong>Карта конфликта</strong>
          <p>Перед ответом заполните базовую карту: участники, проблема, интересы и опасения сторон.</p>
        </article>
        <article class="onboarding-card wide">
          <strong>Как двигаться</strong>
          <p>Откройте текущее сообщение, прочитайте контекст, заполните карту конфликта, выберите формат взаимодействия и затем текст реакции. Новые послания будут открываться постепенно.</p>
        </article>
      </div>
    </section>
  `;
}

function introView() {
  updateFrame("Введение");
  view.innerHTML = `
    <div class="messenger-layout">
      ${chatSidebar("intro")}
      <section class="chat-window">
        <header class="chat-header">
          ${playerAvatarMarkup()}
          <div><strong>Рабочий мессенджер руководителя</strong><span>Команда спорных платежей</span></div>
        </header>
        <div class="chat-thread">
          <article class="message system-message">
            <strong>Ваша задача</strong>
            <p>Сохранить рабочий результат команды и снизить напряжение в сложных ситуациях.</p>
          </article>
          <article class="message incoming">
            <strong>Что предстоит освоить</strong>
            <ul>
              <li>Освоить инструмент «Карта конфликта».</li>
              <li>Разделять позиции, интересы и опасения.</li>
              <li>Выбирать формат взаимодействия и форму коммуникации.</li>
              <li>Понимать влияние решений на бизнес-показатели.</li>
            </ul>
          </article>
          <article class="message incoming profile-message">
            <strong>Профиль руководителя</strong>
            <div class="portrait-generator">
              ${playerAvatarMarkup("large")}
              <div>
                <b>ИИ-портрет руководителя</b>
                <span>Сгенерируйте портрет или загрузите фото: система перерисует его в общий стиль карточек сотрудников.</span>
              </div>
              <div class="portrait-actions">
                <button type="button" data-action="randomAvatar">Сгенерировать ИИ-портрет</button>
                <label class="upload-button">
                  Загрузить и перерисовать фото
                  <input type="file" name="playerPhoto" accept="image/*" />
                </label>
              </div>
            </div>
            <div class="profile-editor">
              <label>Имя <input name="firstName" value="${state.player.firstName}" autocomplete="given-name" /></label>
              <label>Фамилия <input name="lastName" value="${state.player.lastName}" autocomplete="family-name" /></label>
              <div class="avatar-control">
              <span>Пол</span>
              <div class="segmented-control">
                ${avatarOptions.genders
                  .map(
                    (item) => `
                      <button class="${state.player.gender === item.id ? "active" : ""}" type="button" data-player-gender="${item.id}">${item.label}</button>
                    `,
                  )
                  .join("")}
              </div>
            </div>
            </div>
          </article>
          ${teamSpotlightHTML()}
        </div>
        <footer class="composer">
          <span>Профиль можно изменить перед началом</span>
          <button type="button" data-action="inbox">Открыть почту</button>
        </footer>
      </section>
    </div>
  `;
}

function inboxView() {
  updateFrame("Почта");
  const visibleCases = state.data.cases.filter((item) => item.id >= state.currentCaseId && item.id < state.currentCaseId + 3);
  view.innerHTML = `
    <div class="messenger-layout with-kpi">
      ${chatSidebar("inbox")}
      <section class="chat-window">
        <header class="chat-header">
          <span class="mail-badge">${uiIcon("inbox")}</span>
          <div><strong>Входящие сообщения</strong><span>Новые послания появляются по мере работы команды</span></div>
        </header>
        <div class="mail-list">
          ${visibleCases
            .map(
              (item) => `
                <button
                  class="mail-item ${item.id === state.currentCaseId ? "is-active" : ""}"
                  type="button"
                  ${item.id === state.currentCaseId ? `data-case="${item.id}"` : "disabled"}
                >
                  ${caseMessageIcon(item, item.id !== state.currentCaseId)}
                  <span>
                    <strong>${item.id === state.currentCaseId ? `Ситуация ${item.id}` : "Ожидаемое сообщение"}</strong><br />
                    ${
                      item.id === state.currentCaseId
                        ? `<em>Сообщение от команды</em><small>${item.theme}</small>`
                        : "Появится после текущего решения"
                    }
                  </span>
                  <span>${item.id === state.currentCaseId ? "открыть" : "позже"}</span>
                </button>
              `,
            )
            .join("")}
        </div>
      </section>
      <aside class="inbox-kpi">
        <h3>${uiIcon("engagement")} Центр развития</h3>
        <p>Здесь собраны действия, которые помогают не просто пройти кейс, а разобраться в управленческой логике решения.</p>
        <div class="learning-actions">
          <button type="button" data-action="theory">${uiIcon("map")} Открыть теорию</button>
          <button type="button" data-action="teamRoom">${uiIcon("team")} Комната команды</button>
          <button type="button" data-action="learningEvent">${uiIcon("engagement")} Записаться на практикум</button>
        </div>
        <article class="learning-tip">
          <strong>Подсказка</strong>
          <span>Сначала откройте сообщение, затем проверьте карту конфликта и только после этого выбирайте формат реакции.</span>
        </article>
      </aside>
    </div>
  `;
}

function caseView() {
  const item = currentCase();
  updateFrame("Кейс");
  view.innerHTML = `
    <div class="messenger-layout">
      ${chatSidebar("case")}
      <section class="chat-window">
        <header class="chat-header">
          ${avatarMarkup(item.participants)}
          <div><strong>${item.title}</strong><span>${item.theme}</span></div>
        </header>
        <div class="chat-thread">
          <article class="message incoming">
            <strong>${item.title}</strong>
            <p>${item.subject}</p>
          </article>
          <article class="message system-message">
            <strong>Факты по ситуации</strong>
            <ul>${item.facts.map((fact) => `<li>${fact}</li>`).join("")}</ul>
          </article>
          ${teamSpotlightHTML()}
        </div>
        <footer class="composer">
          <span>Перед действием нужно заполнить карту конфликта</span>
          <button type="button" data-action="map">Открыть карту</button>
        </footer>
      </section>
    </div>
  `;
}

function currentMapVisibleCount() {
  return mapStageCounts[state.mapStage] || mapStageCounts[0];
}

function currentMapStartIndex() {
  return state.mapStage === 0 ? 0 : mapStageCounts[state.mapStage - 1];
}

function mapQuestionTitle(index) {
  const [sideOne, sideTwo] = mapSideLabels[state.currentCaseId] || ["первой стороны", "второй стороны"];
  const titles = [
    "Стороны конфликта",
    "Причина конфликта",
    `Интересы ${sideOne}`,
    `Интересы ${sideTwo}`,
    `Опасения ${sideOne}`,
    `Опасения ${sideTwo}`,
  ];
  return titles[index] || "Элемент карты";
}

function mapProgressText() {
  const labels = ["Сначала определите стороны конфликта", "Теперь найдите причину конфликта", "Теперь разберите интересы сторон", "Теперь зафиксируйте опасения сторон"];
  return labels[state.mapStage] || labels[0];
}

function mapView() {
  const questions = state.data.maps[String(state.currentCaseId)] || [];
  const visibleCount = currentMapVisibleCount();
  const currentStart = currentMapStartIndex();
  const visibleQuestions = questions.slice(0, visibleCount);
  const showAnswerKey = (state.mapStageErrors[state.mapStage] || 0) >= 2;
  updateFrame("Карта конфликта");
  view.innerHTML = `
    <div class="messenger-layout">
      ${chatSidebar("map")}
      <section class="chat-window">
        <header class="chat-header">
          <span class="mail-badge">${uiIcon("map")}</span>
          <div><strong>Карта конфликта</strong><span>${mapProgressText()}</span></div>
        </header>
        <div class="map-grid">
          <div class="map-progress">
            ${mapStageCounts
              .map((_, index) => `<span class="${index <= state.mapStage ? "active" : ""}"></span>`)
              .join("")}
          </div>
          ${visibleQuestions
            .map(
              (question, qi) => `
                <fieldset class="map-question ${showAnswerKey && qi >= currentStart ? "show-answer" : ""}">
                  <h3>${mapQuestionTitle(qi)}</h3>
                  <p>${question.hint || ""}</p>
                  ${question.options
                    .map(
                      (option, oi) => `
                        <label class="radio-row ${showAnswerKey && qi >= currentStart && question.correct === oi + 1 ? "correct-answer" : ""}">
                          <input type="radio" name="q${qi}" value="${oi + 1}" ${state.mapAnswers[qi] === oi + 1 ? "checked" : ""} />
                          ${oi + 1}. ${option}
                        </label>
                      `,
                    )
                    .join("")}
                </fieldset>
              `,
            )
            .join("")}
        </div>
        ${
          showAnswerKey
            ? `
              <article class="map-answer-guide">
                <strong>Подсказка к текущему шагу</strong>
                <p>Сейчас подсвечены только правильные варианты в текущем блоке карты. Завершите этот шаг верно, и только после этого откроется следующий слой разбора.</p>
              </article>
            `
            : ""
        }
        ${teamSpotlightHTML()}
        <footer class="composer">
          <button type="button" data-action="mapTheory">Изучить теорию</button>
          <button type="button" data-action="checkMap">${visibleCount >= questions.length ? "Подтвердить карту" : "Продолжить"}</button>
        </footer>
      </section>
    </div>
  `;
}

function formatView() {
  updateFrame("Выбор способа");
  const formats = [
    {
      name: "Письмо",
      image: "assets/format/email.png",
      description: "Отправить письменное сообщение в рабочем контуре.",
      hint: "Подходит, когда нужно зафиксировать договорённость, правила или общий контекст без эмоционального давления.",
    },
    {
      name: "1-на-1",
      image: "assets/format/one-to-one.png",
      description: "Провести личный разговор с участником конфликта.",
      hint: "Полезно, когда важно услышать позицию человека, снизить защиту и безопасно обсудить напряжение.",
    },
    {
      name: "Асинхрон",
      image: "assets/format/async.png",
      description: "Действовать через чат, базу знаний, видео или комментарий.",
      hint: "Уместен, когда нужно масштабировать знание, оставить след в процессе или не собирать всех одновременно.",
    },
  ];
  view.innerHTML = `
    <div class="messenger-layout">
      ${chatSidebar("format")}
      <section class="chat-window">
        <header class="chat-header">
          <span class="mail-badge">${uiIcon("settings")}</span>
          <div><strong>Выбор способа взаимодействия</strong><span>Как лучше начать работу с ситуацией</span></div>
        </header>
        <div class="format-grid">
          ${formats
            .map(
              (format) => `
                <button class="option-card channel-card" type="button" data-format="${format.name}">
                  <span class="channel-image"><img src="${format.image}" alt="" /></span>
                  <span class="channel-copy">
                    <strong>${format.name}</strong>
                    <span>${format.description}</span>
                    <small>${format.hint}</small>
                  </span>
                  <span class="channel-choose">выбрать</span>
                </button>
              `,
            )
            .join("")}
        </div>
        ${teamSpotlightHTML()}
      </section>
    </div>
  `;
}

function communicationView() {
  updateFrame("Форма коммуникации");
  const options = branchesFor(state.currentCaseId, state.selectedFormat);
  view.innerHTML = `
    <div class="messenger-layout">
      ${chatSidebar("communication")}
      <section class="chat-window">
        <header class="chat-header">
          ${playerAvatarMarkup()}
          <div><strong>${state.selectedFormat}: выберите текст</strong><span>Оцените, какой ответ поможет команде</span></div>
        </header>
        <div class="branch-grid draft-list">
          ${options
            .map(
              (option, index) => `
                <button class="option-card draft-card" type="button" data-branch="${index}">
                  <strong>Ответ ${index + 1}</strong>
                  <span>${option.text}</span>
                </button>
              `,
            )
            .join("")}
        </div>
        ${teamSpotlightHTML()}
      </section>
    </div>
  `;
}

function mapFeedbackView() {
  const item = currentCase();
  const questions = state.data.maps[String(state.currentCaseId)] || [];
  const correct = (index) => questions[index]?.options?.[(questions[index]?.correct || 1) - 1] || "";
  const [sideOne, sideTwo] = mapSideLabels[state.currentCaseId] || ["первой стороны", "второй стороны"];
  updateFrame("Карта заполнена");
  view.innerHTML = `
    <div class="messenger-layout">
      ${chatSidebar("map")}
      <section class="chat-window">
        <header class="chat-header">
          <span class="mail-badge">${uiIcon("map")}</span>
          <div><strong>Карта конфликта заполнена верно</strong><span>Почему такой разбор помогает выбрать действие</span></div>
        </header>
        <div class="chat-thread">
          <article class="message incoming map-success">
            <strong>Почему это верно</strong>
            <p>Вы не свели ситуацию к одной резкой реплике или личной претензии. В карте зафиксированы стороны: <b>${correct(0)}</b>. Это важно, потому что управленческое решение должно учитывать всех, чьи интересы уже затронуты.</p>
          </article>
          <article class="message incoming map-success">
            <strong>Что вы увидели в причине</strong>
            <p>Причина определена как <b>${correct(1)}</b>. Значит, дальше нужно работать не только с симптомами, а с механизмом, который поддерживает напряжение.</p>
          </article>
          <article class="message incoming map-success">
            <strong>Как это поможет дальше</strong>
            <p>Вы отделили интересы ${sideOne}: <b>${correct(2)}</b>, интересы ${sideTwo}: <b>${correct(3)}</b>, а затем увидели их опасения. Поэтому следующий выбор формата будет опираться на реальные мотивы людей, а не на первое впечатление.</p>
          </article>
          ${teamSpotlightHTML()}
        </div>
        <footer class="composer">
          <span>${item.title}</span>
          <button type="button" data-action="format">Выбрать способ взаимодействия</button>
        </footer>
      </section>
    </div>
  `;
}

const teamMetricMeta = {
  engagement: { label: "Вовлечённость", risk: false },
  load: { label: "Нагрузка", risk: true },
  tension: { label: "Напряжение", risk: true },
};

const teamMetricIcons = {
  engagement: "engagement",
  load: "load",
  tension: "tension",
};

function teamMetricRows(stats) {
  return Object.entries(teamMetricMeta)
    .map(([key, meta]) => {
      const value = stats[key];
      return `
        <div class="team-stat ${meta.risk ? "risk" : ""}">
          <span>${uiIcon(teamMetricIcons[key], "metric-icon")}${meta.label}</span>
          <b>${value}</b>
          <div class="bar"><span style="width:${value}%"></span></div>
        </div>
      `;
    })
    .join("");
}

function memberEmotion(stats) {
  if (stats.tension >= 65) {
    return {
      tone: "tense",
      label: "Высокое напряжение",
      state: "Я сейчас насторожен и быстрее считываю давление. Если со мной говорить формально или жёстко, я скорее уйду в защиту, чем честно назову причину напряжения.",
    };
  }
  if (stats.load >= 75) {
    return {
      tone: "overload",
      label: "Перегруз",
      state: "Я держусь, но ресурса на дополнительные задачи почти нет. Если нагрузка ещё вырастет, я начну экономить силы и помогать только там, где это напрямую входит в мои обязанности.",
    };
  }
  if (stats.engagement >= 74 && stats.tension <= 42) {
    return {
      tone: "stable",
      label: "Вовлечён",
      state: "Я готов включаться, если вижу уважение к своему вкладу и понятные правила. Тогда я не просто выполняю задачу, а помогаю удерживать общий результат команды.",
    };
  }
  if (stats.engagement < 58) {
    return {
      tone: "low",
      label: "Демотивация",
      state: "Я сомневаюсь, что мою позицию услышат, поэтому осторожнее беру инициативу. Мне нужен не общий призыв, а конкретный сигнал, что ситуация действительно изменится.",
    };
  }
  return {
    tone: "mixed",
    label: "Осторожная готовность",
    state: "Я наблюдаю за решениями руководителя и жду, станет ли процесс безопаснее. Готов попробовать, но мне важно увидеть следующий шаг, а не только правильные слова.",
  };
}

function nextCaseForMember(memberName) {
  return state.data.cases
    .filter((item) => item.id >= state.currentCaseId)
    .find((item) => namesInCase(item).includes(memberName));
}

function memberSpeech(member, stats, emotion) {
  const current = currentCase();
  const currentNames = namesInCase(current);
  const isInCurrent = currentNames.includes(member.name);
  const upcoming = nextCaseForMember(member.name);
  const phase = state.screen;
  const baseByName = {
    Денис: {
      default: "Я смотрю на то, кто реально держит результат, и насколько справедливо распределяется нагрузка.",
      map: "Когда руководитель разбирает карту конфликта, мне важно, чтобы он увидел не только спор Марины и Олега, но и то, как нагрузка расползается по смене.",
      format: "Перед выбором формата я жду, что разговор не превратится в поиск крайнего. Мне важно, чтобы решение не наказало тех, кто молча подхватывает работу.",
      communication: "Если руководитель выбирает текст ответа, я слушаю, появится ли там справедливое распределение ответственности, а не просто просьба всем потерпеть.",
      result: "После решения я оцениваю, стало ли понятнее, кто и как держит SLA, чтобы результат не опирался на одного-двух людей.",
    },
    Марина: {
      default: "Мне важно, чтобы за вопрос не приходилось платить статусом или ощущением, что я кого-то подвела.",
      map: "На карте конфликта для меня важно, чтобы руководитель отделил мой запрос о помощи от обвинения Олега. Мне нужна безопасная система поддержки, а не ярлык эмоциональности.",
      format: "Когда выбирается формат разговора, я жду сигнала, что мой голос не потеряется и вопрос не сведут к личной претензии.",
      communication: "В тексте ответа я ищу признание: задавать вопросы нормально, а поддержка коллег должна быть понятной, без сарказма и стыда.",
      result: "После решения я чувствую, стало ли безопаснее просить помощь и говорить о проблемах публично.",
    },
    Олег: {
      default: "Я готов отвечать за качество, но не хочу, чтобы помощь коллегам стала бесконечной невидимой обязанностью.",
      map: "Когда руководитель разбирает карту конфликта, мне важно, чтобы он увидел мой интерес: я защищаю качество и статус эксперта, а не просто отказываюсь помогать.",
      format: "Перед выбором формата я внутренне напрягаюсь: если меня будут публично править, я закроюсь; если поговорят предметно, я смогу объяснить, где именно перегруз.",
      communication: "Когда проходит встреча или выбирается ответ, мне нужен разговор о правилах поддержки, а не обвинение в грубости. Тогда я могу признать проблему и договориться о границах.",
      result: "После решения я смотрю, стало ли понятно, как помогать коллегам без потери качества и без ощущения, что на меня просто переложили наставничество.",
    },
    Светлана: {
      default: "Я включаюсь лучше, когда правила качества понятны и не превращаются в давление на людей.",
      map: "На карте конфликта я обращаю внимание, видит ли руководитель связь между стандартами качества и безопасностью вопросов в команде.",
      format: "Когда выбирается формат, мне важно, чтобы решение не размывало стандарты и не делало людей виноватыми за сам факт ошибки.",
      communication: "В ответе руководителя я жду ясности: как поддерживать качество без давления на новичков и без публичного стыда.",
      result: "После решения я понимаю, можно ли удерживать качество спокойнее, через процесс, а не через напряжение.",
    },
    Антон: {
      default: "Мне важно, чтобы решение не добавляло лишней бюрократии и реально упрощало работу смены.",
      map: "Когда руководитель строит карту, я смотрю, не станет ли решение очередной схемой ради схемы. Нужен простой процесс, который реально помогает.",
      format: "На выборе формата мне важно, чтобы действие было быстрым и применимым, а не красивым управленческим ритуалом.",
      communication: "В тексте ответа я ищу конкретику: что меняется завтра, где лежат материалы и кто за что отвечает.",
      result: "После решения я оцениваю, стало ли проще работать или команда получила ещё один слой формальностей.",
    },
    Юлия: {
      default: "Я быстро чувствую несправедливость в команде и смотрю, становится ли людям безопаснее говорить вслух.",
      map: "На карте конфликта мне важно, чтобы руководитель заметил страх команды задавать вопросы. Это не мелочь, а сигнал о безопасности.",
      format: "Когда выбирается формат, я думаю о том, услышат ли тех, кто обычно молчит, или разговор снова останется между самыми громкими.",
      communication: "В ответе руководителя я жду уважительного тона. Если там есть давление, люди просто уйдут в личные сообщения и скрытые договорённости.",
      result: "После решения я смотрю, стало ли в команде честнее и спокойнее говорить о сложностях.",
    },
  };
  const phrase = baseByName[member.name]?.[phase] || baseByName[member.name]?.default || "";
  const caseLine = isInCurrent
    ? `Сейчас этот кейс напрямую задевает мою роль: «${current.theme}».`
    : upcoming
      ? `Я пока наблюдаю, но впереди есть ситуация, которая может затронуть меня: «${upcoming.theme}».`
      : "Сейчас я не в центре кейса, но решения руководителя всё равно задают правила для всей команды.";

  return `${caseLine} ${phrase} ${emotion.state}`;
}

function teamSpotlightHTML() {
  if (!state.openMember) return "";
  const member = teamMembers().find((item) => item.name === state.openMember);
  if (!member) return "";
  const stats = state.teamStats[member.name] || { engagement: member.engagement, load: member.load, tension: member.tension };
  const emotion = memberEmotion(stats);
  return `
    <article class="team-spotlight ${emotion.tone}">
      <div class="team-spotlight-portrait">
        ${avatarMarkup(member.name)}
      </div>
      <div class="team-spotlight-body">
        <header>
          <div>
            <strong>${member.name}</strong>
            <span>${member.role}</span>
          </div>
          <b>${emotion.label}</b>
        </header>
        <p>${memberSpeech(member, stats, emotion)}</p>
      </div>
    </article>
  `;
}

function teamRoomView() {
  updateFrame("Команда");
  const members = teamMembers();
  view.innerHTML = `
    <div class="messenger-layout">
      ${chatSidebar("team")}
      <section class="chat-window">
        <header class="chat-header">
          <span class="mail-badge">${uiIcon("team")}</span>
          <div><strong>Комната команды</strong><span>Личные показатели меняются после управленческих решений</span></div>
        </header>
        <div class="team-room-grid">
          ${members
            .map((member) => {
              const stats = state.teamStats[member.name] || { engagement: member.engagement, load: member.load, tension: member.tension };
              return `
                <article class="team-room-card">
                  <header>
                    ${avatarMarkup(member.name)}
                    <div>
                      <strong>${member.name}</strong>
                      <span>${member.type}</span>
                    </div>
                  </header>
                  <p>${member.description}</p>
                  <div class="team-stats">${teamMetricRows(stats)}</div>
                </article>
              `;
            })
            .join("")}
        </div>
        <footer class="composer">
          <span>Показатели отражают состояние команды после ваших решений</span>
          <button type="button" data-action="inbox">Вернуться к почте</button>
        </footer>
      </section>
    </div>
  `;
}

function namesInCase(item) {
  const text = `${item?.participants || ""} ${item?.title || ""} ${item?.subject || ""}`;
  return teamMembers()
    .filter((member) => text.includes(member.name))
    .map((member) => member.name);
}

function applyTeamImpact(branch) {
  const caseItem = state.data.cases.find((item) => item.id === branch.caseId) || currentCase();
  const affected = new Set(namesInCase(caseItem));
  const score = branch.score || 0;
  const delta = branch.delta || {};
  const trustShift = Math.round((delta.trust || 0) / 3);
  const conflictShift = Math.round((delta.hiddenConflict || 0) / 2);
  const turnoverShift = Math.round((delta.turnover || 0) / 2);
  const loadShift = Math.round(-((delta.sla || 0) + (delta.quality || 0)) / 4);

  teamMembers().forEach((member) => {
    const stats = state.teamStats[member.name];
    if (!stats) return;
    const weight = affected.has(member.name) ? 1 : 0.35;
    const scoreShift = (score - 3) * weight;
    stats.engagement = clamp(Math.round(stats.engagement + trustShift * weight - turnoverShift * weight + scoreShift));
    stats.load = clamp(Math.round(stats.load + loadShift * weight + Math.max(0, -scoreShift)));
    stats.tension = clamp(Math.round(stats.tension + conflictShift * weight + turnoverShift * weight - scoreShift));
  });
}

function applyBranch(branch) {
  state.selectedBranch = branch;
  Object.entries(branch.delta).forEach(([key, value]) => {
    state.metrics[key] = clamp(state.metrics[key] + value);
  });
  applyTeamImpact(branch);
  state.decisionHistory.push({
    caseId: branch.caseId,
    format: branch.format,
    text: branch.text,
    score: branch.score || 0,
    delta: { ...branch.delta },
    strategy: kilmannStrategy(branch).name,
  });
  if ((branch.score || 0) < 5) state.formErrors += 1;
  if (String(branch.nextCase).startsWith("Финал")) state.finalOutcome = branch.nextCase;
  push("result");
}

function kilmannStrategy(branch) {
  const text = branch.text || "";
  const score = branch.score || 0;
  if (score >= 5) {
    return {
      name: "Сотрудничество",
      tone: "effective",
      description: "Вы одновременно признали интересы сильного сотрудника и потребность команды в безопасной поддержке. Это самая продуктивная стратегия, когда нужно убрать корень конфликта, а не просто погасить симптом.",
    };
  }
  if (score === 4) {
    return {
      name: "Компромисс",
      tone: "neutral",
      description: "Вы выбрали рабочее промежуточное решение. Оно снижает остроту и помогает двигаться дальше, но не полностью решает вопрос ответственности, нагрузки и устойчивого процесса.",
    };
  }
  if (score === 3 || text.includes("посмотрим") || text.includes("вернёмся")) {
    return {
      name: "Избегание",
      tone: "risky",
      description: "Вы отложили прямое вмешательство. Это может временно снизить давление, но команда не получает понятного правила, а скрытое напряжение продолжает жить в обходных каналах.",
    };
  }
  if (score <= 1 || text.includes("Ожидаю") || text.includes("неприемлем")) {
    return {
      name: "Соперничество",
      tone: "risky",
      description: "Вы сделали ставку на давление и контроль. Такая стратегия может казаться быстрой, но в конфликте вокруг статуса и признания она часто усиливает оборону, саботаж и недоверие.",
    };
  }
  return {
    name: "Приспособление",
    tone: "risky",
    description: "Вы сгладили конфликт общими словами и не назвали адресно корневую проблему. Это снижает ясность: сотрудники видят, что напряжение заметили, но не понимают, что именно изменится.",
  };
}

function metricExplanation(key, value, branch, strategy) {
  const formatPart = `Формат «${branch.format}»`;
  const sign = value > 0 ? "изменилась на +" : value < 0 ? "изменилась на -" : "не изменилась";
  const abs = Math.abs(value);
  const byKey = {
    trust: value > 0
      ? `${formatPart} повысил доверие, потому что в ответе есть признание интересов сторон и попытка сделать обсуждение безопасным.`
      : `${formatPart} снизил доверие, потому что команда считывает в ответе давление, формальность или уход от конкретной проблемы.`,
    sla: value > 0
      ? `${formatPart} помогает SLA: решение делает дальнейшие действия более предсказуемыми и сокращает зависание вопросов.`
      : `${formatPart} бьёт по SLA: проблема передачи знаний остаётся неуправляемой, поэтому вопросы продолжают тормозить работу.`,
    quality: value > 0
      ? `Качество растёт, потому что выбранное действие поддерживает более понятную эскалацию и меньше ошибок в спорных кейсах.`
      : `Качество падает, потому что люди по-прежнему могут избегать вопросов или решать спорные кейсы без нормальной поддержки.`,
    turnover: value > 0
      ? `Риск текучести вырос: стратегия «${strategy.name}» усиливает усталость, несправедливость или ощущение небезопасности.`
      : `Риск текучести снизился: стратегия «${strategy.name}» уменьшает давление на людей и показывает, что вклад команды будет учтён.`,
    hiddenConflict: value > 0
      ? `Скрытый конфликт вырос: напряжение не проговорено безопасно или решение воспринимается как формальное.`
      : `Скрытый конфликт снизился: выбранное действие выводит проблему из кулуаров в понятный рабочий процесс.`,
  };
  if (value === 0) return `Метрика «${state.data.metrics[key].label}» не изменилась: выбранное действие почти не затронуло этот фактор.`;
  return `Метрика «${state.data.metrics[key].label}» ${sign}${abs}: ${byKey[key]}`;
}

function resultAnalysisHTML(branch, strategy) {
  return `
    <article class="message incoming result-analysis ${strategy.tone}">
      <strong>Стратегия Томаса-Килмана: ${strategy.name}</strong>
      <p>${strategy.description}</p>
      <p>Выбранный формат: <b>${branch.format}</b>. Качество решения: <b>${branch.score || 0}/5</b>.</p>
    </article>
    <article class="message incoming result-analysis">
      <strong>Почему изменились метрики</strong>
      <ul>
        ${Object.entries(branch.delta)
          .map(([key, value]) => `<li>${metricExplanation(key, value, branch, strategy)}</li>`)
          .join("")}
      </ul>
    </article>
  `;
}

function employeeReaction(branch, strategy) {
  const caseItem = state.data.cases.find((item) => item.id === branch.caseId) || currentCase();
  const names = namesInCase(caseItem);
  const caseText = `${caseItem?.title || ""} ${caseItem?.subject || ""} ${caseItem?.participants || ""} ${caseItem?.text || ""}`;
  const primaryName = names
    .slice()
    .sort((a, b) => caseText.indexOf(a) - caseText.indexOf(b))[0] || "Марина";
  const member = teamMembers().find((item) => item.name === primaryName) || teamMembers()[0];
  const stats = state.teamStats[member.name] || member;
  const score = branch.score || 0;
  const delta = branch.delta || {};
  const trust = delta.trust || 0;
  const conflict = delta.hiddenConflict || 0;
  const turnover = delta.turnover || 0;
  const positive = score >= 4 && trust >= 0 && conflict <= 0;
  const tense = score <= 2 || trust < 0 || conflict > 5 || turnover > 4;
  const quote = positive
    ? `После такого решения я понимаю, что руководитель услышал не только результат, но и напряжение вокруг него. Готов включаться спокойнее: есть шанс договориться о правилах без взаимных уколов и без ощущения, что помощь коллегам просто навесили сверху.`
    : tense
      ? `Честно, после этого решения я скорее насторожен. Цифры могут двигаться, но внутри остаётся вопрос: меня услышали или просто хотят быстро закрыть тему? Мотивация падает, потому что непонятно, безопасно ли теперь говорить о реальной причине напряжения.`
      : `Решение немного стабилизирует ситуацию, но у меня всё ещё есть сомнения. Я готов попробовать, если дальше появятся понятные правила и руководитель не оставит это на уровне разового сообщения.`;
  const motivation = positive
    ? "Мотивация растёт: сотрудник видит признание вклада и понятный следующий шаг."
    : tense
      ? "Мотивация падает: сотрудник считывает давление, формальность или недостаток безопасности."
      : "Мотивация смешанная: сотрудник готов дать шанс решению, но ждёт продолжения.";

  return {
    member,
    stats,
    tone: positive ? "positive" : tense ? "tense" : "mixed",
    quote,
    motivation,
    state: positive ? "Вовлечённость выше" : tense ? "Настороженность выше" : "Осторожная готовность",
    strategy: strategy.name,
  };
}

function employeeReactionHTML(branch, strategy) {
  const reaction = employeeReaction(branch, strategy);
  return `
    <article class="message incoming employee-reaction ${reaction.tone}">
      <div class="employee-reaction-head">
        ${avatarMarkup(reaction.member.name)}
        <div>
          <strong>${reaction.member.name}</strong>
          <span>${reaction.member.role}</span>
        </div>
        <b>${reaction.state}</b>
      </div>
      <p>${reaction.quote}</p>
      <div class="employee-reaction-footer">
        <span>${reaction.motivation}</span>
        <span>Текущие показатели: вовлечённость ${reaction.stats.engagement}, нагрузка ${reaction.stats.load}, напряжение ${reaction.stats.tension}</span>
      </div>
    </article>
  `;
}

function resultView() {
  updateFrame("Результат");
  const branch = state.selectedBranch;
  const strategy = kilmannStrategy(branch);
  const deltas = Object.entries(branch.delta)
    .map(([key, value]) => {
      const risk = riskMetrics.has(key);
      const good = risk ? value < 0 : value > 0;
      return `<div class="delta ${good ? "good" : value === 0 ? "" : "bad"}">${uiIcon(metricIcons[key], "metric-icon")}<span>${state.data.metrics[key].label}</span><b>${value > 0 ? "+" : ""}${value}</b></div>`;
    })
    .join("");
  const nrt = checkNoReturn();
  const nextIsFinal = Boolean(nrt) || String(branch.nextCase).startsWith("Финал");
  view.innerHTML = `
    <div class="messenger-layout">
      ${chatSidebar("result")}
      <section class="chat-window">
        <header class="chat-header">
          <span class="mail-badge">${uiIcon("result")}</span>
          <div><strong>Результат решения</strong><span>Команда отреагировала на выбранное действие</span></div>
        </header>
        <div class="chat-thread">
          <article class="message system-message">
            <strong>Обратная связь</strong>
            <p>${branch.feedback || "Система показывает последствия выбранного действия."}</p>
          </article>
          ${teamSpotlightHTML()}
          <article class="message incoming">
            <strong>Изменение состояния команды</strong>
            <p class="result-strategy-line">Стратегия Томаса-Килмана: <b>${strategy.name}</b>. Качество решения: <b>${branch.score || 0}/5</b>.</p>
            <div class="delta-list">${deltas}</div>
            ${nrt ? `<p><strong>Симуляция остановлена:</strong> ${nrt.toLowerCase()}.</p>` : ""}
          </article>
          ${employeeReactionHTML(branch, strategy)}
          ${resultAnalysisHTML(branch, strategy)}
        </div>
        <footer class="composer">
          <button type="button" data-action="theory">Изучить материал</button>
          <button type="button" data-action="${nextIsFinal ? "final" : "nextCase"}">${nextIsFinal ? "Показать финал" : "Следующий кейс"}</button>
        </footer>
      </section>
    </div>
  `;
}

function finalView() {
  updateFrame("Финал");
  view.style.setProperty("--screen-bg", "none");
  const outcome = finalOutcome();
  const profile = developmentProfile();
  view.innerHTML = `
    <div class="messenger-layout">
      ${chatSidebar("result")}
      <section class="chat-window">
        <header class="chat-header">
          ${playerAvatarMarkup()}
          <div><strong>Финальный отчет</strong><span>${outcome.title}</span></div>
        </header>
        <div class="chat-thread">
          <article class="message system-message">
            <strong>${outcome.title}</strong>
            <p>${outcome.text}</p>
          </article>
          <article class="message incoming final-ipr-message">
            <strong>ИПР на 4 недели</strong>
            <div class="ipr-steps">
              ${profile.plan
                .map(
                  (item, index) => `
                    <section>
                      <span>Неделя ${index + 1}</span>
                      <h3>${item.title}</h3>
                      <p>${item.action}</p>
                    </section>
                  `,
                )
                .join("")}
            </div>
          </article>
          <article class="message incoming final-profile-message">
            <strong>Индивидуальный профиль руководителя</strong>
            <p>${profile.summary}</p>
            <div class="final-profile-grid">
              <section>
                <h3>Сильные стороны</h3>
                <ul>${profile.strengths.map((item) => `<li><b>${item.title}.</b> ${item.reason}</li>`).join("")}</ul>
              </section>
              <section>
                <h3>Зоны роста</h3>
                <ul>${profile.growth.map((item) => `<li><b>${item.title}.</b> ${item.reason}</li>`).join("")}</ul>
              </section>
            </div>
          </article>
          <article class="message incoming final-evidence-message">
            <details>
              <summary>Итоговые показатели</summary>
              <div class="final-metrics">${metricStackHTML()}</div>
            </details>
          </article>
        </div>
        <footer class="composer">
          <span>Симуляция завершена</span>
          <button type="button" data-action="restart">Начать заново</button>
        </footer>
      </section>
    </div>
  `;
}

function finalOutcome() {
  const outcome = state.finalOutcome || leaderType();
  if (outcome.includes("A")) {
    return {
      title: "Финал A — восстановление команды",
      text: "Вы удержали баланс между операционным результатом, доверием и системной работой с конфликтом. Команда видит, что напряжение можно обсуждать безопасно, а решения не сводятся к наказанию или формальному контролю.",
    };
  }
  if (outcome.includes("B")) {
    return {
      title: "Финал B — частичная стабилизация",
      text: "Команда продолжает работать устойчиво, но часть причин конфликта осталась под поверхностью. Показатели не обрушились, однако доверие и качество взаимодействия требуют регулярного сопровождения.",
    };
  }
  if (outcome.includes("C")) {
    return {
      title: "Финал C — затяжной спад",
      text: "Решения сдержали открытый кризис, но не восстановили командную среду. Скрытое напряжение, осторожность в коммуникации и усталость сильных сотрудников будут постепенно снижать качество работы.",
    };
  }
  if (outcome.includes("D")) {
    return {
      title: "Финал D — эскалация кризиса",
      text: "Команда вошла в зону управленческого риска: доверие снижено, напряжение стало системным, а отдельные решения усилили ощущение небезопасности. Нужен план восстановления, а не точечная реакция.",
    };
  }
  return {
    title: leaderType(),
    text: finalText(),
  };
}

function leaderType() {
  if (state.metrics.trust >= 60 && state.metrics.sla >= 75 && state.metrics.hiddenConflict <= 35) return "Гибкий наставник";
  if (state.metrics.turnover >= 75 || state.metrics.trust <= 30) return "Кризисный руководитель";
  return "Компромиссный руководитель";
}

function checkNoReturn() {
  const m = state.metrics;
  if (m.trust <= 25 && m.sla <= 60 && m.quality <= 70) return "Комбинированный коллапс";
  if (m.turnover >= 75) return "Потеря команды";
  if (m.trust <= 25) return "Разрушение доверия";
  if (m.hiddenConflict >= 80) return "Скрытая эскалация";
  if (m.quality <= 70) return "Кризис качества";
  if (m.sla <= 60) return "Операционный провал";
  return "";
}

function finalText() {
  if (leaderType() === "Гибкий наставник") {
    return "Вы удерживаете баланс между результатом, доверием и системной работой с конфликтом.";
  }
  if (leaderType() === "Кризисный руководитель") {
    return "Накопленные решения привели команду к зоне высокого риска. Нужна работа с картой конфликта и формой коммуникации.";
  }
  return "Вы находите рабочие промежуточные решения, но часть причин конфликта остается не устраненной.";
}

function developmentPlan() {
  return developmentProfile().plan.map((item) => item.action);
}

function decisionRecords() {
  if (state.decisionHistory.length) return state.decisionHistory;
  if (!state.selectedBranch) return [];
  return [
    {
      caseId: state.selectedBranch.caseId,
      format: state.selectedBranch.format,
      text: state.selectedBranch.text,
      score: state.selectedBranch.score || 0,
      delta: { ...state.selectedBranch.delta },
      strategy: kilmannStrategy(state.selectedBranch).name,
    },
  ];
}

function averageDecisionScore(records) {
  if (!records.length) return 0;
  return records.reduce((sum, item) => sum + (item.score || 0), 0) / records.length;
}

function countBy(items, getter) {
  return items.reduce((acc, item) => {
    const key = getter(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function developmentProfile() {
  const records = decisionRecords();
  const avgScore = averageDecisionScore(records);
  const strategyCounts = countBy(records, (item) => item.strategy || "Не определено");
  const collaborationCount = strategyCounts["Сотрудничество"] || 0;
  const pressureCount = (strategyCounts["Соперничество"] || 0) + (strategyCounts["Избегание"] || 0);
  const dominantStrategy = Object.entries(strategyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "смешанная стратегия";
  const casesPassed = records.length || 1;
  const competencies = [
    {
      title: "Диагностика конфликта",
      value: clamp(86 - state.mapErrors * 14),
      reason: state.mapErrors
        ? "На карте конфликта были ошибки, значит перед выбором действия стоит точнее отделять участников, причины, интересы и опасения."
        : "Карта конфликта разобрана уверенно: вы не свели ситуацию к личной ссоре и увидели рабочую структуру проблемы.",
      action: "Перед каждым сложным разговором заполнять мини-карту: стороны, рабочая причина, интересы, опасения. Проверять себя вопросом: «что здесь является симптомом, а что корнем?»",
    },
    {
      title: "Выбор стратегии Томаса-Килмана",
      value: clamp(Math.round(avgScore * 18 + collaborationCount * 4 - pressureCount * 6)),
      reason:
        collaborationCount >= Math.ceil(casesPassed / 2)
          ? "Вы часто выбирали сотрудничество: искали решение, где учитываются и результат, и интересы людей."
          : `Чаще проявлялась стратегия «${dominantStrategy}»: она может стабилизировать ситуацию, но не всегда убирает источник напряжения.`,
      action: "Разобрать 3 своих решения через матрицу Томаса-Килмана: где было сотрудничество, где компромисс, где давление или избегание. Для каждого кейса переписать ответ в формате сотрудничества.",
    },
    {
      title: "Безопасная коммуникация",
      value: clamp(Math.round(state.metrics.trust - Math.max(0, state.metrics.hiddenConflict - 35) / 2 - pressureCount * 6 + 18)),
      reason:
        state.metrics.trust >= 60 && state.metrics.hiddenConflict <= 40
          ? "Команда получает сигнал, что конфликт можно обсуждать без наказания и обесценивания."
          : "Есть риск, что часть напряжения остаётся в личных переписках и молчании, даже если формально решение принято.",
      action: "Потренировать структуру безопасного сообщения: факт без оценки, признание интересов сторон, рабочее правило, следующий шаг и точка проверки результата.",
    },
    {
      title: "Операционное удержание",
      value: clamp(Math.round((state.metrics.sla + state.metrics.quality) / 2)),
      reason:
        state.metrics.sla >= 75 && state.metrics.quality >= 80
          ? "Вы удерживаете фокус на SLA и качестве, не превращая конфликт только в разговор об эмоциях."
          : "Решения пока недостаточно защищают скорость и качество работы: процесс поддержки и эскалации требует закрепления.",
      action: "Собрать короткий рабочий стандарт: когда сотрудник задаёт вопрос, кто отвечает, за какое время, где фиксируется решение и как оно попадает в базу знаний.",
    },
    {
      title: "Устойчивость команды",
      value: clamp(Math.round(100 - (state.metrics.turnover + state.metrics.hiddenConflict) / 2)),
      reason:
        state.metrics.turnover <= 35 && state.metrics.hiddenConflict <= 40
          ? "Риск потери людей и скрытого сопротивления находится под контролем."
          : "Нагрузка, скрытый конфликт или ощущение несправедливости могут накапливаться и позже ударить по удержанию людей.",
      action: "Провести короткие индивидуальные чек-ины с ключевыми участниками: что перегружает, где нужна ясность, какой вклад не виден, какой один процесс нужно изменить первым.",
    },
  ].sort((a, b) => b.value - a.value);

  const strengths = competencies.slice(0, 2);
  const growth = competencies.slice(-2).reverse();
  const plan = [
    growth[0],
    growth[1],
    strengths[0],
    {
      title: "Закрепить новый управленческий ритуал",
      action: "Провести повторный разбор одного свежего конфликта: сначала карта, затем выбор стратегии, затем сообщение команде и проверка метрик через неделю.",
    },
  ];
  const summary = `Профиль сформирован по ${records.length || 0} решениям, ошибкам в карте конфликта и финальным KPI. Ведущая стратегия: ${dominantStrategy}. Среднее качество решений: ${avgScore ? avgScore.toFixed(1) : "0.0"}/5.`;
  return { summary, strengths, growth, plan };
}

function checkMap() {
  const questions = state.data.maps[String(state.currentCaseId)] || [];
  const visibleCount = currentMapVisibleCount();
  const currentStart = currentMapStartIndex();
  const currentQuestions = questions.slice(currentStart, visibleCount);
  const allAnswered = currentQuestions.every((_, offset) => state.mapAnswers[currentStart + offset]);
  if (!allAnswered) return;
  const hasError = currentQuestions.some((question, offset) => state.mapAnswers[currentStart + offset] !== question.correct);
  if (hasError) {
    state.mapErrors += 1;
    state.mapStageErrors[state.mapStage] = (state.mapStageErrors[state.mapStage] || 0) + 1;
    if (state.mapStageErrors[state.mapStage] >= 2) {
      render();
      return;
    }
    showMapStageTheory();
    return;
  }
  if (visibleCount < questions.length) {
    state.mapStage += 1;
    render();
    resetScrollPositions();
    return;
  }
  push("mapFeedback");
}

function theoryGroups() {
  const theories = state.data.theories || [];
  return [
    {
      title: "Конфликт",
      description: "Как читать рабочий конфликт не как ссору, а как сигнал о столкновении интересов, ролей и ожиданий.",
      icon: "warning",
      items: [0, 2, 3].filter((index) => theories[index]),
    },
    {
      title: "Карта конфликта",
      description: "Как разложить ситуацию на участников, проблему, интересы и опасения перед выбором действия.",
      icon: "map",
      items: [1, 5].filter((index) => theories[index]),
    },
    {
      title: "Стратегии Томаса-Килмана",
      description: "Пять способов реагирования на конфликт и логика выбора уместной управленческой реакции.",
      icon: "settings",
      items: [4, 6, 7].filter((index) => theories[index]),
    },
  ];
}

function theoryText(index) {
  const item = state.data.theories[index] || state.data.theories[0];
  return [
    item.title,
    "",
    item.goal,
    "",
    "Что важно понять:",
    ...(item.content || []).map((line) => `- ${line}`),
    "",
    "Примеры:",
    ...(item.examples || []).map((line) => `- ${line}`),
  ].join("\n");
}

function downloadTheory(index) {
  const item = state.data.theories[index];
  if (!item) return;
  const blob = new Blob([theoryText(index)], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${item.title.toLowerCase().replace(/[^а-яa-z0-9]+/gi, "-").replace(/^-|-$/g, "")}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function mapStageTheory() {
  const currentCaseData = currentCase();
  const stages = [
    {
      title: "Карта конфликта: стороны конфликта",
      goal: "Определите, кто участвует в конфликте и чьи интересы уже затронуты последствиями ситуации.",
      important: [
        "Стороны конфликта — это не только люди, которые спорят вслух. В карту попадают все, чьи интересы, нагрузка, безопасность или результат затронуты.",
        "Если конфликт влияет на команду, руководителя или рабочий процесс, их тоже нужно учитывать в разборе.",
        "Проверочный вопрос: кто изменил своё поведение из-за ситуации, кто несёт последствия и кто должен участвовать в решении?",
      ],
      examples: [
        `В текущем кейсе «${currentCaseData.title}» важно смотреть шире первой пары участников.`,
        "Если один сотрудник отвечает резко, а другие перестают задавать вопросы или берут дополнительную нагрузку, конфликт уже затрагивает группу.",
      ],
    },
    {
      title: "Карта конфликта: причина напряжения",
      goal: "Найдите рабочую причину, которая поддерживает конфликт, а не только внешнюю резкую реплику.",
      important: [
        "Причина конфликта — это устойчивый рабочий узел: роль, нагрузка, правила помощи, качество процесса или небезопасный канал коммуникации.",
        "Формулировки вроде «он грубит» или «она эмоционально реагирует» описывают симптом, но не всегда объясняют, почему напряжение повторяется.",
        "Проверочный вопрос: что в устройстве работы нужно изменить, чтобы похожая ситуация не возникала снова?",
      ],
      examples: [
        "Если люди боятся задавать вопросы публично, причина может быть в небезопасном процессе передачи знаний.",
        "Если эксперт раздражается на повторяющиеся вопросы, причина может быть в неоформленной роли наставника и перегрузе.",
      ],
    },
    {
      title: "Карта конфликта: интересы сторон",
      goal: "Отделите позицию вслух от того, что каждая сторона пытается сохранить, получить или защитить.",
      important: [
        "Интерес — это не требование и не обвинение. Это ценность или рабочий результат, который человек защищает.",
        "За резкой позицией могут стоять качество, статус, скорость, уважение, безопасность ошибки или понятные границы ответственности.",
        "Проверочный вопрос: если убрать эмоциональную форму высказывания, какой важный для работы результат человек пытается удержать?",
      ],
      examples: [
        "Позиция: «Я не няня». Возможный интерес: сохранить качество, статус эксперта и контроль над своей нагрузкой.",
        "Позиция: «Мне не помогают». Возможный интерес: получать поддержку быстро, понятно и без обесценивания.",
      ],
    },
    {
      title: "Карта конфликта: опасения сторон",
      goal: "Поймите, чего участники боятся потерять, если ситуация будет развиваться без ясного решения.",
      important: [
        "Опасения объясняют сопротивление: человек может бояться потерять статус, получить лишнюю нагрузку, ошибиться публично или остаться без помощи.",
        "Опасения часто не называются напрямую, но именно они делают реакцию жёсткой, закрытой или пассивно-агрессивной.",
        "Проверочный вопрос: что плохого, с точки зрения каждой стороны, может случиться после вмешательства руководителя?",
      ],
      examples: [
        "Эксперт может опасаться, что помощь коллегам снизит его личный KPI и статус.",
        "Команда может опасаться, что за вопрос получит сарказм, игнорирование или публичный стыд.",
      ],
    },
  ];
  return stages[state.mapStage] || stages[0];
}

function showMapStageTheory() {
  const item = mapStageTheory();
  document.querySelector("#theoryTitle").textContent = item.title;
  document.querySelector("#theoryGoal").textContent = item.goal;
  document.querySelector("#theoryBody").innerHTML = `
    ${renderTheoryList("Что важно понять сейчас", item.important)}
    ${renderTheoryList("Как применить к кейсу", item.examples)}
  `;
  theoryDialog.showModal();
}

function showTheoryDetail(index = 0) {
  const item = state.data.theories[index] || state.data.theories[0];
  document.querySelector("#theoryTitle").textContent = item.title;
  document.querySelector("#theoryGoal").textContent = item.goal;
  document.querySelector("#theoryBody").innerHTML = `
    ${renderTheoryList("Что важно понять", item.content || [])}
    ${renderTheoryList("Примеры", item.examples || [])}
    <div class="theory-detail-actions">
      <button type="button" data-theory-library>Все материалы</button>
      <button type="button" data-theory-download="${index}">Скачать памятку</button>
    </div>
  `;
  theoryDialog.showModal();
}

function showTheory(index = null) {
  if (Number.isInteger(index)) {
    showTheoryDetail(index);
    return;
  }
  document.querySelector("#theoryTitle").textContent = "Учебный центр";
  document.querySelector("#theoryGoal").textContent = "Материалы можно открыть во время симуляции или скачать как короткие памятки для разбора.";
  document.querySelector("#theoryBody").innerHTML = `
    <div class="theory-library">
      ${theoryGroups()
        .map(
          (group) => `
            <section class="theory-library-card">
              <header>
                <span class="mail-badge">${uiIcon(group.icon)}</span>
                <div>
                  <h3>${group.title}</h3>
                  <p>${group.description}</p>
                </div>
              </header>
              <div class="theory-library-list">
                ${group.items
                  .map((index) => {
                    const item = state.data.theories[index];
                    return `
                      <article>
                        <strong>${item.title}</strong>
                        <span>${item.goal}</span>
                        <div>
                          <button type="button" data-theory-open="${index}">Открыть</button>
                          <button type="button" data-theory-download="${index}">Скачать</button>
                        </div>
                      </article>
                    `;
                  })
                  .join("")}
              </div>
            </section>
          `,
        )
        .join("")}
    </div>
  `;
  theoryDialog.showModal();
}

function showMetricInfo(key) {
  const item = metricDescriptions[key];
  if (!item) return;
  const value = state.metrics[key];
  const riskNote = riskMetrics.has(key)
    ? "Для этого показателя высокий уровень означает рост риска, поэтому его важно снижать."
    : "Для этого показателя высокий уровень означает более устойчивую работу команды.";
  document.querySelector("#theoryTitle").textContent = item.title;
  document.querySelector("#theoryGoal").textContent = `${item.goal} Текущее значение: ${value}.`;
  document.querySelector("#theoryBody").innerHTML = `
    ${renderTheoryList("Что это значит", item.meaning || [])}
    ${renderTheoryList("Как читать показатель", [riskNote])}
  `;
  theoryDialog.showModal();
}

function showKpiPanel() {
  document.querySelector("#theoryTitle").textContent = "Показатели команды";
  document.querySelector("#theoryGoal").textContent = "Актуальное состояние команды после ваших решений. Каждый показатель можно открыть отдельно и посмотреть расшифровку.";
  document.querySelector("#theoryBody").innerHTML = `
    <section class="kpi-dialog-panel">
      ${metricStackHTML()}
    </section>
    ${renderTheoryList("Как пользоваться", [
      "Проверяйте KPI перед выбором формата реакции и после каждого решения.",
      "Смотрите не только на рост полезных показателей, но и на риск текучести и скрытый конфликт.",
      "Нажмите на любой показатель, чтобы увидеть, что он означает для работы лида.",
    ])}
  `;
  theoryDialog.showModal();
}

function showLearningEvent() {
  document.querySelector("#theoryTitle").textContent = "Практикум для руководителей";
  document.querySelector("#theoryGoal").textContent = "Короткое учебное мероприятие после симуляции: разбор решений, карта конфликта и тренировка управленческого ответа.";
  document.querySelector("#theoryBody").innerHTML = `
    ${renderTheoryList("Что будет на практикуме", [
      "Разбор ваших решений и того, какие стратегии Томаса-Килмана вы чаще выбираете.",
      "Тренировка карты конфликта на рабочих ситуациях из команды.",
      "Сбор формулировок для личного разговора, общего чата и письменного сообщения.",
    ])}
    ${renderTheoryList("Что получит лид", [
      "Понятный план, как снижать скрытый конфликт без потери SLA.",
      "Набор фраз для безопасной обратной связи сильным сотрудникам.",
      "Чек-лист, когда нужен личный разговор, а когда достаточно асинхронного формата.",
    ])}
  `;
  theoryDialog.showModal();
}

function goHomeScreen() {
  theoryDialog.close();
  state.route = ["intro"];
  state.screen = "intro";
  render();
  resetScrollPositions();
}

function handleUtilityAction(action) {
  if (action === "home") {
    goHomeScreen();
    return true;
  }
  if (action === "kpiPanel") {
    showKpiPanel();
    return true;
  }
  if (action === "theory") {
    showTheory();
    return true;
  }
  if (action === "mapTheory") {
    showMapStageTheory();
    return true;
  }
  if (action === "teamRoom") {
    push("teamRoom");
    return true;
  }
  if (action === "learningEvent") {
    showLearningEvent();
    return true;
  }
  return false;
}

function renderTheoryList(title, lines) {
  if (!lines || !lines.length) return "";
  return `
    <section>
      <h3>${title}</h3>
      <ul>${lines.map((line) => `<li>${line}</li>`).join("")}</ul>
    </section>
  `;
}

function nextCase() {
  const next = Number.parseInt(state.selectedBranch.nextCase, 10);
  if (!Number.isFinite(next) || next > 10) {
    push("final");
    return;
  }
  state.currentCaseId = next;
  state.selectedFormat = "";
  state.selectedBranch = null;
  state.finalOutcome = "";
  state.mapAnswers = {};
  state.mapStage = 0;
  state.mapStageErrors = {};
  push("case");
}

function restart() {
  state.route = ["start"];
  state.screen = "start";
  state.currentCaseId = 1;
  state.selectedFormat = "";
  state.selectedBranch = null;
  state.finalOutcome = "";
  state.mapAnswers = {};
  state.mapStage = 0;
  state.mapStageErrors = {};
  state.mapErrors = 0;
  state.channelErrors = 0;
  state.formErrors = 0;
  state.decisionHistory = [];
  state.player.firstName = state.player.firstName || "Алексей";
  setMetricStarts();
  setTeamStarts();
  render();
}

function render() {
  if (!state.data) return;
  if (state.screen === "start") startView();
  if (state.screen === "orientation") orientationView();
  if (state.screen === "intro") introView();
  if (state.screen === "inbox") inboxView();
  if (state.screen === "case") caseView();
  if (state.screen === "map") mapView();
  if (state.screen === "mapFeedback") mapFeedbackView();
  if (state.screen === "format") formatView();
  if (state.screen === "communication") communicationView();
  if (state.screen === "teamRoom") teamRoomView();
  if (state.screen === "result") resultView();
  if (state.screen === "final") finalView();
}

view.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.metricInfo) {
    showMetricInfo(button.dataset.metricInfo);
    return;
  }
  if (handleUtilityAction(button.dataset.action)) return;
  if (button.dataset.action === "orientation") push("orientation");
  if (button.dataset.action === "intro") push("intro");
  if (button.dataset.action === "inbox") push("inbox");
  if (button.dataset.action === "map") push("map");
  if (button.dataset.action === "checkMap") checkMap();
  if (button.dataset.action === "format") push("format");
  if (button.dataset.action === "nextCase") nextCase();
  if (button.dataset.action === "final") push("final");
  if (button.dataset.action === "restart") restart();
  if (button.dataset.action === "randomAvatar") generatePlayerAvatar();
  if (button.dataset.case) {
    state.currentCaseId = Number(button.dataset.case);
    state.mapAnswers = {};
    state.mapStage = 0;
    state.mapStageErrors = {};
    push("case");
  }
  if (button.dataset.format) {
    state.selectedFormat = button.dataset.format;
    push("communication");
  }
  if (button.hasAttribute("data-branch")) {
    const branch = branchesFor(state.currentCaseId, state.selectedFormat)[Number(button.dataset.branch)];
    applyBranch(branch);
  }
  if (button.dataset.playerGender) {
    state.player.gender = button.dataset.playerGender;
    syncPlayerPortraitToGender();
    render();
  }
  if (button.dataset.playerHair) {
    state.player.hair = button.dataset.playerHair;
    render();
  }
  if (button.dataset.playerHairStyle) {
    state.player.hairStyle = button.dataset.playerHairStyle;
    render();
  }
  if (button.dataset.playerSkin) {
    state.player.skin = button.dataset.playerSkin;
    render();
  }
  if (button.dataset.playerAccessory) {
    state.player.accessory = button.dataset.playerAccessory;
    render();
  }
  if (button.dataset.playerOutfit) {
    state.player.outfit = button.dataset.playerOutfit;
    render();
  }
  if (button.dataset.member) {
    state.openMember = state.openMember === button.dataset.member ? "" : button.dataset.member;
    render();
  }
});

topMetrics.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  handleUtilityAction(button.dataset.action);
});

view.addEventListener("change", (event) => {
  const fileInput = event.target.closest("input[name='playerPhoto']");
  if (fileInput?.files?.[0]) {
    createUnifiedPortrait(fileInput.files[0])
      .then((portrait) => {
        state.player.portrait = portrait;
        state.player.customPortrait = true;
        render();
      })
      .catch(() => {
        state.player.customPortrait = false;
        render();
      });
    return;
  }
  const input = event.target.closest("input[type='radio']");
  if (!input) return;
  const index = Number(input.name.replace("q", ""));
  state.mapAnswers[index] = Number(input.value);
});

view.addEventListener("input", (event) => {
  const input = event.target.closest("input[name='firstName'], input[name='lastName']");
  if (!input) return;
  state.player[input.name] = input.value;
  updateFrame(sectionName.textContent);
});

document.querySelector("#menuBtn").addEventListener("click", () => push("inbox"));
document.querySelector("#closeTheoryBtn").addEventListener("click", () => theoryDialog.close());
theoryDialog.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.theoryOpen) {
    showTheoryDetail(Number(button.dataset.theoryOpen));
    return;
  }
  if (button.dataset.theoryDownload) {
    downloadTheory(Number(button.dataset.theoryDownload));
    return;
  }
  if (button.hasAttribute("data-theory-library")) {
    showTheory();
  }
});

function boot(data) {
    state.data = data;
    setMetricStarts();
    setTeamStarts();
    render();
}

if (window.GAME_DATA) {
  boot(window.GAME_DATA);
} else {
  fetch("./data/game-data.json?v=17")
    .then((response) => response.json())
    .then(boot)
    .catch(() => {
      sectionName.textContent = "Пауза";
      view.innerHTML = `
        <div class="messenger-hero">
          <section class="hero-window">
            <div class="hero-topline"><span class="app-mark">!</span><span>Conflict Desk</span></div>
            <h2>Симуляция временно недоступна</h2>
            <p>Не удалось подготовить страницу. Обновите её и попробуйте снова.</p>
          </section>
        </div>
      `;
    });
}
