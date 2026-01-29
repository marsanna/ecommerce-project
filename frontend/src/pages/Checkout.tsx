import { useState } from "react";
import { useParams } from "react-router";

import { authServiceURL } from "../utils/fetchInterceptor";

function Checkout() {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownload = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${authServiceURL}/orders/${id}/pdf`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Server error when creating PDF");

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Order_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("PDF creating error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-10 w-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      </div>

      <h1 className="my-5 text-lg font-bold">Thank you for your order!</h1>
      <p className="mb-5">
        We have received your order and are processing it now.
      </p>
      <button
        type="button"
        className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        disabled={isSubmitting}
        onClick={handleDownload}
      >
        Download order as PDF
      </button>
    </div>
  );
}

export default Checkout;
