import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="navbar-1">
      <div className="navbar-2">
        <div className="navbar-3 navbar-7"></div>
        <h1>Metro Minds</h1>
      </div>

      <div className="navbar-2 navbar-4">
        <a href="">DashBoard</a>

        <a href="">Services</a>

        <a href="">Contact Us</a>

        <a href="">FAQ</a>
      </div>

      <div className="navbar-2 navbar-5">
        <button>Sign In</button>
      </div>
    </div>
  );
}

export default Navbar;
