const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
import userRoutes  from './routes/userRoutes';
import {errorMiddleware} from './middlewares/errorMiddleware';


const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
// Rutas
app.use('/api', userRoutes);

// Middleware para manejar errores
app.use(errorMiddleware);

export default app;
