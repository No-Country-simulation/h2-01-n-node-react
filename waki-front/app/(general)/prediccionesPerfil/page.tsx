"use client"

import BotomChat from "@/app/components/BotomChat/BotomChat";
import ChipsFilter from "@/app/components/ChipsFilter/ChipsFilter";
import MenuInferior from "@/app/components/MenuInferior/MenuInferior";
import Header from "@/app/components/Navbar/Navbar";
import TopView from "@/app/components/TopView/TopView";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "../partidos/partidos.css";
import PredictionCard from "@/app/components/PredictionCard/PredictionCard";

export default function PrediccionesPerfil() {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState("Hoy");
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (!token) {
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
    { id: "Hoy", label: `${formatDate(today)}` },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };
 
  return (
    <>
      <TopView />
      <div className="flex items-center justify-between title-container">
        <h1 className="partidosTitle">Predicciones</h1>
      </div>
      <div>
        <ChipsFilter />
      </div>
      <Header tabs={tabs} onTabChange={handleTabChange} activeTab={activeTab} />

      <div className="match-card">
        <PredictionCard activeTab={activeTab}  />
      </div>

      <BotomChat/>

      <MenuInferior />
    </>
  );
}