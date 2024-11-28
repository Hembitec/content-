import React, { useState } from 'react';
import { Mail, Lock, Github, Linkedin } from 'lucide-react';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm p-8 border border-blue-100">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      
      <div className="space-y-4">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Github className="w-5 h-5" />
          Continue with GitHub
        </button>
        
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Linkedin className="w-5 h-5 text-[#0A66C2]" />
          Continue with LinkedIn
        </button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 relative">
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
            <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="mt-1 relative">
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
            <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </div>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </p>
      
      <p className="mt-4 text-center text-xs text-gray-500">
        By continuing, you agree to our{' '}
        <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
      </p>
    </div>
  );
}