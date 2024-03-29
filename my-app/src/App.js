// src/App.js
import React from 'react';
import './App.css';
import ProductList from './components/ProductList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import UserInfo from './components/UserInfo';
import Cart from './components/Cart';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/user" element={<UserInfo />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
