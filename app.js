const express = require("express");
const {
  handleServerErrors,
  handlePSQLErrors,
  handleCustomErrors,
} = require("./controllers/errors.controller");
const apiRouter = require("./routes/api-router");
const app = express();
app.use(express.json());

// Endpoints

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
});

// Error Handling

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
