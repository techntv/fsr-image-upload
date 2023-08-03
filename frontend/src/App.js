import React, { useContext, useEffect } from "react";
import { AuthContext } from "./context";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";

const App = () => {
  const { state, dispatch } = useContext(AuthContext);

  useEffect(() => {}, []);
  return (
    <>
      <Navbar auth={false} />
      <Routes>
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
};

export default App;