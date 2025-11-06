import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isAdmin = !!localStorage.getItem('admin_username');

  const handleLogout = () => {
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_password');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">Form Builder</Link>
        <div className="navbar-links">
          {isAdmin ? (
            <>
              <Link to="/admin" className="nav-link">Admin</Link>
              <button onClick={handleLogout} className="nav-link btn-logout">Logout</button>
            </>
          ) : (
            <Link to="/admin" className="nav-link">Admin Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
