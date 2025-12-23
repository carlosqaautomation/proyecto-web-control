// Sistema de respaldo local usando archivos del proyecto
// Permite guardar y cargar datos desde archivos JSON en el proyecto

export class BackupService {
  constructor() {
    this.backupFolder = 'backup-data'
  }

  // Generar datos de respaldo con formato completo
  generateBackupData(registros) {
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      appName: 'Control de Balances',
      description: 'Respaldo automático de datos',
      totalRegistros: Object.keys(registros).length,
      fechaCreacion: new Date().toLocaleString('es-PE'),
      datos: {
        registros: registros,
        resumen: this.generateSummary(registros)
      }
    }
  }

  // Generar resumen estadístico
  generateSummary(registros) {
    const fechas = Object.keys(registros).sort()
    if (fechas.length === 0) {
      return {
        totalDias: 0,
        fechaInicio: null,
        fechaFin: null,
        ingresosTotales: 0,
        gastosTotales: 0,
        saldoNeto: 0
      }
    }

    let ingresosTotales = 0
    let gastosTotales = 0

    fechas.forEach(fecha => {
      const reg = registros[fecha]
      const ingresosAlquiler = (reg.ingresos.alquiler.efectivo || 0) + (reg.ingresos.alquiler.yape || 0)
      const ingresosConsumo = (reg.ingresos.consumo.efectivo || 0) + (reg.ingresos.consumo.yape || 0)
      ingresosTotales += ingresosAlquiler + ingresosConsumo
      gastosTotales += reg.gastosExtras || 0
    })

    return {
      totalDias: fechas.length,
      fechaInicio: fechas[0],
      fechaFin: fechas[fechas.length - 1],
      ingresosTotales: Number(ingresosTotales.toFixed(2)),
      gastosTotales: Number(gastosTotales.toFixed(2)),
      saldoNeto: Number((ingresosTotales - gastosTotales).toFixed(2))
    }
  }

  // Crear respaldo en archivo JSON descargable
  async createDownloadableBackup(registros, filename = null) {
    const backupData = this.generateBackupData(registros)
    const jsonString = JSON.stringify(backupData, null, 2)
    
    const timestamp = new Date().toISOString().split('T')[0]
    const defaultFilename = filename || `control-balances-backup-${timestamp}.json`
    
    // Crear blob y descargar
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = defaultFilename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    return {
      success: true,
      filename: defaultFilename,
      size: blob.size,
      registros: Object.keys(registros).length
    }
  }

  // Crear respaldo completo con múltiples formatos
  async createCompleteBackup(registros) {
    const backupData = this.generateBackupData(registros)
    const results = []

    try {
      // 1. Respaldo JSON principal
      const jsonResult = await this.createDownloadableBackup(registros, `backup-completo-${new Date().toISOString().split('T')[0]}.json`)
      results.push({ type: 'JSON Principal', ...jsonResult })

      // 2. Respaldo solo datos (compatible con importación)
      const datosSimples = JSON.stringify(registros, null, 2)
      const blobSimple = new Blob([datosSimples], { type: 'application/json' })
      const urlSimple = URL.createObjectURL(blobSimple)
      
      const aSimple = document.createElement('a')
      aSimple.href = urlSimple
      aSimple.download = `datos-simples-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(aSimple)
      aSimple.click()
      document.body.removeChild(aSimple)
      URL.revokeObjectURL(urlSimple)
      
      results.push({
        type: 'Datos Simples',
        success: true,
        filename: aSimple.download,
        size: blobSimple.size
      })

      // 3. Respaldo CSV para Excel
      const csvData = this.generateCSV(registros)
      const csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8' })
      const csvUrl = URL.createObjectURL(csvBlob)
      
      const aCsv = document.createElement('a')
      aCsv.href = csvUrl
      aCsv.download = `control-balances-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(aCsv)
      aCsv.click()
      document.body.removeChild(aCsv)
      URL.revokeObjectURL(csvUrl)
      
      results.push({
        type: 'CSV (Excel)',
        success: true,
        filename: aCsv.download,
        size: csvBlob.size
      })

      return {
        success: true,
        totalFiles: results.length,
        results: results,
        summary: backupData.datos.resumen
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        results: results
      }
    }
  }

  // Generar CSV para Excel
  generateCSV(registros) {
    const headers = [
      'Fecha',
      'Alquiler Efectivo',
      'Alquiler Yape', 
      'Consumo Efectivo',
      'Consumo Yape',
      'Total Alquiler',
      'Total Consumo',
      'Total Ingresos',
      'Gastos Extra',
      'Saldo Final'
    ].join(',')

    const rows = Object.keys(registros)
      .sort()
      .map(fecha => {
        const reg = registros[fecha]
        const alquilerEfectivo = reg.ingresos.alquiler.efectivo || 0
        const alquilerYape = reg.ingresos.alquiler.yape || 0
        const consumoEfectivo = reg.ingresos.consumo.efectivo || 0
        const consumoYape = reg.ingresos.consumo.yape || 0
        const totalAlquiler = alquilerEfectivo + alquilerYape
        const totalConsumo = consumoEfectivo + consumoYape
        const totalIngresos = totalAlquiler + totalConsumo
        const gastosExtra = reg.gastosExtras || 0
        const saldoFinal = totalIngresos - gastosExtra

        return [
          fecha,
          alquilerEfectivo.toFixed(2),
          alquilerYape.toFixed(2),
          consumoEfectivo.toFixed(2),
          consumoYape.toFixed(2),
          totalAlquiler.toFixed(2),
          totalConsumo.toFixed(2),
          totalIngresos.toFixed(2),
          gastosExtra.toFixed(2),
          saldoFinal.toFixed(2)
        ].join(',')
      })

    return `${headers}\n${rows.join('\n')}`
  }

  // Restaurar desde archivo de respaldo
  async restoreFromBackup(file) {
    try {
      const content = await this.readFile(file)
      const data = JSON.parse(content)
      
      // Detectar formato del archivo
      if (data.datos && data.datos.registros) {
        // Formato completo de respaldo
        return {
          success: true,
          registros: data.datos.registros,
          metadata: {
            version: data.version,
            timestamp: data.timestamp,
            totalRegistros: data.totalRegistros,
            fechaCreacion: data.fechaCreacion,
            resumen: data.datos.resumen
          }
        }
      } else if (typeof data === 'object' && !Array.isArray(data)) {
        // Formato simple de registros
        return {
          success: true,
          registros: data,
          metadata: {
            version: 'simple',
            timestamp: new Date().toISOString(),
            totalRegistros: Object.keys(data).length,
            fechaCreacion: new Date().toLocaleString('es-PE')
          }
        }
      } else {
        throw new Error('Formato de archivo no reconocido')
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Leer archivo
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = e => resolve(e.target.result)
      reader.onerror = () => reject(new Error('Error leyendo archivo'))
      reader.readAsText(file)
    })
  }

  // Validar integridad de datos
  validateData(registros) {
    const issues = []
    const fechas = Object.keys(registros)

    if (fechas.length === 0) {
      issues.push('No hay registros para validar')
      return { valid: false, issues }
    }

    fechas.forEach(fecha => {
      const reg = registros[fecha]
      
      // Validar estructura
      if (!reg.ingresos || !reg.ingresos.alquiler || !reg.ingresos.consumo) {
        issues.push(`Registro ${fecha}: Estructura de ingresos incompleta`)
      }
      
      // Validar números
      if (typeof reg.gastosExtras !== 'number' || reg.gastosExtras < 0) {
        issues.push(`Registro ${fecha}: Gastos extra inválidos`)
      }
      
      // Validar saldo final
      if (typeof reg.saldoFinal !== 'number') {
        issues.push(`Registro ${fecha}: Saldo final inválido`)
      }
    })

    return {
      valid: issues.length === 0,
      issues: issues,
      totalRegistros: fechas.length
    }
  }
}