function notFound(req, res) {
  res.status(404).json({ message: "Route not found" });
}

function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

module.exports = { notFound, errorHandler };
