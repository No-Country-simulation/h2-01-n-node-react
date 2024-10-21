/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { Card, CardContent, CardHeader, Tooltip } from "@mui/material";
import logoPL from "@/app/assets/ligas/logo-le.png";

interface Team {
  logo: string;
  name: string;
}

interface Match {
  homeTeam: Team;
  awayTeam: Team;
  homeGoals: number;
  awayGoals: number;
  date: string;
}

interface FormattedMatch {
  date: string;
  time: string;
  localTeam: string;
  visitTeam: string;
  localTeamLogo: string;
  visitTeamLogo: string;
  homeGoals: number;
  awayGoals: number;
}

export default function MatchCard() {
  const [matches, setMatches] = useState<FormattedMatch[]>([]);
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const router = useRouter();
  const [leagues, setLeagues] = useState<{ id: number; logo: string; name: string }[]>([]);
  const [tooltip, setTooltip] = useState<string | null>(null); // Estado para el tooltip
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleDropdown = (id: number) => {
    setOpenStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTooltipOpen = (teamName: string) => {
    setTooltip(teamName);
  };

  const handleTooltipClose = () => {
    setTooltip(null);
  };

  useEffect(() => {
    const API_BASE_URL = "https://waki.onrender.com/api";
    const FIXTURES_API_URL = `${API_BASE_URL}/fixtures`;

    const fetchMatches = async () => {
      const token = Cookies.get("authToken");

      if (!token) {
        router.push("/auth");
        return;
      }

      try {
        const response = await fetch(FIXTURES_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data: Match[] = await response.json();
          const formattedMatches: FormattedMatch[] = data
            .filter(match => match.homeGoals > 0 || match.awayGoals > 0)
            .map((match) => {
              const matchDate = new Date(match.date);
              const date = matchDate.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
              });
              const time = matchDate.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return {
                date: date,
                time: time,
                localTeam: match.homeTeam.name,
                visitTeam: match.awayTeam.name,
                localTeamLogo: match.homeTeam.logo,
                visitTeamLogo: match.awayTeam.logo,
                homeGoals: match.homeGoals,
                awayGoals: match.awayGoals,
              };
            });
          setMatches(formattedMatches);
        } else {
          const errorData = await response.json();
          console.error("Error al obtener los datos:", errorData);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchMatches();
  }, [router]);

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
        } else {
          const errorData = await response.json();
          console.error("Error obteniendo las ligas:", errorData);
        }
      } catch (error) {
        console.error("Error en la solicitud de ligas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, [router]);


  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg overflow-hidden rounded-lg">
      {leagues.map((league) => (
        <div key={league.id} className="rounded-md">
          <button
            onClick={() => toggleDropdown(league.id)}
            className="flex items-center justify-between w-full px-4 py-3 text-left bg-white rounded-md hover:bg-gray-200 transition duration-200 ease-in-out"
          >
            <div className="flex items-center">
              <Image
                src={league.logo || logoPL}
                alt="Liga logo"
                width={24}
                height={24}
                className="rounded-full mr-2"
              />
              <span className="text-gray-800 text-sm font-medium">
                {league.name}
              </span>
            </div>

            <div className="ml-4">
              {openStates[league.id] ? (
                <FaChevronUp className="text-blue-600" />
              ) : (
                <FaChevronDown className="text-blue-600" />
              )}
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${openStates[league.id] ? "max-h-screen" : "max-h-0"}`}
          >
            <div className="p-4 bg-[#F0F4FF] max-h-60 overflow-y-auto rounded-b-md">
              {matches.map((match, index) => (
                <Card
                  key={index}
                  className="my-2 mx-4"
                  sx={{
                    boxShadow: "none",
                    border: "none",
                    backgroundColor: "#F0F4FF",
                  }}
                >
                  <CardHeader
                    sx={{ borderBottom: "none", backgroundColor: "#F0F4FF" }}
                  />
                  <CardContent
                    sx={{ border: "none", backgroundColor: "#F0F4FF" }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex flex-col items-center">
                        <Image
                          src={match.localTeamLogo}
                          alt={`${match.localTeam} logo`}
                          width={32}
                          height={32}
                          className="mb-1"
                        />
                        <Tooltip title={match.localTeam} open={tooltip === match.localTeam} onClose={handleTooltipClose} onClick={() => handleTooltipOpen(match.localTeam)} arrow>
                          <span className="font-semibold text-sm text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap max-w-[50px] text-center cursor-pointer">
                            {match.localTeam}
                          </span>
                        </Tooltip>
                      </div>
                      <div className="text-center space-y-0.5">
                        <div className="font-bold text-gray-800 text-lg">
                          {match.homeGoals} - {match.awayGoals}
                        </div>
                        <div className="text-red-500 text-xs">
                          {match.time}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Image
                          src={match.visitTeamLogo}
                          alt={`${match.visitTeam} logo`}
                          width={32}
                          height={32}
                          className="mb-1"
                        />
                        <Tooltip title={match.visitTeam} open={tooltip === match.visitTeam} onClose={handleTooltipClose} onClick={() => handleTooltipOpen(match.visitTeam)} arrow>
                          <span className="font-semibold text-sm text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap max-w-[50px] text-center cursor-pointer">
                            {match.visitTeam}
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
