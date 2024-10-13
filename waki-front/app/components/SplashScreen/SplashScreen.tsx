"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import StadiumImg from "../../assets/stadium.png";
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
        <div className="relative h-screen w-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
    
            <div className="relative z-10 flex h-full w-100 flex-col items-center justify-start">
                <h1 className="title-waki">WAKI</h1>
                <Image
                    src={StadiumImg}
                    alt="Stadium image"
                    width={600}
                    height={100} 
                    className="mt-auto"
                />
            </div>
        </div>
    );
}

export default SplashScreen;
