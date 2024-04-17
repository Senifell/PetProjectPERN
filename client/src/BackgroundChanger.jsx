// BackgroundChanger.jsx

import React, { useState } from 'react';

const BackgroundChanger = () => {
  const [backgroundImage, setBackgroundImage] = useState(null);

  const changeBackground = () => {
    const imagePath = './public/background.jpg';

    // Устанавливаем картинку в состояние, которое будет применено к фону
    setBackgroundImage(`url('${imagePath}')`);
  };

  return (
    <div style={{ backgroundImage: backgroundImage, height: '100vh' }}>
      <button onClick={changeBackground}>Изменить фон</button>
    </div>
  );
};

export default BackgroundChanger;