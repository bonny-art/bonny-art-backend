import mongoose from 'mongoose';

const { DB_HOST } = process.env;

if (!DB_HOST) {
  throw new Error('DB_HOST is not defined in the environment variables');
}

const connectDB = async () => {
  try {
    await mongoose.connect(DB_HOST);
    console.log('Database connection successful');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
