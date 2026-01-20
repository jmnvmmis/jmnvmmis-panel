// Sección de stock y país
import { useTranslation } from 'react-i18next';
import CustomSelect from '../CustomSelect';
import { PAISES } from '../../utils/paises';

const SeccionStock = ({ formState }) => {
  const { t } = useTranslation();

  return (
    <div className="border-t-2 border-amber-200 dark:border-amber-500/20 pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* País */}
        <div>
          <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            {t('newCoin.country')}
          </label>
          <CustomSelect
            value={formState.pais}
            onChange={formState.setPais}
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
            value={formState.stock}
            onChange={(e) => formState.setStock(e.target.value)}
            placeholder={t('newCoin.stockPlaceholder')}
            min="0"
            step="1"
            className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
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
    </div>
  );
};

export default SeccionStock;
