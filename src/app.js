import express from "express";
import authRoutes from "./routes/auth.routes.js";
import accountRouter from "./routes/accounts.route.js";
import cookieParser from "cookie-parser";

// swagger setup
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Swagger docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRouter);
export default app;
