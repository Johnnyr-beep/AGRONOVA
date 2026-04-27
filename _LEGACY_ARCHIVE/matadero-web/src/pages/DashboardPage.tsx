import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const kpis = [
  {
    label: 'Canales Hoy',
    value: '24',
    trend: '+12% vs ayer',
    trendUp: true,
    color: 'kpi-green',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: '#16a34a' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: 'Despostes Completos',
    value: '18',
    trend: 'Rendimiento 78.5%',
    trendUp: true,
    color: 'kpi-blue',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: '#2563eb' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    label: 'Productos Disponibles',
    value: '156',
    trend: 'Listos p/ despacho',
    trendUp: true,
    color: 'kpi-orange',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: '#ea580c' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: 'Despachos Pendientes',
    value: '5',
    trend: 'Próximas 24h',
    trendUp: false,
    color: 'kpi-purple',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: '#7c3aed' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
]

const flujoEtapas = [
  { label: 'Recepción',        pct: 100, color: '#16a34a' },
  { label: 'Faena',           pct: 87,  color: '#2563eb' },
  { label: 'Desposte',        pct: 72,  color: '#7c3aed' },
  { label: 'Acondicionamiento', pct: 60, color: '#ea580c' },
  { label: 'Despacho',        pct: 45,  color: '#0891b2' },
]

const alertas = [
  { tipo: 'error',   mensaje: 'Temperatura crítica en cámara 3', tiempo: 'hace 5 min' },
  { tipo: 'warning', mensaje: 'Productos próximos a vencer (12 uds)', tiempo: 'hace 18 min' },
  { tipo: 'info',    mensaje: 'Inspección veterinaria pendiente — Faena #0042', tiempo: 'hace 34 min' },
  { tipo: 'success', mensaje: 'Despacho #0089 completado exitosamente', tiempo: 'hace 1h' },
]

const alertColor: Record<string, { bg: string; border: string; dot: string; text: string }> = {
  error:   { bg: '#fef2f2', border: '#fecaca', dot: '#ef4444', text: '#991b1b' },
  warning: { bg: '#fffbeb', border: '#fde68a', dot: '#f59e0b', text: '#92400e' },
  info:    { bg: '#eff6ff', border: '#bfdbfe', dot: '#3b82f6', text: '#1e40af' },
  success: { bg: '#f0fdf4', border: '#bbf7d0', dot: '#22c55e', text: '#15803d' },
}

function DashboardPage() {
  const { user } = useAuthStore()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div>
      {/* Bienvenida */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="font-bold" style={{ fontSize: 22, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Buen día, {user?.nombre ?? 'Administrador'} 👋
          </h2>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            Aquí tienes el resumen de operaciones del día.
          </p>
        </div>
        <div
          className="flex items-center gap-3 rounded-xl px-5 py-3"
          style={{ background: 'white', border: '1px solid #f1f5f9', boxShadow: 'var(--shadow-md)' }}
        >
          <div className="text-right">
            <div className="font-bold text-xl" style={{ color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-xs capitalize mt-0.5" style={{ color: '#94a3b8' }}>
              {now.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#4ade80', boxShadow: '0 0 8px #4ade80' }}
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {kpis.map((kpi, i) => (
          <div key={i} className={`kpi-card ${kpi.color}`} style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <p className="kpi-label">{kpi.label}</p>
              <div
                className="flex items-center justify-center rounded-lg"
                style={{ width: 36, height: 36, background: '#f8fafc', border: '1px solid #f1f5f9' }}
              >
                {kpi.icon}
              </div>
            </div>
            <p className="kpi-value">{kpi.value}</p>
            <p
              className="kpi-trend"
              style={{ color: kpi.trendUp ? '#16a34a' : '#f59e0b' }}
            >
              {kpi.trendUp ? '↑' : '→'} {kpi.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Fila inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Flujo de proceso */}
        <div className="lg:col-span-2 pro-card">
          <div className="pro-card-header">
            <div>
              <h3 className="pro-card-title">Flujo de Proceso — Hoy</h3>
              <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>Avance por etapa productiva</p>
            </div>
            <span className="badge badge-green">En vivo</span>
          </div>
          <div className="pro-card-body">
            <div className="space-y-5">
              {flujoEtapas.map((etapa, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium" style={{ color: '#334155' }}>{etapa.label}</span>
                    <span className="text-sm font-bold" style={{ color: etapa.color }}>{etapa.pct}%</span>
                  </div>
                  <div
                    className="w-full rounded-full overflow-hidden"
                    style={{ height: 8, background: '#f1f5f9' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${etapa.pct}%`,
                        background: `linear-gradient(90deg, ${etapa.color}, ${etapa.color}aa)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mini stats */}
            <div
              className="mt-6 grid grid-cols-3 gap-4 rounded-xl p-4"
              style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}
            >
              {[
                { label: 'Eficiencia', value: '91.2%', color: '#16a34a' },
                { label: 'Merma promedio', value: '8.8%',  color: '#f59e0b' },
                { label: 'Tiempo ciclo', value: '4.2h',   color: '#2563eb' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-lg font-bold" style={{ color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alertas */}
        <div className="pro-card">
          <div className="pro-card-header">
            <h3 className="pro-card-title">Alertas del Sistema</h3>
            <span className="badge badge-red">{alertas.filter(a => a.tipo === 'error').length} críticas</span>
          </div>
          <div style={{ padding: '16px' }}>
            <div className="space-y-3">
              {alertas.map((alerta, i) => {
                const c = alertColor[alerta.tipo]
                return (
                  <div
                    key={i}
                    className="flex gap-3 rounded-lg p-3"
                    style={{ background: c.bg, border: `1px solid ${c.border}` }}
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                      style={{ background: c.dot, flexShrink: 0 }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight" style={{ color: c.text }}>
                        {alerta.mensaje}
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>{alerta.tiempo}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div style={{ padding: '0 16px 16px' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#cbd5e1' }}>
              Acciones rápidas
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Nueva Faena',   href: '/faena',    color: '#16a34a' },
                { label: 'Despachar',     href: '/despacho', color: '#2563eb' },
                { label: 'Reportes',      href: '/reportes', color: '#7c3aed' },
                { label: 'Configurar',    href: '/configuracion', color: '#64748b' },
              ].map((a, i) => (
                <Link
                  key={i}
                  to={a.href}
                  className="flex items-center justify-center text-center text-xs font-semibold rounded-lg py-2.5 transition-all hover:opacity-80"
                  style={{
                    background: `${a.color}15`,
                    color: a.color,
                    border: `1px solid ${a.color}30`,
                    textDecoration: 'none',
                  }}
                >
                  {a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
