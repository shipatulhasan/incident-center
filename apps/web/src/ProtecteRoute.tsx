import { Navigate, Outlet } from "react-router";
import AppLoader from "./components/ui/app-loader";
import { useAuth } from "./context/AuthContext";


function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <AppLoader />;
  }

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" replace />
  );
}
export default ProtectedRoute