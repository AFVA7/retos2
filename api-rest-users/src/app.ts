const express = require('express');
const cors = require('cors');
import userRoutes  from './routes/userRoutes';
import {errorMiddleware} from './middlewares/errorMiddleware';

const app = express();
app.use(express.json());
app.use(cors());
// Rutas
app.use('/api', userRoutes);

// Middleware para manejar errores
app.use(errorMiddleware);

export default app;
