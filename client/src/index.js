import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

//import ReactDOM from 'react-dom';

import App from "./App";
import { UserProvider } from "./userContext";
import { AuthProvider } from "./authContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <UserProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </UserProvider>
  </BrowserRouter>
);

// ReactDOM.render(
//   <React.StrictMode>
//     <UserProvider>
//       <App />
//     </UserProvider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

//for start: npm start
