/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import vsImage from "@/app/assets/VS.png";
import "./carrusel.css";

const API_BASE_URL = "https://waki.onrender.com/api";

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
  nextDate: string;
  fixtureBets: FixtureBet[];
  isCardVisible: boolean;
}

export default function Carrusel({ activeTab }: { activeTab: string }) {
  const [matches, setMatches] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getFormattedDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const today = new Date();
  const yesterday = new Date(today);
  const tomorrow = new Date(today);
  const afterTomorrow = new Date(today);

  yesterday.setDate(today.getDate() - 1);
  tomorrow.setDate(today.getDate() + 1);

  const afterTomorrowCookie = Cookies.get("afterTomorrow");
  if (afterTomorrowCookie) {
    afterTomorrow.setDate(new Date(afterTomorrowCookie).getDate());
  } else {
    afterTomorrow.setDate(today.getDate() + 2);
  }

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

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error al obtener los datos:", errorData);
          return;
        }

        const data = await response.json();

        if (!Array.isArray(data.fixtures)) {
          console.error("La respuesta no es un array:", data.fixtures);
          return;
        }

        if (data.fixtures.length === 0 && data.nextDate) {
          Cookies.set("nextDate", data.nextDate, { expires: 7 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedMatches = data.fixtures.map((match: any) => {
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
            date,
            time,
            localTeam: match.homeTeam.name,
            visitTeam: match.awayTeam.name,
            localTeamLogo: match.homeTeam.logo,
            visitTeamLogo: match.awayTeam.logo,
            timeClose: "90:00",
            isCardVisible: true,
            leagueLogo: match.league.logo
          };
        });

        setMatches(formattedMatches);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [router, FIXTURES_API_URL]);

  const handleImageError = (index: number) => {
    setMatches((prevMatches) => {
      const updatedMatches = [...prevMatches];
      updatedMatches[index].isCardVisible = false;
      return updatedMatches;
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderMatchCard = (match: any, index: number) => (
    <div key={index} className="carousel-item">
      <div className="card-content">
        <div id="topview-card">
          <div className="match-date-time">
          <img
              alt="Imagen de Liga española"
              className="logo-le"
              src={match.leagueLogo}

            />
            <div className="trapecio">
              <span className="topview-date">{match.date}</span>
            </div>
            <span className="topview-time">{match.time}</span>
          </div>
        </div>
        <div className="match-info">
          <div className="team-info">
            <img
              src={match.localTeamLogo}
              alt={match.localTeam}
              className="team-logo"
              onError={() => handleImageError(index)}
            />
            <span className="team-name">{match.localTeam}</span>
          </div>
          <Image
            priority={true}
            alt="Imagen de VS"
            className="vsImage"
            src={vsImage}
          />
          <div className="team-info">
            <img
              src={match.visitTeamLogo}
              alt={match.visitTeam}
              className="team-logo"
              onError={() => handleImageError(index)}
            />
            <span className="team-name">{match.visitTeam}</span>
          </div>
        </div>
        <div className="time-close">
          Tiempo restante para apostar
          <span className="timeCloseVar"> {match.timeClose}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div id="container-carrusel">
      <div className="carousel">
        <div className="carousel-content">
          {loading ? (
            <div className="loader-container">
              <ClipLoader color={"#123abc"} loading={loading} size={50} />
            </div>
          ) : matches.length === 0 ? (
            <div className="no-partidos-container">
              <div className="no-matches-message ml-3 mt-5">
                No hay partidos para esta fecha
              </div>
              <button
                className="ver-proximos-btn mt-5 ml-12"
                onClick={() => router.push("/proximos-partidos")}
              >
                Ver próximos partidos
              </button>
            </div>
          ) : (
            matches.map(
              (match, index) =>
                match.isCardVisible && renderMatchCard(match, index)
            )
          )}
        </div>
      </div>
    </div>
  );
}
