import React from "react";
import styles from './AccountForm.module.css'

function AccountForm({ currentAccount, onChange }) {
  return (
    <div>
      <div className={styles.FormGroup}>
        <label htmlFor="name">Имя</label>
        <input
          type="text"
          className="form-control"
          id="name"
          placeholder="Name"
          name="name"
          value={currentAccount.name || ""}
          onChange={onChange}
        />
      </div>

      <div className={styles.FormGroup}>
        <label htmlFor="surname">Фамилия</label>
        <input
          type="text"
          className="form-control"
          id="surname"
          name="surname"
          value={currentAccount.surname || ""}
          onChange={onChange}
        />
      </div>

      <div className={styles.FormGroup}>
        <label htmlFor="steam_id">ID Steam</label>
        <input
          type="number"
          className="form-control"
          id="steam_id"
          placeholder="Steam ID"
          name="steam_id"
          value={currentAccount.steam_id || ""}
          onChange={onChange}
        />
      </div>

      <div className={styles.FormGroup}>
        <label>Пол</label>
        <div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="gender"
              value="Female"
              checked={currentAccount.gender === "Female"}
              onChange={onChange}
            />
            <label className="form-check-label">Женский</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="gender"
              value="Male"
              checked={currentAccount.gender === "Male"}
              onChange={onChange}
            />
            <label className="form-check-label">Мужской</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="gender"
              value="Unknown"
              checked={currentAccount.gender === "Unknown"}
              onChange={onChange}
            />
            <label className="form-check-label">Не указано</label>
          </div>
        </div>
      </div>

      <div className={styles.FormGroup}>
        <label htmlFor="description">Дополнительная информация</label>
        <textarea
          className="form-control"
          id="description"
          placeholder="Дополнительная информация"
          name="description"
          value={currentAccount.description || ""}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default AccountForm;
