/* =====================================================================
   ШПАРГАЛКА ГОРЯЧИХ КЛАВИШ BLENDER
   Раздел «Материалы» → карточка «Шпаргалка горячих клавиш».

   Как добавить команду: скопируй любую строку вида
     { cmd: "Move", desc: "Переместить объект", keys: "G" },
   и вставь её в нужную группу. Поле note (мелкая подпись) — необязательное.

   Как писать клавиши в поле keys:
     "Ctrl + Shift + Z"  — нажать вместе
     "X / Y / Z"         — любая из клавиш
     "G, G"              — по очереди
   ===================================================================== */

window.HOTKEYS = {
  title: "Шпаргалка горячих клавиш Blender",
  subtitle: "65 команд, актуальных для Blender 5.x — от базовой навигации до узкоспециальных инструментов. Разбито по уровню и по темам.",
  footer: "Клавиши указаны для стандартной раскладки клавиатуры Blender (Blender Keymap) на Windows/Linux. На macOS часть команд с Ctrl выполняется через Cmd. Полный список — в официальном руководстве: docs.blender.org/manual.",
  footerLink: { text: "docs.blender.org/manual", url: "https://docs.blender.org/manual/en/latest/interface/keymap/index.html" },
  credit: "created by Alex Salnikov",
  sections: [
    {
      level: "basic",
      title: "Базовые",
      tag: "для тех, кто только начинает",
      lede: "То, что нужно в первые часы работы: навигация, выделение, трансформация и основные операции моделирования.",
      groups: [
        { title: "Навигация во вьюпорте", rows: [
          { cmd: "Orbit View", desc: "Вращение вида вокруг объекта", keys: "СКМ", note: "или Numpad 4 / 6 / 8 / 2" },
          { cmd: "Pan View", desc: "Панорамирование (сдвиг) вида", keys: "Shift + СКМ" },
          { cmd: "Zoom", desc: "Приближение / отдаление", keys: "Колесо мыши" },
          { cmd: "Front View", desc: "Вид спереди", keys: "Numpad 1" },
          { cmd: "Top View", desc: "Вид сверху", keys: "Numpad 7" },
          { cmd: "Camera View", desc: "Вид из активной камеры", keys: "Numpad 0" },
          { cmd: "Frame Selected", desc: "Центрировать вид на объекте", keys: "Numpad ." },
        ] },
        { title: "Выделение", rows: [
          { cmd: "Select", desc: "Выбрать объект или элемент", keys: "ЛКМ" },
          { cmd: "Select All", desc: "Выделить всё в сцене", keys: "A" },
          { cmd: "Deselect All", desc: "Снять выделение", keys: "Alt + A" },
          { cmd: "Box Select", desc: "Выделение прямоугольной рамкой", keys: "B" },
        ] },
        { title: "Режимы работы", rows: [
          { cmd: "Toggle Edit Mode", desc: "Переключение Object ↔ Edit Mode", keys: "Tab" },
          { cmd: "Shading Pie", desc: "Меню отображения: каркас / материал / рендер", keys: "Z" },
          { cmd: "Toggle Wireframe", desc: "Быстрое переключение в каркасный режим", keys: "Shift + Z" },
        ] },
        { title: "Трансформация", rows: [
          { cmd: "Move", desc: "Переместить объект или элемент", keys: "G" },
          { cmd: "Rotate", desc: "Повернуть объект или элемент", keys: "R" },
          { cmd: "Scale", desc: "Изменить масштаб", keys: "S" },
          { cmd: "Axis Lock", desc: "Ограничить действие по одной оси", keys: "X / Y / Z", note: "нажать после G, R или S" },
        ] },
        { title: "Базовое моделирование (Edit Mode)", rows: [
          { cmd: "Extrude", desc: "Выдавить новую геометрию", keys: "E" },
          { cmd: "Loop Cut", desc: "Добавить кольцевой срез", keys: "Ctrl + R" },
          { cmd: "Bevel", desc: "Скруглить рёбра", keys: "Ctrl + B" },
          { cmd: "Inset Faces", desc: "Вставить грань внутрь выделенной", keys: "I" },
          { cmd: "Delete", desc: "Удалить выделенное", keys: "X", note: "или Delete" },
        ] },
        { title: "Объекты и файл", rows: [
          { cmd: "Add Object", desc: "Добавить примитив в сцену", keys: "Shift + A" },
          { cmd: "Duplicate", desc: "Создать копию объекта", keys: "Shift + D" },
          { cmd: "Undo", desc: "Отменить последнее действие", keys: "Ctrl + Z" },
          { cmd: "Redo", desc: "Повторить отменённое действие", keys: "Ctrl + Shift + Z" },
          { cmd: "Save File", desc: "Сохранить проект", keys: "Ctrl + S" },
        ] },
      ],
    },
    {
      level: "advanced",
      title: "Продвинутые",
      tag: "для уверенных пользователей",
      lede: "Точное редактирование сетки, работа со структурой сцены, привязки, UV, рендер и анимация — команды, которые обычно осваивают после первых проектов.",
      groups: [
        { title: "Точное редактирование сетки", rows: [
          { cmd: "Knife Tool", desc: "Интерактивная резка новых рёбер", keys: "K" },
          { cmd: "Vertex Bevel", desc: "Скругление вершин", keys: "Ctrl + Shift + B" },
          { cmd: "Edge Slide", desc: "Скольжение ребра по соседней геометрии", keys: "G, G", note: "двойное нажатие" },
          { cmd: "Vertex Slide", desc: "Скольжение вершины вдоль ребра", keys: "Shift + V" },
          { cmd: "Shrink / Fatten", desc: "Смещение геометрии по нормалям", keys: "Alt + S" },
          { cmd: "Rip", desc: "Оторвать вершину или ребро от сетки", keys: "V" },
          { cmd: "Rip Fill", desc: "Отрыв с автозаполнением получившейся дыры", keys: "Alt + V" },
          { cmd: "Merge", desc: "Объединить вершины (по центру, на первую и т.д.)", keys: "M" },
          { cmd: "Interactive Mirror", desc: "Зеркалирование по выбранной оси", keys: "Ctrl + M" },
        ] },
        { title: "Выделение (продвинутое)", rows: [
          { cmd: "Select Linked", desc: "Выделить связанную геометрию под курсором", keys: "L" },
          { cmd: "Select More", desc: "Расширить выделение на соседние элементы", keys: "Ctrl + Numpad +" },
          { cmd: "Select Less", desc: "Сузить выделение", keys: "Ctrl + Numpad −" },
        ] },
        { title: "Структура объектов", rows: [
          { cmd: "Separate", desc: "Отделить выделенное в новый объект", keys: "P" },
          { cmd: "Join", desc: "Объединить объекты в один", keys: "Ctrl + J" },
          { cmd: "Parent", desc: "Назначить объект родителем", keys: "Ctrl + P" },
          { cmd: "Clear Parent", desc: "Снять родительскую связь", keys: "Alt + P" },
          { cmd: "Duplicate Linked", desc: "Дублировать со связанными данными (инстанс)", keys: "Alt + D" },
        ] },
        { title: "Вид и привязка", rows: [
          { cmd: "Snap", desc: "Меню привязки (курсор, объект, сетка)", keys: "Shift + S" },
          { cmd: "Cursor to Origin", desc: "Сбросить 3D-курсор в центр сцены", keys: "Shift + C" },
          { cmd: "Toggle Local View", desc: "Изолировать объект от остальной сцены", keys: "Numpad /" },
          { cmd: "Toggle X-Ray", desc: "Просмотр сквозь объект", keys: "Alt + Z" },
          { cmd: "Toggle Quad View", desc: "Разделить вьюпорт на 4 стандартных вида", keys: "Ctrl + Alt + Q" },
          { cmd: "Proportional Editing", desc: "Плавное редактирование с затуханием", keys: "O" },
          { cmd: "Apply Transform", desc: "Применить перемещение / поворот / масштаб", keys: "Ctrl + A" },
        ] },
        { title: "UV и группы вершин", rows: [
          { cmd: "UV Unwrap", desc: "Развернуть UV-развёртку выделения", keys: "U", note: "в Edit Mode" },
          { cmd: "Vertex Groups", desc: "Назначить / снять группу вершин", keys: "Ctrl + G" },
        ] },
        { title: "Рендер и вывод", rows: [
          { cmd: "Render Image", desc: "Отрендерить текущий кадр", keys: "F12" },
          { cmd: "Render Animation", desc: "Отрендерить всю анимацию", keys: "Ctrl + F12" },
          { cmd: "View Render Result", desc: "Открыть окно с результатом рендера", keys: "F11" },
        ] },
        { title: "Анимация", rows: [
          { cmd: "Insert Keyframe", desc: "Вставить ключевой кадр", keys: "I", note: "Object Mode" },
          { cmd: "Delete Keyframe", desc: "Удалить ключевой кадр", keys: "Alt + I" },
          { cmd: "Next Keyframe", desc: "Перейти к следующему кейфрейму", keys: "↑" },
          { cmd: "Previous Keyframe", desc: "Перейти к предыдущему кейфрейму", keys: "↓" },
          { cmd: "Play Animation", desc: "Запустить / остановить воспроизведение", keys: "Space", note: "в Timeline" },
        ] },
        { title: "Прочее", rows: [
          { cmd: "Repeat Last", desc: "Повторить последнее действие с теми же параметрами", keys: "Shift + R" },
          { cmd: "Hide Selected", desc: "Скрыть выделенные элементы / объекты", keys: "H" },
          { cmd: "Unhide All", desc: "Показать всё скрытое", keys: "Alt + H" },
        ] },
      ],
    },
  ],
};
