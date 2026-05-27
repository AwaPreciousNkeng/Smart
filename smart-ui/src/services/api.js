import axios from 'axios'

// ─── Base instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
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
      localStorage.removeItem('sttms_refresh_token')
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
  login:          (email, password)  => api.post('/auth/authenticate',    { email, password }),
  register:       (data)             => api.post('/auth/register',         data),
  getMe:          (userId)           => api.get (`/users/${userId}`),
  refreshToken:   ()                 => api.post('/auth/refresh-token'),
  updateProfile:  (data)             => api.patch('/users',                data),
  uploadAvatar:   (userId, formData) => api.post(`/users/${userId}/profile-picture`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
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
  getAll:       (params)     => api.get('/incidents',             { params }),
  getById:      (id)         => api.get(`/incidents/${id}`),
  getNearby:    (lat, lon, radius) => api.get('/incidents/nearby', { params: { lat, lon, radius } }),
  getMyReported:()           => api.get('/incidents/my-reported'),
  create:       (formData)   => api.post('/incidents',            formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:       (data)       => api.patch('/incidents/update',    data),
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
}

// ════════════════════════════════════════════════════════════════════
//  VEHICLES  (matches backend VehicleController at /api/v1/vehicles)
// ════════════════════════════════════════════════════════════════════
export const vehiclesAPI = {
  getAll:          (params)        => api.get('/vehicles',                    { params }),
  getMyVehicles:   ()              => api.get('/vehicles/my-vehicles'),
  create:          (data)          => api.post('/vehicles',                   data),
  updateLocation:  (id, data)      => api.patch(`/vehicles/${id}/location`,   data),
  getTrail:        (id, params)    => api.get(`/vehicles/${id}/trail`,        { params }),
  updateStatus:    (id, status)    => api.patch(`/vehicles/${id}/status`,     { status }),
}

// ════════════════════════════════════════════════════════════════════
//  ZONES  (matches backend ZoneController at /api/v1/zones)
// ════════════════════════════════════════════════════════════════════
export const zonesAPI = {
  getAll:          (params)   => api.get('/zones',                { params }),
  getByRegion:     (region)   => api.get(`/zones/${region}`),
  getById:         (id)       => api.get(`/zones/${id}`),
  getMap:          (id)       => api.get(`/zones/${id}/map`),
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
  getById:   (id)         => api.get(`/users/${id}`),
  update:    (data)       => api.patch('/users',          data),
  uploadPic: (id, formData) => api.post(`/users/${id}/profile-picture`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

export default api
