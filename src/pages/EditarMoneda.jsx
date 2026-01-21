// Página para editar moneda - REFACTORIZADA
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import Logo from '../components/Logo';
import Toast from '../components/Toast';
import FormularioMoneda from '../components/monedas/FormularioMoneda';
import { useMonedaForm } from '../hooks/useMonedaForm';
import { obtenerMonedaPorId } from '../services/firestore';

const EditarMoneda = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [bgColor, setBgColor] = useState('#ffffff');
  const [cargando, setCargando] = useState(true);
  const [monedaInicial, setMonedaInicial] = useState(null);
  
  // Cargar datos de la moneda
  useEffect(() => {
    const cargarMoneda = async () => {
      const resultado = await obtenerMonedaPorId(id);
      if (resultado.success && resultado.moneda) {
        setMonedaInicial(resultado.moneda);
      } else {
        // Redirigir si no se encuentra
        navigate('/');
      }
      setCargando(false);
    };
    
    cargarMoneda();
  }, [id, navigate]);

  // Hook con los datos iniciales de la moneda
  const formState = useMonedaForm(monedaInicial);

  // Efecto para el color de fondo según el tema
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

  if (cargando) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('editCoin.loadingCoin')}</p>
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
        <FormularioMoneda formState={formState} modoEdicion={true} />
      </div>

      {/* Toast de notificación */}
      {formState.toast && (
        <Toast
          message={formState.toast.message}
          type={formState.toast.type}
          onClose={() => formState.setToast(null)}
        />
      )}
    </div>
  );
};

export default EditarMoneda;
