// Авторизація адміністратора через cookies
if (!document.cookie.includes("admin=true")) {
    alert("У вас немає доступу!");
    window.location.href = "index.html"; // Перенаправлення на головну
}

const productList = document.getElementById("productList");
const addProductForm = document.getElementById("addProductForm");

// Завантаження списку товарів
let products = [];

function loadProducts() {
    fetch("http://localhost:3000/products")
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts();
        })
        .catch(error => console.error("Помилка завантаження:", error));
}

// Рендеринг товарів
function renderProducts() {
    productList.innerHTML = "";
    products.forEach((product) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <img src="img/${product.image}" width="50">
            <div>
                <strong>${product.name}</strong><br>
                Категорія: <em>${product.category}</em><br>
                Ціна: ${product.price} грн
            </div>
            <button onclick="editProduct(${product.id})">Редагувати</button>
            <button onclick="deleteProduct(${product.id})">Видалити</button>
        `;
        productList.appendChild(li);
    });
}

// Додавання товару
addProductForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("productName").value;
    const image = document.getElementById("productImage").value;
    const price = parseInt(document.getElementById("productPrice").value);
    const category = document.getElementById("productCategory").value;

    if (name && image && price && category) {
        const newProduct = { name, image, price, category };

        fetch("http://localhost:3000/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct)
        })
            .then(response => response.json())
            .then(data => {
                products.push(data.product);
                renderProducts();
                addProductForm.reset();
            })
            .catch(error => console.error("Помилка додавання:", error));
    }
});

// Видалення товару
function deleteProduct(id) {
    if (confirm("Ви впевнені, що хочете видалити товар?")) {
        fetch(`http://localhost:3000/products/${id}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    products = products.filter(p => p.id !== id);
                    renderProducts();
                } else {
                    console.error("Не вдалося видалити товар");
                }
            })
            .catch(error => console.error("Помилка видалення:", error));
    }
}

// Редагування товару
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newName = prompt("Нова назва товару:", product.name);
    const newImage = prompt("Нове зображення (файл):", product.image);
    const newPrice = prompt("Нова ціна:", product.price);
    const newCat = prompt("Нова категорія:", product.category);

    if (newName && newImage && newPrice && newCat) {
        const updatedProduct = {
            name: newName,
            image: newImage,
            price: parseInt(newPrice),
            category: newCat
        };

        fetch(`http://localhost:3000/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct)
        })
            .then(response => response.json())
            .then(data => {
                const index = products.findIndex(p => p.id === id);
                if (index !== -1) {
                    products[index] = data.product;
                    renderProducts();
                }
            })
            .catch(error => console.error("Помилка редагування:", error));
    }
}

// Вихід з акаунту
function logoutAdmin() {
    document.cookie = "admin=false; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "index.html";
}

// Запуск при завантаженні сторінки
loadProducts();
