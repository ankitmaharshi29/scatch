// order-model.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
  
  date: { type: Date, required: true },
  total: { type: Number, required: true },
  status: { type: String, required: true }
});

module.exports = mongoose.model('Order', orderSchema);