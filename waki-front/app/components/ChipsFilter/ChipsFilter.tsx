import React from 'react'
import logoLE from '@/app/assets/ligas/logo-le.png'
import logoPL from '@/app/assets/ligas/logoPL.png'
import logoA from '@/app/assets/ligas/ligaA.png'
import campUY from '@/app/assets/ligas/campUY.png'
import Image from "next/image";

import './chipsfilter.css'


export default function ChipsFilter() {
  return (
    <div className='container-chips'>
      <div className="chip">
      <Image
        priority={true}
        alt="Imagen de VS"
        className="vsImage"
        src={logoLE}
        />
      <span className="chip-text">La Liga</span>
    </div>
    <div className="chip">
      <Image
        priority={true}
        alt="Imagen de VS"
        className="vsImage"
        src={logoPL}
        />
      <span className="chip-text">Premiere League</span>
    </div>
    <div className="chip">
      <Image
        priority={true}
        alt="Imagen de VS"
        className="vsImage"
        src={logoA}
        />
      <span className="chip-text">Serie A</span>
    </div>
    <div className="chip">
      <Image
        priority={true}
        alt="Imagen de VS"
        className="vsImage"
        src={campUY}
        />
      <span className="chip-text">Campeonato uruguayo</span>
    </div>
    </div>
  )
}
