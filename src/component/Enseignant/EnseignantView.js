import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Search from '../common/Search';


const normalizeWhitespace = (str) => str.replace(/\s+/g, ' ').trim().toLowerCase();

const ProfileEnseignantView = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEnseignants();
  }, []);

  const loadEnseignants = async () => {
    try {
      const result = await axios.get('http://localhost:8080/profilEnseignant');
      setEnseignants(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/profilEnseignant/${id}`);
      loadEnseignants(); 
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const normalizedSearch = normalizeWhitespace(search);

  const filteredEnseignants = enseignants.filter((enseignant) => {
    const normalizedNom = normalizeWhitespace(enseignant.nom);
    const normalizedPrenom = normalizeWhitespace(enseignant.prenom);
    const normalizedDepartment = normalizeWhitespace(enseignant.department);

    
    const searchTerms = normalizedSearch.split(' ').filter(term => term);

    
    return searchTerms.every(term => 
      normalizedNom.includes(term) ||
      normalizedPrenom.includes(term) ||
      normalizedDepartment.includes(term)
    );
  });

  return (
    <section>
      <Search search={search} setSearch={setSearch} />
      <table className="table table-bordered table-hover shadow">
        <thead>
          <tr className="text-center">
            <th>N°</th>
            <th>ID</th>
            <th>Nom</th>
            <th>Prenom</th>
            <th>Department</th>
            <th colSpan="3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredEnseignants.map((item, index) => (
            <tr key={item.id}>
              <th scope="row">{index + 1}</th>
              <td>{item.id}</td>
              <td>{item.nom}</td>
              <td>{item.prenom}</td>
              <td>{item.department}</td>
              <td className="mx-2">
                <Link to={`/enseignant-profile/${item.id}`} className="btn btn-info">
                  <FaEye />
                </Link>
              </td>
              <td className="mx-2">
                <Link to={`/edit-enseignant/${item.id}`} className="btn btn-warning">
                  <FaEdit />
                </Link>
              </td>
              <td className="mx-2">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item.id)}
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ProfileEnseignantView;
