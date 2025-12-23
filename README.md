# Control de Balances - Con Base de Datos Gratuita

Aplicación web para el control diario de balances con **sincronización automática** entre todos los dispositivos usando JSONBin.io (100% gratuito, sin registro).

## 🚀 ¡YA ESTÁ CONFIGURADO! 

**✅ NO necesitas crear cuentas**  
**✅ NO necesitas configurar nada**  
**✅ NO necesitas pagar nada**

La aplicación está lista para usar con base de datos compartida.

## 🛠️ Instalación y Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

## ✨ Características de la Base de Datos

### 🌐 **Sincronización Automática**
- ✅ **Compartida**: Todos los usuarios ven los mismos datos
- ✅ **Actualización**: Los cambios se sincronizan cada 30 segundos
- ✅ **Offline**: Funciona sin internet usando localStorage como respaldo
- ✅ **Multi-dispositivo**: PC, móvil, tablet - todos comparten datos

### 🔄 **Estados de Conexión**
- 🟢 **Conectado**: Guardando en la nube
- 🟡 **Conectando**: Estableciendo conexión
- 🔴 **Sin conexión**: Usando datos locales
- ❌ **Error**: Problema de conexión

### 💾 **Doble Respaldo**
- **JSONBin.io**: Datos compartidos en la nube (gratuito)
- **localStorage**: Respaldo local automático

## 🎯 **¿Cómo Funciona?**

### **Datos Compartidos Globalmente:**
- ✅ **Juan agrega un registro** → Se guarda en la nube
- ✅ **María abre la app** → Ve automáticamente el registro de Juan
- ✅ **Pedro modifica algo** → Todos ven el cambio en 30 segundos
- ✅ **Sin cuentas, sin configuración, sin complicaciones**

### **Sincronización Automática:**
1. **Guardas un registro** → Se envía a la nube inmediatamente
2. **Cada 30 segundos** → La app verifica si hay cambios nuevos
3. **Si hay cambios** → Se descargan automáticamente
4. **Indicador visual** → Siempre sabes el estado de conexión

## 🔧 Tecnología Utilizada

- **JSONBin.io**: Base de datos JSON gratuita
- **Sin registro**: Usa un contenedor público compartido
- **Límites gratuitos**: 100,000 requests/mes (más que suficiente)
- **Velocidad**: Sincronización cada 30 segundos

## 🚀 Despliegue en GitHub Pages

```bash
git add .
git commit -m "feat: Base de datos gratuita configurada"
git push origin main
```

## 📊 Ventajas vs Firebase

| Característica | JSONBin.io | Firebase |
|---------------|------------|----------|
| **Costo** | 100% Gratis | Gratis con límites |
| **Configuración** | ❌ Ninguna | ✅ Requiere cuenta |
| **Registro** | ❌ No necesario | ✅ Obligatorio |
| **Tiempo real** | 30 segundos | Instantáneo |
| **Límites** | 100k requests/mes | 50k reads/día |

## 🆘 Solución de Problemas

### Error de conexión:
- La app funciona offline usando datos locales
- Los cambios se sincronizan cuando regrese la conexión

### Datos no actualizados:
- La sincronización es cada 30 segundos
- El indicador muestra el estado de conexión
- Refresca la página si hay problemas

## 📱 URL de la Aplicación

Una vez desplegada: `https://carlosqaautomation.github.io/proyecto-web-control/`

---

## 🎉 **¡LISTO PARA USAR!**

**Todos los dispositivos comparten automáticamente la misma información sin configuración adicional.**

*Base de datos configurada y funcionando 24/7 de forma gratuita! 🚀*