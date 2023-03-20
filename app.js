//!! Express
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const app = express();

//!! Express Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//!! Handlebars
app.set('view engine', 'hbs');
app.set('views', 'views');

//!! Faker
const { faker } = require('@faker-js/faker/locale/ru');

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
  },
  {
    id: 3,
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
    releaseDate: 'August 1, 1994',
    price: 12.99,
    image: 'https://wallpaper.dog/large/198914.jpg'
  }
];

//? Set up cart data
let cart = [];

//? Profile generation
let profile = {
  image: faker.internet.avatar(),
  name: faker.name.fullName({ sex: 'male' }),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  bio: faker.lorem.paragraph(2)
};
//!! Routes
//////////////
//! Cards
//* Main page
app.get('/', (req, res) => {
  const totalPrice = cart.reduce((total, book) => total + book.price, 0);
  res.render('index', { books, totalPrice, profile });
});

//* Cart page
app.get('/cart', (req, res) => {
  const totalPrice = cart.reduce((total, book) => total + book.price, 0);
  res.render('cart', { cart, totalPrice, profile });
});

//* Add To Cart
app.post('/add-to-cart', (req, res) => {
  let bookId = req.body.bookId;
  let book = books[bookId];
  if (book) {
    cart.push(book);
  }
  res.redirect('/');
});

//* Remove from Cart
app.post('/remove-from-cart', (req, res) => {
  let bookId = req.body.bookId;
  let bookIndex = cart[bookId];
  if (bookIndex != -1) {
    cart.splice(bookIndex, 1);
  }
  res.redirect('/cart');
});

//* Checkout
app.post('/checkout', (req, res) => {
  const totalPrice = cart.reduce((total, book) => total + book.price, 0);
  res.render('checkout', { cart, totalPrice, profile });
});

//* Checkout / Done
app.post('/checkout-done', (req, res) => {
  const totalPrice = cart.reduce((total, book) => total + book.price, 0);
  const trackingNumber = Math.floor(Math.random() * 1000000000);
  const { address, name } = req.body;
  res.render('checkout-done', { totalPrice, address, name, trackingNumber, profile });
  cart = [];
});
//! End Cards
//////////////
//! Admin
app.get('/admin', (req, res) => {
  const totalPrice = cart.reduce((total, book) => total + book.price, 0);
  res.render('admin-login', {
    profile,
    totalPrice
  });
});

app.get('/admin/dashboard', (req, res) => {
  res.render('admin-dashboard', {
    books
  });
});

//* Authenticate login
app.post('/admin/dashboard', (req, res) => {
  const { username, password } = req.body;
  if (username !== 'admin' && password !== 'password') {
    res.redirect('/');
  } else {
    res.render('admin-dashboard', {
      books
    });
  };
});

//* Edit Book
app.post('/admin/edit-book', (req, res) => {
  const { id }= req.body;
  const book = books[id];
  res.render('edit-book', {
    book
  });
});

//* Edit Book render
app.post('/admin/edit-book/done', (req, res) => {
  let { bookId, titleBook, author, price, releaseDate, image } = req.body;
  let book = books[bookId];
  book.title = titleBook;
  book.author = author;
  book.releaseDate = releaseDate;
  book.price = price;
  book.image = image;
  res.redirect('/admin/dashboard');
});

//* Delete book
app.post('/admin/delete-book', (req, res) => {
  const { id }= req.body;
  const book = books[id];
  if (book) {
    books.splice(id, 1);
    for (let i = id; i < books.length; i++) {
      books[i].id = i;
    }
  }
  res.redirect('/admin/dashboard');
});

//* Add a new book
app.post('/admin/add-book', (req, res) => {
  res.render('add-book');
});

//* Add a new book / Done
app.post('/admin/add-book/done',  (req, res) => {
  let { titleBook, author, price, releaseDate, image } = req.body;
  let book = {
    id: books.length + 1,
    title: titleBook,
    author: author,
    price: price,
    releaseDate: releaseDate,
    image: image,
  };
  books.push(book);
  res.redirect('/admin/dashboard');
});
//! End Admin
//////////////
//! User Profile
app.get('/profile', (req, res) => {
  const totalPrice = cart.reduce((total, book) => total + book.price, 0);
  let userBooks = [0, 1, 2, 3];
  let userBookList = userBooks.map(id => books.find(book => book.id === id));
  res.render('profile', {
    profile,
    userBookList,
    books,
    totalPrice
  });
});
//!! Start server
const PORT = 80;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));