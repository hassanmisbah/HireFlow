import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");

  // Login nahi hai
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Agar specific role required hai
  if (role) {
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      if (payload.role !== role) {
        return <Navigate to="/" replace />;
      }
    } catch (error) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;