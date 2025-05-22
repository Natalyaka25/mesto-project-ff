// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;
const cardTemplatePlacesItemSelector = '.places__item';
const cardTemplateImageSelector = '.card__image';
const cardTemplateTitleSelector = '.card__title';
const cardTemplateDeleteButtonSelector = '.card__delete-button';


// @todo: DOM узлы
const content = document.querySelector(".content");
const contentList = content.querySelector(".places__list");

// @todo: Функция создания карточки
function createCard(element, onDeleteCard) {
  const card = cardTemplate.querySelector(cardTemplatePlacesItemSelector).cloneNode(true);
  const cardImage = card.querySelector(cardTemplateImageSelector);
  const cardTitle = card.querySelector(cardTemplateTitleSelector);
  cardImage.src = element.link;
  cardImage.alt = element.name;
  cardTitle.textContent = element.name;

  const deleteButton = card.querySelector(cardTemplateDeleteButtonSelector);
  deleteButton.addEventListener("click", onDeleteCard);
  return card;
}

// @todo: Функция удаления карточки
function handleCardDelete(evt) {
  const card = evt.target.closest(cardTemplatePlacesItemSelector);
  card.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach(function (element) {
  const card = createCard(element, handleCardDelete);
  contentList.append(card);
});
