import React from "react";
import styles from "./AuthToggleButtons.module.css";

const AuthToggleButtons = ({ isLogInMode, changeMode }) => {
  return (
    <div className={styles.buttonContainer}>
      <button
        className={`btn ${styles.button} ${
          isLogInMode
            ? "btn-outline-primary disabled"
            : "btn-outline-dark"
        }`}
        onClick={changeMode}
      >
        Вход
      </button>
      <button
        className={`btn ${styles.button} ${
          !isLogInMode
            ? "btn-outline-primary disabled"
            : "btn-outline-dark"
        }`}
        onClick={changeMode}
      >
        Регистрация
      </button>
    </div>
  );
};

export default AuthToggleButtons;