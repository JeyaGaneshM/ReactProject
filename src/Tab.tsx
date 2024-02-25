// Tab.tsx

import React from 'react';

interface TabProps {
  tab: { id: number; title: string; content?: string };
  isActive: boolean;
  onTabClick: (tabId: number) => void;
}

const Tab: React.FC<TabProps> = ({ tab, isActive, onTabClick }) => {
  return (
    <div
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={() => onTabClick(tab.id)}
    >
      {tab.title}
    </div>
  );
};

export default Tab;
