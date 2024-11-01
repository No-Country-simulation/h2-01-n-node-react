"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Tooltip from "@mui/material/Tooltip";
import "./cardstatis.css";
import CryptoJS from "crypto-js";
interface MatchStatistic {
  team: string;
  percentage: number;
}

interface MatchStatisticsCardProps {
  statistics: MatchStatistic[];
}

export default function CardStatis({}: MatchStatisticsCardProps) {
  const [matchStatistics, setMatchStatistics] = useState<MatchStatistic[]>([]);
  const [tooltip, setTooltip] = useState<string | null>(null);

  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY as string;
  // Función para leer y desencriptar desde la cookie
  const getDecryptedDateFromCookie = (): string | null => {
    const encryptedDate = Cookies.get("fixture");
    if (encryptedDate) {
      const bytes = CryptoJS.AES.decrypt(encryptedDate, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return null;
  };
  const fixtureId = getDecryptedDateFromCookie();
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

          const fixture = data.fixture;

          if (fixture && fixture.fixtureBets.length > 0) {
            const fixtureBets = fixture.fixtureBets[0];
            const newStatistics: MatchStatistic[] = [
              {
                team: fixture.homeTeam.name,
                percentage: fixtureBets.fixtureBetOdds[0].odd,
              },
              { team: "Empate", percentage: fixtureBets.fixtureBetOdds[1].odd },
              {
                team: fixture.awayTeam.name,
                percentage: fixtureBets.fixtureBetOdds[2].odd,
              },
            ];

            setMatchStatistics(newStatistics);
          } else {
            console.error("No hay apuestas disponibles para este fixture");
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
        <div className="rounded-lg p-4">
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
                      <span className="team-span font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[50px] text-center cursor-pointer">
                        {stat.team}
                      </span>
                    </div>
                    <div
                      className="text-2x2 text-sm font-bold"
                      id="statisPercentage"
                    >
                      {stat.percentage}
                    </div>
                  </div>
                </Tooltip>
              ))
            ) : (
              <div className="no-found-result">
                <h1>Sin resultados</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
