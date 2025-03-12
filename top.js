
document.addEventListener("DOMContentLoaded", function () {
    const burgerMenu = document.getElementById("burger-menu");
    const navMenu = document.getElementById("nav-menu");

    burgerMenu.addEventListener("click", function () {
        navMenu.classList.toggle("show");
    });
});
