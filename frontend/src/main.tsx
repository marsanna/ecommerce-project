import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import AuthContextProvider from "./contexts/AuthContextProvider.tsx";
import CartContextProvider from "./contexts/CartContextProvider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <CartContextProvider>
        <App />
      </CartContextProvider>
    </AuthContextProvider>
  </StrictMode>,
);
