import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/Product';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './ProductList.css';
const userName = localStorage.getItem('userName');

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userName, setUserName] = useState(localStorage.getItem('userName')); 

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      const uniqueCategories = Array.from(new Set(data.map(product => product.category)));
      setCategories(['All', ...uniqueCategories]);
    });
  }, []);

  useEffect(() => {
    const handleUserNameUpdate = () => {
      setUserName(localStorage.getItem('userName')); 
    };

    window.addEventListener('userNameUpdated', handleUserNameUpdate);

    return () => {
      window.removeEventListener('userNameUpdated', handleUserNameUpdate);
    };
  }, []);



  const filteredProducts = products.filter(product => {
    return (selectedCategory === 'All' || product.category === selectedCategory) &&
      (product.title.toLowerCase().includes(searchTerm.toLowerCase()) || product.category.toLowerCase().includes(searchTerm.toLowerCase()));
  });


  return (
    <>
      <Navbar />
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
              <Link to={`/product/${product.id}`}>
                <div className="card h-100">
                  <div className="image-container">
                    <img src={product.thumbnail} alt={product.title} className="card-img-top img-fluid" />
                  </div>
                
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="discount-info">
                  {product.discountPercentage}% Off
                </div>
                <span className="limited-sale">Limited Time Sale</span>
                   
                  </div>
                </div>
                
              </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductList;
