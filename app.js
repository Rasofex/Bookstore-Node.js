//! Express
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const app = express();

//! Express Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//! Handlebars
app.set('view engine', 'hbs');
app.set('views', 'views');

//? Set up book data
let books = [
  {
    id: 0,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    releaseDate: 'April 10, 1925',
    price: 12.99,
    image: 'https://tse1.mm.bing.net/th?id=OIP.dAVRw87IavkvuX_894QEzwAAAA&pid=Api'
  },
  {
    id: 1,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    releaseDate: 'July 11, 1960',
    price: 14.99,
    image: 'images/To_kill_a_mockingbird.png'
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    releaseDate: 'June 8, 1949',
    price: 9.99,
    image: '/images/1984.png'
  }
];

//? Set up basket data
let basket = [];

//! Routes
//* Main page
app.get('/', (req, res) => {
  const totalPrice = basket.reduce((total, book) => total + book.price, 0);
  res.render('index', { books, totalPrice });
});

//* Basket page
app.get('/basket', (req, res) => {
  const totalPrice = basket.reduce((total, book) => total + book.price, 0);
  res.render('basket', { basket, totalPrice });
});

//* Add To Basket
app.post('/add-to-basket', (req, res) => {
  const bookId = req.body.bookId;
  const book = books[bookId];
  if (book) {
    basket.push(book);
  }
  res.redirect('/');
});

app.post('/checkout', (req, res) => {
  const totalPrice = basket.reduce((total, book) => total + book.price, 0);
  res.render('checkout', { basket, totalPrice });
});

app.post('/checkout-done', (req, res) => {
  basket = [];
  res.redirect('/basket');
});


//! Start server
const PORT = 80;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));