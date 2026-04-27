import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function LoginPage() {
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(nombreUsuario, password)
      navigate('/')
    } catch (err: any) {
      if (!err.response) {
        setError('No se puede conectar al servidor. Verificando acceso de emergencia...')
      } else {
        setError(err.response?.data?.message || `Error ${err.response?.status}: Credenciales incorrectas`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1a2744 50%, #0f2318 100%)',
      }}
    >
      {/* Panel izquierdo — Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        {/* Fondo decorativo */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, #16a34a 0%, transparent 60%), radial-gradient(circle at 80% 20%, #2563eb 0%, transparent 50%)',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 44,
              height: 44,
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              boxShadow: '0 4px 16px rgb(22 163 74 / 0.4)',
            }}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <div className="text-white font-bold text-lg tracking-wide leading-tight">SANTACRUZ</div>
            <div className="text-xs" style={{ color: '#4ade80' }}>Sistema Integral de Planta</div>
          </div>
        </div>

        {/* Contenido central */}
        <div className="relative z-10">
          <h1
            className="text-white font-black mb-4"
            style={{ fontSize: 40, letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            Gestión industrial<br />
            <span style={{ color: '#4ade80' }}>de punta a punta.</span>
          </h1>
          <p className="text-base mb-10" style={{ color: '#94a3b8', maxWidth: 380, lineHeight: 1.7 }}>
            Plataforma completa para la gestión de operaciones en plantas de procesamiento cárnico. Trazabilidad, 
            calidad y eficiencia en un solo sistema.
          </p>

          {/* Módulos */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Faena', icon: '🐄', desc: 'Control de faenamiento' },
              { label: 'Desposte', icon: '🔪', desc: 'Rendimiento por corte' },
              { label: 'Despacho', icon: '🚛', desc: 'Logística de salida' },
              { label: 'Reportes', icon: '📊', desc: 'Análisis en tiempo real' },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="text-xl mb-1">{m.icon}</div>
                <div className="text-sm font-semibold text-white">{m.label}</div>
                <div className="text-xs" style={{ color: '#64748b' }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer izquierdo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
          <span className="text-xs" style={{ color: '#64748b' }}>Sistema operativo — v1.0.0</span>
        </div>
      </div>

      {/* Panel derecho — Formulario */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-wide">SANTACRUZ</span>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="mb-7">
              <h2
                className="font-bold text-white mb-1"
                style={{ fontSize: 22, letterSpacing: '-0.01em' }}
              >
                Iniciar sesión
              </h2>
              <p style={{ color: '#64748b', fontSize: 14 }}>
                Ingresa tus credenciales para continuar
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                className="mb-5 flex items-start gap-3 rounded-xl p-4"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
              >
                <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#ef4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p style={{ color: '#fca5a5', fontSize: 13 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Usuario */}
              <div>
                <label
                  className="block mb-2 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: '#64748b' }}
                >
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4" style={{ color: '#475569' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    required
                    autoFocus
                    placeholder="Nombre de usuario"
                    style={{
                      width: '100%',
                      paddingLeft: 40,
                      paddingRight: 14,
                      paddingTop: 11,
                      paddingBottom: 11,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1.5px solid rgba(255,255,255,0.1)',
                      borderRadius: 10,
                      color: 'white',
                      fontSize: 14,
                      outline: 'none',
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#16a34a'
                      e.target.style.background = 'rgba(255,255,255,0.08)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                      e.target.style.background = 'rgba(255,255,255,0.05)'
                    }}
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label
                  className="block mb-2 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: '#64748b' }}
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4" style={{ color: '#475569' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      paddingLeft: 40,
                      paddingRight: 44,
                      paddingTop: 11,
                      paddingBottom: 11,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1.5px solid rgba(255,255,255,0.1)',
                      borderRadius: 10,
                      color: 'white',
                      fontSize: 14,
                      outline: 'none',
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#16a34a'
                      e.target.style.background = 'rgba(255,255,255,0.08)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                      e.target.style.background = 'rgba(255,255,255,0.05)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: '#475569', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {showPass ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 font-bold transition-all rounded-xl flex items-center justify-center gap-2"
                style={{
                  padding: '12px 20px',
                  background: loading
                    ? 'rgba(22,163,74,0.5)'
                    : 'linear-gradient(135deg, #16a34a, #15803d)',
                  color: 'white',
                  fontSize: 14,
                  border: 'none',
                  cursor: loading ? 'wait' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 16px rgb(22 163 74 / 0.4)',
                }}
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verificando...
                  </>
                ) : (
                  <>
                    Ingresar al sistema
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs mt-5" style={{ color: '#334155' }}>
            © 2025 Agropecuaria Santacruz · Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
