const popupOpendClass = "popup_is-opened";

// Универсальная функция открытия попапа
export function openModal(popupElement) {
  // Открываем нужный попап

  document.addEventListener("keydown", handleEscape);
  // popupElement.classList.add("popup_is-animated");
  // setTimeout(() => {
  //   popupElement.classList.add(popupOpendClass);
  // }, 10);

  // void popupElement.offsetWidth; // Принудительный перерасчёт
  popupElement.classList.add(popupOpendClass);
  document.addEventListener("keydown", handleEscape);
}


// Универсальная функция закрытия попапа
export function closeModal(popupElement) {
  popupElement.classList.remove(popupOpendClass);
  // Удаляем обработчики закрытия
  document.removeEventListener("keydown", handleEscape);
}

// Обработчик закрытия по ESC
function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(`.${popupOpendClass}`);
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

// Обработчик закрытия по клику на оверлей
export function handleOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.currentTarget);
  }
}

export function handleButtonClose(popup) {
  const closeButton = popup.querySelector(".popup__close");
  closeButton.addEventListener("click", () => {
    closeModal(popup);
  });
  popup.addEventListener("click", handleOverlayClick);
  popup.classList.add("popup_is-animated");
}
