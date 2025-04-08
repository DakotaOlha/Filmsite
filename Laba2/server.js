const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

const DATA_FILE = "tools.json";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get('/products', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) 
      return res.status(500).send('Помилка читання файлу');
    res.json(JSON.parse(data));
  });
});

app.post('/products', (req, res) => {
  const newProduct = req.body;
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) 
      return res.status(500).send('Помилка читання файлу');
    const products = JSON.parse(data);
    newProduct.id = Date.now(); 
    newProduct.desc = "Опис за замовчуванням"; 
    products.push(newProduct);
    fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), err => {
      if (err) 
        return res.status(500).send('Помилка запису файлу');
      res.status(201).json({ 
        message: 'Товар додано', product: newProduct 
      });
    });
  });
});

app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) 
      return res.status(500).send('Помилка читання файлу');
    let products = JSON.parse(data);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) 
      return res.status(404).send('Товар не знайдено');
    products.splice(index, 1);
    fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), err => {
      if (err) 
        return res.status(500).send('Помилка запису файлу');
      res.json({
         message: 'Товар видалено' 
        });
    });
  });
});

app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedProduct = req.body;
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) 
      return res.status(500).send('Помилка читання файлу');
    let products = JSON.parse(data);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) 
      return res.status(404).send('Товар не знайдено');
    products[index] = { ...products[index], ...updatedProduct };
    fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), err => {
      if (err) 
        return res.status(500).send('Помилка запису файлу');
      res.json({ 
        message: 'Товар оновлено', product: products[index] 
      });
    });
  });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});
