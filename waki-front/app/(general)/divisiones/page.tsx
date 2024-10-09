"use client";
import { useState } from "react";
import Image from "next/image";
import MenuInferior from "@/app/components/MenuInferior/MenuInferior";
import './divisiones.css';
import Header from '../../components/Navbar/Navbar';
import ScoutPlayers from '../../assets/Vector-2.png'
import ScoutPlayersClicked from '../../assets/Vector-21.png'
import Partidos from '../../assets/Vector-1.png'
import PartidosClicked from '../../assets/Vector12.png'
import Divisioness from '../../assets/Vector1.png'
import DivisionesClicked from '../../assets/Vector.png'
import divisionLogo from '../../assets/divisiones/division-bronce3.png'


const Divisiones = () => {
  const [activeTab, setActiveTab] = useState("Ranking");
  const [iconState, setIconState] = useState({
    scout: ScoutPlayers,
    partidos: Partidos,
    divisioness: Divisioness
  });
  const [activeIcon, setActiveIcon] = useState('scout');

  const tabs = [
    { id: "Ranking", label: "Ranking" },
    { id: "Rewards", label: "Rewards" },
    { id: "Quests", label: "Quests" }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleIconClick = (icon: string) => {
    setActiveIcon(icon);
    switch (icon) {
      case 'scout':
        setIconState({
          ...iconState,
          scout: ScoutPlayersClicked,
        });
        break;
      case 'partidos':
        setIconState({
          ...iconState,
          partidos: PartidosClicked,
        });
        break;
      case 'divisiones':
        setIconState({
          ...iconState,
          divisioness: DivisionesClicked,
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
    <h1 className="titulo-divisiones">Divisiones</h1>
      <Header tabs={tabs} onTabChange={handleTabChange} />
      {/*ACA VAN LAS IMAGENES*/ }
      <div className="divisiones-imagen">
        <Image
        priority={true}
        alt="Logo Divisiones"
        className="divisionImg"
        src={divisionLogo}

        />
      </div>
      <h1 className="division-var">Division Bronce</h1>{/*Esto sera una variable que saldra de la api ya que es dinamico*/}
      <div className="bg-white min-h-screen flex flex-col items-center px-4 mt-4">
        {activeTab === "Ranking" && (
          <div>
            
            {/* Pantalla Ranking */}
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
  <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8 custom-margin">
    <div className="overflow-hidden shadow-md rounded-lg">
      <table className="min-w-full text-left text-sm font-light border-collapse border border-white-200 font-poppins bg-white">
        <thead className="border-b bg-white font-normal dark:border-white-800 dark:bg-white-600">
        <tr>
            <th scope="col" className="px-6 py-4 text-xs" >#</th>
            <th scope="col" className="px-6 py-4 text-xs">Nombre de Usuario</th>
            <th scope="col" className="px-6 py-4 text-xs">Puntos</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b bg-white-100 dark:border-white-500 dark:bg-white-700 text-black">
            <td className="whitespace-nowrap px-6 py-4 font-normal">1</td>
            <td className="whitespace-nowrap px-6 py-4">Mark</td>
            <td className="whitespace-nowrap px-6 py-4">50</td>
          </tr>
          <tr className="border-b bg-white dark:border-white-500 dark:bg-white-600 text-black">
            <td className="whitespace-nowrap px-6 py-4 font-normal">2</td>
            <td className="whitespace-nowrap px-6 py-4">Jacob</td>
            <td className="whitespace-nowrap px-6 py-4">20</td>
          </tr>
          <tr className="border-b bg-white dark:border-white-500 dark:bg-white-600 text-black">
            <td className="whitespace-nowrap px-6 py-4 font-normal">3</td>
            <td className="whitespace-nowrap px-6 py-4">John</td>
            <td className="whitespace-nowrap px-6 py-4">10</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

          </div>
        )}
        {activeTab === "Rewards" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Rewards</h2>
            {/* Pantalla Rewards */}
            
          </div>
        )}
        {activeTab === "Quests" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Quests</h2>
            {/* Pantalla Quests */}
            
          </div>
        )}
      </div>
      <MenuInferior />
    </>
  )
};
export default Divisiones;
