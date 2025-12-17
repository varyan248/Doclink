import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currency = ' ₹'

  const calculateAge = (dob) => {
  if (!dob) return null;

  const today = new Date();
  const birthDate = new Date(dob);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

  const value = {
    calculateAge,
    currency
  };


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
