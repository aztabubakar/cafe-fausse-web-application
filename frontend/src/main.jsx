import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";
import "./styles/components.css";
import "./styles/pages.css";
import App from "./App.jsx";

// Strip the trailing slash Vite's BASE_URL always includes; BrowserRouter
// expects a bare path (or "/") for its basename.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
