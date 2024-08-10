const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn"); // Consistent import
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const ownerModel = require("../models/owner-model");
const orderModel = require("../models/order-model");
const bcrypt = require('bcrypt');

// Home Route
router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error, loggedin: false });
});

// Shop Route
router.get('/shop', isLoggedIn, async (req, res) => {
  try {
    const products = await productModel.find();
    res.render('shop', { products });
  } catch (err) {
    res.status(500).send('Error fetching products: ' + err.message);
  }
});

// Cart Route
router.get('/cart', isLoggedIn, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email }).populate('cart');
    let products = user.cart;

    let netTotal = products.reduce((total, product) => total + product.price, 0);

    res.render('cart', { products, netTotal });
  } catch (err) {
    res.status(500).send('Error fetching cart: ' + err.message);
  }
});

// Place Order Route
router.post('/placeorder', isLoggedIn, async (req, res) => {
  try {
    const { address, totalAmount } = req.body;
    const user = await userModel.findOne({ email: req.user.email }).populate('cart');

    if (!user) {
      return res.status(404).send('User not found');
    }

    const orders = user.cart.map(cartItem => {
      const quantity = cartItem.quantity || 1;
      const total = cartItem.price * quantity;

      return {
        userId: user._id,
        productId: cartItem._id,
        quantity: quantity,
        date: new Date(),
        total: total,
        status: 'Pending'
      };
    });

    await orderModel.insertMany(orders);

    user.cart = [];
    await user.save();

    res.redirect('/myaccount');
  } catch (err) {
    res.status(500).send('Error placing order: ' + err.message);
  }
});

// Add to Cart Route
router.get('/addtocart/:productid', isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({email:req.user.email});
  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "Product added to cart.");
  res.redirect("/shop");
});

// My Account Route
router.get('/myaccount', isLoggedIn, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    const orders = await orderModel.find({ userId: user._id });
    res.render('myaccount', { user, orders });
  } catch (err) {
    res.status(500).send('Error fetching account details: ' + err.message);
  }
});

// Account Details Route
router.get('/account/details', isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  const orders = await orderModel.find({ userId: user._id });
  res.render('accountDetails', { user, orders });
});

// Orders Route
router.get('/orders', isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  const orders = await orderModel.find({ userId: user._id });
  res.render('myOrders', { user, orders });
});

// Change Password Form Route
router.get('/account/changepassword', isLoggedIn, (req, res) => {
  res.render('changepassword', { 
    errorMessages: req.flash('error'),
    successMessages: req.flash('success')
  });
});

// Change Password Submission Route
router.post('/account/change-password', isLoggedIn, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const user = await userModel.findOne({ email: req.user.email });

    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/account/changepassword');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      req.flash('error', 'Current password is incorrect.');
    
     
      return res.redirect('/account/changepassword');
    }

    if (newPassword !== confirmPassword) {
      req.flash('error', 'New passwords do not match.');
      return res.redirect('/account/changepassword');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    req.flash('success', 'Password successfully changed.');
    res.redirect('/myaccount');
  } catch (err) {
    console.error('Error changing password:', err.message);
    res.status(500).send('Error changing password: ' + err.message);
  }
});

module.exports = router;
