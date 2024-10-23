/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import { useState, useEffect } from "react";
import "./predicciones.css";
import Image from "next/image";
import Flecha from "@/app/assets/flecha.png";
import iconBall from "@/app/assets/icon-ball.png";
import Header from "../../components/Navbar/Navbar";
import MenuInferior from "@/app/components/MenuInferior/MenuInferior";
import CardStatis from "@/app/components/CardStatis/CardStatis";
import CamisetaIcon from "@/app/assets/camisetaicon.png";
import CanchaIcon from "@/app/assets/cancha.png";
import BarselonaImg from "@/app/assets/escudos/fc-barcelona.svg";
import OsasunaImg from "@/app/assets/escudos/osasuna.svg";
import IconCopa from "@/app/assets/iconCopa.png";
import IconCheck from "@/app/assets/iconCheck.png";
import BotomChat from "@/app/components/BotomChat/BotomChat";
import Link from "next/link";
import IconBall from "@/app/assets/icon-ball.png";

interface MatchStatistic {
  team: string;
  percentage: number;
}

interface MatchStatisticsCardProps {
  statistics: MatchStatistic[];
}

export default function page() {
  const [activeTab, setActiveTab] = useState("Ranking");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [showResultadoPopup, setShowResultadoPopup] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const matchStatistics: MatchStatistic[] = [
    { team: "Osasuna", percentage: 48 },
    { team: "Empate", percentage: 12 },
    { team: "Barcelona", percentage: 40 },
  ];

  const tabs = [
    { id: "Predicciones", label: "Predicciones" },
    { id: "Detalles", label: "Detalles" },
    { id: "Clasificación", label: "Clasificación" },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };
  /*FUNCION DE RESULTADO*/
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    if (option === "Resultado") {
      setShowResultadoPopup(true);
    }
  };
  /*FUNCION CONFIRMAR*/
  const handleTeamSelect = (team: string) => {
    setSelectedTeam(team);
  };

  const handleContinue = () => {
    if (selectedTeam) {
      setShowConfirmationPopup(true);
    }
  };
  const handleConfirm = () => {
    setShowConfirmationPopup(false);
    setShowSuccessMessage(true);
  };

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        setShowResultadoPopup(false);
        setIsOpen(false);
        // Reset other states as needed
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  return (
    <>
      <div>
        <div className="header">
          <Link href="/partidos" className="flex items-center">
            <Image
              src={Flecha}
              alt="Flecha hacia atras"
              className="flechaImg mr-2"
            />
            <span className="partidosAtras mr-5">Partidos</span>
          </Link>
          <div className="icon-ball-container">
            <Image
              priority={true}
              alt="Icono de balón"
              className="icon-ball"
              src={IconBall}
              width={35}
              height={35}
            />
            <div className="counter-container">
              <h1 className="counter-life">5</h1>
            </div>
            <button className="buy-button">+</button>
          </div>
        </div>
        {/*TOP CURVE VERDE CON ESCUDOS*/}
        <div className="top-curve">
          <h1 className="subtitle-curve">
            Eliminatorias, cuartos de final, primer partido
          </h1>
          <div className="container-curve">
            <Image
              src={OsasunaImg}
              alt="Resultado"
              width={10}
              height={10}
              className="escudos-curve"
            />
            <div>
              <h1 className="date-curve">Sep 24</h1>
              <h1 className="time-curve">10:30</h1>
            </div>

            <Image
              src={BarselonaImg}
              alt="Resultado"
              width={10}
              height={10}
              className="escudos-curve"
            />
          </div>
        </div>
        <Header tabs={tabs} onTabChange={handleTabChange} />
        <h1 className="title-section">Tus Predicciones</h1>
        <div className="predicciones-container">
          <h1 className="sub-predicciones">¡Todavia estas a tiempo!</h1>
          <button className="btnPrediccion" onClick={() => setIsOpen(true)}>
            Hacer Predicción
          </button>

          {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-80 relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
                <h2 className="text-xl font-bold mb-4">
                  ¿En que vas a apostar?
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`p-4 rounded-lg flex flex-col items-center ${
                      selectedOption === "Resultado"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handleOptionClick("Resultado")}
                  >
                    <Image
                      src={CanchaIcon}
                      alt="Resultado"
                      width={32}
                      height={32}
                      className="mb-2"
                    />
                    Resultado
                  </button>
                  <button
                    className={`p-4 rounded-lg flex flex-col items-center ${
                      selectedOption === "Gol por jugador"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedOption("Gol por jugador")}
                  >
                    <Image
                      src={CamisetaIcon}
                      alt="Gol por jugador"
                      width={32}
                      height={32}
                      className="mb-2"
                    />
                    Gol por jugador
                  </button>
                </div>
              </div>
            </div>
          )}

          {showResultadoPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-80 relative">
                <button
                  className="absolute top-2 left-2 text-purple-500 hover:text-purple-700"
                  onClick={() => setShowResultadoPopup(false)}
                >
                  <Image src={Flecha} alt="Back" width={24} height={24} />
                </button>
                <button
                  className="absolute top-2 right-2 text-purple-500 hover:text-purple-700"
                  onClick={() => {
                    setShowResultadoPopup(false);
                    setIsOpen(false);
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
                <h2 className="text-xl font-bold mb-2 text-center">
                  Elige quién ganará
                </h2>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  Selecciona una opción
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    className={`p-4 border rounded-lg flex flex-col items-center ${
                      selectedTeam === "Osasuna" ? "border-blue-500" : ""
                    }`}
                    onClick={() => handleTeamSelect("Osasuna")}
                  >
                    <Image
                      src={OsasunaImg}
                      alt="Osasuna"
                      width={48}
                      height={48}
                      className="mb-2"
                    />
                    <span>Osasuna</span>
                    <span className="text-sm text-gray-500">13</span>
                  </button>
                  <button
                    className={`p-4 border rounded-lg flex flex-col items-center ${
                      selectedTeam === "Barcelona" ? "border-blue-500" : ""
                    }`}
                    onClick={() => handleTeamSelect("Barcelona")}
                  >
                    <Image
                      src={BarselonaImg}
                      alt="Barcelona"
                      width={48}
                      height={48}
                      className="mb-2"
                    />
                    <span>Barcelona</span>
                    <span className="text-sm text-gray-500">10</span>
                  </button>
                </div>
                <button
                  className={`w-full p-4 border rounded-lg flex flex-col items-center mb-4 ${
                    selectedTeam === "Empate" ? "border-blue-500" : ""
                  }`}
                  onClick={() => handleTeamSelect("Empate")}
                >
                  <span>Empate</span>
                  <span className="text-sm text-gray-500">21</span>
                </button>
                <div className="flex justify-between">
                  <button
                    className="px-4 py-2 border rounded-lg text-gray-500"
                    id="btnCardCombinada"
                  >
                    Hacer combinada
                  </button>
                  <button
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg"
                    id="btnCard"
                    onClick={handleContinue}
                  >
                    Continuar
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                  <span className="text-sm text-purple-600 ml-2">0/5</span>
                </div>
              </div>
            </div>
          )}

          {showConfirmationPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-80 relative">
                <button
                  className="absolute top-2 left-2 text-purple-500 hover:text-purple-700"
                  onClick={() => setShowConfirmationPopup(false)}
                >
                  <Image src={Flecha} alt="Back" width={24} height={24} />
                </button>
                <button
                  className="absolute top-2 right-2 text-purple-500 hover:text-purple-700"
                  onClick={() => {
                    setShowConfirmationPopup(false);
                    setShowResultadoPopup(false);
                    setIsOpen(false);
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
                <h2 className="text-xl font-bold mb-6 text-center">
                  ¿Estás seguro de tu predicción?
                </h2>
                <div className="bg-blue-100 rounded-lg p-4 flex items-center mb-6">
                  {/*ARREGLAR ESTA SECCION PARA MOSTRAR EL LOGO CORRECTAMENTE*/}
                  <Image
                    src={`/assets/${selectedTeam?.toLowerCase()}-logo.png`}
                    alt={selectedTeam || ""}
                    width={64}
                    height={64}
                    className="mr-4"
                  />
                  <div>
                    <p className="font-bold">{selectedTeam}</p>
                    <p className="text-sm">
                      <Image
                        src={IconCopa}
                        alt="Trophy"
                        width={16}
                        height={16}
                        className="inline mr-1"
                      />
                      x 10
                    </p>
                  </div>
                </div>
                <button
                  className="w-full py-3 bg-purple-500 text-white rounded-lg font-bold"
                  onClick={handleConfirm}
                >
                  Sí, predecir
                </button>
                <div className="mt-6 flex items-center justify-between">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                  <span className="text-sm text-purple-600 ml-2">1/5</span>
                </div>
                <div className="mt-2 flex justify-end">
                  <Image
                    src={iconBall}
                    alt="Coin"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                </div>
              </div>
            </div>
          )}

          {showSuccessMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-80 flex flex-col items-center">
                <Image
                  src={IconCheck}
                  alt="Checkmark"
                  width={64}
                  height={64}
                  className="mb-4"
                />
                <h2 className="text-xl font-bold text-center">
                  Se ha añadido tu predicción
                </h2>
              </div>
            </div>
          )}
        </div>

        <h1 className="title-section2">Pronóstico general</h1>
        <div>
          <CardStatis statistics={matchStatistics} />
        </div>
      </div>
      <BotomChat />
      <MenuInferior />
    </>
  );
}
