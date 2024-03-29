// src/UserInfo.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const userName = localStorage.getItem('userName');

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({});
  const userId = localStorage.getItem('userId'); // Assuming you store userId upon login

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`https://dummyjson.com/users/${userId}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  if (!userId) {
    return <div>Please log in.</div>;
  }

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Innocaption E-Commerce</Link>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
                <Link className="nav-link" to="/products">Products</Link>
            </li>
        </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/user">Hello, {userName}</Link>
            </li>
            </ul>
        <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                <i className="fa fa-shopping-cart">Cart</i>
              </Link>
            </li>
          </ul>
        </div>
      </div>
  </nav>
    
    <div className="container mt-5">
      <h2>User Info</h2>
      <p><strong>First Name:</strong> {userInfo.firstName}</p>
      <p><strong>Last Name:</strong> {userInfo.lastName}</p>
      <p><strong>Email:</strong> {userInfo.email}</p>
      <p><strong>Phone:</strong> {userInfo.phone}</p>
      <p><strong>Gender:</strong> {userInfo.gender}</p>
      <p><strong>Age:</strong> {userInfo.age}</p>
      <p><strong>Birthday:</strong> {userInfo.birthDate}</p>
      <img src={userInfo.image} alt="User" style={{ maxWidth: '100px', borderRadius: '50%' }} />

      {/* Add more user info fields as needed */}
    </div>
    </>
  );
};

export default UserInfo;
