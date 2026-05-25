import { createContext, useContext, useState, useCallback } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const storedUser  = localStorage.getItem('sttms_user')
  const [user,  setUser]  = useState(storedUser ? JSON.parse(storedUser) : null)
  const [error, setError] = useState('')

  const login = useCallback(async (email, password) => {
    try {
      setError('')
      const res = await authAPI.login(email, password)
      const { token, user: userData } = res.data
      localStorage.setItem('sttms_token', token)
      localStorage.setItem('sttms_user',  JSON.stringify(userData))
      setUser(userData)
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      setError(msg)
      return false
    }
  }, [])

  const register = useCallback(async (data) => {
    try {
      setError('')
      const res = await authAPI.register(data)
      const { token, user: userData } = res.data
      localStorage.setItem('sttms_token', token)
      localStorage.setItem('sttms_user',  JSON.stringify(userData))
      setUser(userData)
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      setError(msg)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('sttms_token')
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
