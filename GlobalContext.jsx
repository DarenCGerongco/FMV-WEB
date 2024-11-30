// GlobalContext.jsx
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';  // Assuming axios is used for making API calls

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [id, setID] = useState(null);  // State for storing user ID
  const [userName, setUserName] = useState(null);  // State for storing user name
  const url = import.meta.env.VITE_API_URL;

  // On initial load, retrieve the userID from localStorage (if available)
  useEffect(() => {
    try {
      const storedID = localStorage.getItem('userID');
      if (storedID) {
        setID(storedID);
      } else {
        console.warn("User ID not found in localStorage after refresh");
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      // Handle missing local storage gracefully, e.g., by redirecting to login
    }
  }, []);

  // Whenever the ID is updated, store it in localStorage and fetch the user's name
  useEffect(() => {
    if (id) {
      try {
        localStorage.setItem('userID', id);
      } catch (error) {
        console.error("Failed to set userID in localStorage:", error);
      }

      // Fetch user's name using the `GET` method after retrieving the userID
      const fetchUserName = async () => {
        try {
          console.log(`Fetching user name for ID: ${id}`); // Debugging
          const response = await axios.get(`${url}/api/users/${id}`);
          console.log('API Response from GlobalContext.jsx:', response.data.name);  // Log the response
          setUserName(response.data.name);
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
