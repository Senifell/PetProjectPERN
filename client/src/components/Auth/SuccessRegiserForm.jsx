import React from "react";

function SuccessRegiserForm({ resetData, setShowAuthToggleButton, setSuccessReg }) {

  const logIn = () => {
    setSuccessReg(false);
    setShowAuthToggleButton(true);
    resetData();
  };

    return (
      <div>
        <h4>Аккаунт зарегистрирован!</h4>
        <button className="btn btn-success" onClick={logIn}>
          Войти
        </button>
      </div>
    );
}

export default SuccessRegiserForm;