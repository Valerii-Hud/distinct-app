import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const { MONGO_URI } = process.env;

const connectToMongoDB = async () => {
  try {
    if (!MONGO_URI) {
      console.log(`MONGO_URI not found`);
      return { success: false };
    }

    const connection = await mongoose.connect(MONGO_URI);

    console.log(`MongoDB connected: ${connection.connection.host}`);

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error on MongoDB connection: ${error.message}`);
      return { success: false };
    }
  }
};

export default connectToMongoDB;
