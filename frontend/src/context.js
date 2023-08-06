// Import the built-in createContext hook from "react" 
import React, { createContext, useReducer } from "react";

// Create the appliation context, you can name as you like.
export const AuthContext = createContext();

const initialState = {
  auth: false,
  user: null,
  token: null,
};

const reducer = (state, action) => {
    // Check the action type
    switch (action.type) {
      case "LOGIN":
      // In case of login action
        return {
          ...state,
          auth: true,
          user: action.payload.user,
          token: action.payload.token,
        };
      case "LOGOUT":
      // In case of logout action
        return {
          ...state,
          auth: false,
          user: null,
        };
      default:
        return state;
    }
  };

  const ContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
      <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
    );
  };
  
  export default ContextProvider;