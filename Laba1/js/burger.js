emailjs.init("ZBRRhBdwIinTRFUs1");

document.getElementById('contact-form').addEventListener('submit', function(event) {
event.preventDefault();

let name = document.getElementById('name').value;
let email = document.getElementById('email').value;
let message = document.getElementById('message').value;

if (name && email && message) {
    emailjs.send("service_bm8iyvc", "template_b58vi4o", {
        name: name,
        email: email,
        message: message
    }).then(
        function(response) {
            alert("Відгук успішно надіслано!");
            document.getElementById('contact-form').reset(); 
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
