import React, { useState, useEffect } from "react";
import { Routes, Route, Link, /*Outlet*/ useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import RegistrationForm from "./components/registrationForm";
import AddPeople from "./components/add-people.component";
import People from "./components/people.component";
import PeoplesList from "./components/people-list.component";
import Account from "./components/account.component";

import { useUser } from "./userContext";

import NotFound from "./NotFound";

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // Изначально пользователь не вошел
  const { user } = useUser();
  const navigate = useNavigate();

  // Задаем путь к картинке, которую вы хотите использовать в качестве фона
  const imagePath = process.env.PUBLIC_URL + "/background.jpg";

  // Устанавливаем картинку в качестве фона только для элемента с классом "container"
  const appStyles = {
    backgroundImage: `url('${imagePath}')`,
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
        <Link to={"/people"} className="navbar-brand">
          Главная страница
        </Link>
        <div className="navbar-nav mr-auto">
          {loggedIn && (
            <>
              <li className="nav-item">
                <Link to={"/people"} className="nav-link">
                  Список редисок
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/add"} className="nav-link">
                  Добавление редисок
                </Link>
              </li>
            </>
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
          backgroundColor: "rgba(200, 240, 255, 0.5)",
          padding: "20px", // Отступ со всех сторон
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1000px))", // Задаем ширину столбцов
          //gridGap: '20px', // Контейнер регулируется от размеров его внутренних элементов
          justifyContent: "left",
          maxWidth: "1000px",
        }}
      >
        <Routes>
          <Route path="/" element={<PeoplesList />} />
          <Route path="/people" element={<PeoplesList />} />
          <Route path="/add" element={<AddPeople />} />
          <Route path="/people/:id" element={<People />} />
          <Route path="/account/:userId" element={<Account />} />

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
