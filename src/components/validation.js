const showInputError = (formElement, inputElement, validationConfig) => {
 
    inputElement.classList.add(validationConfig.inputErrorClass); // текст ошибки
  
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    errorElement.classList.add(validationConfig.errorClass); // показ текста ошибки
    errorElement.textContent = inputElement.validationMessage;
};
  
const hideInputError = (formElement, inputElement, validationConfig) => {

    inputElement.classList.remove(validationConfig.inputErrorClass);

    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    errorElement.classList.remove(validationConfig.errorClass);
    errorElement.textContent = '';
};
  
const checkInputValidity = (formElement, inputElement, validationConfig) => {
    if (!inputElement.validity.valid) {
      showInputError(formElement, inputElement, validationConfig);
    } 
    else {
      hideInputError(formElement, inputElement, validationConfig);
    }

    if (inputElement.validity.patternMismatch) {
      inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } 
    else {
      inputElement.setCustomValidity("");
    }
};
  
const setEventListeners = (formElement, validationConfig) => {
    // Создаю массив всех инпутов из данной формы, именно ТЕКУЩЕЙ(formElement) формы
    const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector)); // каждый инпут, т.е. '.popup__input'
    // Кнопка-сабмит "Сохранить"
    const buttonSaveSubmit = formElement.querySelector(validationConfig.submitButtonSelector); // Кнопка-сабмит "Сохранить" '.popup__button'
    
    // Сразу вызываем, чтобы была изначально неактивна кнопка(ведь форма в этот момент НЕВАЛИДНА)
    toggleButtonStatus(inputList, buttonSaveSubmit, validationConfig);
  
    inputList.forEach((inputElement) => {
      // По каждому клику по клавиатуре идет сработка 2 функций ниже
      inputElement.addEventListener('input', function () {
        // Форма, инпут, объект со свойствами со значениями селекторов
        checkInputValidity(formElement, inputElement, validationConfig);
        // чтобы проверять его при изменении любого из полей, здесь: массив всех инпутов, кнопка-сабмит, объект со свойствами со значениями селекторов 
        toggleButtonStatus(inputList, buttonSaveSubmit, validationConfig);
      });
    });
  
};
  
// Функция переключения статуса кнопки(Валидна-Невалидна)
// здесь передаю массив всех инпутов, кнопку сабмит и объект со свойствами  
const toggleButtonStatus = (inputList, buttonSaveSubmit, validationConfig) => {
    // Если хотя бы 1 поле НЕВАЛИДНО, блокирую кнопку и добавляю стили к ошибке, соответсвенно в else наоборот
    if (hasInvalidInput(inputList)) {
      buttonSaveSubmit.classList.add(validationConfig.inactiveButtonClass);
      buttonSaveSubmit.setAttribute("disabled", "true");
    } 
    else {
      buttonSaveSubmit.classList.remove(validationConfig.inactiveButtonClass);
      buttonSaveSubmit.setAttribute("disabled", "false");
    }
};

// Ищем хотя бы одно невалидное
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};
  
export const enableValidation = (validationConfig) => {
    // Создаю массив из всех форм, из validationConfig достаю форму каждого попапа(это св-во formSelector)
    const formList = Array.from(document.querySelectorAll(validationConfig.formSelector)); // т.е. '.popup__form'

    formList.forEach((formElement) => {
      formElement.addEventListener('submit', function (evt) {
        evt.preventDefault();
      });

      setEventListeners(formElement, validationConfig);
    });

};
  
export const clearValidation = (formElement, validationConfig) => {

  const buttonSaveSubmit = formElement.querySelector(validationConfig.submitButtonSelector);
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));

  inputList.forEach((inputElement) => {
    inputElement.setCustomValidity("");
    hideInputError(formElement, inputElement, validationConfig);
  });
  
  toggleButtonStatus(inputList, buttonSaveSubmit, validationConfig);

};  

