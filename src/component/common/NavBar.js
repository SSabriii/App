import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const NavBar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  
  const navbarStyle = {
    backgroundColor: '#003366' 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark mb-4" style={navbarStyle}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-home"></i> Home
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/view-enseignant">
                <i className="fas fa-user-tie"></i> View Enseignant
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add-enseignant">
                <i className="fas fa-user-plus"></i> Add New Enseignant
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/view-user">
                <i className="fas fa-users"></i> View User
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                <i className="fas fa-user-edit"></i> Register User
              </Link>
            </li>
          </ul>
          <button className="btn btn-outline-light ms-2" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
