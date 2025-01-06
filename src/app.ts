import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csrf from 'csurf';

import corsConfig from './config/corsConfig';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './utils/errorHandler';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const csrfProtection = csrf({ cookie: true });

app.use(cors(corsConfig));

app.get('/', csrfProtection);

app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get('/health', (_, res) => {
  res.status(201).send('status OK');
});

app.use('/auth', authRoutes);

app.use(errorHandler);

export default app;
