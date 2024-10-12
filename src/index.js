// index.js
import './pages/index.css'; // добавьте импорт главного файла стилей
import { initialCards } from './scripts/cards.js';
import { createCard, removeCardOnPage, toggleLikeCard} from './components/card.js';
import { openModal, closeModal, setCloseModalByOverlayClickListeners } from './components/modal.js';

// Сюда будут добавляться карточки
const cardsContainer = document.querySelector('.places__list');

// @todo: Вывести карточки на страницу
initialCards.forEach(function (card) {
    // Из массива initialCards передаю в качестве 1 аргумента каждый элемент массива(card), 
    // а в качестве 2 аругмента - функцию удаления, но она сработает только по клику
    // на кнопку "корзинка"(то же самое для 3 и 4 аргументов, сработают по клику), 
    // 3 аргумент - функция лайка для карточки, 4 аргумент - функция открытия большого изображения
    const cardElement = createCard(card, removeCardOnPage, toggleLikeCard, openPopupBigImage);
    cardsContainer.append(cardElement);
});

// @todo: Переменные для функции и ниже сама функция открытия большого изображения 
// для комфортного просмотра
const popupBigImage = document.querySelector('.popup_type_image');
const popupBigImagePicture = document.querySelector('.popup__image')
const popupBigImageDescription = document.querySelector('.popup__caption');

function openPopupBigImage(card) {
    popupBigImagePicture.src = card.link;
    popupBigImageDescription.textContent = card.name;
    popupBigImageDescription.alt = card.name;

    openModal(popupBigImage);
};



// МОДАЛЬНОЕ ОКНО С РЕДАКТИРОВАНИЕМ ПРОФИЛЯ

// Кнопка с редактированием профиля и попап к ней 
const buttonOpenProfile = document.querySelector('.profile__edit-button');
const popupRedactionProfile = document.querySelector('.popup_type_edit');

// ФОРМА РЕДАКТИРОВАНИЯ ПРОФИЛЯ
const formProfile = document.forms['edit-profile']; // Форма с редактированием информации о человеке 
const nameInputProfile = formProfile.elements.name; // инпут с плейсхолдером "имя"
const jobInputProfile = formProfile.elements.description; // инпут с плейсхолдером "занятие" 

const profileTitle = document.querySelector('.profile__title'); // заголовок профиля
const profileDescription = document.querySelector('.profile__description'); // занятие в профиле

// Кнопка, по которой кликнув, открывается модальное окно с редактированием профиля
buttonOpenProfile.addEventListener('click', function() {
    // Теперь даже при 1 открытии редактирования профиля, чтобы они не были пустыми, в поля инпутов 
    // идут значения из заголовка и описания-занятия(в данном случае старые значения)
    nameInputProfile.value = profileTitle.textContent;
    jobInputProfile.value = profileDescription.textContent;

    openModal(popupRedactionProfile);
});

// ФУНКЦИЯ РЕДАКТИРОВАНИЯ ПРОФИЛЯ
function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    profileTitle.textContent = nameInputProfile.value; // А здесь уже в заголовок идет новый текст из инпута с плейсхолдером "Имя"
    profileDescription.textContent = jobInputProfile.value; // То же самое, только здесь из инпута с плейсхолдером "Занятие"

    closeModal(popupRedactionProfile);
}

formProfile.addEventListener('submit', handleProfileFormSubmit);

// Все кнопки с классом pupop__close, каждая из них по клику закрывает любое модальное окно с этим классом
const buttonCloseModalWindow = document.querySelectorAll('.popup__close');

buttonCloseModalWindow.forEach((button) => {
    const popup = button.closest('.popup');
    button.addEventListener('click', () => {
        closeModal(popup);
    });
});

// Работаю с каждым попапом и вызываю функцию закрытия любого попапа по клику на оверлей
const everyPopup = document.querySelectorAll('.popup');
setCloseModalByOverlayClickListeners(everyPopup);



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

// ФУНКЦИЯ-ОБРАБОТЧИК ДОБАВЛЕНИЯ КАРТОЧКИ НА СТРАНИЦУ
function handleAddCardOnPage(evt) {
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

    const addNewCard = createCard(newCard, removeCardOnPage, toggleLikeCard, openPopupBigImage);

    // Добавляю новую карточку в начало списка карточек(append добавил бы в конец)
    cardsContainer.prepend(addNewCard);

    // Закрываю после добавления карточки на страницу модальное окно и очищаю форму методом reset
    closeModal(popupAddNewCard);
    formAddCard.reset();
};

formAddCard.addEventListener('submit', handleAddCardOnPage);

