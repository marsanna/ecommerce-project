import { BrowserRouter, Route, Routes } from "react-router";

import CartItems from "./components/CartItems";
import Header from "./components/Header.jsx";
import ProductList from "./components/ProductList";
import { CartContext } from "./contexts/CartReducerContext.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Cart from "./pages/Cart.jsx";
import Home from "./pages/Home.jsx";

function App() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="cart" element={<Cart />} />
            {/*<Route path="*" element={<NotFound />} />
            <Route path="category/:slug" element={<CategoryPage />} />*/}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
