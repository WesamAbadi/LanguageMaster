import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

let container = null;
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
document.addEventListener("DOMContentLoaded", function (event) {
  if (!container) {
    root.render(
      <Router>
        <App />
      </Router>
    );
  }
});
reportWebVitals();
