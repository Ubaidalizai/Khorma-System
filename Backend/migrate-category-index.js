const mongoose = require('mongoose');
require('dotenv').config();

const migrateCategoryIndex = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('categories');

    // Drop the old unique index on name
    try {
      await collection.dropIndex('name_1');
      console.log('✅ Dropped old unique index on name');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️  Old index on name does not exist, skipping...');
      } else {
        console.log('⚠️  Error dropping old index:', error.message);
      }
    }

    // Drop the old compound index if it exists
    try {
      await collection.dropIndex('name_1_type_1');
      console.log('✅ Dropped old compound index on name and type');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️  Old compound index does not exist, skipping...');
      } else {
        console.log('⚠️  Error dropping old compound index:', error.message);
      }
    }

    // Create the new partial unique index
    await collection.createIndex(
      { name: 1, type: 1 },
      {
        unique: true,
        partialFilterExpression: { isDeleted: false },
        name: 'name_1_type_1_partial',
      }
    );
    console.log('✅ Created new partial unique index on name and type');

    // List all indexes to verify
    const indexes = await collection.indexes();
    console.log('\n📋 Current indexes:');
    indexes.forEach((index) => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
      if (index.partialFilterExpression) {
        console.log(
          `    Partial filter: ${JSON.stringify(index.partialFilterExpression)}`
        );
      }
    });

    console.log('\n🎉 Migration completed successfully!');
    console.log(
      'You can now create categories with the same name after soft deletion.'
    );
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateCategoryIndex();
}

module.exports = migrateCategoryIndex;
