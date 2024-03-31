// src/Cart.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './Cart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { fetchCartByUserId } from '../services/CartService';
const getAuthToken = () => localStorage.getItem('userToken');
// const userName = localStorage.getItem('userName');
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
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadCartData = async () => {
      const userData = await fetchCurrentUser();
      if (userData) {
        setCurrentUser(userData);
        const cartKey = `cart_${userData.id}`;
            
        const apiCartItems = await fetchCartByUserId(userData.id).then(apiCart => apiCart[0]?.products || []);
        // Assume localCart stores items by id for simplicity
        const localCart = JSON.parse(localStorage.getItem(cartKey)) || [];
  
        // Merge logic: If an item exists in both apiCartItems and localCart, increment its quantity based on localCart
        const mergedCart = apiCartItems.map(apiItem => {
          if (localCart[apiItem.id]) {
            // Combine quantities from API and local additions
            return { ...apiItem, quantity: apiItem.quantity + localCart[apiItem.id].quantity };
          }
          return apiItem;
        });
  
        // Add new local items not present in API cart
        Object.values(localCart).forEach(localItem => {
          if (!mergedCart.find(item => item.id === localItem.id)) {
            mergedCart.push(localItem);
          }
        });
  
        setCartItems(mergedCart);
      }
    };
  
    loadCartData();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0);
  
    setCartItems(updatedItems);
    // Update localStorage to reflect changes
    updateLocalStorageWithCart(updatedItems);
  };
  
  const removeItem = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    // Update localStorage to reflect changes
    updateLocalStorageWithCart(updatedItems);
  };
  
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = item.price * (1 - item.discountPercentage / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };
  const updateLocalStorageWithCart = (currentItems) => {
    const cartKey = `cart_${currentUser.id}`;
    const cartTotalCountKey = `cartTotalCount_${currentUser.id}`;
    localStorage.setItem(cartKey, JSON.stringify(currentItems));
    const totalCount = currentItems.reduce((acc, item) => acc + item.quantity, 0);
    localStorage.setItem(cartTotalCountKey, totalCount.toString());
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { totalCount } }));
};
  return (
    
    <>
    
    <Navbar />
    <section className="h-100 h-custom" style={{ backgroundColor: '#d2c9ff' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12">
            <div className="card card-registration card-registration-2" style={{ borderRadius: '15px' }}>
              <div className="card-body p-0">
                <div className="row g-0">
                  <div className="col-lg-8">
                    <div className="p-5">
                      <div className="d-flex justify-content-between align-items-center mb-5">
                        <h1 className="fw-bold mb-0 text-black">{currentUser ? currentUser.username : 'Guest'}'s Shopping Cart</h1>
                        <h6 className="mb-0 text-muted">{cartItems.length} products</h6>
                      </div>
                      <ul className="list-group">
                      {cartItems.map((item) => (
                        <li key={item.id} className="list-group-item">
                          <div className="row mb-4 d-flex justify-content-between align-items-center">
                            <div className="col-md-2 col-lg-2 col-xl-2">
                              <img src={item.thumbnail} className="img-fluid rounded-3" alt={item.title} />
                            </div>
                            <div className="col-md-3 col-lg-3 col-xl-3">
                              <h6 className="text-black mb-0">{item.title}</h6>
                            </div>
                            <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                              <button className="btn btn-link px-2" onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 0))}>
                                <FontAwesomeIcon icon={faMinus} />
                              </button>

                              <input min="0" name="quantity" value={item.quantity} type="number" className="custom-control custom-paddin " readOnly />

                              <button className="btn btn-link px-2" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <FontAwesomeIcon icon={faPlus} />
                              </button>
                            </div>
                            <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                              <h6 className="mb-0">$ {(item.price * (1 - item.discountPercentage / 100)).toFixed(2)}</h6>
                            </div>
                            <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                              <button className="text-muted" onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none' }}>
                              <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                      <div className="pt-5">
                        <h6 className="mb-0"><a href="/products" className="text-body"><i className="fas fa-long-arrow-alt-left me-2"></i>Back to shop</a></h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 bg-grey">
                    <div className="p-5">
                      <h3 className="fw-bold mb-5 mt-2 pt-1">Summary</h3>
                      <hr className="my-4" />

                      {/* Items Count and Total Price */}
                      <div className="d-flex justify-content-between mb-4">
                        <h5 className="text-uppercase">items {cartItems.length}</h5>
                        <h5>$ {getTotalPrice().toFixed(2)}</h5>
                      </div>

                      <h5 className="text-uppercase mb-3">Shipping</h5>
                      <div className="mb-4 pb-2">
                        <select className="select">
                          <option value="1">Standard-Delivery- $5.00</option>
                          {/* Additional shipping options here */}
                        </select>
                      </div>

                      <h5 className="text-uppercase mb-3">Give code</h5>
                      <div className="mb-5">
                        <div className="form-outline">
                          <input type="text" id="form3Examplea2" className="form-control form-control-lg" />
                          <label className="form-label" htmlFor="form3Examplea2">Enter your code</label>
                        </div>
                      </div>

                      <hr className="my-4" />

                      {/* Total Price Including Shipping */}
                      <div className="d-flex justify-content-between mb-5">
                        <h5 className="text-uppercase">Total price</h5>
                        {/* Assuming standard delivery is the only option and always selected */}
                        <h5>$ {(getTotalPrice() + 5).toFixed(2)}</h5>
                      </div>

                      <button type="button" className="btn btn-dark btn-block btn-lg" data-mdb-ripple-color="dark">Go to Checkout</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Cart;
