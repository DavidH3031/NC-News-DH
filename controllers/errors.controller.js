exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error!" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request - datatype for ID" });
  }
};
