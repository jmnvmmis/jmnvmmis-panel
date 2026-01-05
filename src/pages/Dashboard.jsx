// Dashboard del Administrador con diseño JM NVMMIS
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logout } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { obtenerTodasMonedas, eliminarMoneda, actualizarMoneda } from '../services/firestore';
import { eliminarImagen } from '../services/storage';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import Logo from '../components/Logo';
import Toast from '../components/Toast';
import CustomSelect from '../components/CustomSelect';
import { PAISES } from '../utils/paises';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [monedas, setMonedas] = useState([]);
  const [monedasFiltradas, setMonedasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  
  // Estados de filtros y búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroPais, setFiltroPais] = useState('todos');
  const [ordenamiento, setOrdenamiento] = useState('fecha');

  useEffect(() => {
    cargarMonedas();
    
    // Función para actualizar el color de fondo
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

  useEffect(() => {
    aplicarFiltros();
  }, [monedas, busqueda, filtroEstado, filtroPais, ordenamiento]);

  const cargarMonedas = async () => {
    setLoading(true);
    const resultado = await obtenerTodasMonedas();
    console.log('Resultado de Supabase:', resultado); // Debug
    if (resultado.success) {
      setMonedas(resultado.monedas || []);
    } else {
      console.error('Error al cargar monedas:', resultado.error);
      setMonedas([]);
    }
    setLoading(false);
  };

  const aplicarFiltros = () => {
    let resultado = [...monedas];

    if (busqueda.trim()) {
      resultado = resultado.filter(moneda =>
        moneda.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (filtroEstado === 'activas') {
      resultado = resultado.filter(moneda => moneda.activa);
    } else if (filtroEstado === 'inactivas') {
      resultado = resultado.filter(moneda => !moneda.activa);
    }

    if (filtroPais !== 'todos') {
      resultado = resultado.filter(moneda => moneda.pais === filtroPais);
    }

    if (ordenamiento === 'nombre') {
      resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (ordenamiento === 'precio') {
      resultado.sort((a, b) => (parseFloat(b.precio) || 0) - (parseFloat(a.precio) || 0));
    } else {
      // Ordenar por created_at (Supabase) en lugar de fechaCreacion
      resultado.sort((a, b) => {
        const fechaA = new Date(a.created_at).getTime();
        const fechaB = new Date(b.created_at).getTime();
        return fechaB - fechaA;
      });
    }

    setMonedasFiltradas(resultado);
  };

  const calcularEstadisticas = () => {
    const total = monedas.length;
    const activas = monedas.filter(m => m.activa).length;
    const inactivas = total - activas;
    const valorTotal = monedas.reduce((sum, m) => sum + (parseFloat(m.precio) || 0), 0);
    const stockTotal = monedas.reduce((sum, m) => sum + (parseInt(m.stock) || 0), 0);

    return { total, activas, inactivas, valorTotal, stockTotal };
  };

  const obtenerPaisesUnicos = () => {
    const paisesSet = new Set(monedas.map(m => m.pais).filter(Boolean));
    return Array.from(paisesSet).sort();
  };

  const paisesDisponibles = obtenerPaisesUnicos();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleEliminar = async (moneda) => {
    setConfirmDelete(moneda);
  };

  const confirmarEliminacion = async () => {
    const moneda = confirmDelete;
    setConfirmDelete(null);

    try {
      if (moneda.imagenes && moneda.imagenes.length > 0) {
        for (const img of moneda.imagenes) {
          await eliminarImagen(img.path);
        }
      }

      const resultado = await eliminarMoneda(moneda.id);
      
      if (resultado.success) {
        setToast({ message: t('dashboard.messages.deleted'), type: 'success' });
        cargarMonedas();
      } else {
        setToast({ message: t('dashboard.messages.error'), type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setToast({ message: t('dashboard.messages.error'), type: 'error' });
    }
  };

  const handleToggleActiva = async (moneda) => {
    // No permitir activar si no hay stock
    if (!moneda.activa && moneda.stock === 0) {
      setToast({ 
        message: t('dashboard.messages.cannotActivate'), 
        type: 'warning' 
      });
      return;
    }

    const nuevaActiva = !moneda.activa;
    const resultado = await actualizarMoneda(moneda.id, { activa: nuevaActiva });
    
    if (resultado.success) {
      setToast({ 
        message: nuevaActiva ? t('dashboard.messages.activated') : t('dashboard.messages.deactivated'), 
        type: 'success' 
      });
      cargarMonedas();
    } else {
      setToast({ message: t('dashboard.messages.error'), type: 'error' });
    }
  };

  const stats = calcularEstadisticas();

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
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base"
            >
              {t('header.logout')}
            </button>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Estadísticas con diseño mejorado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium opacity-90 uppercase tracking-wider">{t('dashboard.stats.coinTypes')}</p>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p className="text-5xl font-bold font-display mb-1">{stats.total}</p>
            <p className="text-sm opacity-80">{stats.stockTotal} {t('dashboard.stats.totalUnits')}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium opacity-90 uppercase tracking-wider">{t('dashboard.stats.active')}</p>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-5xl font-bold font-display">{stats.activas}</p>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium opacity-90 uppercase tracking-wider">{t('dashboard.stats.inactive')}</p>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-5xl font-bold font-display">{stats.inactivas}</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-2xl shadow-xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium opacity-90 uppercase tracking-wider">{t('dashboard.stats.totalValue')}</p>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-4xl font-bold font-display">${stats.valorTotal.toLocaleString('es-AR')}</p>
          </div>
        </div>

        {/* Sección de gestión con diseño mejorado */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl mb-8 border border-amber-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold font-display text-amber-900 dark:text-white mb-2">{t('dashboard.title')}</h2>
              <div className="flex items-center gap-3">
                <div className="h-px bg-amber-500 w-8"></div>
                <p className="text-amber-700 dark:text-gray-400">Administrador: <span className="font-semibold text-amber-600">{user?.email}</span></p>
                <div className="h-px bg-amber-500 w-8"></div>
              </div>
            </div>
            <button
              onClick={() => navigate('/nueva-moneda')}
              className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-8 py-3 rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('header.newCoin')}
            </button>
          </div>

          {/* Filtros mejorados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t('dashboard.filters.search')}
              </label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={t('dashboard.filters.search')}
                className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                {t('dashboard.filters.country')}
              </label>
              <CustomSelect
                value={filtroPais}
                onChange={setFiltroPais}
                options={[
                  { value: 'todos', label: t('dashboard.filters.allCountries') },
                  ...paisesDisponibles.map(pais => ({ value: pais, label: pais }))
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Estado
              </label>
              <CustomSelect
                value={filtroEstado}
                onChange={setFiltroEstado}
                options={[
                  { value: 'todas', label: t('dashboard.filters.all') },
                  { value: 'activas', label: t('dashboard.filters.active') },
                  { value: 'inactivas', label: t('dashboard.filters.inactive') }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Ordenar por
              </label>
              <CustomSelect
                value={ordenamiento}
                onChange={setOrdenamiento}
                options={[
                  { value: 'fecha', label: 'Fecha (más recientes)' },
                  { value: 'nombre', label: 'Nombre (A-Z)' },
                  { value: 'precio', label: 'Precio (mayor a menor)' }
                ]}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-gray-400 bg-amber-50 dark:bg-gray-900 px-4 py-3 rounded-lg">
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Mostrando <strong className="text-amber-600">{monedasFiltradas.length}</strong> de <strong className="text-amber-600">{monedas.length}</strong> monedas</span>
          </div>
        </div>

        {/* Tabla de monedas mejorada */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-xl text-center border border-amber-200 dark:border-gray-700">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Cargando monedas...</p>
            </div>
          </div>
        ) : monedasFiltradas.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-xl text-center border border-amber-200 dark:border-gray-700">
            <div className="max-w-md mx-auto">
              <svg className="w-20 h-20 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-xl mb-6 font-display">
                {monedas.length === 0 
                  ? 'No hay monedas creadas aún.'
                  : 'No se encontraron monedas con los filtros seleccionados.'}
              </p>
              {monedas.length === 0 && (
                <button
                  onClick={() => navigate('/nueva-moneda')}
                  className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-8 py-3 rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all duration-300 font-semibold shadow-lg inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Crear primera moneda
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-amber-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-amber-700 dark:text-gray-300 uppercase tracking-wider">
                      {t('dashboard.table.image')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-amber-700 dark:text-gray-300 uppercase tracking-wider">
                      {t('dashboard.table.name')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-amber-700 dark:text-gray-300 uppercase tracking-wider">
                      {t('dashboard.table.country')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-amber-700 dark:text-gray-300 uppercase tracking-wider">
                      {t('dashboard.table.price')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-amber-700 dark:text-gray-300 uppercase tracking-wider">
                      {t('dashboard.table.stock')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-amber-700 dark:text-gray-300 uppercase tracking-wider">
                      {t('dashboard.table.status')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-amber-700 dark:text-gray-300 uppercase tracking-wider">
                      {t('dashboard.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {monedasFiltradas.map((moneda) => (
                    <tr key={moneda.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {moneda.imagenes && moneda.imagenes.length > 0 ? (
                          <img
                            src={moneda.imagenes[0].url}
                            alt={moneda.nombre}
                            className="h-16 w-16 object-cover rounded-xl border-2 border-amber-500/20 shadow-md"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {moneda.nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {moneda.pais ? (
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                            </svg>
                            {moneda.pais}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-amber-600">
                          ${moneda.precio?.toLocaleString('es-AR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {moneda.stock === 0 ? (
                            <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                              {t('dashboard.table.noStock')}
                            </span>
                          ) : moneda.stock < 5 ? (
                            <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              {moneda.stock} {t('dashboard.table.units')}
                            </span>
                          ) : (
                            <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              {moneda.stock} {t('dashboard.table.units')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                            moneda.activa
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}
                        >
                          {moneda.activa ? t('dashboard.table.active') : t('dashboard.table.inactive')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <button
                          onClick={() => navigate(`/editar-moneda/${moneda.id}`)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
                        >
                          {t('dashboard.table.edit')}
                        </button>
                        <button
                          onClick={() => handleToggleActiva(moneda)}
                          disabled={!moneda.activa && moneda.stock === 0}
                          className={`font-semibold transition-colors ${
                            !moneda.activa && moneda.stock === 0
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300'
                          }`}
                          title={!moneda.activa && moneda.stock === 0 ? t('dashboard.messages.cannotActivate') : ''}
                        >
                          {moneda.activa ? t('dashboard.table.deactivate') : t('dashboard.table.activate')}
                        </button>
                        <button
                          onClick={() => handleEliminar(moneda)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-semibold transition-colors"
                        >
                          {t('dashboard.table.delete')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-in-right">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('dashboard.deleteConfirm.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('dashboard.deleteConfirm.message')} <span className="font-semibold text-gray-900 dark:text-white">"{confirmDelete.nombre}"</span>.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold"
              >
                {t('dashboard.deleteConfirm.cancel')}
              </button>
              <button
                onClick={confirmarEliminacion}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-500 hover:to-red-600 transition-all font-semibold shadow-lg"
              >
                {t('dashboard.deleteConfirm.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Dashboard;
