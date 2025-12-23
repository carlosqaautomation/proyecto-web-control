// Servicio de Supabase para sincronización real entre dispositivos
import { supabase, TABLE_NAME, defaultConfig, getStorageKey } from './firebase.js'

export class SupabaseDatabaseService {
  constructor() {
    this.isOnline = navigator.onLine
    this.userId = this.getUserId()
    this.supabaseReady = false
    this.setupConnectionListeners()
    // No inicializar Supabase automáticamente, solo cuando se necesite
  }

  // Generar o recuperar ID de usuario único
  getUserId() {
    let userId = localStorage.getItem('user-id')
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 12) + '_' + Date.now()
      localStorage.setItem('user-id', userId)
    }
    return userId
  }

  // Configurar listeners para detectar cambios de conexión
  setupConnectionListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      console.log('🌐 Conexión restaurada - sincronizando...')
      this.syncPendingChanges()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      console.log('📴 Sin conexión - trabajando offline')
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

    try {
      // Siempre guardar en localStorage primero (offline-first)
      const localData = {
        registros,
        ultimaActualizacion: timestamp,
        version,
        deviceId: defaultConfig.deviceId
      }
      
      localStorage.setItem(getStorageKey(), JSON.stringify(localData))
      console.log('💾 Guardado local exitoso')

      // Solo intentar Supabase si está online y inicializado
      if (this.isOnline) {
        try {
          const isConnected = await this.initializeSupabase()
          if (isConnected) {
            await this.syncToSupabase(registros, timestamp, version)
            console.log('☁️ Sincronización con Supabase exitosa')
            return { success: true, synced: true, data: localData }
          }
        } catch (supabaseError) {
          console.log('⚠️  Error sincronizando con Supabase:', supabaseError.message)
          // No fallar, continuar en modo offline
        }
      }
      
      // Marcar para sincronización posterior si no se pudo sincronizar
      this.markForSync()
      console.log('📴 Guardado offline - se sincronizará cuando sea posible')
      return { success: true, synced: false, data: localData }

    } catch (error) {
      console.error('❌ Error guardando:', error)
      return { success: false, error: error.message }
    }
  }

  // Sincronizar con Supabase
  async syncToSupabase(registros, timestamp, version) {
    if (!supabase) {
      throw new Error('Supabase no inicializado')
    }
    
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .upsert({
          user_id: this.userId,
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

  // Cargar registros desde Supabase
  async cargarRegistros() {
    try {
      // Cargar datos locales primero
      const localData = this.getLocalData()
      
      // Solo intentar Supabase si está online
      if (this.isOnline) {
        try {
          const isConnected = await this.initializeSupabase()
          if (!isConnected) {
            console.log('📱 Modo offline - usando datos locales')
            return this.handleLoadResult(localData, false)
          }

          const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('id,user_id,data,ultima_actualizacion,version,device_id,created_at')
            .eq('user_id', this.userId)
            .maybeSingle()

          if (error && error.code !== 'PGRST116') {
            console.log('⚠️  Error cargando desde Supabase:', error.message)
            return this.handleLoadResult(localData, false)
          }

          if (data) {
            // Comparar versiones para determinar qué datos son más recientes
            const supabaseData = {
              registros: data.data || {},
              ultimaActualizacion: data.ultima_actualizacion,
              version: data.version || 1
            }

            if (!localData || supabaseData.version > localData.version) {
              // Los datos de Supabase son más recientes
              console.log('☁️ Datos de Supabase más recientes - actualizando local')
              localStorage.setItem(getStorageKey(), JSON.stringify(supabaseData))
              return this.handleLoadResult(supabaseData, true)
            } else if (localData.version > supabaseData.version) {
              // Los datos locales son más recientes - sincronizar a Supabase
              console.log('💾 Datos locales más recientes - sincronizando a Supabase')
              try {
                await this.syncToSupabase(localData.registros, localData.ultimaActualizacion, localData.version)
                return this.handleLoadResult(localData, true)
              } catch (syncError) {
                console.log('⚠️  Error sincronizando:', syncError.message)
                return this.handleLoadResult(localData, false)
              }
            } else {
              // Misma versión
              console.log('✅ Datos sincronizados')
              return this.handleLoadResult(localData, true)
            }
          } else {
            // No hay datos en Supabase, crear registro inicial
            if (localData && Object.keys(localData.registros || {}).length > 0) {
              try {
                await this.syncToSupabase(localData.registros, localData.ultimaActualizacion, localData.version)
                console.log('☁️ Datos locales sincronizados a Supabase por primera vez')
                return this.handleLoadResult(localData, true)
              } catch (syncError) {
                console.log('⚠️  Error sincronizando:', syncError.message)
                return this.handleLoadResult(localData, false)
              }
            } else {
              // No hay datos en ningún lado
              return this.handleLoadResult(defaultConfig, false)
            }
          }
        } catch (error) {
          console.error('❌ Error conectando a Supabase:', error)
          return this.handleLoadResult(localData, false)
        }
      } else {
        console.log('📴 Sin conexión - usando datos locales')
        return this.handleLoadResult(localData, false)
      }

    } catch (error) {
      console.error('❌ Error cargando registros:', error)
      return { success: false, error: error.message }
    }
  }

  // Obtener datos locales
  getLocalData() {
    try {
      const savedData = localStorage.getItem(getStorageKey())
      return savedData ? JSON.parse(savedData) : null
    } catch (error) {
      console.error('❌ Error leyendo datos locales:', error)
      return null
    }
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

  // Marcar datos para sincronización posterior
  markForSync() {
    localStorage.setItem('pending-sync', 'true')
  }

  // Sincronizar cambios pendientes cuando se restaure la conexión
  async syncPendingChanges() {
    if (localStorage.getItem('pending-sync') === 'true') {
      try {
        const localData = this.getLocalData()
        if (localData) {
          await this.syncToSupabase(localData.registros, localData.ultimaActualizacion, localData.version)
          localStorage.removeItem('pending-sync')
          console.log('✅ Sincronización pendiente completada')
        }
      } catch (error) {
        console.error('❌ Error en sincronización pendiente:', error)
      }
    }
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
          table: TABLE_NAME,
          filter: `user_id=eq.${this.userId}`
        }, (payload) => {
          console.log('🔄 Cambio detectado en tiempo real:', payload)
          if (payload.new && payload.new.device_id !== defaultConfig.deviceId) {
            // Solo procesar cambios de otros dispositivos
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

  // Limpiar todos los datos
  async limpiarTodosDatos() {
    try {
      // Limpiar datos locales
      localStorage.removeItem(getStorageKey())
      localStorage.removeItem('pending-sync')
      
      // Si hay conexión y Supabase disponible, limpiar datos en Supabase
      if (this.isOnline && supabase) {
        try {
          const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('user_id', this.userId)

          if (error) throw error
          console.log('☁️ Datos limpiados en Supabase')
        } catch (supabaseError) {
          console.log('⚠️  Error limpiando Supabase (datos locales sí fueron limpiados):', supabaseError.message)
        }
      }

      console.log('🗑️  Todos los datos limpiados')
      return { success: true }
    } catch (error) {
      console.error('❌ Error limpiando datos:', error)
      return { success: false, error: error.message }
    }
  }
}