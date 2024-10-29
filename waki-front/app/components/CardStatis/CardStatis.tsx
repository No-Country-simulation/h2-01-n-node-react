"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Tooltip from "@mui/material/Tooltip";
import "./cardstatis.css";

interface MatchStatistic {
  team: string;
  percentage: number;
}

interface MatchStatisticsCardProps {
  statistics: MatchStatistic[];
}

export default function CardStatis({
}: MatchStatisticsCardProps) {
  const [matchStatistics, setMatchStatistics] = useState<MatchStatistic[]>([]);
  const [tooltip, setTooltip] = useState<string | null>(null); 
  const fixtureId = Cookies.get("fixture");
  const API_BASE_URL = "https://waki.onrender.com/api";
  const FIXTURE_URL = `${API_BASE_URL}/fixtures/${fixtureId}`;

  useEffect(() => {
    const fetchMatches = async () => {
      const token = Cookies.get("authToken");

      if (!token) {
        console.error("No hay token, redirigiendo a la autenticación.");
        return;
      }

      try {
        const response = await fetch(FIXTURE_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            const newStatistics: MatchStatistic[] = [
              { team: data.homeTeam.name, percentage: data.fixtureBets[0].fixtureBetOdds[0].odd },
              { team: "Empate", percentage: data.fixtureBets[0].fixtureBetOdds[1].odd },
              { team: data.awayTeam.name, percentage: data.fixtureBets[0].fixtureBetOdds[2].odd },
            ];

            setMatchStatistics(newStatistics);
          }
        } else {
          console.error("Error al obtener los datos:", await response.json());
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchMatches();
  }, [FIXTURE_URL]);

  const handleTooltipOpen = (teamName: string) => {
    setTooltip(teamName);
  };

  const handleTooltipClose = () => {
    setTooltip(null);
  };

  return (
    <div
      className="w-full max-w-md mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl"
      id="cardStatis"
    >
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold mb-4">
          Resultado final
        </div>
        <div className=" rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4">
            {matchStatistics.length > 0 ? (
              matchStatistics.map((stat, index) => (
                <Tooltip
                  title={stat.team} 
                  open={tooltip === stat.team} 
                  onClose={handleTooltipClose} 
                  onClick={() => handleTooltipOpen(stat.team)} 
                  arrow
                  key={index}
                >
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      <span
                        className="team-span font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[50px] text-center cursor-pointer"
                      >
                        {stat.team}
                      </span>
                    </div>
                    <div
                      className="text-2xl font-bold"
                      id="statisPercentage"
                    >
                      {stat.percentage}
                    </div>
                  </div>
                </Tooltip>
              ))
            ) : (
              <div className="text-center">Cargando estadísticas...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
