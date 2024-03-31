// src/components/Navbar.js or wherever your navbar component is located
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchCartByUserId } from '../services/CartService';
// Assume you have a function to get the auth token from localStorage or another storage solution
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

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const initUserAndCart = async () => {
      const userData = await fetchCurrentUser();
      if (userData) {
        setCurrentUser(userData); // Set user data first
  
        // Now fetch cart data for the user
        const cartData = await fetchCartByUserId(userData.id);
        if (cartData && cartData.length > 0) {
          // Assuming each user has a single cart, adjust as needed
          const cart = cartData[0]; // Taking the first cart for simplicity
          setCartCount(cart.totalProducts); // Set count based on products in the cart
        }
  
        // Calculate and set cart count from local storage after currentUser is set
        const cartTotalCountKey = `cartTotalCount_${userData.id}`;
        const count = parseInt(localStorage.getItem(cartTotalCountKey), 10) || 0;
        setCartCount(count);
      }
    };

    initUserAndCart();
    const handleCartUpdate = (event) => {
        setCartCount(event.detail.totalCount);
    };

    // Add the event listener
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Remove the event listener on component unmount
    return () => {
        window.removeEventListener('cartUpdated', handleCartUpdate);
    };

  }, []);

  const goToCart = () => {
    navigate('/cart');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        
        <Link className="navbar-brand" to="/">Innocaption E-Commerce</Link>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/user">Hello, {currentUser ? currentUser.username : 'Guest'}</Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/products">Products</Link>
            </li>
          </ul>
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
                <button className="btn btn-outline-dark" type="button" onClick={goToCart}> {/* Changed type from submit to button */}
                    <i className="bi-cart-fill me-1"></i>
                    Cart
                    <span className="badge bg-dark text-white ms-1 rounded-pill">{cartCount}</span>
                </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;