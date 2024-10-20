"use client";
import React, { useEffect, useState } from "react";
import ScoutPlayers from "../../assets/Vector-2.png";
import Partidos from "../../assets/Vector-1.png";
import Divisiones from "../../assets/Vector1.png";
import Predicciones from "../../assets/predicciones.png";
import PartidosActive from "../../assets/Vector12.png";
import DivisionesActive from "../../assets/Vector.png"; 
import Image from "next/image";
import { usePathname, useRouter } from 'next/navigation'; 

const MenuInferior = () => {
  const [activeIcon, setActiveIcon] = useState<string>("partidos");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes('/divisiones')) {
      setActiveIcon("divisiones");
    } else if (pathname.includes('/predicciones')) {
      setActiveIcon("predicciones");
    } else if (pathname.includes('/partidos')) {
      setActiveIcon("partidos");
    } else {
      setActiveIcon("scout");
    }
  }, [pathname]);

  const handleIconClick = (icon: string) => {
    if (icon === "divisiones") {
      router.push('/divisiones');
    } else if (icon === "partidos") {
      router.push('/partidos');
    } else if (icon === 'predicciones'){
      router.push('/predicciones');
    }
    setActiveIcon(icon); 
  };
  const isActive = (icon: string) => activeIcon === icon;

  return (
    <div
      className="fixed bottom-0 left-0 z-50 w-full h-16 border-t border-white-200 dark:border-white-600 rounded-t-lg"
      style={{ backgroundColor: "#2B28BD" }}
    >
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {/* Partidos */}
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 group"
          onClick={() => handleIconClick("partidos")}
          style={{
            backgroundColor: isActive("partidos") ? "#317EF4" : "transparent",
            transform: isActive("partidos") ? "scale(1.1)" : "scale(1)",
            boxShadow: isActive("partidos") ? "0 4px 10px rgba(0, 0, 0, 0.3)" : "none",
            borderRadius: isActive("partidos") ? "5px" : "0px", 
            transition: "all 0.3s ease",
          }}
        >
          <Image
            src={isActive("partidos") ? PartidosActive : Partidos} 
            width={20}
            height={20}
            alt="Partidos"
            className="w-5 h-5 mb-2"
            style={{
              filter: isActive("partidos") ? "brightness(0) invert(1)" : "none", 
            }}
          />
          <span
            className={`text-[10px] ${isActive("partidos") ? "text-white" : "text-white opacity-30"}`}
          >
            Partidos
          </span>
        </button>

        {/* Jugadores */}
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 group"
          onClick={() => handleIconClick("scout")}
          style={{
            backgroundColor: isActive("scout") ? "#317EF4" : "transparent",
            transform: isActive("scout") ? "scale(1.1)" : "scale(1)",
            boxShadow: isActive("scout") ? "0 4px 10px rgba(0, 0, 0, 0.3)" : "none",
            borderRadius: isActive("scout") ? "5px" : "0px", 
            transition: "all 0.3s ease",
          }}
        >
          <Image
            src={ScoutPlayers}
            width={20}
            height={20}
            alt="Scout Players"
            className="w-5 h-5 mb-2"
            style={{
              filter: isActive("scout") ? "brightness(0) invert(1)" : "none",
            }}
          />
          <span
            className={`text-[10px] ${isActive("scout") ? "text-white" : "text-white opacity-30"}`}
          >
            Jugadores
          </span>
        </button>

        {/* Divisiones */}
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 group"
          onClick={() => handleIconClick("divisiones")}
          style={{
            backgroundColor: isActive("divisiones") ? "#317EF4" : "transparent",
            transform: isActive("divisiones") ? "scale(1.1)" : "scale(1)",
            boxShadow: isActive("divisiones") ? "0 4px 10px rgba(0, 0, 0, 0.3)" : "none",
            borderRadius: isActive("divisiones") ? "5px" : "0px", 
            transition: "all 0.3s ease",
          }}
        >
          <Image
            src={isActive("divisiones") ? DivisionesActive : Divisiones}
            width={20}
            height={20}
            alt="Divisiones"
            className="w-5 h-5 mb-2"
            style={{
              filter: isActive("divisiones") ? "brightness(0) invert(1)" : "none",
            }}
          />
          <span
            className={`text-[10px] ${isActive("divisiones") ? "text-white" : "text-white opacity-30"}`}
          >
            Divisiones
          </span>
        </button>

        {/* Predicciones */}
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 group"
          onClick={() => handleIconClick("predicciones")}
          style={{
            backgroundColor: isActive("predicciones") ? "#317EF4" : "transparent",
            transform: isActive("predicciones") ? "scale(1.1)" : "scale(1)",
            boxShadow: isActive("predicciones") ? "0 4px 10px rgba(0, 0, 0, 0.3)" : "none",
            borderRadius: isActive("predicciones") ? "5px" : "0px", 
            transition: "all 0.3s ease",
          }}
        >
          <Image
            src={Predicciones}
            width={20}
            height={20}
            alt="Predicciones"
            className="w-5 h-5 mb-2"
            style={{
              filter: isActive("predicciones") ? "brightness(0) invert(1)" : "none",
            }}
          />
          <span
            className={`text-[10px] ${isActive("predicciones") ? "text-white" : "text-white opacity-30"}`}
          >
            Predicciones
          </span>
        </button>
      </div>
    </div>
  );
};

export default MenuInferior;
