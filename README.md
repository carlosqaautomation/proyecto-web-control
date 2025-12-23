# Control de Balances - Con Sincronización Local

Aplicación web para el control diario de balances con **sincronización automática** entre pestañas del navegador y localStorage inteligente.

## 🚀 ¡YA ESTÁ CONFIGURADO! 

**✅ NO necesitas crear cuentas**  
**✅ NO necesitas configurar nada**  
**✅ NO necesitas internet**

La aplicación funciona completamente offline con sincronización local.

## 🛠️ Instalación y Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

## ✨ Características de Sincronización

### 🌐 **Sincronización Entre Pestañas**
- ✅ **Tiempo real**: Los cambios se sincronizan instantáneamente entre pestañas
- ✅ **Automática**: Sin necesidad de recargar la página
- ✅ **Local**: Funciona completamente offline
- ✅ **Multi-ventana**: Todas las ventanas del navegador se mantienen sincronizadas

### 🔄 **Estados de Conexión**
- 🟢 **Conectado**: Datos sincronizados correctamente
- 🟡 **Sincronizando**: Actualizando entre pestañas
- 🔴 **Local**: Usando datos locales únicamente

### 💾 **Almacenamiento Inteligente**
- **localStorage**: Datos persistentes en el navegador
- **Sincronización cruzada**: Entre pestañas y ventanas
- **Respaldo automático**: Los datos nunca se pierden

## 🎯 **¿Cómo Funciona?**

### **Sincronización Local:**
- ✅ **Abres la app en una pestaña** → Cargas tus datos
- ✅ **Abres otra pestaña** → Ve exactamente los mismos datos
- ✅ **Haces un cambio en cualquier pestaña** → Se actualiza instantáneamente en todas
- ✅ **Sin internet, sin problemas** → Todo funciona offline

### **Sincronización Automática:**
1. **Guardas un registro** → Se guarda en localStorage
2. **Otras pestañas** → Se actualizan automáticamente
3. **Indicador visual** → Muestra el estado de sincronización
4. **Persistencia** → Los datos se mantienen al cerrar y abrir

## 🔧 Tecnología Utilizada

- **localStorage**: Almacenamiento persistente del navegador
- **Storage Events**: Sincronización en tiempo real entre pestañas
- **Sin API externa**: Funciona completamente offline
- **Velocidad**: Sincronización instantánea

## 🚀 Despliegue en GitHub Pages

```bash
git add .
git commit -m "feat: Sincronización local entre pestañas"
git push origin main
```

## 📊 Ventajas de la Sincronización Local

| Característica | Sincronización Local | APIs Externas |
|---------------|------------|-------|
| **Velocidad** | Instantánea | Depende de red |
| **Confiabilidad** | 100% | Variable |
| **Internet** | No requerido | Obligatorio |
| **Límites** | Sin límites | Con restricciones |
| **Configuración** | Ninguna | Requiere setup |

## 🆘 Funcionamiento

### Entre Pestañas:
- Abre múltiples pestañas de la aplicación
- Los cambios en una se reflejan inmediatamente en las otras
- Perfecto para trabajar en diferentes ventanas

### Persistencia:
- Los datos se guardan automáticamente
- Al cerrar y abrir el navegador, todo se mantiene
- No se pierden datos jamás

## 📱 URL de la Aplicación

Una vez desplegada: `https://carlosqaautomation.github.io/proyecto-web-control/`

---

## 🎉 **¡FUNCIONA PERFECTAMENTE!**

**Sincronización instantánea entre pestañas sin necesidad de internet o configuración.**

*Aplicación 100% offline con sincronización local inteligente! 🚀*