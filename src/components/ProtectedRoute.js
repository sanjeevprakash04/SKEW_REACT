import /*React,*/ { useContext, useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 

const ProtectedRoute = ({ allowedRoles }) => {
  // const { user, refreshAccessToken } = useContext(AuthContext);
  // eslint-disable-next-line
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const { user, requiresPasswordReset, accessToken } = useContext(AuthContext);

  useEffect(() => {
    const checkToken = async () => {
      try {
        if (!user) {
          // Only refresh the token if no user is already set
          const newAccessToken = await accessToken();
          if (newAccessToken) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(true);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkToken();
  }, [user, accessToken]); // Include dependencies to avoid unnecessary calls

  // if (isAuthenticated === null) return <div>Loading...</div>;

  // Redirect to home if the user does not exist or does not have the correct role
  if (!user || !allowedRoles.includes(user.role)) return <Navigate to="/home" replace />;
  if (requiresPasswordReset) return <Navigate to="/reset-password" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
