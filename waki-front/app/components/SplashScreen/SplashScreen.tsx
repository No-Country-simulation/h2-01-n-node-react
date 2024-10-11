"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import StadiumImg from "../../assets/stadium.png";
import './splashScreen.css';

const SplashScreen = () => {
    const router = useRouter();
/*
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/auth');
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);*/

    return (
        <div className="relative h-screen w-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
    
      <div className="absolute inset-0 z-0">
        <Image
          src={StadiumImg}
          alt="Fondo difuminado"
          layout="fill"
          objectFit="cover"
          className="opacity-30 blur-sm"
        />
      </div>
      

      <div className="relative z-10 flex h-full flex-col items-center justify-start pt-16">
        <h1 className="title-waki">WAKI</h1>
      </div>
    </div>
    );
}

export default SplashScreen;
