import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { ContentAnalyzer } from './pages/tools/ContentAnalyzer';
import NLPGenerator from './pages/tools/NLPGenerator';
import SocialMediaConverter from './pages/tools/SocialMediaConverter';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/" />;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Routes>
        <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/analyzer" element={<PrivateRoute><ContentAnalyzer /></PrivateRoute>} />
        <Route path="/tools/nlp-generator" element={<PrivateRoute><NLPGenerator /></PrivateRoute>} />
        <Route path="/tools/social-converter" element={<PrivateRoute><SocialMediaConverter /></PrivateRoute>} />
      </Routes>
=======
import { Landing } from './pages/Landing';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/header/Header';
import { User } from './types';

const currentUser: User | null = null;

function App() {
  if (!currentUser) {
    return <Landing />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header user={currentUser} />
      <Dashboard />
>>>>>>> origin/main
    </div>
  );
}

<<<<<<< HEAD
function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

=======
>>>>>>> origin/main
export default App;