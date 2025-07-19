// @todo: Темплейт карточки
// const cardTemplatePlacesItemSelector = ".places__item";
const cardTemplate = document.querySelector("#card-template").content;

// @todo: Функция создания карточки
export function createCard(
  cardData,
  { onDeleteCard, onLikeCard, onOpenView },
  currentUserId
) {
  const card = cardTemplate.querySelector(".places__item").cloneNode(true);
  const cardImage = card.querySelector(".card__image");
  const cardTitle = card.querySelector(".card__title");
  const deleteButton = card.querySelector(".card__delete-button");
  const likeButton = card.querySelector(".card__like-button");
  const likeCount = card.querySelector(".card__like-count");
  const likeModifier = "card__like-button_is-active";

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  card.dataset.id = cardData._id;
  likeCount.textContent = cardData.likes.length;

  // Устанавливаем количество лайков
  likeCount.textContent = cardData.likes.length;

  // Проверяем, есть ли лайк текущего пользователя
  const isLikedByMe = cardData.likes.some((user) => user._id === currentUserId);

  // Обновляем класс для лайка
  if (isLikedByMe) {
    likeButton.classList.add(likeModifier);
  } else {
    likeButton.classList.remove(likeModifier);
  }

  likeButton.addEventListener("click", () => {
    onLikeCard(cardData._id, likeButton, likeCount); // Теперь передаем все нужные элементы
  });

  if (onDeleteCard) {
    deleteButton.style.display = "block";
    deleteButton.addEventListener("click", () => {
      onDeleteCard(cardData._id, card); // Передаём и id, и DOM-элемент
    });
  } else {
    deleteButton.style.display = "none";
  }

  cardImage.addEventListener("click", () => {
    onOpenView(cardData);
  });

  return card;
}
