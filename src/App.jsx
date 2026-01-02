// Aplicación principal - Panel Admin
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/admin/PrivateRoute';

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NuevaMoneda from './pages/NuevaMoneda';
import EditarMoneda from './pages/EditarMoneda';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard protegido */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
          {/* Nueva moneda protegida */}
          <Route 
            path="/nueva-moneda" 
            element={
              <PrivateRoute>
                <NuevaMoneda />
              </PrivateRoute>
            } 
          />
          
          {/* Editar moneda protegida */}
          <Route 
            path="/editar-moneda/:id" 
            element={
              <PrivateRoute>
                <EditarMoneda />
              </PrivateRoute>
            } 
          />
          
          {/* Redirigir cualquier ruta no encontrada al dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
