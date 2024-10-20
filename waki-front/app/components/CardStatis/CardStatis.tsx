"use client"
import React from 'react'
import './cardstatis.css'

interface MatchStatistic {
    team: string
    percentage: number
  }
  
interface MatchStatisticsCardProps {
    statistics: MatchStatistic[]
  }

export default function CardStatis({ statistics = [
    { team: 'Osasuna', percentage: 48 },
    { team: 'Empate', percentage: 12 },
    { team: 'Barcelona', percentage: 40 }
  ] }: MatchStatisticsCardProps) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl" id='cardStatis'>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold mb-4">Resultado final</div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm font-medium text-gray-700">{stat.team}</div>
                  <div className="text-2xl font-bold text-gray-900" id='statisPercentage'>{stat.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }