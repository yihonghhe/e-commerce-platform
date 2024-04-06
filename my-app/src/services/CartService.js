
const getAuthToken = () => localStorage.getItem('userToken');

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
    return data.carts; 
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
};
