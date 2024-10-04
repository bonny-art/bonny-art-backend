import mongoose from 'mongoose';
import app from '../app.js';

const { DB_HOST, PORT } = process.env;

if (!DB_HOST) {
  throw new Error('DB_HOST is not defined');
}

if (!PORT) {
  throw new Error('PORT is not defined');
}

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log('Database connection successful');
      console.log(`Server running on ${PORT} PORT`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
