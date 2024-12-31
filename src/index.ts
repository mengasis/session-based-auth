import express from 'express';
import routes from './routes';
const app = express();

app.use(express.json());

app.use('/auth', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`);
});
