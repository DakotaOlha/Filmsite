emailjs.init("ZBRRhBdwIinTRFUs1");

document.getElementById('review-form').addEventListener('submit', function(event) {
event.preventDefault(); // Зупиняє стандартне надсилання форми

// Отримуємо дані з форми
let name = document.getElementById('name').value;
let email = document.getElementById('email').value;
let message = document.getElementById('message').value;

// Перевіряємо, чи всі поля заповнені
if (name && email && message) {
    // Відправляємо через EmailJS
    emailjs.send("service_bm8iyvc", "template_b58vi4o", {
        name: name,
        email: email,
        message: message
    }).then(
        function(response) {
            alert("Відгук успішно надіслано!");
            document.getElementById('review-form').reset(); // Очищення форми
        },
        function(error) {
            alert("Помилка надсилання: " + JSON.stringify(error));
        }
    );
} else {
    alert('Будь ласка, заповніть всі поля!');
}
});

document.addEventListener("DOMContentLoaded", function () {
    const burgerMenu = document.getElementById("burger-menu");
    const navMenu = document.getElementById("nav-menu");

    burgerMenu.addEventListener("click", function () {
        navMenu.classList.toggle("show");
    });
});
