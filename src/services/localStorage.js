// Servicio de almacenamiento local temporal (reemplaza Firebase)
// Simula Firestore con localStorage

const STORAGE_KEY = 'jmnvmmis_monedas';
const AUTH_KEY = 'jmnvmmis_auth';

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============= AUTHENTICATION =============
export const login = async (email, password) => {
  await delay(500);
  
  // Usuario hardcodeado para desarrollo
  if (email === 'admin@jmnvmmis.com' && password === 'admin123') {
    const user = { email, uid: 'admin-123' };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return { success: true, user };
  }
  
  return { success: false, error: 'Credenciales incorrectas' };
};

export const logout = async () => {
  await delay(300);
  localStorage.removeItem(AUTH_KEY);
  return { success: true };
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem(AUTH_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// ============= FIRESTORE (MONEDAS) =============
const getMonedas = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveMonedas = (monedas) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(monedas));
};

export const crearMoneda = async (datos) => {
  await delay(800);
  
  try {
    const monedas = getMonedas();
    const nuevaMoneda = {
      id: `moneda_${Date.now()}`,
      ...datos,
      activa: true,
      fechaCreacion: { seconds: Date.now() / 1000 }
    };
    
    monedas.push(nuevaMoneda);
    saveMonedas(monedas);
    
    return { success: true, id: nuevaMoneda.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const obtenerTodasMonedas = async () => {
  await delay(500);
  const monedas = getMonedas();
  return { success: true, monedas };
};

export const obtenerMonedasPublicas = async () => {
  await delay(400);
  const monedas = getMonedas();
  const publicas = monedas.filter(m => m.activa);
  return publicas;
};

export const obtenerMonedaPorId = async (id) => {
  await delay(300);
  const monedas = getMonedas();
  const moneda = monedas.find(m => m.id === id);
  
  if (moneda) {
    return { success: true, moneda };
  }
  return { success: false, error: 'Moneda no encontrada' };
};

export const actualizarMoneda = async (id, datos) => {
  await delay(600);
  
  try {
    const monedas = getMonedas();
    const index = monedas.findIndex(m => m.id === id);
    
    if (index === -1) {
      return { success: false, error: 'Moneda no encontrada' };
    }
    
    monedas[index] = { ...monedas[index], ...datos };
    saveMonedas(monedas);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const eliminarMoneda = async (id) => {
  await delay(500);
  
  try {
    const monedas = getMonedas();
    const nuevasMonedas = monedas.filter(m => m.id !== id);
    saveMonedas(nuevasMonedas);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============= STORAGE (IMÁGENES) =============
// Convertir imagen a base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const subirImagen = async (file) => {
  await delay(1000); // Simular subida
  
  try {
    const base64 = await fileToBase64(file);
    const path = `monedas/${Date.now()}_${file.name}`;
    
    return {
      success: true,
      url: base64, // Guardar base64 directamente
      path: path
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const eliminarImagen = async (path) => {
  await delay(200);
  // En localStorage no necesitamos eliminar la imagen
  return { success: true };
};

// ============= DATOS DE PRUEBA =============
// Inicializar con datos de ejemplo si no hay nada
export const inicializarDatosPrueba = () => {
  const monedas = getMonedas();
  
  if (monedas.length === 0) {
    const monedasPrueba = [
      {
        id: 'moneda_demo_1',
        nombre: 'Moneda 1 Peso 1995',
        precio: 5000,
        descripcion: 'Moneda de prueba para desarrollo',
        activa: true,
        imagenes: [{
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TW9uZWRhIDE8L3RleHQ+PC9zdmc+',
          path: 'demo/moneda1.jpg'
        }],
        fechaCreacion: { seconds: Date.now() / 1000 - 86400 }
      },
      {
        id: 'moneda_demo_2',
        nombre: 'Moneda 2 Pesos 2010',
        precio: 8000,
        descripcion: 'Segunda moneda de prueba',
        activa: true,
        imagenes: [{
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TW9uZWRhIDI8L3RleHQ+PC9zdmc+',
          path: 'demo/moneda2.jpg'
        }],
        fechaCreacion: { seconds: Date.now() / 1000 - 172800 }
      }
    ];
    
    saveMonedas(monedasPrueba);
    console.log('✅ Datos de prueba inicializados');
  }
};
