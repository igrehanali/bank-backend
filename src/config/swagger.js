import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Banking API",
      version: "1.0.0",
      description: "Banking application API documentation",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to your route files for annotations
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
