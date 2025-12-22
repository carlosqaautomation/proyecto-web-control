# Control de Balances: Tienda & Alquiler de Campo Sintético

Aplicación **web** responsive para registrar y controlar los balances diarios de una tienda y el alquiler de un campo sintético. 100% frontend, lista para desplegar en **GitHub Pages** con Vue.js.

---

## **Características**

- **Registro de ingresos diarios**, separados por:
  - **Concepto**: alquiler y consumo (tienda)
  - **Tipo de pago**: efectivo y Yape (acepta decimales)
- **Registro de gastos extra** (ej: pasajes, otros)
- **Cálculo automático del saldo final diario**
- **Resumen detallado en tiempo real** durante el registro
- **Visualización y edición de registros diarios**
- **Sistema de protección de datos guardados** con modo bloqueado/edición
- **Filtrado por rango de fechas**
- **Resumen mensual** con botón actualizar y navegación rápida
- **Persistencia de datos** en `localStorage`
- **Exportar** e **importar** datos en archivo JSON
- **Interfaz responsive** y moderna: uso cómodo en celulares y PC
- **Indicadores visuales inteligentes** (Hoy, Guardado, Nuevo)

---

## **Nuevas Funcionalidades Avanzadas**

### **🔒 Sistema de Protección de Datos**
- **Formulario inteligente**: Se limpia automáticamente al cambiar fecha si no hay datos
- **Modo bloqueado**: Los datos guardados se protegen automáticamente
- **Botón "Editar Registro"**: Habilita la modificación de datos existentes
- **Botón "Cancelar"**: Descarta cambios y restaura datos originales

### **📅 Calendario Mejorado**
- **Selector de fecha elegante** con gradientes y animaciones
- **Badges informativos**:
  - 🟢 **"Hoy"** - Fecha actual con animación pulse
  - 🔵 **"Guardado"** - Ya existe registro para esa fecha
  - 🟡 **"Nuevo"** - Sin registro, formulario limpio

### **📊 Resumen Mensual Avanzado**
- **Botón "Actualizar"** 🔄 para refrescar datos manualmente
- **Botón "Mes Actual"** 📅 navegación rápida al presente
- **Selector elegante** con indicador de mes actual
- **Animaciones** para mes presente

### **🎯 Resumen Diario Detallado**
- **4 tarjetas informativas**:
  - Alquiler Total (desglose efectivo/Yape)
  - Consumo Total (desglose efectivo/Yape)
  - Ingresos Totales
  - Gastos Extra
- **Saldo final** con indicador ganancia/pérdida
- **Actualización en tiempo real** mientras escribes

---

## **Estructura de datos (ejemplo en JSON)**

```json
{
  "2025-06-12": {
    "ingresos": {
      "alquiler": { "efectivo": 120.50, "yape": 48.00 },
      "consumo":  { "efectivo": 83.75,  "yape": 33.20 }
    },
    "gastosExtras": 19.75,
    "saldoFinal": 265.70
  }
}
```

---

## **Subida a GitHub y Deploy en GitHub Pages**

### **1. Preparar el Repositorio Local**

```bash
# Inicializar Git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "feat: Aplicación completa de Control de Balances"
```

### **2. Crear Repositorio en GitHub**
1. Ve a [GitHub.com](https://github.com) y crea un **nuevo repositorio**
2. Nombre sugerido: `control-balances` o `proyecto-web-control`
3. **NO inicializar** con README (ya tienes archivos locales)
4. Copia la URL del repositorio

### **3. Conectar Local con GitHub**

```bash
# Conectar con el repositorio remoto
git remote add origin https://github.com/TU-USUARIO/NOMBRE-REPOSITORIO.git

# Cambiar a branch main (si es necesario)
git branch -M main

# Subir archivos a GitHub
git push -u origin main
```

### **4. Configurar GitHub Pages**

#### **Opción A: Deploy Automático (Recomendado)**
El proyecto ya incluye **GitHub Actions** configurado:

1. Ve a tu repositorio en GitHub
2. Clic en **Settings** → **Pages**
3. En **Source**, selecciona **GitHub Actions**
4. ¡Listo! Cada push desplegará automáticamente

#### **Opción B: Deploy Manual**
```bash
# Compilar para producción
npm install
npm run build

# El contenido de /dist está listo para GitHub Pages
```

### **5. Acceder a tu Aplicación**
- **URL**: `https://TU-USUARIO.github.io/NOMBRE-REPOSITORIO/`
- **Tiempo**: 2-5 minutos después del push

---

## **¿Cómo se usa?**

### **📝 Registro Diario**
1. **Selecciona la fecha** (por defecto abre en "hoy")
2. **Badges informativos**:
   - Verde = Es hoy
   - Azul = Ya hay datos guardados (formulario bloqueado)
   - Amarillo = Fecha nueva (formulario limpio)
3. **Si hay datos guardados**: Clic en "Editar Registro" para modificar
4. **Ingresa los montos** por categoría y tipo de pago
5. **Observa el resumen** que se actualiza en tiempo real
6. **Guarda** y el formulario se bloquea automáticamente

### **📊 Historial y Filtros**
1. **Ve todos** tus registros en tabla organizada
2. **Filtra por fechas** para períodos específicos
3. **Edita/Elimina** registros directamente desde la tabla

### **📈 Resumen Mensual**
1. **Selecciona mes/año** con el selector elegante
2. **"Mes Actual"** para ir rápido al presente
3. **"Actualizar"** para recalcular datos
4. **5 métricas clave** en tarjetas visuales

### **💾 Gestión de Datos**
1. **Exporta** todos tus datos en JSON
2. **Importa** respaldos anteriores
3. **Limpia** todo si necesitas empezar de cero

---

## **Comandos de Desarrollo**

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

---

## **Stack Tecnológico**

- **Vue.js 3** (Composition API)
- **Vite** (Build tool moderno)
- **JavaScript ES6+**
- **CSS3** con gradientes y animaciones
- **localStorage** para persistencia
- **GitHub Actions** para CI/CD automático

---

## **Características Técnicas**

- ✅ **100% Frontend** - Sin servidor necesario
- ✅ **Responsive** - Móvil y desktop
- ✅ **PWA Ready** - Funciona offline
- ✅ **Performance** - Carga ultra rápida
- ✅ **Accesible** - Navegación por teclado
- ✅ **Moderno** - Últimas tecnologías web
- ✅ **Seguro** - Sin datos sensibles expuestos

---

## **Licencia**

MIT

---

*¡Aplicación completa lista para producción! 🚀*
*Desarrollada con ❤️ para un control financiero profesional*