import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App = () => {
  const { user } = useAuth();
  const [view, setView] = useState('login'); 

  if (user) {
    return <Dashboard />;
  }

  return view === 'login' ? (
    <Login onNavigateToRegister={() => setView('register')} />
  ) : (
    <Register onNavigateToLogin={() => setView('login')} />
  );
};

export default App;