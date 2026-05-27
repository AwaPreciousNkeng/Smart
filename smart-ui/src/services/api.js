import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sttms_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

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

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:          (email, password)  => api.post('/auth/authenticate',  { email, password }),
  register:       (data)             => api.post('/auth/register',       data),
  createAdmin:    (data)             => api.post('/auth/admin',          data),
  createUser:     (data)             => api.post('/auth/create-user',    data),
  getMe:          (userId)           => api.get (`/users/${userId}`),
  refreshToken:   ()                 => api.post('/auth/refresh-token'),
  changePassword: (data)             => api.put ('/auth/change-password', data),
}

// ── USERS ─────────────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll:    ()              => api.get('/users'),
  getById:   (id)            => api.get(`/users/${id}`),
  update:    (data)          => api.patch('/users', data),
  uploadPic: (id, formData)  => api.post(`/users/${id}/profile-picture`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

// ── INCIDENTS ─────────────────────────────────────────────────────────────────
export const incidentsAPI = {
  getAll:       (params)                => api.get('/incidents',              { params }),
  getById:      (id)                    => api.get(`/incidents/${id}`),
  getNearby:    (lat, lon, radius)      => api.get('/incidents/nearby',       { params: { lat, lon, radius } }),
  getMyReported:()                      => api.get('/incidents/my-reported'),
  create:       (formData)              => api.post('/incidents', formData,   { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:       (data)                  => api.patch('/incidents/update',     data),
}

// ── VEHICLES ──────────────────────────────────────────────────────────────────
export const vehiclesAPI = {
  getAll:         (params)        => api.get('/vehicles',                    { params }),
  getMyVehicles:  ()              => api.get('/vehicles/my-vehicles'),
  create:         (data)          => api.post('/vehicles',                   data),
  updateLocation: (id, data)      => api.patch(`/vehicles/${id}/location`,   data),
  getTrail:       (id, params)    => api.get(`/vehicles/${id}/trail`,        { params }),
  updateStatus:   (id, status)    => api.patch(`/vehicles/${id}/status`,     null, { params: { status } }),
}

// ── ZONES (map data) ──────────────────────────────────────────────────────────
export const zonesAPI = {
  getAll:      ()         => api.get('/zones'),
  getByRegion: (region)   => api.get(`/zones/${region}`),
  getMap:      (id)       => api.get(`/zones/${id}/map`),
}

export default api