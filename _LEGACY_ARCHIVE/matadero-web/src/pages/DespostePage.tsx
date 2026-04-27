import { useEffect, useState, FormEvent } from 'react'
import { desposteService } from '../services/api'

const ESTADO_MAP: Record<number, { label: string; badge: string }> = {
  0: { label: 'Pendiente',   badge: 'badge badge-yellow' },
  1: { label: 'En Progreso', badge: 'badge badge-blue'   },
  2: { label: 'Finalizado',  badge: 'badge badge-green'  },
}

function DespostePage() {
  const [despostes, setDespostes] = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [showModal, setShowModal] = useState(false)
  const [nuevaData, setNuevaData] = useState({ canalId: '', observacionesCalidad: '' })
  const [creando, setCreando]     = useState(false)

  useEffect(() => { fetchDespostes() }, [])

  const fetchDespostes = async () => {
    try {
      setLoading(true)
      const response = await desposteService.getAllDespostes()
      setDespostes(response.data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCrear = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setCreando(true)
      await desposteService.createDesposte({
        canalId: nuevaData.canalId || null,
        observacionesCalidad: nuevaData.observacionesCalidad,
      })
      setShowModal(false)
      setNuevaData({ canalId: '', observacionesCalidad: '' })
      fetchDespostes()
    } catch (err: any) {
      alert('Error al crear: ' + err.message)
    } finally {
      setCreando(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div className="page-header" style={{ margin: 0 }}>
          <h2 className="page-title">Módulo de Desposte</h2>
          <p className="page-subtitle">Registro y control del proceso de desposte</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Desposte
        </button>
      </div>

      {/* Error */}
      {error && <div className="pro-alert-error mb-5">{error}</div>}

      {/* KPIs rápidos */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total registros', value: despostes.length, color: 'kpi-blue' },
          { label: 'En progreso',     value: despostes.filter(d => d.estado === 1).length, color: 'kpi-orange' },
          { label: 'Finalizados',     value: despostes.filter(d => d.estado === 2).length, color: 'kpi-green' },
        ].map((k, i) => (
          <div key={i} className={`kpi-card ${k.color}`} style={{ padding: '16px 20px' }}>
            <p className="kpi-label">{k.label}</p>
            <p className="kpi-value" style={{ fontSize: 28 }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="pro-card">
        <div className="pro-card-header">
          <h3 className="pro-card-title">Registros de Desposte</h3>
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#f1f5f9', color: '#64748b' }}>
            {despostes.length} registros
          </span>
        </div>

        {loading ? (
          <div className="pro-card-body">
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton h-10 rounded-lg" />
              ))}
            </div>
          </div>
        ) : despostes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-text">No hay despostes registrados</div>
            <button className="btn-primary mt-4" onClick={() => setShowModal(true)}>
              Crear primer desposte
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="pro-table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Rendimiento</th>
                  <th>Canal ID</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {despostes.map((desposte: any) => {
                  const estado = ESTADO_MAP[desposte.estado] ?? ESTADO_MAP[0]
                  return (
                    <tr key={desposte.id}>
                      <td>
                        <span className="font-semibold" style={{ color: '#0f172a' }}>
                          #{desposte.numeroDesposte}
                        </span>
                      </td>
                      <td style={{ color: '#64748b' }}>
                        {new Date(desposte.fechaDesposte).toLocaleDateString('es-CO', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td>
                        <span className={estado.badge}>{estado.label}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div
                            className="rounded-full overflow-hidden"
                            style={{ width: 60, height: 6, background: '#f1f5f9' }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${desposte.porcentajeRendimiento ?? 0}%`,
                                background: 'linear-gradient(90deg, #16a34a, #4ade80)',
                              }}
                            />
                          </div>
                          <span className="text-sm font-bold" style={{ color: '#16a34a' }}>
                            {desposte.porcentajeRendimiento?.toFixed(1) ?? '0.0'}%
                          </span>
                        </div>
                      </td>
                      <td style={{ color: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}>
                        {desposte.canalId ? desposte.canalId.slice(0, 8) + '...' : '—'}
                      </td>
                      <td>
                        <button
                          className="text-sm font-semibold transition-colors"
                          style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          Gestionar →
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="pro-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="pro-modal">
            <div className="pro-modal-header">
              <h2 className="pro-modal-title">Iniciar Nuevo Desposte</h2>
              <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Registra los datos de la canal a despostar</p>
            </div>
            <form onSubmit={handleCrear}>
              <div className="pro-modal-body space-y-4">
                <div>
                  <label className="pro-label">ID de la Canal (UUID)</label>
                  <input
                    type="text"
                    className="pro-input"
                    value={nuevaData.canalId}
                    onChange={e => setNuevaData({ ...nuevaData, canalId: e.target.value })}
                    required
                    placeholder="550e8400-e29b-41d4-a716-446655440000"
                  />
                </div>
                <div>
                  <label className="pro-label">Observaciones de calidad</label>
                  <textarea
                    className="pro-input"
                    rows={3}
                    value={nuevaData.observacionesCalidad}
                    onChange={e => setNuevaData({ ...nuevaData, observacionesCalidad: e.target.value })}
                    placeholder="Estado de la canal al recibirla..."
                  />
                </div>
              </div>
              <div className="pro-modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={creando}
                >
                  {creando ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Guardando...
                    </>
                  ) : 'Guardar y Continuar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DespostePage
