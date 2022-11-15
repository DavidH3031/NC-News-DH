const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  insertComment,
  fetchCommentsById,
} = require("../models/news.model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.send({ articles });
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

exports.postComment = (req, res, next) => {
  const article_id = req.params.article_id;
  const comment = req.body;
  insertComment(article_id, comment)
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchCommentsById(article_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch(next);
};
