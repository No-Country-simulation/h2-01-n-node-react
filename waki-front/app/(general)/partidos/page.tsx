"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import MenuInferior from "@/app/components/MenuInferior/MenuInferior";
import TopView from "@/app/components/TopView/TopView";
import Carrusel from "@/app/components/Carrusel/Carrusel";
import ChipsFilter from "@/app/components/ChipsFilter/ChipsFilter";
import MatchCard from "@/app/components/MatchCard/MatchCard";
import "./partidos.css";
import Header from "@/app/components/Navbar/Navbar";

// import Filter from "@/app/components/Filter/Filter";

import BotomChat from '@/app/components/BotomChat/BotomChat'
import MatchCardLive from "@/app/components/MatchCardLive/MatchCardLive";


export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState("Hoy");
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificamos si el usuario está autenticado
    const token = Cookies.get("authToken");
    if (!token) {
      // Si no hay token, redirige al usuario a la página de login
      router.push("/auth");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;
  };

  const today = new Date();
  const yesterday = new Date(today);
  const tomorrow = new Date(today);

  yesterday.setDate(today.getDate() - 1);
  tomorrow.setDate(today.getDate() + 1);

  const tabs = [
    { id: "Ayer", label: `${formatDate(yesterday)}` },
    { id: "Hoy", label: `Hoy` },
    { id: "Manana", label: `${formatDate(tomorrow)}` },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

 
  return (
    <>
      <TopView />
      <h1 className="title">¡No te pierdas tus favoritos!</h1>
      <Carrusel activeTab={activeTab}  />
      <div className="flex items-center justify-between title-container">
        <h1 className="partidosTitle">Partidos</h1>
        {/* <Filter /> */}
      </div>
      <div>
        <ChipsFilter />
      </div>
      <Header tabs={tabs} onTabChange={handleTabChange} />

      <div className="section-header">
        <h1 className="statePartido">En vivo</h1>
        <div className="divider"></div>
      </div>

      <div className="match-card-container">
        <MatchCard />
      </div>
      <div className="section-header-match">
        <h1 className="statePartido">Por Jugar</h1>
        <div className="divider"></div>
      </div>


      <div className="match-live-card-container">
        <MatchCardLive />
      </div>

      <BotomChat/>

      <MenuInferior />
    </>
  );
}
