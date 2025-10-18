/**
 * Migration Script: Fix Legacy Stock Records
 *
 * This script fixes stock records that are missing required fields:
 * - unit (required field)
 * - purchasePricePerBaseUnit (required field)
 * - location case sensitivity ('Store' -> 'store')
 *
 * Run this ONCE to fix your existing database:
 * node migrate-fix-stock-fields.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Stock = require('./models/stock.model');
const Product = require('./models/product.model');

async function migrateStockFields() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // 1️⃣ Fix location case sensitivity: 'Store' -> 'store'
    const locationResult = await Stock.updateMany(
      { location: 'Store' },
      { $set: { location: 'store' } }
    );
    console.log('\n📍 Location Case Fix:');
    console.log(`   - Matched: ${locationResult.matchedCount} records`);
    console.log(`   - Modified: ${locationResult.modifiedCount} records`);

    // 2️⃣ Find all stock records missing required fields
    const stocksNeedingFix = await Stock.find({
      $or: [
        { unit: { $exists: false } },
        { unit: null },
        { purchasePricePerBaseUnit: { $exists: false } },
        { purchasePricePerBaseUnit: null },
      ],
    }).populate('product');

    console.log(
      `\n🔧 Found ${stocksNeedingFix.length} stock records needing field fixes`
    );

    let fixedCount = 0;
    let errorCount = 0;

    // 3️⃣ Fix each stock record
    for (const stock of stocksNeedingFix) {
      try {
        let needsSave = false;

        // Get the product for this stock
        let product = stock.product;
        if (!product) {
          // If product not populated, fetch it
          product = await Product.findById(stock.product);
        }

        if (!product) {
          console.warn(
            `   ⚠️  Warning: Stock ${stock._id} has invalid product reference`
          );
          errorCount++;
          continue;
        }

        // Fix missing unit
        if (!stock.unit) {
          stock.unit = product.baseUnit;
          needsSave = true;
          console.log(
            `   ✓ Fixed unit for stock ${stock._id} (product: ${product.name})`
          );
        }

        // Fix missing purchasePricePerBaseUnit
        if (
          stock.purchasePricePerBaseUnit === undefined ||
          stock.purchasePricePerBaseUnit === null
        ) {
          stock.purchasePricePerBaseUnit = product.latestPurchasePrice || 0;
          needsSave = true;
          console.log(
            `   ✓ Fixed purchasePricePerBaseUnit for stock ${stock._id} (product: ${product.name})`
          );
        }

        if (needsSave) {
          await stock.save();
          fixedCount++;
        }
      } catch (error) {
        console.error(`   ❌ Error fixing stock ${stock._id}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n✅ Migration Complete!');
    console.log(`   - Successfully fixed: ${fixedCount} records`);
    console.log(`   - Errors: ${errorCount} records`);

    // Disconnect
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

migrateStockFields();

