const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');
const session = require('express-session');

// In-memory user store (for demonstration purposes)
let users = [
  { username: 'admin', password: 'admin123', name: 'Admin', email: 'admin@example.com', address: '' },
  { username: 'rohan', password: 'rohanmiriyala', name: 'Rohan', email: 'rohan@example.com', address: '' },
  { username: 'harsha', password: 'harshavardhan', name: 'Admin', email: 'harsha@example.com', address: '' }
];

// Use session middleware
router.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Set to true for HTTPS
}));

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next(); // User is logged in, proceed to the next middleware/route
  }
  res.redirect('/signin-signup'); // User is not logged in, redirect to sign-in page
}

// Home page
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Welcome to the Grocery Store', 
    user: req.session.user 
  });
});

// List all products
router.get('/products', productController.list);

// About page
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

// Get product by ID
router.get('/products/:id', productController.getProduct);

// Add product to cart
router.post('/cart/add', (req, res) => {
  const { id, quantity } = req.body; // Assuming you send product ID and quantity

  const cart = req.session.cart || [];
  const product = productController.getProductById(id); // Fetch product by ID

  if (product) {
    // Check if product already exists in the cart
    const existingProductIndex = cart.findIndex(item => item.id === id);

    if (existingProductIndex > -1) {
      // Update quantity if product exists in the cart
      cart[existingProductIndex].quantity += quantity;
    } else {
      // Add new product to the cart
      cart.push({ ...product, quantity });
    }

    req.session.cart = cart; // Save updated cart to session
    res.status(200).send('Product added to cart');
  } else {
    res.status(404).send('Product not found');
  }
});

// Render cart page
router.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  res.render('cart', { title: 'Your Cart', cart });
});

// Render checkout page
router.get('/checkout', isAuthenticated, (req, res) => {
  const user = req.session.user;
  const address = user && user.address ? user.address : '';
  const cart = req.session.cart || []; // Get cart from session

  console.log('Cart:', cart); // Log the cart to debug

  res.render('checkout', { title: 'Checkout', user, address, cart }); // Pass cart to the template
});


// Handle checkout form submission
router.post('/cart/checkout', isAuthenticated, (req, res) => {
  const { address } = req.body; // Capture the address from the form submission

  // Validate address input
  if (!address) {
    return res.render('checkout', { title: 'Checkout', user: req.session.user, error: 'Address is required' });
  }

  // Create order details
  const orderId = Math.random().toString(36).substring(2, 15); // Generate a random order ID
  const newOrder = {
    id: orderId,
    date: new Date(),
    status: 'Pending',
    total: req.session.cart.reduce((acc, item) => acc + item.price * item.quantity, 0) // Total price from the cart
  };

  // Save the order to the session (or a database)
  req.session.orders = req.session.orders || []; // Initialize orders if not present
  req.session.orders.push(newOrder);

  // Optionally, save the address in user session
  req.session.user.address = address; // Store address in user session

  // Clear the cart after successful checkout
  req.session.cart = []; // Clear the cart after checkout

  res.redirect('/orders'); // Redirect to orders page
});

// Sign in / Register page
router.get('/signin-signup', (req, res) => {
  res.render('signin-signup', { title: 'Sign In / Register' });
});

// Sign-up form rendering
router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Create an Account' });
});

// Handle sign-up
router.post('/signup', (req, res) => {
  const { username, password, name, email, address = '' } = req.body; // Initialize address as empty if not provided

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.render('signup', { title: 'Create an Account', error: 'User already exists' });
  }

  const newUser = { username, password, name, email, address }; // Store address in new user
  users.push(newUser);
  req.session.user = newUser; // Save user in session
  res.redirect('/');
});

// Handle sign-in form submission
router.post('/signin', (req, res) => {
  const { username, password } = req.body;

  // Find user in in-memory store
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // Save user in session and redirect to home page
    req.session.user = user;
    res.redirect('/');
  } else {
    // Invalid credentials, re-render sign-in page with error
    res.render('signin-signup', { title: 'Sign In / Register', error: 'Invalid credentials' });
  }
});

// Resign route
router.post('/resignin', (req, res) => {
  const { username, password } = req.body;

  // Here, you can add logic to handle user authentication (e.g., validate credentials)
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // Save user in session and redirect to home page
    req.session.user = user;
    res.redirect('/');
  } else {
    res.redirect('/signin-signup');  // After sign-in, redirect to the home page
  }
});

// Sign-out route
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Profile page
router.get('/profile', isAuthenticated, (req, res) => {
  const user = req.session.user;
  const orders = req.session.orders || [];
  res.render('profile', { title: 'User Profile', user, orders });
});

// Update profile
router.post('/update-profile', isAuthenticated, (req, res) => {
  const { name, email, address } = req.body;

  req.session.user.name = name; // Update session data
  req.session.user.email = email; // Update session email
  req.session.user.address = address; // Update session address
  res.redirect('/profile');
});

// Delete account
router.post('/delete-account', isAuthenticated, (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Orders page
router.get('/orders', isAuthenticated, (req, res) => {
  const orders = req.session.orders || [];
  res.render('orders', { title: 'Your Orders', orders });
});

// Show the change password page
router.get('/change-password', isAuthenticated, (req, res) => {
  res.render('change-password', { title: 'Change Password' });
});

// Handle the change password form submission
router.post('/change-password', isAuthenticated, (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).send('All fields are required');
  }
  
  if (newPassword !== confirmPassword) {
    return res.status(400).send('New passwords do not match');
  }

  if (req.session.user.password !== currentPassword) {
    return res.status(400).send('Current password is incorrect');
  }

  req.session.user.password = newPassword; // Update the password in the session
  res.redirect('/profile'); // Redirect to the profile page after changing the password
});

// Track shipment page
router.get('/track-shipment', (req, res) => {
  res.render('trackShipment', { title: 'Track Shipment' });
});

// Track order API
router.get('/api/track-order/:id', isAuthenticated, (req, res) => {
  const orderId = req.params.id;
  const order = req.session.orders.find(order => order.id === orderId); // Find the specific order
  if (order) {
    return res.json(order);
  }
  res.status(404).send('Order not found'); // Return 404 if the order does not exist
});

module.exports = router;
