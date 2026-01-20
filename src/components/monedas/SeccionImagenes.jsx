// Sección de imágenes
import { useTranslation } from 'react-i18next';

const SeccionImagenes = ({ formState }) => {
  const { t } = useTranslation();

  const handleFileChange = (e) => {
    formState.handleImagenesChange(e.target.files);
  };

  return (
    <div className="border-t-2 border-amber-200 dark:border-amber-500/20 pt-6">
      <label className="block text-sm font-semibold text-amber-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {t('newCoin.images')} *
      </label>
      
      <div className="mb-4">
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">{t('newCoin.uploadImages')}</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('newCoin.imageFormats')}</p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={formState.imagenes.length + formState.imagenesExistentes.length >= 5}
          />
        </label>
      </div>

      {/* Previews de imágenes existentes (para edición) */}
      {formState.imagenesExistentes.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Imágenes actuales:</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {formState.imagenesExistentes.map((imagen, index) => (
              <div key={index} className="relative group">
                <img
                  src={imagen.url}
                  alt={`Existente ${index + 1}`}
                  className="w-full h-32 object-cover rounded-xl border-2 border-amber-500/20 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => formState.eliminarImagenExistente(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Previews de nuevas imágenes */}
      {formState.previews.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Nuevas imágenes:</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {formState.previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-xl border-2 border-amber-500/20 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => formState.eliminarPreview(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeccionImagenes;
