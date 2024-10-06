import { createContext, useState, useContext } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [id, setID] = useState(null);  // Start with a default value of null or empty string
  return (
    <GlobalContext.Provider value={{ id, setID }}>
      {children}
    </GlobalContext.Provider>
  );
};

const Component = () => {
  const { id: userID } = useContext(GlobalContext);

  const handlePurchaseOrderClick = (purchaseOrderId) => {
    console.log(purchaseOrderId);
    console.log(userID);  // This should now show the userID
  };

  return (
    <div onClick={() => handlePurchaseOrderClick(3)}>Click Me</div>
  );
};
