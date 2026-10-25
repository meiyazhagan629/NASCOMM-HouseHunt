const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/househunt';

  try {
    // Attempt standard connection with 3s timeout
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.warn(`[Database] Standard MongoDB connection failed (${err.message}). Starting MongoMemoryServer fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const fallbackURI = memoryServer.getUri();
      const conn = await mongoose.connect(fallbackURI);
      console.log(`[Database] Fallback In-Memory MongoDB connected: ${fallbackURI}`);
    } catch (memErr) {
      console.error(`[Database] Critical: Could not connect to any MongoDB instance:`, memErr.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (err) {
    console.error(`[Database] Disconnect error:`, err.message);
  }
};

module.exports = { connectDB, disconnectDB };
