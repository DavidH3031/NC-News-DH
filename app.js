const express = require("express");
const { handleServerErrors } = require("./controllers/errors.controller");
const { getTopics } = require("./controllers/news.controller");
const app = express();

// Endpoints

app.get("/api/topics", getTopics);

// Error Handling

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
});

app.use(handleServerErrors);

module.exports = app;
