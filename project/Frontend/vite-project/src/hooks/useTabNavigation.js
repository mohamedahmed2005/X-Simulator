import { useState } from 'react';

export const useTabNavigation = (initialTab = 'home') => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  return {
    activeTab,
    setActiveTab: changeTab
  };
};
