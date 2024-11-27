//                      @todo: Function to create cards

// Gettinng acess to template from HTML code
const cardTemplate = document.querySelector("#card-template").content;

export function createCard(
    title,
    link,
    deleteCard,
    zoomOutImage,
    counter,
    id,
    cardOwner,
    cardId,
    likeCard,
    unLikeCard,
    removeCard,
    like
) {

    const cardContent = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardContent.querySelector('.card__image');

    //adding content to img node
    cardContent.querySelector('.card__title').textContent = title;
    cardImage.src = link;
    cardImage.alt = title;
    cardContent.querySelector('.card__like-counter').textContent = counter.length;
    cardContent.id = cardId;

    // Delete button
    const deleteButton = cardContent.querySelector('.card__delete-button');
    if (id !== cardOwner) {
        deleteButton.remove();
    } else {
        deleteButton.addEventListener('click', () => {
            removeCard(deleteCard, cardId);
        })
    };

    // Like button
    const likeButton = cardContent.querySelector('.card__like-button');
    const checkLikes = counter.some(function (item) {
        return item._id === id;
    });
    if (checkLikes) {
        likeButton.classList.add('card__like-button_is-active')
    };

    likeButton.addEventListener('click', () => {
        like(likeButton, cardId, unLikeCard, likeCard);
    });

    // Zoom Out Image
    cardImage.addEventListener('click', () => {
        zoomOutImage(title, link);
    });

    return cardContent;
}

//                      @todo: Function to delete cards

export function removeCard(deleteCard, cardId) {
    deleteCard(cardId)
    .then(() => {
        document.querySelector(`.card[id="${cardId}"]`).remove();
    })
    .catch(error => { // displaying any error if occurs
        console.log('There was some error, please verify //', error)
    })
}

//                      @todo: Function to like cards

export function like(likeButton, cardId, unLikeCard, likeCard) {

    const card = document.querySelector(`.card[id="${cardId}"]`);
    if (likeButton.classList.contains('card__like-button_is-active')) {
        unLikeCard(cardId)
        .then((data) => {
            card.querySelector('.card__like-counter').textContent = data.likes.length;
            likeButton.classList.remove('card__like-button_is-active');
        })
        .catch(error => { // displaying any error if occurs
            console.log('There was some error, please verify //', error)
        })
    } else {
        likeCard(cardId)
        .then((data) => {
            card.querySelector('.card__like-counter').textContent = data.likes.length;
            likeButton.classList.add('card__like-button_is-active');
        })
        .catch(error => { // displaying any error if occurs
            console.log('There was some error, please verify //', error)
        })
    }
}