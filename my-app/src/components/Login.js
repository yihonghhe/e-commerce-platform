// src/Login.js
import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../services/User'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';
import './Login.css';
const Login = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem('userName', user.username);
    localStorage.setItem('userId', user.id); // Make sure the user object has an 'id' field
    window.dispatchEvent(new Event('userNameUpdated'));
    navigate('/products');
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="login-box">
        <h2 className="text-center mb-4">Sign In</h2>
        <div className="list-group scrollable-list">
          {users.map(user => (
            <button key={user.id} className="list-group-item list-group-item-action" onClick={() => handleLogin(user)}>
              {user.username}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
