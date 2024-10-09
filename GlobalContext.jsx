import { createContext, useState, useEffect } from 'react';
import axios from 'axios';  // Assuming axios is used for making API calls

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [id, setID] = useState(null);  // State for storing user ID
  const [userName, setUserName] = useState(null);  // State for storing user name
  const url = import.meta.env.VITE_API_URL;

  // On initial load, retrieve the userID from localStorage (if available)
  useEffect(() => {
    const storedID = localStorage.getItem('userID');
    if (storedID) {
      setID(storedID);
    }
  }, []);

  // Whenever the ID is updated, store it in localStorage and fetch the user's name
  useEffect(() => {
    if (id) {
      localStorage.setItem('userID', id);

      // Fetch user's name using the `GET` method after retrieving the userID
      const fetchUserName = async () => {
        try {
          console.log(`Fetching user name for ID: ${id}`); // Debugging
          const response = await axios.get(`${url}/api/users/${id}`);
          console.log('API Response:', response.data);  // Log the response

          const { name } = response.data.data;  // Access the 'name' from response.data.data
          setUserName(name);
        } catch (error) {
          console.error('Error fetching user name:', error);
        }
      };

      fetchUserName();
    }
  }, [id]);

  return (
    <GlobalContext.Provider value={{ id, setID, userName }}>
      {children}
    </GlobalContext.Provider>
  );
};
