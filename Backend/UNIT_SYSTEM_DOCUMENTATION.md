# Dynamic Unit System Documentation

## Overview

The Dates Shop MIS now supports a flexible multi-unit system that allows products to be bought and sold in different units while maintaining accurate stock tracking in base units.

## Key Features

### 1. Units Table with Conversion Factors

- **unit_id (PK)**: Unique identifier
- **name**: Unit name (kg, carton, parcel, box, piece, etc.)
- **conversion_to_base**: Conversion factor to base unit (e.g., 1 carton = 12 pieces)
- **is_base_unit**: Boolean flag to identify base units
- **description**: Optional description

### 2. Products with Base Unit Reference

- **product_id (PK)**: Unique identifier
- **name**: Product name
- **base_unit_id (FK)**: Reference to the base unit for this product
- **description**: Product description

### 3. Purchase/Sale Items with Unit Support

- **purchase_item_id / sale_item_id (PK)**: Unique identifier
- **product_id (FK)**: Reference to product
- **unit_id (FK)**: Reference to the unit used for this transaction
- **quantity**: Quantity in the specified unit
- **unit_price**: Price per unit in the specified unit

## How It Works

### Base Unit Concept

Each product has a base unit (e.g., Dates base unit = kg). All stock tracking is done in the base unit, but transactions can be made in any compatible unit.

### Unit Conversion

The system automatically converts between units using conversion factors:

- **To Base Unit**: `baseQuantity = quantity × conversion_to_base`
- **From Base Unit**: `quantity = baseQuantity ÷ conversion_to_base`

### Example Scenario

1. **Product**: Premium Dates (base unit: kg)
2. **Available Units**: kg, bag (50 kg), carton (12 pieces)
3. **Purchase**: 10 bags → automatically converts to 500 kg in stock
4. **Sale**: 2 kg → deducts 2 kg from stock
5. **Sale**: 5 cartons → converts to 60 pieces, but needs additional logic for piece-to-kg conversion

## API Changes

### Unit Management

```javascript
// Create unit
POST /api/v1/unit
{
  "name": "Carton",
  "description": "1 carton = 12 pieces",
  "conversion_to_base": 12,
  "is_base_unit": false
}

// Create base unit
POST /api/v1/unit
{
  "name": "Kilogram",
  "description": "Base unit for weight",
  "conversion_to_base": 1,
  "is_base_unit": true
}
```

### Product Management

```javascript
// Create product with base unit
POST /api/v1/products
{
  "name": "Premium Dates",
  "base_unit": "unit_id_here",
  "min_level": 10
}
```

### Purchase with Units

```javascript
// Create purchase with different units
POST /api/v1/purchases
{
  "supplier": "supplier_id",
  "items": [
    {
      "product": "product_id",
      "unit": "bag_unit_id",
      "quantity": 10,
      "unit_price": 25.50
    }
  ]
}
```

### Sale with Units

```javascript
// Create sale with different units
POST /api/v1/sales
{
  "items": [
    {
      "product": "product_id",
      "unit": "kg_unit_id",
      "batchNumber": "BATCH001",
      "quantity": 2.5
    }
  ]
}
```

## Utility Functions

### Unit Conversion Utilities

```javascript
const {
  convertToBaseUnit,
  convertFromBaseUnit,
  convertQuantity,
} = require('./utils/unitConversion');

// Convert to base unit
const baseQuantity = await convertToBaseUnit(5, 'carton_unit_id'); // 5 cartons = 60 pieces

// Convert from base unit
const quantity = await convertFromBaseUnit(100, 'bag_unit_id'); // 100 kg = 2 bags

// Convert between units
const converted = await convertQuantity(10, 'carton_unit_id', 'bag_unit_id');
```

## Database Schema Changes

### Units Collection

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  conversion_to_base: Number,
  is_base_unit: Boolean,
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection

```javascript
{
  _id: ObjectId,
  name: String,
  base_unit: ObjectId, // Reference to Units
  // ... other fields
}
```

### Purchase Items Collection

```javascript
{
  _id: ObjectId,
  purchase: ObjectId,
  product: ObjectId,
  unit: ObjectId, // Reference to Units
  quantity: Number,
  unit_price: Number,
  total: Number
}
```

### Sale Items Collection

```javascript
{
  _id: ObjectId,
  sale: ObjectId,
  product: ObjectId,
  unit: ObjectId, // Reference to Units
  batchNumber: String,
  quantity: Number,
  price: Number,
  total: Number
}
```

### Stock Collection

```javascript
{
  _id: ObjectId,
  product: ObjectId,
  unit: ObjectId, // Always the product's base unit
  batchNumber: String,
  location: String,
  quantity: Number // Always in base unit
}
```

## Validation

New validation schemas have been created for:

- Unit creation and updates
- Product creation and updates
- Purchase and purchase items
- Sale and sale items

All validation includes proper ObjectId validation and unit-specific constraints.

## Benefits

1. **Flexibility**: Buy and sell in different units
2. **Accuracy**: Stock always tracked in base units
3. **Scalability**: Easy to add new units
4. **Consistency**: Automatic conversion prevents errors
5. **Future-proof**: Supports complex unit relationships

## Migration Notes

When migrating existing data:

1. Create base units for existing products
2. Update products to reference base units
3. Convert existing stock quantities to base units
4. Update purchase/sale items to include unit references

## Testing

Use the provided test script to verify functionality:

```bash
node test-unit-conversion.js
```

This will test unit creation, conversion functions, and basic product operations.
