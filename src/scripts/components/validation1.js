// включение валидации вызовом enableValidation
// все настройки передаются при вызове

export const config  = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add('form__input_type_error');
  errorElement.textContent = errorMessage;
  errorElement.classList.add('form__input-error_active');
};



//Вщзвращает true если хотябы один элемент невалидный
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

const hideInputError = (formElement, inputElement, element) => {
const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  // Остальной код такой же
  inputElement.classList.remove(element.inputErrorClass);
  errorElement.classList.remove(element.errorClass);
  errorElement.textContent = '';
}

//Функция блокировки кнопки
const toggleButtonState = (inputList, buttonElement, element) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
   buttonElement.classList.add(element.inactiveButtonClass)
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(element.inactiveButtonClass)
  };
}

const isValid = (formElement, inputElement) => { 
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  };
}

//Добавление обработчика всем полям формы
const setEventListeners = (formElement, element) => {
  const inputList = Array.from(formElement.querySelectorAll(element.inputSelector));
  const buttonElement = formElement.querySelector(element.submitButtonSelector) 
  toggleButtonState(inputList, buttonElement, element)
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input',() =>{
      isValid(formElement,inputElement)
      toggleButtonState(inputList, buttonElement, element)
    });
  });
}; 

// Добавление обработчика всем формам
export const enableValidation = (element) => {
  const formList = Array.from(document.querySelectorAll(element.formSelector));
  formList.forEach((fomElement) =>{
    setEventListeners(fomElement, element);
  });
}








