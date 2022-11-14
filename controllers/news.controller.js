const { fetchTopics, fetchArticleById } = require("../models/news.model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  fetchArticleById;
};
