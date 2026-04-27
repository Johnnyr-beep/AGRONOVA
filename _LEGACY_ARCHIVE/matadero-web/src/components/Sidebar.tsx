import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const menuItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    exact: true,
  },
  {
    path: '/bascula',
    label: 'Báscula Camionera',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
  {
    path: '/bascula-pie',
    label: 'Báscula en Pie',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },

  {
    path: '/beneficio',
    label: 'Beneficio',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    path: '/desposte',
    label: 'Desposte',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
  },
  {
    path: '/acondicionamiento',
    label: 'Acondicionamiento',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    path: '/despacho',
    label: 'Despacho',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    path: '/reportes',
    label: 'Reportes',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

const adminItems = [
  {
    path: '/configuracion',
    label: 'Configuración',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

function Sidebar() {
  const { user } = useAuthStore()

  const getRolLabel = (tipo: number) => {
    switch (tipo) {
      case 0: return 'Administrador'
      case 1: return 'Veterinario'
      case 2: return 'Operario'
      default: return 'Usuario'
    }
  }

  const getRolColor = (tipo: number) => {
    switch (tipo) {
      case 0: return 'bg-green-500/20 text-green-400'
      case 1: return 'bg-blue-500/20 text-blue-400'
      case 2: return 'bg-orange-500/20 text-orange-400'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  return (
    <aside
      className="flex flex-col h-screen overflow-hidden shrink-0"
      style={{
        width: '240px',
        background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
        borderRight: '1px solid #1e293b',
      }}
    >
      {/* Logo / Branding */}
      <div className="px-5 py-6" style={{ borderBottom: '1px solid #1e293b' }}>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              boxShadow: '0 4px 12px rgb(22 163 74 / 0.4)',
            }}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div className="overflow-hidden">
            <div className="text-white font-bold text-sm tracking-wide leading-tight">SANTACRUZ</div>
            <div className="text-xs leading-tight" style={{ color: '#64748b' }}>Sistema Integral de Planta</div>
          </div>
        </div>
      </div>

      {/* Usuario activo */}
      <div className="px-4 py-4" style={{ borderBottom: '1px solid #1e293b' }}>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full shrink-0 text-sm font-bold text-white"
            style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #334155, #475569)' }}
          >
            {user?.nombre?.charAt(0)?.toUpperCase() ?? 'A'}
          </div>
          <div className="overflow-hidden min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user?.nombre ?? 'Admin'}</div>
            <span
              className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 ${getRolColor(user?.tipoEmpleado ?? 0)}`}
            >
              {getRolLabel(user?.tipoEmpleado ?? 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: '#334155' }}>
          Módulos
        </p>
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group"
                style={({ isActive }) => ({
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(22,163,74,0.2), rgba(21,128,61,0.15))'
                    : 'transparent',
                  color: isActive ? '#4ade80' : '#94a3b8',
                  borderLeft: isActive ? '2px solid #16a34a' : '2px solid transparent',
                  marginLeft: '2px',
                })}
              >
                <span
                  className="shrink-0 transition-colors"
                  style={{ opacity: 1 }}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            )
          })}
        </div>

        {user?.tipoEmpleado === 0 && (
          <>
            <p className="px-3 mt-6 mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: '#334155' }}>
              Sistema
            </p>
            <div className="space-y-0.5">
              {adminItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                  style={({ isActive }) => ({
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(22,163,74,0.2), rgba(21,128,61,0.15))'
                      : 'transparent',
                    color: isActive ? '#4ade80' : '#94a3b8',
                    borderLeft: isActive ? '2px solid #16a34a' : '2px solid transparent',
                    marginLeft: '2px',
                  })}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid #1e293b' }}>
        <div className="flex items-center gap-2 px-2">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: '#4ade80', boxShadow: '0 0 6px #4ade80' }}
          />
          <span className="text-xs" style={{ color: '#64748b' }}>Sistema operativo</span>
        </div>
        <div className="mt-2 px-2 text-xs" style={{ color: '#334155' }}>
          v1.0 — © 2025 Santacruz
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
