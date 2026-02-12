import { useContext } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";

import { CartContext } from "../contexts/CartContextProvider.js";
import useAuth from "../contexts/useAuth";
import { logout } from "../data/auth";

function Header() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/");
  };

  const context = useContext(CartContext);

  if (!context) return null;

  const { cart } = context;

  return (
    <header className="sticky top-0 z-5 bg-gray-900 text-white shadow-[0_10px_10px_rgba(255,255,255,0.25)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold">
          My Shop
        </Link>
        <nav className="hidden space-x-6 md:flex">
          {!user ? (
            <>
              <Link to="/register" className="transition hover:text-gray-300">
                Register
              </Link>
              <Link to="/login" className="transition hover:text-gray-300">
                Login
              </Link>
            </>
          ) : (
            <button
              className="cursor-pointer transition hover:text-gray-300"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
          <Link to="/contact" className="transition hover:text-gray-300">
            Contact
          </Link>
        </nav>
        <div className="relative">
          <Link to="/cart">
            <button
              id="cart_button"
              className="flex cursor-pointer items-center space-x-2 transition hover:text-gray-300"
            >
              <span className="text-xl">🛒</span>
              <span>Shopping Cart</span>
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
