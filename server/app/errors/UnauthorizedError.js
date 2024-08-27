class NotFoundError extends Error {
  constructor(message = "Отсутствует авторизация.") {
    super(message);
    this.status = 403;
  }
}

module.exports = NotFoundError;
