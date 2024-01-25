import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const isAuthenticated = sessionStorage.getItem('token') !== null;
  const location = useLocation();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}