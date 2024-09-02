import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Search from '../common/Search';

const AppUserView = () => {
  const [appUsers, setAppUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAppUsers();
  }, []);

  const loadAppUsers = async () => {
    try {
      const result = await axios.get('http://localhost:8080/appUser'); 
      setAppUsers(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (id) => {
    
    const usersEndingWithS = appUsers.filter(user => user.username.endsWith('@S'));

    
    if (usersEndingWithS.length === 1 && usersEndingWithS[0].id === id) {
      alert("Cannot delete the only user with a username ending with '@S'.");
      return;
    }

    
    try {
      await axios.delete(`http://localhost:8080/appUser/${id}`); 
      loadAppUsers();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const filteredAppUsers = appUsers.filter((user) => {
    const [searchUsername, searchPassword] = search.toLowerCase().split(" ");
    const usernameMatches = searchUsername ? user.username.toLowerCase().includes(searchUsername) : true;
    const passwordMatches = searchPassword ? user.password.toLowerCase().includes(searchPassword) : true;
    return usernameMatches && passwordMatches;
  });

  return (
    <section>
      <Search search={search} setSearch={setSearch}/>
      <table className="table table-bordered table-hover shadow">
        <thead>
          <tr className="text-center">
            <th>N°</th>
            <th>ID</th>
            <th>Username</th>
            
            <th colSpan="3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredAppUsers.map((user, index) => (
            <tr key={user.id}>
              <th scope="row">{index + 1}</th>
              <td>{user.id}</td>
              <td>{user.username}</td>
              
              <td className="mx-2">
                <Link to={`/appUser-profile/${user.id}`} className="btn btn-info">
                  <FaEye />
                </Link>
              </td>
              
              <td className="mx-2">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user.id)}
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

export default AppUserView;
