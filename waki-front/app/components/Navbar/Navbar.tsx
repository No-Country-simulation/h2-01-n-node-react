"use client";

import React, { useState } from "react";

type Tab = {
  id: string;
  label: string;
};

type HeaderProps = {
  tabs: Tab[];
  onTabChange: (tabId: string) => void;
};

export default function Header({ tabs, onTabChange }: HeaderProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange(tabId);
  };

  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b-4 border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-2">
      <ul className="flex flex-wrap justify-center md:justify-start -mb-px">
        {tabs.map((tab) => (
          <li key={tab.id} className="flex-grow">
            <a
              href="#"
              onClick={() => handleTabClick(tab.id)}
              style={{ position: "relative", top: 3 }}
              className={`inline-block p-4 border-b-4 ${
                activeTab === tab.id
                  ? "text-[#317EF4] border-[#317EF4]"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              } rounded-t-lg w-full text-center`}
            >
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
