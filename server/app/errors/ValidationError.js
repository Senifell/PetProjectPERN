class ValidationError extends Error {
  constructor(message = "Некорретные данные") {
    super(message);
    this.status = 400;
  }
}

module.exports = ValidationError;
