// src/App.jsx
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register'; // ✅ Importamos la nueva pantalla
import Dashboard from './pages/Dashboard';

const App = () => {
  const { user } = useAuth();
  // Estado local para saber si el usuario no autenticado quiere ver Login o Register
  const [view, setView] = useState('login'); 

  // 1. Si hay usuario logueado, va directo al panel de control
  if (user) {
    return <Dashboard />;
  }

  // 2. Si no hay usuario, alternamos condicionalmente entre Login y Register
  return view === 'login' ? (
    <Login onNavigateToRegister={() => setView('register')} />
  ) : (
    <Register onNavigateToLogin={() => setView('login')} />
  );
};

export default App;