const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username required']
  },
  surname: {
    type: String,
    required: [true, 'Surname required']
  },
  phone: {
    type: Number,
    required: [true, 'Phone number required']
  },
  payer: {
    type: String,
    required: [true, 'Payer Email required']
  },
  orderId: {
    type: String,
    required: [true, 'OrderId required']
  },
  paymentTypeId: {
    type: String,
    required: [true, 'Payment Id required']
  },
  amount: {
    type: Number,
    required: [true, "Amount required"]
  },
  dateGenerated: {type: Date, default: Date.now(), required: true},
  status: {
    type: Number,
    default:0
  },
  reference: String
})

const invoiceModel = mongoose.model('invoice', invoiceSchema);

module.exports = invoiceModel;