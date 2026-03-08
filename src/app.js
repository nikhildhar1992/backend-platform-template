const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

/*
  Middleware to parse JSON body
*/
app.use(express.json());

/*
  Security middleware
*/
app.use(helmet());

/*
  Enable cross origin requests
*/
app.use(cors());

/*
  Health check endpoint
  Used by load balancers / monitoring tools
*/
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
  });
});

module.exports = app;