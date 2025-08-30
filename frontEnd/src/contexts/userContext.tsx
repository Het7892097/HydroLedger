import { createContext, ReactNode, useState, useContext } from "react"
import {  userContext, userContextData } from "../types/User"
const UserContext = createContext<userContext | undefined>(undefined);

export default function UserProvider({children}:{children:ReactNode}) {
  const [userData, setUserData] = useState<userContextData | null>(null);

  const setUser = (value: userContextData|null) => {
    setUserData(value);
  }
  return <UserContext.Provider value={{userData,setUser}}>
    {children}
  </UserContext.Provider>
}
 export function useUserContext () {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};

// module.exports = useUserContext;