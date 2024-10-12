"use client"
import React, { useState, useRef, useEffect } from 'react'
import './carrusel.css'
import vsImage from '@/app/assets/VS.png'
import Image from "next/image";
/*import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
*/
type Match={
    date:string,
    time:string,
    localTeam:string,
    visitTeam:string,
    localTeamLogo:string,
    visitTeamLogo:string,
    timeClose:string,
}

const matches: Match[]=[
    {
        date:'29 Sep',
        time:'5:00 PM',
        localTeam:'Osasuna',
        visitTeam:'Barcelona',
        localTeamLogo:'',
        visitTeamLogo:'./assets/escudos/fc-barcelona.svg',
        timeClose:'49:30',
    },
    {
        date:'30 Sep',
        time:'1:30 PM',
        localTeam:'Real Madrid',
        visitTeam:'Barcelona',
        localTeamLogo:'',
        visitTeamLogo:'',
        timeClose:'60:20',
    },
    {
        date:'1 OCT',
        time:'5:00 PM',
        localTeam:'Betis',
        visitTeam:'Valencia',
        localTeamLogo:'',
        visitTeamLogo:'',
        timeClose:'90:00',
    },
]

export default function Carrusel() {
    
    return (
        <div id="container-carrusel">
            <div className="carousel">
                <div className="carousel-content">
                    {matches.map((match, index) => (
                        <div key={index} className="carousel-item">
                            <div className="card-content">
                                <div id="topview-card">
                                    <div className="match-date-time">
                                        <span>{match.date}</span>
                                        <span>{match.time}</span>
                                    </div>
                                </div>
                                <div className="match-info">
                                    <div className="team-info">
                                        <img src={match.localTeamLogo} alt={match.localTeam} className="team-logo" />
                                        <span className="team-name">{match.localTeam}</span>
                                    </div>
                                    <Image
                                        priority={true}
                                        alt="Imagen de VS"
                                        className="vsImage"
                                        src={vsImage}
                                    />
                                    <div className="team-info">
                                        <img src={match.visitTeamLogo} alt={match.visitTeam} className="team-logo" />
                                        <span className="team-name">{match.visitTeam}</span>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    
}
