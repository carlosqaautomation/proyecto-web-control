// Configuración de Supabase para sincronización real entre dispositivos
import { createClient } from '@supabase/supabase-js'

// 🌐 Configuración de tu proyecto Supabase
// 📍 Dashboard: https://app.supabase.com/project/wyneqgctmbpmeuiuzsbl/settings/api
const SUPABASE_URL = 'https://wyneqgctmbpmeuiuzsbl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5bmVxZ2N0bWJwbWV1aXV6c2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MjI5NjcsImV4cCI6MjA4MjA5ODk2N30.vDq_FBNTXMq69yL-XKPY1L1utrtkeOB6cYVb5XT4524' // Anon public key

// Cliente de Supabase - Se inicializa solo si las credenciales están configuradas
let supabase = null
try {
  if (SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'TU_ANON_KEY_AQUI' && SUPABASE_ANON_KEY.length > 10) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    console.log('🌐 Supabase inicializado correctamente')
  } else {
    console.log('⚠️ Credenciales de Supabase no configuradas - modo offline')
  }
} catch (error) {
  console.log('❌ Error inicializando Supabase:', error)
}

export { supabase }

// Configuración de respaldo local
const STORAGE_KEY = 'control-balances-data'

export const getStorageKey = () => STORAGE_KEY

// Configuración por defecto
export const defaultConfig = {
  registros: {},
  ultimaActualizacion: new Date().toISOString(),
  version: 1,
  deviceId: generateDeviceId()
}

// Generar ID único para el dispositivo
function generateDeviceId() {
  let deviceId = localStorage.getItem('device-id')
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    localStorage.setItem('device-id', deviceId)
  }
  return deviceId
}

// Configuración de la tabla en Supabase
export const TABLE_NAME = 'control_balances'