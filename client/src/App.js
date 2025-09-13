import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import CreateUserPage from "./createuser"; // Ensure this path is correct

function App() {
  return (
    <Router>
   
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-user" element={<CreateUserPage />} />
        </Routes>
      
    </Router>
  );
}

export default App;
