// Página para editar moneda con diseño JM NVMMIS
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { subirImagen, eliminarImagen } from '../services/storage';
import { actualizarMoneda, obtenerMonedaPorId } from '../services/firestore';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import Toast from '../components/Toast';
import { PAISES } from '../utils/paises';

const EditarMoneda = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  
  // Datos del formulario
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [pais, setPais] = useState('');
  const [stock, setStock] = useState('0');
  const [imagenesActuales, setImagenesActuales] = useState([]);
  const [imagenesNuevas, setImagenesNuevas] = useState([]);
  const [previewsNuevas, setPreviewsNuevas] = useState([]);

  useEffect(() => {
    cargarMoneda();
    
    const updateBgColor = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setBgColor(isDark ? '#111827' : '#ffffff');
    };
    
    updateBgColor();
    
    const observer = new MutationObserver(updateBgColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, [id]);

  const cargarMoneda = async () => {
    const resultado = await obtenerMonedaPorId(id);
    if (resultado.success && resultado.moneda) {
      const moneda = resultado.moneda;
      setNombre(moneda.nombre);
      setPrecio(moneda.precio.toString());
      setDescripcion(moneda.descripcion || '');
      setPais(moneda.pais || '');
      setStock((moneda.stock || 0).toString());
      setImagenesActuales(moneda.imagenes || []);
    } else {
      setError(t('editCoin.messages.notFound'));
    }
    setLoading(false);
  };

  const handleImagenesNuevasChange = (e) => {
    const archivos = Array.from(e.target.files);
    
    const totalImagenes = imagenesActuales.length + imagenesNuevas.length + archivos.length;
    if (totalImagenes > 5) {
      setError(t('newCoin.messages.maxImages'));
      return;
    }

    setImagenesNuevas([...imagenesNuevas, ...archivos]);
    
    const nuevasPreviews = archivos.map(archivo => URL.createObjectURL(archivo));
    setPreviewsNuevas([...previewsNuevas, ...nuevasPreviews]);
  };

  const eliminarImagenActual = async (index) => {
    const imagen = imagenesActuales[index];
    const nuevasImagenes = imagenesActuales.filter((_, i) => i !== index);
    setImagenesActuales(nuevasImagenes);
  };

  const eliminarImagenNueva = (index) => {
    const nuevasImagenes = imagenesNuevas.filter((_, i) => i !== index);
    const nuevasPreviews = previewsNuevas.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(previewsNuevas[index]);
    setImagenesNuevas(nuevasImagenes);
    setPreviewsNuevas(nuevasPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);

    try {
      // Validaciones
      if (!nombre.trim()) {
        setError(t('newCoin.messages.nameRequired'));
        setGuardando(false);
        return;
      }

      if (!precio || parseFloat(precio) <= 0) {
        setError(t('newCoin.messages.priceInvalid'));
        setGuardando(false);
        return;
      }

      if (imagenesActuales.length + imagenesNuevas.length === 0) {
        setError(t('newCoin.messages.minOneImage'));
        setGuardando(false);
        return;
      }

      // Subir imágenes nuevas
      const imagenesSubidas = [];
      for (const imagen of imagenesNuevas) {
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

      // Combinar imágenes actuales con las nuevas
      const todasLasImagenes = [...imagenesActuales, ...imagenesSubidas];

      // Actualizar moneda
      const stockActualizado = parseInt(stock) || 0;
      const datos = {
        nombre: nombre.trim(),
        precio: parseFloat(precio),
        descripcion: descripcion.trim(),
        pais: pais.trim(),
        stock: stockActualizado,
        activa: stockActualizado > 0, // Auto-desactivar si stock es 0
        imagenes: todasLasImagenes
      };

      const resultado = await actualizarMoneda(id, datos);

      if (resultado.success) {
        setToast({ message: t('editCoin.messages.success'), type: 'success' });
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        throw new Error(resultado.error);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || t('editCoin.messages.error'));
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando moneda...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-colors" 
      style={{ backgroundColor: bgColor }}
    >
      {/* Header elegante */}
      <header className="bg-gradient-to-b from-black to-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white tracking-wider">
              JM NVMMIS
            </h1>
            <div className="mt-2 flex items-center justify-center md:justify-start gap-2">
              <div className="h-px bg-amber-500 w-12"></div>
              <p className="text-sm text-amber-400 tracking-[0.2em] uppercase font-light">
                Editar Moneda
              </p>
              <div className="h-px bg-amber-500 w-12"></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <ThemeToggle />
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-500 text-white px-8 py-3 rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {t('header.back')}
            </button>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
      </header>

      {/* Formulario */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-3xl font-bold font-display text-gray-900 dark:text-white mb-8">
            {t('editCoin.title')}
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
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {t('newCoin.name')} *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Moneda 1 Peso 1995"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('newCoin.price')} *
              </label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="5000"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                {t('newCoin.description')}
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción detallada de la moneda..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* País */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                {t('newCoin.country')}
              </label>
              <select
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {PAISES.map((p) => (
                  <option key={p.codigo} value={p.nombre}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                {t('newCoin.stock')} *
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                min="0"
                step="1"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Imágenes (máximo 5) *
              </label>

              {/* Imágenes actuales */}
              {imagenesActuales.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('editCoin.currentImages')}</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {imagenesActuales.map((imagen, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imagen.url}
                          alt={`Actual ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl border-2 border-amber-500/20 shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => eliminarImagenActual(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Agregar nuevas imágenes */}
              {(imagenesActuales.length + imagenesNuevas.length) < 5 && (
                <div className="mb-4">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click para subir</span> o arrastra las imágenes
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, WEBP</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImagenesNuevasChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Previews de nuevas imágenes */}
              {previewsNuevas.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('editCoin.newImages')}</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {previewsNuevas.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Nueva ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl border-2 border-green-500/20 shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => eliminarImagenNueva(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={guardando}
                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 text-white py-4 rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {guardando ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t('editCoin.saving')}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('editCoin.save')}
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

export default EditarMoneda;
