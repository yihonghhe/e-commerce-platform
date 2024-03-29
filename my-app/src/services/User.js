import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data.users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};