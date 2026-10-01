import { Routes, Route, Navigate } from 'react-router-dom'
import RampConsole from './pages/RampConsole'
import AdminLogin from './pages/AdminLogin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RampConsole />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
