# 📋 Módulo de Faena - Guía Completa

## 🎯 ¿Qué es?

El módulo de **Faena** es el corazón del sistema de gestión de matadero. Gestiona todo el proceso de sacrificio y procesamiento de animales desde que entran al establecimiento (Báscula) hasta que se envían a Desposte.

---

## 🔄 Flujo de Proceso

```
┌─────────────────────────────────────────────────────────┐
│ 1. BÁSCULA - Registra animal y peso                    │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│ 2. FAENA - Procesa el sacrificio                        │
│    ├─ Insensibilización (aturdimiento)                  │
│    ├─ Desangre (sangría)                                │
│    ├─ Pelado (removimiento de pelaje)                   │
│    ├─ Evisceración (removimiento de órganos internos)   │
│    ├─ División (corte de canales)                       │
│    └─ Inspección Veterinaria                            │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│ 3. DESPOSTE - Corta en diferentes partes                │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│ 4. ACONDICIONAMIENTO - Empaca y prepara para venta      │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│ 5. DESPACHO - Envía a cliente                           │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Estados de la Faena

La faena progresa por estos 12 estados:

| # | Estado | Descripción | Color | Rol |
|---|--------|-------------|-------|-----|
| 0 | **Pendiente** | Recién registrada | Gris | Operario |
| 1 | **Insensibilizado** | Animal aturdido | Azul | Operario |
| 2 | **Desangrado** | Completado drenaje de sangre | Verde | Operario |
| 3 | **Pelado** | Removido pelaje | Amarillo | Operario |
| 4 | **Eviscerado** | Removidos órganos internos | Naranja | Operario |
| 5 | **Dividido** | Cortes de canal completados | Rojo | Operario |
| 6 | **InspeccionPendiente** | Esperando validación veterinaria | Púrpura | Supervisor |
| 7 | **AprobadoVeterinario** | Aprobada por veterinario | Verde oscuro | Veterinario |
| 8 | **RechazadoVeterinario** | Rechazada - Decomiso | Rojo oscuro | Veterinario |
| 9 | **ListaParaDesposte** | Aprobada, lista para siguiente fase | Verde claro | Supervisor |
| 10 | **EnDesposte** | Actualmente en desposte | Cian | Sistema |
| 11 | **Completada** | Fin de proceso | Gris oscuro | Sistema |

---

## 🎮 Cómo Usar el Módulo

### 1. Acceso

```
Login → Dashboard → Menú lateral → Faena
```

### 2. Crear Nueva Faena

**Ubicación:** Panel superior del módulo

```
Formulario: Nueva Faena
├─ Báscula ID: [dropdown]        ← Selecciona báscula registrada
├─ Canal ID: [dropdown]          ← Selecciona canal disponible
├─ Número de Canal: [auto]       ← Se completa automáticamente
├─ Número de Identificación: [input] ← Número del animal
├─ Tipo de Animal: [dropdown]    ← Vacuno, Porcino, Ovino, Caprino
├─ Peso Entrada (kg): [number]   ← Peso de la báscula
└─ Botón: + Crear Faena

Botón secundario: Limpiar Formulario
```

**Ejemplo de llenado:**
```
Báscula ID: 1
Canal ID: 3
Número Canal: 001
Identificación: VR-2024-0001
Tipo: Vacuno
Peso entrada: 450
→ Clic en "Crear Faena"
```

### 3. Ver Faenas Listadas

**Tabla Principal:**
- Muestra todas las faenas del día
- Ordenable por columnas
- Filtrable por estado

| Columna | Contenido |
|---------|-----------|
| Faena # | ID único |
| Canal | Número de canal |
| Animal | Tipo de animal |
| Identificación | ID del animal |
| Peso Entrada (kg) | Peso inicial |
| Peso Canal (kg) | Peso después sacrificio |
| Estado | Estado actual (26 colores) |
| Inspección | ✓ Si aprobada |
| Acciones | Ver/Editar/Eliminar |

### 4. Progresando en Faena

**Para cada paso en la faena:**

1. Haz clic en la faena en la tabla
2. En detalles, busca el botón de acción
3. Haz clic para marcar paso completado

**Funciones disponibles:**

```
Botones de Proceso (izquierda a derecha):

[Marcar Insensibilizado] → Aturdimiento completado
   ↓
[Marcar Desangrado] → Sangría completada
   ↓
[Marcar Pelado] → Removimiento de pelaje completado
   ↓
[Marcar Eviscerado] → Removimiento de órganos completado
   ↓
[Marcar División] → Cortes de canal completados
   ↓
[Marcar Inspección] → Esperando aprobación veterinaria
   ↓
[Aprobar] (Verde) → Aprobada, lista para desposte
   ↓
[Rechazar] (Rojo) → Rechazada (decomiso automático)
```

### 5. Inspección Veterinaria

**Rol requerido:** Veterinario o Supervisor

**Proceso:**
1. La faena llega a estado "InspeccionPendiente"
2. Veterinario revisa la faena en línea
3. Veterinario hace clic en [Aprobar] o [Rechazar]
4. Si aprueba → Estado: "AprobadoVeterinario" + "ListaParaDesposte"
5. Si rechaza → Estado: "RechazadoVeterinario" (decomiso automático)

---

## 📈 Estadísticas del Panel

El panel superior muestra 4 tarjetas de resumen:

```
┌─────────────────┬─────────────────┬─────────────────┬──────────────────┐
│ En Progreso     │ Completadas     │ Aprobadas       │ Rechazadas       │
│ 12              │ 156             │ 150             │ 6                │
│ (Insensibilizado│ (Finalizadas y  │ (Inspección     │ (Decomiso /      │
│  hasta División)│  inspeccionadas)│  aprobada)      │  Rechazadas)     │
└─────────────────┴─────────────────┴─────────────────┴──────────────────┘
```

**Cálculo:**
- **En Progreso** = Faenas en estados 1-5 (Insensibilizado → Dividido)
- **Completadas** = Faenas en estado 11 (Completada)
- **Aprobadas** = Faenas en estado 9 (ListaParaDesposte)
- **Rechazadas** = Faenas en estado 8 (RechazadoVeterinario)

---

## 🔐 Control de Acceso por Rol

### Operario de Faena
- ✅ Ver faenas
- ✅ Crear faenas nuevas
- ✅ Marcar: Insensibilizado, Desangrado, Pelado, Eviscerado, División
- ❌ Aprobar/Rechazar (requiere Supervisor o Veterinario)

### Supervisor
- ✅ Todas las acciones de Operario
- ✅ Marcar Inspección Pendiente
- ✅ Ver reportes de faenas
- ✅ Auditar procesos
- ⚠️ Aprobación de inspección (requiere Veterinario)

### Veterinario
- ✅ Ver todas las faenas
- ✅ Aprobar faenas (cambio a estado "AprobadoVeterinario")
- ✅ Rechazar faenas (cambio a estado "RechazadoVeterinario")
- ✅ Acceso a reportes de sanidad

### Administrador
- ✅ Acceso total a todas las funciones
- ✅ Edición de configuraciones
- ✅ Gestión de usuarios y roles

---

## 📊 Reportes y Análisis

### Disponibles en el Módulo

**1. Reporte de Período**
```
GET /api/faena/reportes/periodo
Parámetros: fechaInicio, fechaFin

Retorna:
├─ Total faenas procesadas
├─ Promedio peso entrada/salida
├─ Rendimiento carcasa (%)
├─ Faenas aprobadas/rechazadas
└─ Desviaciones de sanidad
```

**2. Reporte por Tipo de Animal**
```
Estadísticas separadas por:
├─ Vacuno
├─ Porcino
├─ Ovino
└─ Caprino
```

**3. Trazabilidad Completa**
```
Para cada faena:
├─ Identificación animal
├─ Proveedor
├─ Fecha ingreso
├─ Todos los pasos del proceso
├─ Cambios de estado
└─ Aprobación veterinaria
```

---

## 🛠️ Configuración Avanzada

### Método de Insensibilización

Configurado para vacunos:
- **Eléctrico** - Voltaje controlado
- **Pistola de perno cautivo** - Penetración controlada
- **Proyectil libre** - Impacto controlado
- **Aturdir y monogástricos** - Para otros animales
- **Manual tradicional** - Métodos antiguos
- **Otro** - Especificar manual

### Método de Desangre

- **Corte de cuello (Halal)** - Corte bajo y profundo
- **Puñal cardíaco** - Punción directa corazón
- **Sangría por bombeo** - Sistema mecanizado
- **Método especial** - Especificar manual
- **No registrado** - Histórico
- **Otro** - Especificar

### Subproductos Registrados

Para cada faena se registran:
- **Huesos** - Peso (kg) y destino
- **Vísceras** - Peso y clasificación
- **Sebo** - Cantidad y pureza
- **Cuero** - Condición y destino

---

## 🚨 Casos Especiales

### Faena Rechazada

Si el veterinario rechaza una faena:

```
Estado: RechazadoVeterinario
├─ Motivo: Se registra en sistema
├─ Decomiso: Automático
├─ No pasa a Desposte
├─ Se marca en reportes
└─ Trazabilidad preservada
```

### Faena Pendiente de Inspección

Si una faena lleva >2 horas en "InspeccionPendiente":
- Sistema genera alerta
- Se notifica a supervisor
- Se prioriza en inspección

### Cambio de Métodos

Si el operario necesita cambiar de método:
1. Haz clic en el campo del método
2. Se abre modal de cambio
3. Registra razón del cambio
4. Guarda - cambio queda en auditoría

---

## 📱 Interfaz Móvil

El módulo es **responsive** y funciona en:
- Desktop (1920x1080 y superiores)
- Tablet (iPad, Samsung Tab, etc.)
- Móvil (iPhone, Samsung, etc.)

En móvil:
- La tabla se comprime a vista de tarjetas
- Los botones se agrupan en menú "Acciones"
- Panel lateral es desplegable

---

## 🔍 Búsqueda y Filtros

### Filtrar por:
```
├─ Tipo de Animal (Vacuno, Porcino, etc.)
├─ Estado (Pendiente, Insensibilizado, etc.)
├─ Fecha
├─ Número de Faena
└─ Proveedor
```

### Buscar:
```
Cuadro de búsqueda: Escribe número de faena, identificación animal, etc.
Resultado: Muestra solo faenas coincidentes en tiempo real
```

---

## 📞 Soporte

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "Canal no disponible" | Canal ya en uso | Espera a que termine desposte |
| "Acceso denegado" | Rol insuficiente | Solo Veterinario puede aprobar |
| "Faena no encontrada" | ID incorrecto | Verifica número de faena |
| "Error de conexión" | Backend sin responder | Verifica que backend está corriendo |

### Contacto

Para problemas:
1. Verifica que backend está corriendo: `http://localhost:5000/swagger`
2. Verifica que frontend está corriendo: `http://localhost:5173`
3. Abre la consola del navegador (F12) para más detalles de error
4. Reporta error con captura de pantalla

---

## 🎓 Tutorial Rápido (5 minutos)

### Paso 1: Ir al módulo
```
Dashboard → Menú "Faena" (icono con estrellas)
```

### Paso 2: Crear una faena
```
1. En "Nueva Faena", selecciona:
   - Báscula: 1
   - Canal: Primero disponible
   - Animal: Vacuno
   - Peso: 450 kg
2. Clic en "+ Crear Faena"
3. Ves la nueva faena en la tabla
```

### Paso 3: Procesar pasos
```
1. Clic en la faena en la tabla
2. Se abre panel de detalles a la derecha
3. Clic en "Marcar Insensibilizado"
4. Clic en "Marcar Desangrado"
5. ... continúa con cada paso
```

### Paso 4: Inspección
```
1. Al llegar a "InspeccionPendiente"
2. Cambia rol a Veterinario (Settings → Rol)
3. Clic en "Aprobar"
4. Faena lista para Desposte
```

### Paso 5: Ver reportes
```
1. En tabla, clic en engranaje (⚙️)
2. Selecciona "Ver Reportes"
3. Elige período de fechas
4. Descarga PDF si deseas
```

---

**¡Listo! Ya sabes manejar el módulo de Faena. ¿Preguntas? Consulta SETUP_COMPLETE.md**
