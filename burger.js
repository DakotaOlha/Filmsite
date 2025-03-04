emailjs.init("ZBRRhBdwIinTRFUs1");

document.getElementById('review-form').addEventListener('submit', function(event) {
event.preventDefault(); // Зупиняє стандартне надсилання форми

// Отримуємо дані з форми
let name = document.getElementById('name').value;
let email = document.getElementById('email').value;
let message = document.getElementById('message').value;

// Перевіряємо, чи всі поля заповнені
if (name && email && message) {
    alert('Форма успішно надіслана!'); // Тестове повідомлення
    // Тут можна вставити код для EmailJS або іншого сервісу
} else {
    alert('Будь ласка, заповніть всі поля!');
}
});

