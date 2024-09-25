const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');

// Home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Welcome to the Grocery Store' });
});

// List all products (with optional category filtering)
router.get('/products', productController.list); // This will list products, supporting category filtering

// About page
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

// Get product by ID
router.get('/products/:id', productController.getProduct);  // Ensure productController.getProduct is defined and retrieves product by ID

// Add a new product
router.post('/products', productController.addProduct);  // Ensure productController.addProduct is defined and can add products

// Add product to cart
router.post('/cart/add', productController.addToCart);  // Ensure productController.addToCart is defined

// Render cart page
router.get('/cart', (req, res) => {
  const cart = req.session.cart || [];  // Get the cart from the session or use an empty array if it doesn't exist
  res.render('cart', { title: 'Your Cart', cart: cart });
});
router.post('/cart/checkout', (req, res) => {
  // Here, you can add logic to handle user authentication (e.g., validate credentials)
  res.redirect('/signin-signup');  // After sign-in, redirect to the home page
});
router.post('/resignin', (req, res) => {
  // Here, you can add logic to handle user authentication (e.g., validate credentials)
  res.redirect('/signin-signup');  // After sign-in, redirect to the home page
});
// Sign in / Register page
router.get('/signin-signup', (req, res) => {
  res.render('signin-signup', { title: 'Sign In / Register' });
});

// Handle sign-in form submission
router.post('/signin', (req, res) => {
  // Here, you can add logic to handle user authentication (e.g., validate credentials)
  res.redirect('/');  // After sign-in, redirect to the home page
});

// Sign-up form rendering
router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Create an Account' });
});

// Handle sign-up form submission
router.post('/signup', (req, res) => {
  // Add logic to register the user (e.g., save user details to the database)
  res.redirect('/');  // After sign-up, redirect to the home page
});

module.exports = router;
