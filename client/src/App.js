import React, { useState, useEffect } from "react";
import { Routes, Route, Link, /*Outlet*/ useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import RegistrationForm from "./components/registrationForm";
import Account from "./components/account.component";

import ListGames from "./components/list-games.component";
import PrivateGames from "./components/private-games.component";
import SteamGames from "./components/steam-games.component";

import PublicListGames from "./components/public-list-games.component";

import { useUser } from "./userContext";

import NotFound from "./NotFound";

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // Изначально пользователь не вошел
  const { user } = useUser();
  const navigate = useNavigate();

  // Задаем путь к картинке, которую вы хотите использовать в качестве фона
  //const imagePath = process.env.PUBLIC_URL + "/background.jpg";

  // Устанавливаем картинку в качестве фона только для элемента с классом "container"
  const appStyles = {
    backgroundColor: "#1A1A1D", //C5C6C7 1F2833
    //backgroundImage: `url('${imagePath}')`,
    height: "100vh",
  };

  const updateLoggedInStatus = (status) => {
    console.log('Переданное значение: ', status);
    setLoggedIn(status);
  };

  useEffect(() => {
    // Получение значения из локального хранилища при загрузке приложения
    const storedLoggedIn = localStorage.getItem('loggedIn');

    // Если в локальном хранилище есть значение, установите его в состояние
    if (storedLoggedIn) {
      setLoggedIn(true);
    }
  }, []); // Пустой массив зависимостей гарантирует, что useEffect выполняется только один раз при загрузке


  //!!! Надо отсюда убрать эту часть и свести к одной функции выхода
  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('token');
    navigate("/");
  };

  return (
    <div style={appStyles}>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/list-games"} className="navbar-brand">
          Главная страница
        </Link>
        <div className="navbar-nav mr-auto">
          {loggedIn && (
            <li className="nav-item">
              <Link
                to={user ? `/list-games/${user.id}` : "/list-games"}
                className="nav-link"
              >
                Коллекции игр
              </Link>
            </li>
          )}
          {loggedIn && (
            <li className="nav-item">
              <Link
                to={user ? `/private-games/${user.id}` : "/private-games"}
                className="nav-link"
              >
                Список игр
              </Link>
            </li>
          )}
          {loggedIn && (
            <li className="nav-item">
              <Link
                to={user ? `/steam-games/${user.id}` : "/steam-games"}
                className="nav-link"
              >
                Steam игры
              </Link>
            </li>
          )}
          {loggedIn && (
            <li className="nav-item ml-auto">
              <button className="btn btn-link nav-link" onClick={handleLogout}>
                Выход
              </button>
            </li>
          )}
          {!loggedIn && (
            <li className="nav-item ml-auto">
              <Link to={"/user"} className="nav-link">
                Вход
              </Link>
            </li>
          )}
          {loggedIn && (
            <li className="nav-item ml-auto">
              <Link
                to={user ? `/account/${user.id}` : "/account"}
                className="nav-link"
              >
                Личный кабинет
              </Link>
            </li>
          )}
        </div>
      </nav>

      <div
        className="container mt-3"
        style={{
          backgroundColor: "white", //C5C6C7  1F2833
          padding: "20px",
          maxWidth: "80%",
          // 66FCF1 45A29E
          border: "5px solid #6F2232",
          borderRadius: "5px", // #1A1A1D, #4E4E50, #6F2232, #950740, #C3073F

        }}
      >
        <Routes>
          <Route path="/" element={<PublicListGames />} />
          <Route path="/list-games" element={<PublicListGames />} />
          <Route path="/account/:userId" element={<Account />} />
          <Route path="/list-games/:userId" element={<ListGames />} />
          <Route path="/private-games/:userId" element={<PrivateGames />} />
          <Route path="/steam-games/:userId" element={<SteamGames />} />

          <Route
            path="/user"
            element={
              <RegistrationForm updateLoggedInStatus={updateLoggedInStatus} />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
