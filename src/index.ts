import express from 'express';
import publicRoutes from './routes/publicRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(express.json());

app.use('/', publicRoutes);
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`);
});
