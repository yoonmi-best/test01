
import React from 'react';
import { MeditationIcon } from './icons/MeditationIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
          <MeditationIcon className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
          젠가든 AI
        </h1>
      </div>
    </header>
  );
};

export default Header;