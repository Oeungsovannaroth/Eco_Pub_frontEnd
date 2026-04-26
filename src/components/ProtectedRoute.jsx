import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user || (user.role !== "admin" && user.role !== "staff")) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;