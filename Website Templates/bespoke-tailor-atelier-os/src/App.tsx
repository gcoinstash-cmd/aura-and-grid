import { Routes, Route, Navigate } from 'react-router-dom'
import AtelierShowcase from './pages/AtelierShowcase'
import AdminLogin from './pages/AdminLogin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AtelierShowcase />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
