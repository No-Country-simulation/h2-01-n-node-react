"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaChevronUp, FaChevronDown } from "react-icons/fa"; // Importar los iconos
import SplashScreen from "../SplashScreen/SplashScreen";
import { Card, CardContent, CardHeader } from "@mui/material";

interface Team {
  logo: string;
  name: string;
}

interface Match {
  home_team: Team;
  away_team: Team;
  score: {
    home: number;
    away: number;
  };
  time: string;
}

interface League {
  id: number;
  name: string;
  country: {
    flag: string;
  };
  matches: Match[]; // Asegúrate de que cada liga tenga un array de partidos
}

export default function MatchCard() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const API_BASE_URL = "https://waki.onrender.com/api";
    const LEAGUES_API_URL = `${API_BASE_URL}/leagues/current`;

    const fetchLeagues = async () => {
      const token = Cookies.get("authToken");
      if (!token) {
        router.push("/auth");
      } else {
        setIsAuthenticated(true);
      }
      try {
        const response = await fetch(LEAGUES_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const leaguesArray = Array.isArray(data) ? data : [data];
          setLeagues(leaguesArray);
          const initialOpenStates = leaguesArray.reduce(
            (acc: Record<number, boolean>, league: League) => {
              acc[league.id] = false;
              return acc;
            },
            {}
          );
          setOpenStates(initialOpenStates);
        } else {
          const errorData = await response.json();
          console.error("Error obteniendo las ligas:", errorData);
        }
      } catch (error) {
        console.error("Error en la solicitud de ligas:", error);
      }
    };

    fetchLeagues();
  }, [router]);

  if (!isAuthenticated) {
    return <SplashScreen />;
  }

  const toggleCollapse = (id: number) => {
    setOpenStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg overflow-hidden">
      {leagues.length > 0 ? (
        leagues.map((league) => (
          <div key={league.id} className="rounded-md">
            <button
              onClick={() => toggleCollapse(league.id)}
              className="flex items-center justify-between w-full px-4 py-2 text-left bg-white rounded-md hover:bg-gray-100"
            >
              <div className="flex items-center">
                {league.country?.flag && (
                  <Image
                    src={league.country.flag}
                    alt={`${league.name} flag`}
                    width={24}
                    height={24}
                    className="rounded-full mr-2"
                  />
                )}
                <span className="text-gray-800 text-xs font-normal">{league.name}</span>
              </div>

              <div className="ml-16">
                {openStates[league.id] ? (
                  <FaChevronUp style={{ color: "#317EF4", fontSize: "12px" }} />
                ) : (
                  <FaChevronDown style={{ color: "#317EF4", fontSize: "12px" }} />
                )}
              </div>
            </button>

            {/* Contenido colapsable */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openStates[league.id] ? "max-h-screen" : "max-h-0"
              }`}
            >
              <div className="p-4 bg-[#F0F4FF]">
                {leagues.map((league) => (
                  <Card key={league.id} className="w-full max-w-md mx-auto bg-white shadow-lg overflow-hidden mb-4">
                    <CardHeader className="flex justify-between items-center p-4 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={league.country.flag}
                          alt={`${league.country.flag} logo`}
                          width={24}
                          height={24}
                        />
                        {/* <span className="text-lg font-semibold text-gray-800">{match.home_team.name}</span> */}
                      </div>
                      {/* <span className="text-red-500 font-semibold ml-auto">{match.time}</span> */}
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col items-center space-y-2">
                          <Image
                            src={league.country.flag}
                            alt={`${league.country.flag} logo`}
                            width={48}
                            height={48}
                          />
                        </div>
                        <div className="text-center">
                          {/* <div className="text-3xl font-bold text-gray-800">
                            {league.matches} - {match.score.away}
                          </div> */}
                          {/* <div className="text-red-500 text-sm mt-1">{match.time}</div> */}
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <Image
                            src={league.country.flag}
                            alt={`${league.country.flag} logo`}
                            width={48}
                            height={48}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        {/* <div className="w-1/3 px-1">
                          <Input
                            type="text"
                            value={match.odds.home}
                            className="text-center"
                          />
                        </div> */}
                        {/* <div className="w-1/3 px-1">
                          <Input
                            type="text"
                            value={match.odds.draw}
                            className="text-center"
                          />
                        </div> */}
                        {/* <div className="w-1/3 px-1">
                          <Input
                            type="text"
                            value={match.odds.away}
                            className="text-center bg-purple-100 text-purple-700"
                          />
                        </div> */}
                      </div>
                      <div className="text-center text-xs text-gray-500 mt-2">
                        Eliminatorias, cuartos de final, primer partido
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>No se encontraron ligas.</div>
      )}
    </div>
  );
}
