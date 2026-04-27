import { useState, useEffect } from 'react'
import { despachoService } from '../services/api'

// const estadoDespacho: Record<string, string> = {
//   'Completado': 'badge badge-green',
//   'En Ruta':    'badge badge-blue',
//   'Pendiente':  'badge badge-yellow',
// }

const ESTADO_MAP: Record<number, { label: string; badge: string }> = {
  0: { label: 'Pendiente',   badge: 'badge badge-yellow' },
  1: { label: 'En Ruta',     badge: 'badge badge-blue'   },
  2: { label: 'Completado',  badge: 'badge badge-green'  },
  3: { label: 'Cancelado',   badge: 'badge badge-gray'   },
}

function DespachoPage() {
  const [despachos, setDespachos] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [creando, setCreando] = useState(false)

  const [formData, setFormData] = useState({
    clienteNombre: '',
    patentaVehiculo: '',
    productosIdsString: '',
    temperaturaVehiculo: 0
  })

  useEffect(() => {
    fetchDespachos()
  }, [])

  const fetchDespachos = async () => {
    try {
      const response = await despachoService.getAll()
      setDespachos(response.data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setCreando(true)
      await despachoService.create({
        direccionDestino: formData.clienteNombre,
        patentaVehiculo: formData.patentaVehiculo,
        temperaturaVehiculo: Number(formData.temperaturaVehiculo),
        transportistaNombre: 'Transporte asignado',
        numeroSelloRefrigeracion: 'SELLO-' + Math.floor(Math.random() * 1000)
      })
      alert("Despacho creado correctamente")
      setShowModal(false)
      fetchDespachos()
      setFormData({
        clienteNombre: '',
        patentaVehiculo: '',
        productosIdsString: '',
        temperaturaVehiculo: 0
      })
    } catch (err: any) {
      alert("Error al crear despacho: " + (err.response?.data?.message || err.message))
    } finally {
      setCreando(false)
    }
  }

  const hoy      = despachos.filter(d => d.estado === 2).length // Completado
  const enRuta   = despachos.filter(d => d.estado === 1).length // En Ruta
  const pendiente = despachos.filter(d => d.estado === 0).length // Pendiente

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div className="page-header" style={{ margin: 0 }}>
          <h2 className="page-title">Módulo de Despacho</h2>
          <p className="page-subtitle">Control de salida y logística de entrega</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Crear Despacho
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="kpi-card kpi-green">
          <div className="flex items-center justify-between mb-3">
            <p className="kpi-label">Completados Hoy</p>
            <div className="flex items-center justify-center rounded-lg" style={{ width:36, height:36, background:'#f0fdf4', border:'1px solid #bbf7d0' }}>
              <svg className="w-4 h-4" style={{ color:'#16a34a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="kpi-value">{hoy}</p>
          <p className="kpi-trend" style={{ color:'#16a34a' }}>↑ Despachos entregados</p>
        </div>
        <div className="kpi-card kpi-blue">
          <div className="flex items-center justify-between mb-3">
            <p className="kpi-label">En Ruta</p>
            <div className="flex items-center justify-center rounded-lg" style={{ width:36, height:36, background:'#eff6ff', border:'1px solid #bfdbfe' }}>
              <svg className="w-4 h-4" style={{ color:'#2563eb' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1" />
              </svg>
            </div>
          </div>
          <p className="kpi-value">{enRuta}</p>
          <p className="kpi-trend" style={{ color:'#2563eb' }}>→ En tránsito ahora</p>
        </div>
        <div className="kpi-card kpi-orange">
          <div className="flex items-center justify-between mb-3">
            <p className="kpi-label">Pendientes</p>
            <div className="flex items-center justify-center rounded-lg" style={{ width:36, height:36, background:'#fff7ed', border:'1px solid #fed7aa' }}>
              <svg className="w-4 h-4" style={{ color:'#ea580c' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="kpi-value">{pendiente}</p>
          <p className="kpi-trend" style={{ color:'#ea580c' }}>⏳ Por despachar</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="pro-card">
        <div className="pro-card-header">
          <h3 className="pro-card-title">Registro de Despachos</h3>
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background:'#f1f5f9', color:'#64748b' }}>
            {despachos.length} registros
          </span>
        </div>
        <div className="overflow-x-auto">
          {despachos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No hay registros de despacho</div>
          ) : (
            <table className="pro-table">
              <thead>
                <tr>
                  <th># Guía</th>
                  <th>Fecha</th>
                  <th>Destino</th>
                  <th>Vehículo</th>
                  <th>Temperatura</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {despachos.map((d) => {
                  const sMap = ESTADO_MAP[d.estado] || ESTADO_MAP[0]
                  return (
                    <tr key={d.id}>
                      <td>
                        <span className="font-bold" style={{ color:'#0f172a' }}>{d.numeroDespacho}</span>
                      </td>
                      <td style={{ color:'#64748b' }}>
                        {new Date(d.fechaDespacho).toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' })}
                      </td>
                      <td className="font-medium" style={{ color:'#334155' }}>{d.direccionDestino}</td>
                      <td style={{ color:'#64748b', fontFamily:'monospace', fontSize:13 }}>{d.patentaVehiculo}</td>
                      <td>
                        {d.temperaturaVehiculo > 0 ? (
                          <span
                            className="font-semibold text-sm"
                            style={{ color: d.temperaturaVehiculo > 5 ? '#ef4444' : '#16a34a' }}
                          >
                            {d.temperaturaVehiculo}°C
                            {d.temperaturaVehiculo > 5 && (
                              <span className="ml-1 text-xs" style={{ color:'#ef4444' }}>⚠</span>
                            )}
                          </span>
                        ) : (
                          <span style={{ color:'#94a3b8' }}>—</span>
                        )}
                      </td>
                      <td>
                        <span className={sMap.badge}>{sMap.label}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            className="text-xs font-semibold transition-colors px-2.5 py-1.5 rounded-lg"
                            style={{ color:'#2563eb', background:'#eff6ff', border:'none', cursor:'pointer' }}
                          >
                            Imprimir Guía
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="pro-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="pro-modal" style={{ maxWidth:520 }}>
            <div className="pro-modal-header">
              <h2 className="pro-modal-title">Registrar Despacho</h2>
              <p className="text-sm mt-1" style={{ color:'#94a3b8' }}>Completa los datos de salida del producto</p>
            </div>
            <form onSubmit={handleCrear}>
              <div className="pro-modal-body">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="pro-label">Cliente / Destino</label>
                    <input type="text" value={formData.clienteNombre} onChange={e=>setFormData({...formData, clienteNombre: e.target.value})} className="pro-input" required placeholder="Ej: Supermercado XYZ" />
                  </div>
                  <div>
                    <label className="pro-label">Vehículo (Placa)</label>
                    <input type="text" value={formData.patentaVehiculo} onChange={e=>setFormData({...formData, patentaVehiculo: e.target.value})} className="pro-input" required placeholder="Ej: ABC-123" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="pro-label">IDs de Productos (separados por coma)</label>
                  <textarea value={formData.productosIdsString} onChange={e=>setFormData({...formData, productosIdsString: e.target.value})} className="pro-input" rows={3} placeholder="Ingrese los IDs o códigos de producto..." />
                </div>
                <div className="mt-4">
                  <label className="pro-label">Temperatura Termoking (°C)</label>
                  <input type="number" step="0.1" value={formData.temperaturaVehiculo} onChange={e=>setFormData({...formData, temperaturaVehiculo: Number(e.target.value)})} className="pro-input" required placeholder="Ej: 3.8" />
                  <p className="text-xs mt-1" style={{ color:'#94a3b8' }}>⚠ Máximo permitido: 5°C para cadena de frío</p>
                </div>
              </div>
              <div className="pro-modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={creando}>
                  {creando ? 'Guardando...' : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Confirmar y Generar Guía
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DespachoPage
