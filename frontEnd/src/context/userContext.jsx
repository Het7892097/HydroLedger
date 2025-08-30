import { createContext, useState, useContext } from "react";
const UserContext = createContext();

export default function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);

  const setUser = (value) => {
    setUserData(value);
  };
  return (
    <UserContext.Provider value={{ userData, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
