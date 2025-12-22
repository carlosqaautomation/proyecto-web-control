<template>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <h1>Control de Balances</h1>
      <p>Tienda & Alquiler de Campo Sintético</p>
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
            <div class="amount">S/ {{ (registro.ingresos.alquiler.efectivo + registro.ingresos.alquiler.yape).toFixed(2) }}</div>
            <small style="opacity: 0.8;">Efectivo: S/ {{ registro.ingresos.alquiler.efectivo.toFixed(2) }} | Yape: S/ {{ registro.ingresos.alquiler.yape.toFixed(2) }}</small>
          </div>
          <div class="summary-item" style="background: #764ba2; font-size: 0.9rem;">
            <h4>Consumo Total</h4>
            <div class="amount">S/ {{ (registro.ingresos.consumo.efectivo + registro.ingresos.consumo.yape).toFixed(2) }}</div>
            <small style="opacity: 0.8;">Efectivo: S/ {{ registro.ingresos.consumo.efectivo.toFixed(2) }} | Yape: S/ {{ registro.ingresos.consumo.yape.toFixed(2) }}</small>
          </div>
          <div class="summary-item" style="background: #17a2b8; font-size: 0.9rem;">
            <h4>Ingresos Totales</h4>
            <div class="amount">S/ {{ totalIngresosDia.toFixed(2) }}</div>
          </div>
          <div class="summary-item" style="background: #dc3545; font-size: 0.9rem;">
            <h4>Gastos Extra</h4>
            <div class="amount">S/ {{ registro.gastosExtras.toFixed(2) }}</div>
          </div>
        </div>
      </div>

      <!-- Saldo Final -->
      <div class="form-section" style="background: #e8f5e8; border-left-color: #28a745;">
        <h4>Saldo Final del Día</h4>
        <div class="summary-item" style="background: #28a745;">
          <h4>Saldo Neto</h4>
          <div class="amount">S/ {{ saldoFinal.toFixed(2) }}</div>
          <small style="opacity: 0.9;">{{ saldoFinal >= 0 ? 'Ganancia' : 'Pérdida' }} del día</small>
        </div>
      </div>

      <!-- Botones -->
      <div class="btn-group">
        <template v-if="modoEdicion">
          <button class="btn btn-primary" @click="guardarRegistro">
            💾 Guardar Registro
          </button>
          <button class="btn btn-secondary" @click="limpiarFormulario">
            🧹 Limpiar
          </button>
          <button 
            v-if="registros[fechaSeleccionada]" 
            class="btn btn-danger" 
            @click="cancelarEdicion"
          >
            ❌ Cancelar
          </button>
        </template>
        <template v-else>
          <button class="btn btn-primary" @click="habilitarEdicion">
            ✏️ Editar Registro
          </button>
          <button class="btn btn-secondary" @click="limpiarFormulario">
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
              <td>S/ {{ (item.ingresos.alquiler.efectivo + item.ingresos.alquiler.yape).toFixed(2) }}</td>
              <td>S/ {{ (item.ingresos.consumo.efectivo + item.ingresos.consumo.yape).toFixed(2) }}</td>
              <td>S/ {{ calcularTotalIngresos(item).toFixed(2) }}</td>
              <td>S/ {{ item.gastosExtras.toFixed(2) }}</td>
              <td class="text-success" style="font-weight: 600;">
                S/ {{ item.saldoFinal.toFixed(2) }}
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
          <div class="amount">S/ {{ resumenMensual.totalAlquiler.toFixed(2) }}</div>
        </div>
        <div class="summary-item">
          <h4>Total Consumo</h4>
          <div class="amount">S/ {{ resumenMensual.totalConsumo.toFixed(2) }}</div>
        </div>
        <div class="summary-item">
          <h4>Total Ingresos</h4>
          <div class="amount">S/ {{ resumenMensual.totalIngresos.toFixed(2) }}</div>
        </div>
        <div class="summary-item">
          <h4>Total Gastos</h4>
          <div class="amount">S/ {{ resumenMensual.totalGastos.toFixed(2) }}</div>
        </div>
        <div class="summary-item" style="background: #28a745;">
          <h4>Saldo Final Mensual</h4>
          <div class="amount">S/ {{ resumenMensual.saldoFinalMensual.toFixed(2) }}</div>
        </div>
      </div>
    </div>

    <!-- Datos -->
    <div v-if="activeTab === 'datos'" class="card">
      <h3>Gestión de Datos</h3>
      
      <div class="form-section mb-3">
        <h4>Exportar Datos</h4>
        <p style="margin-bottom: 1rem;">Descarga todos tus registros en formato JSON para crear un respaldo.</p>
        <button class="btn btn-success" @click="exportarDatos">
          Exportar Datos JSON
        </button>
      </div>

      <div class="form-section">
        <h4>Importar Datos</h4>
        <p style="margin-bottom: 1rem;">Carga un archivo JSON previamente exportado para restaurar tus datos.</p>
        <input 
          type="file" 
          accept=".json" 
          ref="archivoInput"
          @change="importarDatos"
          style="margin-bottom: 1rem;"
        >
        <br>
        <button class="btn btn-danger" @click="limpiarTodosDatos" style="margin-top: 1rem;">
          Limpiar Todos los Datos
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'

export default {
  name: 'App',
  setup() {
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

    // Configuración de tabs
    const tabs = [
      { id: 'registro', label: 'Registro Diario' },
      { id: 'historial', label: 'Historial' },
      { id: 'resumen', label: 'Resumen Mensual' },
      { id: 'datos', label: 'Datos' }
    ]

    // Computed
    const totalIngresosDia = computed(() => {
      return registro.ingresos.alquiler.efectivo + registro.ingresos.alquiler.yape +
             registro.ingresos.consumo.efectivo + registro.ingresos.consumo.yape
    })

    const saldoFinal = computed(() => {
      return totalIngresosDia.value - registro.gastosExtras
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

    // Métodos
    const cargarDatos = () => {
      const datosGuardados = localStorage.getItem('control-balances')
      if (datosGuardados) {
        registros.value = JSON.parse(datosGuardados)
      }
      aplicarFiltros()
    }

    const guardarDatos = () => {
      localStorage.setItem('control-balances', JSON.stringify(registros.value))
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
      
      alert('Registro guardado correctamente')
      aplicarFiltros()
    }

    const limpiarFormulario = () => {
      registro.ingresos.alquiler.efectivo = 0
      registro.ingresos.alquiler.yape = 0
      registro.ingresos.consumo.efectivo = 0
      registro.ingresos.consumo.yape = 0
      registro.gastosExtras = 0
      modoEdicion.value = true // Habilitar edición al limpiar
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
      if (confirm('¿Estás seguro de eliminar este registro?')) {
        delete registros.value[fecha]
        guardarDatos()
        aplicarFiltros()
      }
    }

    const calcularTotalIngresos = (item) => {
      return item.ingresos.alquiler.efectivo + item.ingresos.alquiler.yape +
             item.ingresos.consumo.efectivo + item.ingresos.consumo.yape
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
      const blob = new Blob([datos], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `control-balances-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
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
          alert('Datos importados correctamente')
        } catch (error) {
          alert('Error al importar el archivo. Verifica que sea un JSON válido.')
        }
      }
      lector.readAsText(archivo)
    }

    const limpiarTodosDatos = () => {
      if (confirm('¿Estás seguro de eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
        registros.value = {}
        guardarDatos()
        aplicarFiltros()
        alert('Todos los datos han sido eliminados')
      }
    }

    const actualizarResumen = () => {
      calcularResumenMensual()
      alert('Resumen actualizado correctamente')
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
    watch(fechaSeleccionada, () => {
      cargarRegistroExistente()
    })

    // Lifecycle
    onMounted(() => {
      cargarDatos()
      inicializarFechaActual()
      cargarRegistroExistente()
      calcularResumenMensual()
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
      
      // Computed
      saldoFinal,
      totalIngresosDia,
      esHoy,
      esMesActual,
      nombreMesSeleccionado,
      
      // Métodos
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
      cancelarEdicion
    }
  }
}
</script>