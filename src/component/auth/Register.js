import axios from 'axios';
import { useState } from 'react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');

  async function save(event) {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/register', {
        username: username,
        password: password,
        email: email, 
      }, { withCredentials: true });

      console.log('Registration success:', response);
      alert('User Registration Successfully');
      setUsername('');
      setPassword('');
      setEmail(''); 
      setErrorMessage(''); 
    } catch (err) {
      console.error('Registration error:', err.response ? err.response : err.message);

      if (err.response) {
        if (err.response.status === 409) {
          setErrorMessage(err.response.data.message || 'Username or email already exists');
        } else {
          setErrorMessage('User Registration Failed');
        }
      } else {
        setErrorMessage('User Registration Failed');
      }
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h3>Register</h3>
            </div>
            <div className="card-body">
              <form onSubmit={save}>
                <div className="form-group mb-3">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>

                {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
