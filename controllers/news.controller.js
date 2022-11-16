const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  insertComment,
  fetchCommentsById,
  fetchUsers,
  updateVotes,
  deleteCommentById,
} = require("../models/news.model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const topic = req.query.topic;
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  fetchArticles(topic, sort_by, order)
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

exports.getArticleComments = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchCommentsById(article_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const article_id = req.params.article_id;
  const inc = req.body.inc_votes;
  updateVotes(article_id, inc)
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

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.send({ users });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
