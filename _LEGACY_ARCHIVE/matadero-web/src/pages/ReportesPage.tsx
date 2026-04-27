import { useEffect, useMemo, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts'
import { basculaService } from '../services/api'

const faenaMensualData = [
  { mes: 'Ene', faenas: 120, rendimiento: 54.2 },
  { mes: 'Feb', faenas: 150, rendimiento: 55.1 },
  { mes: 'Mar', faenas: 180, rendimiento: 53.8 },
  { mes: 'Abr', faenas: 140, rendimiento: 56.0 },
  { mes: 'May', faenas: 190, rendimiento: 55.5 },
]

const estadoCanalesData = [
  { name: 'En Proceso',    value: 40  },
  { name: 'Despostadas',   value: 300 },
  { name: 'Acondicionadas',value: 150 },
  { name: 'Rechazadas',    value: 10  },
]

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444']

const alertasCalidad = [
  { d: 'Hoy',        m: 'Recepción', r: 'Guía sin firma ICA',           g: 'Media'   },
  { d: 'Ayer',       m: 'Desposte',  r: 'Contaminación visible',         g: 'Alta'    },
  { d: 'Hace 3 días',m: 'Despacho',  r: 'Temperatura vehículo > 5°C',   g: 'Crítica' },
  { d: 'Hace 5 días',m: 'Faena',     r: 'Rendimiento bajo (< 50%)',      g: 'Baja'    },
]

const gravedadBadge: Record<string, string> = {
  'Crítica': 'badge badge-red',
  'Alta':    'badge badge-red',
  'Media':   'badge badge-yellow',
  'Baja':    'badge badge-green',
}

const kpisReporte = [
  { label: 'Total Faenados',       value: '780',  trend: '+12%', up: true,  color: 'kpi-blue'   },
  { label: 'Rendimiento Desposte', value: '54.8%',trend: '+1.2%',up: true,  color: 'kpi-green'  },
  { label: 'Despachos Realizados', value: '124',  trend: '-2%',  up: false, color: 'kpi-orange' },
  { label: 'Mermas / Rechazos',    value: '1.2%', trend: '-0.5%',up: true,  color: 'kpi-purple' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'white', border:'1px solid #f1f5f9', borderRadius:10, padding:'10px 14px', boxShadow:'0 4px 16px rgb(0 0 0 / 0.1)' }}>
      <p style={{ fontSize:12, fontWeight:700, color:'#0f172a', marginBottom:6 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize:12, color: p.color, fontWeight:600 }}>
          {p.name}: <span style={{ color:'#0f172a' }}>{p.value}</span>
        </p>
      ))}
    </div>
  )
}

function ReportesPage() {
  const [rango, setRango] = useState('este_mes')
  const [fechaInicio, setFechaInicio] = useState(() => {
    const d = new Date()
    d.setDate(1)
    return d.toISOString().split('T')[0]
  })
  const [fechaFin, setFechaFin] = useState(() => new Date().toISOString().split('T')[0])
  const [basculaRows, setBasculaRows] = useState<any[]>([])
  const [loadingBascula, setLoadingBascula] = useState(false)

  const totalesBascula = useMemo(() => {
    const totalNeto = basculaRows.reduce((acc, r) => acc + Number(r.pesoNeto ?? 0), 0)
    const totalCant = basculaRows.reduce((acc, r) => acc + Number(r.cantidadAnimales ?? 0), 0)
    const prom = totalCant > 0 ? totalNeto / totalCant : 0
    return { totalNeto, totalCant, prom }
  }, [basculaRows])

  useEffect(() => {
    fetchBasculaReporte()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchBasculaReporte = async () => {
    try {
      setLoadingBascula(true)
      const res = await basculaService.getReportePeriodo(fechaInicio, fechaFin)
      setBasculaRows(res.data ?? [])
    } catch (e) {
      console.error('Error cargando reporte báscula', e)
      setBasculaRows([])
      alert('No se pudo cargar el reporte de Báscula.')
    } finally {
      setLoadingBascula(false)
    }
  }

  const exportBasculaExcel = async () => {
    try {
      const res = await basculaService.downloadReportePeriodoExcel(fechaInicio, fechaFin)
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte_bascula_${fechaInicio}_${fechaFin}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Error exportando excel', e)
      alert('No se pudo exportar el Excel del reporte de Báscula.')
    }
  }

  return (
    <div className="space-y-6">

      {/* Header con filtro */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="page-header" style={{ margin: 0 }}>
          <h2 className="page-title">Reportes y Analíticas</h2>
          <p className="page-subtitle">Métricas clave de operación y rendimiento</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={rango}
            onChange={(e) => setRango(e.target.value)}
            className="pro-input"
            style={{ width: 'auto', paddingRight: 36 }}
          >
            <option value="hoy">Hoy</option>
            <option value="esta_semana">Esta Semana</option>
            <option value="este_mes">Este Mes</option>
            <option value="este_año">Este Año</option>
          </select>
          <button className="btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Reporte Báscula Camionera */}
      <div className="pro-card print-area">
        <div className="pro-card-header" style={{ alignItems: 'flex-end' }}>
          <div>
            <h3 className="pro-card-title">Reporte Báscula Camionera</h3>
            <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
              Registros capturados en báscula por rango de fechas
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Desde</label>
              <input className="pro-input" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Hasta</label>
              <input className="pro-input" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={fetchBasculaReporte} disabled={loadingBascula}>
              {loadingBascula ? 'Cargando...' : 'Buscar'}
            </button>
            <button className="btn-secondary" onClick={() => window.print()}>
              Imprimir (PDF)
            </button>
            <button className="btn-secondary" onClick={exportBasculaExcel}>
              Exportar Excel
            </button>
          </div>
        </div>

        <div className="pro-card-body" style={{ paddingTop: 8 }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="kpi-card kpi-green">
              <p className="kpi-label">Neto total (kg)</p>
              <p className="kpi-value" style={{ fontSize: 24 }}>{totalesBascula.totalNeto.toFixed(2)}</p>
            </div>
            <div className="kpi-card kpi-blue">
              <p className="kpi-label">Cantidad total</p>
              <p className="kpi-value" style={{ fontSize: 24 }}>{totalesBascula.totalCant}</p>
            </div>
            <div className="kpi-card kpi-purple">
              <p className="kpi-label">Promedio (kg)</p>
              <p className="kpi-value" style={{ fontSize: 24 }}>{totalesBascula.prom.toFixed(2)}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="pro-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Ticket</th>
                  <th>Guía</th>
                  <th>Procedencia</th>
                  <th>Proveedor</th>
                  <th>Cliente</th>
                  <th>Placa</th>
                  <th>Conductor</th>
                  <th>Ref.</th>
                  <th>Cant.</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Neto</th>
                  <th>Prom.</th>
                  <th>Obs.</th>
                </tr>
              </thead>
              <tbody>
                {basculaRows.length === 0 ? (
                  <tr>
                    <td colSpan={15} style={{ color: '#94a3b8' }}>
                      {loadingBascula ? 'Cargando...' : 'Sin registros en el rango seleccionado.'}
                    </td>
                  </tr>
                ) : (
                  basculaRows.map((r, i) => (
                    <tr key={r.id ?? i}>
                      <td style={{ color: '#64748b', fontSize: 13 }}>
                        {r.fechaIngreso ? new Date(r.fechaIngreso).toLocaleString() : ''}
                      </td>
                      <td className="font-semibold text-sm" style={{ color: '#334155' }}>{r.numeroTicket}</td>
                      <td style={{ color: '#475569', fontSize: 13 }}>{r.guiaMovilizacion}</td>
                      <td style={{ color: '#475569', fontSize: 13 }}>{r.procedencia}</td>
                      <td style={{ color: '#475569', fontSize: 13 }}>{r.proveedorNombre}</td>
                      <td style={{ color: '#475569', fontSize: 13 }}>{r.clienteNombre}</td>
                      <td style={{ color: '#475569', fontSize: 13 }}>{r.patentaCamion}</td>
                      <td style={{ color: '#475569', fontSize: 13 }}>{r.transportista}</td>
                      <td style={{ color: '#475569', fontSize: 13 }}>{r.referencia}</td>
                      <td style={{ color: '#475569', fontSize: 13 }}>{r.cantidadAnimales}</td>
                      <td style={{ color: '#475569', fontSize: 13 }}>{Number(r.pesoEntradaKg ?? 0).toFixed(2)}</td>
                      <td style={{ color: '#475569', fontSize: 13 }}>{Number(r.pesoSalidaKg ?? 0).toFixed(2)}</td>
                      <td style={{ color: '#0f172a', fontWeight: 700, fontSize: 13 }}>{Number(r.pesoNeto ?? 0).toFixed(2)}</td>
                      <td style={{ color: '#0f172a', fontWeight: 700, fontSize: 13 }}>{Number(r.promedioKg ?? 0).toFixed(2)}</td>
                      <td style={{ color: '#475569', fontSize: 13, maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {r.observaciones}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {kpisReporte.map((k, i) => (
          <div key={i} className={`kpi-card ${k.color}`}>
            <p className="kpi-label">{k.label}</p>
            <p className="kpi-value" style={{ fontSize: 28 }}>{k.value}</p>
            <p className="kpi-trend" style={{ color: k.up ? '#16a34a' : '#ef4444' }}>
              {k.up ? '↑' : '↓'} {k.trend} vs. período anterior
            </p>
          </div>
        ))}
      </div>

      {/* Gráficos fila 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Barras: faena mensual */}
        <div className="pro-card">
          <div className="pro-card-header">
            <div>
              <h3 className="pro-card-title">Volumen de Faena Mensual</h3>
              <p className="text-xs mt-0.5" style={{ color:'#94a3b8' }}>Cabezas faenadas por mes</p>
            </div>
            <span className="badge badge-blue">Barras</span>
          </div>
          <div className="pro-card-body" style={{ paddingTop: 8 }}>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={faenaMensualData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} style={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} style={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="faenas" name="Cabezas" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Líneas: rendimiento */}
        <div className="pro-card">
          <div className="pro-card-header">
            <div>
              <h3 className="pro-card-title">Evolución de Rendimiento</h3>
              <p className="text-xs mt-0.5" style={{ color:'#94a3b8' }}>Porcentaje de rendimiento mensual</p>
            </div>
            <span className="badge badge-green">Tendencia</span>
          </div>
          <div className="pro-card-body" style={{ paddingTop: 8 }}>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={faenaMensualData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} style={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} style={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="rendimiento"
                    name="Rendimiento (%)"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#16a34a', strokeWidth: 2, stroke: 'white' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico fila 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Pie chart */}
        <div className="pro-card">
          <div className="pro-card-header">
            <h3 className="pro-card-title">Estado del Inventario</h3>
          </div>
          <div className="pro-card-body" style={{ paddingTop: 8 }}>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={estadoCanalesData}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {estadoCanalesData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    height={40}
                    iconSize={8}
                    iconType="circle"
                    formatter={(value) => <span style={{ fontSize: 11, color: '#64748b' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Leyenda total */}
            <div className="text-center mt-1">
              <div className="text-2xl font-bold" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
                {estadoCanalesData.reduce((a, b) => a + b.value, 0)}
              </div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>Total canales en sistema</div>
            </div>
          </div>
        </div>

        {/* Alertas de calidad */}
        <div className="pro-card lg:col-span-2">
          <div className="pro-card-header">
            <h3 className="pro-card-title">Alertas de Calidad Recientes</h3>
            <span className="badge badge-red">
              {alertasCalidad.filter(a => a.g === 'Crítica' || a.g === 'Alta').length} críticas
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="pro-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Módulo</th>
                  <th>Motivo</th>
                  <th>Gravedad</th>
                </tr>
              </thead>
              <tbody>
                {alertasCalidad.map((a, i) => (
                  <tr key={i}>
                    <td style={{ color: '#64748b', fontSize: 13 }}>{a.d}</td>
                    <td>
                      <span className="font-semibold text-sm" style={{ color: '#334155' }}>{a.m}</span>
                    </td>
                    <td style={{ color: '#475569', fontSize: 13 }}>{a.r}</td>
                    <td>
                      <span className={gravedadBadge[a.g] ?? 'badge badge-gray'}>{a.g}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportesPage
