// Sección de denominación
const SeccionDenominacion = ({ formState }) => {
  return (
    <div className="border-t-2 border-amber-200 dark:border-amber-500/20 pt-6">
      <h3 className="text-xl font-bold font-display text-amber-900 dark:text-white mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Denominación (Opcional)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Valor Facial
          </label>
          <input
            type="text"
            value={formState.valor}
            onChange={(e) => formState.setValor(e.target.value)}
            placeholder="Ej: 2 Reales, 50 Centavos"
            className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Unidad Monetaria / Sistema
          </label>
          <input
            type="text"
            value={formState.unidadMonetaria}
            onChange={(e) => formState.setUnidadMonetaria(e.target.value)}
            placeholder="Ej: Real (1497-1833), Peso Argentino"
            className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default SeccionDenominacion;
