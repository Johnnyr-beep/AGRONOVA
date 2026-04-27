import React, { useState, useEffect } from 'react'
import { CheckIcon, TrashIcon, PencilIcon, PrinterIcon, LockClosedIcon, TruckIcon } from '@heroicons/react/24/solid'
import { basculaService } from '../services/api'

function BasculaPage() {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    guiaMovilizacion: '',
    procedencia: '',
    proveedor: '',
    cliente: '',
    placa: '',
    conductor: '',
    referencia: '0',
    cantidad: 0,
    entrada: 0.0,
    salida: 0.0,
    observaciones: '',
  })

  const [abiertas, setAbiertas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Computed Values
  const neto = Math.abs(formData.entrada - formData.salida)
  const promedio = formData.cantidad > 0 ? (neto / formData.cantidad) : 0

  useEffect(() => {
    fetchBasculas()
  }, [])

  const fetchBasculas = async () => {
    try {
      const response = await basculaService.getAll()
      // Filtramos las que no tienen salida registrada por ejemplo
      setAbiertas(response.data.filter((b: any) => !b.fechaSalida))
    } catch (error) {
      console.error("Error cargando básculas", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cantidad' || name === 'entrada' || name === 'salida' ? Number(value) || 0 : value
    }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      await basculaService.create({
        guiaMovilizacion: formData.guiaMovilizacion,
        referencia: formData.referencia,
        patentaCamion: formData.placa,
        transportista: formData.conductor,
        pesoEntradaKg: formData.entrada,
        pesoSalidaKg: formData.salida,
        cantidadAnimales: formData.cantidad,
        procedencia: formData.procedencia,
        proveedorNombre: formData.proveedor,
        clienteNombre: formData.cliente,
        observaciones: formData.observaciones
      })
      alert('Registro guardado correctamente')
      fetchBasculas()
      handleClear()
    } catch (error) {
      console.error("Error al guardar", error)
      alert("Error al guardar el registro en báscula.")
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      guiaMovilizacion: '',
      procedencia: '',
      proveedor: '',
      cliente: '',
      placa: '',
      conductor: '',
      referencia: '0',
      cantidad: 0,
      entrada: 0.0,
      salida: 0.0,
      observaciones: '',
    })
  }

  const [activeTab, setActiveTab] = useState('abiertas')

  return (
    <div className="max-w-5xl mx-auto space-y-4 font-sans text-gray-800">
      
      {/* ── HEADER Y BOTONERA ── */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
           {/* Logo Camion simulado */}
           <div className="bg-gray-800 text-white p-2 rounded-md">
             <TruckIcon className="w-8 h-8" />
           </div>

           <div>
              <label className="block text-xs font-semibold uppercase text-gray-600">Fecha:</label>
              <input 
                type="date" 
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
           </div>

           <div className="ml-4">
              <label className="block text-xs font-semibold uppercase text-gray-600">Guía de Movilización:</label>
              <input 
                type="text" 
                name="guiaMovilizacion"
                value={formData.guiaMovilizacion}
                onChange={handleInputChange}
                className="border-b-2 border-l-2 border-r-0 border-t-0 border-gray-300 px-2 py-1 focus:border-green-500 focus:outline-none placeholder-gray-300 w-48 text-lg"
              />
           </div>
        </div>

        {/* Botonera Superior Der */}
        <div className="flex items-center gap-2">
          {/* Botones de Acción Principal (Cuadrados oscuros) */}
          <div className="flex border-4 border-gray-600 rounded-lg overflow-hidden bg-gray-100">
            <button onClick={handleSave} disabled={loading} className="p-2 hover:bg-gray-300 border-r-2 border-gray-400 transition-colors" title="Confirmar/Guardar">
              <CheckIcon className="w-8 h-8 text-gray-800" strokeWidth={2} />
            </button>
            <button onClick={handleClear} className="p-2 hover:bg-red-200 transition-colors" title="Limpiar Formulario">
              <TrashIcon className="w-8 h-8 text-gray-700" />
            </button>
          </div>

          <div className="w-8"></div> {/* Spacer */}

          {/* Botones Secundarios */}
          <div className="flex gap-2">
            <button className="p-2 border-2 border-gray-400 rounded-lg hover:bg-gray-100 shadow-sm transition" title="Editar">
              <PencilIcon className="w-7 h-7 text-gray-500" />
            </button>
            <button className="p-2 border-2 border-gray-400 rounded-lg hover:bg-gray-100 shadow-sm transition" title="Imprimir">
              <PrinterIcon className="w-7 h-7 text-gray-500" />
            </button>
            <button className="p-2 border-2 border-gray-400 rounded-lg hover:bg-gray-100 shadow-sm transition" title="Bloquear">
              <LockClosedIcon className="w-7 h-7 text-gray-500" />
            </button>
          </div>
        </div>
      </div>


      {/* ── SECCIÓN DE DATOS GENERALES ── */}
      <div className="space-y-3 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Procedencia:</label>
            <input 
              type="text" name="procedencia" value={formData.procedencia} onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Proveedor:</label>
            <input 
              type="text" name="proveedor" value={formData.proveedor} onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Cliente:</label>
          <input 
            type="text" name="cliente" value={formData.cliente} onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-green-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-[1fr_3fr] gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Placa:</label>
            <input 
              type="text" name="placa" value={formData.placa} onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 uppercase font-bold text-center focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Conductor:</label>
            <input 
              type="text" name="conductor" value={formData.conductor} onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>
      </div>


      {/* ── PANELES DE NUMEROS (METRICAS) ── */}
      <div className="grid grid-cols-6 gap-2 text-center bg-white p-3 rounded-xl shadow-sm border border-gray-200">
        {/* Referencia */}
        <div className="border border-gray-200 rounded p-2 flex flex-col justify-between">
          <label className="text-xs font-semibold text-gray-500 uppercase">Referencia:</label>
          <span className="text-3xl mt-1 text-gray-800">{formData.referencia}</span>
        </div>
        {/* Cantidad */}
        <div className="border border-gray-200 rounded p-2 flex flex-col justify-between bg-gray-50">
          <label className="text-xs font-semibold text-gray-500 uppercase">Cant.:</label>
          <input 
            type="number" name="cantidad" value={formData.cantidad} onChange={handleInputChange}
            className="w-full text-3xl text-center bg-transparent focus:outline-none" min="0" 
          />
        </div>
        {/* Entrada Roja */}
        <div className="border border-red-200 rounded p-2 flex flex-col justify-between bg-red-50/30">
          <label className="text-xs font-semibold text-gray-500 uppercase">Entrada (kg):</label>
          <input 
            type="number" name="entrada" value={formData.entrada || ''} onChange={handleInputChange}
            className="w-full text-4xl text-center font-bold text-red-600 bg-transparent focus:outline-none"
            step="0.1"
          />
        </div>
        {/* Salida Azul */}
        <div className="border border-blue-200 rounded p-2 flex flex-col justify-between bg-blue-50/30">
          <label className="text-xs font-semibold text-gray-500 uppercase">Salida (kg):</label>
          <input 
            type="number" name="salida" value={formData.salida || ''} onChange={handleInputChange}
            className="w-full text-4xl text-center font-bold text-blue-600 bg-transparent focus:outline-none"
            step="0.1"
          />
        </div>
        {/* Neto Verde */}
        <div className="border border-green-200 rounded p-2 flex flex-col justify-between bg-green-50/30">
          <label className="text-xs font-semibold text-gray-500 uppercase">Neto (kg):</label>
          <span className="text-4xl mt-1 font-bold text-green-600">{neto.toFixed(1)}</span>
        </div>
        {/* Promedio Negro */}
        <div className="border border-gray-200 rounded p-2 flex flex-col justify-between bg-gray-50">
          <label className="text-xs font-semibold text-gray-500 uppercase">Prom. (kg):</label>
          <span className="text-4xl mt-1 font-bold text-black">{promedio.toFixed(1)}</span>
        </div>
      </div>

      
      {/* ── TABS INFERIORES: BASCULA Y OBSERVACIONES ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col" style={{ minHeight: '300px'}}>
        {/* Tab Headers */}
        <div className="flex border-b border-gray-300 bg-gray-100">
          <button 
            className={`flex-1 py-2 font-semibold text-sm transition-colors ${activeTab === 'abiertas' ? 'bg-white text-black border-r border-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('abiertas')}
          >
            Guías Abiertas: {abiertas.length}
          </button>
          <button 
            className={`flex-1 py-2 font-semibold text-sm transition-colors ${activeTab === 'observaciones' ? 'bg-white text-black border-l border-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('observaciones')}
          >
            Observaciones
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 bg-white">
          {activeTab === 'abiertas' && (
            <div className="w-full max-h-[250px] overflow-y-auto">
              {abiertas.length === 0 ? (
                <div className="text-gray-400 text-sm flex items-center justify-center h-full mt-10">
                  No hay guías de movilización abiertas actualmente.
                </div>
              ) : (
                <ul className="space-y-2">
                  {abiertas.map((abierta, index) => (
                    <li key={index} className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between">
                      <div>
                        <span className="font-semibold">{abierta.numeroTicket}</span> - {abierta.patentaCamion || 'Sin Placa'}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {new Date(abierta.fechaIngreso).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {activeTab === 'observaciones' && (
            <textarea 
               className="w-full h-full min-h-[200px] border border-gray-200 rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none resize-none"
               placeholder="Escriba aquí las observaciones sobre este ingreso en báscula..."
               name="observaciones"
               value={formData.observaciones}
               onChange={handleInputChange}
            ></textarea>
          )}
        </div>
      </div>

    </div>
  )
}

export default BasculaPage
