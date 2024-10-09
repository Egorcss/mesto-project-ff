// index.js
import './pages/index.css'; // добавьте импорт главного файла стилей
import { initialCards } from './scripts/cards.js';
import { createCard, removeCardOnPage, addLikeCard} from './components/card.js';
import { openModal, closeModal } from './components/modal.js';

// Сюда будут добавляться карточки
const placesList = document.querySelector('.places__list');

// @todo: Вывести карточки на страницу
initialCards.forEach(function (card) {
    // Из массива initialCards передаю в качестве 1 аргумента каждый элемент массива(card), 
    // а в качестве 2 аругмента - функцию удаления, но она сработает только по клику
    // на кнопку "корзинка"(то же самое для 3 и 4 аргументов, сработают по клику), 
    // 3 аргумент - функция лайка для карточки, 4 аргумент - функция открытия большого изображения
    const cardElement = createCard(card, removeCardOnPage, addLikeCard, openPopupBigImage);
    placesList.append(cardElement);
});

// @todo: Переменные для функции и ниже сама функция открытия большого изображения 
// для комфортного просмотра
const popupBigImage = document.querySelector('.popup_type_image');
const popupBigImagePicture = document.querySelector('.popup__image')
const popupBigImageDescription = document.querySelector('.popup__caption');

function openPopupBigImage(card) {
    popupBigImagePicture.src = card.link;
    popupBigImageDescription.textContent = card.name;

    openModal(popupBigImage);
};



// МОДАЛЬНОЕ ОКНО С РЕДАКТИРОВАНИЕМ ПРОФИЛЯ

// Кнопка с редактированием профиля и попап к ней 
const buttonOpenProfile = document.querySelector('.profile__edit-button');
const popupRedactionProfile = document.querySelector('.popup_type_edit');

// Кнопка, по которой кликнув, открывается модальное окно с редактированием профиля
buttonOpenProfile.addEventListener('click', function() {
    openModal(popupRedactionProfile);
});

// ФОРМА РЕДАКТИРОВАНИЯ ПРОФИЛЯ

const formProfile = document.forms['edit-profile']; // Форма с редактированием информации о человеке 
const nameInputProfile = formProfile.elements.name; // инпут с плейсхолдером "имя"
const jobInputProfile = formProfile.elements.description; // инпут с плейсхолдером "занятие" 

// ФУНКЦИЯ РЕДАКТИРОВАНИЯ ПРОФИЛЯ
function handleFormSubmit(evt) {
    evt.preventDefault();

    const name = nameInputProfile.value; // значение поля "имя"
    const job = jobInputProfile.value; // значение поля "занятие"

    const profileTitle = document.querySelector('.profile__title'); // заголовок профиля
    const profileDescription = document.querySelector('.profile__description'); // занятие в профиле

    profileTitle.textContent = name; // значение поля "имя" помещаю в текст заголовка профиля
    profileDescription.textContent = job; // значение поля "занятие" помещаю в текст занятия в профиле

    closeModal(popupRedactionProfile);
}

formProfile.addEventListener('submit', handleFormSubmit);

// Все кнопки с классом pupop__close, каждая из них по клику закрывает любое модальное окно с этим классом
const buttonCloseModalWindow = document.querySelectorAll('.popup__close');

buttonCloseModalWindow.forEach((button) => {
    const popup = button.closest('.popup');
    button.addEventListener('click', () => {
        closeModal(popup);
    });
});

// Работаю с каждым попапом
const everyPopup = document.querySelectorAll('.popup');

// Перебираю каждый попап, если по клику на выбранный попап, у него имеется(contains) класс popup_is-opened,
// то выбранный попап(по клику) передается в функцию closeModal
everyPopup.forEach(popup => {
    popup.addEventListener('click', (evt) => {
        if (evt.target.classList.contains('popup_is-opened')) {
            // Метод closest говорит: "дай мне ближайший класс, указаного в скобках". Этот метод позволяет выбрать 
            // ближайший элемент-предок, который соответствует указанному селектору CSS(то есть .popup)
            closeModal(evt.target.closest('.popup_is-opened'));
        };
    });
    // Добавляю класс для всех попапов с приятной анимацией, благодаря использованию таких свойств, как
    // transition, visibility, opacity
    popup.classList.add('popup_is-animated');
});



// МОДАЛЬНОЕ ОКНО ДОБАВЛЕНИЯ КАРТОЧКИ НА СТРАНИЦУ

// Кнопка "+" и сам попап новой карточки
const buttonAddNewCard = document.querySelector('.profile__add-button');
const popupAddNewCard = document.querySelector('.popup_type_new-card');

buttonAddNewCard.addEventListener('click', function() {
    openModal(popupAddNewCard)
});

// ФОРМА ДОБАВЛЕНИЯ НОВОЙ КАРТОЧКИ НА СТРАНИЦУ, А ТАКЖЕ ИНПУТЫ С ПЛЕЙСХОЛДЕРАМИ "НАЗВАНИЕ" И "ССЫЛКА НА КАРТИНКУ"

const formAddCard = document.forms['new-place'];
const titleInputAddCard = formAddCard.elements['place-name'];
const linkInputAddCard = formAddCard.elements.link;

// ФУНКЦИЯ ДОБАВЛЕНИЯ КАРТОЧКИ НА СТРАНИЦУ
function addCardOnPage(evt) {
    evt.preventDefault();

    // Заголовок и ссылка для новой карточки
    const titleForCard = titleInputAddCard.value;
    const linkForCard = linkInputAddCard.value;

    // Создаю объект newCard, так как нужно одним элементом передать в функцию создания карточки, 
    // просто передать titleForCard и linkForCard не получится
    const newCard = {
        name: titleForCard,
        link: linkForCard
    };    

    const addNewCard = createCard(newCard, removeCardOnPage, addLikeCard, openPopupBigImage);

    // Добавляю новую карточку в начало списка карточек(append добавил бы в конец)
    placesList.prepend(addNewCard);

    // Закрываю после добавления карточки на страницу модальное окно и очищаю форму методом reset
    closeModal(popupAddNewCard);
    formAddCard.reset();
};

formAddCard.addEventListener('submit', addCardOnPage);

