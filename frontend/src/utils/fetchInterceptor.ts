const originalFetch = fetch;
const authServiceURL = import.meta.env.VITE_APP_AUTH_SERVER_URL;

window.fetch = async (url, options = {}, ...rest) => {
  const isInternalRequest = url.toString().includes(authServiceURL);

  if (!isInternalRequest) {
    return originalFetch(url, options, ...rest);
  }

  let res = await originalFetch(
    url,
    { ...options, credentials: "include" },
    ...rest,
  );

  const authHeader = res.headers.get("WWW-Authenticate");
  if (authHeader?.includes("token_expired")) {
    console.log("ATTEMPT REFRESH");

    const refreshRes = await originalFetch(`${authServiceURL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      throw new Error("Login required");
    }

    res = await originalFetch(
      url,
      { ...options, credentials: "include" },
      ...rest,
    );
  }

  return res;
};

export { authServiceURL };
