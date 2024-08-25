import React, { useState } from "react";
import UserDataServiceInstance from "../../services/user.service";
import SuccessRegiserForm from "./SuccessRegiserForm";
import ErrorValidateAuth from "./ErrorValidateAuth";
import {
  checkDataNotEmpty,
  checkRegisterForm,
  ERROR_CODES,
} from "../../utils/validateAuthForm";

function RegisterForm({
  currentUser,
  onChange,
  resetData,
  setShowAuthToggleButton,
}) {
  const [loginCodeError, setLoginCodeError] = useState(null);
  const [successReg, setSuccessReg] = useState(false);

  const createUser = async () => {
    try {
      const checkEmpty = checkDataNotEmpty(
        currentUser.username,
        currentUser.email,
        currentUser.password,
        "register"
      );
      if (checkEmpty) {
        setLoginCodeError(checkEmpty);
        return;
      }

      const validateReg = checkRegisterForm(
        currentUser.username,
        currentUser.email,
        currentUser.password
      );
      if (validateReg) {
        setLoginCodeError(validateReg);
        return;
      }

      await UserDataServiceInstance.create(currentUser);
      setSuccessReg(true);
      setShowAuthToggleButton(false);
    } catch (error) {
      if (error.response) {
        const { code } = error.response.data;

        if (code in ERROR_CODES) {
          setLoginCodeError(code);
        } else {
          setLoginCodeError('UNEXPECTED_ERROR');
        }
      } else {
        setLoginCodeError('REGISTER_ERROR');
      }
    }
  };

  if (successReg) {
    return (
      <SuccessRegiserForm
        setShowAuthToggleButton={setShowAuthToggleButton}
        setSuccessReg={setSuccessReg}
        resetData={resetData}
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
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            className="form-control"
            id="email"
            required
            placeholder="E-mail"
            value={currentUser.email}
            onChange={onChange}
            name="email"
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

        <button className="btn btn-success" onClick={createUser}>
          Зарегистрироваться
        </button>
      </div>
    );
  }
}

export default RegisterForm;
