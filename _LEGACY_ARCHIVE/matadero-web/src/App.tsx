import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import BasculaPage from './pages/BasculaPage'
import BeneficioPage from './pages/BeneficioPage'
import DespostePage from './pages/DespostePage'
import AcondicionamientoPage from './pages/AcondicionamientoPage'
import DespachoPage from './pages/DespachoPage'
import ReportesPage from './pages/ReportesPage'
import ConfiguracionPage from './pages/ConfiguracionPage'
import BasculaEnPiePage from './pages/BasculaEnPiePage'
import { useAuthStore } from './store/authStore'


function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {isAuthenticated ? (
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/bascula" element={<BasculaPage />} />
            <Route path="/bascula-pie" element={<BasculaEnPiePage />} />
            <Route path="/beneficio" element={<BeneficioPage />} />
            <Route path="/desposte" element={<DespostePage />} />
            <Route path="/acondicionamiento" element={<AcondicionamientoPage />} />
            <Route path="/despacho" element={<DespachoPage />} />
            <Route path="/reportes" element={<ReportesPage />} />
            <Route path="/configuracion" element={<ConfiguracionPage />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  )
}

export default App
