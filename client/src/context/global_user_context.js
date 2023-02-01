import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useGlobalContext } from './global_context';

const GlobalUserContext = React.createContext();

const GlobalUserProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const saveUser = (user) => setUser(user);
  const removeUser = (user) => setUser(null);

  const { host } = useGlobalContext();
  console.log('host', host);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${host}/api/v1/users/showMe`, {
        withCredentials: true,
      });
      saveUser(data.user);
    } catch (error) {
      removeUser();
    }
    setIsLoading(false);
  };

  const logoutUser = async () => {
    try {
      await axios.delete(`${host}/api/v1/auth/logout`, {
        withCredentials: true,
      });
      removeUser();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <GlobalUserContext.Provider
      value={{ user, saveUser, logoutUser, isLoading }}
    >
      {children}
    </GlobalUserContext.Provider>
  );
};

export const useGlobalUserContext = () => {
  return useContext(GlobalUserContext);
};

export { GlobalUserProvider };
