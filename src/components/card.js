// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: Функция создания карточки
export function createCard(card, deleteCard, likeCard, handleImageClick) {
    // В CardTemplate определен контент темлейта, теперь клонируем его содержимое и выбираем
    // селекторы с картинкой и заголовком карточки
    const newCard = cardTemplate.querySelector('.places__item').cloneNode(true);
    const newCardImage = newCard.querySelector('.card__image');
    const newCardTitle = newCard.querySelector('.card__title');

    // В 1 аргументе card будет элемент массива initialCards и через этот аргумент работаем 
    // со его свойствами(link и name)
    newCardImage.src = card.link
    newCardTitle.textContent = card.name;
    newCardTitle.alt = card.name;
    
    // Кнопка "корзинка", по клику передается аргумент DeleteCard ей, переданный в функцию ранее
    const buttonDelete = newCard.querySelector('.card__delete-button');
    buttonDelete.addEventListener('click', () => {
        deleteCard(newCard);
    });

    // Переключение лайка для карточки
    const buttonLikeCard = newCard.querySelector('.card__like-button');
    buttonLikeCard.addEventListener('click', () => {
        likeCard(buttonLikeCard);
    });

    // Открытие большого изображения через клик по картинке в карточке
    newCardImage.addEventListener('click', () => {
        handleImageClick(card);
    });

    return newCard;
}

// @todo: Функция удаления карточки
export function removeCardOnPage(cardElement) {
    cardElement.remove();
};

// @todo: Функция переключения лайка карточки 
export function toggleLikeCard(likeButton) {
    likeButton.classList.toggle('card__like-button_is-active');
};
