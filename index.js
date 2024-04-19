const add = document.querySelector('.add');
const clear = document.querySelector('.clear');

let storage = JSON.parse(localStorage.getItem('users')) || {};

/**
 * Функция добавления слушателей на кнопки удаления и изменения
 * в карточке пользователя
 * @param {HTMLDivElement} userCard - карточка пользователя
 */
function setListeners(userCard) {
    const deleteBtn = userCard.querySelector('.delete');
    const changeBtn = userCard.querySelector('.change');

    const userEmail = deleteBtn.dataset.user;
    const userName = userCard.querySelector('.user-info p:nth-child(1)').textContent;
    const userSecondName = userCard.querySelector('.user-info p:nth-child(2)').textContent;

    deleteBtn.addEventListener('click', (event) => {
        const userEmail = event.target.closest('.user-outer').dataset.user;
        console.log(`%c Удаление пользователя ${userEmail} `, 'background: red; color: white');
        deleteCard(userEmail);
    });

    changeBtn.addEventListener('click', () => {
        const userEmail = changeBtn.dataset.changeUserEmail; 
        const userName = userCard.querySelector('.user-info p:nth-child(1)').textContent;
        const userSecondName = userCard.querySelector('.user-info p:nth-child(2)').textContent;
        const userNickname = userCard.querySelector('.user-info p:nth-child(4)').textContent.replace('Nickname: ', '');

        console.log(`%c Изменение пользователя ${userEmail} `,'background: green; color: white');

        document.querySelector('#name').value = userName;
        document.querySelector('#secondName').value = userSecondName;
        document.querySelector('#email').value = userEmail;
        document.querySelector('#nickname').value = userNickname;
    });
}

/**
 * Функция создания карточки пользователя
 * @param {Object} data - объект с данными пользователя
 * @param {string} data.name - имя пользователя
 * @param {string} data.secondName - фамилия пользователя
 * @param {string} data.email - email пользователя
 * @returns {string} - возвращает строку с разметкой карточки пользователя
 */
function createCard({ name, secondName, email, nickname }) {
    return `
        <div data-user=${email} class="user-outer">
            <div class="user-info">
                <p>${name}</p>
                <p>${secondName}</p>
                <p class="email">${email}</p>
                <p>Nickname: ${nickname}</p>
            </div>
            <div class="menu">
                <button data-delete-user-email=${email} class="delete">Удалить</button>
                <button data-change-user-email=${email} class="change">Изменить</button>
            </div>
        </div>
    `
}

/**
 * Функция перерисовки карточек пользователей при загрузке страницы
 * @param {Object} storage - объект с данными пользователей
 */
function rerenderCards(storage) {
    const users = document.querySelector('.users');

    if (!storage) {
        console.log('localStorage пустой');
        return
    }

    users.innerHTML = '';

    Object.keys(storage).forEach((email) => {
        const userData = storage[email];
        const userCard = document.createElement('div');
        userCard.className = 'user';
        userCard.dataset.email = email;
        userCard.innerHTML = createCard(userData);
        users.append(userCard);
        setListeners(userCard);
    });
}

/**
 * Функция добавления карточки пользователя в список пользователей и в localStorage
 * @param {Event} e - событие клика по кнопке добавления
 */
function addCard(e) {
    e.preventDefault();
    const newName = document.querySelector('#name');
    const newSecondName = document.querySelector('#secondName');
    const newEmail = document.querySelector('#email');
    const newNickname = document.querySelector('#nickname');

    const users = document.querySelector('.users');

    if (!newEmail.value || !newName.value || !newSecondName.value || !newNickname.value) {
        resetInputs(newName, newSecondName, newEmail, newNickname);
        return;
    };

    const data = {
        name: newName.value,
        secondName: newSecondName.value,
        email: newEmail.value,
        nickname: newNickname.value,
    };

    if (storage[newEmail.value]) {
    const userCard = document.querySelector(`.user-outer[data-user="${newEmail.value}"]`);
    userCard.innerHTML = createCard(data);
    setListeners(userCard);

    storage[newEmail.value] = data;
    } else {
    const userCard = document.createElement('div');
    userCard.className = 'user-outer';
    userCard.dataset.email = newEmail.value;
    userCard.innerHTML = createCard(data);
    users.append(userCard);
    setListeners(userCard);

    storage[newEmail.value] = data;
    }

    // Добавление данных в localStorage
    localStorage.setItem('users', JSON.stringify(storage));
    resetInputs(newName, newSecondName, newEmail, newNickname);

    console.log(storage);
}

/**
 * Функция очистки полей ввода
 * @param {HTMLInputElement} inputs
 */
function resetInputs(...inputs) {
    inputs.forEach((input) => {
        input.value = ''
    })
}

// Функция очистки localStorage
function clearLocalStorage() {
    localStorage.removeItem('users')
    window.location.reload()
}

// Добавление слушателей на кнопки добавления и очистки
add.addEventListener('click', addCard)
clear.addEventListener('click', clearLocalStorage)

// При загрузке страницы перерисовываются карточки пользователей
window.addEventListener('load', () => {
    rerenderCards(JSON.parse(localStorage.getItem('users')))
})

function deleteCard(userEmail) {
    const userCard = document.querySelector(`.user-outer[data-user="${userEmail}"]`);
    if (userCard) {
        userCard.remove();

        delete storage[userEmail];
        localStorage.setItem('users', JSON.stringify(storage));

        console.log(`Карточка пользователя ${userEmail} удалена`);
    } else {
        console.log(`Карточка пользователя ${userEmail} не найдена`);
    }
}
