import { useState, useEffect } from 'react'
import { getPendingCount, syncQueue } from '../services/offlineQueue'
import api from '../services/api'

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingOps, setPendingOps] = useState(getPendingCount())
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true)
      // Al volver la conexión, sincronizar automáticamente
      if (getPendingCount() > 0) {
        setSyncing(true)
        try {
          const result = await syncQueue(api)
          setPendingOps(getPendingCount())
          setLastSync(new Date())
          if (result.synced > 0) {
            console.log(`✅ Sincronizadas ${result.synced} operaciones`)
          }
        } finally {
          setSyncing(false)
        }
      }
    }

    const handleOffline = () => setIsOnline(false)

    const handleQueueChange = (e: CustomEvent) => {
      setPendingOps(e.detail.count)
    }

    window.addEventListener('online',  handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('offline-queue-changed', handleQueueChange as EventListener)

    // Verificar conectividad real cada 30 segundos (no solo navigator.onLine)
    const intervalId = setInterval(async () => {
      try {
        await api.get('/health', { timeout: 3000 })
        setIsOnline(prev => {
          if (!prev) {
            // Se recuperó la conexión
            setTimeout(handleOnline, 0); // Llamar fuera del render
          }
          return true;
        })
      } catch {
        setIsOnline(false)
      }
    }, 30000)

    return () => {
      window.removeEventListener('online',  handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('offline-queue-changed', handleQueueChange as EventListener)
      clearInterval(intervalId)
    }
  }, [])

  const manualSync = async () => {
    if (!isOnline || syncing) return
    setSyncing(true)
    try {
      await syncQueue(api)
      setPendingOps(getPendingCount())
      setLastSync(new Date())
    } finally {
      setSyncing(false)
    }
  }

  return { isOnline, pendingOps, syncing, lastSync, manualSync }
}
