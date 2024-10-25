import React from 'react'
import './jugadores.css'
import MenuInferior from "@/app/components/MenuInferior/MenuInferior";
import TopView from "@/app/components/TopView/TopView";



export default function page() {
  return (
    <div>

        <TopView />
        <div className='titulo-container'>
        <h1 className="titulo-divisiones">Scout Players</h1>
        </div>
        <h1 className='subtitle-jugadores'>Ranking de jugadores</h1>

        <MenuInferior />
    </div>
  )
}
