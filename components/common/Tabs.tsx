
import React from 'react';

interface TabInfo {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface TabsProps {
  tabs: TabInfo[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center bg-slate-900/50 border border-indigo-800/50 rounded-full p-1.5 backdrop-blur-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-sm sm:text-base font-medium transition-colors duration-300 focus:outline-none ${
            activeTab === tab.id
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-indigo-300 hover:bg-indigo-900/50'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
