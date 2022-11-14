const { fetchTopics, fetchArticleById } = require("../models/news.model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticleById(article_id)
    .then((article) => {
      res.send({ article });
    })
    .catch(next);
};
