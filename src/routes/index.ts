import express from 'express';
const router = express.Router();

router.get('/health', (req, res) => {
	res.status(201).send('status OK');
});

export default router;
