const myCohort = 'wff-cohort-24';
const myToken = 'cdb5081b-c336-4c35-b8c0-6ade77d95de3';

const config = {
    baseUrl: `https://nomoreparties.co/v1/${myCohort}`,
    headers: {
      authorization: myToken,
      'Content-Type': 'application/json'
    }
};

// Универсальная функция чтобы вместо кучи писанины сразу вызывать функцию получения
// результата с сервера и ее преображение в формат json(и возвращение через return)
function AnswerFromServer(res) {
    if (res.ok) {
        return res.json();
    };
    return Promise.reject(res.status, res.statusText);
};

// editUserAvatar,
// getUserInfo, 
// updateUserInfo, 
// getInitialCards, 
// addCard, 
// deleteCard, 
// likeCard, 
// unLikeCard 

// redactionMyProfileAvatar
// getMyPersonalInfo
// redactionMyProfileInfo
// getInitialCards
// addCardOnServer
// cardDelete
// cardLike
// cardUnlike


// КУЧА ФЕТЧЕЙ

export const editUserAvatar = (url) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            avatar: url
        })
    })
    .then(AnswerFromServer)
    // .then((result) => {
    //     console.log(result);
    //   });     
};

export const getUserInfo = () => {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers
    })
    .then(AnswerFromServer)
    // .then((result) => {
    //     console.log(result);
    //   });     
};


export const updateUserInfo = (profileName, profileJob) => {
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

export const getInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers
    })
    .then(AnswerFromServer)
};

export const addCard = (cardName, cardLink) => {
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

export const deleteCard = (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
    })
    .then(AnswerFromServer)
};

export const likeCard = (cardId) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: 'PUT',
        headers: config.headers
    })
    .then(AnswerFromServer)
}

export const unLikeCard = (cardId) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
    })
    .then(AnswerFromServer)
}
