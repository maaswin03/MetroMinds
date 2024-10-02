import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
      setIsMenuOpen(prev => !prev);
  };

  return (
    <>
      <div className="navbar-1">

        <div className="navbar-2 navbar-3">

          <a href="" id="Title">Metro Minds</a>

          <a href="">DashBoard</a>

          <a href="">Services</a>

          <a href="">Contact Us</a>

        </div>

        <div className="navbar-2 navbar-5">
          <button>Sign In</button>
        </div>

      </div>

      <header>
        <div className="hamburger-menu" onClick={toggleMenu} style={{ display: 'flex' }}>
          <div>
            <div className={`bar ${isMenuOpen ? 'animate' : ''}`}></div>
            <div className={`bar ${isMenuOpen ? 'animate' : ''}`}></div>
            <div className={`bar ${isMenuOpen ? 'animate' : ''}`}></div>
          </div>
        </div>
        <nav className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><a href="" id="Title">Metro Minds</a></li>
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
