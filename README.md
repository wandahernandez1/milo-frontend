# 🎨 Milo Assistant - Frontend

<div align="center">
  <p><strong>Interfaz de usuario moderna desarrollada con React 19 y Vite</strong></p>
  <p>
    <a href="#-descripción">Descripción</a> •
    <a href="#-instalación">Instalación</a> •
    <a href="#️-configuración">Configuración</a> •
    <a href="#-ejecutar-el-proyecto">Uso</a> •
    <a href="#️-tecnologías">Tecnologías</a>
  </p>
</div>

---

## 📋 Tabla de Contenidos

- [📖 Descripción](#-descripción)
- [🔧 Requisitos Previos](#-requisitos-previos)
- [🚀 Instalación](#-instalación)
- [⚙️ Configuración](#️-configuración)
- [🏃 Ejecutar el Proyecto](#-ejecutar-el-proyecto)
- [📦 Build para Producción](#-build-para-producción)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🗺️ Páginas y Rutas](#️-páginas-y-rutas)
- [🧩 Componentes Principales](#-componentes-principales)
- [🛠️ Tecnologías](#️-tecnologías)
- [🎨 Diseño y Estilo](#-diseño-y-estilo)
- [📝 Notas Importantes](#-notas-importantes)
- [🐛 Solución de Problemas](#-solución-de-problemas)

## 📖 Descripción

Frontend de **MiloAssistant**, una aplicación web moderna y responsiva que ofrece una experiencia de usuario fluida y atractiva.

### ✨ Características Principales

- 💬 **Chat Inteligente** - Conversación con IA (Gemini) con formato Markdown
- 🔐 **Autenticación Múltiple** - Login tradicional y Google OAuth 2.0
- ✅ **Gestión de Tareas** - Crear, editar, priorizar y marcar tareas como completadas
- 📝 **Sistema de Notas** - Organización avanzada con búsqueda y filtros
- 📅 **Calendario Integrado** - Visualización y gestión de eventos de Google Calendar
- 🌓 **Temas Personalizables** - Modo claro/oscuro con transiciones suaves
- 📱 **Diseño Responsive** - Optimizado para móvil, tablet y desktop
- ⚡ **Rendimiento Óptimo** - Carga rápida con React 19 y Vite
- 🎨 **UI Moderna** - Animaciones con GSAP y efectos visuales atractivos
- 🔔 **Notificaciones** - Sistema de mensajes toast para feedback inmediato

## 🔧 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** >= 18.x
- **npm** >= 9.x

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd milo-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# URL del backend API
VITE_API_URL=http://localhost:3000/api

# Google Client ID para OAuth (debe coincidir con el del backend)
VITE_GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
```

### Obtener Google Client ID

El `VITE_GOOGLE_CLIENT_ID` debe ser el mismo que configuraste en el backend:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a "Credenciales"
4. Copia el **Client ID** del cliente OAuth 2.0
5. Pega el valor en tu archivo `.env`

**⚠️ Importante**: Los orígenes JavaScript autorizados en Google Cloud Console deben incluir:

- `http://localhost:5173`
- Tu dominio de producción (si aplica)

## 🏃 Ejecutar el Proyecto

### Modo Desarrollo (con hot-reload)

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Preview de Producción

```bash
# Primero construir el proyecto
npm run build

# Previsualizar el build
npm run preview
```

### Otros comandos disponibles

```bash
# Linter
npm run lint

# Formatear código
npm run format
```

## 📦 Build para Producción

### Compilar para producción

```bash
npm run build
```

Esto generará los archivos optimizados en la carpeta `dist/`

### Desplegar

Los archivos en `dist/` están listos para ser desplegados en cualquier servidor estático:

- **Vercel**: `vercel --prod`
- **Netlify**: Arrastra la carpeta `dist/` a Netlify
- **GitHub Pages**: Sube el contenido de `dist/`
- **Servidor propio**: Copia `dist/` a tu servidor web

### Configuración de Producción

Recuerda actualizar las variables de entorno para producción:

```env
VITE_API_URL=https://tu-api.com/api
VITE_GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
```

## 📁 Estructura del Proyecto

```
milo-frontend/
├── src/
│   ├── assets/              # Recursos estáticos (imágenes, iconos)
│   ├── components/          # Componentes reutilizables
│   │   ├── chat/            # Componentes del chat
│   │   │   ├── Chat.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   └── ActionCards.jsx
│   │   ├── common/          # Componentes comunes
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── SplashScreen.jsx
│   │   ├── layout/          # Componentes de layout
│   │   │   ├── NavBar.jsx
│   │   │   └── PanelLayout.jsx
│   │   ├── Features.jsx
│   │   ├── Message.jsx
│   │   └── Plasma.jsx
│   ├── context/             # Context API
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── MessageContext.jsx
│   ├── features/            # Características por módulo
│   │   ├── events/          # Gestión de eventos (Google Calendar)
│   │   ├── notes/           # Gestión de notas
│   │   ├── profile/         # Perfil de usuario
│   │   └── tasks/           # Gestión de tareas
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useChatLogic.js
│   │   ├── useGoogleEvents.js
│   │   ├── useMessage.js
│   │   ├── useNotes.js
│   │   └── useTasks.js
│   ├── pages/               # Páginas principales
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CalendarioPage.jsx
│   │   ├── ComoUsarMilo.jsx
│   │   └── Novedades.jsx
│   ├── services/            # Servicios de API
│   │   └── api.js
│   ├── styles/              # Archivos CSS
│   │   ├── index.css
│   │   ├── dashboard.css
│   │   ├── login.css
│   │   ├── register.css
│   │   ├── comoUsarMilo.css
│   │   └── ...
│   ├── utils/               # Utilidades
│   │   ├── api.js
│   │   └── config.js
│   ├── App.jsx              # Componente principal
│   └── main.jsx             # Punto de entrada
├── public/                  # Archivos públicos
├── .env                     # Variables de entorno (no incluido en git)
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🗺️ Páginas y Rutas

### Rutas Públicas

- `/` - Página de inicio (Home)
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/como-usar-milo` - Guía de uso
- `/novedades` - Actualizaciones y características

### Rutas Protegidas (requieren autenticación)

- `/dashboard` - Panel principal con chat de IA
- `/panel/calendario` - Vista del calendario de Google
- `/panel/tareas` - Gestión de tareas
- `/panel/notas` - Gestión de notas
- `/panel/perfil` - Perfil de usuario

## 🧩 Componentes Principales

### Context Providers

#### **AuthContext**

Maneja la autenticación del usuario:

- Estado de login/logout
- Información del usuario actual
- Token JWT
- Persistencia en localStorage

#### **ThemeContext**

Controla el tema claro/oscuro:

- Toggle entre modos
- Persistencia de preferencia
- CSS variables dinámicas

#### **MessageContext**

Sistema de notificaciones toast:

- Mensajes de éxito/error/info
- Auto-dismiss configurable
- Múltiples mensajes en cola

### Custom Hooks

- **useAuth**: Acceso al contexto de autenticación
- **useChatLogic**: Lógica del chat con IA
- **useGoogleEvents**: Integración con Google Calendar
- **useMessage**: Mostrar notificaciones
- **useNotes**: CRUD de notas
- **useTasks**: CRUD de tareas

### Componentes de UI

#### **Chat**

- Conversación con IA Gemini
- Historial de mensajes
- Formato Markdown en respuestas
- Sugerencias contextuales

#### **ActionCards**

- Acciones rápidas del chat
- Crear tareas/notas
- Consultar clima/noticias

#### **ThemeToggle**

- Switch animado
- Transiciones suaves
- Íconos sol/luna

## 🛠️ Tecnologías

### Framework & Core

- **[React](https://react.dev/)** v19.1 - Biblioteca UI moderna con Concurrent Features
- **[Vite](https://vitejs.dev/)** v7.1 - Build tool ultrarrápido con HMR instantáneo
- **[React Router DOM](https://reactrouter.com/)** v7.9 - Enrutamiento declarativo

### UI & Styling

- **CSS Custom Properties** - Variables CSS para temas dinámicos
- **CSS Modules** - Estilos encapsulados y con scope local
- **[Font Awesome](https://fontawesome.com/)** v7.0 - Biblioteca de iconos vectoriales
- **[React Icons](https://react-icons.github.io/react-icons/)** v5.5 - Iconos de múltiples bibliotecas
- **[GSAP](https://greensock.com/gsap/)** v3.13 - Animaciones de alto rendimiento
- **[Radix UI](https://www.radix-ui.com/)** - Componentes accesibles sin estilos

### Integraciones

- **[@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)** v0.12 - Google OAuth 2.0
- **[@google/genai](https://www.npmjs.com/package/@google/genai)** v1.20 - Gemini AI
- **[FullCalendar](https://fullcalendar.io/)** v6.1 - Calendario interactivo completo
- **[date-fns](https://date-fns.org/)** v4.1 - Utilidades modernas para fechas
- **[chrono-node](https://github.com/wanasit/chrono)** v2.9 - Parser de lenguaje natural
- **[react-markdown](https://remarkjs.github.io/react-markdown/)** v10.1 - Renderizado Markdown

### Efectos Visuales

- **[@tsparticles/react](https://particles.js.org/)** v3.0 - Sistema de partículas
- **[OGL](https://oframe.github.io/ogl/)** v1.0 - Biblioteca WebGL ligera
- **[Tailwind Variants](https://www.tailwind-variants.org/)** v3.1 - Variantes de componentes
- **[clsx](https://github.com/lukeed/clsx)** v2.1 - Utilidad para clases condicionales

### Herramientas de Desarrollo

- **[ESLint](https://eslint.org/)** v9.33 - Linter de código
- **[Vite Dev Server](https://vitejs.dev/)** - Hot Module Replacement
- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)** - Plugin oficial de React para Vite

## 🎨 Diseño y Estilo

### Paleta de Colores

#### Modo Oscuro (Predeterminado)

```css
--primary-bg: #0f0d1b; /* Fondo principal profundo */
--secondary-bg: #1a152d; /* Fondo secundario */
--card-bg: #2c2744; /* Fondo de tarjetas */
--text-primary: #f0f0f0; /* Texto principal */
--text-secondary: #a0a0a0; /* Texto secundario */
--accent: #9b59b6; /* Color de acento (púrpura) */
--accent-light: #c48ed4; /* Acento claro */
--success: #2ecc71; /* Verde éxito */
--warning: #f39c12; /* Naranja advertencia */
--error: #e74c3c; /* Rojo error */
```

#### Modo Claro

```css
--primary-bg: #fcfcfc; /* Fondo blanco suave */
--secondary-bg: #ffffff; /* Fondo blanco puro */
--card-bg: #f8f8f8; /* Fondo gris muy claro */
--text-primary: #1a1a1a; /* Texto negro suave */
--text-secondary: #666666; /* Texto gris */
--accent: #9b59b6; /* Púrpura (consistente) */
```

### Tipografía

- **Familia**: [Poppins](https://fonts.google.com/specimen/Poppins) (Google Fonts)
- **Pesos**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Tamaños**: Responsivos con `clamp()` para escalabilidad fluida
  - Título principal: `clamp(2rem, 5vw, 3.5rem)`
  - Subtítulo: `clamp(1.2rem, 3vw, 1.8rem)`
  - Cuerpo: `clamp(0.9rem, 2vw, 1rem)`

### Breakpoints Responsive

| Dispositivo      | Ancho          | Características                     |
| ---------------- | -------------- | ----------------------------------- |
| 📱 Móvil         | < 768px        | Menú hamburguesa, columnas únicas   |
| 📱 Tablet        | 768px - 1024px | Diseño adaptativo, 2 columnas       |
| 💻 Desktop       | > 1024px       | Layout completo, múltiples columnas |
| 🖥️ Desktop Large | > 1440px       | Espaciado ampliado                  |

### Animaciones

- **Transiciones**: 0.3s ease-in-out (estándar)
- **Tema toggle**: Animación suave con GSAP
- **Scroll**: Lazy loading y efectos parallax
- **Cards**: Hover con transformación 3D
- **Modales**: Fade in/out con backdrop blur

## 📝 Notas Importantes

### Desarrollo Local

- 🔌 El backend debe estar corriendo en `http://localhost:3000` (o la URL configurada)
- 🌐 CORS debe estar habilitado en el backend para `http://localhost:5173`
- 🔑 Las variables de entorno `.env` no se suben al repositorio

### Producción

- ⚙️ Actualiza `VITE_API_URL` con la URL de producción del backend
- 🔒 Configura CORS en el backend para tu dominio de producción
- 🌍 Verifica que Google OAuth tenga tu dominio autorizado
- 📦 Los archivos de `dist/` están optimizados y minificados

### Rendimiento

- ⚡ Vite optimiza automáticamente las importaciones
- 🗜️ El build incluye code splitting automático
- 🖼️ Las imágenes en `assets/` se optimizan durante el build
- 💾 localStorage se usa para persistencia de sesión y preferencias

4. **LocalStorage**: Se usa para persistir token JWT y preferencias de usuario
5. **Context API**: Todos los componentes pueden acceder a auth, theme y messages mediante hooks

## 🐛 Solución de Problemas

### Error "Failed to fetch" en login

```bash
# Verifica que el backend esté corriendo
curl http://localhost:3000/api

# Verifica la variable de entorno
echo $VITE_API_URL
```

### Google OAuth no funciona

```bash
# Verifica el Client ID en .env
# Verifica que el dominio esté autorizado en Google Cloud Console
# Limpia el caché del navegador
```

### Hot Reload no funciona

```bash
# Reinicia el servidor de desarrollo
npm run dev
```

### Build falla

```bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🚀 Roadmap

### En Desarrollo

- [ ] 📱 PWA (Progressive Web App)
- [ ] 🔔 Notificaciones push
- [ ] 📴 Modo offline con Service Workers

### Futuras Funcionalidades

- [ ] 🔍 Búsqueda avanzada en tareas y notas
- [ ] 👥 Compartir tareas con otros usuarios
- [ ] 🎨 Temas personalizados y paletas de colores
- [ ] 🗣️ Comandos de voz para el chat
- [ ] 📊 Dashboard con estadísticas y gráficos
- [ ] 🔄 Sincronización offline-online

## 📄 Licencia

Este proyecto es privado y de uso interno.

## 👥 Autor

Desarrollado con ❤️ por Hernandez Wanda

<div align="center">
  <p><strong>¿Necesitas ayuda?</strong></p>
  <p>Abre un issue en el repositorio o contacta al equipo de desarrollo</p>
  <p>Hecho con React ⚛️ • Vite ⚡ • TypeScript 💙</p>
</div>
