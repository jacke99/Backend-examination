import React from "react";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();

  function navHome() {
    navigate("/home");
  }

  function navBroadcasts() {
    navigate("/broadcasts");
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
      </div>
    </nav>
  );
};

export default Navbar;
