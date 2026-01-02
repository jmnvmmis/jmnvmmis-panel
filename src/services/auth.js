// Servicio de autenticación con Supabase
import { supabase } from '../lib/supabase';

// Login
export const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Logout
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtener usuario actual
export const getCurrentUser = () => {
  const { data: { user } } = supabase.auth.getUser();
  return user;
};

// Listener de cambios de autenticación
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChanged((event, session) => {
    callback(session?.user || null);
  });
};
