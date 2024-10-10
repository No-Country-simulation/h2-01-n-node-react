"use client";

import { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import Header from "@/app/components/Navbar/Navbar";
import Collapse from "@/app/components/Collapse/Collapse";
import MenuInferior from "@/app/components/MenuInferior/MenuInferior";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import "./ligas.css";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Hoy");
  const [filter, setFilter] = useState("tendencias");

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;
  };

  const today = new Date();
  const yesterday = new Date(today);
  const tomorrow = new Date(today);

  yesterday.setDate(today.getDate() - 1);
  tomorrow.setDate(today.getDate() + 1);

  const tabs = [
    { id: "Ayer", label: `${formatDate(yesterday)}` },
    { id: "Hoy", label: `${formatDate(today)}` },
    { id: "Manana", label: `${formatDate(tomorrow)}` },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string);
  };

  return (
    <>
      <h1 className="text-center text-[#317EF4] font-bold flex items-center mt-4 justify-center">
        <FiCalendar
          className="inline-block text-[#317EF4] mr-2 relative"
          style={{ top: "-1px" }}
        />
        Partidos
      </h1>
      <Header tabs={tabs} onTabChange={handleTabChange} />

      <div className="flex justify-between items-center mt-6 px-4">
        <div className="flex items-center space-x-2">
          <FormControl variant="outlined" size="small">
            <InputLabel id="filter-label" sx={{ fontWeight: "bold" }}>
              Ordenar por
            </InputLabel>
            <Select
              labelId="filter-label"
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              label="Ordenar por"
              sx={{
                fontFamily: "Poppins",
                borderRadius: "20px",
                "& .MuiSelect-select": {
                  borderRadius: "20px",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    fontFamily: "Poppins",
                    borderRadius: "4px",
                  },
                },
              }}
            >
              <MenuItem style={{ fontFamily: "Poppins" }} value="tendencias">
                Tendencias
              </MenuItem>
              <MenuItem style={{ fontFamily: "Poppins" }} value="partidos">
                Partidos
              </MenuItem>
            </Select>
          </FormControl>
        </div>

        <button className="bg-[#8E2BFF] text-white px-6 py-2 rounded-[8px]">
          Mis predicciones
        </button>
      </div>

      <div
        className="flex h-screen items-center justify-center"
        style={{ marginTop: "-160px" }} 
      >
        {activeTab === "Hoy" && <Collapse />}
        {activeTab === "Ayer" && (
          <h1 className="text-6xl text-white font-bold">Contenido de Ayer</h1>
        )}
        {activeTab === "Manana" && (
          <h1 className="text-6xl text-white font-bold">Contenido de Mañana</h1>
        )}
      </div>

      <MenuInferior />
    </>
  );
}
