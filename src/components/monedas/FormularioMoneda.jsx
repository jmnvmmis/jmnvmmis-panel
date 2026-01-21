// Componente wrapper que ensambla todas las secciones del formulario
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SeccionBasica from './SeccionBasica';
import SeccionHistorica from './SeccionHistorica';
import SeccionDenominacion from './SeccionDenominacion';
import SeccionEspecificaciones from './SeccionEspecificaciones';
import SeccionCatalogacion from './SeccionCatalogacion';
import SeccionImagenes from './SeccionImagenes';
import SeccionStock from './SeccionStock';

const FormularioMoneda = ({ formState, modoEdicion = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-amber-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold font-display text-amber-900 dark:text-white mb-8">
        {modoEdicion ? t('editCoin.title') : t('newCoin.title')}
      </h2>

      {formState.error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{formState.error}</span>
        </div>
      )}

      <form onSubmit={formState.handleSubmit} className="space-y-8">
        {/* Sección Básica */}
        <SeccionBasica formState={formState} />

        {/* Sección Histórica */}
        <SeccionHistorica formState={formState} />

        {/* Sección Denominación */}
        <SeccionDenominacion formState={formState} />

        {/* Sección Especificaciones */}
        <SeccionEspecificaciones formState={formState} />

        {/* Sección Catalogación */}
        <SeccionCatalogacion formState={formState} />

        {/* Sección Imágenes */}
        <SeccionImagenes formState={formState} />

        {/* Sección Stock y País */}
        <SeccionStock formState={formState} />

        {/* Botones */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={formState.loading}
            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 text-white py-4 rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {formState.loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {modoEdicion ? t('editCoin.saving') : t('newCoin.creating')}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {modoEdicion ? t('editCoin.save') : t('newCoin.create')}
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
  );
};

export default FormularioMoneda;
