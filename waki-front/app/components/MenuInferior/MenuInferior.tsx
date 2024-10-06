"use client";
import React from 'react'
import ScoutPlayers from '../../assets/Vector-2.png'
import Partidos from '../../assets/Vector-1.png'
import Divisiones from '../../assets/Vector.png'
import Image from 'next/image'


const MenuInferior = () => {
  
  return (
<div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-custom-blue border-t border-white-200 dark:bg-custom-blue dark:border-white-600">
  <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
    <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-custom-blue dark:hover:bg-white-800 group">
      <Image src={ScoutPlayers} width={20} height={20} alt="ScoutPlayers" className="w-5 h-5 mb-2 text-white-500 dark:text-white-400 group-hover:text-white-600 dark:group-hover:text-white-500" />
      <span className="text-sm text-white-500 dark:text-white-400 group-hover:text-white-600 dark:group-hover:text-white-500">Scout Players</span>
    </button>
    <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-custom-blue dark:hover:bg-white-800 group">
      <Image src={Partidos} width={20} height={20} alt="ScoutPlayers" className="w-5 h-5 mb-2 text-white-500 dark:text-white-400 group-hover:text-white-600 dark:group-hover:text-white-500" />
      <span className="text-sm text-white-500 dark:text-white-400 group-hover:text-white-600 dark:group-hover:text-white-500">Partidos</span>
    </button>
    <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-custom-blue dark:hover:bg-white-800 group">
      <Image src={Divisiones} width={20} height={20} alt="ScoutPlayers" className="w-5 h-5 mb-2 text-white-500 dark:text-white-400 group-hover:text-white-600 dark:group-hover:text-white-500" />
      <span className="text-sm text-white-500 dark:text-white-400 group-hover:text-white-600 dark:group-hover:text-white-500">Divisiones</span>
    </button>
  </div>
</div>

  )
}

export default MenuInferior
