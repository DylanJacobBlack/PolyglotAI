import React, {
  useState,
  useEffect,
  useCallback,
  PropsWithChildren,
} from "react";

let logoutTimer: any;

interface AuthContextInterface {
  token: string | null | undefined;
  isLoggedIn: boolean;
  login: (token: string, expirationTime: number) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextInterface>({
  token: "",
  isLoggedIn: false,
  login: (token: string, expirationTime: number) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime: number) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationTime = parseInt(
    localStorage.getItem("expirationTime") || "0"
  );

  const remainingDuration = calculateRemainingTime(storedExpirationTime);

  if (remainingDuration < 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return { token: storedToken, remainingTime: remainingDuration };
};

export const AuthContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const loginHandler = (token: string, expirationTime: number) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", `${expirationTime}`);

    const remainingDuration = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingDuration);
  };

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.remainingTime);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
