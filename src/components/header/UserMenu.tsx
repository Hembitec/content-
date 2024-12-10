<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../../types';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700">
          <button
            onClick={signOut}
            className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
=======
import React from 'react';
import { Bell } from 'lucide-react';
import { User } from '../../types';

interface UserMenuProps {
  user: User | null;
}

export function UserMenu({ user }: UserMenuProps) {
  if (!user) return null;

  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <div className="px-3 py-1 bg-blue-50 rounded-full">
          <span className="text-blue-600 font-medium">{user.coins} coins</span>
        </div>
      </div>
      
      <button className="relative text-gray-600 hover:text-blue-600 transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
      </button>
      
      <div className="flex items-center space-x-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover border-2 border-blue-100"
        />
        <span className="text-gray-700 font-medium hidden sm:block">{user.name}</span>
      </div>
>>>>>>> origin/main
    </div>
  );
}