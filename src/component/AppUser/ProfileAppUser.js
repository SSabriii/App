import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import '@fortawesome/fontawesome-free/css/all.min.css'; 

const ProfileAppUser = () => {
  const { id } = useParams();
  const [appUser, setAppUser] = useState({
    username: '',
    role: ''
  });
  const [avatar, setAvatar] = useState("https://i.postimg.cc/B6kFYg2j/image-1.png"); 

  useEffect(() => {
    loadAppUser();
    
    const storedAvatar = localStorage.getItem(`avatar-${id}`);
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }
  }, [id]);

  const loadAppUser = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/appUser/${id}`);
      setAppUser(result.data);
    } catch (error) {
      console.error("Failed to fetch app user:", error);
    }
  };

  const handleAvatarChange = (url) => {
    setAvatar(url);
    localStorage.setItem(`avatar-${id}`, url); 
  };

  const { username, role } = appUser;

  return (
    <section className="shadow" style={{ backgroundColor: "whitesmoke" }}>
      <h2 className='mt-5'>Profile App User</h2>
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-3">
            <div className="card mb-4">
              <div className="card-body text-center">
                <div className="mt-3 d-flex justify-content-center mb-3">
                  <button 
                    onClick={() => handleAvatarChange("https://i.postimg.cc/B6kFYg2j/image-1.png")}
                    className="btn d-flex align-items-center"
                    style={{ backgroundColor: 'blue', border: 'none', color: 'white', marginRight: '10px' }}
                  >
                    <i className="fas fa-male" style={{ fontSize: '24px', marginRight: '8px' }}></i>
                    Avatar
                  </button>
                  <button 
                    onClick={() => handleAvatarChange("https://i.postimg.cc/x15zDYKD/image-2.png")}
                    className="btn d-flex align-items-center"
                    style={{ backgroundColor: 'pink', border: 'none', color: 'white' }}
                  >
                    <i className="fas fa-female" style={{ fontSize: '24px', marginRight: '8px' }}></i>
                    Avatar
                  </button>
                </div>
                <img
                  src={avatar}
                  alt="avatar"
                  className="rounded-circle img-fluid"
                  style={{ width: 150 }}
                />

              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="card mb-4">
              <div className="card-body">
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h5 className="mb-0">Username</h5>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{username}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h5 className="mb-0">Role</h5>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{role}</p>
                  </div>
                </div>
                <hr />
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileAppUser;
