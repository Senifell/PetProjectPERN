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

import BoxListGames from "./components/list-games-box.component";
import FortuneWheelPage from "./components/fortune-wheel.component";

import { useUser } from "./userContext";
import { useAuth } from "./authContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NotFound from "./NotFound";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const { user } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const appStyles = {
    backgroundImage: `url('/images/background-img.jpg')`,
    backgroundSize: "cover", // Растягиваем или сжимаем изображение, чтобы оно полностью заполняло контейнер
    backgroundPosition: "top", // Центрируем изображение по горизонтали и вертикали
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  const updateLoggedInStatus = (status) => {
    setLoggedIn(status);
  };

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem("loggedIn");

    if (storedLoggedIn) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  return (
    <div style={appStyles}>
      <ToastContainer />
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
              <Link to={`/steam-games/${user.id}`} className="nav-link">
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
          backgroundColor: "#dcf1fc",
          padding: "20px",
          marginBottom: "20px",
          maxWidth: "80%",
          border: "none",
          borderRadius: "10px",
        }}
      >
        <Routes>
          <Route path="/" element={<PublicListGames />} />
          <Route path="/list-games" element={<PublicListGames />} />
          <Route path="/account/:userId" element={<Account />} />
          <Route path="/list-games/:userId" element={<ListGames />} />
          <Route path="/private-games/:userId" element={<PrivateGames />} />
          <Route path="/steam-games/:userId" element={<SteamGames />} />

          <Route path="/list-games/:userId" element={<BoxListGames />} />
          <Route
            path="/list-games/fortune-wheel/:id"
            element={<FortuneWheelPage />}
          />

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
