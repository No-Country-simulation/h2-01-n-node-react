"use client";
import React, {useState} from 'react'
import ScoutPlayers from '../../assets/Vector-2.png'
import ScoutPlayersClicked from '../../assets/Vector-21.png'
import Partidos from '../../assets/Vector-1.png'
import PartidosClicked from '../../assets/Vector12.png'
import Divisiones from '../../assets/Vector1.png'
import DivisionesClicked from '../../assets/Vector.png'
import Image from 'next/image'


//Dependiendo la pantalla cambiar el icono que esta activo.
const MenuInferior = () => {
  const [iconState, setIconState] = useState({
    scout: ScoutPlayers,
    partidos: Partidos,
    divisiones: Divisiones,
    activo:ScoutPlayersClicked
  });

 

  const handleIconClick=(icon:string)=>{
    switch(icon){
      case 'scout':
        setIconState({
          ...iconState,
          scout: ScoutPlayersClicked
        });
        break;
      case 'partidos':
        setIconState({
          ...iconState,
          partidos:PartidosClicked
        });
        break;
      case 'divisiones':
        setIconState({
          ...iconState,
          divisiones:DivisionesClicked
        });
        break;
      default:
        break;
    }
  }
  
  return (
<div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-custom-blue border-t border-white-200 dark:bg-custom-blue dark:border-white-600 rounded-t-lg">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-custom-blue dark:hover:bg-white-800 group"
          onClick={() => handleIconClick('scout')}
        >
          <Image src={iconState.scout} width={20} height={20} alt="ScoutPlayers" className="w-5 h-5 mb-2" />
          <span className="text-sm text-white-500 dark:text-white-400 group-hover:text-white-600 dark:group-hover:text-white-500">Scout Players</span>
        </button>
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-custom-blue dark:hover:bg-white-800 group"
          onClick={() => handleIconClick('partidos')}
        >
          <Image src={iconState.partidos} width={20} height={20} alt="Partidos" className="w-5 h-5 mb-2" />
          <span className="text-sm text-white-500 dark:text-white-400 group-hover:text-white-600 dark:group-hover:text-white-500">Partidos</span>
        </button>
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-custom-blue dark:hover:bg-white-800 group"
          onClick={() => handleIconClick('divisiones')}
        >
          <Image src={iconState.divisiones} width={20} height={20} alt="Divisiones" className="w-5 h-5 mb-2" />
          <span className="text-sm text-white-500 dark:text-white-400 group-hover:text-white-600 dark:group-hover:text-white-500">Divisiones</span>
        </button>
      </div>
    </div>

  )
}

export default MenuInferior
