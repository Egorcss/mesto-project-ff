// @todo: Темплейт карточки

const CardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы

// Сюда будут добавляться карточки
const PlacesList = document.querySelector('.places__list');

// @todo: Функция создания карточки

function AddCardOnPage(Card, DeleteCard) {
    // В CardTemplate определен контент темлейта, теперь клонируем его содержимое 
    const NewCard = CardTemplate.querySelector('.places__item').cloneNode(true);

    // В 1 аргументе Card будет элемент массива initialCards и через этот аргумент работаем 
    // со свойствами(link и name)
    NewCard.querySelector('.card__image').src = Card.link;
    NewCard.querySelector('.card__title').textContent = Card.name;
    
    // кнопка "мусор", по клику передается аргумент DeleteCard ей, переданный в функцию ранее
    const ButtonDelete = NewCard.querySelector('.card__delete-button');
    ButtonDelete.addEventListener('click', () => {
        DeleteCard();
    });

    return NewCard;
}

// @todo: Функция удаления карточки

function RemoveCardOnPage() {
    // выбрал целый элемент li 
    const CardRemove = document.querySelector('.places__item'); 
    CardRemove.remove();
};

// @todo: Вывести карточки на страницу

initialCards.forEach(function (elem) {
    // Из массива initialCards передаю в качестве 1 аргумента каждый элемент массива(elem), 
    // а в качестве 2 аругмента - функцию удаления, но она сработает только по клику
    // на кнопку "мусор"
    const CardElement = AddCardOnPage(elem, RemoveCardOnPage);
    PlacesList.append(CardElement);
})

