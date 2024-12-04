// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: Функция создания карточки
export function createCard(
    title, 
    link,
    cardDelete, 
    handleBigImageClick,
    counter,
    id,
    cardOwner,
    cardId,
    cardLike,
    cardUnlike,
    removeCardOnPage,
    toggleLikeCard) {
        
    // В CardTemplate определен контент темлейта, теперь клонируем его содержимое и выбираем
    // селекторы с картинкой и заголовком карточки
    const newCard = cardTemplate.querySelector('.places__item').cloneNode(true);
    const newCardImage = newCard.querySelector('.card__image');
    const newCardTitle = newCard.querySelector('.card__title');

    newCardTitle.textContent = title;
    newCardImage.src = link;
    newCardImage.alt = title;

    // Открытие большого изображения через клик по картинке в карточке
    newCardImage.addEventListener('click', () => {
        handleBigImageClick(title, link);
    });

    // Счетчик лайков, исходя из количества пользователей, лайкнувших карточку
    newCard.querySelector('.card__like-counter').textContent = counter.length;
    
    // Кнопка "корзинка"
    const buttonDelete = newCard.querySelector('.card__delete-button');

    newCard.id = cardId;

    // Если не моя карточка, то не будет кнопки удаления
    if (id !== cardOwner) {
        buttonDelete.remove();
    }
    else {
        buttonDelete.addEventListener('click', () => {
            removeCardOnPage(cardDelete, cardId, newCard); // чтобы точно удалить нужную карточку
        });
    };

    // Лайк для карточки
    const buttonLikeCard = newCard.querySelector('.card__like-button');

    const hasLikes = counter.some(function(like) {
        return like._id === id; 
    });

    if (hasLikes) {
        buttonLikeCard.classList.add('card__like-button_is-active');
    };

    buttonLikeCard.addEventListener('click', () => {
        toggleLikeCard(buttonLikeCard, cardId, cardUnlike, cardLike);
    });

    return newCard;
}

// @todo: Функция удаления карточки
export function removeCardOnPage(deleteCard, cardId, newCard) {
    deleteCard(cardId)
    .then(() => {
        newCard.remove();
    })
    .catch(error => { 
        console.log(error.status, error.statusText)
    })
};

// @todo: Функция переключения лайка карточки 
export function toggleLikeCard(likeButton, cardId, cardUnlike, cardLike) {

    const card = document.querySelector(`.places__item[id="${cardId}"]`);
    const cardLikeCounter = card.querySelector('.card__like-counter');
    
    // Если кнопка-лайк содержит класс активной кнопки(card__like-button_is-active), то вызываем снятие лайка и уменьшаем счетчик
    if (likeButton.classList.contains('card__like-button_is-active')) {
        cardUnlike(cardId)
        .then((data) => {
            likeButton.classList.remove('card__like-button_is-active');
            cardLikeCounter.textContent = data.likes.length; // длина массива лайков(количество лайкнувших карточку)
        })
        .catch((error) => {
            console.log(error.status, error.statusText)
        })
    }
    // Иначе ставим лайк, если не содержит класс card__like-button_is-active
    else {
        cardLike(cardId)
        .then((data) => {
            likeButton.classList.add('card__like-button_is-active');
            cardLikeCounter.textContent = data.likes.length;
        })
        .catch(error => { 
            console.log(error.status, error.statusText)
        })
    }
};
