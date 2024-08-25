import React, { useState } from "react";
import styles from './AuthPage.module.css';
import { LoginForm, RegisterForm, AuthToggleButtons } from './index.js';

function AuthPage() {
  const [currentUser, setCurrentUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLogInMode, setIsLogInMode] = useState(true);
  const [showAuthToggleButton, setShowAuthToggleButton] = useState(true);

  const onChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const changeMode = () => {
    setIsLogInMode(!isLogInMode);
  };

  const resetData = () => {
    setIsLogInMode(true);
    setShowAuthToggleButton(true);
    setCurrentUser({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className={styles.registrationFormContainer}>
      <div className={styles.registrationImage}>
        <img src="/images/logo_registration.jpg" alt="Registration" />
      </div>
      <div className={styles.registrationForm}>
        {showAuthToggleButton && (
          <AuthToggleButtons
            isLogInMode={isLogInMode}
            changeMode={changeMode}
            setShowAuthToggleButton={setShowAuthToggleButton}
          />
        )}

        {isLogInMode && (
          <LoginForm
            currentUser={currentUser}
            onChange={onChange}
            setShowAuthToggleButton={setShowAuthToggleButton}
          />
        )}
        {!isLogInMode && (
          <RegisterForm
            currentUser={currentUser}
            onChange={onChange}
            resetData={resetData}
            setShowAuthToggleButton={setShowAuthToggleButton}
          />
        )}
      </div>
    </div>
  );
}

export default AuthPage;