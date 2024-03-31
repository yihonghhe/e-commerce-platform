// src/services/CartService.js

// Function to get the auth token
const getAuthToken = () => localStorage.getItem('userToken');

// Fetch cart by user ID
export const fetchCartByUserId = async (userId) => {
  const token = getAuthToken();
  if (!token) {
    console.error('No auth token found');
    return null;
  }

  try {
    const response = await fetch(`https://dummyjson.com/carts/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    const data = await response.json();
    return data.carts; // Assuming the API returns an object with a carts array
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
};
