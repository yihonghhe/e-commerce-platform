// src/Login.js
import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../services/User'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';
import './Login.css';
const getAuthToken = () => localStorage.getItem('userToken');

const fetchCurrentUser = async () => {
  const token = getAuthToken();
  if (!token) {
    console.log('No auth token found');
    return null;
  }
  
  try {
    const response = await fetch('https://dummyjson.com/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Adjust according to how the API expects the token
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return null;
  }
};
const Login = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchUsers().then(setUsers);
    }, []);
  
    const authenticateUser = async (username, password) => {
      try {
        const response = await fetch('https://dummyjson.com/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('userToken', data.token); // Save the auth token
          localStorage.setItem('userName', username); // Save the username for UI purposes
          navigate('/products'); // Navigate to the products page or dashboard
        } else {
          // Handle failed login
          alert('Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        alert('An error occurred during login. Please try again later.');
      }
    };
  
    const handleLogin = (user) => {
      authenticateUser(user.username, user.password); // Use user's username and password
    };
  
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="login-box">
          <h2 className="text-center mb-4">Sign In</h2>
          <div className="list-group scrollable-list">
            {users.map(user => (
              <button key={user.id} className="list-group-item list-group-item-action" onClick={() => handleLogin(user)}>
                {user.username} {/* Displaying the username */}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default Login;;