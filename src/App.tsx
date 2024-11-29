import React from 'react';
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
    </div>
  );
}

export default App;