// Функции открытия/закрытия модальных окон
export function openModal(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', closeModalByEsc);
};

export function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closeModalByEsc);
};

// Функция закрытия попапа по клавише Escape
export function closeModalByEsc(evt) {
    if (evt.key === 'Escape') {
        closeModal(document.querySelector('.popup_is-opened'));
    };
};

export function setCloseModalByOverlayClickListeners(everyPopup) {
    // Перебираю каждый попап, если по клику на выбранный попап, у него имеется(contains) 
    // класс popup_is-opened, то выбранный попап(evt.target) передается в функцию closeModal
    everyPopup.forEach(popup => {
        popup.addEventListener('click', (evt) => {
            if (evt.target.classList.contains('popup_is-opened')) {
                closeModal(evt.target);
            };
        });
    });
}