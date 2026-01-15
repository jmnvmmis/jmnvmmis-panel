// Página para crear nueva moneda con diseño JM NVMMIS
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { subirImagen, eliminarImagen } from '../services/storage';
import { crearMoneda } from '../services/firestore';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import Logo from '../components/Logo';
import Toast from '../components/Toast';
import CustomSelect from '../components/CustomSelect';
import { PAISES } from '../utils/paises';
import { TIPOS_MONEDA, ORIENTACIONES } from '../utils/monedas';

const NuevaMoneda = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  
  // Datos del formulario
  const [nombre, setNombre] = useState('');
  const [precios, setPrecios] = useState([{ precio: '', tipo_moneda: 'ARS' }]);
  const [descripcion, setDescripcion] = useState('');
  const [pais, setPais] = useState('');
  const [stock, setStock] = useState('0');
  const [imagenes, setImagenes] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  // Campos técnicos
  const [composicion, setComposicion] = useState('');
  const [peso, setPeso] = useState('');
  const [diametro, setDiametro] = useState('');
  const [grosor, setGrosor] = useState('');
  const [orientacion, setOrientacion] = useState('');
  const [referencias, setReferencias] = useState('');

  // Funciones para manejar múltiples precios
  const agregarPrecio = () => {
    setPrecios([...precios, { precio: '', tipo_moneda: 'ARS' }]);
  };

  const eliminarPrecio = (index) => {
    if (precios.length > 1) {
      const nuevosPrecios = precios.filter((_, i) => i !== index);
      setPrecios(nuevosPrecios);
    }
  };

  const actualizarPrecio = (index, campo, valor) => {
    const nuevosPrecios = [...precios];
    nuevosPrecios[index][campo] = valor;
    setPrecios(nuevosPrecios);
  };

  useEffect(() => {
    const updateBgColor = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setBgColor(isDark ? '#111827' : '#FFFBEB');
    };
    
    updateBgColor();
    
    const observer = new MutationObserver(updateBgColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const handleImagenesChange = (e) => {
    const archivos = Array.from(e.target.files);
    
    if (archivos.length + imagenes.length > 5) {
      setError(t('newCoin.messages.maxImages'));
      return;
    }

    setImagenes([...imagenes, ...archivos]);
    
    // Crear previews
    const nuevasPreviews = archivos.map(archivo => URL.createObjectURL(archivo));
    setPreviews([...previews, ...nuevasPreviews]);
  };

  const eliminarPreview = (index) => {
    const nuevasImagenes = imagenes.filter((_, i) => i !== index);
    const nuevasPreviews = previews.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(previews[index]);
    setImagenes(nuevasImagenes);
    setPreviews(nuevasPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validaciones
      if (!nombre.trim()) {
        setError(t('newCoin.messages.nameRequired'));
        setLoading(false);
        return;
      }

      // Validar que haya al menos un precio
      if (precios.length === 0) {
        setError('Debe agregar al menos un precio');
        setLoading(false);
        return;
      }

      // Validar que todos los precios sean válidos
      const preciosValidos = precios.filter(p => p.precio && parseFloat(p.precio) > 0);
      if (preciosValidos.length === 0) {
        setError('Debe ingresar al menos un precio válido mayor a 0');
        setLoading(false);
        return;
      }

      if (imagenes.length === 0) {
        setError(t('newCoin.messages.minOneImage'));
        setLoading(false);
        return;
      }

      // Subir imágenes
      const imagenesSubidas = [];
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

      // Crear moneda en Firestore
      const datos = {
        nombre: nombre.trim(),
        precios: preciosValidos.map(p => ({
          precio: parseFloat(p.precio),
          tipo_moneda: p.tipo_moneda
        })),
        descripcion: descripcion.trim(),
        pais: pais.trim(),
        stock: parseInt(stock) || 0,
        activa: parseInt(stock) > 0,
        imagenes: imagenesSubidas,
        // Campos técnicos
        composicion: composicion.trim() || null,
        peso: peso ? parseFloat(peso) : null,
        diametro: diametro ? parseFloat(diametro) : null,
        grosor: grosor ? parseFloat(grosor) : null,
        orientacion: orientacion || null,
        referencias: referencias.trim() || null
      };

      const resultado = await crearMoneda(datos);

      if (resultado.success) {
        setToast({ message: t('newCoin.messages.success'), type: 'success' });
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        // Si falla, eliminar imágenes subidas
        for (const img of imagenesSubidas) {
          await eliminarImagen(img.path);
        }
        throw new Error(resultado.error);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || t('newCoin.messages.error'));
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen transition-colors" 
      style={{ backgroundColor: bgColor }}
    >
      {/* Header elegante */}
      <header className="bg-gradient-to-r from-amber-100 to-amber-50 dark:bg-gradient-to-b dark:from-black dark:to-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <Logo variant="full" />
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <ThemeToggle />
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base"
            >
              {t('header.back')}
            </button>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
      </header>

      {/* Formulario */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-amber-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold font-display text-amber-900 dark:text-white mb-8">
            {t('newCoin.title')}
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {t('newCoin.name')} *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder={t('newCoin.namePlaceholder')}
                className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
                required
              />
            </div>

            {/* Precios */}
            <div>
              <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Precios *
              </label>
              
              <div className="space-y-3">
                {precios.map((precioItem, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={precioItem.precio}
                          onChange={(e) => actualizarPrecio(index, 'precio', e.target.value)}
                          onWheel={(e) => e.target.blur()}
                          placeholder="5000,50"
                          min="0"
                          step="0.01"
                          className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          required
                        />
                      </div>
                      <div>
                        <CustomSelect
                          value={precioItem.tipo_moneda}
                          onChange={(valor) => actualizarPrecio(index, 'tipo_moneda', valor)}
                          options={TIPOS_MONEDA.map(m => ({ value: m.codigo, label: `${m.simbolo} ${m.codigo}` }))}
                        />
                      </div>
                    </div>
                    {precios.length > 1 && (
                      <button
                        type="button"
                        onClick={() => eliminarPrecio(index)}
                        className="mt-1 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                        title="Eliminar precio"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={agregarPrecio}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/40 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar otro precio
              </button>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                {t('newCoin.description')}
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder={t('newCoin.descriptionPlaceholder')}
                rows="4"
                className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
              />
            </div>

            {/* Sección de Especificaciones Técnicas */}
            <div className="border-t-2 border-amber-200 dark:border-amber-500/20 pt-6">
              <h3 className="text-xl font-bold font-display text-amber-900 dark:text-white mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Especificaciones Técnicas (Opcional)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Composición */}
                <div>
                  <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                    Composición
                  </label>
                  <input
                    type="text"
                    value={composicion}
                    onChange={(e) => setComposicion(e.target.value)}
                    placeholder="Ej: Plata 900, Bronce, Cobre-Níquel"
                    className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
                  />
                </div>

                {/* Peso */}
                <div>
                  <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                    Peso
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={peso}
                      onChange={(e) => setPeso(e.target.value)}
                      onWheel={(e) => e.target.blur()}
                      placeholder="12,5"
                      step="0.01"
                      min="0"
                      className="w-full px-5 py-3 pr-12 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-700 dark:text-amber-400 font-semibold">g</span>
                  </div>
                </div>

                {/* Diámetro */}
                <div>
                  <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                    Diámetro
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={diametro}
                      onChange={(e) => setDiametro(e.target.value)}
                      onWheel={(e) => e.target.blur()}
                      placeholder="30,1"
                      step="0.1"
                      min="0"
                      className="w-full px-5 py-3 pr-14 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-700 dark:text-amber-400 font-semibold">mm</span>
                  </div>
                </div>

                {/* Grosor */}
                <div>
                  <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                    Grosor
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={grosor}
                      onChange={(e) => setGrosor(e.target.value)}
                      onWheel={(e) => e.target.blur()}
                      placeholder="1,9"
                      step="0.1"
                      min="0"
                      className="w-full px-5 py-3 pr-14 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-700 dark:text-amber-400 font-semibold">mm</span>
                  </div>
                </div>

                {/* Orientación */}
                <div>
                  <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                    Orientación
                  </label>
                  <CustomSelect
                    value={orientacion}
                    onChange={setOrientacion}
                    options={ORIENTACIONES.map(o => ({ value: o.valor, label: o.label }))}
                  />
                </div>

                {/* Referencias */}
                <div>
                  <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                    Referencias
                  </label>
                  <input
                    type="text"
                    value={referencias}
                    onChange={(e) => setReferencias(e.target.value)}
                    placeholder="Ej: KM# 28, CJ# 17"
                    className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* País */}
            <div>
              <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                {t('newCoin.country')}
              </label>
              <CustomSelect
                value={pais}
                onChange={setPais}
                options={PAISES.map(p => ({ value: p.nombre, label: p.nombre }))}
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                {t('newCoin.stock')} *
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder={t('newCoin.stockPlaceholder')}
                min="0"
                step="1"
                className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
                required
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t('newCoin.stockHelp')}
              </p>
              <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
                <p className="text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span><strong>{t('common.important')}</strong> {t('newCoin.stockWarning')}</span>
                </p>
              </div>
            </div>

            {/* Imágenes */}
            <div>
              <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('newCoin.images')} *
              </label>
              
              <div className="mb-4">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">{t('newCoin.uploadImages')}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('newCoin.imageFormats')}</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImagenesChange}
                    className="hidden"
                    disabled={imagenes.length >= 5}
                  />
                </label>
              </div>

              {/* Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl border-2 border-amber-500/20 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => eliminarPreview(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 text-white py-4 rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t('newCoin.creating')}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('newCoin.create')}
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold"
              >
                {t('newCoin.cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast de notificación */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default NuevaMoneda;
