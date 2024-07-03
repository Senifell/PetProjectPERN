import React, { useState } from "react";

function GamelongField({ longField, numberSymbol = 70 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderlongField = () => {
    if (!longField) {
      return " ";
    }
    if (isExpanded) {
      return longField;
    }
    return longField.length > numberSymbol
      ? `${longField.slice(0, numberSymbol)}...`
      : longField;
  };

  return (
    <td>
      {renderlongField()}
      {longField && longField.length > numberSymbol && (
        <button
          onClick={toggleExpanded}
          style={{
            marginLeft: "5px",
            border: "none",
            background: "none",
            color: "grey",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {isExpanded ? "Свернуть" : "Развернуть"}
        </button>
      )}
    </td>
  );
}

export default GamelongField;
