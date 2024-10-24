/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { Card, CardContent, CardHeader, Tooltip } from "@mui/material";
import logoPL from "@/app/assets/ligas/logo-le.png";
import { ClipLoader } from "react-spinners";

interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  capacity: number;
  surface: string;
  image: string;
}

interface League {
  id: number;
  name: string;
  type: string;
  logo: string;
}

interface Team {
  id: number;
  name: string;
  code: string;
  founded: number;
  national: boolean;
  logo: string;
}

interface FixtureBetOdds {
  fixtureBetId: number;
  value: string;
  odd: string;
}

interface FixtureBet {
  id: number;
  leagueId: number;
  fixtureId: number;
  fixtureBetOdds: FixtureBetOdds[];
}

interface Fixture {
  time: ReactNode;
  id: number;
  referee: string;
  timezone: string;
  date: string;
  timestamp: number;
  firstPeriod: number;
  secondPeriod: number;
  statusLong: string;
  statusShort: string;
  statusElapsed: number;
  statusExtra: number;
  season: number;
  round: string;
  homeTeamWinner: boolean;
  awayTeamWinner: boolean;
  homeGoals: number;
  awayGoals: number;
  homeScoreHalftime: number;
  awayScoreHalftime: number;
  homeScoreFulltime: number;
  awayScoreFulltime: number;
  homeScoreExtratime: number | null;
  awayScoreExtratime: number | null;
  homeScorePenalty: number | null;
  awayScorePenalty: number | null;
  venue: Venue;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
  fixtureBets: FixtureBet[];
}
interface FixturesResponse {
  fixtures: Fixture[];
  nextDate: string;
}

export default function MatchCard({ activeTab }: { activeTab: string }) {
  const [matches, setMatches] = useState<Fixture[]>([]);
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const router = useRouter();
  const [leagues, setLeagues] = useState<
    { id: number; logo: string; name: string }[]
  >([]);
  const [tooltip, setTooltip] = useState<string | null>(null);
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

  const getFormattedDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const today = new Date();
  const yesterday = new Date(today);
  const tomorrow = new Date(today);
  const afterTomorrow = new Date(today);

  yesterday.setDate(today.getDate() - 1);
  tomorrow.setDate(today.getDate() + 1);

  let dateParam;
  switch (activeTab) {
    case "Hoy":
      dateParam = getFormattedDate(today);
      break;
    case "Ayer":
      dateParam = getFormattedDate(yesterday);
      break;
    case "Manana":
      dateParam = getFormattedDate(tomorrow);
      break;
    case "Siguiente Fecha":
      dateParam = getFormattedDate(afterTomorrow);
      break;
    default:
      dateParam = getFormattedDate(today);
  }

  const handleApostar = async (fixtureId: number) => {
    const API_BASE_URL = "https://waki.onrender.com/api";
    const FIXTURE_URL = `${API_BASE_URL}/fixtures/${fixtureId}`;
    const token = Cookies.get("authToken");

    if (!token) {
      router.push("/auth");
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
        const fixtureData = await response.json();

        router.push(`/predicciones?fixtureId=${fixtureId}`);
      } else {
        const errorData = await response.json();
        console.error("Error al obtener los datos:", errorData);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const API_BASE_URL = "https://waki.onrender.com/api";
  const FIXTURES_API_URL = `${API_BASE_URL}/fixtures?date=${dateParam}`;

  useEffect(() => {

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
          const data: FixturesResponse = await response.json();

          if (data.fixtures.length === 0 && data.nextDate) {
            Cookies.set("nextDate", data.nextDate, { expires: 7 });
          }

          if (Array.isArray(data.fixtures)) {
            const formattedMatches = data.fixtures
              .filter((match) => match.homeGoals > 0 || match.awayGoals > 0)
              .map((match) => {
                const matchDate = new Date(match?.date);
                const date = matchDate.toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                });
                const time = matchDate.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return {
                  id: match.id,
                  date: date,
                  time: time,
                  homeGoals: match.homeGoals,
                  awayGoals: match.awayGoals,
                  homeTeam: match.homeTeam,
                  awayTeam: match.awayTeam,
                };
              });
            setMatches(formattedMatches as Fixture[]);
          } else {
            console.error(
              "Error: La respuesta no contiene un array de fixtures",
              data
            );
          }
        } else {
          const errorData = await response.json();
          console.error("Error al obtener los datos:", errorData);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchMatches();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, FIXTURES_API_URL]);

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
            className={`overflow-hidden transition-all duration-300 ${
              openStates[league.id] ? "max-h-screen" : "max-h-0"
            }`}
          >
            <div className="p-4 bg-[#F0F4FF] max-h-60 overflow-y-auto rounded-b-md">
              {loading ? (
                <div className="loader-container">
                  <ClipLoader color={"#123abc"} loading={loading} size={50} />
                </div>
              ) : matches.length === 0 ? (
                <div className="no-partidos-container">
                  <div className="no-matches-message ">
                    No hay partidos en vivo
                  </div>
                </div>
              ) : (
                matches.map((match, index) => (
                  <Card
                    key={index}
                    className="my-5 mx-4"
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
                            src={match.homeTeam?.logo}
                            alt={`${match.homeTeam?.name} logo`}
                            width={32}
                            height={32}
                            className="mb-1"
                          />
                          <Tooltip
                            title={match.homeTeam?.name}
                            open={tooltip === match.homeTeam?.name}
                            onClose={handleTooltipClose}
                            onClick={() =>
                              handleTooltipOpen(match.homeTeam?.name)
                            }
                            arrow
                          >
                            <span className="font-semibold text-sm text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap max-w-[50px] text-center cursor-pointer">
                              {match.homeTeam?.name}
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
                            src={match.awayTeam?.logo}
                            alt={`${match.awayTeam?.name} logo`}
                            width={32}
                            height={32}
                            className="mb-1"
                          />
                          <Tooltip
                            title={match.awayTeam?.name}
                            open={tooltip === match.awayTeam?.name}
                            onClose={handleTooltipClose}
                            onClick={() =>
                              handleTooltipOpen(match.awayTeam?.name)
                            }
                            arrow
                          >
                            <span className="font-semibold text-sm text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap max-w-[50px] text-center cursor-pointer">
                              {match.awayTeam?.name}
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
