// Servicio de Firestore con Supabase
import { supabase } from '../lib/supabase';

// Crear moneda
export const crearMoneda = async (datos) => {
  try {
    // Asegurarse de que activa esté en true por defecto
    const datosCompletos = {
      ...datos,
      activa: datos.activa !== undefined ? datos.activa : true
    };

    const { data, error } = await supabase
      .from('monedas')
      .insert([datosCompletos])
      .select()
      .single();

    if (error) throw error;

    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error al crear moneda:', error);
    return { success: false, error: error.message };
  }
};

// Obtener todas las monedas (admin)
export const obtenerTodasMonedas = async () => {
  try {
    const { data, error } = await supabase
      .from('monedas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, monedas: data };
  } catch (error) {
    return { success: false, monedas: [] };
  }
};

// Obtener monedas públicas (solo activas)
export const obtenerMonedasPublicas = async () => {
  try {
    const { data, error } = await supabase
      .from('monedas')
      .select('*')
      .eq('activa', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// Obtener moneda por ID
export const obtenerMonedaPorId = async (id) => {
  try {
    const { data, error } = await supabase
      .from('monedas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { success: true, moneda: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Actualizar moneda
export const actualizarMoneda = async (id, datos) => {
  try {
    const { error } = await supabase
      .from('monedas')
      .update(datos)
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Eliminar moneda
export const eliminarMoneda = async (id) => {
  try {
    const { error } = await supabase
      .from('monedas')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
