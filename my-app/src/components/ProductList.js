// src/ProductList.js
import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/Product'; // Ensure this path is correct
import { Link } from 'react-router-dom';
const userName = localStorage.getItem('userName');
const addToCart = (product) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let found = cart.find(item => item.id === product.id);
  if (found) {
    found.quantity += 1; // If the product is already in the cart, increase its quantity
  } else {
    cart.push({...product, quantity: 1}); // Otherwise, add the product with quantity 1
  }
  localStorage.setItem('cart', JSON.stringify(cart)); // Update the cart in localStorage
};
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userName, setUserName] = useState(localStorage.getItem('userName')); // State to hold the username

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      // Extract categories from products
      const uniqueCategories = Array.from(new Set(data.map(product => product.category)));
      setCategories(['All', ...uniqueCategories]);
    });
  }, []);

  useEffect(() => {
    // This effect runs when the component mounts and listens for 'userNameUpdated' events
    const handleUserNameUpdate = () => {
      setUserName(localStorage.getItem('userName')); // Update userName state when the event is received
    };

    window.addEventListener('userNameUpdated', handleUserNameUpdate);

    return () => {
      window.removeEventListener('userNameUpdated', handleUserNameUpdate);
    };
  }, []);

  // const filteredProducts = selectedCategory === 'All' ? products : products.filter(product => product.category === selectedCategory);

  const filteredProducts = products.filter(product => {
    return (selectedCategory === 'All' || product.category === selectedCategory) &&
      (product.title.toLowerCase().includes(searchTerm.toLowerCase()) || product.category.toLowerCase().includes(searchTerm.toLowerCase()));
  });


  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Innocaption E-Commerce</Link>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">

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
        <nav className="navbar navbar-expand-lg navbar-light bg-blue">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {categories.map(category => (
                <li className="nav-item" key={category}>
                  <button className="nav-link btn btn-link" onClick={() => setSelectedCategory(category)}>{category}</button>
                </li>
              ))}
          </ul> 
        <form className="d-flex" role="search">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
      </form>
        </nav>
      <div className="container mt-5">
        <h2 className="mb-4">Our Products</h2>
        <div className="row">
          {filteredProducts.map(product => (
            <div key={product.id} className="col-sm-12 col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <img src={product.thumbnail} className="card-img-top" alt={product.title} />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">${product.price}</span>
                    <button className="btn btn-primary" onClick={() => addToCart(product)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductList;
