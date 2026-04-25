import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './login.css'


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'team@vidyamai.com' && password === 'Akash@Vidyamai@1994_1992') {
      localStorage.setItem("email", email);
      
      navigate('/magic');
      window.location.reload();
      
      // navigate(0);
      // window.location.reload();
    } else if (email === 'sales@vidyamai.com' && password === 'Akash@Vidyamai@1994_1992') {
      localStorage.setItem("email", email);
      
      navigate('/sales-magic-chat');
      window.location.reload();
      // navigate(0);
    } else {
      alert('Invalid email or password.');
    }
  };

  return (
    <>
    <div className="login-container">
     
      <div className="row justify-content-center">
       
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Login</h2>
              {/* <img src="/images/Group 234.png" alt="Logo" width="300" height="50" /> */}
              <div className="form-group">
                <label >Email:</label>
                <input
                  type="text"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className='login-btn'>
              <button 
                className=" buttonFlat loginBtn"
                onClick={handleLogin}
              >
                Login
              </button>
              </div>
              {/* <div className="mt-3 text-center">
                <div>Don't have an account?<span><a href="/register" className="text-info">Register </a></span></div>
              </div>
              <div className="mt-1 text-center">
                <a href="/forgot-password" className="text-info">Forgot password?</a>
              </div> */}
            </div>
          </div>
       
      </div>
    </div>
    </>
  );
}

export default Login;
