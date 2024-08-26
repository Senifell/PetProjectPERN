import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { AuthPage } from "./components/Auth";
import { AccountPage } from "./components/Account";

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
  const { user } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const appStyles = {
    // backgroundImage: `url('/images/background-img.jpg')`,
    // backgroundSize: "cover", // Растягиваем или сжимаем изображение, чтобы оно полностью заполняло контейнер
    // backgroundPosition: "top", // Центрируем изображение по горизонтали и вертикали
    // backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#272424",
  };

  const handleLogout = () => {
    logout();
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
          {user && (
            <li className="nav-item">
              <Link
                to={user ? `/list-games/${user.id}` : "/list-games"}
                className="nav-link"
              >
                Коллекции игр
              </Link>
            </li>
          )}
          {user && (
            <li className="nav-item">
              <Link
                to={user ? `/private-games/${user.id}` : "/private-games"}
                className="nav-link"
              >
                Список игр
              </Link>
            </li>
          )}
          {user && (
            <li className="nav-item">
              <Link
                to={user ? `/steam-games/${user.id}` : "/steam-games"}
                className="nav-link"
              >
                Steam игры
              </Link>
            </li>
          )}
          {user && (
            <li className="nav-item ml-auto">
              <button className="nav-link" onClick={handleLogout}>
                Выход
              </button>
            </li>
          )}
          {!user && (
            <li className="nav-item ml-auto">
              <Link to={"/user"} className="nav-link">
                Вход New
              </Link>
            </li>
          )}
          {user && (
            <li className="nav-item ml-auto">
              <Link to={`/account`} className="nav-link">
                Личный кабинет
              </Link>
            </li>
          )}
        </div>
      </nav>

      <div
        className="container mt-3"
        style={{
          backgroundColor: "#dcf1fc", //"#dcf1fc",
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
          <Route path="/account" element={<AccountPage />} />
          <Route path="/list-games/:userId" element={<ListGames />} />
          <Route path="/private-games/:userId" element={<PrivateGames />} />
          <Route path="/steam-games/:userId" element={<SteamGames />} />

          <Route path="/list-games/:userId" element={<BoxListGames />} />
          <Route
            path="/list-games/fortune-wheel/:id"
            element={<FortuneWheelPage />}
          />

          <Route path="/user" element={<AuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
