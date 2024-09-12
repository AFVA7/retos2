import { setupSwagger } from "./swagger";

const express = require('Express');
const cors = require('cors');
const morgan = require('morgan');



const app = express();

const PORT = process.env.PORT || 3000;



// Configurar Swagger
setupSwagger(app);

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req: any , res:any) => {
    res.send('Hello World');
});

//app.use('/api/v1', require('./routes'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;


