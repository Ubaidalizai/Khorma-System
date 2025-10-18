const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: false, // nullable for walk-in cash sales
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: false, // riding man or delivery person
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    dueAmount: {
      type: Number,
      default: 0, // calculated: totalAmount - paidAmount
    },
    placedIn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account', // Dakhal / Tajri / Saraf
      required: true,
    },
    invoiceType: {
      type: String,
      enum: ['small', 'large'],
      default: 'small',
    },
    soldBy: {
      // the cashier / user who created the sale
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);
