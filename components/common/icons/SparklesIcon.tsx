
import React from 'react';

export const SparklesIcon: React.FC<{className?: string}> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.36 7.1L22 12l-7.1 2.9L12 22l-2.9-7.1L2 12l7.1-2.9L12 2zm-8 8l-2 1l2 1l1 2l1-2l2-1l-2-1l-1-2zm16 0l-1-2l-1 2l-2 1l2 1l1 2l1-2l2-1z" />
    </svg>
);
