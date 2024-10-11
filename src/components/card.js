// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: Функция создания карточки
export function createCard(card, deleteCard, likeCard, handleImageClick) {
    // В CardTemplate определен контент темлейта, теперь клонируем его содержимое 
    const newCard = cardTemplate.querySelector('.places__item').cloneNode(true);

    // В 1 аргументе Card будет элемент массива initialCards и через этот аргумент работаем 
    // со свойствами(link и name)
    newCard.querySelector('.card__image').src = card.link;
    newCard.querySelector('.card__title').textContent = card.name;
    newCard.querySelector('.card__title').alt = card.name;
    
    // Кнопка "корзинка", по клику передается аргумент DeleteCard ей, переданный в функцию ранее
    const buttonDelete = newCard.querySelector('.card__delete-button');
    buttonDelete.addEventListener('click', () => {
        deleteCard(newCard);
    });

    // Лайк для карточки
    const buttonLikeCard = newCard.querySelector('.card__like-button');
    buttonLikeCard.addEventListener('click', () => {
        likeCard(buttonLikeCard);
    });

    // Открытие большого изображения через клик по картинке в карточке
    newCard.querySelector('.card__image').addEventListener('click', () => {
        handleImageClick(card);
    });

    return newCard;
}

// @todo: Функция удаления карточки
export function removeCardOnPage(cardElement) {
    cardElement.remove();
};

// @todo: Функция лайка карточки 
export function toggleLikeCard(likeButton) {
    likeButton.classList.toggle('card__like-button_is-active');
};
