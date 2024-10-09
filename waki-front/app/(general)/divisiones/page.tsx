"use client";
import {useState} from "react";
import Image from "next/image";
import MenuInferior from "@/app/components/MenuInferior/MenuInferior";
import './divisiones.css'

const divisiones=()=>{
    return(
        <div>
            <div className="flex flex-col" id="table-divisiones">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light text-gray-900">
              <thead
                className="border-b bg-white font-medium dark:border-white-500 dark:bg-white-600">
                <tr>
                  <th scope="col" className="px-6 py-4">#</th>
                  <th scope="col" className="px-6 py-4">Nombre de Usuario</th>
                  <th scope="col" className="px-6 py-4">Puntos</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  className="border-b bg-white-100 dark:border-white-500 dark:bg-white-700">
                  <td className="whitespace-nowrap px-6 py-4 font-medium">1</td>
                  <td className="whitespace-nowrap px-6 py-4">Mark</td>
                  <td className="whitespace-nowrap px-6 py-4">50</td>
                </tr>
                <tr
                  className="border-b bg-white dark:border-white-500 dark:bg-white-600">
                  <td className="whitespace-nowrap px-6 py-4 font-medium">2</td>
                  <td className="whitespace-nowrap px-6 py-4">Jacob</td>
                  <td className="whitespace-nowrap px-6 py-4">20</td>
                </tr>
                <tr
                  className="border-b bg-white dark:border-white-500 dark:bg-white-600">
                  <td className="whitespace-nowrap px-6 py-4 font-medium">2</td>
                  <td className="whitespace-nowrap px-6 py-4">Jacob</td>
                  <td className="whitespace-nowrap px-6 py-4">10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
            <MenuInferior/>
        </div>
    )
}

export default divisiones