"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import ArticleActions from './article-actions'

interface GovtNGOCardProps {
  id: number
  title: string
  description: string
  type: 'government' | 'ngo'
  pdfUrl: string
  contactEmail: string
  imageUrl?: string
  audioUrl?: string
  youtubeUrl?: string
  likes: number
  isPopular?: boolean
}

export default function GovtNGOCard({
  id,
  title,
  description,
  type,
  pdfUrl,
  contactEmail,
  imageUrl,
  audioUrl,
  youtubeUrl,
  likes,
  isPopular = false,
}: GovtNGOCardProps) {
  const [isCardHovered, setIsCardHovered] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioInstance) {
        audioInstance.pause()
        audioInstance.src = ''
        setAudioInstance(null)
      }
    }
  }, [audioInstance])

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank')
    }
  }

  const handleAudioToggle = () => {
    if (!audioInstance && audioUrl) {
      const newAudio = new Audio(audioUrl)
      setAudioInstance(newAudio)
      newAudio.play().catch(error => console.error("Error playing audio:", error));
      setIsPlayingAudio(true)
      newAudio.onended = () => setIsPlayingAudio(false);
      newAudio.onerror = (err) => {
        console.error("Audio playback error:", err);
        setIsPlayingAudio(false);
        setAudioInstance(null);
      };
    } else if (audioInstance) {
      if (isPlayingAudio) {
        audioInstance.pause()
        setIsPlayingAudio(false)
      } else {
        audioInstance.play().catch(error => console.error("Error playing audio:", error));
        setIsPlayingAudio(true)
      }
    }
  }

  const handleYoutubeClick = () => {
    if (youtubeUrl) {
      window.open(youtubeUrl, '_blank')
    }
  }

  const cardBaseStyle = `
    relative
    rounded-xl
    transition-all duration-300 ease-in-out
    bg-card text-card-foreground
    border border-border
    flex flex-col h-full
    overflow-hidden
    shadow-sm hover:shadow-md
  `
  const cardHoverStyle = `
    transform scale-[1.01]
    shadow-md
    ring-1 ring-primary/50
  `
  const popularRingStyle = `
    ring-2 ring-offset-1 ring-offset-card ring-primary
  `

  return (
    <div
      className={`${cardBaseStyle} ${isCardHovered ? cardHoverStyle : 'shadow-lg'} ${isPopular ? popularRingStyle : ''} group`}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      role="article"
      aria-labelledby={`card-title-${id}`}
    >
      {isPopular && (
        <div
          className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm z-10"
        >
          POPULAR
        </div>
      )}

      <div className={`p-5 sm:p-6 flex-grow flex flex-col min-h-0`}>
        <span
          className={`inline-block self-start px-3 py-1 text-xs font-semibold rounded-full mb-3
          ${type === 'government'
            ? 'bg-primary/10 text-primary'
            : 'bg-secondary/80 text-secondary-foreground'
          }`}
        >
          {type === 'government' ? 'Government Scheme' : 'NGO Initiative'}
        </span>

        <h3 id={`card-title-${id}`} className="text-lg md:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          {imageUrl && (
            <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-sm border-2 border-card">
              <Image
                src={imageUrl}
                alt={`Image for ${title}`}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-110"
              />
              {/* The small "POP" badge on the image has been removed from here */}
            </div>
          )}
          <p className={`text-sm leading-relaxed text-muted-foreground ${imageUrl ? 'line-clamp-4 sm:line-clamp-5' : 'line-clamp-5 sm:line-clamp-6'} flex-grow`}>
            {description}
          </p>
        </div>
      </div>

      <div className="mt-auto px-5 sm:px-6 py-3 sm:py-4 border-t border-border/80">
        <ArticleActions
          id={id}
          title={title}
          likes={likes}
          contactEmail={contactEmail}
          pdfUrl={pdfUrl}
          audioUrl={audioUrl}
          youtubeUrl={youtubeUrl}
          onDownloadPDF={handleDownloadPDF}
          onAudioToggle={handleAudioToggle}
          onYoutubeClick={handleYoutubeClick}
          isPlayingAudio={isPlayingAudio}
        />
      </div>
    </div>
  )
}