// import { initialCards } from "./cards.js";
import { createCard } from "./components/card.js";
import {
  openModal,
  closeModal,
  handleButtonClose,
} from "./components/modal.js";

import { enableValidation, clearValidation } from "./components/validation.js";

import {
  getUserInfo,
  getInitialCards,
  patchProfile,
  postCard,
  deleteCard,
  likeCard,
  unlikeCard,
  patchProfileAvatare,
} from "./components/api.js";

// @todo: DOM узлы
const contentList = document.querySelector(".places__list");
const openButtonCard = document.querySelector(".profile__add-button"); // Кнопка открытия поапа для добавления карточек
const openButtonProfile = document.querySelector(".profile__edit-button"); // Кнопка открытия поапа для редактирования поофиля
const popups = document.querySelectorAll(".popup"); // Все кнопки закрытия

// DOM узлы профиля
const popupProfile = document.querySelector(".popup_type_edit"); //popup профиля
const formElementProfile = document.forms["edit-profile"]; //форма для редактирования профиля
const nameInput = formElementProfile.querySelector(".popup__input_type_name"); // поле ввода имени
const jobInput = formElementProfile.querySelector(
  ".popup__input_type_description"
); // поле ввода занятия
const profileName = document.querySelector(".profile__title"); // имя профиля на странице
const profileJob = document.querySelector(".profile__description"); // занятие в профиле на странице

//  DOM узлы карточек
const popupCardAdd = document.querySelector(".popup_type_new-card"); //popup карточки
const formElementCard = document.forms["new-place"]; //форма для добавления карточки
const placeInput = formElementCard.querySelector(
  ".popup__input_type_card-name"
); // поле ввода наименования
const linkInput = formElementCard.querySelector(".popup__input_type_url"); // поле ввода страницы
const imagePopup = document.querySelector(".popup_type_image"); //popup для открытия карточки
const imageView = imagePopup.querySelector(".popup__image"); //popup картинки
const captionView = imagePopup.querySelector(".popup__caption"); //popup наименования

const classValidate = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

let currentUserId;
let cardCallbacks = {
  onDeleteCard: null,
  onLikeCard: null,
  onOpenView: null,
};

// Функция для обновления колбэков
function updateCardCallbacks(card) {
  const isMyCard = card.owner._id === currentUserId;
  cardCallbacks = {
    onDeleteCard: isMyCard ? () => handleCardDelete(card._id, card) : null,
    onLikeCard: handleCardLike,
    onOpenView: handleOpenView,
  };
}

// Создаем массив промисов
const promises = [
  getUserInfo(), // Запрос данных пользователя
  getInitialCards(), // Запрос карточек
];

// Загружаем профиль при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  getUserInfo()
    .then((userData) => {
      profileName.textContent = userData.name;
      profileJob.textContent = userData.about;
      openProfileAvatar.style.backgroundImage = `url('${userData.avatar}')`;
    })
    .catch(console.error);
});

/** Функция добавления карточки **/
function handleAddCardFormSubmit(evt) {
  evt.preventDefault();

  // Получаем данные из формы
  const name = placeInput.value;
  const link = linkInput.value;

  postCard(name, link)
    .then((newCard) => {
      console.log("Карточка создана:", newCard);
      // Проверяем, является ли текущий пользователь владельцем карточки
      updateCardCallbacks(newCard);
      const cardElement = createCard(newCard, cardCallbacks);
      contentList.prepend(cardElement);
    })
    .catch((error) => {
      console.error("Не удалось создать карточку:", error); // Cообщение об ошибке
    });

  closeModal(popupCardAdd); // Очищаем форму и закрываем попап
}

/**  Функция удаления карточки **/
function handleCardDelete(cardId) {
  const cardElement = contentList.querySelector(`[data-id="${cardId}"]`);
  if (!cardId || !cardElement) {
    console.error("Недостаточно данных для удаления:", { cardId, cardElement });
    return Promise.reject("Invalid data");
  }

  return deleteCard(cardId)
    .then(() => {
      cardElement.remove();
      return true; // Успешное удаление
    })
    .catch((err) => {
      console.error("Ошибка удаления:", err);
      throw err; // Пробрасываем ошибку дальше
    });
}

// Обработчик клика на лайк
function handleCardLike(cardId, likeButton, likesCounter) {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  (isLiked ? unlikeCard(cardId) : likeCard(cardId))
    .then((card) => {
      likesCounter.textContent = card.likes.length;
      likeButton.classList.toggle("card__like-button_is-active");
    })
    .catch((err) => {
      console.error(err);
    });
}

/** Функция открытия карточки popup **/
function handleOpenView({ name, link }) {
  imageView.src = link;
  imageView.alt = name;
  captionView.textContent = name;
  openModal(imagePopup);
}
/* Функция изменения профиля */
function handleFormProfileSubmit(evt) {
  evt.preventDefault(); // Отмена стандартной отправки формы
  // Получение значений полей jobInput и nameInput из свойства value
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;
  patchProfile(nameValue, jobValue)
    .then((data) => {
      // console.log("Успешное обновление профиля:", jobValue); Удалить
      profileName.textContent = data.name;
      profileJob.textContent = data.about;
      closeModal(popupProfile);
    })
    .catch((error) => {
      console.error("Ошибка при обновлении профиля:", error);
    });
}

//** Вызов валидации */
// enableValidation(classValidate);

// Обработчики открытия профиля
openButtonProfile.addEventListener("click", () => {
  getUserInfo().then((userData) => {
    nameInput.value = userData.name;
    jobInput.value = userData.about;
    });
  clearValidation(formElementProfile, classValidate);
  openModal(popupProfile);
});

// Обработчики открытия карточки
openButtonCard.addEventListener("click", () => {
  formElementCard.reset();
  clearValidation(formElementCard, classValidate);
  clearValidation(formElementProfile, classValidate);
  openModal(popupCardAdd);
});

// Назначаем обработчики закрытия на все кнопки закрытия
popups.forEach(handleButtonClose);

// Назначаем обработчики открытия изменения профиля
formElementProfile.addEventListener("submit", handleFormProfileSubmit);

// Назначаем обработчики добавления карточки
formElementCard.addEventListener("submit", (evt) => {
  handleAddCardFormSubmit(evt);
});

//  Выводим карточки на страницу
Promise.all(promises)
  .then(([userData, cards]) => {
    currentUserId = userData._id; // Сохраняем ID текущего пользователя
    cards.forEach((card) => {
      // Создаем карточку с нужными колбэками
      // Проверяем, является ли текущий пользователь владельцем карточки
      updateCardCallbacks(card);
      const cardElement = createCard(card, cardCallbacks, currentUserId);
      contentList.append(cardElement);
    });
  })
  .catch((err) => console.error("Ошибка загрузки:", err));


  const formProfileAvatar = document.forms["edit-avatar"];
  const avatarInput = formProfileAvatar.querySelector(".popup__input_type_avatar");
  const popupProfileAvatar = document.querySelector(".popup_type_edit-avatar");
  const openProfileAvatar = document.querySelector(".profile__image");


// Обработчики открытия модального окна аватара



// Открытие попапа
openProfileAvatar.addEventListener("click", () => {
  openModal(popupProfileAvatar);
});

// Обработка отправки формы
formProfileAvatar.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const linkAvatar = avatarInput.value.trim();
  console.log(linkAvatar);
  
  // Валидация URL
  if (!isValidUrl(linkAvatar)) {
    alert("Пожалуйста, введите корректную ссылку на изображение");
    return;
  }

  patchProfileAvatare(linkAvatar)
    .then((data) => {
      openProfileAvatar.style.backgroundImage = `url('${data.avatar}')`;
      closeModal(popupProfileAvatar); // Закрываем попап
      formProfileAvatar.reset(); // Очищаем форму
    })
    .catch((error) => {
      console.error('Ошибка:', error);
      alert(error.message || "Не удалось обновить аватар");
    });
});

// Функция проверки URL
function isValidUrl(url) {
  try {
    new URL(url);
    return /^https?:\/\/.+(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/i.test(url);
  } catch {
    return false;
  }
}