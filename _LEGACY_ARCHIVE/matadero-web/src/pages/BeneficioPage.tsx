import React, { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon, TagIcon } from '@heroicons/react/24/solid'

function BeneficioPage() {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [cliente, setCliente] = useState('890107163 - COMPAÑIA INDUSTRIAL DE')
  const [activeTab, setActiveTab] = useState('animales')

  const [osNo, setOsNo] = useState('21660')
  const [animalNo, setAnimalNo] = useState('')
  const [turno, setTurno] = useState('598')

  return (
    <div className="max-w-6xl mx-auto font-sans text-gray-800 bg-white min-h-[85vh] p-4 rounded-xl shadow-sm border border-gray-200">
      
      {/* ── HEADER ── */}
      <div className="flex items-center gap-4 mb-4">
        {/* Logo Gancho simulado */}
        <div className="border border-gray-400 p-2 flex flex-col items-center justify-center bg-gray-100 rounded w-16 h-16 shrink-0">
           <span className="font-black text-2xl tracking-tighter text-gray-800 relative">
             <span className="absolute -top-1 left-1.5 text-xs text-gray-600">A</span>
             🪝
           </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Fecha:</label>
          <input 
            type="date" 
            value={fecha} 
            onChange={(e) => setFecha(e.target.value)}
            className="border border-gray-400 px-2 py-1 text-sm focus:outline-none w-36"
          />
        </div>

        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Cliente:</label>
          <input 
            type="text" 
            value={cliente} 
            onChange={(e) => setCliente(e.target.value)}
            className="border border-gray-400 px-3 py-1 text-sm focus:outline-none w-full"
          />
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex border-b border-gray-300">
        <button 
          className={`px-6 py-2 text-sm font-semibold uppercase ${activeTab === 'ordenes' ? 'bg-gray-100 border-t border-l border-r border-gray-300 text-black' : 'bg-transparent text-gray-500 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('ordenes')}
        >
          Ordenes de Servicio
        </button>
        <button 
          className={`px-6 py-2 text-sm font-semibold uppercase ${activeTab === 'animales' ? 'bg-white border-t border-l border-r border-gray-300 text-black shadow-[0_2px_0_0_white]' : 'bg-transparent text-gray-500 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('animales')}
        >
          Animales
        </button>
      </div>

      {/* ── CUERPO PRINCIPAL ── */}
      <div className="flex gap-4 mt-4">
        
        {/* PANEL IZQUIERDO (Cuadrícula de Números) */}
        <div className="flex-[2] flex flex-col gap-2">
           {activeTab === 'animales' ? (
             <div className="flex flex-col border border-gray-400 bg-white">
                {/* Row 1 */}
                <div className="border-b border-gray-400 flex items-center justify-center p-4 min-h-[120px]">
                   <span className="text-8xl font-black text-black tracking-tighter">598</span>
                </div>
                {/* Row 2 */}
                <div className="flex border-b border-gray-400 min-h-[120px]">
                   <div className="flex-1 border-r border-gray-400 flex items-center justify-center p-4">
                     <span className="text-7xl font-black text-black tracking-tighter">599</span>
                   </div>
                   <div className="flex-1 flex items-center justify-center p-4">
                     <span className="text-7xl font-black text-black tracking-tighter">600</span>
                   </div>
                </div>
                {/* Row 3 */}
                <div className="flex min-h-[120px]">
                   <div className="flex-1 border-r border-gray-400 flex items-center justify-center p-4">
                     <span className="text-7xl font-black text-black tracking-tighter">601</span>
                   </div>
                   <div className="flex-1 flex items-center justify-center p-4">
                     <span className="text-7xl font-black text-black tracking-tighter">602</span>
                   </div>
                </div>
             </div>
           ) : (
             <div className="flex-1 border border-gray-200 bg-gray-50 p-2 min-h-[360px]">
                <div className="bg-white border border-black p-3 text-lg font-medium text-black">
                  21660 | 890107163 - COMPAÑIA INDUSTRIAL DE PRODUCTOS AGROPECUARIOS SA
                </div>
             </div>
           )}

           {/* Botonera de flechas y etiquetas */}
           <div className="flex gap-2 h-14 mt-1">
              <button className="border-2 border-black hover:bg-gray-100 flex-1 flex items-center justify-center transition">
                <ChevronUpIcon className="w-12 h-12 text-black" strokeWidth={2} />
              </button>
              <button className="border-2 border-black hover:bg-gray-100 flex-1 flex items-center justify-center transition">
                <ChevronDownIcon className="w-12 h-12 text-black" strokeWidth={2} />
              </button>
              {activeTab === 'animales' && (
                <button className="border-2 border-black hover:bg-gray-100 flex-[3] flex items-center justify-center transition relative overflow-hidden group">
                   <TagIcon className="w-8 h-8 text-black transform group-hover:scale-110 transition" />
                   <span className="absolute top-1 right-2 text-[10px] font-bold text-gray-500">📎</span>
                </button>
              )}
           </div>

           {/* Inpus Inferiores Izquierda */}
           <div className="flex gap-4 mt-2">
              <div className="flex-1">
                 <label className="block text-sm font-semibold text-gray-700">O.S No.:</label>
                 <input type="text" value={osNo} onChange={e => setOsNo(e.target.value)} className="w-full border border-gray-300 p-1 text-2xl font-bold text-center" />
              </div>
              <div className="flex-1">
                 <label className="block text-sm font-semibold text-gray-700">Animal No.:</label>
                 <input type="text" value={animalNo} onChange={e => setAnimalNo(e.target.value)} className="w-full border border-gray-300 p-1 text-2xl font-bold text-center" />
              </div>
              <div className="flex-1">
                 <label className="block text-sm font-semibold text-gray-700">Turno:</label>
                 <input type="text" value={turno} onChange={e => setTurno(e.target.value)} className="w-full border border-gray-300 p-1 text-2xl font-bold text-center" />
              </div>
           </div>
        </div>


        {/* PANEL DERECHO (Observaciones y Metricas) */}
        <div className="flex-1 flex flex-col gap-3">
          
          <div className="flex-1 flex flex-col border border-gray-300 p-2 bg-gray-50/50">
            <label className="block text-sm font-semibold text-gray-800 mb-1">Observaciones Camionera:</label>
            <textarea 
               className="w-full flex-1 border border-gray-200 resize-none p-2 focus:outline-none"
               readOnly
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="border border-gray-300 p-2 flex flex-col items-start bg-gray-50">
               <span className="text-sm font-medium text-gray-800">Total:</span>
               <span className="text-3xl font-bold text-blue-600 w-full text-center">65</span>
             </div>
             <div className="border border-gray-300 p-2 flex flex-col items-start bg-gray-50">
               <span className="text-sm font-medium text-gray-800">Vivos:</span>
               <span className="text-3xl font-bold text-green-600 w-full text-center">65</span>
             </div>
             <div className="border border-gray-300 p-2 flex flex-col items-start bg-gray-50">
               <span className="text-sm font-medium text-gray-800">Tumbados:</span>
               <span className="text-3xl font-bold text-red-600 w-full text-center">0</span>
             </div>
             <div className="border border-gray-300 p-2 flex flex-col items-start bg-gray-50">
               <span className="text-sm font-medium text-gray-800">Prom.(kg):</span>
               <span className="text-3xl font-bold text-black w-full text-center">119.54</span>
             </div>
          </div>

          <div className="mt-2">
            <label className="block text-sm font-semibold text-gray-800 mb-1">Modo de Impresión:</label>
            <button className="w-full py-4 bg-gray-500 hover:bg-gray-600 font-bold text-white tracking-widest text-lg transition shadow-inner">
               MANUAL
            </button>
          </div>

          <div className="flex gap-3 mt-4 h-16">
             <button className="flex-1 bg-white border-2 border-black hover:bg-gray-100 font-semibold text-sm transition">
               VISCERAS
             </button>
             <button className="flex-1 bg-white border-2 border-black hover:bg-gray-100 font-semibold text-sm transition">
               CABEZAS
             </button>
          </div>

        </div>

      </div>

    </div>
  )
}

export default BeneficioPage
