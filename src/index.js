// index.js
import './pages/index.css'; // добавьте импорт главного файла стилей

import { createCard, removeCardOnPage, toggleLikeCard} from './components/card.js';

import { openModal, closeModal, setCloseModalByOverlayClickListeners } from './components/modal.js';

import { enableValidation, clearValidation } from './components/validation.js';

import { 
    editUserAvatar,
    getUserInfo, 
    updateUserInfo, 
    getInitialCards, 
    addCard, 
    deleteCard, 
    likeCard, 
    unLikeCard 
} from './components/api.js';

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

// Сюда будут добавляться карточки
const cardsContainer = document.querySelector('.places__list');

// @todo: Переменные для функции и ниже сама функция открытия большого изображения 
// для комфортного просмотра
const popupBigImage = document.querySelector('.popup_type_image');
const popupBigImagePicture = document.querySelector('.popup__image')
const popupBigImageDescription = document.querySelector('.popup__caption');

function openPopupBigImage(title, link) {
    popupBigImagePicture.src = link;
    popupBigImageDescription.textContent = title;
    popupBigImageDescription.alt = title;

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
    clearValidation(popupRedactionProfile, validationConfig);
});

// ФУНКЦИЯ РЕДАКТИРОВАНИЯ ПРОФИЛЯ
function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    updateUserInfo(nameInputProfile.value, jobInputProfile.value)
    .then(data => {
        profileTitle.textContent = data.name;
        profileDescription.textContent = data.about;
    })
    .catch(error => {
        console.log('There was some error, please verify //', error)
    })

    closeModal(popupRedactionProfile);
    // formProfile.reset();
}

formProfile.addEventListener('submit', handleProfileFormSubmit);



// МОДАЛЬНОЕ ОКНО ДОБАВЛЕНИЯ КАРТОЧКИ НА СТРАНИЦУ

// Кнопка "+" и сам попап новой карточки
const buttonAddNewCard = document.querySelector('.profile__add-button');
const popupAddNewCard = document.querySelector('.popup_type_new-card');

buttonAddNewCard.addEventListener('click', function() {
    openModal(popupAddNewCard);
    formAddCard.reset();
    clearValidation(popupAddNewCard, validationConfig);
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

    addCard(newCard.name, newCard.link)
    .then((data) => {

        const cardId = data._id;
        cardsContainer.prepend(createCard(
          newCard.name,
          newCard.link,
          deleteCard,
          openPopupBigImage,
          data.likes,
          profileId,
          data.owner._id,
          cardId,
          likeCard,
          unLikeCard,
          removeCardOnPage,
          toggleLikeCard
        ));
    })
    .catch((error) => {
        console.log('There was some error, please verify //', error);
    })
    
    closeModal(popupAddNewCard); // Закрываю после добавления карточки на страницу модальное окно и очищаю форму методом reset
    // formAddCard.reset();
};

formAddCard.addEventListener('submit', handleAddCardOnPage);



// 7 ПРОЕКТ - ВАЛИДАЦИЯ ФОРМ, API, ДЕПЛОЙ

// В эту переменную для удобства записываю объект со свойствами(у каждого свой селектор из попапа)
// и передаю переменную в функцию ниже
const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
};

enableValidation(validationConfig);

// Картинка профиля
const formElementEditAvatar = document.querySelector('.popup__form[name="edit-avatar"]'); // +
// Инпут с ссылкой на новый аватар
const newAvatarPicture = formElementEditAvatar.querySelector('.popup__input_type_url-avatar');
// Форма с аватаркой  
const profileEditAvatarButton = document.querySelector('.profile__image'); // +
// Сам попап аватара
const popUpEditAvatar = document.querySelector('.popup_type_avatar');

let profileId;

Promise.all([getUserInfo(), getInitialCards()]).then(([userInfo, cards]) => {
    
    profileTitle.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    profileEditAvatarButton.style = `background-image: url(${userInfo.avatar})`;
    profileId = userInfo._id;

    cards.forEach(card => {
        const cardContent = createCard(
        card.name, 
        card.link, 
        deleteCard, 
        openPopupBigImage,
        card.likes,
        profileId,
        card.owner._id,
        card._id,
        likeCard,
        unLikeCard,
        removeCardOnPage,
        toggleLikeCard  
        )

    cardsContainer.append(cardContent)
    }) 
});

profileEditAvatarButton.addEventListener('click', () => {
    formElementEditAvatar.reset();
    clearValidation(popUpEditAvatar, validationConfig);
    openModal(popUpEditAvatar);
});

// Форма с аватаром
formElementEditAvatar.addEventListener('submit', handleEditAvatarFormSubmit);

function handleEditAvatarFormSubmit(evt) {
    evt.preventDefault();

    editUserAvatar(newAvatarPicture.value)
    .then(data => {
        profileEditAvatarButton.style = `background-image: url(${data.avatar})`
    })
    .catch(error => {
        console.log('There was some error, please verify //', error)
    })

    closeModal(popUpEditAvatar)
}

