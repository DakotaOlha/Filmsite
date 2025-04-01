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
      document.cookie = "admin=true; max-age=3600";
      window.location.href = "admin.html"; 
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
  localStorage.setItem("order", JSON.stringify(order));

  window.open("receipt.html", "_blank");
}

