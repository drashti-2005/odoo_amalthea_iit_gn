import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/odoo_amalthea';
    
    logger.info('Attempting to connect to MongoDB...');
    logger.info(`MongoDB URI: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials in log
    
    await mongoose.connect(mongoUri);
    
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    logger.error('Error during MongoDB disconnection:', error);
    process.exit(1);
  }
});