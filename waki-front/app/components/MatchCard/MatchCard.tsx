"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import logoPL from '@/app/assets/ligas/logo-le.png'
import OsasunaLogo from '@/app/assets/escudos/osasuna.svg'
import BarcelonaLogo from '@/app/assets/escudos/fc-barcelona.svg'


export default function MatchCard() {
  const [odds, setOdds] = useState({
    home: "1.8",
    draw: "2.1",
    away: "1.3"
  })

  const handleOddsChange = (team: 'home' | 'draw' | 'away', value: string) => {
    setOdds(prevOdds => ({
      ...prevOdds,
      [team]: value
    }))
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex justify-between items-center p-4 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Image src={logoPL}
          alt="Liga española logo"
           width={24} 
           height={24} 
           className="rounded-full" />
          <CardTitle className="text-lg font-semibold text-gray-800">Liga española</CardTitle>
        </div>
        <span className="text-red-500 font-semibold ml-auto">16:00</span>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col items-center space-y-2">
            <Image src={OsasunaLogo}
             alt="Osasuna logo" 
             width={48} 
             height={48} />
            <span className="font-semibold text-gray-800">Osasuna</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">1 - 2</div>
            <div className="text-red-500 text-sm mt-1">49:30</div>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Image src={BarcelonaLogo}
            alt="Barcelona logo" 
            width={48}
             height={48} />
            <span className="font-semibold text-gray-800">Barcelona</span>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <div className="w-1/3 px-1">
            <Input
              type="text"
              value={odds.home}
              onChange={(e) => handleOddsChange('home', e.target.value)}
              className="text-center"
            />
          </div>
          <div className="w-1/3 px-1">
            <Input
              type="text"
              value={odds.draw}
              onChange={(e) => handleOddsChange('draw', e.target.value)}
              className="text-center"
            />
          </div>
          <div className="w-1/3 px-1">
            <Input
              type="text"
              value={odds.away}
              onChange={(e) => handleOddsChange('away', e.target.value)}
              className="text-center bg-purple-100 text-purple-700"
            />
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-2">
          Eliminatorias, cuartos de final, primer partido
        </div>
      </CardContent>
    </Card>
  )
}