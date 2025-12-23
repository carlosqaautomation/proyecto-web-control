// Servicio de Supabase para sincronización real entre dispositivos
import { supabase, TABLE_NAME, defaultConfig, getStorageKey } from './firebase.js'

export class SupabaseDatabaseService {
  constructor() {
    this.isOnline = navigator.onLine
    this.supabaseReady = false
    this.setupConnectionListeners()
    // No inicializar Supabase automáticamente, solo cuando se necesite
  }

  // Configurar listeners para detectar cambios de conexión
  setupConnectionListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      console.log('🌐 Conexión restaurada')
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      console.log('📴 Sin conexión')
    })
  }

  // Inicializar Supabase y crear tabla si no existe
  async initializeSupabase() {
    if (!supabase) {
      console.log('⚠️ Supabase no inicializado - usando modo offline')
      return false
    }
    
    try {
      // Verificar conectividad básica primero con timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 segundos timeout
      
      const response = await fetch(`${supabase.supabaseUrl}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('🔑 Credenciales de Supabase no válidas - usando modo offline')
          console.log('ℹ️  Para sincronización, configura tus credenciales siguiendo CONFIGURAR_SUPABASE.md')
        } else {
          console.log(`⚠️  Supabase no disponible (${response.status}) - usando modo offline`)
        }
        return false
      }

      // Intentar una consulta simple para verificar la tabla
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('id')
        .limit(1)

      if (error) {
        if (error.code === 'PGRST116' || 
            error.message.includes('relation') || 
            error.message.includes('does not exist') ||
            error.message.includes('table')) {
          console.log('📦 Tabla no existe en Supabase - modo offline')
          console.log('ℹ️  Para habilitar sincronización, crea la tabla siguiendo CONFIGURAR_SUPABASE.md')
          return false
        }
        if (error.message.includes('406') || error.message.includes('Not Acceptable')) {
          console.log('🔧 Error 406: Problema de configuración en Supabase (RLS o headers) - modo offline')
          console.log('ℹ️  Verifica las políticas RLS en la tabla control_balances')
          return false
        }
        console.log(`⚠️  Error de Supabase: ${error.message} - modo offline`)
        return false
      }
      
      console.log('✅ Conectado a Supabase exitosamente')
      return true
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('⚠️  Timeout conectando a Supabase - modo offline')
      } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_ABORTED')) {
        console.log('🔑 Credenciales incorrectas o conexión fallida - modo offline')
        console.log('ℹ️  Para sincronización, configura Supabase correctamente')
      } else {
        console.log('⚠️  Error inicializando Supabase - modo offline:', error.message)
      }
      return false
    }
  }

  // Crear registro inicial en Supabase
  async createInitialRecord() {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([
          {
            user_id: this.userId,
            data: defaultConfig.registros,
            ultima_actualizacion: new Date().toISOString(),
            version: 1,
            device_id: defaultConfig.deviceId
          }
        ])
        .select()

      if (error) throw error
      console.log('✅ Registro inicial creado en Supabase')
      return data
    } catch (error) {
      console.error('❌ Error creando registro inicial:', error)
      throw error
    }
  }

  // Guardar registros en Supabase
  async guardarRegistros(registros) {
    const timestamp = new Date().toISOString()
    const version = Date.now()
    const genericUserId = 'control_balances_user' // ID genérico

    try {
      // Solo guardar directamente en Supabase - sin localStorage
      if (this.isOnline) {
        try {
          const isConnected = await this.initializeSupabase()
          if (isConnected) {
            await this.syncToSupabase(registros, timestamp, version, genericUserId)
            console.log('☁️ Guardado en Supabase exitoso')
            return { success: true, synced: true, data: { registros, ultimaActualizacion: timestamp, version } }
          } else {
            throw new Error('No se pudo conectar a Supabase')
          }
        } catch (supabaseError) {
          console.log('❌ Error guardando en Supabase:', supabaseError.message)
          throw supabaseError
        }
      } else {
        throw new Error('Sin conexión a internet')
      }

    } catch (error) {
      console.error('❌ Error guardando:', error)
      return { success: false, error: error.message }
    }
  }

  // Sincronizar con Supabase
  async syncToSupabase(registros, timestamp, version, userId = 'control_balances_user') {
    if (!supabase) {
      throw new Error('Supabase no inicializado')
    }
    
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .upsert({
          user_id: userId,
          data: registros,
          ultima_actualizacion: timestamp,
          version: version,
          device_id: defaultConfig.deviceId
        }, { onConflict: 'user_id' })
        .select('id,user_id,data,ultima_actualizacion,version')

      if (error) throw error
      return data
    } catch (error) {
      console.error('❌ Error sincronizando con Supabase:', error)
      throw error
    }
  }

  // Cargar registros desde Supabase - todos los datos disponibles
  async cargarRegistros() {
    try {
      if (this.isOnline) {
        try {
          const isConnected = await this.initializeSupabase()
          if (!isConnected) {
            console.log('❌ No se pudo conectar a Supabase')
            return this.handleLoadResult(defaultConfig, false)
          }

          // Cargar TODOS los datos de TODOS los usuarios
          const { data: todosLosDatos, error } = await supabase
            .from(TABLE_NAME)
            .select('id,user_id,data,ultima_actualizacion,version,device_id,created_at')
            .order('created_at', { ascending: false })

          if (error && error.code !== 'PGRST116') {
            console.log('⚠️  Error cargando desde Supabase:', error.message)
            return this.handleLoadResult(defaultConfig, false)
          }

          if (todosLosDatos && todosLosDatos.length > 0) {
            // Consolidar todos los registros de todos los usuarios
            let registrosConsolidados = {}
            let totalRegistros = 0

            todosLosDatos.forEach(record => {
              console.log(`📥 Procesando datos del usuario: ${record.user_id}`)
              
              if (record.data && typeof record.data === 'object') {
                Object.keys(record.data).forEach(fecha => {
                  const registro = record.data[fecha]
                  // Solo incluir registros activos
                  if (!registro.estado || registro.estado === 'activo') {
                    // Si ya existe un registro para esta fecha, mantener el más reciente
                    if (!registrosConsolidados[fecha] || 
                        new Date(record.ultima_actualizacion) > new Date(registrosConsolidados[fecha].ultimaActualizacion)) {
                      registrosConsolidados[fecha] = {
                        ...registro,
                        usuarioOriginal: record.user_id,
                        ultimaActualizacionRegistro: record.ultima_actualizacion
                      }
                      totalRegistros++
                    }
                  }
                })
              }
            })

            const datosConsolidados = {
              registros: registrosConsolidados,
              ultimaActualizacion: new Date().toISOString(),
              version: 1
            }

            console.log(`☁️ Datos consolidados cargados: ${totalRegistros} registros de ${todosLosDatos.length} usuarios`)
            return this.handleLoadResult(datosConsolidados, true)
          } else {
            // No hay datos en absoluto
            console.log('📝 No hay datos en Supabase - empezando desde cero')
            return this.handleLoadResult(defaultConfig, true)
          }
        } catch (error) {
          console.error('❌ Error conectando a Supabase:', error)
          return this.handleLoadResult(defaultConfig, false)
        }
      } else {
        console.log('📴 Sin conexión - no hay datos disponibles')
        return this.handleLoadResult(defaultConfig, false)
      }

    } catch (error) {
      console.error('❌ Error cargando registros:', error)
      return { success: false, error: error.message }
    }
  }

  // Obtener datos locales (deshabilitado - solo Supabase)
  getLocalData() {
    // No usar localStorage - solo Supabase
    return null
  }

  // Procesar resultado de carga
  handleLoadResult(data, synced) {
    if (!data) {
      return { success: true, data: defaultConfig, synced: false }
    }

    return {
      success: true,
      data: {
        registros: data.registros || {},
        ultimaActualizacion: data.ultimaActualizacion || new Date().toISOString(),
        version: data.version || 1
      },
      synced
    }
  }

  // Marcar datos para sincronización posterior (deshabilitado)
  markForSync() {
    // No usar localStorage - solo Supabase directo
  }

  // Sincronizar cambios pendientes cuando se restaure la conexión (deshabilitado)
  async syncPendingChanges() {
    // No usar localStorage - solo Supabase directo
  }

  // Suscribirse a cambios en tiempo real
  subscribeToChanges(callback) {
    if (!this.isOnline || !supabase) {
      console.log('⚠️ Tiempo real no disponible (offline o Supabase no configurado)')
      return null
    }

    try {
      const subscription = supabase
        .channel(`realtime:${TABLE_NAME}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: TABLE_NAME
        }, (payload) => {
          console.log('🔄 Cambio detectado en tiempo real:', payload)
          if (payload.new) {
            callback({
              registros: payload.new.data || {},
              ultimaActualizacion: payload.new.ultima_actualizacion,
              version: payload.new.version
            })
          }
        })
        .subscribe()

      console.log('👁️  Suscrito a cambios en tiempo real')
      return subscription
    } catch (error) {
      console.error('❌ Error configurando tiempo real:', error)
      return null
    }
  }

  // Desuscribirse de cambios
  unsubscribe(subscription) {
    if (subscription && supabase) {
      try {
        supabase.removeChannel(subscription)
        console.log('🔕 Desuscrito de cambios en tiempo real')
      } catch (error) {
        console.log('⚠️ Error desuscribiendo:', error)
      }
    }
  }

  // Limpiar todos los datos (solo Supabase)
  async limpiarTodosDatos() {
    try {
      console.log('🗑️ Eliminando todos los datos de Supabase')
      
      if (this.isOnline) {
        const isConnected = await this.initializeSupabase()
        if (isConnected) {
          // Eliminar TODOS los datos, no solo de un usuario
          const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .neq('id', 0) // Eliminar todo (condición que siempre es true)
            
          if (error) {
            console.error('❌ Error eliminando datos de Supabase:', error)
            throw error
          }
          
          console.log('☁️ Todos los datos eliminados de Supabase')
        } else {
          throw new Error('No se pudo conectar a Supabase')
        }
      } else {
        throw new Error('Sin conexión a internet')
      }
      
      return { success: true }
    } catch (error) {
      console.error('❌ Error limpiando datos:', error)
      throw error
    }
  }

  // Método deshabilitado - no usar localStorage
  async actualizarDesdeBD() {
    return {
      success: false,
      error: 'Método deshabilitado - solo se usa Supabase directamente'
    }
  }

  // Método deshabilitado - no hay localStorage
  async eliminarRegistro(fecha) {
    return {
      success: false,
      error: 'Método deshabilitado - no hay datos locales para eliminar'
    }
  }

  // Método deshabilitado - no hay datos locales para sincronizar
  async forzarSincronizacionLocal() {
    return {
      success: false,
      error: 'No hay datos locales - solo se usa Supabase directamente'
    }
  }
}