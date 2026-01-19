import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const auth = useSelector((state) => state.auth);

  // ⛔ If redux state is not ready
  if (!auth) {
    return <Navigate to="/" replace />;
  }

  const isAuthenticated = auth.isAuthenticated;

  // ⛔ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in
  return <Outlet />;
};

export default ProtectedRoute;
