"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LogoWaki from "../../assets/waki-logo.png";
import './splashScreen.css';

const SplashScreen = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/auth');
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="splash-container">
            <Image 
                priority={true}
                src={LogoWaki} 
                alt="Logo Waki" 
                className="logo-image"
            />
        </div>
    );
}

export default SplashScreen;
