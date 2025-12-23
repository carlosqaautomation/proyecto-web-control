import { getBinUrl, getHeaders, defaultConfig } from './firebase.js'

// Servicio de base de datos usando JSONBin.io (100% gratuito, sin registro)
export class DatabaseService {
  constructor() {
    this.pollInterval = null
    this.lastVersion = null
  }

  // Guardar todos los registros
  async guardarRegistros(registros) {
    try {
      const data = {
        registros: registros,
        ultimaActualizacion: new Date().toISOString(),
        version: Date.now()
      }

      const response = await fetch(getBinUrl(), {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      this.lastVersion = data.version
      
      return { success: true, data: result }
    } catch (error) {
      console.error('Error guardando en JSONBin:', error)
      return { success: false, error: error.message }
    }
  }

  // Cargar todos los registros
  async cargarRegistros() {
    try {
      const response = await fetch(`${getBinUrl()}/latest`, {
        method: 'GET',
        headers: getHeaders()
      })

      if (!response.ok) {
        if (response.status === 404) {
          // El bin no existe, usar configuración por defecto
          return {
            success: true,
            registros: {},
            ultimaActualizacion: null
          }
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      const data = result.record || defaultConfig
      
      this.lastVersion = data.version
      
      return {
        success: true,
        registros: data.registros || {},
        ultimaActualizacion: data.ultimaActualizacion
      }
    } catch (error) {
      console.error('Error cargando desde JSONBin:', error)
      return { success: false, error: error.message }
    }
  }

  // Simular escucha de cambios mediante polling (cada 30 segundos)
  escucharCambios(callback) {
    // Polling cada 30 segundos para verificar cambios
    this.pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${getBinUrl()}/latest`, {
          method: 'GET',
          headers: getHeaders()
        })

        if (response.ok) {
          const result = await response.json()
          const data = result.record || defaultConfig
          
          // Solo notificar si hay cambios
          if (data.version && data.version !== this.lastVersion) {
            this.lastVersion = data.version
            callback({
              registros: data.registros || {},
              ultimaActualizacion: data.ultimaActualizacion
            })
          }
        }
      } catch (error) {
        console.error('Error en polling:', error)
      }
    }, 30000) // 30 segundos

    // Retornar función para detener el polling
    return () => {
      if (this.pollInterval) {
        clearInterval(this.pollInterval)
        this.pollInterval = null
      }
    }
  }

  // Detener el polling
  detenerListeners() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
  }

  // Eliminar un registro específico
  async eliminarRegistro(fecha) {
    try {
      // Primero cargar los datos actuales
      const resultado = await this.cargarRegistros()
      if (!resultado.success) {
        throw new Error('No se pudieron cargar los datos')
      }

      const registros = { ...resultado.registros }
      delete registros[fecha]
      
      // Guardar los datos actualizados
      return await this.guardarRegistros(registros)
    } catch (error) {
      console.error('Error eliminando registro:', error)
      return { success: false, error: error.message }
    }
  }

  // Limpiar todos los datos
  async limpiarTodosDatos() {
    try {
      return await this.guardarRegistros({})
    } catch (error) {
      console.error('Error limpiando datos:', error)
      return { success: false, error: error.message }
    }
  }

  // Verificar estado de conexión
  async verificarConexion() {
    try {
      const response = await fetch('https://api.jsonbin.io/v3/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.ok
    } catch (error) {
      return false
    }
  }
}