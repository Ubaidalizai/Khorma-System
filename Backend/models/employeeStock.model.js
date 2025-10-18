const mongoose = require('mongoose');

const employeeStockSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity_in_hand: {
      type: Number,
      required: true,
      min: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Ensure unique stock record per employee + product
employeeStockSchema.index({ employee: 1, product: 1 }, { unique: true });

const EmployeeStock = mongoose.model('EmployeeStock', employeeStockSchema);

module.exports = EmployeeStock;
