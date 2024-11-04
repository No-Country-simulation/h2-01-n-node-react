"use client";
import React, { useEffect, useState } from "react";
import jugadoresPlayers from "../../assets/Vector-2.png";
import Partidos from "../../assets/Vector-1.png";
import Divisiones from "../../assets/Vector1.png";
import Predicciones from "../../assets/predicciones.png";
import PartidosActive from "../../assets/Vector12.png";
import DivisionesActive from "../../assets/Vector.png";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const MenuInferior = () => {
  const [activeIcon, setActiveIcon] = useState<string>("partidos");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("/divisiones")) {
      setActiveIcon("divisiones");
    } else if (pathname.includes("/prediccionesPerfil")) {
      setActiveIcon("prediccionesPerfil");
    } else if (pathname.includes("/jugadores")) {
      setActiveIcon("jugadores");
    } else if (pathname.includes("/partidos")) {
      setActiveIcon("partidos");
    } else {
      setActiveIcon("jugadores");
    }
  }, [pathname]);

  const handleIconClick = (icon: string) => {
    if (icon === "divisiones") {
      router.push("/divisiones");
    } else if (icon === "partidos") {
      router.push("/partidos");
    } else if (icon === "prediccionesPerfil") {
      router.push("/prediccionesPerfil");
    } else if (icon === "jugadores") {
      router.push("/jugadores");
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
            boxShadow: isActive("partidos")
              ? "0 6px 12px rgba(0, 0, 0, 0.2), 0 8px 20px rgba(0, 0, 0, 0.15), 0 12px 25px rgba(0, 0, 0, 0.1)"
              : "none",
            borderRadius: isActive("partidos") ? "10px" : "0px",
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
            className={`text-[10px] ${
              isActive("partidos") ? "text-white" : "text-white opacity-30"
            }`}
          >
            Partidos
          </span>
        </button>

        {/* Jugadores */}
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 group"
          onClick={() => handleIconClick("jugadores")}
          style={{
            backgroundColor: isActive("jugadores") ? "#317EF4" : "transparent",
            transform: isActive("jugadores") ? "scale(1.1)" : "scale(1)",
            boxShadow: isActive("jugadores")
              ? "0 6px 12px rgba(0, 0, 0, 0.2), 0 8px 20px rgba(0, 0, 0, 0.15), 0 12px 25px rgba(0, 0, 0, 0.1)"
              : "none",
            borderRadius: isActive("jugadores") ? "10px" : "0px",
            transition: "all 0.3s ease",
          }}
        >
          <Image
            src={jugadoresPlayers}
            width={20}
            height={20}
            alt="Jugadores"
            className="w-5 h-5 mb-2"
            style={{
              filter: isActive("jugadores") ? "brightness(0) invert(1)" : "none",
            }}
          />
          <span
            className={`text-[10px] ${
              isActive("jugadores") ? "text-white" : "text-white opacity-30"
            }`}
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
            boxShadow: isActive("divisiones")
              ? "0 6px 12px rgba(0, 0, 0, 0.2), 0 8px 20px rgba(0, 0, 0, 0.15), 0 12px 25px rgba(0, 0, 0, 0.1)"
              : "none",
            borderRadius: isActive("divisiones") ? "10px" : "0px",
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
            className={`text-[10px] ${
              isActive("divisiones") ? "text-white" : "text-white opacity-30"
            }`}
          >
            Divisiones
          </span>
        </button>

        {/* Predicciones */}
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 group"
          onClick={() => handleIconClick("prediccionesPerfil")}
          style={{
            backgroundColor: isActive("prediccionesPerfil") ? "#317EF4" : "transparent",
            transform: isActive("prediccionesPerfil") ? "scale(1.1)" : "scale(1)",
            boxShadow: isActive("prediccionesPerfil")
              ? "0 6px 12px rgba(0, 0, 0, 0.2), 0 8px 20px rgba(0, 0, 0, 0.15), 0 12px 25px rgba(0, 0, 0, 0.1)"
              : "none",
            borderRadius: isActive("prediccionesPerfil") ? "10px" : "0px",
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
              filter: isActive("prediccionesPerfil") ? "brightness(0) invert(1)" : "none",
            }}
          />
          <span
            className={`text-[10px] ${
              isActive("prediccionesPerfil") ? "text-white" : "text-white opacity-30"
            }`}
          >
            Predicciones
          </span>
        </button>
      </div>
    </div>
  );
};

export default MenuInferior;
