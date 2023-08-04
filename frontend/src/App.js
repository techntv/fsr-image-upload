// frontend/src/App.js

import React, { useContext, useEffect } from "react";
import { AuthContext } from "./context";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Confirmation from "./pages/Confirmation";
import Login from "./pages/Login";

const RequireAuth = ({ children }) => {
  const { state } = useContext(AuthContext);
  console.log("🚀 ~ file: App.js:13 ~ RequireAuth ~ state:", state)
  return state.auth ? children : <Navigate to="/login" replace />;
};

const OnlyNotAuth = ({ children }) => {
  const { state } = useContext(AuthContext);
  return !state.auth ? children : <Navigate to="/" replace />;
};

const Home = () => {
  return <h1>Hello, user!</h1>;
};

const App = () => {
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    console.log("🚀 ~ file: App.js:31 ~ useEffect ~ user:", user)
    if (user) {
      dispatch({
        type: "LOGIN",
        payload: {
          user: user,
          token: user?.token,
        },
      });
    }
  }, []);
  return (
    <>
      <Navbar auth={false} />
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />

        <Route
          path="/signup"
          element={
            <OnlyNotAuth>
              <Signup />
            </OnlyNotAuth>
          }
        />
        <Route
          path="/login"
          element={
            <OnlyNotAuth>
              <Login />
            </OnlyNotAuth>
          }
        />
        <Route
          path="/verify/:confirmationToken"
          element={
            <OnlyNotAuth>
              <Confirmation />
            </OnlyNotAuth>
          }
        />
      </Routes>
    </>
  );
};

export default App;