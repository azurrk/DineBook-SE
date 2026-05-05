const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DineBook API',
      version: '1.0.0',
      description: 'Restaurant reservation system API',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'User name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            phone: {
              type: 'string',
              description: 'User phone number',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'User creation date',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User',
            },
            token: {
              type: 'string',
              description: 'JWT authentication token',
            },
          },
        },
        Table: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Table ID',
            },
            number: {
              type: 'string',
              description: 'Table number',
            },
            capacity: {
              type: 'integer',
              description: 'Table capacity',
            },
            location: {
              type: 'string',
              description: 'Table location',
            },
            status: {
              type: 'string',
              description: 'Table status',
            },
          },
        },
        Reservation: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Reservation ID',
            },
            user_id: {
              type: 'integer',
              description: 'User ID',
            },
            table_id: {
              type: 'integer',
              description: 'Table ID',
            },
            table_number: {
              type: 'string',
              description: 'Table number',
            },
            table_location: {
              type: 'string',
              description: 'Table location',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Reservation date',
            },
            time: {
              type: 'string',
              format: 'time',
              description: 'Reservation time',
            },
            guests: {
              type: 'integer',
              description: 'Number of guests',
            },
            status: {
              type: 'string',
              description: 'Reservation status',
            },
            special_request: {
              type: 'string',
              description: 'Special requests',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Reservation creation date',
            },
          },
        },
        WorkingHours: {
          type: 'object',
          properties: {
            open: {
              type: 'string',
              format: 'time',
              description: 'Opening time',
            },
            close: {
              type: 'string',
              format: 'time',
              description: 'Closing time',
            },
            closed: {
              type: 'boolean',
              description: 'Whether the restaurant is closed',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./controllers/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};
