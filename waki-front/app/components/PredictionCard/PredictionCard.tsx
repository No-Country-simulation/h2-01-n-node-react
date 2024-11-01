/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { Card, CardContent, CardHeader, Tooltip } from "@mui/material";
import logoPL from "@/app/assets/ligas/logo-le.png";
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
  id?: number;
  name: string;
  code?: string;
  founded?: number;
  national?: boolean;
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
  time?: ReactNode;
  id?: number;
  referee?: string;
  timezone?: string;
  date?: string;
  timestamp?: number;
  firstPeriod?: number;
  secondPeriod?: number;
  statusLong?: string;
  statusShort?: string;
  statusElapsed?: number;
  statusExtra?: number;
  season?: number;
  round?: string;
  homeTeamWinner?: boolean;
  awayTeamWinner?: boolean;
  homeGoals?: number;
  awayGoals?: number;
  homeScoreHalftime?: number;
  awayScoreHalftime?: number;
  homeScoreFulltime?: number;
  awayScoreFulltime?: number;
  homeScoreExtratime?: number | null;
  awayScoreExtratime?: number | null;
  homeScorePenalty?: number | null;
  awayScorePenalty?: number | null;
  venue?: Venue;
  league?: League;
  homeTeam?: Team;
  awayTeam?: Team;
  fixtureBets?: FixtureBet[];
}
interface FixturesResponse {
  fixtures: Fixture[];
  nextDate: string;
}

interface MatchStatistic {
  team: string;
  percentage: number;
}

export default function PredictionCard({ activeTab }: { activeTab: string }) {
  const [matches, setMatches] = useState<Fixture[]>([]);
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const [leagues, setLeagues] = useState<
    { id: number; logo: string; name: string }[]
  >([]);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [matchStatistics, setMatchStatistics] = useState<MatchStatistic[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [decryptedDate, setDecryptedDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

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

  const { isDarkMode, toggleDarkMode } = useTheme();

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
  // Función para leer y desencriptar desde la cookie
  const getDecryptedDateFromCookiePrediction = (): string | null => {
    const encryptedDatePrediction = Cookies.get("prediction");
    if (encryptedDatePrediction) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedDatePrediction, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (decrypted) {
          return decrypted;
        } else {
          setError("Error: Valor desencriptado vacío.");
          return null;
        }
      } catch (e) {
        console.error("Error al desencriptar:", e);
        setError("Error al desencriptar el valor.");
      }
    } else {
      setError("Error: La cookie 'prediction' no existe.");
    }
    return null;
  };

  useEffect(() => {
    const date = getDecryptedDateFromCookiePrediction();
    setDecryptedDate(date);
  }, []);

  const fixtureId = getDecryptedDateFromCookie();
  const API_BASE_URL = "https://waki.onrender.com/api";
  const FIXTURE_URL = `${API_BASE_URL}/fixtures/${fixtureId}`;

  useEffect(() => {
    const fetchMatchesAndPredictions = async () => {
      const token = Cookies.get("authToken");

      if (!token) {
        router.push("/auth");
        return;
      }

      try {
        const fixtureResponse = await fetch(FIXTURE_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (fixtureResponse.ok) {
          const fixtureData = await fixtureResponse.json();

          if (fixtureData && fixtureData.fixture) {
            const fixture = fixtureData.fixture;

            const fixtureBets = fixture.fixtureBets[0]?.fixtureBetOdds || [];
            const newStatistics = [
              {
                team: fixture.homeTeam.name,
                percentage: fixtureBets[0]?.odd || 0,
              },
              {
                team: "Empate",
                percentage: fixtureBets[1]?.odd || 0,
              },
              {
                team: fixture.awayTeam.name,
                percentage: fixtureBets[2]?.odd || 0,
              },
            ];
            setMatchStatistics(newStatistics);

            const formattedMatch = {
              id: fixture.id,
              homeTeam: fixture.homeTeam,
              awayTeam: fixture.awayTeam,
            };

            setMatches([formattedMatch]);
          } else {
            console.error(
              "Error: La respuesta no contiene un fixture válido",
              fixtureData
            );
          }
        } else {
          const errorData = await fixtureResponse.json();
          console.error("Error al obtener los datos del fixture:", errorData);
        }

        const GET_URL =
          "https://waki.onrender.com/api/predictions/user?type=single";
        const predictionResponse = await fetch(GET_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (predictionResponse.ok) {
          const predictionData = await predictionResponse.json();

          if (
            predictionData.predictions &&
            predictionData.predictions.length > 0
          ) {
            const prediction = predictionData.predictions[0];
            const fixture = prediction;

            if (fixture.value === "Home") {
              setSelectedTeam({
                name: fixture.homeTeam?.name,
                logo: fixture.homeTeam?.logo,
              });
            } else if (fixture.value === "Away") {
              setSelectedTeam({
                name: fixture.awayTeam?.name,
                logo: fixture.awayTeam?.logo,
              });
            }
          }
        } else {
          const predictionErrorData = await predictionResponse.json();
          console.error(
            "Error al obtener los datos de predicción:",
            predictionErrorData
          );
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchMatchesAndPredictions();
  }, [FIXTURE_URL, router]);

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
          const leaguesArray = Array.isArray(data.leagues) ? data.leagues : [];
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
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg overflow-hidden rounded-lg dark:bg-gray-800">
      {leagues.map((league) => (
        <div key={league.id} className="rounded-md">
          <button
            onClick={() => toggleDropdown(league.id)}
            className="flex items-center justify-between w-full px-4 py-3 text-left bg-white rounded-md hover:bg-gray-200 transition duration-200 ease-in-out dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <div className="flex items-center">
              <Image
                src={league.logo || logoPL}
                alt="Liga logo"
                width={24}
                height={24}
                className="rounded-full mr-2"
              />
              <span className="text-gray-800 text-sm font-medium dark:text-white">
                {league.name}
              </span>
            </div>

            <div className="ml-4">
              {openStates[league.id] ? (
                <FaChevronUp className="text-blue-600 dark:text-blue-400" />
              ) : (
                <FaChevronDown className="text-blue-600 dark:text-blue-400" />
              )}
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              openStates[league.id] ? "max-h-screen" : "max-h-0"
            }`}
          >
            <div className="p-4 bg-[#F0F4FF] max-h-60 overflow-y-auto rounded-b-md dark:bg-gray-700">
              {loading ? (
                <div className="loader-container">
                  <ClipLoader color={"#123abc"} loading={loading} size={50} />
                </div>
              ) : (
                matches.map((match, index) => (
                  <Card
                    key={index}
                    className="my-5 mx-4"
                    sx={{
                      boxShadow: "none",
                      border: "none",
                      backgroundColor: isDarkMode ? "#1F2937" : "#F0F4FF",
                    }}
                  >
                    <CardHeader
                      sx={{
                        borderBottom: "none",
                        backgroundColor: isDarkMode ? "#1F2937" : "#F0F4FF",
                      }}
                    />
                    <CardContent
                      sx={{
                        border: "none",
                        backgroundColor: isDarkMode ? "#1F2937" : "#F0F4FF",
                      }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        {/* Columna 1: "Tu predicción" en la misma línea */}
                        <div className="flex flex-col items-start space-y-1 mr-5">
                          <div className="flex items-center space-x-1">
                            <span
                              className={`font-semibold text-sm ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              }`}
                            >
                              Tu
                            </span>
                            <span
                              className={`font-semibold text-sm ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              }`}
                            >
                              predicción
                            </span>
                          </div>
                          <span
                            className={`font-medium text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {decryptedDate}
                          </span>
                        </div>

                        {/* Columna 2: Equipos */}
                        <div className="flex flex-col items-center space-y-2">
                          {/* Equipo Local */}
                          <div className="flex items-center space-x-2">
                            {match.homeTeam?.logo ? (
                              <Image
                                src={match.homeTeam.logo}
                                alt={`${match.homeTeam?.name} logo`}
                                width={25}
                                height={25}
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full">
                                <span className="text-gray-600">N/A</span>
                              </div>
                            )}
                            <Tooltip
                              title={match.homeTeam?.name}
                              open={tooltip === match.homeTeam?.name}
                              onClose={handleTooltipClose}
                              onClick={() =>
                                handleTooltipOpen(match.homeTeam?.name ?? "")
                              }
                              arrow
                            >
                              <span
                                className={`font-semibold text-sm truncate max-w-[100px] ${
                                  isDarkMode ? "text-white" : "text-gray-800"
                                }`}
                              >
                                {match.homeTeam?.name}
                              </span>
                            </Tooltip>
                          </div>

                          {/* Equipo Visitante */}
                          <div className="flex items-center space-x-2">
                            {match.awayTeam?.logo ? (
                              <Image
                                src={match.awayTeam.logo}
                                alt={`${match.awayTeam?.name} logo`}
                                width={25}
                                height={25}
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full">
                                <span className="text-gray-600">N/A</span>
                              </div>
                            )}
                            <Tooltip
                              title={match.awayTeam?.name}
                              open={tooltip === match.awayTeam?.name}
                              onClose={handleTooltipClose}
                              onClick={() =>
                                handleTooltipOpen(match.awayTeam?.name ?? "")
                              }
                              arrow
                            >
                              <span
                                className={`font-semibold text-sm truncate max-w-[100px] ${
                                  isDarkMode ? "text-white" : "text-gray-800"
                                }`}
                              >
                                {match.awayTeam?.name}
                              </span>
                            </Tooltip>
                          </div>
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
