import MenuInferior from '@/app/components/MenuInferior/MenuInferior'
import SplashScreen from '@/app/components/SplashScreen/SplashScreen'
import TopView from '@/app/components/TopView/TopView'
import Carrusel from '@/app/components/Carrusel/Carrusel'
import './partidos.css'
import React from 'react'

export default function page() {
  return (
    <div className='container-partido'>
      {/*<MenuInferior/>*/}
      {/*<SplashScreen/>*/}
      <TopView/>
      <h1 className='title'>¡No te pierdas tus favoritos!</h1>
      <Carrusel/>
    </div>
  )
}
