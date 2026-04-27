import { useEffect, useState } from 'react'
import { acondicionamientoService } from '../services/api'

interface Acondicionamiento {
  id: string
  numeroAcondicionamiento: string
  numeroDesposte: string
  cantidadProductosAcondicionados: number
  pesoTotalAcondicionado: number
  tipoEmbalaje: string
  estado: number
  aprobadoControlCalidad: boolean
  operarioId: string
  horaInicio: string
  horaFin: string
}

function AcondicionamientoPage() {
  const [acondicionamientos, setAcondicionamientos] = useState<Acondicionamiento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    desposteId: '',
    tipoEmbalaje: '0',
    temperaturProductos: 0,
    requiereRefrigeracionEspecial: false,
  })

  useEffect(() => {
    fetchAcondicionamientos()
  }, [])

  const fetchAcondicionamientos = async () => {
    try {
      setLoading(true)
      const response = await acondicionamientoService.getAllAcondicionamientos()
      setAcondicionamientos(response.data)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar acondicionamientos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAcondicionamiento = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await acondicionamientoService.createAcondicionamiento(formData)
      setShowForm(false)
      setFormData({
        desposteId: '',
        tipoEmbalaje: '0',
        temperaturProductos: 0,
        requiereRefrigeracionEspecial: false,
      })
      await fetchAcondicionamientos()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear acondicionamiento')
    }
  }

  const getEstadoLabel = (estado: number): string => {
    const estados: { [key: number]: string } = {
      0: 'Pendiente',
      1: 'En Proceso',
      2: 'Completado',
      3: 'Aprobado CC',
      4: 'Rechazado',
      5: 'Cancelado',
    }
    return estados[estado] || 'Desconocido'
  }

  const getEstadoColor = (estado: number): string => {
    const colores: { [key: number]: string } = {
      0: 'bg-yellow-100 text-yellow-700',
      1: 'bg-blue-100 text-blue-700',
      2: 'bg-purple-100 text-purple-700',
      3: 'bg-green-100 text-green-700',
      4: 'bg-red-100 text-red-700',
      5: 'bg-gray-100 text-gray-700',
    }
    return colores[estado] || 'bg-gray-100 text-gray-700'
  }

  if (loading) return <div className="text-center py-8">Cargando...</div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Módulo de Acondicionamiento</h1>
        <p className="text-gray-600 mb-4">
          Empaque, etiquetado y preparación de productos para despacho
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Nuevo Acondicionamiento
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
      )}

      {/* Formulario de creación */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Crear Nuevo Acondicionamiento
          </h3>
          <form onSubmit={handleCreateAcondicionamiento} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desposte ID
                </label>
                <input
                  type="text"
                  value={formData.desposteId}
                  onChange={(e) =>
                    setFormData({ ...formData, desposteId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Embalaje
                </label>
                <select
                  value={formData.tipoEmbalaje}
                  onChange={(e) =>
                    setFormData({ ...formData, tipoEmbalaje: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">Caja</option>
                  <option value="1">Bandeja</option>
                  <option value="2">Vacío al Vacío</option>
                  <option value="3">Con Hielo</option>
                  <option value="4">Con Nitrógeno</option>
                  <option value="5">Con Gel</option>
                  <option value="6">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperatura Productos (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperaturProductos}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      temperaturProductos: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requiere Refrigeración Especial
                </label>
                <input
                  type="checkbox"
                  checked={formData.requiereRefrigeracionEspecial}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requiereRefrigeracionEspecial: e.target.checked,
                    })
                  }
                  className="h-4 w-4 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Crear
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">En Proceso</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {acondicionamientos.filter((a) => a.estado === 1).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">Completados</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {acondicionamientos.filter((a) => a.estado === 2).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">Aprobados CC</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {acondicionamientos.filter((a) => a.aprobadoControlCalidad).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">Rechazados</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {acondicionamientos.filter((a) => a.estado === 4).length}
          </p>
        </div>
      </div>

      {/* Tabla de acondicionamientos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Número
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Desposte
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Productos
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Peso Total (kg)
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Embalaje
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                CC Aprobado
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {acondicionamientos.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No hay acondicionamientos registrados
                </td>
              </tr>
            ) : (
              acondicionamientos.map((acond) => (
                <tr key={acond.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">
                    {acond.numeroAcondicionamiento}
                  </td>
                  <td className="px-6 py-4 text-sm">{acond.numeroDesposte}</td>
                  <td className="px-6 py-4 text-sm text-center">
                    {acond.cantidadProductosAcondicionados}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {acond.pesoTotalAcondicionado?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">{acond.tipoEmbalaje}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                        acond.estado
                      )}`}
                    >
                      {getEstadoLabel(acond.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {acond.aprobadoControlCalidad ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        ✓ Aprobado
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button className="text-blue-600 hover:underline">Ver</button>
                    <button className="text-orange-600 hover:underline">Editar</button>
                    {acond.estado === 2 && !acond.aprobadoControlCalidad && (
                      <button className="text-green-600 hover:underline text-xs font-medium">
                        Aprobar CC
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AcondicionamientoPage
