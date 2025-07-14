// @todo: Темплейт карточки
// const cardTemplatePlacesItemSelector = ".places__item";
const cardTemplate = document.querySelector("#card-template").content;

// @todo: Функция создания карточки
export function createCard(
  element,
  { onDeleteCard, onLikeCard, onOpenView },
  currentUserId
) {
  const card = cardTemplate.querySelector(".places__item").cloneNode(true);
  const cardImage = card.querySelector(".card__image");
  const cardTitle = card.querySelector(".card__title");
  const deleteButton = card.querySelector(".card__delete-button");
  const likeButton = card.querySelector(".card__like-button");
  const likeCount = card.querySelector(".card__like-count");

  cardImage.src = element.link;
  cardImage.alt = element.name;
  cardTitle.textContent = element.name;
  card.dataset.id = element._id;
  likeCount.textContent = element.likes.length;

  // Устанавливаем количество лайков
  likeCount.textContent = element.likes.length;

  // Проверяем, есть ли лайк текущего пользователя
  const isLikedByMe = element.likes.some((user) => user._id === currentUserId);

  // Обновляем класс для лайка
  if (isLikedByMe) {
    likeButton.classList.add("card__like-button_is-active");
  } else {
    likeButton.classList.remove("card__like-button_is-active");
  }

  likeButton.addEventListener("click", () => {
    onLikeCard(element._id, likeButton, likeCount); // Теперь передаем все нужные элементы
  });

  if (onDeleteCard) {
    deleteButton.style.display = "block";
    deleteButton.addEventListener("click", () => {
      onDeleteCard(element._id, card); // Передаём и id, и DOM-элемент
    });
  } else {
    deleteButton.style.display = "none";
  }

  cardImage.addEventListener("click", () => {
    onOpenView(element);
  });

  return card;
}
