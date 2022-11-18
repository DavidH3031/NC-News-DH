const db = require("../db/connection.js");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((res) => {
    return res.rows;
  });
};

const fetchArticles = (
  topic,
  sort_by = "created_at",
  order = "desc",
  limit = 10,
  page = 1
) => {
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

  if (limit !== 10) {
    const limitRegex = /^[0-9]+$/g;
    if (!limitRegex.test(limit)) {
      return Promise.reject({ status: 400, msg: "'limit' must be a number!" });
    }
  }

  if (page !== 1) {
    const pageRegex = /^[0-9]+$/g;
    if (!pageRegex.test(limit)) {
      return Promise.reject({
        status: 400,
        msg: "'page' must be a number!",
      });
    }
  }

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

  queryStr += `ORDER BY ${sort_by} ${orderLookup[order]}\n`;

  queryStr += `LIMIT ${limit} OFFSET ${page * limit - limit};`;

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

const fetchCommentsById = (id, limit = 10, page = 1) => {
  return fetchArticleById(id)
    .then(() => {
      if (limit !== 10) {
        const limitRegex = /^[0-9]+$/g;
        if (!limitRegex.test(limit)) {
          return Promise.reject({
            status: 400,
            msg: "'limit' must be a number!",
          });
        }
      }
      if (page !== 1) {
        const pageRegex = /^[0-9]+$/g;
        if (!pageRegex.test(limit)) {
          return Promise.reject({
            status: 400,
            msg: "'page' must be a number!",
          });
        }
      }

      let queryStr = `
      SELECT comment_id, votes, created_at, author, body 
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC `;

      queryStr += `LIMIT ${limit} OFFSET ${page * limit - limit};`;
      return db.query(queryStr, [id]);
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

const fetchArticlesCount = () => {
  return db
    .query(
      `
    SELECT COUNT(*) FROM articles;
    `
    )
    .then((counter) => {
      return counter.rows[0].count;
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
  fetchArticlesCount,
};
