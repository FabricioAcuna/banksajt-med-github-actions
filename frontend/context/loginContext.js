"use client";

const { createContext, useState, useContext } = require("react");

const LoginContext = createContext();

export default function LoginProvider({ children }) {
  const [login, setLogin] = useState();
  const [otp, setOtp] = useState();

  return (
    <LoginContext.Provider value={{ login, setLogin, otp, setOtp }}>
      {children}
    </LoginContext.Provider>
  );
}

export const useLogin = () => useContext(LoginContext);
