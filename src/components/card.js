// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: Функция создания карточки
export function createCard(
    title, 
    link,
    deleteCard, 
    handleImageClick,
    counter,
    id,
    cardOwner,
    cardId,
    likeCard,
    unLikeCard,
    removeCardOnPage,
    likeForCard
) {
    // В CardTemplate определен контент темлейта, теперь клонируем его содержимое и выбираем
    // селекторы с картинкой и заголовком карточки
    const newCard = cardTemplate.querySelector('.places__item').cloneNode(true);
    const newCardImage = newCard.querySelector('.card__image');
    const newCardTitle = newCard.querySelector('.card__title');

    // В 1 аргументе card будет элемент массива initialCards и через этот аргумент работаем 
    // со его свойствами(link и name)
    newCardTitle.textContent = title;
    newCardImage.src = link;
    newCardImage.alt = title;
    newCard.querySelector('.card__like-counter').textContent = counter.length;
    newCard.id = cardId;
    
    // Кнопка "корзинка", по клику передается аргумент DeleteCard ей, переданный в функцию ранее
    const buttonDelete = newCard.querySelector('.card__delete-button');
    if (id !== cardOwner) {
        buttonDelete.remove();
    }
    else {
        buttonDelete.addEventListener('click', () => {
            removeCardOnPage(deleteCard, cardId);
        });
    };

    // Переключение лайка для карточки
    const buttonLikeCard = newCard.querySelector('.card__like-button');
    const checkLikes = counter.some(function(item) {
        return item._id === id;
    });

    if (checkLikes) {
        buttonLikeCard.classList.add('card__like-button_is-active')
    };

    buttonLikeCard.addEventListener('click', () => {
        likeForCard(buttonLikeCard, cardId, unLikeCard, likeCard);
    });

    // Открытие большого изображения через клик по картинке в карточке
    newCardImage.addEventListener('click', () => {
        handleImageClick(title, link);
    });

    return newCard;
}

// @todo: Функция удаления карточки
export function removeCardOnPage(deleteCard, cardId) {
    deleteCard(cardId)
    .then(() => {
        document.querySelector(`.card[id="${cardId}"]`).remove();
    })
    .catch(error => { // displaying any error if occurs
        console.log('There was some error, please verify //', error)
    })
};

// @todo: Функция переключения лайка карточки 
export function toggleLikeCard(likeButton, cardId, unLikeCard, likeCard) {

    const card = document.querySelector(`.card[id="${cardId}"]`);

    if (likeButton.classList.contains('card__like-button_is-active')) {
        unLikeCard(cardId)
        .then((data) => {
            card.querySelector('.card__like-counter').textContent = data.likes.length;
            likeButton.classList.remove('card__like-button_is-active');
        })
        .catch((error) => {
            console.log('There was some error, please verify //', error)
        })
    }
    else {
        likeCard(cardId)
        .then((data) => {
            card.querySelector('.card__like-counter').textContent = data.likes.length;
            likeButton.classList.add('card__like-button_is-active');
        })
        .catch(error => { // displaying any error if occurs
            console.log('There was some error, please verify //', error)
        })
    }
};
