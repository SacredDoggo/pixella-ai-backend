import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: "API Docs", version: "1.0.0" },
  },
  apis: ['./src/**/*.ts'], // Path to your route files
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);