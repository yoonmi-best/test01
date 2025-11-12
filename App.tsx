
import React, { useState } from 'react';
import Header from './components/common/Header';
import Tabs from './components/common/Tabs';
import MeditationGenerator from './components/MeditationGenerator';
import ChatBot from './components/ChatBot';
import { MeditationIcon } from './components/common/icons/MeditationIcon';
import { ChatIcon } from './components/common/icons/ChatIcon';

type Tab = 'meditation' | 'chat';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('meditation');

  const tabs = [
    { id: 'meditation', label: '명상하기', icon: <MeditationIcon /> },
    { id: 'chat', label: '채팅하기', icon: <ChatIcon /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        {/* FIX: The `setActiveTab` function from `useState<Tab>` expects a specific string literal type, but the `Tabs` component provides a generic string. Create a new function to bridge this type mismatch by casting the incoming string `id` to the `Tab` type. This is safe because the `tabs` array defines `id`s that match the `Tab` type. */}
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={(id) => setActiveTab(id as Tab)} />
        <main className="mt-6">
          {activeTab === 'meditation' && <MeditationGenerator />}
          {activeTab === 'chat' && <ChatBot />}
        </main>
      </div>
    </div>
  );
};

export default App;
