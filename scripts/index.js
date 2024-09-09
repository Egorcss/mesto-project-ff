// @todo: Темплейт карточки

const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы

// Сюда будут добавляться карточки
const placesList = document.querySelector('.places__list');

// @todo: Функция создания карточки

function createCard(Card, DeleteCard) {
    // В CardTemplate определен контент темлейта, теперь клонируем его содержимое 
    const newCard = cardTemplate.querySelector('.places__item').cloneNode(true);

    // В 1 аргументе Card будет элемент массива initialCards и через этот аргумент работаем 
    // со свойствами(link и name)
    newCard.querySelector('.card__image').src = Card.link;
    newCard.querySelector('.card__title').textContent = Card.name;
    
    // кнопка "корзинка", по клику передается аргумент DeleteCard ей, переданный в функцию ранее
    const buttonDelete = newCard.querySelector('.card__delete-button');
    // Исправил ошибку, надо было добавить NewCard в DeleteCard()
    buttonDelete.addEventListener('click', () => {
        DeleteCard(newCard);
    });

    return newCard;
}

// @todo: Функция удаления карточки

function removeCardOnPage(cardElement) {
    cardElement.remove();
};

// @todo: Вывести карточки на страницу

initialCards.forEach(function (elem) {
    // Из массива initialCards передаю в качестве 1 аргумента каждый элемент массива(elem), 
    // а в качестве 2 аругмента - функцию удаления, но она сработает только по клику
    // на кнопку "корзинка"
    const cardElement = createCard(elem, removeCardOnPage);
    placesList.append(cardElement);
})

