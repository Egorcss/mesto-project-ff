// Показываем ошибку, а в функции ниже этой скрываем ошибку
const showInputError = (formElement, inputElement, validationConfig) => {
 
    inputElement.classList.add(validationConfig.inputErrorClass); // для текста ошибки

    const errorElement = formElement.querySelector(`.${inputElement.id}-error`); // для текста ошибки
    // текст ошибки в data-error-message, если бы там написали, к примеру, 
    // "Я ВАМ ЗАПРЕЩАЮ ПИСАТЬ КАПСОМ", то пользователь, писавший КАПСОМ, получил бы такой текст!
    errorElement.textContent = inputElement.validationMessage;
    errorElement.classList.add(validationConfig.errorClass); // для текста ошибки
};
  
const hideInputError = (formElement, inputElement, validationConfig) => {

    inputElement.classList.remove(validationConfig.inputErrorClass);
    
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    errorElement.textContent = '';
    errorElement.classList.remove(validationConfig.errorClass);
};
  
// Проверка валидности полей
const checkInputValidity = (formElement, inputElement, validationConfig) => {
  // Если НЕВАЛИДНО, то вызывваем функцию показа ошибки, в else наоборот
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, validationConfig);
  } 
  else {
    hideInputError(formElement, inputElement, validationConfig);
  }

  // То, что написано в data-error-message, добавляем инпуту
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } 
  else {
    inputElement.setCustomValidity("");
  }
};
  
// Ищем хотя бы одно невалидное и возвращаем его
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

// Функция переключения статуса кнопки(Валидна-Невалидна)
// здесь передаю массив всех инпутов, кнопку сабмит и объект со свойствами  
const toggleButtonStatus = (inputList, buttonSaveSubmit, validationConfig) => {
    // Если хотя бы 1 поле НЕВАЛИДНО, блокирую кнопку и добавляю стили к ошибке, соответсвенно в else наоборот
    if (hasInvalidInput(inputList)) {
      buttonSaveSubmit.setAttribute('disabled', 'true');
      buttonSaveSubmit.classList.add(validationConfig.inactiveButtonClass); // 'popup__button_disabled'
    } 
    else {
      buttonSaveSubmit.removeAttribute('disabled', 'true');
      buttonSaveSubmit.classList.remove(validationConfig.inactiveButtonClass); 
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
    inputElement.addEventListener('input', () => {
      // Форма, инпут, объект со свойствами со значениями селекторов
      checkInputValidity(formElement, inputElement, validationConfig);
      // чтобы проверять его при изменении любого из полей, здесь: массив всех инпутов, кнопка-сабмит, объект со свойствами со значениями селекторов 
      toggleButtonStatus(inputList, buttonSaveSubmit, validationConfig);
    });
  });

};

// Включаем валидацию
export const enableValidation = (validationConfig) => {
    // Создаю массив из всех форм, из validationConfig достаю форму каждого попапа(это св-во formSelector)
    const formList = Array.from(document.querySelectorAll(validationConfig.formSelector)); // т.е. '.popup__form'

    formList.forEach((formElement) => {
      formElement.addEventListener('submit', function (evt) {
        evt.preventDefault();
      });
      // Ну а дальше матрешка! Из одного попадаем в другое и так далее!)
      // Работаем с каждой формой
      setEventListeners(formElement, validationConfig);
    });

};

// Для очистки ошибок формы
export const clearValidation = (formElement, validationConfig) => {

  const buttonSaveSubmit = formElement.querySelector(validationConfig.submitButtonSelector); // Кнопка-сабмит "Сохранить"
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector)); // Массив с инпутами

  inputList.forEach((inputElement) => {
    // Ничего не задаем
    inputElement.setCustomValidity("");
    hideInputError(formElement, inputElement, validationConfig);
  });
  
  toggleButtonStatus(inputList, buttonSaveSubmit, validationConfig);

};  

