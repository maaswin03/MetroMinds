import { useState } from "react";
import "./Navbar.css";
import { Link } from 'react-router-dom';
import { UserButton, useUser } from "@clerk/clerk-react";

function Navbar() {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <>
      <div className="navbar-1">

        <div className="navbar-2 navbar-3">

          <Link to="/" id="Title">Metro Minds</Link>

          <Link to="/dashboard">DashBoard</Link>

          <a href="">Services</a>

          <a href="">Contact Us</a>

        </div>

        <div className="navbar-2 navbar-5">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="#" />
          ) : (
            <Link to="*">Signin</Link>
          )}
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
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/Signin" />
            ) : (
              <Link to="*">Signin</Link>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
