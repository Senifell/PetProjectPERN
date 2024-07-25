import React, { useState } from "react";
import { Button, TextField, Box, Typography, Grid } from "@mui/material";

const AddCustomGame = ({ addCustomGameToCollection }) => {
  const [gameName, setGameName] = useState("");
  const [error, setError] = useState("");

  const handleAddClick = () => {
    if (gameName.trim()) {
      addCustomGameToCollection(gameName);
      setGameName("");
      setError("");
    } else {
      setError("Название игры не может быть пустым");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddClick();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "30px 0px",
        alignItems: "flex-start",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <TextField
            id="outlined-basic"
            label="Название игры"
            variant="outlined"
            value={gameName}
            onChange={(e) => {
              setGameName(e.target.value);
              setError("");
            }}
            onKeyPress={handleKeyPress}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            onClick={handleAddClick}
            sx={{ width: "100%", height: "100%" }}
          >
            Добавить
          </Button>
        </Grid>
      </Grid>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default AddCustomGame;
