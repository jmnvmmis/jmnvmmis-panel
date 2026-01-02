// Servicio de Storage con Supabase
import { supabase } from '../lib/supabase';

// Subir imagen
export const subirImagen = async (file) => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    // NO incluir "monedas/" en el path, solo el nombre del archivo
    const filePath = fileName;

    const { data, error } = await supabase.storage
      .from('monedas')
      .upload(filePath, file);

    if (error) throw error;

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('monedas')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Error al subir imagen:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar imagen
export const eliminarImagen = async (path) => {
  try {
    const { error } = await supabase.storage
      .from('monedas')
      .remove([path]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
