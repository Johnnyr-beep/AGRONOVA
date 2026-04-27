import { useEffect, useState } from 'react'
import { faenaService } from '../services/api'

interface Faena {
  id: string
  numeroFaena: string
  numeroCanal: string
  tipoAnimal: number
  numeroIdentificacion: string
  pesoEntrada: number
  pesoCanal: number
  estado: number
  aprobadoInspeccionAnte: boolean
  aprobadoInspeccionPost: boolean
  horaInicio: string
  horaFin?: string
  tiempoProcesoMinutos?: number
  estadoSanitario: number
}

function FaenaPage() {
  const [faenas, setFaenas] = useState<Faena[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedFaena, setSelectedFaena] = useState<Faena | null>(null)
  const [formData, setFormData] = useState({
    canalId: '',
    basculaId: '',
    numeroCanal: '',
    numeroIdentificacion: '',
    tipoAnimal: '0',
    pesoEntrada: 0,
    estadoSanitario: '0',
    horaInicio: new Date().toISOString().slice(0, 16),
  })

  useEffect(() => {
    fetchFaenas()
  }, [])

  const fetchFaenas = async () => {
    try {
      setLoading(true)
      const response = await faenaService.getAllFaenas()
      setFaenas(response.data || [])
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar faenas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFaena = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await faenaService.createFaena(formData)
      setShowForm(false)
      setFormData({
        canalId: '',
        basculaId: '',
        numeroCanal: '',
        numeroIdentificacion: '',
        tipoAnimal: '0',
        pesoEntrada: 0,
        estadoSanitario: '0',
        horaInicio: new Date().toISOString().slice(0, 16),
      })
      await fetchFaenas()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear faena')
    }
  }

  const getEstadoLabel = (estado: number): string => {
    const estados: { [key: number]: string } = {
      0: 'Pendiente',
      1: 'En Progreso',
      2: 'Insensibilizado',
      3: 'Desangrado',
      4: 'Pelado',
      5: 'Eviscerado',
      6: 'División Completa',
      7: 'Inspección Vet.',
      8: 'Aprobado',
      9: 'Rechazado',
      10: 'Listo para Desposte',
      11: 'Cancelado',
    }
    return estados[estado] || 'Desconocido'
  }

  const getEstadoColor = (estado: number): string => {
    const colores: { [key: number]: string } = {
      0: 'bg-yellow-100 text-yellow-700',
      1: 'bg-blue-100 text-blue-700',
      2: 'bg-purple-100 text-purple-700',
      3: 'bg-indigo-100 text-indigo-700',
      4: 'bg-pink-100 text-pink-700',
      5: 'bg-rose-100 text-rose-700',
      6: 'bg-orange-100 text-orange-700',
      7: 'bg-cyan-100 text-cyan-700',
      8: 'bg-green-100 text-green-700',
      9: 'bg-red-100 text-red-700',
      10: 'bg-lime-100 text-lime-700',
      11: 'bg-gray-100 text-gray-700',
    }
    return colores[estado] || 'bg-gray-100 text-gray-700'
  }

  const getTipoAnimalLabel = (tipo: number): string => {
    const tipos: { [key: number]: string } = {
      0: 'Bovino',
      1: 'Porcino',
      2: 'Ovino',
      3: 'Caprino',
      4: 'Otro',
    }
    return tipos[tipo] || 'Desconocido'
  }

  const getEstadoSanitarioLabel = (estado: number): string => {
    const estados: { [key: number]: string } = {
      0: 'Sano',
      1: 'Afectado',
      2: 'Decomiso',
      3: 'Condena',
      4: 'Sospechoso',
    }
    return estados[estado] || 'Desconocido'
  }

  if (loading) return <div className="text-center py-8">Cargando...</div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Módulo de Faena</h1>
        <p className="text-gray-600 mb-4">
          Control y seguimiento del proceso de sacrificio y faena de animales
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Nuevo Registro de Faena
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
      )}

      {/* Formulario de creación */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Registrar Nueva Faena</h3>
          <form onSubmit={handleCreateFaena} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canal ID
                </label>
                <input
                  type="text"
                  value={formData.canalId}
                  onChange={(e) =>
                    setFormData({ ...formData, canalId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Báscula ID
                </label>
                <input
                  type="text"
                  value={formData.basculaId}
                  onChange={(e) =>
                    setFormData({ ...formData, basculaId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Canal
                </label>
                <input
                  type="text"
                  value={formData.numeroCanal}
                  onChange={(e) =>
                    setFormData({ ...formData, numeroCanal: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identificación Animal
                </label>
                <input
                  type="text"
                  value={formData.numeroIdentificacion}
                  onChange={(e) =>
                    setFormData({ ...formData, numeroIdentificacion: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Animal
                </label>
                <select
                  value={formData.tipoAnimal}
                  onChange={(e) =>
                    setFormData({ ...formData, tipoAnimal: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">Bovino</option>
                  <option value="1">Porcino</option>
                  <option value="2">Ovino</option>
                  <option value="3">Caprino</option>
                  <option value="4">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso Entrada (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pesoEntrada}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pesoEntrada: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado Sanitario
                </label>
                <select
                  value={formData.estadoSanitario}
                  onChange={(e) =>
                    setFormData({ ...formData, estadoSanitario: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">Sano</option>
                  <option value="1">Afectado</option>
                  <option value="2">Decomiso</option>
                  <option value="3">Condena</option>
                  <option value="4">Sospechoso</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora Inicio
                </label>
                <input
                  type="datetime-local"
                  value={formData.horaInicio}
                  onChange={(e) =>
                    setFormData({ ...formData, horaInicio: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Crear Faena
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
          <h3 className="text-gray-500 text-sm font-medium">En Progreso</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {faenas.filter((f) => f.estado === 1).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">Completadas</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {faenas.filter((f) => f.estado >= 6 && f.estado <= 10).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">Aprobadas</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {faenas.filter((f) => f.aprobadoInspeccionPost).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">Rechazadas</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {faenas.filter((f) => f.estado === 9 || f.estado === 11).length}
          </p>
        </div>
      </div>

      {/* Tabla de faenas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Faena
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Canal
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Animal
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Identificación
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Peso Entrada
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Peso Canal
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Inspección
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {faenas.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                  No hay faenas registradas
                </td>
              </tr>
            ) : (
              faenas.map((faena) => (
                <tr key={faena.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">
                    {faena.numeroFaena}
                  </td>
                  <td className="px-6 py-4 text-sm">{faena.numeroCanal}</td>
                  <td className="px-6 py-4 text-sm">
                    {getTipoAnimalLabel(faena.tipoAnimal)}
                  </td>
                  <td className="px-6 py-4 text-sm">{faena.numeroIdentificacion}</td>
                  <td className="px-6 py-4 text-sm">{faena.pesoEntrada.toFixed(2)} kg</td>
                  <td className="px-6 py-4 text-sm">
                    {faena.pesoCanal ? faena.pesoCanal.toFixed(2) : '-'} kg
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                        faena.estado
                      )}`}
                    >
                      {getEstadoLabel(faena.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {faena.aprobadoInspeccionPost ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        ✓ Aceptada
                      </span>
                    ) : faena.aprobadoInspeccionAnte ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        ⊘ Ante
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => setSelectedFaena(faena)}
                      className="text-blue-600 hover:underline"
                    >
                      Ver
                    </button>
                    <button className="text-orange-600 hover:underline">Editar</button>
                    {faena.estado >= 6 && faena.estado <= 8 && (
                      <button className="text-green-600 hover:underline text-xs font-medium">
                        Inspeccionar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Panel de detalles */}
      {selectedFaena && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold">Detalles de Faena</h3>
              <button
                onClick={() => setSelectedFaena(null)}
                className="text-white hover:bg-blue-800 rounded p-2"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Número Faena</p>
                  <p className="font-semibold">{selectedFaena.numeroFaena}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <p className="font-semibold">{getEstadoLabel(selectedFaena.estado)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tipo Animal</p>
                  <p className="font-semibold">
                    {getTipoAnimalLabel(selectedFaena.tipoAnimal)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado Sanitario</p>
                  <p className="font-semibold">
                    {getEstadoSanitarioLabel(selectedFaena.estadoSanitario)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Peso Entrada</p>
                  <p className="font-semibold">{selectedFaena.pesoEntrada.toFixed(2)} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Peso Canal</p>
                  <p className="font-semibold">
                    {selectedFaena.pesoCanal?.toFixed(2) || '-'} kg
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Rendimiento</p>
                  <p className="font-semibold">
                    {selectedFaena.pesoCanal > 0
                      ? ((selectedFaena.pesoCanal / selectedFaena.pesoEntrada) * 100).toFixed(2)
                      : 'N/A'}
                    %
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                <button
                  onClick={() => setSelectedFaena(null)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FaenaPage
