"use client";

import React, { useEffect, useState } from "react";
import DefaultAvatar from "@/app/assets/avatar/people1.jpeg";
import Notification from "@/app/assets/notification.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./topview.css";
import Cookies from "js-cookie";

export default function TopView() {
  const [userProfile, setUserProfile] = useState<{
    username: string;
    profileImage?: string | null;
  }>({
    username: "Usuario",
    profileImage: null,
  });

  const router = useRouter();

  const fetchUserProfile = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("Token no disponible");
      return;
    }

    try {
      const response = await fetch(
        "https://waki.onrender.com/api/users/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Acceder a la propiedad `user` en el objeto principal
        setUserProfile({
          username: data.user.username,
          profileImage: data.user.profileImage || null,
        });
      } else {
        console.error("Error al obtener perfil:", await response.json());
      }
    } catch (error) {
      console.error("Error en la solicitud de perfil:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleUsernameClick = () => {
    router.push("/profile");
  };

  return (
    <>
      <div className="component-imagen">
        <Image
          priority={true}
          alt="Imagen de Perfil"
          className="avatarImg"
          src={userProfile.profileImage || DefaultAvatar}
          width={50}
          height={50}
        />
        <div
          className="welcome-user"
          onClick={handleUsernameClick}
          style={{ cursor: "pointer" }}
        >
          {userProfile.username}
        </div>
      <div className="notification-icon">
        <Image
          priority={true}
          alt="Imagen de Perfil"
          src={Notification}
          width={20}
          height={20}
        />
      </div>
      </div>
    </>
  );
}
