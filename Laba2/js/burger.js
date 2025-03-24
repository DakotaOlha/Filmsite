let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCard = document.querySelector('.listCard');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');

//вікно для перегляду товару
let toolModal = document.createElement('div');
toolModal.classList.add('product-modal');
toolModal.style.display = 'none';
document.body.appendChild(toolModal);

//відкриття та закриття кошику
openShopping.addEventListener('click', ()=>{
    body.classList.add('active');
})
closeShopping.addEventListener('click', ()=>{
    body.classList.remove('active');
})

let listCards  = [];
let tools = [];

//читання з json
fetch('tools.json')
    .then(response => response.json())
    .then(data => {
        tools = data;
        initApp();
    })
    .catch(error => console.error('Error loading products:', error));

function initApp(){
    tools.forEach((value, key) =>{
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        newDiv.innerHTML = `
            <img src="img/${value.image}" onclick="showToolDetails(${key})">
            <div class="title">${value.name}</div>
            <div class="price">${value.price.toLocaleString()}</div>
            <button onclick="addToCard(${key})">Add To Card</button>`;
        list.appendChild(newDiv);
    });
}


function addToCard(key){
    if(listCards[key] == null){
        // copy product form list to list card
        listCards[key] = JSON.parse(JSON.stringify(tools[key]));
        listCards[key].quantity = 1;
    }
    else{
      listCards[key].quantity++;
    }
    reloadCard();
}

function reloadCard(){
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;
    Object.keys(listCards).forEach(key => {
      let value = listCards[key];
      totalPrice += value.price * value.quantity;
      count += value.quantity;
      
      let newDiv = document.createElement('li');
      newDiv.innerHTML = `
          <div><img src="img/${value.image}" onclick="showProductDetails(${key})"/></div>
          <div>${value.name}</div>
          <div>${(value.price * value.quantity).toLocaleString()}</div>
          <div>
              <button onclick="changeQuantity(${key}, ${value.quantity - 1})">-</button>
              <div class="count">${value.quantity}</div>
              <button onclick="changeQuantity(${key}, ${value.quantity + 1})">+</button>
          </div>`;
      listCard.appendChild(newDiv);
  });
  total.innerText = totalPrice.toLocaleString();
  quantity.innerText = count;
}

function changeQuantity(key, quantity){
  if (quantity <= 0) {
    delete listCards[key];
  } else {
    listCards[key].quantity = quantity;
  } 
reloadCard();
}

function showToolDetails(key){
  let tool = tools[key];
  toolModal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn" onclick="closeToolDetails()">&times;</span>
      <img src="img/${tool.image}" class="modal-img">
      <h2>${tool.name}<h2>
      <p>Ціна: ${tool.price.toLocaleString()} грн</p>
      <p>Опис товару: ${tool.desc}</p>
      <button onclick="addToCard(${key})">Додати в кошик</button>
    </div>
  `;
  toolModal.style.display = `block`;
}

function closeToolDetails(){
  toolModal.style.display = `none`;
}


var sign = $('.signIn');
var signBlock = $('.sign-block');
var signBlock_active = $('.sign-block_active');
var exit = $('.exit');

sign.click(function(){
  signBlock.toggleClass('sign-block_active');
})

exit.click(function(){
  signBlock.removeClass('sign-block_active');
})

function loginAdmin() {
  const login = document.getElementById("adminLogin").value;
  const password = document.getElementById("adminPassword").value;

  if (login === "admin" && password === "1234") {
      document.cookie = "admin=true; max-age=3600"; // Авторизація на 1 годину
      window.location.href = "admin.html"; // Перенаправлення в панель адміністратора
  } else {
      alert("Невірні дані!");
  }
}

// function initApp() {
  
//   const toolList = document.getElementById('toolList');
//   const categoryFilter = document.getElementById('categoryFilter');
//   const searchInput = document.getElementById('searchInput');
//   const cartList = document.getElementById('cartList');
//   const totalPriceEl = document.getElementById('totalPrice');
//   const adminPanel = document.getElementById('adminPanel');
//   const authPanel = document.getElementById('authPanel');
//   const userOrders = document.getElementById('userOrders');
//   document.getElementById('clearOrdersBtn').addEventListener('click', clearOrders);

//   function renderCategories() {
//     data.categories.forEach(cat => {
//       const option = document.createElement('option');
//       option.value = cat.id;
//       option.textContent = cat.name;
//       categoryFilter.appendChild(option);
//     });
//   }



//   function checkout() {
//     if (cart.length === 0) return;
//     const order = { items: [...cart], date: new Date().toLocaleString() };
//     orders.push(order);
//     localStorage.setItem('orders', JSON.stringify(orders));
//     cart = [];
//     renderCart();
//     alert('Замовлення оформлено!');
//     showUserOrders();
//   }

//   function showUserOrders() {
//     userOrders.style.display = 'block';
//     userOrders.innerHTML = '<h2>Ваші замовлення:</h2>';
//     orders.forEach(order => {
//       const div = document.createElement('div');
//       div.innerHTML = `<strong>${order.date}</strong><ul>${order.items.map(i => `<li>${i.name} - ${i.price} грн</li>`).join('')}</ul>`;
//       userOrders.appendChild(div);
//     });
//   }

//   function loginAdmin() {
//     const login = prompt('Логін адміністратора:');
//     const pass = prompt('Пароль:');
//     if (login === 'admin' && pass === '1234') {
//       document.cookie = 'admin=true';
//       adminPanel.style.display = 'block';
//       alert('Вхід успішний');
//     } else {
//       alert('Невірні дані');
//     }
//   }

//   function checkAdminAuth() {
//     if (document.cookie.includes('admin=true')) {
//       adminPanel.style.display = 'block';
//     } else {
//       authPanel.style.display = 'block';
//     }
//   }

//   // Обробники подій
//   document.getElementById('checkoutBtn').addEventListener('click', checkout);
//   categoryFilter.addEventListener('change', () => renderTools(categoryFilter.value, searchInput.value));
//   searchInput.addEventListener('input', () => renderTools(categoryFilter.value, searchInput.value));
//   document.getElementById('loginAdminBtn').addEventListener('click', loginAdmin);

//   // Ініціалізація
//   renderCategories();
//   renderTools();
//   renderCart();
//   checkAdminAuth();
//   showUserOrders();
// }


// function clearOrders() {
//   localStorage.removeItem('orders');
//   orders = [];
//   showUserOrders();
//   alert('Ваші замовлення очищено.');
// }
