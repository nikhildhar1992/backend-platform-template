const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const sanitizeBody = require("./middlewares/sanitize.middleware");
const routes = require("./routes");
const errorHandler = require("./middlewares/error.middleware");
const { requestIdMiddleware } = require("./middlewares/requestId.middleware");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger.js");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Helps req.ip match real client IP when behind a proxy; also stabilizes rate-limit keys in some setups
app.set("trust proxy", process.env.TRUST_PROXY === "1" ? 1 : false);

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(requestIdMiddleware);
/*
  Middleware to parse JSON body
*/

/*
  Security middleware
*/
app.use(helmet());

/*
  Enable cross origin requests
*/
app.use(cors({
  // CRA dev server (React + TS); backend itself; tighten in production
  origin: ["http://localhost:3000", "http://localhost:5000"],
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
// After JSON parse — Express 5–safe: only mutates req.body (not req.query)
app.use(sanitizeBody);

app.use("/api", routes);

app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found"
    });
});
app.use(errorHandler);


module.exports = app;
