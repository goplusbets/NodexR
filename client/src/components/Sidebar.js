import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Sidebar({ handleLogout, username }) {
  const [isMenuOpen, setIsMenuOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1024) {
        setIsMenuOpen(true);
      } else {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoutClick = async () => {
    const token = sessionStorage.getItem("token");
    try {
      await axios.post("https://nodex.goplusbet.pl/api/users/logout", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      sessionStorage.removeItem("token");
      window.location.href = "/login"; // Przekierowanie na stronę logowania
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <div className="container-fluid p-0">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-md-none">
          <Link to="/" className="navbar-brand">
            <img
              src="https://i.postimg.cc/3R6SBYb2/logo.png"
              alt="Logo"
              className="img-fluid"
              style={{ width: "100px" }}
            />
          </Link>
          <button className="navbar-toggler" type="button" onClick={toggleMenu}>
            <span className="navbar-toggler-icon"></span>
          </button>
        </nav>

        <div
          className={`sidebar bg-dark text-white ${
            isMenuOpen ? "opened" : "closed"
          }`}
          style={{ zIndex: 1050 }}
        >
          <Link to="/" className="logo-sidebar mt-2 mb-2">
            <img
              src="https://i.postimg.cc/3R6SBYb2/logo.png"
              alt="Logo"
              className="img-fluid"
              style={{ width: "180px", margin: "0 auto", display: "block" }}
            />
          </Link>

          <div className="sidebar-header p-3 d-flex justify-content-between align-items-center">
            <h5>{username}</h5>
          </div>
          <div className="p-2">
            <h5>Profil</h5>
            <Link
              to="/change-password"
              className="btn btn-light btn-sm mb-2 w-100"
            >
              Zmień hasło
            </Link>
            <button
              onClick={handleLogoutClick}
              className="btn btn-danger btn-sm w-100"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;