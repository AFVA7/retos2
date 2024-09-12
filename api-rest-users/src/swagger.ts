const  swaggerJSDoc  = require('swagger-jsdoc');
const  swaggerUi  = require('swagger-ui-express');
import { Application } from 'express';


// Definición de opciones para Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST con Node.js y TypeScript',
      version: '1.0.0',
      description: 'API RESTful desarrollada con Express, TypeScript, y OpenAPI (Swagger)',
    },
  },
  apis: ['./src/routes/*.ts'],  // Archivos donde están definidas las rutas
};

// Inicializa SwaggerJSDoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Función para configurar Swagger en la app
export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
