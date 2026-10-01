import { Routes, Route, Navigate } from 'react-router-dom'
import DebtEstimator from './pages/DebtEstimator'
import AdminLogin from './pages/AdminLogin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DebtEstimator />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
