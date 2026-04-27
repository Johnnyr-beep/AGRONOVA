import React, { useState } from 'react'
import {
  CheckIcon,
  TrashIcon,
  CalculatorIcon,
  ClipboardDocumentCheckIcon,
  PrinterIcon,
  PencilIcon,
  ClockIcon, // Para simular el Gauge si no hay un icono mejor en heroicons
} from '@heroicons/react/24/solid'

function BasculaEnPiePage() {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    guiaMovilizacion: '',
    proveedor: '',
    cliente: '',
    tipoAnimal: '',
    ubicacionCorral: '',
    lote: '0',
    animalNo: '26160563',
    peso: 0.0,
  })

  const [activeTab, setActiveTab] = useState('observaciones')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'peso' ? Number(value) || 0 : value,
    }))
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 font-sans text-gray-800">
      {/* ── HEADER Y BOTONERA ── */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          {/* Logo Vaca simulado */}
          <div className="bg-gray-800 text-white p-2 rounded-md font-bold text-lg flex items-center justify-center w-10 h-10 border-2 border-dashed border-gray-400">
            🐄
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
            <label className="block text-xs font-semibold uppercase text-gray-600">
              Guía de Movilización:
            </label>
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
        <div className="flex items-center gap-4">
          <div className="flex border-4 border-gray-600 rounded-lg overflow-hidden bg-gray-100">
            <button className="p-2 hover:bg-gray-300 border-r-2 border-gray-400 transition-colors" title="Guardar">
              <CheckIcon className="w-8 h-8 text-gray-800" strokeWidth={2} />
            </button>
            <button className="p-2 hover:bg-red-200 transition-colors" title="Limpiar">
              <TrashIcon className="w-8 h-8 text-gray-700" />
            </button>
          </div>

          <button className="p-2 border-4 border-gray-600 rounded-lg hover:bg-gray-300 bg-gray-100 transition" title="Calculadora">
            <CalculatorIcon className="w-8 h-8 text-gray-700" />
          </button>

          <button className="p-2 border-4 border-gray-600 rounded-lg hover:bg-gray-300 bg-gray-100 transition" title="Inspección/Checklist">
            <ClipboardDocumentCheckIcon className="w-8 h-8 text-gray-700" />
          </button>
        </div>
      </div>

      {/* ── SECCIÓN DE DATOS GENERALES ── */}
      <div className="space-y-3 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Proveedor:</label>
          <input
            type="text"
            name="proveedor"
            value={formData.proveedor}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Cliente:</label>
          <input
            type="text"
            name="cliente"
            value={formData.cliente}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-green-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Animal:</label>
            <select
              name="tipoAnimal"
              value={formData.tipoAnimal}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-green-500 focus:outline-none bg-white"
            >
              <option value="">Seleccione...</option>
              <option value="Novillo">Novillo</option>
              <option value="Vaca">Vaca</option>
              <option value="Toro">Toro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación(Corral):</label>
            <select
              name="ubicacionCorral"
              value={formData.ubicacionCorral}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-green-500 focus:outline-none bg-white"
            >
              <option value="">Seleccione...</option>
              <option value="Corral 1">Corral 1</option>
              <option value="Corral 2">Corral 2</option>
              <option value="Corral Recepción">Corral Recepción</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── PANEL DE PESAJE EN PIE ── */}
      <div className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-gray-200 h-28">
        
        {/* Lote */}
        <div className="flex-1 border border-gray-200 rounded p-2 flex flex-col justify-between h-full">
          <label className="text-xs font-semibold text-gray-500 uppercase">Lote:</label>
          <input
            type="text"
            name="lote"
            value={formData.lote}
            onChange={handleInputChange}
            className="w-full text-4xl text-center font-medium bg-transparent focus:outline-none"
          />
        </div>

        {/* Animal No. */}
        <div className="flex-[2] border border-gray-200 rounded p-2 flex flex-col justify-between h-full bg-gray-50 relative">
          <label className="text-xs font-semibold text-gray-500 uppercase">Animal No.:</label>
          <div className="flex items-center justify-center">
            {/* Split color hack as seen in screenshot: black and red */}
            <input
              type="number"
              name="animalNo"
              value={formData.animalNo}
              onChange={handleInputChange}
              className="w-full text-[40px] text-center font-black bg-transparent focus:outline-none tracking-wider text-black"
              // In a real scenario you would have to customize font coloring based on logic.
              // For now, it's a solid input.
            />
          </div>
        </div>

        {/* Peso (kg) */}
        <div className="flex-1 border border-green-200 rounded p-2 flex flex-col justify-between h-full bg-green-50/20">
          <label className="text-xs font-semibold text-gray-500 uppercase">Peso(kg):</label>
          <input
            type="number"
            name="peso"
            value={formData.peso || ''}
            onChange={handleInputChange}
            className="w-full text-4xl text-center font-bold text-green-600 bg-transparent focus:outline-none"
            step="0.1"
          />
        </div>

        {/* Action buttons (Gauge, Pencil, Printer) */}
        <div className="flex gap-2 items-center h-full">
          <div className="flex gap-1 h-full py-1">
             <button className="border-4 border-gray-600 rounded-lg p-2 bg-gray-100 hover:bg-gray-300 transition h-full aspect-square flex items-center justify-center">
               <ClockIcon className="w-8 h-8 text-gray-700" />
             </button>
             <button className="border-4 border-gray-400 rounded-lg p-2 hover:bg-gray-100 transition h-full aspect-square flex items-center justify-center">
               <PencilIcon className="w-8 h-8 text-gray-500" />
             </button>
             <button className="border-4 border-gray-600 rounded-lg p-2 hover:bg-gray-100 transition h-full aspect-square flex items-center justify-center">
               <PrinterIcon className="w-8 h-8 text-gray-700" />
             </button>
          </div>
        </div>
      </div>

      {/* ── TABS INFERIORES ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col" style={{ minHeight: '300px' }}>
        {/* Tab Headers */}
        <div className="flex border-b border-gray-300 bg-gray-100">
          <button
            className={`flex-1 py-2 font-semibold text-sm transition-colors ${
              activeTab === 'total' ? 'bg-white text-black border-x border-gray-300' : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('total')}
          >
            Total: 00 (0.0 kg)
          </button>
          <button
            className={`flex-[2] py-2 font-semibold text-sm transition-colors ${
              activeTab === 'observaciones' ? 'bg-white text-black border-x border-gray-300' : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('observaciones')}
          >
            Observaciones
          </button>
          <button
            className={`flex-1 py-2 font-semibold text-sm transition-colors ${
              activeTab === 'abiertas' ? 'bg-white text-black border-x border-gray-300' : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('abiertas')}
          >
            Guías Abiertas.: 17
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 bg-white">
          {activeTab === 'total' && (
             <div className="text-gray-400 text-sm flex items-center justify-center h-full">
              Historial de pesajes de este lote.
            </div>
          )}
          {activeTab === 'observaciones' && (
            <textarea
              className="w-full h-full min-h-[200px] border-none focus:ring-0 outline-none resize-none text-gray-700"
              placeholder=""
            ></textarea>
          )}
           {activeTab === 'abiertas' && (
            <div className="text-gray-400 text-sm flex flex-col items-center justify-center h-full gap-2">
              <p>Lista de Guías de Movilización abiertas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BasculaEnPiePage
