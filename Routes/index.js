const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const userModel = require("../models/user-model");
const ownerModel = require("../models/owner-model");
const orderModel=require("../models/order-model")
router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error, loggedin: false });
});

router.get('/shop', isLoggedin, async (req, res) => {
  try {
    const products = await productModel.find();
    res.render('shop', { products });
  } catch (err) {
    res.status(500).send('Error fetching products: ' + err.message);
  }
});
router.get('/cart', isLoggedin, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email }).populate('cart');
    let products = user.cart;

    // Calculate the total price of all products in the cart
    let netTotal = products.reduce((total, product) => total + product.price, 0);

    res.render('cart', { products, netTotal });
  } catch (err) {
    res.status(500).send('Error fetching cart: ' + err.message);
  }
});
const Order = require('../models/order-model');

router.post('/placeorder', isLoggedin, async (req, res) => {
  try {
    const { address, totalAmount } = req.body;

    const user = await userModel.findOne({ email: req.user.email }).populate('cart');

    // Check if user is found
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Create orders array
    const orders = user.cart.map(cartItem => {
      // If quantity is not defined, default to 1
      const quantity = cartItem.quantity || 1;

      // Calculate total for each item
      const total = cartItem.price * quantity;

      return {
        userId: user._id,
        productId: cartItem._id,
        quantity: quantity,
        date: new Date(),
        total: total,
        status: 'Pending' // Example status
      };
    });

    // Save all orders
    await Order.insertMany(orders);

    // Clear cart after placing the order
    user.cart = [];
    await user.save();

    res.redirect('/myaccount');
  } catch (err) {
    res.status(500).send('Error placing order: ' + err.message);
  }
});


    // Crea
   

 
router.get('/addtocart/:prductid', isLoggedin, async (req, res) => {
  
    let user = await userModel.findOne({email:req.user.email});
 user.cart.push(req.params.prductid);
 await user.save();
 req.flash("success",);
 res.redirect("/shop");

});
// In your routes file (e.g., routes/index.js)
router.get('/myaccount', isLoggedin, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    
    const orders = await orderModel.find({ userId: user._id });

    res.render('myaccount', { user, orders }); // Pass both user and orders to the template
  } catch (err) {
    res.status(500).send('Error fetching account details: ' + err.message);
  }
});

router.get('/account/details', isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  const orders = await orderModel.find({ userId: user._id });
  res.render('accountDetails', { user, orders });
});

router.get('/orders', isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  const orders = await orderModel.find({ userId: user._id }); // Assuming you have a userId in your order schema
  res.render('myOrders', { user, orders });
});



module.exports = router;