import React, { useState, useEffect, useCallback } from "react";
import accountDataServiceInstance from "../services/account.service";
import { withRouter } from "../common/with-router";
import { useUser } from "../userContext";
import { useNavigate } from "react-router-dom";
import ErrorComponent from "./error.component";

function Account(props) {
  const { user } = useUser();
  const navigate = useNavigate();

  const [currentAccount, setCurrentAccount] = useState({
    id: null,
    id_user: user.id,
    name: "",
    surname: "",
    gender: "",
    description: "",
    steam_id: "",
    picture: "",
  });

  const [message, setMessage] = useState("");

  const [error, setError] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setCurrentAccount((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getAccount = useCallback(
    (id) => {
      accountDataServiceInstance
        .get(id, navigate)
        .then((response) => {
          setCurrentAccount(response.data);
        })
        .catch((e) => {
          setError(e.message || "Что-то пошло не так");
        });
    },
    [navigate]
  );

  const updateAccount = () => {
    accountDataServiceInstance
      .update(currentAccount.id_user, currentAccount)
      .then((response) => {
        setMessage("Данные аккаунта были успешно обновлены!");
      })
      .catch((e) => {
        console.log(e); //!!!
      });
  };

  const deleteAccount = () => {
    accountDataServiceInstance
      .delete(currentAccount.id_user)
      .then((response) => {
        console.log(response.data); //!!!
        props.router.navigate("/");
      })
      .catch((e) => {
        console.log(e); //!!!
      });
  };

  useEffect(() => {
    getAccount(user.id);
  }, [user.id, getAccount]);

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <div>
      {currentAccount && (
        <div className="edit-form">
          <h4>Аккаунт</h4>
          <form>
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Name"
                name="name"
                value={currentAccount.name}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="surname">Фамилия</label>
              <input
                type="text"
                className="form-control"
                id="surname"
                name="surname"
                value={currentAccount.surname}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="steam_id">ID Steam</label>
              <input
                type="number"
                className="form-control"
                id="steam_id"
                placeholder="Steam ID"
                name="steam_id"
                value={currentAccount.steam_id}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label>Пол</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={currentAccount.gender === "Female"}
                    onChange={onChange}
                  />
                  Женский
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={currentAccount.gender === "Male"}
                    onChange={onChange}
                  />
                  Мужской
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Unknown"
                    checked={currentAccount.gender === "Unknown"}
                    onChange={onChange}
                  />
                  Неизвестно
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Дополнительная информация</label>
              <textarea
                className="form-control"
                id="description"
                placeholder="Дополнительная информация"
                name="description"
                value={currentAccount.description}
                onChange={onChange}
              />
            </div>
          </form>

          <button className="btn btn-outline-danger" onClick={deleteAccount}>
            Удалить
          </button>
          <span> </span>
          <button
            type="submit"
            className="btn btn-outline-primary"
            onClick={updateAccount}
          >
            Обновить
          </button>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default withRouter(Account);
