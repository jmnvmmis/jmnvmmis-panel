// Tipos de moneda disponibles para los precios
export const TIPOS_MONEDA_ES = [
  { codigo: 'ARS', nombre: 'Peso Argentino', simbolo: '$' },
  { codigo: 'USD', nombre: 'Dólar Estadounidense', simbolo: 'US$' },
  { codigo: 'EUR', nombre: 'Euro', simbolo: '€' }
];

export const TIPOS_MONEDA_EN = [
  { codigo: 'ARS', nombre: 'Argentine Peso', simbolo: '$' },
  { codigo: 'USD', nombre: 'US Dollar', simbolo: 'US$' },
  { codigo: 'EUR', nombre: 'Euro', simbolo: '€' }
];

// Tipos de orientación de monedas
export const ORIENTACIONES_ES = [
  { valor: '', label: 'Sin especificar' },
  { valor: 'Alineación moneda ↑↓', label: 'Alineación moneda ↑↓' },
  { valor: 'Alineación moneda ↑↑', label: 'Alineación moneda ↑↑' }
];

export const ORIENTACIONES_EN = [
  { valor: '', label: 'Not specified' },
  { valor: 'Alineación moneda ↑↓', label: 'Coin alignment ↑↓' },
  { valor: 'Alineación moneda ↑↑', label: 'Coin alignment ↑↑' }
];

// Funciones helper para obtener datos según idioma
export const obtenerTiposMoneda = (idioma = 'es') => {
  return idioma === 'en' ? TIPOS_MONEDA_EN : TIPOS_MONEDA_ES;
};

export const obtenerOrientaciones = (idioma = 'es') => {
  return idioma === 'en' ? ORIENTACIONES_EN : ORIENTACIONES_ES;
};

// Mantener exportaciones legacy para compatibilidad
export const TIPOS_MONEDA = TIPOS_MONEDA_ES;
export const ORIENTACIONES = ORIENTACIONES_ES;

// Función helper para obtener el símbolo de una moneda
export const obtenerSimboloMoneda = (codigo) => {
  const moneda = TIPOS_MONEDA.find(m => m.codigo === codigo);
  return moneda ? moneda.simbolo : '$';
};

// Función helper para formatear precio con moneda
export const formatearPrecioConMoneda = (precio, tipoMoneda = 'ARS') => {
  const simbolo = obtenerSimboloMoneda(tipoMoneda);
  const precioFormateado = parseFloat(precio).toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${simbolo}${precioFormateado}`;
};

// Función helper para formatear números con coma decimal
export const formatearNumero = (numero) => {
  if (!numero) return '';
  return parseFloat(numero).toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};
