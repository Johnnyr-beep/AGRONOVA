/**
 * COLA DE OPERACIONES OFFLINE
 * Almacena peticiones en localStorage cuando el servidor no está disponible.
 * Se sincroniza automáticamente cuando vuelve la conexión.
 */

const QUEUE_KEY = 'santacruz_offline_queue'
const CACHE_KEY = 'santacruz_data_cache'
const AUTH_KEY  = 'santacruz_auth_cache'

export interface QueuedOperation {
  id:        string
  method:    'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url:       string
  data:      any
  headers:   Record<string, string>
  timestamp: number
  module:    string          // 'bascula' | 'faena' | 'desposte' | etc.
  description: string        // legible para el usuario
  retries:   number
}

export interface CachedData {
  url:       string
  data:      any
  timestamp: number
}

export interface AuthCache {
  nombreUsuario: string
  passwordHash:  string       // SHA-256 del password
  user:          any
  timestamp:     number
}

/* ─── Helpers ──────────────────────────────────────────── */

function getQueue(): QueuedOperation[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
  } catch { return [] }
}

function saveQueue(q: QueuedOperation[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q))
}

function getCache(): CachedData[] {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '[]')
  } catch { return [] }
}

function saveCache(c: CachedData[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(c))
}

/* ─── API Pública ───────────────────────────────────────── */

/** Agrega una operación a la cola */
export function enqueueOperation(op: Omit<QueuedOperation, 'id' | 'timestamp' | 'retries'>) {
  const queue = getQueue()
  queue.push({ ...op, id: crypto.randomUUID(), timestamp: Date.now(), retries: 0 })
  saveQueue(queue)
  console.log(`[OFFLINE] Operación encolada: ${op.description}`)
  window.dispatchEvent(new CustomEvent('offline-queue-changed', { detail: { count: queue.length } }))
}

/** Devuelve el número de operaciones pendientes */
export function getPendingCount(): number {
  return getQueue().length
}

/** Limpia operaciones completadas */
export function clearOperation(id: string) {
  const queue = getQueue().filter(op => op.id !== id)
  saveQueue(queue)
  window.dispatchEvent(new CustomEvent('offline-queue-changed', { detail: { count: queue.length } }))
}

/** Guarda datos en caché local */
export function cacheData(url: string, data: any) {
  const cache = getCache().filter(c => c.url !== url) // reemplazar si existe
  cache.push({ url, data, timestamp: Date.now() })
  // Limitar a 100 entradas
  if (cache.length > 100) cache.splice(0, cache.length - 100)
  saveCache(cache)
}

/** Recupera datos del caché */
export function getCachedData(url: string): any | null {
  const entry = getCache().find(c => c.url === url)
  return entry ? entry.data : null
}

/** Guarda credenciales hasheadas para login offline */
export async function cacheAuthCredentials(nombreUsuario: string, password: string, user: any) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  const authCache: AuthCache = {
    nombreUsuario,
    passwordHash,
    user,
    timestamp: Date.now(),
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(authCache))
}

/** Verifica credenciales contra el caché local */
export async function verifyOfflineCredentials(nombreUsuario: string, password: string): Promise<any | null> {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const auth: AuthCache = JSON.parse(raw)

    if (auth.nombreUsuario !== nombreUsuario) return null

    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const inputHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    if (auth.passwordHash === inputHash) return auth.user
    return null
  } catch { return null }
}

/** Devuelve todas las operaciones pendientes */
export function getAllPendingOperations(): QueuedOperation[] {
  return getQueue()
}

/** Sincroniza la cola con el servidor */
export async function syncQueue(apiInstance: any): Promise<{ synced: number; failed: number }> {
  const queue = getQueue()
  if (queue.length === 0) return { synced: 0, failed: 0 }

  let synced = 0
  let failed = 0

  console.log(`[SYNC] Iniciando sincronización de ${queue.length} operaciones...`)

  for (const op of queue) {
    try {
      await apiInstance.request({
        method: op.method,
        url:    op.url,
        data:   op.data,
        headers: op.headers,
      })
      clearOperation(op.id)
      synced++
      console.log(`[SYNC] ✅ Operación sincronizada: ${op.description}`)
    } catch (err) {
      // Incrementar reintentos
      const updatedQueue = getQueue()
      const idx = updatedQueue.findIndex(q => q.id === op.id)
      if (idx !== -1) {
        updatedQueue[idx].retries++
        // Si falló más de 5 veces, remover de la cola
        if (updatedQueue[idx].retries > 5) {
          updatedQueue.splice(idx, 1)
          console.warn(`[SYNC] ⚠️ Operación descartada tras 5 reintentos: ${op.description}`)
        }
        saveQueue(updatedQueue)
      }
      failed++
      console.error(`[SYNC] ❌ Error sincronizando: ${op.description}`, err)
    }
  }

  console.log(`[SYNC] Completado: ${synced} sincronizadas, ${failed} fallidas`)
  return { synced, failed }
}
