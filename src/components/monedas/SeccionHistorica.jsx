// Sección de información histórica
const SeccionHistorica = ({ formState }) => {
  return (
    <div className="border-t-2 border-amber-200 dark:border-amber-500/20 pt-6">
      <h3 className="text-xl font-bold font-display text-amber-900 dark:text-white mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Información Histórica (Opcional)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Emisor
          </label>
          <input
            type="text"
            value={formState.emisor}
            onChange={(e) => formState.setEmisor(e.target.value)}
            placeholder="Ej: España, Argentina"
            className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Autoridad (Rey/Presidente)
          </label>
          <input
            type="text"
            value={formState.autoridad}
            onChange={(e) => formState.setAutoridad(e.target.value)}
            placeholder="Ej: Fernando VI (1746-1759)"
            className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Año(s) / Periodo
          </label>
          <input
            type="text"
            value={formState.año}
            onChange={(e) => formState.setAño(e.target.value)}
            placeholder="Ej: 1754-1759, 2020"
            className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Tipo de Moneda
          </label>
          <input
            type="text"
            value={formState.tipoMoneda}
            onChange={(e) => formState.setTipoMoneda(e.target.value)}
            placeholder="Ej: Monedas circulantes normales"
            className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default SeccionHistorica;
