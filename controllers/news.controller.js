const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  insertComment,
  fetchCommentsById,
  fetchUsers,
  updateVotes,
  deleteCommentById,
  fetchUserByName,
  updateCommentVotes,
  insertArticle,
  fetchArticlesCount,
  insertTopic,
  deleteArticleById,
} = require("../models/news.model");
const { readFile } = require("fs/promises");

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
  const limit = req.query.limit;
  const page = req.query.p;
  const articles = fetchArticles(topic, sort_by, order, limit, page);
  const count = fetchArticlesCount();
  Promise.all([articles, count])
    .then((result) => {
      res.send({ articles: result[0], total_count: result[1] });
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
  const limit = req.query.limit;
  const page = req.query.p;
  fetchCommentsById(article_id, limit, page)
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

exports.getEndpoints = (req, res, next) => {
  readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((endpoints) => {
      endpoints = JSON.parse(endpoints);
      res.send({ endpoints });
    })
    .catch(next);
};

exports.getUserByName = (req, res, next) => {
  const username = req.params.username;
  fetchUserByName(username)
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};

exports.patchCommentVotes = (req, res, next) => {
  const comment_id = req.params.comment_id;
  const increment = req.body.inc_votes;
  updateCommentVotes(comment_id, increment)
    .then((comment) => {
      res.send({ comment });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const articleBody = req.body;
  insertArticle(articleBody)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const topicBody = req.body;
  insertTopic(topicBody)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  deleteArticleById(articleId)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
