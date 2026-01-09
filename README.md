# 🎨 Milo Assistant - Frontend

<div align="center">

![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

  <p><strong>Interfaz de usuario moderna y reactiva para Milo, tu asistente personal inteligente potenciado por IA</strong></p>

  <p>
    <a href="#-demo-en-vivo">🌐 Demo</a> •
    <a href="#-arquitectura">📐 Arquitectura</a> •
    <a href="#-retos-técnicos-superados">🏆 Retos</a> •
    <a href="#-instalación">🚀 Instalación</a> •
    <a href="#-componentes">🧩 Componentes</a>
  </p>

  <br/>

| 🚀 Deploy   | ⚡ Performance    | 🎨 UI/UX           |
| ----------- | ----------------- | ------------------ |
| Vercel Edge | React 19 + Vite 7 | GSAP + CSS Moderno |

</div>

---

## 🌐 Demo en Vivo

| Entorno            | URL                                                                              | Estado                                                                                                 |
| ------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **🟢 Producción**  | [https://milo-frontend-six.vercel.app](https://milo-frontend-six.vercel.app)     | [![Vercel Status](https://img.shields.io/badge/Vercel-Online-success?logo=vercel)](https://vercel.com) |
| **🔵 Backend API** | [https://milo-backend-4dga.onrender.com](https://milo-backend-4dga.onrender.com) | [![Render Status](https://img.shields.io/badge/Render-Online-success?logo=render)](https://render.com) |

### 📱 Preview

```
🖥️ Desktop: Experiencia completa con panel lateral y animaciones
📱 Mobile: Diseño responsive optimizado para touch
🌓 Temas: Modo claro/oscuro con persistencia
```

### 🔑 Características Destacadas en Demo

- ✅ Chat con IA (Gemini) - Conversación natural en español
- ✅ Gestión de tareas con arrastrar y soltar
- ✅ Calendario integrado con Google Calendar
- ✅ Sistema de notas con Markdown
- ✅ Autenticación Google OAuth

---

## 📐 Arquitectura

### 🏗️ Diagrama de Arquitectura del Frontend

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              🌐 BROWSER (Cliente)                               │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         📱 React 19 Application                         │   │
│  │                                                                         │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │                    🎯 App.jsx (Root)                             │   │   │
│  │  │                    React Router v7                               │   │   │
│  │  └─────────────────────────────┬───────────────────────────────────┘   │   │
│  │                                │                                       │   │
│  │         ┌──────────────────────┼──────────────────────┐               │   │
│  │         ▼                      ▼                      ▼               │   │
│  │  ┌─────────────┐       ┌─────────────┐       ┌─────────────────┐     │   │
│  │  │🔐 AuthContext│       │💬 MessageCtx│       │🌓 ThemeContext  │     │   │
│  │  │ • JWT Tokens│       │ • Toast Msgs│       │ • Dark/Light    │     │   │
│  │  │ • User State│       │ • Errors    │       │ • Persistence   │     │   │
│  │  │ • Google SSO│       │ • Success   │       │ • CSS Variables │     │   │
│  │  └─────────────┘       └─────────────┘       └─────────────────┘     │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          📄 PAGES (Rutas)                               │   │
│  │                                                                         │   │
│  │   /                    /dashboard              /calendario              │   │
│  │   ┌────────────┐       ┌────────────┐         ┌────────────┐           │   │
│  │   │  🏠 Home   │       │ 📊Dashboard│         │ 📅Calendar │           │   │
│  │   │  Landing   │       │ Chat+Panels│         │ FullCalendar│          │   │
│  │   └────────────┘       └────────────┘         └────────────┘           │   │
│  │                                                                         │   │
│  │   /login               /register               /novedades              │   │
│  │   ┌────────────┐       ┌────────────┐         ┌────────────┐           │   │
│  │   │  🔑 Login  │       │ 📝 Register│         │ 📰 News    │           │   │
│  │   │ OAuth+Form │       │ Validation │         │ Updates    │           │   │
│  │   └────────────┘       └────────────┘         └────────────┘           │   │
│  │                                                                         │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                       🧩 COMPONENTES CORE                               │   │
│  │                                                                         │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │   │
│  │  │   💬 Chat       │  │   ✅ Tasks       │  │   📝 Notes      │         │   │
│  │  │   ──────────    │  │   ──────────    │  │   ──────────    │         │   │
│  │  │   ChatMilo.jsx  │  │   TasksPanel    │  │   NotesPanel    │         │   │
│  │  │   ChatInput     │  │   TaskItem      │  │   NoteItem      │         │   │
│  │  │   Message       │  │   TaskForm      │  │   NoteEditor    │         │   │
│  │  │   MarkdownRender│  │   PriorityBadge │  │   NoteSearch    │         │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘         │   │
│  │                                                                         │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │   │
│  │  │   📅 Calendar   │  │   🎨 UI/Layout  │  │   ✨ Effects    │         │   │
│  │  │   ──────────    │  │   ──────────    │  │   ──────────    │         │   │
│  │  │   EventosPanel  │  │   PanelLayout   │  │   Plasma.jsx    │         │   │
│  │  │   EventForm     │  │   Sidebar       │  │   GSAP Anims    │         │   │
│  │  │   FullCalendar  │  │   ThemeToggle   │  │   Particles     │         │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘         │   │
│  │                                                                         │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         🎣 CUSTOM HOOKS                                 │   │
│  │                                                                         │   │
│  │   useAuth        useTasks        useNotes        useGoogleEvents       │   │
│  │   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────────┐    │   │
│  │   │• login   │   │• CRUD    │   │• CRUD    │   │• fetchEvents     │    │   │
│  │   │• logout  │   │• filter  │   │• search  │   │• createEvent     │    │   │
│  │   │• refresh │   │• sort    │   │• markdown│   │• syncCalendar    │    │   │
│  │   └──────────┘   └──────────┘   └──────────┘   └──────────────────┘    │   │
│  │                                                                         │   │
│  │   useChatLogic   useMessage      useToast        geminiLogic           │   │
│  │   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────────┐    │   │
│  │   │• sendMsg │   │• context │   │• show    │   │• parseIntent     │    │   │
│  │   │• history │   │• error   │   │• hide    │   │• handleResponse  │    │   │
│  │   │• loading │   │• success │   │• queue   │   │• nlpProcess      │    │   │
│  │   └──────────┘   └──────────┘   └──────────┘   └──────────────────┘    │   │
│  │                                                                         │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP/HTTPS (Fetch API)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           🔌 SERVICES LAYER                                     │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                      api.js (Axios/Fetch Wrapper)                       │   │
│   │   • Base URL configuration                                              │   │
│   │   • JWT interceptors (auto-attach token)                               │   │
│   │   • Response/Error interceptors                                        │   │
│   │   • Refresh token logic                                                │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│                                      ▼                                          │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                         Backend API (NestJS)                            │   │
│   │                    Render: milo-backend-4dga.onrender.com               │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                          🛠️ BUILD & DEPLOY PIPELINE                            │
│                                                                                 │
│   Source Code ──▶ Vite Build ──▶ Static Assets ──▶ Vercel Edge Network         │
│   (JSX/CSS)       (Bundle)       (dist/)           (Global CDN)                │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 📦 Estructura del Proyecto

```
src/
├── 🎯 main.jsx                   # Entry point
├── 📱 App.jsx                    # Router + Providers
│
├── 📂 context/                   # Estado global (Context API)
│   ├── AuthContext.jsx           # Autenticación y usuario
│   ├── MessageContext.jsx        # Sistema de notificaciones
│   └── ThemeContext.jsx          # Modo claro/oscuro
│
├── 📂 pages/                     # Vistas principales
│   ├── Home.jsx                  # Landing page
│   ├── Dashboard.jsx             # Panel principal + Chat
│   ├── CalendarioPage.jsx        # Vista calendario
│   ├── Login.jsx & Register.jsx  # Autenticación
│   ├── ComoUsarMilo.jsx          # Tutorial/Ayuda
│   └── Novedades.jsx             # Feed de actualizaciones
│
├── 📂 components/                # Componentes reutilizables
│   ├── chat/                     # Componentes del chat
│   │   ├── ChatMilo.jsx          # Chat principal
│   │   └── ChatInput.jsx         # Input con IA
│   ├── layout/                   # Estructura de página
│   │   ├── PanelLayout.jsx       # Layout con sidebar
│   │   └── Sidebar.jsx           # Navegación lateral
│   ├── common/                   # Componentes genéricos
│   │   ├── ThemeToggle.jsx       # Switch tema
│   │   └── ConfirmDialog.jsx     # Modal confirmación
│   ├── Message.jsx               # Mensajes del chat
│   └── Plasma.jsx                # Efecto visual animado
│
├── 📂 features/                  # Módulos de funcionalidad
│   ├── tasks/                    # Gestión de tareas
│   ├── notes/                    # Sistema de notas
│   ├── events/                   # Eventos/Calendario
│   └── profile/                  # Perfil de usuario
│
├── 📂 hooks/                     # Custom hooks
│   ├── useAuth.js                # Hook de autenticación
│   ├── useTasks.js               # CRUD tareas
│   ├── useNotes.js               # CRUD notas
│   ├── useChatLogic.js           # Lógica del chat
│   ├── useGoogleEvents.js        # Google Calendar
│   └── geminiLogic.js            # Procesamiento IA
│
├── 📂 services/                  # Comunicación con API
│   └── api.js                    # Cliente HTTP configurado
│
├── 📂 styles/                    # Estilos CSS modulares
│   ├── index.css                 # Variables globales
│   ├── dashboard.css             # Estilos del dashboard
│   ├── chatMilo.css              # Estilos del chat
│   └── [feature].css             # Estilos por módulo
│
└── 📂 utils/                     # Utilidades
    ├── config.js                 # Configuración global
    └── api.js                    # Helpers de API
```

---

## 🏆 Retos Técnicos Superados

### 1. 💬 Renderizado de Markdown en Tiempo Real

**Problema:** Mostrar respuestas de la IA con formato Markdown (código, listas, tablas) sin sacrificar rendimiento ni seguridad.

**Solución:**

```jsx
// Implementación con react-markdown + sanitización
import ReactMarkdown from "react-markdown";

const MessageContent = ({ content }) => (
  <ReactMarkdown
    components={{
      code: ({ inline, children, className }) => {
        if (inline) return <code className="inline-code">{children}</code>;
        return (
          <pre className="code-block">
            <code className={className}>{children}</code>
          </pre>
        );
      },
    }}
    remarkPlugins={[remarkGfm]}
  >
    {content}
  </ReactMarkdown>
);
```

**Resultado:** Mensajes con formato rico, syntax highlighting y rendimiento fluido incluso en conversaciones largas.

---

### 2. 🎨 Sistema de Temas con CSS Variables

**Problema:** Implementar modo oscuro/claro con transiciones suaves que persistan entre sesiones.

**Solución:**

```jsx
// ThemeContext con persistencia en localStorage
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("milo-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("milo-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

```css
/* CSS Variables para theming */
:root[data-theme="dark"] {
  --bg-primary: #0a0a0f;
  --text-primary: #ffffff;
  --accent: #6366f1;
}

:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --text-primary: #1f2937;
  --accent: #4f46e5;
}

* {
  transition: background-color 0.3s, color 0.3s;
}
```

**Resultado:** Cambio de tema instantáneo y suave con 0 FOUC (Flash of Unstyled Content).

---

### 3. 🔄 Gestión de Estado de Autenticación

**Problema:** Manejar tokens JWT, refresh automático, y estados de carga sin race conditions.

**Solución:**

```jsx
// AuthContext con manejo robusto de tokens
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return setLoading(false);

      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      // Token expirado - intentar refresh
      await attemptTokenRefresh();
    } finally {
      setLoading(false);
    }
  }, []);

  // Interceptor para renovar tokens automáticamente
  useEffect(() => {
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          return attemptTokenRefresh().then(() => api.request(error.config));
        }
        return Promise.reject(error);
      }
    );
  }, []);
};
```

**Resultado:** UX fluida sin logouts inesperados y manejo transparente de sesiones.

---

### 4. 📅 Integración de FullCalendar con Google Calendar

**Problema:** Sincronizar eventos de Google Calendar con vista local, manejando zonas horarias y conflictos.

**Solución:**

```jsx
// Hook personalizado para eventos de Google
const useGoogleEvents = () => {
  const [events, setEvents] = useState([]);
  const [syncing, setSyncing] = useState(false);

  const syncWithGoogle = async () => {
    setSyncing(true);
    try {
      const googleEvents = await api.get("/google/events");
      const formattedEvents = googleEvents.data.map((event) => ({
        id: event.id,
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        extendedProps: { googleId: event.id, source: "google" },
      }));
      setEvents((prev) => mergeEvents(prev, formattedEvents));
    } finally {
      setSyncing(false);
    }
  };
};
```

**Resultado:** Calendario unificado con eventos locales y de Google, sincronización bidireccional.

---

### 5. ⚡ Animaciones de Alto Rendimiento con GSAP

**Problema:** Crear animaciones fluidas (60fps) para efectos visuales sin bloquear el hilo principal.

**Solución:**

```jsx
// Componente Plasma con GSAP optimizado
const Plasma = () => {
  const plasmaRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".plasma-circle", {
        scale: 1.2,
        opacity: 0.8,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.5 },
      });
    }, plasmaRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <div ref={plasmaRef} className="plasma-container">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="plasma-circle" />
      ))}
    </div>
  );
};
```

**Resultado:** Efectos visuales cinematográficos manteniendo 60fps en dispositivos móviles.

---

### 6. 🧠 Lógica de Chat con Procesamiento de Intenciones

**Problema:** Interpretar comandos del usuario ("crear tarea para mañana", "mostrar mis notas") y ejecutar acciones.

**Solución:**

```jsx
// geminiLogic.js - Parser de intenciones
const parseUserIntent = (message) => {
  const intents = {
    CREATE_TASK: /crear?\s*(tarea|recordatorio|pendiente)/i,
    LIST_TASKS: /(mostrar|ver|listar)\s*(mis)?\s*tareas/i,
    CREATE_NOTE: /crear?\s*(nota|apunte)/i,
    CREATE_EVENT: /crear?\s*(evento|cita|reunión)/i,
  };

  for (const [intent, pattern] of Object.entries(intents)) {
    if (pattern.test(message)) {
      return { intent, confidence: 0.9 };
    }
  }
  return { intent: "CHAT", confidence: 1.0 };
};

// chatFlows.js - Ejecución de flujos
const executeChatFlow = async (intent, message, context) => {
  switch (intent) {
    case "CREATE_TASK":
      return await handleTaskCreation(message, context);
    case "LIST_TASKS":
      return await handleTaskListing(context);
    // ... más casos
  }
};
```

**Resultado:** Chat que entiende comandos en lenguaje natural y ejecuta acciones automáticamente.

---

### 7. 📱 Diseño Responsive con Mobile-First

**Problema:** Crear experiencia óptima en móviles, tablets y desktop con una sola base de código.

**Solución:**

```css
/* Mobile-first approach */
.dashboard-container {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .dashboard-container {
    flex-direction: row;
    padding: 1.5rem;
  }
  .sidebar {
    width: 280px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .dashboard-container {
    padding: 2rem;
    gap: 2rem;
  }
  .chat-panel {
    flex: 1;
    max-width: 800px;
  }
  .side-panels {
    width: 400px;
  }
}
```

**Resultado:** App que se siente nativa en cualquier dispositivo con código mantenible.

---

## 📋 Tabla de Contenidos

- [🌐 Demo en Vivo](#-demo-en-vivo)
- [📐 Arquitectura](#-arquitectura)
- [🏆 Retos Técnicos Superados](#-retos-técnicos-superados)
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

---

## 📖 Descripción

Frontend de **MiloAssistant**, una aplicación web moderna y responsiva que ofrece una experiencia de usuario fluida y atractiva. Construida con las últimas tecnologías de React y optimizada para rendimiento.

### ✨ Características Principales

| Característica           | Descripción                              | Tecnología            |
| ------------------------ | ---------------------------------------- | --------------------- |
| 💬 **Chat Inteligente**  | Conversación con IA con formato Markdown | React-Markdown        |
| 🔐 **Autenticación**     | Login tradicional y Google OAuth 2.0     | @react-oauth/google   |
| ✅ **Gestión de Tareas** | CRUD con prioridades y fechas            | Custom Hooks          |
| 📝 **Sistema de Notas**  | Organización con búsqueda avanzada       | Full-text search      |
| 📅 **Calendario**        | Integración con Google Calendar          | FullCalendar          |
| 🌓 **Temas**             | Modo claro/oscuro con persistencia       | CSS Variables         |
| 📱 **Responsive**        | Mobile-first design                      | CSS Grid/Flexbox      |
| ⚡ **Rendimiento**       | Carga optimizada                         | Vite + Code Splitting |
| 🎨 **Animaciones**       | Efectos visuales suaves                  | GSAP                  |
| 🔔 **Notificaciones**    | Sistema toast                            | Context API           |

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
