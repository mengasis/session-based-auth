import express from 'express';
import publicRoutes from './routes/publicRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './utils/errorHandler';

const app = express();

app.use(express.json());

app.use('/', publicRoutes);
app.use('/auth', authRoutes);

app.use(errorHandler);

export default app;
