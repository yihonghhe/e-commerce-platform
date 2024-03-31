// src/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProducts, fetchProductById } from '../services/Product';
import './ProductDetail.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const userName = localStorage.getItem('userName');
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

const ProductDetail = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const addToCart = async (productToAdd) => {
    
    const token = localStorage.getItem('userToken'); // Assuming you store the token here
    const cartKey = `cart_${currentUser.id}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    let found = cart.find(item => item.id === productToAdd.id);
    
    if (found) {
      found.quantity += 1; // If the product is already in the cart, increase its quantity
    } else {
      cart.push({...productToAdd, quantity: 1}); // Otherwise, add the product with quantity 1
    }
  
    // Update the cart in local storage
    localStorage.setItem(cartKey, JSON.stringify(cart));
    const userId = currentUser.id
    // Additionally, update the cart on the server
    try {
      const response = await fetch(`https://dummyjson.com/carts/user/${userId}`, {
        method: 'PUT', // The method might be different based on the API
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token if required
        },
        body: JSON.stringify({ userId, products: cart }), // Adjust based on the API's expected format
      });
  
      if (!response.ok) throw new Error('Failed to update cart on server');
  
      const updatedCart = await response.json();
      console.log('Cart updated on server:', updatedCart);
  
      // Optionally, refresh local cart data with server response if needed
      // localStorage.setItem('cart', JSON.stringify(updatedCart.products || []));
  
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  
    navigate('/cart'); // Navigate to the cart page after updating
  };
  const nextImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % product.images.length); // Loop back to the first image
  };

  const prevImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex - 1 + product.images.length) % product.images.length); // Loop back to the last image
  };
  useEffect(() => {
    
    const initUser = async () => {
      
      const userData = await fetchCurrentUser();
      if (userData) {
        setCurrentUser(userData); // Assuming the response contains user data directly
      }
    };

    initUser();
    
    fetchProductById(productId).then(productData => {
      setProduct(productData);
      window.scrollTo(0, 0);
      // Once the product is fetched, fetch related products from the same category
      fetchProducts().then(allProducts => {
        const related = allProducts.filter(p => p.category === productData.category && p.id !== productData.id);
        setRelatedProducts(related);
      });
    });
  }, [productId]);
  if (!product) return <div>Loading...</div>;
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const formattedPrice = discountedPrice.toFixed(2); 
  return (
    <>
      <Navbar />
  <section className="py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">
            <div className="col-md-6">
              {product.images && product.images.length > 0 && (
                  <img className="card-img-top mb-5 mb-md-0" src={product.images[currentImageIndex]} alt={`Product Image ${currentImageIndex + 1}`} />
                )}
              <div className="mt-2">
                <button className="btn btn-outline-dark flex-shrink-0" type="button" onClick={prevImage}>Previous</button>
                <button className="btn btn-outline-dark flex-shrink-0" type="button" onClick={nextImage} style={{ marginLeft: '10px' }}>Next</button>
              </div>
            </div>
            <div className="col-md-6">
              <h1 className="display-5 fw-bolder">{product.title}</h1>
              <div className="fs-5 mb-5">
                {product.discountPercentage > 0 && (
                  <span className="text-decoration-line-through">${product.price.toFixed(2)}</span>
                )}
                <span>${formattedPrice}</span>
              </div>
              <p className="lead">{product.description}</p>
              <div className="d-flex">
                <input className="form-control text-center me-3" id="inputQuantity" type="number" value="1" style={{ maxWidth: '3rem' }} />
                <button className="btn btn-outline-dark flex-shrink-0" type="button" onClick={() => addToCart(product)}>
                  <i className="bi-cart-fill me-1"></i>
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5 bg-light">
        <div className="container px-4 px-lg-5 mt-5">
          <h2 className="fw-bolder mb-4">Related Products</h2>
          <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
            {relatedProducts.map((item) => (
              <div key={item.id} className="col mb-5">
                <div className="card h-100">
                  {/* Product thumbnail */}
                  <Link to={`/product/${item.id}`}>
                    <img className="card-img-top" src={item.thumbnail} alt={item.title} />
                  </Link>
                  {/* Product details */}
                  <div className="card-body p-4">
                    <div className="text-center">
                      {/* Product name */}
                      <h5 className="fw-bolder">{item.title}</h5>
                      {/* Product price */}
                      {item.discountPercentage > 0 ? (
                        <>
                          <span className="text-muted text-decoration-line-through">${item.price.toFixed(2)}</span>
                          <span> ${item.price * (1 - item.discountPercentage / 100).toFixed(2)}</span>
                        </>
                      ) : (
                        <span>${item.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  {/* Product actions */}
                  <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div className="text-center"><Link to={`/product/${item.id}`} className="btn btn-outline-dark mt-auto">View Details</Link></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 bg-dark">
        <div className="container"><p className="m-0 text-center text-white">Copyright &copy; Yihong He 2024</p></div>
      </footer>
    </>
  );
};

export default ProductDetail;
