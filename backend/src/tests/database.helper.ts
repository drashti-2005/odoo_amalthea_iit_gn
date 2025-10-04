// Database setup for tests that require database
import mongoose from 'mongoose';

let isConnected = false;

export const setupTestDatabase = async (): Promise<boolean> => {
  if (isConnected) return true;

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_management_test';
    
    // Create a timeout promise with a handle we can clear
    let timeoutHandle: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(() => reject(new Error('Connection timeout')), 5000);
    });

    // Race between connection and timeout
    try {
      await Promise.race([
        mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 3000,
          connectTimeoutMS: 3000,
          socketTimeoutMS: 3000
        }),
        timeoutPromise
      ]);
      clearTimeout(timeoutHandle!);
      isConnected = true;
      console.log('Connected to test database');
      return true;
    } catch (error) {
      clearTimeout(timeoutHandle!);
      throw error;
    }
  } catch (error) {
    console.log('Failed to connect to test database. Skipping database tests.');
    return false;
  }
};

export const cleanupTestDatabase = async (): Promise<void> => {
  if (!isConnected || mongoose.connection.readyState !== 1) {
    return;
  }

  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  } catch (error) {
    console.log('Cleanup error:', error);
  }
};

export const closeTestDatabase = async (): Promise<void> => {
  if (!isConnected) return;

  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    isConnected = false;
    console.log('Test database connection closed');
  } catch (error) {
    console.log('Error closing test database:', error);
  }
};