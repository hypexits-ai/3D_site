/* =====================================================================
   Логика сайта. Обычно этот файл менять не нужно —
   всё содержимое и настройки лежат в content.js.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------- Проверка файла контента ---------------- */
  var app = document.getElementById("app");
  if (!window.SITE || !window.MATERIALS || !window.VIDEOS || !window.REFERENCES) {
    app.innerHTML =
      '<section class="fatal px"><h2>Ошибка в файле content.js</h2>' +
      "<p>Сайт не смог прочитать файл с содержимым. Скорее всего, после последней правки " +
      "пропала запятая, кавычка или скобка. Откройте content.js и проверьте место, которое меняли последним.</p></section>";
    return;
  }

  var SITE = window.SITE;
  var GROUPS = {
    senior: { id: "senior", label: "Старшая группа", short: "Старшая", note: "15–16 лет" },
    junior: { id: "junior", label: "Младшая группа", short: "Младшая", note: "9–10 лет" },
  };
  var TABS = [
    { id: "materials", label: "Материалы" },
    { id: "videos", label: "Ролики" },
    { id: "refs", label: "Референсы" },
    { id: "homework", label: "Домашка" },
    { id: "sklad", label: "Склад" },
  ];
  var THEMES = [
    { id: "light", name: "Светлая", bg: "#ffffff", a: "#2b2b30" },
    { id: "dark", name: "Тёмная", bg: "#18181b", a: "#6eaef5" },
    { id: "blue", name: "Синяя", bg: "#edf2fb", a: "#1f5ae0" },
    { id: "green", name: "Зелёная", bg: "#edf5ef", a: "#23794a" },
    { id: "purple", name: "Фиолетовая", bg: "#f3eefb", a: "#6a3fd1" },
    { id: "warm", name: "Тёплая", bg: "#fbf3e7", a: "#c4501a" },
  ];
  var MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  var MON_SHORT = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  var DOW = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  var DOW_FULL = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
  var LOGO = document.querySelector(".logo") ? document.querySelector(".logo").innerHTML : "";

  /* ---------------- Хранилище на устройстве ---------------- */
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* приватный режим — не страшно */ }
    },
  };

  /* ---------------- Помощники ---------------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function forGroup(item, gid) {
    var g = item && item.group;
    if (Array.isArray(g)) return g.some(function (x) { return forGroup({ group: x }, gid); });
    g = String(g == null ? "обе" : g).trim().toLowerCase();
    if (!g || g.indexOf("об") === 0 || g === "все" || g === "both" || g === "all") return true;
    if (gid === "senior") return g.indexOf("стар") === 0 || g === "senior";
    if (gid === "junior") return g.indexOf("млад") === 0 || g === "junior";
    return false;
  }
  function inline(s) {
    var t = esc(s);
    t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/\[([^\]]+)\]\((#\/[^\s)]*)\)/g, '<a href="$2">$1</a>');   // ссылка на раздел сайта
    t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    t = t.replace(/(^|[\s(])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
    return t;
  }
  function md(text) {
    var lines = String(text || "").replace(/\r/g, "").split("\n");
    var html = "", para = [], list = [];
    function flushP() { if (para.length) { html += "<p>" + inline(para.join(" ")) + "</p>"; para = []; } }
    function flushL() { if (list.length) { html += "<ul>" + list.map(function (i) { return "<li>" + inline(i) + "</li>"; }).join("") + "</ul>"; list = []; } }
    lines.forEach(function (raw) {
      var l = raw.trim();
      if (!l) { flushP(); flushL(); return; }
      var m = l.match(/^[-•*]\s+(.*)$/);
      if (m) { flushP(); list.push(m[1]); } else { flushL(); para.push(l); }
    });
    flushP(); flushL();
    return html;
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function isoOf(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parseIso(s) {
    var m = String(s || "").match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function normDate(s) {
    s = String(s || "").trim();
    var m;
    if ((m = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/))) return m[1] + "-" + pad(+m[2]) + "-" + pad(+m[3]);
    if ((m = s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/))) return m[3] + "-" + pad(+m[2]) + "-" + pad(+m[1]);
    if ((m = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/))) return m[3] + "-" + pad(+m[1]) + "-" + pad(+m[2]);
    return null;
  }
  function dayMonth(iso) { var d = parseIso(iso); return d ? d.getDate() + " " + MONTHS[d.getMonth()] : iso; }
  function shortDate(iso) { var d = parseIso(iso); return d ? DOW[d.getDay()] + " " + d.getDate() + " " + MON_SHORT[d.getMonth()] : iso; }
  function fileDate(iso) { var d = parseIso(iso); return d ? pad(d.getDate()) + "-" + pad(d.getMonth() + 1) : ""; }
  function plural(n, a, b, c) {
    var n10 = n % 10, n100 = n % 100;
    return n10 === 1 && n100 !== 11 ? a : n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20) ? b : c;
  }
  function fetchT(url, ms, opts) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var o = opts || {};
    if (ctrl) o.signal = ctrl.signal;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, ms);
    return fetch(url, o).finally(function () { clearTimeout(timer); });
  }
  function cube(cls) { return '<svg class="' + (cls || "") + '" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">' + LOGO + "</svg>"; }

  /* ---------------- Цветовые схемы ---------------- */
  function currentTheme() { return document.documentElement.getAttribute("data-theme") || "light"; }
  function setTheme(id) {
    if (id === "light") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", id);
    try { localStorage.setItem("theme", id); } catch (e) {}
    renderThemes();
  }
  function renderThemes() {
    var box = document.getElementById("themes");
    var cur = currentTheme();
    box.innerHTML = THEMES.map(function (t) {
      return '<button type="button" class="theme-btn" data-theme-id="' + t.id + '" title="' + t.name + '" aria-label="Схема: ' + t.name +
        '" aria-pressed="' + (t.id === cur) + '" style="--sw-bg:' + t.bg + ";--sw-a:" + t.a + '"></button>';
    }).join("");
  }
  document.getElementById("themes").addEventListener("click", function (e) {
    var b = e.target.closest(".theme-btn");
    if (b) setTheme(b.getAttribute("data-theme-id"));
  });
  // localStorage хранит тему строкой без JSON — читаем аккуратно
  (function () {
    var t = null;
    try { t = localStorage.getItem("theme"); } catch (e) {}
    if (t && t.charAt(0) === '"') { try { t = JSON.parse(t); } catch (e) {} }
    if (t && THEMES.some(function (x) { return x.id === t; })) {
      if (t === "light") document.documentElement.removeAttribute("data-theme");
      else document.documentElement.setAttribute("data-theme", t);
    }
  })();
  renderThemes();

  /* ---------------- Маршруты ---------------- */
  var prev = {};
  function route() {
    var parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
    return { group: parts[0], tab: parts[1], sub: parts[2] };
  }
  function render() {
    var r = route();
    closeLightbox();
    if (!GROUPS[r.group]) {
      renderHome();
    } else {
      store.set("lastGroup", r.group);
      var tab = TABS.some(function (t) { return t.id === r.tab; }) ? r.tab : "materials";
      renderGroup(GROUPS[r.group], tab, r.sub);
    }
    var keepScroll = prev.group === r.group && prev.tab === r.tab && r.tab === "homework";
    if (!keepScroll) window.scrollTo(0, 0);
    prev = r;
  }
  window.addEventListener("hashchange", render);

  /* ---------------- Главная ---------------- */
  function renderHome() {
    document.title = "Blender — материалы для учеников";
    var last = store.get("lastGroup", null);
    app.innerHTML =
      '<section class="home">' +
      "<h1>Выбери свою группу</h1>" +
      '<p class="lead">Материалы, ролики, референсы и сдача домашки — всё в одном месте.</p>' +
      '<div class="group-pick">' +
      ["senior", "junior"].map(function (id) {
        var g = GROUPS[id];
        return '<a class="group-card px raised ' + id + '" href="#/' + id + '/materials">' + cube() +
          "<div><h2>" + g.label + "</h2>" +
          "<p>" + (last === id ? "Ты заходил сюда в прошлый раз" : g.note) + "</p>" +
          '<span class="go">Открыть →</span></div></a>';
      }).join("") +
      "</div></section>";
  }

  /* ---------------- Страница группы ---------------- */
  function renderGroup(g, tab, sub) {
    var tabLabel = TABS.filter(function (t) { return t.id === tab; })[0].label;
    document.title = tabLabel + " · " + g.label + " · Blender";
    app.innerHTML =
      '<section class="group-head"><div><p class="eyebrow">Группа</p><h1>' + g.label + "</h1></div>" +
      '<a class="btn small" href="#/">Сменить группу</a></section>' +
      '<nav class="tabs" aria-label="Разделы">' +
      TABS.map(function (t) {
        return '<a class="tab' + (t.id === tab ? " active" : "") + '" href="#/' + g.id + "/" + t.id + '"' +
          (t.id === tab ? ' aria-current="page"' : "") + ">" + t.label + "</a>";
      }).join("") +
      "</nav>" +
      '<div id="panel"></div>';
    var panel = document.getElementById("panel");
    if (tab === "materials") {
      if (sub === "hotkeys" && window.HOTKEYS) renderRefPage(panel, g, window.HOTKEYS, "hotkeys");
      else if (sub === "glossary" && window.GLOSSARY) renderRefPage(panel, g, window.GLOSSARY, "glossary");
      else renderMaterials(panel, g);
    }
    if (tab === "videos") renderVideos(panel, g);
    if (tab === "refs") renderRefs(panel, g, sub);
    if (tab === "homework") renderHomework(panel, g, sub);
    if (tab === "sklad") renderSklad(panel, g);
  }

  /* ---------------- Материалы ---------------- */
  function countRows(d) {
    return d.sections.reduce(function (a, s) { return a + s.groups.reduce(function (b, x) { return b + x.rows.length; }, 0); }, 0);
  }
  function renderMaterials(panel, g) {
    var cards = [];
    if (window.HOTKEYS) cards.push({ id: "hotkeys", d: window.HOTKEYS, kick: countRows(window.HOTKEYS) + " " + plural(countRows(window.HOTKEYS), "команда", "команды", "команд") });
    if (window.GLOSSARY) cards.push({ id: "glossary", d: window.GLOSSARY, kick: countRows(window.GLOSSARY) + " " + plural(countRows(window.GLOSSARY), "термин", "термина", "терминов") });
    var notes = window.MATERIALS.filter(function (m) { return forGroup(m, g.id); });
    panel.innerHTML =
      '<section class="section"><h2 class="sec-title">Справочники</h2><div class="grid refcards">' +
      cards.map(function (c) {
        return '<a class="ref-card px raised" href="#/' + g.id + "/materials/" + c.id + '">' +
          '<span class="kicker">' + c.kick + "</span><h3>" + esc(c.d.title) + "</h3><p>" + esc(c.d.subtitle) + "</p>" +
          '<span class="more">Открыть →</span></a>';
      }).join("") +
      "</div></section>" +
      '<section class="section"><h2 class="sec-title">Заметки</h2>' +
      (notes.length
        ? '<div class="notes">' + notes.map(function (n) {
            return '<article class="note-card px">' + (n.title ? "<h3>" + esc(n.title) + "</h3>" : "") + '<div class="prose">' + md(n.text) + "</div></article>";
          }).join("") + "</div>"
        : '<p class="empty px">Пока заметок нет.</p>') +
      "</section>";
  }

  function keysHtml(s) {
    return String(s || "").split(/( \+ | \/ |, )/).map(function (p, i) {
      if (i % 2) return '<span class="sep">' + esc(p.trim()) + "</span>";
      p = p.trim();
      return p ? "<kbd>" + esc(p) + "</kbd>" : "";
    }).join("");
  }
  function renderRefPage(panel, g, d, kind) {
    var isHot = kind === "hotkeys";
    var html =
      '<a class="btn small back" href="#/' + g.id + '/materials">← Материалы</a>' +
      '<header class="ref-hero px raised">' + cube() + "<div><h2>" + esc(d.title) + "</h2><p>" + esc(d.subtitle) + "</p></div></header>" +
      (d.intro ? '<p class="ref-intro">' + esc(d.intro) + "</p>" : "") +
      '<div class="ref-tools"><label class="search"><input type="search" id="refSearch" placeholder="' +
      (isHot ? "Найти команду или клавишу…" : "Найти термин…") + '" aria-label="Поиск"></label>' +
      d.sections.map(function (s, i) { return '<button class="btn small" type="button" data-jump="ref-sec-' + i + '">' + esc(s.title) + "</button>"; }).join("") +
      '<button class="btn small" type="button" data-print>Распечатать</button></div>' +
      '<div class="ref-body ' + kind + '">' +
      d.sections.map(function (s, i) {
        return '<section class="ref-sec ' + (s.level === "advanced" ? "advanced" : "basic") + '" id="ref-sec-' + i + '">' +
          '<div class="ref-sec-head"><h3>' + esc(s.title) + "</h3>" + (s.tag ? '<span class="tag">' + esc(s.tag) + "</span>" : "") + "</div>" +
          (s.lede ? '<p class="lede">' + esc(s.lede) + "</p>" : "") +
          '<div class="ref-list px">' +
          s.groups.map(function (gr) {
            return '<div class="ref-group">' + esc(gr.title) + "</div>" +
              gr.rows.map(function (r) {
                if (isHot) {
                  return '<div class="ref-row" data-s="' + esc([r.cmd, r.desc, r.keys, r.note].join(" ").toLowerCase()) + '">' +
                    '<div class="c c-main"><span class="lbl">Команда</span>' + esc(r.cmd) + "</div>" +
                    '<div class="c c-desc"><span class="lbl">Описание</span>' + esc(r.desc) + "</div>" +
                    '<div class="c c-keys"><span class="lbl">Хоткей</span><span class="keys">' + keysHtml(r.keys) + "</span>" +
                    (r.note ? '<div class="note-small">' + esc(r.note) + "</div>" : "") + "</div></div>";
                }
                return '<div class="ref-row" data-s="' + esc([r.term, r.ru, r.desc].join(" ").toLowerCase()) + '">' +
                  '<div class="c c-main"><span class="lbl">Термин</span>' + esc(r.term) + "</div>" +
                  '<div class="c c-ru"><span class="lbl">Перевод</span>' + esc(r.ru) + "</div>" +
                  '<div class="c c-desc"><span class="lbl">Что это значит</span>' + esc(r.desc) + "</div></div>";
              }).join("");
          }).join("") +
          "</div></section>";
      }).join("") +
      '<p class="nothing px" id="refNothing" hidden>Ничего не нашлось. Попробуй другое слово.</p>' +
      "</div>";
    var foot = esc(d.footer || "");
    if (d.footerLink && foot.indexOf(esc(d.footerLink.text)) >= 0) {
      foot = foot.replace(esc(d.footerLink.text), '<a href="' + esc(d.footerLink.url) + '" target="_blank" rel="noopener">' + esc(d.footerLink.text) + "</a>");
    }
    html += '<footer class="ref-foot">' + foot + (d.credit ? '<p class="credit">' + esc(d.credit) + "</p>" : "") + "</footer>";
    panel.innerHTML = html;

    var input = document.getElementById("refSearch");
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var any = false;
      panel.querySelectorAll(".ref-sec").forEach(function (sec) {
        var secAny = false, groupEl = null, groupAny = false;
        Array.prototype.forEach.call(sec.querySelector(".ref-list").children, function (el) {
          if (el.classList.contains("ref-group")) {
            if (groupEl) groupEl.hidden = !groupAny;
            groupEl = el; groupAny = false;
          } else {
            var show = !q || el.getAttribute("data-s").indexOf(q) >= 0;
            el.hidden = !show;
            if (show) { groupAny = true; secAny = true; }
          }
        });
        if (groupEl) groupEl.hidden = !groupAny;
        sec.hidden = !secAny;
        if (secAny) any = true;
      });
      document.getElementById("refNothing").hidden = any;
    });
    panel.querySelectorAll("[data-jump]").forEach(function (b) {
      b.addEventListener("click", function () {
        var el = document.getElementById(b.getAttribute("data-jump"));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    panel.querySelector("[data-print]").addEventListener("click", function () { window.print(); });
  }

  /* ---------------- Ролики ---------------- */
  function ytId(url) {
    var m = String(url || "").match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }
  function ytMeta(id) {
    var key = "yt:" + id;
    var cached = store.get(key, null);
    if (cached && Date.now() - cached.t < 7 * 864e5) return Promise.resolve(cached);
    var watch = "https://www.youtube.com/watch?v=" + id;
    var urls = [
      "https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(watch),
      "https://noembed.com/embed?url=" + encodeURIComponent(watch),
    ];
    function attempt(i) {
      if (i >= urls.length) return Promise.resolve(null);
      return fetchT(urls[i], 7000)
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          if (j && j.title) {
            var v = { title: j.title, author: j.author_name || "", t: Date.now() };
            store.set(key, v);
            return v;
          }
          return attempt(i + 1);
        })
        .catch(function () { return attempt(i + 1); });
    }
    return attempt(0);
  }
  function renderVideos(panel, g) {
    var list = window.VIDEOS.filter(function (v) { return forGroup(v, g.id); });
    if (!list.length) { panel.innerHTML = '<p class="empty px">Роликов пока нет.</p>'; return; }
    panel.innerHTML = '<div class="grid videos">' + list.map(function (v) {
      var id = ytId(v.url);
      if (!id) {
        return '<div class="vcard px"><div class="thumb noimg"></div><div class="vbody"><h3 class="vtitle">' +
          esc(v.title || "Не получилось распознать ссылку") + '</h3><p class="vauthor">' + esc(v.url) + "</p></div></div>";
      }
      var cached = store.get("yt:" + id, null);
      var title = (cached && cached.title) || v.title || "Ролик на YouTube";
      var author = (cached && cached.author) || v.author || "";
      return '<a class="vcard px raised" data-yt="' + id + '" href="https://www.youtube.com/watch?v=' + id + '" target="_blank" rel="noopener">' +
        '<div class="thumb"><img src="https://img.youtube.com/vi/' + id + '/mqdefault.jpg" alt="" loading="lazy"><span class="play"></span></div>' +
        '<div class="vbody"><h3 class="vtitle">' + esc(title) + '</h3><p class="vauthor">' + esc(author) + "</p></div></a>";
    }).join("") + "</div>";

    panel.querySelectorAll(".thumb img").forEach(function (img) {
      img.addEventListener("error", function () { img.parentNode.classList.add("noimg"); });
    });
    panel.querySelectorAll("[data-yt]").forEach(function (card) {
      ytMeta(card.getAttribute("data-yt")).then(function (m) {
        if (!m || !card.isConnected) return;
        card.querySelector(".vtitle").textContent = m.title;
        if (m.author) card.querySelector(".vauthor").textContent = m.author;
      });
    });
  }

  /* ---------------- Референсы ---------------- */
  var EXTS = [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG", ".WEBP", ".gif"];
  function loadRefImage(img) {
    var base = img.getAttribute("data-base");
    var hasExt = /\.[a-z0-9]{2,4}$/i.test(base);
    var tries = hasExt ? [base] : EXTS.map(function (e) { return base + e; });
    var i = 0;
    function next() {
      if (i >= tries.length) {
        var box = img.parentNode;
        box.classList.add("missing");
        box.textContent = "Нет файла: " + base.replace("references/", "");
        return;
      }
      img.src = tries[i++];
    }
    img.addEventListener("error", next);
    next();
  }
  var lbItems = [], lbIndex = 0;
  function renderRefs(panel, g, sub) {
    var list = window.REFERENCES.filter(function (r) { return forGroup(r, g.id); });
    if (!list.length) { panel.innerHTML = '<p class="empty px">Референсов пока нет.</p>'; return; }
    panel.innerHTML = '<div class="grid refs">' + list.map(function (r, i) {
      return '<button type="button" class="rcard px raised" data-i="' + i + '" aria-label="Открыть: ' + esc(r.caption || r.file) + '">' +
        '<span class="rimg"><img data-base="references/' + esc(r.file) + '" alt="' + esc(r.caption || "") + '" loading="lazy"></span>' +
        '<span class="rcap">' + esc(r.caption || "") + "</span></button>";
    }).join("") + "</div>";
    panel.querySelectorAll("img[data-base]").forEach(loadRefImage);
    lbItems = list;
    // Ссылка вида #/junior/refs/lamp сразу открывает нужную картинку
    var want = list.map(function (r) { return r.file; }).indexOf(sub);
    if (want >= 0) {
      var card = panel.querySelector('.rcard[data-i="' + want + '"]');
      var wimg = card.querySelector("img");
      if (wimg) wimg.loading = "eager";
      card.scrollIntoView({ block: "center" });
      var opened = false;
      var openIt = function () { if (!opened && !card.querySelector(".missing")) { opened = true; openLightbox(want); } };
      if (wimg && wimg.complete && wimg.naturalWidth) openIt(); else if (wimg) wimg.addEventListener("load", openIt);
    }
    panel.addEventListener("click", function (e) {
      var b = e.target.closest(".rcard");
      if (!b) return;
      var img = b.querySelector("img");
      if (!img || b.querySelector(".missing")) return;
      openLightbox(+b.getAttribute("data-i"));
    });
  }
  var lb = document.getElementById("lightbox");
  var lastFocus = null;
  function showLb(i) {
    lbIndex = (i + lbItems.length) % lbItems.length;
    var card = document.querySelector('.rcard[data-i="' + lbIndex + '"] img');
    document.getElementById("lbImg").src = card && card.currentSrc ? card.currentSrc : "";
    document.getElementById("lbImg").alt = lbItems[lbIndex].caption || "";
    document.getElementById("lbCap").textContent = lbItems[lbIndex].caption || "";
    document.getElementById("lbCount").textContent = lbIndex + 1 + " / " + lbItems.length;
  }
  function openLightbox(i) {
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    showLb(i);
    lb.querySelector('[data-lb="close"]').focus();
  }
  function closeLightbox() {
    if (lb.hidden) return;
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  lb.addEventListener("click", function (e) {
    var a = e.target.closest("[data-lb]");
    if (a) {
      var act = a.getAttribute("data-lb");
      if (act === "close") closeLightbox();
      if (act === "prev") showLb(lbIndex - 1);
      if (act === "next") showLb(lbIndex + 1);
      return;
    }
    if (e.target === lb || e.target.classList.contains("lb-inner")) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showLb(lbIndex - 1);
    if (e.key === "ArrowRight") showLb(lbIndex + 1);
  });

  /* ---------------- Домашка ---------------- */
  function hwDates() {
    var cfg = SITE.homework || {};
    var start = parseIso(cfg.start) || new Date(2026, 9, 17);
    var end = parseIso(cfg.end) || new Date(start.getFullYear() + 1, 4, 31);
    var step = Math.max(1, +cfg.everyDays || 7);
    var out = [], d = new Date(start);
    while (d <= end && out.length < 400) {
      out.push(isoOf(d));
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + step);
    }
    return out;
  }
  function nearestDate(dates) {
    var today = isoOf(new Date());
    for (var i = 0; i < dates.length; i++) if (dates[i] >= today) return dates[i];
    return dates[dates.length - 1];
  }
  function formCfg() {
    var f = SITE.googleForm || {};
    var url = String(f.actionUrl || "").trim().replace(/\/viewform.*$/, "/formResponse");
    var fields = f.fields || {};
    function norm(v) {
      v = String(v || "").trim();
      var m = v.match(/(\d{5,})/);
      return m ? "entry." + m[1] : "";
    }
    var F = { group: norm(fields.group), date: norm(fields.date), name: norm(fields.name), file: norm(fields.file), comment: norm(fields.comment) };
    var ok = /^https:\/\/docs\.google\.com\/forms\/.+\/formResponse$/.test(url) && F.group && F.date && F.name && F.file;
    return { ok: !!ok, url: url, F: F };
  }
  function marks() { return store.get("hwMarks", {}); }
  function setMark(gid, iso, data) {
    var m = marks();
    m[gid] = m[gid] || {};
    m[gid][iso] = data;
    store.set("hwMarks", m);
  }
  function renderHomework(panel, g, sub) {
    var dates = hwDates();
    if (!dates.length) { panel.innerHTML = '<p class="empty px">Даты домашек не настроены.</p>'; return; }
    var nearest = nearestDate(dates);
    var sel = dates.indexOf(sub) >= 0 ? sub : nearest;
    var idx = dates.indexOf(sel);
    var myMarks = marks()[g.id] || {};
    var today = isoOf(new Date());
    var link = String((SITE.dropbox || {})[g.id] || "").trim();
    var linkOk = /^https?:\/\//.test(link);
    var linkIsFolder = /dropbox\.com\/(scl\/fo|sh)\//.test(link);
    var cfg = formCfg();
    var task = ((SITE.tasks || {})[g.id] || {})[sel];
    var savedName = store.get("studentName", "");
    var whenLabel = sel === nearest && sel >= today ? "ближайшее занятие" : sel < today ? "занятие прошло" : "будущее занятие";
    var mark = myMarks[sel];

    panel.innerHTML =
      '<div class="dates-bar">' +
      '<a class="btn small" href="#/' + g.id + "/homework/" + dates[Math.max(0, idx - 1)] + '" aria-label="Предыдущая дата">←</a>' +
      '<nav class="dates" id="dates" aria-label="Даты занятий">' +
      dates.map(function (iso) {
        var d = parseIso(iso);
        var cls = "chip" + (iso === sel ? " active" : "") + (iso === nearest ? " next" : "");
        return '<a class="' + cls + '" href="#/' + g.id + "/homework/" + iso + '" data-iso="' + iso + '"' + (iso === sel ? ' aria-current="date"' : "") + ">" +
          '<span class="dow">' + DOW[d.getDay()] + '</span><span class="dnum">' + d.getDate() + '</span><span class="dmon">' + MON_SHORT[d.getMonth()] + "</span>" +
          (myMarks[iso] ? '<span class="dmark" title="Отмечено">✓</span>' : "") + "</a>";
      }).join("") +
      "</nav>" +
      '<a class="btn small" href="#/' + g.id + "/homework/" + dates[Math.min(dates.length - 1, idx + 1)] + '" aria-label="Следующая дата">→</a>' +
      "</div>" +

      '<div class="hw-head"><h2>Домашка за ' + dayMonth(sel) + '</h2><p class="muted">' + DOW_FULL[parseIso(sel).getDay()] + " · " + whenLabel + "</p></div>" +
      (task
        ? '<section class="task px raised"><h3 class="task-title">Задание</h3><div class="prose">' + md(task) + "</div></section>"
        : '<section class="task empty-task px"><h3 class="task-title">Задание</h3><p>Домашки пока нет.</p></section>') +
      '<div id="doneBox">' + (mark ? doneBoxHtml(mark) : "") + "</div>" +

      '<div class="steps">' +
      '<section class="step px raised"><div class="step-head"><span class="step-num">1</span><h3>Загрузи файл</h3></div>' +
      "<p>Назови файл так:</p><p><code>Фамилия_Имя_" + fileDate(sel) + ".blend</code></p>" +
      "<p>Нажми кнопку — откроется окно Dropbox. Регистрироваться не нужно: выбери файл и нажми «Загрузить».</p>" +
      (linkOk && !linkIsFolder
        ? '<a class="btn primary big" href="' + esc(link) + '" target="_blank" rel="noopener">Загрузить файл ↗</a>'
        : '<div class="box warn px" style="margin-top:16px"><strong>Ссылка для загрузки пока не готова</strong><p>Преподаватель скоро её добавит.</p></div>') +
      '<details class="tips"><summary>Файл слишком большой?</summary><ul>' +
      "<li>В Blender: File → Clean Up → Purge Unused Data (удаляет всё лишнее).</li>" +
      "<li>Сохраняй со сжатием: File → Save As, справа поставь галочку Compress.</li>" +
      "<li>Удали ненужные объекты и большие текстуры, которые не используются.</li>" +
      "<li>Если файл всё равно больше 500 МБ — напиши преподавателю.</li>" +
      "</ul></details></section>" +

      '<section class="step px raised"><div class="step-head"><span class="step-num">2</span><h3>Отметь выполнение</h3></div>' +
      '<form id="hwForm" novalidate>' +
      '<p class="form-meta"><span>Группа: <b>' + g.short + "</b></span><span>Дата: <b>" + dayMonth(sel) + "</b></span></p>" +
      '<label class="field" data-f="name"><span>Фамилия и имя <i>*</i></span>' +
      '<input name="name" autocomplete="name" maxlength="80" placeholder="Иванов Петя" value="' + esc(savedName) + '">' +
      '<p class="error">Напиши фамилию и имя, например: Иванов Петя</p></label>' +
      '<label class="field" data-f="file"><span>Название файла <i>*</i></span>' +
      '<input name="file" maxlength="160" placeholder="Иванов_Петя_' + fileDate(sel) + '.blend" autocapitalize="off" spellcheck="false">' +
      '<p class="error">Впиши название файла, который ты загрузил</p></label>' +
      '<label class="field"><span>Комментарий</span>' +
      '<textarea name="comment" maxlength="500" rows="3" placeholder="Например: не успел сделать текстуры"></textarea></label>' +
      '<button class="btn primary big" type="submit"' + (cfg.ok ? "" : " disabled") + ">✓ Выполнена</button>" +
      (cfg.ok ? "" : '<p class="form-msg err">Отправка пока не настроена преподавателем.</p>') +
      '<p class="form-msg" id="formMsg" aria-live="polite"></p>' +
      "</form></section>" +
      "</div>";

    var activeChip = panel.querySelector(".chip.active");
    if (activeChip) {
      var strip = document.getElementById("dates");
      strip.scrollLeft = activeChip.offsetLeft - strip.offsetLeft - strip.clientWidth / 2 + activeChip.offsetWidth / 2;
    }

    var form = document.getElementById("hwForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      submitHomework(form, g, sel, cfg);
    });
    form.querySelectorAll("input").forEach(function (inp) {
      inp.addEventListener("input", function () { inp.closest(".field").classList.remove("invalid"); });
    });
  }
  function doneBoxHtml(mark) {
    return '<div class="box ok px"><strong>✓ Ты уже отметил эту домашку на этом устройстве</strong>' +
      "<p>Файл: <code>" + esc(mark.file) + "</code>. Если отправил не тот файл — загрузи новый и отметь ещё раз.</p></div>";
  }
  var sending = false;
  function submitHomework(form, g, iso, cfg) {
    if (sending) return;
    var msg = document.getElementById("formMsg");
    var els = form.elements;
    var name = els["name"].value.replace(/\s+/g, " ").trim();
    var file = els["file"].value.trim();
    var comment = els["comment"].value.trim();
    var okName = name.split(" ").filter(function (w) { return w.replace(/[^A-Za-zА-Яа-яЁё]/g, "").length >= 2; }).length >= 2;
    form.querySelector('[data-f="name"]').classList.toggle("invalid", !okName);
    form.querySelector('[data-f="file"]').classList.toggle("invalid", !file);
    if (!okName || !file) {
      msg.className = "form-msg err";
      msg.textContent = "Заполни поля, отмеченные звёздочкой.";
      (okName ? els["file"] : els["name"]).focus();
      return;
    }
    if (!cfg.ok) { msg.className = "form-msg err"; msg.textContent = "Отправка пока не настроена преподавателем."; return; }

    var btn = form.querySelector('button[type="submit"]');
    sending = true;
    btn.disabled = true;
    btn.textContent = "Отправляем…";
    msg.className = "form-msg";
    msg.textContent = "";

    var body = new URLSearchParams();
    body.append(cfg.F.group, g.short);
    body.append(cfg.F.date, iso);
    body.append(cfg.F.name, name);
    body.append(cfg.F.file, file);
    if (cfg.F.comment) body.append(cfg.F.comment, comment);

    fetchT(cfg.url, 15000, { method: "POST", mode: "no-cors", body: body })
      .then(function () {
        store.set("studentName", name);
        var data = { file: file, comment: comment, at: Date.now() };
        setMark(g.id, iso, data);
        var pend = store.get("hwPending", []);
        pend.push({ g: g.id, d: iso, file: file, comment: comment, name: name, at: Date.now() });
        store.set("hwPending", pend.slice(-30));
        msg.className = "form-msg ok";
        msg.textContent = "Готово, спасибо! Отметка сохранена. На «Складе» она появится через несколько минут.";
        document.getElementById("doneBox").innerHTML = doneBoxHtml(data);
        var chip = document.querySelector('.chip[data-iso="' + iso + '"]');
        if (chip && !chip.querySelector(".dmark")) chip.insertAdjacentHTML("beforeend", '<span class="dmark" title="Отмечено">✓</span>');
        els["file"].value = "";
        els["comment"].value = "";
      })
      .catch(function () {
        msg.className = "form-msg err";
        msg.textContent = "Не получилось отправить. Проверь интернет и попробуй ещё раз.";
      })
      .finally(function () {
        setTimeout(function () {
          sending = false;
          if (btn.isConnected) { btn.disabled = false; btn.textContent = "✓ Выполнена"; }
        }, 3000);
      });
  }

  /* ---------------- Склад ---------------- */
  function parseCSV(text) {
    var rows = [], row = [], field = "", q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
        else field += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c !== "\r") field += c;
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return rows;
  }
  function skladRows(text, gid) {
    var rows = parseCSV(text.replace(/^﻿/, ""));
    if (!rows.length) return [];
    var H = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    function col(words, not) {
      for (var i = 0; i < H.length; i++) {
        if (not && not.indexOf(i) >= 0) continue;
        if (words.some(function (w) { return H[i].indexOf(w) >= 0; })) return i;
      }
      return -1;
    }
    var iF = col(["файл", "file"]);
    var iG = col(["груп", "group"]);
    var iD = col(["дата", "date"]);
    var iC = col(["коммент", "comment"]);
    var iN = col(["фамил", "имя", "name"], [iF]);
    if (iF < 0 || iG < 0 || iD < 0) throw new Error("columns");
    var want = GROUPS[gid].short.toLowerCase().slice(0, 4);
    return rows.slice(1).filter(function (r) {
      return (r[iF] || "").trim() && String(r[iG] || "").trim().toLowerCase().indexOf(want) === 0;
    }).map(function (r) {
      return { date: normDate(r[iD]) || String(r[iD] || "").trim(), file: r[iF].trim(), comment: iC >= 0 ? (r[iC] || "").trim() : "", name: iN >= 0 ? (r[iN] || "").trim() : "" };
    }).reverse();
  }
  function skladRowHtml(it, showNames, pending) {
    var dateLabel = parseIso(it.date) ? shortDate(it.date) : it.date || "—";
    return '<li class="srow px' + (showNames ? " with-name" : "") + (pending ? " pending" : "") + '">' +
      '<span class="sdate">' + esc(dateLabel) + "</span>" +
      (showNames ? '<span class="sname">' + esc(it.name || "—") + "</span>" : "") +
      '<span class="sfile">' + esc(it.file) + "</span>" +
      '<span class="scomm' + (it.comment ? "" : " none") + '">' + esc(it.comment || "без комментария") + "</span>" +
      (pending ? '<span class="spend">Отправлено с этого устройства · в общем списке появится через несколько минут</span>' : "") +
      "</li>";
  }
  function renderSklad(panel, g) {
    var url = String(SITE.warehouseCsvUrl || "").trim();
    var showNames = !!SITE.showNames;
    panel.innerHTML =
      '<div class="sklad-top"><h2>Склад</h2><p class="muted">Всё, что уже сдала ' + (g.id === "senior" ? "старшая" : "младшая") + " группа. Новые работы — сверху.</p></div>" +
      '<div id="skladBody"><p class="empty px">Загружаем список…</p></div>';
    var body = document.getElementById("skladBody");
    var pending = store.get("hwPending", []).filter(function (p) { return Date.now() - p.at < 864e5; });

    function draw(remote) {
      var seen = {};
      remote.forEach(function (r) { seen[(r.date + "|" + r.file).toLowerCase()] = 1; });
      var mine = pending.filter(function (p) { return p.g === g.id && !seen[(p.d + "|" + p.file).toLowerCase()]; })
        .map(function (p) { return { date: p.d, file: p.file, comment: p.comment, name: p.name }; }).reverse();
      store.set("hwPending", pending.filter(function (p) { return !seen[(p.d + "|" + p.file).toLowerCase()]; }));
      if (!remote.length && !mine.length) { body.innerHTML = '<p class="empty px">Пока ничего не сдано.</p>'; return; }
      body.innerHTML =
        '<p class="muted" style="margin-bottom:16px">Сдано работ: <b>' + remote.length + "</b></p>" +
        '<ul class="sklad-list">' +
        mine.map(function (it) { return skladRowHtml(it, showNames, true); }).join("") +
        remote.map(function (it) { return skladRowHtml(it, showNames, false); }).join("") +
        "</ul>";
    }

    if (!/^https:\/\/docs\.google\.com\/spreadsheets\//.test(url)) {
      var mine = pending.filter(function (p) { return p.g === g.id; });
      body.innerHTML = '<div class="box info px"><strong>Склад скоро заработает</strong><p>Преподаватель ещё не подключил таблицу.</p></div>';
      if (mine.length) body.insertAdjacentHTML("beforeend", '<ul class="sklad-list">' + mine.reverse().map(function (p) {
        return skladRowHtml({ date: p.d, file: p.file, comment: p.comment, name: p.name }, showNames, true);
      }).join("") + "</ul>");
      return;
    }
    fetchT(url + (url.indexOf("?") >= 0 ? "&" : "?") + "_=" + Date.now(), 15000, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.text(); })
      .then(function (text) {
        if (/^\s*</.test(text)) throw new Error("html");
        if (!body.isConnected) return;
        draw(skladRows(text, g.id));
      })
      .catch(function (err) {
        if (!body.isConnected) return;
        body.innerHTML = '<div class="box err px"><strong>Не получилось загрузить список</strong><p>' +
          (err && err.message === "columns"
            ? "В таблице не нашлось нужных столбцов (группа, дата, название файла). Преподавателю стоит проверить лист «Склад»."
            : "Проверь интернет и открой раздел ещё раз через минуту.") + "</p></div>";
      });
  }

  render();
})();
