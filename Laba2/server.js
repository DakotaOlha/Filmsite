const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const DATA_FILE = "tools.json";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // або заміни "*" на конкретний адрес
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 👉 Статичні файли з поточної директорії (не з public)
app.use(express.static(__dirname));

// Отримати всі товари
app.get('/products', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Помилка читання файлу');
    res.json(JSON.parse(data));
  });
});

// Додати товар
app.post('/products', (req, res) => {
  const newProduct = req.body;
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Помилка читання файлу');
    const products = JSON.parse(data);
    newProduct.id = Date.now(); // унікальний ID
    newProduct.desc = "Опис за замовчуванням"; // можеш змінити
    products.push(newProduct);
    fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), err => {
      if (err) return res.status(500).send('Помилка запису файлу');
      res.status(201).json({ message: 'Товар додано', product: newProduct });
    });
  });
});

// Видалити товар
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Помилка читання файлу');
    let products = JSON.parse(data);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).send('Товар не знайдено');
    products.splice(index, 1);
    fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), err => {
      if (err) return res.status(500).send('Помилка запису файлу');
      res.json({ message: 'Товар видалено' });
    });
  });
});

// Редагувати товар
app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedProduct = req.body;
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Помилка читання файлу');
    let products = JSON.parse(data);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).send('Товар не знайдено');
    products[index] = { ...products[index], ...updatedProduct };
    fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), err => {
      if (err) return res.status(500).send('Помилка запису файлу');
      res.json({ message: 'Товар оновлено', product: products[index] });
    });
  });
});

// 👉 Якщо хочеш віддати admin.html при GET-запиті:
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});
