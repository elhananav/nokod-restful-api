const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
  },
  apis: ['./*.js'], // Path to your route files
};

const specs = swaggerJsdoc(options);

module.exports = specs;
