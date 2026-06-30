import { Route, Routes } from 'react-router'
import Login from './pages/auth/Login'
import AuthLayout from './pages/auth/AuthLayout'

function App() {
  return (
    <Routes>
      <Route path='/auth' element={<AuthLayout />}>
        <Route path='login' element={<Login />} />
        {/* <Route path="register" element={<Register />} /> */}
      </Route>
      <Route path='/' element={<div>Hello</div>} />

      {/* <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="incidents" element={<Incidents />} />
        <Route path="team" element={<Team />} />
        <Route path="settings" element={<Settings />} />
      </Route> */}
    </Routes>
  )
}

export default App
