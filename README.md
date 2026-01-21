# 🎛️ JM NVMMIS - Panel de Administración

Panel de administración moderno para gestionar el catálogo de monedas raras y coleccionables.

## 🌟 Características Principales

### Gestión de Catálogo
- ✅ **CRUD completo** de monedas con interfaz intuitiva
- 🖼️ **Gestión de imágenes** con soporte multi-imagen y vista previa
- 📊 **Dashboard** con estadísticas en tiempo real
- 🔍 **Filtros avanzados** por país, estado y búsqueda
- 💰 **Múltiples precios** por moneda (ARS, USD, EUR)
- 📦 **Control de stock** con alertas de inventario bajo

### Sistema de Información
- 📝 **11 campos especializados** de información numismática:
  - Información Histórica (emisor, autoridad, año, tipo)
  - Denominación (valor, unidad monetaria)
  - Especificaciones Técnicas (composición, peso, diámetro, grosor, forma, técnica, orientación)
  - Catalogación (desmonetizada, número de catálogo, referencias)

### Internacionalización
- 🌍 **3 idiomas** soportados: Español, Inglés y Portugués
- 🔄 **Cambio dinámico** de idioma sin recargar página
- 📋 **195 países** traducidos en los 3 idiomas
- 🎨 **Interfaz completamente traducida** incluyendo formularios y mensajes

### Autenticación y Seguridad
- 🔐 **Firebase Authentication** con email/password
- 👤 **Control de acceso** solo para administradores
- 🔒 **Rutas protegidas** con redirección automática

### Diseño y UX
- 🌓 **Modo oscuro/claro** con persistencia en localStorage
- 📱 **100% responsive** para todos los dispositivos
- ⚡ **Carga rápida** con Vite y optimización de imágenes
- 🎨 **Diseño elegante** con Tailwind CSS y tema ámbar
- ✨ **Animaciones suaves** y transiciones cuidadas

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.3** - Librería UI con Hooks
- **React Router DOM 7.1** - Navegación SPA
- **Vite 6.0** - Build tool ultrarrápido
- **Tailwind CSS 3.4** - Framework CSS utility-first

### Backend & Servicios
- **Supabase** - Base de datos PostgreSQL y Storage
- **Firebase Authentication** - Autenticación de usuarios

### Internacionalización
- **react-i18next 15.2** - Sistema de traducciones
- **i18next 24.2** - Framework i18n

### Herramientas de Desarrollo
- **ESLint** - Linter de código
- **PostCSS** - Procesador CSS
- **Autoprefixer** - Prefijos CSS automáticos

## 📦 Instalación y Configuración

### 1. Clonar e instalar dependencias

```bash
# Clonar el repositorio
git clone https://github.com/TU-USUARIO/jmnvmmis-panel.git
cd jmnvmmis-panel

# Instalar dependencias
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Supabase (Base de datos y Storage)
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Firebase (Autenticación)
VITE_FIREBASE_API_KEY=tu_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_firebase_app_id
```

### 3. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Crea la tabla `monedas` con la siguiente estructura:

```sql
CREATE TABLE monedas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  pais TEXT,
  precios JSONB DEFAULT '[]',
  stock INTEGER DEFAULT 0,
  activa BOOLEAN DEFAULT true,
  imagenes JSONB DEFAULT '[]',
  -- Información Histórica
  emisor TEXT,
  autoridad_gobernante TEXT,
  anio_emision TEXT,
  tipo_moneda TEXT,
  -- Denominación
  valor_denominacion TEXT,
  unidad_monetaria TEXT,
  -- Especificaciones Técnicas
  composicion TEXT,
  peso TEXT,
  diametro TEXT,
  grosor TEXT,
  forma TEXT,
  tecnica_acuniacion TEXT,
  orientacion_cuños TEXT,
  -- Catalogación
  desmonetizada BOOLEAN DEFAULT false,
  numero_catalogo TEXT,
  referencias TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

3. Configura un bucket de Storage llamado `monedas` para las imágenes

### 4. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita **Authentication** → **Email/Password**
3. Crea un usuario administrador desde la consola
4. Copia las credenciales al archivo `.env`

### 5. Ejecutar el proyecto

```bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📁 Estructura del Proyecto

```
jmnvmmis-panel/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── monedas/         # Componentes del formulario de monedas
│   │   ├── CustomSelect.jsx
│   │   ├── LanguageSelector.jsx
│   │   ├── Logo.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── Toast.jsx
│   ├── context/             # Context API
│   │   └── AuthContext.jsx  # Contexto de autenticación
│   ├── hooks/               # Custom Hooks
│   │   └── useMonedaForm.js # Hook del formulario
│   ├── i18n/                # Internacionalización
│   │   ├── config.js        # Configuración i18next
│   │   └── locales/         # Archivos de traducción
│   │       ├── es.json
│   │       ├── en.json
│   │       └── pt.json
│   ├── pages/               # Páginas principales
│   │   ├── Dashboard.jsx
│   │   ├── EditarMoneda.jsx
│   │   ├── Login.jsx
│   │   └── NuevaMoneda.jsx
│   ├── services/            # Servicios externos
│   │   ├── auth.js          # Firebase Auth
│   │   ├── firestore.js     # Supabase DB
│   │   └── storage.js       # Supabase Storage
│   ├── utils/               # Utilidades
│   │   ├── monedas.js       # Tipos de moneda y orientaciones
│   │   └── paises.js        # Lista de países (195)
│   ├── App.jsx              # Componente raíz
│   ├── index.css            # Estilos globales
│   └── main.jsx             # Punto de entrada
├── public/                   # Archivos estáticos
├── .env                      # Variables de entorno (no versionar)
├── .env.example             # Ejemplo de variables de entorno
├── index.html               # HTML base
├── package.json             # Dependencias
├── tailwind.config.js       # Configuración Tailwind
└── vite.config.js          # Configuración Vite
```

## 🎨 Características de Diseño

### Tema Visual
- **Colores principales:** Ámbar (#F59E0B) y gradientes cálidos
- **Tipografía:** 
  - Display: 'Cinzel' (elegante y serif)
  - Body: System fonts (óptimo rendimiento)
- **Modo oscuro:** Fondo negro (#000000) con overlays sutiles

### Componentes Personalizados
- **CustomSelect:** Dropdown elegante con animaciones
- **Toast:** Notificaciones no intrusivas
- **Logo:** Responsive con variantes (icon/full)
- **ThemeToggle:** Switch animado sol/luna

## 🔐 Credenciales de Acceso

Por seguridad, las credenciales deben configurarse manualmente. Contacta al administrador del proyecto o crea un usuario desde la consola de Firebase.

## 🚀 Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # Ejecutar ESLint
```

## 📝 Licencia

Todos los derechos reservados © 2025 JM NVMMIS

---

**Desarrollado con ❤️ para coleccionistas de monedas**
