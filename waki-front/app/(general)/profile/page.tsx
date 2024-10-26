/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useTheme } from "@/app/components/context/ThemeContext";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import MenuInferior from "@/app/components/MenuInferior/MenuInferior";
import BotomChat from "@/app/components/BotomChat/BotomChat";
import Image from "next/image";
import UserImg from "@/app/assets/avatar/people2.jpeg";

export default function page() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [language, setLanguage] = useState("es");

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <div>
      <div className="min-h-screen">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-center mb-6">
              Perfil de Usuario
            </h1>

            <div className="flex flex-col items-center space-y-4 mb-8">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src={UserImg}
                  alt="Flecha hacia atras"
                  className="flechaImg"
                />
              </div>
              <h2 className="text-xl font-semibold">Diego Perez</h2>
              <p className="text-gray-500 dark:text-gray-400">
                diego.perez@ejemplo.com
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="language" className="font-medium">
                  Idioma
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-black dark:text-white"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Modo Oscuro</span>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span className="sr-only">Activar modo oscuro</span>
                  <span
                    className={`${
                      isDarkMode ? "translate-x-6" : "translate-x-1"
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
                  />
                  {isDarkMode ? (
                    <Moon className="h-4 w-4 text-white absolute right-1" />
                  ) : (
                    <Sun className="h-4 w-4 text-gray-400 absolute left-1" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BotomChat />
      <MenuInferior />
    </div>
  );
}
