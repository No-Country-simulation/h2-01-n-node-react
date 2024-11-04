/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaChevronUp, FaChevronDown, FaCheck, FaTimes } from "react-icons/fa";
import { Card, CardContent, CardHeader, Tooltip } from "@mui/material";
import logoPL from "@/app/assets/ligas/logo-le.png";
import { ClipLoader } from "react-spinners";
import IconCopa from "@/app/assets/iconCopa.png";
import { useTheme } from "@/app/components/context/ThemeContext";
import "./PredictionCard.css";

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
interface FormattedPrediction {
  predictionTeam: string;
  homeTeam: Team;
  awayTeam: Team;
  points: number;
  status: string;
  fixtureDate: string; // Añadir fecha del fixture
}
interface MatchStatistic {
  team: string;
  percentage: number;
}

export default function PredictionCard({ activeTab }: { activeTab: string }) {
  const [matches, setMatches] = useState<FormattedPrediction[]>([]);
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const [leagues, setLeagues] = useState<
    { id: number; logo: string; name: string }[]
  >([]);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredMatches, setFilteredMatches] = useState<FormattedPrediction[]>(
    []
  );

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const translateStatus = (status: string) => {
    const translations: Record<string, string> = {
      PENDING: "Pendiente",
      WON: "Ganaste",
      LOST: "Perdiste",
    };

    return (
      translations[status] ||
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    );
  };

  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const API_BASE_URL = "https://waki.onrender.com/api";
    const PREDICTION_API_URL = `${API_BASE_URL}/predictions/user?type=single`;

    const fetchPredictions = async () => {
      const token = Cookies.get("authToken");
      setLoading(true);
      try {
        const response = await fetch(PREDICTION_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedPredictions: FormattedPrediction[] =
          data.predictions.map((prediction: any) => ({
            predictionTeam: prediction.predictionTeam,
            homeTeam: prediction.fixture.homeTeam,
            awayTeam: prediction.fixture.awayTeam,
            points: prediction.points ?? 10,
            status: prediction.status,
            fixtureDate: prediction.fixture.date,
          }));

        setMatches(formattedPredictions);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  useEffect(() => {
    const filtered = matches.filter((match) => {
      const fixtureDate = new Date(match.fixtureDate);
      return fixtureDate.toISOString().split("T")[0] === dateParam;
    });
  
    setFilteredMatches(filtered);
  }, [activeTab, matches]);

  const getDateParam = (tab: string, today: Date) => {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dateMap: Record<string, string> = {
        Hoy: today.toISOString().split("T")[0],
        Ayer: yesterday.toISOString().split("T")[0],
        Manana: tomorrow.toISOString().split("T")[0],
    };

    return dateMap[tab] || today.toISOString().split("T")[0];
};

  const today = new Date();
  const yesterday = new Date(today);
  const tomorrow = new Date(today);

  yesterday.setDate(today.getDate() - 1);
  tomorrow.setDate(today.getDate() + 1);

  let dateParam: string;
  switch (activeTab) {
    case "Hoy":
      dateParam = getFormattedDate(today);
      getDateParam(activeTab, today)
      break;
    case "Ayer":
      dateParam = getFormattedDate(yesterday);
      break;
    case "Manana":
      dateParam = getFormattedDate(tomorrow);
      break;
    default:
      dateParam = getFormattedDate(today);
  }

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
    <div className="max-w-md mx-auto bg-white shadow-lg overflow-hidden rounded-lg dark:bg-gray-800">
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
            <div className="p-4 bg-[#F0F4FF] max-h-60 max-w-100 overflow-y-auto rounded-b-md dark:bg-gray-700">
              {loading ? (
                <div className="loader-container">
                  <ClipLoader color={"#123abc"} loading={loading} size={50} />
                </div>
              ) : matches.length === 0 ? (
                <div className="text-center text-gray-500">
                  No tienes predicciones.
                </div>
              ) : (
                filteredMatches.map((match, index) => (
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
                      {/* Bloque "Tu predicción" */}
                      <div className="flex justify-center items-center">
                        <div className="flex flex-col items-center space-y-1">
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
                        </div>
                      </div>

                      {/* Columna 1: Prediction Team sin Tooltip */}
                      <div className="flex flex-col items-center space-y-1 mt-4">
                        <span
                          className={`font-medium text-sm max-w-[100px] mb-5 ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {match.predictionTeam}
                        </span>
                      </div>

                      {/* Encabezado "Equipos" */}
                      <div
                        className={`font-semibold text-center text-md ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        } mt-5 mb-2`}
                      >
                        Equipos
                      </div>

                      {/* Columna 2: Equipos con Tooltip */}
                      <div className="flex justify-center items-center p-5">
                        <div className="flex flex-col items-center mr-10">
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

                        <div className="flex flex-col items-center mx-4">
                          <span
                            className={`font-bold text-lg ${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                          ></span>
                        </div>

                        <div className="flex flex-col items-center ml-10">
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

                      {/* Línea de puntos y trofeo */}
                      <div className="flex justify-center items-center mt-8">
                        <span
                          className={`font-medium text-xxl ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          Puntos:
                        </span>
                        <Image
                          src={IconCopa}
                          alt="Trophy"
                          width={16}
                          height={16}
                          className="inline mr-1 ml-2"
                        />
                        <span
                          className={`font-medium text-xxl ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          x 10
                        </span>
                      </div>
                      <div className="flex flex-col justify-center items-center mt-8">
                        <span
                          className={`flex items-center font-medium text-xxl ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {/* Muestra el icono o loader dependiendo del estado */}
                          {match.status === "PENDING" ? (
                            <ClipLoader
                              className="mr-2"
                              color={"#123abc"}
                              size={20}
                            />
                          ) : match.status === "WON" ? (
                            <FaCheck className="text-green-500 mr-2" />
                          ) : match.status === "LOST" ? (
                            <FaTimes className="text-red-500 mr-2" />
                          ) : null}
                          {/* Texto traducido */}
                          Estado: {translateStatus(match.status)}
                        </span>

                        {match.status === "LOST" && (
                          <div
                            className={`mt-2 text-center text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Perdiste 10 puntos en esta predicción
                          </div>
                        )}

                        {match.status === "WON" && (
                          <div
                            className={`mt-2 text-center text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Ganaste 10 puntos en esta predicción
                          </div>
                        )}
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
};