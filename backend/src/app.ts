import express from 'express';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes/api/index';

const app = express();
app.use(express.json());
app.use(corsMiddleware);
app.use('/api', apiRoutes);
app.use(errorHandler);

export default app;