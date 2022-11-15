exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error!" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request - datatype for ID" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Invalid POST body!" });
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
