const mongoose = require('mongoose');
require('dotenv').config();

async function inspectDb() {
  console.log('Connecting to:', process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('Connected!');

  const collections = await mongoose.connection.db.listCollections().toArray();
  for (const c of collections) {
    const indexes = await mongoose.connection.db.collection(c.name).indexes();
    console.log(`\n=== Collection: ${c.name} ===`);
    indexes.forEach(idx => {
      console.log(`  Index: ${idx.name}, Key: ${JSON.stringify(idx.key)}, Unique: ${idx.unique || false}`);
    });
  }

  await mongoose.disconnect();
}

inspectDb().catch(err => {
  console.error('Inspect error:', err);
  process.exit(1);
});

