# 🎛️ JM NVMMIS - Panel de Administración

Panel de administración para gestionar el catálogo de monedas raras, construido con React, Vite, Firebase y Tailwind CSS.

## ✨ Características

- 🔐 **Autenticación** con Firebase Authentication
- 📊 **CRUD completo** de monedas
- 🖼️ **Gestión de imágenes** con Firebase Storage
- 🌍 **Sistema multiidioma** (Español, Inglés, Portugués)
- 🌓 **Tema claro/oscuro** con persistencia
- 📱 **Diseño responsive**
- ⚡ **Vite** para desarrollo ultrarrápido

## 🚀 Tecnologías

- React 18
- Vite 6.0.5
- TypeScript
- Firebase 11.1.0
- React Router DOM
- i18next para traducciones
- Tailwind CSS

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/TU-USUARIO/jmnvmmis-panel.git

# Instalar dependencias
cd jmnvmmis-panel
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Firebase

# Ejecutar en desarrollo
npm run dev
```

## 🔧 Configuración

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita Authentication (Email/Password)
3. Copia las credenciales a `.env.local`
4. Configura Firestore Database
5. Configura Storage para las imágenes

## 📄 Estructura

```
jmnvmmis-panel/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── contexts/        # Context API (Auth)
│   ├── lib/            # Configuración Firebase
│   ├── locales/        # Archivos de traducción
│   └── pages/          # Páginas de la aplicación
└── public/             # Archivos estáticos
```

## 🔐 Funcionalidades

- **Dashboard** - Vista general del catálogo
- **Nueva Moneda** - Agregar monedas con imágenes
- **Editar Moneda** - Modificar información y imágenes
- **Gestión de Stock** - Control de inventario

## 🔑 Credenciales de Acceso

Por seguridad, las credenciales deben ser configuradas manualmente. Contacta al administrador del proyecto.

## 📝 Licencia

Todos los derechos reservados © 2025 JM NVMMIS
