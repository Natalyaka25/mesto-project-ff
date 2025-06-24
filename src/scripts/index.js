import { initialCards } from "./cards.js";
import { createCard } from "./components/card.js";
import {
  openModal,
  closeModal,
  handleButtonClose,
} from "./components/modal.js";

// @todo: DOM узлы

const contentList = document.querySelector(".places__list");
const openButtonCard = document.querySelector(".profile__add-button"); // Кнопка открытия поапа для добавления карточек
const openButtonProfile = document.querySelector(".profile__edit-button"); // Кнопка открытия поапа для редактирования поофиля
const popups = document.querySelectorAll(".popup"); // Все кнопки закрытия

// DOM узлы профиля
const popupProfile = document.querySelector(".popup_type_edit"); //popup профиля
const formElementProfile = document.forms["edit-profile"]; //форма для редактирования профиля
const nameInput = formElementProfile.querySelector(".popup__input_type_name"); // поле ввода имени
const jobInput = formElementProfile.querySelector(".popup__input_type_description"); // поле ввода занятия
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

// @todo: Функция удаления карточки
function handleCardDelete(card) {
  card.remove();
}

// @todo: Функция лайка
function handleCardLike(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}

// @todo: Функция открытия карточки popup
function handleOpenView({ name, link }) {
  imageView.src = link;
  imageView.alt = name;
  captionView.textContent = name;
  openModal(imagePopup);
}

const cardCallbacks = {
  onDeleteCard: handleCardDelete,
  onLikeCard: handleCardLike,
  onOpenView: handleOpenView,
};

// функця добавления карточки
function handleAddCardFormSubmit(evt) {
  evt.preventDefault();

  // Получаем данные из формы
  const name = placeInput.value;
  const link = linkInput.value;

  // Создаем и добавляем карточку
  const cardElement = createCard({ name, link }, cardCallbacks);
  contentList.prepend(cardElement);

  // Очищаем форму и закрываем попап
  closeModal(popupCardAdd);
}

function handleFormProfileSubmit(evt) {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.
  // Так мы можем определить свою логику отправки.
  // О том, как это делать, расскажем позже.
  // Получите значение полей jobInput и nameInput из свойства value
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;
  // Выберите элементы, куда должны быть вставлены значения полей
  // Вставьте новые значения с помощью textContent
  profileName.textContent = nameValue;
  profileJob.textContent = jobValue;
  closeModal(popupProfile);
}

// Назначаем обработчики открытия
openButtonProfile.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  openModal(popupProfile);
});

openButtonCard.addEventListener("click", () => {
  formElementCard.reset();
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

// @todo: Вывести карточки на страницу
initialCards.forEach(function (element) {
  const card = createCard(element, cardCallbacks);
  contentList.append(card);
});
