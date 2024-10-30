import React, { useEffect, useState } from 'react';
import Image from "next/image";
import './chipsfilter.css';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';

interface Country {
  name: string;
  code: string;
  flag: string;
}

interface League {
  id: number;
  name: string;
  type: string;
  logo: string;
  country: Country;
}

export default function ChipsFilter() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLeagues = async () => {
      const token = Cookies.get("authToken");

      if (!token) {
        router.push("/auth");
      } else {
        try {
          const response = await fetch('https://waki.onrender.com/api/leagues', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setLeagues(data.leagues); 
          } else {
            console.error('Error al obtener las ligas');
          }
        } catch (error) {
          console.error('Error en la solicitud', error);
        }
      }
    };

    fetchLeagues();
  }, [router]);

  return (
    <div className='container-chips'>
      {leagues.map((league) => (
        <div className="chip" key={league.id}>
          <Image
            priority={true}
            alt={`Logo de ${league.name}`}
            className="logoLigas"
            src={league.logo}
            width={50}
            height={50}
          />
          <span className="chip-text">{league.name}</span>
        </div>
      ))}
    </div>
  );
}
