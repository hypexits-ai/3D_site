/* =====================================================================
   ФАЙЛ КОНТЕНТА — всё, что вы меняете на сайте, лежит здесь.
   Открывайте его в любом текстовом редакторе (Блокнот, TextEdit, VS Code).

   Правила, чтобы ничего не сломалось:
   • Текст пишется в кавычках "…" или в обратных кавычках `…` (для длинного текста).
   • После каждого блока { … } ставится запятая.
   • Строки, начинающиеся с //, — это подсказки, сайт их не видит.
   • После правки сохраните файл и обновите сайт на Netlify (см. инструкцию).

   Группы пишутся так:  "обе"   "старшая"   "младшая"
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. НАСТРОЙКИ
   --------------------------------------------------------------------- */
window.SITE = {

  // Ссылки на ЗАПРОС ФАЙЛОВ в Dropbox (вид: https://www.dropbox.com/request/...).
  // Не ставьте сюда ссылку на папку (…/scl/fo/…): по ней дети увидят чужие работы.
  dropbox: {
    senior: "https://www.dropbox.com/request/9g3trfq4vbazicpan9ct",   // старшая группа
    junior: "https://www.dropbox.com/request/cz2bxbrd2vnk2qxj19ys",   // младшая группа
  },

  // Google Форма для кнопки «Выполнена».
  // Этот блок целиком выдаёт скрипт google-setup.gs — просто замените его.
  googleForm: {
    actionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeDbjbbxwalHag8W1M6A2LM3ixXpm8WaDNmuURmCX3qxw6fJw/formResponse",
    fields: { group: "entry.1116748327", date: "entry.755028274", name: "entry.2077516687", file: "entry.1322970188", comment: "entry.1108414182" },
  },

  // Ссылка на опубликованный лист «Склад» в формате CSV
  // (вид: https://docs.google.com/spreadsheets/d/e/…/pub?gid=…&single=true&output=csv).
  warehouseCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRHM-u4S4yGKTi_yrjrjUUxR0bG5Bxjja7TIvYkKX902nTphXf8L53-gPR8w_kQcGSZBjafg70E2WEu/pub?gid=0&single=true&output=csv",

  // Показывать ли фамилии и имена на «Складе». По умолчанию — нет.
  // Если поставить true, нужно ещё добавить столбец с именами в лист «Склад» (см. инструкцию).
  showNames: false,

  // Даты домашних заданий: с какой субботы начинать, до какой и через сколько дней.
  homework: {
    start: "2026-10-17",   // год-месяц-день
    end:   "2027-05-29",
    everyDays: 7,
  },

  // Задания к датам. Показываются в «Домашке» под датами.
  // Для даты без задания сайт сам напишет «Домашки пока нет».
  // Чтобы добавить задание, скопируйте блок "дата": `текст`, (с запятой в конце)
  // и поменяйте дату (год-месяц-день) и текст. Внутри можно то же, что в Материалах:
  // - пункт списка, **жирный**, ссылки. [текст](#/junior/refs) — ссылка на раздел сайта.
  tasks: {
    senior: {
      "2026-10-17": `
- Повторить [тумбочку из раздела «Референсы»](#/senior/refs/nightstand), **обязательно соблюдая чистоту сетки**.
- Посмотреть видеоуроки из раздела [«Ролики»](#/senior/videos).
- **Обязательно** посмотреть ролик про high-poly моделирование.
`,
      "2026-10-24": `
- Смоделировать [мельницу из раздела «Референсы»](#/senior/refs/windmill).
`,
      "2026-10-31": `
- Смоделировать [комод с выдвижными ящиками из раздела «Референсы»](#/senior/refs/dresser).
`,
    },
    junior: {
      "2026-10-17": `
- Повторить [Nintendo (игровую приставку) из раздела «Референсы»](#/junior/refs/console).
- Посмотреть видеоуроки из раздела [«Ролики»](#/junior/videos).
`,
      "2026-10-24": `
- Смоделировать [лампу с абажуром из раздела «Референсы»](#/junior/refs/lamp-shade).
`,
      "2026-10-31": `
- Смоделировать [мельницу из раздела «Референсы»](#/junior/refs/windmill).
`,
    },
  },
};


/* ---------------------------------------------------------------------
   2. МАТЕРИАЛЫ — текстовые заметки
   Чтобы добавить заметку, скопируйте блок от { до }, (включая запятую)
   и вставьте его выше или ниже. Самые верхние показываются первыми.

   Внутри text можно:
     пустая строка        — новый абзац
     - пункт              — строка списка (дефис и пробел в начале)
     **жирный текст**     — выделение
     [текст](https://…)   — ссылка
   --------------------------------------------------------------------- */
window.MATERIALS = [
  {
    title: "Как сдавать домашку",
    group: "обе",
    text: `
Домашка сдаётся в разделе **Домашка** в два шага.

- Выбери дату занятия и нажми «Загрузить файл» — откроется окно Dropbox, регистрироваться не нужно.
- Назови файл так: Фамилия_Имя_дата.blend, например Иванов_Петя_17-10.blend
- Вернись на сайт, впиши фамилию и имя, название файла и нажми «Выполнена».

Если файл тяжелее 500 МБ, перед отправкой в Blender выбери File → Clean Up → Purge Unused Data и сохрани файл со сжатием (галочка Compress в окне сохранения).

Свою работу ты увидишь в разделе **Склад** через несколько минут.
`,
  },
];


/* ---------------------------------------------------------------------
   3. РОЛИКИ — ссылки на YouTube
   Достаточно вставить ссылку: превью и название сайт подтянет сам.
   title и author — запасные подписи, если YouTube не ответит (можно не писать).
   --------------------------------------------------------------------- */
window.VIDEOS = [
  { url: "https://youtu.be/Q4UTHgwNlIE", group: "обе",
    title: "Blender для начинающих - знакомство с программой и 3D моделирование. Урок 1", author: "VideoSmile" },
  { url: "https://youtu.be/CsNgljHnbhA", group: "обе",
    title: "Тропическая сцена в Blender", author: "Blender 3D - уроки" },
  { url: "https://youtu.be/lEboaycdCSs", group: "обе",
    title: "Материалы в Blender за 15 минут", author: "Blender Vibes" },
  { url: "https://youtu.be/gBSiw2IjcQI", group: "обе",
    title: "Blender 4.2 ►|УРОК 5| НАСТРОЙКА и ОПТИМИЗАЦИЯ РЕНДЕРА для начинающих!", author: "Магия монтажа" },
  { url: "https://youtu.be/4KgQJVutz0I", group: "старшая",
    title: "Blender 3D - Hard Surface моделирование | Урок 1", author: "VideoSmile" },
  { url: "https://youtu.be/q7fCWyEhSGw", group: "обе",
    title: "Hard-Surface моделирование в Blender", author: "Blender 3D - уроки" },
  { url: "https://youtu.be/jpNyA_i1gIE", group: "обе",
    title: "Урок по Blender №1", author: "Blender Vibes" },
  { url: "https://youtu.be/uHCJoNEWjXo", group: "старшая",
    title: "How to Texture in Blender", author: "Blender Guru" },
  { url: "https://youtu.be/QPh8h0hWkg0", group: "старшая",
    title: "Beginner Blender 4.2 Tutorial: Modelling a Low-Poly Well - Part1", author: "Grant Abbitt (Gabbitt)" },

  // Основы рендера
  { url: "https://youtu.be/OUpHegF5KN4", group: "обе",
    title: "Базовые настройки рендера в Blender" },
  { url: "https://youtu.be/AuJMDdDqXVs", group: "обе",
    title: "Basics of Rendering. Cycles vs. Eevee [Blender]" },
  // Анимация для новичков
  { url: "https://youtu.be/e0jFq0-oIfk", group: "обе",
    title: "Blender анимация для новичков" },
  { url: "https://youtu.be/YWhD_o4L8u0", group: "обе",
    title: "Основы анимации в Blender 4.0" },
  // Hard surface моделирование
  { url: "https://youtu.be/j1gIztziq8E", group: "обе",
    title: "Your FIRST Hard Surface Model in Blender (2026 Beginner Tutorial)" },
  { url: "https://youtu.be/zxhaCD-Zlfw", group: "обе",
    title: "Hard-Surface Modeling in Blender for Beginners (Full Course)", author: "Louis du Mont" },
];


/* ---------------------------------------------------------------------
   4. РЕФЕРЕНСЫ — картинки из папки references
   file — имя файла БЕЗ расширения (.jpg, .png, .webp подберутся сами).
   Новую картинку положите в папку references и добавьте строку сюда.
   --------------------------------------------------------------------- */
window.REFERENCES = [
  { file: "windmill",       group: "обе",     caption: "Мельница" },
  { file: "lamp-shade",     group: "обе",     caption: "Лампа с абажуром" },
  { file: "dresser",        group: "обе",     caption: "Комод с выдвижными ящиками" },
  { file: "desk",           group: "обе",     caption: "Письменный стол" },
  { file: "polaroid",       group: "старшая", caption: "Фотоаппарат Polaroid" },
  { file: "building",       group: "обе",     caption: "Городская диорама: здание редакции NEWS. Автор: Левандовский Сергей, курс «Основы Blender», CG LAB" },
  { file: "house",          group: "обе",     caption: "Домик с оранжевой крышей" },
  { file: "stove",          group: "старшая", caption: "Плита" },
  { file: "arcade",         group: "обе",     caption: "Игровой автомат" },
  { file: "console",        group: "обе",     caption: "Игровая приставка" },
  { file: "coffee-machine", group: "старшая", caption: "Кофемашина" },
  { file: "room",           group: "обе",     caption: "Изометрическая комната" },
  { file: "lamp",           group: "обе",     caption: "Настольная лампа" },
  { file: "monster",        group: "обе",     caption: "Персонаж: монстрик с рогами" },
  { file: "nightstand",     group: "обе",     caption: "Деревянная тумбочка" },
  { file: "camera",         group: "старшая", caption: "Кинокамера" },
  { file: "boombox",        group: "старшая", caption: "Магнитофон" },
  { file: "cannon",         group: "обе",     caption: "Пушка на колёсах" },
  { file: "whale",          group: "обе",     caption: "Кит" },
  { file: "tv",             group: "обе",     caption: "Ретро-телевизор с антенной" },
  { file: "stilt-house",    group: "обе",     caption: "Домик на сваях и лодка" },
  { file: "milk",           group: "обе",     caption: "Пакет и бутылка молока" },
  { file: "radar",          group: "младшая", caption: "Спутниковая тарелка" },
  { file: "remote",         group: "младшая", caption: "Пульт от телевизора" },
  { file: "satellite",      group: "младшая", caption: "Спутник с солнечными панелями" },
];
