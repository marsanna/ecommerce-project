import { useContext } from "react";
import { Link } from "react-router";

import { CartContext } from "../contexts/CartReducerContext.jsx";

function Header() {
  const { cart } = useContext(CartContext);
  return (
    <header className="sticky top-0 z-5 bg-gray-900 text-white shadow-[0_10px_10px_rgba(255,255,255,0.25)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold">
          Mein Shop
        </Link>
        <nav className="hidden space-x-6 md:flex">
          <a href="#" className="transition hover:text-gray-300">
            Startseite
          </a>
          <a href="#" className="transition hover:text-gray-300">
            Über uns
          </a>
          <a href="#" className="transition hover:text-gray-300">
            Kontakt
          </a>
        </nav>
        <div className="relative">
          <Link to="/cart">
            <button
              id="cart_button"
              className="flex cursor-pointer items-center space-x-2 transition hover:text-gray-300"
            >
              <span className="text-xl">🛒</span>
              <span>Warenkorb</span>
            </button>
            <span
              id="cart_counter"
              className="absolute -top-2 -right-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white"
            >
              {cart.itemCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
