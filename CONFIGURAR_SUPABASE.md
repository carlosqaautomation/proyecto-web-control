# 🌐 Configuración de Supabase para Sincronización Multi-dispositivo

## Estado Actual
**✅ La aplicación funciona perfectamente en modo OFFLINE**  
**⚠️ Para sincronización multi-dispositivo, necesitas configurar Supabase**

---

## 📱 Funcionamiento Actual (Sin Supabase)
- ✅ **Funciona completamente offline** 
- ✅ **Guarda todos los datos localmente**
- ✅ **Sistema de respaldo completo**
- ✅ **Importar/exportar datos entre dispositivos**
- ❌ **NO sincroniza automáticamente entre dispositivos**

---

## 🚀 ¿Quieres Sincronización Automática? Configura Supabase

### Paso 1: Crear cuenta en Supabase
1. Ve a **https://supabase.com**
2. Crea una cuenta **GRATUITA** 
3. Crea un **nuevo proyecto**

### Paso 2: Obtener tus credenciales
1. En tu dashboard de Supabase → **Settings** → **API**
2. Copia tu **Project URL** (algo como: `https://abc123.supabase.co`)
3. Copia tu **anon public key** (clave larga que empieza con `eyJ...`)

### Paso 3: Configurar credenciales en el código
Edita el archivo `src/firebase.js` líneas 5-6:

**ANTES (líneas 5-6):**
```javascript
const SUPABASE_URL = 'https://wyneqgctmbpmeuiuzsbl.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_hqbIv-0rjSXK6xqHKTCZTQ_e3YaaDA6'
```

**DESPUÉS (reemplaza con tus credenciales):**
```javascript
const SUPABASE_URL = 'https://TU_PROJECT_ID.supabase.co'
const SUPABASE_ANON_KEY = 'TU_ANON_KEY_AQUI'
```

### Paso 4: Crear la tabla en Supabase
1. En Supabase, ve a **SQL Editor**
2. Crea una nueva query y pega este código:

```sql
-- Crear la tabla para Control de Balances
CREATE TABLE control_balances (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  data JSONB,
  ultima_actualizacion TIMESTAMPTZ DEFAULT NOW(),
  version BIGINT,
  device_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE control_balances ENABLE ROW LEVEL SECURITY;

-- Política de acceso (permite acceso público para simplicidad)
CREATE POLICY "Acceso público a control_balances"
ON control_balances
FOR ALL
USING (true)
WITH CHECK (true);

-- Índices para mejor rendimiento
CREATE INDEX idx_control_balances_user_id ON control_balances(user_id);
CREATE INDEX idx_control_balances_updated ON control_balances(ultima_actualizacion);
```

3. Haz clic en **RUN** para ejecutar
4. Verifica que la tabla se creó en **Table Editor**

### Paso 5: ¡Listo! 
Recarga tu aplicación y verás:

**Antes:**  
❌ `"Modo offline - usando datos locales 📱"`

**Después:**  
✅ `"Sincronizado con Supabase 🌐"`

---

## 🔄 Cómo Funciona la Sincronización

### **Offline-First (Siempre Funciona)**
1. **Guarda local primero** → Después sincroniza con Supabase
2. **Sin internet** → Sigue funcionando offline
3. **Vuelve internet** → Sincroniza automáticamente

### **Multi-dispositivo en Tiempo Real**
1. **Dispositivo A** guarda → Se sincroniza a Supabase
2. **Dispositivo B** recibe → Actualización automática
3. **Conflictos** → Resueltos automáticamente por versión más reciente

### **Indicadores de Estado**
- 🌐 **"Sincronizado con Supabase"** - Todo perfecto
- 📱 **"Modo offline"** - Sin internet, funcionando local
- 🔄 **"Sincronizando..."** - Conectando con Supabase
- 📱 **"Actualizado desde otro dispositivo"** - Recibido cambio remoto

---

## 🛠️ Solución de Problemas

### Si ves "Modo offline" después de configurar:
1. **Verifica las credenciales** en `src/firebase.js`
2. **Asegúrate de que la tabla existe** en Supabase  
3. **Revisa la consola del navegador** para errores
4. **Recarga la página** después de cambiar credenciales

### Si hay errores 404/406:
- **404:** La tabla no existe → Ejecuta el SQL del Paso 4
- **406:** Credenciales incorrectas → Verifica el Paso 3

### Para desarrollo/testing:
- Cada dispositivo genera un `user_id` único automáticamente
- Los datos se separan por `user_id` 
- Para compartir datos entre dispositivos del mismo usuario, necesitarías usar el mismo `user_id`

---

## 💡 Resumen

### ✅ **Sin Configurar Supabase:**
- Aplicación funciona perfectamente offline
- Datos guardados localmente
- Sistema de respaldo manual entre dispositivos

### 🚀 **Con Supabase Configurado:**  
- Todo lo anterior +
- **Sincronización automática** entre dispositivos
- **Actualizaciones en tiempo real**
- **Respaldo en la nube**

**¡La aplicación funciona excelente de ambas formas!** 🎉