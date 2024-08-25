import React, { useState } from "react";
import UserDataServiceInstance from "../services/user.service";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./RegistrationForm.css";
import { useAuth } from "../authContext";

import { useNavigate } from "react-router-dom";

//Переписать
const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    id: null,
    username: "",
    email: "",
    password: "",
    registeredMode: false,
    loggedInMode: true,
    registered: false,
    loggedIn: false,
    loginCodeError: null,
  });

  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const messageStyles = {
    color: "red",
    fontSize: "18px",
    marginTop: "12px",
    marginBottom: "12px",
  };

  const errorLogInMessages = {
    401: "Неправильное имя пользователя или пароль",
    404: "Неправильное имя пользователя или пароль",
    500: "Ошибка входа",
  };

  const {
    username,
    email,
    password,
    registeredMode,
    loggedInMode,
    registered,
    loggedIn,
    loginCodeError,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkDataNotEmpty = () => {
    if (loggedInMode) {
      return username.trim() !== "" && password.trim() !== "";
    } else {
      return (
        username.trim() !== "" && email.trim() !== "" && password.trim() !== ""
      );
    }
  };

  const changeMode = () => {
    setFormData({
      ...formData,
      registeredMode: !registeredMode,
      loggedInMode: !loggedInMode,
    });
  };

  const saveUser = () => {
    if (!checkDataNotEmpty()) {
      console.log("Data isn't full");
      return;
    }

    const data = {
      username,
      email,
      password,
    };

    UserDataServiceInstance.create(data)
      .then((response) => {
        setFormData({
          ...formData,
          id: response.data.id,
          registered: true,
          loggedIn: false,
          loginCodeError: null,
        });
        //console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const newUser = () => {
    setFormData({
      id: null,
      username: "",
      email: "",
      password: "",
      registeredMode: false,
      loggedInMode: true,
      registered: false,
      loggedIn: false,
      loginCodeError: null,
    });
  };

  const handleLogin = async () => {
    if (!checkDataNotEmpty()) {
      console.log("Data isn't full");
      return;
    }

    try {
      await login(username, password);

      setFormData({
        ...formData,
        registered: false,
        loggedIn: true,
        loginCodeError: null,
      });

      localStorage.setItem("loggedIn", "true"); //сохраним, чтобы можно было использовать после перезагрузки страницы
      // Думаю стоит изменить логику с loggedIn
    } catch (err) {
      console.log(err);

      setFormData({
        ...formData,
        loginCodeError:
          err.response && err.response.status ? err.response.status : 500,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();

      setFormData({
        ...formData,
        loggedIn: false,
        loginCodeError: null,
      });

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  if (registered) {
    return (
      <div>
        <h4>Аккаунт зарегистрирован!</h4>
        <button className="btn btn-success" onClick={newUser}>
          Войти
        </button>
      </div>
    );
  } else if (loggedIn) {
    return (
      <div>
        <h4>Вход выполнен успешно!</h4>
        <button
          className="btn btn-success registration-button"
          onClick={handleLogout}
        >
          Выйти
        </button>
        <Link to="/" className="btn btn-success registration-button">
          Главная страница
        </Link>
      </div>
    );
  } else {
    return (
      <div className="registration-form-container">
        <div className="registration-image">
          {/* <img src={registrationImage} alt="Registration" /> */}
        </div>
        <div className="registration-form">
          <div>
            <button
              onClick={changeMode}
              className={`btn registration-button ${
                !registeredMode
                  ? "btn-outline-primary disabled"
                  : "btn-outline-dark"
              }`}
            >
              Вход
            </button>
            <button
              onClick={changeMode}
              className={`btn registration-button ${
                !loggedInMode
                  ? "btn-outline-primary disabled"
                  : "btn-outline-dark"
              }`}
            >
              Регистрация
            </button>
          </div>

          <div>
            <div className="form-group">
              <label htmlFor="username">Имя пользователя</label>
              <input
                type="text"
                className="form-control"
                id="username"
                required
                placeholder="Имя пользователя"
                value={username}
                onChange={onChange}
                name="username"
              />
            </div>

            {registeredMode && (
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  required
                  placeholder="E-mail"
                  value={email}
                  onChange={onChange}
                  name="email"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                className="form-control"
                id="password"
                required
                placeholder="Пароль"
                value={password}
                onChange={onChange}
                name="password"
              />
            </div>

            {!checkDataNotEmpty() && (
              <div style={messageStyles}>
                Не заполнены все обязательные поля!
              </div>
            )}

            {loginCodeError && (
              <div style={messageStyles}>
                {errorLogInMessages[loginCodeError]}
              </div>
            )}

            {registeredMode && (
              <button
                onClick={saveUser}
                className="btn btn-success registration-button"
              >
                Зарегистрироваться
              </button>
            )}
            {loggedInMode && (
              <button
                onClick={handleLogin}
                className="btn btn-success registration-button"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default RegistrationForm;
