"use client"

import React from 'react'
import Avatar from '@/app/assets/avatar/people1.jpeg'
import IconBall from '@/app/assets/icon-ball.png'
import Notification from '@/app/assets/notification.png'
import Image from "next/image";
import './topview.css';


export default function TopView() {
  return (
    <div>
        <div className="component-imagen">
        <Image
        priority={true}
        alt="Imagen de Perfil"
        className="avatarImg"
        src={Avatar}
        width={50}
        height={50}
        />
        <div className='welcome-user'>¡Hola, Diego! </div>
        <div className='icon-ball-container'>
        <Image
        priority={true}
        alt="Imagen de Perfil"
        className="icon-ball"
        src={IconBall}
        width={35}
        height={35}
        />
          <div className='counter-container'>
            <h1 className='counter-life'>5</h1>
          </div>
          <button className='buy-button'>+</button>
        </div>
        <Image
        priority={true}
        alt="Iocno de notificaciones"
        className="notification-icon"
        src={Notification}
        />
      </div>
    </div>
  )
}