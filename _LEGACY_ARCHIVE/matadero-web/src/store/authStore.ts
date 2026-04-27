import { create } from 'zustand'
import api from '../services/api'
import {
  cacheAuthCredentials,
  verifyOfflineCredentials,
} from '../services/offlineQueue'

// Credenciales de emergencia adicionales para acceso offline garantizado
const EMERGENCY_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    user: {
      id: '00000000-0000-0000-0000-000000000001',
      nombreUsuario: 'admin',
      nombre: 'Administrador',
      apellido: 'Sistema',
      email: 'admin@matadero.com',
      tipoEmpleado: 0,
    },
  },
]

interface AuthStore {
  isAuthenticated: boolean
  user: any | null
  token: string | null
  offlineMode: boolean
  login: (nombreUsuario: string, password: string) => Promise<void>
  logout: () => void
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('token'),
  offlineMode: false,

  login: async (nombreUsuario: string, password: string) => {
    try {
      // ── Intento 1: Login online con el servidor ──
      const response = await api.post('/auth/login', { nombreUsuario, password })
      const { token, usuario } = response.data

      // Guardar en localStorage + caché offline
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(usuario))
      await cacheAuthCredentials(nombreUsuario, password, usuario)

      set({ isAuthenticated: true, token, user: usuario, offlineMode: false })

    } catch (error: any) {
      console.error('[Auth] Error de servidor:', error)

      const isNetworkError = !error.response
      const isServerError  = error.response?.status >= 500

      // ── Intento 2: Login offline con credenciales cacheadas ──
      if (isNetworkError || isServerError) {
        console.warn('[Auth] Servidor no disponible. Verificando caché offline...')

        // 2a. Verificar contra hash cacheado del último login exitoso
        const cachedUser = await verifyOfflineCredentials(nombreUsuario, password)
        if (cachedUser) {
          console.warn('[Auth] ✅ Acceso offline con credenciales cacheadas:', nombreUsuario)
          const offlineToken = `OFFLINE_TOKEN_${Date.now()}`
          localStorage.setItem('token', offlineToken)
          localStorage.setItem('user', JSON.stringify(cachedUser))
          set({ isAuthenticated: true, token: offlineToken, user: cachedUser, offlineMode: true })
          return
        }

        // 2b. Verificar contra usuarios de emergencia hardcodeados
        const emergencyUser = EMERGENCY_USERS.find(
          u => u.username === nombreUsuario && u.password === password
        )
        if (emergencyUser) {
          console.warn('[Auth] ✅ Acceso de emergencia offline:', nombreUsuario)
          const offlineToken = `OFFLINE_EMERGENCY_${Date.now()}`
          localStorage.setItem('token', offlineToken)
          localStorage.setItem('user', JSON.stringify(emergencyUser.user))
          set({ isAuthenticated: true, token: offlineToken, user: emergencyUser.user, offlineMode: true })
          return
        }

        // Sin credenciales válidas offline
        throw new Error('OFFLINE_NO_CREDENTIALS')
      }

      // Error 401 u otro error del servidor → relanzar
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ isAuthenticated: false, token: null, user: null, offlineMode: false })
  },

  setToken: (token: string) => set({ token }),
}))
