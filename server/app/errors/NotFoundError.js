class NotFoundError extends Error {
  constructor(message = "Данные не найдены") {
    super(message);
    this.status = 404;
  }
}

module.exports = NotFoundError;
