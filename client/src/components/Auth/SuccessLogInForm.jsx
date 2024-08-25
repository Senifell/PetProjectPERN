import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import { useNavigate } from "react-router-dom";

import styles from "./SuccessLogInForm.module.css";

function SuccessLogInForm({ setShowAuthToggleButton, setSuccessLogIn }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setSuccessLogIn(false);
      setShowAuthToggleButton(true);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h4>Авторизация выполнена успешно!</h4>
      <div className={styles.buttonContainer}>
        <button
          className={`btn btn-success ${styles.button}`}
          onClick={handleLogout}
        >
          Выйти
        </button>
        <Link to="/" className={`btn btn-success ${styles.button}`}>
          Главная страница
        </Link>
      </div>
    </div>
  );
}

export default SuccessLogInForm;
