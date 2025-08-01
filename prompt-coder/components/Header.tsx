
import React from 'react';
import { LogoIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center gap-3">
            <LogoIcon className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Prompt Coder</h1>
        </div>
      </div>
    </header>
  );
};
