import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import '@fortawesome/fontawesome-free/css/all.min.css'; 
const ProfileEnseignant = () => {
  const { id } = useParams();
  const [enseignant, setEnseignant] = useState({
    nom: '',
    prenom: '',
    department: '',
    experience: '',
    cvFilePath: '',
    carteIdentiteFilePath: '',
    autorisationFilePath: '',
    grade: '', 
    photoFilePath: '' 
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [avatar, setAvatar] = useState("https://i.postimg.cc/B6kFYg2j/image-1.png"); 
  const [loading, setLoading] = useState(false); 
  useEffect(() => {
    
    loadEnseignant();
    const storedAvatar = localStorage.getItem(`avatar-${id}`);
    if (storedAvatar) {
      setAvatar(storedAvatar);
    } else if (enseignant.photoFilePath) {
      setAvatar(`http://localhost:8080/profilEnseignant/${id}/downloadPhoto`);
    }
  }, [id, enseignant.photoFilePath]);

  const loadEnseignant = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`http://localhost:8080/profilEnseignant/${id}`);
      setEnseignant(result.data);
      if (result.data.photoFilePath) {
        setAvatar(`http://localhost:8080/profilEnseignant/${id}/downloadPhoto`);
      }
    } catch (error) {
      console.error("Failed to fetch enseignant:", error);
      alert("Unable to load professor details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const previewFile = async (type) => {
    try {
      const response = await axios.get(`http://localhost:8080/profilEnseignant/${id}/download${type}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank'); 
    } catch (error) {
      console.error(`Failed to preview ${type}:`, error);
      alert(`There was an error previewing the ${type}. Please try again later.`);
    }
  };

  const uploadFile = async (type) => {
    if (!selectedFile) {
      alert(`Please select a file to upload for ${type}.`);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post(`http://localhost:8080/profilEnseignant/${id}/upload${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(`${type} uploaded successfully!`);
      loadEnseignant(); 
      setSelectedFile(null); 
      setSelectedType(''); 
    } catch (error) {
      console.error(`Error uploading ${type}:`, error.response ? error.response.data : error.message);
      alert(`There was an error uploading the ${type}. Please try again later.`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      setSelectedFile(file);
    } else {
      alert("Please select a valid file.");
      e.target.value = null; 
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) {
      alert("Please select a photo to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post(`http://localhost:8080/profilEnseignant/${id}/uploadPhoto`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Photo uploaded successfully!");
      setAvatar(URL.createObjectURL(selectedFile)); 
      loadEnseignant(); 
      setSelectedFile(null); 
    } catch (error) {
      console.error("Error uploading photo:", error.response ? error.response.data : error.message);
      alert("There was an error uploading the photo. Please try again later.");
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await axios.delete(`http://localhost:8080/profilEnseignant/${id}/deletePhoto`);
      alert("Avatar deleted successfully!");
      setAvatar("https://i.postimg.cc/B6kFYg2j/image-1.png"); 
      localStorage.removeItem(`avatar-${id}`); 
    } catch (error) {
      console.error("Error deleting avatar:", error);
      alert("There was an error deleting the avatar. Please try again later.");
    }
  };

  const handleAvatarChange = (url) => {
    setAvatar(url);
    localStorage.setItem(`avatar-${id}`, url); 
  };

  const { nom, prenom, department, experience, cvFilePath, carteIdentiteFilePath, autorisationFilePath, grade } = enseignant;

  return (
    <section className="shadow" style={{ backgroundColor: "whitesmoke" }}>
      {loading && <div className="text-center">Loading...</div>}
      <h2 className='mt-5'>Profile Enseignant</h2>
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
                    <i className="fas fa-male" style={{ fontSize: '24px', marginRight: '1px' }}></i>
                    
                  </button>
                  <button 
                    onClick={() => handleAvatarChange("https://i.postimg.cc/x15zDYKD/image-2.png")}
                    className="btn d-flex align-items-center"
                    style={{ backgroundColor: 'pink', border: 'none', color: 'white', marginRight: '10px' }}
                  >
                    <i className="fas fa-female" style={{ fontSize: '24px', marginRight: '1px' }}></i>
                    
                  </button>
                  <button 
                    onClick={handleDeleteAvatar} 
                    className="btn btn-danger d-flex align-items-center"
                    style={{ marginLeft: '10px' }}
                  >
                    <i className="fas fa-trash-alt" style={{ fontSize: '24px', marginRight: '8px' }}></i>
                    Avatar 
                  </button>
                </div>
                <img
                  src={avatar}
                  alt="avatar"
                  className="rounded-circle img-fluid"
                  style={{ width: 150 }}
                />
                <h5 className="my-3">{`${prenom} ${nom}`}</h5>
                <Link to={`/edit-enseignant/${id}`} className="btn btn-warning">
                  Edit
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="card mb-4">
              <div className="card-body">
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h5 className="mb-0">Nom</h5>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{nom}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h5 className="mb-0">Prenom</h5>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{prenom}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h5 className="mb-0">Department</h5>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{department}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h5 className="mb-0">Experience</h5>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{experience}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h5 className="mb-0">Grade</h5> 
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{grade}</p> 
                  </div>
                </div>
                <hr />
                <div>
                  {cvFilePath && (
                    <>
                      <button onClick={() => previewFile('CV')} className='btn btn-outline-primary'>
                        Preview CV
                      </button>
                    </>
                  )}
                  {carteIdentiteFilePath && (
                    <>
                      <button onClick={() => previewFile('CarteIdentite')} className='btn btn-outline-primary'>
                        Preview Carte d'Identité
                      </button>
                    </>
                  )}
                  {autorisationFilePath && (
                    <>
                      <button onClick={() => previewFile('Autorisation')} className='btn btn-outline-primary'>
                        Preview Autorisation d'Enseigner
                      </button>
                    </>
                  )}
                </div>
                <hr />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    style={{ flex: 0 }} 
                  />
                  <select 
                    onChange={(e) => setSelectedType(e.target.value)} 
                    value={selectedType} 
                    style={{ flex: 0 }}
                  >
                    <option value="">Select File Type</option>
                    <option value="CV">CV</option>
                    <option value="CarteIdentite">Carte d'Identité</option>
                    <option value="Autorisation">Autorisation d'Enseigner</option>
                  </select>
                  <button 
                    onClick={() => uploadFile(selectedType)} 
                    className='btn btn-outline-primary'
                    style={{ flexShrink: 0 }}
                    disabled={!selectedType} 
                  >
                    Upload {selectedType}
                  </button>
                </div>
                <hr />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    style={{ flex: 0 }} 
                  />
                  <button 
                    onClick={handlePhotoUpload} 
                    className='btn btn-outline-primary'
                    style={{ flexShrink: 0 }}
                    disabled={!selectedFile} 
                  >
                    Upload Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileEnseignant;
