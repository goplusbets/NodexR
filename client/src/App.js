import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Dodaj import Navigate
import CreateUser from "./components/CreateUser";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ChangePassword from "./components/ChangePassword";
import SetPassword from "./components/SetPassword";
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from './components/ProtectedRoute';
import Logs from './components/Logs';
import "../src/style.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(null); // Zmienione z false na null, aby rozróżnić niezaładowany stan
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    const savedRole = sessionStorage.getItem("role");
    if (savedToken && savedRole) {
      setLoggedIn(true);
      setToken(savedToken);
      setRole(savedRole);
    } else {
      setLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    setLoggedIn(false);
    setRole("");
    setToken("");
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setRole={setRole} setToken={setToken} />} />
          <Route path="/set-password/:token" element={<SetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<ProtectedRoute isLoggedIn={loggedIn}/>}>
            <Route path="/" element={<Dashboard role={role} handleLogout={handleLogout} />} />
            <Route path="/create-user" element={<CreateUser token={token} handleLogout={handleLogout} />} />
            <Route path="/change-password" element={<ChangePassword token={token} role={role} handleLogout={handleLogout} />} />
            <Route path="/logs" element={loggedIn && role === "Admin" ? <Logs token={token} role={role} handleLogout={handleLogout} /> : <Navigate to="/" />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
