"use client"
import React, { useEffect, useState } from 'react'
import './botomchat.css'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { MessageCircleIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { IoChatbubbleOutline } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { IoChatbubblesOutline } from "react-icons/io5";




export default function BotomChat() {

    const pathname = usePathname()
    const router = useRouter()
    const [activeIcon, setActiveIcon] = useState<string>("faqbot")

  const handleIconClick = (icon: string) => {
    if (icon === "faqbot") {
      
      router.push('/faqbot') 
    }
    setActiveIcon(icon)
  }
  return (
    <div>
    <div className="fixed bottom-6 right-6">
    <button
  className="bg-black rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center"
  onClick={() => handleIconClick("faqbot")} id='btmColor'
>
  <IoChatbubblesOutline className='w-8 h-8 text-white' />
  <span className="sr-only">Ir al chat FAQ</span>
</button>
    </div>

    </div>

  )
}
