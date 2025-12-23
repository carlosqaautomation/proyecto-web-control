// Configuración de JSONBin.io - Base de datos JSON gratuita
// No requiere cuenta de pago ni configuración compleja

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3/b'
const BIN_ID = '676915d5ad19ca34f8d9f1c6' // ID público para este proyecto
const API_KEY = '$2a$10$8vq2wQJrTQGFYG4Z2rqn7ux1p4FjqPQJ6HqP2zqM2vq8QwJrTQGF' // Clave pública

// Configuración de headers para JSONBin
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Master-Key': API_KEY
})

export const getBinUrl = () => `${JSONBIN_API_URL}/${BIN_ID}`

// Configuración por defecto
export const defaultConfig = {
  registros: {},
  ultimaActualizacion: new Date().toISOString(),
  version: 1
}