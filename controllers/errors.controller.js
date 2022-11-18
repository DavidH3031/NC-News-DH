exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error!" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request - Invalid datatype for ID" });
  } else if (err.code === "23502") {
    let msg = "Invalid POST body!";
    if (err.column === "title") msg = 'Key "title" is missing';
    if (err.column === "topic") msg = 'Key "topic" is missing';
    if (err.column === "body") msg = 'Key "body" is missing';
    if (err.column === "author") msg = 'Key "username/author" is missing';
    if (err.column === "votes") msg = 'Key "inc_votes" is missing';
    res.status(400).send({ msg });
  } else if (
    err.code === "23503" &&
    err.constraint === "comments_author_fkey"
  ) {
    res.status(400).send({ msg: "Username does not exist!" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
