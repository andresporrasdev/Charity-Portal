import React, { useContext,useState  } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Nav.css";
import logo from "./logo.png";
import { FaFacebook, FaInstagram,FaBars  } from "react-icons/fa";
import { UserContext } from "../../UserContext";

function Nav() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="navbar-center">
          <div className="header-text">
            <h1>Ottawa Tamil Sangam</h1>
            <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
              <ul>
                <li>
                  <NavLink to="/" activeclassname="active" onClick={toggleMenu}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/event" activeclassname="active" onClick={toggleMenu}>
                    Event
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/membership" activeclassname="active" onClick={toggleMenu}>
                    Membership
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/volunteer" activeclassname="active" onClick={toggleMenu}>
                    Volunteer
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/news" activeclassname="active" onClick={toggleMenu}>
                    News
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/gallery" activeclassname="active" onClick={toggleMenu}>
                    Gallery
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact-us" activeclassname="active" onClick={toggleMenu}>
                    Contact
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="navbar-right">
          {user ? (
            <div className="user-info">
              <h3>Welcome, {user.first_name}</h3>
              <button className="logout-button" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="social-login-container">
              <div className="social-icons">
                <a href="https://www.facebook.com/TamilSangamofOttawa" target="_blank" rel="noopener noreferrer">
                  <FaFacebook />
                </a>
                <a href="https://www.instagram.com/ottawatamilsangam/" target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                </a>
              </div>
              <button className="login-button" onClick={() => navigate("/login")}>
                Log In
              </button>
              <button className="login-button" onClick={() => navigate("/register")}>
                Sign Up
              </button>
            </div>
          )}
        </div>
        <div className="menu-toggle" onClick={toggleMenu}>
          <FaBars />
        </div>
      </div>
    </>
  );
}

export default Nav;
