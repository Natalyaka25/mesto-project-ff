import "./pages/index.css"; // добавьте импорт главного файла стилей
import "./scripts/index.js"; // добавьте импорт главного файла стилей
// import './scripts/cards.js'; // добавьте импорт главного файла стилей
// теперь картинки можно импортировать,
// вебпак добавит в переменные правильные пути
import avatarUrl from './images/avatar.jpg'; // Путь относительно файла
import closeUrl from './images/close.svg'; 

// // Пример использования
const img = [
  // меняем исходные пути на переменные
  { name: "avatarUrl", link: avatarUrl },
  { name: "closeUrl", link: closeUrl }
];
