"use client";
import React from 'react'
import './splashScreen.css'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SplashScreen = () => {
    const router = useRouter();

    useEffect(()=>{
        const timer =setTimeout(()=>{
            router.push('/inicio-temp')
        }, 3000)
        return () => clearTimeout(timer);
    }, [router])

  return (
    <div className='component-splash'>
      <h1 className='title-waki'>WAKI</h1>
    </div>
  )
}

export default SplashScreen