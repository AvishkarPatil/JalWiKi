"use client"

import { useState } from 'react'
import { DropletIcon } from 'lucide-react';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

interface WaterFactCardProps {
  fact: string
}

export default function WaterFactCard({ fact }: WaterFactCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`
        relative
        rounded-lg
        bg-white dark:bg-slate-800
        shadow-lg
        overflow-hidden
        transition-all duration-300 ease-in-out
        py-5 sm:py-6 px-6 sm:px-7
        group
        ml-[5px] mt-[5px] mb-[8px] mr-[10px]
        ${isHovered
          ? 'scale-[1.02] shadow-xl ring-2 ring-purple-500 dark:ring-purple-600'
          : 'ring-1 ring-gray-200 dark:ring-slate-700'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`Water fact: ${fact}`}
    >
      <div className="
        absolute
        bottom-0 right-0
        transform translate-x-1/4 translate-y-1/4
        group-hover:translate-x-[30%] group-hover:translate-y-[30%]
        transition-transform duration-300 ease-in-out
        text-purple-100 dark:text-purple-800/70
        opacity-30 group-hover:opacity-40
        pointer-events-none
        z-0
      ">
         <DropletIcon className="w-20 h-20 md:w-28 md:h-28" />
      </div>

      <div className="relative z-10 flex items-start">
        <div className="flex-shrink-0 mr-3 mt-[2px]">
           <InformationCircleIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {fact}
        </p>
      </div>
    </div>
  )
}