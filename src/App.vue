<template>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <h1>Control de Balances</h1>
      <p>Tienda & Alquiler de Campo Sintético</p>
      
      <!-- Indicador de estado de conexión -->
      <div class="connection-status" :class="'status-' + estadoConexion">
        <div class="status-indicator">
          <span class="status-dot"></span>
          <span class="status-text">{{ mensajeConexion }}</span>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="nav-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['nav-tab', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- Registro Diario -->
    <div v-if="activeTab === 'registro'" class="card">
      <h3>Registro Diario</h3>
      
      <!-- Indicador de estado del formulario -->
      <div v-if="!modoEdicion && registros[fechaSeleccionada]" class="form-status-banner">
        <div class="status-message">
          <span class="status-icon">🔒</span>
          <strong>Registro Guardado</strong> - Los datos están protegidos. Haz clic en "Editar Registro" para modificarlos.
        </div>
      </div>
      
      <!-- Selector de Fecha Mejorado -->
      <div class="date-selector-container">
        <div class="date-selector">
          <div class="date-label">
            <i class="calendar-icon">📅</i>
            <span>Fecha del Registro</span>
          </div>
          <input 
            type="date" 
            id="fecha"
            v-model="fechaSeleccionada"
            class="date-input"
          >
          <div class="date-info">
            <span v-if="esHoy" class="date-badge today">Hoy</span>
            <span v-else-if="registros[fechaSeleccionada]" class="date-badge saved">Guardado</span>
            <span v-else class="date-badge new">Nuevo</span>
          </div>
        </div>
      </div>

      <!-- Ingresos -->
      <div class="form-section">
        <h4>Ingresos</h4>
        
        <!-- Alquiler -->
        <div class="form-group">
          <h5 style="margin-bottom: 1rem; color: #667eea;">Alquiler del Campo</h5>
          <div class="form-row">
            <div>
              <label>Efectivo (S/)</label>
              <input 
                type="number" 
                step="0.01" 
                v-model.number="registro.ingresos.alquiler.efectivo"
                placeholder="0.00"
                :disabled="!modoEdicion"
                :class="{ 'input-disabled': !modoEdicion }"
                inputmode="decimal"
                @focus="$event.target.select()"
              >
            </div>
            <div>
              <label>Yape (S/)</label>
              <input 
                type="number" 
                step="0.01" 
                v-model.number="registro.ingresos.alquiler.yape"
                placeholder="0.00"
                :disabled="!modoEdicion"
                :class="{ 'input-disabled': !modoEdicion }"
                inputmode="decimal"
                @focus="$event.target.select()"
              >
            </div>
          </div>
        </div>

        <!-- Consumo -->
        <div class="form-group">
          <h5 style="margin-bottom: 1rem; color: #667eea;">Consumo en Tienda</h5>
          <div class="form-row">
            <div>
              <label>Efectivo (S/)</label>
              <input 
                type="number" 
                step="0.01" 
                v-model.number="registro.ingresos.consumo.efectivo"
                placeholder="0.00"
                :disabled="!modoEdicion"
                :class="{ 'input-disabled': !modoEdicion }"
                inputmode="decimal"
                @focus="$event.target.select()"
              >
            </div>
            <div>
              <label>Yape (S/)</label>
              <input 
                type="number" 
                step="0.01" 
                v-model.number="registro.ingresos.consumo.yape"
                placeholder="0.00"
                :disabled="!modoEdicion"
                :class="{ 'input-disabled': !modoEdicion }"
                inputmode="decimal"
                @focus="$event.target.select()"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Gastos Extra -->
      <div class="form-section">
        <h4>Gastos Extra</h4>
        <div class="form-row">
          <div>
            <label>Monto (S/)</label>
            <input 
              type="number" 
              step="0.01" 
              v-model.number="registro.gastosExtras"
              placeholder="0.00"
              :disabled="!modoEdicion"
              :class="{ 'input-disabled': !modoEdicion }"
              inputmode="decimal"
              @focus="$event.target.select()"
            >
          </div>
        </div>
      </div>

      <!-- Resumen del Registro -->
      <div class="form-section" style="background: #f0f8ff; border-left-color: #667eea;">
        <h4>Resumen del Día</h4>
        <div class="summary-grid">
          <div class="summary-item" style="background: #667eea; font-size: 0.9rem;">
            <h4>Alquiler Total</h4>
            <div class="amount">S/ {{ formatearDecimal(formatearNumero(registro.ingresos.alquiler.efectivo) + formatearNumero(registro.ingresos.alquiler.yape)) }}</div>
            <small style="opacity: 0.8;">Efectivo: S/ {{ formatearDecimal(registro.ingresos.alquiler.efectivo) }} | Yape: S/ {{ formatearDecimal(registro.ingresos.alquiler.yape) }}</small>
          </div>
          <div class="summary-item" style="background: #764ba2; font-size: 0.9rem;">
            <h4>Consumo Total</h4>
            <div class="amount">S/ {{ formatearDecimal(formatearNumero(registro.ingresos.consumo.efectivo) + formatearNumero(registro.ingresos.consumo.yape)) }}</div>
            <small style="opacity: 0.8;">Efectivo: S/ {{ formatearDecimal(registro.ingresos.consumo.efectivo) }} | Yape: S/ {{ formatearDecimal(registro.ingresos.consumo.yape) }}</small>
          </div>
          <div class="summary-item" style="background: #17a2b8; font-size: 0.9rem;">
            <h4>Ingresos Totales</h4>
            <div class="amount">S/ {{ formatearDecimal(totalIngresosDia) }}</div>
          </div>
          <div class="summary-item" style="background: #dc3545; font-size: 0.9rem;">
            <h4>Gastos Extra</h4>
            <div class="amount">S/ {{ formatearDecimal(registro.gastosExtras) }}</div>
          </div>
        </div>
      </div>

      <!-- Saldo Final -->
      <div class="form-section" style="background: #e8f5e8; border-left-color: #28a745;">
        <h4>Saldo Final del Día</h4>
        <div class="summary-item" style="background: #28a745;">
          <h4>Saldo Neto</h4>
          <div class="amount">S/ {{ formatearDecimal(saldoFinal) }}</div>
          <small style="opacity: 0.9;">{{ saldoFinal >= 0 ? 'Ganancia' : 'Pérdida' }} del día</small>
        </div>
      </div>

      <!-- Botones -->
      <div class="btn-group">
        <template v-if="modoEdicion">
          <button 
            class="btn btn-primary" 
            @click="guardarRegistro"
            @touchend.prevent="guardarRegistro"
            type="button"
          >
            💾 Guardar Registro
          </button>
          <button 
            class="btn btn-secondary" 
            @click="limpiarFormulario"
            @touchend.prevent="limpiarFormulario"
            type="button"
          >
            🧹 Limpiar
          </button>
          <button 
            v-if="registros[fechaSeleccionada]" 
            class="btn btn-danger" 
            @click="cancelarEdicion"
            @touchend.prevent="cancelarEdicion"
            type="button"
          >
            ❌ Cancelar
          </button>
        </template>
        <template v-else>
          <button 
            class="btn btn-primary" 
            @click="habilitarEdicion"
            @touchend.prevent="habilitarEdicion"
            type="button"
          >
            ✏️ Editar Registro
          </button>
          <button 
            class="btn btn-secondary" 
            @click="nuevoRegistro"
            @touchend.prevent="nuevoRegistro"
            type="button"
          >
            📝 Nuevo Registro
          </button>
        </template>
      </div>
    </div>

    <!-- Historial -->
    <div v-if="activeTab === 'historial'" class="card">
      <h3>Historial de Registros</h3>
      
      <!-- Filtros -->
      <div class="form-row mb-3">
        <div>
          <label>Desde:</label>
          <input type="date" v-model="filtroDesde">
        </div>
        <div>
          <label>Hasta:</label>
          <input type="date" v-model="filtroHasta">
        </div>
        <div style="display: flex; align-items: end;">
          <button class="btn btn-secondary" @click="aplicarFiltros">
            Filtrar
          </button>
        </div>
      </div>

      <!-- Tabla de registros -->
      <div v-if="Object.keys(registrosFiltrados).length > 0" style="overflow-x: auto;">
        <table class="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Alquiler</th>
              <th>Consumo</th>
              <th>Total Ingresos</th>
              <th>Gastos Extra</th>
              <th>Saldo Final</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, fecha) in registrosFiltrados" :key="fecha">
              <td>{{ formatearFecha(fecha) }}</td>
              <td>S/ {{ formatearDecimal(formatearNumero(item.ingresos.alquiler.efectivo) + formatearNumero(item.ingresos.alquiler.yape)) }}</td>
              <td>S/ {{ formatearDecimal(formatearNumero(item.ingresos.consumo.efectivo) + formatearNumero(item.ingresos.consumo.yape)) }}</td>
              <td>S/ {{ formatearDecimal(calcularTotalIngresos(item)) }}</td>
              <td>S/ {{ formatearDecimal(item.gastosExtras) }}</td>
              <td class="text-success" style="font-weight: 600;">
                S/ {{ formatearDecimal(item.saldoFinal) }}
              </td>
              <td>
                <button 
                  class="btn btn-secondary" 
                  style="padding: 0.5rem; font-size: 0.8rem;"
                  @click="editarRegistro(fecha)"
                >
                  Editar
                </button>
                <button 
                  class="btn btn-danger" 
                  style="padding: 0.5rem; font-size: 0.8rem; margin-left: 0.5rem;"
                  @click="eliminarRegistro(fecha)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-else class="text-center" style="padding: 2rem;">
        <p>{{ Object.keys(registros).length === 0 ? 'No hay registros guardados aún.' : 'No hay registros para mostrar en el rango seleccionado.' }}</p>
      </div>
    </div>

    <!-- Resumen Mensual -->
    <div v-if="activeTab === 'resumen'" class="card">
      <h3>Resumen Mensual</h3>
      
      <!-- Selector de Mes Mejorado -->
      <div class="month-selector-container">
        <div class="month-selector">
          <div class="month-label">
            <i class="calendar-icon">📊</i>
            <span>Seleccionar Mes y Año</span>
          </div>
          <div class="month-controls">
            <input 
              type="month" 
              v-model="mesSeleccionado" 
              class="month-input"
              @change="calcularResumenMensual"
            >
            <button class="btn btn-primary btn-refresh" @click="actualizarResumen">
              🔄 Actualizar
            </button>
            <button class="btn btn-secondary btn-today" @click="seleccionarMesActual">
              📅 Mes Actual
            </button>
          </div>
          <div class="month-info">
            <span v-if="esMesActual" class="month-badge current">Mes Actual</span>
            <span v-else class="month-badge other">{{ nombreMesSeleccionado }}</span>
          </div>
        </div>
      </div>

      <div v-if="resumenMensual" class="summary-grid">
        <div class="summary-item">
          <h4>Total Alquiler</h4>
          <div class="amount">S/ {{ formatearDecimal(resumenMensual.totalAlquiler) }}</div>
        </div>
        <div class="summary-item">
          <h4>Total Consumo</h4>
          <div class="amount">S/ {{ formatearDecimal(resumenMensual.totalConsumo) }}</div>
        </div>
        <div class="summary-item">
          <h4>Total Ingresos</h4>
          <div class="amount">S/ {{ formatearDecimal(resumenMensual.totalIngresos) }}</div>
        </div>
        <div class="summary-item">
          <h4>Total Gastos</h4>
          <div class="amount">S/ {{ formatearDecimal(resumenMensual.totalGastos) }}</div>
        </div>
        <div class="summary-item" style="background: #28a745;">
          <h4>Saldo Final Mensual</h4>
          <div class="amount">S/ {{ formatearDecimal(resumenMensual.saldoFinalMensual) }}</div>
        </div>
      </div>
    </div>

    <!-- Datos -->
    <div v-if="activeTab === 'datos'" class="card">
      <h3>Gestión de Datos</h3>
      
      <div class="form-section">
        <h4>Exportar Datos</h4>
        <p style="margin-bottom: 1rem;">Descarga todos tus registros en formato JSON para crear un respaldo o sincronizar con otros dispositivos.</p>
        <div v-if="ultimaActualizacion" class="sync-info">
          <small>📅 Última actualización: {{ new Date(ultimaActualizacion).toLocaleString('es-PE') }}</small>
        </div>
        <button class="btn btn-success" @click="exportarDatos">
          📤 Exportar Datos JSON
        </button>
      </div>

      <div class="form-section">
        <h4>Importar Datos</h4>
        <p style="margin-bottom: 1rem;">Carga un archivo JSON previamente exportado para sincronizar datos entre dispositivos o restaurar un respaldo.</p>
        <input 
          type="file" 
          accept=".json" 
          ref="archivoInput"
          @change="importarDatos"
          style="margin-bottom: 1rem;"
        >
        <div class="sync-tips">
          <small>💡 <strong>Tip:</strong> Para sincronizar entre móvil y PC, exporta desde un dispositivo e importa en el otro.</small>
        </div>
        <br>
        <button class="btn btn-danger" @click="limpiarTodosDatos" style="margin-top: 1rem;">
          🗑️ Limpiar Todos los Datos
        </button>
      </div>
    </div>
  </div>

  <!-- Modal Personalizado -->
  <div v-if="modal.mostrar" class="modal-overlay" @click="cerrarModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header" :class="'modal-' + modal.tipo">
        <h3>{{ modal.titulo }}</h3>
        <button class="modal-close" @click="cerrarModal">×</button>
      </div>
      <div class="modal-body">
        <div class="modal-icon" :class="'icon-' + modal.tipo">
          <span v-if="modal.tipo === 'success'">✓</span>
          <span v-else-if="modal.tipo === 'error'">✕</span>
          <span v-else-if="modal.tipo === 'warning'">⚠</span>
          <span v-else>ℹ</span>
        </div>
        <p>{{ modal.mensaje }}</p>
      </div>
      <div class="modal-footer">
        <template v-if="modal.onConfirm">
          <button class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
          <button class="btn btn-primary" @click="modal.onConfirm(); cerrarModal()">Confirmar</button>
        </template>
        <template v-else>
          <button class="btn btn-primary" @click="cerrarModal">OK</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch, onUnmounted } from 'vue'
import { DatabaseService } from './database.js'

export default {
  name: 'App',
  setup() {
    // Inicializar servicio de base de datos
    const dbService = new DatabaseService()
    const estadoConexion = ref('conectando') // 'conectando', 'conectado', 'sin_conexion', 'error'
    const mensajeConexion = ref('Conectando a la base de datos...')
    // Estado reactivo
    const activeTab = ref('registro')
    const fechaSeleccionada = ref(new Date().toISOString().split('T')[0])
    const filtroDesde = ref('')
    const filtroHasta = ref('')
    const mesSeleccionado = ref(new Date().toISOString().slice(0, 7))
    
    // Datos del registro actual
    const registro = reactive({
      ingresos: {
        alquiler: { efectivo: 0, yape: 0 },
        consumo: { efectivo: 0, yape: 0 }
      },
      gastosExtras: 0
    })

    // Todos los registros
    const registros = ref({})
    const registrosFiltrados = ref({})
    const resumenMensual = ref(null)
    const modoEdicion = ref(false)
    const ultimaActualizacion = ref(null)
    
    // Estado del modal
    const modal = reactive({
      mostrar: false,
      titulo: '',
      mensaje: '',
      tipo: 'info', // 'success', 'error', 'warning', 'info'
      callback: null
    })

    // Funciones del modal
    const mostrarModal = (titulo, mensaje, tipo = 'info', callback = null) => {
      modal.titulo = titulo
      modal.mensaje = mensaje
      modal.tipo = tipo
      modal.callback = callback
      modal.mostrar = true
    }

    const cerrarModal = () => {
      modal.mostrar = false
      if (modal.callback && typeof modal.callback === 'function') {
        modal.callback()
      }
    }

    const mostrarExito = (mensaje, callback = null) => {
      mostrarModal('¡Éxito!', mensaje, 'success', callback)
    }

    const mostrarError = (mensaje, callback = null) => {
      mostrarModal('Error', mensaje, 'error', callback)
    }

    const mostrarConfirmacion = (titulo, mensaje, onConfirm, onCancel = null) => {
      modal.titulo = titulo
      modal.mensaje = mensaje
      modal.tipo = 'warning'
      modal.mostrar = true
      modal.onConfirm = onConfirm
      modal.onCancel = onCancel
    }

    // Función helper para formatear números de forma segura
    const formatearNumero = (valor) => {
      const numero = Number(valor)
      return isNaN(numero) ? 0 : numero
    }

    const formatearDecimal = (valor) => {
      const numero = formatearNumero(valor)
      return numero.toFixed(2)
    }

    // Configuración de tabs
    const tabs = [
      { id: 'registro', label: 'Registro Diario' },
      { id: 'historial', label: 'Historial' },
      { id: 'resumen', label: 'Resumen Mensual' },
      { id: 'datos', label: 'Datos' }
    ]

    // Computed
    const totalIngresosDia = computed(() => {
      const alquilerEfectivo = formatearNumero(registro.ingresos.alquiler.efectivo)
      const alquilerYape = formatearNumero(registro.ingresos.alquiler.yape)
      const consumoEfectivo = formatearNumero(registro.ingresos.consumo.efectivo)
      const consumoYape = formatearNumero(registro.ingresos.consumo.yape)
      
      return alquilerEfectivo + alquilerYape + consumoEfectivo + consumoYape
    })

    const saldoFinal = computed(() => {
      const gastos = formatearNumero(registro.gastosExtras)
      return totalIngresosDia.value - gastos
    })

    const esHoy = computed(() => {
      const hoy = new Date().toISOString().split('T')[0]
      return fechaSeleccionada.value === hoy
    })

    const esMesActual = computed(() => {
      const mesActual = new Date().toISOString().slice(0, 7)
      return mesSeleccionado.value === mesActual
    })

    const nombreMesSeleccionado = computed(() => {
      if (!mesSeleccionado.value) return ''
      const [año, mes] = mesSeleccionado.value.split('-')
      const fecha = new Date(año, mes - 1)
      return fecha.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })
    })

    // Métodos de base de datos
    const cargarDatos = async () => {
      try {
        estadoConexion.value = 'conectando'
        mensajeConexion.value = 'Cargando datos...'
        
        const resultado = await dbService.cargarRegistros()
        
        if (resultado.success) {
          registros.value = resultado.registros || {}
          ultimaActualizacion.value = resultado.ultimaActualizacion
          estadoConexion.value = 'conectado'
          mensajeConexion.value = 'Conectado'
        } else {
          // Fallback a localStorage si Firebase falla
          const datosLocales = localStorage.getItem('control-balances')
          if (datosLocales) {
            const datos = JSON.parse(datosLocales)
            registros.value = datos.registros || datos
            ultimaActualizacion.value = datos.ultimaActualizacion
          }
          estadoConexion.value = 'sin_conexion'
          mensajeConexion.value = 'Sin conexión - usando datos locales'
        }
        
        aplicarFiltros()
      } catch (error) {
        console.error('Error cargando datos:', error)
        estadoConexion.value = 'error'
        mensajeConexion.value = 'Error de conexión'
      }
    }

    const guardarDatos = async () => {
      try {
        // Guardar en Firebase
        const resultado = await dbService.guardarRegistros(registros.value)
        
        if (resultado.success) {
          estadoConexion.value = 'conectado'
          mensajeConexion.value = 'Guardado en la nube'
          
          // También guardar en localStorage como respaldo
          const datosConTimestamp = {
            ultimaActualizacion: new Date().toISOString(),
            registros: registros.value
          }
          localStorage.setItem('control-balances', JSON.stringify(datosConTimestamp))
        } else {
          throw new Error(resultado.error)
        }
      } catch (error) {
        console.error('Error guardando en Firebase:', error)
        
        // Fallback a localStorage si Firebase falla
        const datosConTimestamp = {
          ultimaActualizacion: new Date().toISOString(),
          registros: registros.value
        }
        localStorage.setItem('control-balances', JSON.stringify(datosConTimestamp))
        
        estadoConexion.value = 'sin_conexion'
        mensajeConexion.value = 'Guardado solo localmente'
      }
    }

    const cargarRegistroExistente = () => {
      const fecha = fechaSeleccionada.value
      if (registros.value[fecha]) {
        const reg = registros.value[fecha]
        registro.ingresos.alquiler.efectivo = reg.ingresos.alquiler.efectivo || 0
        registro.ingresos.alquiler.yape = reg.ingresos.alquiler.yape || 0
        registro.ingresos.consumo.efectivo = reg.ingresos.consumo.efectivo || 0
        registro.ingresos.consumo.yape = reg.ingresos.consumo.yape || 0
        registro.gastosExtras = reg.gastosExtras || 0
        modoEdicion.value = false // Bloquear cuando hay datos guardados
      } else {
        limpiarFormulario()
        modoEdicion.value = true // Permitir edición para nuevos registros
      }
    }

    const guardarRegistro = () => {
      const fecha = fechaSeleccionada.value
      const nuevoRegistro = {
        ingresos: {
          alquiler: { 
            efectivo: Number(registro.ingresos.alquiler.efectivo) || 0,
            yape: Number(registro.ingresos.alquiler.yape) || 0
          },
          consumo: { 
            efectivo: Number(registro.ingresos.consumo.efectivo) || 0,
            yape: Number(registro.ingresos.consumo.yape) || 0
          }
        },
        gastosExtras: Number(registro.gastosExtras) || 0,
        saldoFinal: saldoFinal.value
      }

      registros.value[fecha] = nuevoRegistro
      guardarDatos()
      modoEdicion.value = false // Bloquear después de guardar
      
      mostrarExito(
        `Registro guardado correctamente para el ${formatearFecha(fecha)}.\n\nSaldo final: S/ ${formatearDecimal(saldoFinal.value)}`,
        () => aplicarFiltros()
      )
    }

    const limpiarFormulario = () => {
      // Limpiar todos los campos y forzar reactividad con valores numéricos
      registro.ingresos.alquiler.efectivo = 0
      registro.ingresos.alquiler.yape = 0
      registro.ingresos.consumo.efectivo = 0
      registro.ingresos.consumo.yape = 0
      registro.gastosExtras = 0
      
      // Asegurar que está en modo edición
      modoEdicion.value = true
      
      // Forzar actualización de la interfaz
      setTimeout(() => {
        // Enfocar el primer input para mejor UX
        const primerInput = document.querySelector('input[type="number"]')
        if (primerInput) {
          primerInput.focus()
        }
      }, 100)
    }

    const nuevoRegistro = () => {
      mostrarConfirmacion(
        '¿Crear Nuevo Registro?',
        'Esto limpiará todos los campos del formulario. ¿Deseas continuar?',
        () => {
          limpiarFormulario()
          modoEdicion.value = true
        }
      )
    }

    const aplicarFiltros = () => {
      if (!filtroDesde.value && !filtroHasta.value) {
        registrosFiltrados.value = { ...registros.value }
        return
      }

      const desde = filtroDesde.value ? new Date(filtroDesde.value) : new Date('2000-01-01')
      const hasta = filtroHasta.value ? new Date(filtroHasta.value) : new Date('2099-12-31')

      const filtrados = {}
      Object.keys(registros.value).forEach(fecha => {
        const fechaRegistro = new Date(fecha)
        if (fechaRegistro >= desde && fechaRegistro <= hasta) {
          filtrados[fecha] = registros.value[fecha]
        }
      })

      registrosFiltrados.value = filtrados
    }

    const editarRegistro = (fecha) => {
      const reg = registros.value[fecha]
      fechaSeleccionada.value = fecha
      registro.ingresos.alquiler.efectivo = reg.ingresos.alquiler.efectivo
      registro.ingresos.alquiler.yape = reg.ingresos.alquiler.yape
      registro.ingresos.consumo.efectivo = reg.ingresos.consumo.efectivo
      registro.ingresos.consumo.yape = reg.ingresos.consumo.yape
      registro.gastosExtras = reg.gastosExtras
      
      activeTab.value = 'registro'
    }

    const eliminarRegistro = (fecha) => {
      mostrarConfirmacion(
        '¿Eliminar Registro?',
        `¿Estás seguro de eliminar el registro del ${formatearFecha(fecha)}? Esta acción no se puede deshacer.`,
        async () => {
          try {
            const resultado = await dbService.eliminarRegistro(fecha)
            if (resultado.success) {
              delete registros.value[fecha]
              await guardarDatos()
              aplicarFiltros()
              mostrarExito('Registro eliminado correctamente')
            } else {
              mostrarError('Error al eliminar el registro')
            }
          } catch (error) {
            // Fallback local
            delete registros.value[fecha]
            await guardarDatos()
            aplicarFiltros()
            mostrarExito('Registro eliminado (solo localmente)')
          }
        }
      )
    }

    const calcularTotalIngresos = (item) => {
      const alquilerEfectivo = formatearNumero(item.ingresos.alquiler.efectivo)
      const alquilerYape = formatearNumero(item.ingresos.alquiler.yape)
      const consumoEfectivo = formatearNumero(item.ingresos.consumo.efectivo)
      const consumoYape = formatearNumero(item.ingresos.consumo.yape)
      
      return alquilerEfectivo + alquilerYape + consumoEfectivo + consumoYape
    }

    const calcularResumenMensual = () => {
      const [año, mes] = mesSeleccionado.value.split('-')
      const registrosDelMes = Object.keys(registros.value).filter(fecha => {
        return fecha.startsWith(`${año}-${mes}`)
      })

      let totalAlquiler = 0
      let totalConsumo = 0
      let totalGastos = 0

      registrosDelMes.forEach(fecha => {
        const reg = registros.value[fecha]
        totalAlquiler += reg.ingresos.alquiler.efectivo + reg.ingresos.alquiler.yape
        totalConsumo += reg.ingresos.consumo.efectivo + reg.ingresos.consumo.yape
        totalGastos += reg.gastosExtras
      })

      const totalIngresos = totalAlquiler + totalConsumo
      const saldoFinalMensual = totalIngresos - totalGastos

      resumenMensual.value = {
        totalAlquiler,
        totalConsumo,
        totalIngresos,
        totalGastos,
        saldoFinalMensual
      }
    }

    const formatearFecha = (fecha) => {
      return new Date(fecha + 'T00:00:00').toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }

    const exportarDatos = () => {
      const datos = JSON.stringify(registros.value, null, 2)
      
      // Si el navegador soporta Web Share API (móviles)
      if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        const blob = new Blob([datos], { type: 'application/json' })
        const file = new File([blob], `control-balances-${new Date().toISOString().split('T')[0]}.json`, { type: 'application/json' })
        
        navigator.share({
          title: 'Control de Balances - Datos',
          text: 'Archivo de respaldo de datos',
          files: [file]
        }).catch(() => {
          // Si falla Web Share, usar descarga tradicional
          descargarArchivo(datos)
        })
      } else {
        // Descarga tradicional para PC
        descargarArchivo(datos)
      }
    }

    const descargarArchivo = (datos) => {
      const blob = new Blob([datos], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `control-balances-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      mostrarExito('Datos exportados correctamente. Comparte este archivo para sincronizar con otros dispositivos.')
    }

    const importarDatos = (event) => {
      const archivo = event.target.files[0]
      if (!archivo) return

      const lector = new FileReader()
      lector.onload = (e) => {
        try {
          const datos = JSON.parse(e.target.result)
          registros.value = datos
          guardarDatos()
          aplicarFiltros()
          mostrarExito('Datos importados correctamente')
        } catch (error) {
          mostrarError('Error al importar el archivo. Verifica que sea un archivo JSON válido.')
        }
      }
      lector.readAsText(archivo)
    }

    const limpiarTodosDatos = () => {
      mostrarConfirmacion(
        '¡ATENCIÓN!',
        '¿Estás seguro de eliminar TODOS los datos? Esta acción eliminará permanentemente todos los registros de todos los dispositivos y no se puede deshacer.',
        async () => {
          try {
            const resultado = await dbService.limpiarTodosDatos()
            if (resultado.success) {
              registros.value = {}
              localStorage.removeItem('control-balances')
              aplicarFiltros()
              mostrarExito('Todos los datos han sido eliminados de todos los dispositivos')
            } else {
              mostrarError('Error al eliminar datos en la nube')
            }
          } catch (error) {
            // Fallback local
            registros.value = {}
            localStorage.removeItem('control-balances')
            aplicarFiltros()
            mostrarExito('Datos eliminados localmente')
          }
        }
      )
    }

    const actualizarResumen = () => {
      calcularResumenMensual()
      mostrarExito('Resumen actualizado correctamente')
    }

    const seleccionarMesActual = () => {
      mesSeleccionado.value = new Date().toISOString().slice(0, 7)
      calcularResumenMensual()
    }

    const inicializarFechaActual = () => {
      const hoy = new Date().toISOString().split('T')[0]
      fechaSeleccionada.value = hoy
      // Si no hay registro para hoy, limpiar el formulario
      if (!registros.value[hoy]) {
        limpiarFormulario()
        modoEdicion.value = true
      } else {
        modoEdicion.value = false
      }
    }

    const habilitarEdicion = () => {
      modoEdicion.value = true
    }

    const cancelarEdicion = () => {
      cargarRegistroExistente() // Recargar los datos originales
      modoEdicion.value = false
    }

    // Watchers
    watch(fechaSeleccionada, (nuevaFecha, fechaAnterior) => {
      // Solo cargar automáticamente si no está en modo edición o si realmente cambió la fecha
      if (nuevaFecha !== fechaAnterior) {
        cargarRegistroExistente()
      }
    })

    // Lifecycle
    onMounted(async () => {
      await cargarDatos()
      inicializarFechaActual()
      cargarRegistroExistente()
      calcularResumenMensual()
      
      // Configurar listener para sincronización en tiempo real
      dbService.escucharCambios((data) => {
        if (!data.error) {
          // Solo actualizar si los datos son diferentes (evitar bucles)
          if (JSON.stringify(registros.value) !== JSON.stringify(data.registros)) {
            registros.value = data.registros
            ultimaActualizacion.value = data.ultimaActualizacion
            aplicarFiltros()
            
            // Mostrar notificación sutil de sincronización
            if (estadoConexion.value === 'conectado') {
              mensajeConexion.value = 'Datos sincronizados'
              setTimeout(() => {
                mensajeConexion.value = 'Conectado'
              }, 2000)
            }
          }
        }
      })
    })
    
    onUnmounted(() => {
      dbService.detenerListeners()
    })

    return {
      // Estado
      activeTab,
      fechaSeleccionada,
      filtroDesde,
      filtroHasta,
      mesSeleccionado,
      registro,
      registros,
      registrosFiltrados,
      resumenMensual,
      tabs,
      modoEdicion,
      ultimaActualizacion,
      estadoConexion,
      mensajeConexion,
      modal,
      
      // Computed
      saldoFinal,
      totalIngresosDia,
      esHoy,
      esMesActual,
      nombreMesSeleccionado,
      
      // Métodos
      formatearNumero,
      formatearDecimal,
      cargarRegistroExistente,
      guardarRegistro,
      limpiarFormulario,
      aplicarFiltros,
      editarRegistro,
      eliminarRegistro,
      calcularTotalIngresos,
      calcularResumenMensual,
      formatearFecha,
      exportarDatos,
      importarDatos,
      limpiarTodosDatos,
      actualizarResumen,
      seleccionarMesActual,
      inicializarFechaActual,
      habilitarEdicion,
      cancelarEdicion,
      nuevoRegistro,
      mostrarModal,
      cerrarModal,
      mostrarExito,
      mostrarError,
      mostrarConfirmacion,
      descargarArchivo
    }
  }
}
</script>