import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 

const ProtectedRoute = ({ allowedRoles }) => {
  // const { user, refreshAccessToken } = useContext(AuthContext);
  // const [isAuthenticated, setIsAuthenticated] = useState(null);
  const { user, requiresPasswordReset } = useContext(AuthContext);

  // useEffect(() => {
  //   const checkToken = async () => {
  //     try {
  //       if (!user) {
  //         // Only refresh the token if no user is already set
  //         const newAccessToken = await refreshAccessToken();
  //         if (newAccessToken) {
  //           setIsAuthenticated(true);
  //         } else {
  //           setIsAuthenticated(false);
  //         }
  //       } else {
  //         setIsAuthenticated(true);
  //       }
  //     } catch {
  //       setIsAuthenticated(false);
  //     }
  //   };
  //   checkToken();
  // }, [user, refreshAccessToken]); // Include dependencies to avoid unnecessary calls

  // if (isAuthenticated === null) return <div>Loading...</div>;

  // Redirect to home if the user does not exist or does not have the correct role
  if (!user || !allowedRoles.includes(user.role)) return <Navigate to="/home" replace />;
  if (requiresPasswordReset) return <Navigate to="/reset-password" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
