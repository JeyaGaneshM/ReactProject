// App.tsx

import React, { useState } from 'react';
import Tab from './Tab';
import Home from './Components/Home';
import About from './Components/About';

import './App.css';

const tabsData = [
  { id: 1, title: 'Home', content: 'Content for Home tab' },
  { id: 2, title: 'About', content: 'Content for About tab' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(tabsData[0].id);

  const handleTabClick = (tabId: number) => {
    setActiveTab(tabId);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Header Content</h1>
        <div className="tabs-container">
          {tabsData.map(tab => (
            <Tab
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onTabClick={handleTabClick}
            />
          ))}
        </div>
      </header>
      <main>
        {activeTab === 1 && <Home />}
        {activeTab === 2 && <About />}
      </main>
    </div>
  );
};

export default App;
