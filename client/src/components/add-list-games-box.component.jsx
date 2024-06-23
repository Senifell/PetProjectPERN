import React, { useState } from "react";

function AddListGamesBox({ onAdd, id_user }) {
  const [showForm, setShowForm] = useState(false);
  const [newListGames, setNewListGames] = useState({
    name: "",
    description: "",
    b_private: true,
    id_user: id_user,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewListGames((prevGame) => ({
      ...prevGame,
      [name]: name === "b_private" ? value === "true" : value,
    }));
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setNewListGames((prevListGames) => ({
      ...prevListGames,
      b_private: value === "true",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newListGames);
    setNewListGames({
      name: "",
      description: "",
      b_private: true,
      id_user: id_user,
    });
    setShowForm(false);
  };

  return (
    <div className="add-game-icon">
      {showForm ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Name"
              name="name"
              value={newListGames.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              className="form-control"
              id="description"
              placeholder="Description"
              name="description"
              value={newListGames.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Доступность</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="b_private"
                  value="true"
                  checked={newListGames.b_private === true}
                  onChange={handleRadioChange}
                />
                Личное
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="b_private"
                  value="false"
                  checked={newListGames.b_private === false}
                  onChange={handleRadioChange}
                />
                Доступно для всех
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      ) : (
        <div onClick={() => setShowForm(true)}>
          <span>+</span>
        </div>
      )}
    </div>
  );
}

export default AddListGamesBox;
