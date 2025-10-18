const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Unit name is required'],
      trim: true,
    },
    description: String,
    conversion_to_base: {
      type: Number,
      required: [true, 'Conversion to base unit is required'],
      min: [0.0001, 'Conversion factor must be greater than 0'],
      default: 1, // Base unit has conversion factor of 1
    },
    is_base_unit: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Unit = mongoose.model('Unit', unitSchema);

module.exports = Unit;
