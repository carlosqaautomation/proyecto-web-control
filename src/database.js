import { getBinUrl, getHeaders, getStorageKey } from './firebase.js'

// Servicio de base de datos usando localStorage con sincronización simulada
export class DatabaseService {
  constructor() {
    this.pollInterval = null
    this.lastVersion = null
    this.storageKey = getStorageKey()
  }

  // Guardar todos los registros
  async guardarRegistros(registros) {
    try {
      const data = {
        registros: registros,
        ultimaActualizacion: new Date().toISOString(),
        version: Date.now()
      }

      console.log('🔄 Guardando datos:', { datos: Object.keys(registros).length })

      // Guardar en localStorage como método principal
      localStorage.setItem(this.storageKey, JSON.stringify(data))
      
      // Simular guardado en "nube" (localStorage compartido)
      const sharedKey = `${this.storageKey}-shared`
      localStorage.setItem(sharedKey, JSON.stringify(data))
      
      this.lastVersion = data.version
      console.log('✅ Datos guardados correctamente')
      
      return { success: true, data: data }
    } catch (error) {
      console.error('❌ Error guardando datos:', error)
      return { success: false, error: error.message }
    }
  }

  // Cargar todos los registros
  async cargarRegistros() {
    try {
      // Intentar cargar desde "nube" (localStorage compartido) primero
      const sharedKey = `${this.storageKey}-shared`
      let savedData = localStorage.getItem(sharedKey)
      
      // Si no hay datos compartidos, usar los locales
      if (!savedData) {
        savedData = localStorage.getItem(this.storageKey)
      }
      
      if (!savedData) {
        console.log('🔄 No hay datos guardados, usando configuración por defecto')
        return {
          success: true,
          registros: {},
          ultimaActualizacion: null
        }
      }
      
      const data = JSON.parse(savedData)
      this.lastVersion = data.version
      console.log('✅ Datos cargados:', Object.keys(data.registros || {}).length, 'registros')
      
      return {
        success: true,
        registros: data.registros || {},
        ultimaActualizacion: data.ultimaActualizacion
      }
    } catch (error) {
      console.error('❌ Error cargando datos:', error)
      return { success: false, error: error.message }
    }
  }

  // Escuchar cambios en localStorage compartido (cada 10 segundos)
  escucharCambios(callback) {
    // Polling cada 10 segundos para verificar cambios
    this.pollInterval = setInterval(() => {
      try {
        const sharedKey = `${this.storageKey}-shared`
        const savedData = localStorage.getItem(sharedKey)
        
        if (savedData) {
          const data = JSON.parse(savedData)
          
          // Solo notificar si hay cambios
          if (data.version && data.version !== this.lastVersion) {
            this.lastVersion = data.version
            console.log('🔄 Cambios detectados, actualizando datos')
            callback({
              registros: data.registros || {},
              ultimaActualizacion: data.ultimaActualizacion
            })
          }
        }
      } catch (error) {
        console.error('❌ Error en polling:', error)
      }
    }, 10000) // 10 segundos

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

  // Verificar estado de conexión (localStorage siempre disponible)
  async verificarConexion() {
    try {
      // localStorage siempre está disponible
      localStorage.setItem('test-connection', 'ok')
      localStorage.removeItem('test-connection')
      return true
    } catch (error) {
      return false
    }
  }
}