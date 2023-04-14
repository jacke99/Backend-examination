import React from "react";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();

  function navHome() {
    navigate("/");
  }

  function navBroadcasts() {
    navigate("/broadcasts");
  }
  function navLogin() {
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <h2 className="navbar-title">Phone duck inc</h2>
      <div className="navbar-btn-container">
        <button className="navbar-btn" onClick={navHome}>
          Home
        </button>
        <button className="navbar-btn" onClick={navBroadcasts}>
          Broadcasts
        </button>
        <button className="navbar-btn-login" onClick={navLogin}>
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
