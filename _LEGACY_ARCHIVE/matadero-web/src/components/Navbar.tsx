import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/':                 { title: 'Dashboard',         subtitle: 'Resumen general de operaciones' },
  '/bascula':          { title: 'Báscula',            subtitle: 'Control de pesaje de animales' },
  '/faena':            { title: 'Faena',              subtitle: 'Gestión del proceso de faenamiento' },
  '/desposte':         { title: 'Desposte',           subtitle: 'Control de cortes y rendimiento' },
  '/acondicionamiento':{ title: 'Acondicionamiento',  subtitle: 'Preparación y control de calidad' },
  '/despacho':         { title: 'Despacho',           subtitle: 'Gestión de salidas y entregas' },
  '/reportes':         { title: 'Reportes',           subtitle: 'Análisis y estadísticas del sistema' },
  '/configuracion':    { title: 'Configuración',      subtitle: 'Ajustes del sistema' },
}

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [now, setNow] = useState(new Date())
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const pageInfo = PAGE_TITLES[location.pathname] ?? { title: 'Santacruz', subtitle: '' }

  const formatDate = (d: Date) =>
    d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header
      className="shrink-0 flex items-center justify-between px-6 lg:px-8"
      style={{
        height: '64px',
        background: '#ffffff',
        borderBottom: '1px solid #f1f5f9',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.04)',
      }}
    >
      {/* Título de página */}
      <div className="flex flex-col justify-center">
        <h1
          className="font-bold leading-tight"
          style={{ fontSize: '16px', color: '#0f172a', letterSpacing: '-0.01em' }}
        >
          {pageInfo.title}
        </h1>
        {pageInfo.subtitle && (
          <p className="text-xs" style={{ color: '#94a3b8', marginTop: '1px' }}>
            {pageInfo.subtitle}
          </p>
        )}
      </div>

      {/* Derecha: fecha + usuario */}
      <div className="flex items-center gap-4">

        {/* Fecha y hora */}
        <div className="hidden md:flex flex-col items-end" style={{ lineHeight: 1.3 }}>
          <span className="text-xs font-semibold" style={{ color: '#0f172a' }}>
            {formatTime(now)}
          </span>
          <span className="text-xs capitalize" style={{ color: '#94a3b8' }}>
            {formatDate(now)}
          </span>
        </div>

        {/* Separador */}
        <div className="hidden md:block w-px h-8" style={{ background: '#f1f5f9' }} />

        {/* Notificaciones */}
        <button
          className="relative flex items-center justify-center rounded-lg transition-colors"
          style={{ width: 36, height: 36, background: '#f8fafc', border: '1px solid #f1f5f9' }}
        >
          <svg className="w-4.5 h-4.5" style={{ width: 18, height: 18, color: '#64748b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {/* Badge de notificación */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: '#ef4444', boxShadow: '0 0 0 2px white' }}
          />
        </button>

        {/* Usuario dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-gray-50"
            style={{ border: '1px solid #f1f5f9' }}
          >
            <div
              className="flex items-center justify-center rounded-full text-sm font-bold text-white shrink-0"
              style={{
                width: 30,
                height: 30,
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
              }}
            >
              {user?.nombre?.charAt(0)?.toUpperCase() ?? 'A'}
            </div>
            <div className="hidden sm:flex flex-col items-start" style={{ lineHeight: 1.3 }}>
              <span className="text-xs font-semibold" style={{ color: '#0f172a' }}>
                {user?.nombre ?? 'Admin'}
              </span>
              <span className="text-xs" style={{ color: '#94a3b8' }}>
                {user?.email ?? 'admin@matadero.com'}
              </span>
            </div>
            <svg className="w-4 h-4 shrink-0" style={{ color: '#94a3b8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div
                className="absolute right-0 mt-2 w-52 rounded-xl z-20 overflow-hidden animate-fade-in-up"
                style={{
                  background: 'white',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.12)',
                  top: '100%',
                }}
              >
                <div className="px-4 py-3.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <div className="text-sm font-semibold" style={{ color: '#0f172a' }}>{user?.nombre}</div>
                  <div className="text-xs" style={{ color: '#94a3b8', marginTop: 2 }}>{user?.email}</div>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left hover:bg-red-50"
                    style={{ color: '#dc2626' }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
