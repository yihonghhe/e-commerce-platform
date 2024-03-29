// src/Cart.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const userName = localStorage.getItem('userName');
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart items from localStorage on component mount
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, []);

  const updateQuantity = (id, quantity) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: quantity };
      }
      return item;
    }).filter(item => item.quantity > 0); // Remove items with 0 quantity

    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  const removeItem = (id) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

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
          <li className="nav-item">
            <Link className="nav-link" to="/cart">
              <i className="fa fa-shopping-cart"></i> Cart
            </Link>
          </li>
        </ul>
      </div>
    </div>
    </nav>
   

    <div className="container mt-5">
      <h2>Your Cart</h2>
      {cartItems.length > 0 ? (
        <ul className="list-group">
          {cartItems.map(item => (
            <li key={item.id} className="list-group-item">
              {item.title} - ${item.price} x {item.quantity}
              <div>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      ) : <p>Your cart is empty.</p>}
      <h4>Total Price: ${getTotalPrice().toFixed(2)}</h4>
    </div>
    </>
  );
};

export default Cart;
