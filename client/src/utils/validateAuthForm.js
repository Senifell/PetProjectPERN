import validator from "validator";

export const ERROR_CODES = {
  INCORRECT_USERNAME: "Некорректное имя пользователя.",
  INCORRECT_EMAIL: "Некорректный e-mail.",
  INCORRECT_PASSWORD: "Некорректный пароль. Минимальная длина 8 символов.",
  REQUIRED_NOT_FILLED: "Не заполнены все обязательные поля!",
  LOGIN_FAILED: "Некорректный пароль или имя пользователя",
  USERNAME_NOT_FOUND: "Пользователь с данным именем не найден.",
  PASSWORD_FAILED: "Неверный пароль.",
  USERNAME_EXISTS: "Пользователь с данным именем уже существует.",
  EMAIL_EXISTS: "Пользователь с данным e-mail уже существует.",
  LOGIN_ERROR: "Ошибка входа.",
  REGISTER_ERROR: "Ошибка регистрации.",
  UNEXPECTED_ERROR: "Неизвестная ошибка.",
};

function checkUsername(username) {
  return validator.isLength(username, { min: 4 }) ? null : "INCORRECT_USERNAME";
}

function checkEmail(email) {
  return validator.isEmail(email) ? null : "INCORRECT_EMAIL";
}

function checkPassword(password) {
  return validator.isLength(password, { min: 8 }) ? null : "INCORRECT_PASSWORD";
}

export function checkRegisterForm(username, email, password) {
  return (
    checkUsername(username) || checkEmail(email) || checkPassword(password)
  );
}

export function checkDataNotEmpty(
  username,
  email = "",
  password,
  mode = "login"
) {
  if (mode === "register") {
    return username.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== ""
      ? null
      : "REQUIRED_NOT_FILLED";
  } else {
    return username.trim() !== "" && password.trim() !== ""
      ? null
      : "REQUIRED_NOT_FILLED";
  }
}
