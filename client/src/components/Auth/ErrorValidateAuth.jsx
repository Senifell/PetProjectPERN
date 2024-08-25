import React from "react";
import { ERROR_CODES } from '../../utils/validateAuthForm';

function ErrorValidateAuth({loginCodeError}) {
const messageStyles = {
    color: "red",
    fontSize: "18px",
    marginTop: "12px",
    marginBottom: "12px",
  };

  return (
    <div style={messageStyles}>{ERROR_CODES[loginCodeError] || ERROR_CODES['UNEXPECTED_ERROR']}</div>
  );

}

export default ErrorValidateAuth;