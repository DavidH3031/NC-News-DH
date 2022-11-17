const db = require("../db/connection.js");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((res) => {
    return res.rows;
  });
};

const fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
  const allowedSort = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const orderLookup = { asc: "asc", desc: "desc" };
  const queryArgs = [];

  if (!allowedSort.includes(sort_by)) {
    return Promise.reject({
      status: 404,
      msg: `sort_by: '${sort_by}' is not found.`,
    });
  }

  if (!Object.keys(orderLookup).includes(order)) {
    return Promise.reject({
      status: 400,
      msg: `order '${order}' does not exist. Please use: 'asc' or 'desc'`,
    });
  }

  let queryStr = `
  SELECT article_id, title, topic, articles.author, articles.created_at, articles.votes, 
  (SELECT COUNT(*) FROM comments 
  WHERE articles.article_id = comments.article_id) as "comment_count" 
  FROM articles
  `;

  if (topic) {
    const topicRegex = /^[a-zA-Z]+$/g;
    if (topicRegex.test(topic)) {
      queryArgs.push(topic);
      queryStr += `WHERE topic = $1`;
    } else {
      return Promise.reject({
        status: 400,
        msg: `topic '${topic}' is not allowed`,
      });
    }
  }

  queryStr += `ORDER BY ${sort_by} ${orderLookup[order]};`;

  return db.query(queryStr, queryArgs).then((res) => {
    return res.rows;
  });
};

const fetchArticleById = (id) => {
  return db
    .query(
      `
    SELECT author, title, article_id, body, topic, created_at, votes,
    (SELECT COUNT(*) FROM comments 
    WHERE articles.article_id = comments.article_id) as "comment_count"
    FROM articles
    WHERE article_id = $1;`,
      [id]
    )
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Invalid ID: Article not found!",
        });
      }
      return res.rows[0];
    });
};

const fetchCommentsById = (id) => {
  return fetchArticleById(id)
    .then(() => {
      return db.query(
        `
      SELECT comment_id, votes, created_at, author, body 
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;
      `,
        [id]
      );
    })
    .then((res) => {
      return res.rows;
    });
};
const insertComment = (id, { username, body }) => {
  const date = new Date();
  return db
    .query(
      `
        INSERT INTO comments
        (body, author, article_id, votes, created_at)
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING *;
      `,
      [body, username, id, 0, date.toISOString()]
    )
    .then((comment) => {
      return comment.rows[0];
    });
};

const fetchUsers = () => {
  return db
    .query(
      `
      SELECT * FROM users;
    `
    )
    .then((users) => {
      return users.rows;
    });
};

const updateVotes = (id, vote_inc) => {
  return fetchArticleById(id)
    .then(() => {
      return db.query(
        `
        UPDATE articles 
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
      `,
        [vote_inc, id]
      );
    })
    .then((res) => {
      return res.rows[0];
    });
};

const deleteCommentById = (id) => {
  return db
    .query(
      `
      DELETE FROM comments WHERE comment_id = $1 RETURNING *;
    `,
      [id]
    )
    .then((deletedComment) => {
      if (!deletedComment.rows.length) {
        return Promise.reject({
          status: 404,
          msg: "comment with that ID does not exist",
        });
      }
      return;
    });
};

const fetchUserByName = (username) => {
  return db
    .query(
      `
    SELECT * FROM users 
    WHERE username = $1; 
    `,
      [username]
    )
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({
          status: 404,
          msg: "user with that username does not exist",
        });
      }
      return res.rows[0];
    });
};

const updateCommentVotes = (id, inc) => {
  return db
    .query(
      `
        UPDATE comments 
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *;
      `,
      [inc, id]
    )
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Invalid ID: comment not found!",
        });
      }
      return res.rows[0];
    });
};

const insertArticle = ({ title, topic, author, body }) => {
  const date = new Date();
  return db
    .query(
      `
    INSERT INTO articles 
    (title, topic, author, body, created_at, votes) 
    VALUES 
    ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `,
      [title, topic, author, body, date.toISOString(), 0]
    )
    .then((res) => {
      return fetchArticleById(res.rows[0].article_id);
    })
    .then((article) => {
      return article;
    });
};

module.exports = {
  fetchArticleById,
  fetchArticles,
  fetchCommentsById,
  fetchTopics,
  updateVotes,
  insertComment,
  fetchUsers,
  deleteCommentById,
  fetchUserByName,
  updateCommentVotes,
  insertArticle,
};
