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
    bg-gradient-to-br from-white via-purple-50/40 to-purple-100/20 dark:from-slate-800 dark:to-slate-900
    border border-gray-200 dark:border-slate-700
    flex flex-col h-full
    overflow-hidden
  `
  const cardHoverStyle = `
    transform scale-[1.02]
    shadow-xl
    border-purple-300 dark:border-purple-600
  `
  const popularRingStyle = `
    ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-800 ring-purple-500
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
          className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md z-10"
        >
          POPULAR
        </div>
      )}

      <div className={`p-5 sm:p-6 flex-grow flex flex-col min-h-0`}>
        <span
          className={`inline-block self-start px-3 py-1 text-xs font-semibold rounded-full mb-3
          ${type === 'government'
            ? 'bg-purple-100 text-purple-700 dark:bg-purple-800/40 dark:text-purple-300'
            : 'bg-teal-100 text-teal-700 dark:bg-teal-800/40 dark:text-teal-300'
          }`}
        >
          {type === 'government' ? 'Government Scheme' : 'NGO Initiative'}
        </span>

        <h3 id={`card-title-${id}`} className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
          {title}
        </h3>

        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          {imageUrl && (
            <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-lg border-2 border-white dark:border-slate-600">
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
          <p className={`text-sm leading-relaxed text-gray-600 dark:text-gray-400 ${imageUrl ? 'line-clamp-4 sm:line-clamp-5' : 'line-clamp-5 sm:line-clamp-6'} flex-grow`}>
            {description}
          </p>
        </div>
      </div>

      <div className="mt-auto px-5 sm:px-6 py-3 sm:py-4 border-t border-gray-200/80 dark:border-slate-700/70">
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