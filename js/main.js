const USERS_KEY = 'users';
const CONTACTS_KEY = 'contacts';

// Реєстрація користувача
function registerUser() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const gender = document.getElementById('gender').value.trim();
    const dob = document.getElementById('dob').value.trim();

    if (!name || !email || !password || !gender || !dob) {
        alert('Усі поля для реєстрації повинні бути заповнені.');
        return;
    }

    let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    users.push({ name, email, password, gender, dob });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    alert('Реєстрація успішна! Ви можете увійти.');
}

// Вхід в акаунт
function signinUser() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = '/html/profile.html';
    } else {
        alert('Невірний логін або пароль');
    }
}

// Вихід з акаунта
function signoutUser() {
    localStorage.removeItem('currentUser');
    alert('Ви успішно вийшли з акаунта.');
    window.location.href = '/html/signin.html';
}

// Видалення акаунта
function deleteAccount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert('Немає користувача для видалення.');
        return;
    }

    const confirmation = confirm('Ви впевнені, що хочете видалити свій акаунт? Цю дію неможливо буде скасувати.');
    if (!confirmation) {
        return;
    }

    let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    users = users.filter(user => user.email !== currentUser.email);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.removeItem('currentUser');
    alert('Акаунт видалено.');
    window.location.href = '/html/signin.html';
}

// Додавання нового контакту
function addContact() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert('Ви повинні увійти в акаунт для додавання контакту.');
        return;
    }

    const surname = document.getElementById('surname').value.trim();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!surname || !name || !phone) {
        alert('Усі поля для контакту повинні бути заповнені.');
        return;
    }

    let contacts = JSON.parse(localStorage.getItem(CONTACTS_KEY)) || [];
    contacts.push({ surname, name, phone });
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));

    alert('Контакт додано!');
}

// Завантаження контактів у профіль
function loadContacts() {
    let contacts = JSON.parse(localStorage.getItem(CONTACTS_KEY)) || [];
    const contactsList = document.getElementById('contacts-list');

    contactsList.innerHTML = '';
    contacts.forEach((contact, index) => {
        contactsList.innerHTML += `
            <tr>
                <th scope="row">${index + 1}</th>
                <td>${contact.surname} ${contact.name}</td>
                <td>${contact.phone}</td>
                <td>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${index}" id="contact-${index}">
                    </div>
                </td>
            </tr>
        `;
    });
}

// Редагування контакту
function editContact() {
    let selectedIndex;
    document.querySelectorAll('#contacts-list input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            selectedIndex = checkbox.value;
        }
    });

    if (selectedIndex === undefined) {
        alert('Виберіть контакт для редагування');
        return;
    }

    let contacts = JSON.parse(localStorage.getItem(CONTACTS_KEY)) || [];
    const contact = contacts[selectedIndex];

    const newSurname = prompt('Нове прізвище', contact.surname);
    const newName = prompt('Нове ім\'я', contact.name);
    const newPhone = prompt('Новий номер телефону', contact.phone);

    if (!newSurname || !newName || !newPhone) {
        alert('Усі поля повинні бути заповнені.');
        return;
    }

    contacts[selectedIndex] = { surname: newSurname, name: newName, phone: newPhone };
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));

    loadContacts();
}

// Видалення контакту
function deleteContact() {
    let selectedIndex;
    document.querySelectorAll('#contacts-list input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            selectedIndex = checkbox.value;
        }
    });

    if (selectedIndex === undefined) {
        alert('Виберіть контакт для видалення');
        return;
    }

    let contacts = JSON.parse(localStorage.getItem(CONTACTS_KEY)) || [];
    contacts.splice(selectedIndex, 1);
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));

    loadContacts();
}

// Сортування контактів за алфавітом
function sortContacts() {
    let contacts = JSON.parse(localStorage.getItem(CONTACTS_KEY)) || [];
    contacts.sort((a, b) => a.surname.localeCompare(b.surname));
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));

    loadContacts();
}

// Завантаження профілю користувача
function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('Будь ласка, увійдіть у систему');
        window.location.href = '/html/signin.html';
        return;
    }

    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-gender').textContent = user.gender;
    document.getElementById('user-dob').textContent = user.dob;
}

// Очищення LocalStorage
function clearLocalStorage() {
    localStorage.clear();
    alert('Всі дані з LocalStorage видалені.');
}

// Ініціалізація профілю та контактів
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('profile.html')) {
        loadUserProfile();
        loadContacts();
    }
});
