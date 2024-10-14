const products = [
  { _id:1,name: "Apple", price: 90, description: "Fresh apple", weight:"500 G",category: "fruits", image: "apple.png" },
  { _id:2,name: "Bread", price: 40, description: "Fresh bakery bread",weight:"400 G" ,category: "bakery", image: "bread.png" },
  { _id:3,name: "Milk", price: 28, description: "Fresh dairy milk", weight:"500 ML",category: "dairy", image: "milk.png" },
  { _id:4,name: "Orange Juice", price: 120, description: "Fresh orange juice", weight:"1L",category: "beverages", image: "orange_juice.png" },
  { _id:5,name: "Chips", price: 20, description: "Crispy potato chips",weight:"50 G",category: "snacks", image: "chips.png" },
  { _id:6,name: "Carrot", price: 25, description: "Fresh organic carrot", weight:"200 G",category: "vegetables", image: "carrot.png" },
  { _id:7,name: "Tomato", price: 45, description: "Juicy tomatoes",weight:"500 G", category: "vegetables", image: "tomato.png" },
  { _id:8,name: "Cheese", price: 130, description: "Premium cheddar cheese",weight:"200 G", category: "dairy", image: "cheese.png" },
  { _id:9,name: "Cookies", price: 60, description: "Chocolate chip cookies",weight:"100 G", category: "snacks", image: "cookies.png" },
  { _id:10,name: "Water", price: 20, description: "Bottled mineral water",weight:"1 L", category: "beverages", image: "water.png" },
  { _id:11,name: "Cake", price: 30, description: "Chocolate cake", weight:"110 G",category: "bakery", image: "cake.png" },
  { _id:12,name: "Banana", price: 70, description: "Fresh bananas",weight:"1 KG", category: "fruits", image: "banana.png" }
];

// List all products or filter by category
exports.list = (req, res) => {
  const category = req.query.category || 'all';
  
  const filteredProducts = category === 'all' 
    ? products 
    : products.filter(p => p.category === category);
  
  res.render('products', { title: 'Products', products: filteredProducts });
};

// Get a single product by ID
exports.getProduct = (req, res) => {
  const product = products.find(p => p._id == req.params.id);
  
  if (product) {
    res.render('product', { title: product.name, product });
  } else {
    res.status(404).send('Product not found');
  }
};

// Add a new product (simulated)
exports.addProduct = (req, res) => {
  const newProduct = {
    _id: products.length + 1,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
    category: req.body.category
  };
  products.push(newProduct);
  res.redirect('/products');
};

// Cart management functions
// Add product to the cart
const addProductToCart = (product, cart) => {
  if (!cart) {
    cart = []; // Create an empty cart if it doesn't exist
  }

  // Find if the product is already in the cart
  const cartItem = cart.find(item => item._id == product._id);

  if (cartItem) {
    cartItem.quantity += 1; // Increase quantity if the product is already in the cart
  } else {
    // Add new product with a unique identifier and set quantity to 1
    cart.push({ ...product, quantity: 1 });
  }

  return cart;
};

// Remove product from the cart by product ID
const removeProductFromCart = (productId, cart) => {
  if (!cart) {
    return []; // Return an empty array if the cart doesn't exist
  }

  // Filter the cart to remove the product by ID
  return cart.filter(item => item._id != productId);
};

// Update product quantity in the cart
const updateProductQuantity = (productId, newQty, cart) => {
  if (!cart) {
    return []; // Return an empty array if the cart doesn't exist
  }

  return cart.map(item => {
    if (item._id == productId) {
      item.quantity = newQty; // Update the quantity
    }
    return item;
  });
};

// Get the cart or return an empty cart if none exists
const getCart = (cart) => {
  return cart || [];
};

// Add product to the cart and save to session
exports.addToCart = (req, res) => {
  const productId = req.body.productId;

  if (!productId) {
    return res.status(400).send('Product ID is required');
  }

  // Find the product by its ID
  const product = products.find(p => p._id == productId);

  if (!product) {
    return res.status(404).send('Product not found');
  }

  // Add product to the cart
  const updatedCart = addProductToCart(product, req.session.cart);
  req.session.cart = updatedCart;  // Save the updated cart in the session

  res.redirect('/cart');
};

// Remove an item from the cart
exports.removeFromCart = (req, res) => {
  const productId = req.body.productId;

  // Remove the product from the cart
  const updatedCart = removeProductFromCart(productId, req.session.cart);
  req.session.cart = updatedCart;  // Save the updated cart in the session

  res.redirect('/cart');
};

// Update item quantity
exports.updateCartQuantity = (req, res) => {
  const { productId, newQty } = req.body;

  if (!productId || !newQty) {
    return res.status(400).send('Product ID and new quantity are required');
  }

  // Update the product quantity in the cart
  const updatedCart = updateProductQuantity(productId, newQty, req.session.cart);
  req.session.cart = updatedCart;  // Save the updated cart in the session

  res.redirect('/cart');
};

// Display the cart
exports.showCart = (req, res) => {
  const cart = getCart(req.session.cart);  // Get the current cart from the session
  res.render('cart', { title: 'Your Cart', cart });
};
