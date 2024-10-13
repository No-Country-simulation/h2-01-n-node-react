"use client"
import MenuInferior from '@/app/components/MenuInferior/MenuInferior'
import SplashScreen from '@/app/components/SplashScreen/SplashScreen'
import TopView from '@/app/components/TopView/TopView'
import Carrusel from '@/app/components/Carrusel/Carrusel'
import ChipsFilter from '@/app/components/ChipsFilter/ChipsFilter'
import { FiCalendar } from "react-icons/fi";
import MatchCard from '@/app/components/MatchCard/MatchCard'

import Collapse from "@/app/components/Collapse/Collapse";
import { useState } from "react";
import './partidos.css'
import Header from "@/app/components/Navbar/Navbar";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import "@/app/(general)/ligas/ligas.css";

import React from 'react'


export default function page() {

  const [activeTab, setActiveTab] = useState("Hoy");
  const [filter, setFilter] = useState("tendencias");

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;
  };

  const today = new Date();
  const yesterday = new Date(today);
  const tomorrow = new Date(today);

  const tabs = [
    { id: "Ayer", label: `${formatDate(yesterday)}` },
    { id: "Hoy", label: `Hoy` },
    { id: "Manana", label: `${formatDate(tomorrow)}` },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string);
  };


  return (
    <div className='container-partido'>
      {/*<MenuInferior/>*/}
      {/*<SplashScreen/>*/}
      <TopView/>
      <h1 className='title'>¡No te pierdas tus favoritos!</h1>
      <Carrusel/>
      <h1 className='partidosTitle'>Partidos</h1>
      <div ><ChipsFilter/></div>
      <Header tabs={tabs} onTabChange={handleTabChange} />
      <h1 className='statePartido'>En vivo    _________________________________</h1>
      <MatchCard/>
      <h1 className='statePartido'>Por Jugar    _______________________________</h1>
      <MatchCard/>
      <MenuInferior />
    </div>
  )
}
