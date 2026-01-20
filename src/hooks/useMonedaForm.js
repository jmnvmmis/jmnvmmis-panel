// Custom hook para manejar el estado y lógica del formulario de monedas
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { subirImagen, eliminarImagen } from '../services/storage';
import { crearMoneda, actualizarMoneda } from '../services/firestore';

export const useMonedaForm = (monedaInicial = null) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams(); // Para detectar si estamos en modo edición
  const modoEdicion = !!monedaInicial && !!id;
  
  // Estados generales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  
  // Datos básicos
  const [nombre, setNombre] = useState('');
  const [precios, setPrecios] = useState([{ precio: '', tipo_moneda: 'ARS' }]);
  const [descripcion, setDescripcion] = useState('');
  const [pais, setPais] = useState('');
  const [stock, setStock] = useState('0');
  const [imagenes, setImagenes] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [imagenesExistentes, setImagenesExistentes] = useState([]);
  
  // Información histórica
  const [emisor, setEmisor] = useState('');
  const [autoridad, setAutoridad] = useState('');
  const [año, setAño] = useState('');
  const [tipoMoneda, setTipoMoneda] = useState('');
  
  // Denominación
  const [valor, setValor] = useState('');
  const [unidadMonetaria, setUnidadMonetaria] = useState('');
  
  // Especificaciones técnicas
  const [composicion, setComposicion] = useState('');
  const [peso, setPeso] = useState('');
  const [diametro, setDiametro] = useState('');
  const [grosor, setGrosor] = useState('');
  const [orientacion, setOrientacion] = useState('');
  const [forma, setForma] = useState('');
  const [tecnica, setTecnica] = useState('');
  
  // Catalogación
  const [desmonetizada, setDesmonetizada] = useState(false);
  const [numero, setNumero] = useState('');
  const [referencias, setReferencias] = useState('');

  // Efecto para cargar datos iniciales cuando cambie monedaInicial
  useEffect(() => {
    if (monedaInicial) {
      setNombre(monedaInicial.nombre || '');
      // Cargar precios
      if (monedaInicial.precios && Array.isArray(monedaInicial.precios) && monedaInicial.precios.length > 0) {
        setPrecios(monedaInicial.precios.map(p => ({
          precio: p.precio.toString(),
          tipo_moneda: p.tipo_moneda
        })));
      }
      setDescripcion(monedaInicial.descripcion || '');
      setPais(monedaInicial.pais || '');
      setStock(monedaInicial.stock?.toString() || '0');
      setImagenesExistentes(monedaInicial.imagenes || []);
      // Información histórica
      setEmisor(monedaInicial.emisor || '');
      setAutoridad(monedaInicial.autoridad || '');
      setAño(monedaInicial.año || '');
      setTipoMoneda(monedaInicial.tipo_moneda || '');
      // Denominación
      setValor(monedaInicial.valor || '');
      setUnidadMonetaria(monedaInicial.unidad_monetaria || '');
      // Especificaciones técnicas
      setComposicion(monedaInicial.composicion || '');
      setPeso(monedaInicial.peso?.toString() || '');
      setDiametro(monedaInicial.diametro?.toString() || '');
      setGrosor(monedaInicial.grosor?.toString() || '');
      setOrientacion(monedaInicial.orientacion || '');
      setForma(monedaInicial.forma || '');
      setTecnica(monedaInicial.tecnica || '');
      // Catalogación
      setDesmonetizada(monedaInicial.desmonetizada || false);
      setNumero(monedaInicial.numero || '');
      setReferencias(monedaInicial.referencias || '');
    }
  }, [monedaInicial]);

  // Funciones para manejar precios
  const agregarPrecio = () => {
    setPrecios([...precios, { precio: '', tipo_moneda: 'ARS' }]);
  };

  const eliminarPrecio = (index) => {
    if (precios.length > 1) {
      setPrecios(precios.filter((_, i) => i !== index));
    }
  };

  const actualizarPrecio = (index, campo, valor) => {
    const nuevosPrecios = [...precios];
    nuevosPrecios[index][campo] = valor;
    setPrecios(nuevosPrecios);
  };

  // Funciones para manejar imágenes
  const handleImagenesChange = (archivos) => {
    const archivosArray = Array.from(archivos);
    
    if (archivosArray.length + imagenes.length + imagenesExistentes.length > 5) {
      setError(t('newCoin.messages.maxImages'));
      return;
    }

    setImagenes([...imagenes, ...archivosArray]);
    
    const nuevasPreviews = archivosArray.map(archivo => URL.createObjectURL(archivo));
    setPreviews([...previews, ...nuevasPreviews]);
  };

  const eliminarPreview = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImagenes(imagenes.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const eliminarImagenExistente = (index) => {
    setImagenesExistentes(imagenesExistentes.filter((_, i) => i !== index));
  };

  // Validación
  const validarFormulario = () => {
    if (!nombre.trim()) {
      setError(t('newCoin.messages.nameRequired'));
      return false;
    }

    if (precios.length === 0) {
      setError('Debe agregar al menos un precio');
      return false;
    }

    const preciosValidos = precios.filter(p => p.precio && parseFloat(p.precio) > 0);
    if (preciosValidos.length === 0) {
      setError('Debe ingresar al menos un precio válido mayor a 0');
      return false;
    }

    if (imagenes.length === 0 && imagenesExistentes.length === 0) {
      setError(t('newCoin.messages.minOneImage'));
      return false;
    }

    return true;
  };

  // Preparar datos para enviar
  const prepararDatos = async () => {
    // Subir nuevas imágenes
    const imagenesSubidas = [...imagenesExistentes];
    
    for (const imagen of imagenes) {
      const resultado = await subirImagen(imagen);
      if (resultado.success) {
        imagenesSubidas.push({
          url: resultado.url,
          path: resultado.path
        });
      } else {
        throw new Error('Error al subir imagen');
      }
    }

    // Preparar precios válidos
    const preciosValidos = precios
      .filter(p => p.precio && parseFloat(p.precio) > 0)
      .map(p => ({
        precio: parseFloat(p.precio),
        tipo_moneda: p.tipo_moneda
      }));

    return {
      nombre: nombre.trim(),
      precios: preciosValidos,
      descripcion: descripcion.trim(),
      pais: pais.trim(),
      stock: parseInt(stock) || 0,
      activa: parseInt(stock) > 0,
      imagenes: imagenesSubidas,
      // Información histórica
      emisor: emisor.trim() || null,
      autoridad: autoridad.trim() || null,
      año: año.trim() || null,
      tipo_moneda: tipoMoneda.trim() || null,
      // Denominación
      valor: valor.trim() || null,
      unidad_monetaria: unidadMonetaria.trim() || null,
      // Especificaciones técnicas
      composicion: composicion.trim() || null,
      peso: peso ? parseFloat(peso) : null,
      diametro: diametro ? parseFloat(diametro) : null,
      grosor: grosor ? parseFloat(grosor) : null,
      orientacion: orientacion || null,
      forma: forma.trim() || null,
      tecnica: tecnica.trim() || null,
      // Catalogación
      desmonetizada: desmonetizada,
      numero: numero.trim() || null,
      referencias: referencias.trim() || null
    };
  };

  // Submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!validarFormulario()) {
        setLoading(false);
        return;
      }

      const datos = await prepararDatos();
      
      // Decidir si crear o actualizar
      const resultado = modoEdicion 
        ? await actualizarMoneda(id, datos)
        : await crearMoneda(datos);

      if (resultado.success) {
        const mensaje = modoEdicion 
          ? t('editCoin.messages.success') 
          : t('newCoin.messages.success');
        setToast({ message: mensaje, type: 'success' });
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        // Si falla, eliminar imágenes subidas nuevas
        const imagenesNuevas = datos.imagenes.filter(
          img => !imagenesExistentes.some(existente => existente.path === img.path)
        );
        for (const img of imagenesNuevas) {
          await eliminarImagen(img.path);
        }
        throw new Error(resultado.error);
      }
    } catch (err) {
      console.error('Error:', err);
      const mensajeError = modoEdicion 
        ? t('editCoin.messages.error') 
        : t('newCoin.messages.error');
      setError(err.message || mensajeError);
      setLoading(false);
    }
  };

  return {
    // Estados
    loading,
    error,
    toast,
    setToast,
    // Datos básicos
    nombre,
    setNombre,
    precios,
    descripcion,
    setDescripcion,
    pais,
    setPais,
    stock,
    setStock,
    imagenes,
    previews,
    imagenesExistentes,
    // Información histórica
    emisor,
    setEmisor,
    autoridad,
    setAutoridad,
    año,
    setAño,
    tipoMoneda,
    setTipoMoneda,
    // Denominación
    valor,
    setValor,
    unidadMonetaria,
    setUnidadMonetaria,
    // Especificaciones
    composicion,
    setComposicion,
    peso,
    setPeso,
    diametro,
    setDiametro,
    grosor,
    setGrosor,
    orientacion,
    setOrientacion,
    forma,
    setForma,
    tecnica,
    setTecnica,
    // Catalogación
    desmonetizada,
    setDesmonetizada,
    numero,
    setNumero,
    referencias,
    setReferencias,
    // Funciones
    agregarPrecio,
    eliminarPrecio,
    actualizarPrecio,
    handleImagenesChange,
    eliminarPreview,
    eliminarImagenExistente,
    handleSubmit
  };
};
