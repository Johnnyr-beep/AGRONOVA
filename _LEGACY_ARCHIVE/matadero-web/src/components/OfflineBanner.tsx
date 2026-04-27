import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { getAllPendingOperations } from '../services/offlineQueue'
import { useState } from 'react'

export function OfflineBanner() {
  const { isOnline, pendingOps, syncing, lastSync, manualSync } = useOnlineStatus()
  const [showDetails, setShowDetails] = useState(false)

  // Si está online y no hay operaciones pendientes, no mostrar nada
  if (isOnline && pendingOps === 0) return null

  const pending = getAllPendingOperations()

  return (
    <>
      {/* Banner principal */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          minWidth: 340,
          maxWidth: 460,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          animation: 'fadeInUp 0.3s ease',
        }}
      >
        {/* Barra de estado */}
        <div
          style={{
            background: isOnline ? '#166534' : '#7f1d1d',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {/* Indicador */}
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: isOnline ? '#4ade80' : '#f87171',
              boxShadow: isOnline ? '0 0 8px #4ade80' : '0 0 8px #f87171',
              flexShrink: 0,
              animation: !isOnline ? 'pulse-soft 2s infinite' : 'none',
            }}
          />

          <div style={{ flex: 1 }}>
            {!isOnline ? (
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>
                  ⚠️ Sin conexión al servidor
                </div>
                <div style={{ color: '#fca5a5', fontSize: 11, marginTop: 2 }}>
                  Trabajando en modo offline · Los datos se guardan localmente
                </div>
              </div>
            ) : (
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>
                  {syncing ? '🔄 Sincronizando...' : `📤 ${pendingOps} operaciones pendientes`}
                </div>
                <div style={{ color: '#bbf7d0', fontSize: 11, marginTop: 2 }}>
                  {lastSync
                    ? `Última sync: ${lastSync.toLocaleTimeString('es-CO')}`
                    : 'Conexión restaurada — sincronizando datos'}
                </div>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {pendingOps > 0 && (
              <span
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  borderRadius: 999,
                  padding: '2px 10px',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {pendingOps}
              </span>
            )}
            {isOnline && pendingOps > 0 && !syncing && (
              <button
                onClick={manualSync}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  borderRadius: 8,
                  padding: '4px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Sync ahora
              </button>
            )}
            {pendingOps > 0 && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  fontSize: 12,
                  padding: '2px 4px',
                }}
              >
                {showDetails ? '▼' : '▶'}
              </button>
            )}
          </div>
        </div>

        {/* Panel de detalle de operaciones */}
        {showDetails && pending.length > 0 && (
          <div
            style={{
              background: '#1e293b',
              maxHeight: 200,
              overflowY: 'auto',
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {pending.slice(0, 10).map((op) => (
              <div
                key={op.id}
                style={{
                  padding: '8px 16px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#f59e0b',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 500 }}>
                    {op.description}
                  </div>
                  <div style={{ color: '#64748b', fontSize: 10, marginTop: 1 }}>
                    {new Date(op.timestamp).toLocaleTimeString('es-CO')} · {op.module}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#f59e0b',
                    background: 'rgba(245,158,11,0.1)',
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  {op.method}
                </span>
              </div>
            ))}
            {pending.length > 10 && (
              <div style={{ padding: '8px 16px', color: '#64748b', fontSize: 11, textAlign: 'center' }}>
                +{pending.length - 10} más operaciones en cola
              </div>
            )}
          </div>
        )}

        {/* Barra de progreso sync */}
        {syncing && (
          <div style={{ height: 3, background: '#1e293b', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                animation: 'shimmer 1.4s infinite',
                width: '60%',
              }}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default OfflineBanner
