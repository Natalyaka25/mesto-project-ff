// import { initialCards } from "./cards.js";
import { createCard, handleCardLike } from "./components/card.js";
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
// профиль
const formProfileAvatar = document.forms["edit-avatar"];
const avatarInput = formProfileAvatar.querySelector(
  ".popup__input_type_avatar"
);
const popupProfileAvatar = document.querySelector(".popup_type_edit-avatar");
const openProfileAvatar = document.querySelector(".profile__image");

const cardSubmitButton = formElementCard.querySelector(".popup__button");
const profileSubmitButton = formElementProfile.querySelector(".popup__button");
const avatwrSubmitButton = formProfileAvatar.querySelector(".popup__button");

const classValidate = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

let currentUserId = null;

let cardCallbacks = {
  onDeleteCard: null,
  onLikeCard: null,
  onOpenView: null,
};

enableValidation(classValidate);

// Функция для обновления колбэков
cardCallbacks = {
  onDeleteCard: handleCardDelete,
  onLikeCard: handleCardLike,
  onOpenView: handleOpenView,
};

// Создаем массив промисов
const promises = [
  getUserInfo(), // Запрос данных пользователя
  getInitialCards(), // Запрос карточек
];

/** Функция состояния загрузки для кнопки */
function renderLoading(button, isLoading, loadingText = "Сохранение...") {
  button.disabled = isLoading;
  button.textContent = isLoading
    ? loadingText
    : button.dataset.defaultText || "Сохранить";
}

/** Функция добавления карточки **/
function handleAddCardFormSubmit(evt) {
  evt.preventDefault();

  renderLoading(cardSubmitButton, true);

  // Получаем данные из формы
  const name = placeInput.value;
  const link = linkInput.value;

  postCard(name, link)
    .then((newCard) => {
      console.log("Карточка создана:", newCard);
      const cardElement = createCard(newCard, cardCallbacks, currentUserId);
      contentList.prepend(cardElement);
      closeModal(popupCardAdd); // Очищаем форму и закрываем попап
    })
    .catch((error) => {
      console.error("Не удалось создать карточку:", error); // Cообщение об ошибке
    })
    .finally(function () {
      // Восстанавливаем кнопку
      renderLoading(cardSubmitButton, false);
    });
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
  renderLoading(profileSubmitButton, true);

  // Получение значений полей jobInput и nameInput из свойства value
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;
  patchProfile(nameValue, jobValue)
    .then((data) => {
      profileName.textContent = data.name;
      profileJob.textContent = data.about;
      closeModal(popupProfile);
    })
    .catch((error) => {
      console.error("Ошибка при обновлении профиля:", error);
    })
    .finally(function () {
      // Восстанавливаем кнопку
      renderLoading(profileSubmitButton, false);
    });
}

/** Функция обновления профиля аватара */
function handleAvatarEdit(evt) {
  evt.preventDefault(); // Отменяем стандартную отправку формы

  const linkAvatar = avatarInput.value.trim();
  renderLoading(avatwrSubmitButton, true);

  // Отправляем запрос на сервер
  patchProfileAvatare(linkAvatar)
    .then(function (data) {
      // Успех: обновляем аватар и закрываем попап
      openProfileAvatar.style.backgroundImage = `url('${data.avatar}')`;
      formProfileAvatar.reset(); // Очищаем форму
      closeModal(popupProfileAvatar); // Закрываем попап
    })
    .catch(function (error) {
      // Ошибка: выводим сообщение
      console.error("Ошибка:", error);
      alert("Не удалось обновить аватар");
    })
    .finally(function () {
      // Восстанавливаем кнопку
      renderLoading(avatwrSubmitButton, false);
    });
}

// Обработчики открытия профиля
openButtonProfile.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  clearValidation(formElementProfile, classValidate);
  openModal(popupProfile);
});

// Обработчики открытия карточки
openButtonCard.addEventListener("click", () => {
  formElementCard.reset(); 
  clearValidation(formElementCard, classValidate); 
  openModal(popupCardAdd);
});

// Назначаем обработчики открытия изменения профиля
formElementProfile.addEventListener("submit", handleFormProfileSubmit);

// Назначаем обработчики добавления карточки
formElementCard.addEventListener("submit", (evt) => {
  handleAddCardFormSubmit(evt);
});

// Открытие модального окна для профиля
openProfileAvatar.addEventListener("click", () => {
  formProfileAvatar.reset();
  clearValidation(popupProfileAvatar, classValidate);
  openModal(popupProfileAvatar);
});

// добавление обработчика для профиля
formProfileAvatar.addEventListener("submit", handleAvatarEdit);

// Назначаем обработчики закрытия на все кнопки закрытия
popups.forEach(handleButtonClose);

//  Выводим карточки на страницу
Promise.all(promises)
  .then(([userData, cards]) => {
    currentUserId = userData._id; // Сохраняем ID текущего пользователя
    profileName.textContent = userData.name;
    profileJob.textContent = userData.about;
    openProfileAvatar.style.backgroundImage = `url('${userData.avatar}')`;
    cards.forEach((card) => {
      // Создаем карточку с нужными колбэками
      // Проверяем, является ли текущий пользователь владельцем карточки

      const cardElement = createCard(card, cardCallbacks, currentUserId);
      contentList.append(cardElement);
    });
  })
  .catch((err) => console.error("Ошибка загрузки:", err));

/****************************************************************************************************/
