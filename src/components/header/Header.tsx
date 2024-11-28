import React from 'react';
import { Logo } from './Logo';
import { NavLinks } from './NavLinks';
import { UserMenu } from './UserMenu';
import { User } from '../../types';
import { scrollToElement } from '../../utils/scroll';

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  const handleSignInClick = () => {
    scrollToElement('auth-section');
  };

  return (
    <header className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Logo />
          {user && <NavLinks />}
        </div>
        {!user ? (
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSignInClick}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Sign In
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        ) : (
          <UserMenu user={user} />
        )}
      </div>
    </header>
  );
}