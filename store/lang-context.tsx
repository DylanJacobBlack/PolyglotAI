import React, { useState } from "react";

interface LangContextInterface {
  language: string;
  enabled: boolean;
  changeLanguage: (language: string) => void;
  disable: () => void;
  enable: () => void;
}

const LangContext = React.createContext<LangContextInterface>({
  language: "English",
  enabled: false,
  changeLanguage: () => {},
  disable: () => {},
  enable: () => {},
});

interface LangContextProvider {
  children: JSX.Element;
}

export const LangContextProvider = ({ children }: LangContextProvider) => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "english");
  const [enabled, setEnabled] = useState(true);

  const changeLanguageHandler = (language: string) => {
    setLanguage(language);
    localStorage.setItem("language", language);
  };

  const disableHandler = () => {
    setEnabled(false);
  };

  const enableHandler = () => {
    setEnabled(true);
  };

  const contextValue = {
    language,
    enabled,
    changeLanguage: changeLanguageHandler,
    disable: disableHandler,
    enable: enableHandler,
  };

  return (
    <LangContext.Provider value={contextValue}>{children}</LangContext.Provider>
  );
};

export default LangContext;
