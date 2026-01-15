// Tipos de moneda disponibles para los precios
export const TIPOS_MONEDA = [
  { codigo: 'ARS', nombre: 'Peso Argentino', simbolo: '$' },
  { codigo: 'USD', nombre: 'Dólar Estadounidense', simbolo: 'US$' },
  { codigo: 'EUR', nombre: 'Euro', simbolo: '€' }
];

// Tipos de orientación de monedas
export const ORIENTACIONES = [
  { valor: '', label: 'Sin especificar' },
  { valor: 'Alineación moneda ↑↓', label: 'Alineación moneda ↑↓' },
  { valor: 'Alineación moneda ↑↑', label: 'Alineación moneda ↑↑' }
];

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
