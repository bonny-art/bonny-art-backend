import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import routes from './routes/index.js';
import { IHttpError } from './types/messages-types.js';

const app: Express = express();

app.use(morgan('tiny'));

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Backend is alive!');
});

app.use('/api/:language', routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(
  (err: IHttpError, req: Request, res: Response, _next: NextFunction): void => {
    const { status = 500, message = 'Server error' } = err;

    res.status(status).json({ message });
    console.log(err);
  }
);

export default app;
