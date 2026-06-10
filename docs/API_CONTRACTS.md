# 📡 Contratos de API — SpaceIA (Sprint 1)

> **Versión:** 1.1.0  
> **Última actualización:** Junio 2026  
> **Proyecto:** Panel Web (Angular)

---

## 🔗 URLs Base

| Servicio | URL |
|---|---|
| Backend (.NET) | `http://<ip-o-dominio-dev>/api` |
| Microservicio IA (FastAPI) | `http://<ip-ia-dev>` |
| Broker MQTT | `mqtt://<ip-servidor>:1883` |

> ⚠️ Reemplazar las IPs con las variables de entorno correspondientes en `environment.ts` y `environment.prod.ts`.

---

## 1. Módulo de Identidad y Seguridad (.NET)

Endpoints consumidos por el Panel Web Angular.

---

### `POST /auth/register` — Registro de Usuario

Crea un nuevo usuario en la base de datos.

**Headers**
```
Content-Type: application/json
```

**Request Body**
```json
{
  "name": "Daniel Ramirez",
  "email": "daniel.ramirez@universidad.edu",
  "password": "PasswordSegura123!",
  "folio": "23001501",
  "role": "student"
}
```

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `name` | `string` | ✅ | Nombre completo |
| `email` | `string` | ✅ | Correo institucional |
| `password` | `string` | ✅ | Mínimo 8 caracteres, mayúscula y símbolo |
| `folio` | `string \| null` | ⚠️ | `null` para visitantes sin matrícula |
| `role` | `string` | ✅ | Ver roles permitidos abajo |

**Roles permitidos:** `"student"` · `"teacher"` · `"admin"` · `"visitor"`

> 📝 Para visitantes sin matrícula oficial, el frontend puede enviar `folio: null` o generar un folio temporal según la regla de negocio acordada.

**Response `201 Created`**
```json
{
  "message": "Usuario registrado exitosamente",
  "userId": "uuid-1234-5678-90ab"
}
```

---

### `POST /auth/login` — Inicio de Sesión

Valida credenciales y devuelve tokens de acceso.

**Headers**
```
Content-Type: application/json
```

**Request Body**
```json
{
  "email": "daniel.ramirez@universidad.edu",
  "password": "PasswordSegura123!"
}
```

**Response `200 OK`**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5...",
  "refreshToken": "d7a8b9c0-1234-4321-abcd-ef0123456789",
  "expiresIn": 3600,
  "user": {
    "id": "uuid-1234-5678-90ab",
    "name": "Daniel Ramirez",
    "email": "daniel.ramirez@universidad.edu",
    "folio": "23001501",
    "role": "student"
  }
}
```

**Response `401 Unauthorized`**
```json
{
  "error": "Credenciales inválidas"
}
```

> 🔐 Guardar el `accessToken` en memoria (no en `localStorage`) y el `refreshToken` en una cookie `HttpOnly` cuando sea posible.

---

## 2. Módulo de Identidad Dinámica / QR (.NET)

---

### `GET /auth/qr/{userId}` — Obtener QR Dinámico

Genera el string encriptado que se renderizará como código QR en la app móvil.

**Headers**
```
Authorization: Bearer <accessToken>
```

**Params**

| Param | Tipo | Descripción |
|---|---|---|
| `userId` | `string (UUID)` | ID del usuario autenticado |

**Response `200 OK`**
```json
{
  "qrToken": "enc_abc123def456ghi789...",
  "generatedAt": "2026-08-15T10:00:00Z",
  "expiresAt": "2026-08-15T10:15:00Z"
}
```

> ⏱️ `expiresAt` siempre es exactamente **15 minutos** después de `generatedAt`. El frontend debe manejar el refresco automático del QR antes de que expire.

---

### `POST /auth/qr/validate` — Validar QR Escaneado

Recibe el token QR escaneado por un dispositivo IoT (Raspberry Pi), lo desencripta y valida el acceso.

> Este endpoint **no es consumido directamente por Angular**, sino por los dispositivos IoT. Se documenta aquí como referencia de integración.

**Headers**
```
Content-Type: application/json
X-Device-Id: <identificador-dispositivo>   // Ej: KIOSCO-01, PUERTA-A
```

**Request Body**
```json
{
  "qrToken": "enc_abc123def456ghi789..."
}
```

**Response `200 OK` — Acceso permitido**
```json
{
  "isValid": true,
  "message": "Acceso autorizado",
  "userContext": {
    "id": "uuid-1234-5678-90ab",
    "name": "Daniel Ramirez",
    "role": "student"
  }
}
```

> ✅ Un `200` con `isValid: true` dispara el guardado en **Redis** para la caché de sesiones activas.

**Response `403 Forbidden` — Token expirado o inválido**
```json
{
  "isValid": false,
  "error": "Token expirado o inválido"
}
```

---

## 3. Microservicio de IA (Python / FastAPI)

Comunicación desde el panel de administración para el motor RAG.

---

### `GET /health` — Health Check

Verifica que el contenedor de Python esté activo.

**Response `200 OK`**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

---

### `POST /api/knowledge/ingest` — Ingestión de Conocimiento (RAG Fase 1)

Sube un documento PDF para que LangChain realice el chunking y lo almacene en ChromaDB.

**Headers**
```
Content-Type: multipart/form-data
```

**Request Form-Data**

| Campo | Tipo | Descripción |
|---|---|---|
| `file` | `File (PDF)` | Documento a procesar. Ej: `reglamento_2026.pdf` |

**Response `200 OK`**
```json
{
  "message": "Documento procesado correctamente",
  "documentName": "reglamento_2026.pdf",
  "chunksCreated": 45
}
```

---

### `POST /api/knowledge/ask` — Consulta RAG (RAG Fase 2)

Envía una pregunta al LLM local (Ollama) que responde usando el contexto de ChromaDB.

**Headers**
```
Content-Type: application/json
```

**Request Body**
```json
{
  "question": "¿Cuántas faltas puedo tener en el semestre?"
}
```

**Response `200 OK`**
```json
{
  "answer": "Según el reglamento de alumnos, puedes tener un máximo de 3 faltas injustificadas antes de perder el derecho a examen ordinario.",
  "sources": [
    {
      "documentName": "reglamento_2026.pdf",
      "page": 12
    }
  ]
}
```

---

## 4. Contratos MQTT (Hardware IoT)

Tópicos del broker Mosquitto para comunicación en tiempo real con el Carrito Inteligente.

> Este módulo **no es consumido directamente por Angular REST**. Se documenta como referencia del ecosistema completo del proyecto.

**Conexión**
```
mqtt://<ip-servidor>:1883
```
Autenticación mediante usuario y contraseña configurados en Mosquitto.

---

### Topic: `spaceia/carrito/telemetry` — Telemetría

El carrito reporta su estado al dashboard en tiempo real.

**Payload**
```json
{
  "deviceId": "CARRITO-01",
  "batteryLevel": 85,
  "status": "moving",
  "currentLocation": "Pasillo B"
}
```

---

### Topic: `spaceia/carrito/commands/CARRITO-01` — Comandos

El dashboard/backend envía órdenes al carrito.

**Payload**
```json
{
  "action": "stop",
  "targetDestination": "Biblioteca"
}
```

**Acciones soportadas (MVP):** `"start"` · `"stop"` · `"go_to"`

---

## 5. Notas Generales para el Frontend Angular

| Tema | Recomendación |
|---|---|
| **Auth Guard** | Proteger rutas con `canActivate` verificando `accessToken` vigente |
| **Interceptor HTTP** | Inyectar `Authorization: Bearer <token>` automáticamente en cada request |
| **Manejo de errores** | Centralizar con un `HttpInterceptor` que maneje `401` (refresh) y `403` (redirect) |
| **Variables de entorno** | Todas las URLs base deben vivir en `environment.ts`, nunca hardcodeadas |
| **Tipado** | Crear interfaces TypeScript para cada Request/Response en `/src/app/core/models/` |
| **Servicios** | Un servicio por módulo: `AuthService`, `QrService`, `KnowledgeService` |

---

*Documento mantenido por el equipo de frontend. Ante dudas sobre el comportamiento del backend, coordinar con el equipo de .NET o IA según el módulo correspondiente.*