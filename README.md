# Space AI 🌌

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular_Material-3F51B5?style=for-the-badge&logo=angular&logoColor=white)

Bienvenido a **Space AI**, un proyecto innovador desarrollado utilizando arquitecturas modulares modernas y tecnologías de vanguardia en el ecosistema web.

---

## 👨‍💻 Desarrollador y Equipo

- **Desarrollador Principal:** Juan Pablo Rea Cano
- **Equipo de Desarrollo:** Lattice Systems

---

## 🚀 Tecnologías y Arquitectura

Este proyecto está construido con un enfoque en la escalabilidad y el diseño de interfaces modernas:
- **Framework:** Angular 22 (Standalone Components — sin NgModules).
- **Build tool:** `@angular/build` basado en esbuild + Vite.
- **Estilos:** TailwindCSS 3.x para un desarrollo ágil basado en utilidades.
- **Componentes UI:** Angular Material 22 para interfaces accesibles y de alta calidad.

## 📡 Contratos de API
Ver [`docs/API_CONTRACTS.md`](./docs/API_CONTRACTS.md)

---

## 🛠️ Instalación y Configuración

### 1. Prerrequisitos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas en tu sistema:

| Herramienta | Versión mínima | Descarga |
|---|---|---|
| **Node.js** | 20.x o superior | [nodejs.org](https://nodejs.org/) |
| **pnpm** | 9.x o superior | `npm install -g pnpm` |
| **Angular CLI** | 22.x | `pnpm add -g @angular/cli@22` |
| **Git** | cualquier versión reciente | [git-scm.com](https://git-scm.com/) |

> ⚠️ **Importante:** Este proyecto usa `pnpm` como gestor de paquetes. No uses `npm install` directamente.

#### Instalar pnpm (si no lo tienes)
```bash
npm install -g pnpm
```

#### Instalar Angular CLI globalmente
```bash
pnpm add -g @angular/cli@22
```

Verifica que quedó instalado correctamente:
```bash
ng version
```
Debes ver `Angular CLI: 22.x.x` en la salida.

---

### 2. Clonar el repositorio

```bash
git clone https://github.com/lattice-systems/space-ai-frontend.git
cd space-ai-frontend
```

---

### 3. Instalar dependencias

```bash
pnpm install
```

---

### 4. Aprobar scripts de compilación nativos

Angular 22 usa `esbuild` (herramienta nativa de compilación). La primera vez que instales el proyecto, `pnpm` pedirá que apruebes explícitamente su ejecución:

```bash
pnpm approve-builds
```

Se mostrará un menú interactivo:
1. Presiona `a` para seleccionar todos los paquetes (`esbuild`, `lmdb`).
2. Presiona `Enter` para confirmar.
3. Cuando pregunte `Do you approve? (y/N)`, escribe `y` y presiona `Enter`.

> ℹ️ Este paso solo es necesario la primera vez o después de limpiar `node_modules`.

---

### 5. Iniciar el servidor de desarrollo

```bash
ng serve
```

Abre tu navegador en **[http://localhost:4200](http://localhost:4200)**. La app se recargará automáticamente al guardar cambios.

---

## 📦 Comandos Disponibles

| Comando | Descripción |
|---|---|
| `ng serve` | Inicia el servidor de desarrollo en `localhost:4200` |
| `ng build` | Compila el proyecto para producción en `dist/` |
| `ng build --configuration development` | Compila en modo desarrollo (sin minificar) |
| `ng test` | Ejecuta las pruebas unitarias con Karma |
| `ng generate component features/nombre` | Genera un nuevo componente Standalone |
| `ng generate service core/nombre` | Genera un nuevo servicio |

---

## 🗂️ Estructura del Proyecto

```
src/app/
├── core/        → Guards, interceptors, servicios singleton
├── shared/      → Componentes, pipes y directivas reutilizables
├── features/    → Features cargados con lazy loading
├── app.component.ts
├── app.config.ts   → Providers: Router, Animations
└── app.routes.ts
```

---

*Desarrollado con innovación y dedicación por Lattice Systems.*
