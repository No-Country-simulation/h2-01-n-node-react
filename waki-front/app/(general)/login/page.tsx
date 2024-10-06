"use client";

import Header from "../../components/Navbar/Navbar";

export default function Login() {
  const tabs = [
    { id: "InicioSesion", label: "Iniciar Sesion" },
    { id: "Registrate", label: "Registrate" },
  ];

  const handleTabChange = () => {};

  return (
    <div>
      <Header tabs={tabs} onTabChange={handleTabChange} />
    </div>
  );
}
