import { Navigate, Outlet } from "react-router";
import { useAuth } from "./context/AuthContext";
import AppLoader from "./components/ui/app-loader";


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