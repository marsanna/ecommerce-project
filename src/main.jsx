import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import CartReducerProvider from "./contexts/CartReducerContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartReducerProvider>
      <App />
    </CartReducerProvider>
  </StrictMode>,
);
