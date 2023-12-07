import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
const App = () => {
  return (
    <div className="">
      <Router>
        <Routes>
          <Route path="/login" exact element={<Login />}></Route>
          <Route path="/" exact element={<Register />}></Route>
          <Route path="/dashboard" exact element={<Dashboard />}></Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
