// E:/Project/miniProject/JalWiKi/jalwiki_ui/components/gov_ngo/article-actions.tsx
"use client"

import { useState, useEffect } from 'react'
import {
  HeartIcon as HeartOutlineIcon,
  BookmarkIcon as BookmarkOutlineIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
  EnvelopeIcon,      // Ensure this is imported
  ArrowDownTrayIcon, // Ensure this is imported
  SpeakerWaveIcon,   // Ensure this is imported
  PauseIcon,         // Ensure this is imported
  VideoCameraIcon    // Ensure this is imported
} from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/react/24/solid'

// THIS IS THE CRITICAL INTERFACE TO FIX/CREATE
interface ArticleActionsProps {
  id: number;
  title: string;
  likes: number;
  contactEmail: string;   // MUST be present
  pdfUrl: string;         // MUST be present
  audioUrl?: string;       // Optional, as it's optional in GovtNGOCardProps
  youtubeUrl?: string;     // Optional
  onDownloadPDF: () => void; // MUST be present
  onAudioToggle: () => void;   // MUST be present
  onYoutubeClick: () => void;  // MUST be present
  isPlayingAudio: boolean;     // MUST be present
}

export default function ArticleActions({
  id,
  title,
  likes,
  contactEmail,    // Destructure all props
  pdfUrl,
  audioUrl,
  youtubeUrl,
  onDownloadPDF,
  onAudioToggle,
  onYoutubeClick,
  isPlayingAudio
}: ArticleActionsProps) {
  const [currentLikes, setCurrentLikes] = useState(likes)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [animateLike, setAnimateLike] = useState(false)
  const [animateBookmark, setAnimateBookmark] = useState(false)

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    setCurrentLikes(prevLikes => newLikedState ? prevLikes + 1 : prevLikes - 1)
    setAnimateLike(true)
  }

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newBookmarkedState = !isBookmarked
    setIsBookmarked(newBookmarkedState)
    setAnimateBookmark(true)
  }

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({ title, text: `Check out: ${title}`, url: window.location.href })
        .catch((error) => console.error('Error sharing:', error));
    } else {
      alert(`Share this article: ${title}\n${window.location.href}`);
    }
  }

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (contactEmail) {
      window.location.href = `mailto:${contactEmail}`;
    }
  };

  useEffect(() => {
    if (animateLike) {
      const timer = setTimeout(() => setAnimateLike(false), 600);
      return () => clearTimeout(timer);
    }
  }, [animateLike]);

  useEffect(() => {
    if (animateBookmark) {
      const timer = setTimeout(() => setAnimateBookmark(false), 600);
      return () => clearTimeout(timer);
    }
  }, [animateBookmark]);

  const iconButtonBaseStyle = `
    flex items-center p-1.5 sm:p-2 rounded-full transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500 focus:ring-opacity-60
    dark:focus:ring-offset-slate-800
  `
  const iconButtonDefaultState = `
    text-gray-500 dark:text-gray-400
    hover:bg-gray-100 dark:hover:bg-slate-700
  `
  const audioActiveState = `
    bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600
  `

  return (
    <div className="flex items-center justify-between flex-wrap gap-x-1 gap-y-2">
      {/* Left Group: Like, Bookmark */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <button
          onClick={handleLikeClick}
          className={`${iconButtonBaseStyle} ${iconButtonDefaultState} ${
            isLiked
              ? 'text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500'
              : 'hover:text-red-500 dark:hover:text-red-400'
          }`}
          aria-pressed={isLiked}
          aria-label={isLiked ? "Unlike" : "Like"}
          title={isLiked ? "Unlike" : "Like"}
        >
          {isLiked ? <HeartSolidIcon className={`h-5 w-5 ${animateLike ? 'animate-heartbeat' : ''}`} /> : <HeartOutlineIcon className={`h-5 w-5 ${animateLike ? 'animate-heartbeat' : ''}`} />}
          <span className={`ml-1.5 text-xs font-medium tabular-nums ${isLiked ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
            {currentLikes}
          </span>
        </button>
        <button
          onClick={handleBookmarkClick}
          className={`${iconButtonBaseStyle} ${iconButtonDefaultState} ${
            isBookmarked
              ? 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-500'
              : 'hover:text-purple-600 dark:hover:text-purple-400'
          }`}
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
          title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
        >
          {isBookmarked ? <BookmarkSolidIcon className={`h-5 w-5 ${animateBookmark ? 'animate-pop' : ''}`} /> : <BookmarkOutlineIcon className={`h-5 w-5 ${animateBookmark ? 'animate-pop' : ''}`} />}
        </button>
      </div>

      {/* Right Group: Share, Contact, PDF, Audio, YouTube, More */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <button onClick={handleShareClick} className={`${iconButtonBaseStyle} ${iconButtonDefaultState} hover:text-blue-500 dark:hover:text-blue-400`} aria-label="Share" title="Share">
          <ShareIcon className="h-5 w-5" />
        </button>

        {/* Contact Button */}
        {contactEmail && (
          <button onClick={handleContactClick} className={`${iconButtonBaseStyle} ${iconButtonDefaultState} hover:text-green-500 dark:hover:text-green-400`} aria-label="Contact" title="Contact">
            <EnvelopeIcon className="h-5 w-5" />
          </button>
        )}

        {/* PDF Button */}
        {pdfUrl && onDownloadPDF && (
          <button onClick={(e) => { e.stopPropagation(); onDownloadPDF(); }} className={`${iconButtonBaseStyle} ${iconButtonDefaultState} hover:text-orange-500 dark:hover:text-orange-400`} aria-label="Download PDF" title="Download PDF">
            <ArrowDownTrayIcon className="h-5 w-5" />
          </button>
        )}

        {/* Audio Button */}
        {audioUrl && onAudioToggle && (
          <button onClick={(e) => { e.stopPropagation(); onAudioToggle(); }} className={`${iconButtonBaseStyle} ${isPlayingAudio ? audioActiveState : iconButtonDefaultState} ${!isPlayingAudio ? 'hover:text-indigo-500 dark:hover:text-indigo-400' : ''}`} aria-label={isPlayingAudio ? "Pause audio" : "Play audio"} title={isPlayingAudio ? "Pause audio" : "Play audio"}>
            {isPlayingAudio ? <PauseIcon className="h-5 w-5" /> : <SpeakerWaveIcon className="h-5 w-5" />}
          </button>
        )}

        {/* YouTube Button */}
        {youtubeUrl && onYoutubeClick && (
          <button onClick={(e) => { e.stopPropagation(); onYoutubeClick(); }} className={`${iconButtonBaseStyle} ${iconButtonDefaultState} hover:text-red-600 dark:hover:text-red-500`} aria-label="Watch on YouTube" title="Watch on YouTube">
            <VideoCameraIcon className="h-5 w-5" />
          </button>
        )}

        <a href="#" onClick={(e) => { e.stopPropagation(); console.log("More options clicked for item ID:", id); }} className={`${iconButtonBaseStyle} ${iconButtonDefaultState} hover:text-gray-700 dark:hover:text-gray-200`} aria-label="More options" title="More options">
          <EllipsisHorizontalIcon className="h-5 w-5" />
        </a>
      </div>
    </div>
  )
}