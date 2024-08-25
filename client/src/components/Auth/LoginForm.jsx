import React, { useState } from "react";
import { useAuth } from "../../authContext";
import SuccessLogInForm from "./SuccessLogInForm";
import ErrorValidateAuth from "./ErrorValidateAuth";
import { checkDataNotEmpty, ERROR_CODES } from "../../utils/validateAuthForm";

function LoginForm({ currentUser, onChange, setShowAuthToggleButton }) {
  const { login } = useAuth();
  const [loginCodeError, setLoginCodeError] = useState(null);
  const [successLogIn, setSuccessLogIn] = useState(false);

  const handleLogin = async () => {
    const checkEmpty = checkDataNotEmpty(
      currentUser.username,
      currentUser.email,
      currentUser.password,
      "login"
    );
    if (checkEmpty) {
      setLoginCodeError(checkEmpty);
      return;
    }

    try {
      await login(currentUser.username, currentUser.password);
      setSuccessLogIn(true);
      setShowAuthToggleButton(false);
    } catch (error) {
      if (error.response) {
        const { code } = error.response.data;

        if (code in ERROR_CODES) {
          setLoginCodeError(code);
        } else {
          setLoginCodeError("UNEXPECTED_ERROR");
        }
      } else {
        setLoginCodeError("LOGIN_ERROR");
      }
    }
  };

  if (successLogIn) {
    return (
      <SuccessLogInForm
        setShowAuthToggleButton={setShowAuthToggleButton}
        setSuccessLogIn={setSuccessLogIn}
      />
    );
  } else {
    return (
      <div>
        <div className="form-group">
          <label htmlFor="username">Имя пользователя</label>
          <input
            type="text"
            className="form-control"
            id="username"
            required
            placeholder="Имя пользователя"
            value={currentUser.username}
            onChange={onChange}
            name="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            className="form-control"
            id="password"
            required
            placeholder="Пароль"
            value={currentUser.password}
            onChange={onChange}
            name="password"
          />
        </div>

        {loginCodeError && (
          <ErrorValidateAuth loginCodeError={loginCodeError} />
        )}

        <button className="btn btn-success" onClick={handleLogin}>
          Войти
        </button>
      </div>
    );
  }
}

export default LoginForm;