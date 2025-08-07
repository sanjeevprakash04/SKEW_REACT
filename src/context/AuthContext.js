import { createContext, useState, useEffect/*, useCallback */} from "react";
import { fetchUserData } from "../api/authUser";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  // const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
  const [requiresPasswordReset, setRequiresPasswordReset] = useState(false);
  const [resetToken, setResetToken] = useState(null);

  // Set Authorization header globally when accessToken changes
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  // Refresh Access Token (Optimized)
  // const refreshAccessToken = useCallback(async () => {
  //   const storedRefreshToken = localStorage.getItem("refreshToken"); // Get from storage

  //   if (!storedRefreshToken) {
  //       // console.warn("No refresh token found. User needs to log in.");
  //       logoutUser();
  //       return null;
  //   }

  //   try {
  //       // Send request to refresh token
  //       const response = await axios.post(
  //           "http://127.0.0.1:8000/refresh",
  //           { refresh_token: storedRefreshToken },
  //           { headers: { "Content-Type": "application/json" } }
  //       );

  //       const newAccessToken = response.data.access_token;

  //       // Store new access token
  //       setAccessToken(newAccessToken);
  //       localStorage.setItem("accessToken", newAccessToken);
  //       axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

  //       return newAccessToken;
  //   } catch (error) {
  //       // console.error("Token refresh failed. Logging out:", error);

  //       // Logout only if the error is 401 (Unauthorized)
  //       if (error.response && error.response.status === 401) {
  //           logoutUser();
  //       }
  //       return null;
  //   }
  // }, []); // Removed dependency on `refreshToken` to avoid re-renders

  // Auto-refresh token every 14 minutes
  // useEffect(() => {
  //     const refreshInterval = setInterval(() => {
  //         refreshAccessToken();
  //     }, 14 * 60 * 1000); // Refresh every 14 minutes

  //     return () => clearInterval(refreshInterval); // Cleanup on unmount
  // }, [refreshAccessToken]);

  // Axios interceptor to refresh token automatically
  // useEffect(() => {
  //   const interceptor = axios.interceptors.response.use(
  //       (response) => response,
  //       async (error) => {
  //           if (error.response && error.response.status === 401) {
  //               // console.warn("Access token expired. Attempting refresh...");
  //               const newToken = await refreshAccessToken();

  //               if (newToken) {
  //                   error.config.headers["Authorization"] = `Bearer ${newToken}`;
  //                   return axios(error.config);
  //               } else {
  //                   return Promise.reject(error);
  //               }
  //           }
  //           return Promise.reject(error);
  //       }
  //   );

  //   return () => axios.interceptors.response.eject(interceptor);
  // }, [refreshAccessToken]);

  // Fetch user data when accessToken changes
  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      return;
    }
    try {
      const decoded = jwtDecode(accessToken);
      fetchUserData(accessToken)
        .then((data) => {
          setUser({
            email: decoded.sub,
            role: Number(data.role_id),
          });
        })
        .catch(() => {
          // console.warn("Failed to fetch user data. Logging out...");
          logoutUser();
        });
    } catch (error) {
      // console.error("Invalid token, logging out:", error);
      logoutUser();
    }
  }, [accessToken]);

  // Login Function
  const loginUser = async (email, password) => {
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await axios.post('http://127.0.0.1:8000/login', 
          formData,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      setAccessToken(response.data.access_token);
      // setRefreshToken(response.data.refresh_token);

      localStorage.setItem('accessToken', response.data.access_token);
      // localStorage.setItem('refreshToken', response.data.refresh_token);

      setRequiresPasswordReset(response.data.requires_password_reset);
      setResetToken(response.data.reset_token || null);
      setUser(response.data.user);
    } catch (error) {
        throw new Error("Invalid credentials");
    }
  };

  // Logout Function
  const logoutUser = () => {
    setUser(null);
    setAccessToken(null);
    // setRefreshToken(null);
    localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginUser, logoutUser, accessToken,/* refreshAccessToken, refreshToken,*/ resetToken, requiresPasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
};
