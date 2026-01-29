import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";

import useAuth from "../contexts/useAuth";
import { getMe, login } from "../data/auth";

type LoginFormState = {
  email: string;
  password: string;
};

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [{ email, password }, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!email || !password) throw new Error("All fields are required");
      setLoading(true);
      await login({ email, password });
      const { user } = await getMe();
      setUser(user);
      navigate("/");
    } catch (error: unknown) {
      const message = (error as { message: string }).message;
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="my-5 text-lg font-bold">Sign in</h1>
      <form
        className="mx-auto my-5 flex flex-col gap-3 md:w-1/2"
        onSubmit={handleSubmit}
      >
        <label className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 text-gray-400 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            name="email"
            value={email}
            onChange={handleChange}
            type="email"
            className="grow bg-transparent outline-none placeholder:text-gray-400"
            placeholder="Email"
          />
        </label>

        <label className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 text-gray-400 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            name="password"
            value={password}
            onChange={handleChange}
            type="password"
            className="grow bg-transparent outline-none placeholder:text-gray-400"
            placeholder="Password"
          />
        </label>

        <small className="text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Register!
          </Link>
        </small>

        <button
          className="mt-2 self-center rounded-lg bg-blue-600 px-8 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          disabled={loading}
        >
          Sign in
        </button>
      </form>
    </>
  );
};

export default Login;
