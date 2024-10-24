"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import MenuInferior from "@/app/components/MenuInferior/MenuInferior";
import TopView from "@/app/components/TopView/TopView";
import Carrusel from "@/app/components/Carrusel/Carrusel";
import ChipsFilter from "@/app/components/ChipsFilter/ChipsFilter";
import MatchCard from "@/app/components/MatchCard/MatchCard";
import "../partidos/partidos.css";
import Header from "@/app/components/Navbar/Navbar";
import BotomChat from '@/app/components/BotomChat/BotomChat';
import MatchCardLive from "@/app/components/MatchCardLive/MatchCardLive";

const API_BASE_URL = "https://waki.onrender.com/api";

type Match = {
  date: string;
  time: string;
  localTeam: string;
  visitTeam: string;
  localTeamLogo: string;
  visitTeamLogo: string;
  timeClose: string;
  isCardVisible: boolean;
};

export default function Page() {
  const [activeTab, setActiveTab] = useState("Siguiente Fecha");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [matches, setMatches] = useState<Match[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (!token) {
      router.push("/auth");
      return;
    }
  
    const nextDateFromCookie = Cookies.get("nextDate");
  
    const fetchMatches = async () => {
      const dateParam = nextDateFromCookie || afterTomorrow.toISOString().split("T")[0];
      const FIXTURES_API_URL = `${API_BASE_URL}/fixtures?date=${dateParam}`;
  
      try {
        const response = await fetch(FIXTURES_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error al obtener los datos:", errorData);
          return;
        }
  
        const data = await response.json();
  
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedMatches = data.fixtures.map((match: any) => {
          const matchDate = new Date(match.date);
          const date = matchDate.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
          });
          const time = matchDate.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          });
          return {
            date,
            time,
            localTeam: match.homeTeam.name,
            visitTeam: match.awayTeam.name,
            localTeamLogo: match.homeTeam.logo,
            visitTeamLogo: match.awayTeam.logo,
            timeClose: "90:00",
            isCardVisible: true,
          };
        });
  
        setMatches(formattedMatches);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMatches();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;
  };

  const today = new Date();
  const afterTomorrow = new Date(today);

  const tabs = [{ id: "Siguiente Fecha", label: `${formatDate(afterTomorrow)}` }];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };
  
  return (
    <>
      <TopView />
      <h1 className="title">¡No te pierdas tus favoritos!</h1>
      <Carrusel activeTab={activeTab} />
      <div className="flex items-center justify-between title-container">
        <h1 className="partidosTitle">Partidos</h1>
        {/* <Filter /> */}
      </div>
      <div>
        <ChipsFilter />
      </div>
      <Header tabs={tabs} onTabChange={handleTabChange} activeTab={activeTab}  />

      <div className="section-header">
        <h1 className="statePartido">En vivo</h1>
        <div className="divider"></div>
      </div>

      <div className="match-card-container">
        <MatchCard activeTab={activeTab} />
      </div>
      <div className="section-header-match">
        <h1 className="statePartido">Por Jugar</h1>
        <div className="divider"></div>
      </div>

      <div className="match-live-card-container">
        <MatchCardLive activeTab={activeTab} />
      </div>

      <BotomChat />

      <MenuInferior />
    </>
  );
}
