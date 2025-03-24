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
          newDiv.setAttribute('data-category', value.category.toLowerCase()); // ⬅️ додано
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


$(document).ready(function () {
  $('#searchInput, #categoryFilter').on('input change', function () {
    const searchTerm = $('#searchInput').val().toLowerCase();
    const selectedCategory = $('#categoryFilter').val().toLowerCase();

    $('.list .item').each(function () {
      const title = $(this).find('.title').text().toLowerCase();
      const category = $(this).data('category')?.toLowerCase() || '';

      const matchesSearch = title.includes(searchTerm);
      const matchesCategory = !selectedCategory || category === selectedCategory;

      $(this).toggle(matchesSearch && matchesCategory);
    });
  });
});

function checkoutOrder() {
  if (Object.keys(listCards).length === 0) {
      alert("Ваш кошик порожній!");
      return;
  }

  let orderDetails = [];
  let totalAmount = 0;

  Object.keys(listCards).forEach(key => {
      let item = listCards[key];
      orderDetails.push({
          name: item.name,
          quantity: item.quantity,
          price: item.price * item.quantity
      });
      totalAmount += item.price * item.quantity;
  });

  let order = {
      id: Date.now(),
      items: orderDetails,
      total: totalAmount,
      date: new Date().toLocaleString()
  };

  // Отримання поточних чеків із localStorage
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);

  // Збереження оновлених даних
  localStorage.setItem("orders", JSON.stringify(orders));

  // Відобразити чек
  showReceipt(order);

  // Очистити кошик
  listCards = [];
  reloadCard();
}

function showReceipt(order) {
  let receiptWindow = window.open("", "_blank");
  let receiptContent = `
      <html>
      <head>
          <title>Чек замовлення</title>
          <style>
              body { font-family: Arial, sans-serif; text-align: center; }
              .receipt { border: 1px solid #000; padding: 20px; width: 300px; margin: auto; }
              .receipt h2 { margin-bottom: 10px; }
              .receipt ul { text-align: left; padding: 0; list-style-type: none; }
              .receipt ul li { margin: 5px 0; }
          </style>
      </head>
      <body>
          <div class="receipt">
              <h2>Чек №${order.id}</h2>
              <p><strong>Дата:</strong> ${order.date}</p>
              <ul>
                  ${order.items.map(item => `<li>${item.name} x${item.quantity} - ${item.price} грн</li>`).join("")}
              </ul>
              <h3>Загальна сума: ${order.total} грн</h3>
              <button onclick="window.print()">Друк</button>
          </div>
      </body>
      </html>
  `;

  receiptWindow.document.write(receiptContent);
  receiptWindow.document.close();
}


// let checkoutSection = document.createElement('div');
// checkoutSection.classList.add('checkout-section');
// document.body.appendChild(checkoutSection);

// function createCheckout() {
//     checkoutSection.innerHTML = `
//         <div class="checkout-modal">
//             <h2>Оформлення замовлення</h2>
//             <ul class="checkout-list"></ul>
//             <div class="checkout-total">Загальна сума: <span class="checkout-sum">0</span> грн</div>
//             <button onclick="confirmOrder()">Підтвердити замовлення</button>
//             <button onclick="closeCheckout()">Закрити</button>
//         </div>
//     `;
//     checkoutSection.style.display = 'flex';
//     loadCheckoutData();
// }

// function loadCheckoutData() {
//     let checkoutList = checkoutSection.querySelector('.checkout-list');
//     let checkoutSum = checkoutSection.querySelector('.checkout-sum');
//     checkoutList.innerHTML = '';
//     let totalPrice = 0;
//     Object.keys(listCards).forEach(key => {
//         let value = listCards[key];
//         totalPrice += value.price * value.quantity;
//         let newItem = document.createElement('li');
//         newItem.innerHTML = `${value.name} x ${value.quantity} - ${value.price * value.quantity} грн`;
//         checkoutList.appendChild(newItem);
//     });
//     checkoutSum.innerText = totalPrice.toLocaleString();
// }

// function confirmOrder() {
//     let orderData = [];
//     Object.keys(listCards).forEach(key => {
//         let value = listCards[key];
//         orderData.push({
//             name: value.name,
//             quantity: value.quantity,
//             price: value.price * value.quantity
//         });
//     });
//     let orderReceipt = {
//         id: Date.now(),
//         date: new Date().toLocaleString(),
//         items: orderData,
//         total: total.innerText
//     };
//     saveOrder(orderReceipt);
//     alert('Замовлення підтверджено! Чек збережено.');
//     listCards = {};
//     reloadCard();
//     closeCheckout();
// }

// function saveOrder(order) {
//     let orders = JSON.parse(localStorage.getItem('orders')) || [];
//     orders.push(order);
//     localStorage.setItem('orders', JSON.stringify(orders));
// }

// function closeCheckout() {
//     checkoutSection.style.display = 'none';
// }

// function showReceipts() {
//     let receipts = JSON.parse(localStorage.getItem('orders')) || [];
//     let receiptSection = document.createElement('div');
//     receiptSection.classList.add('receipt-section');
//     receiptSection.innerHTML = '<h2>Ваші чеки</h2>';
//     receipts.forEach(order => {
//         let receipt = document.createElement('div');
//         receipt.classList.add('receipt');
//         receipt.innerHTML = `<p><strong>Чек №${order.id}</strong></p>
//             <p>Дата: ${order.date}</p>
//             <ul>${order.items.map(item => `<li>${item.name} x ${item.quantity} - ${item.price} грн</li>`).join('')}</ul>
//             <p><strong>Загальна сума: ${order.total} грн</strong></p>`;
//         receiptSection.appendChild(receipt);
//     });
//     document.body.appendChild(receiptSection);
// }

