export default {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: process.env.CORS_METHODS || ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: process.env.CORS_HEADERS || ['Content-Type', 'Authorization'], 
    credentials: process.env.CORS_CREDENTIALS === 'true',
  };