"use client";

import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";

type Tab = {
  id: string;
  label: string;
};

type HeaderProps = {
  tabs: Tab[];
  activeTab: string;  // Recibir activeTab como prop
  onTabChange: (tabId: string) => void;
};

export default function Header({ tabs, activeTab, onTabChange }: HeaderProps) {
  const [linePosition, setLinePosition] = useState(0);
  const [lineWidth, setLineWidth] = useState(0);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId); 
  };

  useEffect(() => {
    const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const tabElement = tabRefs.current[activeTabIndex];
    if (tabElement) {
      setLinePosition(tabElement.offsetLeft);
      setLineWidth(tabElement.offsetWidth);
    }
  }, [activeTab, tabs]);

  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b-4 mb-2" style={{ fontSize: "13px" }}>
      <div className="tabs-container">
        <ul className="flex flex-wrap justify-center md:justify-start -mb-px">
          {tabs.map((tab, index) => (
            <li key={tab.id} className="flex-grow font-label">
              <a
                href="#"
                onClick={() => handleTabClick(tab.id)}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                className={`inline-block p-4 border-b-4 ${
                  activeTab === tab.id
                    ? "tab-active"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                } rounded-t-lg w-full text-center`}
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
        <div
          className="active-line"
          style={{
            left: linePosition,
            width: lineWidth,
          }}
          ref={activeLineRef}
        />
      </div>
    </div>
  );
}
