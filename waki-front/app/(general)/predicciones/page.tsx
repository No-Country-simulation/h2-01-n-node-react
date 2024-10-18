/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React from 'react'
import { useState } from "react";
import './predicciones.css'
import Image from 'next/image'
import Flecha from '@/app/assets/flecha.png'
import iconBall from '@/app/assets/icon-ball.png'
import Header from '../../components/Navbar/Navbar';


export default function page() {
    const [activeTab, setActiveTab] = useState("Ranking");

    const tabs = [
        { id: "Predicciones", label: "Predicciones" },
        { id: "Detalles", label: "Detalles" },
        { id: "Clasificación", label: "Clasificación" }
      ];

      const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
      };

  return (
    <div>
        <div className='header'>
        <Image src={Flecha}
         alt="Flecha hacia atras"
         className='flechaImg'
         />
        <span className='partidosAtras'>Partidos</span>
        <div className='icon-ball-container'>
            <Image
            priority={true}
            alt="Imagen del caramelo"
            className='icon-ball'
            src={iconBall}
            />
            <div className='counter-container'>
                <h1 className='counter-life'>5</h1>
                <button className='buy-button'>+</button>
            </div>
        </div>            
        </div>
      <div className='top-curve'></div>
      <Header tabs={tabs} onTabChange={handleTabChange} />
    </div>
    
  )
}
