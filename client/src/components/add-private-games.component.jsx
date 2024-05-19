import React, { useState } from "react";

function AddPrivateGames({ onAdd, id_user }) {
  const [showForm, setShowForm] = useState(false);
  const [newGame, setNewGame] = useState({
    name: "",
    description: "",
    min_player: null,
    max_player: null,
    id_user: id_user,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGame((prevGame) => ({
      ...prevGame
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newGame);
    setNewGame({ name: "", description: "", min_player: null, max_player: null, });
    //setShowModal(false);
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
              value={newGame.name}
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
              value={newGame.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="min_player">Мин. количество игроков</label>
            <input
              type="number"
              className="form-control"
              id="min_player"
              placeholder="Мин. количество игроков"
              name="min_player"
              value={newGame.min_player}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="max_player">Макс. количество игроков</label>
            <input
              type="number"
              className="form-control"
              id="max_player"
              placeholder="Макс. количество игроков"
              name="max_player"
              value={newGame.max_player}
              onChange={handleChange}
            />
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

export default AddPrivateGames;
