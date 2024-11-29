import React, { useState } from 'react';
import { FileSearch, Brain, Share2, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Settings } from '../components/settings/Settings';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const [showTutorial, setShowTutorial] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const tools = [
    {
      icon: FileSearch,
      title: 'Content Analyzer',
      description: 'Analyze your content for grammar, readability, and SEO optimization',
      path: '/analyzer',
      coinsRequired: 10
    },
    {
      icon: Brain,
      title: 'NLP Generator',
      description: 'Generate AI-powered content with customizable tone and length',
      path: '/generator',
      coinsRequired: 15
    },
    {
      icon: Share2,
      title: 'Social Media Converter',
      description: 'Convert and optimize content for multiple social platforms',
      path: '/converter',
      coinsRequired: 8
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Welcome Tutorial */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to ContentIQ! 🎉</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You've received 50 coins to start exploring our powerful content tools.
              Use them wisely to analyze, generate, and optimize your content!
            </p>
            <button
              onClick={() => setShowTutorial(false)}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user?.name}!</p>
          </div>
          
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <SettingsIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const canUse = (user?.coins || 0) >= tool.coinsRequired;
            
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{tool.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>
                <button
                  onClick={() => canUse && navigate(tool.path)}
                  disabled={!canUse}
                  className={`w-full py-2 rounded-lg transition-colors ${
                    canUse
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {canUse ? 'Launch Tool' : 'Insufficient Coins'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
