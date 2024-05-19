import React, { useState } from "react";
import UserDataServiceInstance from "../services/user.service";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import registrationImage from "./registrationImage.jpeg";
import "./RegistrationForm.css";
import { useUser } from '../userContext'; 

import { useNavigate } from 'react-router-dom';

const RegistrationForm = ({ updateLoggedInStatus }) => {
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

  const { updateUser } = useUser();
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

  const handleLogin = async () => {
    // Предположим, что здесь происходит аутентификация пользователя
    // и вы успешно получили данные о пользователе после входа.
    const userData = await checkUser(); // Функция, возвращающая данные пользователя.

    // Вызываем updateUser для обновления контекста с данными пользователя.
    updateUser({id: userData.id, name: userData.username, email: userData.email});
  };
  const checkUser = async () => {
    if (!checkDataNotEmpty()) {
      console.log("Data isn't full");
      return;
    }
  
    try {
      const response = await customAuthenticateUser(username, password);
  
      setFormData({
        ...formData,
        registered: false,
        loggedIn: true,
        loginCodeError: null,
      });

      //Добавим сохранение JWT-токен в localStorage
      localStorage.setItem("token", response.token);

      updateLoggedInStatus(true);
      localStorage.setItem('loggedIn', 'true'); //сохраним, чтобы можно было использовать после перезагрузки страницы

      return response.user;
    } catch (error) {
      console.log(error);
  
      updateLoggedInStatus(false);
      setFormData({
        ...formData,
        loginCodeError:
          error.response && error.response.status
            ? error.response.status
            : 500,
      });
      return null;
    }
  };

  const customAuthenticateUser = async (username, password) => {
    try {
      const response = await fetch('https://localhost:8080/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Authentication failed'); // Обработка ошибки
      }
  
      const data = await response.json(); // Получаем данные о пользователе или токен
      
      const { token, user } = data;
      console.log('Token:', token);
      console.log('UserID:', user.id, ', name:', user.username);
  
      return data; // Возвращаем данные о пользователе или токен
    } catch (error) {
      throw error; // Прокидываем ошибку дальше для обработки в catch
    }
  };
  

  const changeMode = () => {
    updateLoggedInStatus(false);
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
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const newUser = () => {
    updateLoggedInStatus(false);
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

  // const checkUser = () => {
  //   if (!checkDataNotEmpty()) {
  //     console.log("Data isn't full");
  //     return;
  //   }

  //   UserDataServiceInstance.signInUser(username, password)
  //     .then((response) => {
  //       setFormData({
  //         ...formData,
  //         registered: false,
  //         loggedIn: true,
  //         loginCodeError: null,
  //       });
  //       console.log(response.data, response.data.message, response.status);
  //       updateLoggedInStatus(true);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       updateLoggedInStatus(false);
  //       setFormData({
  //         ...formData,
  //         loginCodeError:
  //           error.response && error.response.status
  //             ? error.response.status
  //             : 500,
  //       });
  //     });
  // };

  const handleLogout = () => {
    setFormData({
      ...formData,
      loggedIn: false,
      loginCodeError: null,
    });
    updateLoggedInStatus(false);
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('token');
    navigate("/");
  };

  if (registered) {
    return (
      <div>
        <h4>Your registration was successful!</h4>
        <button className="btn btn-success" onClick={newUser}>
          Log In
        </button>
      </div>
    );
  } else if (loggedIn) {
    return (
      <div>
        <h4>Your sign in was successful!</h4>
        <button
          className="btn btn-success registration-button"
          onClick={handleLogout}
        >
          Log Out
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
          <img src={registrationImage} alt="Registration" />
        </div>
        <div className="registration-form">
          <div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                required
                placeholder="Username"
                value={username}
                onChange={onChange}
                name="username"
              />
            </div>

            {registeredMode && (
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={onChange}
                  name="email"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                required
                placeholder="Password"
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

            {!registeredMode && (
              <button
                onClick={changeMode}
                className="btn btn-success registration-button"
              >
                Register Now
              </button>
            )}
            {registeredMode && (
              <button
                onClick={saveUser}
                className="btn btn-success registration-button"
              >
                Register
              </button>
            )}
            {loggedInMode && (
              <button
                onClick={handleLogin}
                className="btn btn-success registration-button"
              >
                Log In
              </button>
            )}
            {!loggedInMode && (
              <button
                onClick={changeMode}
                className="btn btn-success registration-button"
              >
                Log In Now
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default RegistrationForm;
