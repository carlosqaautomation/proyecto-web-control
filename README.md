# Control de Balances

Aplicación web para el control diario de balances de una tienda y alquiler de campo sintético.

## Instalación y Uso

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar en modo desarrollo:
```bash
npm run dev
```

3. Compilar para producción:
```bash
npm run build
```

## Despliegue en GitHub Pages

1. Compilar el proyecto:
```bash
npm run build
```

2. La carpeta `dist/` contiene los archivos listos para desplegar.

3. Configurar GitHub Pages para usar la carpeta `dist/` o el branch `gh-pages`.

## Características

- ✅ Registro de ingresos por concepto (alquiler/consumo) y tipo de pago (efectivo/Yape)
- ✅ Registro de gastos extra
- ✅ Cálculo automático del saldo final
- ✅ Historial con filtrado por fechas
- ✅ Resumen mensual
- ✅ Exportar/Importar datos en JSON
- ✅ Interfaz responsive
- ✅ Persistencia en localStorage

## Estructura de Datos

```json
{
  "2025-01-15": {
    "ingresos": {
      "alquiler": { "efectivo": 120.50, "yape": 48.00 },
      "consumo": { "efectivo": 83.75, "yape": 33.20 }
    },
    "gastosExtras": 19.75,
    "saldoFinal": 265.70
  }
}
```

## Tecnologías

- Vue.js 3 (Composition API)
- Vite
- JavaScript ES6+
- CSS3 (Responsive Design)
- localStorage para persistencia