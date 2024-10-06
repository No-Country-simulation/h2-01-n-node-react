"use client";

import React, { useState } from "react";

export default function Header() {
  const [activeTab, setActiveTab] = useState("InicioSesion");

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b-4 border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-2">
      <ul className="flex flex-wrap justify-center md:justify-start -mb-px">
        <li className="flex-grow">
          <a
            href="#"
            onClick={() => handleTabClick("InicioSesion")}
            style={{ position: "relative", top: 3 }}
            className={`inline-block p-4 border-b-4 ${
              activeTab === "InicioSesion"
                ? "text-[#317EF4] border-[#317EF4]"
                : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            } rounded-t-lg w-full text-center`}
          >
            Iniciar Sesion
          </a>
        </li>
        <li className="flex-grow">
          <a
            href="#"
            onClick={() => handleTabClick("Registrate")}
            style={{ position: "relative", top: 3 }}
            className={`inline-block p-4 border-b-4 ${
              activeTab === "Registrate"
                ? "text-[#317EF4] border-[#317EF4]"
                : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            } rounded-t-lg w-full text-center`}
          >
            Registrate
          </a>
        </li>
      </ul>
    </div>
  );
}
