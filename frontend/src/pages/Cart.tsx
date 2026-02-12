import { useContext, useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";

import CartItems from "../components/CartItems.tsx";
import { CartContext } from "../contexts/CartContextProvider.tsx";
import useAuth from "../contexts/useAuth";
import { authServiceURL } from "../utils/fetchInterceptor";

function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const context = useContext(CartContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!context) return null;
  const { cart, dispatch } = context;

  const handleCheckout = async () => {
    if (!user || cart.items.length === 0) {
      alert("Please register or log in for ordering!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${authServiceURL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          items: cart.items.map((item) => ({
            productId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
          status: "pending",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Checkout failed");
      }

      const order = await response.json();

      dispatch({ type: "EMPTY_CART" });
      navigate(`/checkout/${order.id}`);
    } catch (error) {
      console.error("Order error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="my-5 text-lg font-bold">Cart</h1>
      <CartItems />
      {!user && cart.items.length > 0 && (
        <div className="mt-10 border-t pt-8 text-center">
          <h2 className="my-5 text-lg font-bold">Ready to checkout?</h2>
          <p className="mb-5">
            Please log in or create an account to complete your purchase.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/login"
              className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="cursor-pointer rounded-lg border border-blue-500 px-4 py-2 text-blue-500 transition hover:border-blue-700 hover:text-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      )}
      {user && cart.items.length > 0 && (
        <div className="mt-4 flex gap-4">
          <button
            type="button"
            className="cursor-pointer rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-700"
            disabled={isSubmitting}
            onClick={() => dispatch({ type: "EMPTY_CART" })}
          >
            Reset cart
          </button>
          <button
            type="button"
            className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-700"
            disabled={isSubmitting}
            onClick={handleCheckout}
          >
            Checkout: {cart.total}
          </button>
        </div>
      )}
    </>
  );
}

export default Cart;
