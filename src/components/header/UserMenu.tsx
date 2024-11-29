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
    </div>
  );
}