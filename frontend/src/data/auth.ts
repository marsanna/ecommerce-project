import { authServiceURL } from "../utils/fetchInterceptor";

export async function register(
  body: Omit<User, "id"> & { password: string; confirmPassword: string },
) {
  const { firstName, lastName, email, password, confirmPassword } = body;

  const res = await fetch(`${authServiceURL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    }),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    if (!errorData.error) {
      throw new Error(errorData.message);
    }
    throw new Error(errorData.error);
  }
  return res.json();
}

export async function login(body: { email: string; password: string }) {
  const { email, password } = body;

  const res = await fetch(`${authServiceURL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    if (!errorData.error) {
      throw new Error(errorData.message);
    }
    throw new Error(errorData.error);
  }
  return res.json();
}

export async function getMe() {
  const userRes = await fetch(`${authServiceURL}/auth/me`);
  if (!userRes.ok) throw new Error("Get user data failed");
  return userRes.json();
}

export async function refresh() {
  const res = await fetch(`${authServiceURL}/auth/refresh`, {
    method: "POST",
  });

  if (!res.ok) return;
}

export async function logout() {
  const res = await fetch(`${authServiceURL}/auth/logout`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Logout failed");
}
