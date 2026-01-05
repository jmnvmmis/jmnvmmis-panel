// Página de Login con diseño JM NVMMIS
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import Logo from '../components/Logo';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Intentando login con:', email);
    const resultado = await login(email, password);
    console.log('Resultado del login:', resultado);
    
    if (resultado.success) {
      console.log('Login exitoso, redirigiendo...');
      navigate('/');
    } else {
      setError(resultado.error);
    }
    
    setLoading(false);
  };

  // Solo renderizar si NO hay usuario
  if (user) {
    console.log('Usuario ya autenticado, mostrando loading...');
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors">
      {/* ThemeToggle y LanguageSelector en esquina superior derecha */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      {/* Card de Login */}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo variant="full" />
        </div>

        {/* Formulario */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black rounded-2xl shadow-2xl p-8 border border-amber-200 dark:border-amber-500/20">
          <h2 className="text-2xl font-bold font-display text-amber-900 dark:text-white mb-6 text-center">
            {t('login.title')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-amber-700 dark:text-amber-400 mb-2 uppercase tracking-wider">
                {t('login.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                placeholder="admin@jmnvmmis.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-amber-700 dark:text-amber-400 mb-2 uppercase tracking-wider">
                {t('login.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white py-3 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? t('login.loading') : t('login.submit')}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-amber-600 dark:text-gray-400 text-sm mt-8">
          © 2025 JM NVMMIS. Panel Administrativo.
        </p>
      </div>
    </div>
  );
};

export default Login;
