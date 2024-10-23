/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import vsImage from "@/app/assets/VS.png";
import logoLE from "@/app/assets/ligas/logo-le.png";
import "./carrusel.css";

const API_BASE_URL = "https://waki.onrender.com/api";
const FIXTURES_API_URL = `${API_BASE_URL}/fixtures`;

type Match = {
  date: string;
  time: string;
  localTeam: string;
  visitTeam: string;
  localTeamLogo: string;
  visitTeamLogo: string;
  timeClose: string;
  isCardVisible: boolean;
};

export default function Carrusel() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
        

        // Verifica que 'data.fixtures' sea un array
        if (!Array.isArray(data.fixtures)) {
          console.error("La respuesta no es un array:", data.fixtures);
          return;
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
  }, [router]);

  const handleImageError = (index: number) => {
    setMatches((prevMatches) => {
      const updatedMatches = [...prevMatches];
      updatedMatches[index].isCardVisible = false;
      return updatedMatches;
    });
  };

  const renderMatchCard = (match: Match, index: number) => (
    <div key={index} className="carousel-item">
      <div className="card-content">
        <div id="topview-card">
          <div className="match-date-time">
            <Image
              priority={true}
              alt="Imagen de Liga española"
              className="logo-le"
              src={logoLE}
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
          ) : (
            matches.map(
              (match, index) => match.isCardVisible && renderMatchCard(match, index)
            )
          )}
        </div>
      </div>
    </div>
  );
}
