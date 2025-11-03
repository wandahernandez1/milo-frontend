# 🎨 Milo Assistant - Frontend

Interfaz de usuario desarrollada con React y Vite para Milo, tu asistente personal inteligente.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecutar el Proyecto](#ejecutar-el-proyecto)
- [Build para Producción](#build-para-producción)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Páginas y Rutas](#páginas-y-rutas)
- [Componentes Principales](#componentes-principales)
- [Tecnologías](#tecnologías)

## 📖 Descripción

Frontend de MiloAssistant, una aplicación web moderna que ofrece:

- 💬 Chat conversacional con IA (Gemini)
- 🔐 Autenticación segura (JWT + Google OAuth)
- ✅ Gestión de tareas con recordatorios
- 📝 Sistema de notas organizado
- 📅 Integración con Google Calendar
- 🌓 Modo claro/oscuro
- 📱 Diseño responsive y minimalista
- ⚡ Interfaz rápida con React 19 y Vite

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

### Core

- **[React 19](https://react.dev/)** - Biblioteca UI
- **[Vite](https://vitejs.dev/)** - Build tool ultrarrápido
- **[React Router v7](https://reactrouter.com/)** - Navegación

### UI & Styling

- **CSS Modules** - Estilos encapsulados
- **CSS Variables** - Temas dinámicos
- **[Font Awesome](https://fontawesome.com/)** - Iconos
- **[GSAP](https://greensock.com/gsap/)** - Animaciones avanzadas

### Integrations

- **[@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)** - Google OAuth
- **[@google/genai](https://www.npmjs.com/package/@google/genai)** - Gemini API
- **[FullCalendar](https://fullcalendar.io/)** - Calendario interactivo
- **[date-fns](https://date-fns.org/)** - Manipulación de fechas
- **[react-markdown](https://remarkjs.github.io/react-markdown/)** - Renderizado Markdown

### Development

- **[ESLint](https://eslint.org/)** - Linter
- **Vite Dev Server** - Hot Module Replacement

## 🎨 Diseño y Estilo

### Colores del Sistema

```css
/* Modo Oscuro (por defecto) */
--primary-bg: #0f0d1b;
--secondary-bg: #1a152d;
--card-bg: #2c2744;
--text-primary: #f0f0f0;
--text-secondary: #a0a0a0;
--accent: #9b59b6;
--accent-light: #c48ed4;

/* Modo Claro */
--primary-bg: #fcfcfc;
--secondary-bg: #ffffff;
--card-bg: #f8f8f8;
--text-primary: #1a1a1a;
--text-secondary: #666666;
--accent: #9b59b6;
```

### Tipografía

- **Font Principal**: Poppins (Google Fonts)
- **Tamaños Responsivos**: `clamp()` para escalabilidad

### Responsive Design

- **Móvil**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 📝 Notas Importantes

1. **API Backend**: El frontend requiere que el backend esté corriendo en `http://localhost:3000` (o la URL configurada en `.env`)
2. **Google OAuth**: Los dominios deben estar autorizados en Google Cloud Console
3. **CORS**: El backend debe permitir requests desde `http://localhost:5173`
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

## 🚀 Próximas Funcionalidades

- [ ] PWA (Progressive Web App) para móviles
- [ ] Notificaciones push
- [ ] Modo offline con Service Workers
- [ ] Búsqueda avanzada en tareas y notas
- [ ] Compartir tareas con otros usuarios
- [ ] Temas personalizados

## 📄 Licencia

Este proyecto es privado y de uso interno.

## 👥 Autor

Desarrollado por el equipo de MiloAssistant

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o contacta al equipo de desarrollo.
