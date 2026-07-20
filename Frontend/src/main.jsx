import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext.jsx";
import SmoothScroll from "./components/common/SmoothScroll.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <SmoothScroll>
            <App />
          </SmoothScroll>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);