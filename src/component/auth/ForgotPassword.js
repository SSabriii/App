import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await axios.post('http://localhost:8080/auth/password-reset-request', { email });
      setMessage('Password reset link has been sent to your email.');
      setErrorMessage('');
      navigate('/reset-password'); 
    } catch (err) {
      console.error('Password reset error:', err.response ? err.response : err.message);
      setMessage('');
      setErrorMessage('Failed to send password reset link. Please try again.');
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h3>Forgot Password</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                {message && <div className="alert alert-success mt-3">{message}</div>}
                {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Send Reset Link
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
