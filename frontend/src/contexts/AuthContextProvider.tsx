import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { getMe, refresh } from "../data/auth";
import { AuthContext } from "./AuthContext";

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<null | User>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const refreshLogin = async () => {
      try {
        setAuthLoading(true);
        await refresh();
        const { user } = await getMe();
        setUser(user);
      } catch (error) {
        console.log(error);
      } finally {
        setAuthLoading(false);
      }
    };
    refreshLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
