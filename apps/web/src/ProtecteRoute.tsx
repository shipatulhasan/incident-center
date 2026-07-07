import { Navigate, Outlet, useLocation } from "react-router";
import AppLoader from "./components/ui/app-loader";
import { useAuth } from "./context/AuthContext";


function ProtectedRoute() {
  const { user, loading } = useAuth();

  const location = useLocation();
  console.log(user,loading)


  if (loading) {
    return <AppLoader />;
  }


  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{
          from: location.pathname
        }}
      />
    );
  }


  return <Outlet />;
}
export default ProtectedRoute