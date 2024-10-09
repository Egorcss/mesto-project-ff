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