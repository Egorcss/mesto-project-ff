// index.js
import './pages/index.css'; // добавьте импорт главного файла стилей
        // Создание карточки, его удаление, и переключение лайка для карточки
import { createCard, removeCardOnPage, toggleLikeCard} from './components/card.js';
        // Открыть модальное окно, закрыть его, и закрыть его через клик вне его 
import { openModal, closeModal, setCloseModalByOverlayClickListeners } from './components/modal.js';
        // Включить валидцию и очистить ошибки валидации 
import { enableValidation, clearValidation } from './components/validation.js';

import { 
    getMyProfileInformation, 
    redactionMyProfileInformation, 
    redactionMyProfileAvatar,
    getInitialCards, 
    addCardOnServer, 
    cardLike, 
    cardUnlike,
    cardDelete
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



// ВСЕ, ЧТО СВЯЗАНО С Promise.all(получение информации о себе и создание карточки через все карточки пользователей)

// Сюда будут добавляться карточки
const cardsContainer = document.querySelector('.places__list');
let profileId = ''; // Id пользователя

// Все ниже исполнится тогда, когда все вернет Promise
Promise.all([getMyProfileInformation(), getInitialCards()])
    .then(([profileInformation, cards]) => {
    
        profileId = profileInformation._id; // идентификатор пользователя, в данном случае моего
        profileTitle.textContent = profileInformation.name; // имя
        profileDescription.textContent = profileInformation.about; // занятие
        profileRedactionAvatarButton.style = `background-image: url(${profileInformation.avatar})`; // аватар

        cards.forEach(card => {

            const newCard = createCard(
            card.name, // название карточки
            card.link, // ссылка для карточки
            cardDelete, // удаление карточки
            openPopupBigImage, // открытие большого изображения
            card.likes, // свойство likes содержит массив пользователей, лайкнувших карточку
            profileId, // мой Id 
            card.owner._id, // владелец карточки
            card._id, // Id карточки
            cardLike, // лайк-счетчик
            cardUnlike, // снятие лайка
            removeCardOnPage, // удаление карточки
            toggleLikeCard // переключение лайка 
            )

            cardsContainer.append(newCard); // Добавляю на страницу
        }) 
    })
    .catch(error => {
        console.log(error.status, error.statusText)
    });



// ВСЕ, ЧТО СВЯЗАНО С РЕДАКТИРОВАНИЕМ ПРОФИЛЯ(ИМЯ и ЗАНЯТИЕ)

// Форма редактирования профиля
const formProfile = document.forms['edit-profile']; // Форма с редактированием информации о человеке 
const nameInputProfile = formProfile.elements.name; // инпут с плейсхолдером "имя"
const jobInputProfile = formProfile.elements.description; // инпут с плейсхолдером "занятие" 

const profileTitle = document.querySelector('.profile__title'); // заголовок профиля
const profileDescription = document.querySelector('.profile__description'); // занятие в профиле

// Кнопка с редактированием профиля и попап к ней 
const buttonOpenProfile = document.querySelector('.profile__edit-button');
const popupRedactionProfile = document.querySelector('.popup_type_edit');

// Кнопка, по которой кликнув, открывается модальное окно с редактированием профиля
buttonOpenProfile.addEventListener('click', function() {
    // Теперь даже при 1 открытии редактирования профиля, чтобы они не были пустыми, в поля инпутов 
    // идут значения из заголовка и описания-занятия(в данном случае старые значения)
    nameInputProfile.value = profileTitle.textContent;
    jobInputProfile.value = profileDescription.textContent;

    openModal(popupRedactionProfile);
    clearValidation(popupRedactionProfile, validationConfig);
});

formProfile.addEventListener('submit', handleProfileFormSubmit);

// Функция редактирования профиля
function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    redactionMyProfileInformation(nameInputProfile.value, jobInputProfile.value) // Значения полей "имя" и "занятие"
    .then(data => {
        profileTitle.textContent = data.name; // имя
        profileDescription.textContent = data.about; // занятие
    })
    .catch(error => {
        console.log(error.status, error.statusText)
    })

    closeModal(popupRedactionProfile);
}

// ВСЕ, ЧТО СВЯЗАНО С АВАТАРОМ

// Картинка аватара и Попап аватара
const profileRedactionAvatarButton = document.querySelector('.profile__image'); 
const popupRedactionAvatar = document.querySelector('.popup_type_avatar');

// Форма с аватаркой и инпут с ссылкой на новый аватар
const formProfileAvatar = document.forms['form-avatar']; 
const profileAvatarImageLink = formProfileAvatar.elements.avatar;

profileRedactionAvatarButton.addEventListener('click', () => {
    // При открытии очищаем все. Даже если что-то вели валидное и закрыли, то метод reset очистит поля
    formProfileAvatar.reset();
    clearValidation(popupRedactionAvatar, validationConfig);
    openModal(popupRedactionAvatar);
});

// Форма с аватаром
formProfileAvatar.addEventListener('submit', handleAvatarFormSubmit);

function handleAvatarFormSubmit(evt) {
    evt.preventDefault();
    const avatarUrl = profileAvatarImageLink.value; // ссылка для новой аватарки

    // Вызываю функцию с переменной, в которой ссылка на новую аватарку
    redactionMyProfileAvatar(avatarUrl)
    .then(data => {
        // Свойство avatar берется из body: JSON.stringify({avatar: url}) функции redactionMyProfileAvatar
        profileRedactionAvatarButton.style = `background-image: url(${data.avatar})`
    })
    .catch(error => {
        console.log(error.status, error.statusText)
    })

    closeModal(popupRedactionAvatar)
};



// ВСЕ, ЧТО СВЯЗАНО С ДОБАВЛЕНИЕМ НОВОЙ КАРТОЧКИ НА СЕРВЕР

// Кнопка "+" и сам попап новой карточки
const buttonAddNewCard = document.querySelector('.profile__add-button');
const popupAddNewCard = document.querySelector('.popup_type_new-card');

buttonAddNewCard.addEventListener('click', function () {
    formAddCard.reset();
    clearValidation(popupAddNewCard, validationConfig)
    openModal(popupAddNewCard);
});

// Форма с добавлением карточки на страницу
const formAddCard = document.forms['new-place'];
const titleInputAddCard = formAddCard.elements['place-name'];
const linkInputAddCard = formAddCard.elements.link;

formAddCard.addEventListener('submit', handleAddCardOnPage);

// Функция-обработчкик добавления карточки на страницу
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

    addCardOnServer(newCard.name, newCard.link)
    .then((data) => {

        const cardId = data._id;
                    // в начало добавляем
        cardsContainer.prepend(createCard(
          newCard.name,
          newCard.link,
          cardDelete,
          openPopupBigImage,
          data.likes,
          profileId,
          data.owner._id,
          cardId,
          cardLike,
          cardUnlike,
          removeCardOnPage,
          toggleLikeCard
        ));
    })
    .catch((error) => {
        console.log(error.status, error.statusText);
    })
    
    closeModal(popupAddNewCard); // Закрываю после добавления карточки на страницу модальное окно и очищаю форму методом reset
    formAddCard.reset();
};







