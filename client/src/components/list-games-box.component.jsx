import React from "react";

function ListGamesBox({ game, onUpdate, onDelete }) {
  const handleUpdate = () => {
    // Вызываем onUpdate с id и новыми данными
    onUpdate(game.id, { ...game});
  };

  const handleDelete = () => {
    // Вызываем onDelete с id
    onDelete(game.id);
  };

  return (
    <div className="list-games-box">
      <h3>{game.name}</h3>
      <p>{game.description}</p>
      <button onClick={handleUpdate}>Обновить</button>
      <button onClick={handleDelete}>Удалить</button>
    </div>
  );
}

export default ListGamesBox;
