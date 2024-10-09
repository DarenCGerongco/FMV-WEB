import { createContext, useState, useEffect, useContext } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [id, setID] = useState(null);  // Correctly define setID here

  // On initial load, retrieve the userID from localStorage (if available)
  useEffect(() => {
    const storedID = localStorage.getItem('userID');
    if (storedID) {
      setID(storedID);
    }
  }, []);

  // Whenever the ID is updated, store it in localStorage
  useEffect(() => {
    if (id) {
      localStorage.setItem('userID', id);
    }
  }, [id]);

  return (
    <GlobalContext.Provider value={{ id, setID }}>
      {children}
    </GlobalContext.Provider>
  );
};
