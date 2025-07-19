const showInputError = (
  formElement,
  inputElement,
  errorMessage,
  { inputErrorClass, errorClass }
) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(errorClass);
};

const hideInputError = (
  formElement,
  inputElement,
  { inputErrorClass, errorClass }
) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) return;

  inputElement.classList.remove(inputErrorClass);
  errorElement.classList.remove(errorClass);
  errorElement.textContent = "";
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => !inputElement.validity.valid);
};

const setButtonState = (button, { inactiveButtonClass }, isDisabled) => {
  if (!button) return;
  button.disabled = isDisabled;
  button.classList.toggle(inactiveButtonClass, isDisabled);
};

const toggleButtonState = (inputList, buttonElement, config) => {
  const isInvalid = hasInvalidInput(inputList);
  setButtonState(buttonElement, config, isInvalid);
};

const isValid = (formElement, inputElement, classValidate) => {
  // Сбрасываем кастомные ошибки
  inputElement.setCustomValidity("");

  // Проверка на пустое поле (только если поле обязательно)
  if (inputElement.required && inputElement.value.trim() === "") {
    const errorMessage = inputElement.dataset.errorEmpty;
    inputElement.setCustomValidity(errorMessage);
    showInputError(formElement, inputElement, errorMessage, classValidate);
    return false;
  }

  // Проверка регулярного выражения (только для кастомных проверок)
  if (inputElement.dataset.validatePattern) {
    const patternRegex = new RegExp(inputElement.dataset.validatePattern);
    if (!patternRegex.test(inputElement.value)) {
      const errorMessage = inputElement.dataset.errorFormat;
      inputElement.setCustomValidity(errorMessage);
      showInputError(formElement, inputElement, errorMessage, classValidate);
      return false;
    }
  }

  // Встроенная валидация браузера
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage, // Браузер сам подставит правильное сообщение о длине
      classValidate
    );
    return false;
  }

  hideInputError(formElement, inputElement, classValidate);
  return true;
};

const setEventListeners = (formElement, classValidate) => {
  const inputList = Array.from(
    formElement.querySelectorAll(classValidate.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    classValidate.submitButtonSelector
  );

  // Добавляем проверку при инициализации
  toggleButtonState(inputList, buttonElement, classValidate);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      isValid(formElement, inputElement, classValidate);
      toggleButtonState(inputList, buttonElement, classValidate);
    });

    // Добавляем проверку при потере фокуса
    inputElement.addEventListener("blur", () => {
      isValid(formElement, inputElement, classValidate);
    });
  });
};

export const resetValidation = (formElement, classValidate) => {
  const inputList = Array.from(
    formElement.querySelectorAll(classValidate.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    classValidate.submitButtonSelector
  );

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, classValidate);
  });

  setButtonState(buttonElement, classValidate, true);
};

export const enableValidation = (classValidate) => {
  const formList = Array.from(
    document.querySelectorAll(classValidate.formSelector)
  );
  formList.forEach((formElement) => {
    setEventListeners(formElement, classValidate);
  });
};

export const clearValidation = (formElement, classValidate) => {
  // Находим все поля ввода
  const inputList = Array.from(
    formElement.querySelectorAll(classValidate.inputSelector)
  );
  // Находим кнопку отправки
  const buttonElement = formElement.querySelector(
    classValidate.submitButtonSelector
  );

  // Очищаем ошибки для всех полей
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, classValidate);
    inputElement.setCustomValidity("");
  });

  // Делаем кнопку неактивной
  setButtonState(buttonElement, classValidate, true);
};
