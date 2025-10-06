import express from 'express';
import { corsMiddleware } from './middlewares/cors';
import { errorHandler } from './middlewares/errorHandler';
import apiRoutes from './routes/api/index';

const app = express();
app.use(express.json());
app.use(corsMiddleware);
app.use('/api', apiRoutes);
app.use(errorHandler);

export default app;