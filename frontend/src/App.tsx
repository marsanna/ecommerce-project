import { BrowserRouter, Route, Routes } from "react-router";

import MainLayout from "./layouts/MainLayout.tsx";
import Cart from "./pages/Cart.tsx";
import Checkout from "./pages/Checkout.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";

function App() {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="cart" element={<Cart />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="checkout/:id" element={<Checkout />} />
              {/*<Route path="*" element={<NotFound />} />
            <Route path="category/:slug" element={<CategoryPage />} />*/}
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
