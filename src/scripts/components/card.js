// @todo: Темплейт карточки
// const cardTemplatePlacesItemSelector = ".places__item";
const cardTemplate = document.querySelector("#card-template").content;

// @todo: Функция создания карточки
export function createCard(element, { onDeleteCard, onLikeCard, onOpenView }) {
  const card = cardTemplate.querySelector(".places__item").cloneNode(true);
  const cardImage = card.querySelector(".card__image");
  const cardTitle = card.querySelector(".card__title");
  const deleteButton = card.querySelector(".card__delete-button");
  const likeButton = card.querySelector(".card__like-button");

  cardImage.src = element.link;
  cardImage.alt = element.name;
  cardTitle.textContent = element.name;

  deleteButton.addEventListener("click", () => {
    onDeleteCard(card);
  });

  likeButton.addEventListener("click", () => {
    onLikeCard(likeButton);
  });

  cardImage.addEventListener("click", () => {
    onOpenView(element);
  });

  return card;
}
