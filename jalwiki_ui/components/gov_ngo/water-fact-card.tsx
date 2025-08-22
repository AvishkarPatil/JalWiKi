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
        bg-card text-card-foreground
        shadow-sm
        overflow-hidden
        transition-all duration-300 ease-in-out
        p-6
        group
        m-1
        ${isHovered
          ? 'scale-[1.02] shadow-md ring-2 ring-primary/50'
          : 'ring-1 ring-border'}
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
        text-primary/20
        opacity-30 group-hover:opacity-40
        pointer-events-none
        z-0
      ">
         <DropletIcon className="w-20 h-20 md:w-28 md:h-28" />
      </div>

      <div className="relative z-10 flex items-start">
        <div className="flex-shrink-0 mr-3 mt-[2px]">
           <InformationCircleIcon className="h-5 w-5 text-primary" />
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">
          {fact}
        </p>
      </div>
    </div>
  )
}