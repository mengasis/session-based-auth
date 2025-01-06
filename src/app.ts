import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsConfig from './config/corsConfig';
import publicRoutes from './routes/publicRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './utils/errorHandler';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsConfig));

app.use('/', publicRoutes);
app.use('/auth', authRoutes);

app.use(errorHandler);

export default app;
