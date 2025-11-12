
import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = '로딩 중...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[40vh]">
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-t-4 border-purple-400 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-lg text-indigo-300">{message}</p>
    </div>
  );
};

export default Loader;