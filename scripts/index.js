// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const content = document.querySelector('.content');
const contentList = content.querySelector('.places__list');

// @todo: Функция создания карточки
function createCard(element) {
    const card = cardTemplate.querySelector('.places__item').cloneNode(true);
    card.querySelector('.card__image').src = element.link;
    card.querySelector('.card__image').alt = element.name;
    card.querySelector('.card__title').textContent = element.name;
    const deleteButton = card.querySelector('.card__delete-button')
    deleteButton.addEventListener('click', deleteCard);
    return card;
}

// @todo: Функция удаления карточки
function deleteCard(evt) {
    const card = evt.target.closest('.places__item');
    card.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach(function (element) {
    const card = createCard(element);
    contentList.append(card);
})
