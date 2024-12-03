const myCohort = 'wff-cohort-24';
const myToken = 'cdb5081b-c336-4c35-b8c0-6ade77d95de3';

const config = {
    baseUrl: `https://nomoreparties.co/v1/${myCohort}`,
    headers: {
      authorization: myToken,
      'Content-Type': 'application/json'
    }
};

// Универсальная функция - вместо кучи писанины вызываем функцию получения
// результата с сервера. Если все хорошо, то преображаем в формат json(и возвращаем),
// а также отклоняем если все плохо(reject)
function AnswerFromServer(res) {
    if (res.ok) {
        return res.json();
    };
    return Promise.reject(res.status, res.statusText);
};



// ФЕТЧИ

// Фетчь на получение информации обо мне
export const getMyProfileInformation = () => {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers
    })
    .then(AnswerFromServer)   
};

// Фетчь на редактирование моего профиля, name и about, это имя и занятие соответственно
export const redactionMyProfileInformation = (profileName, profileJob) => {
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            name: profileName,
            about: profileJob    
        })
    })
    .then(AnswerFromServer)
};

// Фетчь на редактирование моего аватара, свойство avatar - это сслыка на новую аватарку
export const redactionMyProfileAvatar = (url) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            avatar: url
        })
    })
    .then(AnswerFromServer)
};

// Фетчь на получения карточек студентов
export const getInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers
    })
    .then(AnswerFromServer)
};

// Фетчь на добавление картчоки на сервер, в свойства name и link передаем название и ссылку для карточки
export const addCardOnServer = (cardName, cardLink) => {
    return fetch(`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
            name: cardName,
            link: cardLink    
        })
    })
    .then(AnswerFromServer)
};

// Фетчь для счетчика лайков
export const cardLike = (cardId) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: 'PUT',
        headers: config.headers
    })
    .then(AnswerFromServer)
};

// Фетчь на снятие лайка с карточки
export const cardUnlike = (cardId) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
    })
    .then(AnswerFromServer)
};

// Фетчь на удаление карточки
export const cardDelete = (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
    })
    .then(AnswerFromServer)
};