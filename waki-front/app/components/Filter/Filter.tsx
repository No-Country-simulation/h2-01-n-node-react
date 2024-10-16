"use client";

import { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import './Filter.css'

export default function Filter() {
    const [filter, setFilter] = useState("tendencias");
    
    const handleFilterChange = (event: SelectChangeEvent) => {
        setFilter(event.target.value as string);
      };
    return (
    <div className="flex justify-between items-center mt-8 px-4">
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
            fontFamily: '"Poppins", sans-serif',
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
                fontFamily: '"Poppins", sans-serif',
                borderRadius: "4px",
              },
            },
          }}
        >
          <MenuItem
            style={{ fontFamily: '"Poppins", sans-serif', fontSize: "12px" }}
            value="ligas"
          >
            Ligas
          </MenuItem>
          <MenuItem
            style={{ fontFamily: '"Poppins", sans-serif', fontSize: "12px" }}
            value="tendencias"
          >
            Tendencias
          </MenuItem>
          <MenuItem
            style={{ fontFamily: '"Poppins", sans-serif', fontSize: "12px" }}
            value="partidos"
          >
            Partidos
          </MenuItem>
          <MenuItem
            style={{ fontFamily: '"Poppins", sans-serif', fontSize: "12px" }}
            value="horarios"
          >
            Horarios
          </MenuItem>
        </Select>
      </FormControl>
    </div>

  </div>
  );
}
