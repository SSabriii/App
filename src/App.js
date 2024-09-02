import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Home";
import NavBar from "./component/common/NavBar";
import NavBar2 from "./component/common/NavBar2";
import Register from './component/auth/Register';
import Login from './component/auth/Login';
import ForgotPassword from './component/auth/ForgotPassword'; 
import ResetPassword from './component/auth/ResetPassowrd';
import ProfileEnseignantView from "./component/Enseignant/EnseignantView";
import AddEnseignant from "./component/Enseignant/AddEnseignant";
import EditEnseignant from "./component/Enseignant/EditEnseignant";
import ProfileEnseignant from "./component/Enseignant/ProfileEnseignant";
import AppUserView from "./component/AppUser/AppUserView";
import ProfileAppUser from "./component/AppUser/ProfileAppUser";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [navbarType, setNavbarType] = useState('');

  useEffect(() => {
    
    const authStatus = localStorage.getItem('isAuthenticated');
    const userSuffix = localStorage.getItem('userSuffix');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setNavbarType(userSuffix);
    }
  }, []);

  const handleLogin = (suffix) => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    setNavbarType(suffix);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setNavbarType('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userSuffix');
  };

  return (
    <main className="container mt-5">
      <Router>
        
        {isAuthenticated && (navbarType === 'S' ? <NavBar onLogout={handleLogout} /> : <NavBar2 onLogout={handleLogout} />)}

        <Routes>
          
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} /> 

          
          {!isAuthenticated ? (
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/view-enseignant" element={<ProfileEnseignantView />} />
              <Route path="/add-enseignant" element={<AddEnseignant />} />
              <Route path="/edit-enseignant/:id" element={<EditEnseignant />} />
              <Route path="/enseignant-profile/:id" element={<ProfileEnseignant />} />
              <Route path="/view-user" element={<AppUserView />} />
              <Route path="/appUser-profile/:id" element={<ProfileAppUser />} />
            </>
          )}
        </Routes>
      </Router>
    </main>
  );
}

export default App;
