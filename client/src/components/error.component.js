// ErrorComponent.js

import React from 'react';

const ErrorComponent = ({ message }) => {
  return (
    <div>
      <h2>Error</h2>
      <p>{message}</p>
    </div>
  );
};

export default ErrorComponent;
