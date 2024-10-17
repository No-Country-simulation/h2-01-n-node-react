"use client";

import { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import Header from "@/app/components/Navbar/Navbar";
import Collapse from "@/app/components/Collapse/CollapseItem";
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
    { id: "Hoy", label: `Hoy` },
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
          <FormControl
            variant="outlined"
            size="small"
            sx={{ minWidth: 120 }}
            className="mr-4" 
          >
            <InputLabel id="filter-label" sx={{ fontWeight: "bold" }}>
              Ordenar por
            </InputLabel>
            <Select
              labelId="filter-label"
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              label="Ordenar por"
              autoWidth
              sx={{
                fontFamily: "Poppins",
                borderRadius: "20px",
                fontSize: "12px",
                "& .MuiSelect-select": {
                  borderRadius: "20px",
                  padding: "8px",
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
              <MenuItem
                style={{ fontFamily: "Poppins", fontSize: "12px" }}
                value="ligas"
              >
                Ligas
              </MenuItem>
              <MenuItem
                style={{ fontFamily: "Poppins", fontSize: "12px" }}
                value="tendencias"
              >
                Tendencias
              </MenuItem>
              <MenuItem
                style={{ fontFamily: "Poppins", fontSize: "12px" }}
                value="partidos"
              >
                Partidos
              </MenuItem>
              <MenuItem
                style={{ fontFamily: "Poppins", fontSize: "12px" }}
                value="horarios"
              >
                Horarios
              </MenuItem>
            </Select>
          </FormControl>
        </div>

        <button className="bg-[#8E2BFF] text-white px-4 py-2 rounded-[8px] text-sm">
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
