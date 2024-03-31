import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './UserInfo.css'
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
const UserInfo = () => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const initUser = async () => {
      const userData = await fetchCurrentUser();
      if (userData) {
        setCurrentUser(userData); // Set user data first
  
      }
    };
  
    initUser();
  }, []); 
  if (!currentUser) {
    return <div>Loading user information...</div>;
}
  

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="main-body">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="main-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="javascript:void(0)">User</a></li>
              <li className="breadcrumb-item active" aria-current="page">User Profile</li>
            </ol>
          </nav>
          {/* /Breadcrumb */}
    
          <div className="row gutters-sm">
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    <img src={currentUser.image || "https://bootdey.com/img/Content/avatar/avatar7.png"} alt="Admin" className="rounded-circle" width="150" />
                    <div className="mt-3">
                      <h4>{currentUser.firstName} {currentUser.lastName}</h4>
                      {/* Assuming role and location aren't directly available, use placeholders or add them to your user model if possible */}
                      <p className="text-secondary mb-1">{currentUser.email}</p>
                      <p className="text-muted font-size-sm">{currentUser.address.address},{currentUser.address.city},{currentUser.address.state}</p>
                      {/* Buttons can be functional or decorative based on your application's needs */}
                      <button className="btn btn-primary">Follow</button>
                      <button className="btn btn-outline-primary">Message</button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Social Links or additional information can be added here */}
            </div>
            <div className="col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  {/* User details here */}
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Full Name</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {currentUser.firstName} {currentUser.lastName}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Birth Date</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {currentUser.birthDate}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Age</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {currentUser.age}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Gender</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {currentUser.gender}
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserInfo;
