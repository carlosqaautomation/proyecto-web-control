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

      <!-- Información del Trabajador -->
      <div class="form-section" style="background: #f8f9ff; border-left-color: #667eea;">
        <h4 style="color: #667eea; display: flex; align-items: center; gap: 0.5rem;">
          <span>👤</span>
          Información del Trabajador
        </h4>
        <div class="form-group">
          <label for="nombreTrabajador" style="font-weight: 600; color: #4a5568; margin-bottom: 0.5rem; display: block;">
            <span style="color: #e53e3e;">*</span> Nombre del Trabajador
          </label>
          <div style="position: relative;">
            <input 
              type="text" 
              id="nombreTrabajador"
              v-model="registro.nombreTrabajador"
              placeholder="👤 Ej: Juan Carlos Pérez"
              :disabled="!modoEdicion"
              :class="{ 'input-disabled': !modoEdicion, 'input-required': !registro.nombreTrabajador.trim() }"
              style="
                width: 100%; 
                max-width: 500px; 
                padding: 12px 16px; 
                font-size: 16px; 
                border: 2px solid #e2e8f0; 
                border-radius: 8px; 
                transition: all 0.3s ease;
                background: white;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              "
              @focus="$event.target.style.borderColor = '#667eea'; $event.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'"
              @blur="$event.target.style.borderColor = '#e2e8f0'; $event.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'"
            >
            <div v-if="!modoEdicion && registro.nombreTrabajador" class="worker-badge">
              <span class="worker-icon">✅</span>
              <span class="worker-text">Registrado por: {{ registro.nombreTrabajador }}</span>
            </div>
          </div>
          <small style="color: #718096; margin-top: 0.5rem; display: block;">
            <span style="color: #e53e3e;">*</span> Campo obligatorio - Identifica quién realizó este registro
          </small>
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
        <div style="display: flex; align-items: end; gap: 0.5rem;">
          <button class="btn btn-secondary" @click="aplicarFiltros">
            🔍 Filtrar
          </button>
          <button class="btn btn-primary" @click="actualizarDesdeBD" :disabled="estadoConexion === 'conectando'">
            {{ estadoConexion === 'conectando' ? '⏳ Actualizando...' : '🔄 Actualizar desde BD' }}
          </button>
        </div>
      </div>

      <!-- Tabla de registros -->
      <div v-if="Object.keys(registrosFiltrados).length > 0" style="overflow-x: auto;">
        <table class="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Trabajador</th>
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
              <td>{{ item.nombreTrabajador || 'Sin asignar' }}</td>
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
            <button class="btn btn-success" @click="actualizarDesdeBD" :disabled="estadoConexion === 'conectando'">
              {{ estadoConexion === 'conectando' ? '⏳' : '🌐 Desde BD' }}
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
      <h3>Gestión de Datos y Respaldos</h3>
      
      <!-- Sección de Respaldos -->
      <div class="form-section" style="background: #e3f2fd; border-left-color: #2196f3;">
        <h4>🛡️ Sistema de Respaldo Avanzado</h4>
        <p style="margin-bottom: 1rem;">Crea respaldos locales de todos tus datos para mayor seguridad.</p>
        
        <div class="backup-options">
          <div class="backup-option">
            <h5>📥 Respaldo Rápido (JSON Simple)</h5>
            <p>Descarga solo los datos en formato compatible con la importación.</p>
            <button class="btn btn-success" @click="crearRespaldoRapido">
              📤 Descargar Respaldo Simple
            </button>
          </div>
          
          <div class="backup-option">
            <h5>📦 Respaldo Completo (3 Archivos)</h5>
            <p>Descarga datos en JSON completo, JSON simple y CSV para Excel.</p>
            <button class="btn btn-primary" @click="crearRespaldoCompleto">
              📋 Crear Respaldo Completo
            </button>
          </div>
          
          <div class="backup-option">
            <h5>📊 Solo Excel (CSV)</h5>
            <p>Descarga datos en formato CSV para abrir en Excel o Google Sheets.</p>
            <button class="btn btn-secondary" @click="exportarCSV">
              📈 Descargar Excel (CSV)
            </button>
          </div>
        </div>
        
        <div class="backup-info">
          <div v-if="ultimaActualizacion" class="sync-info">
            <small>📅 Última actualización: {{ new Date(ultimaActualizacion).toLocaleString('es-PE') }}</small>
          </div>
          <div class="data-stats">
            <small>📊 Total de registros: {{ Object.keys(registros).length }}</small>
          </div>
        </div>
      </div>
      
      <!-- Sección de Importación -->
      <div class="form-section">
        <h4>📂 Restaurar desde Respaldo</h4>
        <p style="margin-bottom: 1rem;">Importa un archivo de respaldo para restaurar tus datos.</p>
        
        <div class="import-options">
          <input 
            type="file" 
            accept=".json,.csv" 
            ref="archivoRespaldo"
            @change="restaurarRespaldo"
            style="margin-bottom: 1rem;"
          >
          
          <div class="import-info">
            <small>✅ Compatible con: Respaldos JSON (completos y simples)</small><br>
            <small>✅ Formatos soportados: .json</small><br>
            <small>⚠️ Importante: Esto reemplazará todos los datos actuales</small>
          </div>
        </div>
      </div>
      
      <!-- Sección de Sincronización Manual -->
      <div class="form-section">
        <h4>🔄 Sincronización Manual</h4>
        <p style="margin-bottom: 1rem;">Herramientas para importar/exportar datos tradicionales.</p>
        
        <div class="sync-options">
          <button class="btn btn-success" @click="exportarDatos">
            📤 Exportar Datos (Clásico)
          </button>
          
          <input 
            type="file" 
            accept=".json" 
            ref="archivoInput"
            @change="importarDatos"
            style="margin: 0 1rem;"
          >
        </div>
        
        <div class="sync-tips">
          <small>💡 <strong>Tip:</strong> El respaldo completo es más seguro que la exportación clásica.</small>
        </div>
      </div>
      
      <!-- Sección de Limpieza -->
      <div class="form-section" style="background: #ffebee; border-left-color: #f44336;">
        <h4>🗑️ Limpieza de Datos</h4>
        <p style="margin-bottom: 1rem; color: #d32f2f;">⚠️ <strong>Peligro:</strong> Esta acción eliminará permanentemente todos los datos.</p>
        
        <button class="btn btn-danger" @click="limpiarTodosDatos">
          🗑️ Eliminar Todos los Datos
        </button>
        
        <div class="danger-warning">
          <small>⚠️ Se recomienda crear un respaldo antes de eliminar datos</small>
        </div>
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
import { SupabaseDatabaseService } from './supabase.js'
import { BackupService } from './backup.js'

export default {
  name: 'App',
  setup() {
    // Inicializar servicio de base de datos con Supabase
    const dbService = new SupabaseDatabaseService()
    const backupService = new BackupService()
    let realtimeSubscription = null
    const estadoConexion = ref('conectando') // 'conectando', 'conectado', 'sin_conexion', 'error'
    const mensajeConexion = ref('Iniciando aplicación...')
    // Estado reactivo
    const activeTab = ref('registro')
    const fechaSeleccionada = ref(new Date().toISOString().split('T')[0])
    const filtroDesde = ref('')
    const filtroHasta = ref('')
    const mesSeleccionado = ref(new Date().toISOString().slice(0, 7))
    
    // Datos del registro actual
    const registro = reactive({
      nombreTrabajador: '',
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
        mensajeConexion.value = 'Iniciando aplicación...'
        
        const resultado = await dbService.cargarRegistros()
        
        if (resultado.success) {
          registros.value = resultado.data.registros || {}
          ultimaActualizacion.value = resultado.data.ultimaActualizacion
          
          if (resultado.synced) {
            estadoConexion.value = 'conectado'
            mensajeConexion.value = 'Sincronizado con Supabase 🌐'
          } else {
            estadoConexion.value = 'sin_conexion'
            mensajeConexion.value = 'Funcionando offline - datos guardados localmente 💾'
          }
          
          // Configurar sincronización en tiempo real
          setupRealtimeSync()
        } else {
          estadoConexion.value = 'error'
          mensajeConexion.value = 'Error cargando datos'
          mostrarError(`Error: ${resultado.error}`)
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
        const resultado = await dbService.guardarRegistros(registros.value)
        
        if (resultado.success) {
          ultimaActualizacion.value = resultado.data.ultimaActualizacion
          
          if (resultado.synced) {
            estadoConexion.value = 'conectado'
            mensajeConexion.value = 'Sincronizado con Supabase 🌐'
          } else {
            estadoConexion.value = 'sin_conexion'
            mensajeConexion.value = 'Guardado localmente - funciona sin internet 💾'
          }
        } else {
          throw new Error(resultado.error)
        }
      } catch (error) {
        console.error('Error guardando datos:', error)
        estadoConexion.value = 'error'
        mensajeConexion.value = 'Error guardando datos'
        mostrarError(`Error: ${error.message}`)
      }
    }

    const cargarRegistroExistente = () => {
      const fecha = fechaSeleccionada.value
      if (registros.value[fecha]) {
        const reg = registros.value[fecha]
        registro.nombreTrabajador = reg.nombreTrabajador || ''
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
        nombreTrabajador: registro.nombreTrabajador || '',
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
      registro.nombreTrabajador = ''
      registro.ingresos.alquiler.efectivo = 0
      registro.ingresos.alquiler.yape = 0
      registro.ingresos.consumo.efectivo = 0
      registro.ingresos.consumo.yape = 0
      registro.gastosExtras = 0
      
      // Asegurar que está en modo edición
      modoEdicion.value = true
      
      // Forzar actualización de la interfaz
      setTimeout(() => {
        // Enfocar el campo del nombre del trabajador para mejor UX
        const nombreInput = document.querySelector('#nombreTrabajador')
        if (nombreInput) {
          nombreInput.focus()
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
      registro.nombreTrabajador = reg.nombreTrabajador || ''
      registro.ingresos.alquiler.efectivo = reg.ingresos.alquiler.efectivo
      registro.ingresos.alquiler.yape = reg.ingresos.alquiler.yape
      registro.ingresos.consumo.efectivo = reg.ingresos.consumo.efectivo
      registro.ingresos.consumo.yape = reg.ingresos.consumo.yape
      registro.gastosExtras = reg.gastosExtras
      
      activeTab.value = 'registro'
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

    const crearRespaldoRapido = async () => {
      try {
        const resultado = await backupService.createDownloadableBackup(registros.value)
        if (resultado.success) {
          mostrarExito(
            `Respaldo creado exitosamente!\n\n📄 Archivo: ${resultado.filename}\n📊 Registros: ${resultado.registros}\n💾 Tamaño: ${(resultado.size / 1024).toFixed(1)} KB`
          )
        } else {
          mostrarError('Error creando el respaldo rápido')
        }
      } catch (error) {
        console.error('Error en respaldo rápido:', error)
        mostrarError(`Error: ${error.message}`)
      }
    }

    const crearRespaldoCompleto = async () => {
      try {
        estadoConexion.value = 'conectando'
        mensajeConexion.value = 'Creando respaldo completo...'
        
        const resultado = await backupService.createCompleteBackup(registros.value)
        
        if (resultado.success) {
          const resumen = resultado.summary
          mostrarExito(
            `¡Respaldo completo creado! 🎉\n\n📦 Archivos generados: ${resultado.totalFiles}\n📊 Total registros: ${resumen.totalDias}\n💰 Ingresos totales: S/ ${resumen.ingresosTotales}\n💸 Gastos totales: S/ ${resumen.gastosTotales}\n💵 Saldo neto: S/ ${resumen.saldoNeto}\n\nRevisa tus descargas para encontrar los archivos.`
          )
        } else {
          mostrarError(`Error creando respaldo completo: ${resultado.error}`)
        }
        
        estadoConexion.value = 'conectado'
        mensajeConexion.value = 'Conectado'
      } catch (error) {
        console.error('Error en respaldo completo:', error)
        mostrarError(`Error: ${error.message}`)
        estadoConexion.value = 'conectado'
        mensajeConexion.value = 'Conectado'
      }
    }

    const exportarCSV = () => {
      try {
        const csvData = backupService.generateCSV(registros.value)
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = `control-balances-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        mostrarExito(
          `Archivo CSV creado exitosamente!\n\n📄 Archivo: ${a.download}\n📊 Registros: ${Object.keys(registros.value).length}\n\n✅ Listo para abrir en Excel o Google Sheets`
        )
      } catch (error) {
        console.error('Error exportando CSV:', error)
        mostrarError(`Error creando CSV: ${error.message}`)
      }
    }

    const restaurarRespaldo = async (event) => {
      const archivo = event.target.files[0]
      if (!archivo) return

      try {
        estadoConexion.value = 'conectando'
        mensajeConexion.value = 'Restaurando respaldo...'
        
        const resultado = await backupService.restoreFromBackup(archivo)
        
        if (resultado.success) {
          // Validar datos antes de restaurar
          const validacion = backupService.validateData(resultado.registros)
          
          if (!validacion.valid) {
            mostrarError(`Archivo inválido:\n${validacion.issues.join('\n')}`)
            return
          }
          
          // Mostrar confirmación con información del respaldo
          const metadata = resultado.metadata
          mostrarConfirmacion(
            '¿Restaurar Respaldo?',
            `¿Confirmas restaurar este respaldo?\n\n📄 Versión: ${metadata.version}\n📅 Creado: ${metadata.fechaCreacion}\n📊 Registros: ${metadata.totalRegistros}\n\n⚠️ Esto reemplazará todos los datos actuales.`,
            async () => {
              registros.value = resultado.registros
              await guardarDatos()
              aplicarFiltros()
              calcularResumenMensual()
              
              mostrarExito(
                `¡Respaldo restaurado exitosamente! 🎉\n\n📊 ${metadata.totalRegistros} registros importados\n📅 Período: ${metadata.resumen ? `${metadata.resumen.fechaInicio} a ${metadata.resumen.fechaFin}` : 'Múltiples fechas'}`
              )
            }
          )
        } else {
          mostrarError(`Error restaurando respaldo: ${resultado.error}`)
        }
        
        estadoConexion.value = 'conectado'
        mensajeConexion.value = 'Conectado'
      } catch (error) {
        console.error('Error restaurando respaldo:', error)
        mostrarError(`Error: ${error.message}`)
        estadoConexion.value = 'conectado'
        mensajeConexion.value = 'Conectado'
      } finally {
        // Limpiar input file
        event.target.value = ''
      }
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
        '¿Estás seguro de eliminar TODOS los datos? Esta acción eliminará permanentemente todos los registros de Supabase y de este dispositivo. No se puede deshacer.',
        async () => {
          try {
            const resultado = await dbService.limpiarTodosDatos()
            if (resultado.success) {
              registros.value = {}
              aplicarFiltros()
              calcularResumenMensual()
              mostrarExito('Todos los datos han sido eliminados de Supabase y del dispositivo! 🗑️')
            } else {
              mostrarError(`Error al eliminar datos: ${resultado.error}`)
            }
          } catch (error) {
            console.error('Error limpiando datos:', error)
            mostrarError(`Error: ${error.message}`)
          }
        }
      )
    }

    const actualizarResumen = () => {
      calcularResumenMensual()
      mostrarExito('Resumen actualizado correctamente')
    }

    const actualizarDesdeBD = async () => {
      try {
        estadoConexion.value = 'conectando'
        mensajeConexion.value = 'Actualizando desde base de datos...'
        
        const resultado = await dbService.actualizarDesdeBD()
        
        if (resultado.success) {
          // Actualizar los datos en la aplicación
          registros.value = resultado.data.registros || {}
          ultimaActualizacion.value = resultado.data.ultimaActualizacion
          
          // Actualizar filtros y resumen
          aplicarFiltros()
          calcularResumenMensual()
          cargarRegistroExistente() // Recargar registro actual si cambió
          
          // Actualizar estado de conexión
          if (resultado.synced) {
            estadoConexion.value = 'conectado'
            mensajeConexion.value = 'Actualizado desde Supabase 🌐'
          } else {
            estadoConexion.value = 'sin_conexion'
            mensajeConexion.value = 'Funcionando offline 💾'
          }
          
          // Mostrar mensaje de éxito
          mostrarExito(
            `¡Datos actualizados desde la BD! 🎉\n\n${resultado.message}\n\n📊 Total registros: ${Object.keys(resultado.data.registros).length}\n⏰ Última actualización: ${new Date().toLocaleString('es-PE')}`
          )
        } else {
          estadoConexion.value = 'error'
          mensajeConexion.value = 'Error de conexión con BD'
          mostrarError(`Error actualizando desde BD:\n${resultado.message || resultado.error}`)
        }
      } catch (error) {
        console.error('Error actualizando desde BD:', error)
        estadoConexion.value = 'error'
        mensajeConexion.value = 'Error de conexión'
        mostrarError(`Error: ${error.message}`)
      }
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

    // Configurar sincronización en tiempo real con Supabase
    const setupRealtimeSync = () => {
      if (realtimeSubscription) {
        dbService.unsubscribe(realtimeSubscription)
      }
      
      realtimeSubscription = dbService.subscribeToChanges((nuevosRegistros) => {
        console.log('🔄 Actualizando desde otro dispositivo:', nuevosRegistros)
        
        // Verificar si los datos son diferentes antes de actualizar
        if (JSON.stringify(registros.value) !== JSON.stringify(nuevosRegistros.registros)) {
          registros.value = nuevosRegistros.registros || {}
          ultimaActualizacion.value = nuevosRegistros.ultimaActualizacion
          aplicarFiltros()
          calcularResumenMensual()
          cargarRegistroExistente()
          
          // Mostrar notificación
          estadoConexion.value = 'conectado'
          mensajeConexion.value = 'Actualizado desde otro dispositivo! 📱'
          setTimeout(() => {
            mensajeConexion.value = 'Sincronizado con Supabase 🌐'
          }, 3000)
          
          mostrarExito('Datos actualizados desde otro dispositivo! 📱')
        }
      })
    }

    // Lifecycle
    onMounted(async () => {
      await cargarDatos()
      inicializarFechaActual()
      cargarRegistroExistente()
      calcularResumenMensual()
    })

    onUnmounted(() => {
      // Limpiar suscripción en tiempo real al cerrar la app
      if (realtimeSubscription) {
        dbService.unsubscribe(realtimeSubscription)
      }
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
      calcularTotalIngresos,
      calcularResumenMensual,
      formatearFecha,
      exportarDatos,
      importarDatos,
      limpiarTodosDatos,
      actualizarResumen,
      actualizarDesdeBD,
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
      descargarArchivo,
      crearRespaldoRapido,
      crearRespaldoCompleto,
      exportarCSV,
      restaurarRespaldo
    }
  }
}
</script>

<style scoped>
/* Estilos específicos para el input del trabajador */
.worker-badge {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 4px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  animation: slideDown 0.3s ease-out;
}

.worker-icon {
  font-size: 16px;
  animation: bounce 2s infinite;
}

.worker-text {
  flex: 1;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(-2px);
  }
}

/* Estilos para input requerido */
.input-required:not(:focus) {
  border-color: #feb2b2 !important;
  background-color: #fef5e7 !important;
}

/* Mejorar el estilo del input cuando está enfocado */
#nombreTrabajador:focus {
  outline: none;
  border-color: #667eea !important;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  background-color: #fafbff !important;
}

/* Estilo para input deshabilitado */
#nombreTrabajador.input-disabled {
  background-color: #f7fafc !important;
  border-color: #e2e8f0 !important;
  color: #4a5568 !important;
  cursor: not-allowed;
}

/* Animación suave para transiciones */
#nombreTrabajador {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Hover effect cuando está habilitado */
#nombreTrabajador:not(.input-disabled):hover {
  border-color: #a0aec0 !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
}
</style>