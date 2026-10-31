const mongoose = require('mongoose');

/**
 * Builds or retrieves the MongoDB connection URI from environment variables.
 */
function getMongoUri() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  const user = encodeURIComponent(process.env.DB_USER || '');
  const pass = encodeURIComponent(process.env.DB_PASSWORD || '');
  const host = process.env.DB_HOST || 'prespace-stg.ktvtf5x.mongodb.net';
  const dbName = process.env.DB_NAME || 'prespace_question_bank';

  return `mongodb+srv://${user}:${pass}@${host}/${dbName}?retryWrites=true&w=majority`;
}

/**
 * Masks user/pass for safe logging
 */
function maskUri(uri) {
  try {
    return uri.replace(/\/\/(.*?):(.*?)@/, '//$1:****@');
  } catch {
    return 'mongodb+srv://****@...';
  }
}

/**
 * Connects to MongoDB Atlas
 */
async function connectDB() {
  const uri = getMongoUri();
  console.log(`[Database] Attempting connection to MongoDB: ${maskUri(uri)}`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`[Database] MongoDB Connected Successfully! Host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database] MongoDB Connection Error: ${error.message}`);
    // Do not terminate process immediately to allow server to start, or re-throw based on config
    return null;
  }
}

// Connection event listeners
mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] MongoDB reconnected.');
});

module.exports = {
  connectDB,
  getMongoUri,
  mongoose,
};
