"use client"
import React from 'react'
import './notificaciones.css'
import Flecha from '@/app/assets/flecha.png'
import AjusteIcon from '@/app/assets/ajusteIcon.svg'
import Image from "next/image";

export default function page() {
  return (
    <div>
      <div className='topview'>
      <Image
              src={Flecha}
              alt="Flecha hacia atras"
              className="flechaImg mr-5"
            />
        <h1 className='title-topview'>Notificaciones</h1>
        <Image
              src={AjusteIcon}
              alt="Icono de ajuste"
              className="ajusteIcon"
            />
      </div>

      <div className='container-new'>
        <h1 className='subtitle-container'>Nuevas</h1>

        
      </div>  

    </div>
  )
}
