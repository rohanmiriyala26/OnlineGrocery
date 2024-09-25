const express = require('express');
const session = require('express-session');
const path = require('path');
const indexRouter = require('./app_server/routes/index');

const app = express();
const productController = require('./app_server/controllers/products');
// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Routes
app.get('/products', productController.list);
app.post('/cart/add', productController.addToCart);
app.get('/cart', productController.showCart);
app.post('/cart/remove', productController.removeFromCart);

// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

// Use routers
app.use('/', indexRouter);

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));
// Error handling
app.use((req, res, next) => {
  res.status(404).send('Sorry, page not found');
});

module.exports = app;
