import React from 'react'
import './jugadores.css'
import MenuInferior from "@/app/components/MenuInferior/MenuInferior";
import TopView from "@/app/components/TopView/TopView";
import { ChevronRight } from 'lucide-react'
import divisionImg from '@/app/assets/divisiones/division-oro1.png'
import Image from 'next/image'
import Link from 'next/link'

interface PlayerData {
  rank: number
  name: string
  division: string
  publications: number
  price: number
}   



const PlayerRow = ({ player, isEven }: { player: PlayerData; isEven: boolean }) => (
  <Link href={player.rank === 1 ? "/jugadoresestadistica" : "#"} className={`flex items-center justify-between p-3 ${isEven ? '' : ''} hover:bg-gray-100 transition-colors`}>
    <div className="flex items-center space-x-3">
      <span className="w-6">{player.rank}</span>
      <span className="font-medium">{player.name}</span>
    </div>
    <div className="flex items-center space-x-4">
      <Image 
        src={divisionImg} 
        alt="División" 
        width={20} 
        height={20} 
        className="object-contain"
      />
      <span className="">{player.publications}k</span>
      <span className="font-medium">{player.price}</span>
      <ChevronRight className="w-5 h-5" />
    </div>
  </Link>
)

export default function page() {

  const players: PlayerData[] = [
    { rank: 1, name: 'Jugador 1', division: 'Gold', publications: 80, price: 120 },
    { rank: 2, name: 'Jugador 2', division: 'Gold', publications: 80, price: 120 },
    { rank: 3, name: 'Jugador 3', division: 'Gold', publications: 80, price: 140 },
    { rank: 4, name: 'Jugador 4', division: 'Gold', publications: 80, price: 120 },
    { rank: 5, name: 'Jugador 5', division: 'Gold', publications: 80, price: 150 },
    { rank: 6, name: 'Jugador 6', division: 'Gold', publications: 80, price: 120 },
  ]


  return (
    <div>

        <TopView />
        <div className='titulo-container'>
        <h1 className="titulo-divisiones">Scout Players</h1>
        </div>
        <h1 className='subtitle-jugadores'>Ranking de jugadores</h1>
        <div className='table-jugadores'>
        <div className="max-w-md mx-auto rounded-xl overflow-hidden shadow-lg">
      <div className="bg-purple-600 p-3 flex justify-between items-center">
        <span className="font-medium"># Jugador</span>
        <div className="flex space-x-4">
          <span>Div.</span>
          <span>Publ.</span>
          <span>Precio</span>
        </div>
      </div>
      <div className="divide-y">
        {players.map((player, index) => (
          <PlayerRow key={index} player={player} isEven={index % 2 === 0} />
        ))}
      </div>
    </div>
        </div>
        <MenuInferior />
    </div>
  )
}
