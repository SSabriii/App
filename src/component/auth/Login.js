import axios from 'axios'; 
import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true); 
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        username: username,
        password: password,
      }, { withCredentials: true });

      console.log('Login success:', response);
      alert('Login Successful');

      
      const userSuffix = username.split('@')[1] || ''; 
      localStorage.setItem('userSuffix', userSuffix);

      
      onLogin(userSuffix);

      
      navigate('/');
    } catch (err) {
      console.error('Login error:', err.response ? err.response : err.message);

      if (err.response) {
        if (err.response.status === 401) {
          setErrorMessage(err.response.data.message || 'Invalid username or password');
        } else {
          setErrorMessage('Login Failed');
        }
      } else {
        setErrorMessage('Login Failed');
      }
    } finally {
      setLoading(false); 
    }
  }

  
  function handleForgotPassword() {
    navigate('/forgot-password'); 
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h3>Login</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
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

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3"
                  disabled={loading} 
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>

                <button
                  type="button"
                  className="btn btn-link w-100 mt-2"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
