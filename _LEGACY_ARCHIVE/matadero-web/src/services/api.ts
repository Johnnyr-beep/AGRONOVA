import axios from 'axios'
import { cacheData, getCachedData, enqueueOperation } from './offlineQueue'

// ──────────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN DE URL BASE
// Usa el proxy de Vite en desarrollo (/api) o la ruta relativa en producción.
// ──────────────────────────────────────────────────────────────────────────────
let API_BASE_URL = '/api'

// Intentar leer config.json para entornos distribuidos (otros puestos de trabajo)
;(async () => {
  try {
    const res = await fetch('/config.json')
    if (res.ok) {
      const cfg = await res.json()
      if (cfg.serverUrl) {
        API_BASE_URL = cfg.serverUrl.replace(/\/$/, '') + '/api'
        console.log('[Config] URL del servidor detectada:', API_BASE_URL)
        // Actualizar la instancia de axios si la URL cambió
        axiosInstance.defaults.baseURL = API_BASE_URL
      }
    }
  } catch {
    // En desarrollo local normal, el proxy de vite.config.ts manejará '/api'
  }
})()

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
})

// ── Interceptor de REQUEST: agregar token ─────────────────────────────────────
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && !token.startsWith('OFFLINE_')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Interceptor de RESPONSE: cachear GET y manejar offline ───────────────────
axiosInstance.interceptors.response.use(
  (response) => {
    // Cachear respuestas GET para uso offline
    if (response.config.method?.toLowerCase() === 'get' && response.data) {
      const url = response.config.url ?? ''
      cacheData(url, response.data)
    }
    return response
  },
  async (error) => {
    const isNetworkError = !error.response
    const isAuthError = error.response?.status === 401 || error.response?.status === 403
    const config = error.config

    // Si es error de red O error de autenticación en una GET → devolver datos del caché
    if ((isNetworkError || isAuthError) && config?.method?.toLowerCase() === 'get') {
      const cachedData = getCachedData(config.url ?? '')
      if (cachedData) {
        console.warn(`[Offline] Sirviendo desde caché: ${config.url}`)
        return { data: cachedData, status: 200, cached: true }
      }
      // Devolver array vacío para que la UI no se rompa (nunca pantalla blanca)
      console.warn(`[Offline] Sin caché disponible, devolviendo vacío: ${config.url}`)
      return { data: [], status: 200, cached: true, offline: true }
    }

    // Si es error de red en POST/PUT/DELETE → encolar para sincronización
    if (isNetworkError && config?.method && config.method.toLowerCase() !== 'get') {
      const method = config.method.toUpperCase() as 'POST' | 'PUT' | 'DELETE' | 'PATCH'
      const url = config.url ?? ''
      const data = config.data ? JSON.parse(config.data) : undefined

      // Inferir módulo y descripción del URL
      const module = inferModule(url)
      const description = inferDescription(method, url, data)

      enqueueOperation({
        method,
        url,
        data,
        headers: config.headers as Record<string, string>,
        module,
        description,
      })

      // Retornar respuesta simulada exitosa para que la UI no muestre error
      return {
        data: { ...data, id: `TEMP_${Date.now()}`, offline: true },
        status: 202,
        offline: true,
      }
    }

    return Promise.reject(error)
  }
)

function inferModule(url: string): string {
  if (url.includes('/bascula'))           return 'Báscula'
  if (url.includes('/faena'))             return 'Faena'
  if (url.includes('/desposte'))          return 'Desposte'
  if (url.includes('/acondicionamiento')) return 'Acondicionamiento'
  if (url.includes('/despacho'))          return 'Despacho'
  if (url.includes('/auth'))              return 'Autenticación'
  return 'Sistema'
}

function inferDescription(method: string, url: string, _data: any): string {
  const module = inferModule(url)
  switch (method) {
    case 'POST':   return `Crear registro en ${module}`
    case 'PUT':    return `Actualizar registro en ${module}`
    case 'DELETE': return `Eliminar registro en ${module}`
    case 'PATCH':  return `Modificar estado en ${module}`
    default:       return `Operación ${method} en ${module}`
  }
}

// ── Servicios de Desposte ─────────────────────────────────────────────────────
export const desposteService = {
  getAllDespostes:    () => axiosInstance.get('/desposte'),
  getDesposteById:   (id: string) => axiosInstance.get(`/desposte/${id}`),
  getDespostesByCanal: (canalId: string) => axiosInstance.get(`/desposte/canal/${canalId}`),
  createDesposte:    (data: any) => axiosInstance.post('/desposte', data),
  updateDesposte:    (id: string, data: any) => axiosInstance.put(`/desposte/${id}`, data),
  deleteDesposte:    (id: string) => axiosInstance.delete(`/desposte/${id}`),
  getReporteDesposte:(fechaInicio: string, fechaFin: string) =>
    axiosInstance.get('/desposte/reportes/periodo', { params: { fechaInicio, fechaFin } }),
}

// ── Servicios de Productos ────────────────────────────────────────────────────
export const productoService = {
  getAllProductos:  () => axiosInstance.get('/producto'),
  getProductoById: (id: string) => axiosInstance.get(`/producto/${id}`),
  createProducto:  (data: any) => axiosInstance.post('/producto', data),
  updateProducto:  (id: string, data: any) => axiosInstance.put(`/producto/${id}`, data),
  deleteProducto:  (id: string) => axiosInstance.delete(`/producto/${id}`),
}

// ── Servicios de Productos Desposte ───────────────────────────────────────────
export const productoDesposteService = {
  getProductoById:        (id: string) => axiosInstance.get(`/productodesposte/${id}`),
  getProductosByDesposte: (desposteId: string) => axiosInstance.get(`/productodesposte/desposte/${desposteId}`),
  createProducto:         (data: any) => axiosInstance.post('/productodesposte', data),
  updateProducto:         (id: string, data: any) => axiosInstance.put(`/productodesposte/${id}`, data),
  deleteProducto:         (id: string) => axiosInstance.delete(`/productodesposte/${id}`),
}

// ── Servicios de Acondicionamiento ────────────────────────────────────────────
export const acondicionamientoService = {
  getAllAcondicionamientos:         () => axiosInstance.get('/acondicionamiento'),
  getAcondicionamientoById:        (id: string) => axiosInstance.get(`/acondicionamiento/${id}`),
  getAcondicionamientosByDesposte: (desposteId: string) => axiosInstance.get(`/acondicionamiento/desposte/${desposteId}`),
  createAcondicionamiento:         (data: any) => axiosInstance.post('/acondicionamiento', data),
  updateAcondicionamiento:         (id: string, data: any) => axiosInstance.put(`/acondicionamiento/${id}`, data),
  deleteAcondicionamiento:         (id: string) => axiosInstance.delete(`/acondicionamiento/${id}`),
  aprobarAcondicionamiento:        (id: string, data: any) => axiosInstance.post(`/acondicionamiento/${id}/aprobar`, data),
  getReporteAcondicionamiento:     (fechaInicio: string, fechaFin: string) =>
    axiosInstance.get('/acondicionamiento/reportes/periodo', { params: { fechaInicio, fechaFin } }),
}

// ── Servicios de Productos Acondicionados ─────────────────────────────────────
export const productoAcondicionadoService = {
  getProductoById:                 (id: string) => axiosInstance.get(`/productoacondicionado/${id}`),
  getProductosByAcondicionamiento: (acondicionamientoId: string) =>
    axiosInstance.get(`/productoacondicionado/acondicionamiento/${acondicionamientoId}`),
  createProducto:  (data: any) => axiosInstance.post('/productoacondicionado', data),
  updateProducto:  (id: string, data: any) => axiosInstance.put(`/productoacondicionado/${id}`, data),
  deleteProducto:  (id: string) => axiosInstance.delete(`/productoacondicionado/${id}`),
}

// ── Servicios de Control de Calidad ───────────────────────────────────────────
export const controlCalidadAcondicionamientoService = {
  getByAcondicionamiento: (acondicionamientoId: string) =>
    axiosInstance.get(`/controlcalidadacondicionamiento/acondicionamiento/${acondicionamientoId}`),
  realizarControlCalidad: (data: any) => axiosInstance.post('/controlcalidadacondicionamiento', data),
}

// ── Servicios de Faena ────────────────────────────────────────────────────────
export const faenaService = {
  getAllFaenas:          () => axiosInstance.get('/faena'),
  getFaenaById:         (id: string) => axiosInstance.get(`/faena/${id}`),
  getFaenasByBascula:   (basculaId: string) => axiosInstance.get(`/faena/bascula/${basculaId}`),
  getFaenasByEstado:    (estado: number) => axiosInstance.get(`/faena/estado/${estado}`),
  createFaena:          (data: any) => axiosInstance.post('/faena', data),
  updateFaena:          (id: string, data: any) => axiosInstance.put(`/faena/${id}`, data),
  deleteFaena:          (id: string) => axiosInstance.delete(`/faena/${id}`),
  rechazarFaena:        (id: string, data: any) => axiosInstance.post(`/faena/${id}/rechazar`, data),
  aprobarFaena:         (id: string) => axiosInstance.post(`/faena/${id}/aprobar`),
  marcarInsensibilizado:(id: string, data: any) => axiosInstance.post(`/faena/${id}/insensibilizar`, data),
  marcarDesangrado:     (id: string, data: any) => axiosInstance.post(`/faena/${id}/desangrar`, data),
  marcarPelado:         (id: string) => axiosInstance.post(`/faena/${id}/pelar`),
  marcarEviscerado:     (id: string) => axiosInstance.post(`/faena/${id}/eviscerar`),
  marcarDivision:       (id: string) => axiosInstance.post(`/faena/${id}/dividir`),
  getReporteFaena:      (fechaInicio: string, fechaFin: string) =>
    axiosInstance.get('/faena/reportes/periodo', { params: { fechaInicio, fechaFin } }),
}

// ── Servicios de Inspección Veterinaria ───────────────────────────────────────
export const inspeccionVeterinarioService = {
  getByFaena:          (faenaId: string) => axiosInstance.get(`/inspeccionveterinario/faena/${faenaId}`),
  registrarInspeccion: (data: any) => axiosInstance.post('/inspeccionveterinario', data),
}

// ── Servicios de Control de Bienestar Animal ──────────────────────────────────
export const controlBienestarService = {
  getByFaena:      (faenaId: string) => axiosInstance.get(`/controlbienestaranimal/faena/${faenaId}`),
  registrarControl:(data: any) => axiosInstance.post('/controlbienestaranimal', data),
}

// ── Servicios de Báscula ──────────────────────────────────
export const basculaService = {
  getAll: (params?: any) => axiosInstance.get('/bascula', { params }),
  getById: (id: string) => axiosInstance.get(`/bascula/${id}`),
  create: (data: any) => axiosInstance.post('/bascula', data),
  update: (id: string, data: any) => axiosInstance.put(`/bascula/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/bascula/${id}`),
  getReportePeriodo: (fechaInicio: string, fechaFin: string) =>
    axiosInstance.get('/bascula/reportes/periodo', { params: { fechaInicio, fechaFin } }),
  downloadReportePeriodoExcel: (fechaInicio: string, fechaFin: string) =>
    axiosInstance.get('/bascula/reportes/periodo/excel', { params: { fechaInicio, fechaFin }, responseType: 'blob' }),
}

// ── Servicios de Despacho ──────────────────────────────────
export const despachoService = {
  getAll: (params?: any) => axiosInstance.get('/despacho', { params }),
  getById: (id: string) => axiosInstance.get(`/despacho/${id}`),
  create: (data: any) => axiosInstance.post('/despacho', data),
  update: (id: string, data: any) => axiosInstance.put(`/despacho/${id}`, data),
  confirmar: (id: string) => axiosInstance.post(`/despacho/${id}/confirmar`),
  delete: (id: string) => axiosInstance.delete(`/despacho/${id}`)
}

export default axiosInstance
