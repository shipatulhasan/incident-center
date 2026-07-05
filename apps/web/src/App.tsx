import { Route, Routes } from 'react-router'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLaout'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashborad/Dashboard'
import ProtectedRoute from './ProtecteRoute'

function App() {
  return (
    <Routes>
      <Route path='/auth' element={<AuthLayout />}>
        <Route path='login' element={<Login />} />
        {/* <Route path="register" element={<Register />} /> */}
      </Route>

      <Route element={<ProtectedRoute />}>

      <Route element={<DashboardLayout />}>
      
        <Route index element={<Dashboard />} />
        {/* <Route path="incidents" element={<Incidents />} />
        <Route path="team" element={<Team />} />
        <Route path="settings" element={<Settings />} /> */}
      </Route>
      </Route>

    </Routes>
  )
}

export default App
