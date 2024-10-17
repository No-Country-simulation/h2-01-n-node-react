"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaChevronUp, FaChevronDown } from "react-icons/fa"; // Importar los iconos
import SplashScreen from "../SplashScreen/SplashScreen";

interface League {
  id: number;
  name: string;
  country: {
    flag: string;
  };
}

export default function MatchCard() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Estado para manejar el colapso de cada liga
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});

  // Obtener datos desde la API
  useEffect(() => {
    const API_BASE_URL = "https://waki.onrender.com/api";
    const LEAGUES_API_URL = `${API_BASE_URL}/leagues/current`;

    const fetchLeagues = async () => {
      const token = Cookies.get("authToken");
      if (!token) {
        // Si no hay token, redirige al usuario a la página de login
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
          // Inicializar el estado de colapso para cada liga
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
  }, []);

  if (!isAuthenticated) {
    // Mostramos una pantalla en blanco o un loader mientras verificamos la autenticación
    return <SplashScreen />;
  }

  const toggleCollapse = (id: number) => {
    setOpenStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
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
                {/* Texto más pequeño y sin font-bold */}
                <span className="text-gray-800 text-xs font-normal" style={{fontSize: "10px"}}>
                  {league.name}
                </span>
              </div>

              {/* Esto añadirá espacio automático entre el nombre y el ícono */}
              <div className="ml-16">
                {openStates[league.id] ? (
                  <FaChevronUp style={{ color: "#317EF4", fontSize: "12px" }} />
                ) : (
                  <FaChevronDown
                    style={{ color: "#317EF4", fontSize: "12px" }}
                  />
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
                {/* Aquí puedes añadir contenido adicional relacionado con la liga */}
                <h1>Hola</h1>
                <h1>Hola</h1>
                <h1>Hola</h1>
                <h1>Hola</h1>
                <h1>Hola</h1>
                <h1>Hola</h1>
                <h1>Hola</h1>
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
