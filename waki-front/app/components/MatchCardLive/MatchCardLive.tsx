/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { Card, CardContent, CardHeader, Tooltip } from "@mui/material";
import logoPL from "@/app/assets/ligas/logo-le.png";
import "./matchcardlive.css";
import { ClipLoader } from "react-spinners";
import { useTheme } from "@/app/components/context/ThemeContext";
import CryptoJS from "crypto-js";
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

export default function MatchCardLive({ activeTab }: { activeTab: string }) {
  const [matches, setMatches] = useState<Fixture[]>([]);
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const router = useRouter();
  const [leagues, setLeagues] = useState<
    { id: number; logo: string; name: string }[]
  >([]);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isDarkMode, toggleDarkMode } = useTheme();

  
  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY as string;
  // Función para encriptar y guardar en cookie
  const setEncryptedDateCookie = (date: string) => {
    if (!SECRET_KEY) {
      console.error("La clave secreta no está definida");
      return;
    }

    const encryptedDate = CryptoJS.AES.encrypt(date, SECRET_KEY).toString();
    Cookies.set("nextDate", encryptedDate, { expires: 7, secure: true });
  };


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

  const API_BASE_URL = "https://waki.onrender.com/api";

  const fetchData = async (url: string, method = "GET") => {
    const token = Cookies.get("authToken");
    if (!token) {
      router.push("/auth");
      throw new Error("Usuario no autenticado");
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en la solicitud:", errorData);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return null;
    }
  };

  // Función para manejar la lógica de "Apostar"
  const handleApostar = async (fixtureId: number) => {
    const fixtureData = await fetchData(
      `${API_BASE_URL}/fixtures/${fixtureId}`
    );
    
    if (fixtureData && fixtureData.fixture) {
      const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY as string;

      // Función para encriptar y guardar en cookie
      const setEncryptedDateCookie = (fixture: string) =>{
        if (!SECRET_KEY) {
          console.error("La clave secreta no está definida");
          return;
        }
      
        Cookies.set("fixture", fixtureData.fixture.id, { expires: 7 });
      }

      setEncryptedDateCookie(fixtureData.fixture.id)
      router.push(`/predicciones?fixtureId=${fixtureId}`);
    }
  };

  // Hook para obtener y procesar los "Fixtures"
  useEffect(() => {
    const fetchMatches = async () => {
      const fixturesData = await fetchData(
        `${API_BASE_URL}/fixtures?date=${dateParam}`
      );

      if (fixturesData && fixturesData.fixtures) {
        const fixtures = fixturesData.fixtures;

        if (fixtures.length === 0 && fixturesData.nextDate) {
          setEncryptedDateCookie(fixturesData.nextDate)
        }

        const formattedMatches = fixtures
          .filter(
            (match: { homeGoals: null; awayGoals: null }) =>
              match.homeGoals == null && match.awayGoals == null
          )
          .map(
            (match: {
              date: string | number | Date;
              id: any;
              homeGoals: any;
              awayGoals: any;
              homeTeam: any;
              awayTeam: any;
            }) => {
              const matchDate = new Date(match.date);
              return {
                id: match.id,
                date: matchDate.toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                }),
                time: matchDate.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                homeGoals: match.homeGoals,
                awayGoals: match.awayGoals,
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
              };
            }
          );

        setMatches(formattedMatches as Fixture[]);
      } else {
        console.error(
          "Error: La respuesta no contiene un array de fixtures",
          fixturesData
        );
      }
    };

    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, dateParam]);

  // Hook para obtener y procesar las "Leagues"
  useEffect(() => {
    const fetchLeagues = async () => {
      const leaguesData = await fetchData(`${API_BASE_URL}/leagues/current`);

      if (leaguesData && leaguesData.leagues) {
        setLeagues(leaguesData.leagues);
      } else {
        console.error(
          "Error: La respuesta no contiene un array de leagues",
          leaguesData
        );
      }

      setLoading(false);
    };

    fetchLeagues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div
      className={`max-w-md mx-auto mt-10 rounded-lg ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } shadow-lg overflow-hidden`}
    >
      {leagues.map((league) => (
        <div key={league.id} className="rounded-md">
          <button
            onClick={() => toggleDropdown(league.id)}
            className={`flex items-center justify-between w-full px-4 py-3 text-left rounded-md transition duration-200 ease-in-out ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-white hover:bg-gray-200 text-gray-800"
            }`}
          >
            <div className="flex items-center">
              <Image
                src={league.logo || logoPL}
                alt="Liga logo"
                width={24}
                height={24}
                className="rounded-full mr-2"
              />
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {league.name}
              </span>
            </div>

            <div className="ml-4">
              {openStates[league.id] ? (
                <FaChevronUp
                  className={isDarkMode ? "text-blue-400" : "text-blue-600"}
                />
              ) : (
                <FaChevronDown
                  className={isDarkMode ? "text-blue-400" : "text-blue-600"}
                />
              )}
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              openStates[league.id] ? "max-h-screen" : "max-h-0"
            }`}
          >
            <div
              className={`p-4 max-h-60 overflow-y-auto rounded-b-md ${
                isDarkMode ? "bg-gray-700" : "bg-[#F0F4FF]"
              }`}
            >
              {loading ? (
                <div className="loader-container">
                  <ClipLoader color={"#123abc"} loading={loading} size={50} />
                </div>
              ) : matches.length === 0 ? (
                <div className="no-partidos-container">
                  <div
                    className={`no-matches-message ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    No hay partidos por jugar
                  </div>
                </div>
              ) : (
                matches.map((match, index) => (
                  <Card
                    key={index}
                    className={`my-5 mx-4 ${
                      isDarkMode ? "bg-gray-800" : "bg-[#F0F4FF]"
                    }`}
                    sx={{
                      boxShadow: "none",
                      border: "none",
                      backgroundColor: isDarkMode ? "#2D3748" : "#F0F4FF",
                    }}
                  >
                    <CardHeader
                      sx={{
                        borderBottom: "none",
                        backgroundColor: isDarkMode ? "#2D3748" : "#F0F4FF",
                      }}
                    />
                    <CardContent
                      sx={{
                        border: "none",
                        backgroundColor: isDarkMode ? "#2D3748" : "#F0F4FF",
                      }}
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
                            <span
                              className={`font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[50px] text-center cursor-pointer ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              }`}
                            >
                              {match.homeTeam?.name}
                            </span>
                          </Tooltip>
                        </div>
                        <div className="text-center space-y-0.5">
                          <div
                            className={`font-bold text-lg ${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {match.homeGoals} VS {match.awayGoals}
                          </div>
                          <div
                            className={`text-xs ${
                              isDarkMode ? "text-red-400" : "text-red-500"
                            }`}
                          >
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
                            <span
                              className={`font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[50px] text-center cursor-pointer ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              }`}
                            >
                              {match.awayTeam?.name}
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                      <div className="text-center">
                        <button
                          onClick={() => handleApostar(match.id)}
                          style={{ fontSize: "11px" }}
                          className="px-4 py-2 bg-[#8E2BFF] btn-box-shadow text-white font-bold rounded transition duration-200"
                        >
                          Predecir
                        </button>
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
