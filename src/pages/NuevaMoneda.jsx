// Página para crear nueva moneda - REFACTORIZADA
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import Logo from '../components/Logo';
import Toast from '../components/Toast';
import FormularioMoneda from '../components/monedas/FormularioMoneda';
import { useMonedaForm } from '../hooks/useMonedaForm';

const NuevaMoneda = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [bgColor, setBgColor] = useState('#ffffff');
  
  // Hook personalizado con toda la lógica del formulario
  const formState = useMonedaForm();

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
        <FormularioMoneda formState={formState} />
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

export default NuevaMoneda;
