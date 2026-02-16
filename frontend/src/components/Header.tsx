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
    try {
      await logout();
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const context = useContext(CartContext);
  if (!context) return null;
  const { cart } = context;

  return (
    <header className="sticky top-0 z-50 bg-gray-900 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="text-xl font-bold md:text-2xl">
          My Shop
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          <nav className="flex items-center space-x-3 text-sm md:space-x-6 md:text-base">
            {!user ? (
              <>
                <Link to="/login" className="transition hover:text-gray-400">
                  Login
                </Link>
                <Link to="/register" className="transition hover:text-gray-400">
                  Register
                </Link>
              </>
            ) : (
              <button
                className="cursor-pointer transition hover:text-gray-400"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </nav>

          <div className="relative">
            <Link
              to="/cart"
              className="flex items-center transition hover:text-gray-400"
            >
              <span className="text-xl">🛒</span>
              <span className="ml-1 hidden sm:inline">Cart</span>

              {cart.itemCount > 0 && (
                <span
                  id="cart_counter"
                  className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white"
                >
                  {cart.itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
