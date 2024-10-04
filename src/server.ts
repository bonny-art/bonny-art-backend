import connectDB from './db/connection-db.js';
import app from './app.js';

const { PORT } = process.env;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, (error?: Error) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log(`Server is running. Use our API on port: ${PORT}`);
  });
};

startServer();
