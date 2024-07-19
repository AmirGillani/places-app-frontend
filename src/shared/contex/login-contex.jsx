import { createContext } from "react";

// CREATE A CONTEXT OBJECT 
const AuthContex = createContext({
  isLoggedIn: false,
  token:null,
  userId: null,
  login: () => {},
  logout: () => {},
});

export { AuthContex };

