// Sección básica del formulario: Nombre, Precios y Descripción
import { useTranslation } from 'react-i18next';
import CustomSelect from '../CustomSelect';
import { TIPOS_MONEDA } from '../../utils/monedas';

const SeccionBasica = ({ formState }) => {
  const { t } = useTranslation();

  return (
    <>
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
          value={formState.nombre}
          onChange={(e) => formState.setNombre(e.target.value)}
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
          {formState.precios.map((precioItem, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <input
                    type="number"
                    value={precioItem.precio}
                    onChange={(e) => formState.actualizarPrecio(index, 'precio', e.target.value)}
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
                    onChange={(valor) => formState.actualizarPrecio(index, 'tipo_moneda', valor)}
                    options={TIPOS_MONEDA.map(m => ({ value: m.codigo, label: `${m.simbolo} ${m.codigo}` }))}
                  />
                </div>
              </div>
              {formState.precios.length > 1 && (
                <button
                  type="button"
                  onClick={() => formState.eliminarPrecio(index)}
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
          onClick={formState.agregarPrecio}
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
          value={formState.descripcion}
          onChange={(e) => formState.setDescripcion(e.target.value)}
          placeholder={t('newCoin.descriptionPlaceholder')}
          rows="4"
          className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
        />
      </div>
    </>
  );
};

export default SeccionBasica;
