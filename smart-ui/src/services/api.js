import axios from 'axios'

// ─── Base instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request interceptor — attach JWT ─────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sttms_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Response interceptor — handle 401 ───────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sttms_token')
      localStorage.removeItem('sttms_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ════════════════════════════════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════════════════════════════════
export const authAPI = {
  login:          (email, password)  => api.post('/auth/login',           { email, password }),
  register:       (data)             => api.post('/auth/register',         data),
  getMe:          ()                 => api.get ('/auth/me'),
  updateProfile:  (formData)         => api.put ('/auth/update-profile',   formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data)             => api.put ('/auth/change-password',  data),
}

// ════════════════════════════════════════════════════════════════════
//  TRAFFIC
// ════════════════════════════════════════════════════════════════════
export const trafficAPI = {
  getSummary:        ()              => api.get('/traffic'),
  getRoads:          (params)        => api.get('/traffic/roads',           { params }),
  updateRoad:        (id, data)      => api.put(`/traffic/roads/${id}`,     data),
  getLights:         (params)        => api.get('/traffic/lights',          { params }),
  updateLight:       (id, data)      => api.put(`/traffic/lights/${id}`,    data),
  emergencyAll:      (city)          => api.post('/traffic/lights/emergency', { city }),
  resetLights:       ()              => api.post('/traffic/lights/reset'),
  getStats:          (params)        => api.get('/traffic/stats',           { params }),
  recordStat:        (data)          => api.post('/traffic/stats',          data),
}

// ════════════════════════════════════════════════════════════════════
//  INCIDENTS
// ════════════════════════════════════════════════════════════════════
export const incidentsAPI = {
  getAll:    (params)     => api.get('/incidents',             { params }),
  getById:   (id)         => api.get(`/incidents/${id}`),
  getStats:  ()           => api.get('/incidents/stats'),
  create:    (formData)   => api.post('/incidents',            formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:    (id, data)   => api.put(`/incidents/${id}`,       data),
  resolve:   (id)         => api.patch(`/incidents/${id}/resolve`),
  delete:    (id)         => api.delete(`/incidents/${id}`),
}

// ════════════════════════════════════════════════════════════════════
//  SENSORS
// ════════════════════════════════════════════════════════════════════
export const sensorsAPI = {
  getAll:    (params)     => api.get('/sensors',              { params }),
  getById:   (id)         => api.get(`/sensors/${id}`),
  getStats:  ()           => api.get('/sensors/stats'),
  create:    (data)       => api.post('/sensors',             data),
  update:    (id, data)   => api.put(`/sensors/${id}`,        data),
  ping:      (id, data)   => api.post(`/sensors/${id}/ping`,  data),
  delete:    (id)         => api.delete(`/sensors/${id}`),
}

// ════════════════════════════════════════════════════════════════════
//  TRANSPORT
// ════════════════════════════════════════════════════════════════════
export const transportAPI = {
  getRoutes:       (params)   => api.get('/transport',              { params }),
  getRouteById:    (id)       => api.get(`/transport/${id}`),
  createRoute:     (data)     => api.post('/transport',             data),
  updateRoute:     (id, data) => api.put(`/transport/${id}`,        data),
  deleteRoute:     (id)       => api.delete(`/transport/${id}`),
  getVehicles:     (params)   => api.get('/transport/vehicles',     { params }),
  getVehicleById:  (id)       => api.get(`/transport/vehicles/${id}`),
  createVehicle:   (data)     => api.post('/transport/vehicles',    data),
  updateVehicle:   (id, data) => api.put(`/transport/vehicles/${id}`, data),
  deleteVehicle:   (id)       => api.delete(`/transport/vehicles/${id}`),
}

// ════════════════════════════════════════════════════════════════════
//  ALERTS
// ════════════════════════════════════════════════════════════════════
export const alertsAPI = {
  getAll:         (params)    => api.get('/alerts',              { params }),
  getById:        (id)        => api.get(`/alerts/${id}`),
  getStats:       ()          => api.get('/alerts/stats'),
  create:         (data)      => api.post('/alerts',             data),
  updateStatus:   (id, status) => api.patch(`/alerts/${id}/status`, { status }),
  delete:         (id)        => api.delete(`/alerts/${id}`),
}

// ════════════════════════════════════════════════════════════════════
//  USERS
// ════════════════════════════════════════════════════════════════════
export const usersAPI = {
  getAll:    (params)     => api.get('/users',            { params }),
  getById:   (id)         => api.get(`/users/${id}`),
  getStats:  ()           => api.get('/users/stats'),
  create:    (data)       => api.post('/users',           data),
  update:    (id, data)   => api.put(`/users/${id}`,      data),
  delete:    (id)         => api.delete(`/users/${id}`),
}

export default api
