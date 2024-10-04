import express from 'express';
import 'dotenv/config';
import morgan from 'morgan';
import cors from 'cors';
import routes from './routes/index.js';
const app = express();
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
app.use((err, req, res) => {
    const { status = 500, message = 'Server error' } = err;
    res.status(status).json({ message });
    console.log(err);
});
export default app;
