import { createBrowserRouter } from "react-router";
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLaout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashborad/Dashboard';
import IncidentDetails from './pages/IncidentDetails/Incidentdetails';
import Team from './pages/Teams/Team';
import ProtectedRoute from './ProtecteRoute';

export const router = createBrowserRouter([

  /**
   * Auth routes
   */
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },


  /**
   * Protected routes
   */
  {
    element: <ProtectedRoute />,

    children: [

      {
        element: <DashboardLayout />,

        children: [

          {
            index: true,
            element: <Dashboard />,
          },


          {
            path: "incidents/:id",
            element: <IncidentDetails />,
          },


          {
            path: "team",
            element: <Team />,
          },

        ],

      },

    ],

  },

]);