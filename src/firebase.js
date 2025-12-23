// Configuración usando localStorage compartido simulando API
// Solución temporal hasta tener una API confiable

// Para desarrollo local, usamos una simulación de API
const API_BASE = 'https://jsonplaceholder.typicode.com'
const STORAGE_KEY = 'control-balances-shared'

export const getHeaders = () => ({
  'Content-Type': 'application/json'
})

// Simulamos una API usando localStorage como respaldo principal
export const getBinUrl = () => `${API_BASE}/posts/1`
export const getStorageKey = () => STORAGE_KEY

// Configuración por defecto
export const defaultConfig = {
  registros: {},
  ultimaActualizacion: new Date().toISOString(),
  version: 1
}