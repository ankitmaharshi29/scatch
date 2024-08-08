const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const isLoggedIn = require("../middlewares/isLoggedIn");

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

module.exports = router;