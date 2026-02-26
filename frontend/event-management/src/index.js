import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./styles.css";   // 👈 Import your custom styles here

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
