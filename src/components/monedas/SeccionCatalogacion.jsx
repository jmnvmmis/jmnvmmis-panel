// Sección de catalogación
import { useTranslation } from 'react-i18next';

const SeccionCatalogacion = ({ formState }) => {
  const { t } = useTranslation();
  return (
    <div className="border-t-2 border-amber-200 dark:border-amber-500/20 pt-6">
      <h3 className="text-xl font-bold font-display text-amber-900 dark:text-white mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        {t('sections.cataloging.title')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Desmonetizada */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={formState.desmonetizada}
                onChange={(e) => formState.setDesmonetizada(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-amber-500 transition-colors"></div>
              <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-7 shadow-md"></div>
            </div>
            <div>
              <span className="block text-sm font-semibold text-amber-700 dark:text-gray-300 uppercase tracking-wider">
                {t('sections.cataloging.demonetized')}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('sections.cataloging.demonetizedHelp')}
              </span>
            </div>
          </label>
        </div>

        {/* Número de Catálogo */}
        <div>
          <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            {t('sections.cataloging.catalogNumber')}
          </label>
          <input
            type="text"
            value={formState.numero}
            onChange={(e) => formState.setNumero(e.target.value)}
            placeholder={t('sections.cataloging.catalogNumberPlaceholder')}
            className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
          />
        </div>

        {/* Referencias */}
        <div>
          <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            {t('sections.cataloging.references')}
          </label>
          <input
            type="text"
            value={formState.referencias}
            onChange={(e) => formState.setReferencias(e.target.value)}
            placeholder={t('sections.cataloging.referencesPlaceholder')}
            className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default SeccionCatalogacion;
