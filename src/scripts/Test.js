
import {
  openModal,
} from "./components/modal.js";

// Универсальные функции для управления состоянием кнопки
function setButtonState(buttonElement, { isLoading, text }) {
  buttonElement.disabled = isLoading;
  buttonElement.textContent = text;

}

function handleSubmit(request, evt, formElement, loadingText = 'Сохранение...') {
  evt.preventDefault();
  const submitButton = formElement.querySelector('.popup__button');
  
  // Сохраняем оригинальный текст кнопки в data-атрибут
  if (!submitButton.dataset.originalText) {
    submitButton.dataset.originalText = submitButton.textContent;
  }

  // Устанавливаем состояние "загрузка"
  setButtonState(submitButton, {
    isLoading: true,
    text: loadingText
  });

  // Выполняем запрос
  request()
    .then(() => {
      // Закрываем попап после успешного выполнения
      const popup = formElement.closest('.popup');
      if (popup) {
        closeModal(popup);
      }
    })
    .catch((err) => {
      console.error(`Ошибка: ${err}`);
      // Можно добавить более красивый вывод ошибки
      alert('Произошла ошибка при сохранении');
    })
    .finally(() => {
      // Восстанавливаем кнопку
      setButtonState(submitButton, {
        isLoading: false,
        text: submitButton.dataset.originalText
      });
    });
}

// Пример использования для формы аватара
function handleAvatarEdit(evt) {
  handleSubmit(
    () => patchProfileAvatare(linkAvatar.value), // Функция, возвращающая промис
    evt,
    formProfileAvatar,
    'Обновление...' // Можно задать свой текст для каждой формы
  );
}

// Пример использования для формы профиля
function handleProfileFormSubmit(evt) {
  handleSubmit(
    () => patchProfile({
      name: nameInput.value,
      about: jobInput.value
    }),
    evt,
    formElementProfile,
    'Сохранение...'
  );
}