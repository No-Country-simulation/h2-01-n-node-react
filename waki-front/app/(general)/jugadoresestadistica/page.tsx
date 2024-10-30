"use client"
import { useState } from "react";
import Image from "next/image";
import Jugador from '@/app/assets/jugador.png'
import CardRed from '@/app/assets/cardred.png'
import CardYellow from '@/app/assets/cardyellow.png' 
import BanderaPais from '@/app/assets/argentina.png'
import escudoClub from '@/app/assets/escudos/fc-barcelona.svg'
import MenuInferior from "@/app/components/MenuInferior/MenuInferior";
import './jugadoresestadistica.css'
import TopView from "@/app/components/TopView/TopView";
import Header from "../../components/Navbar/Navbar";
import BotomChat from '@/app/components/BotomChat/BotomChat'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Square, AlertTriangle } from "lucide-react"



export default function page() {

    const [activeTab, setActiveTab] = useState("Detalles");

  const tabs = [
    { id: "Detalles", label: "Detalles" },
    { id: "Tokens", label: "Tokens" },
   
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const accumulatedData = [
    {year: 2010, value:11000},
    {year:2011, value:13000},
    {year:2012, value:15000},
    {year:2013, value:18000},
    {year:2014, value:20000},
    {year:2015, value:21000},
    {year:2016, value: 21500},
    {year:2017, value:24000},
    { year: 2018, value: 25000 },
    { year: 2019, value: 50000 },
    { year: 2020, value: 75000 },
    { year: 2021, value: 100000 },
    { year: 2022, value: 125000 },
    { year: 2023, value: 150000 },
  ]
  
  const annualData = [
    {year: 2010, value:100},
    {year:2011, value:1000},
    {year:2012, value:1500},
    {year:2013, value:2000},
    {year:2014, value:2400},
    {year:2015, value:5000},
    {year:2016, value: 3000},
    {year:2017, value:4000},
    { year: 2018, value: 10000 },
    { year: 2019, value: 8000 },
    { year: 2020, value: 4000 },
    { year: 2021, value: 2000 },
    { year: 2022, value: 6000 },
    { year: 2023, value: 2000 },
  ]
  
  const comparisonData = [
    { year: 2010, released: 100, burned: 20 },
    { year: 2011, released: 1000, burned: 3000 },
    { year: 2012, released: 1500, burned: 4000 },
    { year: 2013, released: 2000, burned: 5000 },
    { year: 2014, released: 4000, burned: 6000 },
    { year: 2015, released: 5000, burned: 7000 },
    { year: 2016, released: 3000, burned: 6000 },
    { year: 2017, released: 4000, burned: 7000 },
    { year: 2018, released: 10000, burned: 2000 },
    { year: 2019, released: 8000, burned: 3000 },
    { year: 2020, released: 4000, burned: 4000 },
    { year: 2021, released: 2000, burned: 5000 },
    { year: 2022, released: 6000, burned: 6000 },
    { year: 2023, released: 2000, burned: 7000 },
  ]

  return (
    <>
    <div>
        <TopView />
        <div className="jugadorPerfil">
        <div className="InfoGeneral">
            <h1 className="nombreJugador">Nombre del Jugador</h1>
            
            <div className="containerInfo">
            <p className="tituloInfo">Edad</p>
            <p className="info">37</p>
            <p className="tituloInfo">Posición</p>
            <p className="info">Delantero</p>
            </div>
            
        </div>

            <div className="containerJugador">
            <Image
          priority={true}
          alt="Imagen del jugador"
          className="jugadorImg"
          src={Jugador}
        />
            </div>

        <div className="banderaEscudo">
        
        <Image
          priority={true}
          alt="Bandera del pais"
          className="escudoClub"
          src={escudoClub}
        />
        <Image
          priority={true}
          alt="Bandera del pais"
          className="banderapais"
          src={BanderaPais}
        />
        </div>

        </div>
        <Header tabs={tabs} onTabChange={handleTabChange} activeTab={activeTab} />
        {activeTab === "Detalles" && (
          <div>
            <h2 className="text-xs font-bold mb-4">Estadisticas</h2>
            {/* Pantalla Detalles */}
            <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
            <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-gray-500">Goles</div>
              <div className="text-2xl font-bold mt-1">672</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-gray-500">Partidos</div>
              <div className="text-2xl font-bold mt-1">779</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-gray-500">Minutos</div>
              <div className="text-2xl font-bold mt-1">779</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-gray-500">Asistencia</div>
              <div className="text-2xl font-bold mt-1">779</div>
            </CardContent>
          </Card>
          </div>
          

          {/*ARREGLAR ESTO ver DIVS*/}

        <div className="CardContainer">

          <div className="cardInfoY" id="cardInfoY">
              <Image
                priority={true}
                alt="Bandera del pais"
                className="CardIcon"
                src={CardYellow}
            />       
              <span className="font-medium">Tarjetas amarillas</span> 
            <span className="font-semibold">12</span>
          </div>

          <div className="cardInfoR">     
              <Image
                priority={true}
                alt="Bandera del pais"
                className="CardIcon"
                src={CardRed}
                />           
              <span className="font-medium">Tarjetas rojas</span>
            <span className="font-semibold">12</span>
          </div>
          
    </div>
    <div>
    <h2 className="subtitle">Logros</h2>
    <Card className="cardLogros">
        <CardContent className=" text-center">
            <div className="text-sm text-gray-500">Balon de Oro</div>
            <div className="text-2xl font-bold mt-1">2019</div>
        </CardContent>
        </Card>
        <Card>
        <CardContent className="text-center">
            <div className="text-sm text-gray-500">Citacion a seleccion nacional</div>
            <div className="text-2xl font-bold mt-1">2019</div>
        </CardContent>
        </Card>
        <Card>
        <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-500">Citacion a seleccion nacional</div>
            <div className="text-2xl font-bold mt-1">2019</div>
        </CardContent>
        </Card>
        <Card>
        <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-500">Citacion a seleccion nacional</div>
            <div className="text-2xl font-bold mt-1">2019</div>
        </CardContent>
        </Card>
        <Card>
        <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-500">Copa America</div>
            <div className="text-2xl font-bold mt-1">2019</div>
        </CardContent>
        </Card>

    </div>
    </div>
    
     

        )}
        {activeTab === "Tokens" && (
          <div>
            
            {/* Pantalla Tokens */}
            <Card>
        <CardHeader>
          <CardTitle>Liberación Acumulada del Token Anual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accumulatedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  dot={{ fill: "#8884d8" }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liberación de Tokens Anual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={annualData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  dot={{ fill: "#8884d8" }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tokens Liberados vs. Quemados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="released" name="Token liberados" fill="#8884d8" />
                <Bar dataKey="burned" name="Token quemados" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="container-footer">
        
      </div>


          </div>
        )}
    </div>
    <BotomChat/>
    <MenuInferior />
    </>
  )
}
