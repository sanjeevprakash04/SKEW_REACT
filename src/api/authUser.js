import axios from "axios";
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const API_URL = "http://127.0.0.1:8000";

export const fetchUserData = async (token) => {
  try {
      const response = await axios.get(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
  } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error;
  }
};

const useAuthUser = () => {
  const { accessToken, logoutUser } = useContext(AuthContext);

  const apiCall = async (url, method = 'GET', data = null) => {
      try {
          const headers = { Authorization: `Bearer ${accessToken}` };
          const response = await axios({ method, url, data, headers });
          return response.data;
      } catch (error) {
          if (error.response?.status === 401) {
              logoutUser();
          }
          throw error;
      }
  };

  return { apiCall };
};

export default useAuthUser;
