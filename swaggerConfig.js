const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'Documentation for your Express API',
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes folder
};

console.log('APIs:', options.apis);

/**
 * @swagger
 * /todo:
 *   get:
 *     description: Retrieve all To-Do items
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Server error
 */

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
