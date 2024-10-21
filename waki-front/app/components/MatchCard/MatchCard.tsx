"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import SplashScreen from "../SplashScreen/SplashScreen";
import { Card, CardContent, CardHeader, Input } from "@mui/material";
import { CardTitle } from "@/components/ui/card";
import logoPL from '@/app/assets/ligas/logo-le.png'
import OsasunaLogo from '@/app/assets/escudos/osasuna.svg'
import BarcelonaLogo from '@/app/assets/escudos/fc-barcelona.svg'


interface Team {
  logo: string;
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
}

interface FormattedMatch {
  date: string;
  time: string;
  localTeam: string;
  visitTeam: string;
  localTeamLogo: string;
  visitTeamLogo: string;
  timeClose: string;
}

export default function MatchCard() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [matches, setMatches] = useState<FormattedMatch[]>([]);
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [odds, setOdds] = useState({
    home: "1.8",
    draw: "2.1",
    away: "1.3"
  })

  const handleOddsChange = (team: 'home' | 'draw' | 'away', value: string) => {
    setOdds(prevOdds => ({
      ...prevOdds,
      [team]: value
    }))
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchMatches = async (leagueId: number) => {
    const API_BASE_URL = "https://waki.onrender.com/api";
    const FIXTURES_API_URL = `${API_BASE_URL}/fixtures`;
    const token = Cookies.get("authToken");

    if (!token) {
      router.push("/auth");
    } else {
      try {
        const response = await fetch(FIXTURES_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedMatches = data.map((match: any) => {
            const matchDate = new Date(match.date);
            const date = matchDate.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
            });
            const time = matchDate.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            });

            const timeClose = "90:00";

            return {
              date: date,
              time: time,
              localTeam: match.homeTeam.name,
              visitTeam: match.awayTeam.name,
              localTeamLogo: match.homeTeam.logo,
              visitTeamLogo: match.awayTeam.logo,
              timeClose: timeClose,
            };
          });

          setMatches((prevMatches) => {
            const updatedMatches = [...prevMatches];
            formattedMatches.forEach((formattedMatch: FormattedMatch) => {
              const index = updatedMatches.findIndex(
                (match) => match.localTeam === formattedMatch.localTeam && match.visitTeam === formattedMatch.visitTeam
              );

              if (index !== -1) {
                updatedMatches[index] = formattedMatch; 
              } else {
                updatedMatches.push(formattedMatch); 
              }
            });
            return updatedMatches;
          });
        } else {
          const errorData = await response.json();
          console.error("Error al obtener los datos:", errorData);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleCollapse = (id: number) => {
    const isOpening = !openStates[id];
    if (isOpening) {
      fetchMatches(id); 
    }
    setOpenStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isAuthenticated) {
    return <SplashScreen />;
  }

  return (
    // <div className="max-w-md mx-auto bg-white shadow-lg overflow-hidden">
    //   {leagues.length > 0 ? (
    //     leagues.map((league) => (
    //       <div key={league.id} className="rounded-md">
    //         <button
    //           onClick={() => toggleCollapse(league.id)}
    //           className="flex items-center justify-between w-full px-4 py-2 text-left bg-white rounded-md hover:bg-gray-100"
    //         >
    //           <div className="flex items-center">
    //             {league.country?.flag && (
    //               <Image
    //                 src={league.country.flag}
    //                 alt={`${league.name} flag`}
    //                 width={24}
    //                 height={24}
    //                 className="rounded-full mr-2"
    //               />
    //             )}
    //             <span className="text-gray-800 text-xs font-normal">{league.name}</span>
    //           </div>
  
    //           <div className="ml-16">
    //             {openStates[league.id] ? (
    //               <FaChevronUp style={{ color: "#317EF4", fontSize: "12px" }} />
    //             ) : (
    //               <FaChevronDown style={{ color: "#317EF4", fontSize: "12px" }} />
    //             )}
    //           </div>
    //         </button>
  
    //         <div
    //           className={`overflow-hidden transition-all duration-300 ${openStates[league.id] ? "max-h-screen" : "max-h-0"}`}
    //         >
    //           <div className="p-4 bg-[#F0F4FF] max-h-60 overflow-y-auto ">
    //             {loading ? (
    //               <div>Cargando partidos...</div>
    //             ) : matches.length > 0 ? (
    //               matches.map((match, index) => (
    //                 <div key={index} className="flex justify-between items-center mb-6"> 
    //                 <div className="flex items-center space-x-4"> 
    //                   <Image
    //                     src={match.localTeamLogo}
    //                     alt={`${match.localTeam} logo`}
    //                     width={24}
    //                     height={24} 
    //                     className="rounded-full"
    //                   />
    //                   <span className="text-sm font-semibold text-gray-800">{match.localTeam}</span>
    //                 </div>
                    
    //                 <div className="flex items-center space-x-4"> 
    //                   <Image
    //                     src={match.visitTeamLogo}
    //                     alt={`${match.visitTeam} logo`}
    //                     width={24}
    //                     height={24}  
    //                     className="rounded-full"
    //                   />
    //                   <span className="text-sm font-semibold text-gray-800">{match.visitTeam}</span>
    //                 </div>
    //               </div>
                  
    //               ))
    //             ) : (
    //               <div>No se encontraron partidos.</div>
    //             )}
    //           </div>
    //         </div>
    //       </div>
    //     ))
    //   ) : (
    //     <div>No se encontraron ligas.</div>
    //   )}
    // </div>
    <div className='container-partido'>
    <Card id='card' className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
    <CardHeader className="flex justify-between items-center p-4 bg-gray-50">
      <div className="flex items-center space-x-2">
        <Image src={logoPL}
        alt="Liga española logo"
         width={24} 
         height={24} 
         className="rounded-full" />
        <CardTitle className="text-lg font-semibold text-gray-800">Liga española</CardTitle>
      </div>
      <span className="text-red-500 font-semibold ml-auto">16:00</span>
    </CardHeader>
    <CardContent className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-center space-y-2">
          <Image src={OsasunaLogo}
           alt="Osasuna logo" 
           width={48} 
           height={48} />
          <span className="font-semibold text-gray-800">Osasuna</span>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">1 - 2</div>
          <div className="text-red-500 text-sm mt-1">49:30</div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Image src={BarcelonaLogo}
          alt="Barcelona logo" 
          width={48}
           height={48} />
          <span className="font-semibold text-gray-800">Barcelona</span>
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <div className="w-1/3 px-1">
          <Input
            type="text"
            value={odds.home}
            onChange={(e) => handleOddsChange('home', e.target.value)}
            className="text-center"
          />
        </div>
        <div className="w-1/3 px-1">
          <Input
            type="text"
            value={odds.draw}
            onChange={(e) => handleOddsChange('draw', e.target.value)}
            className="text-center"
          />
        </div>
        <div className="w-1/3 px-1">
          <Input
            type="text"
            value={odds.away}
            onChange={(e) => handleOddsChange('away', e.target.value)}
            className="text-center bg-purple-100 text-purple-700"
          />
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-2">
        Eliminatorias, cuartos de final, primer partido
      </div>
    </CardContent>
  </Card>
  </div>
  );
}
