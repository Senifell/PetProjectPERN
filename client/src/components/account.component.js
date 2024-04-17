import React, { useState, useEffect, useCallback } from "react";
import accountDataServiceInstance from "../services/account.service";
import { withRouter } from "../common/with-router";
import { useUser } from "../userContext";
import { useNavigate } from 'react-router-dom';
import ErrorComponent from './error.component';

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

  const getAccount = useCallback((id) => {
    accountDataServiceInstance.get(id, navigate)
      .then((response) => {
        setCurrentAccount(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        setError(e.message || 'Что-то пошло не так');
        console.log(e);
      });
  }, [navigate]);

  const updateAccount = () => {
    accountDataServiceInstance.update(currentAccount.id_user, currentAccount)
      .then((response) => {
        console.log(response.data);
        setMessage("Данные аккаунта были успешно обновлены!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteAccount = () => {
    accountDataServiceInstance.delete(currentAccount.id_user)
      .then((response) => {
        console.log(response.data);
        props.router.navigate("/");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    console.log(user.id);
    getAccount(user.id);
  }, [user.id, getAccount]);

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <div>
      {currentAccount && (
        <div className="edit-form">
          <h4>Account</h4>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
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
              <label htmlFor="surname">Surname</label>
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
              <label>Gender</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={currentAccount.gender === "Female"}
                    onChange={onChange}
                  />
                  Female
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
                  Male
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
                  Unknown
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                className="form-control"
                id="description"
                placeholder="Description"
                name="description"
                value={currentAccount.description}
                onChange={onChange}
              />
            </div>
          </form>

          <button className="badge badge-danger mr-2" onClick={deleteAccount}>
            Удалить
          </button>

          <button
            type="submit"
            className="badge badge-success"
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
