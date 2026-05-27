import { createContext, useContext, useState, useCallback } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

// Map backend Role enum values to frontend display names
const ROLE_MAP = {
  ADMIN:           'Admin',
  USER:            'Commuter',
  MINISTRY:        'Traffic Analyst',
  TRAFFIC_OFFICER: 'Transport Operator',
}

function mapRole(backendRole) {
  return ROLE_MAP[backendRole] || backendRole
}

export function AuthProvider({ children }) {
  const storedUser  = localStorage.getItem('sttms_user')
  const [user,  setUser]  = useState(storedUser ? JSON.parse(storedUser) : null)
  const [error, setError] = useState('')

  const login = useCallback(async (email, password) => {
    try {
      setError('')
      const res = await authAPI.login(email, password)
      const { access_token, refresh_token, userId, fullName } = res.data

      // Store tokens
      localStorage.setItem('sttms_token', access_token)
      localStorage.setItem('sttms_refresh_token', refresh_token)

      // Fetch full user profile
      let userData = { id: userId, name: fullName, email, role: 'Commuter' }
      try {
        const profileRes = await authAPI.getMe(userId)
        const p = profileRes.data
        userData = {
          id:        p.id,
          name:      `${p.firstName} ${p.lastName}`,
          firstName: p.firstName,
          lastName:  p.lastName,
          email:     p.email,
          role:      mapRole(p.role),
          avatar:    p.profilePicturePath || null,
        }
      } catch (_) { /* use basic data from login response */ }

      localStorage.setItem('sttms_user', JSON.stringify(userData))
      setUser(userData)
      return true
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.error
        || 'Login failed. Please try again.'
      setError(msg)
      return false
    }
  }, [])

  const register = useCallback(async (data) => {
    try {
      setError('')
      // Backend expects { firstName, lastName, email, password }
      const payload = {
        firstName: data.firstName || data.name?.split(' ')[0] || '',
        lastName:  data.lastName  || data.name?.split(' ').slice(1).join(' ') || '',
        email:     data.email,
        password:  data.password,
      }
      await authAPI.register(payload)

      // Backend register returns 201 with no body — auto-login after registration
      return await login(data.email, data.password)
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.error
        || 'Registration failed. Please try again.'
      setError(msg)
      return false
    }
  }, [login])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('sttms_token')
    localStorage.removeItem('sttms_refresh_token')
    localStorage.removeItem('sttms_user')
  }, [])

  const updateUser = useCallback((updated) => {
    setUser(updated)
    localStorage.setItem('sttms_user', JSON.stringify(updated))
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
