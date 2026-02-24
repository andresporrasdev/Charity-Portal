import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext, ROLES } from "../UserContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  if (user === null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user.roles.includes(ROLES.ADMIN)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
