const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Backend Platform Template API",
      version: "1.0.0",
      description: "Production-ready backend template with Node.js"
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Local API (same base as app.use('/api', routes))"
      }
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
    ]
  },
  // Paths must resolve from this file so it works from any cwd (Docker: /app)
  apis: [path.join(__dirname, "../routes/*.js")]
};

const swaggerSpec = swaggerJsdoc(options);

// Ensure OpenAPI version is always present for Swagger UI (avoids "valid version field" errors)
if (!swaggerSpec.openapi && !swaggerSpec.swagger) {
  swaggerSpec.openapi = "3.0.3";
}

module.exports = swaggerSpec;
