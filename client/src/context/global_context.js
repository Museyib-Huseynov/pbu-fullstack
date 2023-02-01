import React, { useState, useEffect, useContext } from 'react';

const GlobalContext = React.createContext();

const GlobalProvider = ({ children }) => {
  const [fieldsEmpty, setFieldsEmpty] = useState(false);
  const [host, setHost] = useState('');

  return (
    <GlobalContext.Provider value={{ fieldsEmpty, setFieldsEmpty, host }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export { GlobalProvider };
