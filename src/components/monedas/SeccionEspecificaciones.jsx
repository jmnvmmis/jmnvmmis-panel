// Sección de especificaciones técnicas
import CustomSelect from '../CustomSelect';
import { ORIENTACIONES } from '../../utils/monedas';

const SeccionEspecificaciones = ({ formState }) => {
  return (
    <div className="border-t-2 border-amber-200 dark:border-amber-500/20 pt-6">
      <h3 className="text-xl font-bold font-display text-amber-900 dark:text-white mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Especificaciones Técnicas (Opcional)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Composición */}
        <div>
          <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Composición
          </label>
          <input
            type="text"
            value={formState.composicion}
            onChange={(e) => formState.setComposicion(e.target.value)}
            placeholder="Ej: Plata 900, Bronce, Cobre-Níquel"
            className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
          />
        </div>

        {/* Peso */}
        <div>
          <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Peso
          </label>
          <div className="relative">
            <input
              type="number"
              value={formState.peso}
              onChange={(e) => formState.setPeso(e.target.value)}
              onWheel={(e) => e.target.blur()}
              placeholder="12,5"
              step="0.01"
              min="0"
              className="w-full px-5 py-3 pr-12 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-700 dark:text-amber-400 font-semibold">g</span>
          </div>
        </div>

        {/* Diámetro */}
        <div>
          <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Diámetro
          </label>
          <div className="relative">
            <input
              type="number"
              value={formState.diametro}
              onChange={(e) => formState.setDiametro(e.target.value)}
              onWheel={(e) => e.target.blur()}
              placeholder="30,1"
              step="0.1"
              min="0"
              className="w-full px-5 py-3 pr-14 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-700 dark:text-amber-400 font-semibold">mm</span>
          </div>
        </div>

        {/* Grosor */}
        <div>
          <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Grosor
          </label>
          <div className="relative">
            <input
              type="number"
              value={formState.grosor}
              onChange={(e) => formState.setGrosor(e.target.value)}
              onWheel={(e) => e.target.blur()}
              placeholder="1,9"
              step="0.1"
              min="0"
              className="w-full px-5 py-3 pr-14 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-700 dark:text-amber-400 font-semibold">mm</span>
          </div>
        </div>

        {/* Forma */}
        <div>
          <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Forma
          </label>
          <input
            type="text"
            value={formState.forma}
            onChange={(e) => formState.setForma(e.target.value)}
            placeholder="Ej: Circular, Hexagonal"
            className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
          />
        </div>

        {/* Técnica */}
        <div>
          <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Técnica de Acuñación
          </label>
          <input
            type="text"
            value={formState.tecnica}
            onChange={(e) => formState.setTecnica(e.target.value)}
            placeholder="Ej: Acuñación a máquina, Molino"
            className="w-full px-5 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md placeholder-amber-600 dark:placeholder-gray-400"
          />
        </div>

        {/* Orientación */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Orientación
          </label>
          <CustomSelect
            value={formState.orientacion}
            onChange={formState.setOrientacion}
            options={ORIENTACIONES.map(o => ({ value: o.valor, label: o.label }))}
          />
        </div>
      </div>
    </div>
  );
};

export default SeccionEspecificaciones;
